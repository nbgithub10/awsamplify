import './App.css';
import { useState } from 'react';
import UserProfileDisplay from "./registration/UserProfileDisplay";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserRegistration from './registration/UserRegistration';
import HomeNotUsed from './home/HomeNotUsed';
import AnimalCare from './AnimalCare';
import Home from './home/Home';
import Search from './search/Search';

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
                    <Route path="/real-estate-home" element={<Home />} />
                    {/* original HomeNotUsed route kept at /home if needed */}
                    <Route path="/home" element={<HomeNotUsed />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
