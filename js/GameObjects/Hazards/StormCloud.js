StormCloud = Hazard.extend({
    init: function (left, bottom) {
        this._super(left, bottom, 80, 80);
        this.damageFrequencyMs = 500;
        this.lastDamageTickTimestamp = -1;
        this.frameCount = 4;
    },

    damageFrequencyMs: null,
    lastDamageTickTimestamp: null,
    img: $('<img src="images/planes/stormCloudFrames.png" />')[0],

    animateCast: function (casterLeft, casterBottom, casterWidth) {
        var self = this,
            angle = Utility.getChaseAngle(casterLeft + casterWidth / 2, casterBottom, this.leftCoord + 40, this.bottomCoord + 40),
            castDiv;
        if (casterLeft < this.leftCoord) {
            angle *= -1;
        }
        castDiv = $('<div></div>')
                    .toggleClass('stormCloudCast')
                    .css({
                        'left': casterLeft,
                        'bottom': casterBottom,
                        '-webkit-transform': 'rotate(' + angle + 'deg)',
						'-ms-transform': 'rotate(' + angle + 'deg)',
						'transform': 'rotate(' + angle + 'deg)'
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