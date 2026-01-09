import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDaycareDashboard.css';

const AdminDaycareDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Data ---
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/daycare/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.data || res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching history:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- Update Status ---
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/daycare/status', 
        { id, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHistory(); 
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // --- 🕒 Visual Formatter (With Icons) ---
  const formatDateTime = (isoString) => {
    if (!isoString) return null; // Return null if date is missing
    const d = new Date(isoString);
    return {
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  // --- Badge Styling ---
  const getBadgeClass = (status) => {
    if (status === 'Checked-In') return 'status-badge badge-in';
    if (status === 'Checked-Out') return 'status-badge badge-out';
    return 'status-badge badge-confirmed';
  };

  // --- 🧠 PERFECT SORTING LOGIC ---
  const sortedBookings = [...bookings].sort((a, b) => {
    const statusWeight = { 'Checked-In': 1, 'Confirmed': 2, 'Checked-Out': 3 };
    
    // 1. Sort by Status Category First
    const statusDiff = (statusWeight[a.status] || 99) - (statusWeight[b.status] || 99);
    if (statusDiff !== 0) return statusDiff;

    // 2. If Status is the SAME, sort intelligently:
    
    // A) If both are "Checked-In": Show NEWEST arrival first
    if (a.status === 'Checked-In') {
        return new Date(b.checkInTime || 0) - new Date(a.checkInTime || 0);
    }

    // B) If both are "Confirmed": Show SOONEST Booking Date first
    if (a.status === 'Confirmed') {
        return new Date(a.bookingDate) - new Date(b.bookingDate);
    }

    // C) If both are "Checked-Out": Show NEWEST departure first
    if (a.status === 'Checked-Out') {
        // Handle "Bad Data" (Missing checkout time pushes to bottom)
        const timeA = a.checkOutTime ? new Date(a.checkOutTime).getTime() : 0;
        const timeB = b.checkOutTime ? new Date(b.checkOutTime).getTime() : 0;
        return timeB - timeA;
    }

    return 0;
  });

  if (loading) return <div className="daycare-admin-container"><h3>Loading...</h3></div>;

  return (
    <div className="daycare-admin-container">
      <h2 className="page-title">🐾 Daycare Attendance Manager</h2>

      <div className="table-card">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((item) => {
              const checkIn = formatDateTime(item.checkInTime);
              const checkOut = formatDateTime(item.checkOutTime);

              // Highlight active rows slightly
              const rowStyle = item.status === 'Checked-In' ? { backgroundColor: '#f0fff4' } : {};

              return (
                <tr key={item._id} style={rowStyle}>
                  <td style={{fontWeight: 'bold', fontSize: '1rem', color: '#2d3436'}}>{item.petName}</td>
                  <td style={{color: '#636e72'}}>{item.user?.name || "Guest"}</td>
                  
                  <td>
                    <span className={getBadgeClass(item.status)}>
                      {item.status}
                    </span>
                  </td>

                  {/* 🕒 Check-In Column */}
                  <td>
                    {checkIn ? (
                        <div className="datetime-box">
                            <span className="date-primary">📅 {checkIn.date}</span>
                            <span className="time-secondary">📥 {checkIn.time}</span>
                        </div>
                    ) : (
                        <span style={{color: '#dfe6e9', fontSize: '0.8rem'}}>--</span>
                    )}
                  </td>

                  {/* 🕒 Check-Out Column */}
                  <td>
                    {checkOut ? (
                        <div className="datetime-box">
                            <span className="date-primary">📅 {checkOut.date}</span>
                            <span className="time-secondary">📤 {checkOut.time}</span>
                        </div>
                    ) : (
                        // If status is Checked-Out but no time, show "N/A"
                        item.status === 'Checked-Out' ? 
                        <span style={{color: '#fab1a0', fontSize: '0.8rem'}}>Time Missing</span> : 
                        <span style={{color: '#dfe6e9', fontSize: '0.8rem'}}>--</span>
                    )}
                  </td>

                  <td>
                    {item.status === 'Confirmed' && (
                      <button 
                        className="action-btn btn-checkin"
                        onClick={() => handleStatusUpdate(item._id, 'Checked-In')}
                      >
                        Check In
                      </button>
                    )}
                    {item.status === 'Checked-In' && (
                      <button 
                        className="action-btn btn-checkout"
                        onClick={() => handleStatusUpdate(item._id, 'Checked-Out')}
                      >
                        Check Out
                      </button>
                    )}
                    {item.status === 'Checked-Out' && (
                      <span style={{color: '#b2bec3', fontWeight: 'bold', fontSize: '0.85rem'}}>
                        Done ✅
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDaycareDashboard;