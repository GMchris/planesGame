PiercingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, owner, width, height) {
        var piercingWidth = width ? width : 15,
            piercingHeight = height ? height : 4;
        this._super(left, bottom, orientationDeg, owner, piercingWidth, piercingHeight);
        this.bulletColor = '#78f1ff';
        this.enemiesHit = [];
    },

    enemiesHit: null,

    handleCollision: function (hitPlane) {
        this.enemiesHit.push(hitPlane);
    }
});