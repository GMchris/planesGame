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
    addToScreen: function () {
        //$(this.div).appendTo("#gameScreen");
    },
    updateCoords: function (left, bottom) {
        this.leftCoord = left;
        this.bottomCoord = bottom;
    },
    move: function () {
        if (this.readyToMove) {
            this.div.style.left = this.leftCoord + 'px';
            this.div.style.bottom = this.bottomCoord + 'px';
        }
    }
});