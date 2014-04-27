SentryPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage) {
        var shootFrequency = 150, //ms
            width = 100,
            height = 75;
        this._super(left, bottom, maxHealth, damage, shootFrequency, width, height);
        this.orientationDeg = 0;
        this.bulletType = "player";
        this.lastShootTimestamp = -1;
        this.rotate();
    },
    img: $('<img src="images/planes/sentry.png"/>')[0],

    shoot: function () {
        if (this.tryShoot()) {
            InteractionManager.spawnBullet(this.bulletType, this.leftCoord + (this.orientationDeg / 90 + 1) * this.width / 2, this.bottomCoord + (this.height - Math.abs((this.orientationDeg / 90) * this.height / 2)), this.orientationDeg, this);
        }
    },

    drawHpBar: function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.rect(-this.width / 2, (-this.height / 2) - 5, this.width * (this.currentHealth / this.maxHealth), 5);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(-this.width / 2, (-this.height / 2) - 5, this.width, 5);
        ctx.stroke();
    },

    rotate: function () {
        ctx.save();
        ctx.translate(this.leftCoord + this.width / 2, this.bottomCoord + this.height / 2);
        //ctx.translate(this.leftCoord, this.bottomCoord); //kamikaze rotates around it's lower-left point, not around its center - feels unnatural
        ctx.rotate(Utility.degreeToRadian(-this.orientationDeg));
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
        //ctx.drawImage(this.img, 0, 0);
        this.drawHpBar();
        ctx.restore();
    }
});