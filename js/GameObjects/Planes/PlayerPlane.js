PlayerPlane = Plane.extend({
    init: function () {
        this._super(100, 1); //maxHealth, damage
        this.div.id = "playerPlaneDiv";
        this.image.id = "playerPlaneImage";
        this.image.src = 'images/planes/player.png';
        this.isShooting = false;
        this.skills = [new SpreadShot(this), new PiercingShot(this), new HomingShot(this), new StopTime(this)];

        this.bulletType = "player";
    },
    isShooting: null,
    skills: [],
    shoot: function () {
        if (this.isShooting) {
            if (interactionManager.getEnemiesCount() > 0) {
                interactionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, 0);
            } else {
                interactionManager.spawnBullet("player", this.leftCoord + 50, this.bottomCoord + 80, 0);
            }
        }
    }
});