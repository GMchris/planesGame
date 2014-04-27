StopTime = Skill.extend({
    init: function (plane, index) {
        this._super("Stop Time", plane, 3000, 15000, "stopTimeIcon", index); //plane using the skill, duration, cooldown
    },

    newMainLoop: function () {
        InteractionManager.iterateBullets('player');
        InteractionManager.iterateFriendlyPlanes();
        InteractionManager.iteratePickups();
        InteractionManager.shootPlayerPlane();
    },

    activate: function () {
        this._super();
        InteractionManager.stopTimeOn(this.newMainLoop);
    },

    deactivate: function () {
        this._super();
        InteractionManager.stopTimeOff();
    }
});