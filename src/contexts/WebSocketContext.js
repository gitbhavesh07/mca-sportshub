import io from 'socket.io-client';

export const socket=io(
    // 'https://grateful-clear-zebra.ngrok-free.app'
    'http://localhost:4000'
    ,{
    transports:['websocket']});

