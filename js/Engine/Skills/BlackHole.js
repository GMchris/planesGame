BlackHole = Skill.extend({
    init: function (plane, index) {
        this._super("Black Hole", plane, 1, 40000, "blackHoleIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        interactionManager.handleBlackHole();
    },

    deactivate: function () {
        this._super();
    }
});