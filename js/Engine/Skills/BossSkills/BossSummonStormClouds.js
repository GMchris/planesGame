BossSummonStormClouds = BossSkill.extend({
    init: function (plane) {
        this._super("Boss Summon Storm Clouds", plane, 300, 20000, ""); //plane using the skill, duration, cooldown
        this.tryUse();
    },

    activate: function () {
        this._super();
        var i, stormBottomCoord, stormLeftCoord;
        this.plane.isCasting = true;
        for (i = 0; i < 2; i++) {
            stormBottomCoord = getRandomBottomCoordBottomHalf(40);
            stormLeftCoord = getRandomLeftCoord(45);
            interactionManager.spawnStormCloud(stormLeftCoord, stormBottomCoord, this.plane.leftCoord, this.plane.bottomCoord, 300);
        }
    },

    deactivate: function () {
        this._super();
        console.log(this.name);
        this.plane.isCasting = false;
    }
});