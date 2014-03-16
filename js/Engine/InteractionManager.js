var interactionManager = (function () {
    var playerPlane = new PlayerPlane(),
        playerBullets,
        playerBulletsSpeed,
        fighterMovementSpeed,
        lastShotPlayerBulletTimestamp,
        lastFighterSpawnTimestamp,
        enemyBullets,
        enemyPlanes,
        fighterSpawnFrequencyMs,
        currentMission,
        setInitialValues = function () {
            playerBullets = [];
            playerBulletsSpeed = 8;
            fighterMovementSpeed = 15;
            fighterSpawnFrequencyMs = 1200;
            lastFighterSpawnTimestamp = -1;
            enemyBullets = [];
            enemyPlanes = [];
            lastShotPlayerBulletTimestamp = -1;
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
            if (e.screenX > (window.innerWidth - 960) / 2 + 50) {
                //if mouse is inside the game screen
                if (e.screenX < (nonGameScreenWidth / 2 + 960) - 50) {
                    newLeft = e.screenX - (nonGameScreenWidth / 2);
                } else { //mouse is to the right of game screen
                    newLeft = 960 - 50;
                }
            } else { //mouse is to the left of game screen
                newLeft = 0 + 50;
            }
            //newBottom
            if (e.screenY <= 700) {
                newBottom = 700 - e.screenY;
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
        shootPlayerPlane: shootPlayerPlane,
        playerPlaneShootToggle: playerPlaneShootToggle
    }
})();