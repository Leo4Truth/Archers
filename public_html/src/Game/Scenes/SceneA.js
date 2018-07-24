"use strict";

function SceneA() {
    this.kArrowSprite = "assets/arrows/arrows_a.png";
    this.kLifePotionTexture = "assets/favicon.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mArrow = null;
    this.mLifePotion = null;
    this.mAllObjs = null;
    this.mCollisionInfos = [];

    this.mArrowVX = 0;
}

gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kArrowSprite);
    gEngine.Textures.loadTexture(this.kLifePotionTexture);
};

SceneA.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kArrowSprite);
    gEngine.Textures.unloadTexture(this.kLifePotionTexture);
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

    this.mArrow = new Arrow(20, 60, 20, 15, this.kArrowSprite);
    this.mLifePotion = new LifePotion(50, 80, this.kLifePotionTexture);
    this.mAllObjs = new GameObjectSet();
    //this.createBounds();

    this.mAllObjs.addToSet(this.mArrow);
    this.mAllObjs.addToSet(this.mLifePotion);

    this.mArrowVX = this.mArrow.getRigidBody().getVelocity()[0];
};

SceneA.prototype.update = function () {
    this.mAllObjs.update(this.mCamera);
    console.log(this.mAllObjs);
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
    /*
    if (this.mArrow.getRigidBody().getVelocity()[0] != this.mArrowVX) {
        this.mAllObjs.removeFromSet(this.mArrow);
    }
    */
    var i;
    for (i = 0; i < this.mAllObjs.size(); i++) {
        var collisionInfo = new CollisionInfo();
        var obj = this.mAllObjs.getObjectAt(i);
        if (obj !== this.mArrow && this.mArrow.getRigidBody().collisionTest(obj.getRigidBody(), collisionInfo) === true) {
            this.mAllObjs.removeFromSet(this.mArrow);
            this.mAllObjs.removeFromSet(obj);
        }
    }
};

SceneA.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();

    this.mAllObjs.draw(this.mCamera);
    this.mCollisionInfos = [];
};