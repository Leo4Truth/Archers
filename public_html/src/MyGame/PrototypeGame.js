"use strict";

function PrototypeGame() {
    this.kArcherSprite = "assets/ManShoot_Sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mAllObjs = null;
    this.mArcher = null;
    this.mTarget = null;
    this.mCollisionInfos = [];
}
gEngine.Core.inheritPrototype(PrototypeGame, Scene);

PrototypeGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kArcherSprite);

    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
};

PrototypeGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kArcherSprite);

    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
};


PrototypeGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mArcher = new Archer(this.kArcherSprite);
    this.mAllObjs = new GameObjectSet();
    //this.createBounds();

    this.mAllObjs.addToSet(this.mArcher);
};

PrototypeGame.prototype.update = function () {
    this.mArcher.keyControl();
    this.mAllObjs.update(this.mCamera);
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
};

PrototypeGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();

    //this.mTarget.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera);
    this.mCollisionInfos = []; 
};


PrototypeGame.prototype.createBounds = function () {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x += 30)
        this.platformAt(x, y, w, 0);
    y = 76;
    for (x = 15; x < 120; x += 30)
        this.platformAt(x, y, w, 180);

    this.platformAt(40, 40, 20, 0);
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

PrototypeGame.prototype.wallAt = function (x, y, w) {
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

PrototypeGame.prototype.platformAt = function (x, y, w, rot) {
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
