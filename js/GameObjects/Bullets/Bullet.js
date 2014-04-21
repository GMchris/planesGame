Bullet = GameObject.extend({
    init: function (left, bottom, orientationDeg, owner, width, height) {
        this._super(width, height);
        this.owner = owner;
        this.updateCoords(left, bottom);
        this.move();
        this.orientationDeg = orientationDeg;
        this.toBeSpliced = false;               //true if the bullet is to be removed from the bullets array 
        
        this.div.style['-webkit-transform'] = 'rotate(' + this.orientationDeg + 'deg)';
    },

    owner: null,
    toBeSpliced: null,

    handleCollision: function () {
        this.toBeSpliced = true;
        this.die();
    },

    die: function () {
        $(this.div).remove();
    }
});