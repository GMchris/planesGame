BossPlane = EnemyChasePlane.extend({
    init: function (left, bottom) {
        this._super(left, bottom, 1000, 5, 3);
        this.image.src = 'images/planes/boss.png';
        this.lastShootTimestamp = -1;
        this.shootFrequency = 500;
        this.isCasting = false;
        this.bulletType = 'boss';
        this.skills = [new BossSpreadShot(this)];
    },

    isCasting: null,
    skills: null,

    moveAtDirection: function () {
        if (!this.isCasting) {
            if (this.movingRight && this.leftCoord < (960 - 300)) {
                this.leftCoord += this.movementSpeed;
            } else if (!this.movingRight && this.leftCoord > 3) {
                this.leftCoord -= this.movementSpeed;
            }

            if (this.movingUp && this.bottomCoord < (700 - 120)) {
                this.bottomCoord += this.movementSpeed;
            } else if (!this.movingUp && this.bottomCoord > (350)) {
                this.bottomCoord -= this.movementSpeed;
            }
        }
    },

    shoot: function () {
        interactionManager.spawnBullet("boss", this.leftCoord + 145, this.bottomCoord, 0, this);
    },
});