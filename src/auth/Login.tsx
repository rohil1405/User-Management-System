import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import loginImg from "../images/login.png";
import Swal from "sweetalert2";
import { backendUrl, googleAuth, sendRequest } from "../utils/api.ts";
import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await sendRequest({
        url: `https://auth-service-wts6.onrender.com/api/user/login`,
        configuration: {
          method: "POST",
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      });

      console.log("Full response data:", response.data);

      Swal.fire("Success", `${response.data.message}`, "success");

      if (
        response.statusCode === 403 &&
        response.message.includes("blacklisted")
      ) {
        Swal.fire("Access Denied", response.message, "error");
        return;
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      const isEnable = response.data.isEnable;

      if (response.data.isAdmin) {
        navigate("/admin");
      } else if (isEnable) {
        navigate("/verify-otp");
      } else {
        navigate("/user");
      }

      console.log("isEnable:", isEnable, "isAdmin:", response.data.isAdmin);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      if (error.message === "Please verify your email before logging in.") {
        Swal.fire({
          icon: "warning",
          title: "Email Verification Needed",
          text: "Please check your email and verify it before logging in.",
        });
      } else {
        Swal.fire("Error", error.message || "Failed to login", "error");
      }
    }
  };

  return (
    <section className="auth-wrap">
      <div className="row auth-row">
        <div className="col-lg-6">
          <div className="auth-img">
            <img src={loginImg} alt="registerImg" width={730} height={825} />
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
          <div className="auth-form-main">
            <div className="section-content">
              <h1 className="auth-heading">Welcome to UMS</h1>
              <div className="button-group">
                <Link className="login active" to="/login">
                  Login
                </Link>
                <Link className="register" to="/register">
                  Register
                </Link>
              </div>

              <p className="auth-desc">
                Login to access your personalized dashboard and manage your
                account.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="row">
                  <div className="col">
                    <div className="formfield">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        {...register("email")}
                        placeholder="Email"
                      ></input>
                      {errors.email && (
                        <p className="text-danger">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="formfield">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        {...register("password")}
                        placeholder="Password"
                      ></input>
                      {errors.password && (
                        <p className="text-danger">{errors.password.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="auth-check">
                  <Link className="auth-desc" to="/forgotpassword">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="cta">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
            <Link className="auth-desc text-center" to="/register">
              Don't have an account? <span>Sign up</span>
            </Link>

            {/* <Link to="" onClick={googleLogin}>
              Login With Google
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
