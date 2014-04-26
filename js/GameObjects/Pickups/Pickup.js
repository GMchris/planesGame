Pickup = SpriteGameObject.extend({
    init: function (left, bottom, width, height) {
        this._super(left,bottom,width, height);
        this.updateCoords(left, bottom);
    },

    die: function () {
        var self = this;
        $(this.div).animate({
            width: 0,
            height: 0,
            opacity: 0,
            left: '+=' + this.width / 2,
            bottom: '+=' + this.height / 2,
        }, {
            duration: 300,
            complete: function () {
                $(self.div).remove();
            }
        })
    }
});