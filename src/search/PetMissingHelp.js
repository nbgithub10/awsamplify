import React from 'react';
import './petsearch.css';

export default function PetMissingHelp() {
  return (
    <div className="petsearch-root">
      <div className="section-title">What to Do If Your Pet Goes Missing</div>

      <section className="petsearch-guidance">
        <p className="section-intro">Sorry you’re going through this—losing a pet is incredibly stressful and emotional. Here are practical steps you can take, in roughly the order that helps most people:</p>

        <div className="guidance-card">
          <div className="card-header"><span className="step-badge">1</span><h3>Immediate Steps (First 24 Hours)</h3></div>
          <div className="card-body">
            <ol>
              <li>
                <strong>Search nearby thoroughly</strong>
                <ul>
                  <li>Check hiding spots: under decks, bushes, garages, sheds.</li>
                  <li>Walk or drive slowly, calling their name calmly.</li>
                  <li>Go out during quiet times (early morning or late night).</li>
                </ul>
              </li>

              <li>
                <strong>Leave familiar scents</strong>
                <ul>
                  <li>Place their bed, blanket, or your worn clothing outside.</li>
                  <li>Leave food and water near your home.</li>
                </ul>
              </li>

              <li>
                <strong>Alert neighbors</strong>
                <ul>
                  <li>Knock on doors or leave notes.</li>
                  <li>Ask them to check garages, basements, and sheds.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>

        <div className="guidance-card">
          <div className="card-header"><span className="step-badge">2</span><h3>Spread the Word</h3></div>
          <div className="card-body">
            <ol>
              <li>
                <strong>Create clear flyers</strong>
                <p>Include:</p>
                <ul>
                  <li>Recent photo</li>
                  <li>Pet’s name, breed, size, color</li>
                  <li>Date and location last seen</li>
                  <li>Your contact info</li>
                </ul>
                <p>Post them at intersections, vet offices, pet stores, and community boards.</p>
              </li>

              <li>
                <strong>Use online resources</strong>
                <ul>
                  <li>Post on local Facebook groups</li>
                  <li>Post on Nextdoor</li>
                  <li>Use pet-finding websites (PawBoost, local shelter pages)</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>

        <div className="guidance-card">
          <div className="card-header"><span className="step-badge">3</span><h3>Contact Professionals</h3></div>
          <div className="card-body">
            <ol>
              <li>
                <strong>Call shelters and vets</strong>
                <p>Contact animal shelters, rescue groups, and animal control. Check in daily—don’t rely only on phone calls.</p>
              </li>

              <li>
                <strong>Report microchip or ID</strong>
                <p>Notify the microchip company if your pet is chipped and update your contact information immediately.</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="guidance-card small-card">
          <div className="card-header"><span className="step-badge muted">4</span><h3>Don’t Give Up</h3></div>
          <div className="card-body">
            <p>Many pets are found days or even weeks later. Keep flyers up and continue checking shelters regularly.</p>
          </div>
        </div>

        <div className="guidance-card small-card">
          <div className="card-header"><span className="step-badge muted">5</span><h3>Take Care of Yourself</h3></div>
          <div className="card-body">
            <p>Ask friends or family to help search. Try to rest—this is emotionally exhausting.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

