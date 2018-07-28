"use strict";

function ScreamingChickenArrow(
    posX, posY, vX, vY,
    aAllObjs, aObstacle, aDestroyable,
    master
) {
    Arrow.call(
        this,
        posX, posY, vX, vY, Arrow.eAssets.eScreamingChickenArrowTexture,
        aAllObjs, aObstacle, aDestroyable,
        master
    );

    this.mIsChicken = false;
    this.mScreamingChicken = null;

    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();
}
gEngine.Core.inheritPrototype(ScreamingChickenArrow, Arrow);


ScreamingChickenArrow.prototype.update = function () {
    Arrow.prototype.update.call(this);
    if (this.mIsChicken) {
        this.getRigidBody().setVelocity(50, -20);
        this.mArrow.getXform().setRotationInRad(-Math.PI / 2);
    }
    if (this.mGenerateParticles === 1) {
        var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    gEngine.ParticleSystem.update(this.mParticles);
};

ScreamingChickenArrow.prototype.draw = function (aCamera) {
    if (!this.mIsChicken) {
        this.mParticles.draw(aCamera);
        Arrow.prototype.draw.call(this, aCamera);
    }
    else {
        this.mParticles.draw(aCamera);
        Arrow.prototype.draw.call(this, aCamera);
    }
};

ScreamingChickenArrow.prototype.effectOnObstacle = function (obj) {
    if (!this.mIsChicken) {
        this.mIsChicken = true;
    }
    else {
        if (obj.getXform().getYPos() < this.getXform().getYPos()) {
            //this.getXform().incYPosBy(-5);
        }            
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
