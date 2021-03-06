var Marble = require('./Marble.js');

var Player = function(id) {
	this.id = id;
	this.marbles = [];
};

// TODO: Create it when a list of marbles exist
Player.prototype.drawMarbles = function() {

};

Player.prototype.addMarble = function(id, position, material, world) {
	var marble = new Marble(id, position, material);
	world.addBody(marble.circleBody);
	this.marbles.push(marble);
};

Player.prototype.getClientDetails = function() {
	var clientDetails = {
		id: this.id,
		marbles: []
	};

	// Get marbles
	for(var i=0; i<this.marbles.length; i++) {
		clientDetails.marbles.push(this.marbles[i].getClientDetails());
	}

	return clientDetails;
};

module.exports = Player;