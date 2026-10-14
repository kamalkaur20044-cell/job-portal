import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, API } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.get("/user/logout");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed.");
    }
  };

  const toggle = () => setMenuOpen((prev) => !prev);
  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={close}>
          <img src="/images/logo.png" alt="JobGenie" className="navbar-logo" />
        </Link>
      </div>

      <button className="nav-toggle" onClick={toggle} aria-label="Toggle menu">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        <li>
          <Link to="/" onClick={close}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" onClick={close}>
            Jobs
          </Link>
        </li>

        {isAuthenticated && user?.role === "Employer" && (
          <>
            <li>
              <Link to="/post-job" onClick={close}>
                Post Job
              </Link>
            </li>
            <li>
              <Link to="/my-jobs" onClick={close}>
                My Jobs
              </Link>
            </li>
            <li>
              <Link to="/applications" onClick={close}>
                Applications
              </Link>
            </li>
          </>
        )}

        {isAuthenticated && user?.role === "Job Seeker" && (
          <li>
            <Link to="/my-applications" onClick={close}>
              My Applications
            </Link>
          </li>
        )}

        <li className="nav-auth">
          {isAuthenticated ? (
            <div className="nav-user">
              <span className="nav-username">Hi, {user?.name?.split(" ")[0]}</span>
              <button className="btn-logout" onClick={() => { handleLogout(); close(); }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-nav btn-outline" onClick={close}>
                Login
              </Link>
              <Link to="/register" className="btn-nav btn-primary" onClick={close}>
                Register
              </Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
