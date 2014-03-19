Bullet = GameObject.extend({
    init: function (left, bottom, orientationDeg) {
        this._super();
        this.updateCoords(left, bottom);
        this.move();
        this.orientationDeg = orientationDeg;
        this.toBeSpliced = false;               //true if the bullet is to be removed from the bullets array 
        
        this.div.style['-webkit-transform'] = 'rotate(' + this.orientationDeg + 'deg)';
    },

    toBeSpliced: null,

    handleCollision: function () {
        this.toBeSpliced = true;
        this.die();
    },

    die: function () {
        $(this.div).remove();
    }
});