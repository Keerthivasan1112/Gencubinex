import React, { useState } from "react";
import "./Home.css";
import logo from '../assets/logovi.mp4';
import { useNavigate } from "react-router-dom";
import logos from '../assets/log.svg';
import log from '../assets/lo.png';

function Home() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleJoinOTC = () => {
    setShowPopup(true);
  };

  const handleConfirmSignup = () => {
    setShowPopup(false);
    navigate("/signup");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      
      {/* WELCOME ANIMATION */}
      <div className="welcome-banner">
        <h1 className="welcome-text">
          <h1> Welcome To</h1>
          <span>GENCUBINEX</span>
        </h1>
      </div>

      {/* NAVBAR */}
      <nav className="navbars">
        <div className="log">
           <div className="logo">
              <div className="logo">
                <video 
                  src={logo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="logo-video"
                />
              <h2>GENCUBINEX</h2>
              </div>
              </div>  
        </div>

        <ul className="nav-links">
          <li className="active">Home</li>
          <li>OTC Trade</li>
          <li>Dashboard</li>
        </ul>

        <div className="nav-right">
          <button className="theme-btn">🌙</button>
         <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="hero-section">
        
        <div className="hero-left">
          <h1>
            Move Millions in Crypto with <br />
            Confidence <br />
            <span className="highlight">INOCYX</span> OTC Made for you.
          </h1>

          <p>
            INOCYX delivers high-performance OTC and execution solutions 
            tailored for private and institutional clients. With advanced 
            technology and professional service, we’re the trusted choice 
            for large-volume trades, secure settlements, and competitive pricing.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Login to OTC</button>
            <button className="secondary-btn" onClick={handleJoinOTC}>Join OTC</button>
          </div>
        </div>

        <div className="hero-right">
          <img src={log} alt="Dashboard Preview" />
        </div>

      </div>

      {/* SIGNUP CONFIRMATION POPUP */}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Join GENCUBINEX</h2>
              <button className="popup-close" onClick={handleClosePopup}>✕</button>
            </div>
            <div className="popup-body">
              <p>Are you ready to join GENCUBINEX and access our OTC trading platform?</p>
              <p className="popup-description">You'll need to provide your personal and identification details to proceed.</p>
            </div>
            <div className="popup-footer">
              <button className="popup-cancel-btn" onClick={handleClosePopup}>Cancel</button>
              <button className="popup-confirm-btn" onClick={handleConfirmSignup}>Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


export default Home;