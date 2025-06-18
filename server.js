const bufferUtil = require('bufferutil');//maybe not needed, but maybe it speeds things up!
var osc = require('osc');
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
var socket;

const io = require("socket.io")(server, {cors:{origin: "*",methods: ["GET", "POST"]}});

//Listen to the TUIO data
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 3333,
  metadata: true
});

//Listen/send on port 3000 or 5000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

io.on('connection', function (_socket) {
  socket = _socket;
    socket.on('config', function (obj) {
      console.log('config', obj);
    });
});

// Listen for incoming OSC bundles.
udpPort.on("bundle", function (oscBundle){
  if(socket && oscBundle.packets.length > 2) socket.emit('message', oscBundle);//only send TUIO v1.1
});

// Open the socket.
udpPort.open();