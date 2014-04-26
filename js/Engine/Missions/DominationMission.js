DominationMission = Mission.extend({
    init: function (areaIndex) {
        var enemySpawnFrequencyMs = 600;
        this._super(enemySpawnFrequencyMs, areaIndex);
        this.currentDominationStartTime = this.startTime;
    },

    currentDominationStartTime: null,

    checkDominating: function () {
        return (InteractionManager.getEnemiesCount() <= 7);
    },

    resetDominationStartTime: function () {
        this.currentDominationStartTime = InteractionManager.getSeconds();
    },

    mainLoop: function () {
        if (!this.checkDominating()) {
            this.resetDominationStartTime();
        }
        InteractionManager.increaseSpawnTime();
        this._super();
    },

    checkWinConditions: function () {
        //A domination mission is 'won' if the player manages to dominate his enemies for (30) seconds;
        var win = (InteractionManager.getSeconds() - this.currentDominationStartTime) >= 30;
        return win;
    },

    checkLossConditions: function () {
        //A domination mission is 'lost/failed' if the player dies
        var loss = (InteractionManager.getPlayerHealth()) == 0;
        return loss;
    },
    updatePrimaryStatus: function(){
        $(".mainMissionName").html("Keep the enemy count below 7 another <b>"+(30-(InteractionManager.getSeconds() - this.currentDominationStartTime))+"</b> seconds.");
    }
});