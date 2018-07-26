"use strict"

function UIObject(renderableObj) {
    this.mRenderableComponent = renderableObj;
    this.mVisible = true;
}

UIObject.prototype.setRenderable = function(renderableObj) { this.mRenderComponent = renderableObj; };
UIObject.prototype.getRenderable = function() { return this.mRenderableComponent; };
UIObject.prototype.isVisible = function () { return this.mVisible; };
UIObject.prototype.setVisibility = function (visibility) { this.mVisible = visibility; };

UIObject.prototype.getXform = function () { return this.mRenderComponent.getXform(); };
UIObject.prototype.setXform = function (xform) { this.mRenderComponent.setXform(xform); };


