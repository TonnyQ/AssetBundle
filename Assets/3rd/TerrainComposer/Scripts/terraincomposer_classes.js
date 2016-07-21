class raw_class
{
	var foldout: boolean = true;
	var settings_foldout: boolean = false;
	var raw_number: int = 0;
	var file_index: List.<int> = new List.<int>();
	var file_foldout: List.<boolean> = new List.<boolean>();
	var path: String = String.Empty;
	var tile_offset: boolean = false;
	var flip_x: boolean = false;
	var flip_y: boolean = false;
	var flipTotalY: boolean = false;
	var flipTotalX: boolean = false;
	var clamp: boolean = false;
	var list_length: int = 1;
	var list_row: int = 4;
	var display_short_list: boolean = false;
	var raw_list_mode: list_condition_enum;
	var raw_mode: image_mode_enum;
	var object: Object;
	
	var auto_search: auto_search_class = new auto_search_class();
	
	var raw_auto_scale: boolean = true;
	var conversion_step: Vector2 = Vector2(1,1);
	var tile_x: float = 1;
	var tile_y: float = 1;
	var tile_link: boolean = false;
	var tile_offset_x: float = 0;
	var tile_offset_y: float = 0;
	var rgb: boolean = true;
	var rotation: boolean = false;
	var rotation_value: float = 0;
	var output: boolean;
	var output_pos: float;
	
	function raw_class()
	{
		file_index.Add(-1);
		file_foldout.Add(true);
	}
	
	function adjust_list()
	{
		var delta_list: int = list_length-file_index.Count;
		var count_file_index: int;
		
		if (delta_list > 0)
		{
			for (count_file_index = 0;count_file_index < delta_list;++count_file_index)
			{
				file_index.Add(-1);
				file_foldout.Add(false);		
			}
		}
		if (delta_list < 0)
		{
			delta_list *= -1;
			for (count_file_index = 0;count_file_index < delta_list;++count_file_index) 
			{
				file_index.RemoveAt(file_index.Count-1);
				file_foldout.RemoveAt(file_foldout.Count-1);
			}
		}
	}

	
	function set_raw_auto_scale(preterrain1: terrain_class,area: Rect,raw_files: List.<raw_file_class>,raw_number: int)
	{
		if (raw_number < file_index.Count)
		{
			if (raw_files[file_index[raw_number]].assigned && preterrain1)
			{
				if (raw_mode == image_mode_enum.Area)
				{
					conversion_step.x = area.width/(raw_files[file_index[raw_number]].resolution.x-1);
					conversion_step.y = area.height/(raw_files[file_index[raw_number]].resolution.y-1);
				}
				else if (raw_mode == image_mode_enum.Terrain)
				{
					if (preterrain1.terrain)
					{
						conversion_step.x = preterrain1.terrain.terrainData.size.x/(raw_files[file_index[raw_number]].resolution.x-1);
						conversion_step.y = preterrain1.terrain.terrainData.size.z/(raw_files[file_index[raw_number]].resolution.y-1);
					}
				}
				else if (raw_mode == image_mode_enum.MultiTerrain)
				{
					conversion_step.x = (preterrain1.terrain.terrainData.size.x*preterrain1.tiles.x)/(raw_files[file_index[raw_number]].resolution.x-1);
					conversion_step.y = (preterrain1.terrain.terrainData.size.z*preterrain1.tiles.y)/(raw_files[file_index[raw_number]].resolution.y-1);
				}
			}
		}
	}
}

class mesh_measure_class
{
   	var hit: boolean;
	var height: float;
	var degree: float;
	var normal: Vector3;
	var transform: Transform;
}

// mesh class
class mesh_class
{
	static var applyToAll: boolean = true;
	var area: Rect;
	
	var active: boolean = true;
	var foldout: boolean = false;
	
	var gameObject: GameObject;
	var transform: Transform;
	var meshFilter: MeshFilter;
	var mesh: Mesh;
	var collider: MeshCollider;
}

class GenerateArea_Class
{
	var area: Rect;
	var conversion: Vector2;
	var preterrain: terrain_class;
	
	function GenerateArea_Class(area: Rect,conversion: Vector2,preterrain: terrain_class)
	{
		this.area = area;
		this.conversion = conversion;
		this.preterrain = preterrain;
	}
}

// terrain_class
class terrain_class
{
	@NonSerialized var neighbors : terrain_class[] = new terrain_class[4];
	
	var active: boolean = true;
	var foldout: boolean = false;
	var index: int;
	var index_old: int;
	var on_row: boolean = false;
	var color_terrain: Color = Color(2,2,2,1);
	var copy_terrain: int = 0;
	var copy_terrain_settings: boolean = true;
	
	var rtp_script: Component;
	
	var neighbor: neighbor_class = new neighbor_class();
	
	var splat_alpha: Texture2D[]; 
	var ColorGlobal: Texture2D;
	
	var terrain: Terrain;
	var parent: Transform;
	var objectParent: GameObject;
	var name: String;
	var prearea: area_class = new area_class();
	var map: float[,,];
	var splatPrototypes: List.<splatPrototype_class> = new List.<splatPrototype_class>();
	var colormap: splatPrototype_class = new splatPrototype_class();
	var splats_foldout: boolean = false;
	var splat_rect: Rect;
	var treePrototypes: List.<treePrototype_class> = new List.<treePrototype_class>();
	var trees_foldout: boolean = false;
	var detailPrototypes: List.<detailPrototype_class> = new List.<detailPrototype_class>();
	var details_foldout: boolean = false;
	var splat: float[];
	var splat_calc: float[];
	var splat_layer: float[];
	var splat_length: int;
	
	var color: float[];
	var color_layer: float[];
	var color_length: int;
	var grass: float[];
	
	var heightmap_resolution_list: int;
	var splatmap_resolution_list: int;
	var basemap_resolution_list: int;
	var detailmap_resolution_list: int;
	var detail_resolution_per_patch_list: int;
	
	var size: Vector3;
	var size_xz_link: boolean = true;
	var tile_x: float;
	var tile_z: float;
	var tiles: Vector2 = Vector2(1,1);
	var rect: Rect;
	
	var data_foldout: boolean = true;
	var scale: Vector3;
	
	var maps_foldout: boolean = false;
	
	var settings_foldout: boolean = false;
	var resolution_foldout: boolean = false;
	var scripts_foldout: boolean = false;
	var reset_foldout: boolean = false;
	var size_foldout: boolean = false;
	 
	var raw_file_index: int = -1;
	var raw_save_file: raw_file_class = new raw_file_class();
	
	// resolutions
	var heightmap_resolution: float = 256;
	var splatmap_resolution: float = 256;
	var detail_resolution: float = 256;
	var detail_resolution_per_patch: float = 8;
	var basemap_resolution: float = 256;
	
	var size_synchronous: boolean = true;
	var resolutions_synchronous: boolean = true;
	var splat_synchronous: boolean = true;
	var tree_synchronous: boolean = true;
	var detail_synchronous: boolean = true;
	
	var splatmap_conversion: Vector2;
	var heightmap_conversion: Vector2;
	var detailmap_conversion: Vector2;
	
	var splat_foldout: boolean = false;
	
	var tree_foldout: boolean = false;
	var tree_length: int;
	
	var detail_foldout: boolean = false;
	var detail_scale: float = 1;
	
	var base_terrain_foldout: boolean = true;
	var tree_detail_objects_foldout: boolean = true;
	var wind_settings_foldout: boolean = true;
	
	var settings_all_terrain: boolean = true;
	var heightmapPixelError: float = 5;
	var heightmapMaximumLOD: int = 0;
	var castShadows: boolean = false;
	var basemapDistance: float = 20000;
	var treeDistance: float = 20000;
	var detailObjectDistance: float = 250;
	var detailObjectDensity: float = 1;
	var treeMaximumFullLODCount: int = 50;
	var treeBillboardDistance: float = 250;
	var treeCrossFadeLength: float = 200;
	var draw: boolean = true;
	var editor_draw: boolean = true;
	
	var script_terrainDetail: TerrainDetail;
	
	var settings_runtime: boolean = false;
	var settings_editor: boolean = true;
	
	var wavingGrassSpeed: float = 0.5;
	var wavingGrassAmount: float = 0.5;
	var wavingGrassStrength: float = 0.5;
	var wavingGrassTint: Color = Color(0.698,0.6,0.50);
	
	function add_splatprototype(splat_number: int)
	{
		splatPrototypes.Insert(splat_number,new splatPrototype_class());
	}
	
	function erase_splatprototype(splat_number: int)
	{
	 	if (splatPrototypes.Count > 0){splatPrototypes.RemoveAt(splat_number);}
	}
	
	function clear_splatprototype()
	{
		splatPrototypes.Clear();
	}
	
	function clear_null_splatprototype()
	{
		for (var i: int = 0;i < splatPrototypes.Count;++i) { 
			if (splatPrototypes[i].texture == null) {splatPrototypes.RemoveAt(i);--i;}
		}
	}
	
	function add_treeprototype(tree_number: int)
	{
		treePrototypes.Insert(tree_number,new treePrototype_class());
	}
	
	function erase_treeprototype(tree_number: int)
	{
	 	if (treePrototypes.Count > 0){treePrototypes.RemoveAt(tree_number);}
	}
	
	function clear_treeprototype()
	{
		treePrototypes.Clear();
	}
	
	function clear_null_treeprototype()
	{
		for (var i: int = 0;i < treePrototypes.Count;++i) {
			if (treePrototypes[i].prefab == null) {treePrototypes.RemoveAt(i);--i;}
		}
	}
	
	function add_detailprototype(detail_number: int)
	{
		detailPrototypes.Insert(detail_number,new detailPrototype_class());
	}
	
	function erase_detailprototype(detail_number: int)
	{
	 	if (detailPrototypes.Count > 0){detailPrototypes.RemoveAt(detail_number);}
	}
	
	function clear_detailprototype()
	{
		detailPrototypes.Clear();
	}
	
	function clear_null_detailprototype()
	{
		for (var i: int = 0;i < detailPrototypes.Count;++i) {
			if (detailPrototypes[i].prototype == null && detailPrototypes[i].prototypeTexture == null) {detailPrototypes.RemoveAt(i);--i;}
		}
	}
	
	function SetAllNeighbors(terrains : List.<terrain_class>)
	{
		for (var i: int = 0;i < terrains.Count;i++) terrains[i].SetNeighbors(terrains);
	}
	
	function SetNeighbors(terrains : List.<terrain_class>)
	{
		var tNeighbors : Terrain[] = new Terrain[4];
		
		for (var i : int = 0;i < 4;i++) 
		{
			SetNeighbor(terrains, i);
			if (neighbors[i] != null) tNeighbors[i] = neighbors[i].terrain; else tNeighbors[i] = null;
		}
		
		if (terrain != null) terrain.SetNeighbors(tNeighbors[3], tNeighbors[0], tNeighbors[1], tNeighbors[2]);
	}
	
	function SetNeighbor(terrains : List.<terrain_class>, direction : int)
	{
		var dir : Vector2;
		if (direction == 0) dir = new Vector2(0,1);
		else if (direction == 1) dir = new Vector2(1,0);
		else if (direction == 2) dir = new Vector2(0,-1);
		else dir = new Vector2(-1,0);
		
		for (var i: int = 0;i < terrains.Count; i++) 
		{
			if (terrains[i].terrain == null) continue;
			if (terrains[i].terrain.transform.position.x == terrain.transform.position.x + (terrain.terrainData.size.x * dir.x) && terrains[i].terrain.transform.position.z == terrain.transform.position.z + (terrain.terrainData.size.z * dir.y)) 
			{
				neighbors[direction] = terrains[i];
				return;		
			}
		}
		neighbors[direction] = null;
	}
}

class TempTerrain_Class
{
	var terrain: Terrain;
	var tile: Vector2;
	
	function TempTerrain_Class(terrain: Terrain,tile: Vector2)
	{
		this.terrain = terrain;
		this.tile = tile;
	}
}

// predescription_class
class predescription_class
{
	var description: List.<description_class> = new List.<description_class>();
	var description_enum: String[];
	var description_position: int = 0;
	var layer_index: int;
	var description_index: int;
	
	function predescription_class()
	{
		description.Add(new description_class());
		set_description_enum();	
	}
	
	function add_description(description_number: int)
	{
		description.Insert(description_number,new description_class());
	}
	
	function erase_description(description_number: int)
	{
		if (description.Count > 1)
		{
			description.RemoveAt(description_number);
			set_description_enum();
			if (description_position > description_enum.Length-1){description_position = description_enum.Length-1;}
		}
	}
	
	function add_layer_index(layer_number: int,layer_index: int,description_number: int)
	{
		move_layer_index(layer_number,1);
		description[description_number].layer_index.Insert(layer_index,layer_number);
	}
	
	function erase_layer_index(layer_number: int,layer_index: int,description_number: int)
	{
		move_layer_index(layer_number,-1);
		description[description_number].layer_index.RemoveAt(layer_index);
	}
	
	function move_layer_index(layer_number: int,direction: int)
	{
		for (var count_description: int = 0;count_description < description.Count;++count_description)
		{
			for (var count_layer: int = 0;count_layer < description[count_description].layer_index.Count;++count_layer)
			{
				if (description[count_description].layer_index[count_layer] >= layer_number)
				{
						description[count_description].layer_index[count_layer] += direction;
				}
			}
		}
	}
	
	function search_layer(layer_number: int)
	{
		for (var count_description: int = 0;count_description < description.Count;++count_description)
		{
			for (var count_layer: int = 0;count_layer < description[count_description].layer_index.Count;++count_layer)
			{
				if (description[count_description].layer_index[count_layer] == layer_number)
				{
					description_index = count_description;
					layer_index = count_layer;
					return;
				}
			}
		}
		description_index = -1;
		layer_index = -1;
	}
	
