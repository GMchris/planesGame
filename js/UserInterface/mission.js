'use strict'

function Mission(primary,secondary){
	this.primary = primary;
	this.secondary = secondary;
	this.complete = false;
	this.rank = 0;
}

var MissionManager = {
	//Contains primary and secondary mission types
	primary : ["survival","escort"],
	secondary : ["remainingHealth","enemiesKilled","accuracy"],
	//Generates an array of mission and returns it
	generateMissions : function(){
		var tempArray =[];
		for(var i=0;i<3;i++){
			var primIndex = Math.floor(Math.random() * (this.primary.length));
			var secIndex = Math.floor(Math.random() * (this.secondary.length));
			tempArray.push(new Mission(this.primary[primIndex],this.secondary[secIndex]));
		}
		return tempArray;
	},
	drawMissions : function(area){
		for(var i=0;i<AreaManager.areas[area].missions.length;i++){
			var stars = AreaManager.areas[area].missions[i].rank;
			var className = "missionMarker Star"+stars+" a"+area+"m"+i;
			//Creates mission icons
			$("<div/>")
			.addClass(className)
			.attr('mission',i)
			.on('click',  function(){
				//Calls the missionPrompt function, with the clicked area and mission
				var thisMission = this.getAttribute("mission");
				if(AreaManager.areas[area].missions[thisMission].rank===0){
					MissionManager.missionPrompt(area,thisMission);
				}
				else{
					Game.errorMessage("Cannot replay mission!");
			    }
			    

			}).appendTo("#gameScreen");
		}
	},

	//Creates a prompt containing information about 
	missionPrompt : function(area,mission){
		var primary = AreaManager.areas[area].missions[mission].primary;
		var secondary = AreaManager.areas[area].missions[mission].secondary;
		var title,primaryDescription, secondaryDescription;
       
		switch(primary){
			case "survival":
				title = "Survival";
				primaryDescription = "<p>Surive in the battlefield for two minutes</p>";
				break;
			case "escort":
				title = "Escort";
				primaryDescription = "<p>Escort the carrier airship. Don't let more than ten planes get past you.</p>";
				break;

		}

		switch(secondary){
			case "remainingHealth":
				secondaryDescription = "<ul class='secDesc'><li>Remain above 25% health.</li><li>Remain above 50% health.</li><li>Remain above 75% health.</li></ul>";
				break;
			case "enemiesKilled":
				secondaryDescription = "<ul class='secDesc'><li>Kill 15 enemies.</li><li>Kill 25 enemies.</li><li>Kill 35 enemies.</li></ul>";
				break;
			case "accuracy":
				secondaryDescription ="<ul class='secDesc'><li>Have 30% of your shots hit enemies</li><li>Have 50% of your shots hit enemies</li><li>Have 70% of your shots hit enemies</li></ul>"
		}
		//Creates:
		//Black tint
		$("<div/>",{
			id:"missionPromptScreen",
		})
		.appendTo("#gameScreen");
		//Prompt box
		$("<div/>",{
			id:"missionPrompt"
		})
		.appendTo("#missionPromptScreen");
		//Close button
		$("<div id='closePrompt'>X<div/>")
		.on("click",function(){
				document.getElementById("gameScreen").removeChild(document.getElementById("missionPromptScreen"));
		})
		.appendTo("#missionPrompt");
		//Title
		$("<div>"+title + "<div/>",{
		})
		.addClass("promptText promptTitle")
		.appendTo("#missionPrompt");
		//Main objective
		$("<div>"+ primaryDescription +"<div/>")
		.addClass("promptText")
		.appendTo("#missionPrompt");
		//Secondary objective
		$("<div>"+ secondaryDescription +"<div/>")
		.addClass("promptText")
		.appendTo("#missionPrompt");
		//Start button
		$("<div>Deploy<div/>")
		.addClass("deployButton")
		.on("click",function(){
			interactionManager.startNewMission();
		})
		.appendTo("#missionPrompt");

	}

}