DeathRay = Skill.extend({
    init: function (plane, index) {
        this._super("Death Ray", plane, 1, 6000, "deathRayIcon", index); //plane using the skill, duration, cooldown
    },
    //repair
    activate: function () {
        this._super();
        interactionManager.handleDeathRay(this.plane.leftCoord, this.plane.bottomCoord);
    },

    deactivate: function () {
        this._super();
    }
});