	function set_description_enum()
	{
		description_enum = new String[description.Count];
		
		for (var count_description: int = 0;count_description < description.Count;++count_description)
		{
			description_enum[count_description] = description[count_description].text;			
		}
	}
}

// description class
class description_class
{
	var foldout: boolean = true;
	var text: String = "";
	var remarks: remarks_class = new remarks_class();
	var edit: boolean = false;
	var disable_edit: boolean = false;
	var menu_rect: Rect;
	var rect: Rect;
	var presubfilter: presubfilter_class = new presubfilter_class();
	var layer_index: List.<int> = new List.<int>();
	var layers_active: boolean = true;
	var layers_foldout: boolean = true;
	var swap_text = "S";
	var swap_select = false;
	var copy_select = false;
}

// prelayer_class
class prelayer_class 
{
	var foldout: boolean = true;
	var linked: boolean = true;
	var remarks: remarks_class = new remarks_class();
	var interface_display_layergroup: boolean = false;
	var interface_display_layer: boolean = true;
	var layers_foldout: boolean = true;
	var layers_active: boolean = true;
	var index: int = 0;
	var level: int = 0;
	var layer: List.<layer_class> = new List.<layer_class>();
	var predescription: predescription_class = new predescription_class();
	var layer_text: String = "Layer(1):";
	
	var layer_output: layer_output_enum;
	var view_menu_rect: Rect;
	var menuRect: Rect;
	
	var view_heightmap_layer: boolean = true;
	var view_color_layer: boolean = true;
	var view_splat_layer: boolean = true;
	var view_tree_layer: boolean = true;
	var	view_grass_layer: boolean = true;
	var view_object_layer: boolean = true;
	var view_only_selected: boolean = false;
	
	var x: float;
	var y: float;
	var counter_y: float;
	var count_terrain: int;
	var break_x_value: float;
	
	// area
	var prearea: area_class = new area_class();
	var area: boolean = false;
	
	var objects_placed: List.<distance_class> = new List.<distance_class>();
	
	function prelayer_class(length: int,index2: int)
	{
		index = index2;
		if (length > 0)
		{
			for (var counter: int = 0;counter < length;++counter)
			{
				layer.Add(new layer_class());
			 	layer[0].output = layer_output_enum.splat;
				predescription.add_layer_index(counter,counter,0);
			}	
		}
	}
	
	function set_prelayer_text()
	{
		layer_text = "Layer Level"+index+"("+layer.Count+")";
	}
	
	function new_layer(layer_number: int,filter: List.<filter_class>)
	{
		layer[layer_number] = new layer_class();
	}

	function change_layers_active_from_description(description_number: int,invert: boolean,heightmap_output: boolean,color_output: boolean,splat_output: boolean,tree_output: boolean,grass_output: boolean,object_output: boolean)
	{
		var layer1: layer_class;
		for (var count_layer: int = 0;count_layer < predescription.description[description_number].layer_index.Count;++count_layer) {
			layer1 = layer[predescription.description[description_number].layer_index[count_layer]];
			
			if ((layer1.output == layer_output_enum.heightmap && heightmap_output) || (layer1.output == layer_output_enum.color && color_output) || (layer1.output == layer_output_enum.splat && splat_output) || (layer1.output == layer_output_enum.tree && tree_output) || (layer1.output == layer_output_enum.grass && grass_output) || (layer1.output == layer_output_enum.object && object_output)) {
				if (!invert) layer1.active = predescription.description[description_number].layers_active;
				else layer1.active = !layer1.active;
			} 
		}
	}
	
	function change_layers_foldout_from_description(description_number: int,invert: boolean,heightmap_output: boolean,color_output: boolean,splat_output: boolean,tree_output: boolean,grass_output: boolean,object_output: boolean)
	{
		var layer1: layer_class;
		for (var count_layer: int = 0;count_layer < predescription.description[description_number].layer_index.Count;++count_layer) {
			layer1 = layer[predescription.description[description_number].layer_index[count_layer]];
			if ((layer1.output == layer_output_enum.heightmap && heightmap_output) || (layer1.output == layer_output_enum.color && color_output) || (layer1.output == layer_output_enum.splat && splat_output) || (layer1.output == layer_output_enum.tree && tree_output) || (layer1.output == layer_output_enum.grass && grass_output) || (layer1.output == layer_output_enum.object && object_output)) {
				layer1 = layer[predescription.description[description_number].layer_index[count_layer]];
				if (!invert) layer1.foldout = predescription.description[description_number].layers_foldout;
				else layer1.foldout = !layer1.foldout;
			}
		}
	}
	
	function change_layers_active(invert: boolean)
	{
		for (var count_layer: int = 0;count_layer < layer.Count;++count_layer)
		{
			if (!invert)
			{
				layer[count_layer].active = layers_active;
			}
			else
			{
				layer[count_layer].active = !layer[count_layer].active;
			}
		}
	}
	
	function change_foldout_layers(invert: boolean)
	{
		for (var count_layer: int = 0;count_layer < layer.Count;++count_layer)
		{
			if (!invert)
			{
				layer[count_layer].foldout = layers_foldout;
			}
			else
			{
				layer[count_layer].foldout = !layer[count_layer].foldout;
			}
		}
	}
	
	function swap_layer2(number1: int,number2: int)
	{
		var layer2: layer_class = layer[number1];
		layer[number1] = layer[number2];
		layer[number2] = layer2;
		if (layer[number1].color_layer[0] < 1.5){layer[number1].color_layer += Color (1,1,1,1);}
		if (layer[number2].color_layer[0] < 1.5){layer[number2].color_layer += Color (1,1,1,1);}
	}
}

// layer_class
class layer_class 
{
	var software_id: float = 0;
	var active: boolean = true; 
	var foldout: boolean = false;
	var color_layer: Color = Color(1.5,1.5,1.5,1);
	var output: layer_output_enum = layer_output_enum.color;
	var strength: float = 1;
	var positionSeed: boolean = true;
	
	var nonOverlap: boolean = false;
   
	// perlin
	var zoom: float = 1;
	var offset: Vector2;
	var offset_range: Vector2 = Vector2(5,5);
	var offset_middle: Vector2;

	var drawn: boolean = false;
	var text: String = String.Empty;
	var text_placed: String = String.Empty;
	var rect: Rect;
	var edit: boolean = false;
	var disable_edit: boolean = false;
	var smooth: boolean = false;
	var remarks: remarks_class = new remarks_class();
	
	var height_output: height_output_class = new height_output_class();
	var color_output: color_output_class = new color_output_class(); 
	var splat_output: splat_output_class = new splat_output_class();
	var tree_output: tree_output_class = new tree_output_class();
	var grass_output: grass_output_class = new grass_output_class();
	var object_output: object_output_class = new object_output_class();
	
	var menu_rect: Rect;
	
	var swap_text: String = "S";
	var swap_select: boolean = false;
	var copy_select: boolean = false;
	var prefilter: prefilter_class = new prefilter_class();
	
	var objects_placed: List.<distance_class> = new List.<distance_class>();
	
	function layer_class()
	{
		object_output = new object_output_class();
	}
}

// height 
class height_output_class
{
	var value: float;
	var strength: float = 1;
	var perlin_foldout: boolean = false;
}
	
// color
class color_output_class 
{
	var active: boolean; 
	var foldout: boolean = true;
	var strength: float = 1;
	var precolor_range_enum: String[] = new String[1];
	var precolor_range: List.<precolor_range_class> = new List.<precolor_range_class>();
	var color_text: String = "Color Outputs:";
	
	function color_output_class()
	{
		precolor_range.Add(new precolor_range_class(1,true));
		set_precolor_range_enum();
	}
	
	function set_precolor_range_enum()
	{
		precolor_range_enum = new String[precolor_range.Count];
		for (var count_precolor_range: int = 0;count_precolor_range < precolor_range.Count;++count_precolor_range)
		{
			precolor_range_enum[count_precolor_range] = "Color Range"+count_precolor_range;
		}
	}
	
	function set_precolor_range_length(length_new: int)
	{
		if (length_new != precolor_range.Count)
		{
		    if (length_new > precolor_range.Count)
		    {
		    	precolor_range.Add(new precolor_range_class(1,true));
		    	precolor_range[precolor_range.Count-1].index = length_new-1;
		    	precolor_range[precolor_range.Count-1].set_color_range_text();
		    } 
		    else 
		    {
		    	precolor_range.RemoveAt(precolor_range.Count-1);
		    }
		    set_precolor_range_enum();
		}
	} 
	
	function add_precolor_range(precolor_range_number: int)
	{
		precolor_range.Insert(precolor_range_number,new precolor_range_class(1,true));
		precolor_range[precolor_range_number].index = precolor_range_number;
		precolor_range[precolor_range_number].set_color_range_text();
	}
	
	function erase_precolor_range(precolor_range_number: int)
	{
		precolor_range.RemoveAt(precolor_range_number);
		set_precolor_range_enum();
	}
}

// color_range_class
class color_range_class extends animation_curve_class
{
	var color_color_range: Color = Color(2,2,2,1);
	var color_start: Color = Color(0,0,0,1);
	var color_end: Color = Color(0,0,0,1);
	var one_color: boolean = false;
	var curve_menu_rect: Rect;
	var invert: boolean = false;
	var swap_text: String = "S";
	var swap_select: boolean = false;
	var copy_select: boolean = false;
	var output: float = 1;
	var select_output: int;
	// var precurve: animation_curve_class = new animation_curve_class();
		
	function color_range_class() 
	{
		curve = new AnimationCurve().Linear(0,0,1,1);
		default_curve = new AnimationCurve(curve.keys);
	}
}

// splat_output_class
class splat_output_class
{
	var active: boolean;
	var foldout: boolean = true;
	var color_splat: Color = Color(2,2,2,1);
	var strength: float = 1;
	var mix: List.<float> = new List.<float>();
	var splat_custom_foldout: boolean = true;
	var splat_text: String = "Splat:";
	// var splat_terrain: int = 0;
	var terrain_splat_assigned: boolean = false;
	var mix_mode: mix_mode_enum;
	var rect: Rect;
	
	var curves: List.<animation_curve_class> = new List.<animation_curve_class>();
	var animation_curve_math: animation_curve_math_class = new animation_curve_math_class();
	var splat: List.<int> = new List.<int>();
	var splat_value: value_class = new value_class();
	// var splat_calc: List.<float> = new List.<float>();
	var swap_text: List.<String> = new List.<String>();
	var splat_custom: List.<splat_custom_class> = new List.<splat_custom_class>();
	
	function splat_output_class()
	{
		for (var count_splat: int = 0;count_splat < 3;++count_splat) {
			add_splat(count_splat,count_splat,0);
		}
	}
	
	function SyncSplatCustom(splatLength: int)
	{
		// splat_custom.Clear();
		var length: int = splat.Count-splat_custom.Count;
		
		if (length > 0) {	
			for (var i: int = 0;i < length;++i) {
				splat_custom.Add(new splat_custom_class(splatLength));
			}
		}
		else if (length < 0) {
			for (i = 0;i < -length;++i) {
				splat_custom.RemoveAt(splat_custom.Count-1);
			}
		}
		
		for (i = 0;i < splat_custom.Count;++i) {
			length = splatLength-splat_custom[i].value.Count;
			
			if (length > 0) {
				for (var t: int = 0;t < length;++t) {
					splat_custom[i].value.Add(0);
				}
			}
			else if (length < 0) {
				for (t = 0;t < -length;++t) {
					splat_custom[i].value.RemoveAt(splat_custom[i].value.Count-1);
				}
			}
		}
	}
	
	function FoldAllSplatCustom(invert: boolean) 
	{
		for (var i: int = 0;i < splat_custom.Count;++i) {
			if (invert) splat_custom[i].foldout = !splat_custom[i].foldout; else splat_custom[i].foldout = splat_custom_foldout;
		}	
		if (!invert) splat_custom_foldout = !splat_custom_foldout;
	}
	
	function add_splat(splat_number: int,splat_index: int,splatLength: int)
	{
		splat.Insert(splat_number,splat_index);
		// splat_calc.Insert(splat_number,0);
		curves.Insert(splat_number,new animation_curve_class());
		mix.Insert(splat_number,0.5);
		splat_value.add_value(splat_number,50);
		swap_text.Insert(splat_number,"S");
		
		splat_custom.Insert(splat_number,new splat_custom_class(splatLength));
		
		set_splat_curve();
		set_splat_text();
	}
	
	function erase_splat(splat_number: int)
	{
		if (splat.Count > 0)
		{
			splat.RemoveAt(splat_number);
			// splat_calc.RemoveAt(splat_number);
			mix.RemoveAt(splat_number);
			curves.RemoveAt(splat_number);
			splat_value.erase_value(splat_number);
			swap_text.RemoveAt(splat_number);
			splat_custom.RemoveAt(splat_number);
			
			set_splat_curve();
			set_splat_text();
		}
	}
	
	function clear_splat()
	{
		splat.Clear();
		splat_custom.Clear();
		splat_value.clear_value();
		mix.Clear();
		curves.Clear();
		swap_text.Clear();
		
		set_splat_curve();
		set_splat_text();
	}
	
	function swap_splat(splat_number1: int,splat_number2: int)
	{
		if (splat_number2 > -1 && splat_number2 < splat.Count)
		{
			var splat0: float = splat[splat_number1];
			// var splat_value0: float = splat_value.value[splat_number1];
			var splat_custom0: splat_custom_class = splat_custom[splat_number1];
			
			splat[splat_number1] = splat[splat_number2];
			splat_custom[splat_number1] = splat_custom[splat_number2];
			splat_custom[splat_number2] = splat_custom0;
			splat[splat_number2] = splat0;
			
			splat_value.swap_value(splat_number1,splat_number2);
			set_splat_curve();
		}
	}
	
