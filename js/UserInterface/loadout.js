var Loadout = {
	current :[],

	drawCurrentSkills : function(){
		$(".currentSkillBox").html("");

		for(var i=0;i<this.current.length;i++){
			var skillClass = this.giveClass(this.current[i]);
			$("<div/>")
			.addClass("skillIcon "+skillClass)
			.attr("currentSkillIndex",i)
			//Remove the clicked skill
			.on("click",function(){
				Game.unlockedSkills.push(Loadout.current.splice($(this).attr("currentSkillIndex"),1)[0]);
				Loadout.drawUnlockedSkills();
				Loadout.drawCurrentSkills();
			})
			.appendTo(".currentSkillBox");
		}
	},

	drawUnlockedSkills : function(){
		$(".skillBox").html("");

		
		for(var i=0;i<Game.unlockedSkills.length;i++){
			var skillClass = this.giveClass(Game.unlockedSkills[i]);
		$("<div/>")
		.addClass("skillIcon "+skillClass)
		.attr("skillIndex",i)
		//Add the clicked skill
		.on("click",function(){
			if(Loadout.current.length==4){
				Game.errorMessage("Maximum four skills");
				return;
			}
			Loadout.current.push(Game.unlockedSkills.splice($(this).attr("skillIndex"),1)[0]);
			Loadout.drawUnlockedSkills();
			Loadout.drawCurrentSkills();
		})
		.appendTo(".skillBox");
		}
		Loadout.attachIconDescriptionEvents();
	},

	giveClass : function(name){
		var skillClass;
		switch(name){

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

			case "deathray":
				skillClass = "deathRayIcon";
				break;

			case "stoptime":
				skillClass = "stopTimeIcon";
				break;

		    case "blackhole":
		        skillClass = "blackHoleIcon";
		        break;

		    case "stealth":
		        skillClass = "stealthIcon";
		        break;

		    case "radioactive":
		        skillClass = "radioactiveIcon";
		        break;

		    case "healingshot":
		        skillClass = "healingShotIcon";
		        break;

		    case "guidedrocket":
		        skillClass = "guidedRocketIcon";
		        break;

			case "shield":
		        skillClass = "shieldIcon";
		        break;

		    case "absorbbullets":
		        skillClass = "absorbBulletsIcon";
		        break;

			default:
				throw new Error("Unrecognized skill name");
		}
		return skillClass;
	},

	//Draw the currently selected skills, taken from the player plane
	savedSkills : function(){
		var skillArray=interactionManager.getPlayerSkills(), currentSkill;
			for(var i=0;i<skillArray.length;i++){
				currentSkill = skillArray[i].icon.toLowerCase();
				currentSkill = currentSkill.slice(0,-4)
				this.current.push(currentSkill);
				for(var j=0;j<Game.unlockedSkills.length;j++){
					if(currentSkill==Game.unlockedSkills[j]){
						Game.unlockedSkills.splice(j,1);
					}
				}
			}

	},

	drawLoadoutScreen : function(){
		this.savedSkills();
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
			//Puts unused skills back before closing the page
				var count = Loadout.current.length;
				for(var i=0;i<count;i++){
					Game.unlockedSkills.push(Loadout.current.splice(0,1)[0]);
			}
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
		//Ready button
		$("<div>Confirm</div>")
		.addClass("deployButton")
		.on("click",function(){
			interactionManager.setPlayerSkills(Loadout.current);
			var count = Loadout.current.length;
				for(var i=0;i<count;i++){
					Game.unlockedSkills.push(Loadout.current.splice(0,1)[0]);
			}
				document.getElementById("gameScreen").removeChild(document.getElementById("GamePromptScreen"));
		})
		.appendTo(".loadoutScreen");
	},

	//Generates descriptions for the skills
	generateDescription:function(skill){
		switch(skill.attr("class")){
			case "skillIcon spreadShotIcon":
			    return "Spread Shot<br/>You temporarily shoot three bullets in a cone in front of you.";

			case "skillIcon penetratingShotIcon":
			    return "Piercing Shot<br/>Your bullets temporarily pierce targets and hit and enemies behind the target.";

			case "skillIcon stopTimeIcon":
			    return "Stop Time<br/>Freeze enemies in place for a few seconds, while retaining your ability to move.";

			case "skillIcon blackHoleIcon":
			    return "Black Hole<br/>After use, click somewhere on the battlefield to suck all enemies there.";

			case "skillIcon homingShotIcon":
			    return "Homing Shot<br/>Projectiles you fire, seek out enemy planes.";

			case "skillIcon deathRayIcon":
			    return "Death Ray<br/>Annihilate all enemies in a line in front of you.";

			case "skillIcon sentryIcon":
			    return "Sentry<br/>Place an immobile sentry that shoots your enemies down. Rotate it using A and D.";

		    case "skillIcon stealthIcon":
		        return "Stealth<br/>Vanish from your enemies' sight, causing all bullets to miss you for 2 seconds.";

		    case "skillIcon radioactiveIcon":
		        return "Radioactive<br/>Release a decimating radioactive wave to your enemies.";

		    case "skillIcon healingShotIcon":
		        return "Healing Shot<br/>Your bullets will heal you a small amount for each enemy you hit.";

		    case "skillIcon guidedRocketIcon":
		        return "Guided Rocket<br/>Draw a path and the rocket will follow it, destroying all before it.";
				
			case "skillIcon shieldIcon":
		        return "Shield<br/>Shields you from harm, preventing all damage from the next 5 bullets.";

		    case "skillIcon absorbBulletsIcon":
		        return "Absorb Bullets<br/>Enemy bullets will temporarily heal (instead of harm) you.";
		}
	},

	//Adds and removes the description box when needed
	attachIconDescriptionEvents : function(){
        $(".skillIcon").on("mouseenter",function(){
            $("<div/>").addClass("descriptionBox gameWindow").html(Loadout.generateDescription($(this))).appendTo("#gameScreen")
        });

        $(".skillIcon").on("mouseleave click",function(){
           $(".descriptionBox").remove();
        });
	}

}