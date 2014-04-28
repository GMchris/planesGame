BossPlane = EnemyChasePlane.extend({
    init: function (left, bottom) {
        var shootFrequency = 500, //ms
            width = 300,
            height = 240,
            health = 700,
            damage = 7,
            movementSpeed = 3;
        this._super(left, bottom, health, damage, movementSpeed, shootFrequency, width, height);
        this.castBar = document.createElement('div');
        this.lastShootTimestamp = -1;
        this.isCasting = false;
        this.bulletType = 'boss';
        this.skills = [new BossSpreadShot(this), new BossDeathRays(this), new BossSummonStormClouds(this)];
        this.healthPercentage = 100;
        this.reached75Percent = false;
        this.reached50Percent = false;
        this.reached25Percent = false;
        this.currentPhase = 1;
        this.isInvulnerable = false;
        this.isInQuarterPhase = false;
        this.finishedSpawningReinforcements = false;
        this.normalShootFunction = this.shoot;
        this.thirdPhaseDeathRays = []; //array of jQuery objects of death ray divs; this is used for optimization purposes
    },
    img: $('<img src="images/planes/boss.png"/>')[0],
    castBar: null,
    isCasting: null,
    isInvulnerable: null,
    isInQuarterPhase: null,
    skills: null,
    healthPercentage: null,
    currentPhase: null,
    reached75Percent: null,
    reached50Percent: null,
    reached25Percent: null,
    finishedSpawningReinforcements: null,
    thirdPhaseBulletDegrees: null,
    normalShootFunction: null,
    secondPhaseStats: null,

    updateHealthPercentage: function () {
        this.healthPercentage = Math.ceil(this.currentHealth / this.maxHealth * 100);
    },

    chasePlayer: function () {
        var playerLeft = InteractionManager.getPlayerLeftCoord(),
            playerBottom = InteractionManager.getPlayerBottomCoord();
        this.orientationDeg = Utility.getChaseAngle(this.leftCoord + (this.width / 2) + Math.ceil(this.orientationDeg * 5 / 3), this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3), playerLeft + 50, playerBottom + 40);

        if (this.leftCoord + 150 > playerLeft + 50) {
            this.orientationDeg *= -1;
        }
    },

    moveAtDirection: function () {
        if (!this.isCasting) {
            if (this.movingRight && this.leftCoord < (960 - 300)) {
                this.leftCoord += this.movementSpeed;
            } else if (!this.movingRight && this.leftCoord > 3) {
                this.leftCoord -= this.movementSpeed;
            }

            if (this.movingUp && this.bottomCoord < (700 - 120)) {
                this.bottomCoord += this.movementSpeed;
            } else if (!this.movingUp && this.bottomCoord > (350)) {
                this.bottomCoord -= this.movementSpeed;
            }
        }
    },

    moveThirdPhase: function () {
        if (!this.isInQuarterPhase) {
            this.chasePlayer();
        }
    },

    moveFourthPhase: function () {
        if (!this.isInQuarterPhase) {
            this.chasePlayer();
        }
        if (!this.isCasting) {
            if (this.movingRight && this.leftCoord < (960 - 300)) {
                this.leftCoord += this.movementSpeed;
            } else if (!this.movingRight && this.leftCoord > 3) {
                this.leftCoord -= this.movementSpeed;
            }

            if (this.movingUp && this.bottomCoord < (700 - 120)) {
                this.bottomCoord += this.movementSpeed;
            } else if (!this.movingUp && this.bottomCoord > (350)) {
                this.bottomCoord -= this.movementSpeed;
            }
        }
    },

    shoot: function () {
        if (!this.isCasting && !this.isInQuarterPhase && this.tryShoot()) {
            InteractionManager.spawnBullet("boss", this.leftCoord + (this.width / 2) + Math.ceil(this.orientationDeg * 5 / 3), this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3) , -this.orientationDeg, this);
        }
    },

    shootSecondPhase: function () {
        if (this.tryShoot()) {
            if (!this.secondPhaseStats) {
                this.secondPhaseStats = {
                    bulletsPerShot: 1,
                    arcDegree: 8,
                    shootCount: 0
                }
            }
            if (!this.isCasting && !this.isInQuarterPhase) {
                if (this.secondPhaseStats.bulletsPerShot == 1) {
                    InteractionManager.spawnBullet("boss", this.leftCoord + 150 + Math.ceil(this.orientationDeg * 5 / 3), this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3), -this.orientationDeg, this);
                } else {
                    for (i = 0; i < this.secondPhaseStats.bulletsPerShot; i++) {
                        InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 145, this.bottomCoord, -(this.secondPhaseStats.arcDegree / 2) + (i * (this.secondPhaseStats.arcDegree / (this.secondPhaseStats.bulletsPerShot - 1))), this);
                    }
                }
                this.secondPhaseStats.shootCount++;
                if (this.secondPhaseStats.shootCount % 3 == 0 && this.secondPhaseStats.arcDegree < 40) { //every third shot , the amount of bullets increases
                    this.secondPhaseStats.bulletsPerShot += 2;
                    this.secondPhaseStats.arcDegree += 4;
                }
            }
        }
    },

    shootThirdPhase: function () {
        if (!this.isCasting && !this.isInQuarterPhase && this.tryShoot()) {
            InteractionManager.spawnBullet("boss", this.leftCoord + 150, this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3), -this.orientationDeg, this);
            this.thirdPhaseDeathRays.push(InteractionManager.createAndSkewBossDeathRay(-this.orientationDeg));
            if (this.thirdPhaseDeathRays.length >= 3) { //after shooting 5 bullets, the plane shoots 5 death rays, each in the same place as one of the 5 shot bullets
                this.skills[0].use();
            }
        }
    },

    enterQuarterPhase: function () {
        var self = this, i;
        this.currentPhase++;
        this.isCasting = true;
        this.isInvulnerable = true;
        this.isInQuarterPhase = true;
        CAnimations.animate(this, {
            opacity: 0,
            scale: 0,
            rotation: 0,
            left: self.leftCoord,
            bottom: self.bottomCoord,
            frames: 180,
        });
    },

    leaveQuarterPhase: function () {
        var self = this;
        this.finishedSpawningReinforcements = false;
        CAnimations.animate(this, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            left: self.leftCoord,
            bottom: self.bottomCoord,
            frames: 180,
        });
        window.setTimeout(function () {
            self.isCasting = false;
            self.isInvulnerable = false;
            self.isInQuarterPhase = false;
        }, 3000);
    },

    phase75Percent: function () {
        this.skills[0].lock();
    },

    phase50Percent: function () {
        this.moveAtDirection = this.moveThirdPhase;
    },

    phase25Percent: function () {
        this.moveAtDirection = this.moveFourthPhase;
        this.skills[0].lock();
        this.skills[1].unlock();
    },

    drawCastBar: function () {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(-this.width / 2, (-this.height / 2) - 5, this.width * parseInt($(this.castBar).css('width')) / 100, 5);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(-this.width / 2, (-this.height / 2) - 5, this.width, 5);
        ctx.stroke();
    },

    move: function () {
        var playerLeft = InteractionManager.getPlayerLeftCoord(),
            playerBottom = InteractionManager.getPlayerBottomCoord();
        ctx.save();
        ctx.translate(this.leftCoord + this.width / 2, this.bottomCoord + this.height / 2);
        if (this.bottomCoord > playerBottom) {
            ctx.rotate(Utility.degreeToRadian(this.orientationDeg));
        } else {
            ctx.rotate(Utility.degreeToRadian(180 - this.orientationDeg));
        }
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
        this.drawHpBar();
        this.drawCastBar();
        ctx.restore();
    }
});