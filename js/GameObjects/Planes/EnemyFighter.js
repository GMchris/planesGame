//The generic enemy plane
EnemyFighter = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        var shootFrequency = 1500,
            width = 90,
            height = 72;
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
        this.div.className = 'enemyFighterDiv';
        $(this.div).css('background-image', 'url(images/planes/fighter.png)');
        this.bulletType = "fighter";
        this.changeDirection();
        this.skills = [new SpreadShot(this)];
        this.healingOrbSpawnChance = 10;
    },

    shoot: function () {
        if (this.tryShoot()) {
            interactionManager.spawnBullet(this.bulletType, this.leftCoord + this.width / 2, this.bottomCoord, 0, this);
        }
    },

});