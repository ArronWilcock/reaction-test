// leaderboard.jsx

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './leaderboard.scss'; // Import the SCSS file

const socket = io('http://localhost:4000'); // Connect to the backend server

const Leaderboard = ({ mode, player1, player2, testInProgress, onTestComplete }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [winner, setWinner] = useState('');

  // Function to add score to the database
  const addScoreToDatabase = async (name, location, reactionTime) => {
    try {
      const response = await fetch('http://localhost:4000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          location,
          reactionTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add score');
      }

      const newScore = await response.json();
      console.log('Score added:', newScore);
    } catch (error) {
      console.error('Error adding score to the database:', error);
    }
  };

  // Fetch all scores from the backend
  const fetchScores = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/scores');
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const scores = await response.json();
      setLeaderboard(scores);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    fetchScores(); // Fetch scores on component mount

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
            addScoreToDatabase(player1.name, player1.location, reactionTime);
            fetchScores(); // Re-fetch scores to update the leaderboard
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
            addScoreToDatabase(player1.name, player1.location, reactionTime);
            fetchScores(); // Re-fetch scores to update the leaderboard
          }
        } else if (matchPlayer2) {
          setWinner(player2.name);
          const reactionTime = parseInt(matchPlayer2[1], 10);
          if (!isNaN(reactionTime)) {
            addScoreToDatabase(player2.name, player2.location, reactionTime);
            fetchScores(); // Re-fetch scores to update the leaderboard
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
              {entry.login} ({entry.location})
            </div>
            <div className="entry-details">
              {entry.score} ms
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
