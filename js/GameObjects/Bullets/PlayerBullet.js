PlayerBullet = Bullet.extend({
    init: function (left, bottom, orientationDeg) {
        this._super(left, bottom, orientationDeg);
        this.div.className = "playerBulletDiv";
    }
});