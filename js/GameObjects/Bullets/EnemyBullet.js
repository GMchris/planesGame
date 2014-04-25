EnemyBullet = Bullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 15, 4);
    },
    move: function () {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.rect(this.leftCoord, this.bottomCoord, this.height, this.width);
        ctx.fill();
    }
});