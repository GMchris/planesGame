﻿PlayerPlane = Plane.extend({
    init: function () {
        this._super(100, 1); //maxHealth, damage
        this.div.id = "playerPlaneDiv";
        this.image.id = "playerPlaneImage";
        this.image.src = 'images/planes/player.png';
        this.isShooting = false;
    },
    isShooting: null,
    shoot: function () {
        if (this.isShooting) {
            interactionManager.spawnBullet("player", this.leftCoord + 50, this.bottomCoord + 80, -15);
            interactionManager.spawnBullet("player", this.leftCoord + 50, this.bottomCoord + 80, 0);
            interactionManager.spawnBullet("player", this.leftCoord + 50, this.bottomCoord + 80, 15);
        }
    }
});