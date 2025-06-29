const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://codescreen.site",
      "https://www.codescreen.site",
      process.env.CLIENT_URL, // Allow environment variable for client URL
    ].filter(Boolean), // Remove any undefined values
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://codescreen.site",
      "https://www.codescreen.site",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());

// Store user connections and room data
const userSocketMap = {};
const roomData = {};

// Get all connected clients in a room
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

// Socket connection handling
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join room
  socket.on("join-room", ({ roomId, username }) => {
    console.log(`User ${username} joining room ${roomId}`);

    // Remove user from any existing rooms first
    const existingRooms = [...socket.rooms];
    existingRooms.forEach((existingRoomId) => {
      if (existingRoomId !== socket.id && existingRoomId !== roomId) {
        socket.leave(existingRoomId);
        console.log(`User ${username} left room ${existingRoomId}`);
      }
    });

    userSocketMap[socket.id] = username;
    socket.join(roomId);

    // Initialize room data if it doesn't exist
    if (!roomData[roomId]) {
      roomData[roomId] = {
        code: "",
        language: "javascript",
        questionId: "two-sum",
        clients: [],
      };
    }

    const clients = getAllConnectedClients(roomId);
    roomData[roomId].clients = clients;

    // Notify all clients in the room about the new user
    socket.to(roomId).emit("user-joined", {
      clients,
      username,
      socketId: socket.id,
      roomData: roomData[roomId],
    });

    // Send room data to the joining user
    socket.emit("user-joined", {
      clients,
      username,
      socketId: socket.id,
      roomData: roomData[roomId],
    });

    console.log(
      `Room ${roomId} clients:`,
      clients.map((c) => c.username)
    );
  });

  // Handle code changes
  socket.on("code-change", ({ roomId, code }) => {
    if (roomData[roomId]) {
      roomData[roomId].code = code;
      socket.to(roomId).emit("code-updated", { code });
    }
  });

  // Handle language changes
  socket.on("language-change", ({ roomId, language }) => {
    if (roomData[roomId]) {
      roomData[roomId].language = language;
      socket.to(roomId).emit("language-updated", { language });
    }
  });

  // Handle question changes
  socket.on("question-change", ({ roomId, questionId }) => {
    if (roomData[roomId]) {
      roomData[roomId].questionId = questionId;
      socket.to(roomId).emit("question-updated", { questionId });
    }
  });

  // Handle disconnection
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit("user-left", {
          socketId: socket.id,
          username: userSocketMap[socket.id],
        });

        // Update room data
        if (roomData[roomId]) {
          const clients = getAllConnectedClients(roomId);
          roomData[roomId].clients = clients;
        }
      }
    });
    delete userSocketMap[socket.id];
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    delete userSocketMap[socket.id];
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", connections: Object.keys(userSocketMap).length });
});

// Get room data endpoint
app.get("/room/:roomId", (req, res) => {
  const { roomId } = req.params;
  res.json(roomData[roomId] || { error: "Room not found" });
});

const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "https://codescreen.site";

server.listen(PORT, () => {
  console.log(`Collaborative server running on port ${PORT}`);
  console.log(`Allowed origins: ${io.engine.opts.cors.origin.join(", ")}`);
  console.log(`Client URL: ${CLIENT_URL}`);
});
