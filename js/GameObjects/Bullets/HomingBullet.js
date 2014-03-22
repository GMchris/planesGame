HomingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, targetPlane) {
        this._super(left, bottom, orientationDeg);
        this.div.className = "homingBulletDiv";
        this.targetPlane = targetPlane;
    },

    chaseTarget: function () {
        if (this.targetPlane != undefined && this.targetPlane.currentHealth > 0) {
            this.orientationDeg = parseInt(Math.atan(
                    Math.abs(this.leftCoord - (this.targetPlane.leftCoord + 40)) / Math.abs(this.bottomCoord - (this.targetPlane.bottomCoord + 20)))
                    / (Math.PI / 180));
            if (this.leftCoord > this.targetPlane.leftCoord) {
                this.orientationDeg *= -1;
            }

            this.rotate();
        }
    },

    rotate: function () {
        if (this.bottomCoord > this.targetPlane.bottomCoord) {
            this.div.style['-webkit-transform'] = 'rotate(' + (180 - this.orientationDeg) + 'deg)';
        } else {
            this.div.style['-webkit-transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
        }
    },

    removeTarget: function () {
        this.targetPlane = undefined;
        this.orientationDeg = 0;
        this.div.style['-webkit-transform'] = 'rotate(0deg)';
    }
});