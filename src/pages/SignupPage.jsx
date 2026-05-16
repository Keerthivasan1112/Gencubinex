import { useState ,useEffect,useRef} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import logo from '../assets/logovi.mp4';
import "./SignupPage.css";

function Signup() {
  const [rotate, setRotate] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const location = useLocation();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [showAgreementPopup, setShowAgreementPopup] = useState(false);
  const [personalSubStep, setPersonalSubStep] = useState(1);


  const accounts = [
  {
    bank: "SBI Bank",
    account: "1234567890",
    ifsc: "SBIN0001234"
  },
  {
    bank: "HDFC Bank",
    account: "9876543210",
    ifsc: "HDFC0005678"
  },
  {
    bank: "ICICI Bank",
    account: "4561237890",
    ifsc: "ICIC0009012"
  }
];

// 🔥 random account select
const [selectedAccount, setSelectedAccount] = useState(null);



const [popupChecks, setPopupChecks] = useState({
  term1: false,
  term2: false,
  term3: false,
  term4: false,
  term5: false,
});

const defaultFormData = {
  pageName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  aadharNumber: "",
  aadharPhoto: null,
  panNumber: "",
  panCard: null,
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  fatherName: "",
  motherName: "",
  maritalStatus: "",
  spouseName: "",
  spouseAadharNumber: "",
  spouseAadharPhoto: null,
  spousePanNumber: "",
  spousePanCard: null,

  addressVerificationDoc: null,
  declarationUndertak: null,
  customerUndertake: null,
  gdprDeclaration: null,

  accountHolderName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  bankName: "",
  bankStatement: null,
  sourceOfFund: null,
  sourceOfWealth: null,

  agreementPDF: null,
  videoFile: null,

   paymentMethod: "",
  walletType: "",
  walletAddress: "",
  cardNumber: "",
  expiry: "",
  gpayId: "",
  walletLimit: "",

  term1: false,
  term2: false,
  term3: false,
  term4: false,
  cashDeposit: false,
  selectedAccount: "",
  pdfFile: null
};

const [formData, setFormData] = useState(
  location.state?.formData || defaultFormData
);

useEffect(() => {
  if (formData.cashDeposit) {
    const random = accounts[Math.floor(Math.random() * accounts.length)];
    setSelectedAccount(random);
  }
}, [formData.cashDeposit]);
  

// 🎬 Start Recording

const startCamera = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: true,
    });

    videoRef.current.srcObject = stream;

    // AUTO START RECORDING WHEN CAMERA ON
    startRecording(stream);

  } catch (error) {
    console.error("Camera error:", error);
    alert("Camera access denied");
  }
};

const startRecording = (stream) => {
  let options = {};

  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    options = { mimeType: "video/webm;codecs=vp9" };
  } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    options = { mimeType: "video/webm;codecs=vp8" };
  } else {
    options = { mimeType: "video/webm" };
  }

  const mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorderRef.current = mediaRecorder;

  let chunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const videoURL = URL.createObjectURL(blob);

    setRecordedVideoURL(videoURL);

    setFormData((prev) => ({
      ...prev,
      videoFile: blob,
    }));

    stream.getTracks().forEach((track) => track.stop());

    clearInterval(timerRef.current);
    setRecording(false);
    setTimer(0);
  };

  mediaRecorder.start();
  setRecording(true);

  // TIMER START
  setTimer(0);
  timerRef.current = setInterval(() => {
    setTimer((prev) => {
      if (prev >= 119) {
        stopRecording();
        return 120;
      }
      return prev + 1;
    });
  }, 1000);
};

const stopRecording = () => {
  if (mediaRecorderRef.current && recording) {
    mediaRecorderRef.current.stop();
  }

  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  setRecording(false);
};


useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, []);

