AIPlane = Plane.extend({
    init: function (left, bottom, maxHealth, damage, shootFrequency, width, height) {
        this._super(maxHealth, damage, shootFrequency, width, height);
        this.updateCoords(left, bottom);
        this.move();
    },

    hpBar: null,

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

        this.animationProps.opacityCurrent = 0;
        CAnimations.animate(this, {
            opacity: 1,
            rotation: 0,
            scale: 1,
            left: currentLeftCoord,
            bottom: this.bottomCoord,
            frames: 90
        });
    },

    die: function () {
        var self = this;
        CAnimations.animate(this, {
            opacity: 0,
            rotation: 179,
            scale: 0,
            left: this.leftCoord,
            bottom: this.bottomCoord,
            frames: 80,
        });
    },

    move: function () {
        this._super();
    }
});