"use client";

import { useState } from "react";
import { Eye, Share2, Check } from "lucide-react";
import { getTemplatePoster } from "@/lib/template-posters";
import styles from "./template-detail.module.css";

interface Props {
  previewUrl: string;
  templateTitle: string;
}

export default function SimulatorStage({ previewUrl, templateTitle }: Props) {
  // Muted and without autoscroll: the invitation rests on its opening screen until the visitor opens it.
  const stillPreviewUrl = `${previewUrl}${previewUrl.includes("?") ? "&" : "?"}muted=1`;
  const [loaded, setLoaded] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const poster = posterFailed ? null : getTemplatePoster(previewUrl);
  const [copied, setCopied] = useState(false);

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
        <div className={styles.simulatorHeader}>
          <div className={styles.simulatorControls}>
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
              src={stillPreviewUrl}
              title={`Preview of ${templateTitle}`}
              className={styles.phoneIframe}
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              loading="eager"
              tabIndex={-1}
            />
            {!loaded && poster && <img src={poster} alt={`${templateTitle} invitation preview`} className={styles.simulatorPoster} width={390} height={844} fetchPriority="high" onError={() => setPosterFailed(true)} />}
            <div className={styles.previewOverlay}>
              <a
                href={previewUrl}
                className={styles.previewButton}
                aria-label={`Open ${templateTitle} preview`}
              >
                <Eye size={18} aria-hidden="true" /> Preview
              </a>
            </div>
          </div>
        </div>

        <p className={styles.simulatorTip}>
          Tap <span>Preview</span> to open the invitation and explore it yourself.
        </p>
      </div>
    </div>
  );
}
