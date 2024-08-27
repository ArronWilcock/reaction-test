// pages/SinglePlayer.js
import React from 'react';
import Banner from '../../components/banner/banner';
import Leaderboard from '../../components/leaderboard/leaderboard'; // Import the Leaderboard component

const SinglePlayer = () => {
  return (
    <div>
      <Banner />
      <h2>Single Player Mode</h2>
      {/* Pass 'single' mode to the Leaderboard component */}
      <Leaderboard mode="single" />
    </div>
  );
};

export default SinglePlayer;
