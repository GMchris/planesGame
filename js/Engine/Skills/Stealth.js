Stealth = Skill.extend({
    init: function (plane, index) {
        this._super("Stealth", plane, 2000, 20000, "stealthIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        $(this.plane.div).css('opacity', 0.5);
        this.plane.isStealthed = true;
    },

    deactivate: function () {
        this._super();
        $(this.plane.div).css('opacity', 1);
        this.plane.isStealthed = false;
    },
});