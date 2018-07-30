"use strict"

ParticleSystem.eAssets = Object.freeze({
    eGreen: "assets/particles/greenParticle.png",
    eSnow: "assets/particles/snow.png",
    eEmoji: "assets/particles/emoji.png",
    eBoom: "assets/particles/boom.png"
});

function ParticleSystem () {

}

ParticleSystem.loadAssets = function () {
    gEngine.Textures.loadTexture(ParticleSystem.eAssets.eGreen);
    gEngine.Textures.loadTexture(ParticleSystem.eAssets.eSnow);
    gEngine.Textures.loadTexture(ParticleSystem.eAssets.eBoom);
    gEngine.Textures.loadTexture(ParticleSystem.eAssets.eEmoji);
};

ParticleSystem.unloadAssets = function () {
    gEngine.Textures.unloadTexture(ParticleSystem.eAssets.eGreen);
    gEngine.Textures.unloadTexture(ParticleSystem.eAssets.eSnow);
    gEngine.Textures.unloadTexture(ParticleSystem.eAssets.eBoom);
    gEngine.Textures.unloadTexture(ParticleSystem.eAssets.eEmoji);
};