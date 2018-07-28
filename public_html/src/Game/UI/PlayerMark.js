/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
PlayerMark.eAssets = Object.freeze({
    eMark1: "assets/UI/P1Mark.png",
    eMark2: "assets/UI/P2Mark.png"
});

function PlayerMark(Player) {
    this.kMark = "assets/UI/P" + Player.toString() + "Mark.png";

    this.mMark = new TextureRenderable(this.kMark);
    this.mMark.getXform().setSize(4, 4);
}

PlayerMark.prototype.update = function (Xpos, Ypos) {
    this.mMark.getXform().setPosition(Xpos, Ypos + 10);
};

PlayerMark.prototype.draw = function (mCamera) {
    this.mMark.draw(mCamera);
};