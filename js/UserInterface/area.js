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
	updateAreaStatus : function(){
		for(var i=0;i<this.areas.length-1;i++){
			if(this.areas[i].pointsInArea >= 5){
				if(this.areas[i+1].active == false){
					this.areas[i+1].active = true;
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