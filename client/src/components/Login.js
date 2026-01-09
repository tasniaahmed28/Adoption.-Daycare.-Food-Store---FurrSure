import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OTPVerification from './OTPVerification';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState(''); // Store password for later
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleLogin = async (loginEmail, loginPassword) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = JSON.stringify({ email: loginEmail, password: loginPassword });

      const res = await axios.post('http://localhost:5000/api/auth/login', body, config);
      
      // Check if OTP verification is required
      if (res.data.requiresVerification) {
        return { 
          success: false, 
          requiresVerification: true,
          message: res.data.message 
        };
      }
      
      localStorage.setItem('token', res.data.data.token);
      
      const userData = {
        id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        role: res.data.data.role,
        token: res.data.data.token
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Login successful!', res.data);
      
      setTimeout(() => {
        if (res.data.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 500);
      
      return { success: true };
      
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return { 
        success: false, 
        requiresVerification: error.response?.data?.requiresVerification,
        error: error.response?.data?.message || 'Login failed. Check your credentials.' 
      };
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    const result = await handleLogin(email, password);
    setLoading(false);
    
    if (result.requiresVerification) {
      // SHOW OTP COMPONENT
      setUserEmail(email);
      setUserPassword(password); // Store password for later
      setShowOTPVerification(true);
      setLoginError('Please verify your email with OTP');
    } else if (!result.success) {
      setLoginError(result.error);
      alert(result.error);
    }
  };

  const handleOTPVerificationSuccess = async () => {
    setLoading(true);
    const result = await handleLogin(userEmail, userPassword); // Use stored password
    
    if (result.success) {
      alert('Email verified and login successful!');
    } else if (result.requiresVerification) {
      setLoginError('Verification failed. Please try again.');
    } else {
      setLoginError(result.error);
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {showOTPVerification ? (
          <OTPVerification 
            email={userEmail}
            onVerificationSuccess={handleOTPVerificationSuccess}
            onBack={() => {
              setShowOTPVerification(false);
              setLoginError('');
            }}
          />
        ) : (
          <>
            <div className='header'>
              <h2>🐾 Fursure</h2>
              <p className='slogan'>Your one-stop haven for happy pets.</p>
            </div>
            
            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}
            
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="Enter your email"
                />
              
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="Enter your password"
                />
              </div>
              
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="signup-link">
              <p>Not a member? <a href="/register">Join Fursure</a></p>
            </div>
          </>
        )}
      </div>
      
      {!showOTPVerification && (
        <div className="image-container">
          <img src="https://iili.io/fHM4Fs4.png" alt="Pilot Login" className="login-image" />
        </div>
      )}
    </div>
  );
};

export default Login;