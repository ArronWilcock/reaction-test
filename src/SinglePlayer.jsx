import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io("http://localhost:4000"); // Connect to the backend server

const SinglePlayer = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [testInProgress, setTestInProgress] = useState(false);

  useEffect(() => {
    socket.on('arduino:data', (data) => {
      console.log('Data received from Arduino:', data);

      if (data.includes('Test complete')) {
        // Reset test state and clear inputs
        setTestInProgress(false);
        setName('');
        setLocation('');
        return;
      }

      // Extract reaction time from the received data
      const match = data.match(/Player 1 reaction time: (\d+) ms/);
      if (match) {
        const reactionTime = parseInt(match[1], 10);
        if (!isNaN(reactionTime)) {
          setLeaderboard((prevLeaderboard) => {
            const newEntry = { name, location, reactionTime, timestamp: new Date().toLocaleString() };
            return [...prevLeaderboard, newEntry];
          });
        }
      }
    });

    return () => {
      socket.off('arduino:data');
    };
  }, [name, location]);

  const startTest = () => {
    setTestInProgress(true);
    socket.emit('start:test:single');
  };

  return (
    <div>
      <h2>Single Player Mode</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        disabled={testInProgress}
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your location"
        disabled={testInProgress}
      />
      <button onClick={startTest} disabled={testInProgress || !name || !location}>
        Start Test
      </button>

      <h3>Leaderboard</h3>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name} ({entry.location}) - {entry.reactionTime} ms - {entry.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SinglePlayer;
