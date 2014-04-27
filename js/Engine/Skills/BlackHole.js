BlackHole = Skill.extend({
    init: function (plane, index) {
        this._super("Black Hole", plane, 1, 40000, "blackHoleIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        if (!InteractionManager.isPlayerShooting()) {
            this._super();
            InteractionManager.handleBlackHole();
        }
    },

    deactivate: function () {
        this._super();
    }
});