'use strict'
var ctx;
var Game = {
    unlockableSkills : ["spreadshot","homingshot","penetratingshot","sentry","stoptime","deathray", "blackhole", "stealth", "radioactive", "healingshot", 'guidedrocket', 'shield', 'absorbbullets'],
    unlockedSkills: [],
    highScoreArr: [],
	//Initialization
    init: function () {
        InteractionManager.startTimer();
        Game.addSkill();
		this.clearScreen();
		AreaManager.areas[0].active = true;
		AreaManager.drawMap();
		Visual.drawGameObjects();
		if (!this.allUnlocked) {
		    Visual.updateStarsTracker();
		}
    },

    load: function () {
        this.clearScreen();
        AreaManager.drawMap();
        Visual.drawGameObjects();
        if (!this.allUnlocked) {
            Visual.updateStarsTracker();
        }
    },

	//Remove all contents of the main game window
	clearScreen : function(){
	    $("#gameScreen").html("");
	},

	//Creates an error message with given content
	errorMessage : function(content){
		$("<div>"+content+"</div>")
		.addClass("errorMessage")
		.appendTo("#gameScreen")
		.fadeOut(2000,"linear",function(){
		$(this).remove();
	})
	},

	//Skills
	addSkill : function(){
		var index = Math.floor(Math.random() * (this.unlockableSkills.length));
		if(this.unlockableSkills[index]==undefined){
			return;
		}
		this.unlockedSkills.push(this.unlockableSkills.splice(index,1)[0]);
		return this.unlockedSkills[this.unlockedSkills.length-1];
	},

	unlockEverything: function () {
	    var i;
	    for (i = 0; i < 13; i++) {
	        Game.addSkill();
	    }
	    AreaManager.areas[1].active = true;
	    AreaManager.areas[2].active = true;
	    AreaManager.areas[3].active = true;
	    this.allUnlocked = true;
	},

    allUnlocked: false
	
}

var imgPaths = ['images/planes/player.png', 'images/planes/fighter.png', 'images/planes/kamikaze.png', 'images/planes/supplier.png', 'images/planes/stormer.png', 'images/planes/boss.png', 'images/planes/playerAbsorbingBullets.png', 'images/planes/sentry.png', 'images/sprites/stormCloudFrames.png', 'images/planes/fighter_spreadshot.png', 'images/backgrounds/desert.jpg', 'images/backgrounds/ocean.jpg', 'images/backgrounds/river.jpg', 'images/backgrounds/snow.jpg',
    'images/map/AreaOneColored.png', 'images/map/AreaOneGreyscale.png', 'images/map/AreaTwoColored.png', 'images/map/AreaTwoGreyscale.png', 'images/map/AreaThreeColored.png', 'images/map/AreaThreeGreyscale.png', 'images/map/endScreen.png', 'images/map/IntroScreen.png', 'images/map/MissionMarkerBoss.png', 'images/map/MissionMarkerEmpty.png', 'images/map/MissionMarkerOne.png', 'images/map/MissionMarkerTwo.png', 'images/map/MissionMarkerThree.png',
    'images/map/MissionMarkerUnplayed.png', 'images/map/promptStar.png', 'images/map/star.png', 'images/map/starMini.png', 'images/map/WorldMapMinified.png', 'images/skills/guidedRocket.png', 'images/sprites/HealthOrbFrames.png', 'images/UI/UI.png', 'images/UI/pointerCursor.png', 'images/UI/hoverCursor.png', 'images/UI/absorbBulletsIcon.png', 'images/UI/absorbBulletsIconCD.png', 'images/UI/blackHoleIcon.png', 'images/UI/blackHoleIconCD.png', 'images/UI/deathRayIcon.png',
    'images/UI/deathRayIconCD.png', 'images/UI/guidedRocketIcon.png', 'images/UI/guidedRocketIconCD.png', 'images/UI/healingShotIcon.png', 'images/UI/healingShotIconCD.png', 'images/UI/homingShotIcon.png', 'images/UI/homingShotIconCD.png', 'images/UI/penetratingShotIcon.png', 'images/UI/penetratingShotIconCD.png', 'images/UI/radioactiveIcon.png', 'images/UI/radioactiveIconCD.png', 'images/UI/sentryIcon.png', 'images/UI/sentryIconCD.png', 'images/UI/shieldIcon.png',
    'images/UI/shieldIconCD.png', 'images/UI/spreadShotIcon.png', 'images/UI/spreadShotIconCD.png', 'images/UI/stealthIcon.png', 'images/UI/stealthIconCD.png', 'images/UI/stopTimeIcon.png', 'images/UI/stopTimeIconCD.png'
];

window.addEventListener("load", function () {
    var i;
    Visual.drawLoadingScreen();
    for (i = 0; i < imgPaths.length; i++) {
        PreloadManager.addToQueue(imgPaths[i]);
    }
    PreloadManager.preloadAll(function () {
        $('<div id="effectScreen"> </div>').appendTo("#gameScreen");
        window.setTimeout(function () {
            $('#effectScreen').remove();
            Visual.drawIntroScreen();
        }, 1500);
    });
    
    if (!requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    }
});

