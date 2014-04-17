HealingShot = Skill.extend({
    init: function (plane) {
        this._super("Healing Shot", plane, 3000, 17000, "healingShotIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        this.plane.bulletType = "healing";
    },

    deactivate: function () {
        this._super();
        if (this.plane.bulletType == "healing") { //avoid overlap bug with other bullet-affecting skills
            this.plane.bulletType = "player";
        }
    }
});