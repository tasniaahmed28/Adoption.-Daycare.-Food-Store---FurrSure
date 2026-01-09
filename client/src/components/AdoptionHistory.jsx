import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api/adoption-requests/my-history";

export default function AdoptionHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ robust token getter (handles different localStorage structures)
  const token = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;

      const u = JSON.parse(raw);

      // common patterns:
      // 1) { token: "..." }
      if (u?.token) return u.token;

      // 2) { data: { token: "..." } }
      if (u?.data?.token) return u.data.token;

      // 3) sometimes saved as { user: { token } }
      if (u?.user?.token) return u.user.token;

      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);

        if (!token) {
          setItems([]);
          throw new Error("No login token found. Please login again as user.");
        }

        const res = await fetch(API, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        // ✅ if server returns HTML (like an error page), this prevents JSON crash
        const text = await res.text();
        let payload;
        try {
          payload = JSON.parse(text);
        } catch {
          throw new Error(
            "Server did not return JSON. Check backend route /api/adoption-requests/my-history and server is running on port 5000."
          );
        }

        if (!res.ok) {
          throw new Error(payload?.message || "Failed to load history");
        }

        // ✅ support both: {success:true,data:[...]} OR direct array [...]
        const list = Array.isArray(payload) ? payload : payload?.data || [];
        setItems(list);
      } catch (e) {
        setErr(e.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  return (
    <div style={{ padding: "30px", fontFamily: "Poppins, Arial" }}>
      <h2 style={{ marginBottom: "8px" }}>📜 My Adoption History</h2>
      <p style={{ marginTop: 0, color: "#666" }}>
        Shows only approved/rejected requests.
      </p>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && !err && items.length === 0 && (
        <p>No adoption history yet (ask admin to approve/reject first).</p>
      )}

      <div style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
        {items.map((r) => (
          <div
            key={r._id}
            style={{
              background: "#fff",
              padding: "14px",
              borderRadius: "14px",
              boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>🐾 {r.petName}</b>
              <span style={{ fontWeight: 800 }}>{r.status}</span>
            </div>

            <div style={{ marginTop: 6, fontSize: 13, color: "#444" }}>
              <div>
                <b>Preferred Date:</b> {r.preferredDate || "—"}
              </div>
              <div>
                <b>Reviewed:</b>{" "}
                {r.reviewedAt ? new Date(r.reviewedAt).toLocaleString() : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
