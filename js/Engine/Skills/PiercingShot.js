PiercingShot = Skill.extend({
    init: function (plane) {
        this._super("Piercing Shot", plane, 5000, 15000); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
    },

    activate: function () {
        this._super();
        this.plane.bulletType = "piercing";
    },

    deactivate: function () {
        this._super();
        this.plane.bulletType = "player";
    }
});