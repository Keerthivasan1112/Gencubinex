import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import {
  FiGrid,
  FiRepeat,
  FiArrowUp,
  FiArrowDown,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiMoon,
  FiUsers,
  FiInbox,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

function MainPage() {
  const [loginUserName, setLoginUserName] = useState("User");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData")) || {};
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const savedEmail =
      localStorage.getItem("userEmail") ||
      savedUserData.email ||
      savedUserData.loginEmail ||
      "";

    let finalName = "";

    if (savedUserData.name) {
      finalName = savedUserData.name;
    } else if (savedUserData.fullName) {
      finalName = savedUserData.fullName;
    } else if (savedEmail) {
      const matchedUser = savedUsers.find(
        (item) => item.email?.toLowerCase() === savedEmail.toLowerCase()
      );

      if (matchedUser?.name) {
        finalName = matchedUser.name;
      } else if (matchedUser?.fullName) {
        finalName = matchedUser.fullName;
      } else {
        const emailPrefix = savedEmail.split("@")[0];
        finalName = emailPrefix
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }
    }

    setLoginUserName(finalName || "User");
  }, []);

  const userInitial = useMemo(() => {
    return loginUserName?.charAt(0)?.toUpperCase() || "U";
  }, [loginUserName]);

  const gencubinexPortfolio = [
    {
      name: "USD",
      price: "$0.27",
      amount: "0",
      value: "$0",
      icon: "Ð",
      color: "gen-red",
    },
    {
      name: "BTH",
      price: "$0.12",
      amount: "0",
      value: "$0",
      icon: "A",
      color: "gen-blue",
    },
    {
      name: "BNB",
      price: "$640.03",
      amount: "0",
      value: "$0",
      icon: "B",
      color: "gen-gold",
    },
    {
      name: "ETH",
      price: "$77,552.11",
      amount: "0",
      value: "$0",
      icon: "₿",
      color: "gen-orange",
    },
  ];

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleOpenLogoutPopup = () => {
    setShowLogoutPopup(true);
  };

  const handleCloseLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    setShowLogoutPopup(false);
    navigate("/login");
  };

  return (
    <>
      <div className="gencubinex-main-shell">
        <aside
          className={`gencubinex-left-panel ${
            isSidebarCollapsed ? "gencubinex-left-panel-collapsed" : ""
          }`}
        >
          <div className="gencubinex-brand-block">
            <h2 className="gencubinex-brand-title">GENCUBINEX</h2>
          </div>

          <nav className="gencubinex-nav-wrap">
            <button className="gencubinex-nav-btn gencubinex-nav-btn-active" type="button">
              <FiGrid />
              <span>Dashboard</span>
            </button>

            <button className="gencubinex-nav-btn" type="button" onClick={() => navigate("/convert")}>
              <FiRepeat />
              <span >Convert</span>
            </button>

            <button className="gencubinex-nav-btn" type="button" onClick={() => navigate("/withdraw")}>
              <FiArrowUp />
              <span>Withdraw</span>
            </button>

            <button className="gencubinex-nav-btn" type="button">
              <FiArrowDown />
              <span>Deposit</span>
            </button>

            <button className="gencubinex-nav-btn" type="button" onClick={() => navigate("/transactions")}>
              <FiFileText />
              <span>Transactions</span>
            </button>

            <button className="gencubinex-nav-btn" type="button">
              <FiHelpCircle />
              <span>FAQs</span>
            </button>
          </nav>

          <div className="gencubinex-bottom-tools">
            <button
              className="gencubinex-logout-action"
              type="button"
              onClick={handleOpenLogoutPopup}
            >
              <span>Logout</span>
              <FiLogOut />
            </button>

            <button
              className="gencubinex-collapse-action"
              onClick={handleSidebarToggle}
              type="button"
            >
              {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>
        </aside>

        <section className="gencubinex-right-layout">
          <header className="gencubinex-top-header">
            <div className="gencubinex-header-left">
              <h1 className="gencubinex-user-greet">
                Hello, <span>{loginUserName}</span>
              </h1>
            </div>

            <div className="gencubinex-header-right">
              <button className="gencubinex-header-icon-btn" type="button">
                <FiUsers />
              </button>

              <button className="gencubinex-header-icon-btn" type="button">
                <FiMoon />
              </button>

              <button className="gencubinex-header-icon-btn" type="button">
                <FiBell />
              </button>

              <button
                className="gencubinex-user-avatar-btn"
                type="button"
                onClick={() => navigate("/profile")}
              >
                {userInitial}
              </button>
            </div>
          </header>

          <main className="gencubinex-dashboard-body">
            <div className="gencubinex-dashboard-grid">
              <section className="gencubinex-balance-card">
                <div className="gencubinex-balance-top-row">
                  <div className="gencubinex-balance-text-wrap">
                    <p className="gencubinex-balance-label">Total Balance</p>
                    <h2 className="gencubinex-balance-value">0.00</h2>
                  </div>

                  <select className="gencubinex-currency-select">
                    <option>INR</option>
                    <option>AED</option>
                    <option>USD</option>
                    
                  </select>
                </div>

                <div className="gencubinex-balance-actions">
                  <button className="gencubinex-balance-action-btn" type="button">
                    <FiRepeat />
                    <span>Convert</span>
                  </button>

                  <button className="gencubinex-balance-action-btn" type="button">
                    <FiArrowUp />
                    <span>Withdraw</span>
                  </button>

                  <button className="gencubinex-balance-action-btn" type="button">
                    <FiArrowDown />
                    <span>Deposit</span>
                  </button>
                </div>
              </section>

              <section className="gencubinex-portfolio-card">
                <div className="gencubinex-card-head-row">
                  <h3 className="gencubinex-card-title">Portfolio</h3>
                  <span className="gencubinex-card-view-link">View All</span>
                </div>

                <div className="gencubinex-portfolio-list-wrap">
                  {gencubinexPortfolio.map((coin, index) => (
                    <div className="gencubinex-portfolio-item" key={index}>
                      <div className={`gencubinex-coin-badge ${coin.color}`}>
                        {coin.icon}
                      </div>

                      <div className="gencubinex-coin-content">
                        <h4 className="gencubinex-coin-name">{coin.name}</h4>
                        <p className="gencubinex-coin-price">{coin.price}</p>
                        <strong className="gencubinex-coin-value">
                          {coin.value}
                        </strong>
                      </div>

                      <div className="gencubinex-coin-side-data">
                        <span className="gencubinex-coin-amount">
                          {coin.amount}
                        </span>
                        <small className="gencubinex-coin-side-value">
                          {coin.value}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="gencubinex-transactions-card">
                <div className="gencubinex-card-head-row">
                  <h3 className="gencubinex-card-title">Transactions</h3>
                  <span className="gencubinex-card-view-link" onClick={() => navigate("/transactions")}>View All</span>
                </div>

                <div className="gencubinex-empty-state-box">
                  <FiInbox />
                  <p>No Transactions</p>
                </div>
              </section>
            </div>
          </main>
        </section>
      </div>

      {showLogoutPopup && (
        <div className="gencubinex-logout-overlay" onClick={handleCloseLogoutPopup}>
          <div
            className="gencubinex-logout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gencubinex-logout-close"
              onClick={handleCloseLogoutPopup}
            >
              <FiX />
            </button>

            <div className="gencubinex-logout-icon-wrap">
              <FiAlertTriangle />
            </div>

            <h3 className="gencubinex-logout-title">Confirm Logout</h3>
            <p className="gencubinex-logout-text">
              Are you sure you want to logout from your account?
            </p>

            <div className="gencubinex-logout-btn-row">
              <button
                type="button"
                className="gencubinex-logout-cancel-btn"
                onClick={handleCloseLogoutPopup}
              >
                Cancel
              </button>

              <button
                type="button"
                className="gencubinex-logout-confirm-btn"
                onClick={handleConfirmLogout}
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainPage;