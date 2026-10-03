import type { EditorState } from './models';

export function imageSlots(html: string) {
  const slots: string[] = [];
  for (const key of ['then', 'now', 'couplePhoto', 'photo', 'logo']) {
    if (new RegExp(`\\b${key}\\s*:\\s*["']`).test(html)) slots.push(key);
  }
  return slots;
}

// This function is serialized into the invitation. Keep it self-contained.
function invitationRuntime(initial: EditorState, channel: string) {
  let state = initial;
  let lastFields = '';
  const style = document.createElement('style');
  style.id = 'invitation-colors';
  document.head.appendChild(style);
  const excluded = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CANVAS', 'IFRAME', 'INPUT', 'TEXTAREA', 'SELECT']);
  let observer: MutationObserver;
  function apply() {
    observer?.disconnect();
    style.textContent = `${state.primaryColor ? `h1,h2,h3,.xname,.ph1,.etitle{color:${state.primaryColor}!important}` : ''}${state.bgColor ? `body,.ibg,.bgblur,.scene{background-color:${state.bgColor}!important}` : ''}`;
    const fields: { id: string; text: string }[] = [];
    function walk(node: Node, path: string) {
      if (node.nodeType === 3) {
        const original = node.nodeValue ?? '';
        if (!original.trim()) return;
        const text = state.texts[path] ?? original;
        if (node.nodeValue !== text) node.nodeValue = text;
        fields.push({ id: path, text });
      } else if (node.nodeType === 1) {
        const el = node as Element;
        if (excluded.has(el.tagName) || el.id === 'invitation-audio') return;
        Array.from(node.childNodes).forEach((child, index) => walk(child, `${path}.${index}`));
      }
    }
    walk(document.body, 'body');
    const serialized = JSON.stringify(fields);
    if (channel && serialized !== lastFields) {
      lastFields = serialized;
      parent.postMessage({ type: 'invitation-fields', channel, fields }, '*');
    }
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function start() {
    observer = new MutationObserver(apply);
    apply();
    if (state.musicUrl) {
      const audio = new Audio(state.musicUrl);
      audio.loop = true;
      const button = document.createElement('button');
      button.id = 'invitation-audio';
      button.textContent = 'Play music';
      button.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:2147483647;padding:10px;border-radius:20px;background:#fff;color:#222';
      button.addEventListener('click', async () => {
        if (audio.paused) {
          try { await audio.play(); button.textContent = 'Pause music'; }
          catch { button.textContent = 'Try playing music again'; }
        } else { audio.pause(); button.textContent = 'Play music'; }
      });
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
  let html = source;
  for (const key of imageSlots(source)) {
    const image = state.images[key];
    if (!image) continue;
    html = html.replace(new RegExp(`(\\b${key}\\s*:\\s*)(["'])(.*?)\\2`, 's'), (_match, prefix: string) => `${prefix}${JSON.stringify(image)}`);
  }
  const serialized = JSON.stringify(state).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const script = `<script>(${invitationRuntime.toString()})(${serialized},${JSON.stringify(channel)});</script>`;
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, () => `${script}</body>`) : html + script;
}
