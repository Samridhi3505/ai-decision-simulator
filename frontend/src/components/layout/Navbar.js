import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuth = !!localStorage.getItem("token");

  // ✅ Dark mode state
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <h2 className="logo" onClick={() => navigate("/")}>
        Decision Simulator
      </h2>

      {/* Links */}
      <div className="nav-links">

        {/* Home */}
        <Link 
          to="/" 
          className={location.pathname === "/" ? "active" : ""}
        >
          Home
        </Link>

        {/* ✅ SHOW ONLY WHEN LOGGED IN */}
        {isAuth && (
          <>
            <Link
              to="/history"
              className={location.pathname === "/history" ? "active" : ""}
            >
              History
            </Link>

            <Link
              to="/profile"
              className={location.pathname === "/profile" ? "active" : ""}
            >
              Profile
            </Link>
          </>
        )}

        {/* Login / Logout */}
        {!isAuth ? (
          <Link 
            to="/login"
            className={location.pathname === "/login" ? "active" : ""}
          >
            Login
          </Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}

        {/* 🌙 Dark / Light Toggle */}
        <button
          className="theme-toggle"
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

      </div>
    </nav>
  );
};

export default Navbar;