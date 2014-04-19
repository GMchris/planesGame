PlayerPlane = Plane.extend({
    init: function () {
        this._super(100, 1); //maxHealth, damage
        this.div.id = "playerPlaneDiv";
        this.image.id = "playerPlaneImage";
        this.image.src = 'images/planes/player.png';
		this.width = 100;
		this.height = 80;
        this.isShooting = false;
        this.isStealthed = false;
        this.skills = [];
        this.absorptionShieldStrength = 0;

        this.bulletType = "player";
    },

    absorptionShieldStrength: null,
    isShooting: null,
    isStealthed: null,
    skills: null,
    shoot: function () {
        if (this.isShooting) {
            if (interactionManager.getEnemiesCount() > 0 || interactionManager.getCurrentMission() instanceof BossMission)  {
                interactionManager.spawnBullet(this.bulletType, this.leftCoord + this.width/2, this.bottomCoord + this.height, 0, this);
            } else {
                interactionManager.spawnBullet("player", this.leftCoord + this.width/2, this.bottomCoord + this.height, 0, this);
            }
        }
    },

    updateHpBar: function () {
        var currentHealthPercentage = parseInt(this.currentHealth / this.maxHealth * 100);
        $("#hpBar").css("width", currentHealthPercentage * 2 + "px");
    }
});