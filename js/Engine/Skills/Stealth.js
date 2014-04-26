Stealth = Skill.extend({
    init: function (plane, index) {
        this._super("Stealth", plane, 2000, 20000, "stealthIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        this.plane.isStealthed = true;
        this.plane.move = this.plane.stealthMove;
    },

    deactivate: function () {
        this._super();
        if(this.plane.absorptionShieldStrength !== 0){
            this.plane.move = this.plane.shieldMove;
        } else {
            this.plane.move = this.plane.originalMoveFunction;
        }
        this.plane.isStealthed = false;
    },
});