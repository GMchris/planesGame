Shield = Skill.extend({
    init: function (plane) {
        this._super("Shield", plane, 1, 10000, "shieldIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
		 this.plane.absorbationShieldStrenght = 5;
    },

    deactivate: function () {
        this._super();
    },
});