import Navbar from "./components/navbar/Navbar";
import Intro from "./components/hero/Hero";
import Portfolio from "./components/portfolio/Portfolio";
import References from "./components/references/References";
import Contact from "./components/contact/Contact";
import Menu from "./components/menu/Menu";
import Experience from "./components/experience/experience"
import ParallaxSection from "./components/parallax/ParallaxSection";
import "./app.scss";
import { useState } from "react";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="sections">
        {/* The hero is excluded: its background is a fixed full-bleed video,
            so shifting the whole section would drag the footage with it. */}
        <Intro />
        <ParallaxSection speed={0.9}>
          <Portfolio />
        </ParallaxSection>
        <ParallaxSection speed={1.1}>
          <References />
        </ParallaxSection>
        <ParallaxSection speed={0.85}>
          <Experience />
        </ParallaxSection>
        <ParallaxSection speed={1}>
          <Contact />
        </ParallaxSection>
      </div>
    </div>
  );
}

export default App;