	function set_splat_curve()
	{
		var splat_length: float = curves.Count;
		var splat_off: int = 0;
		var count_splat1: int;
		var frame: Keyframe[];
		
		for (var count_splat: int = 0;count_splat < curves.Count;++count_splat)
		{
			if (!splat_value.active[count_splat]){curves[count_splat].curve = new AnimationCurve.Linear(0,0,0,0);--splat_length;}
		}
		
		if (splat_length == 1){curves[0].curve = new AnimationCurve.Linear(0,1,1,1);return;}
		
		var step: float;
		step = 1/(splat_length);
		var mix1: float;
		var mix2: float;
		
		for (count_splat = 0;count_splat < curves.Count;++count_splat)
		{
			if (!splat_value.active[count_splat]){++splat_off;continue;}
			
			count_splat1 = count_splat - splat_off;
			curves[count_splat].curve = new AnimationCurve();
			if (mix_mode == mix_mode_enum.Single)
			{
				if (count_splat1 == 0)
				{
					mix1 = (1-mix[1])*(step/2);
				}
				if (count_splat1 > 0 && count_splat1 < splat_length-1)
				{
					mix1 = (1-mix[count_splat])*(step/2);
					mix2 = (1-mix[count_splat+1])*(step/2);
				}
				
				if (count_splat1 == splat_length-1)
				{
					mix2 = (1-mix[count_splat])*(step/2);
				}
			} 
			else 
			{
				mix1 = (1-mix[0])*(step/2);
				mix2 = (1-mix[0])*(step/2);
			}
							
			if (splat_length > 1)
			{
				
				if (count_splat1 == 0)
				{
					frame = new Keyframe[3];
					frame[0] = Keyframe(0,1);
					frame[1] = Keyframe(mix1+(step/2),1);
					frame[2] = Keyframe(((step*(count_splat1+1))-mix1)+0.0000001+(step/2),0);
				}
				if (count_splat1 > 0 && count_splat1 < splat_length-1)
				{
					frame = new Keyframe[4];
					frame[0] = Keyframe(((step*(count_splat1-1))+mix1)-0.0000001+(step/2),0);
					frame[1] = Keyframe((step*count_splat1)-mix1+(step/2),1);
					if (!Mathf.Approximately((step*count_splat1)-mix1+(step/2),(step*count_splat1)+mix2+(step/2)))
					{
						frame[2] = Keyframe((step*count_splat1)+mix2+(step/2),1);
					}
					frame[3] = Keyframe(((step*(count_splat1+1))-mix2)+0.0000001+(step/2),0);
				} 
				if (count_splat1 == splat_length-1)
				{
					frame = new Keyframe[3];
					frame[0] = Keyframe(((step*(count_splat1-1))+mix2)-0.0000001+(step/2),0);
					frame[1] = Keyframe(1-mix2-(step/2),1);
					frame[2] = Keyframe(1,1);
				}
				curves[count_splat].curve = animation_curve_math.set_curve_linear(AnimationCurve(frame));
			}
		}
	}
	
	function set_splat_text()
	{
		if (splat.Count > 1){splat_text = "Splats("+splat.Count+")";} else {splat_text = "Splat";}
	}
}

// tree_output_class
class tree_output_class
{
	var active: boolean;
	var color_tree: Color = Color(2,2,2,1);
	var foldout: boolean = true;
	var strength: float = 1;
	var interface_display: boolean = true;
	var icon_display: boolean = true;
	var trees_active: boolean = true;
	var trees_foldout: boolean = true;
	// var tree_terrain: int = 0;
	var terrain_tree_assigned: boolean = false;
	var tree_text: String = "Tree:";
	var scale: float = 1;
	var tree: List.<tree_class> = new List.<tree_class>();
	var tree_value: value_class = new value_class();
	var placed: int = 0;
	@NonSerialized var placed_reference: tree_output_class;
	
	function set_scale(tree1: tree_class,tree_number: int,all: boolean)
	{
		for (var count_tree: int = 0;count_tree < tree.Count;++count_tree)
		{
			if (tree_value.active[count_tree] || all)
			{
				if (count_tree != tree_number)
				{
					tree[count_tree].link_start = tree1.link_start;
					tree[count_tree].link_end = tree1.link_end;
					tree[count_tree].width_start = tree1.width_start;
					tree[count_tree].width_end = tree1.width_end;
					tree[count_tree].height_start = tree1.height_start;
					tree[count_tree].height_end = tree1.height_end;
					tree[count_tree].unlink = tree1.unlink;	
					tree[count_tree].random_position = tree1.random_position;	
					tree[count_tree].height = tree1.height;
					tree[count_tree].raycast = tree1.raycast;
					tree[count_tree].layerMask = tree1.layerMask;
					tree[count_tree].ray_length = tree1.ray_length;
					tree[count_tree].cast_height = tree1.cast_height;
					tree[count_tree].ray_radius = tree1.ray_radius;
					tree[count_tree].ray_direction = tree1.ray_direction;
					tree[count_tree].raycast_mode = tree1.raycast_mode;
				}
				
				if (tree[count_tree].color_tree[0] < 1.5){tree[count_tree].color_tree += Color(0.5,0.5,0.5,0);}
			}		
		}
	}
	
	function set_distance(tree1: tree_class,tree_number: int,all: boolean)
	{
		for (var count_tree: int = 0;count_tree < tree.Count;++count_tree)
		{
			if (tree_value.active[count_tree] || all)
			{
				if (count_tree != tree_number)
				{
					tree[count_tree].min_distance = tree1.min_distance;
					tree[count_tree].distance_level = tree1.distance_level;
					tree[count_tree].distance_mode = tree1.distance_mode;
					tree[count_tree].distance_rotation_mode = tree1.distance_rotation_mode;
					tree[count_tree].distance_include_scale = tree1.distance_include_scale;
					tree[count_tree].distance_include_scale_group = tree1.distance_include_scale_group;
				}
				
				if (tree[count_tree].color_tree[0] < 1.5){tree[count_tree].color_tree += Color(0.5,0.5,0.5,0);}
			}		
		}
	}

	function add_tree(tree_number: int,script: terraincomposer_save,new_filter: boolean)
	{
		tree.Insert(tree_number,new tree_class(script,new_filter));
		tree_value.add_value(tree_number,50);	
		set_tree_text();
	}
	
	function erase_tree(tree_number: int,script: terraincomposer_save)
	{
		if (tree.Count > 0)
		{
			script.erase_filters(tree[tree_number].prefilter);
			tree.RemoveAt(tree_number);
			tree_value.erase_value(tree_number);
			set_tree_text();
		}
	}
	
	function clear_tree(script: terraincomposer_save)
	{
		var length: int = tree.Count;
		
		for (var count_tree: int = 0;count_tree < length;++count_tree)
		{
			erase_tree(tree.Count-1,script);
		}
	}
	
	function swap_tree(tree_number: int,tree_number2: int)
	{
		if (tree_number2 > -1 && tree_number2 < tree.Count)
		{
			var tree2: tree_class = tree[tree_number];
			var tree_value2: float = tree_value.value[tree_number];
			
			tree[tree_number] = tree[tree_number2];		
			tree[tree_number2] = tree2;
			if (tree[tree_number].color_tree[0] < 1.5){tree[tree_number].color_tree += Color(0.5,0.5,0.5,0);}
			if (tree[tree_number2].color_tree[0] < 1.5){tree[tree_number2].color_tree += Color(0.5,0.5,0.5,0);}
			tree_value.swap_value(tree_number,tree_number2);
		}
	}
	
	function set_tree_text()
	{
		if (tree.Count > 1){tree_text = "Trees("+tree.Count+")";} else {tree_text = "Tree("+tree.Count+")";}
	}
}

// tree_class
class tree_class
{
	var foldout: boolean = false;
	var interface_display: boolean = true;
	var prototypeindex: int = 0;
	var placed: int = 0;
	@NonSerialized var placed_reference: tree_class;
	var swap_text: String = "S";
	var swap_select: boolean = false;
	var copy_select: boolean = false;
	var color_tree: Color = Color(1,1,1,1);
	
	var precolor_range: precolor_range_class = new precolor_range_class(1,false);
	var scale_foldout: boolean = false;
	var link_start: boolean = true;
	var link_end: boolean = true;
	var width_start: float = 1;
	var width_end: float = 2.5;
	var height_start: float = 1;
	var height_end: float = 2.5;
	var height: float = 0;
	var unlink: float = 0.25;
	var random_position: boolean = true;
	
	var distance_foldout: boolean = false;
	var min_distance: Vector3;
	var distance_level: distance_level_enum;
	var distance_mode: distance_mode_enum;
	var distance_rotation_mode: rotation_mode_enum;
	var distance_include_scale: boolean = true;
	var distance_include_scale_group: boolean = true;
	
	var data_foldout: boolean = false;
	var mesh_length: int;
	var mesh_triangles: int;
	var mesh_combine: int;
	var mesh_size: Vector3;
	
	var objects_placed: List.<distance_class> = new List.<distance_class>();
	
	var prefilter: prefilter_class = new prefilter_class();
	
	// raycast
	var raycast: boolean = false;
	var layerMask: int;
	var ray_length: float  = 20;
	var cast_height: float = 20;
	var ray_radius: float = 1; 
	var ray_direction: Vector3 = new Vector3(0,-1,0);
	var raycast_mode: raycast_mode_enum;
	
	function tree_class(script: terraincomposer_save,new_filter: boolean)
	{
		if (new_filter)
		{
			script.add_filter(0,prefilter);
			script.filter[script.filter.Count-1].type = condition_type_enum.Random;
			script.add_subfilter(0,script.filter[script.filter.Count-1].presubfilter);
			script.subfilter[script.subfilter.Count-1].type = condition_type_enum.Random;
			script.subfilter[script.subfilter.Count-1].from_tree = true;
		}
		precolor_range.color_range[0].color_start = Color(0.75,0.75,0.75);
		precolor_range.color_range[0].color_end = Color(1,1,1);
	}
	
	function count_mesh(object1: GameObject)
	{
		if (object1)
		{
			var meshfilter: MeshFilter = object1.GetComponent(MeshFilter);
			var mesh: Mesh;
			var vertices: Vector3[];
			var triangles: int[];
			if (meshfilter){mesh = meshfilter.sharedMesh;} else {Debug.Log("meshfilter not found, cannot display data");return;}
		
			if (mesh)
			{
				vertices = mesh.vertices;
				mesh_size = mesh.bounds.size;
				triangles = mesh.triangles;
			} else {Debug.Log("mesh not found, cannot display data");return;}
			if (vertices)
			{
				mesh_length = vertices.Length;
				mesh_combine = Mathf.FloorToInt(64000/mesh_length);
				mesh_triangles = triangles.Length;
			} else {Debug.Log("vertices not found, cannot display data");}
		}
		else
		{
			mesh_combine = 0;
			mesh_size = Vector3(0,0,0);
			mesh_length = 0;
			mesh_triangles = 0;
		}
	}
}	

// grass_output_class
class grass_output_class
{
	var active: boolean = true;;
	var foldout: boolean = true;
	var color_grass: Color = Color(2,2,2,1);
	var strength: float = 1;
	// var grass_terrain: int = 0;
	var grass_text: String = "Grass:";
	var mix: List.<float> = new List.<float>();
	var mix_mode: mix_mode_enum;
	var animation_curve_math: animation_curve_math_class = new animation_curve_math_class();
	
	var curves: List.<animation_curve_class> = new List.<animation_curve_class>();
	
	var grass: List.<grass_class> = new List.<grass_class>();
	var grass_value: value_class = new value_class();
	var grass_calc: List.<float> = new List.<float>();
			
	function grass_output_class()
	{
		add_grass(0);
	}
	
	function add_grass(grass_number: int)
	{
		grass.Insert(grass_number,new grass_class());
		grass_calc.Insert(grass_number,0);
		curves.Insert(grass_number,new animation_curve_class());
		mix.Insert(grass_number,0.5);
		grass_value.add_value(grass_number,50);
		
		set_grass_curve();
		set_grass_text();
	}
	
	function erase_grass(grass_number: int)
	{
		if (grass.Count > 0)
		{
			grass.RemoveAt(grass_number);
			grass_calc.RemoveAt(grass_number);
			grass_value.erase_value(grass_number);
			mix.RemoveAt(grass_number);
			curves.RemoveAt(grass_number);
			
			set_grass_curve();
			set_grass_text();
		}
	}
	
	function clear_grass()
	{
		grass.Clear();
		grass_calc.Clear();
		grass_value.clear_value();
		mix.Clear();
		curves.Clear();
		
		set_grass_curve();
		set_grass_text();
	}
	
	function swap_grass(grass_number: int,grass_number2: int): boolean
	{
		if (grass_number2 > -1 && grass_number2 < grass.Count)
		{
			var grass2: grass_class = grass[grass_number];
			var grass_value2: float = grass_value.value[grass_number];
			var grass_active2: boolean = grass_value.active[grass_number];
			
			grass[grass_number] = grass[grass_number2];		
			grass[grass_number2] = grass2;
			
			grass_value.value[grass_number] = grass_value.value[grass_number2];
			grass_value.value[grass_number2] = grass_value2;
			
			grass_value.active[grass_number] = grass_value.active[grass_number2];
			grass_value.active[grass_number2] = grass_active2;
			
			set_grass_curve();
			return true;
		}
		return false;
	}
	
