SentryPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage, targetPlane) {
        this._super(left, bottom, maxHealth, damage);
        this.targetPlane = targetPlane;
        this.div.className = "sentryPlaneDiv";
        this.orientationDeg = 0;
        this.image.src = 'images/planes/sentry.png';
        this.hpBar.className = "hpBarFriendly";
        this.bulletType = "player";
        this.lastShootTimestamp = -1;
    },

    shoot: function () {
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + 49, this.bottomCoord + 80, 0);
    }
});