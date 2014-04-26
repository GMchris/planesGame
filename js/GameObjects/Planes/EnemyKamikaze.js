//the kamikaze doesn't shoot, instead attempts to crash his plane into the player's , inflicting massive damage
EnemyKamikaze = EnemyChasePlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        var shootFrequency = -1,
            width = 100,
            height = 80;
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
		this.width = 100;
		this.height = 80;
		this.healingOrbSpawnChance = 30;
    },

    img: $('<img src="images/planes/kamikaze.png"/>')[0],
});