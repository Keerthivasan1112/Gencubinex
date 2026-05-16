import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";
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
  FiCalendar,
  FiInbox,
} from "react-icons/fi";

function Transactions() {
  const navigate = useNavigate();

  const [loginUserName, setLoginUserName] = useState("User");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currency, setCurrency] = useState("ALL CURRENCIES");
  const [type, setType] = useState("ALL TRANSACTIONS");

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

    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) ||
      JSON.parse(localStorage.getItem("orders")) ||
      [];

    setTransactions(savedTransactions);
  }, []);

  const userInitial = useMemo(
    () => loginUserName?.charAt(0)?.toUpperCase() || "U",
    [loginUserName]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txCurrency = tx.currency || tx.coin || tx.symbol || "USDT";
      const txType = tx.type || tx.orderType || tx.action || "Convert";
      const txDateValue = tx.date || tx.createdAt || tx.time || "";

      const matchCurrency =
        currency === "ALL CURRENCIES" ||
        txCurrency.toUpperCase() === currency.toUpperCase();

      const matchType =
        type === "ALL TRANSACTIONS" ||
        txType.toLowerCase() === type.toLowerCase();

      const txDate = txDateValue ? new Date(txDateValue) : null;
      const afterStart = startDate && txDate ? txDate >= new Date(startDate) : true;
      const beforeEnd = endDate && txDate ? txDate <= new Date(endDate) : true;

      return matchCurrency && matchType && afterStart && beforeEnd;
    });
  }, [transactions, startDate, endDate, currency, type]);

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
          <button className="gencubinex-nav-btn" type="button" onClick={() => navigate("/home")}>
            <FiGrid />
            <span>Dashboard</span>
          </button>

          <button className="gencubinex-nav-btn" type="button" onClick={() => navigate("/convert")}>
            <FiRepeat />
            <span>Convert</span>
          </button>

          <button className="gencubinex-nav-btn" type="button" onClick={() => navigate("/withdraw")}>
            <FiArrowUp />
            <span>Withdraw</span>
          </button>

          <button className="gencubinex-nav-btn" type="button" onClick={() => navigate("/deposit")}>
            <FiArrowDown />
            <span>Deposit</span>
          </button>

          <button className="gencubinex-nav-btn gencubinex-nav-btn-active" type="button">
            <FiFileText />
            <span>Transactions</span>
          </button>

          <button className="gencubinex-nav-btn" type="button">
            <FiHelpCircle />
            <span>FAQs</span>
          </button>
        </nav>

        <div className="gencubinex-bottom-tools">
          <button className="gencubinex-logout-action" type="button" onClick={handleLogout}>
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
          <h1 className="gencubinex-user-greet">Transactions</h1>

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
          <section className="transactions-page-ui">
            <div className="transactions-top-row">
              <h2>Recent Transactions</h2>

              <div className="transactions-filter-row">
                <div className="transaction-date-box">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={startDate}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <FiCalendar />
                </div>

                <div className="transaction-date-box">
                  <input
                    type="text"
                    placeholder="End Date"
                    value={endDate}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <FiCalendar />
                </div>

                <select
                  className="transaction-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option>ALL CURRENCIES</option>
                  <option>BTC</option>
                  <option>BNB</option>
                  <option>ETH</option>
                  <option>USDT</option>
                  <option>INR</option>
                </select>

                <select
                  className="transaction-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>ALL TRANSACTIONS</option>
                  <option>Deposit</option>
                  <option>Withdraw</option>
                  <option>Convert</option>
                  <option>Buy</option>
                  <option>Sell</option>
                </select>
              </div>
            </div>

            <div className="transactions-table-card">
              <div className="transactions-table-head">
                <span>Type</span>
                <span>Currency</span>
                <span>Amount</span>
                <span>State</span>
                <span>Date & Time</span>
                <span>Action</span>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="transactions-empty-box">
                  <FiInbox />
                  <p>No Transactions</p>
                </div>
              ) : (
                filteredTransactions.map((tx, index) => (
                  <div className="transactions-table-row" key={index}>
                    <span>{tx.type || tx.orderType || tx.action || "Convert"}</span>
                    <span>{tx.currency || tx.coin || tx.symbol || "USDT"}</span>
                    <span>{tx.amount || tx.qty || tx.total || "0"}</span>
                    <span>{tx.state || tx.status || "Completed"}</span>
                    <span>{tx.date || tx.createdAt || tx.time || "-"}</span>
                    <span>
                      <button className="transaction-view-btn">View</button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}

export default Transactions;