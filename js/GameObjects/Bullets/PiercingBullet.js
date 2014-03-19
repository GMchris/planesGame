PiercingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg) {
        this._super(left, bottom, orientationDeg);
        this.div.className = "piercingBulletDiv";
        this.enemiesHit = [];
    },

    enemiesHit: null,

    handleCollision: function (hitPlane) {
        this.enemiesHit.push(hitPlane);
    }
});