import React from "react";
import { Outlet } from "react-router-dom";
import UserList from "../../themes/admin/UserList.tsx";

const People: React.FC = () => {
  console.log("People");
  return (
    <div>
      <UserList />
      <Outlet />
    </div>
  );
};

export default People;