	function set_grass_curve()
	{
		var grass_length: float = curves.Count;
		var grass_off: int = 0;
		var count_grass1: int;
		var frame: Keyframe[];
		
		for (var count_grass: int = 0;count_grass < curves.Count;++count_grass)
		{
			if (!grass_value.active[count_grass]){curves[count_grass].curve = new AnimationCurve.Linear(0,0,0,0);--grass_length;}
		}
		
		if (grass_length == 1){curves[0].curve = new AnimationCurve.Linear(0,1,1,1);return;}
		
		var step: float;
		step = 1/(grass_length);
		var mix1: float;
		var mix2: float;
		
		for (count_grass = 0;count_grass < curves.Count;++count_grass)
		{
			if (!grass_value.active[count_grass]){++grass_off;continue;}
			
			count_grass1 = count_grass - grass_off;
			curves[count_grass].curve = new AnimationCurve();
			if (mix_mode == mix_mode_enum.Single)
			{
				if (count_grass1 == 0)
				{
					mix1 = (1-mix[1])*(step/2);
				}
				if (count_grass1 > 0 && count_grass1 < grass_length-1)
				{
					mix1 = (1-mix[count_grass])*(step/2);
					mix2 = (1-mix[count_grass+1])*(step/2);
				}
				
				if (count_grass1 == grass_length-1)
				{
					mix2 = (1-mix[count_grass])*(step/2);
				}
			} 
			else 
			{
				mix1 = (1-mix[0])*(step/2);
				mix2 = (1-mix[0])*(step/2);
			}
							
			if (grass_length > 1)
			{
				
				if (count_grass1 == 0)
				{
					frame = new Keyframe[3];
					frame[0] = Keyframe(0,1);
					frame[1] = Keyframe(mix1+(step/2),1);
					frame[2] = Keyframe(((step*(count_grass1+1))-mix1)+0.0000001+(step/2),0);
				}
				if (count_grass1 > 0 && count_grass1 < grass_length-1)
				{
					frame = new Keyframe[4];
					frame[0] = Keyframe(((step*(count_grass1-1))+mix1)-0.0000001+(step/2),0);
					frame[1] = Keyframe((step*count_grass1)-mix1+(step/2),1);
					if (!Mathf.Approximately((step*count_grass1)-mix1+(step/2),(step*count_grass1)+mix2+(step/2))){frame[2] = Keyframe((step*count_grass1)+mix2+(step/2),1);}
					frame[3] = Keyframe(((step*(count_grass1+1))-mix2)+0.0000001+(step/2),0);
				} 
				if (count_grass1 == grass_length-1)
				{
					frame = new Keyframe[3];
					frame[0] = Keyframe(((step*(count_grass1-1))+mix2)-0.0000001+(step/2),0);
					frame[1] = Keyframe(1-mix2-(step/2),1);
					frame[2] = Keyframe(1,1);
				}
				curves[count_grass].curve = animation_curve_math.set_curve_linear(AnimationCurve(frame));
			}
		}
	}
	
	function set_grass_text()
	{
		if (grass.Count > 1){grass_text = "Grass("+grass.Count+")";} else {grass_text = "Grass";}
	}
}

// grass_class	
class grass_class
{
	var foldout: boolean = false;
	var active: boolean = true;
	var prototypeindex: int;
	var value: float;
}

// var pointsRange: List.<object_point_class> = new List.<object_point_class>();

class object_point_class
{
	var position: Vector2;
	var object1: GameObject;
	var inRange: boolean = true;
	
	function object_point_class(_position: Vector3,_object1: GameObject) 
	{
		position = _position;
		object1 = _object1;
	}
}

// precolor_range_class	
class precolor_range_class 
{
	var foldout: boolean = true;
	var color_ranges_active: boolean = true;
	var color_ranges_foldout: boolean = true;
	var palette: boolean = false;
	// RGB output curves
	var curve_red: AnimationCurve = new AnimationCurve();
	var curve_green: AnimationCurve = new AnimationCurve();
	var curve_blue: AnimationCurve = new AnimationCurve();
	var animation_curve_math: animation_curve_math_class = new animation_curve_math_class();
	
	var interface_display: boolean = true;
	var index: int;
	var one_color: boolean = false;
	var menu_rect: Rect;
	var text: String = "Color Range:";
	var rect: Rect;
	var detect_max: int = 8;
	
	var color_range: List.<color_range_class> = new List.<color_range_class>();
	var color_range_value: value_class = new value_class();
	
	function precolor_range_class(length: int,one_color1: boolean)
	{
		for (var count: int = 0;count < length;++count)
		{
			add_color_range(count,one_color1);
		}
		one_color = one_color1;
		set_color_range_text();
		set_precolor_range_curve();
	}
	
	function add_color_range(color_range_number: int,one_color: boolean)
	{
		color_range.Insert(color_range_number,new color_range_class());
		color_range[color_range_number].one_color = one_color;
		color_range[color_range_number].select_output = color_range_number;
		color_range_value.add_value(color_range_number,50);
		
		set_precolor_range_curve();
		set_color_range_text();
	}	

	function erase_color_range(color_range_number: int)
	{
		if (color_range.Count > 0)
		{
			color_range.RemoveAt(color_range_number);
			color_range_value.erase_value(color_range_number);
			set_precolor_range_curve();
			set_color_range_text();
		}
	}
	
	function clear_color_range()
	{
		color_range.Clear();
		color_range_value.clear_value();
		set_precolor_range_curve();
		set_color_range_text();
	}
	
	function invert_color_range(color_range_number: int)
	{
		var step: float = 1.0/255.0;
		
		color_range_value.active[color_range_number] = false;
		add_color_range(color_range_number+1,false);
		add_color_range(color_range_number+1,false);
		
		if (color_range[color_range_number].color_start != Color(0,0,0))
		{
			if (color_range_number < 2){color_range[color_range_number+1].color_start = Color(0,0,0);} else {color_range[color_range_number+1].color_start = color_range[color_range_number-1].color_end+Color(step,step,step);}
			color_range[color_range_number+1].color_end = color_range[color_range_number].color_start+Color(-step,-step,-step);
		}
		if (color_range[color_range_number].color_end != Color(1,1,1))
		{
			color_range[color_range_number+2].color_start = color_range[color_range_number].color_end+Color(step,step,step);
			if (color_range.Count-1 == color_range_number+2){color_range[color_range_number+2].color_end = Color(1,1,1);} else {color_range[color_range_number+2].color_end = color_range[color_range_number+3].color_start+Color(-step,-step,-step);}
		}
	}
		
	function set_color_range_text()
	{
		text = "Color Range"+index+" ("+color_range.Count+")";
	}
	
	function swap_color(color_range_number1: int,color_range_number2: int)
	{
		var color_range2: color_range_class;
		var color_range_value2: float;
		
		if (color_range_number2 > -1 && color_range_number2 < color_range.Count)
		{
			color_range2 = color_range[color_range_number1];
			color_range[color_range_number1] = color_range[color_range_number2];
			color_range[color_range_number2] = color_range2;
			if (color_range[color_range_number1].color_color_range[0] < 1.5){color_range[color_range_number1].color_color_range += Color(1,1,1,1);}
			if (color_range[color_range_number2].color_color_range[0] < 1.5){color_range[color_range_number2].color_color_range += Color(1,1,1,1);}
			color_range_value.swap_value(color_range_number1,color_range_number2);
			set_precolor_range_curve();
		}
	}
	
	function detect_colors_image(texture: Texture2D)
	{
		var detect: int = 0;
		var color: Color;
		var count_color_range: int;
		var in_list: boolean = false;
		
		for (var y: int = 0;y < texture.height;++y)
		{
			for (var x: int = 0;x < texture.width;++x)
			{
				color = texture.GetPixel(x,y);
				in_list = false;
				for (count_color_range = 0;count_color_range < color_range.Count;++count_color_range)
				{
					if (color == color_range[count_color_range].color_start){in_list = true;} 
				}
				if (!in_list)
				{
					add_color_range(color_range.Count,true);
					color_range[color_range.Count-1].color_start = color;
					++detect;
					if (detect > detect_max-1){return;}
				}
			}		
		}
	}
	
	function set_precolor_range_curve()
	{
		curve_red = new AnimationCurve();
		curve_green = new AnimationCurve();
		curve_blue = new AnimationCurve();				
						
		var color_length: float = color_range.Count;
		if (color_length > 1)
		{
			var step: float = 1/(color_length-1);
			for (var counter: int = 0;counter < color_length;++counter)
			{	
				var number1: int;
				number1 = curve_red.AddKey(counter*step,color_range[counter].color_start.r);			
				number1 = curve_green.AddKey(counter*step,color_range[counter].color_start.g);
				number1 = curve_blue.AddKey(counter*step,color_range[counter].color_start.b);
			}
		}
		else if (color_length == 1)
		{
			curve_red.AddKey(0,color_range[0].color_start.r);
			curve_red.AddKey(1,color_range[0].color_start.r);
			curve_green.AddKey(0,color_range[0].color_start.g);
			curve_green.AddKey(1,color_range[0].color_start.g);
			curve_blue.AddKey(0,color_range[0].color_start.b);
			curve_blue.AddKey(1,color_range[0].color_start.b);
		}
		curve_red = animation_curve_math.set_curve_linear(curve_red);
		curve_green = animation_curve_math.set_curve_linear(curve_green);
		curve_blue = animation_curve_math.set_curve_linear(curve_blue);
	}
}
	
//splat_range_class
class splat_range_class
{
	var index: int;
	var range_start: Color;
	var range_end: Color;
}

// line_placement
class line_placement_class
{
	var foldout: boolean = false;
	var preimage: image_class = new image_class();
	var line_list: List.<line_list_class> = new List.<line_list_class>();
	var line_list_foldout: boolean = false;
}

class line_list_class
{
	var color: Color = Color(1,0,0);
	var foldout: boolean = false;
	var point_foldout: boolean = false;
	var point_length: int;
	var points: List.<Vector3> = new List.<Vector3>();
}
	
// object_output_class
class object_output_class
{
	var active; 
	var foldout: boolean = true;
	var color_object: Color = Color(2,2,2,1);
	var line_placement: line_placement_class;
	var object_mode: object_mode_enum;
	var icon_display: boolean = true;
	var objects_active: boolean = true;
	var objects_foldout: boolean = true;
	var strength: float = 1;
	var interface_display: boolean = true;
	var object_set: boolean = false;
	var object_text: String = "Object:";
	var scale: float = 1;
	var min_distance_x: float;
	var min_distance_z: float;
	var min_distance_x_rot: float;
	var min_distance_z_rot: float;
	var group_rotation: boolean = false;
	var group_rotation_steps: boolean = false;
	var group_rotation_step: Vector3;
	
	var objects_placed = new List.<Vector3>();
	var placed: int = 0;
	@NonSerialized var placed_reference: object_output_class;
	var objects_placed_rot = new List.<Vector3>();
	var object: List.<object_class> = new List.<object_class>();
	var object_value: value_class = new value_class();
	@NonSerialized var rotation_map: rotation_map_class = new rotation_map_class();
	
	var search_active: boolean = false;
	var search_erase_doubles: boolean = false;
	var search_object: Transform;
	
	function set_settings(object1: object_class,object_number: int,all: boolean)
	{
		for (var count_object: int = 0;count_object < object.Count;++count_object)
		{
			if (object_value.active[count_object] || all)
			{
				object[count_object].count_mesh();
				Debug.Log(object[count_object].object1.name);
				if (count_object != object_number)
				{
					object[count_object].parent = object1.parent;
					object[count_object].parent_clear = object1.parent_clear;
					object[count_object].combine = object1.combine;
					object[count_object].combine_total = object1.combine_total;
					object[count_object].place_max = object1.place_max;
					object[count_object].place_maximum = object1.place_maximum;
					object[count_object].place_maximum_total = object1.place_maximum_total;
				}
				
				if (object[count_object].color_object[0] > 0.5){object[count_object].color_object += Color(-0.5,0,-0.5,0);}
			}		
		}
	}
	
	function set_transform(object1: object_class,object_number: int,all: boolean)
	{
		for (var count_object: int = 0;count_object < object.Count;++count_object)
		{
			if (object_value.active[count_object] || all)
			{
				if (count_object != object_number)
				{
					object[count_object].scale_start = object1.scale_start;
					object[count_object].scale_end = object1.scale_end;
					object[count_object].scale_link = object1.scale_link;
					object[count_object].scale_link_start_y = object1.scale_link_start_y;
					object[count_object].scale_link_end_y = object1.scale_link_end_y;
					object[count_object].scale_link_start_z = object1.scale_link_start_z;
					object[count_object].scale_link_end_z = object1.scale_link_end_z;
					object[count_object].rotation_start = object1.rotation_start;
					object[count_object].rotation_end = object1.rotation_end;
					object[count_object].rotation_link = object1.rotation_link;
					object[count_object].rotation_link_start_y = object1.rotation_link_start_y;
					object[count_object].rotation_link_end_y = object1.rotation_link_end_y;
					object[count_object].rotation_link_start_z = object1.rotation_link_start_z;
					object[count_object].rotation_link_end_z = object1.rotation_link_end_z;
					object[count_object].terrain_height = object1.terrain_height;
					object[count_object].position_start = object1.position_start;
					object[count_object].position_end = object1.position_end;
					object[count_object].unlink_y = object1.unlink_y;
					object[count_object].unlink_z = object1.unlink_z;
					object[count_object].random_position = object1.random_position;
					object[count_object].scaleCurve = new AnimationCurve(object1.scaleCurve.keys);
					object[count_object].lookAtObject = object1.lookAtObject;
					object[count_object].includeScale = object1.includeScale;
					
					object[count_object].raycast = object1.raycast;
					object[count_object].layerMask = object1.layerMask;
					object[count_object].ray_length = object1.ray_length;
					object[count_object].cast_height = object1.cast_height;
					object[count_object].ray_radius = object1.ray_radius;
					object[count_object].ray_direction = object1.ray_direction;
					object[count_object].raycast_mode = object1.raycast_mode;
				}
				
				if (object[count_object].color_object[0] > 0.5){object[count_object].color_object += Color(-0.5,0,-0.5,0);}
			}		
		}
	}
	
