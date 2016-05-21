var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var io = require('socket.io').listen(server);
var p2 = require('p2');

server.listen(3000);

app.use('/node_modules/p2/build/p2.js', express.static(path.join(__dirname, '/node_modules/p2/build/p2.js')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var socketIdToPlayerId = {};

io.sockets.on('connect', function(socket) {
    io.sockets.connected[socket.id].emit('connected', true);

    socket.on('getPlayers', function() {
        var data = [];
        for(var i=0; i<players.length; i++) {
            data.push(players[i].getClientDetails());
        }
        socket.emit('getPlayers', data);
    });

    socket.on('addMainPlayer', function() {
        var id = players.length;
        var player = new Player(id, positions.pop());
        players.push(player);
        io.sockets.connected[socket.id].emit('addMainPlayer', player.getClientDetails());
        socket.broadcast.emit('addNewPlayer', player.getClientDetails());
    });

    socket.on('input', function(player) {
        if(players[player.id]) {
           // players[player.id].input = player.input;
        }
    });

     socket.on('impulse', function(data) {
        request= true;
                currentId = data.id;
                currentX = data.x;
                currentY = data.y;
        //players[data.id].circleBody.applyImpulse([data.x, data.y],  players[data.id].circleBody.position);
        if(io) {
            io.emit('impulseState', data);
        }
    });
});



var players = [];
var positions = [];
var world;

init();

function init() {
    for(var x=-10; x<10; x+=3 ) {
        for(var y=-8; y<8; y+=3) {
            positions.push(new Position(x,y));
        }
    }
    
    world = new p2.World({gravity:[0,0]});
    world.frictionGravity = 1;
    world.applyDamping = true;
}

function Player(id, position) {
    this.id = id;
    this.force = .05;
    this.circleShape = new p2.Circle({
        radius: 1
    });
    this.circleBody = new p2.Body({
        mass: 1,
        position: [position.x, position.y],
        angularVelocity: 1
    });
    this.circleBody.addShape(this.circleShape);

    this.input = {
        w: false,
        a: false,
        s: false,
        d: false
    };

    world.addBody(this.circleBody);

    this.updateState = function(dt) {
        this.circleBody.applyDamping(dt);
    };

    this.getClientDetails = function() {
        return {
            id: this.id,
            position: this.circleBody.position,
            velocity: this.circleBody.velocity
        };
    };
}

function Position(x, y) {
    this.x = x;
    this.y = y;
}

setInterval(function() {
    sendState();
},500);

function sendState() {
    var data = [];
    for(var i=0; i<players.length; i++) {
        data.push(players[i].getClientDetails());
    }
    if(io) {
        if(io) {
            io.emit('state', data);
        }
    }
}

var aCount = 0;
var fixedTimeStep = 1 / 60, maxSubSteps = 10, lastTimeMilliseconds;
setInterval(function() {

    for(var id=0; id<players.length; id++) {
        if (players[id]) {
            if (players[id].input.w) {
                players[id].circleBody.applyImpulse([0, players[id].force], players[id].circleBody.position);
            }
            if (players[id].input.s) {
                players[id].circleBody.applyImpulse([0, -players[id].force],  players[id].circleBody.position);
            }
            if (players[id].input.a) {
                aCount++;
                players[id].circleBody.applyImpulse([-players[id].force, 0],  players[id].circleBody.position);
                console.log(aCount);
            }
            if (players[id].input.d) {
                players[id].circleBody.applyImpulse([players[id].force, 0],  players[id].circleBody.position);
            }
        }
        players[id].updateState(.2);
    }

    var stepTime;
    var now = new Date().getTime();
        if(!lastTimeMilliseconds) {
            stepTime = 1000/60;
        } else {
             stepTime = now - lastTimeMilliseconds;
        }
    world.step(1/60,stepTime,1);
    lastTimeMilliseconds =  now;
},1000/60);

  var currentId;
    var currentX;
    var currentY;
    var request = false;

world.on("postStep", function(){
        if(request) {
            players[currentId].circleBody.applyForce([currentX, currentY],  players[currentId].circleBody.position);
            request = false;
        }
        
    });