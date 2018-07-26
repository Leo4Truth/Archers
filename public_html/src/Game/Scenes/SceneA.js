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
    
    this.kSceneArenaTexture = "assets/scene/scene_arena.png";
    this.kSceneStatueTexture = "assets/scene/scene_statue.png";
    this.kParticleTexture = "assets/particles/Particle2.png";

    this.kBgm = "assets/Sound/bgm.mp3";
    this.kShoot = "assets/Sound/ShootSound.mp3";
    // The camera to view the scene
    this.mCamera = null;

    this.mArmoryCamera = null;
    this.mHPBarCamera = null;
    this.mAnotherHPBarCamera = null;
    this.mTimeCamera = null;
    
    //GameObjectSets
    this.mAllObjs = null;   //All GameObject
    this.mAllObstacles = null; // All Obstacles which cant be destroyed
    this.mDestroyable = null; // All objects that can be shot
    
    // Gameobjects
    this.mArcherMale = null;
    this.mAnotherArcher = null;
    this.mArrow = null;
    this.mLifePotion = null;

    this.mAllObjs = null;
    this.mAllObstacles = null;
    this.mDestroyable = null;

    this.mCollisionInfos = [];
    
    //CurrentObj to take turns
    this.mCurrentObject = null;
    
    //Time
    this.mTimeCounter = 0;
    this.mTiming = null;
    //UI stuff
    this.mHPBar = null;
    this.mAnotherHPBar = null;
    this.mShootController = null;
    this.mVelocity = null;
    
    //background image
    this.mScene = null;
    
    //background music
    this.mBgm = null;
}
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

    gEngine.Textures.loadTexture(Armory.eAssets.eBackgroundTexture);
    gEngine.Textures.loadTexture(Armory.eAssets.eCellTexture);
    gEngine.Textures.loadTexture(Armory.eAssets.eCheckMarkTexture);
    gEngine.Textures.loadTexture(HPBar.eAssets.eRedHeart);

    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
    
    gEngine.Textures.loadTexture(this.kSceneArenaTexture);
    gEngine.Textures.loadTexture(this.kSceneStatueTexture);
    gEngine.Textures.loadTexture(this.kParticleTexture);
    
    gEngine.AudioClips.loadAudio(this.kBgm);
    gEngine.AudioClips.loadAudio(this.kShoot);
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

    gEngine.Textures.unloadTexture(Armory.eAssets.eBackgroundTexture);
    gEngine.Textures.unloadTexture(Armory.eAssets.eCellTexture);
    gEngine.Textures.unloadTexture(Armory.eAssets.eCheckMarkTexture);
    gEngine.Textures.unloadTexture(HPBar.eAssets.eRedHeart);

    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    
    gEngine.Textures.unloadTexture(this.kSceneArenaTexture);
    gEngine.Textures.unloadTexture(this.kSceneStatueTexture);
    gEngine.Textures.unloadTexture(this.kParticleTexture);

    gEngine.AudioClips.unloadAudio(this.kBgm);
    gEngine.AudioClips.unloadAudio(this.kShoot);
    gEngine.AudioClips.stopBackgroundAudio(this.kBgm);
    
    var nextLevel;
    if(this.mArcherMale.getHp() === 0)
        nextLevel = new GameOver2();
    else if(this.mAnotherArcher.getHp() === 0)
        nextLevel = new GameOver1();
    gEngine.Core.startScene(nextLevel);
};


SceneA.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        200,                     // width of camera
        [0, 0, 1300, 800]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mArmoryCamera = new Camera(
        vec2.fromValues(1000, 1000),
        60,
        [1300, 0, 300, 420]
    );
    this.mArmoryCamera.setBackgroundColor([[0, 0, 0, 1]]);

    this.mHPBarCamera = new Camera(
        vec2.fromValues(1045, 1100),
        100,
        [1300, 450, 300, 30]
    );
    this.mHPBarCamera.setBackgroundColor([[0.5, 0.5, 0.5, 1]]);
    
    this.mAnotherHPBarCamera = new Camera(
        vec2.fromValues(1045, 1100),
        100,
        [1300, 420, 300, 30]
    );
    this.mAnotherHPBarCamera.setBackgroundColor([[0.5, 0.5, 0.5, 1]]);
    
    this.mTimeCamera = new Camera(
        vec2.fromValues(1100, 1100),
        100,
        [1300, 480, 300, 30]
    );
    this.mTimeCamera.setBackgroundColor([0.5, 0.5, 0.5, 1]);
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mAllObjs = new GameObjectSet();
    this.mAllObstacles = new GameObjectSet();
    this.mDestroyable = new GameObjectSet();

    this.mTiming = new Timing();
    this.mTiming.mTextbox.getXform().setPosition(1100, 1100);
    this.mTiming.mTextbox.getXform().setSize(10, 10);
    
    this.createBounds();
    this.mArcherMale = new Archer(20, 25, 12, 14,
        this.kArcherMaleTextures,
        this.mArrow,
        this.kArrowSprite,
        this.mAllObjs,
        this.mAllObstacles,
        this.mDestroyable);
    this.mAnotherArcher = new Archer(40, 45, 12, 14,
        this.kArcherMaleTextures,
        this.mArrow,
        this.kArrowSprite,
        this.mAllObjs,
        this.mAllObstacles,
        this.mDestroyable);

    this.mAllObjs.addToSet(this.mArcherMale);
    this.mAllObjs.addToSet(this.mAnotherArcher);
    this.mDestroyable.addToSet(this.mArcherMale);
    this.mDestroyable.addToSet(this.mAnotherArcher);
    
    this.mLifePotion = new LifePotion(50, 8, this.kLifePotionTexture);
    this.mAllObjs.addToSet(this.mLifePotion);
    this.mDestroyable.addToSet(this.mLifePotion);

    this.mArmory = new Armory();
    this.mHPBar = new HPBar(this.mArcherMale);
    this.mArcherMale.setHpBar(this.mHPBar);
    this.mAnotherHPBar = new HPBar(this.mAnotherArcher);
    this.mAnotherArcher.setHpBar(this.mAnotherHPBar);

    this.mShootController = new ShootController(20, 40,
        this.mArcherMale.getCurrentFrontDir(),
        this.kShootDirectionArrow);
    this.mVelocity = this.mShootController.getVelocity();
    
    var i = Math.random()%2;
    if(i === 1){
        this.mScene = new TextureRenderable(this.kSceneStatueTexture);    
    }else
        this.mScene = new TextureRenderable(this.kSceneArenaTexture);    
    this.mScene.getXform().setPosition(50, 40);
    this.mScene.getXform().setSize(200, 125);
