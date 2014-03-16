//The generic enemy plane
EnemyFighter = EnemyPlane.extend({
    init: function (left, bottom, movementSpeed) {
        this._super(left, bottom);
        this.movementSpeed = movementSpeed;
        this.image.src = 'images/planes/fighter.png';
        this.changeDirection();
        this.lastDirectionChangeTimestamp = -1;
        this.lastShootTimestamp = -1;
    },
    movementSpeed: null, 
    movingRight: null,   //boolean (movingRight == false) => fighter is moving left
    movingUp: null,      //boolean (movingUp == false)    => figther is moving down
    lastDirectionChangeTimestamp: null,
    lastShootTimestamp: null,

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
        //fighters can only move diagonally
        if (this.movingRight && this.leftCoord < (960 - 90)) {
            this.leftCoord += this.movementSpeed;
        } else if (!this.movingRight && this.leftCoord > 0){
            this.leftCoord -= this.movementSpeed;
        }

        if (this.movingUp && this.bottomCoord < (700 - 70)) {
            this.bottomCoord += this.movementSpeed;
        } else if (!this.movingUp && this.bottomCoord > (350)) {
            this.bottomCoord -= this.movementSpeed;
        }
    },

    shoot: function () {
        interactionManager.spawnBullet("enemy", this.leftCoord + 45, this.bottomCoord);
    }
});