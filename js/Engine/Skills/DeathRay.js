DeathRay = Skill.extend({
    init: function (plane) {
        this._super("Death Ray", plane, 1, 6000, "deathRayIcon"); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
    },

    activate: function () {
        this._super();
        interactionManager.handleDeathRay(this.plane.leftCoord, this.plane.bottomCoord);
    },

    deactivate: function () {
        this._super();
    }
});