	function set_rotation(object1: object_class,object_number: int,all: boolean)
	{
		for (var count_object: int = 0;count_object < object.Count;++count_object)
		{
			if (object_value.active[count_object] || all)
			{
				if (count_object != object_number)
				{
					object[count_object].rotation_steps = object1.rotation_steps;
					object[count_object].rotation_step = object1.rotation_step;
					object[count_object].rotation_map = copy_rotation_map(object1.rotation_map);
				}
				
				if (object[count_object].color_object[0] > 0.5){object[count_object].color_object += Color(-0.5,0,-0.5,0);}
			}		
		}
	}
	
	function set_distance(object1: object_class,object_number: int,all: boolean)
	{
		for (var count_object: int = 0;count_object < object.Count;++count_object)
		{
			if (object_value.active[count_object] || all)
			{
				if (count_object != object_number)
				{
					object[count_object].min_distance = object1.min_distance;
					object[count_object].distance_level = object1.distance_level;
					object[count_object].distance_mode = object1.distance_mode;
					object[count_object].distance_rotation_mode = object1.distance_rotation_mode;
					object[count_object].distance_include_scale = object1.distance_include_scale;
					object[count_object].distance_include_scale_group = object1.distance_include_scale_group;
				}
				
				if (object[count_object].color_object[0] > 0.5){object[count_object].color_object += Color(-0.5,0,-0.5,0);}
			}		
		}
	}
	
	function swap_object(object_number: int,object_number2: int)
	{
		if (object_number2 > -1 && object_number2 < object.Count)
		{
			var object2: object_class = object[object_number];
			var object_value2: float = object_value.value[object_number];
			var object_active2: boolean = object_value.active[object_number];
			
			object[object_number] = object[object_number2];		
			object[object_number2] = object2;
			if (object[object_number].color_object[0] > 0.5){object[object_number].color_object += Color(-0.5,0,-0.5,0);}
			if (object[object_number2].color_object[0] > 0.5){object[object_number2].color_object += Color(-0.5,0,-0.5,0);}
			object_value.value[object_number] = object_value.value[object_number2];
			object_value.value[object_number2] = object_value2;
			object_value.active[object_number] = object_value.active[object_number2];
			object_value.active[object_number2] = object_active2;
			object_value.calc_value();
		}
	}

	function set_object_text()
	{
		if (object.Count > 1){object_text = "Objects("+object.Count+")";} else {object_text = "Object";}
	}
	
	function copy_rotation_map(rotation_map: rotation_map_class): rotation_map_class
	{
		var rotation_map2: rotation_map_class;
		
		var object: GameObject = new GameObject();
		var script3: save_template = object.AddComponent(save_template);
		
		script3.rotation_map = rotation_map;
		
		var object2: GameObject = GameObject.Instantiate(object);
		GameObject.DestroyImmediate(object);
		script3 = object2.GetComponent(save_template);
		rotation_map2 = script3.rotation_map;
		GameObject.DestroyImmediate(object2);
		
		return rotation_map2;
	}
}

// object_class
class object_class
{
	var foldout: boolean = false;
	var prefab: boolean = false;
	var data_foldout: boolean = false;
	var transform_foldout: boolean = false;
	var settings_foldout: boolean = false;
	var distance_foldout: boolean = false;
	var rotation_foldout: boolean = false;
	var rotation_map_foldout: boolean = false;
	var random_position: boolean = true;
	var lookAtObject: Transform;
	var includeScale: boolean = false;
	var object1: GameObject;
	var object2: GameObject;
	var name: String;
	var equal_density: boolean = true;
	var color_object: Color = Color(2,2,2,1);
	
	// settings
	var parent: Transform;
	var parent_clear: boolean = true;
	var parent_name: String;
	var combine: boolean = false;
	var combine_total: boolean = true;
	var place_max: int = 1;
	var place_maximum: boolean = false;
	var place_maximum_total: boolean = false;
	
	var parent_set: boolean = false;
	
	// transform
	var scale_start: Vector3 = Vector3(1,1,1);
	var scale_end: Vector3 = Vector3(1,1,1);
	var unlink_y: float = 0.25;
	var unlink_z: float = 0.25;
	var unlink_foldout: boolean = false;
	var scale_link: boolean = true;
	var scale_link_start_y: boolean = true;
	var scale_link_end_y: boolean = true;
	var scale_link_start_z: boolean = true;
	var scale_link_end_z: boolean = true;
	var scaleCurve: AnimationCurve = new AnimationCurve().Linear(0,0,1,1);
	var rotation_start: Vector3 = Vector3(0,0,0);
	var rotation_end: Vector3 = Vector3(0,0,0);
	var rotation_link: boolean = false;
	var rotation_link_start_y: boolean = false;
	var rotation_link_end_y: boolean = false;
	var rotation_link_start_z: boolean = false;
	var rotation_link_end_z: boolean = false;
	var position_start: Vector3 = Vector3(0,0,0);
	var position_end: Vector3 = Vector3(0,0,0);
	var terrain_height: boolean = true;
	var terrain_rotate: boolean = false;
	// var placeInside: boolean = true;
	
	var scale_steps: boolean = false;
	var scale_step: Vector3;
	var position_steps: boolean;
	var position_step: Vector3;
	var parent_rotation: Vector3;
	var look_at_parent: boolean = false;
	
	// rotation
	var rotation_steps: boolean = false;
	var rotation_step: Vector3;
	@NonSerialized var rotation_map: rotation_map_class = new rotation_map_class();
	
	// distance
	var min_distance: Vector3;
	var distance_level: distance_level_enum;
	var distance_mode: distance_mode_enum;
	var distance_rotation_mode: rotation_mode_enum;
	var distance_include_scale: boolean = true;
	var distance_include_scale_group: boolean = true;
	
	var objects_placed: List.<distance_class> = new List.<distance_class>();
	
	var placed: int = 0;
	@NonSerialized var placed_reference: object_class;
	
	var placed_prelayer: int = 0;
	
	var mesh_length: int;
	var mesh_triangles: int;
	var mesh_combine: int;
	var mesh_size: Vector3;
	var object_material: material_class = new material_class();
	var combine_parent: GameObject;
	var combine_parent_name: String = "";
	var combine_parent_name_input: boolean = false;
	
	var value: float;
	
	var prelayer_index: int;
	var prelayer_created: boolean = false;
	var swap_text: String = "S";
	var swap_select: boolean = false;
	var copy_select: boolean = false;
	@NonSerialized var object_child: List.<object_class> = new List.<object_class>();
	
	var preview_texture: Texture2D;
	
	var pivot_center: boolean = false;
	
	// raycast
	var raycast: boolean = false;
	var layerMask: int;
	var ray_length: float  = 20;
	var cast_height: float = 20;
	var ray_radius: float = 1; 
	var ray_direction: Vector3 = new Vector3(0,-1,0);
	var raycast_mode: raycast_mode_enum;
	
	var objectStream: boolean = false;
	var objectIndex: int = 0;
	
	var slopeY: float = 0;
	var sphereOverlapRadius: float = 0;
	var sphereOverlapHeight: float = 0;
	
	function count_mesh()
	{
		if (object1)
		{
			var meshfilter: MeshFilter = object1.GetComponent(MeshFilter);
			var mesh: Mesh;
			var vertices: Vector3[];
			var triangles: int[];
			if (meshfilter){mesh = meshfilter.sharedMesh;} else {}
		
			if (mesh)
			{
				vertices = mesh.vertices;
				mesh_size = mesh.bounds.size;
				triangles = mesh.triangles;
			} else {}
			if (vertices)
			{
				mesh_length = vertices.Length;
				mesh_combine = Mathf.FloorToInt(63000/mesh_length);
				mesh_triangles = triangles.Length;
			} else {}
		}
		else
		{
			mesh_combine = 0;
			mesh_size = Vector3(0,0,0);
			mesh_length = 0;
			mesh_triangles = 0;
		}
	}
}

class distance_class
{
	var position: Vector3;
	var rotation: Vector3;
	var min_distance: Vector3;
	var min_distance_rotation_group: Vector3;
	
	var distance_mode: distance_mode_enum;
	var distance_rotation: rotation_mode_enum;
	
	var rotation_group: boolean = false;
}

class rotation_map_class
{
	var active: boolean = false;
	var preimage: image_class = new image_class();
	
	function calc_rotation(color: Color): float
	{
		if (color == Color(1,1,1)){return 0;}
		// Debug.Log((-color.r*255)+(-color.g*255)+(-color.b));
		return ((-color.r*255)+(-color.g*255)+(-color.b));
	}
}

// animation_curve_class
class animation_curve_class
{
	var curve_in_memory: boolean = false;
	var curve_text: String = "Curve";
	var menu_rect: Rect;
	var curve: AnimationCurve = new AnimationCurve();
	var default_curve: AnimationCurve = new AnimationCurve();
	var abs: boolean = false;
	var type: curve_type_enum;
	var active: boolean = true;
	
	var settings_foldout: boolean = true;
	var frequency: float = 256;
	var offset: Vector2;
	var offset_range: Vector2 = Vector2(5,5);
	var offset_middle: Vector2;
	var detail: int = 1;
	var detail_strength: float = 2;
	var pivot: Transform;
	var strength: float = 1;
	
	var rotation: boolean = false;
	var rotation_value: float;
	
	function set_zero()
	{
		curve = new AnimationCurve().Linear(0,0,1,0);
	}
	
	function set_invert()
	{
		var curve3: AnimationCurve = new AnimationCurve();
		for (var counter: int = 0;counter < curve.keys.Length;++counter)
		{
			var key: Keyframe = curve.keys[counter];
			key.value = 1 - key.value;
			var intangent: float = key.inTangent;
			key.inTangent = key.inTangent*-1;
			key.outTangent = key.outTangent*-1;
			curve3.AddKey(key);
		}
		curve = new AnimationCurve(curve3.keys);
	}
	
	function set_default()
	{
		curve = new AnimationCurve(default_curve.keys);
	}
	
	function set_as_default()
	{
		default_curve = new AnimationCurve(curve.keys);
	}
	
		function default_normal()
	{
		curve = new AnimationCurve().Linear(0,0,1,1);
		type = curve_type_enum.Normal;
	}
	
	function default_random()
	{
		curve = new AnimationCurve().Linear(0,0,1,0);
		type = curve_type_enum.Random;
	}
	
	function default_perlin()
	{
		curve = new AnimationCurve().Linear(0,1,1,1);
		type = curve_type_enum.Perlin;
		frequency = 256;
		offset = Vector2(0,0);
		offset_middle = Vector2(0,0);
		detail = 7;
		detail_strength = 2;
		abs = false; 
	}
	
	function change_key(time: float,value: float)
	{
		if (curve.AddKey(time,value) == -1)
		{
			var keys: Keyframe[] = curve.keys;
			for (var count: int = 0;count < curve.keys.Length;++count)
			{
				if (keys[count].time == time){keys[count].value = value;}
			}
			curve = new AnimationCurve(keys);
		}
	}
	
	function set_curve_linear()
	{
		var curve3: AnimationCurve = new AnimationCurve();
		for (var count_key: int = 0;count_key < curve.keys.Length;++count_key)
		{
			var intangent: float = 0;
			var outtangent: float = 0;
			var intangent_set: boolean = false;
			var outtangent_set: boolean = false;
			var point1: Vector2;
			var point2: Vector2;
			var deltapoint: Vector2;
			var key: Keyframe = curve[count_key];
			
			if (count_key == 0){intangent = 0;intangent_set = true;}
			if (count_key == curve.keys.Length -1){outtangent = 0;outtangent_set = true;}
			
			if (!intangent_set)
			{
				point1.x = curve.keys[count_key-1].time;
				point1.y = curve.keys[count_key-1].value;
				point2.x = curve.keys[count_key].time;
				point2.y = curve.keys[count_key].value;
					
				deltapoint = point2-point1;
				
				intangent = deltapoint.y/deltapoint.x;
			}
			if (!outtangent_set)
			{
				point1.x = curve.keys[count_key].time;
				point1.y = curve.keys[count_key].value;
				point2.x = curve.keys[count_key+1].time;
				point2.y = curve.keys[count_key+1].value;
					
				deltapoint = point2-point1;
						
				outtangent = deltapoint.y/deltapoint.x;
			}
					
			key.inTangent = intangent;
			key.outTangent = outtangent;
			curve3.AddKey(key);
		}
		curve = curve3;
	}
}

class animation_curve_math_class
{
	function set_curve_linear(curve: AnimationCurve): AnimationCurve
	{
		var curve3: AnimationCurve = new AnimationCurve();
		for (var count_key: int = 0;count_key < curve.keys.Length;++count_key)
		{
			var intangent: float = 0;
			var outtangent: float = 0;
			var intangent_set: boolean = false;
			var outtangent_set: boolean = false;
			var point1: Vector2;
			var point2: Vector2;
			var deltapoint: Vector2;
			var key: Keyframe = curve[count_key];
			
			if (count_key == 0){intangent = 0;intangent_set = true;}
			if (count_key == curve.keys.Length -1){outtangent = 0;outtangent_set = true;}
			
			if (!intangent_set)
			{
				point1.x = curve.keys[count_key-1].time;
				point1.y = curve.keys[count_key-1].value;
				point2.x = curve.keys[count_key].time;
				point2.y = curve.keys[count_key].value;
					
				deltapoint = point2-point1;
				
				intangent = deltapoint.y/deltapoint.x;
			}
			if (!outtangent_set)
			{
				point1.x = curve.keys[count_key].time;
				point1.y = curve.keys[count_key].value;
				point2.x = curve.keys[count_key+1].time;
				point2.y = curve.keys[count_key+1].value;
					
				deltapoint = point2-point1;
						
				outtangent = deltapoint.y/deltapoint.x;
			}
					
			key.inTangent = intangent;
			key.outTangent = outtangent;
			curve3.AddKey(key);
		}
		return curve3;
	}

}

