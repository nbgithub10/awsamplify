import logo from './logo.svg';
import './App.css';
import AnimalDisplay from "./AnimalDisplay";

function App() {
  return (
    <div className="App">
      <AnimalDisplay/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Main container
        </p>
      </header>
    </div>
  );
}

export default App;
