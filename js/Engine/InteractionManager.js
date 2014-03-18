var interactionManager = (function () {
    var playerPlane = new PlayerPlane(),
        bullets,
        playerBulletsSpeed,
        enemyBulletsSpeed,
        fighterMovementSpeed,
        fighterMaxHealth,
        fighterDamage,
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
            isPaused = false;
            bullets = [];
            playerBulletsSpeed = 15;
            enemyBulletsSpeed = 7;
            fighterMovementSpeed = 4;
            fighterMaxHealth = 3;
            fighterDamage = 12;
            fighterSpawnFrequencyMs = 1000;
            fighterDirectionChangeFrequencyMs = 1000;
            fighterShootFrequencyMs = 1500;
            enemyPlanes = [];
            lastShotPlayerBulletTimestamp = -1;
            lastFighterSpawnTimestamp = -1;
            currentMission = null;
        },

        spawnPlayer = function () {
            playerPlane.currentHealth = playerPlane.maxHealth;
            playerPlane.addToScreen();
        },

        spawnBullet = function (type, left, bottom, owner) {
            var newBullet;
            switch (type) {
                case "player":
                    newBullet = new PlayerBullet(left, bottom);
                    break;
                case "enemy":
                    newBullet = new EnemyBullet(left, bottom, owner);
                    break;
                default:
                    break;
            }
            bullets.push(newBullet);
            newBullet.addToScreen();
        },

        spawnFighter = function () {
            var nowMs = Date.now();
            if (nowMs - lastFighterSpawnTimestamp > fighterSpawnFrequencyMs) {
                lastFighterSpawnTimestamp = nowMs;

                var newFighter = new EnemyFighter(getRandomLeftCoord(45), getRandomBottomCoordTopHalf(35),
                    fighterMaxHealth, fighterDamage, fighterMovementSpeed);
                newFighter.addToScreen();
                enemyPlanes.push(newFighter);   
            }
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
                if (bullets[i].bottomCoord < 0 || bullets[i].bottomCoord > 700) {
                    toBeDestroyed = true;
                    if (bullets[i] instanceof PlayerBullet) {
                        trackAccuracy(false);
                    }
                }
                else if (bullets[i] instanceof PlayerBullet){
                    hitEnemyPlaneIndex = detectCollisionPlayerBullet(bullets[i]);
                    if (hitEnemyPlaneIndex != -1) {
                        toBeDestroyed = true;
                        handleCollisionPlayerBullet(hitEnemyPlaneIndex);
                    } else {
                        movePlayerBullet(bullets[i]);
                    }
                }
                else if (bullets[i] instanceof EnemyBullet) {
                    if (detectCollisionEnemyBullet(bullets[i])) {
                        toBeDestroyed = true;
                        handleCollisionEnemyBullet(bullets[i].owner);
                    } else {
                        moveEnemyBullet(bullets[i]);
                    }
                }

                if (toBeDestroyed) {
                    $(bullets[i].div).remove();
                    bullets.splice(i, 1);
                    i++;
                }

            }
        },

        movePlayerBullet = function (bullet) {
            bullet.updateCoords(bullet.leftCoord, bullet.bottomCoord + playerBulletsSpeed);
            bullet.move();
        },

        moveEnemyBullet = function (bullet) {
            bullet.updateCoords(bullet.leftCoord, bullet.bottomCoord - enemyBulletsSpeed);
            bullet.move();
        }

        iterateEnemyPlanes = function () {
            var i;
            for (i = 0; i < enemyPlanes.length; i++) {
                if (enemyPlanes[i] instanceof EnemyFighter) {
                    moveFighter(enemyPlanes[i]);
                    shootFighter(enemyPlanes[i]);
                }
            }
        },

        moveFighter = function (fighter) {
            var nowMs = Date.now();
            fighter.moveAtDirection();
            fighter.move();

            if (nowMs - fighter.lastDirectionChangeTimestamp > fighterDirectionChangeFrequencyMs) {
                fighter.lastDirectionChangeTimestamp = nowMs;
                fighter.changeDirection();
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

        shootEnemyPlanes = function () {
            var i;
            for (i = 0; i < enemyPlanes.length; i++) {
                if (enemyPlanes[i] instanceof EnemyFighter) {
                    shootFighter(enemyPlanes[i]);
                }
            }
        },

        shootFighter = function (fighter) {
            var nowMs = Date.now();
            if (nowMs - fighter.lastShootTimestamp > fighterShootFrequencyMs) {
                fighter.lastShootTimestamp = nowMs;
                fighter.shoot();
            }
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
                    if (isHit) { //return the index of the hit plane in the enemyPlanes array
                        return i;
                    }
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
            var starsWon;
            switch (secondaryObjectiveType) {
                case "remainingHealth":
                    starsWon = trackRemainingHealth();
                    break;
                case "accuracy":
                   starsWon = trackAccuracy();
                    break;
                case "enemiesKilled":
                   starsWon = trackEnemiesKilled();
                    break;
                default:
                    break;
            }
            //Finalize mission
            currentMission.endMission();
            abortMission();
            //Clear screen, update the area and mission statuses
            Game.clearScreen();
            AreaManager.updateAreaStatus(starsWon);
            AreaManager.drawMap();
            //Draw the win screen
            MissionManager.winScreen(starsWon);
        },

        handleMissionLoss = function () {

            currentMission.endMission();
            abortMission();
            Game.clearScreen();
            AreaManager.drawMap();
            Game.errorMessage("Mission failed");
        },

        getPlayerHealth = function () {
            return playerPlane.currentHealth;
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
                console.log("accuracy: " + accuracyPercentage);
                if (isHit != undefined) {
                    if (isHit) {
                        totalShotsHit++;
                    }
                    totalShotsFired++;
                    accuracyPercentage = parseInt(totalShotsHit / totalShotsFired * 100);

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

                    return stars;
                }
            }
            trackAccuracy(isHit);
        },

        trackRemainingHealth = function (currentHealth) {
            var minimumHealthPercentageReached = 100, stars = 0;

            trackRemainingHealth = function (currentHealth) {
                if (currentHealth != undefined) {
                    currentHealthPercentage = parseInt(currentHealth / playerPlane.maxHealth * 100);
                    console.log("minHealth: " + minimumHealthPercentageReached);
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
                if (killCount != undefined) { //if the func is called without arguments, the amount of stars earned will be returned + the vars will reset
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
        };

    return {
        startNewMission: launchMission,
        spawnPlayer: spawnPlayer,
        spawnBullet: spawnBullet,
        spawnFighter: spawnFighter,
        movePlayerPlane: movePlayerPlane,
        iterateBullets: iterateBullets,
        iterateEnemyPlanes: iterateEnemyPlanes,
        shootPlayerPlane: shootPlayerPlane,
        playerPlaneShootToggle: playerPlaneShootToggle,
        getPlayerHealth: getPlayerHealth,
        handleMissionWin: handleMissionWin,
        handleMissionLoss: handleMissionLoss,
        togglePause: togglePause
    }
})();