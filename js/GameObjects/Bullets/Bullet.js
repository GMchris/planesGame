Bullet = GameObject.extend({
    init: function (left, bottom, orientationDeg) {
        this._super();
        this.updateCoords(left, bottom);
        this.move();
        this.orientationDeg = orientationDeg;
        
        this.div.style['-webkit-transform'] = 'rotate(' + this.orientationDeg + 'deg)';
    }
});