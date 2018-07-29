"use strict";

Player.eAssets = Object.freeze({
    eViewFrameTexture: "assets/UI/viewFrame.png"
});

Player.eAudio = Object.freeze({
    eShootCue : "assets/sounds/ShootSound.mp3"
});

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
        [-20, -70],
        [40, -70]
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

function Player(game, index, aAllObjs, aAllObstacles, aDestroyable, aBackground) {
    this.mMainCamera = null;
    this.mArmoryCamera = null;
    this.mHpBarCamera = null;
    this.mMinimapCamera = null;

    this.mViewFrame = null;
    this.mSelfMark = null;
    this.mOpponentMark = null;

    this.mBackground = aBackground;

    this.mArcher = null;
    this.mShootController = null;
    this.mArrow = null;
    this.mArmory = null;
    this.mHpBar = null;
    this.mTimer = null;
    this.mTime = 0;
    this.mMark = null;

    this.mAllObjs = aAllObjs;
    this.mObstacle = aAllObstacles;
    this.mDestroyable = aDestroyable;

    this.mGame = game;
    this.mIndex = index;
    this.mCurrentState = Player.ePlayerState.eNotInitialize;
    this.mTurns = null;

    this.mBuffSet = null;

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

Player.prototype.getSpaceLimit = function () {
    return this.mGame.getSpaceLimit();
};

Player.prototype.initialize = function () {
    this.mMainCamera = new Camera(
        vec2.fromValues(
            Player.eAttributes.eOrginPos[this.mIndex][0],
            Player.eAttributes.eOrginPos[this.mIndex][1]
        ),
        180,
        [0, 0, 1200, 800]
    );
    this.mArmoryCamera = new Camera(
        vec2.fromValues(
            Player.eAttributes.eArmoryPos[this.mIndex][0],
            Player.eAttributes.eArmoryPos[this.mIndex][1]
        ),
        60,
        [1200, 40, 400, 560]
    );
    this.mHpBarCamera = new Camera(
        vec2.fromValues(
            Player.eAttributes.eHpBarPos[this.mIndex][0],
            Player.eAttributes.eHpBarPos[this.mIndex][1]
        ),
        100,
        [700 * this.mIndex, 750, 500, 50]
    );

    this.mMinimapCamera = new Camera(
        [0, 0],
        500,
        [1200, 600, 400, 200]
    );

    this.mViewFrame = new TextureRenderable(Player.eAssets.eViewFrameTexture);
    this.mSelfMark = new Renderable();
    this.mOpponentMark = new Renderable();

    this.mArcher = new Archer(
        Player.eAttributes.eOrginPos[this.mIndex][0],
        Player.eAttributes.eOrginPos[this.mIndex][1],
        12, 14,
        this.mAllObjs, this.mAllObstacles, this.mDestroyable,
        this
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
    this.mTimer = new Timer();
    this.mTimer.mTextbox.getXform().setPosition(1100, 1100);
    this.mTimer.mTextbox.getXform().setSize(5, 5);

    this.mMark = new PlayerMark(this.mIndex + 1);

    this.mBuffSet = [];

    this.mCurrentState = Player.ePlayerState.eWait;
};

Player.prototype.update = function () {
    var i;
    for (i = 0; i < this.mBuffSet.length; i++)
        this.mBuffSet[i].update(this.mTurns);

    this.keyControl();
    this.mMark.update(
        this.mArcher.getXform().getPosition()[0],
        this.mArcher.getXform().getPosition()[1]
    );
    this.mShootController.update(
        this.mArcher.getXform().getPosition()[0],
        this.mArcher.getXform().getPosition()[1],
        this.mArcher.getCurrentFrontDir()
    );
    this.mArmory.update();
    this.mHpBar.update();

    // for arrows' effect
    if (this.mArrow && this.mArrow.getCurrentState() === Arrow.eArrowState.eHit)
        this.mArrow.update();
    if (this.mArrow && this.mArrow instanceof PuncturingArrow)
        this.mArrow.update();
    /*
    if (this.mArrow && this.mArrow instanceof PuncturingArrow)
        this.mArrow.update();
    if (this.mArrow && this.mArrow instanceof PaperPlane && this.mArrow.getCurrentState() === Arrow.eArrowState.eHit)
        this.mArrow.update();
    if (this.mArrow && this.mArrow instanceof ScreamingChickenArrow && this.mArrow.isChicken())
        this.mArrow.update();
        */
    if (this.mCurrentState === Player.ePlayerState.eShoot &&
        this.mArrow && (
            this.mArrow.getCurrentState() === Arrow.eArrowState.eHit ||
            this.mArrow.getCurrentState() === Arrow.eArrowState.eMiss ||
            this.mArrow.getCurrentState() === Arrow.eArrowState.eEffect
        )
    ) {
        if (this.mArrow.getCurrentState() === Arrow.eArrowState.eHit) {
            this.mArcher.setToStand();
        }
        else if (this.mArrow.getCurrentState() === Arrow.eArrowState.eEffect) {
            this.mArrow = null;
            this.mCurrentState = Player.ePlayerState.eWait;
        }
        else if (this.mArrow.getCurrentState() === Arrow.eArrowState.eMiss) {
            this.mArcher.setToStand();

            this.mArrow = null;
            this.mCurrentState = Player.ePlayerState.eWait;
        }
    }

    // Dead Judgement
    if (this.mArcher.getXform().getYPos() > 250 ||
        this.mArcher.getXform().getYPos() < -125 ||
        this.mArcher.getXform().getXPos() < -250 ||
        this.mArcher.getXform().getXPos() > 250 ||
        this.mArcher.getHp() <= 0) {
        this.mCurrentState = Player.ePlayerState.eDie;
    }
};

Player.prototype.keyControl = function () {
    switch (this.mCurrentState) {
        case Player.ePlayerState.eReady: {
            if (this.mTime > 1200) {
                this.resetTimer();
                this.setState(Player.ePlayerState.eWait);
                this.mArcher.setToStand();
                break;
            }
            this.mTime++;
            this.mTimer.TimeUpdate(this.mTime / 60);

            if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
                var isShootSuccess = this.shoot();
                if (isShootSuccess)
                    this.mCurrentState = Player.ePlayerState.eShoot;
            }

            this.moveCamera();
            this.mShootController.keyControl();
            this.mArmory.keyControl();
            this.mArcher.keyControl();

            if (
                gEngine.Input.isKeyPressed(gEngine.Input.keys.A) ||
                gEngine.Input.isKeyPressed(gEngine.Input.keys.D) ||
                gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)
            ) {
                this.resetCamera();
            }

            break;
        }
        case Player.ePlayerState.eShoot: {
            if (this.mArrow.getCurrentState() === Arrow.eArrowState.eFlying)
                this.traceArrow();
            break;
        }
        case Player.ePlayerState.eWait: {
            //this.resetCamera();
            break;
        }
    }
};

