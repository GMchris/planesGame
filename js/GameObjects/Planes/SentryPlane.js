SentryPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage) {
        var shootFrequency = 150, //ms
            width = 100,
            height = 75;
        this._super(left, bottom, maxHealth, damage, shootFrequency, width, height);
        this.div.className = "sentryPlaneDiv";
        this.orientationDeg = 0;
        $(this.div).css('background-image', 'url(images/planes/sentry.png)');
        this.hpBar.className = "hpBarFriendly";
        this.bulletType = "player";
        this.lastShootTimestamp = -1;
        this.rotate();
    },

    shoot: function () {
        if (this.tryShoot()) {
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + (this.orientationDeg / 90 + 1) * this.width / 2, this.bottomCoord + (this.height - Math.abs((this.orientationDeg / 90) * this.height / 2)), this.orientationDeg, this);
        }
    },

    rotate: function () {
        $(this.div).css('webkit-transform', 'rotate(' + this.orientationDeg + 'deg)');
		$(this.div).css('moz-transform', 'rotate(' + this.orientationDeg + 'deg)');
		$(this.div).css('transform', 'rotate(' + this.orientationDeg + 'deg)');
    }
});