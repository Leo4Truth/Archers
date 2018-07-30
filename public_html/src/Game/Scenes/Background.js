"use strict";

Background.eAssets = Object.freeze({
    eEasternCityTexture: "assets/backgrounds/backgroundEasternCity_1.png",
    eOutskirtsTexture: "assets/backgrounds/backgroundOutskirts_1.png",
    eTownTexture: "assets/backgrounds/backgroundTown_1.png",

    eSkyCloudyTexture: "assets/backgrounds/skyCloudy_1.png",
    eSkyNightCloudyTexture: "assets/backgrounds/skyNightCloudy_1.png"
});

Background.eTerrainAssets = Object.freeze({
    ePlatformTexture: "assets/terrains/platform.png",
    eWallTexture: "assets/terrains/wall.png"
});

Background.eAudio = Object.freeze({
    eBgm_1: "assets/sounds/bgm.mp3"
});

Background.ePlace = Object.freeze({
    eEasternCity: 0,
    eOutskirts: 1,
    eTown: 2
});

Background.eSky = Object.freeze({
    eCloudy: 0,
    eNightCloudy: 1
});

function Background(place, sky) {
    this.mPlace = null;
    this.mSky = null;

    switch (sky) {
        case Background.eSky.eCloudy: {
            this.mSky = new TextureRenderable(Background.eAssets.eSkyCloudyTexture);
            break;
        }
        case Background.eSky.eNightCloudy: {
            this.mSky = new TextureRenderable(Background.eAssets.eSkyNightCloudyTexture);
            break;
        }
        default: {
            this.mSky = new TextureRenderable(Background.eAssets.eSkyCloudyTexture);
            break;
        }
    }
    this.mSky.setColor([1, 1, 1, 0.2]);
    this.mSky.getXform().setPosition(0, 0);
    this.mSky.getXform().setSize(500, 250);

    switch (place) {
        case Background.ePlace.eEasternCity: {
            this.mPlace = new TextureRenderable(Background.eAssets.eEasternCityTexture);
            break;
        }
        case Background.ePlace.eOutskirts: {
            this.mPlace = new TextureRenderable(Background.eAssets.eOutskirtsTexture);
            break;
        }
        case Background.ePlace.eTown: {
            this.mPlace = new TextureRenderable(Background.eAssets.eTownTexture);
            break;
        }
        default: {
            this.mPlace = new TextureRenderable(Background.eAssets.eEasternCityTexture);
            break;
        }
    }
    this.mPlace.setColor([1, 1, 1, 0.2]);
    this.mPlace.getXform().setPosition(0, 0);
    this.mPlace.getXform().setSize(500, 250);
}

Background.prototype.draw = function (aCamera) {
    this.mSky.draw(aCamera);
    this.mPlace.draw(aCamera);
};

Background.loadAssets = function () {
    gEngine.Textures.loadTexture(Background.eTerrainAssets.ePlatformTexture);
    gEngine.Textures.loadTexture(Background.eTerrainAssets.eWallTexture);

    gEngine.AudioClips.loadAudio(Background.eAudio.eBgm_1);
};

Background.unloadAssets = function () {
    gEngine.Textures.unloadTexture(Background.eTerrainAssets.ePlatformTexture);
    gEngine.Textures.unloadTexture(Background.eTerrainAssets.eWallTexture);

    gEngine.AudioClips.unloadAudio(Background.eAudio.eBgm_1);
    gEngine.AudioClips.stopBackgroundAudio(this.kBgm);
};