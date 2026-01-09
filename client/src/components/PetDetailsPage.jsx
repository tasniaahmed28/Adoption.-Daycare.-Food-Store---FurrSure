// client/src/pages/PetDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PET_API_URL = "http://localhost:5000/api/pets";
const ADOPTION_API_URL = "http://localhost:5000/api/adoption-requests";

export default function PetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  // ✅ FEATURE 10 (Drawer + Form state)
  const [showDrawer, setShowDrawer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    reason: "",
    experience: "",
    preferredDate: "",
  });

  useEffect(() => {
    const loadPet = async () => {
      try {
        setLoading(true);
        console.log(`📡 Fetching pet details for ID: ${id}`);
        
        const res = await fetch(`${PET_API_URL}/${id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json(); // ✅ Changed from 'data' to 'result'
        console.log('🔍 Raw API response:', result);
        
        // ✅ CORRECT: Extract pet from result.data
        if (result.success && result.data) {
          // Format 1: {success: true, data: {...}}
          console.log('✅ Found pet in result.data:', result.data.name);
          setPet(result.data);
        } else if (result._id) {
          // Format 2: Direct pet object (fallback)
          console.log('✅ Found direct pet object:', result.name);
          setPet(result);
        } else if (result.pet) {
          // Format 3: {pet: {...}}
          console.log('✅ Found pet in result.pet:', result.pet.name);
          setPet(result.pet);
        } else {
          console.error('❌ Unexpected API format:', result);
          setPet(null);
        }
        
        // Animation
        setTimeout(() => setAnimateIn(true), 30);
      } catch (err) {
        console.error("❌ Error loading pet:", err);
        setPet(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadPet();
    } else {
      console.error('No pet ID provided');
      navigate('/pets');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2>Loading pet details...</h2>
        <p>ID: {id}</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2>Pet not found</h2>
        <p>ID: {id}</p>
        <button 
          onClick={() => navigate("/pets")}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Back to Listings
        </button>
      </div>
    );
  }

  // ✅ Safe destructuring with defaults
  const { 
    _id: petId, 
    name = "Unknown", 
    breed = "Unknown breed", 
    age = "Unknown age", 
    category = "Unknown", 
    description = "No description available", 
    image = "/default-pet.jpg",
    personality = "Friendly & affectionate"
  } = pet;

  // Personality tags
  const personalityTags = [
    personality,
    "Loves attention",
    "Great family companion",
  ];

  // ✅ FEATURE 10 handlers
  const openDrawer = () => {
    setFormError("");
    setFormSuccess("");
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    if (submitting) return;
    setShowDrawer(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitAdoptionRequest = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.reason.trim() ||
      !formData.experience.trim()
    ) {
      setFormError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(ADOPTION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId,
          petName: name,
          ...formData,
        }),
      });

      const result = await res.json(); // ✅ Changed from data to result
      console.log('Adoption submission result:', result);

      // ✅ Backend returns raw document (no "success"), so only check HTTP status.
      // Also handle case where backend uses {success:false} in future.
      if (!res.ok) {
        throw new Error(result?.message || "Failed to submit adoption request");
      }
      if (result && result.success === false) {
        throw new Error(result.message || "Failed to submit adoption request");
      }


      setFormSuccess("Your adoption request has been sent!");

      // Clear form after success
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        reason: "",
        experience: "",
        preferredDate: "",
      });

      // Auto close after a short delay
      setTimeout(() => {
        setShowDrawer(false);
        setFormSuccess("");
      }, 1200);
    } catch (err) {
      console.error(err);
      setFormError(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFF7EF, #FFEAF6)",
        padding: "40px 0",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/pets")}
        style={{
          marginLeft: "60px",
          marginBottom: "18px",
          padding: "7px 16px",
          borderRadius: "999px",
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        ← Back to listings
      </button>

      {/* Debug info - remove after fixing */}
      <div style={{
        margin: "0 60px 20px",
        padding: "10px",
        background: "#e8f5e9",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <p><strong>Debug:</strong> Pet loaded: {name} (ID: {id})</p>
      </div>

      {/* SECTION WRAPPER */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "26px 26px 32px",
          borderRadius: "32px",
          background: "linear-gradient(180deg, #FFF8FC, #FFEFF6)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? "translateY(0)" : "translateY(18px)",
          transition: "all 0.4s ease",
        }}
      >
        {/* MAIN TWO-COLUMN LAYOUT */}
        <div
          style={{
            display: "flex",
            gap: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* LEFT — IMAGE CARD */}
          <ImageCard image={image} name={name} />

          {/* RIGHT — DETAILS CARD */}
          <DetailsCard
            name={name}
            breed={breed}
            age={age}
            category={category}
            description={description}
            personalityTags={personalityTags}
            onAdoptClick={openDrawer}
          />
        </div>
      </div>

      {/* ✅ FEATURE 10: Overlay */}
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          opacity: showDrawer ? 1 : 0,
          pointerEvents: showDrawer ? "auto" : "none",
          transition: "opacity 0.25s ease",
          zIndex: 1000,
        }}
      />

      {/* ✅ FEATURE 10: Right drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "380px",
          background: "#fff",
          boxShadow: "-18px 0 45px rgba(0,0,0,0.28)",
          transform: showDrawer ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s ease",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            padding: "18px 20px 12px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800 }}>
              Adopt {name}
            </div>
            <div style={{ fontSize: "12px", color: "#777" }}>
              Fill the form below to request adoption.
            </div>
          </div>

          <button
            onClick={closeDrawer}
            disabled={submitting}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
              padding: "6px",
            }}
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Drawer form */}
        <form
          onSubmit={submitAdoptionRequest}
          style={{
            padding: "16px 20px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          <Field label="Full Name" required>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleFormChange}
              placeholder="Your name"
              disabled={submitting}
              style={inputStyle}
            />
          </Field>

          <Field label="Email" required>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="you@example.com"
              disabled={submitting}
              style={inputStyle}
            />
          </Field>

          <Field label="Phone" required>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Enter your phone number"
              disabled={submitting}
              style={inputStyle}
            />
          </Field>

          <Field label="Why do you want to adopt this pet?" required>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleFormChange}
              placeholder="Write your reason..."
              disabled={submitting}
              rows={3}
              style={textareaStyle}
            />
          </Field>

          <Field label="Do you have experience with pets?" required>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleFormChange}
              placeholder="Tell us briefly..."
              disabled={submitting}
              rows={3}
              style={textareaStyle}
            />
          </Field>

          <Field label="Preferred Date">
            <input
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleFormChange}
              disabled={submitting}
              style={inputStyle}
            />
          </Field>

          {formError && (
            <div style={{ color: "#c0392b", fontSize: "13px", marginTop: "8px" }}>
              {formError}
            </div>
          )}

          {formSuccess && (
            <div style={{ color: "#16a085", fontSize: "13px", marginTop: "8px" }}>
              {formSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "12px 18px",
              borderRadius: "999px",
              border: "none",
              background: "linear-gradient(135deg, #FFB6C8, #FF9A8F, #FFD18D)",
              fontWeight: 800,
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.75 : 1,
              boxShadow: "0 10px 25px rgba(255, 150, 150, 0.35)",
            }}
          >
            {submitting ? "Sending..." : "Submit request"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------ LEFT IMAGE CARD COMPONENT ------------ */

function ImageCard({ image, name }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        width: "420px",
        borderRadius: "28px",
        padding: "18px",
        background: "#fff",
        boxShadow: hovered
          ? "0 26px 55px rgba(0,0,0,0.22)"
          : "0 18px 40px rgba(0,0,0,0.18)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Pet+Image';
          }}
        />
      </div>
    </div>
  );
}

/* ------------ RIGHT DETAILS CARD COMPONENT ------------ */

function DetailsCard({
  name,
  breed,
  age,
  category,
  description,
  personalityTags,
  onAdoptClick,
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        borderRadius: "28px",
        padding: "30px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
      }}
    >
      {/* TITLE ROW */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800" }}>
          {name}
        </h1>

        <span
          style={{
            background: "#FFF3C4",
            padding: "6px 14px",
            borderRadius: "999px",
            border: "1px solid #F3D487",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {category}
        </span>
      </div>

      <p style={{ marginTop: "8px", color: "#5b5564" }}>
        {name} is a {age} year(s) old {breed} in our {category} category,
        looking for a gentle, loving home.
      </p>

      {/* LIGHT DIVIDER */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.05)",
          margin: "16px 0 18px",
        }}
      />

      {/* INFO TAGS WITH ICONS */}
      <div
        style={{
          marginTop: "4px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {infoChip("Breed", breed, "🐶")}
        {infoChip("Age", `${age} year(s)`, "🎂")}
        {infoChip("Personality", "Friendly & affectionate", "💖")}
        {infoChip("Good For", "Families & gentle owners", "👨‍👩‍👧")}
      </div>

      {/* SECOND DIVIDER */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.05)",
          margin: "20px 0 18px",
        }}
      />
      {/* DESCRIPTION BOX */}
      <div
        style={{
          padding: "18px",
          borderRadius: "18px",
          background: "#FFF1F7",
          border: "1px solid #F5CCE6",
        }}
      >
        <h3 style={{ margin: "0 0 4px", fontSize: "16px" }}>Meet {name}</h3>
        <p style={{ margin: 0, color: "#4f3c4d", fontSize: "14px" }}>
          {description}
        </p>
      </div>

      {/* PERSONALITY TAGS */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {personalityTags.map((tag, idx) => (
          <span
            key={idx}
            style={{
              padding: "6px 12px",
              borderRadius: "999px",
              background: "#F5EFFD",
              color: "#5B469E",
              fontSize: "12px",
              border: "1px solid #E0D1FF",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>✨</span>
            {tag}
          </span>
        ))}
      </div>

      {/* TIPS GRID */}
      <div
        style={{
          marginTop: "18px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "10px",
          fontSize: "14px",
          color: "#4f3c4d",
        }}
      >
        {tip("🦴", "Enjoys play sessions and gentle walks.")}
        {tip("🛏️", "Needs a cozy, calm corner to sleep and feel safe.")}
        {tip("🤝", "Bonds best with patient owners who give time.")}
      </div>

      {/* CTA DIVIDER */}
      <div
        style={{
          borderTop: "1px dashed rgba(0,0,0,0.12)",
          marginTop: "22px",
          paddingTop: "16px",
        }}
      />

      {/* CTA SECTION WITH GLOW BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          fontSize: "14px",
        }}
      >
        <p style={{ margin: 0 }}>
          Ready to adopt? Email <b>admin@fursure.com</b> and mention{" "}
          <b>{name}</b>.
        </p>

        <button
          onClick={onAdoptClick}
          style={{
            padding: "12px 22px",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, #FFB6C8, #FF9A8F, #FFD18D)",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(255, 150, 150, 0.55)",
            transition: "transform 0.18s ease, box-shadow 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 0 26px rgba(255, 150, 150, 0.75)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(255, 150, 150, 0.55)";
          }}
        >
          💌 Send adoption request
        </button>
      </div>
    </div>
  );
}

/* ------------ REUSABLE COMPONENTS ------------ */

function infoChip(label, value, icon) {
  return (
    <div
      style={{
        background: "#F7F1FF",
        borderRadius: "14px",
        padding: "12px 18px",
        border: "1px solid #E1D6FF",
        minWidth: "150px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#7d6cb2",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "3px",
        }}
      >
        <span>{icon}</span> <span>{label}</span>
      </div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function tip(icon, text) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <span>{icon}</span> <span>{text}</span>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
        {label} {required && <span style={{ color: "#e74c3c" }}>*</span>}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "12px",
  border: "1px solid #d8d8d8",
  outline: "none",
  fontSize: "13px",
};

const textareaStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "12px",
  border: "1px solid #d8d8d8",
  outline: "none",
  fontSize: "13px",
  resize: "vertical",
};