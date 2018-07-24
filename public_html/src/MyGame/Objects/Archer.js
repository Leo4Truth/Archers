"use strict";  // Operate in Strict mode such that variables must be declared before used!
var kWASDDelta = 0.3;

function Archer(spriteTexture) {
    this.kDelta = 0.3;

    this.mArcher = new SpriteAnimateRenderable(spriteTexture);
    this.mArcher.setColor([1, 1, 1, 0]);
    this.mArcher.getXform().setPosition(20, 60);
    this.mArcher.getXform().setSize(2, 8);
    this.mArcher.getXform().setRotationInRad(-Math.PI / 4);
    this.mArcher.setElementPixelPositions(0, 240, 0, 360);
    this.mArcher.setSpriteSequence(128, 0, 80, 90, 5, 0);
    this.mArcher.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mArcher.setAnimationSpeed(10);
    GameObject.call(this, this.mArcher);

    this.mArrow = null;

    var r = new RigidCircle(this.getXform(), 2, 8);
    this.setRigidBody(r);
    this.getRigidBody().setVelocity(5, 5);
    //this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Archer, WASDObj);

Archer.prototype.update = function () {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        this.mArcher.updateAnimation();
    }


    var vec = this.getRigidBody().getVelocity();
    var speed = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    var rad = -Math.acos(vec[1] / speed);
    console.log("vec: " + vec);
    console.log("speed: " + speed);
    console.log("rad: " + rad);
    //this.getRigidBody().setRotationInRad(rad)
    this.mArcher.getXform().setRotationInRad(rad);

    GameObject.prototype.update.call(this);

};

Archer.prototype.keyControl = function () {
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        xform.incYPosBy(kWASDDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        xform.incYPosBy(-kWASDDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPosBy(-kWASDDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPosBy(kWASDDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        xform.incRotationByDegree(1);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        xform.incRotationByDegree(-1);
    }

    this.getRigidBody().userSetsState();
};