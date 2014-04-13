var Visual = {

    drawIntroScreen:function(){

        $("<div id='introScreen'></div>")
        .css("background-image","url(images/map/IntroScreen.png)")
        .appendTo("#gameScreen");

        $("<div>Play</div>")
        .addClass("introButton")
        .appendTo("#introScreen")
        .on("click",function(){
            Game.init();
        });

        $("<div>Instructions</div>")
        .addClass("introButton")
        .appendTo("#introScreen");
    },
    backgroundOffset: 0,

    //Makes the cursor invisible while game is active
    adjustCSSofGameScreen: function (isStartMission) {
        var backgrounds = ["river","snow","desert","ocean"];

        if (isStartMission) {
            this.backgroundOffset = 0;
            $("#gameScreen").css({
                "cursor": "none",
                "background-image": "url(images/backgrounds/"+backgrounds[MissionManager.currentAreaIndex]+".jpg)"
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
        } else if (mission instanceof BossMission) {
            return 'Defeat the boss.';
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
    },

    //Creates the black hole animation
    drawBlackHole : function(left,bottom){
        $("<div/>")
        .addClass("blackHole")
        .css({
            "left":left-200,
            "bottom":bottom-200
        })
        .appendTo("#gameScreen");

        setTimeout(function(){$('.blackHole').remove()},500);
    }
    
};