Mission = Class.extend({
    init: function (enemySpawnFrequencyMs, areaIndex) {
        this.enemySpawnFrequencyMs = enemySpawnFrequencyMs;
        this.areaIndex = areaIndex;
        this.startTime = interactionManager.getSeconds();
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
        interactionManager.spawnPlayer();
        $(document).on('mousemove', interactionManager.movePlayerPlane);
        $(document).on('mousedown', interactionManager.handleMouseClick);
        $(document).on('mouseup', interactionManager.handleMouseClick);
        $(document).on('dragstart', function (e) {
            e.preventDefault();
        });
        $(document).on('contextmenu', function (e) {
            e.preventDefault();
        });
        $(document).on('keypress', function (e) {
            if (e.keyCode == 97) { //a
                interactionManager.rotateSentries('left');
            } else if (e.keyCode == 100) { //d
                interactionManager.rotateSentries('right');
            } else if (e.keyCode >= 49 && e.keyCode <= 52) { //1-4 key was pressed
                interactionManager.handleSkillUsage(e.keyCode - 49);
            }
        });
        this.mainLoopInterval = window.setInterval(function () {
            self.mainLoop.call(self);
        }, 1000 / 60);

        Visual.drawGameObjects();
    },
    mainLoop: function () {
        var self = this;
        
        interactionManager.iterateBullets('all');
        interactionManager.iterateFriendlyPlanes();
        interactionManager.iterateEnemyPlanes();
        interactionManager.iterateHazards();
        interactionManager.iteratePickups();
        interactionManager.shootPlayerPlane();
        interactionManager.spawnEnemy();
        this.updatePrimaryStatus();

        if (self.checkWinConditions()) {
            interactionManager.handleMissionWin();
            self.endMission();
        }

        if (self.checkLossConditions()) {
            interactionManager.handleMissionLoss();
            self.endMission();
        }
    },

    

    endMission: function () {
        $(document).off(); //removes all event listeners
        window.clearInterval(this.mainLoopInterval);
        window.clearInterval(this.mainDrawLoopInterval);
    },
    checkWinConditions: function () { },
    checkLossConditions: function () { },
    updatePrimaryStatus: function() { }
});