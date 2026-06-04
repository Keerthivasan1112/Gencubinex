import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaHistory,
  FaUserShield,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
} from "recharts";

import "./Admin.css";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const [dark, setDark] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("usdt");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [adminUser, setAdminUser] = useState({
    name: "Admin 1",
    role: "master",
  });


const loadPrices = async () => {
  const res = await fetch("http://13.207.152.124:5299/api/coin");
  const data = await res.json();

  let temp = {
    usdt: { latest: 0, last: 0 },
    btc: { latest: 0, last: 0 },
    eth: { latest: 0, last: 0 },
    bnb: { latest: 0, last: 0 },
  };

  data.forEach((c) => {
    const coin = c.coinType.toLowerCase();

    temp[coin] = {
      latest: c.latest,
      last: c.last,
    };
  });

  setPrices(temp);
};

useEffect(() => {
  loadPrices();
}, []);
  const inputRef = useRef(null);

  const [inputPrices, setInputPrices] = useState({
    usdt: "",
    btc: "",
    eth: "",
    bnb: "",
  });

  const [prices, setPrices] = useState({
    usdt: { latest: 0, last: 0 },
    btc: { latest: 0, last: 0 },
    eth: { latest: 0, last: 0 },
    bnb: { latest: 0, last: 0 },
  });

  const [chartData, setChartData] = useState({
    usdt: [],
    btc: [],
    eth: [],
    bnb: [],
  });

  const coinColors = {
    usdt: "coin-card usdt-card",
    btc: "coin-card btc-card",
    eth: "coin-card eth-card",
    bnb: "coin-card bnb-card",
  };

  const lineColors = {
    usdt: "#00ff9f",
    btc: "#ffaa00",
    eth: "#ffffff",
    bnb: "#4da6ff",
  };

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ROLE CHECK
  const isMasterAdmin = adminUser.role === "master";
  const isAdmin2 = adminUser.role === "admin2";
  const isAdmin3 = adminUser.role === "admin3";

  // ✅ ACCESS CONTROL
  const hasFullAccess = isMasterAdmin || isAdmin2;
  const hasApprovalOnlyAccess = isAdmin3;

  const canSetPrice = hasFullAccess;
  const canAccessMessage = hasFullAccess;
  const canAccessHistory = hasFullAccess; // only admin1/admin2 can open
  const canShowHistory = hasFullAccess || hasApprovalOnlyAccess; // admin3 can see history
  const canAccessUserList = hasFullAccess;
  const canAccessApproval = hasFullAccess || hasApprovalOnlyAccess;

  // ✅ MENU BASED ON ROLE
  const menu = [
    ...(canAccessUserList
      ? [{ name: "User List", path: "/userlist", icon: <FaUsers /> }]
      : []),

    ...(canAccessApproval
      ? [{ name: "Approval", path: "/admin/approval", icon: <FaCheckCircle /> }]
      : []),

    ...(canShowHistory
      ? [{ name: "History", path: "/history", icon: <FaHistory /> }]
      : []),

    ...(canAccessMessage
      ? [{ name: "Message", path: "/message", icon: <FaEnvelope /> }]
      : []),
  ];

 const loadOrders = async () => {
  const res = await fetch("http://13.207.152.124:5299/api/coin/admin/all");
  const data = await res.json();
  setOrders(data);
};

