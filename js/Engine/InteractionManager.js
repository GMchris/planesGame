var interactionManager = (function () {
    var playerPlane = new PlayerPlane(),
        bullets,
        playerBulletsSpeed,
        enemyBulletsSpeed,
        fighterMovementSpeed,
        supplierMovementSpeed,
        kamikazeMovementSpeed,
        fighterMaxHealth,
        supplierMaxHealth,
        kamikazeMaxHealth,
        fighterDamage,
        supplierDamage,
        kamikazeDamage,
        lastShotPlayerBulletTimestamp,
        lastFighterSpawnTimestamp,
        enemyPlanes,
        friendlyPlanes,
        enemySpawnFrequencyMs,
        fighterShootFrequencyMs,
        sentryShootFrequencyMs,
        fighterDirectionChangeFrequencyMs,
        currentMission,
        secondaryObjectiveType,
        isPaused,
        setInitialValues = function () {
            playerPlane.isShooting = false;
            isPaused = false;
            bullets = [];
            playerBulletsSpeed = 10;
            enemyBulletsSpeed = 7;
            fighterMovementSpeed = 4;
            supplierMovementSpeed = 1;
            kamikazeMovementSpeed = 2;
            fighterMaxHealth = 3;
            supplierMaxHealth = 5;
            kamikazeMaxHealth = 10;
            sentryMaxHealth = parseInt(playerPlane.maxHealth / 4);
            fighterDamage = 7;
            sentryDamage = playerPlane.damage / 3;
            supplierDamage = 0;
            kamikazeDamage = parseInt(playerPlane.maxHealth / 3);
            enemySpawnFrequencyMs = null; //is set when a mission is started
            fighterDirectionChangeFrequencyMs = 1000;
            fighterShootFrequencyMs = 1500;
            sentryShootFrequencyMs = 150;
            supplierSupplyFrequencyMs = 1500;
            enemyPlanes = [];
            friendlyPlanes = [];
            lastShotPlayerBulletTimestamp = -1;
            lastEnemySpawnTimestamp = -1;
            currentMission = null;
        },

        spawnPlayer = function () {
            playerPlane.currentHealth = playerPlane.maxHealth;
            playerPlane.addToScreen();
        },

        spawnSentry = function (left, bottom) {
            var sentryTargetIndex = parseInt(Math.random() * enemyPlanes.length),
                sentryTarget = enemyPlanes[sentryTargetIndex],
                sentry = new SentryPlane(left, bottom, sentryMaxHealth, sentryDamage, sentryTarget);

            friendlyPlanes.push(sentry);
            sentry.addToScreen();

        },

        spawnBullet = function (type, left, bottom, orientationDeg, owner) {
            var newBullet, randIndex, target;
            switch (type) {
                case "player":
                    newBullet = new PlayerBullet(left, bottom, orientationDeg, owner);
                    break;
                case "enemy":
                    newBullet = new EnemyBullet(left, bottom, orientationDeg, owner);
                    break;
                case "piercing":
                    newBullet = new PiercingBullet(left, bottom, orientationDeg, owner);
                    break;
                case "homing":
                    randIndex = parseInt(Math.random() * enemyPlanes.length);
                    var target = enemyPlanes[randIndex];
                    newBullet = new HomingBullet(left, bottom, orientationDeg, owner, target);
                default:
                    break;
            }
            bullets.push(newBullet);
            newBullet.addToScreen();
        },

        spawnEnemy = function () {
            //80% chance to spawn fighter, 10% chance to spawn supplier, 10% chance to spawn kamikaze
            var nowMs = Date.now();
            if (nowMs - lastEnemySpawnTimestamp > enemySpawnFrequencyMs) {
                lastEnemySpawnTimestamp = nowMs;
                spawnRandomEnemy();
            }
        },

        spawnRandomEnemy = function () {
            if (enemyPlanes.length <= 20) {
                var rand = parseInt(Math.random() * 100) + 1; //[1, 100]
                if (rand >= 90) {
                    spawnKamikaze();
                } else if (rand >= 80) {
                    spawnSupplier();
                } else {
                    spawnFighter();
                }
            }
        },

        spawnFighter = function () {
            var newFighter = new EnemyFighter(getRandomLeftCoord(45), getRandomBottomCoordTopHalf(35),
                fighterMaxHealth, fighterDamage, fighterMovementSpeed);
            newFighter.addToScreen();
            enemyPlanes.push(newFighter);
        },

        spawnSupplier = function () {
            var newSupplier = new EnemySupplier(getRandomLeftCoord(45), getRandomBottomCoordTopHalf(35),
                supplierMaxHealth, supplierDamage, supplierMovementSpeed);
            newSupplier.addToScreen();
            enemyPlanes.push(newSupplier);
        },

        spawnKamikaze = function () {
            var newKamikaze = new EnemyKamikaze(getRandomLeftCoord(45), getRandomBottomCoordTopHalf(35),
                kamikazeMaxHealth, kamikazeDamage, kamikazeMovementSpeed);
            newKamikaze.addToScreen();
            enemyPlanes.push(newKamikaze);
        },

        gauntletSpawnEnemies = function () {
            var i;
            for (i = 0; i < currentMission.enemiesSpawnedPerTaunt; i++) {
                spawnRandomEnemy();
            }
        },

        movePlayerPlane = function (e) {
            //substracting a half of the non-game screen
            var newCoords = convertEventCoordinates(e.clientX, e.clientY);

            newCoords.left -= 50; //adjust plane to cursor
            playerPlane.updateCoords(newCoords.left, newCoords.bottom);
            playerPlane.move();
        },

        iterateBullets = function (type) { //types: 'all', 'player', 'enemy'
            var i, toBeDestroyed = false, hitEnemyPlaneIndex, hitFriendlyPlaneIndex;
            for (i = 0; i < bullets.length; i++) {
                toBeDestroyed = false;
                //if out of the screen, flag the bullet for removal
                if (bullets[i].bottomCoord < 0 || bullets[i].bottomCoord > 700 || bullets[i].leftCoord < 10 || bullets[i].leftCoord > 947) {
                    bullets[i].toBeSpliced = true;
                    bullets[i].die();
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
                    if (detectCollisionEnemyBulletWithPlayer(bullets[i])) { //bullet hit the player
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
                    i++;
                }

            }
        },

        movePlayerBullet = function (bullet) {
            if (bullet instanceof HomingBullet) {
                moveHomingBullet(bullet);
            } else {
                var newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 45 * playerBulletsSpeed; //if the degree is (45) or (-45), the bullet
                //will travel diagonally at (playerBulletsSpeed) speed
                bullet.updateCoords(newLeftCoord, bullet.bottomCoord + playerBulletsSpeed);
                bullet.move();
            }
        },

        moveHomingBullet = function (bullet) {
            var newLeftCoord, newBottomCoord;

            if (enemyPlanes.length > 0) { //if there's at least one enemy on screen
                if (bullet.targetPlane == undefined || bullet.targetPlane.currentHealth == 0) {
                    bullet.targetPlane = enemyPlanes[parseInt(Math.random() * enemyPlanes.length)];
                }
                bullet.chaseTarget();
                newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 90 * playerBulletsSpeed;
                newBottomCoord = (bullet.bottomCoord > bullet.targetPlane.bottomCoord) ?
                    (bullet.bottomCoord - (playerBulletsSpeed * (1 - Math.abs(bullet.orientationDeg / 90))))
                    : (bullet.bottomCoord + (playerBulletsSpeed * (1 - Math.abs(bullet.orientationDeg / 90))));
            } else {
                //the bullets travel forward
                bullet.removeTarget();
                newLeftCoord = newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 90 * playerBulletsSpeed;
                newBottomCoord = bullet.bottomCoord + playerBulletsSpeed;
            }



            bullet.updateCoords(newLeftCoord, newBottomCoord);
            bullet.move();
        },

        moveEnemyBullet = function (bullet) {
            var newLeftCoord = bullet.leftCoord - bullet.orientationDeg / 45 * enemyBulletsSpeed;
            bullet.updateCoords(newLeftCoord, bullet.bottomCoord - enemyBulletsSpeed);
            bullet.move();
        },

        iterateFriendlyPlanes = function () {
            var i;
            for (i = 0; i < friendlyPlanes.length; i++) {
                if (friendlyPlanes[i] instanceof SentryPlane) {
                    shootSentry(friendlyPlanes[i]);
                }
            }
        },

        iterateEnemyPlanes = function () {
            var i;
            for (i = 0; i < enemyPlanes.length; i++) {
                if (enemyPlanes[i] instanceof EnemyFighter) {
                    moveEnemyPlane(enemyPlanes[i]);
                    shootFighter(enemyPlanes[i]);
                } else if (enemyPlanes[i] instanceof EnemySupplier) {
                    moveEnemyPlane(enemyPlanes[i]);
                    supplySupplier(enemyPlanes[i]);
                } else if (enemyPlanes[i] instanceof EnemyKamikaze) {
                    moveKamikaze(enemyPlanes[i]);
                    if (detectCollisionKamikaze(enemyPlanes[i])) {
                        handleCollisionKamikaze(enemyPlanes[i]);
                        enemyPlanes.splice(i, 1);
                        i++;
                    }
                }
            }
        },

        moveEnemyPlane = function (enemyPlane) {
            var nowMs = Date.now();
            enemyPlane.moveAtDirection();
            enemyPlane.move();

            if (nowMs - enemyPlane.lastDirectionChangeTimestamp > fighterDirectionChangeFrequencyMs) {
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
            kamikaze.move();
        },

        handleMouseClick = function (e) {
            playerPlane.isShooting = e.type == "mousedown";
        },

        shootPlayerPlane = function () {
            var nowMs = Date.now();
            if (nowMs - lastShotPlayerBulletTimestamp > 120) {
                lastShotPlayerBulletTimestamp = nowMs;
                playerPlane.shoot();
            }
        },

        shootSentry = function (sentry) {
            var nowMs = Date.now();
            if (nowMs - sentry.lastShootTimestamp > sentryShootFrequencyMs) {
                sentry.lastShootTimestamp = nowMs;
                sentry.shoot();
            }
        },

    //shootEnemyPlanes = function () {
    //    var i;
    //    for (i = 0; i < enemyPlanes.length; i++) {
    //        if (enemyPlanes[i] instanceof EnemyFighter) {
    //            shootFighter(enemyPlanes[i]);
    //        }
    //    }
    //},

        shootFighter = function (fighter) {
            var nowMs = Date.now();
            if (nowMs - fighter.lastShootTimestamp > fighterShootFrequencyMs) {
                fighter.lastShootTimestamp = nowMs;
                fighter.shoot();
            }
        },

        supplySupplier = function (supplier) {
            var nowMs = Date.now(), i;
            if (nowMs - supplier.lastSupplyTimestamp > supplierSupplyFrequencyMs) {
                for (i = 0; i < enemyPlanes.length; i++) {
                    if (enemyPlanes[i] instanceof EnemyFighter && distance(supplier, enemyPlanes[i]) < 250) {
                        supplier.supply(enemyPlanes[i]);
                    }
                }
            }
        },

        distance = function (gameObject1, gameObject2) {
            //computes distance between two objects, using the pythagorean theorem
            var leftCoordsDistance = Math.abs(gameObject1.leftCoord - gameObject2.leftCoord),
                bottomCoordsDistance = Math.abs(gameObject1.bottomCoord - gameObject2.bottomCoord);
            objectDistance = Math.sqrt(leftCoordsDistance * leftCoordsDistance + bottomCoordsDistance * bottomCoordsDistance);

            return objectDistance;
        },

        detectCollisionEnemyBulletWithPlayer = function (bullet) {
            //returns true if the bullet has hit the player, or false otherwise
            var i, isHit;
            isHit = bullet.leftCoord >= playerPlane.leftCoord
                 && bullet.leftCoord <= playerPlane.leftCoord + 100
                 && bullet.bottomCoord >= playerPlane.bottomCoord
                 && bullet.bottomCoord <= playerPlane.bottomCoord + 80;
            return isHit;
        },

        detectCollisionEnemyBulletWithFriendlyPlane = function (bullet) {
            var i, isHit;
            for (i = 0; i < friendlyPlanes.length; i++) {
                if (friendlyPlanes[i] instanceof SentryPlane) {
                    isHit = bullet.leftCoord >= friendlyPlanes[i].leftCoord
                         && bullet.leftCoord <= friendlyPlanes[i].leftCoord + 100
                         && bullet.bottomCoord >= friendlyPlanes[i].bottomCoord
                         && bullet.bottomCoord <= friendlyPlanes[i].bottomCoord + 75;
                }

                if (isHit) {
                    return i;
                }
            }
            //bullet didn't hit a friendly plane, return -1
            return -1;
        },

        detectCollisionPlayerBullet = function (bullet) {
            var i, isHit;
            for (i = 0; i < enemyPlanes.length; i++) {
                if (enemyPlanes[i] instanceof EnemyFighter) {
                    isHit = bullet.leftCoord >= enemyPlanes[i].leftCoord
                         && bullet.leftCoord <= enemyPlanes[i].leftCoord + 90
                         && bullet.bottomCoord >= enemyPlanes[i].bottomCoord
                         && bullet.bottomCoord <= enemyPlanes[i].bottomCoord + 70;
                } else if (enemyPlanes[i] instanceof EnemySupplier) {
                    isHit = bullet.leftCoord >= enemyPlanes[i].leftCoord
                         && bullet.leftCoord <= enemyPlanes[i].leftCoord + 100
                         && bullet.bottomCoord >= enemyPlanes[i].bottomCoord
                         && bullet.bottomCoord <= enemyPlanes[i].bottomCoord + 80;
                } else if (enemyPlanes[i] instanceof EnemyKamikaze) {
                    isHit = bullet.leftCoord >= enemyPlanes[i].leftCoord
                         && bullet.leftCoord <= enemyPlanes[i].leftCoord + 100
                         && bullet.bottomCoord >= enemyPlanes[i].bottomCoord
                         && bullet.bottomCoord <= enemyPlanes[i].bottomCoord + 75;
                }
                if (isHit) { //return the index of the hit plane in the enemyPlanes array
                    return i;
                }
            }
            //bullet didn't hit anything, return -1
            return -1;
        },

        detectCollisionKamikaze = function (kamikaze) {
            var isHit = ((kamikaze.bottomCoord > playerPlane.bottomCoord &&
                kamikaze.bottomCoord < playerPlane.bottomCoord + 80) ||
                ((kamikaze.bottomCoord + 75) > playerPlane.bottomCoord &&
                (kamikaze.bottomCoord + 75) < playerPlane.bottomCoord + 80))
            &&
                ((kamikaze.leftCoord > playerPlane.leftCoord &&
                kamikaze.leftCoord < playerPlane.leftCoord + 100) ||
                (kamikaze.leftCoord + 100 > playerPlane.leftCoord &&
                kamikaze.leftCoord + 100 < playerPlane.leftCoord + 100));

            return isHit;
        },

        handleCollisionKamikaze = function (kamikaze) {
            kamikaze.die();

            handleCollisionEnemy(kamikaze);
        },

        handleCollisionPlayerBullet = function (bullet, hitEnemyPlaneIndex) {
            var ownerPlane = bullet.owner,
                damage = (bullet instanceof HomingBullet) ? ownerPlane.damage * 0.75 : ownerPlane.damage;
            if (enemyPlanes[hitEnemyPlaneIndex].currentHealth > damage) {
                enemyPlanes[hitEnemyPlaneIndex].currentHealth -= damage;
                enemyPlanes[hitEnemyPlaneIndex].updateHpBar();
            } else {
                enemyPlanes[hitEnemyPlaneIndex].currentHealth = 0;
                enemyPlanes[hitEnemyPlaneIndex].updateHpBar();
                enemyPlanes[hitEnemyPlaneIndex].die();
                enemyPlanes.splice(hitEnemyPlaneIndex, 1);
                if (currentMission instanceof GauntletMission) {
                    currentMission.incrementEnemiesKilled();
                }
            }
            trackAccuracy(true);
        },

        handleCollisionEnemy = function (hitter) {
            if (playerPlane.currentHealth > hitter.damage) {
                playerPlane.currentHealth -= hitter.damage;
            } else {
                playerPlane.currentHealth = 0;
            }
            trackRemainingHealth(playerPlane.currentHealth);
        },

        handleCollisionEnemyWithFriendlyPlane = function (hitter, friendlyIndex) {
            var friendly = friendlyPlanes[friendlyIndex];
            if (friendly.currentHealth > hitter.damage) {
                friendly.currentHealth -= hitter.damage;
                friendly.updateHpBar();
            } else {
                friendly.currentHealth = 0;
                friendly.updateHpBar();
                friendly.die();
                friendlyPlanes.splice(friendlyIndex, 1);
            }
        },

        launchMission = function (missionIndex, areaIndex) {
            setInitialValues();
            missionType = AreaManager.areas[areaIndex].missions[missionIndex].primary;
            secondaryObjectiveType = AreaManager.areas[areaIndex].missions[missionIndex].secondary;
            //Set the current mission position
            MissionManager.currentMissionIndex = missionIndex;
            MissionManager.currentAreaIndex = areaIndex;
            switch (missionType) {
                case "survival":
                    currentMission = new SurvivalMission();
                    currentMission.startMission();
                    break;
                case "domination":
                    currentMission = new DominationMission();
                    currentMission.startMission();
                    dominationSpawnStartingEnemies();
                    break;
                case "gauntlet":
                    currentMission = new GauntletMission();
                    currentMission.startMission();
                    break;
                default:
                    throw new Error("Unrecognized mission type: " + missionType);
            }
            enemySpawnFrequencyMs = currentMission.enemySpawnFrequencyMs;
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
            setInitialValues();
        },

        handleMissionWin = function () {
            var starsWonRemainingHealth = trackRemainingHealth(),
                starsWonAccuracy = trackAccuracy(),
                starsWonForMission;
            switch (secondaryObjectiveType) {
                case "remainingHealth":
                    starsWonForMission = starsWonRemainingHealth;
                    break;
                case "accuracy":
                    starsWonForMission = starsWonAccuracy;
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
                Game.clearScreen();
                AreaManager.updateAreaStatus(starsWonForMission);
                AreaManager.drawMap();
                //Draw the win screen
                Game.playerStars += starsWonForMission;
                MissionManager.winScreen(starsWonForMission);
            }, 1500);
        },

        handleMissionLoss = function () {
            $("<div/>", {
                id: "effectScreen"
            })
           .appendTo("#gameScreen")
            window.setTimeout(function () {
                abortMission();
                Visual.adjustCSSofGameScreen(false);
                Game.clearScreen();
                AreaManager.drawMap();
                Game.errorMessage("Mission failed");
            }, 1500);

        },

        getPlayerHealth = function () {
            return playerPlane.currentHealth;
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
        setPlayerSkills = function(skillArray){
            playerPlane.skills = [];
            "spreadshot","homingshot","penetratingshot","sentry","stoptime","deathray"
            for(var i=0;i<skillArray.length;i++){
                switch(skillArray[i]){
                    case "spreadshot":
                        playerPlane.skills.push(new SpreadShot(playerPlane));
                        break;
                    case "homingshot":
                        playerPlane.skills.push(new HomingShot(playerPlane));
                        break;
                    case "penetratingshot":
                        playerPlane.skills.push(new PiercingShot(playerPlane));
                        break;
                    case "sentry":
                        playerPlane.skills.push(new Sentry(playerPlane));
                        break;
                    case "stoptime":
                        playerPlane.skills.push(new StopTime(playerPlane));
                        break;
                    case "deathray":
                        playerPlane.skills.push(new DeathRay(playerPlane));
                        break;
                    case "blackhole":
                        playerPlane.skills.push(new BlackHole(playerPlane));
                        break;
                    default:
                        throw new Error("Unrecognized skill type");
                }
            }
        },


        getEnemiesCount = function () {
            return enemyPlanes.length;
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
                    //console.log("accuracy: " + accuracyPercentage);

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
            trackAccuracy(isHit);
        },

        trackRemainingHealth = function (currentHealth) {
            var minimumHealthPercentageReached = 100, stars = 0;

            trackRemainingHealth = function (currentHealth) {
                if (arguments.length > 0) {
                    currentHealthPercentage = parseInt(currentHealth / playerPlane.maxHealth * 100);
                    $("#hpBar").css("width", currentHealthPercentage * 2 + "px");
                    if (currentHealthPercentage < minimumHealthPercentageReached) {
                        minimumHealthPercentageReached = currentHealthPercentage;
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

            trackRemainingHealth(currentHealth);
        },

        //trackEnemiesKilled = function (killCount) {
        //    var enemiesKilled = 0, stars = 0;

        //    trackEnemiesKilled = function (killCount) {
        //        if (arguments.length > 0) { //if the func is called without arguments, the amount of stars earned will be returned + the vars will reset
        //            //console.log("enemies killed: " + enemiesKilled);
        //            enemiesKilled += killCount;

        //            if (enemiesKilled >= 60) {
        //                stars = 3;
        //            } else if (enemiesKilled >= 50) {
        //                stars = 2;
        //            } else if (enemiesKilled >= 45) {
        //                stars = 1;
        //            } else {
        //                stars = 0;
        //            }

        //            return enemiesKilled;
        //        } else {
        //            enemiesKilled = 0;
        //            return stars;
        //        }
        //    }

        //    trackEnemiesKilled(killCount);
        //},

        stopTimeOn = function (newMainLoop) {
            window.clearInterval(currentMission.mainLoopInterval);
            currentMission.mainLoopInterval = window.setInterval(function () {
                newMainLoop();
            }, 1000 / 60);
        },

        stopTimeOff = function () {
            window.clearInterval(currentMission.mainLoopInterval);
            currentMission.mainLoopInterval = window.setInterval(function () {
                currentMission.mainLoop.call(currentMission);
            }, 1000 / 60);
        },

        handleDeathRay = function (left, bottom) {
            animateDeathRay(left, bottom);
            dealDamageDeathRay(left, bottom);
        },

        animateDeathRay = function (left, bottom) {
            var deathRayDiv =
                $('<div></div>')
                .addClass('deathRayDiv')
                .css({
                    'height': (700 - bottom + 80) + 'px',
                    'left': left + 22 + 'px',
                    'bottom': bottom + 80 + 'px'
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
            var i, isHit, deathRayDamage = playerPlane.damage * 10;
            for (i = 0; i < enemyPlanes.length; i++) {
                isHit = (enemyPlanes[i].bottomCoord > bottom + 75) &&   //enemy is above the player
                    ((enemyPlanes[i].leftCoord > (left + 22) && enemyPlanes[i].leftCoord < (left + 78)) || //enemy's left side has been hit
                     ((enemyPlanes[i].leftCoord + 100) > (left + 22) && (enemyPlanes[i].leftCoord + 100) < (left + 78)) ||    //enemy's right side has been hit
                     ((enemyPlanes[i].leftCoord < (left + 22)) && (enemyPlanes[i].leftCoord + 100) > (left + 78))); //enemy is hit in the middle

                if (isHit) {
                    if (enemyPlanes[i].currentHealth > deathRayDamage) {
                        enemyPlanes[i].currentHealth -= deathRayDamage;
                        enemyPlanes[i].updateHpBar();
                    } else {
                        enemyPlanes[i].currentHealth = 0;
                        enemyPlanes[i].updateHpBar();
                        enemyPlanes[i].die();
                        enemyPlanes.splice(i, 1);
                        i--;
                        if (currentMission instanceof GauntletMission) {
                            currentMission.incrementEnemiesKilled();
                        }
                    }
                }
            }
        },

        handleBlackHole = function () {
            $("#gameScreen").css({
                "cursor": "pointer"
            });
            $(document).unbind('mouseup mousedown', handleMouseClick);
            $(document).unbind('mousemove', movePlayerPlane);
            $(document).on('click', placeBlackHole);
        },

        placeBlackHole = function (e) {
            //add black hole image
            var convertedCoords = convertEventCoordinates(e.clientX, e.clientY),
                convertedLeft = (convertedCoords.left <= 860) ? convertedCoords.left : 860;
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
                animationLengthMs = 400;
            moveEnemyPlane = function () { };
            moveKamikaze = function () { };
            for (i = 0; i < enemyPlanes.length; i++) {
                $(enemyPlanes[i].div)
                    .animate({
                        left: left,
                        bottom: bottom
                    }, animationLengthMs);
                enemyPlanes[i].leftCoord = left;
                enemyPlanes[i].bottomCoord = bottom;
            }
            window.setTimeout(function () {
                moveEnemyPlane = currentMoveEnemyPlaneFunction;
                moveKamikaze = currentKamikazeMoveFunction;
            }, animationLengthMs);
        },

        convertEventCoordinates = function (clientX, clientY) {
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
            if (clientY <= 700) {
                converted.bottom = 700 - clientY - 50;
            } else {
                converted.bottom = 0;
            }

            return converted;
        },

        handleSkillUsage = function (keyPressed) {
            if(playerPlane.skills[keyPressed]==undefined){return;}
            playerPlane.skills[keyPressed].use();
        };

    return {
        startNewMission: launchMission,
        spawnPlayer: spawnPlayer,
        spawnSentry: spawnSentry,
        spawnBullet: spawnBullet,
        spawnEnemy: spawnEnemy,
        gauntletSpawnEnemies: gauntletSpawnEnemies, 
        movePlayerPlane: movePlayerPlane,
        iterateBullets: iterateBullets,
        iterateFriendlyPlanes: iterateFriendlyPlanes,
        iterateEnemyPlanes: iterateEnemyPlanes,
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
        handleBlackHole: handleBlackHole,

        getPlayerHealth: getPlayerHealth,
        getPlayerLeftCoord: getPlayerLeftCoord,
        getPlayerBottomCoord: getPlayerBottomCoord,
        getPlayerSkills: getPlayerSkills,
        setPlayerSkills: setPlayerSkills,
        getEnemiesCount: getEnemiesCount
    }
})();