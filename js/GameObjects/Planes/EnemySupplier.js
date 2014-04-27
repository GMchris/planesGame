//supplier doesn't shoot, instead buffing the fighters with spread shot
EnemySupplier = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        var shootFrequency = -1,
            width = 100,
            height = 80;
        this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
        this.changeDirection();
        this.lastSupplyTimestamp = -1;
        this.healingOrbSpawnChance = 30;
        this.suppliedFighters = [];
        this.supplyFrequencyMs = 1500;
    },
    img: $('<img src="images/planes/supplier.png"/>')[0],
    supplyFrequencyMs: null,
    lastSupplyTimestamp: null,
    suppliedFighters: null,

    supply: function (fighter) {
        fighter.shoot = Utility.spreadShotEnemyShoot;
        fighter.img = $('<img src="images/planes/fighter_spreadshot.png" />')[0];
        this.suppliedFighters.push(fighter);
    }
});