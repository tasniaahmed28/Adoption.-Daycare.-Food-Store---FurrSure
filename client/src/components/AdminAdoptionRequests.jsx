import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api/adoption-requests";

export default function AdminAdoptionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // ✅ IMPORTANT: adjust this token key if your project uses a different one
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("user") || "null")?.token ||
    "";

  const loadRequests = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load requests");

      // ✅ supports both styles: raw array OR {data: []}
      setRequests(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setMsg("");

      const res = await fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      // ✅ supports both raw doc OR {data: doc}
      const updated = data?.data || data;

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...updated } : r))
      );

      setMsg(`✅ Marked as ${status}`);
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFF7EF, #FFEAF6)",
        padding: "26px",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
        📩 Adoption Requests (Admin)
      </h2>

      <p style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
        Approve / Reject requests and track status.
      </p>

      {msg && (
        <div
          style={{
            marginTop: 12,
            marginBottom: 12,
            padding: "10px 12px",
            borderRadius: 12,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {msg}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No adoption requests found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: 16,
            marginTop: 14,
          }}
        >
          {requests.map((r) => (
            <div
              key={r._id}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 16,
                boxShadow: "0 14px 35px rgba(0,0,0,0.10)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 900, fontSize: 16 }}>
                  🐾 {r.petName || "Unknown Pet"}
                </div>

                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    background:
                      r.status === "approved"
                        ? "#E7FFF0"
                        : r.status === "rejected"
                        ? "#FFE7E7"
                        : "#FFF6DD",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {r.status || "pending"}
                </span>
              </div>

              <div style={{ marginTop: 10, fontSize: 13, color: "#444" }}>
                <div>
                  <b>Full Name:</b> {r.fullName}
                </div>
                <div>
                  <b>Email:</b> {r.email}
                </div>
                <div>
                  <b>Phone:</b> {r.phone}
                </div>
                <div>
                  <b>Reason:</b> {r.reason}
                </div>
                <div>
                  <b>Experience:</b> {r.experience}
                </div>
                <div>
                  <b>Preferred Date:</b> {r.preferredDate || "—"}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#777" }}>
                  <b>Created:</b>{" "}
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => updateStatus(r._id, "approved")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #B7FFD2, #7BF2B3)",
                  }}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => updateStatus(r._id, "rejected")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #FFC7C7, #FF8A8A)",
                  }}
                >
                  ❌ Reject
                </button>

                <button
                  onClick={() => updateStatus(r._id, "pending")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.12)",
                    cursor: "pointer",
                    fontWeight: 900,
                    background: "#fff",
                  }}
                >
                  ↩ Pending
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
