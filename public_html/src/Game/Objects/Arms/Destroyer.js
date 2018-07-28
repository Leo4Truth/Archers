function Destroyer(
    posX, posY, vX, vY,
    aAllObjs, aObstacle, aDestroyable,
    master
) {
    Arrow.call(
        this,
        posX, posY, vX, vY, Arrow.eAssets.eDestroyerTexture,
        aAllObjs, aObstacle, aDestroyable,
        master
    );

    this.mEffectTimeLimit = 180;

    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();
}

gEngine.Core.inheritPrototype(Destroyer, Arrow);


Destroyer.prototype.update = function () {
    Arrow.prototype.update.call(this);


    if (this.mGenerateParticles === 1) {
        var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    gEngine.ParticleSystem.update(this.mParticles);
};

Destroyer.prototype.draw = function (aCamera) {
    this.mParticles.draw(aCamera);
    Arrow.prototype.draw.call(this, aCamera);
};


Destroyer.prototype.createParticle = function (atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particles/Particle2.png", atX, atY, life);
    p.getRenderable().setColor([0.898, 0.898, 0.976, 1]);

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

Destroyer.prototype.effectOnObstacle = function (obj) {
    this.mObstacle.removeFromSet(obj);
    this.mAllObjs.removeFromSet(obj);
    this.mGenerateParticles = 0;
    this.mCurrentState = Arrow.eArrowState.eHit;
};

Destroyer.prototype.calculateDistance = function (posX, posY) {
    return Math.sqrt(Math.pow(this.getXform().getXPos() - posX, 2)
        + Math.pow(this.getXform().getYPos() - posY, 2));
};

Destroyer.prototype.effectOnArcher = function (obj) {
    obj.loseHp(5);
    this.mGenerateParticles = 0;
    this.mCurrentState = Arrow.eArrowState.eHit;
};