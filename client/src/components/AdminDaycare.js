import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDaycare = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    const fetchHistory = async () => {
        // 1. Retrieve Token
        const token = localStorage.getItem('token');
        console.log("🔑 MY CURRENT TOKEN:", token); // CHECK YOUR CONSOLE FOR THIS!

        if (!token) {
            setError("No Login Token Found. Please log out and log in again.");
            return;
        }

        try {
            // 2. Send Request with DOUBLE Headers to be safe
            const res = await axios.get('http://localhost:5000/api/daycare/history', {
                headers: { 
                    'x-auth-token': token,          // Format A
                    'Authorization': `Bearer ${token}` // Format B
                }
            });

            console.log("✅ DATA RECEIVED:", res.data); // See if data arrives
            setBookings(res.data.data || res.data); // Handle different data structures
        } catch (err) {
            console.error("❌ FETCH ERROR:", err.response || err);
            setError("Server rejected the token (401). Try logging out.");
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    // Status Update Function
    const handleStatusUpdate = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/daycare/status', 
                { id, status: newStatus },
                { 
                    headers: { 
                        'x-auth-token': token,
                        'Authorization': `Bearer ${token}`
                    } 
                }
            );
            alert("Updated!");
            fetchHistory(); // Refresh list
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>🐾 Admin: Daycare Attendance History 🐾</h2>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>Pet Name</th>
                        <th>Status</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 ? (
                        <tr><td colSpan="5">No bookings found (or access denied).</td></tr>
                    ) : (
                        bookings.map((b) => (
                            <tr key={b._id}>
                                <td>{b.petName}</td>
                                <td><strong>{b.status}</strong></td>
                                <td>{b.checkInTime ? new Date(b.checkInTime).toLocaleTimeString() : '-'}</td>
                                <td>{b.checkOutTime ? new Date(b.checkOutTime).toLocaleTimeString() : '-'}</td>
                                <td>
                                    {b.status === 'Confirmed' && <button onClick={() => handleStatusUpdate(b._id, 'Checked-In')}>Check-In</button>}
                                    {b.status === 'Checked-In' && <button onClick={() => handleStatusUpdate(b._id, 'Checked-Out')}>Check-Out</button>}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDaycare;