﻿//Utility methods go here

var Timer = {
    //Counts how many seconds have passed since the start of the game
    current: 0,
    increaseTimer: function () {
        this.current++;
    }
}

function getRandomLeftCoord(offsetWidth) {
    //returns a random number between (0 + offsetWidth) and (960 - offsetWidth)
    var randLeftNum = parseInt(Math.random() * (960 - 2 * offsetWidth)); //randLeftNum belongs to [offsetWidth, 960 - offsetWidth]
    return randLeftNum;
}

function getRandomBottomCoordTopHalf(offsetHeight) {
    //returns a bottom coord in the top half of the screen
    var randBottNum = parseInt(Math.random() * (350 - offsetHeight) + 350);
    return randBottNum;
}

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

var Visual = {

    backgroundOffset : 0,

    //Makes the cursor invisible while game is active
    adjustCSSofGameScreen:function(isStartMission){
        if(isStartMission){
            $("#gameScreen").css({
                "cursor":"none",
                "background-image":"url(../planesGame/images/backgrounds/Avanseot.jpg)"
            });
        }
        else{
           $("#gameScreen").css({
               "cursor": "default",
               "background-image": "none"
            });
        }
    },

    //Moves the background
    iterateBackground: function(){
        this.backgroundOffset++;
        document.getElementById("gameScreen").style.backgroundPositionY = this.backgroundOffset +"px";
    },

    drawUI: function(){
        $("<div/>")
        .addClass("ui")
        .appendTo("#gameScreen");

        $("<div/>",{
            id : "hpBar"
        })
        .appendTo(".ui");
        for(var i=0;i<4;i++){
            $("<div/>",{
                id : "skill"+i
            })
            .addClass("skills")
            .appendTo(".ui");
        }
    }
}