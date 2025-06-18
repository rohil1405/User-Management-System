import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { backendUrl, sendRequest } from "../../utils/api.ts";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState<any>(null);

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
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        });

        setUser(response.data.user);
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

  return (
    <div className="user-profile-wrap">
      {user ? (
        <div className="user-profile">
          <div className="user-img">
            <img
              src={`${backendUrl}/upload/img/${user.image}`}
              alt="user-image"
              width={300}
              height={300}
            />
          </div>
          <h2>
            {user.firstname} {user.lastname}
          </h2>
          <ul className="user-details">
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Password:</strong> ******
            </li>
            <li>
              <strong>Phone:</strong> {user.phone}
            </li>
            <li>
              <strong>2FA:</strong>
              <div className="formCheck form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={user.isEnable}
                ></input>
              </div>
            </li>
            <li>
              <strong>Account Created:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </li>
            <li>
              <strong>Last Updated:</strong>{" "}
              {new Date(user.updatedAt).toLocaleDateString()}
            </li>
          </ul>

          <div className="cta text-center">
            <Link to={`../${user._id}`} className="btn btn-primary">
              Edit
            </Link>
          </div>
        </div>
      ) : (
        <div className="loading"></div>
      )}
    </div>
  );
};

export default Profile;
