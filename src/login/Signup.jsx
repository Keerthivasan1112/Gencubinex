import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/log.svg';
import "./Signup.css";

function Signup() {
  const [rotate, setRotate] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    pageName: "",
    email: "",
    phoneNumber: "",
    aadharNumber: "",
    aadharPhoto: null,
    panNumber: "",
    panCard: null,
    // Step 3: Bank Details
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    // Step 4: Video Confirmation
    videoFile: null,
  });

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

  const validateStep = () => {
    if (currentStep === 1) {
      return formData.pageName && formData.email && formData.phoneNumber && 
             formData.aadharNumber && formData.aadharPhoto && 
             formData.panNumber && formData.panCard;
    }
    if (currentStep === 2) {
      return agreementChecked;
    }
    if (currentStep === 3) {
      return formData.accountHolderName && formData.accountNumber && 
             formData.ifscCode && formData.bankName;
    }
    if (currentStep === 4) {
      return formData.videoFile;
    }
    return false;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert("Please fill all required fields");
    }
  };

  const handlePrevious = () => {
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
      navigate("/login");
    }, 800);
  };

  return (
    <div className={`signup-wrapper ${rotate ? "rotate-page" : ""}`}>
      <div className="signup-card signup-card-full">
        <div className="logo">
          <img src={logo} alt="Logo" style={{ width: "10%" }} />
          <h2>GENCUBINEX</h2>
        </div>

        <h3>Create Account</h3>

        {/* STEP INDICATOR */}
        <div className="step-indicator">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
              <span>{step}</span>
              <p className="step-label">
                {step === 1 && "Personal"}
                {step === 2 && "Agreement"}
                {step === 3 && "Bank"}
                {step === 4 && "Video"}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSignupSubmit}>

          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div className="step-content">
              <h4>1. Personal Details</h4>
              
              <div className="form-group">
                <label>Page Name</label>
                <input 
                  type="text" 
                  name="pageName"
                  placeholder="Enter your page/business name" 
                  value={formData.pageName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  placeholder="Enter your phone number" 
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Aadhar Number <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="aadharNumber"
                  placeholder="Enter your Aadhar number" 
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Aadhar Photo Upload <span className="required">*</span></label>
                <input 
                  type="file" 
                  name="aadharPhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {formData.aadharPhoto && (
                  <p className="file-name">✓ {formData.aadharPhoto.name}</p>
                )}
              </div>

              <div className="form-group">
                <label>PAN Number <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="panNumber"
                  placeholder="Enter your PAN number" 
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>PAN Card Upload <span className="required">*</span></label>
                <input 
                  type="file" 
                  name="panCard"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.panCard && (
                  <p className="file-name">✓ {formData.panCard.name}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: AGREEMENT */}
          {currentStep === 2 && (
            <div className="step-content">
              <h4>2. Terms & Agreement</h4>
              
              <div className="agreement-box">
                <h5>GENCUBINEX User Agreement</h5>
                <p>
                  By using GENCUBINEX, you agree to our Terms of Service and Privacy Policy.
                </p>
                <div className="agreement-content">
                  <p>
                    <strong>1. Service Agreement:</strong> You authorize GENCUBINEX to provide OTC trading services and related financial services.
                  </p>
                  <p>
                    <strong>2. Identity Verification:</strong> You confirm that all information provided is accurate and authorized.
                  </p>
                  <p>
                    <strong>3. Compliance:</strong> You acknowledge compliance with all applicable laws and regulations.
                  </p>
                  <p>
                    <strong>4. Risk Acknowledgment:</strong> You understand the risks associated with cryptocurrency trading.
                  </p>
                  <p>
                    <strong>5. Data Protection:</strong> You consent to the collection and processing of your personal data as outlined in our Privacy Policy.
                  </p>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                  />
                  <span>I agree to all terms and conditions</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: BANK DETAILS */}
          {currentStep === 3 && (
            <div className="step-content">
              <h4>3. Bank Details</h4>
              
              <div className="form-group">
                <label>Account Holder Name <span className="required">*</span></label>
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
            </div>
          )}

          {/* STEP 4: VIDEO CONFIRMATION */}
          {currentStep === 4 && (
            <div className="step-content">
              <h4>4. Video Confirmation</h4>
              
              <p className="video-instruction">
                Please upload a brief video (30 seconds - 2 minutes) for identity verification. 
                Show your face clearly and confirm your willingness to proceed.
              </p>

              <div className="form-group">
                <label>Video File Upload <span className="required">*</span></label>
                <input 
                  type="file" 
                  name="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                />
                {formData.videoFile && (
                  <p className="file-name">✓ {formData.videoFile.name}</p>
                )}
              </div>

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
            
            {currentStep < 4 ? (
              <button 
                type="button" 
                className="next-btn"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="signup-btn"
              >
                Complete Signup
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
  );
}

export default Signup;