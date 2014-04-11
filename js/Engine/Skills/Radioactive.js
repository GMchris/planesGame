Radioactive = Skill.extend({
    init: function (plane) {
        this._super("Radioactive", plane, 1, 5000, "radioactiveIcon"); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        interactionManager.handleRadioactive(this.plane.leftCoord, this.plane.bottomCoord);
    },

    deactivate: function () {
        this._super();
    }
});