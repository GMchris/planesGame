HealingOrb = Pickup.extend({
    init: function (left, bottom) {
        this._super(left, bottom, 40, 40);
        $(this.div).addClass('healingOrbDiv');
        this.healingAmount = 5;
    },

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