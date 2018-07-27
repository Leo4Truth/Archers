"use strict";

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
    this.mPlayers = [];

    this.mCurrentPlayer = null;

    this.mCurrentState = Game.eGameState.eGameStart;

    this.mCurrentScene = null;

    this.mCurrentScene = new MyMenu(this);
    gEngine.Core.initializeEngineCore('GLCanvas', this.mCurrentScene);
}

Game.prototype.setCurrentPlayer = function (index) {
    this.mCurrentPlayer = this.mPlayers[index];
    if (index === 0) {
        this.eCurrentState = Game.eGameState.ePlayer1_Turn;
        this.mCurrentPlayer.setState(Player.ePlayerState.eReady);
        this.mCurrentPlayer.resetTimer();
        var i;
        for (i = 1000; i > 0; i--)
            this.mCurrentPlayer.resetCamera();
        this.mPlayers[1].setState(Player.ePlayerState.eWait);
    }
    else if (index === 1) {
        this.eCurrentState = Game.eGameState.ePlayer2_Turn;
        this.mCurrentPlayer.setState(Player.ePlayerState.eReady);
        this.mCurrentPlayer.resetTimer();
        var i;
        for (i = 1000; i > 0; i--)
            this.mCurrentPlayer.resetCamera();
        this.mPlayers[0].setState(Player.ePlayerState.eWait);
    }
};

Game.prototype.setState = function (state) {
    this.mCurrentState = state;
};
Game.prototype.getState = function () {
    return this.mCurrentState;
};
Game.prototype.getAllPlayers = function () {
    return this.mPlayers;
};
Game.prototype.getPlayerAt = function (index) {
    return this.mPlayers[index];
};
Game.prototype.getCurrentPlayer = function () {
    return this.mCurrentPlayer;
};

Game.prototype.initialize = function (aAllObjs, aAllObstacles, aDestroyable) {
    this.mPlayers[0] = new Player(this, 0, aAllObjs, aAllObstacles, aDestroyable);
    this.mPlayers[1] = new Player(this, 1, aAllObjs, aAllObstacles, aDestroyable);

    this.setCurrentPlayer(0);
    this.mCurrentPlayer.setState(Player.ePlayerState.eReady);
    this.mCurrentPlayer.resetTimer();
};

Game.prototype.update = function () {
    switch (this.mCurrentState) {
        case Game.eGameState.eGameStart: {
            break;
        }
        case Game.eGameState.ePlayer1_Turn: {
            break;
        }
        case Game.eGameState.ePlayer2_Turn: {
            break;
        }
        case Game.eGameState.ePlayer1_Win: {
            break;
        }
        case Game.eGameState.ePlayer2_Win: {
            break;
        }
        case Game.eGameState.eGamePause: {
            break;
        }
        case Game.eGameState.eGameOver: {
            break;
        }
    }
};

Game.prototype.keyControl = function () {

};
