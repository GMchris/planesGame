GauntletMission = Mission.extend({
    init: function (areaIndex) {
        var enemySpawnFrequencyMs = 1200;
        this._super(enemySpawnFrequencyMs, areaIndex);
        this.enemiesKilled = 0;
        this.enemiesSpawnedPerTaunt = 3;
        this.lastTauntTimestamp = -1;
    },

    enemiesSpawnedPerTaunt: null,
    enemiesKilled: null,
    lastTauntTimestamp: null,

    startMission: function () {
        $(document).on("keypress", function (e) {
            if (e.charCode == 101) {//e
                InteractionManager.gauntletSpawnEnemies();
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
        var loss = (InteractionManager.getPlayerHealth()) == 0;
        return loss;
    },

    updatePrimaryStatus: function () {
        var enemiesToKill = 70 - this.enemiesKilled;
        enemiesToKill = (enemiesToKill >= 0) ? enemiesToKill : 0;
        ctx.save();
        ctx.translate(0, 700);
        ctx.scale(1, -1);
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'black';
        ctx.font = '18px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Kill another', 675, 670);
        ctx.font = '30px sans-serif';
        ctx.fillText(enemiesToKill, 770, 670);
        ctx.font = '18px sans-serif';
        ctx.fillText('enemies', 810, 670);
        ctx.restore();
    }
});