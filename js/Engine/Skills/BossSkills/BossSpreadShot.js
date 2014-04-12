BossSpreadShot = BossSkill.extend({
    init: function (plane) {
        this._super("Boss Spread Shot", plane, 5000, 15000, ""); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
        this.tryUse();
    },

    activate: function () {
        this._super();
        this.plane.shoot = this.newShoot;
    },

    deactivate: function () {
        this._super();
        this.plane.shoot = this.oldShoot;
        this.plane.isCasting = false;
    },

    oldShoot: function () { },

    newShoot: function () {
        var amountOfBullets = 15;
        for (i = 0; i < amountOfBullets; i++) {
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 145, this.bottomCoord, -this.orientationDeg - 40 + (i * (80 / (amountOfBullets - 1))), this);
        }
    }
});