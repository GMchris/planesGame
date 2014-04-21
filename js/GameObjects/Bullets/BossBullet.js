BossBullet = EnemyBullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner, 30, 6);
        this.div.className = "bossBulletDiv";
    }
});