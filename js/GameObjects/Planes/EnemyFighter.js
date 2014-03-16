//The generic enemy plane
EnemyFighter = EnemyPlane.extend({
    init: function (left, bottom, movementSpeed) {
        this._super(left, bottom);
        this.movementSpeed = movementSpeed;
        this.image.src = 'images/planes/fighter.png';
        this.changeDirection();
    },
    movementSpeed: null, 
    movingRight: null,   //boolean (movingRight == false) => fighter is moving left
    movingUp: null,      //boolean (movingUp == false)    => figther is moving down

    changeDirection: function () {
        //Generates a random number [0,3] and changes direction accordingly
        switch (parseInt(Math.random() * 4)) {
            case 0:
                this.movingLeft = false;
                this.movingDown = false;
                break;
            case 1:
                this.movingLeft = false;
                this.movingDown = true;
                break;
            case 2:
                this.movingLeft = true;
                this.movingDown = false;
                break;
            case 3:
                this.movingLeft = true;
                this.movingDown = true;
                break;
            default:
                throw new Error("Error with generating a random number [0,3] @ EnemyFighter::changeDirection()");
        }
    },

    moveAtDirection: function () {
        //fighters can only move diagonally
        if (this.movingRight && this.leftCoord < (960 - 45)) {
            this.leftCoord += this.movementSpeed;
        } else if (!this.movingRight && this.leftCoord > (0 + 45)){
            this.leftCoord -= this.movementSpeed;
        }

        if (this.movingUp && this.bottomCoord < (700 - 35)) {
            this.bottomCoord += this.movementSpeed;
        } else if (!this.movingUp && this.bottomCoord > (0 + 35)) {
            this.bottomCoord -= this.movementSpeed;
        }
    }
});