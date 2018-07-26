/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

HPBar.eAssets = Object.freeze({
    eRedHeart: "assets/UI/redHeart.png"
})

function HPBar(archer) {
    this.mArcher = archer;
    this.mHpBar = [];
    this.mMaxHp = 10;
    this.mSize = 10;
    this.Xpos = 1000;
    this.Ypos = 1100;

    GameObjectSet.call(this);

    var i = 0;
    for(i = 0; i < this.mMaxHp; i++)
    {
        var newHp = new TextureRenderable(HPBar.eAssets.eRedHeart);
        newHp.setColor([1, 1, 1, 0]);
        newHp.getXform().setSize(this.mSize, this.mSize);
        newHp.getXform().setPosition(this.Xpos + i * 10, this.Ypos);
        this.mHpBar.push(newHp);
    }
}

HPBar.prototype.getHPBar = function() {
    return this.mHpBar;
};

HPBar.prototype.update = function() {
    ;
};

HPBar.prototype.draw = function(aCamera) {
    var i;
    for (i = 0; i < this.mHpBar.length; i++) {
        this.mHpBar[i].draw(aCamera);
    }
};

HPBar.prototype.loseHp = function(dec) {
    var i;
    for(i = 0; i < dec && this.mArcher.getHp() >= 0; i++ )
    //if (this.mArcher.getHp() >= 0)
        this.mHpBar.pop();
    console.log("lose: " + this.mHpBar);
    console.log("lose: " + this.mHpBar.length);
};

HPBar.prototype.addHp = function(inc) {
    var newHp = null;
    var i;
    //if (this.mArcher.getHp() <= 10) 
    for(i = 0; i < inc && this.mArcher.getHp() <= 10; i++){
        var newHp = new TextureRenderable(HPBar.eAssets.eRedHeart);
        newHp.setColor([1, 1, 1, 0]);
        newHp.getXform().setSize(this.mSize, this.mSize);
        newHp.getXform().setPosition(this.Xpos + (this.mArcher.getHp() - 1) * 10, this.Ypos);
        this.mHpBar.push(newHp);
    }
    console.log("add: " + this.mHpBar);
    console.log("add: " + this.mHpBar.length);
};

HPBar.prototype.getHp = function() { return this.hp; };

