import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { roomHandler } from './room';
// import { v4 as uuidv4 } from 'uuid';
const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },

});
io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    roomHandler(socket);
});
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));