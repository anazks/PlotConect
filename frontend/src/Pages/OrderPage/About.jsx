import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About AgriLand Auctions</h1>
        <p>Your trusted platform for agricultural land bidding</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            AgriLand Auctions connects landowners with serious buyers through a transparent, 
            competitive bidding process. We specialize in agricultural properties, helping 
            farmers and investors find the perfect land for cultivation, livestock, or 
            sustainable farming practices.
          </p>
        </section>
        
        <section className="about-section">
          <h2>How It Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>List Properties</h3>
              <p>Landowners register their agricultural properties with detailed information.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Browse & Research</h3>
              <p>Buyers explore available lands with soil quality, water access, and zoning details.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Place Bids</h3>
              <p>Registered users participate in timed auctions with transparent bidding.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Secure Transaction</h3>
              <p>Winning bids proceed to secure closing with our verification system.</p>
            </div>
          </div>
        </section>
        
        <section className="about-section benefits-section">
          <h2>Why Choose AgriLand Auctions?</h2>
          <ul className="benefits-list">
            <li>Specialized in agricultural properties only</li>
            <li>Verified land quality reports</li>
            <li>Competitive pricing through bidding</li>
            <li>Secure transaction process</li>
            <li>Expert support for agricultural zoning</li>
            <li>Tools for land valuation and potential yield estimates</li>
          </ul>
        </section>
        
        <section className="about-section team-section">
          <h2>Our Team</h2>
          <p>
            Founded by agricultural experts and real estate professionals, our team understands 
            the unique needs of farming communities. We're committed to making land acquisition 
            accessible and transparent for the agricultural sector.
          </p>
        </section>
      </div>
      
      <div className="about-cta">
        <h2>Ready to Find Your Perfect Agricultural Land?</h2>
        <button className="cta-button">Browse Current Listings</button>
        <button className="cta-button secondary">Learn How to Sell</button>
      </div>
    </div>
  );
}

export default About;