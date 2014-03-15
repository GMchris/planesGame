PlayerBullet = Bullet.extend({
    init: function (left, bottom) {
        this._super(left, bottom);
        this.div.className = "playerBulletDiv";
    }
});