import React, { useEffect, useState } from "react";
import headerLogo from "../../images/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [firstname, setFirstname] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFirstname(user.firstname || "");
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  return (
    <div>
      <div className="header-wrap">
        <header>
          <div className="container">
            <div className="header-content">
              <Link to="/admin" className="header-left">
                <div className="header-logo">
                  <img src={headerLogo} width={40} height={40} alt="Logo" />
                </div>
                <div className="header-title">UMS</div>
              </Link>
              <div className="header-right">
                <Link to="/admin/profile" className="name">
                  Hello, {firstname}
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
