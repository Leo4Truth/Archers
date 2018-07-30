"use strict";

function SceneA(game, place, sky) {
    this.mGame = game;

    this.mPlace = place;
    this.mSky = sky;

    this.kPlatformTexture = "assets/terrains/platform.png";
    this.kWallTexture = "assets/terrains/wall.png";

    this.kBgm = "assets/sounds/bgm.mp3";    

    //GameObjectSets
    this.mAllObjs = null;   //All GameObject
    this.mAllObstacles = null; // All Obstacles which cant be destroyed
    this.mDestroyable = null; // All objects that can be shot

    this.mLifePotion = null;
    this.mBow = null;

    this.mBackground = null;

    this.mCollisionInfos = [];
}
gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
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


    switch (this.mPlace) {
        case Background.ePlace.eEasternCity: {
            gEngine.Textures.loadTexture(Background.eAssets.eEasternCityTexture);
            break;
        }
        case Background.ePlace.eOutskirts: {
            gEngine.Textures.loadTexture(Background.eAssets.eOutskirtsTexture);
            break;
        }
        case Background.ePlace.eTown: {
            gEngine.Textures.loadTexture(Background.eAssets.eTownTexture);
            break;
        }
    }
    
    switch (this.mSky) {
        case Background.eSky.eCloudy: {
            gEngine.Textures.loadTexture(Background.eAssets.eSkyCloudyTexture);
            break;
        }
        case Background.eSky.eNightCloudy: {
            gEngine.Textures.loadTexture(Background.eAssets.eSkyNightCloudyTexture);
            break;
        }
    }

    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);

    gEngine.AudioClips.loadAudio(this.kBgm);
};

SceneA.prototype.unloadScene = function () {
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

    switch (this.mPlace) {
        case Background.ePlace.eEasternCity: {
            gEngine.Textures.unloadTexture(Background.eAssets.eEasternCityTexture);
            break;
        }
        case Background.ePlace.eOutskirts: {
            gEngine.Textures.unloadTexture(Background.eAssets.eOutskirtsTexture);
            break;
        }
        case Background.ePlace.eTown: {
            gEngine.Textures.unloadTexture(Background.eAssets.eTownTexture);
            break;
        }
    }

    switch (this.mSky) {
        case Background.eSky.eCloudy: {
            gEngine.Textures.unloadTexture(Background.eAssets.eSkyCloudyTexture);
            break;
        }
        case Background.eSky.eNightCloudy: {
            gEngine.Textures.unloadTexture(Background.eAssets.eSkyNightCloudyTexture);
            break;
        }
    }

    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);

    gEngine.AudioClips.unloadAudio(this.kBgm);
    gEngine.AudioClips.stopBackgroundAudio(this.kBgm);

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

    this.mBackground = new Background(this.mPlace, this.mSky);

    this.mGame.initialize(this.mAllObjs, this.mAllObstacles, this.mDestroyable, this.mBackground);

    this.createBounds();

    var player;

    player = this.mGame.getPlayerAt(0);
    this.mAllObjs.addToSet(player.getArcher());
    this.mAllObstacles.addToSet(player.getArcher());

    player = this.mGame.getPlayerAt(1);
    this.mAllObjs.addToSet(player.getArcher());
    this.mAllObstacles.addToSet(player.getArcher());

    var i, tempX, tempY;
    for(i = 0; i < 2; ++i){
        tempX = this.random(0, 900);
        tempY = this.random(0, 170);
        this.mLifePotion = new LifePotion(tempX-500, tempY-70, LifePotion.eAssets.eLifePotionTexture, 2,
                                    this.mAllObjs, this.mAllObstacles, this.mDestroyable);
        this.mAllObjs.addToSet(this.mLifePotion);
        this.mDestroyable.addToSet(this.mLifePotion);
    }

    var tempWeapon, tempAmount;
    for(i = 0; i < 5; ++i){
        tempX = this.random(0, 900);
        tempY = this.random(0, 170);
        tempWeapon = this.random(1, 7);  
        tempAmount = this.random(1, 5);
        this.mBow = new Bow(tempX-500, tempY-70, tempWeapon, tempAmount, 50);
        this.mAllObjs.addToSet(this.mBow);
        this.mDestroyable.addToSet(this.mBow);
    }
    this.mBow = new Bow(0, -90, Arm.eArmNum.ePuncturingArrow, 2, 50);
    this.mAllObjs.addToSet(this.mBow);
    this.mDestroyable.addToSet(this.mBow);

    this.mBow = new Bow(30, -90, Arm.eArmNum.ePuncturingArrow, 2, 50);
    this.mAllObjs.addToSet(this.mBow);
    this.mDestroyable.addToSet(this.mBow);
};

SceneA.prototype.update = function () {
    if(gEngine.AudioClips.isBackgroundAudioPlaying() === false)
        gEngine.AudioClips.playBackgroundAudio(this.kBgm);

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
    for (x = -500; x <= 400; x += 100) {
        this.platformAt(x, -100, 20, 0);
        this.platformAt(x + 20, -100, 20, 0);
        this.platformAt(x + 40, -100, 20, 0);
        this.platformAt(x + 60, -100, 20, 0);
        this.platformAt(x + 80, -100, 20, 0);
    }

    var i, j, plus = 50;
    for(i = 1; i <= 7; ++i, plus += 20){
        for(j = -450; j < 400; j += plus){
            this.platformAt(j, -100 + i * 20, 20, 0);            
        }
    }
};

SceneA.prototype.wallAt = function (x, y, w) {
    var h = w * 4;
    var p = new TextureRenderable(this.kWallTexture);
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

SceneA.prototype.platformAt = function (x, y, w, rot) {
    var h = w / 8;
    var p = new TextureRenderable(this.kPlatformTexture);
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

SceneA.prototype.random = function(min, max) {
    parseInt(Math.random()*(max-min+1)+min,10);
    return Math.floor(Math.random()*(max-min+1)+min);
};
