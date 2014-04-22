EnemyStormer = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage) {
        var movementSpeed = 0,
            shootFrequency = -1,
            width = 100,
            height = 80;
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height); //stormer doesn't move
        $(this.div).css('background-image', 'url(images/planes/stormer.png)');
		this.lastStormTimestamp = Date.now();
		this.healingOrbSpawnChance = 30;
    },
    lastStormTimestamp: null,

    summonStorm: function () {
        var stormBottomCoord = getRandomBottomCoordBottomHalf(35),
            stormLeftCoord = getRandomLeftCoord(45);

        interactionManager.spawnStormCloud(stormLeftCoord, stormBottomCoord, this.leftCoord, this.bottomCoord, 100);
    }
});