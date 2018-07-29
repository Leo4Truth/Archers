"use strict";

Background.eAssets = Object.freeze({
    eEasternCityTexture: "assets/backgrounds/backgroundEasternCity.png",
    eOutskirtsTexture: "assets/backgrounds/backgroundOutskirts.png",
    eTownTexture: "assets/backgrounds/backgroundTown.png",

    eSkyCloudyTexture: "assets/backgrounds/skyCloudy.png",
    eSkyNightCloudyTexture: "assets/backgrounds/skyNightCloudy.png"
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
    }
    this.mPlace.setColor([1, 1, 1, 0.2]);
    this.mPlace.getXform().setPosition(0, 0);
    this.mPlace.getXform().setSize(500, 250);
}

Background.prototype.draw = function (aCamera) {
    this.mSky.draw(aCamera);
    this.mPlace.draw(aCamera);
};