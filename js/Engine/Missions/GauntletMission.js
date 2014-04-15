GauntletMission = Mission.extend({
    init: function (areaIndex) {
        var enemySpawnFrequencyMs = 1200;
        this._super(enemySpawnFrequencyMs);
        this.areaIndex = areaIndex;
        this.enemiesKilled = 0;
        this.enemiesSpawnedPerTaunt = 3;
        this.lastTauntTimestamp = -1;
    },

    areaIndex: null,
    enemiesSpawnedPerTaunt: null,
    enemiesKilled: null,
    lastTauntTimestamp: null,

    startMission: function () {
        $(document).on("keypress", function (e) {
            if (e.keyCode == 101) {//e
                interactionManager.gauntletSpawnEnemies();
            }
        });

        this._super();
    },

    incrementEnemiesKilled: function () {
        this.enemiesKilled++;
    },

    checkWinConditions: function () {
        //A gauntlet mission is 'won' if the player kills 70 enemies
        var win = (this.enemiesKilled >= 70);
        return win;
    },

    checkLossConditions: function () {
        //A gauntlet mission is 'lost/failed' if the player dies
        var loss = (interactionManager.getPlayerHealth()) == 0;
        return loss;
    }
});