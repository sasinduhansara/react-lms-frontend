import React from "react";
import "./MainTabs.css";

const MainTabs = () => {
  // scroll function එක මෙහි define කරන්න
  const handleTabClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-tabs-container">
      <button className="hero-tab" onClick={() => handleTabClick("home-section")}>Home</button>
      <button className="hero-tab" onClick={() => handleTabClick("about-section")}>About</button>
      <button className="hero-tab" onClick={() => handleTabClick("courses-section")}>Courses</button>
      <button className="hero-tab" onClick={() => handleTabClick("contact-section")}>Contact</button>
    </div>
  );
};

export default MainTabs;
