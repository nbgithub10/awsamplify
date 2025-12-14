import React from 'react';
import './realestate-home.css';

export default function RealEstateHome() {
    return (
        <div className="re-root">
            <header className="re-header">
                <div className="re-header-inner">
                    <div className="re-logo">
                        <i className="fas fa-paw" />
                        <span>Animals2Rescue</span>
                    </div>
                    <div className="re-actions">
                        <a href="/signin" className="re-link">Sign In</a>
                        <a href="/register" className="re-cta">Join</a>
                    </div>
                </div>
                <div className="re-search">
                    <h1>Find Help for Your Animals, Anytime</h1>
                    <p>Quick access to rescuers, vets, paramedics, shelters, and boarding services</p>

                    <form className="re-search-form" onSubmit={(e)=>e.preventDefault()}>
                        <input aria-label="What are you looking for" className="re-input" placeholder="Search services, location or keywords" />
                        <select className="re-select">
                            <option>All Services</option>
                            <option>Ambulance</option>
                            <option>Boarding</option>
                            <option>Paravets</option>
                            <option>Rescuers</option>
                            <option>Shelters</option>
                            <option>Veterinarians</option>
                        </select>
                        <a href="#" className="re-search-btn" onClick={(e)=>{e.preventDefault(); /* placeholder for search */ }} aria-label="Search">
                            <i className="fas fa-search" />
                        </a>
                    </form>
                </div>
            </header>

            <main className="re-main">
                <section className="re-categories">
                    <h2>Find Services</h2>
                    <div className="re-grid">
                        <article className="card">
                            <div className="card-icon rescuer"><i className="fas fa-person-hiking" /></div>
                            <h3>Find Rescuers</h3>
                            <p>Professional animal rescue teams ready to help</p>
                            <div className="card-meta"><span><strong>250+</strong> Active Rescuers</span><span><strong>15 min</strong> Avg Response</span></div>
                        </article>

                        <article className="card">
                            <div className="card-icon vet"><i className="fas fa-stethoscope" /></div>
                            <h3>Find Veterinarians</h3>
                            <p>Licensed vets for medical care and emergencies</p>
                            <div className="card-meta"><span><strong>180+</strong> Registered Vets</span><span><strong>24/7</strong> Emergency</span></div>
                        </article>

                        <article className="card">
                            <div className="card-icon paravet"><i className="fas fa-user-nurse" /></div>
                            <h3>Find Paravets</h3>
                            <p>Paramedical support and basic care services</p>
                            <div className="card-meta"><span><strong>320+</strong> Paravets</span><span><strong>Quick</strong> Availability</span></div>
                        </article>

                        <article className="card">
                            <div className="card-icon ambulance"><i className="fas fa-ambulance" /></div>
                            <h3>Find Ambulance Services</h3>
                            <p>Emergency transport for injured or sick animals</p>
                            <div className="card-meta"><span><strong>95+</strong> Ambulances</span><span><strong>10 min</strong> Response</span></div>
                        </article>

                        <article className="card">
                            <div className="card-icon boarding"><i className="fas fa-hotel" /></div>
                            <h3>Find Paid Boarding</h3>
                            <p>Premium boarding and accommodation services</p>
                            <div className="card-meta"><span><strong>450+</strong> Facilities</span><span><strong>₹500-5000</strong> Per Day</span></div>
                        </article>

                        <article className="card">
                            <div className="card-icon shelter"><i className="fas fa-building" /></div>
                            <h3>Find Shelters</h3>
                            <p>Rescue shelters and adoption centers</p>
                            <div className="card-meta"><span><strong>280+</strong> Shelters</span><span><strong>5000+</strong> Animals</span></div>
                        </article>

                        <article className="card">
                            <div className="card-icon guides"><i className="fas fa-book-medical" /></div>
                            <h3>Animal Care Guides</h3>
                            <p>Quick care guides and first aid for common situations</p>
                            <div className="card-meta"><span><strong>100+</strong> Guides</span><span><strong>5-20</strong> min Read</span></div>
                        </article>

                        <article className="card">
                            <div className="card-icon lost"><i className="fas fa-search-location" /></div>
                            <h3>Lost and Found Animals</h3>
                            <p>Report sightings and browse recent lost animal posts</p>
                            <div className="card-meta"><span><strong>120+</strong> Active Reports</span><span><strong>25</strong> Reports Today</span></div>
                        </article>
                    </div>
                </section>

                

                
            </main>

            <footer className="re-footer">
                <div className="re-footer-inner">
                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/animal-care">Guides</a></li>
                        </ul>
                    </div>
                </div>
                <div className="re-footer-bottom">© 2024 Animals2Rescue. All rights reserved. | Emergency Help: +91 1800-RESCUE</div>
            </footer>
        </div>
    );
}
