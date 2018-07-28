"use strict";  // Operate in Strict mode such that variables must be declared before used!

Arrow.eArrowState = Object.freeze({
    eFlying: 0,
    eHit: 1,
    eMiss: 2,
    eEffect: 3
});

Arrow.eAssets = Object.freeze({
    eNormalArrowTexture: "./assets/arrows/arrows_a.png",
    ePaperPlaneTexture: "./assets/arrows/paperPlane.png",
    eBouncingArrowTexture: "./assets/arrows/arrows_c.png",
    eScreamingChickenArrowTexture: "./assets/arrows/arrows_d.png",
    eScreamingChickenTexture: "./assets/arrows/screamingChicken.png"
});

function Arrow(
    posX, posY, vX, vY, texture,
    aAllObjs, aObstacle, aDestroyable,
    master
) {
    this.mCurrentState = Arrow.eArrowState.eFlying;

    this.mAllObjs = aAllObjs;
    this.mMaster = master;
    this.mObstacle = aObstacle;
    this.mDestroyable = aDestroyable;

    this.kVelocity = [vX, vY];
    this.kSpeed = Math.sqrt(this.kVelocity[0] * this.kVelocity[0] + this.kVelocity[1] * this.kVelocity[1]);
    this.kRotationInRad = null;
    if (vX > 0) {
        this.kRotationInRad = -Math.acos(this.kVelocity[1] / this.kSpeed);
    }
    else {
        this.kRotationInRad = Math.acos(this.kVelocity[1] / this.kSpeed);
    }

    this.mArrow = new SpriteAnimateRenderable(texture);
    this.mArrow.setColor([1, 1, 1, 0]);
    this.mArrow.getXform().setPosition(posX, posY);
    this.mArrow.getXform().setSize(2, 8);
    this.mArrow.getXform().setRotationInRad(this.kRotationInRad);
    this.mArrow.setSpriteSequence(64, 0, 21, 64, 3, 0);
    this.mArrow.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mArrow.setAnimationSpeed(10);
    GameObject.call(this, this.mArrow);

    var r = new RigidRectangle(this.getXform(), 1, 8);
    this.setRigidBody(r);
    this.getRigidBody().setVelocity(vX, vY);
    this.getRigidBody().setMass(0.1);

    this.mEffectTimer = 0;

    //this.toggleDrawRigidShape(); // Draw RigidShape
}
gEngine.Core.inheritPrototype(Arrow, GameObject);

Arrow.prototype.update = function () {
    GameObject.prototype.update.call(this);

    if (this.mCurrentState === Arrow.eArrowState.eHit) {
        this.mEffectTimer++;
        if (this.mEffectTimer === 25) {
            this.mAllObjs.removeFromSet(this);
            this.mCurrentState = Arrow.eArrowState.eEffect;
        }
        return;
    }

    /* Update Flying Direction */
    this.kVelocity = this.getRigidBody().getVelocity();
    this.kSpeed = Math.sqrt(this.kVelocity[0] * this.kVelocity[0] + this.kVelocity[1] * this.kVelocity[1]);
    this.kRotationInRad = null;
    if (this.kVelocity[0] > 0) {
        var tmp = this.kVelocity[1] / this.kSpeed;
        if (tmp > 1)
            tmp = 1;
        else if (tmp < -1)
            tmp = -1;
        this.kRotationInRad = -Math.acos(tmp);
    }
    else {
        var tmp = this.kVelocity[1] / this.kSpeed;
        if (tmp > 1)
            tmp = 1;
        else if (tmp < -1)
            tmp = -1;
        this.kRotationInRad = Math.acos(tmp);
    }
    this.mArrow.getXform().setRotationInRad(this.kRotationInRad);
    this.mArrow.updateAnimation();

    /* Check Collision */
    var obj;
    var collisionInfo;
    var i;
    for (i = 0; i < this.mObstacle.size(); i++) {
        obj = this.mObstacle.getObjectAt(i);
        collisionInfo = new CollisionInfo();
        if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            if (obj instanceof Archer) {
                this.effectOnArcher(obj);
            }
            else {
                this.effectOnObstacle(obj);
            }
            break;
        }
    }

    for (i = 0; i < this.mDestroyable.size(); i++) {
        obj = this.mDestroyable.getObjectAt(i);
        collisionInfo = new CollisionInfo();
        if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            this.effectOnDestroyable(obj);
            break;
        }
    }
    if (this.getRigidBody().collisionTest(this.mMaster.getRigidBody(), collisionInfo)) {
        this.mAllObjs.removeFromSet(this);
        this.mCurrentState = Arrow.eArrowState.eMiss;
    }

    if (this.getXform().getYPos() < -125) {
        this.mAllObjs.removeFromSet(this);
        this.mCurrentState = Arrow.eArrowState.eMiss;
    }
    if (this.getXform().getXPos() < -250) {
        this.mAllObjs.removeFromSet(this);
        this.mCurrentState = Arrow.eArrowState.eMiss;
    }
    if (this.getXform().getXPos() > 250) {
        this.mAllObjs.removeFromSet(this);
        this.mCurrentState = Arrow.eArrowState.eMiss;
    }
};

Arrow.prototype.draw = function (aCamera) {
    if (this.mCurrentState === Arrow.eArrowState.eFlying)
        GameObject.prototype.draw.call(this, aCamera);
};

Arrow.prototype.getCurrentState = function () {
    return this.mCurrentState;
};

Arrow.prototype.setCurrentState = function (state) {
    this.mCurrentState = state;
};

Arrow.prototype.effectOnObstacle = function (obj) {
    //this.mAllObjs.removeFromSet(this);
    this.mCurrentState = Arrow.eArrowState.eHit;
};

Arrow.prototype.effectOnArcher = function (obj) {
    obj.loseHp(1);
    this.mCurrentState = Arrow.eArrowState.eHit;
};

Arrow.prototype.effectOnDestroyable = function (obj) {
    if (obj instanceof LifePotion) {
        this.mMaster.addHp(1);
    }
    this.mAllObjs.removeFromSet(obj);
    this.mDestroyable.removeFromSet(obj);
    this.mCurrentState = Arrow.eArrowState.eHit;
};