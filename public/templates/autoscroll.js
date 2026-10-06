/**
 * WeInviteU Hero Device Auto-Tour & Auto-Scroll Controller
 * Plays invitation mockups continuously like an automated walkthrough video.
 * Only activates when `autoscroll=1` is in the URL search query.
 */
/**
 * Silent previews: the home page and template cards show invitations as moving previews.
 * They must never play music, so when `autoscroll` or `muted` is in the URL every audio
 * element is muted and every Web Audio context is kept suspended. This works at the browser
 * level, so it covers any template regardless of how its sound code is written.
 */
(function silencePreview() {
  if (typeof window === "undefined") return;
  if (!/[?&](autoscroll|muted)\b/.test(window.location.search)) return;
  try {
    const media = window.HTMLMediaElement && window.HTMLMediaElement.prototype;
    if (media) {
      const play = media.play;
      media.play = function () { this.muted = true; this.volume = 0; return play.call(this); };
      const silenceAll = () => document.querySelectorAll("audio, video").forEach((el) => { el.muted = true; el.volume = 0; if (el.tagName === "AUDIO") el.pause(); });
      silenceAll();
      new MutationObserver(silenceAll).observe(document.documentElement, { childList: true, subtree: true });
    }
    ["AudioContext", "webkitAudioContext"].forEach((name) => {
      const Original = window[name];
      if (!Original) return;
      Original.prototype.resume = function () { return Promise.resolve(); };
      const Silent = function (...args) { const ctx = new Original(...args); ctx.suspend(); return ctx; };
      Silent.prototype = Original.prototype;
      window[name] = Silent;
    });
  } catch (e) {}
})();

(function initAutoTour() {
  if (typeof window === "undefined") return;
  if (!window.location.search.includes("autoscroll")) return;

  let isTourRunning = true;
  let isResetting = false;

  // Helper to trigger the opening sequence across different template styles
  function tryTriggerOpen() {
    try {
      // Royal Palace template
      if (typeof window.unlock === "function" && window.state === "closed") {
        window.unlock();
        return true;
      }
      // Temple template
      if (typeof window.openSeal === "function" && (window.state === "env" || !window.state)) {
        window.openSeal();
        setTimeout(() => {
          try {
            if (typeof window.enterTemple === "function") window.enterTemple();
            const hint = document.querySelector("#cardHint, #card");
            if (hint) hint.click();
          } catch (e) {}
        }, 1100);
        return true;
      }
      // Birthday / Pooja / Anniversary templates
      if (typeof window.openRibbon === "function" && (window.state === "intro" || !window.state)) {
        window.openRibbon();
        return true;
      }
      // Baby Shower template
      if (typeof window.openDoor === "function" && (window.state === "door" || !window.state)) {
        window.openDoor();
        return true;
      }
    } catch (e) {}

    // Fallback: click known interactive opening elements
    const triggers = [
      "#ribBtn", "#seal", "#balloon", "#door", "#cardHint", "#card",
      "#s1", ".ribbtn", ".seal", ".envelope", "#start-btn", ".enter-btn",
      "#key", ".door-gate", "#lamp", "#enter"
    ];
    for (const sel of triggers) {
      const el = document.querySelector(sel);
      if (el && (el.offsetParent !== null || el.style.display !== "none")) {
        try {
          el.click();
          return true;
        } catch (e) {}
      }
    }
    return false;
  }

  // Smooth continuous scroller for vertical scrolling templates / sections
  let scrollDir = 1;
  let scrollPaused = false;
  function stepScroll() {
    const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const viewH = window.innerHeight;
    const maxScroll = docH - viewH;

    // Only vertical scroll if the document is genuinely scrollable (traditional web page)
    if (maxScroll > 120 && !document.body.style.overflow?.includes("hidden")) {
      if (!scrollPaused) {
        window.scrollBy({ top: scrollDir * 1.5, behavior: "auto" });
        if (window.scrollY >= maxScroll - 6) {
          scrollPaused = true;
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => { scrollPaused = false; }, 2200);
          }, 2500);
        }
      }
    }

    // Also check for inner .scroll element (e.g. story or itinerary cards)
    const activeScroll = document.querySelector(".page.on .scroll, .pg.on .scroll, .scroll");
    if (activeScroll && activeScroll.scrollHeight > activeScroll.clientHeight + 30) {
      activeScroll.scrollBy({ top: 1, behavior: "auto" });
      if (activeScroll.scrollTop >= activeScroll.scrollHeight - activeScroll.clientHeight - 4) {
        setTimeout(() => {
          activeScroll.scrollTo({ top: 0, behavior: "smooth" });
        }, 1200);
      }
    }

    requestAnimationFrame(stepScroll);
  }

  // Step through 3D interactive pages/scenes like a video presentation
  function stepTour() {
    if (!isTourRunning || isResetting) return;

    // 1. If currently in intro/closed state, trigger the opening reveal
    try {
      if (
        window.state === "closed" ||
        window.state === "env" ||
        window.state === "intro" ||
        window.state === "door"
      ) {
        tryTriggerOpen();
        return;
      }
    } catch (e) {}

    // 2. Temple card hint check
    const cardHint = document.querySelector("#cardHint");
    if (cardHint && (cardHint.classList.contains("show") || cardHint.offsetParent !== null)) {
      try {
        if (typeof window.enterTemple === "function") window.enterTemple();
        cardHint.click();
        return;
      } catch (e) {}
    }

    // 3. Gentle carousel rotation on events card
    try {
      if (typeof window.goEv === "function" && Math.random() < 0.45) {
        window.goEv(1);
      }
      if (typeof window.flick === "function" && Math.random() < 0.35) {
        window.flick(1);
      }
    } catch (e) {}

    // 4. Page progression
    let advanced = false;

    // Try goPage() API
    try {
      if (typeof window.goPage === "function" && typeof window.page === "number") {
        const lastPage = typeof window.LAST === "number" ? window.LAST : 4;
        if (window.page < lastPage) {
          window.goPage(window.page + 1);
          advanced = true;
        } else {
          // Reached final RSVP page! Let it linger like a video outro, then loop back.
          isResetting = true;
          setTimeout(() => {
            try {
              if (typeof window.reset === "function") {
                window.reset();
              } else if (typeof window.goPage === "function") {
                window.goPage(0);
              }
            } catch (e) {}
            isResetting = false;

            // Re-open after returning to closed state
            setTimeout(() => {
              tryTriggerOpen();
            }, 1800);
          }, 4500);
          return;
        }
      }
    } catch (e) {}

    // If goPage wasn't available, click the cue arrow button (#cue)
    if (!advanced) {
      const cue = document.querySelector("#cue, .cue, .next-arrow, .down-arrow");
      if (cue && (cue.classList.contains("show") || cue.offsetParent !== null)) {
        try {
          cue.click();
          advanced = true;
        } catch (e) {}
      }
    }

    // If replay button is visible, loop back
    const replay = document.querySelector("#replay");
    if (replay && replay.classList.contains("show") && !isResetting) {
      isResetting = true;
      setTimeout(() => {
        try {
          if (typeof window.reset === "function") window.reset();
          else replay.click();
        } catch (e) {}
        isResetting = false;
        setTimeout(() => {
          tryTriggerOpen();
        }, 1800);
      }, 4000);
    }
  }

  function start() {
    // Initial opening after assets load
    setTimeout(() => {
      tryTriggerOpen();
    }, 1400);

    // Continuous page progression interval (approx 3.4s per scene)
    setInterval(stepTour, 3400);

    // Start vertical continuous scroll loop for scrolling pages
    requestAnimationFrame(stepScroll);
  }

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start);
  }
})();
