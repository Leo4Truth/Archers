/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

Archer.eAssets = Object.freeze({
    eStandLeftTexture: "assets/archerNew/stand_left.png",
    eStandRightTexture: "assets/archerNew/stand_right.png",
    eWalkLeftTexture: "assets/archerNew/walk_left.png",
    eWalkRightTexture: "assets/archerNew/walk_right.png",
    eShootLeftTexture: "assets/archerNew/shoot_left.png",
    eShootRightTexture: "assets/archerNew/shoot_right.png"
});

Archer.eArcherState = Object.freeze({
    eStandLeft: 0,
    eStandRight: 1,
    eWalkLeft: 2,
    eWalkRight: 3,
    eShootLeft: 4,
    eShootRight: 5
});

Archer.eDirection = Object.freeze({
    eLeft: new vec2.fromValues(-1, 0),
    eRight: new vec2.fromValues(1, 0),
});

function Archer(
    atX, atY, atW, atH,
    aAllObjs, aObstacle, aDestroyable,
    player
) {
    this.mPlayer = player;
    this.mHp = 10;

    // for jump and double jump
    this.mJumpRemain = 2;
    this.mTimeCount = 0;
    this.mCoolDownCount = 0;
    this.mJumpCoolDown = new Array(2);

    this.mAllObjs = aAllObjs;
    this.mObstacle = aObstacle;
    this.mDestroyable = aDestroyable;

    // Animation Members
    this.mStandLeft = new SpriteRenderable(Archer.eAssets.eStandLeftTexture);
    this.mStandLeft.setColor([1, 1, 1, 0]);
    this.mStandLeft.getXform().setPosition(atX, atY);
    this.mStandLeft.getXform().setSize(atW, atH);
    this.mStandLeft.setElementPixelPositions(0, 80, 48, 128);

    this.mWalkLeft = new SpriteAnimateRenderable(Archer.eAssets.eWalkLeftTexture);
    this.mWalkLeft.setColor([1, 1, 1, 0]);
    this.mWalkLeft.getXform().setPosition(atX, atY);
    this.mWalkLeft.getXform().setSize(atW, atH);
    this.mWalkLeft.setSpriteSequence(128, 0, 80, 80, 7, 0);
    this.mWalkLeft.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mWalkLeft.setAnimationSpeed(10);

    this.mShootLeft = new SpriteAnimateRenderable(Archer.eAssets.eShootLeftTexture);
    this.mShootLeft.setColor([1, 1, 1, 0]);
    this.mShootLeft.getXform().setPosition(atX, atY);
    this.mShootLeft.getXform().setSize(atW, atH);
    this.mShootLeft.setSpriteSequence(128, 0, 80, 80, 5, 0);
    this.mShootLeft.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mShootLeft.setAnimationSpeed(30);

    // Animation Members
    this.mStandRight = new SpriteRenderable(Archer.eAssets.eStandRightTexture);
    this.mStandRight.setColor([1, 1, 1, 0]);
    this.mStandRight.getXform().setPosition(atX, atY);
    this.mStandRight.getXform().setSize(atW, atH);
    this.mStandRight.setElementPixelPositions(48, 128, 48, 128);

    this.mWalkRight = new SpriteAnimateRenderable(Archer.eAssets.eWalkRightTexture);
    this.mWalkRight.setColor([1, 1, 1, 0]);
    this.mWalkRight.getXform().setPosition(atX, atY);
    this.mWalkRight.getXform().setSize(atW, atH);
    this.mWalkRight.setSpriteSequence(128, 464, 80, 80, 7, 0);
    this.mWalkRight.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    this.mWalkRight.setAnimationSpeed(10);

    this.mShootRight = new SpriteAnimateRenderable(Archer.eAssets.eShootRightTexture);
    this.mShootRight.setColor([1, 1, 1, 0]);
    this.mShootRight.getXform().setPosition(atX, atY);
    this.mShootRight.getXform().setSize(atW, atH);
    this.mShootRight.setSpriteSequence(128, 112, 80, 80, 5, 0);
    this.mShootRight.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    this.mShootRight.setAnimationSpeed(30);

    GameObject.call(this, this.mStandRight);

    this.eCurrentState = Archer.eArcherState.eStandRight;
    this.setCurrentFrontDir(Archer.eDirection.eRight);
    
    //Physics
    var r;
    r = new RigidRectangle(this.getXform(), atW - 6, atH - 4);
    r.setInertia(0);
    r.setRestitution(0);
    this.setRigidBody(r);

    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Archer, GameObject);

