AbsorbBullets = Skill.extend({
    init: function (plane, index) {
        this._super("Absorb Bullets", plane, 3000, 13000, "absorbBulletsIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
	    InteractionManager.handleAbsorbBullets(this.durationMs);
    },
	
    deactivate: function () {
        this._super();
    }
});