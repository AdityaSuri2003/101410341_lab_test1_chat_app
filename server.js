require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); 
    });


console.log("\n Loaded Routes:");
app._router.stack.forEach((r) => {
    if (r.route) console.log(`- ${r.route.path}`);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Default Route (Login Page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// WebSocket Configuration
io.on('connection', (socket) => {
    console.log(' User connected:', socket.id);

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        console.log(` ${username} joined room: ${room}`);
        socket.to(room).emit('message', { from_user: 'System', message: `${username} has joined the room` });
    });

    socket.on('chatMessage', ({ from_user, room, message }) => {
        console.log(` Message from ${from_user} in ${room}: ${message}`);
        io.to(room).emit('message', { from_user, message });
    });

    socket.on('disconnect', () => {
        console.log(' User disconnected:', socket.id);
    });
});


app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(" Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
