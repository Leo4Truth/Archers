/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict"

ShootController.eDirection = Object.freeze({
    eRight: new vec2.fromValues(1, 0),
    eLeft: new vec2.fromValues(-1, 0)
});

function ShootController(posX, posY, frontDir, texture) {
    SpriteRenderable.call(this, texture);

    this.mVisible = true;
    this.mCurrentFrontDir = frontDir;

    this.setColor([1, 1, 1, 0]);
    this.getXform().setPosition(posX, posY);
    this.getXform().setSize(24, 4);
    this.setElementPixelPositions(512, 2048, 0, 256);
    if (this.mCurrentFrontDir[0] === ShootController.eDirection.eLeft[0])
        this.getXform().setRotationInRad(Math.PI);
    else if (this.mCurrentFrontDir[0] === ShootController.eDirection.eRight[0])
        this.getXform().setRotationInRad(0);
}
gEngine.Core.inheritPrototype(ShootController, SpriteRenderable);

ShootController.prototype.setRotationInRad = function(rad) {
    this.getXform().setRotationInRad(rad);
};

ShootController.prototype.isVisible = function() { return this.mVisible; };

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
};

ShootController.prototype.draw = function(aCamera) {
    if (this.isVisible()) {
        SpriteRenderable.prototype.draw.call(this, aCamera);
    }
};

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

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        var size = [this.getXform().getSize()[0] - 1.2, this.getXform().getSize()[1] - 0.2];
        if (size[0] < 18) {
            size[0] = 18;
            size[1] = 3;
        }
        this.getXform().setSize(size[0], size[1]);
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        var size = [this.getXform().getSize()[0] + 1.2, this.getXform().getSize()[1] + 0.2];
        if (size[0] > 36) {
            size[0] = 36;
            size[1] = 6;
        }
        this.getXform().setSize(size[0], size[1]);
    }
    //console.log(this.getXform().getSize());
};

ShootController.prototype.getVelocity = function () {
    var speed = Math.pow(this.getXform().getSize()[0], 3) / 300;
    var rad = this.getXform().getRotationInRad();
    var velocity = new vec2.fromValues(speed * Math.cos(rad), speed * Math.sin(rad));
    return velocity;
};
