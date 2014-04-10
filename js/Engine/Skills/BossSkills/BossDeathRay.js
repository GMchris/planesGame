BossDeathRay = BossSkill.extend({
    init: function (plane) {
        this._super("Boss Death Ray", plane, 1500, 15000, ""); //plane using the skill, duration, cooldown
        this.oldShoot = this.plane.shoot;
        this.use();
        this.castTime = 1500;
    },

    castTime: null,

    activate: function () {
        this._super();
        this.plane.isCasting = true;
        interactionManager.handleBossDeathRay(this.castTime);
    },

    deactivate: function () {
        this._super();
        this.plane.isCasting = false;
    }
});