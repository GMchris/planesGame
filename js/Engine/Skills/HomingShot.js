HomingShot = Skill.extend({
    init: function (plane) {
        this._super("Homing Shot", plane, 5000, 15000, "homingShotIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        this.plane.bulletType = "homing";
    },

    deactivate: function () {
        this._super();
        if (this.plane.bulletType == "homing") { //avoid overlap bug with other bullet-affecting skills
            this.plane.bulletType = "player";
        }
    }
});