// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import AskPage from "./pages/AskPage.jsx";
import QuestionPage from "./pages/QuestionPage.jsx"; // 🔥 added
import { useAuth } from "./context/AuthContext.jsx";

// 🔥 NAVBAR
function Navbar() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo-badge">S</div>
        <div className="nav-title">
          <div className="nav-title-main">SolveIt</div>
          <div className="nav-title-sub">
            Multi-user Q&A playground
          </div>
        </div>
      </div>

      <div className="nav-links">
        <button className="nav-link" onClick={() => navigate("/")}>
          Feed
        </button>

        <button className="nav-link" onClick={() => navigate("/ask")}>
          Ask
        </button>

        {user ? (
          <button className="nav-link" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="nav-link" onClick={login}>
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
}

// 🔥 LOGIN SCREEN
function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="card" style={{ marginTop: "60px", textAlign: "center" }}>
      <h2>Welcome to SolveIt 🟡</h2>
      <p>Please login to view questions</p>

      <button
        className="btn-primary"
        onClick={login}
        style={{ marginTop: "10px" }}
      >
        Login with Google
      </button>
    </div>
  );
}

// 🔥 MAIN ROUTES
function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/question/:id" element={<QuestionPage />} /> {/* 🔥 FIX */}
        </Routes>
      </main>

      <footer className="app-footer">
        SolveIt • Your Q&A platform 🚀
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}