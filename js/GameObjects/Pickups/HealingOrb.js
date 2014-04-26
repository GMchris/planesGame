HealingOrb = Pickup.extend({
    init: function (left, bottom) {
        var width = 50,
            height = 50;
        this._super(left, bottom, width, height);
        $(this.div).addClass('healingOrbDiv');
        this.healingAmount = 5;
        this.spriteChangeFrequency = 50;
        this.lastSpriteChangeTimestampMs = -1;
        this.frameCount = 4;
    },

    img: $('<img src="images/skills/HealthOrbFrames.png" />')[0],
    currentFrame: null,
    spriteChangeFrequency: null,
    lastSpriteChangeTimestampMs: null,
    healingAmount: null,
    frameCount: null,

    draw: function () {
        var nowMs = Date.now();
        if (nowMs - this.lastSpriteChangeTimestampMs > this.spriteChangeFrequency) {
            this.lastSpriteChangeTimestampMs = nowMs;
            this.currentFrame = (this.currentFrame < this.frameCount) ? (this.currentFrame + 1) : 1;
        }
        ctx.drawImage(this.img, (this.currentFrame - 1) * this.width, 0, this.width, this.height, this.leftCoord, this.bottomCoord, 50, 50);
    },

    heal: function (plane) {
        if (plane.currentHealth + this.healingAmount <= plane.maxHealth) {
            plane.currentHealth += this.healingAmount;
        } else {
            plane.currentHealth = plane.maxHealth;
        }
        plane.updateHpBar();
    }
});