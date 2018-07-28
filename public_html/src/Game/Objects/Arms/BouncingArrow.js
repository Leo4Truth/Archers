"use strict";

function BouncingArrow(posX, posY, vX, vY, spriteTexture,
                       aAllObjs, aObstacle, aDestroyable,
                       master) {
    Arrow.call(
        this,
        posX, posY, vX, vY, spriteTexture,
        aAllObjs, aObstacle, aDestroyable,
        master
    );

    this.mBounceCount = 100;

    //particles
    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();
}

gEngine.Core.inheritPrototype(BouncingArrow, Arrow);

BouncingArrow.prototype.update = function () {
    GameObject.prototype.update.call(this);

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

    var obj;
    var collisionInfo;
    var i;
    for (i = 0; i < this.mObstacle.size(); i++) {
        obj = this.mObstacle.getObjectAt(i);
        collisionInfo = new CollisionInfo();
        if (obj !== this && //obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            if (obj instanceof Archer) {
                obj.loseHp(1);
                this.mCurrentState = Arrow.eArrowState.eHit;
                this.mAllObjs.removeFromSet(this);
                break;
            }
            else {
                var v = this.getRigidBody().getVelocity();
                this.getRigidBody().setVelocity(-v[0] * (0.8+Math.random()), -v[1] * (0.8+Math.random()));
                this.mBounceCount--;
                if (this.mBounceCount === 0) {
                    this.mCurrentState = Arrow.eArrowState.eMiss;
                    this.mAllObjs.removeFromSet(this);
                    break;
                }
            }
        }
    }

    for (i = 0; i < this.mDestroyable.size(); i++) {
        obj = this.mDestroyable.getObjectAt(i);
        collisionInfo = new CollisionInfo();
        if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            if (obj instanceof LifePotion) {
                this.mMaster.addHp(1);
            }
            this.mAllObjs.removeFromSet(obj);
            this.mDestroyable.removeFromSet(obj);
            this.mAllObjs.removeFromSet(this);
            this.mCurrentState = Arrow.eArrowState.eHit;
            this.mGenerateParticles = 0;
        }
    }
    if (this.getRigidBody().collisionTest(this.mMaster.getRigidBody(), collisionInfo)) {
        this.mAllObjs.removeFromSet(this);
        this.mCurrentState = Arrow.eArrowState.eMiss;
        this.mGenerateParticles = 0;
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

    if (this.mGenerateParticles === 1) {
        var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    gEngine.ParticleSystem.update(this.mParticles);
};

BouncingArrow.prototype.draw = function (aCamera) {
    this.mParticles.draw(aCamera);
    GameObject.prototype.draw.call(this, aCamera);
};

BouncingArrow.prototype.createParticle = function (atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particles/Particle2.png", atX, atY, life);
    p.getRenderable().setColor([0, 0, 1, 1]);

    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);

    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);

    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getParticle().setVelocity([fx, fy]);

    // size delta
    p.setSizeDelta(0.98);

    return p;
};