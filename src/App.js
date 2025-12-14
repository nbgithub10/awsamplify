import './App.css';
import { useState } from 'react';
import UserProfileDisplay from "./UserProfileDisplay";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserRegistration from './UserRegistration';
import Home from './Home';
import AnimalCare from './AnimalCare';
import RealEstateHome from './RealEstateHome';
import Search from './Search';

function App() {
    const [currentView, setCurrentView] = useState('home'); // 'animal', 'csv', or 'profile'

    return (
        <Router>
            <div className="app-container">
                

                {/* preserve existing view switching for internal components */}
                {currentView === 'animal' && <UserProfileDisplay />}
                {currentView === 'profile' && <UserRegistration />}

                <Routes>
                    <Route path="/register" element={<UserRegistration />} />
                    <Route path="/animal-care" element={<AnimalCare />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/real-estate-home" element={<RealEstateHome />} />
                    {/* original Home route kept at /home if needed */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<RealEstateHome />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
