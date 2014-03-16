EnemyPlane = Plane.extend({
    init: function (left, bottom) {
        this._super();
        this.updateCoords(left, bottom);
        this.move();
        this.div.className = "enemyPlane";
    },
    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    }
});