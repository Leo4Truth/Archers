"use strict";

function LifePotion(posX, posY, texture) {
    this.mLifePotion = new TextureRenderable(texture);
    this.mLifePotion.setColor([0, 1, 0, 1]);
    this.mLifePotion.getXform().setPosition(posX, posY);
    this.mLifePotion.getXform().setSize(10, 10);

    GameObject.call(this, this.mLifePotion);
    var r = new RigidRectangle(this.mLifePotion.getXform(), 10, 10);
    this.setRigidBody(r);

    this.toggleDrawRigidShape(); // Draw RigidShape
}

gEngine.Core.inheritPrototype(LifePotion, GameObject);

LifePotion.prototype.update = function () {
    GameObject.prototype.update.call(this);
};
