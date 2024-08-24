// Import required modules
const express = require("express");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("path");

// Initialize Express app
const app = express();

// Serve static files if needed (e.g., if you build your React app)
app.use(express.static(path.join(__dirname, "public")));

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

// Set up serial port communication
const port = new SerialPort({ path: "COM4", baudRate: 9600 }, (err) => {
    if (err) {
      return console.log('Error opening port: ', err.message);
    }
  });
  
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Handle incoming serial data
parser.on("data", (data) => {
  console.log("Data received from Arduino:", data);
  // Removed 'io.emit' since 'io' is not defined in this context
  // This line will be handled in 'server.js'
});

module.exports = { app, parser }; // Export app and parser for use in server.js
