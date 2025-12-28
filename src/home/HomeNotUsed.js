import React, { useEffect } from 'react';
import '../home-styles.css';

export default function HomeNotUsed() {
    useEffect(() => {
        // Attach form handlers and window click listener similar to previous home-script.js
        function scrollToSection(id) {
            const section = document.getElementById(id);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }

        function switchTab(tabName, buttonEl) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            const selected = document.getElementById(tabName);
            if (selected) selected.classList.add('active');

            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            if (buttonEl) buttonEl.classList.add('active');
        }

        function openReportSighting() {
            switchTab('report');
            scrollToSection('lost-found');
        }

        // Expose some helper functions to window so inline handlers in markup can call them if needed
        window.scrollToSection = scrollToSection;
        window.switchTab = switchTab;
        window.openReportSighting = openReportSighting;

        function openTipDetail(tipTitle) {
            const modal = document.getElementById('tipModal');
            const tipDetail = document.getElementById('tipDetail');

            const data = {
                'Dog Training Basics': '<h2>Dog Training Basics</h2><p>Start early and use positive reinforcement.</p>',
                'Dog Exercise Requirements': '<h2>Dog Exercise Requirements</h2><p>30-60 minutes a day for most dogs.</p>',
                'default': '<h2>Animal Care Tip</h2><p>Helpful tip content.</p>'
            }[tipTitle] || '<h2>Animal Care Tip</h2><p>Helpful tip content.</p>';

            if (tipDetail) tipDetail.innerHTML = data;
            if (modal) modal.classList.add('show');
        }

        function closeTipModal() {
            const modal = document.getElementById('tipModal');
            if (modal) modal.classList.remove('show');
        }

        window.openTipDetail = openTipDetail;
        window.closeTipModal = closeTipModal;

        function openServiceModal(serviceType) {
            const modal = document.getElementById('serviceModal');
            const title = document.getElementById('modalTitle');
            const list = document.getElementById('serviceList');

            const services = {
                rescuer: {
                    title: 'Find Rescuers',
                    items: [
                        { name: 'City Rescue Team', rating: '4.9', location: '2 km away' },
                        { name: 'Wildlife Rescue Unit', rating: '4.8', location: '3.5 km away' }
                    ]
                },
                vet: { title: 'Find Veterinarians', items: [{ name: 'Dr. Sharma Clinic', rating: '4.9', location: '1.5 km away' }] },
                paravet: { title: 'Find Paravets', items: [{ name: 'Kumar Paravet Services', rating: '4.8', location: '1 km away' }] },
                ambulance: { title: 'Find Ambulance Services', items: [{ name: 'Emergency Animal Ambulance', rating: '4.9', location: '10 min response' }] },
                boarding: { title: 'Find Paid Boarding', items: [{ name: 'Luxury Pet Hotel', rating: '4.9', location: '₹2000-3000/day' }] },
                shelter: { title: 'Find Shelters', items: [{ name: 'City Animal Shelter', rating: '4.8', location: '3 km away' }] }
            };

            const data = services[serviceType];
            if (data) {
                if (title) title.textContent = data.title;
                if (list) list.innerHTML = data.items.map(item => `\n                    <div class="service-item" onclick="selectService('${item.name.replace(/'/g, "\\'")}')">\n                        <h4>${item.name}</h4>\n                        <p>${item.location}</p>\n                        <div class="service-rating">⭐ ${item.rating}</div>\n                    </div>\n                `).join('');
            }

            if (modal) modal.classList.add('show');
        }

        function closeServiceModal() {
            const modal = document.getElementById('serviceModal');
            if (modal) modal.classList.remove('show');
        }

        function selectService(serviceName) {
            // simple placeholder behaviour
            // eslint-disable-next-line no-alert
            alert(`Selected: ${serviceName} - redirecting to contact details...`);
            closeServiceModal();
        }

        window.openServiceModal = openServiceModal;
        window.closeServiceModal = closeServiceModal;
        window.selectService = selectService;

        // Tip modal close when clicking outside
        function onWindowClick(e) {
            const modal = document.getElementById('serviceModal');
            const tipModal = document.getElementById('tipModal');
            if (modal && e.target === modal) modal.classList.remove('show');
            if (tipModal && e.target === tipModal) tipModal.classList.remove('show');
        }

        window.addEventListener('click', onWindowClick);

        // Form handlers
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', function (e) {
                e.preventDefault();
                // eslint-disable-next-line no-alert
                alert('Thank you for reporting! Our team will review it shortly.');
                // @ts-ignore
                this.reset();
            });
        }

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                // eslint-disable-next-line no-alert
                alert('Thank you for reaching out! We will contact you soon.');
                // @ts-ignore
                this.reset();
            });
        }

        return () => {
            window.removeEventListener('click', onWindowClick);
            delete window.scrollToSection;
            delete window.switchTab;
            delete window.openReportSighting;
            delete window.openTipDetail;
            delete window.closeTipModal;
            delete window.openServiceModal;
            delete window.closeServiceModal;
            delete window.selectService;
        };
    }, []);

    return (
        <div className="home-root">
            <header className="header">
                <div className="header-top">
                    <div className="header-container">
                        <div className="header-logo">
                            <i className="fas fa-paw" />
                            <span>Animals2Rescue</span>
                        </div>
                        <div className="header-search">
                            <input type="text" placeholder="Search services, location...   " />
                            <button><i className="fas fa-search" /></button>
                        </div>
                        
                        <div className="header-actions">
                            <a href="/signin" className="btn btn-link signin-btn" style={{ marginRight: 8, textDecoration: 'none', color: 'inherit' }}>Sign In</a>
                            <a href="/register" className="btn btn-primary join-btn" style={{ textDecoration: 'none', color: 'inherit' }}>Join</a>
                        </div>
                    </div>
                </div>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Find Help for Your Animals, Anytime</h1>
                    <p>Quick access to rescuers, vets, paramedics, shelters, and boarding services</p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary" onClick={() => window.scrollToSection('services')}>
                            <i className="fas fa-stethoscope" /> Find Services
                        </button>
                        <button className="btn btn-primary" onClick={() => window.scrollToSection('lost-found')}>
                            <i className="fas fa-search" /> Report Lost/Found
                        </button>
                    </div>
                </div>
            </section>

            {/* Services, Tips, Lost&Found, About, Contact sections (kept markup similar to original) */}

            <section className="services" id="services">
                <div className="services-container">
                    <h2>Find Services</h2>
                    <div className="service-categories">
                        <div className="service-category-card">
                            <div className="service-icon rescuer-icon"><i className="fas fa-person-hiking" /></div>
                            <h3>Find Rescuers</h3>
                            <p>Professional animal rescue teams ready to help</p>
                            <div className="service-stats">
                                <span className="stat"><strong>250+</strong> Active Rescuers</span>
                                <span className="stat"><strong>15 min</strong> Avg Response</span>
                            </div>
                            <button className="btn btn-service" onClick={() => window.openServiceModal('rescuer')}>
                                <i className="fas fa-search" /> Find Rescuers
                            </button>
                        </div>

                        <div className="service-category-card">
                            <div className="service-icon vet-icon"><i className="fas fa-stethoscope" /></div>
                            <h3>Find Veterinarians</h3>
                            <p>Licensed vets for medical care and emergencies</p>
                            <div className="service-stats">
                                <span className="stat"><strong>180+</strong> Registered Vets</span>
                                <span className="stat"><strong>24/7</strong> Emergency</span>
                            </div>
                            <button className="btn btn-service" onClick={() => window.openServiceModal('vet')}>
                                <i className="fas fa-search" /> Find Vets
                            </button>
                        </div>

                        <div className="service-category-card">
                            <div className="service-icon paravet-icon"><i className="fas fa-user-nurse" /></div>
                            <h3>Find Paravets</h3>
                            <p>Paramedical support and basic care services</p>
                            <div className="service-stats">
                                <span className="stat"><strong>320+</strong> Paravets</span>
                                <span className="stat"><strong>Quick</strong> Availability</span>
                            </div>
                            <button className="btn btn-service" onClick={() => window.openServiceModal('paravet')}>
                                <i className="fas fa-search" /> Find Paravets
                            </button>
                        </div>

                        <div className="service-category-card">
                            <div className="service-icon ambulance-icon"><i className="fas fa-ambulance" /></div>
                            <h3>Find Ambulance Services</h3>
                            <p>Emergency transport for injured or sick animals</p>
                            <div className="service-stats">
                                <span className="stat"><strong>95+</strong> Ambulances</span>
                                <span className="stat"><strong>10 min</strong> Response</span>
                            </div>
                            <button className="btn btn-service" onClick={() => window.openServiceModal('ambulance')}>
                                <i className="fas fa-search" /> Find Ambulance
                            </button>
                        </div>

                        <div className="service-category-card">
                            <div className="service-icon boarding-icon"><i className="fas fa-hotel" /></div>
                            <h3>Find Paid Boarding</h3>
                            <p>Premium boarding and accommodation services</p>
                            <div className="service-stats">
                                <span className="stat"><strong>450+</strong> Facilities</span>
                                <span className="stat"><strong>₹500-5000</strong> Per Day</span>
                            </div>
                            <button className="btn btn-service" onClick={() => window.openServiceModal('boarding')}>
                                <i className="fas fa-search" /> Find Boarding
                            </button>
                        </div>

                        <div className="service-category-card">
                            <div className="service-icon shelter-icon"><i className="fas fa-building" /></div>
                            <h3>Find Shelters</h3>
                            <p>Rescue shelters and adoption centers</p>
                            <div className="service-stats">
                                <span className="stat"><strong>280+</strong> Shelters</span>
                                <span className="stat"><strong>5000+</strong> Animals</span>
                            </div>
                            <button className="btn btn-service" onClick={() => window.openServiceModal('shelter')}>
                                <i className="fas fa-search" /> Find Shelters
                            </button>
                        </div>

                        <div className="service-category-card">
                            <div className="service-icon guide-icon"><i className="fas fa-book-medical" /></div>
                            <h3>Animal Care Guides</h3>
                            <p>Quick care guides and first aid for common situations</p>
                            <div className="service-stats">
                                <span className="stat"><strong>100+</strong> Guides</span>
                                <span className="stat"><strong>5-20</strong> min Read</span>
                            </div>
                            
                        </div>

                        <div className="service-category-card">
                            <div className="service-icon lost-icon"><i className="fas fa-search-location" /></div>
                            <h3>Lost and Found Animals</h3>
                            <p>Report sightings and browse recent lost animal posts</p>
                            <div className="service-stats">
                                <span className="stat"><strong>120+</strong> Active Reports</span>
                                <span className="stat"><strong>25</strong> Reports Today</span>
                            </div>
                            <button className="btn btn-service" onClick={() => window.scrollToSection('lost-found')}>
                                <i className="fas fa-search" /> View Lost & Found
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            <section className="tips-placeholder">
                <div className="tips-container">
                    <h2>Animal Care Tips & Guides</h2>
                    <p>This content has been moved to a dedicated page.</p>
                </div>
            </section>

            <section className="lost-found" id="lost-found">
                <div className="lost-found-container">
                    <h2>Lost & Found Animals</h2>
                    <p>Help reunite animals with their families</p>

                    <div className="lost-found-tabs">
                        <button className="tab-btn active" onClick={(e)=>window.switchTab('lost', e.currentTarget)}><i className="fas fa-search" /> Lost Animals</button>
                        <button className="tab-btn" onClick={(e)=>window.switchTab('found', e.currentTarget)}><i className="fas fa-paw" /> Found Animals</button>
                        <button className="tab-btn" onClick={(e)=>window.switchTab('report', e.currentTarget)}><i className="fas fa-plus-circle" /> Report Animal</button>
                    </div>

                    <div id="lost" className="tab-content active">
                        <div className="lost-found-grid">
                            <div className="lost-card">
                                <div className="lost-image">
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 250'%3E%3Crect fill='%23E8F4F8' width='300' height='250'/%3E%3Ccircle cx='150' cy='80' r='40' fill='%23D4A574'/%3E%3Cellipse cx='150' cy='150' rx='50' ry='60' fill='%23D4A574'/%3E%3C/svg%3E" alt="Missing Dog" />
                                    <span className="lost-badge">MISSING</span>
                                </div>
                                <div className="lost-info">
                                    <h3>Golden Retriever - Max</h3>
                                    <p><i className="fas fa-map-marker-alt" /> Downtown Area • Lost 5 days ago</p>
                                    <p className="lost-desc">Friendly golden retriever, wearing blue collar with ID tag.</p>
                                    <button className="btn btn-small" onClick={()=>window.openReportSighting('lost')}>Report Sighting</button>
                                </div>
                            </div>

                            {/* other lost cards omitted for brevity */}

                        </div>
                    </div>

                    <div id="found" className="tab-content">
                        <div className="lost-found-grid">
                            <div className="found-card">
                                <div className="found-image">
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 250'%3E%3Crect fill='%23F3E5F5' width='300' height='250'/%3E%3Ccircle cx='150' cy='80' r='40' fill='%23D4A574'/%3E%3Cellipse cx='150' cy='150' rx='50' ry='60' fill='%23D4A574'/%3E%3C/svg%3E" alt="Found Dog" />
                                    <span className="found-badge">FOUND</span>
                                </div>
                                <div className="found-info">
                                    <h3>Brown Dog - Unknown</h3>
                                    <p><i className="fas fa-map-marker-alt" /> Central Park • Found Today</p>
                                    <p className="found-desc">Medium-sized brown dog, friendly and well-behaved. Safe at shelter.</p>
                                    <button className="btn btn-small" onClick={()=>window.openReportSighting('found')}>Is This Your Pet?</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div id="report" className="tab-content">
                        <div className="report-form-container">
                            <h3>Report a Lost or Found Animal</h3>
                            <form className="report-form" id="reportForm">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Report Type *</label>
                                        <select required>
                                            <option value="">Select Type</option>
                                            <option value="lost">Lost Animal</option>
                                            <option value="found">Found Animal</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Animal Type *</label>
                                        <select required>
                                            <option value="">Select Animal</option>
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                            <option value="bird">Bird</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Animal Name/Description *</label>
                                        <input type="text" placeholder="e.g., Golden Retriever named Max" required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Location *</label>
                                        <input type="text" placeholder="Where was the animal lost/found?" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Date *</label>
                                        <input type="date" required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Your Contact Number *</label>
                                        <input type="tel" placeholder="+91 9876543210" required />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Detailed Description *</label>
                                    <textarea placeholder="Describe the animal's appearance, breed, size, color, identifying marks..." rows="4" required />
                                </div>

                                <div className="form-group full-width">
                                    <label>Photo Upload</label>
                                    <input type="file" accept="image/*" />
                                    <small>Upload a photo for better identification</small>
                                </div>

                                <button type="submit" className="btn btn-primary">Submit Report</button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

            <section className="about" id="about">
                <div className="about-container">
                    <h2>About Animals2Rescue</h2>
                    <div className="about-grid">
                        <div className="about-card"><i className="fas fa-heart" /><h3>Our Mission</h3><p>Connect animals in need with professional rescue services, emergency care, and shelter support.</p></div>
                        <div className="about-card"><i className="fas fa-handshake" /><h3>Verified Providers</h3><p>All rescuers, vets, and services are verified and trusted by our community.</p></div>
                        <div className="about-card"><i className="fas fa-clock" /><h3>24/7 Availability</h3><p>Emergency services available around the clock for urgent animal situations.</p></div>
                        <div className="about-card"><i className="fas fa-globe" /><h3>Wide Coverage</h3><p>Services available across multiple cities and regions with growing network.</p></div>
                    </div>
                </div>
            </section>

            <section className="contact" id="contact">
                <div className="contact-container">
                    <h2>Get In Touch</h2>
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="contact-item"><i className="fas fa-phone" /><div><h4>Emergency Hotline</h4><p>+91 1800-RESCUE (7372823)</p></div></div>
                            <div className="contact-item"><i className="fas fa-envelope" /><div><h4>Email Us</h4><p>help@animals2rescue.org</p></div></div>
                            <div className="contact-item"><i className="fas fa-map-marker-alt" /><div><h4>Headquarters</h4><p>Multiple locations across India</p></div></div>
                        </div>

                        <form className="contact-form" id="contactForm">
                            <div className="form-group"><input type="text" placeholder="Your Name" required /></div>
                            <div className="form-group"><input type="email" placeholder="Your Email" required /></div>
                            <div className="form-group"><textarea placeholder="Your Message" rows="5" required /></div>
                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section"><h4>Animals2Rescue</h4><p>Emergency animal rescue and support services directory.</p></div>
                    <div className="footer-section"><h4>Quick Links</h4><ul><li><a href="#services">Find Services</a></li><li><a href="#tips">Care Tips</a></li><li><a href="#lost-found">Lost & Found</a></li><li><a href="#about">About</a></li></ul></div>
                    <div className="footer-section"><h4>Services</h4><ul><li><a href="#">Rescuers</a></li><li><a href="#">Veterinarians</a></li><li><a href="#">Ambulance</a></li><li><a href="#">Shelters</a></li></ul></div>
                    <div className="footer-section"><h4>Legal</h4><ul><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Contact</a></li></ul></div>
                </div>
                <div className="footer-bottom"><p>© 2024 Animals2Rescue. All rights reserved. | Emergency Help: +91 1800-RESCUE</p></div>
            </footer>

            {/* Modals */}
            <div id="tipModal" className="modal">
                <div className="modal-content">
                    <span className="close-btn" onClick={() => window.closeTipModal()}>&times;</span>
                    <div id="tipDetail"></div>
                </div>
            </div>

            <div id="serviceModal" className="modal">
                <div className="modal-content">
                    <span className="close-btn" onClick={() => window.closeServiceModal()}>&times;</span>
                    <h2 id="modalTitle">Find Services</h2>
                    <div className="service-list" id="serviceList"></div>
                </div>
            </div>
        </div>
    );
}
