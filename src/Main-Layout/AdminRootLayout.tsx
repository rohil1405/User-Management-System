import { Outlet } from "react-router-dom";
import Header from "../components/Admin/Header.tsx";
import SideBar from "../components/Admin/SideBar.tsx";
import "../Layout/Admin/admin.css";

const AdminRootLayout = () => {
  return (
    <>
      <Header />
      <div className="admin-content-wrap">
        <div className="admin-content-left">
          <SideBar />
        </div>

        <div className="admin-content-right">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminRootLayout;
