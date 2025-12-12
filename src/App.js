import './App.css';
import { useState } from 'react';
import UserProfileDisplay from "./UserProfileDisplay";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserRegistration from './UserRegistration';
import Home from './Home';

function App() {
    const [currentView, setCurrentView] = useState('home'); // 'animal', 'csv', or 'profile'

    return (
        <Router>
            <div className="app-container">
                <div className="navigation-buttons">
                    <button
                        className={`nav-button ${currentView === 'home' ? 'active' : ''}`}
                        onClick={() => setCurrentView('home')}
                    >
                        Home
                    </button>
                    <button
                        className={`nav-button ${currentView === 'profile' ? 'active' : ''}`}
                        onClick={() => setCurrentView('profile')}
                    >
                        User Profile
                    </button>

                    {/* Link to the new Home page */}
                    {/*<Link to="/home" className="nav-link" style={{ marginLeft: 12 }}>Home</Link>*/}
                </div>

                {/* preserve existing view switching for internal components */}
                {currentView === 'animal' && <UserProfileDisplay />}
                {currentView === 'profile' && <UserRegistration />}

                <Routes>
                    <Route path="/register" element={<UserRegistration />} />
                    {/*<Route path="/home" element={<Home />} />*/}
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
