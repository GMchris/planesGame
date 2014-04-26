Mission = Class.extend({
    init: function (enemySpawnFrequencyMs, areaIndex) {
        this.enemySpawnFrequencyMs = enemySpawnFrequencyMs;
        this.areaIndex = areaIndex;
        this.startTime = InteractionManager.getSeconds();
    },

    areaIndex: null,
    enemySpawnFrequencyMs: null,
    mainLoopInterval: null,
    mainDrawLoopInterval: null,
    startTime: null,
    startMission: function () {
        var self = this;
        //TODO: Draw mission interface - call a UI function
        Game.clearScreen();
        Visual.adjustCSSofGameScreen(true);
        Visual.drawUI(self);
        InteractionManager.spawnPlayer();
        $(document).on('mousemove', InteractionManager.movePlayerPlane);
        $(document).on('mousedown', InteractionManager.handleMouseClick);
        $(document).on('mouseup', InteractionManager.handleMouseClick);
        $(document).on('dragstart', function (e) {
            e.preventDefault();
        });
        $(document).on('contextmenu', function (e) {
            e.preventDefault();
        });
        $(document).on('keypress', function (e) {
            if (e.keyCode == 97) { //a
                InteractionManager.rotateSentries('left');
            } else if (e.keyCode == 100) { //d
                InteractionManager.rotateSentries('right');
            } else if (e.keyCode >= 49 && e.keyCode <= 52) { //1-4 key was pressed
                InteractionManager.handleSkillUsage(e.keyCode - 49);
            }
        });
        this.mainLoopInterval = window.setInterval(function () {
            self.mainLoop.call(self);
        }, 1000 / 60);
    },
    mainLoop: function () {
        var self = this;
        $('#ips').text(ips.getIPS());
        InteractionManager.iterateBullets('all');
        InteractionManager.iterateFriendlyPlanes();
        InteractionManager.iterateEnemyPlanes();
        InteractionManager.iterateHazards();
        InteractionManager.iteratePickups();
        InteractionManager.shootPlayerPlane();
        InteractionManager.spawnEnemy();
        this.updatePrimaryStatus();

        if (self.checkWinConditions()) {
            InteractionManager.handleMissionWin();
            self.endMission();
        }

        if (self.checkLossConditions()) {
            InteractionManager.handleMissionLoss();
            self.endMission();
        }
    },

    

    endMission: function () {
        $(document).off(); //removes all event listeners
        window.clearInterval(this.mainLoopInterval);
    },
    checkWinConditions: function () { },
    checkLossConditions: function () { },
    updatePrimaryStatus: function() { }
});