BossSpreadShot = BossSkill.extend({
    init: function (plane) {
        this._super("Boss Spread Shot", plane, 5000, 15000, ""); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
        this.use();
    },

    activate: function () {
        this._super();
        this.plane.shoot = this.newShoot;
    },

    deactivate: function () {
        this._super();
        this.plane.shoot = this.oldShoot;
    },

    oldShoot: function () { },

    newShoot: function () {
        var amountOfBullets = 25;
        for (i = 0; i < amountOfBullets; i++) {
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 145, this.bottomCoord, -40 + (i * (80 / (amountOfBullets - 1))), this);
        }
    }
});