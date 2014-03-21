var interactionManager = (function () {
    var playerPlane = new PlayerPlane(),
        bullets,
        playerBulletsSpeed,
        enemyBulletsSpeed,
        fighterMovementSpeed,
        supplierMovementSpeed,
        fighterMaxHealth,
        supplierMaxHealth,
        fighterDamage,
        supplierDamage,
        lastShotPlayerBulletTimestamp,
        lastFighterSpawnTimestamp,
        enemyPlanes,
        fighterSpawnFrequencyMs,
        fighterShootFrequencyMs,
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
            fighterMaxHealth = 3;
            supplierMaxHealth = 5;
            fighterDamage = 7;
            supplierDamage = 0;
            enemySpawnFrequencyMs = 700;
            fighterDirectionChangeFrequencyMs = 1000;
            fighterShootFrequencyMs = 1500;
            supplierSupplyFrequencyMs = 1500;
            enemyPlanes = [];
            lastShotPlayerBulletTimestamp = -1;
            lastEnemySpawnTimestamp = -1;
            currentMission = null;
        },

        spawnPlayer = function () {
            playerPlane.currentHealth = playerPlane.maxHealth;
            playerPlane.addToScreen();
        },

        spawnBullet = function (type, left, bottom, orientationDeg, owner) {
            var newBullet, randIndex, target;
            switch (type) {
                case "player":
                    newBullet = new PlayerBullet(left, bottom, orientationDeg);
                    break;
                case "enemy":
                    newBullet = new EnemyBullet(left, bottom, orientationDeg, owner);
                    break;
                case "piercing":
                    newBullet = new PiercingBullet(left, bottom, orientationDeg);
                    break;
                case "homing":
                    randIndex = parseInt(Math.random() * enemyPlanes.length);
                    var target = enemyPlanes[randIndex];
                    newBullet = new HomingBullet(left, bottom, orientationDeg, target);
                default:
                    break;
            }
            bullets.push(newBullet);
            newBullet.addToScreen();
        },

        spawnEnemy = function () {
            //90% chance to spawn fighter, 10% chance to spawn supplier
            var nowMs = Date.now(), rand;
            if (nowMs - lastEnemySpawnTimestamp > enemySpawnFrequencyMs) {
                lastEnemySpawnTimestamp = nowMs;
                rand = parseInt(Math.random() * 100) + 1; //[1, 100]
                if (rand >= 90) {
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

        movePlayerPlane = function (e) {
            //substracting a half of the non-game screen
            var newLeft, newBottom;
            var nonGameScreenWidth = window.innerWidth - 960;
            //newLeft
            if (e.clientX > nonGameScreenWidth / 2 + 50) {
                //if mouse is inside the game screen
                if (e.clientX < (nonGameScreenWidth / 2 + 960) - 50) {
                    newLeft = e.clientX - (nonGameScreenWidth / 2);
                } else { //mouse is to the right of game screen
                    newLeft = 960 - 50;
                }
            } else { //mouse is to the left of game screen
                newLeft = 0 + 50;
            }
            //newBottom
            if (e.clientY <= 700) {
                newBottom = 700 - e.clientY - 50;
            } else {
                newBottom = 0;
            }

            newLeft -= 50; //adjust plane to cursor
            playerPlane.updateCoords(newLeft, newBottom);
            playerPlane.move();
        },

        iterateBullets = function () {
            var i, toBeDestroyed = false, hitEnemyPlaneIndex;
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
                else if (bullets[i] instanceof PlayerBullet){
                    hitEnemyPlaneIndex = detectCollisionPlayerBullet(bullets[i]);
                    if (hitEnemyPlaneIndex != -1
                        && (!(bullets[i] instanceof PiercingBullet) || bullets[i].enemiesHit.indexOf(enemyPlanes[hitEnemyPlaneIndex]))) {
                        bullets[i].handleCollision(enemyPlanes[hitEnemyPlaneIndex]);
                        handleCollisionPlayerBullet(hitEnemyPlaneIndex);
                    } else {
                        movePlayerBullet(bullets[i]);
                    }
                }
                else if (bullets[i] instanceof EnemyBullet) {
                    if (detectCollisionEnemyBullet(bullets[i])) {
                        bullets[i].handleCollision();
                        handleCollisionEnemyBullet(bullets[i].owner);
                    } else {
                        moveEnemyBullet(bullets[i]);
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
                newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 45 * playerBulletsSpeed;
                newBottomCoord = (bullet.bottomCoord < bullet.targetPlane.bottomCoord) ?
                    (bullet.bottomCoord + playerBulletsSpeed) : (bullet.bottomCoord - playerBulletsSpeed);
                bullet.chaseTarget();
            } else { //continue moving in the same direction
                newLeftCoord = bullet.leftCoord + bullet.orientationDeg / 45 * playerBulletsSpeed;
                newBottomCoord = bullet.bottomCoord + playerBulletsSpeed;
            }

            bullet.updateCoords(newLeftCoord, newBottomCoord);
            bullet.move();
        },

        moveEnemyBullet = function (bullet) {
            var newLeftCoord = bullet.leftCoord - bullet.orientationDeg / 45 * enemyBulletsSpeed;
            bullet.updateCoords(newLeftCoord, bullet.bottomCoord - enemyBulletsSpeed);
            bullet.move();
        }

        iterateEnemyPlanes = function () {
            var i;
            for (i = 0; i < enemyPlanes.length; i++) {
                if (enemyPlanes[i] instanceof EnemyFighter) {
                    moveEnemyPlane(enemyPlanes[i]);
                    shootFighter(enemyPlanes[i]);
                } else if (enemyPlanes[i] instanceof EnemySupplier) {
                    moveEnemyPlane(enemyPlanes[i]);
                    supplySupplier(enemyPlanes[i]);
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
        }

        playerPlaneShootToggle = function (e) {
            playerPlane.isShooting = e.type == "mousedown";
        },

        shootPlayerPlane = function () {
            var nowMs = Date.now();
            if (nowMs - lastShotPlayerBulletTimestamp > 120) {
                lastShotPlayerBulletTimestamp = nowMs;
                playerPlane.shoot();
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

        detectCollisionEnemyBullet = function (bullet) {
            //returns true if the bullet has hit the player, or false otherwise
            var i, isHit;
            isHit = bullet.leftCoord >= playerPlane.leftCoord
                 && bullet.leftCoord <= playerPlane.leftCoord + 100
                 && bullet.bottomCoord >= playerPlane.bottomCoord
                 && bullet.bottomCoord <= playerPlane.bottomCoord + 80;
            return isHit;
        },

        detectCollisionPlayerBullet = function (bullet) {
            var i;
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
                }
                if (isHit) { //return the index of the hit plane in the enemyPlanes array
                    return i;
                }
            }
            //bullet didn't hit anything, return -1
            return -1;
        },

        handleCollisionPlayerBullet = function (hitEnemyPlaneIndex) {
            if (enemyPlanes[hitEnemyPlaneIndex].currentHealth > playerPlane.damage) {
                enemyPlanes[hitEnemyPlaneIndex].currentHealth -= playerPlane.damage;
                enemyPlanes[hitEnemyPlaneIndex].updateHpBar();
            } else {
                enemyPlanes[hitEnemyPlaneIndex].currentHealth = 0;
                enemyPlanes[hitEnemyPlaneIndex].die();
                enemyPlanes.splice(hitEnemyPlaneIndex, 1);
                trackEnemiesKilled(1);
            }
            trackAccuracy(true);
        },

        handleCollisionEnemyBullet = function (hitter) {
            if (playerPlane.currentHealth > hitter.damage) {
                playerPlane.currentHealth -= hitter.damage;
            } else {
                playerPlane.currentHealth = 0;
            }
            trackRemainingHealth(playerPlane.currentHealth);
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
                    break;
                default:
                    throw new Error("Unrecognized mission type: " + missionType);
            }
            currentMission.startMission();
        },

        abortMission = function () {
            setInitialValues();
        },

        handleMissionWin = function () {
            var starsWonRemainingHealth = trackRemainingHealth(),
                starsWonAccuracy = trackAccuracy(),
                starsWonEnemiesKilled = trackEnemiesKilled(),
                starsWonForMission;
            switch (secondaryObjectiveType) {
                case "remainingHealth":
                    starsWonForMission = starsWonRemainingHealth;
                    break;
                case "accuracy":
                    starsWonForMission = starsWonAccuracy;
                    break;
                case "enemiesKilled":
                    starsWonForMission = starsWonEnemiesKilled;
                    break;
                default:
                    break;
            }
            $("<div/>",{
                id:"effectScreen"
            })
            .fadeIn(1500,"swing",function(){
                //Finalize mission
            currentMission.endMission();
            abortMission();
            //Clear screen, update the area and mission statuses
            Game.clearScreen();
            AreaManager.updateAreaStatus(starsWonForMission);
            AreaManager.drawMap();
            //Draw the win screen
            Game.playerStars += starsWonForMission;
            MissionManager.winScreen(starsWonForMission);
            })
            .appendTo("#gameScreen");
        },

        handleMissionLoss = function () {
             $("<div/>",{
                id:"effectScreen"
            })
            .fadeIn(1500,"swing",function(){
              currentMission.endMission();
              abortMission();
              Game.clearScreen();
              AreaManager.drawMap();
               Game.errorMessage("Mission failed");
               })
            .appendTo("#gameScreen");
        },

        getPlayerHealth = function () {
            return playerPlane.currentHealth;
        },

        getPlayerSkills = function () {
            return playerPlane.skills;
        },

        getEnemiesCount = function () {
            return enemyPlanes.length;
        },

        togglePause = function () {
            if (isPaused) {
                currentMission.mainLoopInterval = window.setInterval(currentMission.mainLoop, 1000 / 60);
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
                    console.log("accuracy: " + accuracyPercentage);

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
                    $("#hpBar").css("width",currentHealthPercentage*2+"px");
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

        trackEnemiesKilled = function (killCount) {
            var enemiesKilled = 0, stars = 0;

            trackEnemiesKilled = function (killCount) {
                if (arguments.length > 0) { //if the func is called without arguments, the amount of stars earned will be returned + the vars will reset
                    console.log("enemies killed: " + enemiesKilled);
                    enemiesKilled += killCount;

                    if (enemiesKilled >= 35) {
                        stars = 3;
                    } else if (enemiesKilled >= 30) {
                        stars = 2;
                    } else if (enemiesKilled >= 27) {
                        stars = 1;
                    } else {
                        stars = 0;
                    }

                    return enemiesKilled;
                } else {
                    enemiesKilled = 0;
                    return stars;
                }
            }

            trackEnemiesKilled(killCount);
        },

        handleSkillUsage = function (keyPressed) {
            playerPlane.skills[keyPressed].use();
        };

    return {
        startNewMission: launchMission,
        spawnPlayer: spawnPlayer,
        spawnBullet: spawnBullet,
        spawnEnemy: spawnEnemy,
        movePlayerPlane: movePlayerPlane,
        iterateBullets: iterateBullets,
        iterateEnemyPlanes: iterateEnemyPlanes,
        shootPlayerPlane: shootPlayerPlane,
        playerPlaneShootToggle: playerPlaneShootToggle,
        handleMissionWin: handleMissionWin,
        handleMissionLoss: handleMissionLoss,
        togglePause: togglePause,
        handleSkillUsage: handleSkillUsage,

        getPlayerHealth: getPlayerHealth,
        getPlayerSkills: getPlayerSkills,
        getEnemiesCount: getEnemiesCount
    }
})();