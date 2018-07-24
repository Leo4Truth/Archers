"use strict"

function Arrow(orgX, orgY, vX, vY) {
    this.kDelta = 0.3;

    this.mArrow = new Renderable();
    this.mArrow.setColor([1, 0, 0, 0]);
    this.mArrow.getXform().setPosition(orgX, orgY);
    this.mArrow.getXform().setSize(5, 5);

    GameObject.call(this, this.mArrow);

    var r = new RigidRectangle(this.getXform(), 5, 5);
    this.setRigidBody(r);
    this.getRigidBody().setVelocity(vX, vY, 0);
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Arrow, GameObject);

Arrow.prototype.update = function() {
    GameObject.prototype.update.call(this);
    this.mArrow.update();
}