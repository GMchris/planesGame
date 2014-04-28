var InteractionManager = (function () {
    var playerPlane = new PlayerPlane(),
        starsToLevelUp = [1, 3, 6, 9, 12, 15, 18, 19, 20, 21, 22, 23, 24, 25],
        starsToLevelUpCopy = [1, 3, 6, 9, 12, 15, 18, 19, 20, 21, 22, 23, 24, 25],
        boss,
        bullets,
        hazards,
        pickups,
        playerBulletsSpeed,
        fighterBulletsSpeed,
        bossBulletsSpeed,
        fighterMovementSpeed,
        supplierMovementSpeed,
        kamikazeMovementSpeed,
        fighterMaxHealth,
        supplierMaxHealth,
        kamikazeMaxHealth,
        stormerMaxHealth,
        fighterDamage,
        supplierDamage,
        kamikazeDamage,
        stormerDamage,
        deathRayDamage,
        bossDeathRayDamage,
        radioactiveDamage,
        radioactiveRadius,
        healingBulletHealPoints,
        lastShotPlayerBulletTimestamp,
        lastFighterSpawnTimestamp,
        enemyPlanes,
        friendlyPlanes,
        enemySpawnFrequencyMs,
        enemyDirectionChangeFrequencyMs,
        currentMission,
        secondaryObjectiveType,
        timeIsStopped,
        rocketPathArray,
        Timer = {
            //Counts how many seconds have passed since the start of the game
            current: 0,
            finalTime: null,
            increaseTimer: function () {
                this.current++;
            },
            updateTimerDiv: function () {
                $('#timer').text(this.getTime());
            },
            getTime: function () {
                var time = Utility.convertToTime(this.current);
                return time;
            }
        },
        startTimer = function () {
            window.setInterval(function () {
                Timer.increaseTimer();
                Timer.updateTimerDiv();
            }, 1000);
            startTimer = function () { };
        },
        setInitialValues = function () {
            playerPlane.absorptionShieldStrength = 0;
            boss = null;
            playerPlane.isShooting = false;
            timeIsStopped = false;
            bullets = [];
            hazards = [];
            pickups = [];
            rocketPathArray = [];
            playerBulletsSpeed = 10;
            bossBulletsSpeed = 12;
            sentryMaxHealth = parseInt(playerPlane.maxHealth / 4);
            sentryDamage = playerPlane.damage / 3;
            deathRayDamage = playerPlane.damage * 10;
            bossDeathRayDamage = 10;
            radioactiveDamage = playerPlane.damage * 3;
            radioactiveRadius = 400;
            healingBulletHealPoints = 1;
            enemySpawnFrequencyMs = null; //set when the mission starts
            enemyDirectionChangeFrequencyMs = 1000;
            enemyPlanes = [];
            friendlyPlanes = [];
            lastShotPlayerBulletTimestamp = -1;
            lastEnemySpawnTimestamp = -1;
            currentMission = null;
        },

        setScalingValues = function (areaIndex) {
            //health
            fighterMaxHealth = Scaling.getValue(areaIndex, 'fighterMaxHealth');
            kamikazeMaxHealth = Scaling.getValue(areaIndex, 'kamikazeMaxHealth');
            supplierMaxHealth = Scaling.getValue(areaIndex, 'supplierMaxHealth');
            stormerMaxHealth = Scaling.getValue(areaIndex, 'stormerMaxHealth');
            //damage
            fighterDamage = Scaling.getValue(areaIndex, 'fighterDamage');
            kamikazeDamage = Scaling.getValue(areaIndex, 'kamikazeDamage');
            supplierDamage = Scaling.getValue(areaIndex, 'supplierDamage');
            stormerDamage = Scaling.getValue(areaIndex, 'stormerDamage');
            //movementSpeed
            fighterMovementSpeed = Scaling.getValue(areaIndex, 'fighterMovementSpeed');
            kamikazeMovementSpeed = Scaling.getValue(areaIndex, 'kamikazeMovementSpeed');
            supplierMovementSpeed = Scaling.getValue(areaIndex, 'supplierMovementSpeed');
            //bullet speed
            fighterBulletsSpeed = Scaling.getValue(areaIndex, 'fighterBulletsSpeed');
        },

        spawnPlayer = function () {
            playerPlane.currentHealth = playerPlane.maxHealth;
        },

        spawnBoss = function () {
            var handleBoss = handleBossIteration,
                self = this;
            this.handleBossIteration = function () { };//delay the iteration of the boss until its spawn animation is complete
            boss = new BossPlane(Utility.getRandomLeftCoord(150), Utility.getRandomBottomCoordTopHalf(120));
            boss.animateSpawn();
            window.setTimeout(function () {
                self.handleBossIteration = handleBoss;
                boss.skills[0].unlock(); //unlocks spread shot
                enemyPlanes.push(boss);
            }, 1500);
        },

        spawnSentry = function (left, bottom) {
            var sentry = new SentryPlane(left, bottom, sentryMaxHealth, sentryDamage);
            friendlyPlanes.push(sentry);
        },

        spawnRocket = function (left, bottom) {
            var rocket = new GuidedRocket(left, bottom, 0, playerPlane);
            bullets.push(rocket);
        },

        spawnBullet = function (type, left, bottom, orientationDeg, owner) {
            var newBullet, randIndex, target;
            switch (type) {
                case "player":
                    newBullet = new PlayerBullet(left, bottom, orientationDeg, owner);
                    break;
                case "fighter":
                    newBullet = new FighterBullet(left, bottom, orientationDeg, owner);
                    break;
                case "piercing":
                    newBullet = new PiercingBullet(left, bottom, orientationDeg, owner);
                    break;
                case "homing":
                    randIndex = parseInt(Math.random() * enemyPlanes.length);
                    var target = enemyPlanes[randIndex];
                    newBullet = new HomingBullet(left, bottom, orientationDeg, owner, target);
                    break;
                case "boss":
                    newBullet = new BossBullet(left, bottom, orientationDeg, owner);
                    break;
                case "healing":
                    newBullet = new HealingBullet(left, bottom, orientationDeg, owner);
                    break;
                default:
                    break;
            }
            bullets.push(newBullet);
        },

        spawnEnemy = function () {
            var nowMs = Date.now();
            if (nowMs - lastEnemySpawnTimestamp > enemySpawnFrequencyMs) {
                lastEnemySpawnTimestamp = nowMs;
                spawnRandomEnemy();
            }
        },

        spawnRandomEnemy = function () {
            var areaIndex = currentMission.areaIndex;
            if (enemyPlanes.length <= 15) {
                var rand = parseInt(Math.random() * 100) + 1; //[1, 100]
                if (rand >= 95 && areaIndex >= 2) {
                    spawnStormer();
                } else if (rand >= 90 && areaIndex >= 1) {
                    spawnSupplier();
                } else if (rand >= 85) {
                    spawnKamikaze();
                } else {
                    spawnFighter();
                }
            }
        },

        spawnFighter = function () {
            var newFighter = new EnemyFighter(Utility.getRandomLeftCoord(45), Utility.getRandomBottomCoordTopHalf(35),
                fighterMaxHealth, fighterDamage, fighterMovementSpeed);
            newFighter.animateSpawn();
            enemyPlanes.push(newFighter);
        },

        spawnSupplier = function () {
            var newSupplier = new EnemySupplier(Utility.getRandomLeftCoord(45), Utility.getRandomBottomCoordTopHalf(35),
                supplierMaxHealth, supplierDamage, supplierMovementSpeed);
            newSupplier.animateSpawn();
            enemyPlanes.push(newSupplier);
        },

        spawnKamikaze = function () {
            var newKamikaze = new EnemyKamikaze(Utility.getRandomLeftCoord(45), Utility.getRandomBottomCoordTopHalf(35),
                kamikazeMaxHealth, kamikazeDamage, kamikazeMovementSpeed);
            newKamikaze.animateSpawn();
            enemyPlanes.push(newKamikaze);
        },

        spawnStormer = function () {
            var newStormer = new EnemyStormer(Utility.getRandomLeftCoord(45), Utility.getRandomBottomCoordTopHalf(35),
                stormerMaxHealth, stormerDamage);
            newStormer.animateSpawn();
            enemyPlanes.push(newStormer);
        },

        spawnStormCloud = function (left, bottom, casterLeft, casterBottom, casterWidth) {
            var newStormCloud = new StormCloud(left, bottom);
            newStormCloud.animateCast(casterLeft, casterBottom, casterWidth);
            hazards.push(newStormCloud);
        },

        spawnHealingOrb = function (left, bottom) {
            if (!(currentMission instanceof BossMission) && pickups.length < 3) { //no more than 3 pickups can be on the screen at once
                var healingOrb = new HealingOrb(left, bottom);
                pickups.push(healingOrb);
            }
        },

        gauntletSpawnEnemies = function () {
            var nowMs = Date.now(), i;
            if (nowMs - currentMission.lastTauntTimestamp > 1500) {
                currentMission.lastTauntTimestamp = nowMs;
                for (i = 0; i < currentMission.enemiesSpawnedPerTaunt; i++) {
                    spawnRandomEnemy();
                }
            }
        },

        movePlayerPlane = function (e) {
            //substracting a half of the non-game screen
            var newCoords = (currentMission instanceof BossMission) ?
               convertEventCoordinatesBossMission(e.clientX, e.clientY) : convertEventCoordinates(e.clientX, e.clientY);

            newCoords.left -= 50; //adjust plane to cursor
            playerPlane.updateCoords(newCoords.left, newCoords.bottom);
        },

        rotateSentries = function (direction) {
            var i,
                dir = (direction == 'right') ? 3 : -3;
            for (i = 0; i < friendlyPlanes.length; i++) {
                if (friendlyPlanes[i] instanceof SentryPlane) {
                    if (friendlyPlanes[i].orientationDeg + dir >= -90 && friendlyPlanes[i].orientationDeg + dir <= 90) {
                        friendlyPlanes[i].orientationDeg += dir;
                        friendlyPlanes[i].rotate();
                    }
                }
            }
        },

        iterateBullets = function (type) { //types: 'all', 'player', 'enemy'
            var i, toBeDestroyed = false, hitEnemyPlaneIndex, hitFriendlyPlaneIndex;
            for (i = 0; i < bullets.length; i++) {
                toBeDestroyed = false;
                if (bullets[i] instanceof GuidedRocket && rocketPathArray.length == 0) {
                    bullets[i].die();
                    bullets[i].toBeSpliced = true;
                    rocketPathArray = [];
                } else if (bullets[i].bottomCoord <= 70 || bullets[i].bottomCoord > 700 || bullets[i].leftCoord < 10 || bullets[i].leftCoord > 947) {
                    bullets[i].toBeSpliced = true;
                    if (bullets[i] instanceof PlayerBullet) {
                        trackAccuracy(false);
                    }
                }
                else if ((type == 'all' || type == 'player') && bullets[i] instanceof PlayerBullet) {
                    hitEnemyPlaneIndex = detectCollisionPlayerBullet(bullets[i]);
                    //if the bullet is piercing, make sure it doesn't hit the same target multiple times
                    if (hitEnemyPlaneIndex != -1
                        && (!(bullets[i] instanceof PiercingBullet) || bullets[i].enemiesHit.indexOf(enemyPlanes[hitEnemyPlaneIndex]) == -1)) {
                        handleCollisionPlayerBullet(bullets[i], hitEnemyPlaneIndex);
                        bullets[i].handleCollision(enemyPlanes[hitEnemyPlaneIndex]);
                    } else {
                        movePlayerBullet(bullets[i]);
                    }
                }
                else if ((type == 'all' || type == 'enemy') && bullets[i] instanceof EnemyBullet) {
                    if (!playerPlane.isStealthed && detectCollision(bullets[i], playerPlane)) { //bullet hit the player
                        bullets[i].handleCollision();
                        handleCollisionEnemy(bullets[i].owner);
                    } else {
                        hitFriendlyPlaneIndex = detectCollisionEnemyBulletWithFriendlyPlane(bullets[i]);
                        if (hitFriendlyPlaneIndex != -1) { //bullet hit a friendly plane
                            bullets[i].handleCollision();
                            handleCollisionEnemyWithFriendlyPlane(bullets[i].owner, hitFriendlyPlaneIndex);
                        } else { //bullet didn't hit anything yet, keeps moving
                            moveEnemyBullet(bullets[i]);
                        }
                    }
                }

                if (bullets[i].toBeSpliced) {
                    bullets.splice(i, 1);
                    i--;
                }

            }
        },

        movePlayerBullet = function (bullet) {
            if (bullet instanceof HomingBullet) {
                moveHomingBullet(bullet);
            } else if (bullet instanceof GuidedRocket) {
                moveGuidedRocket(bullet);
            } else {
                var newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 45 * playerBulletsSpeed, //if the degree is (45) or (-45), the bullet
                    newBottomCoord = parseInt((bullet.orientationDeg > -90 && bullet.orientationDeg < 90) ?
                (bullet.bottomCoord + (playerBulletsSpeed * (1 - Math.abs(bullet.orientationDeg / 90))))
                : (bullet.bottomCoord - (playerBulletsSpeed * (1 - Math.abs(bullet.orientationDeg / 90)))));
                //will travel diagonally at (playerBulletsSpeed) speed
                bullet.updateCoords(newLeftCoord, newBottomCoord);
            }
        },

        moveHomingBullet = function (bullet) {
            var newLeftCoord, newBottomCoord;
            if (enemyPlanes.length > 0) {
                if (bullet.targetPlane == undefined || bullet.targetPlane.currentHealth == 0 || (boss && bullet.targetPlane == boss && boss.isInQuarterPhase)) {
                    bullet.targetPlane = enemyPlanes[parseInt(Math.random() * enemyPlanes.length)];
                }
                bullet.chaseTarget();
                newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 90 * playerBulletsSpeed;
                newBottomCoord = (bullet.bottomCoord > bullet.targetPlane.bottomCoord + 40) ?
                    (bullet.bottomCoord - (playerBulletsSpeed * (1 - Math.abs(bullet.orientationDeg / 90))))
                    : (bullet.bottomCoord + (playerBulletsSpeed * (1 - Math.abs(bullet.orientationDeg / 90))));
            } else {
                bullet.removeTarget();
                newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 90 * playerBulletsSpeed;
                newBottomCoord = bullet.bottomCoord + playerBulletsSpeed;
            }

            bullet.updateCoords(newLeftCoord, newBottomCoord);
        },

        moveEnemyBullet = function (bullet) {
            var bulletSpeed = (bullet instanceof BossBullet) ? bossBulletsSpeed : fighterBulletsSpeed,
                newLeftCoord = bullet.leftCoord - (bullet.orientationDeg / 45 * bulletSpeed),
                newBottomCoord;
            if (newLeftCoord != bullet.leftCoord || newBottomCoord != bullet.bottomCoord) {
                if (bullet instanceof BossBullet && boss.currentPhase >= 3) {
                    bullet.updateCoords(newLeftCoord, bullet.bottomCoord - bulletSpeed);
                }
                else {
                    newBottomCoord = Math.floor((bullet.orientationDeg > -90 && bullet.orientationDeg < 90) ?
                        (bullet.bottomCoord - (bulletSpeed * (1 - Math.abs(bullet.orientationDeg / 90))))
                      : (bullet.bottomCoord + (bulletSpeed * (1 - Math.abs(bullet.orientationDeg / 90)))));


                    bullet.updateCoords(newLeftCoord, newBottomCoord);
                }
            }
        },

        iterateFriendlyPlanes = function () {
            var i;
            for (i = 0; i < friendlyPlanes.length; i++) {
                friendlyPlanes[i].shoot();
            }
        },

        iterateEnemyPlanes = function () {
            var i;
            for (i = 0; i < enemyPlanes.length; i++) {
                if (!enemyPlanes[i].isAnimated) {
                    if (enemyPlanes[i] instanceof EnemyFighter) {
                        moveEnemyPlane(enemyPlanes[i]);
                        enemyPlanes[i].shoot();
                    } else if (enemyPlanes[i] instanceof EnemySupplier) {
                        moveEnemyPlane(enemyPlanes[i]);
                        supplySupplier(enemyPlanes[i]);
                    } else if (enemyPlanes[i] instanceof EnemyKamikaze) {
                        moveKamikaze(enemyPlanes[i]);
                        if (detectCollision(playerPlane, enemyPlanes[i])) {
                            handleCollisionKamikaze(enemyPlanes[i]);
                            enemyPlanes.splice(i, 1);
                            i++;
                        }
                    } else if (enemyPlanes[i] instanceof EnemyStormer) {
                        enemyPlanes[i].trySummonStorm();
                    }
                } else {
                    enemyPlanes[i].move();
                }
            }
        },

        iterateHazards = function () {
            var i, hitFriendlyPlaneIndex;
            for (i = 0; i < hazards.length; i++) {
                hitFriendlyPlaneIndex = detectCollisionStormCloudFriendlyPlane(hazards[i]);
                if (hitFriendlyPlaneIndex >= 0) {
                    handleCollisionStormCloudFriendlyPlane(hazards[i], hitFriendlyPlaneIndex);
                }
                if (detectCollisionStormCloudPlayer(hazards[i])) {
                    handleCollisionStormCloudPlayer(hazards[i]);
                }
            }
        },

        iteratePickups = function () {
            var i;
            for (i = 0; i < pickups.length; i++) {
                if (pickups[i] instanceof HealingOrb) {
                    if (isPointInsideObject(pickups[i].leftCoord + pickups[i].width / 2, pickups[i].bottomCoord + pickups[i].height / 2, playerPlane)) {
                        pickups[i].heal(playerPlane);
                        pickups.splice(i, 1);
                        i--;
                    }
                }
            }
        },

        moveEnemyPlane = function (enemyPlane) {
            var nowMs = Date.now();
            enemyPlane.moveAtDirection();

            if (nowMs - enemyPlane.lastDirectionChangeTimestamp > enemyDirectionChangeFrequencyMs) {
                enemyPlane.lastDirectionChangeTimestamp = nowMs;
                enemyPlane.changeDirection();
            }
        },

        moveKamikaze = function (kamikaze) {
            //speed * (1 - deg/90)
            var newLeft = kamikaze.leftCoord + kamikaze.orientationDeg / 90 * kamikaze.movementSpeed,
                newBottom = (kamikaze.bottomCoord > playerPlane.bottomCoord) ?
                (kamikaze.bottomCoord - (kamikaze.movementSpeed * (1 - Math.abs(kamikaze.orientationDeg / 90))))
                : (kamikaze.bottomCoord + (kamikaze.movementSpeed * (1 - Math.abs(kamikaze.orientationDeg / 90))));
            kamikaze.chasePlayer();
            kamikaze.updateCoords(newLeft, newBottom);
        },

        handleMouseClick = function (e) {
            playerPlane.isShooting = e.type == "mousedown";
        },

        shootPlayerPlane = function () {
            playerPlane.shoot();
        },

        supplySupplier = function (supplier) {
            var nowMs = Date.now(), i;
            if (nowMs - supplier.lastSupplyTimestamp > supplier.supplyFrequencyMs) {
                for (i = 0; i < enemyPlanes.length; i++) {
                    if (enemyPlanes[i] instanceof EnemyFighter
                        && distanceBetweenTwoPoints(supplier.leftCoord, supplier.bottomCoord, enemyPlanes[i].leftCoord, enemyPlanes[i].bottomCoord) < 250
                        && supplier.suppliedFighters.indexOf(enemyPlanes[i]) == -1) {
                        supplier.supply(enemyPlanes[i]);
                    }
                }
            }
        },

        detectCollisionEnemyBulletWithFriendlyPlane = function (bullet) {
            var i, isHit;
            for (i = 0; i < friendlyPlanes.length; i++) {
                if (friendlyPlanes[i] instanceof SentryPlane) {
                    isHit = detectCollision(bullet, friendlyPlanes[i]);
                }
                if (isHit) {
                    return i;
                }
            }
            //bullet didn't hit a friendly plane, return -1
            return -1;
        },

        detectCollisionStormCloudFriendlyPlane = function (stormCloud) {
            var i, isHit;
            for (i = 0; i < friendlyPlanes.length; i++) {
                if (friendlyPlanes[i] instanceof SentryPlane) {
                    isHit = ((stormCloud.bottomCoord + 12 > friendlyPlanes[i].bottomCoord &&
                        stormCloud.bottomCoord + 12 < friendlyPlanes[i].bottomCoord + 75) ||
                        ((stormCloud.bottomCoord + 68) > friendlyPlanes[i].bottomCoord &&
                        (stormCloud.bottomCoord + 68) < friendlyPlanes[i].bottomCoord + 75))
                    &&
                        ((stormCloud.leftCoord + 12 > friendlyPlanes[i].leftCoord &&
                        stormCloud.leftCoord + 12 < friendlyPlanes[i].leftCoord + 100) ||
                        (stormCloud.leftCoord + 68 > friendlyPlanes[i].leftCoord &&
                        stormCloud.leftCoord + 68 < friendlyPlanes[i].leftCoord + 100));

                    if (isHit) {
                        return i;
                    }
                }
            }

            return -1;
        },

        detectCollisionStormCloudPlayer = function (stormCloud) {
            var isHit = ((stormCloud.bottomCoord + 12 > playerPlane.bottomCoord + 20 &&
                        stormCloud.bottomCoord + 12 < playerPlane.bottomCoord + 75) ||
                        ((stormCloud.bottomCoord + 68) > playerPlane.bottomCoord + 20 &&
                        (stormCloud.bottomCoord + 68) < playerPlane.bottomCoord + 75))
                    &&
                        ((stormCloud.leftCoord + 12 > playerPlane.leftCoord + 20 &&
                        stormCloud.leftCoord + 12 < playerPlane.leftCoord + 80) ||
                        (stormCloud.leftCoord + 68 > playerPlane.leftCoord + 20 &&
                        stormCloud.leftCoord + 68 < playerPlane.leftCoord + 80))
                    ||
                        (stormCloud.bottomCoord > playerPlane.bottomCoord &&
                        stormCloud.bottomCoord + 80 < playerPlane.bottomCoord + 70 &&
                        stormCloud.leftCoord > playerPlane.leftcoord &&
                        stormCloud.leftCoord + 80 < playerPlane.leftCoord + 100);

            return isHit;
        },

        isPointInsideBoss = function (left, bottom) {
            var isIn = !boss.isInvulnerable && (
                //left wing
                (left >= boss.leftCoord
                    && left <= boss.leftCoord + 75
                    && bottom >= boss.bottomCoord + 90
                    && bottom <= boss.bottomCoord + 240)
                //between left wing and cockpit
                ||
                (left >= boss.leftCoord + 75
                    && left <= boss.leftCoord + 110
                    && bottom >= boss.bottomCoord + 65
                    && bottom <= boss.bottomCoord + 240)
                //cockpit
                || (left >= boss.leftCoord + 110
                    && left <= boss.leftCoord + 185
                    && bottom >= boss.bottomCoord + 30
                    && bottom <= boss.bottomCoord + 240)
                //between cockpit and right wing
                ||
                (left >= boss.leftCoord + 185
                    && left <= boss.leftCoord + 220
                    && bottom >= boss.bottomCoord + 65
                    && bottom <= boss.bottomCoord + 240)
                //right wing
                || (left >= boss.leftCoord + 220
                    && left <= boss.leftCoord + 300
                    && bottom >= boss.bottomCoord + 90
                    && bottom <= boss.bottomCoord + 240)
            );

            return isIn;
        },
		isPointInsideObject = function (x, y, obj) {
		    isIn = ((x >= obj.leftCoord && x <= (obj.leftCoord + obj.width)) &&
				(y >= obj.bottomCoord && y <= (obj.bottomCoord + obj.height)))
		    return isIn;
		},

        detectCollision = function (obj1, obj2) {
            var collision;
            if (obj2 instanceof BossPlane) {
                collision = isPointInsideBoss(obj1.leftCoord, obj1.bottomCoord)
                            || isPointInsideBoss(obj1.leftCoord + obj1.width, obj1.bottomCoord)
                            || isPointInsideBoss(obj1.leftCoord, obj1.bottomCoord + obj1.height)
                            || isPointInsideBoss(obj1.leftCoord + obj1.width, obj1.bottomCoord + obj1.height);
            } else {
                collision = isPointInsideObject(obj1.leftCoord, obj1.bottomCoord, obj2)
                            || isPointInsideObject(obj1.leftCoord + obj1.width, obj1.bottomCoord, obj2)
                            || isPointInsideObject(obj1.leftCoord, obj1.bottomCoord + obj1.height, obj2)
                            || isPointInsideObject(obj1.leftCoord + obj1.width, obj1.bottomCoord + obj1.height, obj2);
            }

            return collision;
        },

        detectCollisionPlayerBullet = function (bullet) {
            var i, isHit, indexEnemiesHit;
            for (i = 0; i < enemyPlanes.length; i++) {
                isHit = (bullet instanceof HomingBullet || !enemyPlanes[i].isAnimated) && detectCollision(bullet, enemyPlanes[i]);
                if (isHit) { //return the index of the hit plane in the enemyPlanes array
                    return i;
                } else if (bullet instanceof PiercingBullet) {
                    indexEnemiesHit = bullet.enemiesHit.indexOf(enemyPlanes[i]);
                    if (bullet.enemiesHit.indexOf(enemyPlanes[i]) != -1) {
                        bullet.enemiesHit.splice(indexEnemiesHit, 1);
                    }
                }
            }
            //bullet didn't hit anything, return -1
            return -1;
        },

        handleCollisionKamikaze = function (kamikaze) {
            kamikaze.die();

            handleCollisionEnemy(kamikaze);
        },

        handleCollisionStormCloudFriendlyPlane = function (stormCloud, hitPlaneIndex) {
            var nowMs = Date.now();
            if (nowMs - stormCloud.lastDamageTickTimestamp > stormCloud.damageFrequencyMs) {
                stormCloud.lastDamageTickTimestamp = nowMs;
                friendlyPlanes[hitPlaneIndex].takeDamage(stormerDamage);
                if (friendlyPlanes[hitPlaneIndex].currentHealth == 0) {
                    friendlyPlanes[hitPlaneIndex].die();
                }
            }
        },

        handleCollisionStormCloudPlayer = function (stormCloud) {
            var nowMs = Date.now();
            if (nowMs - stormCloud.lastDamageTickTimestamp > stormCloud.damageFrequencyMs) {
                stormCloud.lastDamageTickTimestamp = nowMs;
                playerPlane.takeDamage(stormerDamage);
                trackRemainingHealth(playerPlane.currentHealth);
            }
        },

        handleCollisionPlayerBullet = function (bullet, hitEnemyPlaneIndex) {
            var ownerPlane = bullet.owner,
                damage = (bullet instanceof HomingBullet) ? ownerPlane.damage * 0.5 : ownerPlane.damage;
            if (bullet instanceof GuidedRocket) {
                damage = 5;
            }

            if (bullet instanceof HealingBullet) {
                playerPlane.receiveHeal(healingBulletHealPoints);
            }
            enemyPlanes[hitEnemyPlaneIndex].takeDamage(damage);
            if (enemyPlanes[hitEnemyPlaneIndex].currentHealth == 0) {
                enemyPlanes[hitEnemyPlaneIndex].die();
                enemyPlanes.splice(hitEnemyPlaneIndex, 1);
                if (currentMission instanceof GauntletMission) {
                    currentMission.incrementEnemiesKilled();
                }
            }
            trackAccuracy(true);
        },

        handleCollisionPlayerBulletWithBoss = function (bullet) {
            var ownerPlane = bullet.owner,
                damage = (bullet instanceof HomingBullet) ? ownerPlane.damage * 0.5 : ownerPlane.damage;
            boss.takeDamage(damage);
            if (boss.currentHealth == 0) {
                boss.die();
            }
            trackAccuracy(true);
        },

        handleCollisionEnemy = function (hitter) {
            if (playerPlane.absorptionShieldStrength == 0) {
                playerPlane.takeDamage(hitter.damage);
                trackRemainingHealth(playerPlane.currentHealth);
            } else {
                playerPlane.absorptionShieldStrength--;
                if (playerPlane.absorptionShieldStrength == 0) {
                    if (playerPlane.isStealthed) {
                        playerPlane.move = playerPlane.stealthMove;
                    } else {
                        playerPlane.move = playerPlane.originalMoveFunction;
                    }
                }
            }
        },
        handleAbsorbCollisionEnemyBullets = function (hitter) {
            playerPlane.receiveHeal(1);
        },

        handleAbsorbBullets = function (duration) {
            playerPlane.img.src = 'images/planes/playerAbsorbingBullets.png';
            var tempHandleCollisionEnemy = handleCollisionEnemy;
            handleCollisionEnemy = handleAbsorbCollisionEnemyBullets;
            window.setTimeout(function () {
                handleCollisionEnemy = tempHandleCollisionEnemy;
                playerPlane.img.src = 'images/planes/player.png';
            }, duration);
        },

        handleCollisionEnemyWithFriendlyPlane = function (hitter, friendlyIndex) {
            var friendly = friendlyPlanes[friendlyIndex];
            friendly.takeDamage(hitter.damage);
            if (friendly.currentHealth == 0) {
                friendly.die();
                friendlyPlanes.splice(friendlyIndex, 1);
            }
        },

        launchMission = function (missionIndex, areaIndex) {
            setInitialValues();
            setScalingValues(areaIndex);
            missionType = AreaManager.areas[areaIndex].missions[missionIndex].primary;
            secondaryObjectiveType = AreaManager.areas[areaIndex].missions[missionIndex].secondary;
            //Set the current mission position
            MissionManager.currentMissionIndex = missionIndex;
            MissionManager.currentAreaIndex = areaIndex;
            switch (missionType) {
                case "survival":
                    currentMission = new SurvivalMission(areaIndex);
                    currentMission.startMission();
                    break;
                case "domination":
                    currentMission = new DominationMission(areaIndex);
                    currentMission.startMission();
                    dominationSpawnStartingEnemies();
                    break;
                case "gauntlet":
                    currentMission = new GauntletMission(areaIndex);
                    currentMission.startMission();
                    break;
                case "boss":
                    currentMission = new BossMission(areaIndex);
                    currentMission.startMission();
                    break;
                default:
                    throw new Error("Unrecognized mission type: " + missionType);
            }
            enemySpawnFrequencyMs = currentMission.enemySpawnFrequencyMs;
        },

        getSecondaryMission = function () {
            return secondaryObjectiveType;
        },

        dominationSpawnStartingEnemies = function () {
            var i;
            for (i = 0; i < 13; i++) {
                spawnFighter();
            }
        },

        increaseSpawnTime = function () {
            enemySpawnFrequencyMs += 0.1;
        },

        abortMission = function () {
            var i;
            if (boss) {
                delete boss.skills; //prevents spamming of boss' skills after the mission is over
                //removes the reference to all the boss' skills -> the skills themselves get picked up by the garbage collector
                //as nothing is referencing them
                //if the reference to the skills is not deleted, after the mission ends the boss object and all the bossSkill objects
                //continue to exist as they're coupled (reference eachother) and all the skills continue to get used on cooldown
                //(storm clouds continue to appear every 20 seconds, even on the area screen)
            }
            for (i = 0; i < playerPlane.skills.length; i++) {
                playerPlane.skills[i].makeAvailable();
            }
            setInitialValues();
        },

        handleMissionWin = function () {
            var starsWonRemainingHealth = trackRemainingHealth(),
                starsWonAccuracy = trackAccuracy(),
                starsWonUsedSkills = trackUsedSkills(),
                starsWonForMission;
            switch (secondaryObjectiveType) {
                case "remainingHealth":
                    starsWonForMission = starsWonRemainingHealth;
                    break;
                case "accuracy":
                    starsWonForMission = starsWonAccuracy;
                    break;
                case 'usedSkills':
                    starsWonForMission = starsWonUsedSkills;
                    break;
                default:
                    break;
            };
            $("<div/>", {
                id: "effectScreen"
            })
            .appendTo("#gameScreen");
            window.setTimeout(function () {
                //Finalize mission
                abortMission();
                //Clear screen, update the area and mission statuses
                Visual.adjustCSSofGameScreen(false);
                //Draw the win screen
                if (MissionManager.currentAreaIndex == 3) { //boss mission
                    setVictoryTime();
                    Visual.drawVictoryScreen();
                } else {
                    Game.clearScreen();
                    AreaManager.updateAreaStatus(starsWonForMission);
                    AreaManager.drawMap();
                    playerPlane.stars += starsWonForMission;
                    MissionManager.winScreen(starsWonForMission);
                    if (!Game.allUnlocked) {
                        Visual.updateStarsTracker();
                    }
                    saveGame();
                }
            }, 1500);
        },

        handleMissionLoss = function () {
            trackAccuracy();
            trackRemainingHealth();
            trackUsedSkills();
            $("<div/>", {
                id: "effectScreen"
            })
           .appendTo("#gameScreen")
            window.setTimeout(function () {
                abortMission();
                saveGame();
                Visual.adjustCSSofGameScreen(false);
                Game.clearScreen();
                AreaManager.drawMap();
                if (!Game.allUnlocked) {
                    Visual.updateStarsTracker();
                }
                Game.errorMessage("Mission failed");
            }, 1500);

        },

        saveGame = function () {
            var saveData = {
                time: Timer.current,
                areas: AreaManager.areas,
                unlockedSkills: Game.unlockedSkills,
                playerSkills: Loadout.current,
                earnedStars: playerPlane.stars,
                level: playerPlane.level,
            };
            localStorage.setItem('saveData', JSON.stringify(saveData));
            localStorage.setItem('resumeAvailable', 'true');
        },

        loadGame = function () {
            var loadData = JSON.parse(localStorage.getItem('saveData'));
            Timer.current = loadData.time;
            startTimer();
            AreaManager.areas = loadData.areas;
            Game.unlockedSkills = loadData.unlockedSkills;
            Loadout.current = loadData.playerSkills;
            playerPlane.stars = loadData.earnedStars;
            playerPlane.level = loadData.level;
        },

        getTime = function () {
            return Timer.getTime();
        },

        getSeconds = function () {
            return Timer.current;
        },

        setVictoryTime = function () {
            Timer.finalTime = Timer.current;
            Timer.finalTime = 3600 - Timer.finalTime;
        },

        getVictoryTime = function () {
            return Timer.finalTime;
        },

        getPlayerHealth = function () {
            return playerPlane.currentHealth;
        },

        getPlayerStars = function () {
            return playerPlane.stars;
        },

        getPlayerLevel = function () {
            return playerPlane.level;
        },

        getStarsToLevelUp = function () {
            return starsToLevelUpCopy;
        },

        getBossHealth = function () {
            return boss.currentHealth;
        },

        getBossHealthPercentage = function () {
            return boss.healthPercentage;
        },

        getPlayerLeftCoord = function () {
            return playerPlane.leftCoord;
        },

        getPlayerBottomCoord = function () {
            return playerPlane.bottomCoord;
        },

        getPlayerSkills = function () {
            return playerPlane.skills;
        },
        setPlayerSkills = function (skillArray) {
            playerPlane.skills = [];
            for (var i = 0; i < skillArray.length; i++) {
                switch (skillArray[i]) {
                    case "spreadshot":
                        playerPlane.skills.push(new SpreadShot(playerPlane, i));
                        break;
                    case "homingshot":
                        playerPlane.skills.push(new HomingShot(playerPlane, i));
                        break;
                    case "penetratingshot":
                        playerPlane.skills.push(new PiercingShot(playerPlane, i));
                        break;
                    case "sentry":
                        playerPlane.skills.push(new Sentry(playerPlane, i));
                        break;
                    case "stoptime":
                        playerPlane.skills.push(new StopTime(playerPlane, i));
                        break;
                    case "deathray":
                        playerPlane.skills.push(new DeathRay(playerPlane, i));
                        break;
                    case "blackhole":
                        playerPlane.skills.push(new BlackHole(playerPlane, i));
                        break;
                    case "stealth":
                        playerPlane.skills.push(new Stealth(playerPlane, i));
                        break;
                    case "radioactive":
                        playerPlane.skills.push(new Radioactive(playerPlane, i));
                        break;
                    case "healingshot":
                        playerPlane.skills.push(new HealingShot(playerPlane, i));
                        break;
                    case 'guidedrocket':
                        playerPlane.skills.push(new SummonGuidedRocket(playerPlane, i));
                        break;
                    case 'shield':
                        playerPlane.skills.push(new Shield(playerPlane, i));
                        break;
                    case 'absorbbullets':
                        playerPlane.skills.push(new AbsorbBullets(playerPlane, i));
                        break;
                    default:
                        throw new Error("Unrecognized skill type");
                }
            }
        },

        getEnemiesCount = function () {
            return enemyPlanes.length;
        },

        getCurrentMission = function () {
            return currentMission;
        },

        togglePause = function () {
            if (isPaused) {
                currentMission.mainLoopInterval = window.setInterval(function () {
                    currentMission.mainLoop.call(currentMission);
                }, 1000 / 60);
            } else {
                window.clearInterval(currentMission.mainLoopInterval);
            }

            isPaused = !isPaused;
        },

        trackAccuracy = function (isHit) {
            var totalShotsFired = 0, totalShotsHit = 0, accuracyPercentage = 0, stars = 0;

            trackAccuracy = function (isHit) { //call without an argument (trackAccuracy()) to get the current amount of stars earned and reset the vars

                if (arguments.length > 0) {
                    if (isHit) {
                        totalShotsHit++;
                    }
                    totalShotsFired++;
                    accuracyPercentage = parseInt(totalShotsHit / totalShotsFired * 100);
                    if (secondaryObjectiveType == "accuracy") {
                        Visual.crossOutSecondaries(accuracyPercentage)
                    }

                    return accuracyPercentage;
                } else {
                    if (accuracyPercentage >= 50) {
                        stars = 3;
                    } else if (accuracyPercentage >= 35) {
                        stars = 2;
                    } else if (accuracyPercentage >= 25) {
                        stars = 1;
                    } else {
                        stars = 0;
                    }
                    totalShotsFired = 0; //resetting
                    totalShotsHit = 0;
                    accuracyPercentage = 0;

                    return stars;
                }
            }
            if (isHit) {
                return trackAccuracy(isHit);
            } else {
                return trackAccuracy();
            }
        },

        trackRemainingHealth = function (currentHealth) {
            var minimumHealthPercentageReached = 100, stars = 0;

            trackRemainingHealth = function (currentHealth) {
                if (arguments.length > 0) {
                    currentHealthPercentage = parseInt(currentHealth / playerPlane.maxHealth * 100);
                    if (currentHealthPercentage < minimumHealthPercentageReached) {
                        minimumHealthPercentageReached = currentHealthPercentage;
                    }
                    if (secondaryObjectiveType == "remainingHealth") {
                        Visual.crossOutSecondaries(currentHealthPercentage);
                    }

                    return minimumHealthPercentageReached;
                } else { //if called without an argument, the function will return the amount of stars won and will reset the used variables
                    if (minimumHealthPercentageReached >= 75) {
                        stars = 3; //currently at 3 stars
                    } else if (minimumHealthPercentageReached >= 50) {
                        stars = 2; //currently at 2 stars
                    } else if (minimumHealthPercentageReached >= 25) {
                        stars = 1; //currently at 1 star
                    } else {
                        stars = 0;
                    }
                    minimumHealthPercentageReached = 100;
                    return stars;
                }
            }

            if (currentHealth) {
                return trackRemainingHealth(currentHealth);
            } else {
                return trackRemainingHealth();
            }
        },

        trackUsedSkills = function (skillName) {
            var skillUseCount = 0, stars = 0;

            trackUsedSkills = function (skillName) {
                if (arguments.length > 0) {
                    skillUseCount++;
                    if (secondaryObjectiveType == "usedSkills") {
                        Visual.crossOutSecondaries(skillUseCount);
                    }

                    return skillUseCount;
                } else { //if called without an argument, the function will return the amount of stars won and will reset the used variables
                    if (skillUseCount < 5) {
                        stars = 3; //currently at 3 stars
                    } else if (skillUseCount < 7) {
                        stars = 2; //currently at 2 stars
                    } else if (skillUseCount < 9) {
                        stars = 1; //currently at 1 star
                    } else {
                        stars = 0;
                    }
                    skillUseCount = 0;
                    return stars;
                }
            }

            if (skillName) {
                return trackUsedSkills(skillName);
            } else {
                return trackUsedSkills();
            }
        },

        trackUsedSkillsExposed = function (skillName) {
            trackUsedSkills(skillName);
        },

        distanceBetweenTwoPoints = function (x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        },

         handleRadioactive = function (left, bottom) {
             animateRadioactive(left, bottom);
             setTimeout(function () {
                 dealDamageRadioactive(left, bottom);
             }, 400);

             if (boss && !boss.isInQuarterPhase) {
                 dealDamageRadioactiveToBoss(left, bottom);
             }
         },

        animateRadioactive = function (left, bottom) {
            var radioactiveDiv =
                $('<div></div>')
                .addClass('radioactiveDiv')
                .css({
                    'bottom': bottom + playerPlane.height / 2 + 'px',
                    'left': left + playerPlane.width / 2 + 'px'
                })
                .appendTo('#gameScreen')
                .animate({
                    bottom: bottom + playerPlane.height / 2 - radioactiveRadius / 2,
                    left: left + playerPlane.width / 2 - radioactiveRadius / 2,
                    width: radioactiveRadius + "px",
                    height: radioactiveRadius + "px",
                    opacity: 0
                },
                800,
                function () {
                    radioactiveDiv.remove();
                });

        },

        dealDamageRadioactive = function (left, bottom) {
            var i, isHit,
            X = left + playerPlane.width / 2, //PlayerPlane Center X
            Y = bottom + playerPlane.height / 2; //PlayerPlane Center Y
            //enemy planes
            for (i = 0; i < enemyPlanes.length; i++) {
                isHit = ((distanceBetweenTwoPoints(enemyPlanes[i].leftCoord, enemyPlanes[i].bottomCoord, X, Y)) < (radioactiveRadius - 100)) &&
                    ((distanceBetweenTwoPoints(enemyPlanes[i].leftCoord + enemyPlanes[i].width, enemyPlanes[i].bottomCoord, X, Y)) < (radioactiveRadius - 100)) &&
                    ((distanceBetweenTwoPoints(enemyPlanes[i].leftCoord + enemyPlanes[i].width, enemyPlanes[i].bottomCoord + enemyPlanes[i].height, X, Y)) < (radioactiveRadius - 100)) &&
                    ((distanceBetweenTwoPoints(enemyPlanes[i].leftCoord, enemyPlanes[i].bottomCoord + enemyPlanes[i].height, X, Y)) < (radioactiveRadius - 100));

                if (isHit) {
                    enemyPlanes[i].takeDamage(radioactiveDamage);
                    if (enemyPlanes[i].currentHealth == 0) {
                        enemyPlanes[i].die();
                        enemyPlanes.splice(i, 1);
                        i--;
                        if (currentMission instanceof GauntletMission) {
                            currentMission.incrementEnemiesKilled();
                        }
                    }
                }
            }
            //boss
        },

        dealDamageRadioactiveToBoss = function (left, bottom) {
            var isHit,
            X = left + 50, //PlayerPlane Center X
            Y = bottom + 40; //PlayerPlane Center Y

            isHit = ((distanceBetweenTwoPoints(boss.leftCoord, boss.bottomCoord, X, Y)) < (radioactiveRadius - 100)) &&
                    ((distanceBetweenTwoPoints(boss.leftCoord + boss.width, boss.bottomCoord, X, Y)) < (radioactiveRadius - 100)) &&
                    ((distanceBetweenTwoPoints(boss.leftCoord + boss.width, boss.bottomCoord + boss.height, X, Y)) < (radioactiveRadius - 100)) &&
                    ((distanceBetweenTwoPoints(boss.leftCoord, boss.bottomCoord + boss.height, X, Y)) < (radioactiveRadius - 100));

            if (isHit) {
                boss.takeDamage(radioactiveDamage);
                if (boss.currentHealth == 0) {
                    boss.die();
                }
            }
        },
        stopTimeOn = function (newMainLoop) {
            timeIsStopped = true;
            window.clearInterval(currentMission.mainLoopInterval);
            currentMission.mainLoopInterval = window.setInterval(function () {
                newMainLoop();
            }, 1000 / 60);
        },

        stopTimeOff = function () {
            timeIsStopped = false;
            window.clearInterval(currentMission.mainLoopInterval);
            currentMission.mainLoopInterval = window.setInterval(function () {
                currentMission.mainLoop.call(currentMission);
            }, 1000 / 60);
        },

        handleDeathRay = function (left, bottom) {
            animateDeathRay(left, bottom);
            dealDamageDeathRay(left, bottom);
            if (boss && !boss.isInQuarterPhase) {
                dealDamageDeathRayToBoss(left, bottom);
            }
        },

        animateDeathRay = function (left, bottom) {
            var deathRayDiv =
                $('<div></div>')
                .addClass('deathRayDiv')
                .css({
                    'height': (700 - bottom + playerPlane.height) + 'px',
                    'left': left + 22 + 'px',
                    'bottom': bottom + playerPlane.height + 'px'
                })
                .appendTo('#gameScreen')
                .animate({
                    opacity: 0,
                    left: '+=28',
                    width: 0
                }, function () {
                    deathRayDiv.remove();
                });

        },

        dealDamageDeathRay = function (left, bottom) {
            var i, isHit;
            //enemy planes
            for (i = 0; i < enemyPlanes.length; i++) {
                isHit = (enemyPlanes[i].bottomCoord > bottom + 75) &&   //enemy is above the player
                    ((enemyPlanes[i].leftCoord > (left + 22) && enemyPlanes[i].leftCoord < (left + 78)) || //enemy's left side has been hit
                     ((enemyPlanes[i].leftCoord + 100) > (left + 22) && (enemyPlanes[i].leftCoord + 100) < (left + 78)) ||    //enemy's right side has been hit
                     ((enemyPlanes[i].leftCoord < (left + 22)) && (enemyPlanes[i].leftCoord + 100) > (left + 78))); //enemy is hit in the middle

                if (isHit) {
                    enemyPlanes[i].takeDamage(deathRayDamage);
                    if (enemyPlanes[i].currentHealth == 0) {
                        enemyPlanes[i].die();
                        enemyPlanes.splice(i, 1);
                        i--;
                        if (currentMission instanceof GauntletMission) {
                            currentMission.incrementEnemiesKilled();
                        }
                    }
                }
            }
            //boss
        },

        dealDamageDeathRayToBoss = function (left, bottom) {
            var isHit = (boss.bottomCoord > bottom + 75) &&   //boss is above the player
                   ((boss.leftCoord > (left + 22) && boss.leftCoord < (left + 78)) || //boss' left side has been hit
                    ((boss.leftCoord + 300) > (left + 22) && (boss.leftCoord + 300) < (left + 78)) ||    //boss' right side has been hit
                    ((boss.leftCoord < (left + 22)) && (boss.leftCoord + 300) > (left + 78))); //boss is hit in the middle
            if (isHit) {
                boss.takeDamage(deathRayDamage);
                if (boss.currentHealth == 0) {
                    boss.die();
                }
            }
        },

        handleBossDeathRay = function (deathRay) {
            animateBossDeathRay(deathRay);
            computeVectorsDeathRay(deathRay);
            dealDamageBossDeathRay(deathRay);
        },

        createAndSkewBossDeathRay = function (orientationDeg) {
            //skew is an expensive operation, we do it preemptively to reduce performance issues
            var rayHeight = 500,
                rayLeft = Math.floor(boss.leftCoord - (Math.tan(Utility.degreeToRadian(orientationDeg)) * (rayHeight / 2))),
                rayTop = 700 - Math.floor(boss.bottomCoord),
                deathRay = {
                    div: null,
                    leftCoord: null,
                    bottomCoord: null,
                    skewDegree: (orientationDeg != 0) ? -orientationDeg : 1, //avoid dividing by zero 
                    leftVector: {
                        a: null,
                        b: null,
                    }, //f(x) = ax + b;
                    rightVector: {
                        a: null,
                        b: null,
                    }, //f(x) = ax + b;
                };
            deathRay.div =
                $('<div></div>')
                .addClass('bossDeathRayDiv')
                .css({
                    'opacity': 0,
                    'left': rayLeft + 'px',
                    'top': rayTop + 'px',
                    'height': rayHeight + 'px',
                    '-webkit-transform': 'skewX(' + -orientationDeg + 'deg)',
                    '-ms-transform': 'skewX(' + -orientationDeg + 'deg)',
                    'transform': 'skewX(' + -orientationDeg + 'deg)'
                })
                .appendTo('#gameScreen');
            return deathRay;
        },

        animateBossDeathRay = function (deathRay) {
            var rayLeftOffset = 100 + Math.ceil(boss.orientationDeg * 5 / 3),
                rayTopOffset = -Math.abs(boss.orientationDeg * 4 / 3);
            deathRay.leftCoord = boss.leftCoord + rayLeftOffset;
            deathRay.bottomCoord = boss.bottomCoord - rayTopOffset;
            $(deathRay.div)
            .css({
                'opacity': 1,
                'left': '+=' + rayLeftOffset,
                'top': '+=' + rayTopOffset,
            })
            .animate({
                'left': '+=75',
                'width': 0
            }, {
                duration: 400,
                complete: function () {
                    $(deathRay.div).remove();
                }
            });
        },

        computeVectorsDeathRay = function (deathRay) {
            var deathRayWidth = parseInt($(deathRay.div).css('width')),
                deathRayHeight = parseInt($(deathRay.div).css('height')),
                leftVectorFirstPointX = deathRay.leftCoord + 15,
                leftVectorFirstPointY = deathRay.bottomCoord,
                rightVectorFirstPointX = leftVectorFirstPointX + deathRayWidth - 45,
                rightVectorFirstPointY = deathRay.bottomCoord,
                leftVectorSecondPointX,
                leftVectorSecondPointY = leftVectorFirstPointY - deathRayHeight,
                rightVectorSecondPointX,
                rightVectorSecondPointY = rightVectorFirstPointY - deathRayHeight;
            leftVectorSecondPointX = (deathRay.skewDegree > 0) ?
                leftVectorFirstPointX + Math.tan(Math.abs(Utility.degreeToRadian(deathRay.skewDegree))) * deathRayHeight
                : leftVectorFirstPointX - Math.tan(Math.abs(Utility.degreeToRadian(deathRay.skewDegree))) * deathRayHeight;
            rightVectorSecondPointX = leftVectorSecondPointX + deathRayWidth - 45;

            deathRay.leftVector.a = (leftVectorFirstPointY - leftVectorSecondPointY) / (leftVectorFirstPointX - leftVectorSecondPointX); //a = (y1 - y2) / (x1 - x2); 
            deathRay.leftVector.b = (leftVectorSecondPointY * leftVectorFirstPointX - leftVectorFirstPointY * leftVectorSecondPointX)
                                        / (leftVectorFirstPointX - leftVectorSecondPointX);
            //b = (y2x1 - y1x2) / (x1 - x2)
            //analogically compute right vector
            deathRay.rightVector.a = (rightVectorFirstPointY - rightVectorSecondPointY) / (rightVectorFirstPointX - rightVectorSecondPointX);
            deathRay.rightVector.b = (rightVectorSecondPointY * rightVectorFirstPointX - rightVectorFirstPointY * rightVectorSecondPointX)
                                        / (rightVectorFirstPointX - rightVectorSecondPointX);

            //these divs are used for debugging purposes, uncomment them to see the vector start and end point of the ray(marked by red squares)

            //$('<div></div>')
            //    .css({
            //        'position': 'absolute',
            //        'width': '10px',
            //        'height': '10px',
            //        'background-color': 'red',
            //        'bottom': leftVectorFirstPointY,
            //        'left': leftVectorFirstPointX,
            //        'z-index': 1000
            //    })
            //    .appendTo('#gameScreen')
            //    .fadeOut();
            //$('<div></div>')
            //    .css({
            //        'position': 'absolute',
            //        'width': '10px',
            //        'height': '10px',
            //        'background-color': 'red',
            //        'bottom': leftVectorSecondPointY,
            //        'left': leftVectorSecondPointX,
            //        'z-index': 1000
            //    })
            //    .appendTo('#gameScreen')
            //    .fadeOut();
            //$('<div></div>')
            //    .css({
            //        'position': 'absolute',
            //        'width': '10px',
            //        'height': '10px',
            //        'background-color': 'red',
            //        'bottom': rightVectorSecondPointY,
            //        'left': rightVectorSecondPointX,
            //        'z-index': 1000
            //    })
            //    .appendTo('#gameScreen')
            //    .fadeOut();
            //$('<div></div>')
            //    .css({
            //        'position': 'absolute',
            //        'width': '10px',
            //        'height': '10px',
            //        'background-color': 'red',
            //        'bottom': rightVectorFirstPointY,
            //        'left': rightVectorFirstPointX,
            //        'z-index': 1000
            //    })
            //    .appendTo('#gameScreen')
            //    .fadeOut();
        },

        dealDamageBossDeathRay = function (deathRay) {
            var isHit = false, isHitByLeft = false, isHitByRight = false, leftVectorAtPlayerLeft, leftVectorAtPlayerRight,
                leftVectorAtPlayerTop, leftVectorAtPlayerBottom, rightVectorAtPlayerLeft, rightVectorAtPlayerRight,
                rightVectorAtPlayerTop, rightVectorAtPlayerBottom;
            //f(x) = ax + b;
            //<=> y = ax + b <=> bottom = a*left + b; left = (bottom - b) / a (a != 0);
            //check if left vector crosses the player
            function vectorFunction(x, a, b) { //input x, get y
                return a * x + b;
            };
            function reverseVectorFunction(y, a, b) { //input y, get x
                //a is never 0, as the skew degree is never 0, division is safe
                return (y - b) / a;
            };

            leftVectorAtPlayerLeft = vectorFunction(playerPlane.leftCoord, deathRay.leftVector.a, deathRay.leftVector.b);
            leftVectorAtPlayerRight = vectorFunction(playerPlane.leftCoord + 100, deathRay.leftVector.a, deathRay.leftVector.b);
            leftVectorAtPlayerTop = reverseVectorFunction(playerPlane.bottomCoord + 75, deathRay.leftVector.a, deathRay.leftVector.b);
            leftVectorAtPlayerBottom = reverseVectorFunction(playerPlane.bottomCoord, deathRay.leftVector.a, deathRay.leftVector.b);
            rightVectorAtPlayerLeft = vectorFunction(playerPlane.leftCoord, deathRay.rightVector.a, deathRay.rightVector.b);
            rightVectorAtPlayerRight = vectorFunction(playerPlane.leftCoord + 100, deathRay.rightVector.a, deathRay.rightVector.b);
            rightVectorAtPlayerTop = reverseVectorFunction(playerPlane.bottomCoord + 75, deathRay.rightVector.a, deathRay.rightVector.b);
            rightVectorAtPlayerBottom = reverseVectorFunction(playerPlane.bottomCoord, deathRay.rightVector.a, deathRay.rightVector.b);

            isHitByLeft = (leftVectorAtPlayerLeft >= playerPlane.bottomCoord && leftVectorAtPlayerLeft <= playerPlane.bottomCoord + 75)
                       || (leftVectorAtPlayerRight >= playerPlane.bottomCoord && leftVectorAtPlayerRight <= playerPlane.bottomCoord + 75)
                       || (leftVectorAtPlayerBottom >= playerPlane.leftCoord && leftVectorAtPlayerBottom <= playerPlane.leftCoord + 100)
                       || (leftVectorAtPlayerTop >= playerPlane.leftCoord && leftVectorAtPlayerTop <= playerPlane.leftCoord + 100);

            isHitByRight = (rightVectorAtPlayerLeft >= playerPlane.bottomCoord && rightVectorAtPlayerLeft <= playerPlane.bottomCoord + 75)
                       || (rightVectorAtPlayerRight >= playerPlane.bottomCoord && rightVectorAtPlayerRight <= playerPlane.bottomCoord + 75)
                       || (rightVectorAtPlayerBottom >= playerPlane.leftCoord && rightVectorAtPlayerBottom <= playerPlane.leftCoord + 100)
                       || (rightVectorAtPlayerTop >= playerPlane.leftCoord && rightVectorAtPlayerTop <= playerPlane.leftCoord + 100);

            isHit = isHitByLeft || isHitByRight;

            if (isHit) {
                if (playerPlane.absorptionShieldStrength == 0) {
                    playerPlane.takeDamage(bossDeathRayDamage);
                    trackRemainingHealth(playerPlane.currentHealth);
                } else {
                    playerPlane.absorptionShieldStrength = 0;
                    if (playerPlane.isStealthed) {
                        playerPlane.move = playerPlane.stealthMove;
                    } else {
                        playerPlane.move = playerPlane.originalMoveFunction;
                    }
                }

            }
        },

        handleBlackHole = function () {
            $("#gameScreen").css({
                "cursor": "url(images/UI/pointerCursor.png), auto"
            });
            $(document).unbind('mouseup mousedown', handleMouseClick);
            $(document).unbind('mousemove', movePlayerPlane);
            $(document).on('click', placeBlackHole);
        },

        placeBlackHole = function (e) {
            //add black hole image
            var convertedCoords = convertEventCoordinates(e.clientX, e.clientY),
                convertedLeft = (convertedCoords.left <= 860) ? convertedCoords.left : 860;
            Visual.drawBlackHole(convertedCoords.left, convertedCoords.bottom);
            moveEnemiesBlackHole(convertedLeft, convertedCoords.bottom);

            window.setTimeout(function () {
                $(document).bind('mouseup mousedown', handleMouseClick);
                $(document).bind('mousemove', movePlayerPlane);
                $(document).off('click', placeBlackHole);
                $("#gameScreen").css({
                    "cursor": "none"
                });
            }, 300);
        },

        moveEnemiesBlackHole = function (left, bottom) {
            var i,
                currentMoveEnemyPlaneFunction = moveEnemyPlane,
                currentKamikazeMoveFunction = moveKamikaze,
                animationLengthMs = 400,
                planes = enemyPlanes;
            moveEnemyPlane = function () { };
            moveKamikaze = function () { };
            for (i = 0; i < enemyPlanes.length; i++) {
                enemyPlanes[i].readyToMove = false;
                CAnimations.animate(enemyPlanes[i], {
                    opacity: 1,
                    rotation: 0,
                    scale: 1,
                    left: left,
                    bottom: bottom,
                    frames: 25,
                });
            }
            window.setTimeout(function () {
                moveEnemyPlane = currentMoveEnemyPlaneFunction;
                moveKamikaze = currentKamikazeMoveFunction;
                for (i = 0; i < enemyPlanes.length; i++) {
                    enemyPlanes[i].readyToMove = true;
                }
            }, animationLengthMs);
        },

        handleGuidedRocket = function () {
            $("#gameScreen").css({
                "cursor": "url(images/UI/pointerCursor.png), auto"
            });
            $(document).unbind('mouseup mousedown', handleMouseClick);
            $(document).unbind('mousemove', movePlayerPlane);
            $(document).on('mousedown', initiateRocketPathDrawing);
            $(document).on('mouseup', finishRocketPathDrawing);
        },

        initiateRocketPathDrawing = function () {
            $(document).on('mousemove', drawRocketPath);
        },

        finishRocketPathDrawing = function () {
            rocketPathArray.splice(99, rocketPathArray.length - 99); //remove all but the first 100 entries
            $(document).off('mousemove', drawRocketPath);
            $(document).off('mousedown', initiateRocketPathDrawing);
            $(document).off('mouseup', finishRocketPathDrawing);
            window.setTimeout(function () {
                if (currentMission) {
                    $("#gameScreen").css({
                        "cursor": "none"
                    });
                    $(document).on('mousemove', movePlayerPlane);
                    $(document).bind('mouseup mousedown', handleMouseClick);
                    if (rocketPathArray.length > 0) {
                        spawnRocket(rocketPathArray[0].left, rocketPathArray[0].bottom);
                    }
                }
            }, 300);
        },

        drawRocketPath = function (e) {
            var converted = convertEventCoordinates(e.clientX, e.clientY, true),
                lastCoordsInPath = rocketPathArray[rocketPathArray.length - 1];
            if (!lastCoordsInPath || distanceBetweenTwoPoints(converted.left, converted.bottom, lastCoordsInPath.left, lastCoordsInPath.bottom) > 20) {
                rocketPathArray.push(converted);
                if (rocketPathArray.length >= 1000) {
                    finishRocketPathDrawing();
                }
            }
        },

        moveGuidedRocket = function (rocket) {
            var newLeft, newBottom, coords;
            if (rocketPathArray.length > 0) {
                rocket.chaseTarget(rocketPathArray[0].left, rocketPathArray[0].bottom);
                coords = rocketPathArray.shift();
                newLeft = rocket.leftCoord + rocket.orientationDeg / 90 * rocket.movementSpeed;
                newBottom = (rocket.bottomCoord > coords.bottom) ?
                    (rocket.bottomCoord - (rocket.movementSpeed * (1 - Math.abs(rocket.orientationDeg / 90))))
                    : (rocket.bottomCoord + (rocket.movementSpeed * (1 - Math.abs(rocket.orientationDeg / 90))));
                rocket.updateCoords(coords.left, coords.bottom);
            }
        },

        convertEventCoordinates = function (clientX, clientY, drawing) {
            var converted = { left: 0, bottom: 0 };
            var nonGameScreenWidth = window.innerWidth - 960;
            //newLeft
            if (clientX > nonGameScreenWidth / 2 + 50) {
                //if mouse is inside the game screen
                if (clientX < (nonGameScreenWidth / 2 + 960) - 50) {
                    converted.left = clientX - (nonGameScreenWidth / 2);
                } else { //mouse is to the right of game screen
                    converted.left = 960 - 50;
                }
            } else { //mouse is to the left of game screen
                converted.left = 0 + 50;
            }
            //newBottom
            if (clientY <= 570) {
                converted.bottom = 700 - clientY - 50;
                if ($('#gameScreen').css('cursor') != 'none' && !drawing) {
                    $('#gameScreen').css('cursor', 'none');
                }
            } else {
                if ($('#gameScreen').css('cursor') == 'none') {
                    $('#gameScreen').css('cursor', 'url(images/UI/pointerCursor.png), auto');
                }
                converted.bottom = 80;
            }

            converted.left = parseInt(converted.left);
            converted.bottom = parseInt(converted.bottom);

            return converted;
        },

        convertEventCoordinatesBossMission = function (clientX, clientY) {
            var converted = { left: 0, bottom: 0 };
            var nonGameScreenWidth = window.innerWidth - 960;
            //newLeft
            if (clientX > nonGameScreenWidth / 2 + 50) {
                //if mouse is inside the game screen
                if (clientX < (nonGameScreenWidth / 2 + 960) - 50) {
                    converted.left = clientX - (nonGameScreenWidth / 2);
                } else { //mouse is to the right of game screen
                    converted.left = 960 - 50;
                }
            } else { //mouse is to the left of game screen
                converted.left = 0 + 50;
            }
            //newBottom
            if (clientY >= 350 && clientY <= 570) {
                converted.bottom = 700 - clientY - 50;
                $('#gameScreen').css('cursor', 'none');
            } else if (clientY > 570) {
                converted.bottom = 80;
                $('#gameScreen').css('cursor', 'url(images/UI/pointerCursor.png), auto');
            } else {
                converted.bottom = 300;
                $('#gameScreen').css('cursor', 'url(images/UI/pointerCursor.png), auto');
            }

            return converted;
        },

        isPlayerShooting = function () {
            return playerPlane.isShooting;
        },

        handleBossIteration = function () {
            var bossIndex, handleFunction;
            moveEnemyPlane(boss);
            boss.shoot();
            boss.updateHealthPercentage();
            if (boss.healthPercentage <= 75 && boss.currentPhase == 1 ||
                boss.healthPercentage <= 50 && boss.currentPhase == 2 ||
                boss.healthPercentage <= 25 && boss.currentPhase == 3) {
                var bossIndex;
                boss.enterQuarterPhase();
                bossIndex = enemyPlanes.indexOf(boss);
                enemyPlanes.splice(bossIndex, 1);
                switch (boss.currentPhase) {
                    case 2:
                        boss.phase75Percent();
                        handleFunction = handleBoss75Phase;
                        break;
                    case 3:
                        boss.phase50Percent();
                        handleFunction = handleBoss50Phase;
                        break;
                    case 4:
                        boss.phase25Percent();
                        handleFunction = handleBoss25Phase;
                        break;
                    default:
                        throw new Error('Unrecognized boss phase');
                }

                window.setTimeout(function () {
                    handleFunction();
                    if (boss.currentPhase == 2 || boss.currentPhase == 4) {
                        boss.skills.splice(0, 1);
                    }
                }, 3000);

                window.setTimeout(function () {
                    if (boss) {
                        boss.finishedSpawningReinforcements = true;
                    }
                }, 5000);
            }
            if (boss.finishedSpawningReinforcements && enemyPlanes.length <= 3) { //all but 3 of the adds have been killed, resume boss fight
                boss.leaveQuarterPhase();
                window.setTimeout(function () {
                    enemyPlanes.push(boss);
                }, 3000);
            }
        },

        handleBoss75Phase = function () {
            var i;
            boss.shoot = boss.shootSecondPhase;
            for (i = 0; i < 8; i++) {
                spawnFighter();
            }
            spawnSupplier();
        },

        handleBoss50Phase = function () {
            var i;
            boss.shoot = boss.shootThirdPhase;
            for (i = 0; i < 10; i++) {
                spawnKamikaze();
            }
        },

        handleBoss25Phase = function () {
            var i;
            boss.shoot = boss.normalShootFunction;
            for (i = 0; i < 8; i++) {
                spawnKamikaze();
                spawnFighter();
            }
        },

        isTimeStopped = function () {
            return timeIsStopped;
        },

        redrawGameObjects = function () {
            var i;
            playerPlane.move();
            for (i = 0; i < enemyPlanes.length; i++) {
                enemyPlanes[i].move();
            }
            for (i = 0; i < bullets.length; i++) {
                bullets[i].move();
            }
            for (i = 0; i < friendlyPlanes.length; i++) {
                friendlyPlanes[i].rotate();
            }
            for (i = 0; i < pickups.length; i++) {
                pickups[i].draw();
            }
            for (i = 0; i < hazards.length; i++) {
                hazards[i].draw();
            }
        },

        increasePlayerLevel = function () {
            playerPlane.level++;
        },

        updatePrimaryStatus = function () {
            currentMission.updatePrimaryStatus();
        },

        handleSkillUsage = function (keyPressed) {
            if (playerPlane.skills[keyPressed]) {
                playerPlane.skills[keyPressed].use();
            }
        };

    return {
        startNewMission: launchMission,
        startTimer: startTimer,
        getSecondaryMission: getSecondaryMission,
        spawnPlayer: spawnPlayer,
        spawnBoss: spawnBoss,
        spawnSentry: spawnSentry,
        spawnBullet: spawnBullet,
        spawnEnemy: spawnEnemy,
        spawnHealingOrb: spawnHealingOrb,
        gauntletSpawnEnemies: gauntletSpawnEnemies,
        movePlayerPlane: movePlayerPlane,
        iterateBullets: iterateBullets,
        iterateFriendlyPlanes: iterateFriendlyPlanes,
        iterateEnemyPlanes: iterateEnemyPlanes,
        iterateHazards: iterateHazards,
        iteratePickups: iteratePickups,
        increaseSpawnTime: increaseSpawnTime,
        shootPlayerPlane: shootPlayerPlane,
        handleMouseClick: handleMouseClick,
        handleMissionWin: handleMissionWin,
        handleMissionLoss: handleMissionLoss,
        togglePause: togglePause,
        handleSkillUsage: handleSkillUsage,
        stopTimeOn: stopTimeOn,
        stopTimeOff: stopTimeOff,
        handleDeathRay: handleDeathRay,
        handleRadioactive: handleRadioactive,
        handleAbsorbBullets: handleAbsorbBullets,
        createAndSkewBossDeathRay: createAndSkewBossDeathRay,
        handleBossDeathRay: handleBossDeathRay,
        handleBlackHole: handleBlackHole,
        spawnStormCloud: spawnStormCloud,
        handleBossIteration: handleBossIteration,
        isTimeStopped: isTimeStopped,
        trackUsedSkillsExposed: trackUsedSkillsExposed,
        handleGuidedRocket: handleGuidedRocket,
        rotateSentries: rotateSentries,
        redrawGameObjects: redrawGameObjects,
        isPlayerShooting: isPlayerShooting,
        increasePlayerLevel: increasePlayerLevel, //this is safe, plane level only determines how many stars are needed for the next skill unlock
        updatePrimaryStatus: updatePrimaryStatus,
        loadGame: loadGame,

        getTime: getTime,
        getSeconds: getSeconds,
        getVictoryTime: getVictoryTime,
        getPlayerHealth: getPlayerHealth,
        getPlayerStars: getPlayerStars,
        getPlayerLevel: getPlayerLevel,
        getStarsToLevelUp: getStarsToLevelUp,
        getBossHealth: getBossHealth,
        getBossHealthPercentage: getBossHealthPercentage,
        getPlayerLeftCoord: getPlayerLeftCoord,
        getPlayerBottomCoord: getPlayerBottomCoord,
        getPlayerSkills: getPlayerSkills,
        setPlayerSkills: setPlayerSkills,
        getEnemiesCount: getEnemiesCount,
        getCurrentMission: getCurrentMission
    }
})();