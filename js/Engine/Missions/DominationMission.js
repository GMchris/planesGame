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
    updatePrimaryStatus: function () {
        var seconds = (30 - (InteractionManager.getSeconds() - this.currentDominationStartTime));
        seconds = (seconds >= 0) ? seconds : 0;
        ctx.save();
        ctx.translate(0, 700);
        ctx.scale(1, -1);
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'black';
        ctx.font = '18px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Keep the enemy count below 7 another', 635, 655);
        ctx.font = '30px sans-serif';
        ctx.fillText(seconds, 730, 685);
        ctx.font = '18px sans-serif';
        ctx.fillText('seconds', 770, 685);
        ctx.restore();
    }
});