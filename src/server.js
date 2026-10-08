require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDatabase = require("./config/database");
const { setupSocket } = require("./services/socketService");


// =================================
// CONFIGURATION
// =================================

const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5000";


// =================================
// HTTP SERVER
// =================================

const server = http.createServer(app);


// =================================
// SOCKET.IO SERVER
// =================================

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


// =================================
// SOCKET SERVICE
// =================================

setupSocket(io);


// =================================
// START SERVER
// =================================

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(PORT, () => {
      console.log(
        `Live Ops Helpdesk server running on port ${PORT}`
      );

      console.log(
        `Socket.io server ready`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};


startServer();