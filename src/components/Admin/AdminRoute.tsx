import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface AdminRouteProps {
  isAuthenticated: boolean;
  userRole: string; 
}

const AdminRoute: React.FC<AdminRouteProps> = ({ isAuthenticated, userRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />; 
  }

  return <Outlet />;
};

export default AdminRoute;
