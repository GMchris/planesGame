EnemyBullet = Bullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 15, 4);
        this.bulletColor = '#fb2c00';
    },

    move: function () {
        if (this.orientationDeg != 0) {
            ctx.save();
            ctx.translate(this.leftCoord, this.bottomCoord);
            ctx.rotate(Utility.degreeToRadian(180 - this.orientationDeg));
            ctx.beginPath();
            ctx.fillStyle = this.bulletColor;
            ctx.rect(0, 0, this.height, this.width);
            ctx.fill();
            ctx.restore();
        } else {
            this._super();
        }
    }
});