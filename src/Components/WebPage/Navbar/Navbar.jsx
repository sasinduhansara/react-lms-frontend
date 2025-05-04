// Navbar.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <div className="navbar-email">
          <FaEnvelope />
          <a href="mailto:info@rjt.ac.lk" className="navbar-link"> info@rjt.ac.lk</a>
        </div>
        <div className="vertical-line"></div>
        <div className="navbar-number">
          <FaPhone />
          <a href="tel:+94252266643" className="navbar-link">+94 (25) 2266643</a>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-location">
          <FaMapMarkerAlt />
          <span> No.22/1, Wilgoda Road, Kurunagala </span>
        </div>
        <div className="vertical-line"></div>
        <div className="navbar-icons">
          <a href="https://web.facebook.com/sliate.ac.lk?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="navbar-icon spaced-icon" />
          </a>
          <a href="https://www.instagram.com/sliateofficial/#" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="navbar-icon spaced-icon" />
          </a>
          <a href="https://www.youtube.com/channel/UCJJJCxCU9FDbyGmOfWfzdpA" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="navbar-icon spaced-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
