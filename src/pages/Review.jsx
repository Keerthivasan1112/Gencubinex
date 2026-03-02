import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logovi.mp4";
import "./Review.css";

function ReviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const formData = state?.formData;

  if (!formData) {
    return <h3>No Data Found</h3>;
  }

  const handleConfirm = () => {
    alert("Account Created Successfully!");
    navigate("/");
  };

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

                <div> Pancard Number</div>
                <div>{formData.panNumber}</div>

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
            <h4>Agreement</h4>
            <div className="review-grid">
                
            </div>

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