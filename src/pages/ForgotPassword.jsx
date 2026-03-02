import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from '../assets/logovi.mp4';

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  return (
    <div className="forgot-container">
      
      {/* LEFT SIDE BRAND SECTION */}
      <div className="forgot-left">
        <h4>Secure & Regulated Platform</h4>
        <h1>
          Recover your <span>Account</span> Securely
        </h1>
        <p>
          We’ll help you get back into your account safely.
        </p>

        <div className="gold-orb">
           
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="forgot-right">
        <div className="forgot-card">
          <h2>
            {step === "email"
              ? "Forgot Password"
              : "OTP Verification"}
          </h2>

          {step === "email" && (
            <>
            <label>
              Enter your registered email address to receive an OTP for password reset.
            </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                disabled={!email}
                onClick={() => setStep("otp")}
              >
                Generate OTP
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="otp-text">
                OTP sent to <b>{email}</b>
              </p>

              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                disabled={otp.length !== 6}
                onClick={() =>
                  navigate("/reset-password", {
                    state: { email },
                  })
                }
              >
                Verify & Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;