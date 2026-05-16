import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Convert.css";
import "./Withdraw.css";
import {
  FiGrid, FiRepeat, FiArrowUp, FiArrowDown, FiFileText,
  FiHelpCircle, FiLogOut, FiChevronLeft, FiChevronRight,
  FiBell, FiMoon, FiUsers, FiBookOpen
} from "react-icons/fi";

const assets = [
  { symbol: "BTC", network: "Bitcoin", min: "0.0003 BTC" },
  { symbol: "BNB", network: "BNB Smart Chain", min: "0.01 BNB" },
  { symbol: "ETH", network: "ERC20", min: "0.005 ETH" },
  { symbol: "USDT", network: "TRC20", min: "10 USDT" },
];

function Withdraw() {
  const navigate = useNavigate();

  const [loginUserName, setLoginUserName] = useState("User");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData")) || {};
    const email = localStorage.getItem("userEmail") || "";

    const name =
      savedUserData.name ||
      savedUserData.fullName ||
      email.split("@")[0] ||
      "User";

    setLoginUserName(name);
  }, []);

  const userInitial = useMemo(
    () => loginUserName?.charAt(0)?.toUpperCase() || "U",
    [loginUserName]
  );

  const handleAssetChange = (e) => {
    const asset = assets.find((item) => item.symbol === e.target.value);
    setSelectedAsset(asset);
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
          <button className="gencubinex-nav-btn" onClick={() => navigate("/home")}>
            <FiGrid />
            <span>Dashboard</span>
          </button>

          <button className="gencubinex-nav-btn" onClick={() => navigate("/convert")}>
            <FiRepeat />
            <span>Convert</span>
          </button>

          <button className="gencubinex-nav-btn gencubinex-nav-btn-active">
            <FiArrowUp />
            <span>Withdraw</span>
          </button>

          <button className="gencubinex-nav-btn" onClick={() => navigate("/deposit")}>
            <FiArrowDown />
            <span>Deposit</span>
          </button>

          <button className="gencubinex-nav-btn" onClick={() => navigate("/transactions")}>
            <FiFileText />
            <span>Transactions</span>
          </button>

          <button className="gencubinex-nav-btn">
            <FiHelpCircle />
            <span>FAQs</span>
          </button>
        </nav>

        <div className="gencubinex-bottom-tools">
          <button className="gencubinex-logout-action" onClick={handleLogout}>
            <span>Logout</span>
            <FiLogOut />
          </button>

          <button
            className="gencubinex-collapse-action"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </aside>

      <section className="gencubinex-right-layout">
        <header className="gencubinex-top-header">
          <h1 className="gencubinex-user-greet">Withdraw</h1>

          <div className="gencubinex-header-right">
            <button className="gencubinex-header-icon-btn"><FiUsers /></button>
            <button className="gencubinex-header-icon-btn"><FiMoon /></button>
            <button className="gencubinex-header-icon-btn"><FiBell /></button>
            <button className="gencubinex-user-avatar-btn" onClick={() => navigate("/profile")}>
              {userInitial}
            </button>
          </div>
        </header>

        <main className="withdraw-content-area">
          <section className="withdraw-page-card">
            <div className="withdraw-form-area">
              <div className="withdraw-field">
                <label>Asset</label>
                <select value={selectedAsset.symbol} onChange={handleAssetChange}>
                  {assets.map((asset) => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div className="withdraw-field">
                <label>Network</label>
                <select value={selectedAsset.network} onChange={() => {}}>
                  <option>{selectedAsset.network}</option>
                </select>
              </div>

              <div className="withdraw-field">
                <label>Amount</label>
                <div className="withdraw-amount-box">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button type="button" onClick={() => setAmount("0")}>
                    Max
                  </button>
                </div>
                <p className="withdraw-balance">Avl Bal: 0</p>
              </div>

              <div className="withdraw-tabs">
                <button className="active">Withdrawal address</button>
                <button>MKX User</button>
              </div>

              <div className="withdraw-field">
                <label>{selectedAsset.symbol} Address</label>
                <div className="withdraw-address-box">
                  <input
                    type="text"
                    placeholder="Select Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <FiBookOpen />
                </div>
              </div>

              <p className="withdraw-2fa">Enable 2FA <span>i</span></p>

              <button className="withdraw-submit-btn">Withdraw</button>
            </div>

            <aside className="withdraw-note-card">
              <h3>Important Note</h3>
              <p>
                Do not withdraw directly to a crowdfund or ICO address, as your
                account will not be credited with tokens from such sales.
              </p>
              <p><b>Minimum Withdraw Amount:</b> {selectedAsset.min}</p>
              <p>
                <span>Note:</span> Withdraw only {selectedAsset.symbol} to this address.
                Sending any other coin or tokens may result in loss of assets.
              </p>
            </aside>
          </section>
        </main>
      </section>
    </div>
  );
}

export default Withdraw;