import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaHistory,
  FaUserShield,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Approval.css";

function Approved() {
  const [approvedList, setApprovedList] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);

  const [adminUser, setAdminUser] = useState({
    name: "Admin 1",
    role: "master",
  });
  const [showFilePopup, setShowFilePopup] = useState(false);
const [selectedFile, setSelectedFile] = useState({
  path: "",
  name: "",
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

//   const downloadFile = (path, name) => {
//     debugger;
//   if (!path) {
//     alert("No file");
//     return;
//   }

//   window.open(
//     `https://localhost:7085/api/coin/file?path=${path}&name=${name}`,
//     "_blank"
//   );
// };

  const loadAdminUser = () => {
    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (savedAdmin) {
      setAdminUser(savedAdmin);
    }
  };

  const loadApprovedUsers =  async () => {
    const res = await fetch("https://localhost:7085/api/coin/approved");
    const data = await res.json();
    const approvedUsers = data.filter(
      (user) => user.status === "Approved"
    );
    setApprovedList(data);
  };

  const loadPendingUsers = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const pending = users.filter((user) => user.status === "Pending");
    setPendingUsers(pending);
  };

  useEffect(() => {
    loadAdminUser();
    loadApprovedUsers();
    loadPendingUsers();

    const handleFocus = () => {
      loadAdminUser();
      loadApprovedUsers();
      loadPendingUsers();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
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
      email: activeUser.email,
      status: status,
reason: '',
    }),
  }); 


    setActiveUser(null);
    loadApprovedUsers();
    loadPendingUsers();
  };

  const openFilePopup = (path, name) => {
    debugger;
  if (!path) {
    alert("No file found");
    return;
  }

  setSelectedFile({
    path,
    name,
  });

  setShowFilePopup(true);
};

  return (
    <div className={`approved-page ${dark ? "" : "light"}`}>
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

          <h2 className="page-heading">✅ Approved Users</h2>

          {!activeUser && (
            <div className="table-wrapper">
              <table className="data-table">
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
                  {approvedList.length > 0 ? (
                    approvedList.map((user, index) => (
                      <tr key={index} onClick={() => setActiveUser(user)}>
                        <td>{index + 1}</td>
                        <td>{user.pageName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td className="approved">{user.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-text">
                        No Approved Users
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeUser && (
  <div className="details-section">
    <div className="all-details-top">
      <button className="all-back-btn" onClick={() => setActiveUser(null)}>
        ⬅ Back
      </button>

      <button className="reject-btn" onClick={() => updateStatus("Rejected")}>
        🗑 Remove User
      </button>
    </div>

    <div className="all-user-heading">
      <h3>{activeUser.pageName || activeUser.name || "-"}</h3>
      <span style={{ color: "lime" }}>
        {activeUser.status || "Approved"}
      </span>
    </div>

    <div className="all-details-card">
      <div className="all-details-left">
        <h4>👤 Personal Details</h4>
        <p><b>Name:</b> {activeUser.pageName || activeUser.name || "-"}</p>
        <p><b>Email:</b> {activeUser.email || "-"}</p>
        <p><b>Phone Number:</b> {activeUser.phoneNumber || activeUser.phone || "-"}</p>
        <p><b>Date Of Birth:</b> {activeUser.dateOfBirth || "-"}</p>
        <p><b>Gender:</b> {activeUser.gender || "-"}</p>
        <p><b>Address:</b> {activeUser.address || "-"}</p>
        <p><b>City:</b> {activeUser.city || "-"}</p>
        <p><b>State:</b> {activeUser.state || "-"}</p>
        <p><b>Pincode:</b> {activeUser.pincode || "-"}</p>
        <p><b>Country:</b> {activeUser.country || "-"}</p>

        <h4>🪪 Identity Details</h4>
        <p><b>Aadhaar Number:</b> {activeUser.aadharNumber || "-"}</p>
        <p><b>PAN Number:</b> {activeUser.panNumber || "-"}</p>

        <h4>👨‍👩‍👦 Family Details</h4>
        <p><b>Father Name:</b> {activeUser.fatherName || "-"}</p>
        <p><b>Mother Name:</b> {activeUser.motherName || "-"}</p>
        <p><b>Marital Status:</b> {activeUser.maritalStatus || "-"}</p>

        {activeUser.maritalStatus === "married" && (
          <>
            <p><b>Spouse Name:</b> {activeUser.spouseName || "-"}</p>
            <p><b>Spouse Aadhaar Number:</b> {activeUser.spouseAadharNumber || "-"}</p>
            <p><b>Spouse PAN Number:</b> {activeUser.spousePanNumber || "-"}</p>
          </>
        )}

        <h4>🏦 Bank Details</h4>
        <p><b>Account Holder Name:</b> {activeUser.accountHolderName || "-"}</p>
        <p><b>Bank Name:</b> {activeUser.bankName || "-"}</p>
        <p><b>Account Number:</b> {activeUser.accountNumber || "-"}</p>
        <p><b>IFSC Code:</b> {activeUser.ifscCode || "-"}</p>
      </div>

      <div className="all-details-right">
        <h4>📂 Documents</h4>

        <p  onClick={() => openFilePopup(activeUser.aadharPhotoPath, "Aadhaar")}>📄 Aadhaar</p>
        <p onClick={() => openFilePopup(activeUser.panCardPath, "PAN")}>📄 PAN</p>
        <p onClick={() => openFilePopup(activeUser.bankStatementPath, "Bank Statement")}>📄 Bank Statement</p>
        <p onClick={() => openFilePopup(activeUser.sourceOfFundPath, "Source Of Fund")}>📄 Source Of Fund</p>
        <p onClick={() => openFilePopup(activeUser.sourceOfWealthPath, "Source Of Wealth")}>📄 Source Of Wealth</p>
        <p onClick={() => openFilePopup(activeUser.addressVerificationPath, "Address Verification")}>
          📄 Address Verification
        </p>
        <p onClick={() => openFilePopup(activeUser.agreementPDFPath, "Agreement PDF")}>
          📄 Agreement PDF
        </p>

        {activeUser.maritalStatus === "married" && (
          <>
            <p onClick={() => openFilePopup(activeUser.spouseAadharPhotoPath, "Spouse Aadhaar")}>
              📄 Spouse Aadhaar
            </p>
            <p onClick={() => openFilePopup(activeUser.spousePanCardPath, "Spouse PAN")}>
              📄 Spouse PAN
            </p>
          </>
        )}

        <h4>🎥 Video KYC</h4>
         <p onClick={() => openFilePopup(activeUser.videoPath, "Video")}>🎥 Video</p>
      </div>
    </div>
  </div>
)}
{showFilePopup && (
  <div className="file-popup-overlay">
    <div className="file-popup">

      <div className="file-popup-top">
        <h3>{selectedFile.name}</h3>

        <button
          className="close-popup-btn"
          onClick={() => setShowFilePopup(false)}
        >
          ✕
        </button>
      </div>

      {/* PDF / File Preview */}
      <iframe
        src={`https://localhost:7085/api/coin/file?path=${selectedFile.path}`}
        title="File Preview"
        className="file-preview"
      ></iframe>

    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default Approved;