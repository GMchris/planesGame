//The generic enemy plane
EnemyFighter = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        this._super(left, bottom, maxHealth, damage, movementSpeed);
        this.image.src = 'images/planes/fighter.png';
        this.bulletType = "fighter";
        this.changeDirection();
        this.lastShootTimestamp = -1;
        this.skills = [new SpreadShot(this)];
    },
    
    lastShootTimestamp: null,

    shoot: function () {
        interactionManager.spawnBullet("fighter", this.leftCoord + 45, this.bottomCoord, 0, this);
    },

});