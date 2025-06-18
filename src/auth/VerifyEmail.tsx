import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { sendRequest, backendUrl } from "../utils/api.ts";
import registerImg from "../images/register.png";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  const token = searchParams.get("token");

  const verifyEmail = async () => {
    if (!token) {
      Swal.fire("Error", "Invalid or missing verification token.", "error");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/users/verify/email?token=${token}`,
        configuration: {
          method: "POST",
        },
      });

      Swal.fire({
        title: "Success",
        text: `${response.data.message}`,
        icon: "success",
      });
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to verify email.", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="row auth-row">
        <div className="col-lg-6">
          <div className="auth-form-main verify-main">
            <div className="section-content">
              <div className="auth-title">Verify Your Email Address</div>
              <p className="auth-message">
                Thank you for signing up! To complete your registration, please
                verify your email by clicking the button below.
              </p>
              <p className="auth-expiration">
                <strong>Note:</strong> This link will expire in{" "}
                <strong>10 minutes</strong>. If the link expires, please request
                a new one.
              </p>
              <button
                className="btn btn-primary verify-btn"
                onClick={verifyEmail}
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="auth-img">
            <img src={registerImg} alt="registerImg" width={730} height={825} />
            <div className="auth-logo-content">
              <h1 className="auth-title">User Management System</h1>
              <p>
                UMS helps manage user registration, authentication, and access
                control securely and efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
