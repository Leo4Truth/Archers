"use strict";

Bow.eAssets = Object.freeze({
    eBowSetSpriteTexture: "assets/armIcons/bowSet.png"
});

Bow.eBowTexturePos = Object.freeze({
    ePaperPlane: [0, 0]
});

function Bow(xpos, ypos, armNum, armAmount, existTurns) {
    this.mRenderComponent = new SpriteRenderable(Bow.eAssets.eBowSetSpriteTexture);
    var pxPos = [
        Bow.eBowTexturePos.ePaperPlane[0] * 32,
        Bow.eBowTexturePos.ePaperPlane[0] * 32 + 32,
        256 - (Bow.eBowTexturePos.ePaperPlane[1] * 32 + 32),
        256 - (Bow.eBowTexturePos.ePaperPlane[1] * 32)
    ];
    this.mRenderComponent.setElementPixelPositions(pxPos[0], pxPos[1], pxPos[2], pxPos[3]);
    this.mRenderComponent.setColor([1, 1, 1, 0]);
    this.mRenderComponent.getXform().setSize(8, 8);
    this.mRenderComponent.getXform().setPosition(xpos, ypos);

    GameObject.call(this, this.mRenderComponent);

    var r = new RigidRectangle(this.mRenderComponent.getXform(), 8, 8);
    this.setRigidBody(r);
    this.getRigidBody().setVelocity(0, 0);
    this.getRigidBody().setMass(0.1);
    this.getRigidBody().setInertia(0);
    this.getRigidBody().setRestitution(0);

    this.mArmIcon = new TextureRenderable(Arm.eIconAssets.ePaperPlane);
    this.mArmIcon.setColor([1, 1, 1, 0]);
    this.mArmIcon.getXform().setPosition(xpos, ypos);
    this.mArmIcon.getXform().setSize(6, 6);

    this.mArmNum = armNum;
    this.mArmAmount = armAmount;
    this.mRemainTurns = existTurns;
}

gEngine.Core.inheritPrototype(Bow, GameObject);

Bow.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
    this.mArmIcon.draw(aCamera);
};

Bow.prototype.update = function () {
    GameObject.prototype.update.call(this);
    var pos = this.getXform().getPosition();
    this.mArmIcon.getXform().setPosition(pos[0], pos[1]);
};

Bow.prototype.getArmNum = function () {
    return this.mArmNum;
};

Bow.prototype.getArmAmount = function () {
    return this.mArmAmount;
};