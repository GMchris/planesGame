Skill = Class.extend({
    init: function (name, plane, durationMs, cooldownMs, icon, index) {
        this.name = name;
        this.plane = plane;
        this.icon = icon;
        this.durationMs = durationMs;
        this.cooldownMs = cooldownMs;
        this.index = index;
        this.isAvailable = true;
        this.isActive = false;
        this.isOnCooldown = false;
    },
    name: null,
    plane: null,
    icon: null,
    durationMs: null,
    cooldownMs: null,
    isAvailable: null,
    isActive: null,
    isOnCooldown: null,
    activate: function () {
        if(this.plane instanceof PlayerPlane){
            Visual.cooldownIcon(this.icon);
            Visual.animateDuration(this.icon, this.durationMs);
            InteractionManager.trackUsedSkillsExposed(this.name);
        }
        this.isAvailable = false;
        this.isActive = true;
        this.isOnCooldown = true;
    },

    deactivate: function () {
        if (this.plane instanceof PlayerPlane) {
            Visual.animateCooldown(this.icon, this.cooldownMs);
        }
        this.isActive = false;
    },

    makeAvailable: function () {
        if (!this.isAvailable) {
            Visual.activateIcon(this.icon);
            this.isAvailable = true;
            this.isOnCooldown = false;
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
            }, self.durationMs + self.cooldownMs);
        } else {
            Game.errorMessage(this.name + " is on cooldown");
        }
    }
});