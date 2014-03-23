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
	starsToLevelUp : [2,3,4,5,5,5,5],
	currentLevel: 1

}

window.addEventListener("load", Game.init, false);  