class value_class
{
	// old
	var value: List.<float> = new List.<float>();
	var value_multi: List.<Vector2> = new List.<Vector2>();
	var select_value: List.<float> = new List.<float>();
	var active: List.<boolean> = new List.<boolean>();
	var rect: List.<Rect> = new List.<Rect>();
	var text: List.<String> = new List.<String>();
	var value_active: boolean = true;
	var value_total: float;
	var active_total: int;
	var curve: AnimationCurve = new AnimationCurve();
	var animation_curve_math: animation_curve_math_class = new animation_curve_math_class();
	var mode: SliderMode_Enum;
	
	// new
	// var value1: List.<value1_class> = new List.<value1_class>();
	
//	function convert_old(length: int)
//	{
//		var convert: boolean = false;
//		
//		if (value1.Count < length){convert = true;}
//		
//		while (value1.Count < length) {
//			value1.Add(value1_class());
//		}
//		
//		if (convert) {
//			for (var count_value: int = 0;count_value < value.Count;++count_value) {
//				value1[count_value].value = value[count_value];
//				if (count_value < value_multi.Count) {
//					Debug.Log(count_value+" value1: "+value1.Count+" value_multi: "+value_multi.Count);
//					value1[count_value].value_multi = value_multi[count_value]; 
//				}
//				if (count_value < select_value.Count) {
//					value1[count_value].select_value = select_value[count_value];
//				}
//				value1[count_value].active = active[count_value];
//				value1[count_value].text = text[count_value];
//			}
//		}
//	}
	function calc_active_total() 
	{
		active_total = 0;
		
		for (var i: int = 0;i < value.Count;++i)
		{
			if (active[i]){value_total += value[i];++active_total;}
		}
	}
	
	function calc_index(index: int)
	{
		var tIndex: int = 0;
		
		for (var i: int = 0;i < index;++i) {
			if (active[i]){++tIndex;}
		}
		return tIndex;
	}
	
	function set_values(value_index: int)
	{
		if (mode == SliderMode_Enum.One){calc_value();} else {set_value_multi(value_index);}
	}
	
	function Active(index: int)
	{
		// if (mode == SliderMode_Enum.One) return;
		return;
//		if (active[index]) {
//			value_multi[index] = new Vector2(GetPreviousValue(index),GetNextValue(index));
//		}
//		else {
//			var index2 = GetPreviousIndex(index);
//			if (index2 >= 0) value_multi[index2] = new Vector2(value_multi[index2].x,GetNextValue(index2));
//			// index2 = GetNextIndex(index);
//			// if (index2 < value.Count) value_multi[index2] = new Vector2(value_multi[index2].x,GetPreviousValue(index2));
//		}
	} 
	
	function GetPreviousValue(index: int): float
	{
		var v: float = 0;
		
		for (var i: int = index-1;i >= 0;--i) {
			if (active[i]) {v = value_multi[i].y;break;}
		}
		
		return v;
	}
	
	function GetPreviousIndex(index: int): int
	{
		for (var i: int = index-1;i >= 0;--i) {
			if (active[i]) {return i;}
		}
		return -1;
	}
	
	function GetNextValue(index: int)
	{
		var v: float = 0;
		
		for (var i: int = index+1;i < value.Count;++i) {
			if (active[i]) {v = value_multi[i].x;break;}
		}
		
		return v;
	}
	
	function GetNextIndex(index: int)
	{
		for (var i: int = index+1;i < value.Count;++i) {
			if (active[i]) return i;
		}
		
		return value.Count;
	}
	
	function calc_value()
	{
		value_total = 0;
		var value2: float = 0;
		var i: int;
		
		calc_active_total();
		
		var keys: Keyframe[] = new Keyframe[active_total+1];
		var count_active: int;
		
		count_active = 0;
		
		if (mode == SliderMode_Enum.One)
		{
			for (i = 0;i < value.Count;++i)
			{
				if (active[i])
				{
					keys[count_active].value = ((1.0/(active_total*1.0))*(count_active+1));
					keys[count_active].time = value2+(value[i]/value_total);
					select_value[i] = ((value2*2)+(value[i]/value_total))/2;
					
					text[i] = "("+value2.ToString("F2")+"-"+keys[count_active].time.ToString("F2")+")";
					
					value2 = keys[count_active].time;
					++count_active;
				} else {text[i] = "(- )";}
			}
		}
		else
		{	
			for (i = 0;i < value.Count;++i)
			{
				if (active[i])
				{
					keys[count_active].value = ((1.0/(active_total*1.0))*(count_active+1));
					keys[count_active].time = value_multi[i].y/100;
					
					if (keys[count_active].time == value2)
					{
						if (keys[count_active].time >= 1)
						{
							keys[count_active-1].time -= 0.01;
						}
						else
						{
							keys[count_active].time += 0.01;
						}
					}
					
					text[i] = "("+value2.ToString("F2")+"-"+keys[count_active].time.ToString("F2")+")";
					
					value2 = keys[count_active].time;
					++count_active;
				}else {text[i] = "(- )";}
			}
		}
		
		curve = animation_curve_math.set_curve_linear(new AnimationCurve(keys));
	}
	
	function set_value_multi(index: int)
	{
		// return;
		if (value.Count == 0){return;}
		calc_active_total();
		
		if (value_multi[index].y < value_multi[index].x) {
			value_multi[index] = Vector2(value_multi[index].x,value_multi[index].x+0.5);
		}
		
		// Debug.Log("Called "+index);									
			
		var i: int;
		var count_not_active: int = 0;
			
		for (i = 0;i < value.Count;++i)
		{
			if (!active[i] && i > 0){++count_not_active;continue;}
			if (i > index) {
				value_multi[i] = Vector2(value_multi[i-1-count_not_active].y,value_multi[i].y);	
				// Debug.Log("index: "+(i-1-count_not_active));
				if (value_multi[i].x > value_multi[i].y) {
					value_multi[i] = Vector2(value_multi[i].x,value_multi[i].x+0.5);
				}
			}
			
			count_not_active = 0;
		}									
		
		count_not_active = 0;
		
		if (index > 0)
		{
			for (i = index-1;i >= 0;--i)
			{
				if (!active[i]){++count_not_active;continue;}
				value_multi[i] = Vector2(value_multi[i].x,value_multi[i+1+count_not_active].x);	
				if (value_multi[i].y < value_multi[i].x)
				{
					value_multi[i] = Vector2(value_multi[i].y-0.5,value_multi[i].y);
				}
				count_not_active = 0;
			}
		}
		
		var count_active: int = 0;
		
		for (i = 0;i < value.Count;++i)
		{
			if (active[i])
			{
				if (count_active == 0){value_multi[i] = Vector2(0,value_multi[i].y);}
				if (count_active == active_total-1){value_multi[i] = Vector3(value_multi[i].x,100);}
				++count_active;
			}
			else
			{ 
				// value1[i].value_multi = Vector2(0,0);
			}
		}
		
		calc_value();
	}
	
	function reset_values()
	{
		if (mode == SliderMode_Enum.One)
		{
			for (var i: int = 0;i < value.Count;++i) {
				value[i] = 50;
			}
		}
		else {
			reset_value_multi();
		}
		
		calc_value();
	}
	
	function reset_value_multi()
	{
		var count_not_active: int = 0;
		var count_active: int = 0;
		var range: Vector2;
			
		calc_active_total();
			
		if (active_total == 0){return;}
			
		for (var i: int = 0;i < value.Count;++i)
		{
			if (active[i])
			{
				if (count_active == 0){range.x = 0;} else {range.x = value_multi[i-1-count_not_active].y;}
				range.y = range.x+(100.0/active_total);
				if (count_active == active_total)
				{
					range.y = 100;
				}
				
				value_multi[i] = range;
				count_not_active = 0;
				++count_active;
			}
			else
			{
				++count_not_active;
			}
		}
	}
	
	function reset_single_value(index: int)
	{
		if (mode == SliderMode_Enum.One)
		{
			value[index] = 50;
			calc_value();
		}
		else
		{
			if (!active[index]){return;}
			
			calc_active_total();
			var index2: int = calc_index(index);
			
			value_multi[index] = Vector2((1.0/active_total)*index2*100,(((1.0/active_total)*index2)+(1.0/active_total))*100);
			
			set_value_multi(index);
		}
	}
	
	function change_value_active(invert: boolean)
	{
		for (var i: int = 0;i < value.Count;++i)
		{
			if (!invert)
			{
				active[i] = value_active;
			}
			else
			{
				active[i] = !active[i];
			}
		}
		
		set_values(0);
	}
	
	function add_value(index: int,number: float)
	{
		// value1.Insert(index,value1_class());
		
		value.Insert(index,number);
		if (index > 0){value_multi.Insert(index,new Vector2(100,100));} else {value_multi.Insert(index,new Vector2(0,100));}
		rect.Insert(index,new Rect());
		select_value.Insert(index,0);
		active.Insert(index,true);
		text.Insert(index,"");
		
		calc_value();
	}
	
	function erase_value(index: int)
	{
		value.RemoveAt(index);
		rect.RemoveAt(index);
		value_multi.RemoveAt(index);
		select_value.RemoveAt(index);
		active.RemoveAt(index);
		text.RemoveAt(index);
		
		if (value.Count > 0) {set_values(0);}
	}
	
	function clear_value()
	{
		value.Clear();
		rect.Clear();
		value_multi.Clear();
		select_value.Clear();
		active.Clear();
		text.Clear();
	}
	
	function SyncValueMulti()
	{
		var length: int = value.Count-value_multi.Count;
		
		for (var i: int = 0;i < length;++i) {
			if (i > 0){value_multi.Add(new Vector2(100,100));} else {value_multi.Add(new Vector2(0,100));}
			rect.Add(new Rect());
		}
		
		if (length != 0) reset_value_multi();
	}
	
	function swap_value(index1: int,index2: int) 
	{ 
		var value0: float = value[index1];
		// var value_multi0: Vector2 = value_multi[index1];
		var select_value0: float = select_value[index1];
		var active0: boolean = active[index1];
		
		value[index1] = value[index2];
		// value_multi[index1] = value_multi[index2];
		select_value[index1] = select_value[index2];
		active[index1] = active[index2];
		
		value[index2] = value0;
		// value_multi[index2] = value_multi0;
		select_value[index2] = select_value0;
		active[index2] = active0;
		
		calc_value();
	}
}

class value_class2
{
	var value: List.<float> = new List.<float>();
	var select_value: List.<float> = new List.<float>();
	var active: List.<boolean> = new List.<boolean>();
	var text: List.<String> = new List.<String>();
	var value_total: float;
	var active_total: int;
	var curve: AnimationCurve = new AnimationCurve();
	var animation_curve_math: animation_curve_math_class = new animation_curve_math_class();
	
	function calc_value()
	{
		if (select_value.Count < value.Count)
		{
			select_value_init();
		}
		
		value_total = 0;
		active_total = 0;
		var value2: float = 0;
		
		for (var count_value: int = 0;count_value < value.Count;++count_value)
		{
			if (active[count_value]){value_total += value[count_value];++active_total;}
		}
		var keys: Keyframe[] = new Keyframe[active_total+1];
		var count_active: int = 0;
		for (count_value = 0;count_value < value.Count;++count_value)
		{
			if (active[count_value])
			{
				keys[count_active].value = ((1.0/(active_total*1.0))*(count_active+1));
				keys[count_active].time = value2+(value[count_value]/value_total);
				select_value[count_value] = ((value2*2)+(value[count_value]/value_total))/2;
				text[count_value] = "(V "+value2.ToString("F2")+"-"+keys[count_active].time.ToString("F2")+")";
				value2 = keys[count_active].time;
				++count_active;
			} else {text[count_value] = "(V - )";}
		}
		
		curve = animation_curve_math.set_curve_linear(new AnimationCurve(keys));
	}
	
	function add_value(value_index: int,number: float)
	{
		if (select_value.Count < value.Count)
		{
			var difference: int = value.Count-select_value.Count;
			
			for (var count_select_value: int = 0;count_select_value < difference;++count_select_value)
			{
				select_value.Add(0);
			}
		}
		value.Insert(value_index,number);
		select_value.Insert(value_index,0);
		text.Insert(value_index,String.Empty);
		active.Insert(value_index,true);
		calc_value();
	}
	
	function erase_value(value_index: int)
	{
		value.RemoveAt(value_index);
		if (value_index < select_value.Count){select_value.RemoveAt(value_index);}
		text.RemoveAt(value_index);
		active.RemoveAt(value_index);
		calc_value();
	}
	
	function clear_value()
	{
		value.Clear();
		select_value.Clear();
		text.Clear();
		active.Clear();
	}
	
	function swap_value(value_number1: int,value_number2: int) 
	{
		if (select_value.Count < value.Count)
		{
			select_value_init();
		}
		
		var value2: float = value[value_number1];
		var active2: boolean = active[value_number1];
		var select2: float = select_value[value_number1];
		
		value[value_number1] = value[value_number2];
		value[value_number2] = value2;
		
		active[value_number1] = active[value_number2];
		active[value_number2] = active2;
		
		select_value[value_number1] = select_value[value_number2];
		select_value[value_number2] = select2;
		
		calc_value();
	}
	
	function select_value_init()
	{
		var difference: int = value.Count-select_value.Count;
			
		for (var count_select_value: int = 0;count_select_value < difference;++count_select_value)
		{
			select_value.Add(0);
		}
	}
}


