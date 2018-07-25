/*
* Splash.js
* 
*/
"use strict";

function MyMenu() {
    this.mTitle = null;
    this.mButton1 = null;
    this.mButton2 = null;
    this.mMark = null;
    this.mhelp = null;

    this.option = 0;
    this.mColorSelect = null;
    this.mLevelBackground = null;
    this.kBackground = "assets/menu/MenuBackground.png";
    this.kStartButton = "assets/menu/Button.png";
    this.kTitle = "assets/menu/title.png";    
    this.khelp = "assets/menu/help.png";
    this.kButton1 = "assets/menu/button1.png";
    this.kButton2 = "assets/menu/button2.png";
    this.kMark = "assets/menu/opArrow.png";
    this.mCamera = null;

    // Coordinate Systems (Copied from MyGame for simplicity, can change this)
    this.kWCWidth = 100;
    this.kViewportWidth = 800;
    this.kViewportHeight = 600;
    this.kWCHeight = this.kViewportHeight * (this.kWCWidth / this.kViewportWidth);
    // Animate Ball roll onto screen

    // display ColorSelect after initial BallRoll

}
gEngine.Core.inheritPrototype(MyMenu, Scene);

MyMenu.prototype.loadScene = function(sceneParams) {
	// load the scene file
	// need to create this.kSceneFile; choose JSON or XML
	// gEngine.TextFileLoader.LoadTextFile(this.kScene, gEngine.TextFileLoader.eTextFileType.eTextFile); // if JSON
	// use XMLFile for XML

	// load Textures
	gEngine.Textures.loadTexture(this.kBackground); 
        
        gEngine.Textures.loadTexture(this.kTitle);
        gEngine.Textures.loadTexture(this.kButton1);
        gEngine.Textures.loadTexture(this.kButton2);
        gEngine.Textures.loadTexture(this.kMark);
        gEngine.Textures.loadTexture(this.khelp);


};

MyMenu.prototype.unloadScene = function() {
	// unload the Scene File
	// same this.kSceneFile as in loadScene

	// unload Textures
	gEngine.Textures.unloadTexture(this.kBackground);
        gEngine.Textures.unloadTexture(this.kTitle);
        gEngine.Textures.unloadTexture(this.kButton1);
        gEngine.Textures.unloadTexture(this.kButton2);
        gEngine.Textures.unloadTexture(this.kMark);
        gEngine.Textures.unloadTexture(this.khelp);
		// textures for each car color

	var nextLevel = new SceneA(); // pass CarColor selection to MyGame
	gEngine.Core.startScene(nextLevel);
};

MyMenu.prototype.initialize = function() {
//	this.mColorSelect = new ColorSelect();

	this.mLevelBackground = new LevelBackground(this.kBackground); // with parameter for the background Texture

	this.mCamera = new Camera( // camera setup copied from MyGame.js for simplicity, can change this
		[0, 0],		 // position of the camera
		this.kWCWidth,		// width of camera
		[0, 0, this.kViewportWidth, this.kViewportHeight] 	// viewport (orgX, orgY, width, height)
	);

        this.mTitle = new TextureRenderable(this.kTitle);
        this.mTitle.setColorArray([1, 1, 1, 1]);
        this.mTitle.getXform().setPosition(0, 20);
        this.mTitle.getXform().setSize(120, 30);
        
        this.mButton1 = new TextureRenderable(this.kButton1);
        this.mButton1.setColorArray([1, 1, 1, 0]);
        this.mButton1.getXform().setPosition(0, 0);
        this.mButton1.getXform().setSize(80, 20);
        
        this.mButton2 = new TextureRenderable(this.kButton2);
        this.mButton2.setColorArray([1, 1, 1, 0]);
        this.mButton2.getXform().setPosition(0, -20);
        this.mButton2.getXform().setSize(80, 20);
        
        this.mMark = new TextureRenderable(this.kMark);
        this.mMark.setColorArray([0, 0, 0, 1]);
        this.mMark.getXform().setPosition(-40, 0);
        this.mMark.getXform().setSize(8, 2);
        
        this.mhelp = new TextureRenderable(this.khelp);
        this.mhelp.getXform().setPosition(0, 100);
        this.mhelp.getXform().setSize(80, 80);
        

        
	gEngine.DefaultResources.setGlobalAmbientIntensity(3);
};

MyMenu.prototype.update = function() {
    var delta = -3;
        switch(this.option)
        {
            case 0:
                this.mButton2.getXform().setSize(80, 20);
                this.mButton1.getXform().setSize(120, 30);
                this.mMark.getXform().setPosition(-40, 1);
                break;
            case 1:
                this.mButton1.getXform().setSize(80, 20);
                this.mButton2.getXform().setSize(120, 30);
                this.mMark.getXform().setPosition(-20, -19);
                break;
            default:
                this.mButton1.getXform().setSize(80, 20);
                this.mButton2.getXform().setSize(80, 20);
                if(this.mhelp.getXform().getYPos() > 0)
                {
                    this.mhelp.getXform().incYPosBy(delta);
                }
                break;
        }

	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) { 
		// test code for scene switching
                if(this.option == 2){
                    this.option = 0;
                    this.mhelp.getXform().setPosition(0, 100);
                    this.mtips.getXform().setPosition(0, 100);
                }
                else
                    gEngine.GameLoop.stop();
        }
        
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W) && this.option == 1){
            this.option = 0;
        }
        else if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S) && this.option == 0){
            this.option = 1;
        }
        else if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space) && this.option == 1){
            this.option = 2;
        }
        
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space) && this.option == 0){
            gEngine.GameLoop.stop();
        }
        
};

MyMenu.prototype.draw = function() {
	gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
	this.mCamera.setupViewProjection(); // activate drawing camera
	// draw all SplashScreen GameObjects
	// draw LevelBackground
	this.mLevelBackground.draw(this.mCamera);
        this.mTitle.draw(this.mCamera);
        this.mButton1.draw(this.mCamera);
        this.mButton2.draw(this.mCamera);
	this.mTitle.draw(this.mCamera);
        this.mMark.draw(this.mCamera);
        this.mhelp.draw(this.mCamera);
};
