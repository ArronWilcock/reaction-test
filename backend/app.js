const express = require("express");
require("./models/index");
const cors = require("cors"); // Import the cors package
const scoreRoutes = require('./routes/score');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
};

app.use(cors(corsOptions));
 // Use CORS middleware

// middleware that takes incoming requests with content type application/json and makes its body available on the reponse object
app.use(express.json());

// Middleware to create headers for CORS (cross origin resource sharing)
// access control for Origin, Headers & Methods declared for the response objects
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use('/api', scoreRoutes);

module.exports = app;
