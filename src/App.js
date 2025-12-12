import './App.css';
import { useState } from 'react';
import UserProfileDisplay from "./UserProfileDisplay";
import UserProfile from './UserProfile';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserRegistration from './UserRegistration';

function App() {
    const [currentView, setCurrentView] = useState('profile'); // 'animal', 'csv', or 'profile'

    return (
        <Router>
            <div className="app-container">
                <div className="navigation-buttons">
                    {/*<button*/}
                    {/*    className={`nav-button ${currentView === 'animal' ? 'active' : ''}`}*/}
                    {/*    onClick={() => setCurrentView('animal')}*/}
                    {/*>*/}
                    {/*    Animal Display*/}
                    {/*</button>*/}
                    <button
                        className={`nav-button ${currentView === 'profile' ? 'active' : ''}`}
                        onClick={() => setCurrentView('profile')}
                    >
                        User Profile
                    </button>

                    {/* New link to registration page */}
                    {/*<Link to="/register" className="nav-link">Register</Link>*/}
                </div>

                {/* preserve existing view switching for internal components */}
                {currentView === 'animal' && <UserProfileDisplay />}
                {/*{currentView === 'csv' && <CsvToJsonConverter />}*/}
                {currentView === 'profile' && <UserRegistration />}

                <Routes>
                    <Route path="/register" element={<UserRegistration />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
