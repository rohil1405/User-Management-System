import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { backendUrl, sendRequest } from "../../utils/api.ts";
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
  image: yup.mixed().required("Image is required"),
});

const AddUser = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess(response) {
      if (response.statusCode === 201) {
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
        });
        navigate("/admin");
      }
    },
    onError(error) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
      });
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstName);
    formData.append("lastname", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    mutate({
      url: `${backendUrl}/api/v1/admin/users`,
      configuration: {
        method: "POST",
        body: formData,
      },
    });
  };

  return (
    <section className="auth-wrap admin-auth-wrap">
      <div className="row auth-row">
        <div className="auth-form-main">
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="formfield">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                {...register("firstName")}
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-danger">{errors.firstName.message}</p>
              )}
            </div>
            <div className="formfield">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                {...register("lastName")}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-danger">{errors.lastName.message}</p>
              )}
            </div>
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
            <div className="formfield">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                {...register("password")}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <div className="formfield">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                {...register("phone")}
                placeholder="Phone Number"
              />
              {errors.phone && (
                <p className="text-danger">{errors.phone.message}</p>
              )}
            </div>
            <div className="formfield">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                {...register("image")}
              />
              {errors.image && (
                <p className="text-danger">{errors.image.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary"
            >
              {isPending ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddUser;
