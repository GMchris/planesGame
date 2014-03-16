SurvivalMission = Mission.extend({
    init: function () {
        this._super();
    },

    startMission: function () {
        //TODO: Draw mission interface - call a UI function
        $("<div id='fps'>112</div>").appendTo("#gameScreen");
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
        this.mainLoopInterval = window.setInterval(this.mainLoop, 1000 / 60);
    },

    mainLoop: function () {
        $("#fps").text(fps.getFPS());
        interactionManager.iterateBullets();
        interactionManager.iterateEnemyPlanes();
        interactionManager.shootPlayerPlane();
        interactionManager.spawnFighter();
        Visual.iterateBackground();
    },

    checkLossConditions: function () {
        
    }
});