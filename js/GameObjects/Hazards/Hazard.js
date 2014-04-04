Hazard = GameObject.extend({
    init: function (left, bottom) {
        this._super();
        this.updateCoords(left, bottom);
        this.move();
    }
});