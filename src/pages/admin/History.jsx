import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaHistory,
  FaUserShield,
  FaEnvelope,
  FaBars,
  FaBell,
} from "react-icons/fa";
import "./History.css";

function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [dark, setDark] = useState(true);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [adminUser, setAdminUser] = useState({
    name: "Admin 1",
    role: "master",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const isMasterAdmin = adminUser.role === "master";

  const menu = [
    { name: "User List", path: "/userlist", icon: <FaUsers /> },
    { name: "Approval", path: "/approval", icon: <FaCheckCircle /> },
    { name: "History", path: "/history", icon: <FaHistory /> },
    { name: "Message", path: "/message", icon: <FaEnvelope /> },
  ];


   const loadOrders = async () => {
  const res = await fetch("https://localhost:7085/api/coin/admin/all");
  const data = await res.json();
  setOrders(data);
};

 useEffect(() => {
    loadOrders();
  }, []);


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    //setOrders(data);

    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (savedAdmin) setAdminUser(savedAdmin);

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    // setPendingUsers(allUsers.filter((user) => user.status === "Pending"));
  }, []);

  const handleMenuClick = (item) => {
    if (item.name === "Approval") {
      setShowApprovalPanel(!showApprovalPanel);
    } else {
      setShowApprovalPanel(false);
      navigate(item.path);
    }
  };

  return (
    <div className={`all-page ${dark ? "" : "light"}`}>
      <div className="all-topbar">
        <div className="all-top-left">
          <div className="all-logo" onClick={() => navigate("/admin")}>
            GENCUBINEX
          </div>

          <div className="all-home-btn" onClick={() => navigate("/admin")}>
            Home
          </div>
        </div>

        <div className="top-right">
          <div
            className="notification-bell"
            onClick={() => navigate("/message")}
            title="Pending Approvals"
          >
            <FaBell />
            {pendingUsers.length > 0 && (
              <span className="notification-badge">
                {pendingUsers.length > 99 ? "99+" : pendingUsers.length}
              </span>
            )}
          </div>

          <div className="all-admin">
            <FaUserShield /> {isMasterAdmin ? "Master Admin" : adminUser.name}
          </div>

          <div className="all-toggle" onClick={() => setDark(!dark)}>
            {dark ? "🌙" : "☀️"}
          </div>

          <div className="all-logout" onClick={() => navigate("/")}>
            Logout
          </div>
        </div>
      </div>

      <div className="all-body">
        <div className={`all-sidebar ${collapsed ? "collapsed" : ""}`}>
          <div
            className="all-collapse-btns"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </div>

          {menu.map((item, i) => (
            <div
              key={i}
              onClick={() => handleMenuClick(item)}
              className={`all-menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="all-icon">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
              {collapsed && <span className="all-tooltip">{item.name}</span>}
            </div>
          ))}
        </div>

        {showApprovalPanel && (
          <div className={`all-panel ${collapsed ? "small" : "large"}`}>
            <div className="all-panel-top">
              <button
                className="all-close-btn"
                onClick={() => setShowApprovalPanel(false)}
              >
                ✕
              </button>
            </div>

            <div className="all-panel-items">
              <div onClick={() => navigate("/all")}>All</div>
              <div onClick={() => navigate("/pending")}>Pending</div>
              <div onClick={() => navigate("/approved")}>Approved</div>
              <div onClick={() => navigate("/rejected")}>Rejected</div>
            </div>
          </div>
        )}

        <div className="all-content">
          <div className="history-container">
            <h2 className="history-title">📜 Order History</h2>

            <div className="history-table-box">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>USDT</th>
                    <th>INR</th>
                    <th>Fee</th>
                    <th>Txn ID</th>
                    
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No History Available
                      </td>
                    </tr>
                  ) : (
                    orders.map((o, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{o.userName || "-"}</td>
 <td>
                          {o.createdDate
                            ? new Date(o.createdDate).toLocaleString()
                            : "-"}
                        </td>
                        <td className={o.type === "BUY" ? "buy-text" : "sell-text"}>
                          {o.type || "-"}
                        </td>

                        <td>{o.orderValueUSDT || "-"}</td>
                        <td>₹{o.orderValueINR || "-"}</td>
                        <td>₹{o.feeINR || "-"}</td>
                        <td>{o.txnId || "-"}</td>
                       
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;