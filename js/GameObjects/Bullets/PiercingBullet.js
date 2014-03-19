PiercingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg) {
        this._super(left, bottom, orientationDeg);
        this.div.className = "piercingBulletDiv";
    },

    handleCollision: function () {
        //do nothing
    }
});