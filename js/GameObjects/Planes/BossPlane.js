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
        $(this.castBar)
            .toggleClass('castBarBoss')
            .css('top', this.height)
            .appendTo(this.div);
        this.div.className = 'bossPlaneDiv';
        $(this.div).css('background-image', 'url(images/planes/boss.png)');
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
        var playerLeft = interactionManager.getPlayerLeftCoord(),
            playerBottom = interactionManager.getPlayerBottomCoord();
        this.orientationDeg = getChaseAngle(this.leftCoord + (this.width / 2) + Math.ceil(this.orientationDeg * 5 / 3), this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3), playerLeft + 50, playerBottom + 40);

        if (this.leftCoord + 150 > playerLeft + 50) {
            this.orientationDeg *= -1;
        }

        if (this.bottomCoord > playerBottom) {
            this.div.style['-webkit-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
			this.div.style['-moz-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
        } else {
            this.div.style['-webkit-transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
			this.div.style['-moz-transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
			this.div.style['transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
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
            interactionManager.spawnBullet("boss", this.leftCoord + (this.width / 2) + Math.ceil(this.orientationDeg * 5 / 3), this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3) , -this.orientationDeg, this);
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
                    interactionManager.spawnBullet("boss", this.leftCoord + 150 + Math.ceil(this.orientationDeg * 5 / 3), this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3), -this.orientationDeg, this);
                } else {
                    for (i = 0; i < this.secondPhaseStats.bulletsPerShot; i++) {
                        interactionManager.spawnBullet(this.bulletType, this.leftCoord + 145, this.bottomCoord, -(this.secondPhaseStats.arcDegree / 2) + (i * (this.secondPhaseStats.arcDegree / (this.secondPhaseStats.bulletsPerShot - 1))), this);
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
            interactionManager.spawnBullet("boss", this.leftCoord + 150, this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3), -this.orientationDeg, this);
            this.thirdPhaseDeathRays.push(interactionManager.createAndSkewBossDeathRay(-this.orientationDeg));
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
        $(this.hpBar).css('display', 'none');
        $(this.hpBarEmpty).css('display', 'none');
        $(this.div).animate({
            'opacity': 0.2
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'scale(' + now + ', ' + now + ')');
				$(this).css('-moz-transform', 'scale(' + now + ', ' + now + ')');
				$(this).css('transform', 'scale(' + now + ', ' + now + ')');
            },
            duration: 3000
        });
    },

    leaveQuarterPhase: function () {
        var self = this;
        this.finishedSpawningReinforcements = false;
        $(this.div).animate({
            'opacity': 1
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'scale(' + now + ', ' + now + ')');
				$(this).css('-moz-transform', 'scale(' + now + ', ' + now + ')');
				$(this).css('transform', 'scale(' + now + ', ' + now + ')');
            },
            complete: function () {
                self.isCasting = false;
                self.isInvulnerable = false;
                self.isInQuarterPhase = false;
                $(self.hpBar).css('display', 'block');
                $(self.hpBarEmpty).css('display', 'block');
            },
            duration: 3000
        });
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
    }
});