CAnimations = {
    animatedObjects: [],
    iterate: function () {
        var i;
        for (i = 0; i < this.animatedObjects.length; i++) {
            this.animationStep(this.animatedObjects[i]);
            if (this.animatedObjects[i].isAnimated == false) {
                this.animatedObjects.splice(i, 1);
                i--;
            }
        }
    },
    animate: function (obj, properties) {
        var dur = properties.duration;
        obj.isAnimated = true;
        this.animatedObjects.push(obj);
        obj.animationProps.frames = properties.frames;
        obj.animationProps.currentFrame = 0;
        obj.animationProps.opacityTarget = properties.opacity;
        obj.animationProps.rotationTarget = properties.rotation;
        obj.animationProps.scaleTarget = properties.scale;
        obj.animationProps.leftTarget = properties.left;
        obj.animationProps.bottomTarget = properties.bottom;
        obj.animationProps.opacityDelta = (obj.animationProps.opacityTarget - obj.animationProps.opacityCurrent) / obj.animationProps.frames;
        obj.animationProps.rotationDelta = (obj.animationProps.rotationTarget - obj.animationProps.rotationCurrent) / obj.animationProps.frames;
        obj.animationProps.scaleDelta = (obj.animationProps.scaleTarget - obj.animationProps.scaleCurrent) / obj.animationProps.frames;
        obj.animationProps.leftDelta = (obj.animationProps.leftTarget - obj.leftCoord) / obj.animationProps.frames;
        obj.animationProps.bottomDelta = (obj.animationProps.bottomTarget - obj.bottomCoord) / obj.animationProps.frames;
    },

    animationStep: function (obj) {
        obj.animationProps.currentFrame++;
        if (obj.animationProps.currentFrame == obj.animationProps.frames) {
            obj.isAnimated = false;
            this.resetAnimationProps(obj);
        } else {
            //update animation properties
            obj.animationProps.opacityCurrent += obj.animationProps.opacityDelta;
            obj.animationProps.rotationCurrent += obj.animationProps.rotationDelta;
            obj.animationProps.scaleCurrent += obj.animationProps.scaleDelta;
            obj.leftCoord += obj.animationProps.leftDelta;
            obj.leftCoord = parseInt(obj.leftCoord);
            obj.bottomCoord += obj.animationProps.bottomDelta;
            obj.bottomCoord = parseInt(obj.bottomCoord);
            this.normalizeAnimationProps(obj);
        }
        //animate
        ctx.save();
        ctx.globalAlpha = obj.animationProps.opacityCurrent;
        ctx.translate(obj.leftCoord, obj.bottomCoord);
        ctx.rotate(Utility.degreeToRadian(obj.animationProps.rotationCurrent));
        ctx.drawImage(obj.img, 0, 0, obj.width * obj.animationProps.scaleCurrent, obj.height * obj.animationProps.scaleCurrent);
        ctx.restore();
    },

    normalizeAnimationProps: function (obj) {
        if (obj.animationProps.opacityCurrent < 0) {
            obj.animationProps.opacityCurrent = 0;
        } else if (obj.animationProps.opacityCurrent > 1) {
            obj.animationProps.opacityCurrent = 1;
        }
        if (obj.animationProps.scaleCurrent < 0) {
            obj.animationProps.scaleCurrent = 0;
        } else if (obj.animationProps.scaleCurrent > 1) {
            obj.animationProps.scaleCurrent = 1;
        }
    },

    resetAnimationProps: function (obj) {
        obj.animationProps.opacityCurrent = obj.animationProps.opacityTarget;
        obj.animationProps.scaleCurrent = obj.animationProps.scaleTarget;
        obj.animationProps.rotationCurrent = obj.animationProps.rotationTarget;
    }
};