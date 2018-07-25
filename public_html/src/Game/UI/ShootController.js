"use strict"

ShootController.eDirection = Object.freeze({
    eRight: new vec2.fromValues(1, 0),
    eLeft: new vec2.fromValues(-1, 0)
});

function ShootController(posX, posY, frontDir, texture) {
    TextureRenderable.call(this, texture);

    this.mVisible = true;
    this.mCurrentFrontDir = frontDir;

    this.setColor([1, 1, 1, 0]);
    this.getXform().setPosition(posX, posY);
    this.getXform().setSize(32, 4);
    if (this.mCurrentFrontDir[0] === ShootController.eDirection.eLeft[0])
        this.getXform().setRotationInRad(Math.PI);
    else if (this.mCurrentFrontDir[0] === ShootController.eDirection.eRight[0])
        this.getXform().setRotationInRad(0);
}
gEngine.Core.inheritPrototype(ShootController, TextureRenderable);

ShootController.prototype.setRotationInRad = function(rad) {
    this.getXform().setRotationInRad(rad);
}

ShootController.prototype.isVisible = function() { return this.mVisible; }

ShootController.prototype.update = function(frontDir) {
    var symmetryRad;
    if (this.mCurrentFrontDir[0] === 1 && frontDir[0] === -1) {
        this.mCurrentFrontDir = frontDir;
        symmetryRad =  Math.PI - this.getXform().getRotationInRad();
        this.getXform().setRotationInRad(symmetryRad);
    }
    else if (this.mCurrentFrontDir[0] === -1 && frontDir[0] === 1) {
        this.mCurrentFrontDir = frontDir;
        symmetryRad = Math.PI - this.getXform().getRotationInRad();
        this.getXform().setRotationInRad(symmetryRad);
    }
    this.keyControl();
}

ShootController.prototype.draw = function(aCamera) {
    if (this.isVisible()) {
        TextureRenderable.prototype.draw.call(this, aCamera);
    }
}

ShootController.prototype.keyControl = function () {
    var rotationInRad = this.getXform().getRotationInRad();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if (this.mCurrentFrontDir[0] === 1) {
            rotationInRad += Math.PI / 90;
            if (rotationInRad > Math.PI / 2)
                rotationInRad = Math.PI / 2;
        }
        else if (this.mCurrentFrontDir[0] === -1) {
            rotationInRad -= Math.PI / 90;
            if (rotationInRad < Math.PI / 2)
                rotationInRad = Math.PI / 2;
        }
        this.getXform().setRotationInRad(rotationInRad);
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (this.mCurrentFrontDir[0] === -1) {
            rotationInRad += Math.PI / 90;
            if (rotationInRad > Math.PI * 3 / 2)
                rotationInRad = Math.PI * 3 / 2;
        }
        else if (this.mCurrentFrontDir[0] === 1) {
            rotationInRad -= Math.PI / 90;
            if (rotationInRad < -Math.PI / 2)
                rotationInRad = -Math.PI / 2;
        }
        this.getXform().setRotationInRad(rotationInRad);
    }
}