import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    pendingAdoptions: 0,
    todayRegistrations: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  // Check authentication and role on component mount
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      console.log("🔍 Auth check - User exists:", !!userStr);
      console.log("🔍 Auth check - Token exists:", !!token);

      if (!userStr || !token) {
        console.log("❌ No auth data, redirecting to login");
        navigate("/login");
        return;
      }

      const currentUser = JSON.parse(userStr);
      console.log("👤 Current user role:", currentUser.role);

      if (currentUser.role !== "admin") {
        console.log("❌ Not an admin, redirecting");
        navigate("/unauthorized");
        return;
      }

      setUser(currentUser);
      fetchDashboardData(token);
    };

    checkAuth();
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      setApiError(null);

      console.log("🔑 Token (first 20 chars):", token.substring(0, 20) + "...");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      console.log("📡 Making API calls to backend...");

      // ✅ REAL API CALLS ONLY
      const statsRes = await axios.get(
        "http://localhost:5000/api/admin/stats",
        config
      );
      console.log("✅ Stats API success:", statsRes.data);

      const usersRes = await axios.get(
        "http://localhost:5000/api/admin/users/recent",
        config
      );
      console.log("✅ Users API success:", usersRes.data);

      setStats(statsRes.data.data);
      setRecentUsers(usersRes.data.data);

      console.log("🎉 Real database data loaded!");
      console.log("- Total users:", statsRes.data.data.totalUsers);
      console.log(
        "- Today registrations:",
        statsRes.data.data.todayRegistrations
      );
      console.log("- Recent users count:", usersRes.data.data.length);

      setLoading(false);
    } catch (error) {
      console.error("❌ API Error:", error);
      console.error("- Status:", error.response?.status);
      console.error(
        "- Message:",
        error.response?.data?.message || error.message
      );

      setApiError(error.response?.data?.message || "Failed to load admin data");
      setLoading(false);

      // Show empty data instead of mock data
      setStats({
        totalUsers: 0,
        totalPets: 0,
        pendingAdoptions: 0,
        todayRegistrations: 0,
      });
      setRecentUsers([]);

      // Handle specific errors
      if (error.response?.status === 403) {
        alert("Access denied. Admin privileges required.");
        navigate("/dashboard");
      } else if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem",
          }}
        ></div>
        <p>Loading admin dashboard...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header/Navigation */}
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>🐾 Fursure Admin Panel</h1>
          <p style={{ margin: "0.5rem 0 0 0" }}>
            Welcome back,{" "}
            <span style={{ fontWeight: "600" }}>{user?.name}</span>
            <span
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.8rem",
                marginLeft: "0.5rem",
              }}
            >
              {user?.role}
            </span>
          </p>
          {apiError && (
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.9rem",
                color: "#ffcccb",
                background: "rgba(255, 0, 0, 0.1)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
              }}
            >
              ⚠️ {apiError}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            to="/dashboard"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            👤 User View
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
        {/* Sidebar */}
        <nav
          style={{
            width: "250px",
            background: "white",
            borderRight: "1px solid #e1e5eb",
            padding: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ color: "#667eea", fontSize: "0.85rem" }}>Main</h3>
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem 1rem",
                background: "#667eea",
                color: "white",
                borderRadius: "6px",
                border: "none",
                textAlign: "left",
                marginBottom: "0.25rem",
                cursor: "pointer",
              }}
            >
              📊 Dashboard
            </button>
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem 1rem",
                color: "#4a5568",
                background: "white",
                border: "none",
                textAlign: "left",
                marginBottom: "0.25rem",
                cursor: "pointer",
              }}
            >
              👥 Users
            </button>
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem 1rem",
                color: "#4a5568",
                background: "white",
                border: "none",
                textAlign: "left",
                marginBottom: "0.25rem",
                cursor: "pointer",
              }}
            >
              🐶 Pets
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                }}
              >
                👥
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "#718096",
                  }}
                >
                  Total Users
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#2d3748",
                  }}
                >
                  {stats.totalUsers}
                </p>
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    fontSize: "0.85rem",
                    color: "#48bb78",
                  }}
                >
                  {stats.todayRegistrations} today
                </p>
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#f3e5f5",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                }}
              >
                🐶
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "#718096",
                  }}
                >
                  Available Pets
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#2d3748",
                  }}
                >
                  {stats.totalPets}
                </p>
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    fontSize: "0.85rem",
                    color: "#48bb78",
                  }}
                >
                  From database
                </p>
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#2d3748" }}>
                Recent Users{" "}
                {recentUsers.length > 0 ? `(${recentUsers.length})` : ""}
              </h2>
            </div>

            {recentUsers.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#718096",
                }}
              >
                <p>No users found in database</p>
                {apiError && (
                  <p style={{ color: "#e53e3e" }}>Error: {apiError}</p>
                )}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          backgroundColor: "#f7fafc",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          backgroundColor: "#f7fafc",
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          backgroundColor: "#f7fafc",
                        }}
                      >
                        Role
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          backgroundColor: "#f7fafc",
                        }}
                      >
                        Joined Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((userItem) => (
                      <tr key={userItem._id}>
                        <td
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "600",
                              }}
                            >
                              {userItem.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            {userItem.name || "No name"}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {userItem.email || "No email"}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              borderRadius: "20px",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              background:
                                userItem.role === "admin"
                                  ? "#fef3c7"
                                  : "#d1fae5",
                              color:
                                userItem.role === "admin"
                                  ? "#92400e"
                                  : "#065f46",
                            }}
                          >
                            {userItem.role || "user"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {userItem.createdAt
                            ? formatDate(userItem.createdAt)
                            : "Unknown"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Debug Info (remove in production) */}
          <div
            style={{
              background: "#f8f9fa",
              padding: "1rem",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "#666",
              marginTop: "2rem",
            }}
          >
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>• User Role: {user?.role}</p>
            <p>• Total Users from DB: {stats.totalUsers}</p>
            <p>• Recent Users Count: {recentUsers.length}</p>
            <p>• API Error: {apiError || "None"}</p>
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                console.log("Token:", token);
                console.log(
                  "User:",
                  JSON.parse(localStorage.getItem("user") || "{}")
                );
                fetchDashboardData(token);
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              Retry API Call
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
