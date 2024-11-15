import "./references.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

export default function References() {
  const referencesData = [
    {
        id: 1,
        name: "Shruti Rastogi",
        title: "Senior Developer",
        img: "assets/SR.jpeg",
        icon: "assets/twitter.png",
        description: `Rishika showed drive and curiosity, the moment she joined from college and she grew to be a valuable asset to the team due to her zeal towards learning new things and expertise in SQL.She is a skilled and dedicated resource and her commitment to work is commendable. She has good knowledge on scripting and helped the team always.`,
      },
      {
      id: 2,
      name: "Seshadri Reddy Kalakata",
      title: "Project Manager",
      img: "assets/SRK.jpeg",
      icon: "assets/twitter.png",
      description: `Rishika joined as fresher in Reconciliation Shared service center @BNP. I am glad to work with such enthusiastic person. Anything technical just ask for solution and she make sure the requirements are correctly captured and you have the final solution after few weeks. 
      we had long pending issues and when I discussed with her she was open to take up the work and to surprise after 2weeks she had the solution. 
      Her technical and analytical skills and driving them to solution is awesome. I would love to be part of team member. And would never mind to welcome her.
      Keep it up Rishika`,
    },
    {
      id: 3,
      name: "Sneha Ambure",
      title: "Team Lead",
      img: "assets/SA.jpeg",
      icon: "assets/twitter.png",
      description: `Rishika joined BNP Paribas as a fresh graduate. During her tenure as Associate Engineer in BNP Paribas she has learnt lot of things as part of her work which has improved a lot from day 1 to last day. This first step has helped her prepare for the corporate world. I am sure Rishika will contribute greatly to her future organization and achieve greater things in her career.`,
    },
  ];

  return (
    <div className="references" id="references">
      <h1>References</h1>
      <div className="references-container">
        {referencesData.map((d) => (
          <div className="references-card">
            <div className="card-top">
              <FontAwesomeIcon icon={faQuoteLeft} className="left" />
            </div>
            <div className="card-center">{d.description}</div>
            <div className="card-bottom">
              <img src={d.img} alt="" className="user" />
              <div className="card-name-title">
                <h3>{d.name}</h3>
                <h4>{d.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
