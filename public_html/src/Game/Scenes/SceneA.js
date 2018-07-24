"use strict";

function SceneA() {
    this.kArrowSprite = "assets/arrows/arrows_a.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mArrow = null;
    this.mAllObjs = null;
    this.mCollisionInfos = [];
}

gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kArrowSprite);
};

SceneA.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kArrowSprite);
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

    this.mArrow = new Arrow(20, 60, 10, 10, this.kArrowSprite);
    this.mAllObjs = new GameObjectSet();
    //this.createBounds();

    this.mAllObjs.addToSet(this.mArrow);
};

SceneA.prototype.update = function () {
    this.mAllObjs.update(this.mCamera);
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
};

SceneA.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();

    //this.mTarget.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera);
    this.mCollisionInfos = [];
};