useEffect(() => {
  if (location.state?.formData) {
    setFormData(location.state.formData);
  }

  if (location.state?.editStep) {
    setCurrentStep(location.state.editStep);
  }
}, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const validateQuestions = () => {
  return (
    formData.q1 &&
    formData.q2 &&
    formData.q3 &&
    formData.q4 &&
    formData.q5 &&
    formData.q6 &&
    formData.q7 &&
    formData.q8 &&
    formData.q9 &&
    formData.q10
  );
};

  const validateStep = () => {
    if (currentStep === 1) {
      if (personalSubStep === 2) {
      return (
        formData.q1 &&
        formData.q2 &&
        formData.q3 &&
        formData.q4 &&
        formData.q5 &&
        formData.q6
      );
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    formData.pageName &&
    emailRegex.test(formData.email) &&
    formData.email === formData.confirmEmail &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.phoneNumber &&
    formData.aadharNumber.length === 12 &&
    formData.aadharPhoto &&
    formData.panNumber &&
    formData.panCard &&
    formData.fatherName &&
    formData.motherName &&
    formData.maritalStatus &&
    formData.gender &&
    formData.address &&
    formData.city &&
    formData.state &&
    formData.pincode.length === 6 &&
    formData.country &&
    (formData.maritalStatus === "unmarried" ||
      (formData.spouseName &&
        formData.spouseAadharNumber &&
        formData.spouseAadharPhoto &&
        formData.spousePanNumber &&
        formData.spousePanCard))
  );
}
    if (currentStep === 3) {
      return formData.addressVerificationDoc && formData.declarationUndertak && formData.customerUndertake && formData.declarationUndertak && formData.customerUndertake && formData.declarationUndertak && formData.customerUndertake &&
             formData.gdprDeclaration;
    }
    if (currentStep === 2) {
      return formData.accountHolderName && formData.accountNumber && formData.confirmAccountNumber && formData.accountNumber === formData.confirmAccountNumber && formData.bankStatement && formData.sourceOfFund && formData.sourceOfWealth &&
             formData.ifscCode && formData.bankName;
    }
    if (currentStep === 4) {
      return agreementChecked && formData.agreementPDF;
    }
    if (currentStep === 5) {
      return formData.videoFile;
    }
    if (currentStep === 6) {
        return formData.walletType;
      }
    if (currentStep === 7) {
      return formData.term1 && formData.term2 && formData.term3 && formData.term4 && formData.cashDeposit;
    }

    return false;
  };

  const handleNext = () => {

     if (currentStep === 1) {
    if (personalSubStep === 1) {
      if (validateStep()) {
        setPersonalSubStep(2);
      } else {
        alert("Please fill all Personal Details");
      }
      return;
    }

    if (personalSubStep === 2) {
      if (validateQuestions()) {
        setCurrentStep(2);
      } else {
        alert("Please answer all 10 questions");
      }
      return;
    }
  }

    if (validateStep()) {
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert("Please fill all required fields");
    }
  };

  const handlePrevious = () => {
     if (currentStep === 1 && personalSubStep === 2) {
    setPersonalSubStep(1);
    return;
  }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log("Form Data:", formData);
      // Add your signup logic here
      alert("Signup completed successfully!");
      setRotate(true);
      
      setTimeout(() => {
        navigate("/");
      }, 800);
    }
  };

  const handleSigninClick = (e) => {
    e.preventDefault();
    setRotate(true);

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className={`signup-wrapper ${rotate ? "rotate-page" : ""}`}>

  {/* LEFT SIDE BRANDING */}
  {/* <div className="signup-left">
    <p className="vara-text">Secure & Regulated by VARA</p>

    <h1 className="main-heading">
      Your trusted <br />
      partner for <span>virtual</span> <br />
      assets
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
  </div> */}

  {/* RIGHT SIDE FORM */}
  <div className="signup-right">
    <div className="signup-card signup-card-full">

        <p style={{ color: 'red', marginBottom: '5%' }}>NOTES : The information provided below has been compiled strictly in accordance with the guidance of <a href="https://fiu.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#0040ff', textDecoration: 'underline' }}>FIU–India</a>.</p>

        <h3>Create Account</h3>

        {/* STEP INDICATOR */}
        <div className="step-indicator">
          {[1, 2, 3, 4, 5,6,7].map((step) => (
            <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
              <span>{step}</span>
              <p className="step-label">
                {step === 1 && "Personal"}
                {step === 2 && "Bank"}
                {step === 3 && "Questorys"}
                {step === 4 && "Agreement"}
                {step === 5 && "Video"}
                {step === 6 && "Wallet"}
                {step === 7 && "Cash Deposit"}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSignupSubmit}>

          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div className="step-content">
              <h4>{personalSubStep === 1 ? "1. Personal Details" : "1.1 Questions"}</h4>
              {personalSubStep === 1 && (
  <>
              <div className="form-group">
                <label>User Name As Per Aadhaar *</label>
                <input
                  type="text"
                  name="pageName"
                  value={formData.pageName}
                  onChange={handleInputChange}
                  required
                />
              </div> 

              

               <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

               <div className="form-group">
                <label>Date Of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                 <label>Email Id *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                    setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))
                }
              required
            />

            {formData.email &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
              <p className="error-message">
              Please enter a valid email
              </p>
            )}
          </div>


          <div className="form-group">
            <label>Confirm Email *</label>
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={(e) =>
                setFormData(prev => ({
                ...prev,
                confirmEmail: e.target.value
              }))
            }
            required
          />

        {formData.confirmEmail &&
          formData.email !== formData.confirmEmail && (
          <p className="error-message">
          Email does not match
          </p>
          )}
        </div>


              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {formData.password !== formData.confirmPassword && (
                  <p className="error-message">Passwords do not match!</p>
                )}
              </div>


              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={{width:'100%'}}
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* State */}
            <div className="form-group">
              <label>State *</label>
              <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // numbers only
            if (value.length <= 6) {
            setFormData(prev => ({
            ...prev,
          pincode: value
        }));
      }
    }}
    maxLength={6}
    required
  />
  {formData.pincode.length > 0 && formData.pincode.length !== 6 && (
    <p className="error-message">Pincode must be exactly 6 digits</p>
  )}
