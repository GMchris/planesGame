//supplier doesn't shoot, instead buffing the fighters with spread shot
EnemySupplier = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        this._super(left, bottom, maxHealth, damage, movementSpeed, 100, 80);
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