// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderInvitation, imageSlots } from '../src/lib/invitation';
import { emptyEditor } from '../src/lib/models';

function open(source: string, state = emptyEditor()) {
  return new JSDOM(renderInvitation(source, state), { runScripts: 'dangerously', url: 'https://invite.test' });
}
const ready = () => new Promise(resolve => setTimeout(resolve, 20));

describe('invitation persistence', () => {
  it('reapplies text after scripts rebuild content, including after reopening', async () => {
    const source = '<html><head></head><body><div id="content"></div><script>document.getElementById("content").innerHTML="<h1>Original</h1>";</script></body></html>';
    const state = { ...emptyEditor(), texts: { 'body.0.0.0': 'Our wedding <3 $& </script>' } };
    const dom = open(source, state); await ready();
    expect(dom.window.document.querySelector('h1')?.textContent).toBe('Our wedding <3 $& </script>');
    dom.window.document.querySelector('#content')!.innerHTML = '<h1>Original</h1>';
    await ready();
    expect(dom.window.document.querySelector('h1')?.textContent).toBe('Our wedding <3 $& </script>');
    const reopened = open(source, state); await ready();
    expect(reopened.window.document.querySelector('h1')?.textContent).toBe('Our wedding <3 $& </script>');
    dom.window.close(); reopened.window.close();
  });
  it('keeps text and styles when a photo rebuilds the preview', async () => {
    const source = '<html><head></head><body><h1>Name</h1><script>const CFG={couplePhoto:"old.jpg"};window.photo=CFG.couplePhoto;</script></body></html>';
    const state = { ...emptyEditor(), texts: { 'body.0.0': 'New name' }, primaryColor: '#112233', bgColor: '#445566', images: { couplePhoto: 'data:image/png;base64,YQ==' } };
    expect(imageSlots(source)).toEqual(['couplePhoto']);
    const dom = open(source, state); await ready();
    expect(dom.window.document.querySelector('h1')?.textContent).toBe('New name');
    expect(dom.window.document.getElementById('invitation-colors')?.textContent).toContain('#445566');
    expect((dom.window as unknown as { photo: string }).photo).toBe(state.images.couplePhoto);
    dom.window.close();
  });
  it('stores music and renders a guest-controlled playback button', async () => {
    const dom = open('<body><h1>Invite</h1></body>', { ...emptyEditor(), musicUrl: 'data:audio/mpeg;base64,YQ==' });
    await ready();
    expect(dom.window.document.getElementById('invitation-audio')?.textContent).toBe('Play music');
    dom.window.close();
  });
  it('never executes edited text as HTML', async () => {
    const dom = open('<body><h1>Name</h1></body>', { ...emptyEditor(), texts: { 'body.0.0': '<img src=x onerror="window.hacked=1">' } });
    await ready();
    expect(dom.window.document.querySelector('img')).toBeNull();
    expect(dom.window.document.querySelector('h1')?.textContent).toContain('<img');
    dom.window.close();
  });
});

it('groups text in page order and excludes decorative panels and live counters', async () => {
  const source = '<body><div class="panel"></div><button>Open</button><section class="pg"><div class="lbl">Welcome</div><output>2</output><div class="countdown">99</div><button id="gp">+</button></section><nav id="dots"><button aria-label="Celebrating">1</button></nav></body>';
  const dom = new JSDOM(renderInvitation(source, emptyEditor(), 'test'), { runScripts: 'dangerously', url: 'https://invite.test' });
  const messages: { fields: { text: string; section: string; sectionOrder: number }[] }[] = [];
  dom.window.addEventListener('message', e => messages.push(e.data));
  await ready();
  const fields = messages.at(-1)!.fields;
  expect(fields.map(f => f.text)).toEqual(['Open', 'Welcome']);
  expect(fields.map(f => [f.sectionOrder, f.section])).toEqual([[0, 'Opening / door'], [1, 'Celebrating']]);
  dom.window.close();
});

it('keeps intentionally blank wording blank after reopening', async () => {
  const dom = open('<body><h1>Original</h1></body>', { ...emptyEditor(), texts: { 'body.0.0': '' } });
  await ready();
  expect(dom.window.document.querySelector('h1')!.textContent).toBe('');
  dom.window.close();
});

it('mutes the original sound control when custom music is present', async () => {
  const dom = open('<body><button id="snd" class="on" aria-pressed="true" onclick="this.classList.remove(\'on\');this.setAttribute(\'aria-pressed\',\'false\')">Sound</button></body>', { ...emptyEditor(), musicUrl: 'data:audio/wav;base64,YQ==' });
  await ready();
  const button = dom.window.document.getElementById('snd')!;
  expect(button.getAttribute('aria-pressed')).toBe('false');
  expect(button.style.display).toBe('none');
  dom.window.close();
});

it('automatically detects sections in arbitrary templates with semantic section tags and headings', async () => {
  const source = '<body><header><h1>Save the Date</h1></header><section><h2>Our Story</h2><p>How we met</p></section><section><h2>Wedding Details</h2><p>At the Grand Hall</p></section></body>';
  const dom = new JSDOM(renderInvitation(source, emptyEditor(), 'test-arbitrary'), { runScripts: 'dangerously', url: 'https://invite.test' });
  const messages: any[] = [];
  dom.window.addEventListener('message', e => messages.push(e.data));
  await ready();
  const lastMsg = messages.at(-1)!;
  expect(lastMsg.fields.length).toBeGreaterThan(0);
  const sections = Array.from(new Set(lastMsg.fields.map((f: any) => f.section)));
  expect(sections).toContain('Our Story');
  expect(sections).toContain('Wedding Details');
  dom.window.close();
});

it('detects canvas elements and canvas text rendering in runtime bridge', async () => {
  const source = '<body><canvas id="art"></canvas><script>// Canvas drawing with text\nfunction draw(ctx) { ctx.fillText("Hello", 10, 10); }\n</script></body>';
  const dom = new JSDOM(renderInvitation(source, emptyEditor(), 'test-canvas'), { runScripts: 'dangerously', url: 'https://invite.test' });
  const messages: any[] = [];
  dom.window.addEventListener('message', e => messages.push(e.data));
  await ready();
  const lastMsg = messages.at(-1)!;
  expect(lastMsg.hasCanvas).toBe(true);
  expect(lastMsg.hasCanvasText).toBe(true);
  dom.window.close();
});

