SentryPlane = Plane.extend({
    init: function (left, bottom, maxHealth, damage, targetPlane) {
        this._super(maxHealth, damage); //maxHealth, damage
           
        this.targetPlane = targetPlane;

        this.div.className = "sentryPlaneDiv";
        this.orientationDeg = 0;
        this.image.src = 'images/planes/sentry.png';
        this.hpBar = document.createElement('div');
        this.hpBar.className = "hpBarFriendly";
        $(this.hpBar).appendTo(this.div);

        this.bulletType = "player";

        this.updateCoords(left, bottom);
        this.move();
        this.lastShootTimestamp = -1;
    },

    shoot: function () {
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + 49, this.bottomCoord + 80, 0);
    },

    updateHpBar: function () {
        this.hpBar.style.width = parseInt(this.currentHealth / this.maxHealth * 100) + '%';
    },

    die: function () {
        var self = this;
        this.div.style['-webkit-animation'] = 'enemyDeathAnimation 1.5s';
        window.setTimeout(function () {
            $(self.div).remove();
        }, 1500);
    }
});