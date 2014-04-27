BossMission = Mission.extend({
    init: function (areaIndex) {
        var enemySpawnFrequencyMs = -1;
        this._super(enemySpawnFrequencyMs, areaIndex);
    },

    startMission: function () {
        this._super();
        InteractionManager.spawnBoss();
    },

    mainLoop: function () {
        var self = this;
        InteractionManager.iterateBullets('all');
        InteractionManager.iterateFriendlyPlanes();
        InteractionManager.iterateEnemyPlanes();
        InteractionManager.iterateHazards();
        InteractionManager.shootPlayerPlane();
        InteractionManager.handleBossIteration();

        if (self.checkWinConditions()) {
            InteractionManager.handleMissionWin();
            self.endMission();
        }

        if (self.checkLossConditions()) {
            InteractionManager.handleMissionLoss();
            self.endMission();
        }
    },

    checkWinConditions: function () {
        var win = (InteractionManager.getBossHealth() <= 0);
        return win;
    },

    checkLossConditions: function () {
        var loss = (InteractionManager.getPlayerHealth() <= 0);
        return loss;
    },

    updatePrimaryStatus: function () {
        var bossHealth = InteractionManager.getBossHealthPercentage();
        ctx.save();
        ctx.translate(0, 700);
        ctx.scale(1, -1);
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'black';
        ctx.font = '18px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Current boss health:', 635, 670);
        ctx.font = '30px sans-serif';
        ctx.fillText(bossHealth + '%', 800, 672);
        ctx.restore();
    }
});