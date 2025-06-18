import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import resetImg from "../images/register.png";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { backendUrl, sendRequest } from "../utils/api.ts";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: { password: string }) => {
    try {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/users/resetpass?token=${token}`,
        configuration: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: values.password }),
        },
      });

      if (response.statusCode === 201) {
        Swal.fire("Success", `${response.data.message}`, "success");
        navigate("/login");
      } else {
        Swal.fire(
          "Error",
          `${response.data.message}` || "Failed to reset password",
          "error"
        );
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  };

  return (
    <section className="auth-wrap">
      <div className="row auth-row">
        <div className="col-lg-6">
          <div className="auth-img">
            <img src={resetImg} alt="Reset Password" width={730} height={825} />
            <div className="auth-logo-content">
              <h1 className="auth-title">User Management System</h1>
              <p>
                UMS helps manage user registration, authentication, and access
                control securely and efficiently.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="auth-form-main auth-change">
            <div className="section-content">
              <div className="title">Reset Password</div>
              <p className="auth-content">
                Create a new password to regain access to your account. Please
                ensure your password is strong and secure.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="formfield">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  {...register("password")}
                  placeholder="Enter your new password"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>

              <div className="cta">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
