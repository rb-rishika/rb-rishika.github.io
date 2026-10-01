import "./references.scss";
import useReveal from "../../hooks/useReveal";

const REFERENCES = [
  {
    id: 1,
    name: "Shruti Rastogi",
    title: "Senior Developer",
    img: "assets/SR.jpeg",
    description: `Rishika showed drive and curiosity the moment she joined from college, and she grew to be a valuable asset to the team due to her zeal towards learning new things and her expertise in SQL. She is a skilled and dedicated resource, and her commitment to work is commendable. She has good knowledge of scripting and always helped the team.`,
  },
  {
    id: 2,
    name: "Seshadri Reddy Kalakata",
    title: "Project Manager",
    img: "assets/SRK.jpeg",
    description: `Rishika joined as a fresher in the Reconciliation Shared Service Center at BNP. I am glad to have worked with such an enthusiastic person. Anything technical, just ask for a solution and she makes sure the requirements are correctly captured. We had long-pending issues, and when I discussed them with her she was open to taking up the work — to my surprise, after two weeks she had the solution. Her technical and analytical skills are awesome.`,
  },
  {
    id: 3,
    name: "Sneha Ambure",
    title: "Team Lead",
    img: "assets/SA.jpeg",
    description: `Rishika joined BNP Paribas as a fresh graduate. During her tenure as Associate Engineer she learnt a lot as part of her work, and improved enormously from day one to her last day. I am sure Rishika will contribute greatly to her future organization and achieve greater things in her career.`,
  },
];

export default function References() {
  const [revealRef, inView] = useReveal();

  return (
    <section
      className={`references ${inView ? "is-visible" : ""}`}
      id="references"
      ref={revealRef}
      aria-labelledby="references-title"
    >
      <header className="references__head">
        <h2 id="references-title" className="references__title">
          References<span className="references__dot">.</span>
        </h2>
      </header>

      <ul className="references__grid">
        {REFERENCES.map((d) => (
          <li className="quote" key={d.id}>
            <blockquote className="quote__body">
              <span className="quote__mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="quote__text">{d.description}</p>
            </blockquote>

            <div className="quote__author">
              <img
                src={d.img}
                alt={d.name}
                className="quote__avatar"
                loading="lazy"
              />
              <div className="quote__meta">
                <span className="quote__name">{d.name}</span>
                <span className="quote__role">{d.title}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
