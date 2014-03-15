Mission = Class.extend({
    init: function () {
        this.startTime = Timer.current;
    },
    mainLoop: null,
    mainLoopInterval: null,
    startTime: null,
    initialize: function () { },
    checkWinConditions: function () { },
    endMissionWin: function () { },
    checkLossConditions: function () { },
    endMissionLoss: function () { },

    spawnPlayer: function () {
        
    }
});