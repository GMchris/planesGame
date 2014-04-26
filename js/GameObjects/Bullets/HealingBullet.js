HealingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 15, 4);
        this.bulletColor = '#41ec1a';
    }
});