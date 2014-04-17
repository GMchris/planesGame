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
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + this.width/2 - 1, this.bottomCoord + this.height + 5, this.orientationDeg, this);
    },

    rotate: function () {
        $(this.div).css('webkit-transform', 'rotate(' + this.orientationDeg + 'deg)');
    }
});