//    this.mSceneImg.setColor([1, 1, 1, 0]);
//    this.mSceneImg.getXform().setPosition(50, 40);
//    this.mSceneImg.getXform().setSize(1600, 800);
//    this.mSceneImg.setElementPixelPositions(0, 800, 0, 600);
//    this.mScene.setRender
        
    this.mCurrentObject = this.mArcherMale;
};

SceneA.prototype.update = function () {
    //check if an idiot has fallen
    if(this.mArcherMale.getXform().getPosition()[1] <= 0)
        this.mArcherMale.loseHp(10);
    if(this.mAnotherArcher.getXform().getPosition()[1] <= 0)
        this.mAnotherArcher.loseHp(10);
    if(gEngine.AudioClips.isBackgroundAudioPlaying() === false)
        gEngine.AudioClips.playBackgroundAudio(this.kBgm);
        
    //check win condition
    if(this.mArcherMale.getHp() === 0 || this.mAnotherArcher.getHp() === 0)
        gEngine.GameLoop.stop();

    this.mArmory.update();
  
    this.mAllObjs.update(this.mCamera);
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
    
    this.mCurrentObject.keyControl();
    this.mCurrentObject.getRigidBody().userSetsState();
    
    //get the velocity from shootcontroller and send it to the archer
    this.mVelocity = this.mShootController.getVelocity();
    this.mCurrentObject.setVelocity(this.mVelocity[0], this.mVelocity[1]);
    //change shootercontroller. this is not in the mAllObjs
    if (this.mCurrentObject !== null) {
        var archerPos = this.mCurrentObject.getXform().getPosition();
        this.mShootController.getXform().setPosition(archerPos[0], archerPos[1]);
        this.mShootController.update(this.mCurrentObject.getCurrentFrontDir());
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        gEngine.AudioClips.playACue(this.kShoot);
        this.mTimeCounter = 580;
    }

    //Time control part. When needed, set the activated archer
    this.mTimeCounter++;
    var TimeS = this.mTimeCounter / 60;
    this.mTiming.TimeUpdate(TimeS);
    if (this.mTimeCounter >= 600){
        if(this.mCurrentObject === this.mArcherMale){
            this.mCurrentObject = this.mAnotherArcher;
//            this.mAnotherArcher.setToStand();
        }
        else {
            this.mCurrentObject  = this.mArcherMale;
//            this.mArcherMale.setToStand();
        }
        this.mAnotherArcher.setToStand();
        this.mArcherMale.setToStand();
        this.mTiming.setZero();
        this.mTimeCounter = 0;
    }
};

SceneA.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mScene.draw(this.mCamera);
    
    this.mAllObjs.draw(this.mCamera);
    
    this.mShootController.draw(this.mCamera);

    this.mArmoryCamera.setupViewProjection();
    this.mArmory.draw(this.mArmoryCamera);

    this.mHPBarCamera.setupViewProjection();
    this.mHPBar.draw(this.mHPBarCamera);
    this.mAnotherHPBarCamera.setupViewProjection();
    this.mAnotherHPBar.draw(this.mAnotherHPBarCamera);

    this.mTimeCamera.setupViewProjection();
    this.mTiming.mTextbox.draw(this.mTimeCamera);
    
    this.mCollisionInfos = [];
};

SceneA.prototype.createBounds = function () {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x += 30)
        this.platformAt(x, y, w, 0);
    y = 76;
//    for (x = 15; x < 120; x += 30)
//        this.platformAt(x, y, w, 180);

    this.platformAt(30, 40, 20, 0);
    this.platformAt(60, 30, 20, 0);
    this.platformAt(20, 20, 20, 0);
    this.platformAt(70, 50, 20, 0);
    this.platformAt(-20, 10, 30, 0);
    this.platformAt(90, 15, 30, 0);

    /*
    x = 2;
    w = 3;
    for (y = 8; y < 90; y += 12)
        this.wallAt(x, y, w);
    x = 98;
    for (y = 8; y < 90; y += 12)
        this.wallAt(x, y, w);
    */

//    var r = new TextureRenderable(this.kTargetTexture);
//    this.mTarget = new GameObject(r);
//    var xf = r.getXform();
//    xf.setSize(3, 3);
};

SceneA.prototype.wallAt = function (x, y, w) {
    var h = w * 4;
    var p = new TextureRenderable(this.kWallTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    //g.toggleDrawRenderable();
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
    //g.toggleDrawRenderable();
    //g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mAllObjs.addToSet(g);
    this.mAllObstacles.addToSet(g);
};
