// components/leaderboard/Leaderboard.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to the backend server

const Leaderboard = ({ mode }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [player1, setPlayer1] = useState({ name: '', location: '' });
  const [player2, setPlayer2] = useState({ name: '', location: '' });
  const [testInProgress, setTestInProgress] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    // Listen for data from the backend server
    socket.on('arduino:data', (data) => {
      console.log('Data received from Arduino:', data);

      if (data.includes('Test complete')) {
        // Reset test state and clear inputs
        setTestInProgress(false);
        setWinner('');
        setPlayer1({ name: '', location: '' });
        setPlayer2({ name: '', location: '' });
        return;
      }

      if (mode === 'single') {
        // Handle single-player mode data
        const match = data.match(/Player 1 reaction time: (\d+) ms/);
        if (match) {
          const reactionTime = parseInt(match[1], 10);
          if (!isNaN(reactionTime)) {
            setLeaderboard((prevLeaderboard) => {
              const newEntry = {
                name: player1.name,
                location: player1.location,
                reactionTime,
                timestamp: new Date().toLocaleString(),
              };
              return [...prevLeaderboard, newEntry];
            });
          }
        }
      } else if (mode === 'vs') {
        // Handle VS mode data
        const matchPlayer1 = data.match(/Player 1 wins! Reaction time: (\d+) ms/);
        const matchPlayer2 = data.match(/Player 2 wins! Reaction time: (\d+) ms/);

        if (matchPlayer1) {
          setWinner(player1.name);
          const reactionTime = parseInt(matchPlayer1[1], 10);
          if (!isNaN(reactionTime)) {
            setLeaderboard((prevLeaderboard) => {
              const newEntry = {
                name: player1.name,
                location: player1.location,
                reactionTime,
                timestamp: new Date().toLocaleString(),
              };
              return [...prevLeaderboard, newEntry];
            });
          }
        } else if (matchPlayer2) {
          setWinner(player2.name);
          const reactionTime = parseInt(matchPlayer2[1], 10);
          if (!isNaN(reactionTime)) {
            setLeaderboard((prevLeaderboard) => {
              const newEntry = {
                name: player2.name,
                location: player2.location,
                reactionTime,
                timestamp: new Date().toLocaleString(),
              };
              return [...prevLeaderboard, newEntry];
            });
          }
        }
      }
    });

    // Clean up the effect by removing the socket listener
    return () => {
      socket.off('arduino:data');
    };
  }, [mode, player1, player2]);

  const startTest = () => {
    setTestInProgress(true);
    if (mode === 'single') {
      socket.emit('start:test:single');
    } else if (mode === 'vs') {
      socket.emit('start:test:vs');
    }
  };

  return (
    <div>
      {mode === 'vs' && winner && (
        <div>
          <h3>{winner} Wins!</h3>
        </div>
      )}
      <h3>Leaderboard</h3>
      <input
        type="text"
        value={player1.name}
        onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
        placeholder={mode === 'single' ? "Enter your name" : "Enter Player 1's name"}
        disabled={testInProgress}
      />
      <input
        type="text"
        value={player1.location}
        onChange={(e) => setPlayer1({ ...player1, location: e.target.value })}
        placeholder={mode === 'single' ? "Enter your location" : "Enter Player 1's location"}
        disabled={testInProgress}
      />
      {mode === 'vs' && (
        <>
          <input
            type="text"
            value={player2.name}
            onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
            placeholder="Enter Player 2's name"
            disabled={testInProgress}
          />
          <input
            type="text"
            value={player2.location}
            onChange={(e) => setPlayer2({ ...player2, location: e.target.value })}
            placeholder="Enter Player 2's location"
            disabled={testInProgress}
          />
        </>
      )}
      <button
        onClick={startTest}
        disabled={
          testInProgress ||
          !player1.name ||
          !player1.location ||
          (mode === 'vs' && (!player2.name || !player2.location))
        }
      >
        Start {mode === 'single' ? 'Test' : 'VS Mode Test'}
      </button>
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

export default Leaderboard;

