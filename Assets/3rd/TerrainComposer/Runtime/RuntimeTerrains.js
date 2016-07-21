#pragma strict
private var TerrainComposer: GameObject;
private var tc_script: terraincomposer_save;

private var TerrainComposerClone: GameObject;
private var tc_script2: terraincomposer_save;

private var frames: float;	
private var currentOutput: int = 0;

var moveTerrainsWithCamera: boolean = false;
var updateCheckTime : float = 0.5;
var mainCamera : Transform;

var generateOnStart: boolean = true;
var createTerrainsOnTheFly: boolean = false;
var autoSpeed: boolean = true;
var targetFrames: int = 90;
var generateSpeed: int = 500;
var heightmapOutput: boolean = false;
var splatOutput: boolean = false;
var treeOutput: boolean = false;
var grassOutput: boolean = false;
var objectOutput: boolean = false;

var seed: int = 10; 
var randomSeed: boolean = false;
var randomizeHeightmapOutput: boolean = false;
var randomizeHeightmapRange: Vector2 = new Vector2(0,1000);
var randomizeTreeOutput: boolean = false;
var randomizeTreeRange: Vector2 = new Vector2(0,1000);
var randomizeGrassOutput: boolean = false;
var randomizeGrassRange: Vector2 = new Vector2(0,1000);
var randomizeObjectOutput: boolean = false;
var randomizeObjectRange: Vector2 = new Vector2(0,1000);


private var terrainSize : float;
private var totalSize : float;

private var initPos : Vector3[];
private var oldPos : Vector3;
private var terrainSizeHalf: float;
private var relativePos : float;
private var newPos: float;
private var offset: float;
private var myStyle: GUIStyle;
private var terrains : List.<terrain_class> = new List.<terrain_class>();

private var resetActive : boolean = false;
private var generateStart: boolean = false;
private var generating: boolean = false;

function Start () 
{
	TerrainComposer = GameObject.Find("TerrainComposer_Save");
	tc_script = TerrainComposer.GetComponent(terraincomposer_save);
	
	tc_script.heightmap_output = false;
	tc_script.splat_output = false; 
	
	myStyle = new GUIStyle();
	
	if (createTerrainsOnTheFly) CreateTerrains();
	
	if (moveTerrainsWithCamera) 
	{
		if (mainCamera == null) {
			Debug.Log("Assign the Main Camera");
			Debug.Break();
		}
		StartMoveTerrains();
		InvokeRepeating("UpdateMoveTerrain",0,updateCheckTime);
	}
	if (generateOnStart) GenerateStart();
}

function CreateTerrains()
{
	tc_script.create_terrain(tc_script.terrains[0],tc_script.terrainTiles);
	tc_script.fit_terrain_tiles(tc_script.terrains[0],true);
	ParentTerrains();
}

function UpdateMoveTerrain()
{
	if (generating) return;
	
	resetActive = false;
	generateStart = false;
	
	ResetActive();
	UpdateTerrainPositionsX();
	UpdateTerrainPositionsZ();
	
	if (generateStart) GenerateStart();
}

function ResetActive()
{
	if (resetActive) return;
	for (var i: int = 0;i < tc_script.terrains.Count;i++) 
	{
		tc_script.terrains[i].active = false;
	}
	resetActive = true;
}

function GenerateUpdate () 
{
	frames = 1/Time.deltaTime;
	
	if (tc_script2)
	{
		while (tc_script2.generate)
		{
			tc_script2.generate_output(tc_script2.prelayers[0]);
			yield;
		}
		
		// generation is ready so the clone can be destroyed
	}
}

function GenerateStart()
{
	generating = true;
		
	currentOutput = 0;
	
	while (SelectCloneOutput()) {
		tc_script2.generate = true;
		GenerateUpdate();
		while (tc_script2.generate) {
			yield;
		}
		if (tc_script2.splat_output) tc_script2.stitch_splatmap();
	}
	GenerateStop();
}

function GenerateStop()
{
	Destroy (TerrainComposerClone);
	if (currentOutput == 5) 
	{
		for (var i: int = 0;i < terrains.Count;i++) 
		{
			#if UNITY_3_4 || UNITY_3_5
			terrains[i].terrain.gameObject.active = true;
			#else
			terrains[i].terrain.gameObject.SetActive(true);
			#endif
		}
		terrains.Clear();
		generating = false;
	}
}

