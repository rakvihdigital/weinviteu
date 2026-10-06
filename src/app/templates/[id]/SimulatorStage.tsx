"use client";

import { useState, useRef } from "react";
import { RotateCw, ExternalLink, Volume2, Sparkles, Share2, Check } from "lucide-react";
import styles from "./template-detail.module.css";

interface Props {
  previewUrl: string;
  templateTitle: string;
}

export default function SimulatorStage({ previewUrl, templateTitle }: Props) {
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={styles.simulatorWrap}>
      <div className={styles.simulatorStage}>
        {/* Simulator Header */}
        <div className={styles.simulatorHeader}>
          <div className={styles.simulatorLiveBadge}>
            <span className={styles.pulseDot} />
            Live 3D Preview
          </div>

          <div className={styles.simulatorControls}>
            <button
              onClick={handleReload}
              className={styles.simBtn}
              title="Reload preview"
              aria-label="Reload preview from beginning"
            >
              <RotateCw size={15} />
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.simBtn}
              title="Open full preview in new tab"
              aria-label="Open full preview in new tab"
            >
              <ExternalLink size={15} />
            </a>
            <button
              onClick={handleShare}
              className={styles.simBtn}
              title="Copy page link"
              aria-label="Copy page link"
            >
              {copied ? <Check size={15} color="#25D366" /> : <Share2 size={15} />}
            </button>
          </div>
        </div>

        {/* Realistic Mobile Device Frame */}
        <div className={styles.phoneDevice}>
          <div className={styles.phoneScreen}>
            <div className={styles.phoneNotch} />
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={previewUrl}
              title={`Live Preview of ${templateTitle}`}
              className={styles.phoneIframe}
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              loading="eager"
            />
          </div>
        </div>

        {/* Ambient hint below device */}
        <p className={styles.simulatorTip}>
          <Volume2 size={14} color="#fae29c" />
          <span>Tap inside phone</span> to trigger 3D door reveals, play sound & navigate.
        </p>
      </div>
    </div>
  );
}
