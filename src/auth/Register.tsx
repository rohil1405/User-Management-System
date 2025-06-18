import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import registerImg from "../images/register.png";
import { useMutation } from "@tanstack/react-query";
import { backendUrl, sendRequest } from "../utils/api.ts";
import Swal from "sweetalert2";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileSize", "File size is too large", (value) =>
      value[0] ? value[0].size <= 2 * 1024 * 1024 : false
    )
    .test("fileType", "Unsupported file format", (value) =>
      value[0]
        ? ["image/jpeg", "image/avif", "image/png", "image/jpg"].includes(
            value[0].type
          )
        : false
    ),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess(response) {
      if (response.statusCode === 201) {
        Swal.fire({
          title: "Registration Successful!",
          text: response.data.message,
          icon: "success",
        });
        navigate("/login");
      }
    },
    onError(error: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong!",
      });
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("firstname", data.firstName);
    formData.append("lastname", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("image", data.image[0]);

    mutate({
      url: `${backendUrl}/api/v1/users/signup`,
      configuration: {
        method: "POST",
        body: formData,
      },
    });
  };

  return (
    <section className="auth-wrap">
      <div className="row auth-row">
        <div className="col-lg-6">
          <div className="auth-img">
            <img src={registerImg} alt="register" width={730} height={825} />
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
              <div className="button-group ">
                <Link className="login" to="/login">
                  Login
                </Link>
                <Link className="register active" to="/register">
                  Register
                </Link>
              </div>
              <p className="auth-desc">
                Register to create a new account and start managing your data
                securely.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6">
                  <div className="formfield">
                    <label>First Name</label>
                    <input
                      type="text"
                      {...register("firstName")}
                      className="form-control"
                      placeholder="First Name"
                    />
                    {errors.firstName && (
                      <p className="text-danger">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="formfield">
                    <label>Last Name</label>
                    <input
                      type="text"
                      {...register("lastName")}
                      className="form-control"
                      placeholder="Last Name"
                    />
                    {errors.lastName && (
                      <p className="text-danger">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="formfield">
                <label>Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="form-control"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="formfield">
                <label>Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="form-control"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
              <div className="formfield">
                <label>Phone Number</label>
                <input
                  type="text"
                  {...register("phone")}
                  className="form-control"
                  placeholder="Phone Number"
                />
                {errors.phone && (
                  <p className="text-danger">{errors.phone.message}</p>
                )}
              </div>
              <div className="formfield">
                <label>Upload Image</label>
                <input
                  type="file"
                  {...register("image")}
                  className="form-control"
                />
                {errors.image && (
                  <p className="text-danger">{errors.image.message}</p>
                )}
              </div>
              <div className="cta">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
            <p className="auth-desc text-center">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
