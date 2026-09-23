"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { EntranceStyle } from "./PalaceScene";
import EntrancePreview from "./EntrancePreview";
import { Play, Pause, ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";

const options = [
  { id: "palace", name: "Palace", genre: "Piano Suite", track: "piano" },
  { id: "garden", name: "Garden", genre: "Garden Chimes", track: "bells" },
  { id: "celestial", name: "Celestial", genre: "Starlight Ambient", track: "ambient" },
] as const;

export default function ExperienceLab() {
  const [selected, setSelected] = useState<EntranceStyle>("palace");
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const currentOption = options.find((o) => o.id === selected)!;
  const track = currentOption.track;

  async function toggleAudio() {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
    } else {
      audio.current.volume = 0.4;
      try {
        await audio.current.play();
        setError("");
      } catch {
        setError("Soundtrack could not play. Please interact or try again.");
      }
    }
  }

  return (
    <section className="experience-lab" aria-label="Interactive Invitation Experience Lab">
      <div className="lab-copy">
        <p className="eyebrow">02 / MORE THAN A PRETTY INVITE</p>
        <h2>
          Give them
          <br />a little <em>wow.</em>
        </h2>
        <p>
          Velvet curtains. A sealed love letter. A constellation coming to life.
          Experience the tactile anticipation of an invitation crafted to be opened.
        </p>

        <div className="lab-features-pills" aria-hidden="true">
          <span>✦ 3D Depth &amp; Foil Specular Tilt</span>
          <span>✦ Realistic Entrance Physics</span>
          <span>✦ Curated Soundscapes</span>
        </div>

        <div className="lab-tabs" role="tablist" aria-label="Entrance Styles">
          {options.map((o) => (
            <button
              key={o.id}
              role="tab"
              aria-selected={selected === o.id}
              className={selected === o.id ? "active-tab" : ""}
              onClick={() => {
                audio.current?.pause();
                setSelected(o.id);
                setOpened(false);
                setPlaying(false);
                setError("");
              }}
            >
              <strong>{o.name}</strong>
              <small>{o.genre}</small>
            </button>
          ))}
        </div>

        <div className="lab-actions">
          <button
            className="action-open-btn"
            onClick={() => setOpened(!opened)}
          >
            {opened ? <RotateCcw size={16} /> : <ArrowUpRight size={16} />}
            <span>
              {opened
                ? "Replay the moment"
                : selected === "palace"
                  ? "Draw the curtains"
                  : selected === "garden"
                    ? "Open the letter"
                    : "Align the stars"}
            </span>
          </button>

          <button
            className={`action-sound-btn ${playing ? "is-playing" : ""}`}
            onClick={toggleAudio}
            aria-label={playing ? "Pause soundtrack" : "Play soundtrack"}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            <span>Sound {playing ? "on" : "off"}</span>
            {playing && (
              <span className="audio-visualizer-bars" aria-hidden="true">
                <span className="visualizer-bar v1" />
                <span className="visualizer-bar v2" />
                <span className="visualizer-bar v3" />
                <span className="visualizer-bar v4" />
              </span>
            )}
          </button>
        </div>

        <div className="lab-links-row">
          <Link className="text-link studio-cta-link" href="/invite/arjun-priya">
            <span>Try the complete invitation experience</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {error && <p className="lab-error" role="status">{error}</p>}
      </div>

      <div className={`lab-scene scene-${selected}`}>
        <div className="lab-scene-header">
          <span className="lab-live">✦ INTERACTIVE 3D ENTRANCE</span>
          {playing && (
            <span className="lab-audio-badge">
              <span className="badge-pulse-dot" />
              <span>SOUNDTRACK: {currentOption.genre.toUpperCase()}</span>
            </span>
          )}
        </div>

        <EntrancePreview
          variant={selected}
          opened={opened}
          onToggle={() => setOpened(!opened)}
        />

        <p className="lab-scene-hint">
          {opened
            ? "CLICK THE SCENE TO CLOSE & REPLAY · MOVE CURSOR TO TILT IN 3D"
            : "CLICK THE SCENE TO REVEAL INVITATION · MOVE CURSOR TO TILT IN 3D"}
        </p>
      </div>

      <audio
        key={track}
        ref={audio}
        src={`/audio/${track}.wav`}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError("Soundtrack unavailable.")}
      />
    </section>
  );
}
