import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaHistory,
  FaUserShield,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";
import "./Rejected.css";

function Rejected() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [dark, setDark] = useState(true);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filePopup, setFilePopup] = useState(null);

  const [adminUser, setAdminUser] = useState({
    name: "Admin 1",
    role: "master",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ROLE CHECK
  const isMasterAdmin = adminUser.role === "master";
  const isAdmin2 = adminUser.role === "admin2";
  const isAdmin3 = adminUser.role === "admin3";

  // ✅ ACCESS CONTROL
  const hasFullAccess = isMasterAdmin || isAdmin2;
  const hasApprovalOnlyAccess = isAdmin3;

  const canAccessUserList = hasFullAccess;
  const canAccessApproval = hasFullAccess || hasApprovalOnlyAccess;
  const canAccessHistory = hasFullAccess;
  const canShowHistory = hasFullAccess || hasApprovalOnlyAccess;
  const canAccessMessage = hasFullAccess;

  // ✅ MENU BASED ON ROLE
  const menu = [
    ...(canAccessUserList
      ? [{ name: "User List", path: "/userlist", icon: <FaUsers /> }]
      : []),

    ...(canAccessApproval
      ? [{ name: "Approval", path: "/approval", icon: <FaCheckCircle /> }]
      : []),

    ...(canShowHistory
      ? [{ name: "History", path: "/history", icon: <FaHistory /> }]
      : []),

    ...(canAccessMessage
      ? [{ name: "Message", path: "/message", icon: <FaEnvelope /> }]
      : []),
  ];

  const loadAdminUser = () => {
    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (savedAdmin) {
      setAdminUser(savedAdmin);
    }
  };


const downloadFile = (path, name) => {
  if (!path) {
    alert("No file");
    return;
  }

  const fileUrl = `https://localhost:7085/api/coin/file?path=${encodeURIComponent(path)}`;
  const ext = name.split(".").pop().toLowerCase();

  setFilePopup({
    url: fileUrl,
    name,
    type: ext,
  });
};

  const loadRejectedUsers = async () => {
    //const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const res = await fetch("https://localhost:7085/api/coin/rejected");
    const data = await res.json();
    const rejected = data.filter((u) => u.status === "Rejected");
    setUsers(data);
  };

  const loadPendingUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    // const pending = allUsers.filter((u) => u.status === "Pending");
    // setPendingUsers(pending);
  };

  useEffect(() => {
    loadAdminUser();
    loadRejectedUsers();
    loadPendingUsers();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadAdminUser();
      loadRejectedUsers();
      loadPendingUsers();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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
      alert("Admin 3 can view History only. No access to open History page");
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

const updateStatus = async (status) => {
  await fetch("https://localhost:7085/api/coin/update-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: selectedUser.email,
      status: status,
reason: '',
    }),
  }); 

  loadRejectedUsers();
  setSelectedUser(null);
};

  const moveToPending = () => {
    let allUsers = JSON.parse(localStorage.getItem("users")) || [];

    const updated = allUsers.map((u) =>
      u.email === selectedUser.email ? { ...u, status: "Pending" } : u
    );

    localStorage.setItem("users", JSON.stringify(updated));
    loadRejectedUsers();
    loadPendingUsers();
    setSelectedUser(null);
  };

  const openDoc = (file) => {
    debugger;
    if (!file) {
      alert("File not available");
      return;
    }

    if (typeof file === "string") {
      window.open(file, "_blank");
      return;
    }

    if (file?.url) {
      window.open(file.url, "_blank");
      return;
    }

    alert("File not available");
  };

  return (
    <div className={`admin-wrapper ${dark ? "" : "light"}`}>
      {/* TOPBAR */}
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

          <div className="logout-btn" onClick={() => navigate("/")}>
            Logout
          </div>
        </div>
      </div>

      <div className="admin-body">
        {/* SIDEBAR */}
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

        {/* APPROVAL PANEL */}
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

        {/* CONTENT */}
        <div className="content">
          {hasApprovalOnlyAccess && (
            <div className="approval-notice">
              Admin 3 Access: Approval only. User List, Message access not
              allowed. History visible but cannot open.
            </div>
          )}

          <div className="rej-wrapper">
            {!selectedUser && (
              <>
                <h2 className="rej-title">❌ Rejected Users</h2>

                <div className="rej-table-box">
                  <table className="rej-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5">No Rejected Users</td>
                        </tr>
                      ) : (
                        users.map((u, i) => (
                          <tr key={i} onClick={() => setSelectedUser(u)}>
                            <td>{i + 1}</td>
                            <td>{u.pageName}</td>
                            <td>{u.email}</td>
                            <td>{u.phoneNumber}</td>
                            <td className="rej-status">Rejected</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {selectedUser && (
  <>
    <div className="rej-details-top">
      <button className="rej-back" onClick={() => setSelectedUser(null)}>
        ← Back
      </button>

      <button className="pending-btn" onClick={() => updateStatus("Pending")}>
        ⏳ Move to Pending
      </button>
    </div>

    <h2 className="rej-title">❌ Rejected User Details</h2>

    <div className="rej-reason-full">
      <h3>❌ Reject Reason</h3>
      <p>{selectedUser.rejectReason || "No reason provided"}</p>
    </div>

    <div className="rej-card">
      <div className="rej-left">
        <h3>👤 Personal Details</h3>
        <p><b>Name:</b> {selectedUser.pageName || selectedUser.name || "-"}</p>
        <p><b>Email:</b> {selectedUser.email || "-"}</p>
        <p><b>Phone:</b> {selectedUser.phoneNumber || selectedUser.phone || "-"}</p>
        <p><b>DOB:</b> {selectedUser.dateOfBirth || "-"}</p>
        <p><b>Gender:</b> {selectedUser.gender || "-"}</p>
        <p><b>Address:</b> {selectedUser.address || "-"}</p>
        <p><b>City:</b> {selectedUser.city || "-"}</p>
        <p><b>State:</b> {selectedUser.state || "-"}</p>
        <p><b>Pincode:</b> {selectedUser.pincode || "-"}</p>
        <p><b>Country:</b> {selectedUser.country || "-"}</p>

        <h3>🪪 Identity Details</h3>
        <p><b>Aadhaar:</b> {selectedUser.aadharNumber || "-"}</p>
        <p><b>PAN:</b> {selectedUser.panNumber || "-"}</p>

        <h3>👨‍👩‍👦 Family Details</h3>
        <p><b>Father Name:</b> {selectedUser.fatherName || "-"}</p>
        <p><b>Mother Name:</b> {selectedUser.motherName || "-"}</p>
        <p><b>Marital Status:</b> {selectedUser.maritalStatus || "-"}</p>

        {selectedUser.maritalStatus === "married" && (
          <>
            <p><b>Spouse Name:</b> {selectedUser.spouseName || "-"}</p>
            <p><b>Spouse Aadhaar:</b> {selectedUser.spouseAadharNumber || "-"}</p>
            <p><b>Spouse PAN:</b> {selectedUser.spousePanNumber || "-"}</p>
          </>
        )}

        <h3>🏦 Bank Details</h3>
        <p><b>Account Holder:</b> {selectedUser.accountHolderName || "-"}</p>
        <p><b>Bank:</b> {selectedUser.bankName || "-"}</p>
        <p><b>Account No:</b> {selectedUser.accountNumber || "-"}</p>
        <p><b>IFSC:</b> {selectedUser.ifscCode || "-"}</p>
      </div>

      <div className="rej-right">
        <h3>📂 Documents</h3>
        <p onClick={() => downloadFile(selectedUser.aadharPhotoPath, "Aadhar.pdf")}>📄 Aadhaar</p>
        <p onClick={() => downloadFile(selectedUser.panCardPath, "PAN.pdf")}>📄 PAN</p>
        <p onClick={() => downloadFile(selectedUser.bankStatementPath, "Bank.pdf")}>📄 Bank Statement</p>
        <p onClick={() => downloadFile(selectedUser.sourceOfFundPath, "Fund.pdf")}>📄 Source Of Fund</p>
        <p onClick={() => downloadFile(selectedUser.sourceOfWealthPath, "Wealth.pdf")}>📄 Source Of Wealth</p>
        <p onClick={() => downloadFile(selectedUser.addressVerificationPath, "AddressProof.pdf")}>
          📄 Address Verification
        </p>
        <p onClick={() => downloadFile(selectedUser.agreementPDFPath, "Agreement.pdf")}>
          📄 Agreement PDF
        </p>

        {selectedUser.maritalStatus === "married" && (
          <>
            <p onClick={() => downloadFile(selectedUser.spouseAadharPhotoPath), "SpouseAadharCard.pdf"}>
              📄 Spouse Aadhaar
            </p>
            <p onClick={() => downloadFile(selectedUser.spousePanCardPath), "SpousePanCard.pdf"}>
              📄 Spouse PAN
            </p>
          </>
        )}

        <h3>🎥 Video KYC</h3>

        <p onClick={() => downloadFile(selectedUser.videoPath, "Video.mp4")}>
  🎥 Video
</p>
      </div>
    </div>
  </>
)}
{filePopup && (
  <div className="file-popup-overlay">
    <div className="file-popup">
      <div className="file-popup-header">
        <h3>{filePopup.name}</h3>

        <button
          className="file-close-btn"
          onClick={() => setFilePopup(null)}
        >
          ✖
        </button>
      </div>

      <div className="file-popup-body">
        {filePopup.type === "pdf" ? (
          <iframe src={filePopup.url} title={filePopup.name} />
        ) : filePopup.type === "mp4" || filePopup.type === "webm" ? (
          <video src={filePopup.url} controls />
        ) : (
          <img src={filePopup.url} alt={filePopup.name} />
        )}
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rejected;
