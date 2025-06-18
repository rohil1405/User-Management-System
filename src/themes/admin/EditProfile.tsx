import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { backendUrl, sendRequest } from "../../utils/api.ts";
import { useNavigate, useParams } from "react-router-dom";

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const { userID } = useParams<{ userID: string }>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await sendRequest({
          url: `${backendUrl}/api/v1/admin/profile/${userID}`,
          configuration: {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        });

        const { firstname, lastname, email, phone, password } =
          response.data.user;
        setFormData({ firstname, lastname, email, phone, password });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message || "Failed to fetch user profile.",
        });
      }
    };

    fetchUserProfile();
  }, [userID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendUrl}/api/v1/admin/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile was updated successfully.",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className="user-profile-wrap profile-wrap ">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="cta d-flex justify-content-center">
          <button type="submit" className="btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
