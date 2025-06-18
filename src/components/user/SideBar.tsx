import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { backendUrl, sendRequest } from "../../utils/api.ts";
import Swal from "sweetalert2";
import dummyImage from "../../images/register.png";

const SideBar = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storeImage = localStorage.getItem("userImage");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFirstname(user.firstname || "");
        setLastname(user.lastname || "");
        setImage(user.image || "");
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/admin/logout`,
        configuration: {
          method: "POST",
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
        },
      });

      if (response.statusCode === 201) {
        Swal.fire("Success", `${response.data.message}`, "success");

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        Swal.fire("Error", "Error on user logout", "error");
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Failed to logout", "error");
    }
  };
  return (
    <div className="side-user-wrap">
      <div className="side-user">
        <div className="side-up">
          <div className="user-logo">
            <img
              src={image ? `${backendUrl}/upload/img/${image}` : dummyImage}
              alt="User"
              width={100}
              height={100}
            />
          </div>
          <div className="user-name">
            Hello,
            <span>
              {" "}
              {firstname} {lastname}
            </span>
          </div>
        </div>
        <div className="side-down">
          <ul>
            <li>
              <NavLink
                aria-label="home"
                to="/user/home"
                className={({ isActive }) => (isActive ? "active" : "")}
                end
              >
                <div className="side-logo">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
                      fill="#29b9e7"
                    />
                  </svg>
                </div>
                <div className="side-text">Home</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                aria-label="profile"
                to="/user/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
                end
              >
                <div className="side-logo">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z"
                      fill="#29b9e7"
                    />
                  </svg>
                </div>
                <div className="side-text">Profile</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                aria-label="Sign Out"
                onClick={handleLogout}
                className={({ isActive }) => (isActive ? "active" : "")}
                end
              >
                <div className="side-logo">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M0 0 C5.94 0 11.88 0 18 0 C18 5.94 18 11.88 18 18 C12.06 18 6.12 18 0 18 C0 12.06 0 6.12 0 0 Z M9.9375 7.5 C8.638125 7.665 7.33875 7.83 6 8 C6 8.66 6 9.32 6 10 C8.97 10.33 11.94 10.66 15 11 C15 9.68 15 8.36 15 7 C13.29869234 7 11.62353028 7.28590092 9.9375 7.5 Z "
                      fill="#29b9e7"
                      transform="translate(3,3)"
                    />
                  </svg>
                </div>
                <div className="side-text">Sign Out</div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
