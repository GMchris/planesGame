AbsorbBullets = Skill.extend({
    init: function (plane) {
        this._super("Absorb Bullets", plane, 3000, 13000, "absorbBulletsIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
	    interactionManager.handleAbsorbBullets(this.durationMs);
    },
	
    deactivate: function () {
        this._super();
    }
});