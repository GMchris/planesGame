GameObject = Class.extend({
    init: function () {
        this.div = document.createElement('div');
    },
    leftCoord: null,
    bottomCoord: null,
    div: null,
    addToScreen: function () {
        $(this.div).appendTo("#gameScreen");
    },
    updateCoords: function (left, bottom) {
        this.leftCoord = left;
        this.bottomCoord = bottom;
    },
    move: function () {
        this.div.style.left = this.leftCoord + 'px';
        this.div.style.bottom = this.bottomCoord + 'px';
    }
});