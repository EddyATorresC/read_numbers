const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio.listen(server);

const WebSocket = require('ws');

const ws = new WebSocket.Server({ port: 9002 });

var clientes=[];

ws.on('connection', ws => {
		clientes.push(ws);
		console.log("usuario conectado");
  	ws.on('message', message => {
    	console.log('¿Es el numero un: '+message +' ?');
			for (var i = 0; i < clientes.length; i++) {
				clientes[i].send(message);
			}
  	})
  	ws.send('te has conectado a un websocket!')

});
//settings
app.set('port',process.env.PORT || 9001)
require('./sockets')(io);
//Campos estaticos
app.use(express.static(path.join(__dirname,'public')));

//Inicniando el servidor
server.listen(app.get('port'),() =>{
  console.log('server on port', app.get('port'));
});
