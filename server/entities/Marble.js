// TODO: Load physics engine through an interface

var p2 = require('p2');

function Marble(id, position, material) {
    this.id = id;
    this.circleShape = new p2.Circle({
        radius: 1,
        material: material
    });
    this.circleBody = new p2.Body({
        mass: 1,
        position: [position.x, position.y],
        angularDamping: 1,
    });
    this.circleBody.damping = .7;
    this.circleBody.addShape(this.circleShape);

    this.circleBody.allowSleep = true;
    this.circleBody.sleepSpeedLimit = 1;
    this.circleBody.sleepTimeLimit = 1;
}

Marble.prototype.getClientDetails = function() {
    var self = this;

    return {
        id: self.id,
        position: self.circleBody.position,
        velocity: self.circleBody.velocity,
        angularVelocity: self.circleBody.angularVelocity
    };
};

module.exports = Marble;
