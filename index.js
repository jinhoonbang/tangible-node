import dgram from 'dgram';
import express from 'express';
import path from 'path';
import _http from 'http';
import socketio from 'socket.io';
// import five from 'johnny-five';

const SOCKET_PORT = 8888;
const SERVER_PORT = process.env.PORT | 8080;
// const HOST = '127.0.0.1';

let app = express();
let http = _http.Server(app);
let io = socketio(http);

// let b = new five.Board();

// b.on('ready', () => {
//   console.log("board connected")
// });

// b.on('string',function(string){
//   console.log('receiving string:' + string);
// });

app.locals.message = "";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', socket => {
  console.log('connected')
  // socket.on('chat message', (msg) => {
  //   io.emit('chat message', msg)
  // })
});

let socket = dgram.createSocket('udp4');

socket.on('listening', () => {
  let address = socket.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

socket.on('message', (message, remote) => {
  console.log(remote.address + ':' + remote.port +' - ' + message);
  io.emit('chat message', { "message" : message.toString() })
});

socket.bind(SOCKET_PORT);

http.listen(SERVER_PORT, () => {
  console.log('Listening on port' + SERVER_PORT);
});