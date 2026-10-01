import useReveal from "../../hooks/useReveal";
import "./parallax.scss";

/**
 * Flies its child in along the Z axis the first time it enters the viewport.
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal-3d ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
