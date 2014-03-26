Sentry = Skill.extend({
    init: function (plane) {
        this._super("Sentry", plane, 1, 6000); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
    },

    activate: function () {
        this._super();
        interactionManager.spawnSentry(this.plane.leftCoord, this.plane.bottomCoord);
    },

    deactivate: function () {
        this._super();
    }
});