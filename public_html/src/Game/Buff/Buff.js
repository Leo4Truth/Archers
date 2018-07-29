"use strict";

function Buff(remainTurns, texture) {
    this.mPlayer = null;
    this.mStartTurns = null;
    this.mCurrentTurns = null;
    this.mEndTurns = null;
    //this.mVisible = new SpriteAnimateRenderable(texture);
}

Buff.prototype.initialize = function (player, startTurns, remainTurns) {
    this.mPlayer = player;
    this.mStartTurns = startTurns;
    this.mCurrentTurns = startTurns;
    this.mEndTurns = startTurns + remainTurns;
};

Buff.prototype.update = function (currentTurns) {
    if (this.mCurrentTurns < currentTurns) {
        this.mCurrentTurns++;
        if (this.mPlayer.mIndex === 0) {
            if (this.mCurrentTurns % 2 === 1) {
                this.effect();
            }
        }
        else if (this.mPlayer.mIndex === 1) {
            if (this.mCurrentTurns % 2 === 0) {
                this.effect();
            }
        }
    }
};

Buff.prototype.effect = function () {
    this.mPlayer.getArcher().loseHp(1);
};

Buff.prototype.end = function () {
    var index = this.mPlayer.mBuffSet.indexOf(this);
    if (index > -1)
        this.mPlayer.mBuffSet.splice(index, 1);
};

