BossPlane = EnemyChasePlane.extend({
    init: function (left, bottom) {
        this._super(left, bottom, 500, 5, 3);
        var self = this;
        this.castBar = document.createElement('div');
        $(this.castBar)
            .toggleClass('castBarBoss')
            .appendTo(this.div);
        this.image.src = 'images/planes/boss.png';
        this.lastShootTimestamp = -1;
        this.shootFrequency = 500;
        this.isCasting = false;
        this.bulletType = 'boss';
        this.skills = [];
        this.healthPercentage = 100;
        this.reached75Percent = false;
        this.reached50Percent = false;
        this.reached25Percent = false;
        this.isInvulnerable = false;
        this.isInQuarterPhase = false;
        this.finishedSpawningReinforcements = false;
    },

    castBar: null,
    isCasting: null,
    isInvulnerable: null,
    isInQuarterPhase: null,
    skills: null,
    healthPercentage: null,
    reached75Percent: null,
    reached50Percent: null,
    reached25Percent: null,
    quarterPhaseHealthRegenInterval: null,
    finishedSpawningReinforcements: null,

    updateHealthPercentage: function () {
        this.healthPercentage = Math.ceil(this.currentHealth / this.maxHealth * 100);
    },

    chasePlayer: function () {
        var playerLeft = interactionManager.getPlayerLeftCoord(),
            playerBottom = interactionManager.getPlayerBottomCoord();
        this.orientationDeg = getChaseAngle(this.leftCoord + 150, this.bottomCoord + 120, playerLeft + 50, playerBottom + 40);

        if (this.leftCoord + 150 > playerLeft + 50) {
            this.orientationDeg *= -1;
        }

        if (this.bottomCoord > playerBottom) {
            this.div.style['-webkit-transform'] = 'rotate(' + (-this.orientationDeg) + 'deg)';
        } else {
            this.div.style['-webkit-transform'] = 'rotate(' + (180 + this.orientationDeg) + 'deg)';
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

    moveAtDirectionChase: function () {
        if (!this.isCasting) {
            this.chasePlayer();
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
        if (!this.isCasting) {
            interactionManager.spawnBullet("boss", this.leftCoord + 150 + Math.ceil(this.orientationDeg * 5 / 3), this.bottomCoord + Math.abs(this.orientationDeg * 4 / 3) , -this.orientationDeg, this);
        }
    },

    enterQuarterPhase: function () {
        var self = this, i;
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
            },
            complete: function () {
                self.quarterPhaseHealthRegenInterval = window.setInterval(function () {
                    if (self.currentHealth <= self.maxHealth - 5) {
                        self.currentHealth += 2;
                    } else {
                        self.currentHealth = self.maxHealth;
                    }
                }, 1000);
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
        window.clearInterval(this.quarterPhaseHealthRegenInterval);
    },

    phase75Percent: function () {
        this.skills[1].unlock(); //unlock summon storm clouds
    },

    phase50Percent: function () {
        this.skills[0].lock();
    },

    phase25Percent: function () {
        this.moveAtDirection = this.moveAtDirectionChase;
        this.skills[0].lock();
    }
});

//TODO: remove boss from enemyPlanes array during quarter phase, add him after quarter phase is done