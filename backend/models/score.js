const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Score = sequelize.define("Score", {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Score;
};