//boss skills are automatically used each time they're off cooldown
BossSkill = Skill.extend({
    init: function (name, plane, durationMs, cooldownMs, icon) {
        this._super(name, plane, durationMs, cooldownMs, icon);
    },

    activate: function () {
        this.isAvailable = false;
        this.isActive = true;
        this.isOnCooldown = true;
    },

    deactivate: function () {
        this._super();
    },

    makeAvailable: function () {
        this.isAvailable = true;
        this.isOnCooldown = false;
    },

    tryUse: function () {
        var self = this;
        if (!this.plane.isCasting) {
            this.use();
        } else {
            window.setTimeout(function () {
                self.tryUse.call(self);
            }, 100);
        }
    },

    use: function () {
        var self = this;

        if (this.isAvailable) {
            this.activate();

            window.setTimeout(function () {
                self.deactivate.call(self);
            }, self.durationMs);

            window.setTimeout(function () {
                self.makeAvailable.call(self);
                self.tryUse();
            }, self.cooldownMs);
        }
    }
});