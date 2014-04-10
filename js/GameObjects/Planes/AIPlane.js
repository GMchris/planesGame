AIPlane = Plane.extend({
    init: function (left, bottom, maxHealth, damage) {
        this._super(maxHealth, damage);
        this.hpBar = document.createElement('div');
        $(this.hpBar).appendTo(this.div);
        this.updateCoords(left, bottom);
        this.move();
    },

    hpBar: null,

    updateHpBar: function () {
        this.hpBar.style.width = parseInt(this.currentHealth / this.maxHealth * 100) + '%';
    },

    animateSpawn: function () {
        var rand = parseInt(Math.random() * 2),
            currentLeftCoord = this.leftCoord;

        switch (rand) {
            case 0:
                this.leftCoord = 0; //plane comes from the left side
                break;
            case 1:
                this.leftCoord = 960; //plane comes from the right side
                break;
            default:
                throw new Error('Error generating a random number [0, 2]');
        }

        this.move();
        $(this.div).css('opacity', 0);
        $(this.div).animate({
            'left': currentLeftCoord,
            'opacity': 1
        }, {
            step: function (now, fx) {
                if (fx.prop == 'opacity') {
                    $(this).css('-webkit-transform', 'scale(' + now + ', ' + now + ')');
                }
            },

            duration: 1500
        });

        this.leftCoord = currentLeftCoord;
        this.move();
    },

    die: function () {
        var self = this;
        this.div.style['-webkit-animation'] = 'enemyDeathAnimation 1.5s';
        window.setTimeout(function () {
            $(self.div).remove();
        }, 1500);
    }
});