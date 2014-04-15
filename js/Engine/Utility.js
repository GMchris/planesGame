//Utility methods go here

function getRandomLeftCoord(offsetWidth) {
    //returns a random number between (0 + offsetWidth) and (960 - offsetWidth)
    var randLeftNum = parseInt(Math.random() * (960 - 2 * offsetWidth)); //randLeftNum belongs to [offsetWidth, 960 - offsetWidth]
    return randLeftNum;
};

function getRandomBottomCoordTopHalf(offsetHeight) {
    //returns a bottom coord in the top half of the screen
    var randBottNum = parseInt(Math.random() * (350 - offsetHeight) + 350);
    return randBottNum;
};

function getRandomBottomCoordBottomHalf(offsetHeight) {
    //returns a bottom coord in the bottom half of the screen
    var randBottNum = parseInt(Math.random() * (280 - offsetHeight) + 70);
    return randBottNum;
};

function getChaseAngle(chaserLeft, chaserBottom, targetLeft, targetBottom) {
    //always returns a positive number
    var angle;
    if (chaserBottom == targetBottom) {
        angle = 90;
    } else {
        angle = parseInt(Math.atan(
            Math.abs(chaserLeft - targetLeft) / Math.abs(chaserBottom - targetBottom))
            / (Math.PI / 180));
    }

    return angle;
};

var fps = {
    startTime: 0,
    frameNumber: 0,
    getFPS: function () {
        this.frameNumber++;
        var d = new Date().getTime(),
			currentTime = (d - this.startTime) / 1000,
			result = Math.floor((this.frameNumber / currentTime));

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;
    }
};

function spreadShotEnemyShoot() {
    interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, -15, this);
    interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 0, this);
    interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 15, this);
};

function degreeToRadian(deg) {
    return deg * Math.PI / 180;
}