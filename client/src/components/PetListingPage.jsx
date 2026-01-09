import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/pets";

export default function PetListingPage() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);

      let url = API_URL;
      const params = [];

      if (search.trim() !== "") params.push(`search=${search}`);
      if (category !== "all") params.push(`category=${category}`);

      if (params.length > 0) url += `?${params.join("&")}`;

      console.log('Fetching from:', url);
      const res = await fetch(url);
      const result = await res.json();
      
      console.log('API Result:', result);

      if (result.success && Array.isArray(result.data)) {
        setPets(result.data);
      } else if (Array.isArray(result)) {
        setPets(result);
      } else {
        console.error('Unexpected response format:', result);
        setPets([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setPets([]);
    }

    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF7F0",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        🐾 Browse Available Pets ({pets.length})
      </h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          margin: "0 auto 30px",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "25px",
            border: "1px solid #ddd",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "25px",
            border: "1px solid #ddd",
          }}
        >
          <option value="all">All</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
          <option value="Bird">Birds</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{
        background: '#e8f5e9',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto 20px'
      }}>
        <p><strong>Debug:</strong> API is working! Found {pets.length} pets</p>
        <button 
          onClick={fetchPets}
          style={{
            padding: '8px 16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading pets...</p>
      ) : pets.length === 0 ? (
        <p style={{ textAlign: "center" }}>No pets found 😿</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {pets.map((pet) => (
            <div
              key={pet._id}
              onClick={() => navigate(`/pets/${pet._id}`)}
              style={{
                background: "#FFE9F3",
                padding: "20px",
                borderRadius: "20px",
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 3px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              {pet.image && (
                <img
                  src={pet.image}
                  alt={pet.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "15px",
                    marginBottom: "10px",
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Pet+Image';
                  }}
                />
              )}

              <h3 style={{ margin: "10px 0", color: "#333" }}>{pet.name}</h3>

              <p style={{ margin: "5px 0", color: "#444" }}>
                <strong>Breed:</strong> {pet.breed}
              </p>

              <p style={{ margin: "5px 0", color: "#444" }}>
                <strong>Age:</strong> {pet.age} years
              </p>

              <p style={{ margin: "5px 0", color: "#444" }}>
                <strong>Category:</strong> {pet.category}
              </p>

              <p style={{ margin: "5px 0", color: "#444" }}>
                <strong>Description:</strong> {pet.description?.substring(0, 80)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}