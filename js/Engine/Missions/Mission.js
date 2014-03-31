Mission = Class.extend({
    init: function (enemySpawnFrequencyMs) {
        this.enemySpawnFrequencyMs = enemySpawnFrequencyMs;
        this.startTime = Timer.current;
    },
    enemySpawnFrequencyMs: null,
    mainLoopInterval: null,
    startTime: null,
    startMission: function () {
        var self = this;
        //TODO: Draw mission interface - call a UI function
        Game.clearScreen();
        Visual.adjustCSSofGameScreen(true);
        Visual.drawUI();
        $("<div id='fps'></div>").appendTo("#gameScreen");
        interactionManager.spawnPlayer();
        $(document).on("mousemove", interactionManager.movePlayerPlane);
        $(document).on("mousedown", interactionManager.playerPlaneShootToggle);
        $(document).on("mouseup", interactionManager.playerPlaneShootToggle);
        $(document).on("dragstart", function (e) {
            e.preventDefault();
        });
        $(document).on("contextmenu", function (e) {
            e.preventDefault();
        });
        $(document).on("keypress", function (e) {
            if (e.keyCode == 112) {//p
                interactionManager.togglePause();
            } else if (e.keyCode >= 49 && e.keyCode <= 52) { //1-4 key was pressed
                interactionManager.handleSkillUsage(e.keyCode - 49);
            }
        });
        this.mainLoopInterval = window.setInterval(function () {
            self.mainLoop.call(self);
        }, 1000 / 60);
    },
    mainLoop: function () {
        var self = this;
        $("#fps").text(fps.getFPS());
        interactionManager.iterateBullets();
        interactionManager.iterateFriendlyPlanes();
        interactionManager.iterateEnemyPlanes();
        interactionManager.shootPlayerPlane();
        interactionManager.spawnEnemy();
        Visual.iterateBackground();

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
    },
    checkWinConditions: function () { },
    checkLossConditions: function () { }
});