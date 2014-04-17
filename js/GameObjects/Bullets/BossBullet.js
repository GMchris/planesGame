BossBullet = EnemyBullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner);
        this.div.className = "bossBulletDiv";
        this.height = 30;
        this.width = 6;
    }
});