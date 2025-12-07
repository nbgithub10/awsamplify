
import './App.css';
import { useState } from 'react';
import UserProfileDisplay from "./UserProfileDisplay";
import CsvToJsonConverter from "./CsvToJsonConverter";
import UserProfile from './UserProfile';

function App() {
    const [currentView, setCurrentView] = useState('animal'); // 'animal', 'csv', or 'profile'

    return (
        <div className="app-container">
            <div className="navigation-buttons">
                <button 
                    className={`nav-button ${currentView === 'animal' ? 'active' : ''}`}
                    onClick={() => setCurrentView('animal')}
                >
                    Animal Display
                </button>
                {/*<button */}
                {/*    className={`nav-button ${currentView === 'csv' ? 'active' : ''}`}*/}
                {/*    onClick={() => setCurrentView('csv')}*/}
                {/*>*/}
                {/*    CSV to JSON Converter*/}
                {/*</button>*/}
                <button 
                    className={`nav-button ${currentView === 'profile' ? 'active' : ''}`}
                    onClick={() => setCurrentView('profile')}
                >
                    User Profile
                </button>
            </div>

            {currentView === 'animal' && <UserProfileDisplay />}
            {/*{currentView === 'csv' && <CsvToJsonConverter />}*/}
            {currentView === 'profile' && <UserProfile />}
        </div>
    );
}

export default App;