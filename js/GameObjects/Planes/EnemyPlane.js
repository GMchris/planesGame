EnemyPlane = Plane.extend({
    init: function (left, bottom, maxHealth, damage) {
        this._super(maxHealth, damage);
        this.updateCoords(left, bottom);
        this.move();
        this.bulletType = "enemy";
        this.div.className = "enemyPlane";
        this.hpBar = document.createElement('div');
        this.hpBar.className = "hpBarEnemy";
        $(this.hpBar).appendTo(this.div);
    },
    hpBar: null,
    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    },
});