Archer.prototype.update = function (aCamera) {
    GameObject.prototype.update.call(this);

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

    // for jump and double jump
    this.mTimeCount++;
    if (this.mTimeCount === this.mJumpCoolDown[0]) {
        this.mJumpRemain++;
    }
    if (this.mTimeCount === this.mJumpCoolDown[1]) {
        this.mJumpRemain++;
    }

    var i;
    var obj;
    var collisionInfo;
    for (i = 0; i < this.mDestroyable.size(); i++) {
        obj = this.mDestroyable.getObjectAt(i);
        collisionInfo = new CollisionInfo();
        if (this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            if (obj instanceof LifePotion) {
                this.addHp(obj.getRestore());
            }
            else if (obj instanceof Bow) {
                this.getMoreArm(obj.getArmNum(), obj.getArmAmount());
            }
            this.mDestroyable.removeFromSet(obj);
            this.mAllObjs.removeFromSet(obj);
            break;
        }
    }

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
            if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
                this.eCurrentState = Archer.eArcherState.eStandLeft;
                this.setCurrentFrontDir(Archer.eDirection.eLeft);
            }
            break;
        }
        case Archer.eArcherState.eShootRight: {
            if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
                this.eCurrentState = Archer.eArcherState.eStandRight;
                this.setCurrentFrontDir(Archer.eDirection.eRight);
            }
            break;
        }
        case Archer.eArcherState.eStandLeft: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C && this.mJumpCount === 0)) {
                this.eCurrentState = Archer.eArcherState.eShootLeft;
                this.setCurrentFrontDir(Archer.eDirection.eLeft);
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
                this.eCurrentState = Archer.eArcherState.eWalkLeft;
                this.setCurrentFrontDir(Archer.eDirection.eLeft);
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
                this.eCurrentState = Archer.eArcherState.eWalkRight;
                this.setCurrentFrontDir(Archer.eDirection.eRight);
            }
            else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
                this.jump();
            }
            break;
        }
        case Archer.eArcherState.eStandRight: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C) && this.mJumpCount === 0) {
                this.eCurrentState = Archer.eArcherState.eShootRight;
                this.setCurrentFrontDir(Archer.eDirection.eRight);
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
                this.eCurrentState = Archer.eArcherState.eWalkRight;
                this.setCurrentFrontDir(Archer.eDirection.eRight);
            }
            else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
                this.eCurrentState = Archer.eArcherState.eWalkLeft;
                this.setCurrentFrontDir(Archer.eDirection.eLeft);
            }
            else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
                this.jump();
            }

            break;
        }
        case Archer.eArcherState.eWalkLeft: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C && this.mJumpCount === 0)) {
                this.eCurrentState = Archer.eArcherState.eShootLeft;
                this.setCurrentFrontDir(Archer.eDirection.eLeft);
            }
            else if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
                this.eCurrentState = Archer.eArcherState.eStandLeft;
                this.setCurrentFrontDir(Archer.eDirection.eLeft);
            }
            else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
                this.jump();
            }
            break;
        }
        case Archer.eArcherState.eWalkRight: {
            if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C && this.mJumpCount === 0)) {
                this.eCurrentState = Archer.eArcherState.eShootRight;
                this.setCurrentFrontDir(Archer.eDirection.eRight);
            }
            else if (!gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
                this.eCurrentState = Archer.eArcherState.eStandRight;
                this.setCurrentFrontDir(Archer.eDirection.eRight);
            }
            else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
                this.jump();
            }
            break;
        }
    }

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
        case Archer.eArcherState.eStandLeft:
        case Archer.eArcherState.eStandRight:
        case Archer.eArcherState.eShootLeft:
        case Archer.eArcherState.eShootRight: {
            break;
        }
    }

    this.getRigidBody().userSetsState();
};

Archer.prototype.setToStand = function () {
    switch (this.eCurrentState) {
        case Archer.eArcherState.eShootLeft: {
            this.eCurrentState = Archer.eArcherState.eStandLeft;
            break;
        }
        case Archer.eArcherState.eShootRight: {
            this.eCurrentState = Archer.eArcherState.eStandRight;
            break;
        }
        case Archer.eArcherState.eStandLeft: {
            this.eCurrentState = Archer.eArcherState.eStandLeft;
            break;
        }
        case Archer.eArcherState.eStandRight: {
            this.eCurrentState = Archer.eArcherState.eStandRight;
            break;
        }
        case Archer.eArcherState.eWalkLeft: {
            this.eCurrentState = Archer.eArcherState.eStandLeft;
            break;
        }
        case Archer.eArcherState.eWalkRight: {
            this.eCurrentState = Archer.eArcherState.eStandRight;
            break;
        }
    }
};

Archer.prototype.getHp = function () {
    return this.mHp;
};
Archer.prototype.addHp = function (delta) {
    this.mHp += delta;
    if (this.mHp > 10)
        this.mHp = 10;
};
Archer.prototype.loseHp = function (delta) {
    this.mHp -= delta;
    if (this.mHp < 0)
        this.mHp = 0;
};

Archer.prototype.jump = function () {
    if (this.mJumpRemain > 0) {
        var velocity = this.getRigidBody().getVelocity();
        this.getRigidBody().setVelocity(velocity[0], 40);
        this.mJumpCoolDown[this.mCoolDownCount] = 195 + this.mTimeCount;
        this.mCoolDownCount++;
        if (this.mCoolDownCount > 1)
            this.mCoolDownCount = 0;
        this.mJumpRemain--;
    }
};

Archer.prototype.getMoreArm = function (armNum, armAmount) {
    this.mPlayer.getMoreArm(armNum, armAmount);
};