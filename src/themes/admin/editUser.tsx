import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { backendUrl, sendRequest } from "../../utils/api.ts";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
});

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const selectedImage = watch("image");

  const { isLoading, data: userData } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/admin/edit/${userId}`,
        configuration: { method: "GET" },
      });
      return response.data.user;
    },
  });

  useEffect(() => {
    if (userData) {
      setValue("firstName", userData.firstname || "");
      setValue("lastName", userData.lastname || "");
      setValue("email", userData.email || "");
      setValue("phone", userData.phone || "");
    }
  }, [userData, setValue]);

  const { mutate, isLoading: isPending } = useMutation({
    mutationFn: (data) =>
      sendRequest({
        url: `${backendUrl}/api/v1/admin/edit/${userId}`,
        configuration: { method: "PATCH", body: data },
      }),
    onSuccess: () => {
      Swal.fire({
        title: "User Updated Successfully!",
        icon: "success",
      });
      navigate("/admin");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: `Error: ${error.message}`,
      });
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstName);
    formData.append("lastname", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    mutate(formData);
  };

  if (isLoading) return <div className="loader"></div>;

  const displayedFileName =
    selectedImage && selectedImage.length > 0
      ? selectedImage[0].name
      : userData?.image || "No file chosen";

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
              <label className="form-label">Phone</label>
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
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                {...register("image")}
                accept="image/*"
              />
              <p>{displayedFileName}</p>
              {userData?.image &&
                (!selectedImage || selectedImage.length === 0) && (
                  <img
                    src={`${backendUrl}/upload/img/${userData.image}`}
                    alt="User"
                    className="user-img"
                  />
                )}
              {selectedImage && selectedImage.length > 0 && (
                <img
                  src={URL.createObjectURL(selectedImage[0])}
                  alt="Selected preview"
                  style={{ width: "100px", height: "100px", marginTop: "10px" }}
                />
              )}
            </div>
            <div className="cta d-flex justify-content-center">
              <button type="submit" disabled={isPending} className="btn">
                {isPending ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditUser;
