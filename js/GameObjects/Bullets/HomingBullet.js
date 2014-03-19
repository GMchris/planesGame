HomingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, targetPlane) {
        this._super(left, bottom, orientationDeg);
        this.div.className = "homingBulletDiv";
        this.targetPlane = targetPlane;
    },

    chaseTarget: function () {
        this.orientationDeg = parseInt(Math.atan(
            Math.abs(this.leftCoord - this.targetPlane.leftCoord) / Math.abs(this.bottomCoord - this.targetPlane.bottomCoord))
            / (Math.PI / 180));
        if (this.leftCoord > this.targetPlane.leftCoord) {
            this.orientationDeg *= -1;
        }

        if (this.bottomCoord > this.targetPlane.bottomCoord) {
            this.div.style['-webkit-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
        } else {
            this.div.style['-webkit-transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
        }
    }
});