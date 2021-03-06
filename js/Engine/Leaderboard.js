﻿var Leaderboard = {
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
                self.convertResponse(response.data);
                Visual.drawLeaderBoard(response.data, self.currentPosition || false);
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
    },

    convertResponse: function (arr) { //converts the scores in the response array to time strings (mm:ss)
        var i;
        for (i = 0; i < arr.length; i++) {
            arr[i].score = Utility.convertToTime(3600 - arr[i].score);
        }
    }
}