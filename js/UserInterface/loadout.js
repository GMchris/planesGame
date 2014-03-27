var Loadout = {
	current :[],

	drawCurrentSkills : function(){
		for(var i=0;i<this.current.length;i++){
			
		}
	},

	drawUnlockedSkills : function(){
		var skillClass;
		for(var i=0;i<Game.unlockedSkills.length;i++){
			switch(Game.unlockedSkills[i]){

				case "spreadshot":
					skillClass = "spreadShotIcon";
					break;

				case "penetratingshot":
					skillClass = "penetratingShotIcon";
					break;

				case "homingshot":
					skillClass = "homingShotIcon";
					break;

				case "sentry":
					skillClass = "sentryIcon";
					break;
			}
		$("<div/>")
		.addClass("skillIcon "+skillClass)
		.attr("skillIndex",i)
		.on("click",function(){
			Loadout.current.push(Game.unlockedSkills[$(this).attr("skillIndex")]);
		})
		.appendTo(".skillBox");
		}
	},

	drawLoadoutScreen : function(){
		//Draws transparent black layer
		$("<div/>",{
			id: "GamePromptScreen"
		})
		.appendTo("#gameScreen");
		//Draws loadout screen
		$("<div/>")
		.addClass("loadoutScreen gameWindow")
		.appendTo("#GamePromptScreen");
		//Close button
		$("<div id='closePrompt'>X<div/>")
		.on("click",function(){
				document.getElementById("gameScreen").removeChild(document.getElementById("GamePromptScreen"));
		})
		.appendTo(".loadoutScreen");
		//Title
		$("<div>Loadout</div>")
		.addClass("promptText promptTitle")
		.appendTo(".loadoutScreen");
		//Skill bounding box
		$("<div/>")
		.addClass("gameWindow skillBox")
		.appendTo(".loadoutScreen");
		//Unlocked skill icons
		this.drawUnlockedSkills();
		//Current skills bar
		$("<div/>")
		.addClass("gameWindow currentSkillBox")
		.appendTo(".loadoutScreen");

		this.drawCurrentSkills();
	}


}