import React, { useEffect } from 'react';
import '../home/home-styles.css';

export default function AnimalCare() {
    useEffect(() => {
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

        function onWindowClick(e) {
            const tipModal = document.getElementById('tipModal');
            if (tipModal && e.target === tipModal) tipModal.classList.remove('show');
        }

        window.openTipDetail = openTipDetail;
        window.closeTipModal = closeTipModal;
        window.addEventListener('click', onWindowClick);

        return () => {
            window.removeEventListener('click', onWindowClick);
            delete window.openTipDetail;
            delete window.closeTipModal;
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

            <section className="tips" id="tips">
                <div className="tips-container">
                    <h2>Animal Care Tips & Guides</h2>
                    <p>Learn how to properly care for animals and provide first aid</p>

                    <div className="tips-categories">
                        <button className="tips-cat-btn active">All Tips</button>
                        <button className="tips-cat-btn">Dogs</button>
                        <button className="tips-cat-btn">Cats</button>
                        <button className="tips-cat-btn">Birds</button>
                        <button className="tips-cat-btn">Emergency</button>
                        <button className="tips-cat-btn">Nutrition</button>
                    </div>

                    <div className="tips-grid">
                        <div className="tip-card" data-category="dogs">
                            <div className="tip-icon"><i className="fas fa-dog" /></div>
                            <h3>Dog Training Basics</h3>
                            <p className="tip-category"><i className="fas fa-tag" /> Dogs</p>
                            <p className="tip-description">Learn essential commands and positive reinforcement techniques to train your dog effectively and safely.</p>
                            <div className="tip-points">
                                <div className="point"><i className="fas fa-check-circle" /> Start with basic commands</div>
                                <div className="point"><i className="fas fa-check-circle" /> Use positive reinforcement</div>
                                <div className="point"><i className="fas fa-check-circle" /> Keep training sessions short</div>
                            </div>
                            <button className="btn btn-small" onClick={() => window.openTipDetail('Dog Training Basics')}>Read More</button>
                        </div>

                        <div className="tip-card" data-category="dogs">
                            <div className="tip-icon"><i className="fas fa-heart-pulse" /></div>
                            <h3>Dog Exercise Requirements</h3>
                            <p className="tip-category"><i className="fas fa-tag" /> Dogs</p>
                            <p className="tip-description">Understand how much exercise your dog needs based on breed, age, and health conditions.</p>
                            <div className="tip-points">
                                <div className="point"><i className="fas fa-check-circle" /> 30-60 min daily for most dogs</div>
                                <div className="point"><i className="fas fa-check-circle" /> High-energy breeds need more</div>
                                <div className="point"><i className="fas fa-check-circle" /> Mental stimulation is important</div>
                            </div>
                            <button className="btn btn-small" onClick={() => window.openTipDetail('Dog Exercise Requirements')}>Read More</button>
                        </div>

                        <div className="tip-card" data-category="cats">
                            <div className="tip-icon"><i className="fas fa-cat" /></div>
                            <h3>Cat Litter Box Care</h3>
                            <p className="tip-category"><i className="fas fa-tag" /> Cats</p>
                            <p className="tip-description">Proper litter box maintenance ensures your cat's health and keeps your home clean.</p>
                            <div className="tip-points">
                                <div className="point"><i className="fas fa-check-circle" /> Clean litter box daily</div>
                                <div className="point"><i className="fas fa-check-circle" /> Use quality litter</div>
                                <div className="point"><i className="fas fa-check-circle" /> One box per cat plus one extra</div>
                            </div>
                            <button className="btn btn-small" onClick={() => window.openTipDetail('Cat Litter Box Care')}>Read More</button>
                        </div>

                        {/* Additional guides can be added here, kept concise for this page */}
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section"><h4>Animals2Rescue</h4><p>Emergency animal rescue and support services directory.</p></div>
                    <div className="footer-section"><h4>Quick Links</h4><ul><li><a href="/src/static">Home</a></li><li><a href="/animal-care">Guides</a></li></ul></div>
                </div>
                <div className="footer-bottom"><p>© 2024 Animals2Rescue. All rights reserved. | Emergency Help: +91 1800-RESCUE</p></div>
            </footer>

            <div id="tipModal" className="modal">
                <div className="modal-content">
                    <span className="close-btn" onClick={() => window.closeTipModal()}>&times;</span>
                    <div id="tipDetail"></div>
                </div>
            </div>
        </div>
    );
}
