DominationMission = Mission.extend({
    init: function (areaIndex, missionIndex) {
        this._super(areaIndex, missionIndex);
        this.currentDominationStartTime = this.startTime;
    },

    currentDominationStartTime: null,

    checkDominating: function () {
        return (interactionManager.getEnemiesCount() <= 7);
    },

    resetDominationStartTime: function () {
        this.currentDominationStartTime = Timer.current;
    },

    mainLoop: function () {
        if (!this.checkDominating()) {
            this.resetDominationStartTime();
        }
        interactionManager.increaseSpawnTime();
        this._super();
    },

    checkWinConditions: function () {
        //A survival mission is 'won' if the player manages to dominate his enemies for (30) seconds;
        var win = (Timer.current - this.currentDominationStartTime) >= 30;
        return win;
    },

    checkLossConditions: function () {
        //A survival mission is 'lost/failed' if the player dies
        var loss = (interactionManager.getPlayerHealth()) == 0;
        return loss;
    }
});