"use strict";

function SceneA(game, place, sky) {
    this.mGame = game;

    this.mPlace = place;
    this.mSky = sky;

    this.kLifePotionTexture = "assets/props/lifePotion.png";

    this.kPlatformTexture = "assets/terrains/platform.png";
    this.kWallTexture = "assets/terrains/wall.png";

    this.kBgm = "assets/sounds/bgm.mp3";
    this.kShootCue = "assets/sounds/ShootSound.mp3";

    //GameObjectSets
    this.mAllObjs = null;   //All GameObject
    this.mAllObstacles = null; // All Obstacles which cant be destroyed
    this.mDestroyable = null; // All objects that can be shot

    this.mLifePotion = null;

    this.mBackground = null;

    this.mCollisionInfos = [];
}
gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(Player.eAssets.eViewFrameTexture);

    gEngine.Textures.loadTexture(this.kLifePotionTexture);
    gEngine.Textures.loadTexture(ShootController.eAssets.eShootDirArrowTexture);

    gEngine.Textures.loadTexture(Archer.eAssets.eShootLeftTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eShootRightTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eStandLeftTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eStandRightTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eWalkLeftTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eWalkRightTexture);

    gEngine.Textures.loadTexture(Arrow.eAssets.eNormalArrowTexture);
    gEngine.Textures.loadTexture(PaperPlane.eAssets.ePaperPlaneTexture);
    gEngine.Textures.loadTexture(Arrow.eAssets.eBouncingArrowTexture);
    gEngine.Textures.loadTexture(Arrow.eAssets.eScreamingChickenArrowTexture);
    gEngine.Textures.loadTexture(Arrow.eAssets.eScreamingChickenTexture);

    gEngine.Textures.loadTexture(Armory.eAssets.eBackgroundTexture);
    gEngine.Textures.loadTexture(Armory.eAssets.eCellTexture);
    gEngine.Textures.loadTexture(Armory.eAssets.eCheckMarkTexture);

    gEngine.Textures.loadTexture(Arm.eIconAssets.eNormalArrow);
    gEngine.Textures.loadTexture(Arm.eIconAssets.ePaperPlane);
    gEngine.Textures.loadTexture(Arm.eIconAssets.eBouncingArrow);

    gEngine.Textures.loadTexture(HpBar.eAssets.eRedHeart);
    gEngine.Textures.loadTexture(PlayerMark.eAssets.eMark1);
    gEngine.Textures.loadTexture(PlayerMark.eAssets.eMark2);

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

    gEngine.Textures.loadTexture("assets/particles/Particle2.png");

    gEngine.AudioClips.loadAudio(this.kBgm);
    gEngine.AudioClips.loadAudio(this.kShootCue);
};

SceneA.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(Player.eAssets.eViewFrameTexture);

    gEngine.Textures.unloadTexture(this.kLifePotionTexture);
    gEngine.Textures.unloadTexture(ShootController.eAssets.eShootDirArrowTexture);
    gEngine.Textures.loadTexture(PlayerMark.eAssets.eMark1);
    gEngine.Textures.loadTexture(PlayerMark.eAssets.eMark2);

    gEngine.Textures.unloadTexture(Archer.eAssets.eShootLeftTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eShootRightTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eStandLeftTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eStandRightTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eWalkLeftTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eWalkRightTexture);

    gEngine.Textures.unloadTexture(Arrow.eAssets.eNormalArrowTexture);
    gEngine.Textures.unloadTexture(PaperPlane.eAssets.ePaperPlaneTexture);
    gEngine.Textures.unloadTexture(Arrow.eAssets.eBouncingArrowTexture);
    gEngine.Textures.unloadTexture(Arrow.eAssets.eScreamingChickenArrowTexture);
    gEngine.Textures.unloadTexture(Arrow.eAssets.eScreamingChickenTexture);

    gEngine.Textures.unloadTexture(Armory.eAssets.eBackgroundTexture);
    gEngine.Textures.unloadTexture(Armory.eAssets.eCellTexture);
    gEngine.Textures.unloadTexture(Armory.eAssets.eCheckMarkTexture);

    gEngine.Textures.unloadTexture(Arm.eIconAssets.eNormalArrow);
    gEngine.Textures.unloadTexture(Arm.eIconAssets.ePaperPlane);
    gEngine.Textures.unloadTexture(Arm.eIconAssets.eBouncingArrow);

    gEngine.Textures.unloadTexture(HpBar.eAssets.eRedHeart);

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

    gEngine.Textures.unloadTexture("assets/particles/Particle2.png");

    gEngine.AudioClips.loadAudio(this.kBgm);
    gEngine.AudioClips.loadAudio(this.kShootCue);
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

    this.mLifePotion = new LifePotion(10, 70, this.kLifePotionTexture);
    this.mAllObjs.addToSet(this.mLifePotion);
    this.mDestroyable.addToSet(this.mLifePotion);
};

SceneA.prototype.update = function () {
    /*
    if(gEngine.AudioClips.isBackgroundAudioPlaying() === false)
        gEngine.AudioClips.playBackgroundAudio(this.kBgm);
    */
    //this.mGame.getCurrentPlayer().update();
    this.mGame.update();
    this.mAllObjs.update(this.mGame.getCurrentPlayer().getMainCamera());
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
};

SceneA.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    var player = this.mGame.getCurrentPlayer();
    player.draw();
    var opponent;
    if (player.mIndex === 0)
        opponent = this.mGame.getPlayerAt(1);
    else if (player.mIndex === 1)
        opponent = this.mGame.getPlayerAt(0);
    /*
    opponent.mHpBarCamera.setupViewProjection();
    opponent.mHpBar.draw(opponent.mHpBarCamera);
    */
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

    for (x = -250; x <= 150; x += 100) {
        this.platformAt(x, -20, 20, 0);
        this.platformAt(x + 40, -40, 20, 0);
        this.platformAt(x + 80, -30, 20, 0);
    }

    for (x = -100; x <= 50; x += 50) {
        this.platformAt(x, -60, 20, 0);
        this.platformAt(x + 30, -50, 20, 0);
        this.platformAt(x + 60, -20, 20, 0);
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
