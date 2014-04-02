BlackHole = Skill.extend({
    init: function (plane) {
        this._super("Black Hole", plane, 1, 15000, "blackHoleIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        interactionManager.handleBlackHole();
    },

    deactivate: function () {
        this._super();
    }
});