import '../config/Socket.js';
import io from 'socket.io-client/socket.io';

const socket = io('http://192.168.3.38:3000', {
  transports: ['websocket']
});

export default socket;