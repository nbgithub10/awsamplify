import './App.css';
import { useState } from 'react';
import UserProfileDisplay from "./registration/UserProfileDisplay";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRegistration from './registration/UserRegistration';
import HomeNotUsed from './home/HomeNotUsed';
import AnimalCare from './static/AnimalCare';
import Home from './home/Home';
import Search from './search/Search';
import Terms from './static/Terms';
import Privacy from './static/Privacy';
import PetSearch from './search/PetSearch';
import PetMissingHelp from './search/PetMissingHelp';

function App() {
    const [currentView] = useState('home'); // 'animal', 'csv', or 'profile' (no setter used)

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
                    <Route path="/pet-search" element={<PetSearch />} />
                    <Route path="/pet-missing" element={<PetMissingHelp />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
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
