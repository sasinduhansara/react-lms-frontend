// StatsSection.jsx
import React from "react";
import "./StatsSection.css";

const StatsSection = () => {
  const stats = [
    { value: "45", label: "LEARNERS" },
    { value: "660", label: "GRADUATES" },
    { value: "35", label: "COUNTRIES RESEARCHED" },
    { value: "170", label: "COURSES PUBLISHED" },
  ];

  return (
    <div className="stats-section-wrapper">
        <div className="stats-section">
            {stats.map((stat, index) => (
             <div key={index} className="stat-card">
                 <div className="stat-value">{stat.value}</div>
                 <div className="stat-label">{stat.label}</div>
            </div>
            ))}
        </div>
    </div>
  );
};

export default StatsSection;
