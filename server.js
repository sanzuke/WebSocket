require('setimmediate');
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var jf = require('jsonfile'); //jsonfile module
var fs = require('fs'); //require file system

var app = express().use(express.static('public'));
var server = http.createServer(app);
//server.listen(8080, '127.0.0.1');
server.listen(8080, function(){
	console.log('SERVER ONLINE in PORT : 8080');
});

var wss = new WSS({ port: 8081 });
wss.on('connection', function(socket) {
  console.log('Opened Connection 🎉');

  // var json = JSON.stringify({ message: 'Gotcha' });
  // socket.send(json);
  console.log('User Connected...');

  jf.readFile('sport.json', function(err, data) { //if change detected read the sports.json 
 //  jf.readFile('http://localhost/socketio_ws/', function(err, data) { //if change detected read the sports.json 
	 	var json = JSON.stringify({type:'message', data : data.results});
	 	socket.send(json);
	 });

  
  //fs.watch("sport.json", function(event, fileName) { //watching my        sports.json file for any changes
		//NOTE: fs.watch returns event twice on detecting change due to reason that editors fire 2 events --- there are workarounds for this on stackoverflow

		//jf.readFile('http://localhost:3000/v1/laporan/terkirim/?format=json', function(err, data) { //if change detected read the sports.json 
		jf.readFile('sport.json', function(err, data) { //if change detected read the sports.json 

		    // var data = data; //store in a var
		    // console.log('sent') //just for debugging
		    // socket.volatile.emit('notification', data); //emit to all clients

		    var json = JSON.stringify({type:'message', data : data.results});
		    //console.log(data);

		    //wss.clients.forEach(function each(client) {
			    socket.send(json);
			    console.log('Sent: data');
			//  });
		});

	//});

  socket.on('message', function(message) {
    console.log('Received: ' + message);

    wss.clients.forEach(function each(client) {
      var json = JSON.stringify({ message: 'Something changed' });
      //client.send(json);
      console.log('Sent: ' + json);
    });
  });

  socket.on('close', function() {
    console.log('Closed Connection 😱');
  });

});

var broadcast = function(client) {
  var json = JSON.stringify({
    message: 'Hello hello!!!!'
  });

  fs.watch("sport.json", function(event, fileName) { //watching my        sports.json file for any changes
		//NOTE: fs.watch returns event twice on detecting change due to reason that editors fire 2 events --- there are workarounds for this on stackoverflow

		//jf.readFile('http://localhost:3000/v1/laporan/terkirim/?format=json', function(err, data) { //if change detected read the sports.json 
		jf.readFile('sport.json', function(err, data) { //if change detected read the sports.json 

		    // var data = data; //store in a var
		    // console.log('sent') //just for debugging
		    // socket.volatile.emit('notification', data); //emit to all clients

		    var json = JSON.stringify({type:'message', data : data.results});
		    //console.log(data);

		    //wss.clients.forEach(function each(client) {
			    client.send(json);
			    console.log('Sent: data');
			//  });
		});

	});

  // wss.clients.forEach(function each(client) {
  //   client.send(json);
  //   console.log('Sent: ' + json);
  // });
}
//setInterval(broadcast, 5000);
