﻿GuidedRocket = PiercingBullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 61, 100);
        this.div.className = "guidedRocketDiv";
        $(this.div).css('background-image', 'url(images/skills/guidedRocket.png)');
    },

    chaseTarget: function (targetLeft, targetBottom) {
        var i,
            newOrientationDeg = Utility.getChaseAngle(this.leftCoord, this.bottomCoord, targetLeft, targetBottom),
            deltaDegree,
            direction;
        if (this.leftCoord > targetLeft) {
            newOrientationDeg *= -1;
        }
        //this.orientationDeg = newOrientationDeg;
        //this.rotate(targetBottom);
        direction = (newOrientationDeg > this.orientationDeg) ? 1 : -1;
        deltaDegree = Math.abs(this.orientationDeg - newOrientationDeg);
        for (i = 0; i < deltaDegree ; i++) { //rotate at increments of 1
            this.orientationDeg += direction;
            this.rotate(targetBottom);
        }
        
    },

    rotate: function (targetBottom) {
        if (this.bottomCoord > targetBottom) {
            this.div.style['-webkit-transform'] = 'rotate(' + (180 - this.orientationDeg) + 'deg)';
			this.div.style['-ms-transform'] = 'rotate(' + (180 - this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (180 - this.orientationDeg) + 'deg)';
        } else {
            this.div.style['-webkit-transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
			this.div.style['-ms-transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (this.orientationDeg) + 'deg)';
        }
    },

    die: function () {
        var self = this;
        $(this.hpBarEmpty).remove();
        $(this.hpBar).remove();
        this.div.style['-webkit-animation'] = 'enemyDeathAnimation 1.5s';
		this.div.style['animation'] = 'enemyDeathAnimation 1.5s';
        window.setTimeout(function () {
            $(self.div).remove();
        }, 1500);
    }
});