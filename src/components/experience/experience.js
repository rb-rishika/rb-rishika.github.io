import "./experience.scss";
import useReveal from "../../hooks/useReveal";

const ROLES = [
  {
    id: 1,
    role: "Engineer II",
    company: "Starbucks",
    location: "Seattle, WA",
    period: "May 2022 — Present",
    current: true,
    logo: "assets/sbux-logo.png",
    summary:
      "Building customer-facing experiences on the web platform, from design system components through to authenticated account flows.",
    tags: ["React", "User experience", "UX design", "Auth control"],
  },
  {
    id: 2,
    role: "Software Engineer",
    company: "BNP Paribas",
    location: "Mumbai, India",
    period: "Jul 2020 — Jul 2021",
    current: false,
    logo: "assets/bnp-paribas.svg",
    summary:
      "Worked across the reconciliation platform, pairing interface work with automation that removed long-standing manual processes.",
    tags: ["Automation", "Visual design", "SQL", "Scripting"],
  },
];

export default function Experience() {
  const [revealRef, inView] = useReveal();

  return (
    <section
      className={`experience ${inView ? "is-visible" : ""}`}
      id="experience"
      ref={revealRef}
      aria-labelledby="experience-title"
    >
      <header className="experience__head">
        <h2 id="experience-title" className="experience__title">
          Experience<span className="experience__dot">.</span>
        </h2>
      </header>

      <ol className="timeline">
        {ROLES.map((r) => (
          <li className="milestone" key={r.id}>
            {/* The rail marker. The connecting line is drawn by ::before. */}
            <div className="milestone__marker" aria-hidden="true">
              <img className="milestone__logo" src={r.logo} alt="" />
            </div>

            <div className="milestone__card">
              <div className="milestone__meta">
                <span className="milestone__period">{r.period}</span>
                {r.current && (
                  <span className="milestone__badge">Current</span>
                )}
              </div>

              <h3 className="milestone__role">{r.role}</h3>
              <p className="milestone__company">
                {r.company}
                <span className="milestone__sep" aria-hidden="true">
                  ·
                </span>
                <span className="milestone__location">{r.location}</span>
              </p>

              <p className="milestone__summary">{r.summary}</p>

              <ul className="milestone__tags">
                {r.tags.map((t) => (
                  <li className="milestone__tag" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
