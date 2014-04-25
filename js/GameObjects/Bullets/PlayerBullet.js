PlayerBullet = Bullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 15, 4);
        this.div.className = "playerBulletDiv";
    },

    move: function () {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.rect(this.leftCoord, this.bottomCoord, this.height, this.width);
        ctx.fill();
    }
});