"use client";
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { Invitation } from "@/types/invitation";
export interface AudioHandle {
  play: () => void;
}
const tracks = {
  piano: "Moonlit piano",
  bells: "Wedding bells",
  ambient: "Celestial dream",
  custom: "Your soundtrack",
  none: "No music",
};
const AudioPlayer = forwardRef<AudioHandle, { value: Invitation }>(
  function AudioPlayer({ value }, ref) {
    const audio = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(value.musicVolume);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);
    const src =
      value.music === "custom"
        ? value.customAudioUrl
        : `/audio/${value.music}.wav`;
    useEffect(() => {
      if (audio.current) audio.current.volume = volume;
    }, [volume]);
    const play = () => {
      if (!audio.current) return;
      setError("");
      void audio.current.play().catch(() => {
        setPlaying(false);
        setError(
          "Tap play to enable audio. If it still fails, check the soundtrack URL.",
        );
      });
    };
    useImperativeHandle(ref, () => ({ play }));
    if (value.music === "none") return null;
    return (
      <div className={`audio-dock ${playing ? "audio-playing" : ""}`}>
        <audio
          key={src}
          ref={audio}
          src={src || undefined}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setError(
              "Soundtrack unavailable. Check your audio file or choose an included track.",
            );
            setPlaying(false);
          }}
        />
        <button
          className="audio-main"
          onClick={() => {
            if (playing) audio.current?.pause();
            else play();
          }}
          aria-label={playing ? "Pause music" : "Play music"}
        >
          <span className="audio-disc">
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </span>
          <span>
            <small>THE SOUND OF YOUR CELEBRATION</small>
            <strong>{tracks[value.music]}</strong>
          </span>
          <span className="equalizer" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <button
          className="audio-settings"
          onClick={() => setExpanded(!expanded)}
          aria-label="Audio settings"
          aria-expanded={expanded}
        >
          {volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
        {expanded && (
          <div className="audio-popover">
            <label>
              Volume · {Math.round(volume * 100)}%
              <input
                aria-label="Music volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </label>
            <button
              onClick={() =>
                setVolume(volume === 0 ? value.musicVolume || 0.55 : 0)
              }
            >
              {volume === 0 ? "Unmute" : "Mute"}
            </button>
            <p>
              <Music2 size={12} /> Music stays with you as you scroll.
            </p>
          </div>
        )}
        {error && (
          <p className="audio-error" role="status">
            {error}
          </p>
        )}
      </div>
    );
  },
);
export default AudioPlayer;
