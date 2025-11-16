
import './App.css';
import { useState } from 'react';
import AnimalDisplay from "./AnimalDisplay";
import CsvToJsonConverter from "./CsvToJsonConverter";

function App() {
    const [currentView, setCurrentView] = useState('animal'); // 'animal' or 'csv'

    return (
        <div className="app-container">
            <div className="navigation-buttons">
                <button
                    className={`nav-button ${currentView === 'animal' ? 'active' : ''}`}
                    onClick={() => setCurrentView('animal')}
                >
                    Animal Activist Profiles
                </button>
                <button
                    className={`nav-button ${currentView === 'csv' ? 'active' : ''}`}
                    onClick={() => setCurrentView('csv')}
                >
                   Admin use
                </button>
            </div>

            {currentView === 'animal' ? <AnimalDisplay /> : <CsvToJsonConverter />}
        </div>
    );
}

export default App;