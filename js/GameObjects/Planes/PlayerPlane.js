PlayerPlane = Plane.extend({
    init: function () {
        var maxHealth = 100,
            damage = 1,
            shootFrequency = 120,
            width = 100,
            height = 80;
        this._super(maxHealth, damage, shootFrequency, width, height); //maxHealth, damage, shoot frequency, width, height
        this.div.id = "playerPlaneDiv";
        $(this.div).css('background-image', 'url(images/planes/player.png)');
        this.isShooting = false;
        this.isStealthed = false;
        this.skills = [];
        this.absorptionShieldStrength = 0;
        this.level = 1;
        this.stars = 0;

        this.bulletType = "player";
    },

    img: $('<img src="images/planes/player.png"/>')[0],
    stars: null,
    level: null,
    absorptionShieldStrength: null,
    isShooting: null,
    isStealthed: null,
    skills: null,
    shoot: function () {
        if (this.isShooting && this.tryShoot()) {
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