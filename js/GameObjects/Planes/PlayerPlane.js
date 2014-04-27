PlayerPlane = Plane.extend({
    init: function () {
        var maxHealth = 100,
            damage = 1,
            shootFrequency = 120,
            width = 100,
            height = 80;
        this._super(maxHealth, damage, shootFrequency, width, height); //maxHealth, damage, shoot frequency, width, height
        this.isShooting = false;
        this.isStealthed = false;
        this.skills = [];
        this.absorptionShieldStrength = 0;
        this.level = 1;
        this.stars = 0;
        this.bulletType = "player";
        this.originalMoveFunction = this.move;
    },

    img: $('<img src="images/planes/player.png"/>')[0],
    stars: null,
    level: null,
    absorptionShieldStrength: null,
    isShooting: null,
    isStealthed: null,
    originalMoveFunction: null,
    skills: null,
    shoot: function () {
        if (this.isShooting && this.tryShoot()) {
            if (InteractionManager.getEnemiesCount() > 0 || InteractionManager.getCurrentMission() instanceof BossMission)  {
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + this.width/2, this.bottomCoord + this.height, 0, this);
            } else {
                InteractionManager.spawnBullet("player", this.leftCoord + this.width/2, this.bottomCoord + this.height, 0, this);
            }
        }
    },

    updateHpBar: function () {
        var currentHealthPercentage = parseInt(this.currentHealth / this.maxHealth * 100);
        $("#hpBar").css("width", currentHealthPercentage * 2 + "px");
    },

    stealthMove: function () {
        if (!this.isAnimated) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.drawImage(this.img, this.leftCoord, this.bottomCoord);
            this.drawHpBar();
            ctx.restore();
        }
    },

    shieldMove: function () { 
        if (!this.isAnimated) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc((this.leftCoord + this.width/2), (this.bottomCoord + this.height/2), this.width/2, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#ffff66';
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.drawImage(this.img, this.leftCoord, this.bottomCoord);
            this.drawHpBar();
            ctx.restore();
        }
    },
});