// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "linear-gradient(135deg, #FFEAF6, #E8F9FF)",
          borderRadius: "30px",
          marginBottom: "50px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          🐾 Welcome to Fursure Pet Adoption
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#555",
            maxWidth: "800px",
            margin: "0 auto 30px",
            lineHeight: "1.6",
          }}
        >
          Find your perfect furry companion and give them a loving forever home.
          Every adoption saves a life and creates a beautiful bond.
        </p>
        <Link
          to="/pets"
          style={{
            padding: "15px 30px",
            borderRadius: "50px",
            background: "linear-gradient(135deg, #FF9A8F, #FF6B9D)",
            color: "white",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "18px",
            display: "inline-block",
            boxShadow: "0 5px 20px rgba(255, 107, 157, 0.4)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🐶 Browse Available Pets
        </Link>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "40px" }}>
          Why Choose Fursure?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              icon: "🏠",
              title: "Forever Homes",
              desc: "We ensure every pet finds a permanent, loving home with careful screening.",
            },
            {
              icon: "❤️",
              title: "Vet-Checked",
              desc: "All pets are fully vaccinated, microchipped, and health-checked by vets.",
            },
            {
              icon: "🤝",
              title: "Lifetime Support",
              desc: "Get ongoing advice and support even after adoption.",
            },
            {
              icon: "🌟",
              title: "Happy Stories",
              desc: "Join 500+ families who found their perfect companions with us.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                textAlign: "center",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "20px",
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{ fontSize: "22px", marginBottom: "15px" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#666", lineHeight: "1.6" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div
        style={{
          background: "#F9F7FF",
          padding: "50px",
          borderRadius: "25px",
          marginBottom: "60px",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "40px" }}>
          How Adoption Works
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          {[
            { step: "1", title: "Browse", desc: "View available pets" },
            { step: "2", title: "Apply", desc: "Submit adoption form" },
            { step: "3", title: "Meet", desc: "Schedule a visit" },
            { step: "4", title: "Adopt", desc: "Bring your pet home!" },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                textAlign: "center",
                flex: "1",
                minWidth: "200px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #8A2BE2, #4B0082)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "0 auto 20px",
                }}
              >
                {item.step}
              </div>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                {item.title}
              </h3>
              <p style={{ color: "#666" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "40px" }}>
          Happy Tails 🐕
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              name: "Sarah & Buddy",
              quote: "Buddy changed our lives. The adoption process was smooth and professional!",
              pet: "Golden Retriever, 3 years",
            },
            {
              name: "Mike & Luna",
              quote: "Luna is the perfect addition to our family. Thank you Fursure!",
              pet: "Siamese Cat, 2 years",
            },
            {
              name: "The Chen Family",
              quote: "Our kids love their new furry sibling. Best decision ever!",
              pet: "Labrador Mix, 1 year",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  color: "#555",
                  fontStyle: "italic",
                  marginBottom: "20px",
                  lineHeight: "1.6",
                }}
              >
                "{testimonial.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "#E8F9FF",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    marginRight: "15px",
                  }}
                >
                  👤
                </div>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{testimonial.name}</h4>
                  <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                    Adopted: {testimonial.pet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 40px",
          background: "linear-gradient(135deg, #4B0082, #8A2BE2)",
          borderRadius: "30px",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>
          Ready to Meet Your New Best Friend?
        </h2>
        <p style={{ fontSize: "20px", marginBottom: "30px", opacity: "0.9" }}>
          Browse our adorable pets waiting for their forever homes.
        </p>
        <Link
          to="/pets"
          style={{
            padding: "15px 40px",
            borderRadius: "50px",
            background: "white",
            color: "#4B0082",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "18px",
            display: "inline-block",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FFD700";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          🐾 Start Your Adoption Journey
        </Link>
      </div>

      {/* Footer note */}
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          paddingTop: "30px",
          borderTop: "1px solid #eee",
          color: "#888",
        }}
      >
        <p>
          💖 Every adoption saves a life. Thank you for choosing to adopt, not shop!
        </p>
        <p style={{ fontSize: "14px", marginTop: "10px" }}>
          Need help? Contact us at:{" "}
          <a
            href="mailto:adopt@fursure.com"
            style={{ color: "#8A2BE2", textDecoration: "none" }}
          >
            adopt@fursure.com
          </a>
        </p>
      </div>
    </div>
  );
}