import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logovi.mp4";
import "./Review.css";
import { MdDisabledVisible } from "react-icons/md";
import { BsDisplay } from "react-icons/bs";

function ReviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const formData = state?.formData;

  if (!formData) {
    return <h3>No Data Found</h3>;
  }

const handleConfirm = async () => {
  debugger;
  try {
    const data = new FormData();

    // ✅ TEXT FIELDS (PascalCase MUST match .NET)
    data.append("PageName", formData.pageName);
    data.append("Email", formData.email);
    data.append("Password", formData.password);
    data.append("PhoneNumber", formData.phoneNumber);
    data.append("DateOfBirth", formData.dateOfBirth);

    data.append("AadharNumber", formData.aadharNumber);
    data.append("PanNumber", formData.panNumber);

    data.append("Gender", formData.gender);
    data.append("Address", formData.address);
    data.append("City", formData.city);
    data.append("State", formData.state);
    data.append("Pincode", formData.pincode);
    data.append("Country", formData.country);

    data.append("FatherName", formData.fatherName);
    data.append("MotherName", formData.motherName);
    data.append("MaritalStatus", formData.maritalStatus);

    data.append("AccountHolderName", formData.accountHolderName);
    data.append("AccountNumber", formData.accountNumber);
    data.append("IFSCCode", formData.ifscCode);
    data.append("BankName", formData.bankName);

    // ✅ FILES (VERY IMPORTANT NAMES MATCH .NET MODEL)

    if (formData.aadharPhoto)
      data.append("AadharPhoto", formData.aadharPhoto);

    if (formData.panCard)
      data.append("PanCard", formData.panCard);

    if (formData.bankStatement)
      data.append("BankStatement", formData.bankStatement);

    if (formData.sourceOfFund)
      data.append("SourceOfFund", formData.sourceOfFund);

    if (formData.sourceOfWealth)
      data.append("SourceOfWealth", formData.sourceOfWealth);

    if (formData.videoFile)
      data.append("VideoFile", formData.videoFile);

    if (formData.addressVerificationDoc)
      data.append("AddressVerification", formData.addressVerificationDoc);

    if (formData.agreementPDF)
      data.append("AgreementPDF", formData.agreementPDF);

    if (formData.spouseAadharDoc)
      data.append("SpouseAadharPhoto", formData.spouseAadharDoc);

    if (formData.spousePanDoc)
      data.append("SpousePanCard", formData.spousePanDoc);

    // ✅ API CALL
     const res = await fetch("https://localhost:7085/api/signup/register", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("API Failed");
    }

    //alert("Saved to DB ✅");

    // 👉 AFTER SAVE → OTP PAGE
    navigate("/otp-verification", {
      state: {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      },
    });

  } catch (err) {
    console.error(err);
    alert("Error Saving ❌");
  }
};

  // const handleConfirm = () => {
  //  navigate("/otp-verification", {
  //   state: {
  //     email: formData.email,
  //     phoneNumber: formData.phoneNumber
  //   }
  // });
  // };

  const handleEdit = () => {
    navigate("/signup-page", { state: { formData, editStep: 1 } });
  };

  return (
    <div className="review-wrapper">
      <div className="review-card">

        <div className="logo">
         <div className="logo">
        <video 
            src={logo}
            autoPlay
            loop
            muted
            playsInline
            className="logo-video"
        />
        <h2>GENCUBINEX</h2>
        </div>
        </div>  

        <h3>Review & Confirm</h3>

        <div className="review-section">
          <h4>Personal Details</h4>
            <div className="review-grid">
                <div>Name</div>
                <div>{formData.pageName}</div>
                
                <div>Email</div>
                <div>{formData.email}</div>

                <div style={{display:"none"}}>Password</div>
                <div style={{display:"none"}}>{formData.password}</div>

                <div>Phone Number</div>
                <div>{formData.phoneNumber}</div>

                <div>Date of Birth</div>
                <div>{formData.dateOfBirth}</div>

                <div>Address</div>
                <div>{formData.address}</div>

                <div>City</div>
                <div>{formData.city}</div>

                <div>State</div>
                <div>{formData.state}</div>

                <div>Pincode</div>
                <div>{formData.pincode}</div>

                <div>Country</div>
                <div>{formData.country}</div>

                <div>Gender</div>
                <div>{formData.gender}</div>

                <div>Aadhaar Number</div>
                <div>{formData.aadharNumber}</div>

                <div>Aadhaar Number PDF</div>
                <div>{formData.aadharPhoto.name ? "Uploaded" : "Not Uploaded"}</div>

                <div> Pancard Number</div>
                <div>{formData.panNumber}</div>

                  <div>Pancard PDF</div>
                <div>{formData.panCard.name ? "Uploaded" : "Not Uploaded"}</div>

                <div>Father's Name</div>
                <div>{formData.fatherName}</div>

                <div>Mother's Name</div>
                <div>{formData.motherName}</div>

                <div>Marital Status</div>
                <div>{formData.maritalStatus}</div>

                {formData.maritalStatus === "married" && (
                  <>
                    <div>Spouse's Name</div>
                    <div>{formData.spouseName}</div>

                    <div>Spouse's Aadhar Number</div>
                    <div>{formData.spouseAadharNumber}</div>

                    <div>Spouse's Aadhar PDF</div>
                    <div>{formData.spouseAadharDoc ? "Uploaded" : "Not Uploaded"}</div>

                    <div>Spouse's Pancard Number</div>
                    <div>{formData.spousePanNumber}</div>

                    <div>Spouse's Pancard PDF</div>
                    <div>{formData.spousePanDoc ? "Uploaded" : "Not Uploaded"}</div>
                  </>   
                )}
                
            </div>
        </div>

        <div className="review-section">
          <h4>Bank Details</h4>
          <div className="review-grid">

                <div>Account Holder Name</div>
                <div>{formData.accountHolderName}</div>

                <div>Bank Name</div>
                <div>{formData.bankName}</div>

                <div>Account Number</div>
                <div>{formData.accountNumber}</div>

                <div>IFSC Code</div>
                <div>{formData.ifscCode}</div>
            </div>

        </div>
        <div className="review-section">
          <h4>questionry PDF</h4>
          <div className="review-grid">

                <div>Address Verification PDF</div>
                <div>{formData.addressVerificationDoc ? "Uploaded" : "Not Uploaded"}</div>
            </div>

        </div>

        <div className="review-section">
            <h4>Agreement</h4>

            <div className="review-grid">
                <div>Agreement PDF</div>
                <div>{formData.agreementPDF ? "Uploaded" : "Not Uploaded"}</div>
            </div>

        </div>
<div className="review-section">
  <h4>Video KYC</h4>

  <div className="review-grid">
    <div>Video KYC</div>
    <div>{formData.videoFile ? "Recorded" : "Not Recorded"}</div>
  </div>

  {formData.videoFile && (
    <div style={{ marginTop: "15px" }}>
      <video
        controls
        width="300"
        src={URL.createObjectURL(formData.videoFile)}
        style={{ borderRadius: "10px" }}
      />
    </div>
  )}
</div>

        <div className="review-buttons">
          <button className="edit-btn" onClick={handleEdit}>
            Edit Personal Details
          </button>

          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm & Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default ReviewPage;