function SelectCloneOutput(): boolean
{
	tc_script.disable_outputs();
	if (randomSeed) seed = Time.realtimeSinceStartup*2000;
	if (currentOutput == 0) {
		currentOutput = 1;
		if (heightmapOutput) {
			tc_script.heightmap_output = true;
			CreateClone();
			if (randomizeHeightmapOutput) tc_script2.randomize_layer_offset(layer_output_enum.heightmap,randomizeHeightmapRange,seed);
			return true;
		}
	}
	if (currentOutput == 1) {
		tc_script.terrains[0].SetAllNeighbors(tc_script.terrains);
		currentOutput = 2;
		if (splatOutput) {
			tc_script.splat_output = true;
			CreateClone();
			return true;
		} 
	}
	if (currentOutput == 2) {
		currentOutput = 3;
		if (treeOutput) {tc_script.tree_output = true;CreateClone();return true;}
	}
	if (currentOutput == 3) {
		currentOutput = 4;
		if (grassOutput) {tc_script.grass_output = true;CreateClone();return true;}
	}
	if (currentOutput == 4) {
		currentOutput = 5;
		if (objectOutput) {tc_script.object_output = true;CreateClone();return true;}
	}

	// TerrainsFlush();
	return false;
}

function CreateClone()
{
	if (tc_script2) GenerateStop();
	
	TerrainComposerClone = Instantiate(TerrainComposer);
	TerrainComposerClone.name = "<Generating>";
	tc_script2 = TerrainComposerClone.GetComponent(terraincomposer_save);
	tc_script2.script_base = tc_script;

	tc_script2.auto_speed = autoSpeed;
	tc_script2.generate_speed = generateSpeed;
	tc_script2.target_frame = targetFrames;
	tc_script2.runtime = true;
		
	tc_script2.generate_begin();
}

function TerrainsFlush()
{
	for (var count_terrain: int = 0;count_terrain < tc_script.terrains.Count;++count_terrain) {
		tc_script.terrains[count_terrain].terrain.Flush();
	}
	// Debug.Log("Flushed!");
}

function ParentTerrains()
{
	var terrains: GameObject = new GameObject();
	terrains.name = "_Terrains";

	for (var count_terrain: int = 0;count_terrain < tc_script.terrains.Count;++count_terrain) {
		tc_script.terrains[count_terrain].terrain.transform.parent = terrains.transform;
	}
}

function StartMoveTerrains()
{
	terrainSize = tc_script.terrains[0].size.x;
	totalSize = tc_script.terrains[0].tiles.x * terrainSize;
	terrainSizeHalf = terrainSize/2;
	
	initPos = new Vector3[tc_script.terrains.Count]; 
	
	for (var i: int = 0;i < tc_script.terrains.Count;i++)
	{
		initPos[i] = tc_script.terrains[i].terrain.transform.position;
	}
	
	offset = terrainSize / 2;
	
	if ((totalSize/terrainSize) % 2 != 0) 
	{
		
	}
	
	UpdateTerrainPositionsX();
	UpdateTerrainPositionsZ();
	if (generateStart) GenerateStart();
}

function UpdateTerrainPositionsX()
{
	for (var i : int = 0;i < tc_script.terrains.Count;i++)
	{
		relativePos = mainCamera.transform.position.x - initPos[i].x;  
		newPos = (Mathf.Round((relativePos - offset)/totalSize) * totalSize)+initPos[i].x;
		if (tc_script.terrains[i].terrain.transform.position.x != newPos) 
		{
			tc_script.terrains[i].terrain.transform.position = new Vector3(newPos, tc_script.terrains[i].terrain.transform.position.y, tc_script.terrains[i].terrain.transform.position.z);
			#if UNITY_3_4 || UNITY_3_5
			tc_script.terrains[i].terrain.gameObject.active = false;
			#else
			tc_script.terrains[i].terrain.gameObject.SetActive(false);
			#endif
			terrains.Add(tc_script.terrains[i]); 
			tc_script.terrains[i].active = true;
			generateStart = true;
		}
	}
	oldPos.x = Mathf.Round(mainCamera.transform.position.x/terrainSize)*terrainSize;
}

function UpdateTerrainPositionsZ()
{
	for (var i : int = 0;i < tc_script.terrains.Count;i++)
	{
		relativePos = mainCamera.transform.position.z - initPos[i].z; 
		newPos = (Mathf.Round((relativePos - offset)/totalSize) * totalSize)+initPos[i].z;
		if (tc_script.terrains[i].terrain.transform.position.z != newPos) 
		{
			tc_script.terrains[i].terrain.transform.position = new Vector3(tc_script.terrains[i].terrain.transform.position.x, tc_script.terrains[i].terrain.transform.position.y, newPos);
			#if UNITY_3_4 || UNITY_3_5
			tc_script.terrains[i].terrain.gameObject.active = false;
			#else
			tc_script.terrains[i].terrain.gameObject.SetActive(false);
			#endif
			tc_script.terrains[i].SetAllNeighbors(tc_script.terrains);
			terrains.Add(tc_script.terrains[i]);
			tc_script.terrains[i].active = true;
			generateStart = true;
		}
	}
	oldPos.z = Mathf.Round(mainCamera.transform.position.z/terrainSize)*terrainSize;
}


