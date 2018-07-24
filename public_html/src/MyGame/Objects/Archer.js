"use strict";  // Operate in Strict mode such that variables must be declared before used!
var kWASDDelta = 0.3;

function Archer(spriteTexture) {
    this.kDelta = 0.3;

    this.mArcher = new SpriteAnimateRenderable(spriteTexture);
    this.mArcher.setColor([1, 1, 1, 0]);
    this.mArcher.getXform().setPosition(80, 40);
    this.mArcher.getXform().setSize(16, 20);
    this.mArcher.setElementPixelPositions(0, 240, 0, 360);
    this.mArcher.setSpriteSequence(128, 0, 80, 90, 5, 0);
    this.mArcher.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mArcher.setAnimationSpeed(10);
    GameObject.call(this, this.mArcher);

    this.mArrow = null;
    
    var r = new RigidRectangle(this.getXform(), 16, 20);
    this.setRigidBody(r);
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Archer, WASDObj);

Archer.prototype.update = function () {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        this.mArcher.updateAnimation();
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mArrow = new Renderable();
        this.mArrow.setColor([1, 0, 0, 0]);
        this.mArrow.getXform().setPosition(this.mArcher.getXform().getXPos() + 5, this.mArcher.getXform().getYPos() + 5);
        this.mArrow.getXform().setSize(5, 5);
        GameObject.call(this, this.mArrow);
    }

    if (this.mArrow != null)
        this.mArrow.update();

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