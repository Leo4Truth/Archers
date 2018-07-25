"use strict";

function SceneA() {
    this.kArrowSprite = "assets/arrows/arrows_a.png";
    this.kLifePotionTexture = "assets/props/lifePotion.png";
    this.kArcherMaleTextures = {
        file_stand_left: "assets/archerNew/stand_left.png",
        file_stand_right: "assets/archerNew/stand_right.png",
        file_walk_left: "assets/archerNew/walk_left.png",
        file_walk_right: "assets/archerNew/walk_right.png",
        file_shoot_left: "assets/archerNew/shoot_left.png",
        file_shoot_right: "assets/archerNew/shoot_right.png"
    };

    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";

    // The camera to view the scene
    this.mCamera = null;

    this.mArcherMale = null;
    this.mArrow = null;
    this.mLifePotion = null;
    this.mAllObjs = null;
    this.mCollisionInfos = [];
}

gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kArrowSprite);
    gEngine.Textures.loadTexture(this.kLifePotionTexture);

    gEngine.Textures.loadTexture(this.kArcherMaleTextures.file_stand_left);
    gEngine.Textures.loadTexture(this.kArcherMaleTextures.file_stand_right);
    gEngine.Textures.loadTexture(this.kArcherMaleTextures.file_walk_left);
    gEngine.Textures.loadTexture(this.kArcherMaleTextures.file_walk_right);
    gEngine.Textures.loadTexture(this.kArcherMaleTextures.file_shoot_left);
    gEngine.Textures.loadTexture(this.kArcherMaleTextures.file_shoot_right);

    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
};

SceneA.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kArrowSprite);
    gEngine.Textures.unloadTexture(this.kLifePotionTexture);

    gEngine.Textures.unloadTexture(this.kArcherMaleTextures.file_stand_left);
    gEngine.Textures.unloadTexture(this.kArcherMaleTextures.file_stand_right);
    gEngine.Textures.unloadTexture(this.kArcherMaleTextures.file_walk_left);
    gEngine.Textures.unloadTexture(this.kArcherMaleTextures.file_walk_right);
    gEngine.Textures.unloadTexture(this.kArcherMaleTextures.file_shoot_left);
    gEngine.Textures.unloadTexture(this.kArcherMaleTextures.file_shoot_right);

    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
};


SceneA.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mAllObjs = new GameObjectSet();

    this.createBounds();
    this.mArcherMale = new Archer(20, 40, 12, 14, this.kArcherMaleTextures, this.mAllObjs);
    this.mArrow = new Arrow(20, 60, 10, 15, this.kArrowSprite, this.mAllObjs);
    this.mLifePotion = new LifePotion(50, 80, this.kLifePotionTexture);
    this.mAllObjs.addToSet(this.mArcherMale);
    this.mAllObjs.addToSet(this.mArrow);
    this.mAllObjs.addToSet(this.mLifePotion);
};

SceneA.prototype.update = function () {
    this.mAllObjs.update(this.mCamera);
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
};

SceneA.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();

    this.mAllObjs.draw(this.mCamera);
    this.mCollisionInfos = [];
};


SceneA.prototype.createBounds = function () {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x += 30)
        this.platformAt(x, y, w, 0);
    y = 76;
    for (x = 15; x < 120; x += 30)
        this.platformAt(x, y, w, 180);

    this.platformAt(40, 40, 20, -30);
    this.platformAt(60, 30, 20, 0);
    this.platformAt(20, 20, 20, 0);
    this.platformAt(70, 50, 20, 0);

    x = 2;
    w = 3;
    for (y = 8; y < 90; y += 12)
        this.wallAt(x, y, w);
    x = 98;
    for (y = 8; y < 90; y += 12)
        this.wallAt(x, y, w);

    var r = new TextureRenderable(this.kTargetTexture);
    this.mTarget = new GameObject(r);
    var xf = r.getXform();
    xf.setSize(3, 3);
};

SceneA.prototype.wallAt = function (x, y, w) {
    var h = w * 4;
    var p = new TextureRenderable(this.kWallTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRenderable();
    g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    this.mAllObjs.addToSet(g);
};

SceneA.prototype.platformAt = function (x, y, w, rot) {
    var h = w / 8;
    var p = new TextureRenderable(this.kPlatformTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRenderable();
    g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mAllObjs.addToSet(g);
};


