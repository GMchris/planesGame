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
    }
});