SurvivalMission = Mission.extend({
    init: function (areaIndex) {
        var enemySpawnFrequencyMs = 800;
        this._super(enemySpawnFrequencyMs, areaIndex);
    },

    checkWinConditions: function () {
        //A survival mission is 'won' if the player manages to survive for (45) seconds;
        var win = (InteractionManager.getSeconds() - this.startTime) >= 45;
        return win;
    },

    checkLossConditions: function () {
        //A survival mission is 'lost/failed' if the player dies
        var loss = (InteractionManager.getPlayerHealth()) == 0;
        return loss;
    },

    updatePrimaryStatus: function(past){
        var remainingTime = 45 - (InteractionManager.getSeconds() - this.startTime);
        remainingTime = (remainingTime >= 0) ? remainingTime : 0;
        ctx.save();
        ctx.translate(0, 700);
        ctx.scale(1, -1);
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'black';
        ctx.font = '18px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Survive for another', 655, 670);
        ctx.font = '30px sans-serif';
        ctx.fillText(remainingTime, 815, 670);
        ctx.font = '18px sans-serif';
        ctx.fillText('seconds', 855, 670);
        ctx.restore();
    }
});