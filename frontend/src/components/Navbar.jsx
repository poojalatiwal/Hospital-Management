import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const [show, setShow] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/user/patient/logout",
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
      setShow(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="navbar">
      
      {/* LOGO */}
      <div className="logo">
        <img src="/logo.png" alt="logo" className="logo-img" />
      </div>

      {/* LINKS + LOGIN */}
      <div className={`navLinks ${show ? "open" : ""}`}>
        
        {/* ❌ CLOSE (MOBILE) */}
        <div className="mobile-top">
          <IoClose onClick={() => setShow(false)} />
        </div>

        {/* NAV LINKS */}
        <div className="links" onClick={() => setShow(false)}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/appointment">Appointment</NavLink>
          <NavLink to="/about">About Us</NavLink>
        </div>

        {/* LOGIN / LOGOUT */}
        {isAuthenticated ? (
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="nav-btn" onClick={() => navigateTo("/login")}>
            Login
          </button>
        )}
      </div>

      {/* ☰ HAMBURGER */}
      <div className="hamburger" onClick={() => setShow(true)}>
        <HiOutlineMenuAlt3 />
      </div>
    </nav>
  );
};

export default Navbar;
