import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './terms.css';

export default function Terms({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  function handleAccept() {
    if (accepted) {
      try { localStorage.setItem('termsAccepted', 'true'); } catch(e){}
      if (typeof onAccept === 'function') onAccept();
    }
  }

  return (
    <div className="terms-container">
      <h2>Terms & Conditions</h2>
      <div className="terms-body">
        <p>
          Welcome to Animals2Rescue. By using this service you agree to our terms and
          conditions. This placeholder contains key points: data usage, liability,
          acceptable behaviour, and privacy. Replace with your full legal text.
        </p>

        <h3>1. Use of Service</h3>
        <p>Users must follow local laws and act responsibly when interacting with animals and helpers.</p>

        <h3>2. <Link to="/privacy">Data & Privacy</Link></h3>
        <p>We may collect contact details to help connect users with services. See our <Link to="/privacy">Privacy Policy</Link> for details.</p>

        <h3>3. Liability</h3>
        <p>Animals2Rescue is a connector platform. We do not guarantee outcomes and are not liable for third-party actions.</p>

        <h3>4. Changes</h3>
        <p>We may update these terms; users will be asked to accept changes when required.</p>
      </div>

      <div className="terms-actions">
        <label className="checkbox">
          <input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} />
          I have read and agree to the Terms & Conditions
        </label>

        <div className="btns">
          <button className="accept-btn" onClick={handleAccept} disabled={!accepted}>Accept</button>
        </div>
      </div>
    </div>
  );
}
