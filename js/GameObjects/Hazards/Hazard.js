﻿Hazard = SpriteGameObject.extend({
    init: function (left, bottom, width, height) {
        this._super(left, bottom, width, height);
        this.updateCoords(left, bottom);
    },

    addToScreen: function () {
        //$(this.div).appendTo("#gameScreen");
    },
});