class material_class
{
	var active: boolean = false;
	var foldout: boolean = false;
	var material: List.<Material> = new List.<Material>();
	var combine_count: List.<int> = new List.<int>();
	var combine_parent: List.<GameObject> = new List.<GameObject>();
	
	var material_value: value_class = new value_class();
	
	function material_class()
	{
		add_material(0);
	}
	
	function set_material(object: GameObject,material_number: int): int
	{
		var meshrenderer: MeshRenderer = object.GetComponent(MeshRenderer);
		
		var number: float = UnityEngine.Random.Range(0.0,1.0);
		material_number = Mathf.FloorToInt(material_value.curve.Evaluate(number)*material.Count);
		if (material_number > material.Count-1){material_number = material.Count-1;}
		if (!material[material_number]){return;}
		if (meshrenderer)
		{
			if (meshrenderer.sharedMaterials.Length == 0)
			{
				return 0;
			}
			meshrenderer.sharedMaterial = material[material_number];
			return material_number;
		} 
		else {return 0;}
	}
	
	function add_material(index: int)
	{
		var material1: Material = null;
		var object: GameObject = null;
		material.Insert(index,material1);
		material_value.add_value(index,50);
		combine_count.Insert(index,0);
		combine_parent.Insert(index,object);
	}
	
	function erase_material(index: int)
	{
		if (material.Count > 0)
		{
			material.RemoveAt(index);
			material_value.erase_value(index);
			combine_count.RemoveAt(index);
			combine_parent.RemoveAt(index);
		}
	}
	
	function clear_material()
	{
		material.Clear();
		material_value.clear_value();
		combine_count.Clear();
		combine_parent.Clear();
	}
}

// prefilter_class
class prefilter_class 
{
	var filter_text: String = "Filter (1)";
	var foldout: boolean = true;
	var filter_index: List.<int> = new List.<int>();
	var filters_active: boolean = true;
	var filters_foldout: boolean = true;
	
	function set_filter_text()
	{
		if (filter_index.Count < 2){filter_text = "Filter ("+filter_index.Count+")";} else {filter_text = "Filters ("+filter_index.Count+")";}
	}

}	

// image_class
class image_class
{
	var precolor_range: precolor_range_class = new precolor_range_class(0,false);
	
	var settings_foldout: boolean = false;
	var image_number: int = 0;
	var image: List.<Texture2D> = new List.<Texture2D>();
	var texture: Texture2D;
	var tile_offset: boolean = false;
	var image_color: Color = Color.white;
	var image_curve: AnimationCurve;
	var splatmap: boolean = false;
	var includeAlpha: boolean = true;
	var flip_x: boolean = false;
	var flip_y: boolean = false;
	var clamp: boolean = false;
	var list_length: int = 1;
	var list_row: int = 4;
	var image_list_mode: list_condition_enum;
	var image_mode: image_mode_enum;
	var select_mode: select_mode_enum;
	var import_max_size: int;
	var import_max_size_list: int = 0;
	var short_list: boolean = false;
	
	var image_auto_scale: boolean = true;
	var conversion_step: Vector2 = Vector2(1,1);
	var tile_x: float = 1;
	var tile_y: float = 1;
	var tile_offset_x: float = 0;
	var tile_offset_y: float = 0;
	var rgb: boolean = true;
	var rotation: boolean = false;
	var rotation_value: float = 0;
	var output: boolean;
	var output_pos: float;
	var output_alpha: float;
	var edge_blur: boolean = false;
	var edge_blur_radius: float = 1;
	
	var alpha: float;
	
	var auto_search: auto_search_class = new auto_search_class();
	
	function image_class()
	{
		image.Add(texture);
		auto_search.extension = ".png";
	}
	
	function set_image_auto_tile(preterrain: terrain_class)
	{
		
	}
	
	function adjust_list()
	{
		var delta_list: int = list_length-image.Count;
		var count_image: int;
		
		if (delta_list > 0)
		{
			for (count_image = 0;count_image < delta_list;++count_image)
			{
				image.Add(new Texture2D(1,1));		
			}
		}
		if (delta_list < 0)
		{
			delta_list *= -1;
			for (count_image = 0;count_image < delta_list;++count_image)
			{
				image.RemoveAt(image.Count-1);
			}
		}
	}
	
	function set_image_auto_scale(preterrain1: terrain_class,area: Rect,image_number: int)
	{
		if (image_number < image.Count)
		{
			if (image[image_number] && preterrain1)
			{
				if (image_mode == image_mode_enum.Area)
				{
					conversion_step.x = area.width/(image[image_number].width-1);
					conversion_step.y = area.height/(image[image_number].height-1); 
				}
				else if (image_mode == image_mode_enum.Terrain)
				{
					if (preterrain1.terrain)
					{
						conversion_step.x = preterrain1.terrain.terrainData.size.x/(image[image_number].width-1);
						conversion_step.y = preterrain1.terrain.terrainData.size.z/(image[image_number].height-1);
					}
				}
				else if (image_mode == image_mode_enum.MultiTerrain)
				{
					conversion_step.x = (preterrain1.terrain.terrainData.size.x*preterrain1.tiles.x)/(image[image_number].width-1);
					conversion_step.y = (preterrain1.terrain.terrainData.size.z*preterrain1.tiles.y)/(image[image_number].height-1);
				}
			}
		}
	}
}
	
// filter_class
class filter_class 
{ 
	var active: boolean = true;
	var foldout: boolean = false;
	var curve_foldout: boolean = true;
	var color_filter: Color = Color(1.5,1.5,1.5,1);
	var strength: float = 1;
	var length: int = 1;
	var linked: boolean = true;
	var device: filter_devices_enum;
	var type: condition_type_enum;
	var type2: device2_type_enum;
	var change_mode: change_mode_enum;
	var raw: raw_class;
	var combine: boolean = false;
	
	var last_value_x: float[];
	var last_value_y: float[];
	var last_pos_x: float = 4097;
	var smooth_y: boolean = false;
	var last_value_declared: boolean = false;
	
	var preimage: image_class = new image_class();
	var lerp_color_old: Color;
	
	var precurve_x_left: animation_curve_class = new animation_curve_class();
	var precurve_x_right: animation_curve_class = new animation_curve_class();
	var precurve_y: animation_curve_class = new animation_curve_class();
	var precurve_z_left: animation_curve_class = new animation_curve_class();
	var precurve_z_right: animation_curve_class = new animation_curve_class();
	
	var curve_x_left_menu_rect: Rect;
	var curve_x_right_menu_rect: Rect;
	var curve_y_menu_rect: Rect;
	var curve_z_left_menu_rect: Rect;
	var curve_z_right_menu_rect: Rect;
	
	var precurve_list: List.<animation_curve_class> = new List.<animation_curve_class>();
	var precurve: animation_curve_class = new animation_curve_class();
	var curve_position: float;
	var prerandom_curve: animation_curve_class = new animation_curve_class();
	var output: condition_output_enum;
	var range_start: float;
	var range_end: float;
	var swap_text: String = "S";
	var swap_select: boolean = false;
	var copy_select: boolean = false;
	
	var color_output_index: int = 0;
	
	var splat_range_length: int;
	var splat_range_foldout: boolean = false;
	var splat_range: splat_range_class[] = new splat_range_class[0];
	
	var presubfilter: presubfilter_class = new presubfilter_class();
	var sub_strength_set: boolean = false;
	
	var preview_texture: Texture2D;
	
	// splatmap
	var splatmap: int = 0;
	var splat_index: int = 0;
	
	// raycast
	var layerMask: int;
	var cast_height: float = 20;
	var ray_length: float = 20;
	var ray_radius: float = 1;
	var ray_direction: Vector3 = new Vector3(0,-1,0);
	var raycast_mode: raycast_mode_enum;
	
	function filter_class()
	{
		precurve_list.Add(new animation_curve_class());
		precurve_list[0].curve = new AnimationCurve().Linear(0,0,1,1);
		precurve_list.Add(new animation_curve_class());
		precurve_list[0].default_curve = new AnimationCurve(precurve_list[0].curve.keys);
		precurve_list[1].curve = new AnimationCurve().Linear(0,0,1,0);
		precurve_list[1].default_curve = new AnimationCurve(precurve_list[1].curve.keys);
		precurve_list[1].active = false;
		precurve_list[1].type = curve_type_enum.Random;
		
		precurve_x_left.curve = new AnimationCurve.Linear(-1,1,0,0);
		precurve_x_left.default_curve = new AnimationCurve(precurve_x_left.curve.keys);
		precurve_x_right.curve = new AnimationCurve.Linear(0,0,1,1);
		precurve_x_right.default_curve = new AnimationCurve(precurve_x_right.curve.keys);
		precurve_y.curve = new AnimationCurve().Linear(0,0,1,0);
		precurve_y.default_curve = new AnimationCurve(precurve_y.curve.keys);
		precurve_z_left.curve = new AnimationCurve.Linear(-1,1,0,0);
		precurve_z_left.default_curve = new AnimationCurve(precurve_z_left.curve.keys);
		precurve_z_right.curve = new AnimationCurve.Linear(0,0,1,1);
		precurve_z_right.default_curve = new AnimationCurve(precurve_z_right.curve.keys);
	}
} 

// presubfilter_class
class presubfilter_class
{
	var subfilter_text: String = "Masks (0)";
	var foldout: boolean = true;
	var subfilters_active: boolean = true;
	var subfilters_foldout: boolean = true;
	var subfilter_index: List.<int> = new List.<int>();
	
	function set_subfilter_text()
	{
		var length: int = subfilter_index.Count;
		if (length > 1){subfilter_text = "Masks ("+length+")";} else {subfilter_text = "Mask ("+length+")";}
	}
}
	
// subfilter_class
class subfilter_class
{
	var active: boolean = true;
	var foldout: boolean;
	var color_subfilter = Color(1.5,1.5,1.5,1);
	var linked: boolean = true;
	var type: condition_type_enum;
    var output: subfilter_output_enum;
    var output_max: int = 1;
    var output_count: int;
    var output_count_min: float = 0.5;
	var strength: float = 1;
	var range_start: float = 0;
	var range_end: float = 0;
	var range_count: int = 0;
	var preimage: image_class = new image_class();
	var precolor_range: precolor_range_class = new precolor_range_class(0,false);
	var precurve_list: List.<animation_curve_class> = new List.<animation_curve_class>();
	var precurve: animation_curve_class = new animation_curve_class();
	var curve_menu_rect: Rect;
	var curve_inv: boolean = false;
	var curve_position: float;
	var prerandom_curve: animation_curve_class = new animation_curve_class();
	var random_curve_menu_rect: Rect;
	var random_curve_inv: boolean = false;
	var swap_text: String = "S";
	var swap_select: boolean = false;
	var copy_select: boolean = false;
	var from_tree: boolean = false;
	
	var raw: raw_class;
	
	var mode: subfilter_mode_enum = subfilter_mode_enum.strength;	
	var smooth: boolean = false;
	var smooth_method: smooth_method_enum;
	
	// splatmap
	var splatmap: int = 0;
	var splat_index: int = 0;
	
	// raycast
	var layerMask: int;
	var cast_height: float = 20;
	var ray_length: float = 20;
	var ray_radius: float = 1;
	var ray_direction: Vector3 = new Vector3(0,-1,0);
	var raycast_mode: raycast_mode_enum;
	
	function subfilter_class()
	{
		precurve_list.Add(new animation_curve_class());
		precurve_list[0].curve = new AnimationCurve().Linear(0,0,1,1);
		precurve_list[0].default_curve = new AnimationCurve(precurve_list[0].curve.keys);
		precurve_list.Add(new animation_curve_class());
		precurve_list[1].curve = new AnimationCurve().Linear(0,0,1,0);
		precurve_list[1].default_curve = new AnimationCurve(precurve_list[1].curve.keys);
		precurve_list[1].active = false;
		precurve_list[1].type = curve_type_enum.Random;
	}	
}

// 16bit to 8bit class
class value16bit_class
{
	var hi: float;
	var lo: float;
}

class value24bit_class
{
	var hi2: float;
	var hi: float;
	var lo: float;
}

// texture tool class
class texture_tool_class
{
	var active: boolean = true;
	var preimage: image_class = new image_class();
	var resolution_display: Vector2 = Vector2(512,512);
	var scale: float = 1;
	var rect: Rect;
	var precolor_range: precolor_range_class = new precolor_range_class(0,false);
}

// pattern tool class
class pattern_tool_class
{
	var active: boolean;
	var resolution_display: Vector2 = Vector2(512,512);
	var scale: float = 1;
	var clear: boolean = true;
	var first: boolean = false;
	var place_total: int;
	
	var output_texture: Texture2D;
	var output_resolution: Vector2 = Vector2(512,512);
	var patterns: List.<pattern_class> = new List.<pattern_class>();
	var current_pattern: pattern_class = new pattern_class();
	
	var export_file: String = "";
	var export_path: String;
}

// heightmap tool class
class heightmap_tool_class
{
	var active: boolean;
	var resolution_display: Vector2 = Vector2(512,512);
	var scale: float = 1;
	var clear: boolean = true;
	var first: boolean = false;
	var place_total: int;
	var pow_strength: float;
	
	var scroll_offset: float = 0.1;
	var perlin: perlin_class = new perlin_class();
	
	var output_texture: Texture2D;
	var preview_texture: Texture2D;
	var output_resolution: float = 2049;
	var preview_resolution: float = 128;
	var preview_resolution_slider: int = 2;
	
	var export_file: String = "";
	var export_path: String;
	var export_mode: export_mode_enum;
	var raw_save_file: raw_file_class = new raw_file_class();
}

// perlin class
class perlin_class
{
	var frequency: float = 512;
	var amplitude: float = 1;
	var octaves: int = 4;
	var precurve: animation_curve_class = new animation_curve_class();
	var offset: Vector2 = new Vector2(0,0);
	var offset_begin: Vector2 = new Vector2(0,0);
	
