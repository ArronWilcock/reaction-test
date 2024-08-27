import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import SinglePlayer from "./pages/SinglePlayer/SinglePlayer";
import VsMode from "./pages/VsMode/VsMode";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/single-player" element={<SinglePlayer />} />
          <Route path="/vs-mode" element={<VsMode />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
