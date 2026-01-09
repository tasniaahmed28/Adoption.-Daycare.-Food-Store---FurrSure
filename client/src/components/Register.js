import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OTPVerification from "./OTPVerification"; // Add this import
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { name, email, password, confirmPassword, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({ name, email, password, role });

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        body,
        config
      );

      if (res.data.requiresVerification) {
        // Show OTP verification screen
        setRegistrationEmail(email);
        setShowOTPVerification(true);
        alert("Registration successful! Please verify your email with OTP.");
      } else {
        // Old flow (shouldn't happen with current backend)
        localStorage.setItem("token", res.data.data?.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: res.data.data?._id,
            name: res.data.data?.name,
            email: res.data.data?.email,
            role: res.data.data?.role,
          })
        );

        alert(`Registration successful! Welcome ${name} (${role}) 🎉`);

        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = () => {
    alert("Email verified successfully! You can now login.");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-form">
        {showOTPVerification ? (
          <OTPVerification
            email={registrationEmail}
            onVerificationSuccess={handleOTPVerificationSuccess}
            onBack={() => {
              setShowOTPVerification(false);
              navigate("/login");
            }}
          />
        ) : (
          <>
            <div className="register-header">
              <h2>🐾 Join Fursure</h2>
              <p className="slogan">Start your pet adoption journey today.</p>
            </div>

            <form onSubmit={onSubmit}>
              <div className="register-form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={onChange}
                  required
                  placeholder="Enter your full name"
                />

                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="Enter your email"
                />

                <select
                  name="role"
                  id="role"
                  value={role}
                  onChange={onChange}
                  className="role-select"
                >
                  <option value="user">Pet Owner/Adopter</option>
                  <option value="admin">Administrator</option>
                </select>

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="Create a password (min 6 characters)"
                />

                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="login-link">
              <p>
                Already have an account? <a href="/login">Sign in here</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
