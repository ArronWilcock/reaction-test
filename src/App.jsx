import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SinglePlayer from './SinglePlayer';
import VsMode from './VsMode';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Arduino Reaction Test</h1>
          <Routes>
            <Route path="/single-player" element={<SinglePlayer />} />
            <Route path="/vs-mode" element={<VsMode />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
};

const HomePage = () => (
  <div>
    <Link to="/single-player">
      <button>Single Player</button>
    </Link>
    <Link to="/vs-mode">
      <button>VS Mode</button>
    </Link>
  </div>
);

export default App;
