'use strict'
var Game = {
    allSkills : ["spreadshot","homingshot","penetratingshot","sentry","stoptime","deathray", "blackhole", "stealth", "radioactive", "healingshot", 'guidedrocket', 'shield', 'absorbbullets'],
    unlockedSkills :[],
	//Initialization
    init: function () {
        interactionManager.startTimer();
		this.clearScreen();
		AreaManager.areas[0].active = true;
		MissionManager.generateMissions();
		AreaManager.drawMap();
		Visual.drawGameObjects();
		//for(var i=0;i<13;i++){
		//	Game.addSkill();
		//}
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

	//Star data
	playerStars : 0,
	starsToLevelUp : [1,2,3,3,3,3,3,3,3,3], //can unlock a total of 10 skills
	currentLevel: 1,

	//Skills
	addSkill : function(){
		var index = Math.floor(Math.random() * (this.allSkills.length));
		if(this.allSkills[index]==undefined){
			return;
		}
		this.unlockedSkills.push(this.allSkills.splice(index,1)[0]);
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
	}
	
}

var Test = {
		Score:function(nickname,score){
			this.nickname = nickname;
			this.score = score;
		},
		testScores: [],
		generateScores: function(){
			for(var i=0;i<15;i++){
				this.testScores.push(new this.Score("wow"+i,i*100));
			}
			Visual.drawLeaderBoard(this.testScores,100)
		},
	}

window.addEventListener("load", function () {
    Visual.drawIntroScreen();
    if (!requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    }
});