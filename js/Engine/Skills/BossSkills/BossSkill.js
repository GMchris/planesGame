//boss skills are automatically used each time they're off cooldown
BossSkill = Skill.extend({
    init: function (name, plane, durationMs, cooldownMs, icon) {
        this._super(name, plane, durationMs, cooldownMs, icon);
        this.castTime = 500;
    },

    castTime: null,

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
        if (interactionManager.getCurrentMission() && !this.plane.isCasting && this.plane.skills.indexOf(this) != -1) {
            self.makeAvailable.call(self);
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
            this.plane.isCasting = true;
            $(this.plane.castBar)
                .css('display', 'block')
                .animate({
                    'width': '100%'
                }, {
                    complete: function () {
                        $(self.plane.castBar).css({
                            'display': 'none',
                            'width': '0%'
                        });
                        self.activate.call(self);
                    },
                    duration: self.castTime
                });
            
            window.setTimeout(function () {
                self.deactivate.call(self);
            }, self.durationMs + self.castTime);

            window.setTimeout(function () {
                self.tryUse();
            }, self.cooldownMs + self.durationMs + self.castTime);
        }
    },

    detach: function () {
        delete this.plane; //deletes the reference to this.plane -> skill won't be used anymore
    }
});