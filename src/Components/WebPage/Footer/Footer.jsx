import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Footer() {
  return (
    <footer id="about-section" className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>SLIATE</h2>
          <p>Contact: (00)123456789</p>
          <p>Email: edums@gmail.com</p>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>Blog</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Contact Teacher</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li>Home</li>
            <li>Course</li>
            <li>Blog</li>
            <li>Activity</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Recommend</h4>
          <ul>
            <li>Technology</li>
            <li>Background</li>
            <li>Language</li>
            <li>CSS</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
