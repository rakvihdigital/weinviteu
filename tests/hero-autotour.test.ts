import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const controller = readFileSync('public/templates/autoscroll.js', 'utf8');
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('opens and advances templates with global lexical state, then loops only at the final page', () => {
  const cue = { classList: { contains: () => true } };
  const reset = vi.fn();
  const advance = vi.fn();
  const open = vi.fn();
  const context = createContext({
    setTimeout, setInterval, requestAnimationFrame: () => {},
    reset, advance, open,
    document: {
      readyState: 'complete', body: { scrollHeight: 0, style: {} }, documentElement: { scrollHeight: 0 },
      querySelector: (selector: string) => selector === '#cue' || selector === '#replay' ? cue : selector === '#cardHint' ? { offsetParent: {}, classList: { contains: () => false }, click: vi.fn() } : null,
    },
  });
  runInContext(`
    var window = globalThis;
    window.location = {search: '?autoscroll=1&muted=1'};
    let state = 'closed', page = 2;
    const LAST = 5;
    function unlock() { open(); state = 'palace'; }
    function goPage(next) { page = next; advance(next); }
  `, context);
  runInContext(controller, context);
  vi.advanceTimersByTime(1400);
  expect(open).toHaveBeenCalledOnce();
  vi.advanceTimersByTime(9000);
  expect(advance.mock.calls).toEqual([[3], [4], [5]]);
  expect(reset).not.toHaveBeenCalled();
  vi.advanceTimersByTime(7700);
  expect(reset).toHaveBeenCalledOnce();
});
