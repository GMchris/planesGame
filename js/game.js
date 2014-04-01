'use strict'
var Game = {
	//Initialization
	init: function(){
		AreaManager.areas[0].active = true;
		MissionManager.generateMissions();
		AreaManager.drawMap();
		window.setInterval(function () {
		    Timer.increaseTimer();
		}, 1000);
		for(var i=0;i<6;i++){
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
	allSkills : ["spreadshot","homingshot","penetratingshot","sentry","stoptime","deathray"],
	unlockedSkills :[]

}

window.addEventListener("load", Game.init, false);  