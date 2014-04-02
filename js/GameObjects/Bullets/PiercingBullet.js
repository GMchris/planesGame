PiercingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner);
        this.div.className = "piercingBulletDiv";
        this.enemiesHit = [];
    },

    enemiesHit: null,

    handleCollision: function (hitPlane) {
        this.enemiesHit.push(hitPlane);
    }
});