const loadPendingUsers = async () => {
  const res = await fetch("http://13.207.152.124:5299/api/coin/pending");
  const data = await res.json();
  setPendingUsers(data);
};

  const loadAdminUser = () => {
    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (savedAdmin) {
      setAdminUser(savedAdmin);
    }
  };

  useEffect(() => {
    loadAdminUser();
    loadPendingUsers();
    loadOrders();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadAdminUser();
      loadPendingUsers();
      loadOrders();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    if (showPopup && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showPopup]);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAdminTitle = () => {
    if (isMasterAdmin) return "Master Admin";
    if (isAdmin2) return "Admin 2";
    if (isAdmin3) return "Admin 3";
    return adminUser.name;
  };

  const handleMenuClick = (item) => {
    if (item.name === "User List" && !canAccessUserList) {
      alert("You have no access to User List");
      return;
    }

    if (item.name === "Approval" && !canAccessApproval) {
      alert("You have no access to Approval");
      return;
    }

    if (item.name === "History" && !canAccessHistory) {
      alert("Admin 3 can view History card only. No access to open History page");
      return;
    }

    if (item.name === "Message" && !canAccessMessage) {
      alert("You have no access to Message");
      return;
    }

    if (item.name === "Approval") {
      setShowApprovalPanel(!showApprovalPanel);
    } else {
      setShowApprovalPanel(false);
      navigate(item.path);
    }
  };

const handleSet = async (coin) => {
  if (!canSetPrice) {
    alert("Only Admin 1 and Admin 2 can set price");
    return;
  }

  const value = Number(inputPrices[coin]);

  if (!value) {
    alert("Enter value");
    return;
  }

  try {
    await fetch("http://localhost:7085/api/coin/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coinType: coin,
        latest: value,
      }),
    });

    // 🔥 AUTO REFRESH
    await loadPrices();
    await loadChart();

    // 🔥 CLEAR INPUT
    setInputPrices({
      ...inputPrices,
      [coin]: "",
    });

    // 🔥 CLOSE POPUP
    setShowPopup(false);

  } catch (err) {
    console.log(err);
  }
};

const loadChart = async () => {
  const res = await fetch("http://13.207.152.124:5299/api/coin");
  const data = await res.json();

  let grouped = {
    usdt: [],
    btc: [],
    eth: [],
    bnb: [],
  };

  data.forEach((item) => {
    grouped[item.coinType.toLowerCase()].push({
      value: item.latest,
      fullTime: item.createdDate,
    });
  });

  setChartData(grouped);
};

