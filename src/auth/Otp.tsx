import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { backendUrl, sendRequest } from "../utils/api.ts";
import loginImg from "../images/login.png";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  otp: yup.string().required("OTP is required"),
});

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (values: { otp: string }) => {
    try {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/users/verifyotp`,
        configuration: {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        },
      });

      Swal.fire(
        "Success",
        response.message || "OTP verified successfully!",
        "success"
      );
      navigate("/user/home");
    } catch (error: any) {
      Swal.fire("Error", error.message || "OTP verification failed.", "error");
    }
  };

  const handleResendOtp = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");

      const response = await sendRequest({
        url: `${backendUrl}/api/v1/users/resendotp`,
        configuration: {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      Swal.fire(
        "Success",
        response.message || "OTP resent successfully!",
        "success"
      );
      setTimer(120);
      setCanResend(false);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to resend OTP.", "error");
    }
  };

  return (
    <section className="auth-wrap">
      <div className="row auth-row">
        <div className="col-lg-6">
          <div className="auth-form-main auth-change">
            <div className="section-content">
              <div className="title">OTP Verification</div>
              <p className="auth-content">
                Enter the OTP sent to your email to verify your account.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="formfield">
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("otp")}
                  placeholder="Enter OTP"
                />
                {errors.otp && (
                  <p className="text-danger">{errors.otp.message}</p>
                )}
              </div>

              <div className="cta d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Verify OTP
                </button>
              </div>
            </form>

            {/* <div className="cta d-inline-flex justify-content-center flex-column">
              <button
                onClick={handleResendOtp}
                className="btn text-center"
                disabled={!canResend}
              >
                Resend OTP
              </button>
              {!canResend && (
                <p className="text-muted">Resend available in {timer}s</p>
              )}
            </div> */}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="auth-img">
            <img
              src={loginImg}
              alt="OTP Verification"
              width={730}
              height={825}
            />
            <div className="auth-logo-content">
              <h1 className="auth-title">User Management System</h1>
              <p>
                Securely verify your account using the OTP sent to your email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtp;
