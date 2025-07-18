import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../graphics/sample2.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();

  const id = user?.id;
  const userRole = user?.role?.toLowerCase(); 
  
  console.log("User in Navbar:", user);
  console.log("isLoggedIn in Navbar:", isLoggedIn);

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Reusable Tech Inventory Logo" className="logo" />
          <span>ReTech</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <a href="#contact" onClick={handleContactClick} className="nav-link">Contact</a>

        {isLoggedIn && id && (
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
        )}  

        {isLoggedIn && id && (
          <Link 
            to={userRole === "donor" ? `/donorDashboard/${id}` : `/beneficiaryDashboard/${id}`} 
            className="nav-link"
          >
            Dashboard
          </Link>
        )}
        
        {isLoggedIn && id && (
          <Link 
            to={userRole === "donor" ? `/donor/profile/${id}` : `/beneficiary/profile/${id}`} 
            className="nav-link"
          >
            Profile
          </Link>
        )}

        {isLoggedIn ? (
          <button onClick={logout} className="auth-button">Logout</button>
        ) : (
          <Link to="/auth" className="auth-button">Login/Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