useEffect(() => {
  loadChart();
}, []);


  return (
    <div className={`admin-wrapper ${dark ? "" : "light"}`}>
      <div className="topbar">
        <div className="top-left">
          <div className="logo" onClick={() => navigate("/admin")}>
            GENCUBINEX
          </div>
          <div className="home-btn" onClick={() => navigate("/admin")}>
            Home
          </div>
        </div>

        <div className="top-right">
          <div
            className="notification-bell"
            onClick={() => {
              if (!canAccessMessage) {
                alert("Admin 3 has no access to Message");
                return;
              }
              navigate("/message");
            }}
            title="Pending Approvals"
          >
            <FaBell />
            {pendingUsers.length > 0 && (
              <span className="notification-badge">
                {pendingUsers.length > 99 ? "99+" : pendingUsers.length}
              </span>
            )}
          </div>

          <div className="admin-name">
            <FaUserShield /> {getAdminTitle()}
          </div>

          <div className="toggle-btn" onClick={() => setDark(!dark)}>
            {dark ? "🌙" : "☀️"}
          </div>

          <div className="logout-btn" onClick={() => navigate("/signin")}>
            Logout
          </div>
        </div>
      </div>

      <div className="admin-body">
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </div>

          {menu.map((item, i) => (
            <div
              key={i}
              onClick={() => handleMenuClick(item)}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </div>
          ))}
        </div>

        {showApprovalPanel && canAccessApproval && (
          <div className={`approval-panel ${collapsed ? "small" : "large"}`}>
            <div className="panel-top">
              <button
                className="close-btn"
                onClick={() => setShowApprovalPanel(false)}
              >
                ✕
              </button>
            </div>

            <div className="panel-items">
              <div onClick={() => navigate("/all")}>All</div>
              <div onClick={() => navigate("/pending")}>Pending</div>
              <div onClick={() => navigate("/approved")}>Approved</div>
              <div onClick={() => navigate("/rejected")}>Rejected</div>
            </div>
          </div>
        )}

        <div className="content">
          {hasApprovalOnlyAccess && (
            <div className="approval-notice">
              Admin 3 Access: Approval only. Message, User List, Set Price access
              not allowed. History visible but cannot open.
            </div>
          )}

          <div className="dashboard-grid">
            <div
              className={`${coinColors[selectedCoin]} ${
                hasApprovalOnlyAccess ? "approval-view-card" : ""
              }`}
            >
              <h3>
                📊 {selectedCoin.toUpperCase()} Price{" "}
                {!canSetPrice && (
                  <span className="view-only-label">(View Only)</span>
                )}
              </h3>

              <LineChart width={520} height={260} data={chartData[selectedCoin]}>
                <defs>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={lineColors[selectedCoin]} />
                    <stop
                      offset="100%"
                      stopColor={lineColors[selectedCoin]}
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                <XAxis tick={false} axisLine={false} />
                <YAxis stroke="#aaa" />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="chart-tooltip">
                          <div>₹ {data.value}</div>
                          <div className="chart-tooltip-time">
                            {data.fullTime}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineGlow)"
                  strokeWidth={5}
                  dot={{
                    r: 5,
                    fill: lineColors[selectedCoin],
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 9,
                    fill: lineColors[selectedCoin],
                    stroke: "#fff",
                  }}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    offset={8}
                    className="chart-label-list"
                  />
                </Line>
              </LineChart>

              <div className="chart-bottom-label">
                Last 10 Days (2 updates/day)
              </div>
            </div>

            <div className="card">
              <h3>
                MARKET{" "}
                {!canSetPrice && (
                  <span className="view-only-label">(View Only)</span>
                )}
              </h3>

              <table className="price-table">
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Latest</th>
                    <th>Last</th>
                    <th>Change</th>
                  </tr>
                </thead>

                <tbody>
                  {["usdt", "btc", "eth", "bnb"].map((coin) => {
                    const latest = prices[coin].latest;
                    const last = prices[coin].last;
                    const change = latest - last;

                    return (
                      <tr
                        key={coin}
                        onClick={() => setSelectedCoin(coin)}
                        className={selectedCoin === coin ? "selected-row" : ""}
                      >
                        <td>{coin.toUpperCase()}</td>

                        <td
                          onClick={(e) => {
                            e.stopPropagation();

                            if (!canSetPrice) {
                              alert("You have no access to set price");
                              return;
                            }

                            setSelectedCoin(coin);
                            setShowPopup(true);
                          }}
                          className={
                            canSetPrice
                              ? "latest-price-cell latest-price-editable"
                              : "latest-price-cell latest-price-readonly"
                          }
                        >
                          {latest}
                        </td>

                        <td>{last}</td>

                        <td
                          className={
                            change >= 0 ? "change-positive" : "change-negative"
                          }
                        >
                          {change}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              className={`card pending-card ${
                hasApprovalOnlyAccess ? "pending-card-highlight" : ""
              }`}
              onClick={() => {
                if (!canAccessApproval) {
                  alert("You have no access to Approval");
                  return;
                }
                navigate("/pending");
              }}
            >
              <h3>
                ⏳ Pending Users{" "}
                {hasApprovalOnlyAccess && (
                  <span className="view-only-label">(Main Access)</span>
                )}
              </h3>

              {pendingUsers.length === 0 ? (
                <p>No Pending Users</p>
              ) : (
                <table className="admin-table">
                  <tbody>
                    {pendingUsers.map((user, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{user.pageName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {canShowHistory && (
              <div
                className={`card history-card ${
                  hasApprovalOnlyAccess ? "history-view-only-card" : ""
                }`}
                onClick={() => {
                  if (!canAccessHistory) {
                    alert("Admin 3 can view History card only. No access to open History page");
                    return;
                  }
                  navigate("/history");
                }}
              >
                <h3>
                  📜 History{" "}
                  {!canAccessHistory && (
                    <span className="view-only-label">(Visible Only)</span>
                  )}
                </h3>

                {orders.length === 0 ? (
                  <p>No Orders</p>
                ) : (
                  <table className="admin-table">
                    <tbody>
                      {orders.slice(0, 5).map((o, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{o.userName}</td>
                          <td
                            className={
                              o.type === "BUY"
                                ? "change-positive"
                                : "change-negative"
                            }
                          >
                            {o.type}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && canSetPrice && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Update {selectedCoin.toUpperCase()}</h3>

            <input
              ref={inputRef}
              type="number"
              value={inputPrices[selectedCoin] || ""}
              onChange={(e) =>
                setInputPrices({
                  ...inputPrices,
                  [selectedCoin]: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSet(selectedCoin);
                  setShowPopup(false);
                }
              }}
            />

            <div className="popup-actions">
            <button onClick={() => handleSet(selectedCoin)}>
  Save
</button>

              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;