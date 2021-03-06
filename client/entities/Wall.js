var Settings = require('../Settings.js');

var Wall = function(x, y, width, height, angle, mass, renderer, material) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.mass = mass;
    this.material = material;
    this.renderer = renderer;
    this.boxShape;
    this.boxBody;
    this.graphics;
    this.shadow;
    this.xPosServer;
    this.yPosServer;
    this.angleServer;
    this.settings = new Settings();

    this.initShape();
    this.initBody();
    this.createGraphics();
};

Wall.prototype.initShape = function() {
    this.boxShape = new p2.Box({width: this.width, height: this.height, material: this.material});
};

Wall.prototype.initBody = function() {
    this.boxBody = new p2.Body({
        mass: this.mass,
        position: [this.x, this.y],
        angularDamping:.8,
        angle: this.angle
    });
    this.boxBody.damping = .8;
    this.boxBody.allowSleep = true;
    this.boxBody.sleepSpeedLimit = 1;
    this.boxBody.sleepTimeLimit = 1;
    this.boxBody.addShape(this.boxShape);
};

Wall.prototype.createGraphics = function() {
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);
    this.graphics.rotation = this.boxBody.angle;
    this.renderer.container.addChild(this.graphics);

    if(this.settings.showServerPosition) {
        this.shadow = new PIXI.Graphics();
        this.shadow.beginFill(0xEEEEEE, 0.5);
        this.shadow.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);
        this.shadow.rotation = this.boxBody.angle;
        this.renderer.container.addChild(this.shadow);
    }
};

Wall.prototype.draw = function() {
    this.graphics.position.x = this.boxBody.position[0];
    this.graphics.position.y = this.boxBody.position[1];
    this.graphics.rotation = this.boxBody.angle;
};

Wall.prototype.drawShadow = function() {
    this.shadow.position.x = this.xPosServer;
    this.shadow.position.y = this.yPosServer;
    this.shadow.rotation = this.angleServer;
};

module.exports = Wall;