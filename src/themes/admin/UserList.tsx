import React, { useState, useEffect } from "react";
import { backendUrl, sendRequest } from "../../utils/api.ts";
import edit from "../../images/edit.png";
import deleteImg from "../../images/delete.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  role: string;
  isBlacklisted: boolean;
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  image: string;
  isEmailVerified: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users from:", `${backendUrl}/api/v1/admin/users`);
        const response = await sendRequest({
          url: `${backendUrl}/api/v1/admin/users`,
          configuration: {
            method: "GET",
          },
        });
        console.log(response);
        if (response.statusCode === 200) {
          setUsers(response.data.users);
        } else {
          setError(response.data.message || "Failed to fetch users.");
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || "An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/admin/delete/${userId}`,
        configuration: {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },
        },
      });

      if (response.statusCode === 200) {
        Swal.fire("Success", response.data.message, "success");
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to delete user",
          "error"
        );
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  };

  const handleToggle = async (
    userId: string,
    field: string,
    value: boolean
  ) => {
    try {
      const response = await sendRequest({
        url: `${backendUrl}/api/v1/admin/users/${userId}`,
        configuration: {
          method: "PATCH",
          body: JSON.stringify({ [field]: value }),
          headers: {
            "Content-Type": "application/json",
            "x-admin-request": "true",
          },
        },
      });

      if (response.statusCode === 200) {
        Swal.fire("Success", "User updated successfully", "success");
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, [field]: value } : u))
        );
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update user",
          "error"
        );
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="user-list-wrap">
      <div className="user-list">
        <div className="user-list-header d-flex justify-content-between align-items-center">
          <h2>User List</h2>
          <div className="cta">
            <Link className="btn" to="/admin/adduser">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 0V6H0V8H6V14H8V8H14V6H8V0H6Z"
                  fill="white"
                />
              </svg>
              Add User
            </Link>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="responsive-table">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Email Verified</th>
                <th scope="col">Active/Deactive</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users
                  .filter((user) => user.role === "user")
                  .map((user) => (
                    <tr key={user._id}>
                      <td>
                        <img
                          src={`${backendUrl}/upload/img/${user.image}`}
                          alt={`${user.firstname} ${user.lastname}`}
                          className="user-img"
                        />
                      </td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={user.isEmailVerified}
                            onChange={(e) =>
                              handleToggle(
                                user._id,
                                "isEmailVerified",
                                e.target.checked
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={user.isBlacklisted}
                            onChange={(e) =>
                              handleToggle(
                                user._id,
                                "isBlacklisted",
                                e.target.checked
                              )
                            }
                          />
                        </div>
                      </td>

                      <td>
                        <Link
                          className="btn-action"
                          to={`/admin/editUser/${user._id}`}
                        >
                          <img src={edit} width={24} height={24} alt="Edit" />
                        </Link>
                      </td>
                      <td>
                        <div
                          className="btn-action"
                          onClick={() => handleDelete(user._id)}
                        >
                          <img
                            src={deleteImg}
                            width={24}
                            height={24}
                            alt="Delete"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={8}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
