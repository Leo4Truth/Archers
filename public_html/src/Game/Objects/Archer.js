/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

Archer.eArcherState = Object.freeze({
    eStandLeft: 0,
    eStandRight: 1,
    eWalkLeft: 2,
    eWalkRight: 3,
    eShootLeft: 4,
    eShootRight: 5
});

function Archer(atX, atY, atW, atH, textures) {
    this.eCurrentState = Archer.eArcherState.eStandLeft;

    // Animation Members
    this.mStandLeft = new SpriteRenderable(textures.file_stand_left);
    this.mStandLeft.setColor([1, 1, 1, 0]);
    this.mStandLeft.getXform().setPosition(atX, atY);
    this.mStandLeft.getXform().setSize(atW, atH);
    this.mStandLeft.setElementPixelPositions(0, 80, 48, 128);

    this.mWalkLeft = new SpriteAnimateRenderable(textures.file_walk_left);
    this.mWalkLeft.setColor([1, 1, 1, 0]);
    this.mWalkLeft.getXform().setPosition(atX, atY);
    this.mWalkLeft.getXform().setSize(atW, atH);
    this.mWalkLeft.setSpriteSequence(128, 0, 80, 80, 7, 0);
    this.mWalkLeft.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mWalkLeft.setAnimationSpeed(10);

    this.mShootLeft = new SpriteAnimateRenderable(textures.file_shoot_left);
    this.mShootLeft.setColor([1, 1, 1, 0]);
    this.mShootLeft.getXform().setPosition(atX, atY);
    this.mShootLeft.getXform().setSize(atW, atH);
    this.mShootLeft.setSpriteSequence(128, 0, 80, 80, 5, 0);
    this.mShootLeft.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mShootLeft.setAnimationSpeed(30);

    // Animation Members
    this.mStandRight = new SpriteRenderable(textures.file_stand_right);
    this.mStandRight.setColor([1, 1, 1, 0]);
    this.mStandRight.getXform().setPosition(atX, atY);
    this.mStandRight.getXform().setSize(atW, atH);
    this.mStandRight.setElementPixelPositions(48, 128, 48, 128);

    this.mWalkRight = new SpriteAnimateRenderable(textures.file_walk_right);
    this.mWalkRight.setColor([1, 1, 1, 0]);
    this.mWalkRight.getXform().setPosition(atX, atY);
    this.mWalkRight.getXform().setSize(atW, atH);
    this.mWalkRight.setSpriteSequence(128, 464, 80, 80, 7, 0);
    this.mWalkRight.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    this.mWalkRight.setAnimationSpeed(10);

    this.mShootRight = new SpriteAnimateRenderable(textures.file_shoot_right);
    this.mShootRight.setColor([1, 1, 1, 0]);
    this.mShootRight.getXform().setPosition(atX, atY);
    this.mShootRight.getXform().setSize(atW, atH);
    this.mShootRight.setSpriteSequence(128, 112, 80, 80, 5, 0);
    this.mShootRight.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    this.mShootRight.setAnimationSpeed(30);

    GameObject.call(this, this.mStandLeft);

    //Physics
    var r;
    r = new RigidRectangle(this.getXform(), atW - 4, atH - 4);
    this.setRigidBody(r);

    this.toggleDrawRigidShape();
}

gEngine.Core.inheritPrototype(Archer, GameObject);

Archer.prototype.update = function (aCamera) {
    this.keyControl();

    var xform = this.getRenderable().getXform();
    this.mStandLeft.setXform(xform);
    this.mStandRight.setXform(xform);
    this.mWalkLeft.setXform(xform);
    this.mWalkRight.setXform(xform);
    this.mShootLeft.setXform(xform);
    this.mShootRight.setXform(xform);

    this.mStandLeft.getXform().setRotationInRad(0);
    this.mStandRight.getXform().setRotationInRad(0);
    this.mWalkLeft.getXform().setRotationInRad(0);
    this.mWalkRight.getXform().setRotationInRad(0);
    this.mShootLeft.getXform().setRotationInRad(0);
    this.mShootRight.getXform().setRotationInRad(0);

    this.mWalkLeft.updateAnimation();
    this.mShootLeft.updateAnimation();
    this.mWalkRight.updateAnimation();
    this.mShootRight.updateAnimation();

    GameObject.prototype.update.call(this);
};

Archer.prototype.draw = function (aCamera) {
    if (this.eCurrentState === Archer.eArcherState.eStandLeft)
        this.setRenderable(this.mStandLeft);
    else if (this.eCurrentState === Archer.eArcherState.eStandRight)
        this.setRenderable(this.mStandRight);
    else if (this.eCurrentState === Archer.eArcherState.eWalkLeft)
        this.setRenderable(this.mWalkLeft);
    else if (this.eCurrentState === Archer.eArcherState.eWalkRight)
        this.setRenderable(this.mWalkRight);
    else if (this.eCurrentState === Archer.eArcherState.eShootLeft)
        this.setRenderable(this.mShootLeft);
    else if (this.eCurrentState === Archer.eArcherState.eShootRight)
        this.setRenderable(this.mShootRight);

    GameObject.prototype.draw.call(this, aCamera);
};

var kWASDDelta = 0.3;
Archer.prototype.keyControl = function () {
    // Finite State Machine
    switch (this.eCurrentState) {
        case Archer.eArcherState.eShootLeft: {
            if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
                this.eCurrentState = Archer.eArcherState.eStandLeft;
            }
            break;
        }
        case Archer.eArcherState.eShootRight: {
            if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
                this.eCurrentState = Archer.eArcherState.eStandRight;
            }
            break;
        }
        case Archer.eArcherState.eStandLeft: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
                this.eCurrentState = Archer.eArcherState.eShootLeft;
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
                this.eCurrentState = Archer.eArcherState.eWalkLeft;
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
                this.eCurrentState = Archer.eArcherState.eWalkRight;
            }
            break;
        }
        case Archer.eArcherState.eStandRight: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
                this.eCurrentState = Archer.eArcherState.eShootRight;
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
                this.eCurrentState = Archer.eArcherState.eWalkRight;
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
                this.eCurrentState = Archer.eArcherState.eWalkLeft;
            }

            break;
        }
        case Archer.eArcherState.eWalkLeft: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
                this.eCurrentState = Archer.eArcherState.eShootLeft;
            }
            else if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
                this.eCurrentState = Archer.eArcherState.eStandLeft;
            }
            break;
        }
        case Archer.eArcherState.eWalkRight: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
                this.eCurrentState = Archer.eArcherState.eShootRight;
            }
            else if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
                this.eCurrentState = Archer.eArcherState.eStandRight;
            }
            break;
        }
    }
    console.log(this.eCurrentState);

    // move
    var xform = this.getXform();
    switch (this.eCurrentState) {
        case Archer.eArcherState.eWalkLeft: {
            xform.incXPosBy(-kWASDDelta);
            break;
        }
        case Archer.eArcherState.eWalkRight: {
            xform.incXPosBy(kWASDDelta);
            break;
        }
    }

    this.getRigidBody().userSetsState();
};