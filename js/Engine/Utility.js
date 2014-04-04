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

    //Gives text for the primary mission Description
    returnPrimaryDescription: function(mission){
        if(mission instanceof SurvivalMission){
            return "Survive in the battlefield for 45 seconds"
        }
        else if(mission instanceof DominationMission){
            return "Don't let more than 7 enemies spawn for 30 seconds"
        }
        else if(mission instanceof GauntletMission){
            return "Kill 75 enemies. Press E to summon additional ones."
        }
        else{
            throw new Error("No such mission");
        }
    },


    crossOutSecondaries: function(stat){
        var conditions;
        switch(interactionManager.getSecondaryMission()){
            case "accuracy":
                conditions=[25,35,50];
                break;
            case "remainingHealth":
                conditions=[25,50,75];
                break;
            default:
                break;
        }
        for(var i=0;i<conditions.length;i++){
            if(conditions[i]>stat){
                $("#listItem"+i).addClass("uncompletedSecondary");
            }
            else{
                 $("#listItem"+i).removeClass("uncompletedSecondary");
                }
            }
    },

    setSecondaryDescriptions: function(){
        var conditions;
         switch(interactionManager.getSecondaryMission()){
            case "accuracy":
            conditions = [25,35,50];
            for(var i=0;i<conditions.length;i++){
                $("#listItem"+i).text("Keep your accuracy above "+conditions[i]+"%");
            }
            break;

            case "remainingHealth":
            conditions = [25,50,75];
            for(var i=0;i<conditions.length;i++){
                $("#listItem"+i).text("Keep your health above "+conditions[i]+"%");
            }
            break;
        }
    },

    //Draws the user interface during missions
    drawUI: function (mission) {

        $("<ul/>")
        .addClass("missionList")
        .appendTo("#gameScreen");

        for(var i=0;i<3;i++){
            $("<li/>")
            .attr("id","listItem"+i)
            .addClass("secondaryListItem").
            appendTo(".missionList");
        }

        this.setSecondaryDescriptions();

        
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
            if (skillArray[i] == undefined) { return;}
            else {
                $("#skill"+i).addClass(skillArray[i].icon);
            }
        }
        //Places the primary mission
          $("<span/>")
        .addClass("mainMissionName")
        .appendTo(".ui")
        .text(this.returnPrimaryDescription(mission));

    },

    //Make a skill's icon grey
    cooldownIcon : function(icon){
        $("."+icon).css("background-image","url(images/UI/"+icon+"CD.png)");
    },

    activateIcon : function(icon){
         $("."+icon).css("background-image","url(images/UI/"+icon+".png)");
    }
    
};