Bullet = GameObject.extend({
    init: function (left, bottom, orientationDeg, owner, width, height) {
        this._super(width, height);
        this.owner = owner;
        this.updateCoords(left, bottom);
        this.move();
        this.orientationDeg = orientationDeg;
        this.toBeSpliced = false;               //true if the bullet is to be removed from the bullets array 
    },

    owner: null,
    toBeSpliced: null,
    bulletColor: null,

    handleCollision: function () {
        this.toBeSpliced = true;
    },

    move: function () {
        ctx.beginPath();
        ctx.fillStyle = this.bulletColor;
        ctx.rect(this.leftCoord, this.bottomCoord, this.height, this.width);
        ctx.fill();
    }
});