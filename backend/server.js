require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const app = require("./app");

// Normalize port into a number, string, or false
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Error handling for server
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Create HTTP server
const server = http.createServer(app);

// Setup CORS for socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Define Arduino serial port
const portName = "COM4"; // Replace with your Arduino's port name
const serialPort = new SerialPort({ path: portName, baudRate: 9600 });

// Setup parser for incoming data from Arduino
const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

// State variables to track mode and player data
let isVsMode = false;

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle the start test event for single-player mode
  socket.on("start:test:single", () => {
    console.log("Starting single-player test...");
    isVsMode = false; // Set mode to single player
    serialPort.write("START_SINGLE\n"); // Send a signal to Arduino to start the test in single-player mode
  });

  // Handle the start test event for vs mode
  socket.on("start:test:vs", () => {
    console.log("Starting vs mode test...");
    isVsMode = true; // Set mode to vs mode
    serialPort.write("START_VS\n"); // Send a signal to Arduino to start the test in vs mode
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Handle incoming data from Arduino
parser.on("data", (data) => {
  console.log("Data from Arduino:", data.trim());

  // Relay data to all connected clients
  io.emit("arduino:data", data.trim());

  // Check for "test complete" signal
  if (data.includes("Test complete")) {
    io.emit("test:complete"); // Emit an event to inform the frontend
  }

  // Handle vs mode results separately
  if (isVsMode && data.includes("vs mode results")) {
    console.log("VS Mode results received");
    // Parse results and determine winner
    const results = parseVsModeResults(data);
    io.emit("test:vs:results", results); // Emit an event to inform the frontend of VS mode results
  }
});

// Function to parse vs mode results
function parseVsModeResults(data) {
  // Example parsing logic; customize based on actual data format from Arduino
  const [player1Time, player2Time] = data
    .split("vs mode results:")[1]
    .trim()
    .split(",");
  const winner = player1Time < player2Time ? "Player 1" : "Player 2";

  return {
    player1Time: parseInt(player1Time, 10),
    player2Time: parseInt(player2Time, 10),
    winner,
  };
}

// Handle serial port errors
serialPort.on("error", (err) => {
  console.error("Error: ", err.message);
});

// Setup server error and listening handlers
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Start listening on the specified port
server.listen(port);
