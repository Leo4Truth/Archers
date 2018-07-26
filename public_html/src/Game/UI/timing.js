/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
;
function Timing() {
    this.time = 0; 
    this.timeShowed = 9; 
    this.mTextbox = new FontRenderable(this.timeShowed.toString());
    this.mTextbox.setColor([1, 0, 0, 1]);
    this.mTextbox.getXform().setPosition(0, 0);
    this.mTextbox.getXform().setSize(0, 0);
    this.mTextbox.setTextHeight(5);
   
};


Timing.prototype.setZero = function () {
    this.time = 0;
    this.timeShowed = 9;
};

Timing.prototype.TimeUpdate = function (time) {
    if(time - this.time > 1)
    {
        this.time ++; 
        this.timeShowed --;
    }
    this.mTextbox.setText(this.timeShowed.toString());
};

