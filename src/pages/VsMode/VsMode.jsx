import React, { useState } from "react";
import Banner from "../../components/banner/banner";
import Leaderboard from "../../components/leaderboard/leaderboard"; // Import the Leaderboard component
import io from "socket.io-client";
import "./VsMode.scss"; // Import the SCSS file

const socket = io("http://localhost:4000"); // Connect to the backend server

const VsMode = () => {
  const [player1, setPlayer1] = useState({ name: "", location: "" });
  const [player2, setPlayer2] = useState({ name: "", location: "" });
  const [testInProgress, setTestInProgress] = useState(false);

  const startTest = () => {
    setTestInProgress(true);
    socket.emit("start:test:vs");
  };

  const handleTestComplete = () => {
    setTestInProgress(false);
    setPlayer1({ name: "", location: "" });
    setPlayer2({ name: "", location: "" });
  };

  return (
    <div className="vs-mode-container">
      <Banner />
      <h2>VS Mode</h2>
      <div className="input-group">
        <div className="input-player">
          <h3>Player 1</h3>
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
            onChange={(e) =>
              setPlayer1({ ...player1, location: e.target.value })
            }
            placeholder="Location"
            disabled={testInProgress}
          />
        </div>
        <div className="input-player">
          <h3>Player 2</h3>
          <input
            type="text"
            value={player2.name}
            onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
            placeholder="Login"
            disabled={testInProgress}
          />
          <input
            type="text"
            value={player2.location}
            onChange={(e) =>
              setPlayer2({ ...player2, location: e.target.value })
            }
            placeholder="Location"
            disabled={testInProgress}
          />
        </div>
      </div>
      <button
        onClick={startTest}
        disabled={
          testInProgress ||
          !player1.name ||
          !player1.location ||
          !player2.name ||
          !player2.location
        }
      >
        Start Test
      </button>

      {/* Pass necessary props to the Leaderboard component */}
      <Leaderboard
        mode="vs"
        player1={player1}
        player2={player2}
        testInProgress={testInProgress}
        onTestComplete={handleTestComplete}
      />
    </div>
  );
};

export default VsMode;
