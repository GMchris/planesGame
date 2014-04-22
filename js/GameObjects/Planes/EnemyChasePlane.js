//an enemy plane with the added functionality to face the player
EnemyChasePlane = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height) {
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
        this.orientationDeg = 0;
    },

    orientationDeg: null,

    chasePlayer: function () {
        var playerLeft = interactionManager.getPlayerLeftCoord(),
            playerBottom = interactionManager.getPlayerBottomCoord();
        this.orientationDeg = getChaseAngle(this.leftCoord, this.bottomCoord, playerLeft, playerBottom);

        if (this.leftCoord > playerLeft) {
            this.orientationDeg *= -1;
        }

        if (this.bottomCoord > playerBottom) {
            this.div.style['-webkit-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
			this.div.style['-moz-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
        } else {
            this.div.style['-webkit-transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
			this.div.style['-moz-transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
        }
    }
});