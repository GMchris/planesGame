SentryPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage) {
        this._super(left, bottom, maxHealth, damage);
        this.div.className = "sentryPlaneDiv";
        this.orientationDeg = 15;
        this.image.src = 'images/planes/sentry.png';
		this.width = 100;
		this.height = 75;
        this.hpBar.className = "hpBarFriendly";
        this.bulletType = "player";
        this.lastShootTimestamp = -1;
        this.rotate();
    },

    shoot: function () {
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + (this.width / 2) + Math.ceil(-this.orientationDeg * 5 / 3), this.bottomCoord + this.height + Math.abs(-this.orientationDeg * 4 / 3), this.orientationDeg, this);
    },

    rotate: function () {
        $(this.div).css('webkit-transform', 'rotate(' + this.orientationDeg + 'deg)');
    }
});