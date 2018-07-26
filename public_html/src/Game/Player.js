"use strict";

Player.ePlayerState = Object.freeze({
    eWait: 0,
    eReady: 1,
    eShoot: 2,
    eDie: 3,
    eWin: 4,
    eNotInitialize: 5
});

Player.eAttributes = Object.freeze({
    eOrginPos: [
        [40, 50],
        [40, 50]
    ],
    eArmoryPos: [
        [-1000, 0],
        [-1000, 200]
    ],
    eHpBarPos: [
        [-1000, 100],
        [-1000, 300]
    ]
});

function Player(game, index, aAllObjs, aAllObstacles, aDestroyable) {
    this.mMainCamera = null;
    this.mArmoryCamera = null;
    this.mHpBarCamera = null;
    this.mMinimapCamera = null;
    this.mArcher = null;
    this.mShootController = null;
    this.mArrow = null;
    this.mArmory = null;
    this.mHpBar = null;

    this.mAllObjs = aAllObjs;
    this.mObstacle = aAllObstacles;
    this.mDestroyable = aDestroyable;

    this.mGame = game;
    this.mIndex = index;
    this.mCurrentState = Player.ePlayerState.eNotInitialize;

    this.initialize();
}

Player.prototype.setArcher = function (archer) {
    this.mArcher = archer;
};
Player.prototype.setShootController = function (shootController) {
    this.mShootController = shootController;
};
Player.prototype.setArmory = function (armory) {
    this.mArmory = armory;
};
Player.prototype.setHpBar = function (hpBar) {
    this.mHpBar = hpBar;
};
Player.prototype.setObjs = function (aAllObjs, aObstacle, aDestroyable) {
    this.mAllObjs = aAllObjs;
    this.mObstacle = aObstacle;
    this.mDestroyable = aDestroyable;
};

Player.prototype.getPostion = function () {
    return this.mArcher.getXform().getPosition();
};
Player.prototype.getCurrentState = function () {
    return this.mCurrentState;
};
Player.prototype.getMainCamera = function () {
    return this.mMainCamera;
};
Player.prototype.getArmoryCamera = function () {
    return this.mArmoryCamera;
};
Player.prototype.getHpBarCamera = function () {
    return this.mHpBarCamera;
};
Player.prototype.getMinimapCamera = function () {
    return this.mMinimapCamera;
};
Player.prototype.getArcher = function () {
    return this.mArcher;
};
Player.prototype.getShootController = function () {
    return this.mShootController;
};
Player.prototype.getArrow = function () {
    return this.mArrow;
};
Player.prototype.getArmory = function () {
    return this.mArmory;
};
Player.prototype.getHpBar = function () {
    return this.mHpBar;
};

Player.prototype.initialize = function () {
    this.mMainCamera = new Camera(
        vec2.fromValues(
            Player.eAttributes.eOrginPos[this.mIndex][0],
            Player.eAttributes.eOrginPos[this.mIndex][1]
        ),
        200,
        [0, 0, 1300, 800]
    );
    this.mArmoryCamera = new Camera(
        vec2.fromValues(
            Player.eAttributes.eArmoryPos[this.mIndex][0],
            Player.eAttributes.eArmoryPos[this.mIndex][1]
        ),
        60,
        [1300, 0, 300, 420]
    );
    this.mHpBarCamera = new Camera(
        vec2.fromValues(
            Player.eAttributes.eHpBarPos[this.mIndex][0],
            Player.eAttributes.eHpBarPos[this.mIndex][1]
        ),
        100,
        [1300, 420 + 30 * this.mIndex, 300, 30]
    );
    //this.mMinimapCamera = new Camera();

    this.mArcher = new Archer(
        Player.eAttributes.eOrginPos[this.mIndex][0],
        Player.eAttributes.eOrginPos[this.mIndex][1],
        12, 14,
        this.mAllObjs, this.mAllObstacles, this.mDestroyable
    );
    this.mShootController = new ShootController(
        Player.eAttributes.eOrginPos[this.mIndex][0],
        Player.eAttributes.eOrginPos[this.mIndex][1],
        vec2.fromValues(1, 0),
        ShootController.eAssets.eShootDirArrowTexture
    );

    this.mArmory = new Armory(
        Player.eAttributes.eArmoryPos[this.mIndex][0],
        Player.eAttributes.eArmoryPos[this.mIndex][1]
    );
    this.mHpBar = new HpBar(
        Player.eAttributes.eHpBarPos[this.mIndex][0] - 45,
        Player.eAttributes.eHpBarPos[this.mIndex][1],
        this.mArcher
    );

    this.mCurrentState = Player.ePlayerState.eWait;
};

