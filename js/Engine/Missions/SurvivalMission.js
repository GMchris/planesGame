SurvivalMission = Mission.extend({
    init: function () {
        this._super();
    },

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
            }
        });
        this.mainLoopInterval = window.setInterval(function () {
            self.mainLoop.call(self);
        }, 1000 / 60);
    },

    endMission: function () {
        $(document).off(); //removes all event listeners
        Game.clearScreen();
        Visual.adjustCSSofGameScreen(false);
        AreaManager.drawMap();
        window.clearInterval(this.mainLoopInterval);
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