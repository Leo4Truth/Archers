"use strict";

function GameOver1(game) {
    this.mGame = game;
    this.kGameOverTitle = "assets/gameover/gameover.png";
    this.kRestart = "assets/gameover/restart.png";
    this.kQuit = "assets/gameover/quit.png";
    this.kBackground = "assets/menu/MenuBackground.png";
    this.kP1Win = "assets/gameover/P1Win.png";


    this.mAllObject = null;
    this.mGameOverTitle = null;
    this.mRestart = null;
    this.mQuit = null;
    this.mLevelBackground = null;
    this.mP1Win = null;
    //Camera
    this.mCamera = null;

    //Next scene
    this.mNext = null;
    //option
    this.mOption = 0;
}

gEngine.Core.inheritPrototype(GameOver1, Scene);

GameOver1.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kGameOverTitle);
    gEngine.Textures.loadTexture(this.kRestart);
    gEngine.Textures.loadTexture(this.kBackground);
    gEngine.Textures.loadTexture(this.kQuit);
    gEngine.Textures.loadTexture(this.kP1Win);
};


GameOver1.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kGameOverTitle);
    gEngine.Textures.unloadTexture(this.kRestart);
    gEngine.Textures.unloadTexture(this.kQuit);
    gEngine.Textures.unloadTexture(this.kBackground);
    gEngine.Textures.unloadTexture(this.kP1Win);
    if (this.mOption === 0) {
        var skyRandom = Math.floor(Game.random(0, 1.8));
        var placeRandom = Math.floor(Game.random(0, 2.8));

        var nextLevel = new SceneA(this.mGame, placeRandom, skyRandom);
        console.log(nextLevel);
        gEngine.Core.startScene(nextLevel);
        this.mGame.mCurrentScene = nextLevel;
    }
    else
        this.mNext = new MyMenu(this.mGame);
    gEngine.Core.startScene(this.mNext);
    this.mGame.mCurrentScene = this.mNext;
};

GameOver1.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(80, 40),
        200,
        [0, 0, 1600, 800]
    );
    this.mLevelBackground = new LevelBackground(this.kBackground); // with parameter for the background Texture
    this.mLevelBackground.getObjectAt(0).getXform().setPosition(80, 40);
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mAllObject = new GameObjectSet();

    this.mGameOverTitle = new TextureRenderable(this.kGameOverTitle);
    this.mGameOverTitle.getXform().setPosition(80, 40);
    this.mGameOverTitle.getXform().setSize(120, 30);
    this.mAllObject.addToSet(this.mGameOverTitle);

    this.mRestart = new TextureRenderable(this.kRestart);
    this.mRestart.getXform().setPosition(80, 25);
    this.mRestart.getXform().setSize(100, 25);
    this.mAllObject.addToSet(this.mRestart);

    this.mQuit = new TextureRenderable(this.kQuit);
    this.mQuit.getXform().setPosition(80, 10);
    this.mQuit.getXform().setSize(80, 20);
    this.mAllObject.addToSet(this.mQuit);

    this.mP1Win = new TextureRenderable(this.kP1Win);
    this.mP1Win.getXform().setSize(200, 50);
    this.mP1Win.getXform().setPosition(40, 60);
    this.mP1Win.getXform().setRotationInRad(0.5);
    this.mAllObject.addToSet(this.mP1Win);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
};

GameOver1.prototype.update = function () {
    this.mAllObject.update();

    if (this.mOption === 0 && gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        this.mRestart.getXform().setSize(80, 20);
        this.mQuit.getXform().setSize(100, 25);
        this.mOption = 1;
    }

    if (this.mOption === 1 && gEngine.Input.isKeyClicked(gEngine.Input.keys.W)) {
        this.mQuit.getXform().setSize(80, 20);
        this.mRestart.getXform().setSize(100, 25);
        this.mOption = 0;
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        gEngine.GameLoop.stop();
    }
};

GameOver1.prototype.draw = function () {
    this.mCamera.setupViewProjection();
    this.mLevelBackground.draw(this.mCamera);
    this.mAllObject.draw(this.mCamera);
};