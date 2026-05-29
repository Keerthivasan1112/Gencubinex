import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../assets/logovi.mp4";


const securityQuestions = [
  { key: "Q1", question: "What is your favorite color?" },
  { key: "Q2", question: "What is your favorite food?" },
  { key: "Q3", question: "What is your pet's name?" },
  { key: "Q4", question: "Which place do you like the most?" },
  { key: "Q5", question: "Which movie is your favorite?" },
  { key: "Q6", question: "What is your dream bike?" },
  { key: "Q7", question: " What is your childhood nickname?" },
  { key: "Q8", question: "What was your first school name?" },
  { key: "Q9", question: "What is your dream job?" },
  { key: "Q10", question: "What city were you born in?" },
  { key: "Q11", question: "Who is your favorite teacher?" },
  { key: "Q12", question: "What is your best friend's name?" },
  { key: "Q13", question: " What is your best friend's name?" },
  { key: "Q14", question: " What is your favorite game?" },
  { key: "Q15", question: " What was your first vehicle?" },
];

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [Password, setNewPassword] = useState("");
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
  const generateRandomQuestions = async () => {
const finalOtp = otp.join("");
debugger;
  const res = await fetch("https://localhost:7085/api/signin/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp: finalOtp }),
  });

  const data = await res.text();

  
if(data =="Invalid or Expired OTP") {
   return alert(data);
  }

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

   const handleForgot = async () => {
  if (!email ) {
    alert("Please enter the email");
    return;
  }
debugger;
  const res = await fetch("https://localhost:7085/api/signin/forgotemailotp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.text();

  if (data === "OTP Sent") {
    setStep("otp");
  } else {
    alert(data);
  }
};

  const verifySecurityAnswers = async () => {

  const res = await fetch("https://localhost:7085/api/signin/verify-security-answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      answers,
    }),
  });

  const data = await res.text();

  if (data === "Security Answers Verified") {
    setStep("reset");
  } else {
    alert(data);
  }
};

  const handleResetPassword = async () => {
  if (!Password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (Password !== confirmPassword) {
    alert("Password does not match");
    return;
  }

  const res = await fetch("https://localhost:7085/api/signin/PasswordForgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      Password,
    }),
  });
const data = await res.text();   
   if (data === "Password") {
    alert("Password updated successfully");
  navigate("/");
  } else {
    alert("Password not updated");
  }


  
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

              <button disabled={!email} onClick={handleForgot}>
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
                disabled={otp.join("").length !== 5}
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

              {randomQuestions.map((Q, index) => (
                <div className="form-group" key={Q.key}>
                  <label>
                    {index + 1}. {Q.question}
                  </label>
                  <input
                    type="text"
                    value={answers[Q.key] || ""}
                    onChange={(e) =>
                      handleAnswerChange(Q.key, e.target.value)
                    }
                    required
                  />
                </div>
              ))}

              <button
                disabled={randomQuestions.some((Q) => !answers[Q.key])}
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
        value={Password}
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
      disabled={!Password || !confirmPassword}
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