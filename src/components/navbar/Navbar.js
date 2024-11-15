import "./navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faDownload } from '@fortawesome/fontawesome-free-solid'

export default function Navbar({ menuOpen, setMenuOpen }) {
  return (
    <div className={"navbar " + (menuOpen && "active")}>
      <div className="wrapper">
        <div className="left-nav">
          <div
            className="hamburger-container"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
        <div className="center-nav">
          <li>
            <a href="#portfolio" className="mr">
              Portfolio
            </a>
          </li>
          <li>
            <a href="#references" className="mr">
              References
            </a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </div>
        <div className="right-nav">
          <a href="https://github.com/rb-rishika">
            <FontAwesomeIcon icon={faGithub} className="icon mr10" />
          </a>
          <a href="https://www.linkedin.com/in/rishika-bhanushali/">
            <FontAwesomeIcon icon={faLinkedin} className="icon mr10" />
          </a>
          <a href="assets/RISHIKA_BHANUSHALI_RESUME.pdf">
            <FontAwesomeIcon icon={faDownload} className="icon mr10" />
          </a>
        </div>
      </div>
    </div>
  );
}
