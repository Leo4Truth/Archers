"use strict";

Armory.eAssets = Object.freeze({
    eBackgroundTexture: "assets/UI/armoryBackground.png",
    eCellTexture: "assets/UI/armoryCell.png",
    eCheckMarkTexture: "assets/UI/UICheckMark.png"
});

Armory.eCellOffsets = Object.freeze([
    [-24, 36], [-12, 36], [0, 36], [12, 36], [24, 36],
    [-24, 24], [-12, 24], [0, 24], [12, 24], [24, 24],
    [-24, 12], [-12, 12], [0, 12], [12, 12], [24, 12],
    [-24, 0], [-12, 0], [0, 0], [12, 0], [24, 0],
    [-24, -12], [-12, -12], [0, -12], [12, -12], [24, -12],
    [-24, -24], [-12, -24], [0, -24], [12, -24], [24, -24],
    [-24, -36], [-12, -36], [0, -36], [12, -36], [24, -36]
]);

function Armory(XPos, YPos) {
    this.XPos = XPos;
    this.YPos = YPos;

    this.kCellLength = 10;
    this.kCellNum = new vec2.fromValues(5, 7);
    this.kCurrentArm = 0;

    this.mArms = [];
    this.mCells = [];

    this.mBackground = new SpriteRenderable(Armory.eAssets.eBackgroundTexture);
    this.mBackground.setColor([1, 1, 1, 0]);
    this.mBackground.getXform().setPosition(XPos, YPos);
    this.mBackground.getXform().setSize(60, 84);

    var i;
    for (i = 0; i < 35; i++) {
        var cell = new SpriteRenderable(Armory.eAssets.eCellTexture);
        cell.setColor([1, 1, 1, 0]);
        cell.getXform().setPosition(
            XPos + Armory.eCellOffsets[i][0],
            YPos + Armory.eCellOffsets[i][1]
        );
        cell.getXform().setSize(10, 10);
        this.mCells[i] = cell;
    }

    this.mCheckMark = new SpriteRenderable(Armory.eAssets.eCheckMarkTexture);
    this.mCheckMark.setColor([1, 1, 1, 0]);
    this.mCheckMark.getXform().setPosition(
        XPos + Armory.eCellOffsets[this.kCurrentArm][0],
        YPos + Armory.eCellOffsets[this.kCurrentArm][1]
    );
    this.mCheckMark.getXform().setSize(10, 10);

    // Here are all of the weapon
    var newArm = new Arm(this.XPos, this.YPos, 0, 99, Arm.eIconAssets.eNormalArrow);
    newArm.setActive();
    this.addArm(newArm);
    newArm = new Arm(this.XPos, this.YPos, 1, 10, Arm.eIconAssets.ePaperPlane);
    this.addArm(newArm);
    newArm = new Arm(this.XPos, this.YPos, 2, 10, Arm.eIconAssets.eBouncingArrow);
    this.addArm(newArm);
    newArm = new Arm(this.XPos, this.YPos, 3, 10, Arm.eIconAssets.eDestroyer);
    this.addArm(newArm);
    newArm = new Arm(this.XPos, this.YPos, 4, 10, Arm.eIconAssets.ePuncturingArrow);
    this.addArm(newArm);
    newArm = new Arm(this.XPos, this.YPos, 5, 10, Arm.eIconAssets.eShockWave);
    this.addArm(newArm);
    newArm = new Arm(this.XPos, this.YPos, 6, 10, Arm.eIconAssets.eScreamingChickenArrow);
    this.addArm(newArm);
    newArm = new Arm(this.XPos, this.YPos, 7, 10, Arm.eIconAssets.eMineLauncher);
    this.addArm(newArm);
}

Armory.prototype.addArm = function(arm) {
    this.mArms.push(arm);
};

Armory.prototype.removeArm = function(arm) {
    var index = this.mArms.indexOf(arm);
    if (index > -1)
        this.mArms.splice(index, 1);
};

Armory.prototype.draw = function (aCamera) {
    this.mBackground.draw(aCamera);
    var i;
    for (i = 0; i < 35; i++) {
        this.mCells[i].draw(aCamera);
    }
    for (i = 0; i < this.mArms.length; i++) {
        this.mArms[i].draw(aCamera);
    }
    this.mCheckMark.draw(aCamera);
};

Armory.prototype.update = function() {
    this.mCheckMark.getXform().setPosition(
        this.XPos + Armory.eCellOffsets[this.kCurrentArm][0],
        this.YPos + Armory.eCellOffsets[this.kCurrentArm][1]
    );
};

Armory.prototype.keyControl = function() {
    if (this.kCurrentArm < this.mArms.length)
        this.mArms[this.kCurrentArm].setInactive();

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.I)) {
        this.kCurrentArm -= 5;
        if (this.kCurrentArm < 0)
            this.kCurrentArm = 0;
    }
    else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K)) {
        this.kCurrentArm += 5;
        if (this.kCurrentArm >= 35)
            this.kCurrentArm = 34;
    }
    else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
        this.kCurrentArm -= 1;
        if (this.kCurrentArm < 0)
            this.kCurrentArm = 0;
    }
    else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
        this.kCurrentArm += 1;
        if (this.kCurrentArm >= 35)
            this.kCurrentArm = 34;
    }

    if (this.kCurrentArm < this.mArms.length)
        this.mArms[this.kCurrentArm].setActive();
};

Armory.prototype.getCurrentArm = function () {
    if (this.mArms[this.kCurrentArm].getCurrentNum() > 0)
        return this.kCurrentArm;
    else
        return -1;
};

Armory.prototype.useArm = function (dec) {
    this.mArms[this.kCurrentArm].useArm(dec);
};

Armory.prototype.getMoreArm = function (armNum, armAmount) {
    this.mArms[armNum].getMoreArm(armAmount);
};

