"use strict";

function ScreamingChickenArrow(posX, posY, vX, vY, spriteTexture,
                               aAllObjs, aObstacle, aDestroyable,
                               master) {
    Arrow.call(
        this,
        posX, posY, vX, vY, spriteTexture,
        aAllObjs, aObstacle, aDestroyable,
        master
    );

    this.mIsChicken = false;
    this.mScreamingChicken = null;

    //particles
    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();
}

gEngine.Core.inheritPrototype(ScreamingChickenArrow, Arrow);


ScreamingChickenArrow.prototype.update = function () {
    GameObject.prototype.update.call(this);

    if (!this.mIsChicken) {
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

        if (this.getRigidBody().collisionTest(this.mMaster.getRigidBody(), collisionInfo)) {
            this.mAllObjs.removeFromSet(this);
            this.mCurrentState = Arrow.eArrowState.eMiss;
            this.mGenerateParticles = 0;
        }

        var obj;
        var collisionInfo;
        var i;
        for (i = 0; i < this.mObstacle.size(); i++) {
            obj = this.mObstacle.getObjectAt(i);
            collisionInfo = new CollisionInfo();
            if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
                this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
                if (obj instanceof Archer) {
                    obj.loseHp(1);
                    this.mCurrentState = Arrow.eArrowState.eHit;
                    this.mAllObjs.removeFromSet(this);
                }
                else {
                    this.mAllObjs.removeFromSet(this);
                    var startPos = this.getXform().getPosition();
                    this.mIsChicken = true;
                    this.mScreamingChicken = new TextureRenderable(Arrow.eAssets.eScreamingChickenTexture);
                    this.mScreamingChicken.setColor([1, 1, 1, 0]);
                    this.mScreamingChicken.getXform().setSize(8, 8);
                    this.mScreamingChicken.getXform().setPosition(startPos[0], 4);
                }
                break;
            }
        }

        if (!this.mIsChicken) {
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

            if (this.getXform().getPosition()[0] < -250 ||
                this.getXform().getPosition()[1] > 125 ||
                this.getXform().getPosition()[1] < -125) {
                this.mAllObjs.removeFromSet(this);
                this.mCurrentState = Arrow.eArrowState.eMiss;
            }

            if (this.mGenerateParticles === 1) {
                var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
                this.mParticles.addToSet(p);
            }
            gEngine.ParticleSystem.update(this.mParticles);
        }
    }
    else {
        var pos = this.mScreamingChicken.getXform().getPosition();
        this.mScreamingChicken.getXform().setPosition(pos[0] + 5, pos[1]);
        pos = this.mScreamingChicken.getXform().getPosition();
        if (pos[0] < -250 || pos[0] > 250) {
            this.mCurrentState = Arrow.eArrowState.eMiss;
        }
        else {
            for (i = 0; i < this.mAllObjs.size(); i++) {
                obj = this.mAllObjs.getObjectAt(i);
                var objPos = obj.getXform().getPosition();
                if (Math.abs(pos[0] - objPos[0]) < 12 && Math.abs(pos[1] - objPos[1]) < 0.2) {
                    if (obj instanceof Archer && obj !== this.mMaster) {
                        obj.loseHp(2);
                        this.mCurrentState = Arrow.eArrowState.eHit;
                    }
                    else {
                        this.mCurrentState = Arrow.eArrowState.eMiss;
                    }
                    break;
                }
            }
        }
    }
};

ScreamingChickenArrow.prototype.draw = function (aCamera) {
    if (!this.mIsChicken) {
        this.mParticles.draw(aCamera);
        GameObject.prototype.draw.call(this, aCamera);
    }
};

ScreamingChickenArrow.prototype.createParticle = function (atX, atY) {
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

ScreamingChickenArrow.prototype.isChicken = function () {
    return this.mIsChicken;
};
ScreamingChickenArrow.prototype.getScreamingChicken = function () {
    return this.mScreamingChicken;
};
