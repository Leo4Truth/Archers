"use strict"

Game.eGameState = Object.freeze({
    eGameStart: 0,
    ePlayer1_Turn: 1,
    ePlayer2_Turn: 2,
    ePlayer1_Win: 3,
    ePlayer2_Win: 4,
    eGamePause: 5,
    eGameOver: 6
});

function Game() {
    this.mPlayer1 = null;
    this.mPlayer2 = null;

    this.mCurrentPlayer = null;

    this.mCurrentState = Game.eGameState.eGameStart;
};

Game.prototype.update = function() {

};

Game.prototype.keyControl = function() {
    switch (this.mCurrentState) {
        case eGameStart: {
            break;
        }
        case ePlayer1_Turn: {
            break;
        }
        case ePlayer2_Turen: {

        }
    }
};
