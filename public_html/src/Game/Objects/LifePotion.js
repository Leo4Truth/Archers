"use strict";

function LifePotion(posX, posY, texture) {
    this.mLifePotion = new TextureRenderable(texture);
    this.mLifePotion.setColor([1, 1, 1, 0]);
    this.mLifePotion.getXform().setPosition(posX, posY);
    this.mLifePotion.getXform().setSize(4, 4);

    GameObject.call(this, this.mLifePotion);
    var r = new RigidRectangle(this.mLifePotion.getXform(), 4, 4);
    this.setRigidBody(r);

    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
}

gEngine.Core.inheritPrototype(LifePotion, GameObject);

LifePotion.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.mLifePotion.getXform().setRotationInRad(0);
};
