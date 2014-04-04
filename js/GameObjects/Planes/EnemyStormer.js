﻿EnemyStormer = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage) {
        this._super(left, bottom, maxHealth, damage, 0); //stormer doesn't move
        this.image.src = 'images/planes/stormer.png';
        this.lastStormTimestamp = Date.now();
    },
    lastStormTimestamp: null,

    summonStorm: function () {
        var stormBottomCoord = getRandomBottomCoordBottomHalf(35),
            stormLeftCoord = getRandomLeftCoord(45);

        interactionManager.spawnStormCloud(stormLeftCoord, stormBottomCoord);
    }
});