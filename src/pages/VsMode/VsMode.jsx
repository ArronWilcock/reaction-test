// pages/VsMode.js
import React from 'react';
import Banner from '../../components/banner/banner';
import Leaderboard from '../../components/leaderboard/leaderboard'; // Import the Leaderboard component

const VsMode = () => {
  return (
    <div>
      <Banner />
      <h2>VS Mode</h2>
      {/* Pass 'vs' mode to the Leaderboard component */}
      <Leaderboard mode="vs" />
    </div>
  );
};

export default VsMode;
