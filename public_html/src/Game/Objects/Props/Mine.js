/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Mine.eAssets = Object.freeze({
    eMineTexture: "assets/props/mine.png"
});

Mine.eAudio = Object.freeze({
    eExplode : "assets/sounds/Explosion.mp3"
});

function Mine(posX, posY, texture, restore, allObj, allObstacle, aDestroyable) {
    console.log("mine");
    this.mMine = new TextureRenderable(texture);
    this.mMine.setColor([1, 1, 1, 0]);
    this.mMine.getXform().setPosition(posX, posY);
    this.mMine.getXform().setSize(8, 8);

    GameObject.call(this, this.mMine);
    var r = new RigidCircle(this.mMine.getXform(), 3);
    this.setRigidBody(r);
    this.getRigidBody().setVelocity(0, 0);
    this.getRigidBody().setMass(0.1);
    this.getRigidBody().setInertia(0);
    this.getRigidBody().setRestitution(0);

    this.mAllObjs = allObj;
    this.mObstacle = allObstacle;
    this.mDestroyable = aDestroyable;
    this.mRestore = restore;

    this.mArcherSet = [];
    var i;
    for (i = 0; i < this.mObstacle.size(); i++) {
        obj = this.mObstacle.getObjectAt(i);
        if (obj instanceof Archer) {
            this.mArcherSet.push(obj);
        }
    }

    //this.toggleDrawRenderable();
    // this.toggleDrawRigidShape();
}

gEngine.Core.inheritPrototype(Mine, GameObject);

Mine.prototype.update = function () {
    var i, archX, archY, distance;
    var mindistance = 10, minarch = -1;

    for (i = 0; i < this.mArcherSet.length; ++i) {
        archX = this.mArcherSet[i].getXform().getXPos();
        archY = this.mArcherSet[i].getXform().getYPos();
        distance = this.calculateDistance(
            this.getXform().getXPos(),
            this.getXform().getYPos(),
            archX, archY
        );
        if (distance <= 10) {
            if (distance <= mindistance) {
                minarch = i;
                mindistance = distance;
            }
        }
    }
    if (minarch !== -1) {
        gEngine.AudioClips.playACue(Mine.eAudio.eExplode);
        this.mArcherSet[minarch].loseHp(this.getRestore());
        this.mAllObjs.removeFromSet(this);
        this.mDestroyable.removeFromSet(this);
    }

    GameObject.prototype.update.call(this);
    //this.mMine.getXform().setRotationInRad(0);
};

Mine.prototype.getRestore = function () {
    return this.mRestore;
};


Mine.prototype.calculateDistance = function (posX, posY, aX, aY) {
    return Math.sqrt(Math.pow(aX - posX, 2)
        + Math.pow(aY - posY, 2));
};