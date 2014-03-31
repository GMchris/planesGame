Skill = Class.extend({
    init: function (name, plane, durationMs, cooldownMs) {
        this.name = name;
        this.plane = plane;
        this.durationMs = durationMs;
        this.cooldownMs = cooldownMs;
        this.isAvailable = true;
        this.isActive = false;
        this.isOnCooldown = false;
    },
    plane: null,
    durationMs: null,
    cooldownMs: null,
    isAvailable: null,
    isActive: null,
    isOnCooldown: null,
    activate: function () {
        this.isAvailable = false;
        this.isActive = true;
        this.isOnCooldown = true;
    },

    deactivate: function () {
        this.isActive = false;
    },

    makeAvailable: function () {
        this.isAvailable = true;
        this.isOnCooldown = false;
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
            }, self.cooldownMs);
        } else {
            Game.errorMessage(this.name + " is on cooldown");
        }
    }
});