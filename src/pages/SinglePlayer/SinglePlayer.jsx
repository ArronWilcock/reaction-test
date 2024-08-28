import React, { useState } from "react";
import Banner from "../../components/banner/banner";
import Leaderboard from "../../components/leaderboard/leaderboard"; // Import the Leaderboard component
import io from "socket.io-client";
import "./singleplayer.scss"; // Import the SCSS file

const socket = io("http://localhost:4000"); // Connect to the backend server

const SinglePlayer = () => {
  const [player1, setPlayer1] = useState({ name: "", location: "" });
  const [testInProgress, setTestInProgress] = useState(false);

  const startTest = () => {
    setTestInProgress(true);
    socket.emit("start:test:single");
  };

  const handleTestComplete = () => {
    setTestInProgress(false);
    setPlayer1({ name: "", location: "" });
  };

  return (
    <div className="single-player-container">
      <Banner />
      <h2>Single Player</h2>
      <div className="input-group">
        <input
          type="text"
          value={player1.name}
          onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
          placeholder="Login"
          disabled={testInProgress}
        />
        <input
          type="text"
          value={player1.location}
          onChange={(e) => setPlayer1({ ...player1, location: e.target.value })}
          placeholder="Location"
          disabled={testInProgress}
        />
      </div>
      <button
        onClick={startTest}
        disabled={testInProgress || !player1.name || !player1.location}
      >
        Start Test
      </button>

      {/* Pass necessary props to the Leaderboard component */}
      <Leaderboard
        mode="single"
        player1={player1}
        testInProgress={testInProgress}
        onTestComplete={handleTestComplete}
      />
    </div>
  );
};

export default SinglePlayer;
