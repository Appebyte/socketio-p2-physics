// TODO: Abstract physics engine.

var p2 = require('p2');

function Player(id, position) {
	this.id = id;
    this.circleShape = new p2.Circle({
        radius: 1,
    });
    this.circleBody = new p2.Body({
        mass: 1,
        position: [position.x, position.y],
        angularVelocity: 1
    });
    this.circleBody.damping = .8;
    this.circleBody.addShape(this.circleShape);

    this.circleBody.allowSleep = true;
    this.circleBody.sleepSpeedLimit = 1;
    this.circleBody.sleepTimeLimit = 1;
}

Player.prototype.getClientDetails = function() {
	var self = this;

	return {
        id: self.id,
        position: self.circleBody.position,
        velocity: self.circleBody.velocity,
        angularVelocity: self.circleBody.angularVelocity
    };
};

module.exports = Player;