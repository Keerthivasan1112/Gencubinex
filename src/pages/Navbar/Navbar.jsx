import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const [openUser, setOpenUser] = useState(false);
  const userRef = useRef();

  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(500000);

  // LOAD DATA
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) setUserData(JSON.parse(savedUser));

    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // CALCULATIONS
  const totalBuyUSDT = orders
    .filter(o => o.type === "BUY")
    .reduce((sum, o) => sum + o.qty, 0);

  const totalSellUSDT = orders
    .filter(o => o.type === "SELL")
    .reduce((sum, o) => sum + o.qty, 0);

  const totalBuyINR = orders
    .filter(o => o.type === "BUY")
    .reduce((sum, o) => sum + o.total, 0);

  const totalSellINR = orders
    .filter(o => o.type === "SELL")
    .reduce((sum, o) => sum + o.total, 0);

  // NAVIGATION
  const goHome = () => navigate("/");
  const goTrade = () => navigate("/trade");
  const goDashboard = () => navigate("/dashboard");
  const goWallet = () => navigate("/wallet");

  const goProfileReview = () => {
    setOpenUser(false); // ✅ dropdown close
    navigate("/review"); // ✅ navigate
  };

  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">

      <div className="logo" onClick={goHome}>
        GENCUBINEX
      </div>

      <div className="nav-links">
        <span onClick={goTrade}>OTC Trade</span>
        <span onClick={goDashboard}>Dashboard</span>
        <span onClick={goWallet}>Wallet</span>
      </div>

      <div className="user-box" ref={userRef}>

        <div 
          className="user-trigger"
          onClick={() => setOpenUser(!openUser)}
        >
          <div className="avatar">
            {userData?.pageName
              ? userData.pageName.charAt(0).toUpperCase()
              : "G"}
          </div>

          <span className="email-text">
            {userData?.email || "Guest"}
          </span>

          <span className={`arrow ${openUser ? "rotate" : ""}`}>
            ▼
          </span>
        </div>

        {openUser && (
          <div className="user-dropdown">

            {/* 💰 BALANCE */}
            <div className="dropdown-section balance-box">
              <strong>₹{balance.toLocaleString()}</strong>
              <span>Available Balance</span>
            </div>

            {/* 👤 PERSONAL (CLICKABLE 🔥) */}
            <div 
              className="dropdown-section clickable"
              onClick={goProfileReview}
              style={{ cursor: "pointer" }}
            >
              <h4> Personal Details</h4>
            </div>

            {/* 🏦 BANK */}
            <div className="dropdown-section">
              <h4> Bank Details</h4>
            </div>

            {/* 📊 TRADING */}
            <div className="dropdown-section">
              <h4> Translate History</h4>
            </div>

            <div className="logout" onClick={logoutUser}>
              🚪 Logout
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Navbar;