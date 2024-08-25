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
    credentials: true
  }
});

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle the start test event from the frontend
  socket.on("start:test", () => {
    console.log("Starting test...");
    serialPort.write("START\n"); // Send a signal to Arduino to start the test
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Define Arduino serial port
const portName = "COM4"; // Replace with your Arduino's port name
const serialPort = new SerialPort({ path: portName, baudRate: 9600 });

// Setup parser for incoming data from Arduino
const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

// Handle incoming data from Arduino
parser.on("data", (data) => {
  console.log("Data from Arduino:", data.trim());
  
  // Relay data to all connected clients
  io.emit("arduino:data", data.trim());
  
  // Check for "test complete" signal
  if (data.includes("Test complete")) {
    console.log("Test complete signal received");
    io.emit("test:complete"); // Emit an event to inform the frontend
  }
});

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