	var curve_menu_rect: Rect;
	
	function perlin_class()
	{
		precurve.curve = new AnimationCurve.Linear(0,0,1,1);
		precurve.default_curve = new AnimationCurve(precurve.curve.keys);
	}
}

// pattern_class
class pattern_class
{ 
	var active: boolean = true;
	var foldout: boolean = false;
	var pattern_placed: List.<Vector2> = new List.<Vector2>();
	var output: condition_output_enum;
	
	var current_x: float = 0;
	var current_y: float = 0;
	var start_x: float;
	var start_y: float;
	var width: float;
	var height: float;
	var width2: float;
	var height2: float;
	var count_x: int = 1;
	var count_y: int = 1;
	var scale: Vector2;
	var scale_start: Vector2 = Vector2(1,1);
	var scale_end: Vector2 = Vector2(1,1);
	var scale_link: boolean = true;
	var scale_link_start_y: boolean = true;
	var scale_link_end_y: boolean = true;
	var scale_link_start_z: boolean = true;
	var scale_link_end_z: boolean = true;
	var link_scale: float;
	var color: Color = Color.white;
	var strength: float = 1;
	
	var rotate: boolean; 
	var rotation: float;
	var rotation_start: float = -180;
	var rotation_end: float = 180;
	var current: Vector2;
	var pivot: Vector2;
	var precolor_range: precolor_range_class = new precolor_range_class(0,false);
	
	var break_x: boolean = false;
	
	var input_texture: Texture2D;
	var min_distance_x: float;
	var min_distance_y: float;
	var min_distance: boolean;
	var distance_global: boolean;
	var place_max: int = 100;
	var placed_max: boolean = false;
}

class settings_class 
{
	var saveMesh: boolean = false;
	var saveObj: boolean = true;
	var swapUV: boolean = true;
	var saveFormat: SaveObjFormat;  
	var saveResolution: SaveObjResolution;
	
	// example
	var example_display: boolean = true;
    
	var terrainDataDisplay: boolean = false;
	var cull_optimizer: boolean = true; 
	
	var terrainMinHeight: float;
	var terrainMaxHeight: float;
	var terrainMinDegree: float;
	var terrainMaxDegree: float;
	
	var area_max: Rect = Rect(-256,-256,512,512);
	var color: color_settings_class = new color_settings_class();
	var color_scheme_display_foldout: boolean = true;
	
	var remarks: boolean = true;
	var tips: boolean = true;
	
	var tip_local_area_foldout = true;
	var tip_local_area_text: String;
	
	var parentObjectsTerrain: boolean = false;
	
	// database
	var prelayers_linked: int = -1;
	var filters_linked: int = -1;
	var subfilters_linked: int = -1;
	var database_display: boolean = false;
	var filter_foldout_index: int = 0;
	var subfilter_foldout_index: int = 0;
	var update_display: boolean = false; 
	var update_display2: boolean = false;
	var update_version: boolean = false;
	var update_version2: boolean = false;
	var old_version: float;
	var new_version: float;
	var update: String[] = ["Don't check for updates","Notify updates","Download updates and notify","Download updates,import and notify","Download updates and import automatically"];
	var time_out: float;
	
	var project_prefab: boolean = false;
	
	var copy_terrain_material: boolean = false;
	
	// generate
	var grass_density: float = 32;
	var smooth_angle: int = 1;
	var round_angle: int = 0;
	var resolution_density: boolean = true;
	var resolution_density_min: int = 128;
	var resolution_density_conversion: float;
	var run_in_background: boolean = true;
	var display_bar_auto_generate: boolean = false;
	
	var global_height_strength: float = 1;
	var global_height_level: float = 0;
	var global_degree_strength: float = 1;
	var global_degree_level: float = 0;
	
	var global_parameters: boolean = false;
	
	// colormap
	var colormap_auto_search: auto_search_class = new auto_search_class();
	var normalmap_auto_search: auto_search_class = new auto_search_class();
	var colormap: boolean = false;
	var colormap_auto_assign: boolean = false;
	var colormap_assign: boolean = true;
	var normalmap: boolean = false;
	var normalmap_auto_assign: boolean = false;
	
	// display
	var top_height: float;
	var top_rect: Rect; 
	var box_scheme: boolean = false;
	var display_color_curves: boolean = false;
	var display_mix_curves: boolean = true;
	var display_log: boolean = true;
	var display_filename: boolean = false;
	var filter_select_text: boolean = true;
	var display_short_terrain: boolean = false;
	var display_short_mesh: boolean = false;
	var loading: int = 0;
	var tabs: boolean = true;
    var contents: WWW;
    var myExt: WWW;
    var ipr: boolean = false;    
    var button_globe: boolean = false;
    
    var showTerrains: boolean = true;
    var showMeshes: boolean = false;
    
	// help
	var help_splat_textures_foldout: boolean = false;
	var help_grass_foldout: boolean = false;
	var help_heightmap_layer_foldout: boolean = false;
	
	// terrain settings
    var terrain_settings: boolean = false;
    var terrain_settings_foldout: boolean = true;
    var editor_basemap_distance_max: int = 1000000;
    var editor_detail_distance_max: int = 2000;
    var editor_tree_distance_max: int = 50000;
    var editor_fade_length_max: int = 400;
    var editor_mesh_trees_max: int = 1000;
    
    var runtime_basemap_distance_max: int = 1000000; 
    var runtime_detail_distance_max: int = 2000;
    var runtime_tree_distance_max: int = 50000;
    var runtime_fade_length_max: int = 400;
    var runtime_mesh_trees_max: int = 1000;
    
    var terrain_tiles_max: int = 5;
    
    var settings_editor: boolean = true;
    var settings_runtime: boolean = false;
    var auto_fit_terrains: boolean = false;
    
    var color_splatPrototypes: splatPrototype_class[] = new splatPrototype_class[3];
    var splat_apply_all: boolean = true;
    
    var stitch_heightmap: boolean = false;
    var stitch_splatmap: boolean = true;
    
    // raw
    var raw_search_pattern: String = "_x%x_y%y";
    var raw_search_filename: String = "tile";
    var raw_search_extension: String = ".raw";
    
    // tree load
    var tree_button: boolean = false;
    var treemap: List.<tree_map_class> = new List.<tree_map_class>();
    var tree_foldouts: boolean = false;
    var tree_actives: boolean = false;
    
    // grass load
    var grass_button: boolean = false;
    var grassmap: List.<grass_map_class> = new List.<grass_map_class>();
    var grass_foldouts: boolean = false;
    var grass_actives: boolean = false;
    
    var runtime_create_terrain: boolean = false;
    var direct_colormap: boolean = false;
    
    // mesh convert
    var mesh_button: boolean = false; 
    var mesh_material: Material;
    var mesh_path: String = String.Empty;
    
    // light setup
    var light_button: boolean = false;
    var directional_light: Light;
    
    
    // measure
    var measure_distance_prefab: GameObject;
    var measure_distance1: GameObject; 
    var measure_distance2: GameObject;
    var measure_distance_mode: int = 0;
    var measure_distance: float;
    
    // rtp
    var load_colormap: boolean = true;
    var load_normalmap: boolean = true;
    var load_treemap: boolean = true; 
    var load_controlmap: boolean = true;
    var load_bumpglobal: boolean = true;
    
    var load_layers: boolean = true;
    var load_layers_settings: boolean = true;
    
    // export
    var export_heightmap_combined: boolean = false;
}

class tree_map_class
{
	var rect: Rect;
	var foldout: boolean = false;
	var foldouts: boolean = false;
	var map: GameObject;
    var load: boolean = true;
    var tree_param: List.<tree_parameter_class> = new List.<tree_parameter_class>();
    var tree_foldout: List.<boolean> = new List.<boolean>();
    var treeTypes: int;
}

class grass_map_class
{
	var rect: Rect;
	var foldout: boolean = false;
	var foldouts: boolean = false;
	var map: GameObject;
    var load: boolean = true;
    var grass_param: List.<grass_parameter_class> = new List.<grass_parameter_class>();
    var grassTypes: int;
    var grass_foldout: List.<boolean> = new List.<boolean>();
}
 
class tree_parameter_class
{
	var prototype: int;
	var density: float = 1;
    var scale: float = 1;
}

class grass_parameter_class
{
	var prototype: int;
	var density: float = 1;
}

class splat_custom_class
{
	var value: List.<float> = new List.<float>();
	var custom: boolean = false;
	var foldout: boolean = false;
	var rect: Rect;
	var rect2: Rect;
	var rect3: Rect;
	var totalValue: float;
			
	var changed: boolean = false;
	
	function splat_custom_class(length: int)
	{
		for (var count_splat: int = 0;count_splat < length;++count_splat)
		{
			value.Add(0);
		}
	}
	
	function CalcTotalValue()
	{
		totalValue = 0;
		for (var count_splat: int = 0;count_splat < value.Count;++count_splat) {
			totalValue += value[count_splat];
		}
	}
}

#if UNITY_EDITOR
static class GUIW
{
	var sliderBaseMiddle: Texture;
	var sliderBaseLeft: Texture;
	var sliderBaseRight: Texture;
	var sliderMiddle: Texture;
	var sliderLeft: Texture;
	var sliderRight: Texture;
	
	var changed: boolean = false;
	var mouseDown: boolean = false;
	var mousePosOld: Vector2;
	var delta: Vector2;
	var vOld: Vector2;
	
	var leftDown = false;
	var rightDown = false;
	var middleDown = false;
	
	function MinMaxSlider(rect: Rect,v: Vector2,min: float,max: float,clickOffset: Vector2): Vector2
	{
		changed = false;
		rect.width -= 16;
		
		if (sliderBaseMiddle == null) return;
		var key: Event = Event.current;
		var leftRect: Rect;
		var rightRect: Rect;
		var middleRect: Rect;
		
		// Debug.Log(key.mousePosition+", "+rect);
		
		var range: float = max-min;
		var scale: float = range/rect.width;
		// Debug.Log(rect);
		// Debug.Log(scale);
		
		GUI.DrawTexture(new Rect(rect.x+2,rect.y+(rect.height/2),rect.width+12,5),sliderBaseMiddle);
		GUI.DrawTexture(new Rect(rect.x,rect.y+(rect.height/2),2,5),sliderBaseLeft);
		GUI.DrawTexture(new Rect((rect.x+rect.width)+14,rect.y+(rect.height/2),2,5),sliderBaseRight);
		
		var startLeft: float = (((v.x-min)/range)*rect.width);
		var startRight: float = (((v.y-min)/range)*rect.width);
		leftRect = new Rect(rect.x+startLeft,rect.y+(rect.height/2)-3,8,11);
		rightRect = new Rect(rect.x+startRight+8,rect.y+(rect.height/2)-3,8,11);
		middleRect = new Rect(rect.x+startLeft+8,rect.y+(rect.height/2),(startRight-startLeft),5);
		
		GUI.DrawTexture(middleRect,sliderMiddle); 
		GUI.DrawTexture(leftRect,sliderLeft); 
		GUI.DrawTexture(rightRect,sliderRight); 
		
		middleRect.y -= 5;
		middleRect.height += 10;
		
		if (key.type == EventType.MouseDown) {
			
			if (leftRect.Contains(key.mousePosition)) {
				leftDown = true;
				mousePosOld = key.mousePosition;
				vOld = v;
				mouseDown = true;
			}
			else if (rightRect.Contains(key.mousePosition)) {
				rightDown = true;
				mousePosOld = key.mousePosition;
				vOld = v;
				mouseDown = true;
			}
			else if (middleRect.Contains(key.mousePosition)) {
				middleDown = true;
				mousePosOld = key.mousePosition;
				vOld = v;
				mouseDown = true;
			}
		}
		if (key.type == EventType.MouseUp) {
			mouseDown = false;
			leftDown = false;
			rightDown = false;
			middleDown = false;
		}
		
		delta = key.mousePosition-mousePosOld;
		
		if (mouseDown) {
			if (leftDown) {
				leftRect.x -= clickOffset.x;
				leftRect.width += clickOffset.x*2;
				leftRect.y -= clickOffset.y;
				leftRect.height += clickOffset.y*2;
				if (leftRect.Contains(key.mousePosition)) {
					v.x = vOld.x+(delta.x*scale);
					changed = true;
				}
			}
			else if (rightDown) {
				rightRect.x -= clickOffset.x;
				rightRect.width += clickOffset.x*2;
				rightRect.y -= clickOffset.y;
				rightRect.height += clickOffset.y*2;
				
				if (rightRect.Contains(key.mousePosition)) {
					v.y = vOld.y+(delta.x*scale);
					if (v.y < v.x) v.y = v.x;
					changed = true;
				}
			}
			if (middleDown) {
				middleRect.x -= clickOffset.x;
				middleRect.width += clickOffset.x*2;
				middleRect.y -= clickOffset.y;
				middleRect.height += clickOffset.y*2;
				
				if (middleRect.Contains(key.mousePosition)) {
					v.x = vOld.x+(delta.x*scale);
					v.y = vOld.y+(delta.x*scale);
					changed = true;
				}
			}
		}
		v.y = Mathf.Clamp(v.y,min,max);
		v.x = Mathf.Clamp(v.x,min,v.y);
		
		return v;
	}
	
	function LoadTextures(install_path: String)
	{
		sliderBaseMiddle = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/SliderBaseMiddle.psd",Texture);	
		sliderBaseLeft = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/SliderBaseLeft.psd",Texture);	
		sliderBaseRight = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/SliderBaseRight.psd",Texture);	
		sliderMiddle = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/SliderMiddle.psd",Texture);	
		sliderLeft = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/SliderLeft.psd",Texture);	
		sliderRight = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/SliderRight.psd",Texture);	
	}
}
#endif