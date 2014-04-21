PlayerBullet = Bullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 15, 4);
        this.div.className = "playerBulletDiv";
    }
});