Player.prototype.draw = function () {
    var camera;

    if (this.mCurrentState !== Player.ePlayerState.eWait) {
        camera = this.mMainCamera;
        camera.setupViewProjection();
        this.mBackground.draw(camera);

        // space limit display
        var spaceLimitSet = [];
        var spaceLimit = this.mGame.getSpaceLimit();
        var width = 250 - spaceLimit.rightLimit;
        var height = 250 - spaceLimit.upLimit;
        var r = new Renderable();
        r.setColor([1, 0, 0, 0.2]);
        r.getXform().setSize(2 * width, 500);
        r.getXform().setPosition(250, 0);
        spaceLimitSet.push(r);
        r = new Renderable();
        r.setColor([1, 0, 0, 0.2]);
        r.getXform().setSize(2 * width, 500);
        r.getXform().setPosition(-250, 0);
        spaceLimitSet.push(r);
        r = new Renderable();
        r.setColor([1, 0, 0, 0.2]);
        r.getXform().setSize(2 * (250 - width), 2 * height);
        r.getXform().setPosition(0, 250);
        spaceLimitSet.push(r);
        var i;
        for (i = 0; i < spaceLimitSet.length; i++)
            spaceLimitSet[i].draw(camera);

        // for puncturing arrow
        if (this.mArrow && this.mArrow instanceof PuncturingArrow) {
            this.mArrow.draw(camera);
        }
        // for screaming chicken arrow
        if (this.mArrow && this.mArrow instanceof ScreamingChickenArrow && this.mArrow.isChicken()) {
            this.mArrow.draw(camera);
        }

        /*
        var spaceLimit = this.mGame.getSpaceLimit();
        var spaceLimitRenderable = new Renderable();
        spaceLimitRenderable.setColor([1, 0, 0, 0]);
        spaceLimitRenderable.getXform().setPosition(
            (spaceLimit.rightLimit + spaceLimit.leftLimit) / 2,
            (spaceLimit.upLimit + spaceLimit.rightLimit) / 2
        );
        spaceLimitRenderable.getXform().setSize(
            spaceLimit.rightLimit - spaceLimit.leftLimit,
            spaceLimit.upLimit - spaceLimit.rightLimit
        );
        spaceLimitRenderable.draw(camera);
        */

        this.mAllObjs.draw(camera);
        this.mMark.draw(camera);
        this.mShootController.draw(camera);

        /*
        if (this.mArrow instanceof ScreamingChickenArrow &&
            this.mArrow.isChicken()) {
            console.log(
                this.mArrow.getScreamingChicken().getXform().getXPos(),
                this.mArrow.getScreamingChicken().getXform().getYPos()
            );
            this.mArrow.getScreamingChicken().draw(camera);
        }
        */

        camera = this.mArmoryCamera;
        camera.setupViewProjection();
        this.mArmory.draw(camera);

        camera = this.mMinimapCamera;
        camera.setupViewProjection();
        this.mBackground.draw(camera);

        // space limit display
        for (i = 0; i < spaceLimitSet.length; i++)
            spaceLimitSet[i].draw(camera);

        this.mSelfMark.getXform().setPosition(
            this.mArcher.getXform().getXPos(),
            this.mArcher.getXform().getYPos()
        );
        this.mSelfMark.getXform().setSize(12, 14);
        this.mSelfMark.setColor([0, 1, 0, 0.5]);
        this.mSelfMark.draw(camera);

        var opponent;
        if (this.mIndex === 0)
            opponent = this.mGame.getPlayerAt(1);
        else if (this.mIndex === 1)
            opponent = this.mGame.getPlayerAt(0);
        this.mOpponentMark.getXform().setPosition(
            opponent.getArcher().getXform().getXPos(),
            opponent.getArcher().getXform().getYPos()
        );
        this.mOpponentMark.getXform().setSize(12, 14);
        this.mOpponentMark.setColor([1, 0, 0, 0.5]);
        this.mOpponentMark.draw(camera);

        this.mAllObjs.draw(camera);

        // for puncturing arrow
        if (this.mArrow && this.mArrow instanceof PuncturingArrow) {
            this.mArrow.draw(camera);
        }
        // for screaming chicken arrow
        if (this.mArrow && this.mArrow instanceof ScreamingChickenArrow && this.mArrow.isChicken()) {
            this.mArrow.draw(camera);
        }

        var WCcenter = this.mMainCamera.getWCCenter();
        this.mViewFrame.getXform().setPosition(WCcenter[0], WCcenter[1]);
        this.mViewFrame.getXform().setSize(this.mMainCamera.getWCWidth(), this.mMainCamera.getWCHeight());
        this.mViewFrame.draw(camera);
    }

    // always display HP and PlayerMark
    this.mHpBarCamera.setupViewProjection();
    this.mHpBar.draw(this.mHpBarCamera);

    if (this.mCurrentState === Player.ePlayerState.eReady) {
        camera = new Camera(
            [1101, 1099],
            10,
            [550, 700, 100, 100]
        );
        camera.setupViewProjection();
        this.mTimer.mTextbox.draw(camera);
    }
};

