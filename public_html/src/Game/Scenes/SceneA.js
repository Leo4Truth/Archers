"use strict";

function SceneA(game, place, sky) {
    this.mGame = game;

    this.mPlace = place;
    this.mSky = sky;

    //GameObjectSets
    this.mAllObjs = null;   //All GameObject
    this.mAllObstacles = null; // All Obstacles which cant be destroyed
    this.mDestroyable = null; // All objects that can be shot

    this.mProps = null;

    this.mBackground = null;

    this.mCollisionInfos = [];
}
gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
    Background.loadAssets();

    Player.loadAssets();
    Archer.loadAssets();
    Arrow.loadAssets();

    HpBar.loadAssets();
    ShootController.loadAssets();
    PlayerMark.loadAssets();

    Armory.loadAssets();
    Arm.loadAssets();

    Buff.loadAssets();
    ParticleSystem.loadAssets();

    Bow.loadAssets();
    LifePotion.loadAssets();
    Mine.loadAssets();

    gEngine.Textures.loadTexture(Background.eAssets.eEasternCityTexture);
    gEngine.Textures.loadTexture(Background.eAssets.eOutskirtsTexture);
    gEngine.Textures.loadTexture(Background.eAssets.eTownTexture);
    gEngine.Textures.loadTexture(Background.eAssets.eSkyCloudyTexture);
    gEngine.Textures.loadTexture(Background.eAssets.eSkyNightCloudyTexture);
};

SceneA.prototype.unloadScene = function () {
    Background.unloadAssets();

    Player.unloadAssets();
    Archer.unloadAssets();
    Arrow.unloadAssets();

    HpBar.unloadAssets();
    ShootController.unloadAssets();
    PlayerMark.unloadAssets();

    Armory.unloadAssets();
    Arm.unloadAssets();

    Buff.unloadAssets();
    ParticleSystem.unloadAssets();

    Bow.unloadAssets();
    LifePotion.unloadAssets();
    Mine.unloadAssets();

    gEngine.Textures.unloadTexture(Background.eAssets.eSkyCloudyTexture);
    gEngine.Textures.unloadTexture(Background.eAssets.eSkyNightCloudyTexture);

    gEngine.Textures.unloadTexture(Background.eAssets.eTownTexture);
    gEngine.Textures.unloadTexture(Background.eAssets.eEasternCityTexture);
    gEngine.Textures.unloadTexture(Background.eAssets.eOutskirtsTexture);

    var nextLevel;
    switch (this.mGame.getState()) {
        case Game.eGameState.ePlayer1_Win: {
            this.mGame.setState(Game.eGameState.eGameOver);
            nextLevel = new GameOver1(this.mGame);
            this.mGame.mCurrentScene = nextLevel;
            gEngine.Core.startScene(nextLevel);
            break;
        }
        case Game.eGameState.ePlayer2_Win: {
            this.mGame.setState(Game.eGameState.eGameOver);
            nextLevel = new GameOver2(this.mGame);
            this.mGame.mCurrentScene = nextLevel;
            gEngine.Core.startScene(nextLevel);
            break;
        }
    }
};


