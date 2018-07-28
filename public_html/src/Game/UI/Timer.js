/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
;
function Timer() {
    this.mTime = 0;
    this.mTimeShow = 20;
    this.mTextbox = new FontRenderable(this.mTimeShow.toString());
    this.mTextbox.setColor([1, 0, 0, 1]);
    this.mTextbox.getXform().setPosition(0, 0);
    this.mTextbox.getXform().setSize(0, 0);
    this.mTextbox.setTextHeight(3);

}
Timer.prototype.setZero = function () {
    this.mTime = 0;
    this.mTimeShow = 20;
};

Timer.prototype.TimeUpdate = function (time) {
    if(time - this.mTime > 1)  {
        this.mTime++;
        this.mTimeShow--;
    }
    var zeroStr = "0";
    if (this.mTimeShow < 10)
        this.mTextbox.setText(zeroStr.concat(this.mTimeShow.toString()));
    else
        this.mTextbox.setText(this.mTimeShow.toString());

};

