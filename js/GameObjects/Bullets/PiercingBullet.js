PiercingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, owner, width, height) {
        var piercingWidth = width ? width : 15,
            piercingHeight = height ? height : 4;
        this._super(left, bottom, orientationDeg, owner, piercingWidth, piercingHeight);
        this.bulletColor = '#a34ba9';
        this.enemiesHit = [];
    },

    enemiesHit: null,

    handleCollision: function (hitPlane) {
        this.enemiesHit.push(hitPlane);
    }
});