"use strict";

function Archer() {
    this.kDelta = 0.3;

    this.mArcher = new SpriteAnimateRenderable(spriteTexture);
    this.mArcher.setColor([1, 1, 1, 0]);
    this.mArcher.getXform().setPosition(80, 40);
    this.mArcher.getXform().setSize(16, 20);
    this.mArcher.setElementPixelPositions(0, 240, 0, 360);
    this.mArcher.setSpriteSequence(128, 0, 80, 90, 5, 0);
    this.mArcher.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mArcher.setAnimationSpeed(10);
    GameObject.call(this, this.mArcher);

    this.mArrow = null;

    var r = new RigidRectangle(this.getXform(), 16, 20);
    this.setRigidBody(r);
}