</div>

{/* Country */}
      <div className="form-group">
        <label>Country *</label>
        <input
          type="text"
          name="country"
          list="countryList"
          value={formData.country}
          onChange={handleInputChange}
          required
        />

  <datalist id="countryList">
    <option value="India" />
    <option value="United States" />
    <option value="United Kingdom" />
    <option value="Canada" />
    <option value="Australia" />
    <option value="Singapore" />
    <option value="UAE" />
    <option value="Germany" />
    <option value="France" />
  </datalist>

      </div>

             <div className="form-group">
  <label>Gender *</label>

  <div className="radio-group">
    <label className="radio-label">
      <input
        type="radio"
        name="gender"
        value="male"
        checked={formData.gender === "male"}
        onChange={handleInputChange}
        required
      />
      Male
    </label>

    <label className="radio-label">
      <input
        type="radio"
        name="gender"
        value="female"
        checked={formData.gender === "female"}
        onChange={handleInputChange}
      />
      Female
    </label>

    <label className="radio-label">
      <input
        type="radio"
        name="gender"
        value="other"
        checked={formData.gender === "other"}
        onChange={handleInputChange}
      />
      Other
    </label>
  </div>
</div>

                <div className="form-group">
                <label>Aadhaar Number *</label>
               <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // numbers only
                if (value.length <= 12) {
                  setFormData(prev => ({
                  ...prev,
                  aadharNumber: value
                }));
                }
              }}
              maxLength={16}
              required
            />
            {formData.aadharNumber.length > 0 && formData.aadharNumber.length !== 12 && (
            <p className="error-message">Aadhaar number must be exactly 12 digits</p>
          )}
        </div>

              <div className="form-group">
                <label>Aadhaar Upload (Download before 30 Days) *</label>
                <input
                  type="file"
                  name="aadharPhoto"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.aadharPhoto && (
                  <p className="file-name">✓ {formData.aadharPhoto.name}</p>
                )}
              </div>
              

              <div className="form-group">
                <label>PAN Card Number *</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>PAN Upload (Download before 30 Days) *</label>
                <input
                  type="file"
                  name="panCard"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.panCard && (
                  <p className="file-name">✓ {formData.panCard.name}</p>
                )}
              </div>

             


              <div className="form-group">
                <label>Father Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mother Name *</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                />
              </div>

             

              {/* Marital Status */}
              <div className="form-group">
                <label>Marital Status *</label>
                <div style={{ display: "flex", gap: "20px" }}>
                  <label>
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="married"
                      checked={formData.maritalStatus === "married"}
                      onChange={handleInputChange}
                      required
                    />
                    Married
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="unmarried"
                      checked={formData.maritalStatus === "unmarried"}
                      onChange={handleInputChange}
                    />
                    Unmarried
                  </label>
                </div>
              </div>
                            {formData.maritalStatus === "married" && (
                <>
                  <h4 style={{ marginTop: "25px" }}>Spouse  Details</h4>

                  <div className="form-group">
                    <label>Spouse Name *</label>
                    <input
                      type="text"
                      name="spouseName"
                      value={formData.spouseName}
                      onChange={handleInputChange}
                      required
                    />

                  </div>

                  <div className="form-group">
                    <label> Spouse Aadhaar *</label>
                    <input
                      type="text"
                      name="spouseAadharNumber"
                      value={formData.spouseAadharNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Spouse Aadhaar Upload *</label>
                    <input
                      type="file"
                      name="spouseAadharPhoto"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Spouse PANCARD Number *</label>
                    <input
                      type="text"
                      name="spousePanNumber"
                      value={formData.spousePanNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Spouse PANCARD Upload *</label>
                    <input
                      type="file"
                      name="spousePanCard"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </>
                
              )}
              </>
)}
{personalSubStep === 2 && (
  <div className="step-content">
    <div className="form-group">
      <label>1. What is your favorite color?</label>
      <input
        type="text"
        name="q1"
        value={formData.q1}
        onChange={handleInputChange}
        required
      />
    </div>

    <div className="form-group">
      <label>2. What is your favorite food?</label>
      <input
        type="text"
        name="q2"
        value={formData.q2}
        onChange={handleInputChange}
        required
      />
    </div>

    <div className="form-group">
      <label>3. What is your pet's name?</label>
      <input
        type="text"
        name="q3"
        value={formData.q3}
        onChange={handleInputChange}
        required
      />
    </div>


    <div className="form-group">
      <label>4. which place do you like the most?</label>
      <input
        type="text"
        name="q4"
        value={formData.q4}
        onChange={handleInputChange}
        required
      />
    </div>

    <div className="form-group">
      <label>5. which movie is your favorite?</label>
      <input
        type="text"
        name="q5"
        value={formData.q5}
        onChange={handleInputChange}
        required
      />  
    </div>

    <div className="form-group">
      <label>6. what is your dream bike?</label>
      <input
        type="text"
        name="q6"
        value={formData.q6}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
)}
            </div>
          )}

          {/* STEP 3: AGREEMENT */}
          {currentStep === 3 && (
            <div className="step-content">
              <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                
                {/* LEFT SIDE - AGREEMENT */}
                <div style={{ flex: 1 }}>
                  <h4>3. Terms & Agreement</h4>

                  <div >
                  <h5>Documents</h5>

                  {/* ADDRESS VERIFICATION */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: '600', margin: 0, display: 'block', marginBottom: '8px',textAlign: 'left' }}>1. Address Verification</label>
                      <input
                        type="file"
                        name="addressVerificationDoc"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                      />
                      {formData.addressVerificationDoc && (
                        <p style={{ color: '#689f38', marginTop: '8px', fontSize: '12px', textAlign: 'left' }}>✓ Uploaded</p>
                      )}
                    </div>
                    <div style={{ flex: 0.3, display: 'flex', justifyContent: 'flex-end', paddingTop: '5px' }}>
                      <a 
                        href="/address-verification.pdf" 
                        download="Address_Verification.pdf"
                        title="Download Address Verification"
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#f4c430',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>


                {/* DECLARATION & UNDERTAKING */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: '600', margin: 0, display: 'block', marginBottom: '8px',textAlign: 'left' }}>2. Declaration Undertake of complition and source of fund</label>
                      <input
                        type="file"
                        name="declarationUndertak"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                      />
                      {formData.declarationUndertak && (
                        <p style={{ color: '#689f38', marginTop: '8px', fontSize: '12px', textAlign: 'left' }}>✓ Uploaded</p>
                      )}
                    </div>
                    <div style={{ flex: 0.3, display: 'flex', justifyContent: 'flex-end', paddingTop: '5px' }}>
                      <a 
                        href="/declaration.pdf" 
                        download="Declaration_Undertaking.pdf"
                        title="Download Declaration"
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#f4c430',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: '600', margin: 0, display: 'block', marginBottom: '8px',textAlign: 'left' }}>3. AML,CFT and source fund (us for cropyt trading) decleartion</label>
                      <input
                        type="file"
                        name="declarationUndertak"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                      />
                      {formData.declarationUndertak && (
                        <p style={{ color: '#689f38', marginTop: '8px', fontSize: '12px', textAlign: 'left' }}>✓ Uploaded</p>
                      )}
                    </div>
                    <div style={{ flex: 0.3, display: 'flex', justifyContent: 'flex-end', paddingTop: '5px' }}>
                      <a 
                        href="/customerUndertake.pdf" 
                        download="Customer_Undertaking.pdf"
                        title="Download Customer Undertaking"
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#f4c430',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>


                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: '600', margin: 0, display: 'block', marginBottom: '8px',textAlign: 'left' }}>4. Customer undertake king for link</label>
                      <input
                        type="file"
                        name="customerUndertake"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                      />
                      {formData.customerUndertake && (
                        <p style={{ color: '#689f38', marginTop: '8px', fontSize: '12px', textAlign: 'left' }}>✓ Uploaded</p>
                      )}
                    </div>
                    <div style={{ flex: 0.3, display: 'flex', justifyContent: 'flex-end', paddingTop: '5px' }}>
                      <a 
                        href="/customerUndertake.pdf" 
                        download="Customer_Undertaking.pdf"
                        title="Download Customer Undertaking"
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#f4c430',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: '600', margin: 0, display: 'block', marginBottom: '8px',textAlign: 'left' }}>5. Letter of ostiontion</label>
                      <input
                        type="file"
                        name="declarationUndertak"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                      />
                      {formData.declarationUndertak && (
                        <p style={{ color: '#689f38', marginTop: '8px', fontSize: '12px', textAlign: 'left' }}>✓ Uploaded</p>
                      )}
                    </div>
                    <div style={{ flex: 0.3, display: 'flex', justifyContent: 'flex-end', paddingTop: '5px' }}>
                      <a 
                        href="/declaration.pdf" 
                        download="Declaration_Undertaking.pdf"
                        title="Download Declaration"
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#f4c430',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: '600', margin: 0, display: 'block', marginBottom: '8px',textAlign: 'left' }}>6. Poicticaly expoes person (PEP) self decleartion</label>
                      <input
                        type="file"
                        name="declarationUndertak"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                      />
                      {formData.declarationUndertak && (
                        <p style={{ color: '#689f38', marginTop: '8px', fontSize: '12px', textAlign: 'left' }}>✓ Uploaded</p>
                      )}
                    </div>
                    <div style={{ flex: 0.3, display: 'flex', justifyContent: 'flex-end', paddingTop: '5px' }}>
                      <a 
                        href="/declaration.pdf" 
                        download="Declaration_Undertaking.pdf"
                        title="Download Declaration"
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#f4c430',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: '600', margin: 0, display: 'block', marginBottom: '8px',textAlign: 'left' }}>7. GDPR (General Data Protection Regulation)</label>
                      <input
                        type="file"
                        name="gdprDeclaration"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                      />
                      {formData.gdprDeclaration && (
                        <p style={{ color: '#689f38', marginTop: '8px', fontSize: '12px', textAlign: 'left' }}>✓ Uploaded</p>
                      )}
                    </div>
                    <div style={{ flex: 0.3, display: 'flex', justifyContent: 'flex-end', paddingTop: '5px' }}>
                      <a 
                        href="/gdpr.pdf" 
                        download="GDPR.pdf"
                        title="Download GDPR Declaration"
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#f4c430',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  


                </div>    
                    


                </div>

              </div>
            </div>
          )}

          {/* STEP 2: BANK DETAILS */}
          {currentStep === 2 && (
            <div className="step-content">
              <h4>2. Bank Details</h4>
             
              <div className="form-group">
                <label>Name on Bank Account <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="accountHolderName"
                  placeholder="Enter account holder name" 
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Number <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="accountNumber"
                  placeholder="Enter account number" 
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Account Number <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="confirmAccountNumber"
                  placeholder="Re-enter account number"
                  value={formData.confirmAccountNumber}
                  onChange={handleInputChange}
                  required
                />
                 {formData.accountNumber !== formData.confirmAccountNumber && (
                  <p className="error-message">Account numbers do not match!</p>
                )}  

              </div>

              <div className="form-group">
                <label>Bank Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="bankName"
                  placeholder="Enter bank name" 
                  value={formData.bankName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>IFSC Code <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="ifscCode"
                  placeholder="Enter IFSC code" 
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  required
                />
              </div>


              


              <div className="form-group">
                <label>Upload Bank Statement (Last 1 Year) <span className="required">*</span></label>
                <input 
                  type="file" 
                  name="bankStatement"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.bankStatement && (
                  <p className="file-name">✓ {formData.bankStatement.name}</p>
                )}
              </div>
               
                <div className="form-group">
                <label>Source Of Fund (Last 1 Year Bank Statement)  <span className="required">*</span></label>
                <input 
                  type="file" 
                  name="sourceOfFund"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.sourceOfFund && (
                  <p className="file-name">✓ {formData.sourceOfFund.name}</p>
                )}
              </div>

              <div className="form-group">
                <label>Source Of Wealth Upload (last 1 Year Bank Statement)  <span className="required">*</span></label>
                <input 
                  type="file" 
                  name="sourceOfWealth"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.sourceOfWealth && (
                  <p className="file-name">✓ {formData.sourceOfWealth.name}</p>
                )}
              </div>

               <div className="bank-requirements">
                <h5>Bank Statement Requirements:</h5>
                <ul>
                  <li>✓ Must be a PDF file</li>
                  <li>✓ Should cover the last 12 months</li>
                  <li>✓ Must include account holder's name and account number</li> 
                  <li>✓ Should show all transactions and balances</li>
                  <li>✓ Source of Fund and Source of Wealth should be different </li>
                </ul>
                </div>
              

              
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content">
              <h4>4. Agreement PDF</h4>
              <p className="declaration-instruction">
                Please upload the signed agreement PDF.
              </p>

              <div className="form-group">
                <label>Upload Signed Agreement PDF *</label>
                <input
                  type="file"
                  name="agreementPDF"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.agreementPDF && (
                  <p style={{ color: '#689f38', marginTop: '8px' }}>✓ {formData.agreementPDF.name} uploaded</p>
                )}
              </div>

              <div className=" checkbox-group" style={{ marginTop: '20px',color: '#520df4', fontWeight: '600' }}>
                <label>
                  <input 
                    type="checkbox"
                    checked={agreementChecked}
                    onChange={() => {
                  if (!agreementChecked) {
                  setShowAgreementPopup(true);
                  } else {
                      setAgreementChecked(false);
                    }
                  }}
                />
                  <span>I agree to all terms and conditions</span>
                </label>
              </div>
              {showAgreementPopup && (
              <div className="popup-overlay">
                <div className="popup-box">
                      <h3>Terms & Conditions</h3>

                    <div className="popup-content">

        <label>
          <input
            type="checkbox"
            checked={popupChecks.term1}
            onChange={(e) =>
              setPopupChecks({ ...popupChecks, term1: e.target.checked })
            }
          />
          <span>
          I confirm all personal details are correct.
          </span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={popupChecks.term2}
            onChange={(e) =>
              setPopupChecks({ ...popupChecks, term2: e.target.checked })
            }
          />
          <span>
          I agree to AML & KYC compliance.
          </span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={popupChecks.term3}
            onChange={(e) =>
              setPopupChecks({ ...popupChecks, term3: e.target.checked })
            }
          />
          <span>
          I understand data protection policies.
          </span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={popupChecks.term4}
            onChange={(e) =>
              setPopupChecks({ ...popupChecks, term4: e.target.checked })
            }
          />
          <span>
          I confirm source of funds is legitimate.
          </span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={popupChecks.term5}
            onChange={(e) =>
              setPopupChecks({ ...popupChecks, term5: e.target.checked })
            }
          />
          <span>
          I agree to all regulatory requirements.
          </span>
        </label>

      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          className="confirm-btn"
          disabled={
            !popupChecks.term1 ||
            !popupChecks.term2 ||
            !popupChecks.term3 ||
            !popupChecks.term4 ||
            !popupChecks.term5
          }
          onClick={() => {
            setAgreementChecked(true);
            setShowAgreementPopup(false);
          }}
        >
          Confirm
        </button>

        <button
          className="cancel-btn"
          onClick={() => setShowAgreementPopup(false)}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
            </div>
          )}

          {/* STEP 5: VIDEO CONFIRMATION */}
        {currentStep === 5 && (
  <div className="step-content">
    <h4>5. Video Confirmation</h4>

    <p className="video-instruction">
      Record a short video (Maximum 2 Minutes).
      Please show your face clearly and confirm your name & phone number.
    </p>

    <div className="video-requirements">
      <div>{formData.pageName}</div>
      <div>{formData.phoneNumber}</div>
    </div>


    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={recording}
        controls={!recording && !!recordedVideoURL}
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "10px",
          background: "#000",
        }}
      />
    </div>

    {/* ⏱ Timer */}
    {recording && (
      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: timer >= 110 ? "red" : "green",
          marginBottom: "15px",
        }}
      >
        ⏱ {Math.floor(timer / 60)}:
        {(timer % 60).toString().padStart(2, "0")} / 2:00
      </p>
    )}

    {!recording ? (
      <button
        type="button"
        className="next-btn"
        onClick={startCamera}
      >
        🎥 Start Recording
      </button>
    ) : (
      <button
        type="button"
        className="prev-btn"
        onClick={stopRecording}
      >
        ⏹ Stop Recording
      </button>
    )}

    {recordedVideoURL && !recording && (
      <p style={{ color: "green", marginTop: "15px" }}>
        ✓ Video recorded successfully
      </p>
    )}

              <div className="video-requirements">
                <h5>Video Requirements:</h5>
                <ul>
                  <li>✓ Clear face visibility</li>
                  <li>✓ Good lighting</li>
                  <li>✓ Confirm your name and phone number</li>
                  <li>✓ Duration: 30 seconds - 2 minutes</li>
                  <li>✓ Maximum file size: 50MB</li>
                </ul>
              </div>
            </div>
          )}

            {/* STEP 6: WALLET CREATION */}
{currentStep === 6 && (
  <div className="step-content">
    <h4>6. Payment Setup</h4>

    {/* Payment Method */}
    <div className="form-groupes">
      <label>UPLOAD YOUR WALLET</label>
    </div>

    {/* 🔥 ONLY ONE SECTION WILL RENDER */}
    <div className="dynamic-section">

{formData.paymentMethod === "wallet" && (
  <div className="form-group">

    {/* USDT SECTION */}
    <div className="wallet-block">
      <label className="main-label">USDT : </label>

      <div className="sub-field">
        <label>TRC20</label>
        <input
          type="text"
          name="usdt_trc20"
          placeholder="Enter TRC20 Address"
          value={formData.usdt_trc20}
          onChange={handleInputChange}
        />
      </div>

      <div className="sub-field">
        <label>BEP20</label>
        <input
          type="text"
          name="usdt_bep20"
          placeholder="Enter BEP20 Address"
          value={formData.usdt_bep20}
          onChange={handleInputChange}
        />
      </div>
      <div className="sub-field">
        <label>ERC20</label>
        <input
          type="text"
          name="usdt_erc20"
          placeholder="Enter ERC20 Address"
          value={formData.usdt_erc20}
          onChange={handleInputChange}
        />
      </div>
    </div>

    {/* BTC */}
    <div className="wallet-block">
      <label className="main-label">BTC</label>
      <input
        type="text"
        name="btc"
        placeholder="Enter BTC Address"
        value={formData.btc}
        onChange={handleInputChange}
      />
    </div>

    {/* BNB */}
    <div className="wallet-block">
      <label className="main-label">BNB</label>
      <input
        type="text"
        name="bnb"
        placeholder="Enter BNB Address"
        value={formData.bnb}
        onChange={handleInputChange}
      />
    </div>

    {/* ETH */}
    <div className="wallet-block">
      <label className="main-label">ETH</label>
      <input
        type="text"
        name="eth"
        placeholder="Enter ETH Address"
        value={formData.eth}
        onChange={handleInputChange}
      />
    </div>

  </div>
)}
    </div>

    {/* LIMIT */}
    <div className="form-group">
      <label>Select Limit *</label>
      <div className="radio-group">

        <label>
          <input
            type="radio"
            name="walletLimit"
            value="50000"
            checked={formData.walletLimit === "50000"}
            onChange={handleInputChange}
          />
          ₹50,000
        </label>

        <label>
          <input
            type="radio"
            name="walletLimit"
            value="100000"
            checked={formData.walletLimit === "100000"}
            onChange={handleInputChange}
          />
          ₹1,00,000
        </label>

      </div>
    </div>

  </div>
)}

