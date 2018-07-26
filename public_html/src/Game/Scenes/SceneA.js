"use strict";

function SceneA(game) {
    this.mGame = game;

    this.kLifePotionTexture = "assets/props/lifePotion.png";

    this.kPlatformTexture = "assets/terrains/platform.png";
    this.kWallTexture = "assets/terrains/wall.png";

    //GameObjectSets
    this.mAllObjs = null;   //All GameObject
    this.mAllObstacles = null; // All Obstacles which cant be destroyed
    this.mDestroyable = null; // All objects that can be shot

    this.mLifePotion = null;

    this.mCollisionInfos = [];
}
gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(Arrow.eAssets.eNormalArrowTexture);
    gEngine.Textures.loadTexture(this.kLifePotionTexture);
    gEngine.Textures.loadTexture(ShootController.eAssets.eShootDirArrowTexture);

    gEngine.Textures.loadTexture(Archer.eAssets.eShootLeftTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eShootRightTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eStandLeftTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eStandRightTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eWalkLeftTexture);
    gEngine.Textures.loadTexture(Archer.eAssets.eWalkRightTexture);

    gEngine.Textures.loadTexture(Armory.eAssets.eBackgroundTexture);
    gEngine.Textures.loadTexture(Armory.eAssets.eCellTexture);
    gEngine.Textures.loadTexture(Armory.eAssets.eCheckMarkTexture);
    gEngine.Textures.loadTexture(HpBar.eAssets.eRedHeart);

    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
};

SceneA.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(Arrow.eAssets.eNormalArrowTexture);
    gEngine.Textures.unloadTexture(this.kLifePotionTexture);
    gEngine.Textures.unloadTexture(ShootController.eAssets.eShootDirArrowTexture);

    gEngine.Textures.unloadTexture(Archer.eAssets.eShootLeftTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eShootRightTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eStandLeftTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eStandRightTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eWalkLeftTexture);
    gEngine.Textures.unloadTexture(Archer.eAssets.eWalkRightTexture);

    gEngine.Textures.unloadTexture(Armory.eAssets.eBackgroundTexture);
    gEngine.Textures.unloadTexture(Armory.eAssets.eCellTexture);
    gEngine.Textures.unloadTexture(Armory.eAssets.eCheckMarkTexture);
    gEngine.Textures.unloadTexture(HpBar.eAssets.eRedHeart);

    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);

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

    this.mGame.initialize(this.mAllObjs, this.mAllObstacles, this.mDestroyable);

    this.createBounds();

    var player;

    player = this.mGame.getPlayerAt(0);
    this.mAllObjs.addToSet(player.getArcher());
    this.mAllObstacles.addToSet(player.getArcher());

    player = this.mGame.getPlayerAt(1);
    this.mAllObjs.addToSet(player.getArcher());
    this.mAllObstacles.addToSet(player.getArcher());

    this.mLifePotion = new LifePotion(50, 8, this.kLifePotionTexture);
    this.mAllObjs.addToSet(this.mLifePotion);
    this.mDestroyable.addToSet(this.mLifePotion);
};

SceneA.prototype.update = function () {
    this.mGame.getCurrentPlayer().update();
    this.mAllObjs.update(this.mGame.getCurrentPlayer().getMainCamera());
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);

    switch (this.mGame.getState()) {
        case Game.eGameState.ePlayer1_Win:
        case Game.eGameState.ePlayer2_Win: {
            gEngine.GameLoop.stop();
            break;
        }
    }
};

SceneA.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    var i;
    for (i = 0; i < this.mGame.getAllPlayers().length; i++) {
        var player = this.mGame.getPlayerAt(i);
        player.draw();
    }

    this.mCollisionInfos = [];
};

SceneA.prototype.createBounds = function () {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x += 30)
        this.platformAt(x, y, w, 0);
    y = 76;

    this.platformAt(30, 40, 20, 0);
    this.platformAt(60, 30, 20, 0);
    this.platformAt(20, 20, 20, 0);
    this.platformAt(70, 50, 20, 0);
    this.platformAt(-20, 10, 30, 0);
    this.platformAt(90, 15, 30, 0);
};

SceneA.prototype.wallAt = function (x, y, w) {
    var h = w * 4;
    var p = new TextureRenderable(this.kWallTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);

    g.toggleDrawRigidShape();

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

    g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mAllObjs.addToSet(g);
    this.mAllObstacles.addToSet(g);
};
