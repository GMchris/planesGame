EnemyBullet = Bullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 15, 4);
        this.bulletColor = '#fb2c00';
    },

    move: function () {
        ctx.beginPath();
        ctx.fillStyle = this.bulletColor;
        ctx.rect(this.leftCoord, this.bottomCoord, this.height, this.width);
        ctx.fill();
    }
});