SentryPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage, targetPlane) {
        this._super(left, bottom, maxHealth, damage);
        this.targetPlane = targetPlane;
        this.div.className = "sentryPlaneDiv";
        this.orientationDeg = 0;
        this.image.src = 'images/planes/sentry.png';
		this.width = 100;
		this.height = 75;
        this.hpBar.className = "hpBarFriendly";
        this.bulletType = "player";
        this.lastShootTimestamp = -1;
    },

    shoot: function () {
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + this.width/2 - 1, this.bottomCoord + this.height + 5, 0, this);
    }
});