import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import custom styles if needed

const socket = io("http://localhost:4000"); // Connect to the backend server

const App = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isTestStarted, setIsTestStarted] = useState(false);

  useEffect(() => {
    socket.on('arduino:data', (data) => {
      console.log('Data received from Arduino:', data);

      // Extract reaction time from the received data
      const match = data.match(/Your reaction time: (\d+) ms/);
      if (match) {
        const reactionTime = parseInt(match[1], 10);
        if (!isNaN(reactionTime)) {
          setLeaderboard((prevLeaderboard) => {
            const newEntry = { name, location, reactionTime, timestamp: new Date().toLocaleString() };
            const updatedLeaderboard = [...prevLeaderboard, newEntry].sort(
              (a, b) => a.reactionTime - b.reactionTime
            );

            return updatedLeaderboard.slice(0, 10); // Limit to top 10 entries
          });
        }
      }
    });

    return () => {
      socket.off('arduino:data');
    };
  }, [name, location]);

  const startTest = () => {
    if (name && location) {
      socket.emit('start:test');
      setIsTestStarted(true);
    } else {
      alert('Please enter your name and location.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Arduino Reaction Test Leaderboard</h1>
        {!isTestStarted ? (
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button onClick={startTest}>Start Test</button>
          </div>
        ) : (
          <p>Test in progress...</p>
        )}
        <Leaderboard leaderboard={leaderboard} />
      </header>
    </div>
  );
};

const Leaderboard = ({ leaderboard }) => (
  <div className="Leaderboard">
    <h2>Top Reaction Times</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Location</th>
          <th>Reaction Time (ms)</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((entry, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{entry.name}</td>
            <td>{entry.location}</td>
            <td>{entry.reactionTime}</td>
            <td>{entry.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default App;
