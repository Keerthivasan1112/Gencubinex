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
import "./UserList.css";

function UserList() {
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


const downloadFile = (path, name) => {
  if (!path) {
    alert("No file");
    return;
  }

  const fileUrl = `https://13.207.152.124:5299/api/coin/file?path=${encodeURIComponent(path)}`;

  const ext = name.split(".").pop().toLowerCase();

  setFilePopup({
    url: fileUrl,
    name,
    type: ext,
  });
};


  const navigate = useNavigate();
  const location = useLocation();

  const isMasterAdmin = adminUser.role === "master";
  const isAdmin2 = adminUser.role === "admin2";
  const isAdmin3 = adminUser.role === "admin3";

  const hasFullAccess = isMasterAdmin || isAdmin2;
  const hasApprovalOnlyAccess = isAdmin3;

  const canAccessUserList = hasFullAccess;
  const canAccessApproval = hasFullAccess || hasApprovalOnlyAccess;
  const canAccessHistory = hasFullAccess;
  const canShowHistory = hasFullAccess || hasApprovalOnlyAccess;
  const canAccessMessage = hasFullAccess;

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

  useEffect(() => {
    loadAdminUser();
    loadUsers();
  }, []);

  const loadAdminUser = () => {
    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (savedAdmin) setAdminUser(savedAdmin);
  };

   const loadUsers = async () => {
    //const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
 const res = await fetch("https://13.207.152.124:5299/api/coin/all");
  const data = await res.json();
  setUsers(data);
    // if (storedUsers.length === 0) {
    //   const demoUsers = [
    //     {
    //       name: "Keerthi Vasan",
    //       pageName: "Keerthi Vasan",
    //       email: "keerthi@gmail.com",
    //       phone: "9876543210",
    //       phoneNumber: "9876543210",
    //       status: "Pending",
    //     },
    //     {
    //       name: "Arun Kumar",
    //       pageName: "Arun Kumar",
    //       email: "arun@gmail.com",
    //       phone: "9876501234",
    //       phoneNumber: "9876501234",
    //       status: "Approved",
    //     },
    //     {
    //       name: "Vijay Raj",
    //       pageName: "Vijay Raj",
    //       email: "vijay@gmail.com",
    //       phone: "9087654321",
    //       phoneNumber: "9087654321",
    //       status: "Rejected",
    //     },
    //   ];

      

    //   localStorage.setItem("users", JSON.stringify(demoUsers));
    //   setUsers(demoUsers);
    //   setPendingUsers(demoUsers.filter((u) => u.status === "Pending"));
    // } else {
    //   setUsers(storedUsers);
    //   setPendingUsers(storedUsers.filter((u) => u.status === "Pending"));
    // }
  };
  const getAdminTitle = () => {
    if (isMasterAdmin) return "Master Admin";
    if (isAdmin2) return "Admin 2";
    if (isAdmin3) return "Admin 3";
    return adminUser.name;
  };

  const handleMenuClick = (item) => {
    if (item.name === "History" && !canAccessHistory) {
      alert("Admin 3 can view History only. No access to open History page");
      return;
    }

    if (item.name === "Approval") {
      setShowApprovalPanel(!showApprovalPanel);
    } else {
      setShowApprovalPanel(false);
      navigate(item.path);
    }
  };

  const getName = (user) => user.name || user.pageName || "N/A";
  const getPhone = (user) => user.phone || user.phoneNumber || "N/A";

  const getStatusClass = (status) => {
    if (status === "Approved") return "status approved";
    if (status === "Rejected") return "status rejected";
    return "status pending";
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
          <div className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
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
              Admin 3 Access: Approval only. User List access not allowed.
            </div>
          )}

          <div className="userlist-page">
            <div className="userlist-card">
              {!selectedUser ? (
                <>
                  <div className="userlist-header">
                    <div>
                      <h2>User List</h2>
                      <p>Manage all registered users</p>
                    </div>
                  </div>

                  <div className="userlist-table-wrap">
                    <table className="userlist-table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>User Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="no-data">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((user, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{getName(user)}</td>
                              <td>{user.email || "N/A"}</td>
                              <td>{getPhone(user)}</td>
                              <td>
                                <span className={getStatusClass(user.status)}>
                                  {user.status || "Pending"}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="view-btn"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="details-section">
                  <div className="all-details-top">
                    <button
                      className="all-back-btn"
                      onClick={() => setSelectedUser(null)}
                    >
                      ⬅ Back
                    </button>
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
                      <p><b>Date Of Birth:</b> {selectedUser.dateOfBirth || selectedUser.dob || "-"}</p>
                      <p><b>Gender:</b> {selectedUser.gender || "-"}</p>
                      <p><b>Address:</b> {selectedUser.address || "-"}</p>
                      <p><b>City:</b> {selectedUser.city || "-"}</p>
                      <p><b>State:</b> {selectedUser.state || "-"}</p>
                      <p><b>Pincode:</b> {selectedUser.pincode || "-"}</p>
                      <p><b>Country:</b> {selectedUser.country || "-"}</p>

                      <h4>🪪 Identity Details</h4>
                      <p><b>Aadhaar Number:</b> {selectedUser.aadharNumber || selectedUser.aadhaarNumber || "-"}</p>
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
                  <p onClick={() => downloadFile(selectedUser.videoPath, "Video.mp4")}>
  🎥 Video
</p>
                    </div>
                  </div>
                </div>
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
          <iframe
            src={filePopup.url}
            title={filePopup.name}
          />
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
    </div>
  );
}

export default UserList;