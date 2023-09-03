import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
const rooms: Record<string,string[]> = {};
interface IRoom{
    roomId: string;
    peerId: string;
}
export const roomHandler = (socket: Socket) => {
    const jointRoom = ({roomId,peerId}:IRoom) => {
        if(rooms[roomId]){
            console.log(' user joined this room',peerId, roomId);  
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.to(roomId).emit('user-joined', {peerId});
            socket.emit('get-users', {
                peerId,
                participants: rooms[roomId],
            });
        }
    } 
    const leaveRoom = () => ({peerId, roomId}:IRoom) => {
        console.log('user disconnected', peerId);
        rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
        socket.to(roomId).emit('user-disconnected', peerId);
    }
    const createRoom = () => {
        const roomId = uuidv4();
        rooms[roomId] = [];
        socket.emit('room-created', {roomId:roomId});
        console.log('create-room');
    }
    socket.on('disconnect',leaveRoom)
    socket.on('join-room',jointRoom);
    socket.on('create-room', createRoom);
}