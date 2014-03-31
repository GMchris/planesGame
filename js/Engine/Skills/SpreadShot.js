SpreadShot = Skill.extend({
    init: function (plane) {
        this._super("Spread Shot", plane, 5000, 15000,"spreadShotIcon"); //plane using the skill, duration, cooldown
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
        if ((this instanceof PlayerPlane) && this.isShooting) {
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, -15);
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, 0);
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, 15);
        } else if (this instanceof EnemyFighter) {
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, -15, this);
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 0, this);
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 15, this);
        }
    }
});