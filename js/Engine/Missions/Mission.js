Mission = Class.extend({
    init: function () {
        this.startTime = Timer.current;
    },
    mainLoopInterval: null,
    startTime: null,
    startMission: function () {
        var self = this;
        //TODO: Draw mission interface - call a UI function
        Game.clearScreen();
        Visual.adjustCSSofGameScreen(true);

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
            console.log(e.keyCode);
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
        $("#fps").text(fps.getFPS());
        interactionManager.iterateBullets();
        interactionManager.iterateEnemyPlanes();
        interactionManager.shootPlayerPlane();
        interactionManager.spawnFighter();
        Visual.iterateBackground();

        if (this.checkWinConditions()) {
            interactionManager.handleMissionWin();
        }

        if (this.checkLossConditions()) {
            interactionManager.handleMissionLoss();
        }
    },
    endMission: function () {
        $(document).off(); //removes all event listeners
        Game.clearScreen();
        Visual.adjustCSSofGameScreen(false);
        AreaManager.drawMap();
        window.clearInterval(this.mainLoopInterval);
    },
    checkWinConditions: function () { },
    checkLossConditions: function () { },

    spawnPlayer: function () {
        
    }
});