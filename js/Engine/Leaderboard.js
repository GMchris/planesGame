var Leaderboard = {
    currentPosition: null,
    submitScore: function (name, score) {
        var self = this;
        $.ajax({
            url: "http://bashibozuk.eu/games-score/?route=high-score/save-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&score=" + score + "&player=" + encodeURIComponent(name),
            dataType: "jsonp",
            data: {
                format: "json"
            },

            success: function (response) {
                self.getPosition(score);
            }
        });
    },
    getHighScoreAndDrawLeaderboard: function () {
        var self = this;
        $.ajax({
            url: "http://bashibozuk.eu/games-score/?route=high-score/get-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&limit=15",
            dataType: "jsonp",
            data: {
                format: "json"
            },

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
            dataType: "jsonp",
            data: {
                format: "json"
            },

            success: function (response) {
                console.log(response.data.position);
                self.currentPosition = response.data.position;
                self.getHighScoreAndDrawLeaderboard(); //also draws the leaderboard
            }
        });
        return position;
    }
};