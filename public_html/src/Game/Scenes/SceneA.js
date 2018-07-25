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
    this.kShootDirectionArrow = "assets/UI/UI_arrow.png";

    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";

    // The camera to view the scene
    this.mCamera = null;
    
    //GameObjectSets
    this.mAllObjs = null;   //All GameObject
    this.mAllObstacles = null; // All Obstacles which cant be destroyed
    this.mDestroyable = null; // All objects that can be shot
    
    // Gameobjects
    this.mArcherMale = null;
    this.mAnotherArcher = null;
    this.mArrow = null;
    this.mLifePotion = null;    
    this.mCollisionInfos = [];
    
    //CurrentObj to take turns
    this.mCurrentObject = null;
    
    //Time
    this.mTimeCounter = 0;
    
    //Which player's turn       ./////this can be removed or replaced by FSM
    this.mTurnToPlay = 0;
    
    //ShootController for ui
    this.mShootController = null;
    this.mVelocity = null;
};

gEngine.Core.inheritPrototype(SceneA, Scene);

SceneA.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kArrowSprite);
    gEngine.Textures.loadTexture(this.kLifePotionTexture);
    gEngine.Textures.loadTexture(this.kShootDirectionArrow);

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
    gEngine.Textures.unloadTexture(this.kShootDirectionArrow);

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
    this.mAllObstacles = new GameObjectSet();
    this.mDestroyable = new GameObjectSet();

    this.createBounds();
    this.mArcherMale = new Archer(20, 40, 12, 14, this.kArcherMaleTextures,
                                    this.mArrow, this.kArrowSprite,
                                    this.mAllObjs, this.mAllObstacles, this.mDestroyable);
    this.mAnotherArcher = new Archer(40, 50, 12, 14, this.kArcherMaleTextures,
                                    this.mArrow, this.kArrowSprite,
                                    this.mAllObjs, this.mAllObstacles, this.mDestroyable);    
    this.mAllObjs.addToSet(this.mArcherMale);
    this.mAllObjs.addToSet(this.mAnotherArcher);
    this.mDestroyable.addToSet(this.mArcherMale);
    this.mDestroyable.addToSet(this.mAnotherArcher);
    
    this.mShootController = new ShootController(20, 40, this.mArcherMale.getCurrentFrontDir(), this.kShootDirectionArrow);
    this.mVelocity = this.mShootController.getVelocity();
    
    this.mCurrentObject = this.mArcherMale;
};

SceneA.prototype.update = function () { 
    //get the velocity from shootcontroller and send it to the archer
    this.mVelocity = this.mShootController.getVelocity();
    this.mCurrentObject.setVelocity(this.mVelocity[0], this.mVelocity[1]);
    //change shootercontroller. this is not in the mAllObjs
    if(this.mCurrentObject !== null){
        var archerPos = this.mCurrentObject.getXform().getPosition();
        this.mShootController.getXform().setPosition(archerPos[0], archerPos[1]);
        this.mShootController.update(this.mCurrentObject.getCurrentFrontDir());
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        this.mTimeCounter = 580;
    }
    
    this.mAllObjs.update(this.mCamera);
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
    
    //Time control part. When needed, set the activated archer
    this.mTimeCounter++;
    if(this.mTimeCounter >= 600){
        if(this.mCurrentObject === this.mArcherMale){
            this.mCurrentObject  = this.mAnotherArcher;
            this.mArcherMale.setToStand();
        }
        else{
            this.mCurrentObject  = this.mArcherMale;
            this.mAnotherArcher.setToStand();
        }            
        this.mTimeCounter = 0;
    }
    this.mCurrentObject .keyControl();
    this.mCurrentObject .getRigidBody().userSetsState();
    
};

SceneA.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mShootController.draw(this.mCamera);
    
    this.mAllObjs.draw(this.mCamera);
    this.mCollisionInfos = [];
};


SceneA.prototype.createBounds = function () {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x += 30)
        this.platformAt(x, y, w, 0);
    y = 76;
//    for (x = 15; x < 120; x += 30)
//        this.platformAt(x, y, w, 180);

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
    //g.toggleDrawRenderable();
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
    //g.toggleDrawRenderable();
    g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mAllObjs.addToSet(g);
    this.mAllObstacles.addToSet(g);
};


