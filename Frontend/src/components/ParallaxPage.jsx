import React, { useEffect, useState } from "react";
import "../styles/ParallaxPage.css";

const Parallax = () => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="parallax-container">
      {/* Background (Cliff) - Doesn't Move */}
      <div className="parallax-background"></div>

      {/* Foreground (Leaves) - Moves Slowly */}
      <div
        className="parallax-foreground"
        style={{ transform: `translateY(${offsetY * 0.2}px)` }}
      ></div>

      {/* Centered Text */}
      <div className="parallax-content">The Story of THE GOONIES</div>
    </div>
  );
};

export default Parallax;
