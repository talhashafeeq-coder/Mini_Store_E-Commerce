import React, { useEffect } from "react";
import "../Style/Footerstyle.css";  // CSS file import ki hai
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"; // Social icons
import AOS from 'aos';  // Animate On Scroll library
import 'aos/dist/aos.css';

const Footer = () => {
  const year = new Date().getFullYear();  // Current year nikal liya

  useEffect(() => {
    AOS.init({ duration: 1000 });  // Animation initialize kiya 1 second duration ke sath
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo aur Description */}
        <div className="footer-section" data-aos="zoom-in">
          <h2 className="footer-logo">UltraTech</h2>
          <p className="footer-description">
            Elevate your workflow with modern solutions that drive performance and delight users.
          </p>
        </div>

        {/* Product Links */}
        <div className="footer-section">
          <h4 className="footer-title">Product</h4>
          <ul className="footer-links">
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Integrations</a></li>
            <li><a href="#">Case Studies</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-section">
          <h4 className="footer-title">Support</h4>
          <ul className="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Status</a></li>
          </ul>
        </div>

        {/* Social Media Icons + Newsletter Form */}
        <div className="footer-section">
          <h4 className="footer-title">Stay Connected</h4>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
          <form className="footer-form">
            <input type="email" placeholder="Your email" className="footer-input" />
            <button type="submit" className="footer-button">Subscribe</button>
          </form>
        </div>

      </div>

      {/* Bottom copyright */}
      <div className="footer-bottom">
        © {year} UltraTech. All rights reserved.
        <a href="#">Privacy</a> | <a href="#">Terms</a>
      </div>
    </footer>
  );
};

export default Footer;