SceneA.prototype.initialize = function () {
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mAllObjs = new GameObjectSet();
    this.mAllObstacles = new GameObjectSet();
    this.mDestroyable = new GameObjectSet();

    this.mProps = new GameObjectSet();

    this.mBackground = new Background(this.mPlace, this.mSky);

    this.mGame.initialize(this.mAllObjs, this.mAllObstacles, this.mDestroyable, this.mBackground);

    this.createBounds();

    // Players
    var player;

    player = this.mGame.getPlayerAt(0);
    this.mAllObjs.addToSet(player.getArcher());
    this.mAllObstacles.addToSet(player.getArcher());

    player = this.mGame.getPlayerAt(1);
    this.mAllObjs.addToSet(player.getArcher());
    this.mAllObstacles.addToSet(player.getArcher());

    // Props
    var i, tempX, tempY;
    for (i = 0; i < 2; i++) {
        tempX = Game.random(0, 480) - 240;
        tempY = Game.random(110, 170) - 70;
        var lifePotion = LifePotion.randomLifePotion(
            tempX, tempY,
            this.mAllObjs, this.mAllObstacles, this.mDestroyable
        );
        this.mAllObjs.addToSet(lifePotion);
        this.mDestroyable.addToSet(lifePotion);
        this.mProps.addToSet(lifePotion);
        lifePotion = LifePotion.randomLifePotion(
            -tempX, tempY,
            this.mAllObjs, this.mAllObstacles, this.mDestroyable
        );
        this.mAllObjs.addToSet(lifePotion);
        this.mDestroyable.addToSet(lifePotion);
        this.mProps.addToSet(lifePotion);
    }

    for (i = 0; i < 2; i++) {
        tempX = Game.random(0, 480) - 240;
        tempY = Game.random(110, 170) - 70;
        var newBow = Bow.randomBow(tempX, tempY);
        this.mAllObjs.addToSet(newBow);
        this.mDestroyable.addToSet(newBow);
        this.mProps.addToSet(newBow);
        newBow = Bow.randomBow(-tempX, tempY);
        this.mAllObjs.addToSet(newBow);
        this.mDestroyable.addToSet(newBow);
        this.mProps.addToSet(newBow);
    }

    newBow = new Bow(-200, 100, Arm.eArmNum.ePuncturingArrow, 2, 50);
    this.mAllObjs.addToSet(newBow);
    this.mDestroyable.addToSet(newBow);
    this.mProps.addToSet(newBow);

    newBow = new Bow(200, 100, Arm.eArmNum.ePuncturingArrow, 2, 50);
    this.mAllObjs.addToSet(newBow);
    this.mDestroyable.addToSet(newBow);
    this.mProps.addToSet(newBow);
};

SceneA.prototype.update = function () {
    if(gEngine.AudioClips.isBackgroundAudioPlaying() === false)
        gEngine.AudioClips.playBackgroundAudio(Background.eAudio.eBgm_1);

    this.mGame.update();
    this.mAllObjs.update(this.mGame.getCurrentPlayer().getMainCamera());

    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
};

SceneA.prototype.draw = function () {
    gEngine.Core.clearCanvas([1.0, 1.0, 1.0, 0.0]); // clear to light gray

    var player = this.mGame.getCurrentPlayer();
    player.draw();

    var opponent;
    if (player.mIndex === 0)
        opponent = this.mGame.getPlayerAt(1);
    else if (player.mIndex === 1)
        opponent = this.mGame.getPlayerAt(0);
    opponent.draw();

    this.mCollisionInfos = [];
};

SceneA.prototype.createBounds = function () {
    var x = 15;
    for (x = -250; x <= 250; x += 100) {
        this.platformAt(x, -100, 20, 0, Background.eTerrainAssets.ePlatformTexture);
        this.platformAt(x + 20, -100, 20, 0, Background.eTerrainAssets.ePlatformTexture);
        this.platformAt(x + 40, -100, 20, 0, Background.eTerrainAssets.ePlatformTexture);
        this.platformAt(x + 60, -100, 20, 0, Background.eTerrainAssets.ePlatformTexture);
        this.platformAt(x + 80, -100, 20, 0, Background.eTerrainAssets.ePlatformTexture);
    }

    var y, x, rand;
    for (y = -75; y <= 50; y += 25) {
        for (x = -250; x <= 250; ) {
            rand = Game.random(20, (y + 360) / 3);
            x += rand;
            this.platformAt(x, y, 20, 0, Background.eTerrainAssets.ePlatformTexture);
        }
    }
};

SceneA.prototype.wallAt = function (x, y, w, texture) {
    var h = w * 4;
    var p = new TextureRenderable(texture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);

    //g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    this.mAllObjs.addToSet(g);
    this.mAllObstacles.addToSet(g);
};

SceneA.prototype.platformAt = function (x, y, w, rot, texture) {
    var h = w / 8;
    var p = new TextureRenderable(texture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);

    //g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mAllObjs.addToSet(g);
    this.mAllObstacles.addToSet(g);
};