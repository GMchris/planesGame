'use strict'
var Game = {

	//Initialization
	init: function(){
		AreaManager.areas[0].missions[0].rank = 2;
		AreaManager.areas[0].active = true;
		AreaManager.areas[1].active = true;
		AreaManager.areas[2].active = true;
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
}

window.addEventListener("load",Game.init,false);