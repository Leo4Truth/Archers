Arm.eMsgString = Object.freeze([
    "Arrow :",
    "PaperPlane :",
    "Bounce :",
    "Destroyer :",
    "PuncturingArrow :",
    "ShockWave :",
    "ScreamingChick :",
    "MineLauncher :"
]);

Arm.eArmNum = Object.freeze({
    eNormalArrow: 0,
    ePaperPlane: 1,
    eBouncingArrow: 2,
    eDestroyer: 3,
    ePuncturingArrow: 4,
    eShockWave: 5,
    eScreamingChickenArrow: 6,
    eMineLauncher: 7
});

Arm.eIconAssets = Object.freeze({
    eNormalArrow: "assets/arrows/arrows_f.png",
    ePaperPlane: "assets/armIcons/paperPlane.png",
    eBouncingArrow: "assets/arrows/arrows_e.png",
    eDestroyer: "assets/armIcons/hammerIcon.png",
    ePuncturingArrow: "assets/armIcons/waterArrowIcon.png",
    eShockWave: "assets/armIcons/shockWaveIcon.png",
    eScreamingChickenArrow: "assets/armIcons/screamingChickenArrowIcon.png",
    eMineLauncher: "assets/armIcons/mineLauncherIcon.png"
});

function Arm(XPos, YPos, order, currentNum, texture) {
    this.XPos = XPos;
    this.YPos = YPos;
    this.mOrder = order;
    this.mCurrentNum = currentNum;

    this.mIcon = new TextureRenderable(texture);
    this.mIcon.setColor([1, 1, 1, 0]);
    this.mIcon.getXform().setPosition(
        this.XPos + Armory.eCellOffsets[this.mOrder][0],
        this.YPos + Armory.eCellOffsets[this.mOrder][1]
    );
    this.mIcon.getXform().setSize(10, 10);
    this.mMessageBox = null;
    this.isActive = 0;
}

Arm.prototype.draw = function (aCamera) {
    "assets/arrows/arrows_f.png",
        this.mIcon.draw(aCamera);
    if (this.isActive)
        this.mMessageBox.draw(aCamera);
};

Arm.prototype.getIcon = function () {
    return this.mIcon;
};

Arm.prototype.getCurrentNum = function () {
    return this.mCurrentNum;
};

Arm.prototype.getMoreArm = function (inc) {
    this.mCurrentNum += inc;
    if (this.mCurrentNum >= 100)
        this.mCurrentNum = 99;
};

Arm.prototype.useArm = function (dec) {
    this.mCurrentNum -= dec;
    if (this.mCurrentNum < 0)
        this.mCurrentNum = 0;
};

Arm.prototype.setActive = function () {
    this.isActive = 1;
    var tempStr = Arm.eMsgString[this.mOrder];
    this.mMessageBox = new FontRenderable(tempStr.concat(this.mCurrentNum.toString()));
    this.mMessageBox.setColor([1, 0, 0, 1]);
    this.mMessageBox.getXform().setPosition(this.XPos - 24, this.YPos - 36);
    this.mMessageBox.getXform().setSize(0, 0);
    this.mMessageBox.setTextHeight(5);
};

Arm.prototype.setInactive = function () {
    this.isActive = 0;
    this.mMessageBox = null;
};