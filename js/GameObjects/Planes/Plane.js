Plane = GameObject.extend({
    init: function (maxHealth, damage, shootFrequency, width, height) {
        this._super(width, height);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.damage = damage;
        this.shootFrequency = shootFrequency;
        this.lastShootTimestamp = -1;
    },
    maxHealth: null,
    currentHealth: null,
    damage: null,
    shootFrequency: null,
    bulletType: null,
    lastShootTimestamp: null,

    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    },

    updateHpBar: function () {
        var newHp = parseInt(this.currentHealth / this.maxHealth * 100) + '%';
        $(this.hpBar).css('width', newHp);
        //this.hpBar.style.width = parseInt(this.currentHealth / this.maxHealth * 100) + '%';
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

    move: function () {
        ctx.drawImage(this.img, this.leftCoord, this.bottomCoord);
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.rect(this.leftCoord, this.bottomCoord - 5, this.width * (this.currentHealth / this.maxHealth), 5);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(this.leftCoord, this.bottomCoord - 5, this.width, 5);
        ctx.stroke();
    },

    addToScreen: function () {
        //$(this.div).appendTo("#gameScreen");
    },
});