function ShockWave(
    posX, posY, vX, vY,
    aAllObjs, aObstacle, aDestroyable,
    master
) {
    Arrow.call(
        this,
        posX, posY, vX, vY, Arrow.eAssets.eShockWaveTexture,
        aAllObjs, aObstacle, aDestroyable,
        master
    );

    this.mEffectTimeLimit = 180;

    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();
}

gEngine.Core.inheritPrototype(ShockWave, Arrow);


ShockWave.prototype.update = function () {
    Arrow.prototype.update.call(this);

    if (this.mGenerateParticles === 1) {
        var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    gEngine.ParticleSystem.update(this.mParticles);
};

ShockWave.prototype.draw = function (aCamera) {
    this.mParticles.draw(aCamera);
    Arrow.prototype.draw.call(this, aCamera);
};


ShockWave.prototype.createParticle = function (atX, atY) {
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

ShockWave.prototype.effectOnObstacle = function (obj) {
    this.mAllObjs.removeFromSet(this);
    for (i = 0; i < this.mObstacle.size(); i++) {
        obj = this.mObstacle.getObjectAt(i);
        if (obj instanceof Archer) {
            var distance = this.calculateDistance(obj.getXform().getXPos(), obj.getXform().getYPos());
            if (distance <= 60) {
                var xSpeed = 15 + (60 - distance) * (obj.getXform().getXPos() - this.getXform().getXPos()) / distance;
                var ySpeed = 30 + (60 - distance) * (obj.getXform().getYPos() - this.getXform().getYPos()) / distance;
                obj.getRigidBody().setVelocity(xSpeed, ySpeed);
            }
        }
    }
    this.mGenerateParticles = 0;
    this.mCurrentState = Arrow.eArrowState.eHit;
};

ShockWave.prototype.effectOnArcher = function (obj) {
    this.mAllObjs.removeFromSet(this);
    obj.loseHp(2);
    if (this.getXform().getXPos() < obj.getXform().getXPos())
        obj.getRigidBody().setVelocity(20, 30);
    else
        obj.getRigidBody().setVelocity(-20, 30);
    this.mGenerateParticles = 0;
    this.mCurrentState = Arrow.eArrowState.eHit;

    //
//    var buff = new Buff(Arrow.eAssets.eShockWaveTexture);
//    obj.mPlayer.addBuff(buff);
};


ShockWave.prototype.calculateDistance = function (posX, posY) {
    return Math.sqrt(Math.pow(this.getXform().getXPos() - posX, 2)
        + Math.pow(this.getXform().getYPos() - posY, 2));
};