Player.prototype.setState = function (state) {
    this.mCurrentState = state;
};

Player.prototype.shoot = function () {
    gEngine.AudioClips.playACue(Player.eAudio.eShootCue);
    
    var pos = this.mArcher.getXform().getPosition();
    var velocity = this.mShootController.getVelocity();
    var offset = new vec2.fromValues(1, 0);
    vec2.normalize(offset, velocity);

    var armChoice = this.mArmory.getCurrentArm();
    switch (armChoice) {
        case -1: {
            break;
        }
        case 0:{
            this.mArrow = new Arrow(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                Arrow.eAssets.eNormalArrowTexture,
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        case 1:{
            this.mArrow = new PaperPlane(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        case 2: {
            this.mArrow = new BouncingArrow(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        case 3: {
            this.mArrow = new Destroyer(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        case 4: {
            this.mArrow = new PuncturingArrow(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        case 5: {
            this.mArrow = new ShockWave(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        case 6: {
            this.mArrow = new ScreamingChickenArrow(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        case 7: {
            this.mArrow = new MineLauncher(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
        default:{
            this.mArrow = new Arrow(
                pos[0] + offset[0] * 10, pos[1] + offset[1] * 10,
                velocity[0], velocity[1],
                this.mAllObjs, this.mObstacle, this.mDestroyable, this
            );
            break;
        }
    }

    if (this.mArrow && !(this.mArrow instanceof PuncturingArrow)) {
        this.mAllObjs.addToSet(this.mArrow);
    }

    if (armChoice === -1)
        return 0;
    else {
        this.mArmory.useArm(1);
        return 1;
    }
};

Player.prototype.moveCamera = function () {
    var mainCameraWCCenter = this.mMainCamera.getWCCenter();
    var newMainCameraWCCenterX = mainCameraWCCenter[0];
    var newMainCameraWCCenterY = mainCameraWCCenter[1];
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        newMainCameraWCCenterY += 20;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        newMainCameraWCCenterY -= 20;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        newMainCameraWCCenterX -= 20;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        newMainCameraWCCenterX += 20;
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.H)) {
        this.resetCamera();
        return;
    }
    if (newMainCameraWCCenterX > 160)
        newMainCameraWCCenterX = 160;
    if (newMainCameraWCCenterX < -160)
        newMainCameraWCCenterX = -160;
    if (newMainCameraWCCenterY > 65)
        newMainCameraWCCenterY = 65;
    if (newMainCameraWCCenterY < -65)
        newMainCameraWCCenterY = -65;
    this.mMainCamera.setWCCenter(newMainCameraWCCenterX, newMainCameraWCCenterY);
    this.mMainCamera.update();
};

Player.prototype.resetCamera = function () {
    var cameraCenterX = this.mArcher.getXform().getXPos();
    var cameraCenterY = this.mArcher.getXform().getYPos();
    if (cameraCenterX > 160)
        cameraCenterX = 160;
    if (cameraCenterX < -160)
        cameraCenterX = -160;
    if (cameraCenterY > 65)
        cameraCenterY = 65;
    if (cameraCenterY < -65)
        cameraCenterY = -65;
    var i;
    for (i = 0; i < 20; i++) {
        this.mMainCamera.setWCCenter(cameraCenterX, cameraCenterY);
        this.mMainCamera.update();
    }
};

Player.prototype.traceArrow = function () {
    if (this.mArrow) {
        var cameraCenterX = this.mArrow.getXform().getXPos();
        var cameraCenterY = this.mArrow.getXform().getYPos();
        if (cameraCenterX > 160)
            cameraCenterX = 160;
        if (cameraCenterX < -160)
            cameraCenterX = -160;
        if (cameraCenterY > 65)
            cameraCenterY = 65;
        if (cameraCenterY < -65)
            cameraCenterY = -65;
        this.mMainCamera.setWCCenter(cameraCenterX, cameraCenterY);
        this.mMainCamera.update();
    }
};

Player.prototype.resetTimer = function () {
    this.mTime = 0;
    this.mTimer.setZero();
};

Player.prototype.getMoreArm = function (armNum, armAmount) {
    this.mArmory.getMoreArm(armNum, armAmount);
};

Player.prototype.incTurns = function () {
    this.mTurns++;
    var spaceLimit = this.mGame.getSpaceLimit();
    if (this.mArcher.getXform().getYPos() > spaceLimit.upLimit ||
        this.mArcher.getXform().getYPos() < spaceLimit.downLimit ||
        this.mArcher.getXform().getXPos() < spaceLimit.leftLimit ||
        this.mArcher.getXform().getXPos() > spaceLimit.rightLimit) {
        if (this.mIndex === 0 && this.mTurns % 2 === 1) {
            this.mArcher.loseHp(2);
        }
        else if (this.mIndex === 1 && this.mTurns % 2 === 0) {
            this.mArcher.loseHp(2);
        }
    }
};

Player.prototype.addBuff = function (buff) {
    buff.initialize(this, this.mTurns, 5);
    this.mBuffSet.push(buff);
    console.log(this.mBuffSet);
};