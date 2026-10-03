"use client";
import { useEffect, useRef, useState } from 'react';
import { api, jsonBody, errorMessage } from '@/lib/client-api';
import { emptyEditor, type EditorState, type Order, type Template } from '@/lib/models';
import { imageSlots, renderInvitation } from '@/lib/invitation';
import styles from '../admin.module.css';

type TextField = { id: string; text: string };
export default function CustomizeTemplate() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [template, setTemplate] = useState('');
  const [source, setSource] = useState('');
  const [state, setState] = useState<EditorState>(emptyEditor);
  const [fields, setFields] = useState<TextField[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tab, setTab] = useState('text');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const iframe = useRef<HTMLIFrameElement>(null);
  const orderId = useRef('');
  const channel = useRef('');
  const latest = useRef(state);
  const dirty = useRef(false);
  const requestId = useRef(0);
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
    channel.current = crypto.randomUUID();
    if (iframe.current) iframe.current.srcdoc = renderInvitation(source, latest.current, channel.current);
  }, [source, state.images, state.musicUrl]);

  useEffect(() => {
    iframe.current?.contentWindow?.postMessage({ type: 'invitation-update', channel: channel.current, state }, '*');
  }, [state]);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.source !== iframe.current?.contentWindow || event.data?.channel !== channel.current || event.data.type !== 'invitation-fields') return;
      if (Array.isArray(event.data.fields)) setFields(event.data.fields.filter((f: TextField) => typeof f.id === 'string' && typeof f.text === 'string'));
    }
    function beforeUnload(event: BeforeUnloadEvent) { if (dirty.current) event.preventDefault(); }
    window.addEventListener('message', receive);
    window.addEventListener('beforeunload', beforeUnload);
    return () => { window.removeEventListener('message', receive); window.removeEventListener('beforeunload', beforeUnload); };
  }, []);

  function update(patch: Partial<EditorState>) { dirty.current = true; setState(previous => ({ ...previous, ...patch })); }
  async function selectTemplate(filename: string) {
    if (dirty.current && !confirm('Switch templates and discard unsaved customization?')) return;
    const current = ++requestId.current;
    setLoading(true); setMessage('');
    try {
      const { html } = await api<{ html: string }>(`/api/admin/template-source?filename=${encodeURIComponent(filename)}`);
      if (requestId.current !== current) return;
      setFields([]); setTemplate(filename); setState(emptyEditor()); setSource(html); dirty.current = true;
    } catch (error) { setMessage(errorMessage(error)); }
    finally { if (current === requestId.current) setLoading(false); }
  }
  async function upload(file: File | undefined, slot?: string) {
    if (!file) return;
    const limit = slot ? 5 : 10;
    if (file.size > limit * 1024 * 1024 || !(slot ? /^image\/(png|jpeg|webp|gif)$/ : /^audio\//).test(file.type)) {
      setMessage(`Choose ${slot ? 'a PNG, JPEG, WebP or GIF' : 'an audio file'} under ${limit} MB.`); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result);
      if (slot) update({ images: { ...latest.current.images, [slot]: value } });
      else update({ musicUrl: value });
    };
    reader.onerror = () => setMessage('Could not read this file. Please retry.');
    reader.readAsDataURL(file);
  }
  async function save(send: boolean) {
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage('Enter a client name and valid email before saving.'); return; }
    setBusy(true); setMessage('');
    try {
      const result = await api<{ id: string; inviteUrl: string }>('/api/admin/orders', jsonBody({ id: orderId.current, client_name: name, email, template_filename: template, editor_state: state }));
      setLink(`${window.location.origin}${result.inviteUrl}`);
      dirty.current = false;
      window.history.replaceState(null, '', `/admin/customize?order=${result.id}`);
      if (send) {
        await api('/api/send-email', jsonBody({ orderId: result.id }));
        setMessage('Invitation saved. Email accepted for delivery.');
      } else setMessage('Draft saved. You can reopen it from Orders.');
    } catch (error) { setMessage(errorMessage(error)); }
    finally { setBusy(false); }
  }
  return <div>
    <div className={styles.pageHeader}><div><h2>Invitation Customizer</h2><p>Edit, preview and save an invitation for your client.</p></div>
      <div className={styles.editorActions}>
        <button className={styles.btnSecondary} disabled={busy || loading || !source} onClick={() => save(false)}>{busy ? 'Saving…' : 'Save Draft'}</button>
        <button className={styles.btnPrimary} disabled={busy || loading || !source} onClick={() => save(true)}>Save & Send Email</button>
      </div>
    </div>
    {message && <p role="status" className={styles.editorMessage}>{message}</p>}
    {link && <p className={styles.editorMessage}>Invitation: <a href={link} target="_blank" rel="noopener noreferrer">View saved version</a> <button className={styles.btnSecondary} onClick={() => navigator.clipboard.writeText(link).then(() => setMessage('Link copied.')).catch(() => setMessage(`Copy this link: ${link}`))}>Copy Link</button></p>}
    <div className={styles.editorGrid}>
      <fieldset disabled={busy || loading} className={`${styles.card} ${styles.editorForm}`}>
        <label>Client name<input value={name} onChange={e => { setName(e.target.value); dirty.current = true; }} /></label>
        <label>Client email<input type="email" value={email} onChange={e => { setEmail(e.target.value); dirty.current = true; }} /></label>
        <label>Template<select value={template} onChange={e => selectTemplate(e.target.value)}>{templates.map(t => <option key={t.id} value={t.filename}>{t.title}</option>)}</select></label>
        <div className={styles.editorActions}>{['text', 'colors', 'media'].map(t => <button key={t} className={tab === t ? styles.btnPrimary : styles.btnSecondary} onClick={() => setTab(t)}>{t}</button>)}</div>
        {loading ? <p>Loading invitation…</p> : tab === 'text' ? <div className={styles.editorFields}>
          {!fields.length && <p>Waiting for template content. If this persists, select another template or check the template file.</p>}
          {fields.map((field, index) => <label key={field.id}>Text {index + 1}<textarea value={state.texts[field.id] ?? field.text} onChange={e => update({ texts: { ...state.texts, [field.id]: e.target.value } })} /></label>)}
        </div> : tab === 'colors' ? <div>
          <p>Colors apply to HTML headings and backgrounds. Artwork drawn inside a canvas keeps its original colors.</p>
          <label>Accent color<input type="color" value={state.primaryColor || '#c49a4c'} onChange={e => update({ primaryColor: e.target.value })} /></label>
          <label>Background color<input type="color" value={state.bgColor || '#f6f3ea'} onChange={e => update({ bgColor: e.target.value })} /></label>
          <button className={styles.btnSecondary} onClick={() => update({ primaryColor: '', bgColor: '' })}>Restore template colors</button>
        </div> : <div>
          {imageSlots(source).length === 0 && <p>This template has no recognized photo slots.</p>}
          {imageSlots(source).map(slot => <label key={slot}>{slot}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => upload(e.target.files?.[0], slot)} />{state.images[slot] && <><img src={state.images[slot]} alt={`${slot} preview`} width={80} /><button className={styles.btnSecondary} onClick={() => { const images = { ...state.images }; delete images[slot]; update({ images }); }}>Remove photo</button></>}</label>)}
          <label>Background music<input type="file" accept="audio/*" onChange={e => upload(e.target.files?.[0])} /></label>
          {state.musicUrl && <><audio controls src={state.musicUrl} /><button className={styles.btnSecondary} onClick={() => update({ musicUrl: '' })}>Remove music</button></>}
          <p>Guests can start your music with the invitation’s Play music button.</p>
        </div>}
      </fieldset>
      <div><h3>Live Preview</h3><iframe ref={iframe} title="Invitation preview" sandbox="allow-scripts allow-forms allow-popups allow-modals" className={styles.editorPreview} onLoad={() => iframe.current?.contentWindow?.postMessage({ type: 'invitation-update', channel: channel.current, state: latest.current }, '*')} /></div>
    </div>
  </div>;
}
