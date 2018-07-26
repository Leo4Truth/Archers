"use strict";  // Operate in Strict mode such that variables must be declared before used!

Arrow.eArrowState = Object.freeze({
    eFlying: 0,
    eHit: 1
});

function Arrow(posX, posY, vX, vY, spriteTexture,
               aAllObjs, aObstacle, aDestroyable,
               master) {
    this.mAllObjs = aAllObjs;
    this.mMaster = master;
    this.mObstacle = aObstacle;
    this.mDestroyable = aDestroyable;
    
    //speed and rotation
    this.kVelocity = [vX, vY];
    this.kSpeed = Math.sqrt(this.kVelocity[0] * this.kVelocity[0] + this.kVelocity[1] * this.kVelocity[1]);
    this.kRotationInRad = null;
    if (vX > 0) {
        this.kRotationInRad = -Math.acos(this.kVelocity[1] / this.kSpeed);
    }
    else {
        this.kRotationInRad = Math.acos(this.kVelocity[1] / this.kSpeed);
    }

    //animation
    this.mArrow = new SpriteAnimateRenderable(spriteTexture);
    this.mArrow.setColor([1, 1, 1, 0]);
    this.mArrow.getXform().setPosition(posX, posY);
    this.mArrow.getXform().setSize(2, 8);
    this.mArrow.getXform().setRotationInRad(this.kRotationInRad);
    this.mArrow.setSpriteSequence(32, 0, 10, 32, 3, 0);
    this.mArrow.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mArrow.setAnimationSpeed(10);
    GameObject.call(this, this.mArrow);

    //physics
    var r = new RigidRectangle(this.getXform(), 1, 8);
    this.setRigidBody(r);
    this.getRigidBody().setVelocity(vX, vY);

    //status (flying or hit)
    this.mStatus = Arrow.eArrowState.eFlying;//this.mExpired = false;
    this.mParticles = null;

    this.toggleDrawRigidShape(); // Draw RigidShape
}
gEngine.Core.inheritPrototype(Arrow, GameObject);

Arrow.prototype.update = function () {
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

    /* Check Collision */
    var i;
    for (i = 0; i < this.mObstacle.size(); i++) {
        var obj = this.mObstacle.getObjectAt(i);
        var collisionInfo = new CollisionInfo();
        if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            //this.mAllObjs.removeFromSet(obj);
            this.mStatus = Arrow.eArrowState.eHit;
            this.mAllObjs.removeFromSet(this);
        }
    }

    for (i = 0; i < this.mDestroyable.size(); i++) {
        var obj = this.mDestroyable.getObjectAt(i);
        var collisionInfo = new CollisionInfo();
        if (obj !== this && obj !== this.mMaster && //avoid killing the archer who shoot
            this.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo)) {
            //obj.getXform().setPosition(1000, 1000);
            this.mStatus = Arrow.eArrowState.eHit;
            //if shot
            if(obj instanceof Archer){
                obj.loseHp(1);
                //obj.mHpBar.loseHp(1);
            }
            //this.mAllObjs.removeFromSet(obj);
            this.mAllObjs.removeFromSet(this);            
        }
    }

    var v = this.getRigidBody().getVelocity();
    if (Math.abs(v[0]) < 0.2 && Math.abs(v[1]) < 0.2)
        this.mAllObjs.removeFromSet(this);

    if (this.getXform().getPosition()[1] < -200)
        this.mAllObjs.removeFromSet(this);
};