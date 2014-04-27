SpriteGameObject = GameObject.extend({
    init: function (left, bottom, width, height) {
        this._super(width, height);
        this.updateCoords(left, bottom);
        this.spriteChangeFrequency = 50;
        this.lastSpriteChangeTimestampMs = -1;
        this.currentFrame = 1;
    },

    img: null,
    currentFrame: null,
    spriteChangeFrequency: null,
    lastSpriteChangeTimestampMs: null,
    frameCount: null,

    draw: function () {
        var nowMs = Date.now();
        if (nowMs - this.lastSpriteChangeTimestampMs > this.spriteChangeFrequency) {
            this.lastSpriteChangeTimestampMs = nowMs;
            this.currentFrame = (this.currentFrame < this.frameCount) ? (this.currentFrame + 1) : 1;
        }
        ctx.drawImage(this.img, (this.currentFrame - 1) * this.width, 0, this.width, this.height, this.leftCoord, this.bottomCoord, this.width, this.height);
    },
});