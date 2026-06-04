import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaHistory,
  FaUserShield,
  FaEnvelope,
  FaInbox,
  FaPaperPlane,
  FaRegFileAlt,
  FaTrashAlt,
  FaSearch,
  FaPlus,
  FaTimes,
  FaArrowLeft,
  FaBars,
  FaBell,
} from "react-icons/fa";

import "./Message.css";

function Message() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // STATES
  // =========================

  const [collapsed, setCollapsed] = useState(true);
  const [dark, setDark] = useState(true);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [adminUser, setAdminUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [activeTab, setActiveTab] = useState("inbox");
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  // =========================
  // DATABASE DATA STATES
  // =========================

  const [inboxMessages, setInboxMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [draftMessages, setDraftMessages] = useState([]);
  const [trashMessages, setTrashMessages] = useState([]);

  // =========================
  // LOGIN USER
  // =========================

  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));

    if (savedAdmin) {
      setAdminUser(savedAdmin);
    }
  }, []);

  const loginEmail = adminUser?.email;

  const isMasterAdmin = adminUser.role === "master";

  // =========================
  // LOAD DATA FROM DATABASE
  // =========================

  useEffect(() => {
    if (loginEmail) {
      loadInbox();
      loadSent();
      loadDrafts();
      loadTrash();
    }
  }, [loginEmail]);

  // =========================
  // LOAD INBOX
  // =========================

  const loadInbox = async () => {
    try {
      const res = await fetch(
        `http://13.207.152.124:5299/api/message/inbox/${loginEmail}`
      );

      const data = await res.json();

      setInboxMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOAD SENT
  // =========================

  const loadSent = async () => {
    try {
      const res = await fetch(
        `http://13.207.152.124:5299/api/message/sent/${loginEmail}`
      );

      const data = await res.json();

      setSentMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOAD DRAFTS
  // =========================

 const loadDrafts = async () => {

  const adminUser =
    JSON.parse(localStorage.getItem("adminUser"));

  const loginEmail = adminUser?.email;

  const res = await fetch(
    `http://13.207.152.124:5299/api/message/drafts/${loginEmail}`
  );

  const data = await res.json();

  setDraftMessages(data);
};

  // =========================
  // LOAD TRASH
  // =========================

  const loadTrash = async () => {
    try {
      const res = await fetch(
        `http://13.207.152.124:5299/api/message/trash/${loginEmail}`
      );

      const data = await res.json();

      setTrashMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // MENU
  // =========================

  const menu = [
    { name: "User List", path: "/userlist", icon: <FaUsers /> },
    { name: "Approval", path: "/admin/approval", icon: <FaCheckCircle /> },
    { name: "History", path: "/history", icon: <FaHistory /> },
    { name: "Message", path: "/message", icon: <FaEnvelope /> },
  ];

  // =========================
  // MENU CLICK
  // =========================

  const handleMenuClick = (item) => {
    if (item.name === "Approval") {
      setShowApprovalPanel(!showApprovalPanel);
    } else {
      setShowApprovalPanel(false);
      navigate(item.path);
    }
  };

  // =========================
  // TAB CHANGE
  // =========================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedMail(null);
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = async () => {
    try {
      if (
        !formData.to ||
        !formData.subject ||
        !formData.message
      ) {
        alert("Please fill all fields");
        return;
      }

      const response = await fetch(
        "http://13.207.152.124:5299/api/message/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            senderEmail: loginEmail,
            receiverEmail: formData.to,
            subject: formData.subject,
            messageBody: formData.message,
            mailType: "Sent",
            createdBy: loginEmail,
          }),
        }
      );

      if (response.ok) {
        alert("Message Sent Successfully");

        setFormData({
          to: "",
          subject: "",
          message: "",
        });

        setShowCompose(false);

        loadSent();
        loadInbox();
      } else {
        alert("Failed to Send");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // SAVE DRAFT
  // =========================

 const handleSaveDraft = async () => {

  const adminUser =
    JSON.parse(localStorage.getItem("adminUser"));

  const loginEmail = adminUser?.email;

  if (!formData.subject && !formData.message) {
    alert("Enter something");
    return;
  }

  await fetch("http://13.207.152.124:5299/api/message/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      senderEmail: loginEmail,
      receiverEmail: formData.to || "",
      subject: formData.subject || "No Subject",
      messageBody: formData.message || "",
      mailType: "Draft",
      createdBy: loginEmail
    }),
  });

  alert("Draft Saved");

  loadDrafts();

  setFormData({
    to: "",
    subject: "",
    message: "",
  });

  setShowCompose(false);

  setActiveTab("drafts");
};
  // =========================
  // MOVE TO TRASH
  // =========================

  const moveToTrash = async (id) => {
  try {

    const response = await fetch(
      `http://13.207.152.124:5299/api/message/move-trash/${id}`,
      {
        method: "PUT",
      }
    );

    if (response.ok) {

      alert("Moved To Trash");

      // reload all
      loadInbox();
      loadSent();
      loadDrafts();
      loadTrash();

      setSelectedMail(null);
    }

  } catch (err) {
    console.log(err);
  }
};

  // =========================
  // OPEN MESSAGE
  // =========================

  const markAsReadAndOpen = async (item) => {
    setSelectedMail(item);

    if (!item.isRead) {
      await fetch(
        `http://13.207.152.124:5299/api/message/read/${item.id}`,
        {
          method: "PUT",
        }
      );

      loadInbox();
    }
  };

  // =========================
  // SEARCH FILTER
  // =========================

  const filterMails = (list) => {
    return list.filter(
      (item) =>
        item.subject?.toLowerCase().includes(search.toLowerCase()) ||
        item.receiverEmail
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.senderEmail
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.messageBody
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  };

  const filteredInbox = useMemo(() => {
    return filterMails(inboxMessages);
  }, [inboxMessages, search]);

  const filteredSent = useMemo(() => {
    return filterMails(sentMessages);
  }, [sentMessages, search]);

  const filteredDrafts = useMemo(() => {
    return filterMails(draftMessages);
  }, [draftMessages, search]);

  const filteredTrash = useMemo(() => {
    return filterMails(trashMessages);
  }, [trashMessages, search]);

  // =========================
  // MESSAGE DETAILS
  // =========================

  const renderMailDetail = () => {
    if (!selectedMail) return null;

    return (
      <div className="msg-mail-detail-card">

        <div className="msg-mail-detail-top">

          <button
            className="msg-back-btn"
            onClick={() => setSelectedMail(null)}
          >
            <FaArrowLeft /> Back
          </button>

          <button
            className="msg-detail-trash-btn"
            onClick={() => moveToTrash(selectedMail.id)}
          >
            Move To Trash
          </button>
        </div>

        <div className="msg-mail-detail-header">
          <h2>{selectedMail.subject}</h2>
          <span>{selectedMail.createdDate}</span>
        </div>

        <div className="msg-mail-detail-meta">
          <p>
            <strong>From :</strong>{" "}
            {selectedMail.senderEmail}
          </p>

          <p>
            <strong>To :</strong>{" "}
            {selectedMail.receiverEmail}
          </p>
        </div>

        <div className="msg-mail-detail-body">
          {selectedMail.messageBody}
        </div>
      </div>
    );
  };

  // =========================
  // MESSAGE LIST
  // =========================

  const renderMessages = (title, list) => {
    if (selectedMail) {
      return renderMailDetail();
    }

    return (
      <div className="msg-mail-list-card">

        <div className="msg-mail-list-header">
          <h2>{title}</h2>
        </div>

        {list.length === 0 ? (
          <div className="msg-empty-box">
            No Messages Available
          </div>
        ) : (
          <div className="msg-mail-rows">

            {list.map((item) => (
              <div
                className={`msg-mail-row ${
                  item.isRead === false
                    ? "msg-unread-mail-row"
                    : ""
                }`}
                key={item.id}
                onClick={() => markAsReadAndOpen(item)}
              >
                <div className="msg-mail-row-left">

                  {!item.isRead && (
                    <span className="msg-unread-dot"></span>
                  )}

                  <div className="msg-mail-sender">
                    {item.senderEmail}
                  </div>

                  <div className="msg-mail-subject">
                    {item.subject}
                  </div>

                  <div className="msg-mail-preview">
                    {item.messageBody}
                  </div>
                </div>

                <div className="msg-mail-row-right">

                  <span className="msg-mail-time">
                    {item.createdDate}
                  </span>

                  <button
                    className="msg-mail-trash-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveToTrash(item.id);
                    }}
                  >
                    Trash
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`all-page ${dark ? "" : "light"}`}>

      {/* TOPBAR */}

      <div className="all-topbar">

        <div className="all-top-left">

          <div
            className="all-logo"
            onClick={() => navigate("/admin")}
          >
            GENCUBINEX
          </div>

          <div
            className="all-home-btn"
            onClick={() => navigate("/admin")}
          >
            Home
          </div>
        </div>

        <div className="top-right">

          <div
            className="notification-bell"
            onClick={() => navigate("/message")}
          >
            <FaBell />
          </div>

          <div className="all-admin">
            <FaUserShield />

            {isMasterAdmin
              ? "Master Admin"
              : adminUser.name}
          </div>

          <div
            className="all-toggle"
            onClick={() => setDark(!dark)}
          >
            {dark ? "🌙" : "☀️"}
          </div>

          <div
            className="all-logout"
            onClick={() => navigate("/signin")}
          >
            Logout
          </div>
        </div>
      </div>

      {/* BODY */}

      <div className="all-body">

        {/* SIDEBAR */}

        <div
          className={`all-sidebar ${
            collapsed ? "collapsed" : ""
          }`}
        >
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
                location.pathname === item.path
                  ? "active"
                  : ""
              }`}
            >
              <span className="all-icon">
                {item.icon}
              </span>

              {!collapsed && <span>{item.name}</span>}
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

        {/* CONTENT */}

        <div className="all-content">

          <div className="msg-mail-main">

            {/* SEARCH */}

            <div className="msg-mail-topbar">

              <div className="msg-mail-search">

                <FaSearch className="msg-search-icon" />

                <input
                  type="text"
                  placeholder="Search Mail..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <div className="msg-mail-user">

                <div className="msg-mail-avatar">
                  A
                </div>

                <div>
                  <h4>Admin Mail</h4>
                  <p>{loginEmail}</p>
                </div>
              </div>
            </div>

            {/* TABS */}

            <div className="msg-mail-tabs-bar">

              <button
                className={
                  activeTab === "inbox"
                    ? "active-mail-tab"
                    : ""
                }
                onClick={() =>
                  handleTabChange("inbox")
                }
              >
                <FaInbox /> Inbox
              </button>

              <button
                className={
                  activeTab === "sent"
                    ? "active-mail-tab"
                    : ""
                }
                onClick={() =>
                  handleTabChange("sent")
                }
              >
                <FaPaperPlane /> Sent
              </button>

              <button
                className={
                  activeTab === "drafts"
                    ? "active-mail-tab"
                    : ""
                }
                onClick={() =>
                  handleTabChange("drafts")
                }
              >
                <FaRegFileAlt /> Drafts
              </button>

              <button
                className={
                  activeTab === "trash"
                    ? "active-mail-tab"
                    : ""
                }
                onClick={() =>
                  handleTabChange("trash")
                }
              >
                <FaTrashAlt /> Trash
              </button>

              <button
                className="msg-mail-compose-top-btn"
                onClick={() =>
                  setShowCompose(true)
                }
              >
                <FaPlus /> Compose
              </button>
            </div>

            {/* CONTENT */}

            <div className="msg-mail-content">

              {activeTab === "inbox" &&
                renderMessages(
                  "Inbox Messages",
                  filteredInbox
                )}

              {activeTab === "sent" &&
                renderMessages(
                  "Sent Messages",
                  filteredSent
                )}

              {activeTab === "drafts" &&
  renderMessages("Draft Messages", draftMessages, "drafts")}

              {activeTab === "trash" &&
                renderMessages(
                  "Trash Messages",
                  filteredTrash
                )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPOSE */}

      {showCompose && (
        <div className="msg-compose-popup-overlay">

          <div className="msg-compose-popup">

            <div className="msg-compose-popup-header">

              <h3>New Message</h3>

              <button
                className="msg-close-popup-btn"
                onClick={() =>
                  setShowCompose(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="msg-compose-form">

              <div className="msg-input-group">
                <label>To</label>

                <input
                  type="email"
                  name="to"
                  placeholder="Enter Email"
                  value={formData.to}
                  onChange={handleChange}
                />
              </div>

              <div className="msg-input-group">
                <label>Subject</label>

                <input
                  type="text"
                  name="subject"
                  placeholder="Enter Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="msg-input-group">
                <label>Message</label>

                <textarea
                  name="message"
                  rows="8"
                  placeholder="Write Message..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="msg-compose-actions">

                <button
                  className="msg-draft-btn"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </button>

                <button
                  className="msg-send-btn"
                  onClick={handleSend}
                >
                  <FaPaperPlane /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;