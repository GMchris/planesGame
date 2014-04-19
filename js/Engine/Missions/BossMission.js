BossMission = Mission.extend({
    init: function (areaIndex) {
        var enemySpawnFrequencyMs = -1;
        this._super(enemySpawnFrequencyMs, areaIndex);
    },

    startMission: function () {
        this._super();
        interactionManager.spawnBoss();
    },

    mainLoop: function () {
        var self = this;
        interactionManager.iterateBullets('all');
        interactionManager.iterateFriendlyPlanes();
        interactionManager.iterateEnemyPlanes();
        interactionManager.iterateHazards();
        interactionManager.shootPlayerPlane();
        interactionManager.handleBossIteration();

        if (self.checkWinConditions()) {
            interactionManager.handleMissionWin();
            self.endMission();
        }

        if (self.checkLossConditions()) {
            interactionManager.handleMissionLoss();
            self.endMission();
        }
    },

    checkWinConditions: function () {
        var win = (interactionManager.getBossHealth() <= 0);
        return win;
    },

    checkLossConditions: function () {
        var loss = (interactionManager.getPlayerHealth() <= 0);
        return loss;
    }
});