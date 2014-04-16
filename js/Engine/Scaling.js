Scaling = (function () {
    var scaling = [
        //area 1
        {
            //health
            fighterMaxHealth: 1,
            kamikazeMaxHealth: 5,
            supplierMaxHealth: -1, //suppliers don't spawn in A1 missions
            stormerMaxHealth: -1, //stormers don't spawn in A1 missions
            //damage
            fighterDamage: 2,
            kamikazeDamage: 10,
            supplierDamage: -1, //suppliers don't spawn in A1 missions
            stormerDamage: -1, //stormers don't spawn in A1 missions
            //movementSpeed
            fighterMovementSpeed: 2,
            kamikazeMovementSpeed: 2,
            supplierMovementSpeed: -1, //suppliers don't spawn in A1 missions
            //bullet speed
            fighterBulletsSpeed: 5
        },
        //area 2
        {
            //health
            fighterMaxHealth: 2,
            kamikazeMaxHealth: 8,
            supplierMaxHealth: 3,
            stormerMaxHealth: -1, //stormers don't spawn in A2 missions
            //damage
            fighterDamage: 3,
            kamikazeDamage: 22,
            supplierDamage: 0,
            stormerDamage: -1, //stormers don't spawn in A2 missions
            //movementSpeed
            fighterMovementSpeed: 3,
            kamikazeMovementSpeed: 2,
            supplierMovementSpeed: 1,
            //bullet speed
            fighterBulletsSpeed: 6
        },
        //area 3
        {
            //health
            fighterMaxHealth: 3,
            kamikazeMaxHealth: 10,
            supplierMaxHealth: 5,
            stormerMaxHealth: 2,
            //damage
            fighterDamage: 5,
            supplierDamage: 0,
            kamikazeDamage: 33,
            stormerDamage: 3,
            //movementSpeed
            fighterMovementSpeed: 4,
            kamikazeMovementSpeed: 2,
            supplierMovementSpeed: 1,
            //bullet speed
            fighterBulletsSpeed: 7
        },
        //boss
        {
            //health
            fighterMaxHealth: 3,
            kamikazeMaxHealth: 8,
            supplierMaxHealth: 5,
            stormerMaxHealth: 2,
            //damage
            fighterDamage: 5,
            supplierDamage: 0,
            kamikazeDamage: 25,
            stormerDamage: 3,
            //movementSpeed
            fighterMovementSpeed: 4,
            kamikazeMovementSpeed: 1,
            supplierMovementSpeed: 1,
            //bullet speed
            fighterBulletsSpeed: 7
        }
    ],

    getValue = function (areaIndex, type) { //e.g. getScaling(0, 'fighterMaxHealth') returns 1
        return scaling[areaIndex][type];
    };

    return {
        getValue: getValue
    }
})();
