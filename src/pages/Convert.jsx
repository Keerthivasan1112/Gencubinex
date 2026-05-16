import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Convert.css";
import {
  FiGrid, FiRepeat, FiArrowUp, FiArrowDown, FiFileText,
  FiHelpCircle, FiLogOut, FiChevronLeft, FiChevronRight,
  FiBell, FiMoon, FiUsers
} from "react-icons/fi";

const coins = [
  { symbol: "BTC", name: "Bitcoin", priceINR: 5600000 },
  { symbol: "BNB", name: "Binance Coin", priceINR: 52000 },
  { symbol: "ETH", name: "Ethereum", priceINR: 285000 },
  { symbol: "USDT", name: "Tether", priceINR: 83.5 },
];

function Convert() {
  const navigate = useNavigate();

  const [loginUserName, setLoginUserName] = useState("User");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData")) || {};
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const savedEmail =
      localStorage.getItem("userEmail") ||
      savedUserData.email ||
      savedUserData.loginEmail ||
      "";

    const matchedUser = savedUsers.find(
      (user) => user.email?.toLowerCase() === savedEmail.toLowerCase()
    );

    let finalName =
      savedUserData.name ||
      savedUserData.fullName ||
      matchedUser?.name ||
      matchedUser?.fullName ||
      "";

    if (!finalName && savedEmail) {
      finalName = savedEmail
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    setLoginUserName(finalName || "User");
  }, []);

  const userInitial = useMemo(
    () => loginUserName?.charAt(0)?.toUpperCase() || "U",
    [loginUserName]
  );

  const inrValue = useMemo(() => {
    const value = Number(amount || 0) * selectedCoin.priceINR;

    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  }, [amount, selectedCoin]);

  const handleCoinChange = (e) => {
    const coin = coins.find((item) => item.symbol === e.target.value);
    setSelectedCoin(coin);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
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
          <button
            className="gencubinex-nav-btn"
            type="button"
            onClick={() => navigate("/home")}
          >
            <FiGrid />
            <span>Dashboard</span>
          </button>

          <button
            className="gencubinex-nav-btn gencubinex-nav-btn-active"
            type="button"
          >
            <FiRepeat />
            <span>Convert</span>
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
            onClick={handleLogout}
          >
            <span>Logout</span>
            <FiLogOut />
          </button>

          <button
            className="gencubinex-collapse-action"
            type="button"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </aside>

      <section className="gencubinex-right-layout">
        <header className="gencubinex-top-header">
          <h1 className="gencubinex-user-greet">
            Hello, <span>{loginUserName}</span>
          </h1>

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
          <section className="convert-page-ui">
            <div className="convert-left-content">
              <h1>
                Seamlessly <br />
                Convert <br />
                <span>Crypto</span> to <span>Fiat</span>
              </h1>

              <p>
                Convert BTC, BNB, ETH and USDT to INR instantly with our secure,
                fast, and reliable platform.
              </p>
            </div>

            <div className="convert-box">
              <div className="convert-input-column">
                <label>You Pay</label>

                <div className="amount-row">
                  <input
                    type="number"
                    value={amount}
                    placeholder="0"
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <select
                    className="coin-dropdown"
                    value={selectedCoin.symbol}
                    onChange={handleCoinChange}
                  >
                    {coins.map((coin) => (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="inr-preview">≈ {inrValue}</p>

                <div className="receive-box">
                  <label>You Receive</label>
                  <h2>{inrValue}</h2>
                  <span>INR Value</span>
                </div>

                <button className="preview-btn" type="button">
                  Preview
                </button>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}

export default Convert;