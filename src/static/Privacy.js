import React from 'react';
import './privacy.css';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="privacy-container">
      <h2>Privacy Policy</h2>
      <p>This is a placeholder Privacy Policy for Animals2Rescue. Replace with your full policy text.</p>

      <h3>Data We Collect</h3>
      <p>We may collect contact details, location and other information necessary to connect you with service providers.</p>

      <h3>How We Use Data</h3>
      <p>Data is used to display relevant services, contact providers and improve the platform. We do not sell personal data.</p>

      <h3>Your Choices</h3>
      <p>You can opt out of communications and delete your data by contacting support.</p>

      <div style={{marginTop:18}}>
        <Link to="/">Return to Home</Link>
      </div>
    </div>
  );
}
