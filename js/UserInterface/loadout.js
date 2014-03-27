var Loadout = {
	drawLoadoutScreen : function(){
		//Draws transparent black layer
		$("<div/>",{
			id: "GamePromptScreen"
		})
		.appendTo("#gameScreen");
		//Draws loadout screen
		$("<div/>")
		.addClass("loadoutScreen")
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
	}
}