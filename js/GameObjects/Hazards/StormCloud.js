StormCloud = Hazard.extend({
    init: function (left, bottom) {
        this._super(left, bottom);
        this.div.className = 'stormCloudDiv';
        this.lastDamageTickTimestamp = -1;
    },

    animateCast: function (casterLeft, casterBottom, casterWidth) {
        var self = this,
            angle = getChaseAngle(casterLeft + casterWidth / 2, casterBottom, this.leftCoord + 40, this.bottomCoord + 40),
            castDiv;
        if (casterLeft < this.leftCoord) {
            angle *= -1;
        }
        castDiv = $('<div></div>')
                    .toggleClass('stormCloudCast')
                    .css({
                        'left': casterLeft,
                        'bottom': casterBottom,
                        '-webkit-transform': 'rotate(' + angle + 'deg)'
                    })
                    .appendTo('#gameScreen')
                    .animate({
                        'left': self.leftCoord + 40,
                        'bottom': self.bottomCoord + 40,
                        'opacity': 0.3
                    }, {
                        duration: 300,
                        complete: function () {
                            $(this).remove();
                        }
                    });

    }
});