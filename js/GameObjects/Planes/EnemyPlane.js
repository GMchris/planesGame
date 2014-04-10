EnemyPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        this._super(left, bottom, maxHealth, damage);
        this.movementSpeed = movementSpeed;
        this.updateCoords(left, bottom);
        this.move();
        this.div.className = "enemyPlane";
        this.hpBar.className = "hpBarEnemy";
        this.hpBarEmpty.className = 'hpBarEnemyEmpty';
        this.lastDirectionChangeTimestamp = -1;
        $(this.hpBar).appendTo(this.div);
    },
    movingRight: null,
    movingUp: null,
    lastDirectionChangeTimestamp: null,

    changeDirection: function () {
        //Generates a random number [0,3] and changes direction accordingly
        switch (parseInt(Math.random() * 2)) {
            case 0:
                this.movingRight = !this.movingRight;
                break;
            case 1:
                this.movingUp = !this.movingUp;
                break;
            default:
                throw new Error("Error with generating a random number [0,1] @ EnemyFighter::changeDirection()");
        }

    },

    moveAtDirection: function () {
        if (this.movingRight && this.leftCoord < (960 - 95)) {
            this.leftCoord += this.movementSpeed;
        } else if (!this.movingRight && this.leftCoord > 3) {
            this.leftCoord -= this.movementSpeed;
        }

        if (this.movingUp && this.bottomCoord < (700 - 70)) {
            this.bottomCoord += this.movementSpeed;
        } else if (!this.movingUp && this.bottomCoord > (350)) {
            this.bottomCoord -= this.movementSpeed;
        }
    }
});