// Layout/User/UserRootLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/user/SideBar.tsx";
import UserHeader from "../components/user/Header.tsx";

const UserRootLayout = () => {
  return (
    <div className="user-layout">
      <div>
        <SideBar />
      </div>
      <div className="content-right">
        <UserHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default UserRootLayout;