Player.prototype.update = function () {
    this.keyControl();
    this.mShootController.update(
        this.mArcher.getXform().getPosition()[0],
        this.mArcher.getXform().getPosition()[1],
        this.mArcher.getCurrentFrontDir()
    );
    this.mArmory.update();
    this.mHpBar.update();


    if (this.mArcher.getHp() === 0) {
        this.mCurrentState = Player.ePlayerState.eDie;
        if (this.mIndex === 0) {
            this.mGame.getPlayerAt(1).setState(Player.ePlayerState.eWin);
            this.mGame.setState(Game.eGameState.ePlayer2_Win);
        }
        else if (this.mIndex === 1) {
            this.mGame.getPlayerAt(0).setState(Player.ePlayerState.eWin);
            this.mGame.setState(Game.eGameState.ePlayer1_Win);
        }
    }
};

Player.prototype.keyControl = function () {
    switch (this.mCurrentState) {
        case Player.ePlayerState.eReady: {
            if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
                this.shoot();
                this.mCurrentState = Player.ePlayerState.eShoot;
            }

            this.moveCamera();
            this.mShootController.keyControl();
            this.mArmory.keyControl();
            this.mArcher.keyControl();
            break;
        }
        case Player.ePlayerState.eShoot: {
            this.traceArrow();
            if (this.mArrow.getCurrentState() === Arrow.eArrowState.eHit) {
                this.mArcher.setToStand();
                if (this.mIndex === 0)
                    this.mGame.setCurrentPlayer(1);
                else if (this.mIndex === 1)
                    this.mGame.setCurrentPlayer(0);
            }
            else if (this.mArrow.getCurrentState() === Arrow.eArrowState.eMiss) {
                this.mArcher.setToStand();
                if (this.mIndex === 0)
                    this.mGame.setCurrentPlayer(1);
                else if (this.mIndex === 1)
                    this.mGame.setCurrentPlayer(0);
            }
            break;
        }
        case Player.ePlayerState.eWait: {
            break;
        }
    }
};

Player.prototype.draw = function () {
    var camera;

    if (this.mCurrentState !== Player.ePlayerState.eWait) {
        camera = this.mMainCamera;
        camera.setupViewProjection();
        this.mAllObjs.draw(camera);
        this.mShootController.draw(camera);

        camera = this.mArmoryCamera;
        camera.setupViewProjection();
        this.mArmory.draw(camera);
    }

    camera = this.mHpBarCamera;
    camera.setupViewProjection();
    this.mHpBar.draw(camera);
};

Player.prototype.setState = function (state) {
    this.mCurrentState = state;
};

Player.prototype.shoot = function () {
    var pos = this.mArcher.getXform().getPosition();
    var velocity = this.mShootController.getVelocity();
    var offset;
    if (velocity[0] < 0)
        offset = [-2, 2];
    else if (velocity[0] > 0)
        offset = [2, 2];
    else
        offset = [0, 2];
    this.mArrow = new Arrow(
        pos[0] + offset[0], pos[1] + offset[1],
        velocity[0], velocity[1],
        Arrow.eAssets.eNormalArrowTexture,
        this.mAllObjs, this.mObstacle, this.mDestroyable, this.mArcher
    );
    this.mAllObjs.addToSet(this.mArrow);
};

Player.prototype.moveCamera = function () {
    var mainCameraWCCenter = this.mMainCamera.getWCCenter();
    var newMainCameraWCCenterX = mainCameraWCCenter[0];
    var newMainCameraWCCenterY = mainCameraWCCenter[1];
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        newMainCameraWCCenterY += 5;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        newMainCameraWCCenterY -= 5;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        newMainCameraWCCenterX -= 5;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        newMainCameraWCCenterX += 5;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.H)) {
        newMainCameraWCCenterX = this.mArcher.getXform().getXPos();
        newMainCameraWCCenterY = this.mArcher.getXform().getYPos();
        var i;
        for (i = 3; i > 0; i--)
            this.resetCamera();
    }
    this.mMainCamera.setWCCenter(newMainCameraWCCenterX, newMainCameraWCCenterY);
    this.mMainCamera.update();
};

Player.prototype.resetCamera = function () {
    this.mMainCamera.setWCCenter(this.mArcher.getXform().getXPos(), this.mArcher.getXform().getYPos());
    this.mMainCamera.update();
};

Player.prototype.traceArrow = function () {
    this.mMainCamera.setWCCenter(this.mArrow.getXform().getXPos(), this.mArrow.getXform().getYPos());
    this.mMainCamera.update();
};