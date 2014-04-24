SummonGuidedRocket = Skill.extend({
    init: function (plane, index) {
        this._super("Guided Rocket", plane, 1, 5000, "guidedRocketIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        if (!interactionManager.isPlayerShooting()) {
            this._super();
            interactionManager.handleGuidedRocket();
        }
    },

    deactivate: function () {
        this._super();
    }
});