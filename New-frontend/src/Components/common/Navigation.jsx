import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, PawPrint, User, LogOut, Settings, Home } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../NotificationBell";
import { useAuth } from "../../contexts/AuthContext";
import "./Navigation.css";

const Navigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const scrollToAbout = () => {
    setIsMobileMenuOpen(false);
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
  try {
    await logout();
    navigate("/");
  } catch (err) {
    console.error("Logout failed", err);
  }
};

  return (
    <header className="nav-header">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="brand">
            <div className="brand-icon">
              <PawPrint size={22} />
            </div>
            <span className="brand-text">PetRescue</span>
          </Link>

          <nav className="nav-links">

          {user && user.is_staff && (
            <Link to="/admin" className="nav-link-A">
              Admin
            </Link>)}

            <Link to="/adopt" className="nav-link">
              Adopt
            </Link>

            <Link to="/lost-found" className="nav-link">
              Lost & Found
            </Link>

            <Link className="nav-link" onClick={scrollToAbout}>
              About
            </Link>
          </nav>
        </div>

        <div className="nav-actions">

          {user && (
          <NotificationBell/>)}
          
          {user && (
          <button
            className="icon-btn heart-btn"
            onClick={() => navigate("/favorites")}>
            <Heart size={20} />
            <span className="heart-dot" />
          </button>)}

          <div className="profile">
          {user &&(
            <button
              className="user-avatar-btn1"
              onClick={() => navigate("/user-dashboard")}
              aria-label="User dashboard">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="user-avatar-img1"
                />
              ) : (
                <User className="user-avatar-icon1" />
              )}
            </button>
          )}
          </div>

          <button
            className="icon-btn mobile-only"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
            <Menu size={20} />
          </button>

          {!user && (
            <button className="cta-btn hide-md"
            onClick={() => navigate("/login")}>
              Login </button>)}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mobile-menu1" >
            <div className="mobile-menu-content">

                {user &&(
              <div className="mobile-avatar-link1">
                  <button
                  className="mobile-avatar-btn1"
                  onClick={() => navigate("/user-dashboard")}
                  aria-label="User dashboard">
                    {user.avatar ? (
                      <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="mobile-avatar-img1"
                      />
                    ) : (
                    <User className="user-avatar-icon1" />
                    )}
                    </button>
                  Profile
              </div>
                  )}

              {!user || user.is_staff &&(
              <button
                className="mobile-link1 a"
                onClick={() => handleNavigate("/admin")}>
                  Admin
              </button>)}

              {!user &&(
              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/Signup")}>
                  Sign-up/Login
              </button>)}

              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/")}>
                <Home/>Home
              </button>

              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/adopt")}>
                adopt pet<PawPrint/>
              </button>

              <button
                className="mobile-link1"  
                onClick={() => handleNavigate("/lost-found")}>
                lost & found
              </button>

              {user &&(
              <button
                className="mobile-link1"
                onClick={() => handleNavigate("/favorites")}>
                <Heart/>wishlist
              </button>)}

              {user &&(
              <button onClick={() => navigate("/settings")} className="mobile-link1">
                <Settings /> settings
              </button>)}

              {user &&(
              <button className="mobile-link1 d" onClick={handleLogout}>
                <LogOut />logout
              </button>)}

              <button
                className="mobile-link1"
                onClick={scrollToAbout}>
                about
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
