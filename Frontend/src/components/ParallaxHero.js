import React, { useEffect, useState } from "react";
import "../styles/ParallaxHero.css";
import bird1 from "../graphics/bird1.png";
import bird2 from "../graphics/bird2.png";
import forest from "../graphics/forest.png";
import rocks from "../graphics/rocks.png";
import water from "../graphics/water.png";

const ParallaxHero = ({text, subText}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="parallax-hero">
        <h2 id="text" style={{ top: `calc(50% + ${scrollY * -0.5}px)` }}>
          <span>{text}</span>
          <br />
          {subText}
        </h2>
      

      <img
        src={bird1}
        className="parallax-item"
        style={{ top: scrollY * -1.5 + "px", left: `calc(50% + ${scrollY * 2}px)` }}
        alt="Bird 1"
      />
      <img
        src={bird2}
        className="parallax-item"
        style={{ top: scrollY * -1.5 + "px", left: `calc(50% - ${scrollY * 5}px)` }}
        alt="Bird 2"
      />
      <img
        src={forest}
        className="parallax-item"
        style={{ top: scrollY * 0.25 + "px" }}
        alt="Forest"
      />
      
      <img
        src={rocks}
        className="parallax-item"
        style={{ top: scrollY * -0.12 + "px" }}
        alt="Rocks"
      />
      <img src={water} className="parallax-item" alt="Water" />
    </div>
  );
};

export default ParallaxHero;
