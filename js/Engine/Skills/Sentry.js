Sentry = Skill.extend({
    init: function (plane) {
        this._super("Sentry", plane, 1, 10000,"sentryIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        interactionManager.spawnSentry(this.plane.leftCoord, this.plane.bottomCoord);
    },

    deactivate: function () {
        this._super();
    }
});