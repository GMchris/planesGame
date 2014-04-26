Shield = Skill.extend({
    init: function (plane, index) {
        this._super("Shield", plane, 1, 10000, "shieldIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
		this.plane.absorptionShieldStrength = 5;
        this.plane.move = this.plane.shieldMove;
    },
	
    deactivate: function () {
        this._super();
    }
});