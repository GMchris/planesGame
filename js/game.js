'use strict'
var Game = {
	//Initialization
    init: function () {
        interactionManager.startTimer();
		this.clearScreen();
		AreaManager.areas[0].active = true;
		MissionManager.generateMissions();
		AreaManager.drawMap();
		for(var i=0;i<9;i++){
			Game.addSkill();
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

	//Star data
	playerStars : 0,
	starsToLevelUp : [2,3,4,5,5,5],
	currentLevel: 1,

	//Skills
	addSkill : function(){
		var index = Math.floor(Math.random() * (this.allSkills.length));
		if(this.allSkills[index]==undefined){
			console.log("nada");
			return;
		}
		this.unlockedSkills.push(this.allSkills.splice(index,1)[0]);
		return this.unlockedSkills[this.unlockedSkills.length-1];
	},
	allSkills : ["spreadshot","homingshot","penetratingshot","sentry","stoptime","deathray", "blackhole", "stealth", "radioactive"],
	unlockedSkills :[],
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

window.addEventListener("load", Visual.drawIntroScreen, false);  