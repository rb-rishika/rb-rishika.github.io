import { useEffect, useRef } from "react";

/**
 * Drives a scroll-linked parallax offset on an element.
 *
 * Returns a ref to attach to the moving layer. As that layer travels through
 * the viewport we write a normalised progress value (-1 above, 0 centred,
 * +1 below) to a CSS custom property, and let the stylesheet decide what to do
 * with it. Keeping the maths in JS and the motion in CSS means a single
 * listener can drive translate, scale and opacity without extra work here.
 */
export default function useParallax({ speed = 1, disabled = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || disabled) return;

    // Honour the OS-level motion preference; bail out entirely if set.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    // The sections list is its own scroll container, so listening on window
    // alone would never fire. Walk up to whichever ancestor actually scrolls.
    const findScroller = (el) => {
      let p = el.parentElement;
      while (p) {
        const overflowY = getComputedStyle(p).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") return p;
        p = p.parentElement;
      }
      return window;
    };

    const scroller = findScroller(node);
    let frame = null;
    let visible = true;

    const update = () => {
      frame = null;

      const rect = node.getBoundingClientRect();
      const viewportH =
        scroller === window
          ? window.innerHeight
          : scroller.getBoundingClientRect().height;
      const viewportTop =
        scroller === window ? 0 : scroller.getBoundingClientRect().top;

      // Distance from the element's centre to the viewport's centre,
      // normalised by the viewport height.
      const elCenter = rect.top + rect.height / 2 - viewportTop;
      const progress = (elCenter - viewportH / 2) / viewportH;

      // Clamp so a tall section parked mid-screen can't drift indefinitely.
      const clamped = Math.max(-1.5, Math.min(1.5, progress)) * speed;

      node.style.setProperty("--parallax", clamped.toFixed(4));
      node.style.setProperty("--parallax-abs", Math.abs(clamped).toFixed(4));
    };

    const onScroll = () => {
      // Skip work for sections that are nowhere near the viewport.
      if (!visible) return;
      if (frame === null) frame = requestAnimationFrame(update);
    };

    // IntersectionObserver gates the listener so offscreen sections cost
    // nothing on every scroll event.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "100px" }
    );
    io.observe(node);

    const target = scroller === window ? window : scroller;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    update();

    return () => {
      io.disconnect();
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [speed, disabled]);

  return ref;
}
