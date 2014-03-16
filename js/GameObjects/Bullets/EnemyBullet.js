EnemyBullet = Bullet.extend({
    init: function (left, bottom, owner) {
        this._super(left, bottom);
        this.div.className = "enemyBulletDiv";
        this.owner = owner;
    }
});