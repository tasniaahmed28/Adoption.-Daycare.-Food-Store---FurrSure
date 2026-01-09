import React from 'react';
import './AboutUs.css'; 

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Hero Header */}
      <section className="about-hero">
        <h1>We Are Fursure 🐾</h1>
        <p>Connecting loving hearts with furry friends since 2024.</p>
      </section>

      {/* Content Section */}
      <section className="about-content">
        <div className="mission-box">
          <h2>Our Mission</h2>
          <p>
            At Fursure, our mission is to ensure every pet finds a forever home. 
            We provide a transparent platform for adoptions, premium pet products, 
            and reliable daycare services to support pet parents at every stage.
          </p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <span>🏠</span>
            <h3>Safe Adoption</h3>
            <p>We vet every listing to ensure a safe environment for pets and owners.</p>
          </div>
          <div className="value-card">
            <span>🎾</span>
            <h3>Active Daycare</h3>
            <p>Your pets stay active and happy with our certified daycare partners.</p>
          </div>
          <div className="value-card">
            <span>🍖</span>
            <h3>Quality Care</h3>
            <p>Only the best food and toys for your companions in our store.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;