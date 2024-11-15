import "./hero.scss";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

export default function Intro() {
  return (
    <>
      <div className="intro" id="intro">
        <div className="left">
          <div className="background-img"></div>
          <div className="img-container">
            <img
              src="assets/RishikaBhanushali_Fullsize.JPEG"
              alt=""
              className="thuan-profile"
            />
          </div>
        </div>
        <div className="right">
          <div className="hero-text">
            <h2>👋 Hi there! I'm</h2>
            <h1>Rishika Bhanushali</h1>
            <h3>Full Stack Developer | Machine Learning Enthusiast</h3>
            <p>
            Avid learner, debate lover, and forever optimist. I like creating products that either a) have fun and nifty features or b) solve a problem for people. I especially love creating products that have both of those things! Above all that, I really love supporting my team so everyone feels good bringing their authentic selves to work. My hobbies include messing around with random JS libraries, day dreaming about space, and eating snacks.
            </p>

            <a href="#portfolio">
              <ArrowCircleDownIcon
                className="arrow-down"
                sx={{ fontSize: 70 }}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
