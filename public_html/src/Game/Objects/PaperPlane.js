/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


PaperPlane.eArrowState = Object.freeze({
    eFlying: 0,
    eHit: 1,
    eMiss: 2
});

PaperPlane.eAssets = Object.freeze({
    ePaperPlaneTexture: "./assets/arrows/paperplane.png"
});

function PaperPlane(posX, posY, vX, vY, spriteTexture,
               aAllObjs, aObstacle, aDestroyable,
               master) {
    this.mCurrentState = PaperPlane.eArrowState.eFlying;

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

    this.mArrow = new TextureRenderable(spriteTexture);
    this.mArrow.setColor([1, 1, 1, 0]);
    this.mArrow.getXform().setPosition(posX, posY);
    this.mArrow.getXform().setSize(4, 8);
    GameObject.call(this, this.mArrow);


    //var r = new RigidCircle(this.getXform(), 2, 8);
    var r = new RigidRectangle(this.getXform(), 4, 8);
    this.setRigidBody(r);
    this.getRigidBody().setVelocity(vX, vY);

    this.mExpired = false;

    //particles
    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();

    //this.toggleDrawRigidShape(); // Draw RigidShape
}
gEngine.Core.inheritPrototype(PaperPlane, GameObject);

PaperPlane.prototype.update = function () {
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
    //this.mArrow.updateAnimation();

    /* Check Collision */
    var obj;
    var collisionInfo;
    var i;
    for (i = 0; i < this.mObstacle.size(); i++) {
        obj = this.mObstacle.getObjectAt(i);
        collisionInfo = new CollisionInfo();
        if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            var pos = this.getXform().getPosition();
            this.mMaster.getXform().setPosition(pos[0], pos[1]);
            this.mAllObjs.removeFromSet(this);
            this.mCurrentState = PaperPlane.eArrowState.eMiss;
            this.mGenerateParticles = 0;
        }
    }

    for (i = 0; i < this.mDestroyable.size(); i++) {
        obj = this.mDestroyable.getObjectAt(i);
        collisionInfo = new CollisionInfo();
        if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            if (obj instanceof LifePotion) {
                this.mMaster.addHp();
            }
            var pos = this.getXform().getPosition();
            this.mMaster.getXform().setPosition(pos[0], pos[1]);
            
            this.mAllObjs.removeFromSet(obj);
            this.mDestroyable.removeFromSet(obj);
            this.mAllObjs.removeFromSet(this);
            this.mCurrentState = PaperPlane.eArrowState.eHit;
            this.mGenerateParticles = 0;
        }
    }

    var v = this.getRigidBody().getVelocity();
    if (Math.abs(v[0]) < 0.2 && Math.abs(v[1]) < 0.2) {
        this.mAllObjs.removeFromSet(this);
        this.mCurrentState = PaperPlane.eArrowState.eMiss;
    }

    if (this.getXform().getPosition()[1] < -200) {
        this.mAllObjs.removeFromSet(this);
        this.mCurrentState = PaperPlane.eArrowState.eMiss;
    }

    if (this.mGenerateParticles === 1) {
        var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    gEngine.ParticleSystem.update(this.mParticles);
};

PaperPlane.prototype.draw = function(aCamera){
    this.mParticles.draw(aCamera);

    GameObject.prototype.draw.call(this, aCamera);
};

PaperPlane.prototype.getCurrentState = function () {
    return this.mCurrentState;
};

PaperPlane.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particles/Particle2.png", atX, atY, life);
//    console.log(p);
    p.getRenderable().setColor([1, 1, 1, 1]);

    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);

    // final color
    var fr = 0.5 + Math.random();
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
