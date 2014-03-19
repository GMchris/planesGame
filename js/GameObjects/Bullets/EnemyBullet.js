EnemyBullet = Bullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg);
        this.div.className = "enemyBulletDiv";
        this.owner = owner;
    }
});