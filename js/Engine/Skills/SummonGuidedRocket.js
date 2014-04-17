SummonGuidedRocket = Skill.extend({
    init: function (plane) {
        this._super("Guided Rocket", plane, 1, 5000, "guidedRocketIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        interactionManager.handleGuidedRocket();
    },

    deactivate: function () {
        this._super();
    }
});