/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
PlayerMark.eAssets = Object.freeze({
    eMark1:  "assets/UI/P1Mark.png",
    eMark2:  "assets/UI/P2Mark.png"
});

function PlayerMark(Player){
    this.kMark1 = "assets/UI/P"+ Player.toString() + "Mark.png";

    this.mMark1 = new TextureRenderable(this.kMark1);
    this.mMark1.getXform().setSize(4, 4);
};

PlayerMark.prototype.update = function(P1Xpos, P1Ypos) {
    this.mMark1.getXform().setPosition(P1Xpos, P1Ypos + 10);
};

PlayerMark.prototype.unload = function() {
    gEngine.Textures.unloadTexture(this.kMark1);
};

PlayerMark.prototype.draw = function(mCamera){
    this.mMark1.draw(mCamera);
};