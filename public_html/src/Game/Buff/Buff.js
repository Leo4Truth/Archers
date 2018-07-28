"use strict";

function Buff(player, lastTime, texture) {
    this.mLastTime = lastTime;
    this.mVisible = new SpriteAnimateRenderable(texture);
}

Buff.prototype.effect = function () {
};