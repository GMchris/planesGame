Plane = GameObject.extend({
    init: function (maxHealth, damage, shootFrequency, width, height) {
        this._super(width, height);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.damage = damage;
        this.shootFrequency = shootFrequency;
        this.lastShootTimestamp = -1;
    },
    maxHealth: null,
    currentHealth: null,
    damage: null,
    shootFrequency: null,
    bulletType: null,
    lastShootTimestamp: null,

    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    },

    tryShoot: function () {
        var nowMs = Date.now(),
            canShoot = false;

        if (nowMs - this.lastShootTimestamp > this.shootFrequency) {
            this.lastShootTimestamp = nowMs;
            canShoot = true;
        }

        return canShoot;
    },
});