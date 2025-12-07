// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (err) {
      console.error(err);
      alert("Failed to log out");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        SolveIt
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user && <Link to="/ask">Ask</Link>}
        {!user && <Link to="/auth">Login / Signup</Link>}
        {user && (
          <>
            <span className="nav-username">{user.email}</span>
            <button onClick={handleLogout} className="btn-small">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
