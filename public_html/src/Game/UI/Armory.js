"use strict"

Armory.eAssets = Object.freeze({
    eBackgroundTexture: "assets/UI/armoryBackground.png",
    eCellTexture: "assets/UI/armoryCell.png",
    eCheckMarkTexture: "assets/UI/UICheckMark.png"
});

Armory.eCellOffsets = Object.freeze([
    [-24, 36], [-12, 36], [0, 36], [12, 36], [24, 36],
    [-24, 24], [-12, 24], [0, 24], [12, 24], [24, 24],
    [-24, 12], [-12, 12], [0, 12], [12, 12], [24, 12],
    [-24, 0], [-12, 0], [0, 0], [12, 0], [24, 0],
    [-24, -12], [-12, -12], [0, -12], [12, -12], [24, -12],
    [-24, -24], [-12, -24], [0, -24], [12, -24], [24, -24],
    [-24, -36], [-12, -36], [0, -36], [12, -36], [24, -36]
]);

function Armory() {
    this.kCellLength = 10;
    this.kCellNum = new vec2.fromValues(5, 7);
    this.kCurrentArm = 0;

    this.mArms = new UIObjectSet();
    this.mCells = new UIObjectSet();

    this.mBackground = new SpriteRenderable(Armory.eAssets.eBackgroundTexture);
    console.log(this.mBackground);
    this.mBackground.setColor([1, 1, 1, 0]);
    this.mBackground.getXform().setPosition(1000, 1000);
    this.mBackground.getXform().setSize(60, 84);


    var i;
    for (i = 0; i < 35; i++) {
        var cellRenderable = new SpriteRenderable(Armory.eAssets.eCellTexture);
        var cell = new UIObject(cellRenderable);
        cell.getRenderable().setColor([1, 1, 1, 0]);
        cell.getRenderable().getXform().setSize(10, 10);
        cell.getRenderable().getXform().setPosition(
            this.mBackground.getXform().getXPos() + Armory.eCellOffsets[i][0],
            this.mBackground.getXform().getXPos() + Armory.eCellOffsets[i][1]
        );
        this.mCells.addToSet(cell);
    }

    this.mCheckMark = new SpriteRenderable(Armory.eAssets.eCheckMarkTexture);
    this.mCheckMark.setColor([1, 1, 1, 0]);
    this.mCheckMark.getXform().setSize(10, 10);
    this.mCheckMark.getXform().setPosition(
        this.mBackground.getXform().getXPos() + Armory.eCellOffsets[this.kCurrentArm][0],
        this.mBackground.getXform().getXPos() + Armory.eCellOffsets[this.kCurrentArm][1]
    );
    console.log(this.mCells);
}

Armory.prototype.addArm = function(arm) {
    this.mArms.addToSet(arm);
};

Armory.prototype.removeArm = function(arm) {
    this.mArms.removeFromSet(arm);
};

Armory.prototype.draw = function (aCamera) {
    this.mBackground.draw(aCamera);
    var i;
    for (i = 0; i < 35; i++) {
        this.mCells.getObjectAt(i).getRenderable().draw(aCamera);
    }
    this.mCheckMark.draw(aCamera);
};

Armory.prototype.update = function() {
    this.keyControl();
    this.mCheckMark.getXform().setPosition(
        this.mBackground.getXform().getXPos() + Armory.eCellOffsets[this.kCurrentArm][0],
        this.mBackground.getXform().getXPos() + Armory.eCellOffsets[this.kCurrentArm][1]
    );
};

Armory.prototype.keyControl = function() {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {
        this.kCurrentArm -= 5;
        if (this.kCurrentArm < 0)
            this.kCurrentArm = 0;
        console.log(this.kCurrentArm);
    }
    else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down)) {
        this.kCurrentArm += 5;
        if (this.kCurrentArm >= 35)
            this.kCurrentArm = 34;
        console.log(this.kCurrentArm);
    }
    else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.kCurrentArm -= 1;
        if (this.kCurrentArm < 0)
            this.kCurrentArm = 0;
        console.log(this.kCurrentArm);
    }
    else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.kCurrentArm += 1;
        if (this.kCurrentArm >= 35)
            this.kCurrentArm = 34;
        console.log(this.kCurrentArm);
    }
}


