import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import menu_icon from "../../assets/menu.svg";
import close_icon from "../../assets/close.svg";
import { logout } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth(); // Get user from context

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add("nav-dark");
      } else {
        navRef.current.classList.remove("nav-dark");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav ref={navRef} className="navbar">
      {/* Left side */}
      <div className="navbar-left">
        <Link to="/" className="nav-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <ul className="nav-links">
          <Link to="/" className="nav-link"><li>Home</li></Link>
          <li>TV</li>
          <li>Movies</li>
          <li>New & Popular</li>
          {currentUser && (
            <Link to="/watchlist" className="nav-link"><li>My Watchlist</li></Link>
          )}
          <li>Browse by Languages</li>
        </ul>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        <img src={search_icon} alt="Search" className="icon" />
        <p>Children</p>
        <img src={bell_icon} alt="Notifications" className="icon" />

        {/* Show profile only if logged in */}
        {currentUser && (
          <div className="navbar-profile">
            <img src={profile_img} alt="Profile" className="profile" />
            <img src={caret_icon} alt="Dropdown" className="icon" />
            <div className="dropdown">
              <p onClick={() => logout()}>Sign Out of Netflix</p>
            </div>
          </div>
        )}

        {/* Mobile menu button */}
        <img
          src={menu_icon}
          alt="Menu"
          className="menu-icon"
          onClick={toggleMenu}
        />
      </div>

      {/* Mobile slide-in menu */}
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <img
          src={close_icon}
          alt="Close"
          className="menu-close"
          onClick={toggleMenu}
        />
        <ul>
          <li onClick={toggleMenu}><Link to="/">Home</Link></li>
          <li onClick={toggleMenu}>TV</li>
          <li onClick={toggleMenu}>Movies</li>
          <li onClick={toggleMenu}>New & Popular</li>
          {currentUser && <li onClick={toggleMenu}><Link to="/watchlist">My Watchlist</Link></li>}
          <li onClick={toggleMenu}>Browse by Languages</li>
        </ul>
        <div className="mobile-icons">
          <img src={search_icon} alt="Search" className="icon" />
          <img src={bell_icon} alt="Notifications" className="icon" />
          {currentUser && <img src={caret_icon} alt="Dropdown" className="icon" />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
