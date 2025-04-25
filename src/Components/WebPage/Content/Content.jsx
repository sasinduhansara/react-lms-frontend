import React from "react";
import { useNavigate } from "react-router-dom";
import MainTabs from "../MainTabs/MainTabs";
import "./Content.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate("/login"); // This routes to LoginPage
  };

  return (
    <div className="hero-section">
    
     <MainTabs />
    
      {/* Hero Content Box */}
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to Our Online <br /> Learning Portal
        </h1>
        <p>
          Unlock your potential with our innovative online learning platform
        </p>
        <button className="hero-button" onClick={handleStartLearning}>
          Start Learning Now
        </button>

        <div className="hero-highlights">
          <p><strong>Best Courses</strong></p>
          <p><strong>Learn Online</strong></p>
          <p><strong>Book Library</strong></p>
        </div>
      </div>
      
    </div>
  );
};

export default Hero;
