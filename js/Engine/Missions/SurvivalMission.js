SurvivalMission = Mission.extend({
    init: function () {
        this._super();
    },

    startMission: function () {
        //TODO: Draw mission interface - call a UI function
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
        this.mainLoopInterval = window.setInterval(this.mainLoop, 16.6);
    },

    mainLoop: function () {
        interactionManager.shootPlayerPlane();
        interactionManager.moveBullets();
        interactionManager.spawnFighter();
        interactionManager.moveEnemyPlanes();
        interactionManager.shootEnemyPlanes();
    },

    checkLossConditions: function () {
        
    }
});