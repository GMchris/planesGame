EnemyStormer = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage) {
        this._super(left, bottom, maxHealth, damage, 0, 100, 80); //stormer doesn't move
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