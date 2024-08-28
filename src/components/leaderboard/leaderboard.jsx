import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './leaderboard.scss'; // Import the SCSS file

const socket = io('http://localhost:4000'); // Connect to the backend server

const Leaderboard = ({ mode, player1, player2, testInProgress, onTestComplete }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    // Listen for data from the backend server
    socket.on('arduino:data', (data) => {
      console.log('Data received from Arduino:', data);

      if (data.includes('Test complete')) {
        // Notify parent component that the test is complete
        onTestComplete();
        setWinner('');
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
  }, [mode, player1, player2, onTestComplete]);

  return (
    <div className="leaderboard-container">
      {mode === 'vs' && winner && (
        <div className="winner-announcement">
          <h3>{winner} Wins!</h3>
        </div>
      )}
      <h3 className="leaderboard-heading">Leaderboard</h3>
      <ul className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <li key={index} className="leaderboard-entry">
            <div className="player-info">
              {entry.name} ({entry.location})
            </div>
            <div className="entry-details">
              {entry.reactionTime} ms - {entry.timestamp}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
