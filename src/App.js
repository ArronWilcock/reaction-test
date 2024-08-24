import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import custom styles if needed

const socket = io(); // Connect to the backend server automatically

const App = () => {
  // State to store leaderboard data
  const [leaderboard, setLeaderboard] = useState([]);

  // Effect to set up socket.io connection and event listeners
  useEffect(() => {
    // Listen for 'arduino:data' events from the server
    socket.on('arduino:data', (data) => {
      console.log('Data received from Arduino:', data);

      // Parse the received data and update the leaderboard
      const reactionTime = parseInt(data.trim(), 10);
      if (!isNaN(reactionTime)) {
        setLeaderboard((prevLeaderboard) => {
          // Create a new leaderboard entry
          const newEntry = { reactionTime, timestamp: new Date().toLocaleString() };

          // Add the new entry and sort the leaderboard by reaction time
          const updatedLeaderboard = [...prevLeaderboard, newEntry].sort(
            (a, b) => a.reactionTime - b.reactionTime
          );

          // Limit the leaderboard to top 10 entries
          return updatedLeaderboard.slice(0, 10);
        });
      }
    });

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      socket.off('arduino:data');
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Arduino Reaction Test Leaderboard</h1>
        <Leaderboard leaderboard={leaderboard} />
      </header>
    </div>
  );
};

// Component to display the leaderboard
const Leaderboard = ({ leaderboard }) => (
  <div className="Leaderboard">
    <h2>Top Reaction Times</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Reaction Time (ms)</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((entry, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{entry.reactionTime}</td>
            <td>{entry.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default App;
