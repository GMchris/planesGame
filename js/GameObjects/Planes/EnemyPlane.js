EnemyPlane = AIPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height) {
        this._super(left, bottom, maxHealth, damage, shootFrequency, width, height);
        this.movementSpeed = movementSpeed;
        this.updateCoords(left, bottom);
        this.move();
        this.lastDirectionChangeTimestamp = -1;
    },
    movingRight: null,
    movingUp: null,
    lastDirectionChangeTimestamp: null,
    healingOrbSpawnChance: null, //percent

    

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

    move: function () {
        this._super();
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
    },

    die: function () {
        this._super();
        if (parseInt(Math.random() * 100 + 1) <= this.healingOrbSpawnChance) {
            InteractionManager.spawnHealingOrb(this.leftCoord + (this.width / 2 - 20), this.bottomCoord + (this.height / 2 - 20));
        }
    }
});