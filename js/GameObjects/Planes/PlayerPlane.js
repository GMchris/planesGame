PlayerPlane = Plane.extend({
    init: function () {
        this._super(100, 1); //maxHealth, damage
        this.div.id = "playerPlaneDiv";
        this.image.id = "playerPlaneImage";
        this.image.src = 'images/planes/player.png';
        this.isShooting = false;
        this.isStealthed = false;
        this.skills = [];

        this.bulletType = "player";
    },
    isShooting: null,
    isStealthed: null,
    skills: null,
    shoot: function () {
        if (this.isShooting) {
            if (interactionManager.getEnemiesCount() > 0 || interactionManager.getCurrentMission() instanceof BossMission)  {
                interactionManager.spawnBullet(this.bulletType, this.leftCoord + 50, this.bottomCoord + 80, 0, this);
            } else {
                interactionManager.spawnBullet("player", this.leftCoord + 50, this.bottomCoord + 80, 0, this);
            }
        }
    }
});