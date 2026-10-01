import { useRef, useState } from "react";
import "./parallax.scss";

/**
 * A card that tilts in 3D toward the cursor while hovered, with an optional
 * moving specular sheen. Uses local (element relative) coordinates so every
 * card reacts independently.
 */
export default function Tilt({
  max = 12,
  scale = 1.03,
  lift = 30,
  glare = true,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [transform, setTransform] = useState({ rx: 0, ry: 0, active: false });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMove = (e) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTransform({
      rx: (0.5 - py) * 2 * max,
      ry: (px - 0.5) * 2 * max,
      active: true,
    });
    setGlarePos({ x: px * 100, y: py * 100 });
  };

  const handleLeave = () =>
    setTransform({ rx: 0, ry: 0, active: false });

  const { rx, ry, active } = transform;
  const { style: styleProp, ...domProps } = rest;

  return (
    <div
      {...domProps}
      ref={ref}
      className={`tilt ${active ? "is-active" : ""} ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...styleProp,
        transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${
          active ? scale : 1
        }) translateZ(${active ? lift : 0}px)`,
      }}
    >
      <div className="tilt__content">{children}</div>
      {glare && (
        <span
          className="tilt__glare"
          style={{
            opacity: active ? 1 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)`,
          }}
        />
      )}
    </div>
  );
}
