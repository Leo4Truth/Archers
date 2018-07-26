"use strict"

function UIObjectSet() {
    this.mSet = [];
}

UIObjectSet.prototype.size = function () { return this.mSet.length; };
UIObjectSet.prototype.getObjectAt = function(index) {
    return this.mSet[index];
};
UIObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};
UIObjectSet.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};
UIObjectSet.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};
UIObjectSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update();
    }
};
UIObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};