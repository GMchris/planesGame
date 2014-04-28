GameObject = Class.extend({
    init: function (width, height) {
        this.div = document.createElement('div');
        this.readyToMove = true;
        this.width = width;
        this.height = height;
    },

    width: null,
    height: null,
    readyToMove: null,
    leftCoord: null,
    bottomCoord: null,
    div: null,

    updateCoords: function (left, bottom) {
        this.leftCoord = left;
        this.bottomCoord = bottom;
    }
});