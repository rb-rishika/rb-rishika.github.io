import useParallax from "../../hooks/useParallax";
import useReveal from "../../hooks/useReveal";
import "./parallax.scss";

/**
 * Wraps a section so it drifts and settles as it scrolls through the viewport.
 *
 * Two effects are layered deliberately:
 *   - `useReveal` runs once, on first entry, for the initial fade-in.
 *   - `useParallax` runs continuously, giving the section a depth offset
 *     relative to the scroll position.
 *
 * They're applied to separate elements so their transforms can't fight.
 */
export default function ParallaxSection({
  children,
  speed = 1,
  className = "",
}) {
  const parallaxRef = useParallax({ speed });
  const [revealRef, inView] = useReveal();

  return (
    <div
      ref={revealRef}
      className={`parallax-section ${inView ? "is-visible" : ""} ${className}`}
    >
      <div ref={parallaxRef} className="parallax-section__layer">
        {children}
      </div>
    </div>
  );
}
