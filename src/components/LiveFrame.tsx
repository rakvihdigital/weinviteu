"use client";

import { useEffect, useRef, useState, type IframeHTMLAttributes } from "react";

// Every live template is a full animated page (large embedded photos, several canvases).
// Running many at once makes iPhones kill the tab ("A problem repeatedly occurred"), so a
// template only runs while it is on screen, and phones run just one at a time.
const MOBILE_QUERY = "(max-width: 768px), (pointer: coarse)";
const slots = { active: new Set<number>(), queue: [] as number[], listeners: new Set<() => void>() };
let nextId = 0;

function limit() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches ? 1 : 4;
}
function fill() {
  while (slots.queue.length && slots.active.size < limit()) slots.active.add(slots.queue.shift()!);
  slots.listeners.forEach((listener) => listener());
}
function request(id: number) {
  if (!slots.active.has(id) && !slots.queue.includes(id)) slots.queue.push(id);
  fill();
}
function release(id: number) {
  slots.queue = slots.queue.filter((queued) => queued !== id);
  slots.active.delete(id);
  fill();
}

type Props = IframeHTMLAttributes<HTMLIFrameElement> & { title: string; label?: string };

export default function LiveFrame({ label, title, ...iframeProps }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef(-1);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (id.current < 0) id.current = nextId++;
    const me = id.current;
    const update = () => setLive(slots.active.has(me));
    slots.listeners.add(update);
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? request(me) : release(me)),
      { rootMargin: "120px 0px", threshold: 0.2 }
    );
    if (box.current) observer.observe(box.current);
    return () => { observer.disconnect(); slots.listeners.delete(update); release(me); };
  }, []);

  return (
    <div ref={box} className="live-frame">
      {live ? (
        <iframe title={title} {...iframeProps} />
      ) : (
        <div className="live-frame-placeholder" aria-hidden="true">
          <span>{label ?? title}</span>
        </div>
      )}
    </div>
  );
}
