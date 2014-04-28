//an enemy plane with the added functionality to face the player
EnemyChasePlane = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height) {
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
        this.orientationDeg = 0;
    },

    orientationDeg: null,

    chasePlayer: function () {
        var playerLeft = InteractionManager.getPlayerLeftCoord(),
            playerBottom = InteractionManager.getPlayerBottomCoord();
        this.orientationDeg = Utility.getChaseAngle(this.leftCoord, this.bottomCoord, playerLeft, playerBottom);

        if (this.leftCoord > playerLeft) {
            this.orientationDeg *= -1;
        }
    },

    drawHpBar: function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.rect(-this.width / 2, (-this.height / 2) - 5, parseInt(this.width * (this.currentHealth / this.maxHealth)), 5);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(-this.width / 2, (-this.height / 2)  - 5, this.width, 5);
        ctx.stroke();
    },

    move: function () {
        if (!this.isAnimated) {
            var playerLeft = InteractionManager.getPlayerLeftCoord(),
                    playerBottom = InteractionManager.getPlayerBottomCoord();
            ctx.save();
            ctx.translate(this.leftCoord + this.width / 2, this.bottomCoord + this.height / 2);
            if (this.bottomCoord > playerBottom) {
                ctx.rotate(Utility.degreeToRadian(this.orientationDeg));
            } else {
                ctx.rotate(Utility.degreeToRadian(180 - this.orientationDeg));
            }
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
            this.drawHpBar();
            ctx.restore();
        } else {
            this._super();
        }
    }
});