import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import DecisionPage from "../pages/DecisionPage";
import NotFound from "../pages/NotFound";
import HistoryPage from "../pages/HistoryPage";   // ✅ added
import Profile from "../pages/Profile";   // ✅ added

import ProtectedRoute from "./ProtectedRoute";
import LoginPrompt from "../components/LoginPrompt";

// 🔐 If already logged in → prevent going to login/signup
const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("userId"); // simple check

  return isLoggedIn ? <Navigate to="/decision" /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* HISTORY */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* CUTE LOGIN PROMPT */}
      <Route path="/login-prompt" element={<LoginPrompt />} />

      {/* DECISION PAGE (PROTECTED) */}
      <Route
        path="/decision"
        element={
          <ProtectedRoute>
            <DecisionPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;