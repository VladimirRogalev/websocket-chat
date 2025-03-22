import express, {Application} from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import {createServer} from 'node:http';


const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app: Application = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: CORS_ORIGIN, methods: ['GET', 'POST']
    }
});

interface MessageData {
    room: string;
    author: string;
    message: string;
    time: string;
}
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with id: ${socket.id} joined room: ${data}`);
    });
    socket.on('send_message', (data: MessageData) => {
        socket.to(data.room).emit('receive_message', data);
        console.log(`Message sent to room ${data.room}:`, data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});