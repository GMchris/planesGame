Plane = GameObject.extend({
    init: function (maxHealth, damage, width, height) {
        this._super(width, height);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.damage = damage;
    },
    maxHealth: null,
    currentHealth: null,
    image: null,
    bulletType: null,

    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    }
});