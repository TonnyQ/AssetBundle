#pragma strict
 
// Assign the Terrain Parent GameObject to TerrainParent
var TerrainParent: GameObject;
 
var terrains: List.<Transform> = new List.<Transform>();
var terrainRects: Rect[];
 
// Assign a test GameObject to the cube to test
var cube: Transform;
 
function Awake()
{
    // Create an Array of all the transforms from the children (terrains) of the parent GameObject
    var terrainsTemp: Transform[] = TerrainParent.GetComponentsInChildren.<Transform>();
    var terrain: Terrain;
   
    // Create a Generic List without the Parent GameObject in the Array
    for (var countTerrain: int = 0;countTerrain < terrainsTemp.Length;++countTerrain)
    {
        // checks if item from list is a Terrain
        terrain = terrainsTemp[countTerrain].GetComponent(Terrain);
        if (terrain){terrains.Add(terrainsTemp[countTerrain]);}
    }
   
    terrainRects = new Rect[terrains.Count];
   
    // Create another Array of Rect that contains the area of each terrain
    for (countTerrain = 0;countTerrain < terrains.Count;++countTerrain)
    {
        terrain = terrains[countTerrain].GetComponent(Terrain);
       
        terrainRects[countTerrain].x = terrains[countTerrain].position.x;
        terrainRects[countTerrain].y = terrains[countTerrain].position.z;
       
        terrainRects[countTerrain].width = terrain.terrainData.size.x;
        terrainRects[countTerrain].height = terrain.terrainData.size.z;
    }
}
 
function GetTerrainTile(position: Vector3): Terrain
{
    for (var countTerrain: int = 0;countTerrain < terrains.Count;++countTerrain)
    {
        if (terrainRects[countTerrain].Contains(Vector2(position.x,position.z)))
        {
            return terrains[countTerrain].GetComponent(Terrain);
        }  
    }
    return null;
}
 
function GetTerrainHeight(position: Vector3): float
{
    var terrain: Terrain = GetTerrainTile(position);
   
    if (terrain)
    {
        return terrain.SampleHeight(position);
    }
    else
    {
        return -1;
    }
}
 
 
// Test getTerrainHeight function with the cube GameObject
// Display terrain height based on position of cube
function Update()
{
    var height: float = GetTerrainHeight(cube.position);
    Debug.Log("Position: "+cube.position+" height: "+height);
}
 