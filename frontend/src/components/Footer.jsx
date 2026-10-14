import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="JobGenie" className="footer-logo" />
          <p>Connecting talent with opportunity.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>For Employers</h4>
          <ul>
            <li><Link to="/post-job">Post a Job</Link></li>
            <li><Link to="/my-jobs">My Jobs</Link></li>
            <li><Link to="/applications">View Applications</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="GitHub"><FaGithub /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} JobGenie. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
