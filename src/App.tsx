// src/App.tsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Register from "./auth/Register.tsx";
import Login from "./auth/Login.tsx";
import VerifyEmail from "./auth/VerifyEmail.tsx";
import VerifyOtp from "./auth/Otp.tsx";
import ForgotPassword from "./auth/ForgotPassword.tsx";
import ResetPassword from "./auth/ResetPassword.tsx";
import AddUser from "./themes/admin/addUser.tsx";
import EditUser from "./themes/admin/editUser.tsx";
import AdminRootLayout from "./Main-Layout/AdminRootLayout.tsx";
import People from "./Layout/Admin/People.tsx";
import Profile from "./themes/user/Profile.tsx";
import useAuth from "./hooks/useAuth.ts";
import UserRootLayout from "./Main-Layout/UserRootLayout.tsx";
import NotFound from "./themes/NotFound.tsx";
import Home from "./themes/user/Home.tsx";
import Dashboard from "./Layout/Admin/Dashboard.tsx";
import AdminProfile from "./themes/admin/AdminProfile.tsx";
import UserProfile from "./themes/user/UserProfile.tsx";
import EditProfile from "./themes/admin/EditProfile.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

const RequireAdmin = () => {
  const user = useAuth();
  if (!user?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/user/home" replace />;
  }
  return <Outlet />;
};

const RequireUser = () => {
  const user = useAuth();
  if (!user?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "user") {
    return <Navigate to="/admin/people" replace />;
  }
  return <Outlet />;
};
const GoogleAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId="236983938070-vmm1dee071udpvfge6q9n5ou58prpspn.apps.googleusercontent.com">
      <Login />
    </GoogleOAuthProvider>
  );
};
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <GoogleAuthWrapper /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/verify-otp", element: <VerifyOtp /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/reset-pass", element: <ResetPassword /> },

  {
    path: "/admin",
    element: <AdminRootLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "people", element: <People /> },
      { path: "adduser", element: <AddUser /> },
      { path: "editUser/:userId", element: <EditUser /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "profile/:userID", element: <EditProfile /> },
    ],
  },

  {
    path: "/user",
    element: <UserRootLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: ":userId", element: <UserProfile /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
