// controllers/scoreController.js

const { Score } = require('../models'); // Import the Score model

// Function to add a new score to the database
const addScore = async (req, res) => {
  const { name, location, reactionTime } = req.body;

  try {
    // Create a new score entry
    const newScore = await Score.create({
      login: name,
      location,
      score: reactionTime,
    });

    // Send the new score entry as the response
    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).json({ error: 'Failed to add score' });
  }
};

// Function to get all scores from the database
const getAllScores = async (req, res) => {
  try {
    // Retrieve all scores, sorted by reaction time in ascending order
    const scores = await Score.findAll({
      attributes: ['login', 'location', 'score'], // Only select the necessary fields
      order: [['score', 'ASC']], // Order by reaction time (score) ascending
    });

    // Send the retrieved scores as the response
    res.status(200).json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
};

module.exports = { addScore, getAllScores };
