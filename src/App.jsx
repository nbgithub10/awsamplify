import { useState } from 'react';
import './App.css'
import QuizApp from './components/QuizApp'
import Stats from './pages/Stats'

function App() {
  const [view, setView] = useState('quiz');

  if (view === 'stats') {
    return <Stats onBack={() => setView('quiz')} />;
  }

  return <QuizApp onViewStats={() => setView('stats')} />;
}

export default App
