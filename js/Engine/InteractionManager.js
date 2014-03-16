var interactionManager = (function () {
    var playerPlane = new PlayerPlane(),
        playerBullets,
        playerBulletsSpeed,
        fighterMovementSpeed,
        lastShotPlayerBulletTimestamp,
        lastFighterSpawnTimestamp,
        lastFighterDirectionChangeTimestamp,
        enemyBullets,
        enemyPlanes,
        fighterSpawnFrequencyMs,
        fighterDirectionChangeFrequencyMs,
        currentMission,
        setInitialValues = function () {
            playerBullets = [];
            playerBulletsSpeed = 8;
            fighterMovementSpeed = 5;
            fighterSpawnFrequencyMs = 1200;
            fighterDirectionChangeFrequencyMs = 1000;
            enemyBullets = [];
            enemyPlanes = [];
            lastShotPlayerBulletTimestamp = -1;
            lastFighterSpawnTimestamp = -1;
            lastFighterDirectionChangeTimestamp = -1;
            currentMission = null;
        },

        spawnPlayer = function () {
            playerPlane.addToScreen();
        },

        spawnPlayerBullet = function (left, bottom) {
            var newBullet = new PlayerBullet(left, bottom);
            playerBullets.push(newBullet);
            newBullet.addToScreen();
        },
        spawnFighter = function () {
            var nowMs = Date.now();
            if (nowMs - lastFighterSpawnTimestamp > fighterSpawnFrequencyMs) {
                lastFighterSpawnTimestamp = nowMs;

                var newFighter = new EnemyFighter(getRandomLeftCoord(45), getRandomBottomCoordTopHalf(35), fighterMovementSpeed);
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

        movePlayerBullets = function () {
            var i;
            for (i = 0; i < playerBullets.length; i++) {
                if (playerBullets[i].bottomCoord > 700) {
                    $(playerBullets[i].div).remove();
                    playerBullets.splice(i, 1);
                    i++;
                } else {
                    playerBullets[i].updateCoords(playerBullets[i].leftCoord, playerBullets[i].bottomCoord + playerBulletsSpeed);
                    playerBullets[i].move();
                }
            }
        },

        moveEnemyPlanes = function () {
            var i;
            for (i = 0; i < enemyPlanes.length; i++) {
                if (enemyPlanes[i] instanceof EnemyFighter) {
                    moveEnemyFighter(enemyPlanes[i]);
                }
            }
        },

        moveEnemyFighter = function (fighter) {
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

        launchMission = function (missionInfo) {
            Game.clearScreen();
            setInitialValues();
            currentMission = new SurvivalMission();
            currentMission.startMission();
        };

    return {
        startNewMission: launchMission,
        spawnPlayer: spawnPlayer,
        spawnPlayerBullet: spawnPlayerBullet,
        spawnFighter: spawnFighter,
        movePlayerPlane: movePlayerPlane,
        movePlayerBullets: movePlayerBullets,
        moveEnemyPlanes: moveEnemyPlanes,
        shootPlayerPlane: shootPlayerPlane,
        playerPlaneShootToggle: playerPlaneShootToggle
    }
})();