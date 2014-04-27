//The generic enemy plane
EnemyFighter = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        var shootFrequency = 1500,
            width = 90,
            height = 72;
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
        this.bulletType = "fighter";
        this.changeDirection();
        this.skills = [new SpreadShot(this)];
        this.healingOrbSpawnChance = 10;
    },

    img: $('<img src="images/planes/fighter.png"/>')[0],

    shoot: function () {
        if (this.tryShoot()) {
            InteractionManager.spawnBullet(this.bulletType, this.leftCoord + this.width / 2, this.bottomCoord, 0, this);
        }
    },

});