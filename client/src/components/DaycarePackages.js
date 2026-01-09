import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './DaycarePackages.css';

function DaycarePackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Availability State
  const [bookingDate, setBookingDate] = useState('');
  const [availability, setAvailability] = useState(null); 
  const [checkingSpots, setCheckingSpots] = useState(false);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPkgForModal, setSelectedPkgForModal] = useState(null);
  const [petName, setPetName] = useState(''); 
  
  // 🆕 NEW: Validation Error State
  const [inputError, setInputError] = useState(''); 

  // 1. Fetch Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/daycare');
        setPackages(response.data.data || response.data || []);
      } catch (err) {
        setError("Could not connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // 2. Check Availability
  useEffect(() => {
    const checkSpots = async () => {
      if (!bookingDate) {
          setAvailability(null);
          return;
      }
      setCheckingSpots(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/daycare/availability?date=${bookingDate}`);
        setAvailability(res.data);
      } catch (err) {
        console.error("Error checking availability:", err);
      } finally {
        setCheckingSpots(false);
      }
    };
    checkSpots();
  }, [bookingDate]);

  // Open Booking Modal
  const openModal = (pkg) => {
    if (!bookingDate) {
        alert("Please select a date from the top of the page first!"); // Kept as alert (global instruction)
        return;
    }
    if (availability?.isFull) {
        alert("Sorry! This date is fully booked.");
        return;
    }
    setSelectedPkgForModal(pkg);
    setPetName('');
    setInputError(''); // ✅ Reset error when opening
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPkgForModal(null);
  };

  const closeSuccess = () => {
      setShowSuccess(false);
  };

  // --- CONFIRM BOOKING ---
  const confirmBooking = async () => {
    // ✅ NEW PROFESSIONAL VALIDATION
    if (!petName.trim()) {
      setInputError("⚠️ Please enter your pet's name to continue.");
      return; // Stop here, show red error on input
    }

    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        alert("Session expired. Please log in again.");
        closeModal();
        return;
      }

      await axios.post('http://localhost:5000/api/daycare/book', 
        {
          petName,
          packageId: selectedPkgForModal._id,
          bookingDate: bookingDate
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Success!
      closeModal();
      setShowSuccess(true);
      
      // Refresh availability
      const refreshRes = await axios.get(`http://localhost:5000/api/daycare/availability?date=${bookingDate}`);
      setAvailability(refreshRes.data);

    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed.";
      alert(`❌ Error: ${msg}`);
    }
  };

  if (isLoading) return <div className="packages-container text-center"><h2>🐾 Loading...</h2></div>;
  if (error) return <div className="packages-container text-center"><h2>❌ Error</h2><p>{error}</p></div>;

  return (
    <div className="packages-container">
      <h2>🐾 Daycare Packages</h2>
      <p style={{textAlign: 'center', color: '#636e72', marginBottom: '40px'}}>
        Choose the perfect care plan for your furry friend.
      </p>
      
      {/* Date Picker */}
      <div className="date-picker-wrapper">
        <label className="date-label">📅 When would you like to visit?</label>
        <input 
            type="date" 
            className="styled-date-input"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} 
        />
        <div className="availability-status">
            {checkingSpots ? (
                <span style={{color: '#b2bec3'}}>🔄 Checking availability...</span>
            ) : bookingDate ? (
                 availability?.isFull ? (
                    <span style={{color: '#d63031'}}>⛔ Fully Booked (0 spots left)</span>
                 ) : (
                    <span style={{color: '#00b894'}}>✅ Available! {availability?.remainingSpots} spots remaining.</span>
                 )
            ) : (
                <span style={{color: '#b2bec3', fontWeight: 'normal'}}>Please select a date to see availability.</span>
            )}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div className="package-card" key={pkg._id}>
            <h3>{pkg.name}</h3>
            <p className="price">{pkg.price} TK</p>
            <p className="duration">{pkg.duration}</p>
            <p className="description">{pkg.description}</p>
            <div className="features">
              <ul>
                {pkg.features?.map((f, i) => <li key={i}>🐾 {f}</li>)}
              </ul>
            </div>
            <button 
              className="select-btn" 
              onClick={() => openModal(pkg)}
              disabled={!bookingDate || checkingSpots || availability?.isFull}
              style={{
                  backgroundColor: (!bookingDate || availability?.isFull) ? '#dfe6e9' : '#6c5ce7',
                  color: (!bookingDate || availability?.isFull) ? '#b2bec3' : '#fff',
                  cursor: (!bookingDate || availability?.isFull) ? 'not-allowed' : 'pointer',
                  boxShadow: (!bookingDate || availability?.isFull) ? 'none' : '0 10px 20px rgba(108, 92, 231, 0.3)'
              }}
            >
              {availability?.isFull ? "Sold Out" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* --- 1. INPUT MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Your Booking</h3>
            <p style={{marginBottom: '20px', color: '#636e72'}}>
              Booking <strong>{selectedPkgForModal?.name}</strong> for <strong>{new Date(bookingDate).toLocaleDateString()}</strong>.
            </p>
            
            <label className="modal-label">What is your pet's name?</label>
            
            {/* ✅ VALIDATION LOGIC ADDED HERE */}
            <input 
              type="text" 
              className={`modal-input ${inputError ? 'input-error' : ''}`} /* Adds red border if error */
              placeholder="e.g., Buddy"
              value={petName}
              onChange={(e) => {
                  setPetName(e.target.value);
                  if (inputError) setInputError(''); // Clear error while typing
              }}
              autoFocus
            />
            
            {/* ✅ Show Error Message Below Input */}
            {inputError && <span className="error-message">{inputError}</span>}
            
            <div className="modal-actions">
              <button className="btn-modal btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-modal btn-confirm" onClick={confirmBooking}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. ✅ SUCCESS MODAL --- */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="success-icon">🎉</span>
            <h3 className="modal-title" style={{color: '#00b894'}}>All Set!</h3>
            <p className="success-message">
              Your booking for <strong>{petName}</strong> has been confirmed successfully.
            </p>
            <button className="btn-success" onClick={closeSuccess}>Great!</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default DaycarePackages;