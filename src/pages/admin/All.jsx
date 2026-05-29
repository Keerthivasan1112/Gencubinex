import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaHistory,
  FaUserShield,
  FaBars,
  FaEnvelope,
  FaBell,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import "./All.css";

function All() {
  
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [showCompose, setShowCompose] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageTargetUsers, setMessageTargetUsers] = useState([]);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
const [rejectReason, setRejectReason] = useState("");
const [filePopup, setFilePopup] = useState(null);

  const [adminUser, setAdminUser] = useState({
    name: "Admin 1",
    role: "master",
  });

  const approvalPanelRef = useRef(null);
  const filterRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

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
      ? [{ name: "Approval", path: "/admin/approval", icon: <FaCheckCircle /> }]
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
    if (savedAdmin) setAdminUser(savedAdmin);
  };
  

  const updateUserStatus = async (status) => {
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

  //setUsers(selectedUser);
  //setPendingUsers(selectedUser.filter((user) => user?.status === "Pending"));
  setSelectedUser((prev) => ({ ...prev, status }));
  // setSelectedUser(null);
   alert(status+" Successfully");
  
};

const confirmReject = async () => {
  if (!selectedUser) return;

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

  //setUsers(updatedUsers);
  //setPendingUsers(updatedUsers.filter((user) => user?.status === "Pending"));
  setSelectedUser(null);
  setShowRejectPopup(false);
  setRejectReason("");

  alert("User rejected successfully");
};


  const loadUsers =  async () => {
 // const data = JSON.parse(localStorage.getItem("users")) || [];
  

  const res = await fetch("https://localhost:7085/api/coin/all");
  //const validUsers = data.filter((user) => user && typeof user === "object");
  const data = await res.json();


  setUsers(data);
  //setPendingUsers(validUsers.filter((user) => user?.status === "Pending"));
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    setFilterStatus(status || "All");
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showApprovalPanel &&
        approvalPanelRef.current &&
        !approvalPanelRef.current.contains(e.target) &&
        !e.target.closest(".all-menu-item")
      ) {
        setShowApprovalPanel(false);
      }

      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showApprovalPanel]);

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
      setShowApprovalPanel((prev) => !prev);
    } else {
      setShowApprovalPanel(false);
      navigate(item.path);
    }
  };
 
  const filteredUsers =
    filterStatus === "All"
      ? users
      : users.filter((user) => user.status === filterStatus);

  const handleMessageClick = () => {
    if (!canAccessMessage) {
      alert("Admin 3 has no access to Message");
      return;
    }

    const targetUsers =
      filterStatus === "All"
        ? users
        : users.filter((user) => user.status === filterStatus);

    if (targetUsers.length === 0) {
      alert(`No ${filterStatus} users available to send message`);
      return;
    }
 
    setMessageTargetUsers(targetUsers);
    setShowCompose(true);
  };
  const loginEmail = adminUser?.email;

  const [formData, setFormData] = useState({
      to: "",
      subject: "",
      message: "",
    });
    
  const handleSendMessage = async () => {
  if (!messageSubject.trim()) {
    alert("Please enter subject");
    return;
  }

  if (!messageText.trim()) {
    alert("Please enter message");
    return;
  }

  try {

    for (const user of messageTargetUsers) {

      const response = await fetch(
        "https://localhost:7085/api/message/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            senderEmail: loginEmail,
            receiverEmail: user.email,
            subject: messageSubject,
            messageBody: messageText,
            mailType: "Sent",
            createdBy: loginEmail,
          }),
        }
      );

      if (!response.ok) {
        alert(`Failed to send mail to ${user.email}`);
      }
    }

    alert("Message Sent To All Users Successfully");

    setShowCompose(false);
    setMessageSubject("");
    setMessageText("");
    setMessageTargetUsers([]);

  } catch (err) {
    console.log(err);
    alert("Error while sending mail");
  }
};

  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setShowFilter(false);

    if (status === "All") {
      navigate("/all");
    } else {
      navigate(`/all?status=${status}`);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "all-status-approved";
    if (status === "Rejected") return "all-status-rejected";
    return "all-status-pending";
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


  const openFile = (fileUrl) => {
    if (!fileUrl) {
      alert("File not available");
      return;
    }
    window.open(fileUrl, "_blank");
  };

  return (
    <div className={`all-page ${dark ? "" : "light"}`}>
      <div className="all-topbar">
        <div className="all-top-lefts">
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

          <div className="all-admin">
            <FaUserShield /> {getAdminTitle()}
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
            className="all-collapse-btn"
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

        {showApprovalPanel && canAccessApproval && (
          <div
            ref={approvalPanelRef}
            className={`all-panel ${collapsed ? "small" : "large"}`}
          >
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
          {hasApprovalOnlyAccess && (
            <div className="approval-notice">
              Admin 3 Access: Approval only.
            </div>
          )}

          <div className="all-container">
            <div className="all-card">
              {!selectedUser && (
                <>
                  <div className="all-header-row">
                    <h3 className="all-title">👥 Users ({filterStatus})</h3>

                    <div className="all-top-actions">
                      <button
                        className="all-message-btn"
                        onClick={handleMessageClick}
                      >
                        <FaEnvelope /> Message
                      </button>

                      <div className="all-filter-box" ref={filterRef}>
                        <button
                          className="all-filter-main-btn"
                          onClick={() => setShowFilter(!showFilter)}
                        >
                          <FaFilter /> Filter
                        </button>

                        {showFilter && (
                          <div className="all-filter-dropdown">
                            {["All", "Pending", "Approved", "Rejected"].map(
                              (status) => (
                                <div
                                  key={status}
                                  className={
                                    filterStatus === status ? "active" : ""
                                  }
                                  onClick={() => handleFilterSelect(status)}
                                >
                                  {status}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {filteredUsers.length === 0 ? (
                    <p className="all-empty">No Users</p>
                  ) : (
                    <div className="all-table-wrapper">
                      <table className="all-table">
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
                          {filteredUsers.map((user, i) => (
                            <tr key={i} onClick={() => setSelectedUser(user)}>
                              <td>{i + 1}</td>
                              <td>{user.pageName || user.name || "-"}</td>
                              <td>{user.email || "-"}</td>
                              <td>{user.phoneNumber || user.phone || "-"}</td>
                              <td>
                                <span className={getStatusClass(user.status)}>
                                  {user.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
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
  <button
    className="all-pending-btn"
    onClick={() => updateUserStatus("Pending")}
  >
    ⏳ Pending
  </button>

  <button
    className="all-approve-btn"
    onClick={() => updateUserStatus("Approved")}
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

      {showCompose && (
        <div className="compose-overlay">
          <div className="compose-popup">
            <div className="compose-header">
              <div>
                <h3>✉️ Compose Message</h3>
                <p>
                  Sending to <b>{filterStatus}</b> users —{" "}
                  <b>{messageTargetUsers.length}</b> members
                </p>
              </div>

              <button
                className="compose-close"
                onClick={() => setShowCompose(false)}
              >
                <FaTimes />
              </button>
            </div>

            <input
              type="text"
              className="compose-input"
              placeholder="Enter subject"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
            />

            <textarea
              className="compose-textarea"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />

            <div className="compose-users-preview">
              {messageTargetUsers.slice(0, 3).map((user, index) => (
                <span key={index}>
                  {user.pageName || user.name || user.email || "-"}
                </span>
              ))}
              {messageTargetUsers.length > 3 && (
                <span>+{messageTargetUsers.length - 3} more</span>
              )}
            </div>

            <div className="compose-actions">
              <button
                className="compose-cancel"
                onClick={() => setShowCompose(false)}
              >
                Cancel
              </button>

              <button className="compose-send" onClick={handleSendMessage}>
                <FaEnvelope /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}
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

        <button className="reject-confirm-btn" onClick={confirmReject}>
          Confirm Reject
        </button>
      </div>
    </div>
  </div>
)}

      
    </div>
  );
}

export default All;