'use strict'

function Mission(primary,secondary){
	this.primary = primary;
	this.secondary = secondary;
	this.complete = false;
	this.rank = -1;
}

var MissionManager = {
	//Contains primary and secondary mission types
    //
    primary : ["survival", "domination", "gauntlet"],
    //primary: ["boss"],
	secondary: ["remainingHealth", "accuracy"],
	currentAreaIndex: -1,
    currentMissionIndex: -1,
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
			var className = "missionMarker " + ((area==3)? "boss" : "Star"+stars+" a"+area+"m"+i);
			//Creates mission icons
			$("<div/>")
			.addClass(className)
			.attr('mission',i)
			.on('click',  function(){
				//Calls the missionPrompt function, with the clicked area and mission
				var thisMission = this.getAttribute("mission");
				if(AreaManager.areas[area].missions[thisMission].complete){
					Game.errorMessage("Cannot replay mission!");
				}
				else{
					MissionManager.missionPrompt(area,thisMission);
			    }


			}).appendTo("#gameScreen");
		}
	},

	//Creates a prompt containing information about 
	missionPrompt : function(areaIndex,missionIndex){
	    var primary = AreaManager.areas[areaIndex].missions[missionIndex].primary;
	    var secondary = AreaManager.areas[areaIndex].missions[missionIndex].secondary;
		var title,primaryDescription, secondaryDescription;

		switch(primary){
			case "survival":
				title = "Survival";
				primaryDescription = "<p>Survive in the battlefield for 45 seconds</p>";
				break;
			case "domination":
				title = "Domination";
				primaryDescription = "<p>Do not allow more than 7 enemies to appear simultaneously for 30 seconds</p>";
				break;
		    case "gauntlet":
		        title = "Gauntlet";
		        primaryDescription = "<p>Kill 70 enemies. Pressing E will spawn 3 enemy planes</p>";
		        break;
		    case "boss":
		        title = 'Boss Fight';
		        primaryDescription = '<p>Defeat the boss.</p>';
		        break;
		    default:
		        throw new Error('Uncrecognized primary mission type');
		}

		switch(secondary){
			case "remainingHealth":
				secondaryDescription = "<ul class='secDesc'><li>Remain above 25% health.</li><li>Remain above 50% health.</li><li>Remain above 75% health.</li></ul>";
				break;
			//case "enemiesKilled":
			//    secondaryDescription = "<ul class='secDesc'><li>Kill at least 45 enemies.</li><li>Kill at least 50 enemies.</li><li>Kill at least 60 enemies.</li></ul>";
			//	break;
			case "accuracy":
			    secondaryDescription = "<ul class='secDesc'><li>Keep your accuracy above 25%</li><li>Keep your accuracy above 35%</li><li>Keep your accuracy above 50%</li></ul>";
			    break;

			case "boss":
				secondaryDescription = "We've managed to intercept the aircraft initiating all these attacks. Take it down, and bring an end to this war.";
				break;
		    default:
		        break;
		}
		//Creates:
		//Black tint
		$("<div/>",{
			id:"GamePromptScreen",
		})
		.appendTo("#gameScreen");
		//Prompt box
		$("<div/>",{
			id:"GamePrompt"
		})
		.addClass("gameWindow")
		.appendTo("#GamePromptScreen");
		//Close button
		$("<div id='closePrompt'>X<div/>")
		.on("click",function(){
				document.getElementById("gameScreen").removeChild(document.getElementById("GamePromptScreen"));
		})
		.appendTo("#GamePrompt");
		//Title
		$("<div>"+title + "<div/>",{
		})
		.addClass("promptText promptTitle")
		.appendTo("#GamePrompt");
		//Main objective
		$("<div>"+ primaryDescription +"<div/>")
		.addClass("promptText")
		.appendTo("#GamePrompt");
		//Secondary objective
		$("<div>"+ secondaryDescription +"<div/>")
		.addClass("promptText")
		.appendTo("#GamePrompt");
		//Start button
		$("<div>Deploy<div/>")
		.addClass("deployButton")
		.on("click", function () {
			interactionManager.startNewMission(missionIndex, areaIndex);
		})
		.appendTo("#GamePrompt");

	},
	//Creates a window displaying results of victory
	winScreen : function(stars){
		var skillClass,skillDescription;
		//Creates:
		//Black tint
		$("<div/>",{
			id:"GamePromptScreen",
		})
		.appendTo("#gameScreen");
		//Prompt box
		$("<div/>",{
			id:"GamePrompt"
		})
		.addClass("gameWindow")
		.appendTo("#GamePromptScreen");
		//Close prompt
		$("<div id='closePrompt'>X<div/>")
		.on("click",function(){
				document.getElementById("gameScreen").removeChild(document.getElementById("GamePromptScreen"));
		})
		.appendTo("#GamePrompt");
		//Victory
		$("<div>Victory<div/>",{
		})
		.addClass("promptText promptTitle")
		.appendTo("#GamePrompt");
		//Stars
		for(var i=0;i<stars;i++){
			$("<span/>")
			.addClass("promptStar")
		.appendTo(".prompt title");
		}
		//Content box
		$("<div/>",{
			id:"ContentBox"
		})
		.appendTo("#GamePrompt");
		//Handles levelling up
		if(Game.playerStars>=Game.starsToLevelUp[Game.currentLevel-1]){
			Game.playerStars -= Game.starsToLevelUp[Game.currentLevel-1];
			Game.currentLevel++;
			$("#ContentBox").text("You earned enough stars to level up! Your plane has been upgraded and you unlocked the following skill:");

			$("<div/>")
			.addClass("promptText")
			.appendTo("#GamePrompt");

			switch(Game.addSkill()){

				case "spreadshot":
					skillClass = "spreadShotIcon";
					skillDescription = "Temporarily gain a three shot attack";
					break;

				case "penetratingshot":
					skillClass = "penetratingShotIcon";
					skillDescription = "Your bullets temporarily pierce targets";
					break;

				case "homingshot":
					skillClass = "homingShotIcon";
					skillDescription = "Your projectiles seek out enemies";
					break;

				case "sentry":
					skillClass = "sentryIcon";
					skillDescription = "Place a sentry which attacks enemies";
					break;
			}
			$("<div/>")
			.addClass("skillIcon "+skillClass)
			.appendTo(".promptText:odd");

			$("<div>"+skillDescription+"</div>")
			.addClass("skillDescription")
			.appendTo(".promptText:odd");
		}
		else{
			$("#ContentBox").text("You finished the mission and earned "+stars+" stars.Earn another "+ (Game.starsToLevelUp[Game.currentLevel-1]-Game.playerStars)+" to level up");
		}
	}

}