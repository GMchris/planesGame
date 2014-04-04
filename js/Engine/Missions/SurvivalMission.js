SurvivalMission = Mission.extend({
    init: function () {
        var enemySpawnFrequencyMs = 800;
        this._super(enemySpawnFrequencyMs);
    },

    checkWinConditions: function () {
        //A survival mission is 'won' if the player manages to survive for (45) seconds;
        var win = (Timer.current - this.startTime) >= 45;
        return win;
    },

    checkLossConditions: function () {
        //A survival mission is 'lost/failed' if the player dies
        var loss = (interactionManager.getPlayerHealth()) == 0;
        return loss;
    }
});