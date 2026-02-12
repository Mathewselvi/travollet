const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173",
  "https://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});


app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// Add headers for Google Login popup
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.json());


// Database Connection Logic for Serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing DB connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Let the request fail if DB fails
  }
};

// Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);


  socket.on('join_chat', (userId) => {
    const roomName = String(userId);
    socket.join(roomName);
    console.log(`[SOCKET] User ${socket.id} joined room "${roomName}"`);
    io.to(roomName).emit('room_joined', roomName);
  });


  socket.on('send_message', async (data) => {

    try {
      const targetRoom = String(data.conversationId);

      const newMessage = new Message({
        conversationId: data.conversationId,
        sender: data.senderId,
        content: data.content,
        isAdmin: data.isAdmin,
        isRead: false
      });
      await newMessage.save();



      io.to(targetRoom).emit('receive_message', newMessage);


      io.emit('conversation_updated', {
        userId: data.senderId === 'admin' ? data.conversationId : data.senderId,
        lastMessage: newMessage
      });

      console.log(`MSG EMITTED to ${targetRoom}`);
    } catch (err) {
      console.error('MSG ERROR:', err);
    }
  });


  socket.on('typing', (data) => {

    socket.to(data.room).emit('display_typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('hide_typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});



app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/tour-packages', require('./routes/tourPackages'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/content', require('./routes/siteContent'));


app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.json({ message: 'Travollet API is running!' });
});

// Only listen if running directly (local dev), not when imported by Vercel
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export a handler that bridges Vercel's req/res to the Node HTTP server
// This allows Socket.IO (attached to server) to handle requests before Express
module.exports = async (req, res) => {
  // Ensure DB is connected for every request (including Socket.IO polling)
  await connectDB();
  server.emit('request', req, res);
};