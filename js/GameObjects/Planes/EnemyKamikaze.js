//the kamikaze doesn't shoot, instead attempts to crash his plane into the player's , inflicting massive damage
EnemyKamikaze = EnemyChasePlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        this._super(left, bottom, maxHealth, damage, movementSpeed, 100, 80);
        $(this.div).css('background-image', 'url(images/planes/kamikaze.png)');
		this.width = 100;
		this.height = 80;
		this.healingOrbSpawnChance = 30;
    }
});