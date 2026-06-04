import { useState ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logovi.mp4";
import "./Signin.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

 const otpLength = 5;
  const [otpValues, setOtpValues] = useState(
    new Array(otpLength).fill("")
  );
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  // 🔥 Step 1 - Login
  // const handleLogin = () => {
  //   if (!email || !password) {
  //     alert("Please enter email and password");
  //     return;
  //   }

  //   // 🔥 Backend login API call here
  //   // If success → send OTP & show OTP input

  //   setShowOtp(true);

  // };


  const handleLogin = async () => {
  if (!email || !password) {
    alert("Enter email & password");
    return;
  }
debugger;
  const res = await fetch("http://13.207.152.124:5299/api/signin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.text();

  if (data === "OTP Sent") {
    setShowOtp(true);
  } else {
    alert(data);
  }
};
   const handleChange = (element, index) => {
    if (!/^[0-9]?$/.test(element.value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = element.value;
    setOtpValues(newOtp);

    if (element.value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 🔥 Backspace Handle
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // 🔥 Step 2 - OTP Verify
// const handleVerifyOtp = () => {
//   const finalOtp = otpValues.join("");

//   if (finalOtp.length !== otpLength) {
//     alert("Enter valid 5-digit OTP");
//     return;
//   }

//   if (finalOtp === "12345") {

//     localStorage.setItem("userEmail", email);
//     localStorage.setItem("isLoggedIn", "true");

//     // ✅ ADMIN CHECK
//     if (email === "admin@gencubinex.com") {
//       localStorage.setItem("role", "admin");
//     } else {
//       localStorage.setItem("role", "user");
//     }

//     navigate("/home");

//   } else {
//     alert("Invalid OTP");
//   }
// };
const handleVerifyOtp = async () => {
  const finalOtp = otpValues.join("");

  const res = await fetch("http://13.207.152.124:5299/api/signin/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp: finalOtp }),
  });
if (res.ok) {
  localStorage.setItem("userEmail", email); // ✅ MUST
}
  const data = await res.text();

  if (data === "Login Success") {
 let adminData = null;

 if (email === "masteradmin@gencubinex.com") {
      adminData = {
        name: "Admin 1",
        role: "master",
        email: email,
      };
    } else if (email === "admin2@gencubinex.com") {
      adminData = {
        name: "Admin 2",
        role: "admin2",
        email: email,
      };
    } else if (email === "admin3@gencubinex.com") {
      adminData = {
        name: "Admin 3",
        role: "admin3",
        email: email,
      };
    }

if (adminData) {
      localStorage.setItem("adminUser", JSON.stringify(adminData));
      localStorage.setItem("role", adminData.role);
      navigate("/admin");
    } else {
      localStorage.setItem("role", "user");
     navigate("/home",{ state: { email } });
    }
  } else {
    alert(data);
  }
};

  const handleSignupClick = (e) => {
    e.preventDefault();
    setShowSignupPopup(true);
  };

  const handleConfirmSignup = () => {
    setShowSignupPopup(false);
    setRotate(true);
    setTimeout(() => {
      navigate("/signup-page");
    }, 800);
  };

  const handleClosePopup = () => {
    setShowSignupPopup(false);
  };

  return (
    <div className={`main-container ${rotate ? "rotate-page" : ""}`}>

      {/* LEFT SIDE */}
      <div className="left-section">
        <p className="top-text">Secure & Regulated by GENCUBINEX</p>

        <h1>
          Your trusted <br />
          partner for <span>virtual</span> <br />
          assets
        </h1>

        <div className="left-video">
          <video
            src={logo}
            autoPlay
            loop
            muted
            playsInline
            className="logo-video-large"
          />
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="right-section">
        <div className="login-card">

          <h2 className="brand-title">GENCUBINEX</h2>

          {!showOtp ? (
            <>
              <h3>Sign in</h3>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="forgot" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </div>

              <button className="login-btn" onClick={handleLogin}>
                Send OTP
              </button>
            </>
          ) : (
             <>
              <h3>Enter OTP</h3>

              <p className="otp-text">
  OTP sent to {email.replace(/(.{2}).+(@.+)/, "$1****$2")}
</p>

              <div className="otp-container">
                {otpValues.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="otp-box"
                  />
                ))}
              </div>

              <button className="login-btn" onClick={handleVerifyOtp}>
                Verify & Login
              </button>
            </>
          )}

          {!showOtp && (
            <p className="signup-text">
              Don't have an account?{" "}
              <span className="link-btn" onClick={handleSignupClick}>
                Sign up
              </span>
            </p>
          )}
        </div>
      </div>

      {/* SIGNUP POPUP */}
      {showSignupPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Create New Account</h2>
              <button className="popup-close" onClick={handleClosePopup}>✕</button>
            </div>
            <div className="popup-body">
              <p>Ready to join GENCUBINEX?</p>
              <ul className="popup-features">
                <li>✓ Secure account setup</li>
                <li>✓ Identity verification required</li>
                <li>✓ Access to OTC trading</li>
                <li>✓ Professional support</li>
              </ul>
            </div>
            <div className="popup-footer">
              <button className="popup-cancel-btn" onClick={handleClosePopup}>
                Cancel
              </button>
              <button className="popup-confirm-btn" onClick={handleConfirmSignup}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;