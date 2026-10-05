"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { api, jsonBody, errorMessage } from '@/lib/client-api';
import { emptyEditor, type EditorState, type Order, type Template } from '@/lib/models';
import { portraitSlots, renderInvitation, type TextField } from '@/lib/invitation';
import styles from '../admin.module.css';

import { templateFields, templateFieldError } from '@/lib/template-fields';
import { readMediaFile } from '@/lib/editor-media';
import { analyzeTemplate } from '@/lib/template-analyzer';

export default function CustomizeTemplate() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [template, setTemplate] = useState('');
  const [source, setSource] = useState('');
  const [state, setState] = useState<EditorState>(emptyEditor);
  const [fields, setFields] = useState<TextField[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tab, setTab] = useState('details');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [unsaved, setUnsaved] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState('all');
  const [lastSaved, setLastSaved] = useState('');
  const [previewRevision, setPreviewRevision] = useState(0);
  const [canvasTextDetected, setCanvasTextDetected] = useState(false);
  const saveInFlight = useRef(false);
  const [link, setLink] = useState('');
  const iframe = useRef<HTMLIFrameElement>(null);
  const orderId = useRef('');
  const channel = useRef('');
  const latest = useRef(state);
  const dirty = useRef(false);
  const requestId = useRef(0);
  const contentFields = useMemo(() => templateFields(source).filter(f => f.kind !== 'image'), [source]);
  const photos = useMemo(() => portraitSlots(source), [source]);
  const compatibility = useMemo(() => source ? analyzeTemplate(source) : null, [source]);
  const canvasIssue = Boolean(compatibility?.items.find(i => i.key === 'canvas' && i.status === 'fail') || canvasTextDetected);
  const imageTextIssue = Boolean(compatibility?.items.find(i => i.key === 'embeddedText' && i.status === 'warn'));
  const sectionOptions = Array.from(new Map(fields.map(f => [f.sectionOrder, f.section])).entries()).sort((a, b) => a[0] - b[0]);
  const visibleFields = fields.filter(f => (section === 'all' || String(f.sectionOrder) === section) && `${f.text} ${f.label} ${f.original}`.toLowerCase().includes(search.toLowerCase()));
  function markDirty() { dirty.current = true; setUnsaved(true); }
  useEffect(() => { latest.current = state; }, [state]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await api<Template[]>('/api/admin/templates');
        const id = new URLSearchParams(window.location.search).get('order');
        const order = id ? await api<Order>(`/api/admin/orders?id=${encodeURIComponent(id)}`) : undefined;
        const filename = order?.template_filename || list[0]?.filename;
        if (!filename) throw new Error('Add a template before creating an invitation.');
        const html = order?.source_html || (await api<{ html: string }>(`/api/admin/template-source?filename=${encodeURIComponent(filename)}`)).html;
        if (cancelled) return;
        orderId.current = order?.id || crypto.randomUUID();
        setTemplates(order?.template_filename && !list.some(t => t.filename === order.template_filename) ? [...list, { id: -1, filename: order.template_filename, title: order.template_name + ' (archived template)', category: '', badge: '', enabled: false }] : list);
        setTemplate(filename);
        setName(order?.client_name || ''); setEmail(order?.email || '');
        setState(order?.editor_state || emptyEditor());
        setSource(html);
        if (order?.published_file) { setLastSaved('Previously saved'); }
        if (order?.published_file) setLink(`${window.location.origin}/invite/${order.id}`);
        if (order && !order.source_html && order.status !== 'New Inquiry') setMessage('This older order has no editable source. Choose a template and save a new version to enable future editing.');
      } catch (error) { if (!cancelled) setMessage(errorMessage(error)); }
      finally { if (!cancelled) setLoading(false); }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  // Rebuild only when source/media changes. Text and color edits use the message bridge.
  useEffect(() => {
    if (!source) return;
    const timer = setTimeout(() => {
      channel.current = crypto.randomUUID();
      setPreviewReady(false);
      if (iframe.current) iframe.current.srcdoc = renderInvitation(source, latest.current, channel.current);
    }, 250);
    return () => clearTimeout(timer);
  }, [source, state.images, state.musicUrl, state.config, previewRevision]);

  useEffect(() => {
    iframe.current?.contentWindow?.postMessage({ type: 'invitation-update', channel: channel.current, state }, '*');
  }, [state]);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.source !== iframe.current?.contentWindow || event.data?.channel !== channel.current || event.data.type !== 'invitation-fields') return;
      if (Array.isArray(event.data.fields)) {
        setFields(event.data.fields.filter((f: TextField) => typeof f.id === 'string' && typeof f.text === 'string' && typeof f.section === 'string' && typeof f.sectionOrder === 'number'));
        setPreviewReady(true);
      }
      if (event.data?.hasCanvasText) setCanvasTextDetected(true);
    }
    function beforeUnload(event: BeforeUnloadEvent) { if (dirty.current) event.preventDefault(); }
    function leave(event: MouseEvent) {
      const anchor = (event.target as Element)?.closest?.('a');
      if (!dirty.current || !anchor || anchor.target === '_blank' || anchor.getAttribute('href')?.startsWith('#')) return;
      if (!confirm('You have unsaved changes. Leave without saving?')) { event.preventDefault(); event.stopPropagation(); }
    }
    document.addEventListener('click', leave, true);
    window.addEventListener('message', receive);
    window.addEventListener('beforeunload', beforeUnload);
    return () => { document.removeEventListener('click', leave, true); window.removeEventListener('message', receive); window.removeEventListener('beforeunload', beforeUnload); };
  }, []);

  function update(patch: Partial<EditorState>) { markDirty(); const next = { ...latest.current, ...patch }; latest.current = next; setState(next); }
  async function selectTemplate(filename: string) {
    if (dirty.current && !confirm('Switch templates and discard unsaved customization?')) return;
    const current = ++requestId.current;
    setLoading(true); setMessage('');
    try {
      const { html } = await api<{ html: string }>(`/api/admin/template-source?filename=${encodeURIComponent(filename)}`);
      if (requestId.current !== current) return;
      setFields([]); setSection('all'); setSearch(''); setPreviewReady(false); setCanvasTextDetected(false); setTemplate(filename); setState(emptyEditor()); setSource(html); markDirty();
    } catch (error) { setMessage(errorMessage(error)); }
    finally { if (current === requestId.current) setLoading(false); }
  }
  async function upload(file: File | undefined, slot?: string) {
    if (!file || mediaBusy) return;
    setMediaBusy(true); setMessage('');
    const templateRequest = requestId.current;
    try {
      const value = await readMediaFile(file, slot ? 'image' : 'audio');
      if (templateRequest !== requestId.current) return;
      if (slot) update({ images: { ...latest.current.images, [slot]: value } });
      else update({ musicUrl: value, musicName: file.name });
      setMessage(`${file.name} is ready in the preview. Save your changes to update the invitation link.`);
    } catch (error) { setMessage(errorMessage(error)); }
    finally { setMediaBusy(false); }
  }
  async function save(send: boolean) {
    if (saveInFlight.current || mediaBusy || loading) return;
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage('Enter a client name and valid email before saving.'); return; }
    const invalid = templateFieldError(source, state.config);
    if (invalid) { setMessage(invalid); setTab('details'); return; }
    saveInFlight.current = true; setBusy(true); setMessage('');
    try {
      const result = await api<{ id: string; inviteUrl: string }>('/api/admin/orders', jsonBody({ id: orderId.current, client_name: name, email, template_filename: template, editor_state: state }));
      setLink(`${window.location.origin}${result.inviteUrl}`);
      dirty.current = false; setUnsaved(false); setLastSaved(`Saved at ${new Date().toLocaleTimeString()}`);
      window.history.replaceState(null, '', `/admin/customize?order=${result.id}`);
      if (send) {
        await api('/api/send-email', jsonBody({ orderId: result.id }));
        setMessage('Invitation saved. Email accepted for delivery.');
      } else setMessage('Draft saved. You can reopen it from Orders.');
    } catch (error) { setMessage(errorMessage(error)); }
    finally { saveInFlight.current = false; setBusy(false); }
  }
  const disabled = busy || loading || mediaBusy;
  const groups = Array.from(new Set(contentFields.map(f => f.group)));
  const plain = (value: string | number) => String(value).replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]+>/g, '');
  return <div>
    <div className={styles.pageHeader}><div><h2>Invitation Customizer</h2><p>1. Event details → 2. Page text → 3. Photos & music → 4. Save & review</p>
      <span className={styles.saveStatus} role="status">{busy ? 'Saving…' : mediaBusy ? 'Reading your file…' : unsaved ? '● Unsaved changes' : lastSaved || 'New invitation — not saved yet'}</span>
    </div>
      <div className={styles.editorActions}>
        <button className={styles.btnSecondary} disabled={disabled || !source || !previewReady} onClick={() => save(false)}>{busy ? 'Saving…' : 'Save changes'}</button>
        <button className={styles.btnPrimary} disabled={disabled || !source || !previewReady} onClick={() => save(true)}>Save & send email</button>
      </div>
    </div>
    {message && <div role="status" className={styles.editorMessage}>{message}{/sign in/i.test(message) && <p><a href="/admin/login" target="_blank" rel="noopener noreferrer">Sign in in a new tab ↗</a>, then return here and save again. Your unsaved edits stay on this page.</p>}</div>}
    {link && <div className={styles.editorMessage}><a href={link} target="_blank" rel="noopener noreferrer">Open saved invitation ↗</a> <button className={styles.btnSecondary} onClick={() => navigator.clipboard.writeText(link).then(() => setMessage('Link copied.')).catch(() => setMessage(`Copy this link: ${link}`))}>Copy link</button>{unsaved && <p>The saved link still shows the previous version. Save changes to update it.</p>}</div>}
    <div className={styles.editorGrid}>
      <fieldset disabled={disabled} className={`${styles.card} ${styles.editorForm}`}>
        <div className={styles.clientFields}>
          <label>Client name<input autoComplete="name" value={name} onChange={e => { setName(e.target.value); markDirty(); }} /></label>
          <label>Client email<input type="email" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); markDirty(); }} /></label>
        </div>
        <label>Invitation template<select value={template} onChange={e => selectTemplate(e.target.value)}>{templates.map(t => <option key={t.id} value={t.filename}>{t.title}</option>)}</select></label>
        <div className={styles.editorTabs} role="tablist" aria-label="Customization steps">{[['details', 'Event details'], ['text', 'Page text'], ['media', 'Photos & music'], ['colors', 'Colors']].map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} aria-controls={`editor-${id}`} id={`tab-${id}`} className={tab === id ? styles.btnPrimary : styles.btnSecondary} onClick={() => setTab(id)}>{label}</button>)}</div>
        <div id={`editor-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className={styles.editorFields}>
        {loading ? <p>Loading invitation…</p> : tab === 'details' ? <>
          <p className={styles.editorHelp}>Start here. These values update the template’s names, dates, countdowns and contact links together. The preview restarts when a detail changes.</p>
          {Object.keys(state.texts).length > 0 && <p className={styles.editorHelp}>You also have page-specific text edits. Those take priority over shared details. Review Page text after changing names or dates.</p>}
          {!contentFields.length && <p>This uploaded template has no supported shared details. Use Page text to edit its visible content.</p>}
          {groups.map(group => <details key={group} className={styles.editorSection} open={group === 'Opening & event details'}><summary>{group}</summary>
            {contentFields.filter(f => f.group === group).map(f => <label key={f.id}>{f.label}
              <input type={f.kind === 'number' ? 'number' : f.kind === 'url' ? 'url' : 'text'} value={state.config?.[f.id] ?? plain(f.value)} onChange={e => update({ config: { ...latest.current.config, [f.id]: f.kind === 'number' ? Number(e.target.value) : e.target.value } })} />
              {f.kind === 'date' && <small>Use YYYY-MM-DDTHH:mm:ss+05:30, including the timezone.</small>}
              {f.kind === 'url' && <small>Changing this updates the destination, not just the button label.</small>}
            </label>)}
          </details>)}
        </> : tab === 'text' ? <>
          {canvasIssue && (
            <div style={{
              margin: "0 0 16px 0",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(234, 179, 8, 0.08)",
              border: "1px solid rgba(234, 179, 8, 0.25)",
              color: "#fde047",
              fontSize: "12px",
              lineHeight: "1.45"
            }}>
              <strong style={{ display: "block", color: "#fef08a", marginBottom: "2px" }}>
                ⚠️ Artwork / Canvas Text Detected
              </strong>
              Some text in this template is rendered directly inside canvas artwork. That text cannot be edited in these DOM text fields — it remains fixed artwork. To change event names and dates, update the <em>Event details</em> tab.
            </div>
          )}
          {imageTextIssue && (
            <div style={{
              margin: "0 0 16px 0",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              color: "#93c5fd",
              fontSize: "12px",
              lineHeight: "1.45"
            }}>
              <strong style={{ display: "block", color: "#bfdbfe", marginBottom: "2px" }}>
                ℹ️ Graphic Artwork Notice
              </strong>
              This template includes embedded artwork graphics. Words baked into graphic images cannot be edited via text fields.
            </div>
          )}
          <p className={styles.editorHelp}>Sections follow the invitation from the opening door to the closing message. These edits change the wording on one page; edit dates, names and link destinations in Event details first.</p>
          <label>Find text<input type="search" placeholder="Search names, headings or a sentence…" value={search} onChange={e => setSearch(e.target.value)} /></label>
          <label>Invitation section<select value={section} onChange={e => setSection(e.target.value)}><option value="all">All sections, in page order</option>{sectionOptions.map(([order, title]) => <option key={order} value={order}>{order === 0 ? 'Opening' : `Section ${order}`} · {title}</option>)}</select></label>
          {!previewReady && <p role="status">Preparing the preview and its text fields…</p>}
          {previewReady && !visibleFields.length && <p>No matching editable text. Try another section or clear your search.</p>}
          {sectionOptions.map(([order, title]) => {
            const items = visibleFields.filter(f => f.sectionOrder === order);
            if (!items.length) return null;
            return <details key={order} className={styles.editorSection} open={order === 0 || section !== 'all'}><summary>{order === 0 ? 'Opening' : `Section ${order}`} · {title} <small>({items.length} fields)</small></summary>
              {items.map((f, index) => <label key={f.id}>{f.label} {index + 1}<small className={styles.originalText}>Original: {f.original.trim().slice(0, 180)}</small><textarea value={state.texts[f.id] ?? f.text} onChange={e => update({ texts: { ...latest.current.texts, [f.id]: e.target.value } })} /></label>)}
            </details>;
          })}
          {Object.keys(state.texts).length > 0 && <button className={styles.btnSecondary} onClick={() => { if (confirm('Remove all page-specific text edits? Event details and media will stay.')) { update({ texts: {} }); setPreviewRevision(v => v + 1); } }}>Restore page text from event details</button>}
        </> : tab === 'colors' ? <>
          <p className={styles.editorHelp}>Colors apply to HTML headings and backgrounds. Artwork drawn inside a canvas keeps its original colors.</p>
          <label>Accent color<input type="color" value={state.primaryColor || '#c49a4c'} onChange={e => update({ primaryColor: e.target.value })} /></label>
          <label>Background color<input type="color" value={state.bgColor || '#f6f3ea'} onChange={e => update({ bgColor: e.target.value })} /></label>
          <button className={styles.btnSecondary} onClick={() => update({ primaryColor: '', bgColor: '' })}>Restore template colors</button>
        </> : <>
          <h3>Portraits & photos</h3><p className={styles.editorHelp}>Choose the person or gallery position below. Use a clear portrait with the face near the centre. PNG, JPEG, WebP or GIF, up to 5 MB each.</p>
          {!photos.length && <p>This template has no portrait slots. Choose a portrait-enabled template to add people’s photos.</p>}
          {photos.map(slot => {
            const legacy = slot.id.split('.').at(-1)!;
            const value = state.images[slot.id] || (photos.find(p => p.id.endsWith(`.${legacy}`))?.id === slot.id ? state.images[legacy] : '') || String(slot.value);
            return <div key={slot.id} className={styles.mediaSlot}><label>{slot.label}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => { void upload(e.target.files?.[0], slot.id); e.target.value = ''; }} /></label>
              {value && <img src={value} alt={`${slot.label} preview`} className={styles.portraitPreview} />}
              {(state.images[slot.id] || state.images[legacy]) && <button className={styles.btnSecondary} onClick={() => { const images = { ...latest.current.images }; delete images[slot.id]; delete images[legacy]; update({ images }); }}>Restore original photo</button>}
            </div>;
          })}
          <h3>Background music</h3><p className={styles.editorHelp}>Upload an MP3, WAV or another browser-supported audio file, up to 10 MB. Your track replaces the template’s original sound. Guests press Play music to begin.</p>
          <label>Choose music<input type="file" accept="audio/*" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} /></label>
          {state.musicUrl && <div className={styles.mediaSlot}><p>{state.musicName || 'Custom music uploaded'}</p><audio controls preload="metadata" src={state.musicUrl} /><button className={styles.btnSecondary} onClick={() => update({ musicUrl: '', musicName: '' })}>Remove custom music</button></div>}
        </>}
        </div>
      </fieldset>
      <aside className={styles.previewPanel}><h3>Live preview</h3><p className={styles.editorHelp}>Tap the door or seal, then follow the invitation to its last page. This preview includes unsaved edits.</p><button disabled={disabled} className={styles.btnSecondary} onClick={() => setPreviewRevision(v => v + 1)}>Restart from opening</button>
        <iframe ref={iframe} title="Invitation preview" sandbox="allow-scripts allow-forms allow-popups allow-modals" className={styles.editorPreview} onLoad={() => iframe.current?.contentWindow?.postMessage({ type: 'invitation-update', channel: channel.current, state: latest.current }, '*')} />
      </aside>
    </div>
  </div>;
}
