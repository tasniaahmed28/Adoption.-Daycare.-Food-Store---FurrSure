import React, { useState } from 'react';
import axios from 'axios';
import './OTPVerification.css';

const OTPVerification = ({ email, onVerificationSuccess, onBack }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp
      });

      onVerificationSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>🔐 Verify Your Email</h2>
      <p>
        We’ve sent a 6-digit code to<br />
        <strong>{email}</strong>
      </p>

      {error && <div className="otp-error">{error}</div>}

      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          placeholder="Enter OTP"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <button className="back-btn" onClick={onBack}>
        ← Back to Login
      </button>
    </div>
  );
};

export default OTPVerification;
