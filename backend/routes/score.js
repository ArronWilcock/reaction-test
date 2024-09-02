// routes/scoreRoutes.js

const express = require('express');
const router = express.Router();
const { addScore, getAllScores } = require('../controllers/score');

// Route to add a new score
router.post('/scores', addScore);

// Route to get all scores
router.get('/scores', getAllScores);

module.exports = router;
