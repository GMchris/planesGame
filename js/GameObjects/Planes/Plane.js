Plane = GameObject.extend({
    init: function (maxHealth, damage) {
        this._super();
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.damage = damage;
		this.absorbationShieldStrenght = 0;
        this.image = document.createElement('img');
        this.div.appendChild(this.image);
    },
    maxHealth: null,
    currentHealth: null,
    image: null,
    bulletType: null,
	absorbationShieldStrenght: null,

    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    }
});