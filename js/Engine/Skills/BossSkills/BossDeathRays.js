//this skill doesn't get activated on cooldown - it gets activated after each 5 bullets the boss shoots
BossDeathRays = BossSkill.extend({
    init: function (plane) {
        this._super("Boss Death Rays", plane, 300, 300, ""); //plane using the skill, duration, cooldown
    },

    activate: function () {
        var i;
        this._super();
        
        for (i = 0; i < 3; i++) {
            InteractionManager.handleBossDeathRay(this.plane.thirdPhaseDeathRays[i]);
        }
    },

    deactivate: function () {
        this._super();
        this.plane.thirdPhaseDeathRays = [];
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
                        if (InteractionManager.getCurrentMission()) {
                            self.activate.call(self);
                        }
                    },
                    duration: self.castTime
                });

            window.setTimeout(function () {
                self.deactivate.call(self);
            }, self.durationMs + self.castTime);

            window.setTimeout(function () {
                self.makeAvailable();
            }, self.cooldownMs + self.durationMs + self.castTime);
        }
    },
});