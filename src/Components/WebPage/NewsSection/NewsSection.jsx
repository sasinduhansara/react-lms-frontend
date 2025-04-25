// src/components/LatestNews.js

import React from 'react';
import './NewsSection.css';

const newsItems = [
  {
    title: 'Relaxing',
    description: 'Why you should read every day',
    image: '/CoursesCart/lms1.jpg',
  },
  {
    title: 'Listing',
    description: 'Relaxing after work',
    image: '/CoursesCart/lms2.png',
  },
  {
    title: 'Reading',
    description: 'Online earning grocery',
    image: '/CoursesCart/lms3.jpg',
  },
];

function LatestNews() {
  return (
    <div className="news-container">
    <h2 className="news-heading-first">This lists the key features of an LMS: storing and organizing learning materials, monitoring learner progress, and facilitating communication between learners and educators.</h2>
      <h2 className="news-heading-second">Latest News</h2>
      <div className="news-cards">
        {newsItems.map((item, index) => (
          <div className="news-card" key={index}>
            <div className="news-card shadow-sm p-3 rounded text-center">
            <img src={item.image} alt={item.title} className="news-image mb-3 rounded"/>
            <div className="news-text">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestNews;
