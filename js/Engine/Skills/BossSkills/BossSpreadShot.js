BossSpreadShot = BossSkill.extend({
    init: function (plane) {
        this._super("Boss Spread Shot", plane, 5000, 5000, ""); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
    },

    activate: function () {
        this._super();
        this.plane.shoot = this.newShoot;
    },

    deactivate: function () {
        this._super();
        if (this.plane.shoot == this.newShoot) {
            this.plane.shoot = this.oldShoot;
        }
    },

    oldShoot: function () { },

    newShoot: function () {
        var amountOfBullets = 15;
        if (!this.isInQuarterPhase && this.tryShoot()) {
            for (i = 0; i < amountOfBullets; i++) {
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 145, this.bottomCoord, -this.orientationDeg - 35 + (i * (70 / (amountOfBullets - 1))), this);
            }
        }
    }
});