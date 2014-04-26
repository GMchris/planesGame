﻿//an enemy plane with the added functionality to face the player
EnemyChasePlane = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height) {
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
        this.orientationDeg = 0;
    },

    orientationDeg: null,

    chasePlayer: function () {
        var playerLeft = interactionManager.getPlayerLeftCoord(),
            playerBottom = interactionManager.getPlayerBottomCoord();
        this.orientationDeg = getChaseAngle(this.leftCoord, this.bottomCoord, playerLeft, playerBottom);

        if (this.leftCoord > playerLeft) {
            this.orientationDeg *= -1;
        }

        //if (this.bottomCoord > playerBottom) {
        //    this.div.style['-webkit-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
		//	this.div.style['-moz-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
		//	this.div.style['transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
        //} else {
        //    this.div.style['-webkit-transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
		//	this.div.style['-moz-transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
		//	this.div.style['transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
        //}
    },

    drawHpBar: function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.rect(-this.width / 2, (-this.height / 2) - 5, this.width * (this.currentHealth / this.maxHealth), 5);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(-this.width / 2, (-this.height / 2)  - 5, this.width, 5);
        ctx.stroke();
    },

    move: function () {
        var playerLeft = interactionManager.getPlayerLeftCoord(),
            playerBottom = interactionManager.getPlayerBottomCoord();
        ctx.save();
        ctx.translate(this.leftCoord + this.width / 2, this.bottomCoord + this.height / 2);
        //ctx.translate(this.leftCoord, this.bottomCoord); //kamikaze rotates around it's lower-left point, not around its center - feels unnatural
        if (this.bottomCoord > playerBottom) {
            ctx.rotate(degreeToRadian(this.orientationDeg));
        } else {
            ctx.rotate(degreeToRadian(180 - this.orientationDeg));
        }
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
        //ctx.drawImage(this.img, 0, 0);
        this.drawHpBar();
        ctx.restore();
    }
});