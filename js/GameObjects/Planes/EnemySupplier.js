//supplier doesn't shoot, instead buffing the fighters with spread shot
EnemySupplier = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        var shootFrequency = -1,
            width = 100,
            height = 80;
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
        $(this.div).css('background-image', 'url(images/planes/supplier.png)');
        this.changeDirection();
        this.lastSupplyTimestamp = -1;
        this.healingOrbSpawnChance = 30;
        this.suppliedFighters = [];
    },
    lastSupplyTimestamp: null,
    suppliedFighters: null,

    supply: function (fighter) {
        $(fighter.div).css('background-image', 'url(images/planes/fighter_spreadshot.png)');
        fighter.shoot = spreadShotEnemyShoot;
        this.suppliedFighters.push(fighter);
    }
});