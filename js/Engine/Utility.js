//Utility methods go here

var Timer = {
    //Counts how many seconds have passed since the start of the game
    current: 0,
    increaseTimer: function () {
        this.current++;
    }
};

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

var Visual = {

    backgroundOffset: 0,

    //Makes the cursor invisible while game is active
    adjustCSSofGameScreen: function (isStartMission) {
        if (isStartMission) {
            this.backgroundOffset = 0;
            $("#gameScreen").css({
                "cursor": "none",
                "background-image": "url(../planesGame/images/backgrounds/river.jpg)"
            });
        }
        else {
            $("#gameScreen").css({
                "cursor": "default",
                "background-image": "none"
            });
        }
    },

    //Moves the background
    iterateBackground: function () {
        this.backgroundOffset++;
        document.getElementById("gameScreen").style.backgroundPositionY = this.backgroundOffset + "px";
    },

    //Draws the user interface during missions
    drawUI: function () {
        
        
        $("<div/>")
        .addClass("ui")
        .appendTo("#gameScreen");

        $("<div/>", {
            id: "hpBar"
        })
        .appendTo(".ui");
        var skillArray = interactionManager.getPlayerSkills();
        for (var i = 0; i < 4; i++) {
            $("<div/>", {
                id: "skill" + i
            })
            .addClass("skills")
            .appendTo(".ui");
            //Places correct icons
            if (skillArray[i] == undefined) { }
            else {
                switch (skillArray[i].name) {
                    //Spread shot icon
                    case "Spread Shot":
                        $("#skill" + i).addClass("spreadShotIcon");
                        break;
                        //Piercing shot icon
                    case "Piercing Shot":
                        $("#skill" + i).addClass("penetratingShotIcon");
                        break;
                        //Homing shot icon
                    case "Homing Shot":
                        $("#skill" + i).addClass("homingShotIcon");
                        break;
                        //Sentry plane icon
                    case "Sentry":
                        $("#skill"+ i).addClass("sentryIcon");
                        break;
                        //Death ray icon
                    case "Death Ray":
                        $("#skill"+ i).addClass("deathRayIcon");
                        break;
                        //Stop time icon
                     case "Stop Time":
                        $("#skill"+ i).addClass("stopTimeIcon");
                        break;
                    case "Black Hole":
                        $("#skill" + i).addClass("blackHoleIcon");
                        break;

                    default:
                        throw new Error('Unrecognized skill name');
                }
            }
        }
    },

    //Make a skill's icon grey
    cooldownIcon : function(icon){
        $("."+icon).css("background-image","url(images/UI/"+icon+"CD.png)");
    },

    activateIcon : function(icon){
         $("."+icon).css("background-image","url(images/UI/"+icon+".png)");
    }
    
};