SpreadShot = Skill.extend({
    init: function (plane) {
        this._super("Spread Shot", plane, 5000, 15000); //plane using the skill, duration, cooldown
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
        var playerOrEnemy = (this instanceof PlayerPlane) ? "player" : "enemy";
        if ((this instanceof EnemyPlane) || this.isShooting) {
            for (var i = 1; i <= 10; i++) {
                interactionManager.spawnBullet(playerOrEnemy, this.leftCoord + 50, this.bottomCoord + 80, -45 + i * 9);
            }
        }
    }
});