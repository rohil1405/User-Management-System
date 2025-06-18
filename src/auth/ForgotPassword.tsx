import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import forgotImg from "../images/login.png";
import Swal from "sweetalert2";
import { backendUrl, sendRequest } from "../utils/api.ts";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: { email: string }) => {
    try {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/users/forgotpass`,
        configuration: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        },
      });

      if (response.statusCode === 201) {
        Swal.fire("Success", `${response.data.message}`, "success");
        reset();
        navigate("/login");
      } else {
        Swal.fire("Error", response.message || "Failed to send email", "error");
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  };

  return (
    <section className="auth-wrap">
      <div className="row auth-row">
        <div className="col-lg-6">
          <div className="auth-form-main auth-change">
            <div className="section-content">
              <div className="title">Forgot Password</div>
              <p className="auth-content">
                Don’t worry! Enter your email below, and we’ll send you a link
                to reset your password.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="formfield">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  {...register("email")}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="cta">
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="auth-img">
            <img src={forgotImg} alt="Forgot Password" />
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
    </section>
  );
};

export default ForgotPassword;
