"use client";

import { useState, useRef } from "react";
import { RotateCw, Eye, VolumeX, Share2, Check } from "lucide-react";
import { getTemplatePoster } from "@/lib/template-posters";
import styles from "./template-detail.module.css";

interface Props {
  previewUrl: string;
  templateTitle: string;
}

export default function SimulatorStage({ previewUrl, templateTitle }: Props) {
  const silentPreviewUrl = `${previewUrl}${previewUrl.includes("?") ? "&" : "?"}autoscroll=1&muted=1`;
  const [iframeKey, setIframeKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const poster = posterFailed ? null : getTemplatePoster(previewUrl);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    setLoaded(false);
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
              className={styles.previewButton}
              title="Open full preview in new tab"
              aria-label="Open full preview in new tab"
            >
              <Eye size={17} aria-hidden="true" /> Preview
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
              onLoad={() => setLoaded(true)}
              key={iframeKey}
              ref={iframeRef}
              src={silentPreviewUrl}
              title={`Live Preview of ${templateTitle}`}
              className={styles.phoneIframe}
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              allow="autoplay"
              loading="eager"
            />
            {!loaded && poster && <img src={poster} alt={`${templateTitle} invitation preview`} className={styles.simulatorPoster} width={390} height={844} fetchPriority="high" onError={() => setPosterFailed(true)} />}
          </div>
        </div>

        {/* Ambient hint below device */}
        <p className={styles.simulatorTip}>
          <VolumeX size={14} color="#fae29c" />
          <span>Autoplay · Sound off.</span> Open Preview to explore the invitation yourself.
        </p>
      </div>
    </div>
  );
}
