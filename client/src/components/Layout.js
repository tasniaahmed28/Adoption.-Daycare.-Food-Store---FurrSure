import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./layout.css";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // ✅ INSERTION 1: Get user info to check if they are an Admin
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const hideNavbar = isLoginPage || isRegisterPage;

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    light: {
      background: "#FFF7EF",
      navBackground: "white",
      text: "#333",
      cardBackground: "#FFE3D8",
      cardBorder: "#F5C1A8",
      cardHover: "#F5C1A8",
      accent1: "#E8F9FF",
      accent1Border: "#A4D7E1",
      accent1Hover: "#A4D7E1",
      accent2: "#FFEFF9",
      accent2Border: "#F2C0E6",
      accent2Hover: "#F2C0E6",
    },
    dark: {
      background: "#1a1a2e",
      navBackground: "#16213e",
      text: "#e6e6e6",
      cardBackground: "#0f3460",
      cardBorder: "#394989",
      cardHover: "#394989",
      accent1: "#1a3c5f",
      accent1Border: "#2a4d7e",
      accent1Hover: "#2a4d7e",
      accent2: "#2d1b3d",
      accent2Border: "#4a2c6d",
      accent2Hover: "#4a2c6d",
    },
  };

  const colors = darkMode ? theme.dark : theme.light;

  return (
    <div
      style={{
        background: colors.background,
        minHeight: "100vh",
        fontFamily: "Poppins, Arial, sans-serif",
        color: colors.text,
        transition: "all 0.3s ease",
      }}
    >
      {!hideNavbar && (
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            padding: "20px",
            background: colors.navBackground,
            boxShadow: darkMode
              ? "0 4px 12px rgba(0,0,0,0.2)"
              : "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: "40px",
            transition: "all 0.3s ease",
          }}
        >
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              background: darkMode ? "#f1c40f" : "#34495e",
              color: darkMode ? "#333" : "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              marginRight: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <Link
            to="/login"
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              background: colors.cardBackground,
              border: `1px solid ${colors.cardBorder}`,
              textDecoration: "none",
              fontWeight: "600",
              color: colors.text,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.cardHover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.cardBackground;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🔐 Login
          </Link>

          <Link
            to="/home"
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              background: colors.cardBackground,
              border: `1px solid ${colors.cardBorder}`,
              textDecoration: "none",
              fontWeight: "600",
              color: colors.text,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.cardHover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.cardBackground;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🏠 Home
          </Link>

          <Link
            to="/pets"
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              background: colors.accent1,
              border: `1px solid ${colors.accent1Border}`,
              textDecoration: "none",
              fontWeight: "600",
              color: colors.text,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.accent1Hover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent1;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🐶 Pet Listings
          </Link>

          {!isAdmin && (
            <Link
              to="/history"
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                background: colors.accent2,
                border: `1px solid ${colors.accent2Border}`,
                textDecoration: "none",
                fontWeight: "600",
                color: colors.text,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.accent2Hover;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.accent2;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📜 My Adoption History
            </Link>
          )}

          <Link
            to="/register"
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              background: colors.accent2,
              border: `1px solid ${colors.accent2Border}`,
              textDecoration: "none",
              fontWeight: "600",
              color: colors.text,
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.accent2Hover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent2;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📝 Register
          </Link>

          <Link
            to="/daycare"
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              background: colors.accent2,
              border: `1px solid ${colors.accent2Border}`,
              textDecoration: "none",
              fontWeight: "600",
              color: colors.text,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.accent2Hover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent2;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📦 Daycare Packages
          </Link>

          <Link
            to="/store"
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              background: colors.accent1,
              border: `1px solid ${colors.accent1Border}`,
              textDecoration: "none",
              fontWeight: "600",
              color: colors.text,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.accent1Hover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent1;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🛍️ Store
          </Link>

          {isAdmin && (
            <Link
              to="/admin/daycare"
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                background: "#ff9800",
                border: "none",
                textDecoration: "none",
                fontWeight: "600",
                color: "white",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e68900";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ff9800";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🛡️ Daycare Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/adoption-requests"
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                background: colors.accent2,
                border: `1px solid ${colors.accent2Border}`,
                textDecoration: "none",
                fontWeight: "600",
                color: colors.text,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.accent2Hover;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.accent2;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📨 Adoption Requests
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                background: colors.accent1,
                border: `1px solid ${colors.accent1Border}`,
                textDecoration: "none",
                fontWeight: "600",
                color: colors.text,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.accent1Hover;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.accent1;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🛍️ Admin Dashboard
            </Link>
          )}
        </nav>
      )}

      {!hideNavbar && (
        <h1
          style={{
            textAlign: "center",
            fontSize: "36px",
            fontWeight: "800",
            color: colors.text,
            marginBottom: "30px",
            transition: "color 0.3s ease",
          }}
        >
          🐾 Fursure Pet Adoption
        </h1>
      )}

      {!hideNavbar && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "14px",
            color: colors.text,
            opacity: 0.7,
          }}
        >
          {darkMode ? "🌙 Dark Mode Active" : "☀️ Light Mode Active"}
        </div>
      )}

      <main>{children}</main>

      {!hideNavbar && (
        <footer
          style={{
            textAlign: "center",
            padding: "20px",
            marginTop: "40px",
            background: darkMode ? "#16213e" : "#f5f5f5",
            borderTop: `1px solid ${darkMode ? "#394989" : "#ddd"}`,
            color: colors.text,
            transition: "all 0.3s ease",
          }}
        >
          {/* ✅ FOOTER LINK FOR ABOUT US */}
          <div style={{ marginBottom: "10px" }}>
            <Link 
              to="/about" 
              style={{ 
                color: colors.text, 
                textDecoration: "underline", 
                fontSize: "14px",
                fontWeight: "600" 
              }}
            >
              About Us
            </Link>
          </div>

          <p>© {new Date().getFullYear()} Fursure Pet Adoption. All rights reserved.</p>
          <p style={{ fontSize: "12px", opacity: 0.7 }}>
            Dark mode: {darkMode ? "ON" : "OFF"} • Click the{" "}
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"} button to toggle
          </p>
        </footer>
      )}
    </div>
  );
};

export default Layout;