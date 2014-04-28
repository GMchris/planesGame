Plane = GameObject.extend({
    init: function (maxHealth, damage, shootFrequency, width, height) {
        var self = this;
        this._super(width, height);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.damage = damage;
        this.shootFrequency = shootFrequency;
        this.lastShootTimestamp = -1;
        this.isAnimated = false;
        this.animationProps = {
            currentFrame: 0,
            frames: 0,
            //current values of supported animation properties
            opacityCurrent: 1,
            rotationCurrent: 0,
            scaleCurrent: 1,
            //target values of supported animation properties
            opacityTarget: 1,
            rotationTarget: 0,
            scaleTarget: 1,
            leftTarget: -1,
            bottomTarget: -1,
            //delta values of supported animation properties
            opacityDelta: 0,
            rotationDelta: 0,
            scaleDelta: 0,
            leftDelta: 0,
            bottomDelta: 0,
        };
    },

    maxHealth: null,
    currentHealth: null,
    damage: null,
    shootFrequency: null,
    bulletType: null,
    lastShootTimestamp: null,
    isAnimated: null,
    animationProps: null,

    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    },

     updateHpBar: function () {
     },

    takeDamage: function (damage){
        if(this.currentHealth > damage){
            this.currentHealth -= damage;
        } else {
            this.currentHealth = 0;
        }
        this.updateHpBar();
    },

    receiveHeal: function(healingPoints){
        if((this.currentHealth + healingPoints) >= this.maxHealth){
            this.currentHealth = this.maxHealth;
        } else {
            this.currentHealth += healingPoints;
        }
        this.updateHpBar();
    },

    tryShoot: function () {
        var nowMs = Date.now(),
            canShoot = false;

        if (nowMs - this.lastShootTimestamp > this.shootFrequency) {
            this.lastShootTimestamp = nowMs;
            canShoot = true;
        }

        return canShoot;
    },

    drawHpBar: function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.rect(this.leftCoord, this.bottomCoord - 5, parseInt(this.width * (this.currentHealth / this.maxHealth)), 5);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(this.leftCoord, this.bottomCoord - 5, this.width, 5);
        ctx.stroke();
    },

    move: function () {
        if (!this.isAnimated) {
            ctx.drawImage(this.img, this.leftCoord, this.bottomCoord);
            this.drawHpBar();
        }
    }
});