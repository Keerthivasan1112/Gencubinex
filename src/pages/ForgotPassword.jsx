import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../assets/logovi.mp4";


const securityQuestions = [
  { key: "q1", question: "What is your favorite color?" },
  { key: "q2", question: "What is your favorite food?" },
  { key: "q3", question: "What is your pet's name?" },
  { key: "q4", question: "Which place do you like the most?" },
  { key: "q5", question: "Which movie is your favorite?" },
  { key: "q6", question: "What is your dream bike?" },
];

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // next box focus
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };
  const generateRandomQuestions = () => {
    const shuffled = [...securityQuestions].sort(() => 0.5 - Math.random());
    setRandomQuestions(shuffled.slice(0, 3));
    setAnswers({});
    setStep("questions");
  };

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const verifySecurityAnswers = () => {
//     const savedUser = JSON.parse(localStorage.getItem("userData"));

//     if (!savedUser) {
//       alert("User data not found");
//       return;
//     }

//     if (savedUser.email !== email) {
//       alert("Email does not match");
//       return;
//     }

//     const isCorrect = randomQuestions.every((q) => {
//       return (
//         savedUser[q.key]?.toLowerCase().trim() ===
//         answers[q.key]?.toLowerCase().trim()
//       );
//     });

//     if (isCorrect) {
// if (isCorrect) {
//   setStep("reset");
// }
//     } else {
//       alert("Security answers are wrong");
//     }
setStep("reset");
  };

  const handleResetPassword = () => {
  if (!newPassword || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Password does not match");
    return;
  }

  const savedUser = JSON.parse(localStorage.getItem("userData"));

  const updatedUser = {
    ...savedUser,
    password: newPassword,
    confirmPassword: confirmPassword,
  };

  localStorage.setItem("userData", JSON.stringify(updatedUser));

  alert("Password updated successfully");
  navigate("/");
};


  return (
    <div className="forgot-container">

      {/* LEFT SIDE */}
      <div className="forgot-left">
        <h4>Secure & Regulated Platform</h4>
        <h1>
          Recover your <span>Account</span> Securely
        </h1>
        <p>We’ll help you get back into your account safely.</p>

        <div className="gold-orb"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="forgot-right">
        <div className="forgot-card">

          <h2>
            {step === "email" ? "Forgot Password" : "OTP Verification"}
          </h2>

          {/* EMAIL STEP */}
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

              <button disabled={!email} onClick={() => setStep("otp")}>
                Generate OTP
              </button>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <>
              <p className="otp-text">
                OTP sent to <b>{email}</b>
              </p>

              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, index)
                    }
                  />
                ))}
              </div>

              <button
                disabled={otp.join("").length !== 6}
                onClick={generateRandomQuestions}
              >
                Verify & Continue
              </button>
            </>
          )}
          {step === "questions" && (
            <>
              <p className="otp-text">
                Answer these 3 security questions
              </p>

              {randomQuestions.map((q, index) => (
                <div className="form-group" key={q.key}>
                  <label>
                    {index + 1}. {q.question}
                  </label>
                  <input
                    type="text"
                    value={answers[q.key] || ""}
                    onChange={(e) =>
                      handleAnswerChange(q.key, e.target.value)
                    }
                    required
                  />
                </div>
              ))}

              <button
                disabled={randomQuestions.some((q) => !answers[q.key])}
                onClick={verifySecurityAnswers}
              >
                Verify Answers
              </button>
            </>
          )}

          {step === "reset" && (
  <>
    <p className="otp-text">Create your new password</p>

    <div className="form-group">
      <label>New Password</label>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>

    <button
      disabled={!newPassword || !confirmPassword}
      onClick={handleResetPassword}
    >
      Update Password
    </button>
  </>
)}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;