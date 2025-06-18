import React, { useEffect, useState } from "react";
import { backendUrl, sendRequest } from "../../utils/api.ts";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    activeUsersCount: 0,
    blockedUsersCount: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await sendRequest({
          url: `${backendUrl}/api/v1/admin/user-counts`,
          configuration: { method: "GET" },
        });

        if (response.statusCode === 200) {
          console.log("Setting counts to:", response.data);
          setCounts(response.data.data);
        } else {
          console.error("Error in response:", response.data.message);
        }
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching user counts."
        );
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-wrap">
      <div className="dashboard">
        <div className="row">
          <div className="col-md-3">
            <div className="dashboard-box">
              <div className="count text-center">{counts.activeUsersCount}</div>
              <div className="users-status text-center">Active Users</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="dashboard-box">
              <div className="count text-center">
                {counts.blockedUsersCount}
              </div>
              <div className="users-status text-center">Blocked Users</div>
            </div>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
