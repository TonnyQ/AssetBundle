// Base Terrain
var heightmapMaximumLOD: int = 0;
var heightmapPixelError: float = 5;
var basemapDistance: float = 5000;
var castShadows: boolean = false;

// Tree & Detail Terrain
var draw: boolean = true;
var treeDistance: float = 20000;
var detailObjectDistance: float = 250;
var detailObjectDensity: float = 1;
var treeBillboardDistance: float = 200;
var treeCrossFadeLength: float = 50;
var treeMaximumFullLODCount: int = 50;

function Start () 
{
	var terrain: Terrain = GetComponent(Terrain);
	
	terrain.heightmapPixelError = heightmapPixelError;
	terrain.heightmapMaximumLOD = heightmapMaximumLOD;
	if (terrain.GetComponent("ReliefTerrain") == null) {
		terrain.basemapDistance = basemapDistance;
	}
	terrain.castShadows = castShadows;
	
	if (draw)
	{
		terrain.treeDistance = treeDistance;
		terrain.detailObjectDistance = detailObjectDistance;
	}
	else
	{
		terrain.treeDistance = 0;
		terrain.detailObjectDistance = 0;
	}
	
	terrain.detailObjectDensity = detailObjectDensity;
	terrain.treeMaximumFullLODCount = treeMaximumFullLODCount;
	terrain.treeBillboardDistance = treeBillboardDistance;
	terrain.treeCrossFadeLength = treeCrossFadeLength;
	terrain.treeMaximumFullLODCount = treeMaximumFullLODCount;
}	
