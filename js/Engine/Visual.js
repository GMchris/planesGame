var Visual = {
    backgroundImg: null,
    backgroundPattern: null,

    drawIntroScreen: function () {

        $("<div id='introScreen'></div>")
        .css("background-image", "url(images/map/IntroScreen.png)")
        .appendTo("#gameScreen");

        $("<div>Play</div>")
        .addClass("introButton")
        .appendTo("#introScreen")
        .on("click", function () {
            Game.init();
        });
        
        $("<div>Leaderboard</div>")
       .addClass("introButton")
       .appendTo("#introScreen")
       .on("click", function () {
           Test.generateScores();
       });

        $("<div>Unlock Everything</div>")
        .addClass("introButton")
        .appendTo("#introScreen")
        .on("click", function () {
            Game.unlockEverything();
        });
    },

    //Draws the screen at the end of the game
    drawVictoryScreen:function(){
        $("<div/>")
        .addClass("victoryScreen gameWindow")
        .appendTo("#gameScreen");

        $("<div/>")
        .addClass("endGameArt")
        .appendTo(".victoryScreen");

        $("<div/>")
        .addClass("scoreSubmissionBox")
        .appendTo(".endGameArt");

        $("<input/>")
        .addClass("nameInput")
        .appendTo(".scoreSubmissionBox")

        //Used to submit the score. If the name entered doesnt exist or is over 15 characters, it won't post them.
        $("<div>Submit</div>")
        .addClass("submitButton")
        .appendTo(".scoreSubmissionBox")
        .on("click",function(){
            if($(".nameInput").val().length>15 ||$(".nameInput").val().length<1){ 
                Game.errorMessage("Enter a name under fifteen characters");
                return;
            }
            Leaderboard.submitScore($(".nameInput").val(), interactionManager.getVictoryTime());
            $(".victoryScreen").remove();
        });
    },

    backgroundOffset: 0,

    //Makes the cursor invisible while game is active
    adjustCSSofGameScreen: function (isStartMission) {
        var backgrounds = ["river", "snow", "desert", "ocean"];

        if (isStartMission) {
            this.backgroundOffset = 0;
            //$("#gameScreen").css({
            //    "cursor": "none",
            //    "background-image": "url(images/backgrounds/" + backgrounds[MissionManager.currentAreaIndex] + ".jpg)"
            //});
            this.backgroundImg = document.createElement('img');
            this.backgroundImg.src = 'images/backgrounds/' + backgrounds[MissionManager.currentAreaIndex] + ".jpg";
            //this.backgroundPattern = ctx.createPattern(this.backgroundImg, 'repeat-y');
        }
        else {
            $("#gameScreen").css({
                "cursor": "inherit",
                "background-image": "none"
            });
        }
    },

    //Moves the background
    iterateBackground: function () {
        var self = this;
        this.backgroundOffset++;
        if (this.backgroundOffset >= 1400) {
            ctx.drawImage(self.backgroundImg, 0, 700 - (this.backgroundOffset - 1400));
        }
        if (this.backgroundOffset >= 2100) {
            this.backgroundOffset = 0;
        }
        ctx.drawImage(self.backgroundImg, 0, -this.backgroundOffset);
        
        //$('#gameScreen').css('backgroundPosition', 'right 0px top ' + this.backgroundOffset + 'px');
    },


    crossOutSecondaries: function (stat) {
        var conditions;
        function greaterThan(a, b) {
            return a > b;
        };
        function lessThanOrEqual(a, b) {
            return a <= b;
        };
        function comparer() { };
        switch (interactionManager.getSecondaryMission()) {
            case "accuracy":
                conditions = [25, 35, 50];
                comparer = greaterThan;
                break;
            case "remainingHealth":
                conditions = [25, 50, 75];
                comparer = greaterThan;
                break;
            case 'usedSkills':
                conditions = [9, 7, 5];
                comparer = lessThanOrEqual;
                break;
            default:
                break;
        }
        for (var i = 0; i < conditions.length; i++) {
            if (comparer(conditions[i], stat)) {
                $("#listItem" + i).addClass("uncompletedSecondary");
            }
            else {
                $("#listItem" + i).removeClass("uncompletedSecondary");
            }
        }
    },

    setSecondaryDescriptions: function () {
        var conditions, i;
        switch (interactionManager.getSecondaryMission()) {
            case "accuracy":
                conditions = [25, 35, 50];
                for (i = 0; i < conditions.length; i++) {
                    $("#listItem" + i).text("Keep your accuracy above " + conditions[i] + "%");
                }
                break;

            case "remainingHealth":
                conditions = [25, 50, 75];
                for (i = 0; i < conditions.length; i++) {
                    $("#listItem" + i).text("Keep your health above " + conditions[i] + "%");
                }
                break;
            case 'usedSkills':
                conditions = [9, 7, 5];
                for (i = 0; i < conditions.length; i++) {
                    $("#listItem" + i).text("Use your skills less than " + conditions[i] + "times");
                }
                break;

        }
    },

    //Draws the user interface during missions
    drawUI: function (mission) {

        $("<ul/>")
        .addClass("missionList")
        .appendTo("#gameScreen");

        if(!(mission instanceof BossMission)){
        for (var i = 0; i < 3; i++) {
            $("<li/>")
            .attr("id", "listItem" + i)
            .addClass("secondaryListItem").
            appendTo(".missionList");
        }

        this.setSecondaryDescriptions();
        }

        $("<div/>")
        .addClass("ui")
        .appendTo("#gameScreen");

         //Places the primary mission
        $("<div/>")
        .addClass("mainMissionName")
        .appendTo(".ui");

        $('<div id="fps"></div>')
        .appendTo('.ui');

        $('<div id="ips"></div>')
        .appendTo('.ui');

        //Draw timer
        $('<div id="timer">' + interactionManager.getTime() + '</div>')
        .addClass("inGame")
        .appendTo('.ui');

        //Draws the HP bar
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
            if (skillArray[i] == undefined) { return; }
            else {
                $("#skill" + i).addClass(skillArray[i].icon);
            }
        }

    },

    //Make a skill's icon grey
    cooldownIcon: function (icon) {
        $("." + icon).css("background-image", "url(images/UI/" + icon + "CD.png)");
    },

    activateIcon: function (icon) {
        $("." + icon).css("background-image", "url(images/UI/" + icon + ".png)");
    },

    animateDuration: function (icon, durationMs) {
        $('<div></div>')
            .css({
                'position': 'absolute',
                'bottom': 0,
                'left': 0,
                'width': 50,
                'height': 50,
                'background-color': 'green',
                'opacity': 0.5
            })
            .appendTo($('.' + icon))
            .animate({
                'height': 0
            }, {
                duration: durationMs,
                complete: function () {
                    $(this).remove();
                }
            });
    },

    animateCooldown: function (icon, cooldownMs) {
        $('<div></div>')
            .css({
                'position': 'absolute',
                'bottom': 0,
                'left': 0,
                'width': 50,
                'height': 0,
                'background-color': 'red',
                'opacity': 0.5
            })
            .appendTo($('.' + icon))
            .animate({
                'height': 50
            }, {
                duration: cooldownMs,
                complete: function () {
                    $(this).remove();
                }
            });
    },

    //Creates the black hole animation
    drawBlackHole: function (left, bottom) {
        $("<div/>")
        .addClass("blackHole")
        .css({
            "left": left - 200,
            "bottom": bottom - 200
        })
        .appendTo("#gameScreen");

        setTimeout(function () { $('.blackHole').remove() }, 500);
    },
    //Creates the leaderboard
    drawLeaderBoard: function (topArray, playerPosition) {
        var leaderboardWindow = $("<div/>").addClass("gameWindow leaderboardWindow"), topFifteen;
        $("<div/>", { "id": "GamePromptScreen" }).appendTo("#gameScreen")

        $("<table/>")
        .addClass("leaderboard")
        .appendTo(leaderboardWindow)

        leaderboardWindow.appendTo("#GamePromptScreen")

        for (var i = 0; i < 15; i++) {
            if (topArray[i]) {
                var tableRow = $("<tr/>");
                $("<td/>").addClass("positionCell").text(i+1).appendTo(tableRow);
                $("<td/>").addClass("nicknameCell").text(topArray[i].player).appendTo(tableRow);
                $("<td/>").addClass("scoreCell").text(topArray[i].score).appendTo(tableRow);
                tableRow.appendTo(".leaderboard")
            }
        }

        //If called with the arguement false instead of a numeric player position, it will just make a close button;
        if (playerPosition == false) {
            $("<div id='closePrompt'>X<div/>")
                 .on("click", function () {
                     $("#GamePromptScreen").remove();
                 })
                .appendTo(".leaderboardWindow");
            return;
        }

        topFifteen = (playerPosition < 14) ? "Congratulations! You are among the top fifteen players in the world!" : "You ranked at position " + playerPosition + ".</br> Think you can get in the top fifteen?";

        $("<div/>").html(topFifteen).addClass("leaderboardText").appendTo(".leaderboardWindow");

        $("<div>Replay</div>").addClass("replayButton").appendTo(".leaderboardWindow").on("click", function () { location.reload() });

    },

    drawGameObjects: function () {
        requestAnimationFrame(Visual.drawGameObjects);
        $('#fps').text(fps.getFPS());
        if (interactionManager.getCurrentMission()) {
            ctx.clearRect(0, 0, 960, 700);
            Visual.iterateBackground();
            interactionManager.redrawGameObjects();
        }
    },

    updateStarsTracker: function () {
        var starsToLevelUp = interactionManager.getStarsToLevelUp(),
            playerLevel = interactionManager.getPlayerLevel(),
            starHtml = '<img src="images/map/starMini.png" />',
            starsEarnedHtml =starHtml+ interactionManager.getPlayerStars() + ' earned',
            starsToNextLevelHtml =  starHtml + ((starsToLevelUp[playerLevel - 1]) ?
                starsToLevelUp[playerLevel - 1] : '-')
        + ' needed';
        $('<div></div>')
        .addClass("starTracker")
            .html(starsEarnedHtml + '<br/>' + starsToNextLevelHtml)
            .appendTo('#gameScreen')
    }
};