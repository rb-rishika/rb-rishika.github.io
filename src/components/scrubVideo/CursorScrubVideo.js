import { useEffect, useRef, useState } from "react";
import "./cursor-scrub-video.scss";

/**
 * Plays a video by cursor position instead of by time.
 *
 * The playhead is lerped toward the cursor-derived target so motion feels
 * weighted rather than snapping. Requires an all-keyframe encode, otherwise
 * each seek must decode from the previous keyframe and the scrub stutters.
 */
export default function CursorScrubVideo({
  src,
  axis = "horizontal",
  reverse = false,
  mirror = false,
  trackingArea = "window",
  smoothing = 0.08,
  objectFit = "cover",
  objectPosition,
  className = "",
  style,
}) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  const targetPosRef = useRef(0.5);
  const currentTimeRef = useRef(0);
  const seekingRef = useRef(false);
  const readyRef = useRef(false);
  const rafRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  // Buffer the clip and wait until frames are actually decodable.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    readyRef.current = false;
    setIsReady(false);
    currentTimeRef.current = 0;
    seekingRef.current = false;

    const markReady = () => {
      readyRef.current = true;
      setIsReady(true);
    };
    const onSeeking = () => (seekingRef.current = true);
    const onSeeked = () => (seekingRef.current = false);

    video.addEventListener("canplaythrough", markReady);
    // Fallbacks: some browsers throttle preloading and never fire
    // `canplaythrough`, which would leave the video stuck invisible.
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);

    video.load();

    // Silent play/pause forces the decoder to materialize frames. Allowed
    // without a user gesture only because the element is muted.
    const warm = video.play();
    if (warm && typeof warm.then === "function") {
      warm.then(() => video.pause()).catch(() => {});
    }

    try {
      video.currentTime = 0;
    } catch (e) {
      /* metadata may not be ready yet */
    }

    return () => {
      video.removeEventListener("canplaythrough", markReady);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [src]);

  // Cursor tracking.
  useEffect(() => {
    if (!src) return;
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const onWindowMove = (e) => {
      const nx = clamp01(e.clientX / window.innerWidth);
      const ny = clamp01(e.clientY / window.innerHeight);
      targetPosRef.current = axis === "horizontal" ? nx : ny;
    };

    const onComponentMove = (e) => {
      const node = rootRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = clamp01((e.clientX - rect.left) / rect.width);
      const ny = clamp01((e.clientY - rect.top) / rect.height);
      targetPosRef.current = axis === "horizontal" ? nx : ny;
    };

    if (trackingArea === "window") {
      window.addEventListener("pointermove", onWindowMove, { passive: true });
      return () => window.removeEventListener("pointermove", onWindowMove);
    }

    const node = rootRef.current;
    if (!node) return;
    node.addEventListener("pointermove", onComponentMove, { passive: true });
    return () => node.removeEventListener("pointermove", onComponentMove);
  }, [axis, trackingArea, src]);

  // Scrub loop.
  useEffect(() => {
    if (!src) return;

    // A raw `current += (target - current) * smoothing` closes a fixed
    // fraction *per frame*, so the easing silently changes speed whenever the
    // browser drops below 60Hz -- that inconsistency reads as judder. Convert
    // the constant into a time-based decay so the curve is identical no matter
    // how long the frame actually took.
    const RATE = -Math.log(1 - Math.min(Math.max(smoothing, 0.001), 0.999)) * 60;
    let lastT = null;

    const tick = (now) => {
      rafRef.current = requestAnimationFrame(tick);

      const video = videoRef.current;
      if (!video || !readyRef.current) return;

      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      // Clamp dt so a background tab or GC pause can't teleport the playhead.
      const dt = lastT == null ? 1 / 60 : Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      let pos = targetPosRef.current;
      if (reverse) pos = 1 - pos;

      const target = pos * duration;
      const alpha = 1 - Math.exp(-RATE * dt);
      const next =
        currentTimeRef.current + (target - currentTimeRef.current) * alpha;
      currentTimeRef.current = next;

      // Never stack seeks, and ignore deltas smaller than half a frame at
      // 60fps. Together these stop the "seek storm" that stalls the decoder.
      if (seekingRef.current) return;
      if (Math.abs(video.currentTime - next) <= 0.008) return;

      try {
        video.currentTime = next;
      } catch (e) {
        /* retry next frame */
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [reverse, smoothing, src]);

  return (
    <div className={`scrub-video ${className}`} ref={rootRef} style={style}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
        className={`scrub-video__el ${isReady ? "is-ready" : ""}`}
        style={{
          objectFit,
          objectPosition,
          // Flips which way the subject appears to face. `reverse` only
          // changes which frame shows; this changes the frame's handedness.
          transform: mirror ? "scaleX(-1)" : undefined,
        }}
      />
    </div>
  );
}
