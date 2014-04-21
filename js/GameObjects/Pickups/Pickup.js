Pickup = GameObject.extend({
    init: function (left, bottom, width, height) {
        this._super(width, height);
        this.updateCoords(left, bottom);
        this.move();
    },

    die: function () {
        var self = this;
        $(this.div).animate({
            width: 0,
            height: 0,
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