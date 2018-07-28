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

    this.mCurrentState = null;

    this.mCurrentScene = null;

    this.mCurrentState = Game.eGameState.eGameStart;
    this.mCurrentScene = new MyMenu(this);
    gEngine.Core.initializeEngineCore('GLCanvas', this.mCurrentScene);
}

Game.prototype.setCurrentPlayer = function (index) {
    this.mCurrentPlayer = this.mPlayers[index];
    this.mCurrentPlayer.setState(Player.ePlayerState.eReady);
    this.mCurrentPlayer.resetTimer();
    this.mCurrentPlayer.resetCamera();
    var i;
    if (index === 0) {
        this.mPlayers[1].setState(Player.ePlayerState.eWait);
        this.mCurrentState = Game.eGameState.ePlayer1_Turn;
    }
    else if (index === 1) {
        this.mPlayers[0].setState(Player.ePlayerState.eWait);
        this.mCurrentState = Game.eGameState.ePlayer2_Turn;
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

Game.prototype.initialize = function (aAllObjs, aAllObstacles, aDestroyable, aBackground) {
    this.mPlayers[0] = new Player(this, 0, aAllObjs, aAllObstacles, aDestroyable, aBackground);
    this.mPlayers[1] = new Player(this, 1, aAllObjs, aAllObstacles, aDestroyable, aBackground);

    this.setCurrentPlayer(0);
    this.mCurrentPlayer.resetTimer();
};

Game.prototype.update = function () {
    //this.mCurrentPlayer.update();
    this.mPlayers[0].update();
    this.mPlayers[1].update();
    switch (this.mCurrentState) {
        case Game.eGameState.eGameStart: {
            if (this.mCurrentPlayer.getCurrentState() === Player.ePlayerState.eReady) {
                this.mCurrentState = Game.eGameState.ePlayer1_Turn;
                this.setCurrentPlayer(0);
            }
            break;
        }
        case Game.eGameState.ePlayer1_Turn: {
            switch (this.mCurrentPlayer.getCurrentState()) {
                case Player.ePlayerState.eWait: {
                    this.setCurrentPlayer(1);
                    break;
                }
                case Player.ePlayerState.eDie: {
                    this.mCurrentState = Game.eGameState.ePlayer2_Win;
                    gEngine.GameLoop.stop();
                    break;
                }
            }
            break;
        }
        case Game.eGameState.ePlayer2_Turn: {
            switch (this.mCurrentPlayer.getCurrentState()) {
                case Player.ePlayerState.eWait: {
                    this.setCurrentPlayer(0);
                    break;
                }
                case Player.ePlayerState.eDie: {
                    this.mCurrentState = Game.eGameState.ePlayer1_Win;
                    gEngine.GameLoop.stop();
                    break;
                }
            }
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
