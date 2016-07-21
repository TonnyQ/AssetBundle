#pragma strict
var script: RuntimeTerrains;

function Start () {

}

function Update () {
	if (Input.GetKeyDown("g")) {
		script.createTerrainsOnTheFly = false;
		script.GenerateStart();
	}
}

