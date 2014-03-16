var interactionManager = (function () {
    var playerPlane = new PlayerPlane(),
        bullets,
        playerBulletsSpeed,
        enemyBulletsSpeed,
        fighterMovementSpeed,
        lastShotPlayerBulletTimestamp,
        lastFighterSpawnTimestamp,
        enemyPlanes,
        fighterSpawnFrequencyMs,
        fighterShootFrequencyMs,
        fighterDirectionChangeFrequencyMs,
        currentMission,
        setInitialValues = function () {
            bullets = [];
            playerBulletsSpeed = 8;
            enemyBulletsSpeed = 5;
            fighterMovementSpeed = 4;
            fighterSpawnFrequencyMs = 1200;
            fighterDirectionChangeFrequencyMs = 1000;
            fighterShootFrequencyMs = 1500;
            enemyPlanes = [];
            lastShotPlayerBulletTimestamp = -1;
            lastFighterSpawnTimestamp = -1;
            currentMission = null;
        },

        spawnPlayer = function () {
            playerPlane.addToScreen();
        },

        spawnBullet = function (type, left, bottom) {
            var newBullet;
            switch (type) {
                case "player":
                    newBullet = new PlayerBullet(left, bottom);
                    break;
                case "enemy":
                    newBullet = new EnemyBullet(left, bottom);
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

        moveBullets = function () {
            var i;
            for (i = 0; i < bullets.length; i++) {
                //if out of screen, remove the bullet
                if (bullets[i].bottomCoord < 0 || bullets[i].bottomCoord > 700) {
                    $(bullets[i].div).remove();
                    bullets.splice(i, 1);
                    i++;
                } else {
                    if (bullets[i] instanceof PlayerBullet) {
                        movePlayerBullet(bullets[i]);
                    } else if (bullets[i] instanceof EnemyBullet) {
                        moveEnemyBullet(bullets[i]);
                    }
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

        launchMission = function (missionInfo) {
            Game.clearScreen();
            setInitialValues();
            currentMission = new SurvivalMission();
            currentMission.startMission();
        };

    return {
        startNewMission: launchMission,
        spawnPlayer: spawnPlayer,
        spawnBullet: spawnBullet,
        spawnFighter: spawnFighter,
        movePlayerPlane: movePlayerPlane,
        moveBullets: moveBullets,
        moveEnemyPlanes: moveEnemyPlanes,
        shootPlayerPlane: shootPlayerPlane,
        shootEnemyPlanes: shootEnemyPlanes,
        playerPlaneShootToggle: playerPlaneShootToggle
    }
})();