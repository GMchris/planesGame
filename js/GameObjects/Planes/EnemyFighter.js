//The generic enemy plane
EnemyFighter = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        this._super(left, bottom, maxHealth, damage, movementSpeed, 90, 72);
        this.div.className = 'enemyFighterDiv';
        $(this.div).css('background-image', 'url(images/planes/fighter.png)');
        this.bulletType = "fighter";
        this.changeDirection();
        this.lastShootTimestamp = -1;
        this.skills = [new SpreadShot(this)];
        this.healingOrbSpawnChance = 10;
    },
    
    lastShootTimestamp: null,

    shoot: function () {
        interactionManager.spawnBullet("fighter", this.leftCoord + this.width/2, this.bottomCoord, 0, this);
    },

});