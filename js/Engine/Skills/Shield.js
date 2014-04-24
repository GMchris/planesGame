Shield = Skill.extend({
    init: function (plane, index) {
        this._super("Shield", plane, 1, 10000, "shieldIcon", index); //plane using the skill, duration, cooldown
        this.playerShieldDiv = $('<div id="playerShield"></div>').addClass('playerShieldDiv');
    },

    playerShieldDiv: null,

    activate: function () {
        this._super();
		this.plane.absorptionShieldStrength = 5;
		this.playerShieldDiv.appendTo('#playerPlaneDiv');
    },
	
    deactivate: function () {
        this._super();
    }
});