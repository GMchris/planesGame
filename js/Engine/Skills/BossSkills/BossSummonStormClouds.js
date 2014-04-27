BossSummonStormClouds = BossSkill.extend({
    init: function (plane) {
        this._super("Boss Summon Storm Clouds", plane, 300, 5000, ""); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        var i, stormBottomCoord, stormLeftCoord;
        for (i = 0; i < 3; i++) {
            stormBottomCoord = Utility.getRandomBottomCoordBottomHalf(40);
            stormLeftCoord = Utility.getRandomLeftCoord(45);
            InteractionManager.spawnStormCloud(stormLeftCoord, stormBottomCoord, this.plane.leftCoord, this.plane.bottomCoord, 300);
        }
    },

    deactivate: function () {
        this._super();
    }
});