SentryPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage) {
        this._super(left, bottom, maxHealth, damage, 100, 75); //100-width, 75-height
        this.div.className = "sentryPlaneDiv";
        this.orientationDeg = 0;
        $(this.div).css('background-image', 'url(images/planes/sentry.png)');
        this.hpBar.className = "hpBarFriendly";
        this.bulletType = "player";
        this.lastShootTimestamp = -1;
        this.rotate();
    },

    shoot: function () {
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + (this.orientationDeg / 90 + 1) * this.width / 2, this.bottomCoord + (this.height - Math.abs((this.orientationDeg / 90) * this.height / 2)), this.orientationDeg, this);
    },

    rotate: function () {
        $(this.div).css('webkit-transform', 'rotate(' + this.orientationDeg + 'deg)');
		$(this.div).css('moz-transform', 'rotate(' + this.orientationDeg + 'deg)');
		$(this.div).css('transform', 'rotate(' + this.orientationDeg + 'deg)');
    }
});