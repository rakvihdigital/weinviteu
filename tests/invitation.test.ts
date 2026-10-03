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
