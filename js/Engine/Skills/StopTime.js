StopTime = Skill.extend({
    init: function (plane) {
        this._super("Stop Time", plane, 3000, 15000, "stopTimeIcon"); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
    },

    newMainLoop: function () {
        var self = this;
        $("#fps").text(fps.getFPS());
        interactionManager.iterateBullets('player');
        interactionManager.iterateFriendlyPlanes();
        interactionManager.shootPlayerPlane();
    },

    activate: function () {
        this._super();
        interactionManager.stopTimeOn(this.newMainLoop);
    },

    deactivate: function () {
        this._super();
        interactionManager.stopTimeOff();
    }
});