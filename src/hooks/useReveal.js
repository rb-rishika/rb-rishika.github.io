import { useEffect, useRef, useState } from "react";

/**
 * Adds an "in view" flag the first time an element scrolls into the viewport,
 * used to fly sections in along the Z axis.
 */
export default function useReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, root: document.querySelector(".sections") }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
