// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AskPage from "./pages/AskPage.jsx";
import QuestionPage from "./pages/QuestionPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/" /> : <AuthPage />}
          />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/ask"
            element={user ? <AskPage /> : <Navigate to="/auth" />}
          />
          <Route path="/question/:id" element={<QuestionPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
