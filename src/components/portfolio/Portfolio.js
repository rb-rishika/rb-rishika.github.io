import { useState, useEffect } from "react";
import "./portfolio.scss";
import { allPortfolio, groupProjects, soloProjects } from "../../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import useReveal from "../../hooks/useReveal";

export default function Portfolio() {
  const [revealRef, inView] = useReveal();
  const [selected] = useState("projects");
  const [data, setData] = useState([]);

  useEffect(() => {
    switch (selected) {
      case "group":
        setData(groupProjects);
        break;
      case "solo":
        setData(soloProjects);
        break;
      default:
        setData(allPortfolio);
    }
  }, [selected]);

  return (
    <section
      className={`portfolio ${inView ? "is-visible" : ""}`}
      id="portfolio"
      ref={revealRef}
      aria-labelledby="portfolio-title"
    >
      <header className="portfolio__head">
        <h2 id="portfolio-title" className="portfolio__title">
          Selected work<span className="portfolio__dot">.</span>
        </h2>
      </header>

      <ul className="portfolio__grid">
        {data.map((d, i) => (
          <li className="project" key={d.id || d.title || i}>
            <div className="project__media">
              <img src={d.image} alt="" loading="lazy" />
            </div>

            <div className="project__body">
              <h3 className="project__title">{d.title}</h3>

              <div className="project__links">
                <a
                  className="project__link project__link--primary"
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="project__icon"
                  />
                  Live demo
                </a>
                <a
                  className="project__link"
                  href={d.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} className="project__icon" />
                  Source
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
