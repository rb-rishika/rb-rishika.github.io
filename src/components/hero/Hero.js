import "./hero.scss";
import CursorScrubVideo from "../scrubVideo/CursorScrubVideo";

/*
 * Trimmed to the clip's longest monotonic gaze run (2.79s-7.00s of the source
 * in media-source/), motion-interpolated from 24fps to 60fps, and encoded
 * all-keyframe. The extra frames matter: at 24fps a full-window cursor sweep
 * only had 101 distinct images to show, which stepped visibly.
 */
const PORTRAIT_VIDEO = "assets/portrait-gaze.mp4";

const SKILLS = [
  { icon: "</>", label: "Full stack development" },
  { icon: "✧", label: "Machine learning" },
  { icon: "◉", label: "Product thinking" },
];

export default function Intro() {
  return (
    <section className="hero" id="intro" aria-labelledby="hero-title">
      {/*
        Full-bleed background: gaze follows the cursor across the window.

        `objectPosition: right` keeps the character in view -- they sit in the
        right half of the frame, so a centered crop would clip them on wide
        viewports.
      */}
      <CursorScrubVideo
        src={PORTRAIT_VIDEO}
        axis="horizontal"
        trackingArea="window"
        smoothing={0.08}
        objectFit="cover"
        objectPosition="center center"
        className="hero__bg"
      />

      {/* Keeps the copy legible over the footage. */}
      <div className="hero__scrim" />

      <div className="hero__copy">
        <h1 id="hero-title" className="hero__title">
          Hi, I'm{" "}
          <span className="hero__name">
            Rishika<span className="hero__dot">.</span>
          </span>
          <br />I build thoughtful digital experiences.
        </h1>

        <p className="hero__intro">
          Full stack developer and machine learning enthusiast creating useful,
          delightful products.
        </p>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#portfolio">
            View my work <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn--outline" href="#contact">
            Get in touch
          </a>
        </div>

        <ul className="hero__skills" aria-label="Areas of focus">
          {SKILLS.map((s) => (
            <li className="skill" key={s.label}>
              <b aria-hidden="true">{s.icon}</b>
              {s.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
