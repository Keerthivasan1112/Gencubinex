import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
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
  FiCopy,
  FiEdit2,
  FiTrash2,
  FiCreditCard,
} from "react-icons/fi";

function Profile() {
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState("Keerthi Vasan");
  const [profileEmail, setProfileEmail] = useState("21bca029@stc.ac.in");
  const [profilePhone, setProfilePhone] = useState("+919944765003");
  const [accountType, setAccountType] = useState("Individual");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData")) || {};
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const savedEmail =
      localStorage.getItem("userEmail") ||
      savedUserData.email ||
      savedUserData.loginEmail ||
      "";

    let finalName = "Keerthi Vasan";
    let finalEmail = savedEmail || "21bca029@stc.ac.in";
    let finalPhone =
      savedUserData.phone || savedUserData.mobile || "+919944765003";
    let finalAccountType = savedUserData.accountType || "Individual";

    if (savedUserData.name) {
      finalName = savedUserData.name;
    } else if (savedUserData.fullName) {
      finalName = savedUserData.fullName;
    } else if (savedEmail) {
      const matchedUser = savedUsers.find(
        (item) => item.email?.toLowerCase() === savedEmail.toLowerCase()
      );

      if (matchedUser?.name) {
        finalName = matchedUser.name;
      } else if (matchedUser?.fullName) {
        finalName = matchedUser.fullName;
      } else {
        finalName = savedEmail
          .split("@")[0]
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }

      if (matchedUser?.phone) finalPhone = matchedUser.phone;
      if (matchedUser?.mobile) finalPhone = matchedUser.mobile;
      if (matchedUser?.accountType) finalAccountType = matchedUser.accountType;
    }

    setProfileName(finalName);
    setProfileEmail(finalEmail);
    setProfilePhone(finalPhone);
    setAccountType(finalAccountType);
  }, []);

  const profileInitial = useMemo(() => {
    return profileName?.charAt(0)?.toUpperCase() || "K";
  }, [profileName]);

  const mkxId = useMemo(() => {
    return "ID1CC175FE28";
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <div className="gcp-profile-shell">
      <aside
        className={`gcp-profile-sidebar ${
          isSidebarCollapsed ? "gcp-profile-sidebar-collapsed" : ""
        }`}
      >
        <div className="gcp-profile-brand-wrap">
          <h2 className="gcp-profile-brand-title">GENCUBINEX</h2>
        </div>

        <nav className="gcp-profile-nav-list">
          <button
            type="button"
            className="gcp-profile-nav-btn"
            onClick={() => navigate("/home")}
          >
            <FiGrid />
            <span>Dashboard</span>
          </button>

          <button type="button" className="gcp-profile-nav-btn"  onClick={() => navigate("/convert")}>
            <FiRepeat />
            <span>Convert</span>
          </button>

          <button type="button" className="gcp-profile-nav-btn" onClick={() => navigate("/withdraw")}>
            <FiArrowUp />
            <span>Withdraw</span>
          </button>

          <button type="button" className="gcp-profile-nav-btn">
            <FiArrowDown />
            <span>Deposit</span>
          </button>

          <button type="button" className="gcp-profile-nav-btn" onClick={() => navigate("/transactions")}>
            <FiFileText />
            <span>Transactions</span>
          </button>

          <button type="button" className="gcp-profile-nav-btn">
            <FiHelpCircle />
            <span>FAQs</span>
          </button>
        </nav>

        <div className="gcp-profile-sidebar-bottom">
          <button type="button" className="gcp-profile-logout-btn">
            <span>Logout</span>
            <FiLogOut />
          </button>

          <button
            type="button"
            className="gcp-profile-collapse-btn"
            onClick={handleSidebarToggle}
          >
            {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </aside>

      <section className="gcp-profile-content-wrap">
        <header className="gcp-profile-topbar">
          <div className="gcp-profile-topbar-left">
            <h1 className="gcp-profile-page-title">Profile</h1>
          </div>

          <div className="gcp-profile-topbar-right">
            <button className="gcp-profile-topbar-icon" type="button">
              <FiUsers />
            </button>

            <button className="gcp-profile-topbar-icon" type="button">
              <FiMoon />
            </button>

            <button className="gcp-profile-topbar-icon" type="button">
              <FiBell />
            </button>

            <button className="gcp-profile-avatar-btn" type="button">
              {profileInitial}
            </button>
          </div>
        </header>

        <main className="gcp-profile-main-area">
          <div className="gcp-profile-grid-layout">
            <section className="gcp-profile-left-column">
              <div className="gcp-profile-info-card">
                <div className="gcp-profile-summary-box">
                  <div className="gcp-profile-photo-wrap">
                    <div className="gcp-profile-photo-circle">
                      {profileInitial}
                    </div>
                  </div>

                  <h2 className="gcp-profile-user-name">{profileName}</h2>

                  <div className="gcp-profile-id-row">
                    <span className="gcp-profile-id-label">
                      MKX ID: {mkxId}
                    </span>
                    <button
                      type="button"
                      className="gcp-profile-copy-btn"
                      onClick={() => copyText(mkxId)}
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>

                <div className="gcp-profile-form-area">
                  <div className="gcp-profile-input-group">
                    <label className="gcp-profile-input-label">First Name</label>
                    <div className="gcp-profile-static-input">
                      {profileName.split(" ")[0] || "Keerthi"}
                    </div>
                  </div>

                  <div className="gcp-profile-input-group">
                    <label className="gcp-profile-input-label">Last Name</label>
                    <div className="gcp-profile-static-input">
                      {profileName.split(" ").slice(1).join(" ") || "Vasan"}
                    </div>
                  </div>

                  <div className="gcp-profile-input-group">
                    <label className="gcp-profile-input-label">
                      Email Address
                    </label>
                    <div className="gcp-profile-static-input gcp-profile-copy-field">
                      <span>{profileEmail}</span>
                      <button
                        type="button"
                        className="gcp-profile-copy-btn"
                        onClick={() => copyText(profileEmail)}
                      >
                        <FiCopy />
                      </button>
                    </div>
                  </div>

                  <div className="gcp-profile-input-group">
                    <label className="gcp-profile-input-label">
                      Phone Number
                    </label>
                    <div className="gcp-profile-static-input gcp-profile-copy-field">
                      <span>{profilePhone}</span>
                      <button
                        type="button"
                        className="gcp-profile-copy-btn"
                        onClick={() => copyText(profilePhone)}
                      >
                        <FiCopy />
                      </button>
                    </div>
                  </div>

                  <div className="gcp-profile-input-group">
                    <label className="gcp-profile-input-label">
                      Account Type
                    </label>
                    <div className="gcp-profile-static-input">{accountType}</div>
                  </div>

                  <button type="button" className="gcp-profile-delete-btn">
                    <FiTrash2 />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="gcp-profile-right-column">
              <div className="gcp-profile-kyc-card">
                <h3 className="gcp-profile-card-heading">KYC Verification</h3>

                <div className="gcp-profile-kyc-inner-box">
                  <div className="gcp-profile-kyc-top">
                    <div className="gcp-profile-kyc-icon-box">
                      <FiCreditCard />
                    </div>

                    <div className="gcp-profile-kyc-account-details">
                      <div className="gcp-profile-kyc-title-row">
                        <span className="gcp-profile-kyc-title-text">
                          Account Type
                        </span>
                        <span className="gcp-profile-kyc-status-badge">
                          Pending
                        </span>
                      </div>
                      <p className="gcp-profile-kyc-subtext">{accountType}</p>
                    </div>
                  </div>

                  <p className="gcp-profile-kyc-description">
                    Additional information is required to verify your account.
                  </p>

                  <div className="gcp-profile-progress-row">
                    <div className="gcp-profile-progress-bar">
                      <div className="gcp-profile-progress-fill"></div>
                    </div>
                    <span className="gcp-profile-progress-text">50%</span>
                  </div>
                </div>

                <button type="button" className="gcp-profile-link-btn">
                  Verify Account
                </button>
              </div>

              <div className="gcp-profile-security-card">
                <h3 className="gcp-profile-card-heading">Security</h3>

                <div className="gcp-profile-security-block">
                  <h4 className="gcp-profile-security-title">Password</h4>
                  <p className="gcp-profile-security-text">
                    For your security, we recommend you change your password
                    every quarter.
                  </p>
                  <button type="button" className="gcp-profile-action-btn">
                    Change Password
                  </button>
                </div>

                <div className="gcp-profile-security-block">
                  <h4 className="gcp-profile-security-title">Email</h4>
                  <p className="gcp-profile-security-text">
                    Use your email to protect your account and transactions.
                  </p>
                  <button type="button" className="gcp-profile-action-btn">
                    Change Email Address
                  </button>
                </div>

                <div className="gcp-profile-security-block">
                  <h4 className="gcp-profile-security-title">Phone</h4>
                  <p className="gcp-profile-security-text">
                    Use your mobile to protect your account and transactions.
                  </p>
                  <button type="button" className="gcp-profile-action-btn">
                    Change Phone Number
                  </button>
                </div>

                <div className="gcp-profile-security-divider"></div>

                <div className="gcp-profile-security-block">
                  <h4 className="gcp-profile-security-title">
                    Multi-Factor Authentication (MFA)
                  </h4>
                  <p className="gcp-profile-security-text">
                    MFA is key to protecting your account. Select your preferred
                    authentication method for better security.
                  </p>
                  <button type="button" className="gcp-profile-action-btn">
                    Enable MFA
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Profile;