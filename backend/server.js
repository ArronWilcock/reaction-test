require('dotenv').config();  // Load environment variables from .env file

const http = require('http');
const { Server } = require('socket.io');
const { app, parser } = require('./App.js'); // Import app and parser

// Normalize port function to return a valid port
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

// Set port from environment or default to 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Error handler function for the server
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Create HTTP server using the Express app
const server = http.createServer(app);

// Integrate socket.io with the server
const io = new Server(server);

// Socket.io connection setup
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Handle incoming serial data with io.emit here
parser.on('data', (data) => {
  console.log('Data received from Arduino:', data);
  io.emit('arduino:data', data); // Emit data to all connected clients
});

// Event listeners for server
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Start listening on the specified port
server.listen(port);
