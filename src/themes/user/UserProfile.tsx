import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { backendUrl, sendRequest } from "../../utils/api.ts";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    isEnable: false,
    imagePreview: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Token is missing. Please log in.",
          });
          return;
        }

        const response = await sendRequest({
          url: `${backendUrl}/api/v1/users/profile`,
          configuration: {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        });

        if (response?.data?.user) {
          const userData = response.data.user;
          setUser(userData);
          setFormData({
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            email: userData.email || "",
            phone: userData.phone || "",
            password:  "********",
            isEnable: userData.isEnable || false,
            imagePreview: userData.image
              ? `${backendUrl}/upload/img/${userData.image}`
              : "",
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to fetch user profile.",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imagePreview: URL.createObjectURL(files[0]),
      }));
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name !== "image") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Token is missing. Please log in.",
        });
        return;
      }

      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imagePreview") {
          if (key === "password" && value === "*******") return;
          formDataObj.append(key, value as any);
        }
      });

      if (fileInputRef.current?.files?.[0]) {
        formDataObj.append("image", fileInputRef.current.files[0]);
      }

      const response = await fetch(
        `${backendUrl}/api/v1/users/edit/${user._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
        });

        if (result.user) {
          setUser(result.user);
          setFormData((prev) => ({
            ...prev,
            firstname: result.user.firstname,
            lastname: result.user.lastname,
            email: result.user.email,
            phone: result.user.phone,
            isEnable: result.user.isEnable,
            password: "*******",
            imagePreview: result.user.image
              ? `${backendUrl}/upload/img/${result.user.image}`
              : "",
            image: "",
          }));

          localStorage.setItem("user", JSON.stringify(result.user));

          if (result.user.image) {
            localStorage.setItem(
              "userImage",
              `${backendUrl}/upload/img/${result.user.image}`
            );
          } else {
            localStorage.removeItem("userImage");
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Something went wrong.",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update the profile.",
      });
    }
  };

  return (
    <div className="user-profile-wrap edit-profile">
      {user ? (
        <form
          className="user-profile"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="row justify-content-center">
            <div className="col-md-6">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone">Phone</label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password to change"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                className="form-control"
                onChange={handleChange}
              />
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100px", marginTop: "10px" }}
                />
              )}
            </div>

            <div className="col-md-6">
              <div className="form-checked">
                <label htmlFor="isEnable" className="form-label">
                  2FA:
                </label>
                <div className="formCheck form-switch">
                  <input
                    id="isEnable"
                    name="isEnable"
                    type="checkbox"
                    checked={formData.isEnable}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Save Changes
          </button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserProfile;
