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
import "./Pending.css";

function Pending() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
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

  const loadUsers =  async () => {

  const res = await fetch("https://localhost:7085/api/coin/pending");
  const data = await res.json();
  const onlyPendingUsers = data.filter(
      (user) => user.status === "Pending"
    );
    setUsers(data);
    setPendingUsers(onlyPendingUsers);
  };

  useEffect(() => {
    loadAdminUser();
    loadUsers();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadAdminUser();
      loadUsers();
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

  const downloadFile = (path, name) => {
    debugger;
  if (!path) {
    alert("No file");
    return;
  }

  window.open(
    `https://localhost:7085/api/coin/file?path=${path}&name=${name}`,
    "_blank"
  );
};

  const openFile = (fileUrl) => {
    if (!fileUrl) {
      alert("File not available");
      return;
    }
    window.open(fileUrl, "_blank");
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
    loadUsers();
    setSelectedUser(null);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert("Enter rejection reason");
      return;
    }

  await fetch("https://localhost:7085/api/coin/update-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: selectedUser.email,
      status: 'Rejected',
reason: '',
    }),
  }); 

    loadUsers();
    setSelectedUser(null);
    setShowRejectPopup(false);
    setRejectReason("");
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "status-badge approved";
    if (status === "Rejected") return "status-badge rejected";
    return "status-badge pending";
  };

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

          <div className="logout-btn" onClick={() => navigate("/")}>
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
              Admin 3 Access: Approval only. User List, Message access not
              allowed. History visible but cannot open.
            </div>
          )}

          <div className="pending-container">
            <h2 className="pending-title">⏳ Pending Users</h2>

            {!selectedUser && (
              <div className="table-container">
                <table className="user-table">
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
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={index} onClick={() => setSelectedUser(user)}>
                          <td>{index + 1}</td>
                          <td>{user.pageName}</td>
                          <td>{user.email}</td>
                          <td>{user.phoneNumber}</td>
                          <td>
                            <span className={getStatusClass(user.status)}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          No Pending Users
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

{selectedUser && (
  <div className="all-details-view">
    <div className="all-details-top">
      <button
        className="all-back-btn"
        onClick={() => setSelectedUser(null)}
      >
        ⬅ Back
      </button>

      <div className="all-detail-actions">
  {/* <button
    className="all-pending-btn"
    onClick={() => updateStatus("Pending")}
  >
    ⏳ Pending
  </button> */}

  <button
    className="all-approve-btn"
    onClick={() => updateStatus("Approved")}
  >
    ✅ Approve
  </button>

  <button
    className="all-reject-btn"
    onClick={() => setShowRejectPopup(true)}
  >
    ❌ Reject
  </button>
</div>
    </div>

    <div className="all-user-heading">
      <h3>{selectedUser.pageName || selectedUser.name || "-"}</h3>
      <span className={getStatusClass(selectedUser.status)}>
        {selectedUser.status || "Pending"}
      </span>
    </div>

    <div className="all-details-card">
      <div className="all-details-left">
        <h4>👤 Personal Details</h4>
        <p><b>Name:</b> {selectedUser.pageName || selectedUser.name || "-"}</p>
        <p><b>Email:</b> {selectedUser.email || "-"}</p>
        <p><b>Phone Number:</b> {selectedUser.phoneNumber || selectedUser.phone || "-"}</p>
        <p><b>Date Of Birth:</b> {selectedUser.dateOfBirth || "-"}</p>
        <p><b>Gender:</b> {selectedUser.gender || "-"}</p>
        <p><b>Address:</b> {selectedUser.address || "-"}</p>
        <p><b>City:</b> {selectedUser.city || "-"}</p>
        <p><b>State:</b> {selectedUser.state || "-"}</p>
        <p><b>Pincode:</b> {selectedUser.pincode || "-"}</p>
        <p><b>Country:</b> {selectedUser.country || "-"}</p>

        <h4>🪪 Identity Details</h4>
        <p><b>Aadhaar Number:</b> {selectedUser.aadharNumber || "-"}</p>
        <p><b>PAN Number:</b> {selectedUser.panNumber || "-"}</p>

        <h4>👨‍👩‍👦 Family Details</h4>
        <p><b>Father Name:</b> {selectedUser.fatherName || "-"}</p>
        <p><b>Mother Name:</b> {selectedUser.motherName || "-"}</p>
        <p><b>Marital Status:</b> {selectedUser.maritalStatus || "-"}</p>

        {selectedUser.maritalStatus === "married" && (
          <>
            <p><b>Spouse Name:</b> {selectedUser.spouseName || "-"}</p>
            <p><b>Spouse Aadhaar Number:</b> {selectedUser.spouseAadharNumber || "-"}</p>
            <p><b>Spouse PAN Number:</b> {selectedUser.spousePanNumber || "-"}</p>
          </>
        )}

        <h4>🏦 Bank Details</h4>
        <p><b>Account Holder Name:</b> {selectedUser.accountHolderName || "-"}</p>
        <p><b>Bank Name:</b> {selectedUser.bankName || "-"}</p>
        <p><b>Account Number:</b> {selectedUser.accountNumber || "-"}</p>
        <p><b>IFSC Code:</b> {selectedUser.ifscCode || "-"}</p>
      </div>

      <div className="all-details-right">
        <h4>📂 Documents</h4>

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

        <h4>🎥 Video KYC</h4>

          <p onClick={() => downloadFile(selectedUser.videoPath, "Video.mp4" ? "Recorded" : "Not Recorded")}>🎥 Video</p>
      </div>
    </div>
  </div>
)}

          </div>
          
        </div>
      </div>
      {showRejectPopup && (
  <div className="reject-popup-overlay">
    <div className="reject-popup">
      <div className="reject-popup-header">
        <h3>❌ Reject User</h3>

        <button
          className="reject-close-btn"
          onClick={() => {
            setShowRejectPopup(false);
            setRejectReason("");
          }}
        >
          ✕
        </button>
      </div>

      <p className="reject-popup-subtitle">
        Please enter the rejection reason for{" "}
        <b>{selectedUser?.pageName || selectedUser?.name || "User"}</b>
      </p>

      <textarea
        className="reject-popup-textarea"
        placeholder="Enter rejection reason..."
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />

      <div className="reject-popup-actions">
        <button
          className="reject-cancel-btn"
          onClick={() => {
            setShowRejectPopup(false);
            setRejectReason("");
          }}
        >
          Cancel
        </button>

        <button
          className="reject-confirm-btn"
          onClick={confirmReject}
        >
          Confirm Reject
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
}

export default Pending;
