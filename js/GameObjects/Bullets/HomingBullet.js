HomingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, owner, targetPlane) {
        this._super(left, bottom, orientationDeg, owner, 15, 4);
        this.div.className = "homingBulletDiv";
        this.targetPlane = targetPlane;
    },

    chaseTarget: function () {
        if (this.targetPlane != undefined && this.targetPlane.currentHealth > 0) {
            this.orientationDeg = parseInt(Math.atan(
                    Math.abs(this.leftCoord - (this.targetPlane.leftCoord + (this.targetPlane.width / 2))) / Math.abs(this.bottomCoord - (this.targetPlane.bottomCoord + 35)))
                    / (Math.PI / 180)); //measures the angle the bullet needs to rotate to face its target
            if (this.leftCoord > this.targetPlane.leftCoord + (this.targetPlane.width / 2)) {
                this.orientationDeg *= -1;
            }

            //this.rotate();
        }
    },

    rotate: function () {
        if (this.bottomCoord > this.targetPlane.bottomCoord + 35) {
            this.div.style['-webkit-transform'] = 'rotate(' + (180 - this.orientationDeg) + 'deg)';
			this.div.style['-ms-transform'] = 'rotate(' + (180 - this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (180 - this.orientationDeg) + 'deg)';
        } else {
            this.div.style['-webkit-transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
			this.div.style['-ms-transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
        }
    },

    removeTarget: function () {
        this.targetPlane = undefined;
        this.orientationDeg = 0;
        this.div.style['-webkit-transform'] = 'rotate(0deg)';
		this.div.style['-ms-transform'] = 'rotate(0deg)';
		this.div.style['transform'] = 'rotate(0deg)';
    },

    move: function () {
        if (this.targetPlane) {
            ctx.save();
            ctx.translate(this.leftCoord, this.bottomCoord);
            if (this.bottomCoord > this.targetPlane.bottomCoord + this.targetPlane.height / 2) {
                ctx.rotate(degreeToRadian(-(180 - this.orientationDeg)));
            } else {
                ctx.rotate(degreeToRadian(-this.orientationDeg));
            }

            ctx.beginPath();
            ctx.fillStyle = "yellow";
            ctx.rect(0, 0, this.height, this.width);
            ctx.fill();
            ctx.restore();
        } else {
            this._super();
        }
    }
});