{currentStep === 7 && (
  <div className="step-content">
    <h4>7. Terms & Deposit</h4>

    {/* CHECKBOX */}
    <div className="  checkbox-list">

      <label className="checkbox-item">
        <input type="checkbox" name="term1" checked={formData.term1} onChange={handleInputChange} />
        <span>I agree to platform terms</span>
      </label>

      <label className="checkbox-item">
        <input type="checkbox" name="term2" checked={formData.term2} onChange={handleInputChange} />
        <span>I confirm all details are correct</span>
      </label>

      <label className="checkbox-item">
        <input type="checkbox" name="term3" checked={formData.term3} onChange={handleInputChange} />
        <span>I accept transaction policy</span>
      </label>

      <label className="checkbox-item">
        <input type="checkbox" name="term4" checked={formData.term4} onChange={handleInputChange} />
        <span>I understand risk factors</span>
      </label>

      <label className="checkbox-item highlight">
        <input type="checkbox" name="cashDeposit" checked={formData.cashDeposit} onChange={handleInputChange} />
        <span>Cash Only Deposit</span>
      </label>

    </div>

    {/* 🔥 ACCOUNT SELECT */}
    {formData.cashDeposit && selectedAccount && (
  <div className="account-section">

    <h5>Deposit Account Details</h5>

    <div className="account-details">
      <strong>{selectedAccount.bank}</strong><br />
      Account No: {selectedAccount.account} <br />
      IFSC: {selectedAccount.ifsc}
    </div>

  </div>
)}
<div className="form-grouppes">
  <label>Upload PDF *</label>

  <input 
  className="inputtag"
    type="file"
    name="pdfFile"
    accept="application/pdf"
    onChange={handleFileChange}
  />
  {formData.pdfFile && (
        <p style={{color:"green"}}>File uploaded successfully</p>
      )}
</div>
<h3>The Process take 4-5 Days</h3>

  </div>
)}
          {/* NAVIGATION BUTTONS */}
          <div className="form-buttons">
            <button 
              type="button" 
              className="prev-btn"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            
            {currentStep < 7 ? (
              <button 
                type="button" 
                className="next-btn"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
             <button
                type="button"
                className="signup-btn"
                style={{width:'20%'}}
                onClick={() => {
              if (validateStep()) {
                localStorage.setItem("userData", JSON.stringify(formData));
                localStorage.setItem("userEmail", formData.email);
                 navigate("/review", { state: { formData } });
              } else {
                  alert("Please fill all required fields");
              }
            }}
              disabled={!validateStep() || !agreementChecked}
            >
          Verify
        </button>
            )}
          </div>
        </form>

        <p className="signin-text">
          Already have an account?{" "}
          <span className="link-btn" onClick={handleSigninClick}>
            Sign in
          </span>
        </p>
      </div>
    </div>
    </div>
  );
}

export default Signup;