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

var ips = {
    startTime: 0,
    iterationNumber: 0,
    getIPS: function () {
        this.iterationNumber++;
        var d = new Date().getTime(),
			currentTime = (d - this.startTime) / 1000,
			result = Math.floor((this.iterationNumber / currentTime));

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.iterationNumber = 0;
        }
        return result;
    }
};

function spreadShotEnemyShoot() {
    if (this.tryShoot()) {
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, -15, this);
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 0, this);
        interactionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 15, this);
    }
};

function degreeToRadian(deg) {
    return deg * Math.PI / 180;
};

var Leaderboard = {
    currentPosition: null,
    submitScore: function (name, score) {
        var self = this;
        $.ajax({
            url: "http://bashibozuk.eu/games-score/?route=high-score/save-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&score=" + score + "&player=" + encodeURIComponent(name),

            // the name of the callback parameter, as specified by the YQL service
            jsonp: "callback",

            // tell jQuery we're expecting JSONP
            dataType: "jsonp",

            // tell YQL what we want and that we want JSON
            data: {
                q: "select title,abstract,url from search.news where query=\"cat\"",
                format: "json"
            },

            // work with the response
            success: function (response) {
                self.getPosition(score);
            }
        });
    },
    getHighScoreAndDrawLeaderboard: function () {
        var self = this;
        $.ajax({
            url: "http://bashibozuk.eu/games-score/?route=high-score/get-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&limit=15",

            // the name of the callback parameter, as specified by the YQL service
            jsonp: "callback",

            // tell jQuery we're expecting JSONP
            dataType: "jsonp",

            // tell YQL what we want and that we want JSON
            data: {
                q: "select title,abstract,url from search.news where query=\"cat\"",
                format: "json"
            },

            // work with the response
            success: function (response) {
                Visual.drawLeaderBoard(response.data, self.currentPosition);
            }
        });
    },
    getPosition: function (score) {
        var position = -1,
            self = this;
        $.ajax({
            url: "http://bashibozuk.eu/games-score/?route=high-score/is-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&score=" + score,

            // the name of the callback parameter, as specified by the YQL service
            jsonp: "callback",

            // tell jQuery we're expecting JSONP
            dataType: "jsonp",

            // tell YQL what we want and that we want JSON
            data: {
                q: "select title,abstract,url from search.news where query=\"cat\"",
                format: "json"
            },

            // work with the response
            success: function (response) {
                console.log(response.data.position);
                self.currentPosition = response.data.position;
                self.getHighScoreAndDrawLeaderboard(); //also draws the leaderboard
            }
        });
        return position;
    }
}

function getHighScore() {
    $.ajax({
        url: "http://bashibozuk.eu/games-score/?route=high-score/get-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&limit=15",

        // the name of the callback parameter, as specified by the YQL service
        jsonp: "callback",

        // tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // tell YQL what we want and that we want JSON
        data: {
            q: "select title,abstract,url from search.news where query=\"cat\"",
            format: "json"
        },

        // work with the response
        success: function (response) {
            Visual.drawLeaderBoard(response.data, false);
        }
    });
}

function getPosition(score) {
    var position = -1;
    $.ajax({
        url: "http://bashibozuk.eu/games-score/?route=high-score/is-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&score=" + score,

        // the name of the callback parameter, as specified by the YQL service
        jsonp: "callback",

        // tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // tell YQL what we want and that we want JSON
        data: {
            q: "select title,abstract,url from search.news where query=\"cat\"",
            format: "json"
        },

        // work with the response
        success: function (response) {
            position = response.data.position;
        }
    });
    return position;
}

function saveHighScore(name, score) {
    $.ajax({
        url: "http://bashibozuk.eu/games-score/?route=high-score/save-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&score=" + score + "&player=" + encodeURIComponent(name),

        // the name of the callback parameter, as specified by the YQL service
        jsonp: "callback",

        // tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // tell YQL what we want and that we want JSON
        data: {
            q: "select title,abstract,url from search.news where query=\"cat\"",
            format: "json"
        },

        // work with the response
        success: function (response) {
            console.log(response.data);
        }
    });
}

