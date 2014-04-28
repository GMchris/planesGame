HealingOrb = Pickup.extend({
    init: function (left, bottom) {
        var width = 50,
            height = 50;
        this._super(left, bottom, width, height);
        this.healingAmount = 5;
        this.frameCount = 4;
    },

    img: $('<img src="images/sprites/HealthOrbFrames.png" />')[0],
    healingAmount: null,

    heal: function (plane) {
        if (plane.currentHealth + this.healingAmount <= plane.maxHealth) {
            plane.currentHealth += this.healingAmount;
        } else {
            plane.currentHealth = plane.maxHealth;
        }
        plane.updateHpBar();
    }
});