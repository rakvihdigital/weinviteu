import type { EditorState } from './models';

import { templateFields, replaceTemplateFields } from './template-fields';
export interface TextField { id: string; text: string; section: string; sectionOrder: number; label: string; original: string }
export function portraitSlots(html: string) { return templateFields(html).filter(field => field.kind === 'image'); }
export function imageSlots(html: string) { return portraitSlots(html).map(field => field.id.split('.').at(-1)!); }

// This function is serialized into the invitation. Keep it self-contained.
function invitationRuntime(initial: EditorState, channel: string) {
  let state = initial;
  let lastFields = '';
  const style = document.createElement('style');
  style.id = 'invitation-colors';
  document.head.appendChild(style);
  const excluded = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CANVAS', 'IFRAME', 'INPUT', 'TEXTAREA', 'SELECT', 'NAV', 'OPTION', 'OUTPUT']);
  const originals = new WeakMap<Node, string>();
  const originalSections = new WeakMap<Element, string>();
  const skipSelector = '.ctrl,.langw,.dots,.cue,.pageno,.countdown,.count,.flip,.cd,.timer,#invitation-audio,#dots,#langMenu,#langBtn,#replay,#snd,#song,#done,#pnow,#gc,#gCount,#gh,#ppl,#boyCount,#girlCount,#gm,#gp,button[data-d]';
  let observer: MutationObserver;
  function apply() {
    observer?.disconnect();
    style.textContent = `${state.primaryColor ? `h1,h2,h3,.xname,.ph1,.etitle{color:${state.primaryColor}!important}` : ''}${state.bgColor ? `body,.ibg,.bgblur,.scene{background-color:${state.bgColor}!important}` : ''}`;
    const fields: TextField[] = [];

    // Robust multi-tier section discovery for arbitrary templates
    let sections = Array.from(document.querySelectorAll('.pg, .pgu, section.sec, .invite-page, .page-section'));
    let activeSelector = '.pg, .pgu, section.sec, .invite-page, .page-section';
    if (sections.length === 0) {
      const semantic = Array.from(document.querySelectorAll('section, article, [data-section], [data-page]'));
      if (semantic.length > 0) {
        sections = semantic;
        activeSelector = 'section, article, [data-section], [data-page]';
      }
    }
    if (sections.length === 0) {
      const classBased = Array.from(document.querySelectorAll('.page, .slide, .card, .screen, .view, .panel-page'));
      const substantial = classBased.filter(el => (el.textContent || '').trim().length > 5);
      if (substantial.length > 0) {
        sections = substantial;
        activeSelector = '.page, .slide, .card, .screen, .view, .panel-page';
      }
    }

    function sectionOf(el: Element) {
      const section = el.closest(activeSelector);
      if (section && sections.includes(section)) {
        if (!originalSections.has(section)) {
          const pageIndex = sections.indexOf(section);
          const navigationLabel = document.querySelectorAll('#dots button, nav a, .nav-dots button')[pageIndex]?.getAttribute('aria-label');
          const title = section.getAttribute('data-section-title') ||
            section.getAttribute('data-title') ||
            section.getAttribute('aria-label') ||
            navigationLabel ||
            section.querySelector('h1,h2,h3,h4,.ph1,.xname,.title,.heading,.section-title,.eyebrow,.lbl,.names,.big')?.textContent?.trim() ||
            `Page ${pageIndex + 1}`;
          originalSections.set(section, title.replace(/\s+/g, ' ').slice(0, 90));
        }
        return { section: originalSections.get(section)!, sectionOrder: sections.indexOf(section) + 1 };
      }

      // Check if el is before or after detected sections
      if (sections.length > 0) {
        const first = sections[0];
        if (first.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING) {
          return { section: 'Opening / door', sectionOrder: 0 };
        }
        const last = sections[sections.length - 1];
        if (last.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
          return { section: 'Closing / Footer', sectionOrder: sections.length + 1 };
        }
      }

      // For templates with no section elements at all (flat HTML structure): group by nearest preceding heading
      let cur: Element | null = el;
      let headingText = '';
      while (cur && cur !== document.body) {
        let p = cur.previousElementSibling;
        while (p) {
          if (/^H[1-4]$/i.test(p.tagName) || p.querySelector('h1,h2,h3,h4')) {
            const h = /^H[1-4]$/i.test(p.tagName) ? p : p.querySelector('h1,h2,h3,h4');
            headingText = (h?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90);
            break;
          }
          p = p.previousElementSibling;
        }
        if (headingText) break;
        cur = cur.parentElement;
      }
      if (headingText) {
        return { section: headingText, sectionOrder: 1 };
      }

      return { section: 'Opening / door', sectionOrder: 0 };
    }

    function walk(node: Node, path: string) {
      if (node.nodeType === 3) {
        const current = node.nodeValue ?? '';
        if (!originals.has(node)) originals.set(node, current);
        const original = originals.get(node)!;
        if (!original.trim() && state.texts[path] === undefined) return;
        const text = state.texts[path] ?? current;
        if (node.nodeValue !== text) node.nodeValue = text;
        const el = node.parentElement!;
        const heading = el.closest('h1,h2,h3,h4,.ph1,.xname,.etitle');
        const label = heading ? 'Heading' : el.closest('a') ? 'Link label' : el.closest('button') ? 'Button label' : el.closest('label') ? 'Form label' : 'Text';
        fields.push({ id: path, text, original, label, ...sectionOf(el) });
      } else if (node.nodeType === 1) {
        const el = node as Element;
        if (excluded.has(el.tagName) || el.matches(skipSelector)) return;
        Array.from(node.childNodes).forEach((child, index) => walk(child, `${path}.${index}`));
      }
    }
    walk(document.body, 'body');

    const hasCanvas = document.querySelector('canvas') !== null;
    let hasCanvasText = false;
    try {
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.textContent || '').join(' ');
      hasCanvasText = /\.fillText\s*\(|\.strokeText\s*\(/i.test(scripts);
    } catch {}

    const serialized = JSON.stringify(fields);
    if (channel && serialized !== lastFields) {
      lastFields = serialized;
      parent.postMessage({ type: 'invitation-fields', channel, fields, hasCanvas, hasCanvasText }, '*');
    }
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function start() {
    observer = new MutationObserver(apply);
    apply();
    if (state.musicUrl) {
      // Mute the template's original effects so the uploaded track cannot overlap them.
      const sound = document.getElementById('snd');
      if (sound?.classList.contains('on') || sound?.getAttribute('aria-pressed') === 'true') sound.click();
      if (sound) sound.style.display = 'none';
      const audio = new Audio(state.musicUrl);
      audio.volume = 0.65;
      audio.loop = true;
      const button = document.createElement('button');
      button.id = 'invitation-audio';
      button.textContent = 'Play music';
      button.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:2147483647;padding:10px;border-radius:20px;background:#fff;color:#222';
      button.setAttribute('aria-pressed', 'false');
      const toggle = async () => {
        if (audio.paused) {
          try { await audio.play(); button.textContent = 'Pause music'; button.setAttribute('aria-pressed', 'true'); }
          catch { button.textContent = 'Try playing music again'; }
        } else { audio.pause(); button.textContent = 'Play music'; button.setAttribute('aria-pressed', 'false'); }
      };
      button.addEventListener('click', toggle);
      document.addEventListener('click', event => {
        if ((event.target as Element)?.closest?.('#song')) { event.preventDefault(); event.stopImmediatePropagation(); void toggle(); }
      }, true);
      audio.addEventListener('error', () => { button.textContent = 'Music unavailable'; button.setAttribute('aria-pressed', 'false'); });
      document.addEventListener('visibilitychange', () => { if (document.hidden) { audio.pause(); button.textContent = 'Play music'; button.setAttribute('aria-pressed', 'false'); } });
      document.body.appendChild(button);
    }
    if (channel) window.addEventListener('message', event => {
      if (event.source !== parent || event.data?.type !== 'invitation-update' || event.data.channel !== channel) return;
      state = event.data.state;
      apply();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}

export function renderInvitation(source: string, state: EditorState, channel = '') {
  const values = { ...state.config };
  for (const field of portraitSlots(source)) {
    // Old drafts used short keys; keep their first matching slot working.
    const legacy = field.id.split('.').at(-1)!;
    const first = portraitSlots(source).find(slot => slot.id.endsWith(`.${legacy}`));
    const image = state.images[field.id] || (first?.id === field.id ? state.images[legacy] : undefined);
    if (image) values[field.id] = image;
  }
  let html = replaceTemplateFields(source, values);
  // Template browser titles often repeat the original names outside their config.
  const escapeTitle = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/(<title\b[^>]*>)([\s\S]*?)(<\/title>)/i, (_, start, title: string, end) => {
    for (const field of templateFields(source)) {
      const replacement = values[field.id];
      if (typeof field.value === 'string' && field.value.length > 1 && typeof replacement === 'string' && field.kind === 'text') {
        title = title.split(escapeTitle(field.value)).join(escapeTitle(replacement));
      }
    }
    return start + title + end;
  });
  const serialized = JSON.stringify(state).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const script = `<script>(${invitationRuntime.toString()})(${serialized},${JSON.stringify(channel)});</script>`;
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, () => `${script}</body>`) : html + script;
}
