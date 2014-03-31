AIPlane = Plane.extend({
    init: function (left, bottom, maxHealth, damage) {
        this._super(maxHealth, damage);
        this.updateCoords(left, bottom);
        this.move();
        this.hpBar = document.createElement('div');
        $(this.hpBar).appendTo(this.div);
    },

    hpBar: null,

    updateHpBar: function () {
        this.hpBar.style.width = parseInt(this.currentHealth / this.maxHealth * 100) + '%';
    },

    die: function () {
        var self = this;
        this.div.style['-webkit-animation'] = 'enemyDeathAnimation 1.5s';
        window.setTimeout(function () {
            $(self.div).remove();
        }, 1500);
    }
});