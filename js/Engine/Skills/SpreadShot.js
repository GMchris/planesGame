SpreadShot = Skill.extend({
    init: function (plane, index) {
        this._super("Spread Shot", plane, 5000, 15000, "spreadShotIcon", index); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
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
        var i;
        if (this.tryShoot()) {
            if ((this instanceof PlayerPlane) && this.isShooting) {
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, -15, this);
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, 0, this);
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, 15, this);
            } else if (this instanceof EnemyFighter) {
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, -15, this);
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 0, this);
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 15, this);
            } else if (this instanceof BossPlane) {
                var amountOfBullets = 25;
                for (i = 0; i < amountOfBullets; i++) {
                    InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 145, this.bottomCoord, -40 + (i * (80 / (amountOfBullets - 1))), this);
                }
            }
        }
    }
});