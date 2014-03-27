'use strict'

function Area(missions){
	//Array of all missions in the area
	this.missions = missions;
	//Determines if this area is unlocked
	this.active = false;
	//Ammount of points won from missions
	this.pointsInArea = 0;
}

var AreaManager = {
	areas : [new Area(MissionManager.generateMissions()),new Area(MissionManager.generateMissions()), new Area(MissionManager.generateMissions())],
	//Makes corrections to the activity of areas, and activates boss challenge, if neccesary
	updateAreaStatus : function(stars){
		var curMis = MissionManager.currentMissionIndex;
		var curArea = MissionManager.currentAreaIndex;
		this.areas[curArea].missions[curMis].complete = true;
		if(stars===undefined){
			stars=0;
		}
		this.areas[curArea].missions[curMis].rank = stars;
		this.areas[curArea].pointsInArea += stars;
		for(var i=0;i<this.areas.length-1;i++){
			if(this.areas[i+1].active == false){
				if(this.areas[i].pointsInArea >= 5){
					this.areas[i+1].active = true;
				}
				else if(this.areas[i].missions[0].played&&this.areas[i].missions[1].played&&this.areas[i].missions[2].played){
					this.areas[i].active = true
				}
			}
		}
	},
	//Creates the GUI of the menu
	drawMap : function(){
		//Creates the main map div
		$("<div/>",{
			class:"mainMap"
		}).appendTo("#gameScreen");
		//Creates loadout button
		$("<div>LOADOUT</div>")
		.addClass("loadoutButton")
		.on("click",function(){
			Loadout.drawLoadoutScreen();
		})
		.appendTo("#gameScreen");
		//Creates the three areas
		for(var i=0;i<AreaManager.areas.length;i++){
			var tempArea = document.createElement("div");
			if(AreaManager.areas[i].active){
				tempArea.className="colored area"+i;
			}
			else{
				tempArea.className="greyscale area"+i;
			}
			document.getElementById("gameScreen").appendChild(tempArea);
			if(AreaManager.areas[i].active){
				MissionManager.drawMissions(i);
			}
		}
	},


}