PlayerPlane = Plane.extend({
    init: function () {
        this._super(10000, 1, 100, 80); //maxHealth, damage, width, height
        this.div.id = "playerPlaneDiv";
        $(this.div).css('background-image', 'url(images/planes/player.png)');
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