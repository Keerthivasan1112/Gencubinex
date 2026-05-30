import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logovi.mp4";
import "./Otp.css";

function OtpVerification() {

  const location = useLocation();
  const navigate = useNavigate();
  const { email, phoneNumber } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace") {

      const newOtp = [...otp];

      if (otp[index] === "" && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

debugger;
 const verifyOtp = async () => {
  const finalOtp = otp.join("");

  if (finalOtp.length !== 5) {
    alert("Enter valid OTP");
    return;
  }

  try {
    const res = await fetch("https://13.207.152.124:5299/api/signin/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({
  email: email,
  otp: finalOtp
})
    });
if (res.ok) {
  localStorage.setItem("userEmail", email); // ✅ MUST
}
    const data = await res.text();

    if (data === "Login Success") {
      alert("OTP Verified Successfully");
      
      navigate("/home");
    } else {
      alert("Invalid OTP");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  // const verifyOtp = () => {

  //   if (otp.join("").length === 6) {

  //     alert("OTP Verified Successfully");
  //     navigate("/home", { state: { formData } });

  //   } else {
  //     alert("Enter valid OTP");
  //   }

  // };

  return (

    <div className="otp-wrapper">

      {/* LEFT SIDE BRANDING */}
      <div className="otp-left">

        <h4>Secure & Regulated by VARA</h4>

        <h1>
          Your trusted partner for <span>virtual</span> assets
        </h1>

        <div className="branding-video">
          <video
            src={logo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

      </div>


      {/* RIGHT SIDE CARD */}
      <div className="otp-right">

        <div className="otp-card">

          <h2>OTP Verification</h2>

          <p>
  Enter the OTP sent to <b>{email}</b>
</p>

          <div className="otp-box-container">

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

          <button onClick={verifyOtp}>
            Verify OTP
          </button>

        </div>

      </div>

    </div>

  );
}

export default OtpVerification;