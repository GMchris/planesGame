Hazard = GameObject.extend({
    init: function (left, bottom, width, height) {
        this._super(width, height);
        this.updateCoords(left, bottom);
        this.move();
    },

    addToScreen: function () {
        $(this.div).appendTo("#gameScreen");
    },
});