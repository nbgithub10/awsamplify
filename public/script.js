// Filter tips by category
function filterTips(category) {
    // Update active button
    document.querySelectorAll('.tips-cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('. tip-card');
    cards. forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            const cardCategories = card.getAttribute('data-category').split(' ');
            if (cardCategories.includes(category)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Open tip detail modal
function openTipDetail(tipTitle) {
    const modal = document.getElementById('tipModal');
    const tipDetail = document.getElementById('tipDetail');

    const tipDetails = {
        'Dog Training Basics': {
            icon: 'fas fa-dog',
            category: 'Dogs',
            content: `
                <div class="tip-detail-header">
                    <div class="tip-detail-icon">
                        <i class="fas fa-dog"></i>
                    </div>
                    <div class="tip-detail-title">
                        <h2>Dog Training Basics</h2>
                        <div class="tip-detail-meta">
                            <span class="meta-tag"><i class="fas fa-tag"></i> Dogs</span>
                            <span class="meta-tag"><i class="fas fa-graduation-cap"></i> Beginner</span>
                        </div>
                    </div>
                </div>
                <div class="tip-detail-content">
                    <div class="tip-content-section">
                        <h3>Key Training Tips</h3>
                        <div class="tip-list">
                            <div class="tip-list-item">
                                <i class="fas fa-check-circle"></i>
                                <p><strong>Start Early:</strong> Begin training your puppy from 8 weeks old</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-check-circle"></i>
                                <p><strong>Use Positive Reinforcement:</strong> Reward good behavior with treats and praise</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-check-circle"></i>
                                <p><strong>Keep Sessions Short:</strong> 5-10 minute training sessions work best</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-check-circle"></i>
                                <p><strong>Be Consistent:</strong> Use same commands and rewards every time</p>
                            </div>
                        </div>
                    </div>
                    <div class="tip-content-section">
                        <h3>Basic Commands</h3>
                        <div class="tip-list">
                            <div class="tip-list-item">
                                <i class="fas fa-star"></i>
                                <p><strong>Sit:</strong> Most fundamental command - foundation for others</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-star"></i>
                                <p><strong>Stay:</strong> Teach impulse control and patience</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-star"></i>
                                <p><strong>Come:</strong> Essential for safety and recall</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-star"></i>
                                <p><strong>Leave It:</strong> Prevents eating dangerous items</p>
                            </div>
                        </div>
                        <div class="tip-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            Never use punishment or negative reinforcement - it damages trust! 
                        </div>
                    </div>
                </div>
            `
        },
        'Dog Exercise Requirements': {
            icon: 'fas fa-heart-pulse',
            category: 'Dogs',
            content: `
                <div class="tip-detail-header">
                    <div class="tip-detail-icon">
                        <i class="fas fa-heart-pulse"></i>
                    </div>
                    <div class="tip-detail-title">
                        <h2>Dog Exercise Requirements</h2>
                        <div class="tip-detail-meta">
                            <span class="meta-tag"><i class="fas fa-tag"></i> Dogs</span>
                            <span class="meta-tag"><i class="fas fa-heartbeat"></i> Health</span>
                        </div>
                    </div>
                </div>
                <div class="tip-detail-content">
                    <div class="tip-content-section">
                        <h3>Exercise by Age</h3>
                        <div class="tip-list">
                            <div class="tip-list-item">
                                <i class="fas fa-check-circle"></i>
                                <p><strong>Puppies (Under 1 year):</strong> 5 minutes per month of age, twice daily</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-check-circle"></i>
                                <p><strong>Adult Dogs (1-7 years):</strong> 30-60 minutes daily depending on breed</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-check-circle"></i>
                                <p><strong>Senior Dogs (7+ years):</strong> 20-30 minutes daily, low impact</p>
                            </div>
                        </div>
                    </div>
                    <div class="tip-content-section">
                        <h3>Exercise Types</h3>
                        <div class="tip-list">
                            <div class="tip-list-item">
                                <i class="fas fa-running"></i>
                                <p><strong>Physical:</strong> Walking, running, fetching, swimming</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-brain"></i>
                                <p><strong>Mental:</strong> Puzzle toys, training, scent work, games</p>
                            </div>
                            <div class="tip-list-item">
                                <i class="fas fa-paw"></i>
                                <p><strong>Social:</strong> Dog parks, playdates, group activities</p>
                            </div>
                        </div>
                        <div class="tip-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            Avoid intense exercise for 1-2 hours after eating to prevent bloat!
                        </div>
                    </div>
                </div>
            `
        },
        // Add more tip details as needed
        'default': {
            icon: 'fas fa-lightbulb',
            content: `
                <div class="tip-detail-header">
                    <div class="tip-detail-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="tip-detail-title">
                        <h2>Animal Care Tip</h2>
                        <div class="tip-detail-meta">
                            <span class="meta-tag"><i class="fas fa-star"></i> Important</span>
                        </div>
                    </div>
                </div>
                <div class="tip-detail-content">
                    <div class="tip-content-section">
                        <h3>General Tips</h3>
                        <p>This tip covers essential information for proper animal care. </p>
                    </div>
                </div>
            `
        }
    };

    const data = tipDetails[tipTitle] || tipDetails['default'];
    tipDetail.innerHTML = data.content;
    modal.classList.add('show');
}

// Close tip modal
function closeTipModal() {
    const modal = document.getElementById('tipModal');
    modal.classList.remove('show');
}

// Existing functions remain the same... 
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const buttons = document.querySelectorAll('. tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function openServiceModal(serviceType) {
    const modal = document.getElementById('serviceModal');
    const title = document.getElementById('modalTitle');
    const list = document.getElementById('serviceList');

    const services = {
        rescuer: {
            title: 'Find Rescuers',
            items: [
                { name: 'City Rescue Team', rating: '4.9', location: '2 km away' },
                { name: 'Wildlife Rescue Unit', rating: '4.8', location: '3. 5 km away' },
                { name: 'Emergency Rescue Squad', rating: '4.7', location: '1.8 km away' }
            ]
        },
        vet: {
            title: 'Find Veterinarians',
            items: [
                { name: 'Dr.  Sharma Veterinary Clinic', rating: '4.9', location: '1.5 km away' },
                { name: 'Pet Care Hospital', rating: '4.8', location: '2.2 km away' },
                { name: 'Emergency Vet Service', rating: '4.7', location: '24/7 Available' }
            ]
        },
        paravet: {
            title: 'Find Paravets',
            items: [
                { name: 'Kumar Paravet Services', rating: '4.8', location: '1 km away' },
                { name: 'Mobile Paravet Care', rating: '4.7', location: '2 km away' },
                { name: 'Quick Paramedic Team', rating: '4.6', location: '1.5 km away' }
            ]
        },
        ambulance: {
            title: 'Find Ambulance Services',
            items: [
                { name: 'Emergency Animal Ambulance', rating: '4. 9', location: '10 min response' },
                { name: 'Wildlife Rescue Transport', rating: '4.8', location: '15 min response' },
                { name: 'Pet Emergency Cab', rating: '4.7', location: '12 min response' }
            ]
        },
        boarding: {
            title: 'Find Paid Boarding',
            items: [
                { name: 'Luxury Pet Hotel', rating: '4.9', location: '₹2000-3000/day' },
                { name: 'Premium Animal Boarding', rating: '4.8', location: '₹1500-2500/day' },
                { name: 'Cozy Pet Shelter', rating: '4.7', location: '₹800-1500/day' }
            ]
        },
        shelter: {
            title: 'Find Shelters',
            items: [
                { name: 'City Animal Shelter', rating: '4.8', location: '3 km away' },
                { name: 'Animal Rescue Foundation', rating: '4.9', location: '5 km away' },
                { name: 'Community Pet Shelter', rating: '4.7', location: '2 km away' }
            ]
        }
    };

    const data = services[serviceType];
    if (data) {
        title.textContent = data.title;
        list.innerHTML = data.items.map(item => `
            <div class="service-item" onclick="selectService('${item.name}')">
                <h4>${item.name}</h4>
                <p>${item.location}</p>
                <div class="service-rating">⭐ ${item.rating}</div>
            </div>
        `).join('');
    }

    modal.classList.add('show');
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('show');
}

function selectService(serviceName) {
    alert(`Selected: ${serviceName}\n\nRedirecting to contact details...`);
    closeServiceModal();
}

function openReportSighting(type) {
    switchTab('report');
    scrollToSection('lost-found');
}

window.onclick = function(event) {
    const modal = document.getElementById('serviceModal');
    const tipModal = document.getElementById('tipModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
    if (event.target === tipModal) {
        tipModal.classList.remove('show');
    }
}

const reportForm = document.getElementById('reportForm');
if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for reporting!  Our team will review it shortly.');
        this.reset();
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for reaching out! We will contact you soon.');
        this.reset();
    });
}

console.log('Animals2Rescue - Complete with Care Tips loaded successfully!');