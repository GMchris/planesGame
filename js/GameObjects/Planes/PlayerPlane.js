PlayerPlane = Plane.extend({
    init: function () {
        this._super();
        this.div.id = "playerPlaneDiv";
        this.image.id = "playerPlaneImage";
        this.image.src = 'images/planes/player.png';
        this.isShooting = false;
    },
    isShooting: null,
    shoot: function () {
        if (this.isShooting) {
            interactionManager.spawnPlayerBullet(this.leftCoord + 50, this.bottomCoord + 80);
        }
    }
});