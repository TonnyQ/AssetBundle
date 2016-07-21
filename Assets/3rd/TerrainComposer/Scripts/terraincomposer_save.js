#pragma strict 
import System.Collections.Generic;
import System;
import System.IO;
import System.Text.RegularExpressions;
import System.Reflection;
// import UnityEditor.VersionControl;  

enum filter_devices_enum{Standard,Math};
enum condition_type_enum{Height,Steepness,Direction,Image,Random,RandomRange,Always,Current,MaxCount,RawHeightmap,Splatmap,RayCast} 
enum heightmap_type_enum{Image,Random,RandomRange,Always,Current,RawHeightmap,RayCast}

function GetHeightmapEnum(input: condition_type_enum): heightmap_type_enum 
{
	if (input == condition_type_enum.Image) return heightmap_type_enum.Image;
	if (input == condition_type_enum.Random) return heightmap_type_enum.Random;
	if (input == condition_type_enum.RandomRange) return heightmap_type_enum.RandomRange;
	if (input == condition_type_enum.Current) return heightmap_type_enum.Current;
	if (input == condition_type_enum.RawHeightmap) return heightmap_type_enum.RawHeightmap;
	if (input == condition_type_enum.RayCast) return heightmap_type_enum.RayCast;
	
	return heightmap_type_enum.Always;
}

function GetCondtionTypeEnum(input: heightmap_type_enum): condition_type_enum
{
	if (input == heightmap_type_enum.Image) return condition_type_enum.Image;
	if (input == heightmap_type_enum.Random) return condition_type_enum.Random;
	if (input == heightmap_type_enum.RandomRange) return condition_type_enum.RandomRange;
	if (input == heightmap_type_enum.Current) return condition_type_enum.Current;
	if (input == heightmap_type_enum.RawHeightmap) return condition_type_enum.RawHeightmap;
	if (input == heightmap_type_enum.RayCast) return condition_type_enum.RayCast;
	
	return condition_type_enum.Always;
}
 
enum SaveObjFormat {Triangles, Quads}
enum SaveObjResolution {Full, Half, Quarter, Eighth, Sixteenth}

enum raycast_mode_enum{Hit,Height}
enum device2_type_enum{Sin,Cos}
enum subfilter_output_enum{max,min,average,add,subtract}
enum condition_select_output{normal,stretch}
enum change_mode_enum{filter,layer}
enum smooth_method_enum{lerp,smoothstep,clamp}
enum subfilter_mode_enum{strength,smooth,lerp}
enum layer_output_enum{heightmap,color,splat,tree,grass,object}
enum list_condition_enum{Terrain,Random}
enum rotation_mode_enum{Local,World}
enum distance_mode_enum{Radius,Square}
enum distance_level_enum{This,Layer,LayerLevel,Global}
enum mix_mode_enum{Group,Single}
enum object_mode_enum{SinglePlacement,LinePlacement}
enum image_mode_enum{Terrain,MultiTerrain,Area}
enum export_mode_enum{Image,Raw}
enum curve_type_enum{Normal,Random,Perlin}
enum select_mode_enum {free,select}
enum SliderMode_Enum {One,MinMax}

var colormap_resolution: int = 2048;
var Combine_Children: GameObject;
var software_version: String = "Beta";
var software_id: float;
var filename: String;

var tex1: Texture2D;

var create_pass = -1;
var heightmap_resolution_list: String[] = ["4097","2049","1025","513","257","129","65","33"];
var splatmap_resolution_list: String[] = ["2048","1024","512","256","128","64","32","16"];
var detailmap_resolution_list: String[] = ["2048","1024","512","256","128","64","32","16","8"];
var detail_resolution_per_patch_list: String[] = ["8","16","32","64","128"];
var image_import_max_settings: String[] = ["32","64","128","256","512","1024","2048","4096"];

var trees: TreeInstance[];
var tree_number:int = 0;

var subfilter: List.<subfilter_class> = new List.<subfilter_class>();
var filter: List.<filter_class> = new List.<filter_class>(); 
var precolor_range: List.<precolor_range_class> = new List.<precolor_range_class>();

@NonSerialized var script: terraincomposer_save;
// var combine_script: MeshCombine;
var show_prelayer: int = 0;
var prelayers: List.<prelayer_class> = new List.<prelayer_class>();
var prelayer: prelayer_class;
var prelayer_stack: List.<int> = new List.<int>();
var area_stack: List.<Rect> = new List.<Rect>();
var area_stack_enabled: boolean = false;
var area_skip: boolean;
var areaStack: List.<GenerateArea_Class> = new List.<GenerateArea_Class>();

var count_area: int;
var layer_count: boolean = true;
var placed_count: boolean = true;
var overlap: boolean;

var layer_heightmap: int;
var layer_color: int;
var layer_splat: int;
var layer_tree: int;
var layer_grass: int;
var layer_object: int;
var layer_heightmap_foldout: boolean = false;
var layer_color_foldout: boolean = false;
var layer_splat_foldout: boolean = false;
var layer_tree_foldout: boolean = false;
var layer_grass_foldout: boolean = false;
var layer_object_foldout: boolean = false;

var current_layer: layer_class;
var current_filter: filter_class;
var current_subfilter: subfilter_class;

var terrain_text: String = "Terrain:";
var masterTerrain: terrain_class;
var terrains: List.<terrain_class> = new List.<terrain_class>();
var raw_path: String = String.Empty;
var raw_save_path: String = String.Empty;
var terrains_foldout: boolean = true;
var terrainSearch: boolean = false;
var terrainSearchParent: Transform;
var terrainMenuRect: Rect;
var terrains_active: boolean = true;
var terrains_foldout2: boolean = true;
var remarks: remarks_class = new remarks_class();
var mesh_remarks: remarks_class = new remarks_class();
var terrain_instances: int = 1;
var terrainInstances: Vector2;
var terrain_asset_erase: boolean = false;
var terrain_tiles: int = 1;
var terrainTiles: Vector2;
var terrainTileLink: boolean = true;
var terrain_path: String;
var terrain_parent: Transform;
var terrain_scene_name: String = "Terrain";
var terrain_asset_name: String = "New Terrain";

var object_resolution: float = 10;
var object_search: Transform;
var meshes: List.<mesh_class> = new List.<mesh_class>();
var meshes_layer: int;
var meshes_active: boolean = true;
var meshes_foldout: boolean = true;
var meshes_foldout2: boolean = true;
var meshes_heightscale: float;
var meshes_area: area_class = new area_class();
var mesh_text: String = "Meshes";
var mesh_measure: mesh_measure_class = new mesh_measure_class();

var terrain_slice_path: String;
var terrain_slice_parent: Transform;

var swap_color_range_select: boolean = false;
var swap_color_range_number: int;
var swap_precolor_range: precolor_range_class;
var copy_color_range_select: boolean = false;
 
var swap_tree_select: boolean = false;
var swap_tree1: tree_class;
var swap_tree_output: tree_output_class;
var swap_tree_position: int;
var copy_tree_select: boolean = false;
var copy_tree1: tree_class;

var swap_object_select: boolean = false;
var swap_object_output: object_output_class;
var swap_object_number: int;
var copy_object_select: boolean = false;

var swap_description_select: boolean = false;
var swap_description_prelayer_index: int;
var swap_description_position: int;
var copy_description_select: boolean = false;
var copy_description_prelayer_index: int;
var copy_description_position: int;

var swap_layer_select: boolean = false;
var swap_prelayer_index: int;
var swap_layer_index: int;
var copy_layer_select: boolean = false;
var copy_prelayer_index: int;
var copy_layer_index: int;

var swap_filter_select: boolean = false;
var copy_filter_select: boolean = false;
    
var swap_subfilter_select: boolean = false;
var swap_presubfilter: presubfilter_class;
var swap_subfilter_index: int;
var copy_subfilter_select: boolean = false;
var copy_subfilter1: subfilter_class;

var preterrain: terrain_class;
var premesh: mesh_class;

var mix: float;
var xx: float = 0;
var zz: float = 0;
var resolution: float = 2048;
var splat_plus = 1;
var Rad2Deg:float = Mathf.Rad2Deg;
var grass_detail: detail_class[];

var splat1: SplatPrototype = new SplatPrototype();

var count_value: int;
var count_color_range: int;
var count_prelayer: int;
var count_layer: int;
var count_tree: int;
var count_object: int;
var count_filter: int;
var count_subfilter: int;
var call_from: int;
var random_range: float;
var random_range2: float;
var color1: Color;
var color2: Color;
var color_r: float;
var color_g: float;
var color_b: float;
var color_a: float;

var heightmap_output: boolean = true;
var heightmap_output_layer: boolean = false;
var color_output: boolean = true;
var splat_output: boolean = true;
var tree_output: boolean = true;
var grass_output: boolean = true;
var object_output: boolean = true; 
var world_output: boolean = false;
var line_output: boolean = false;

var button1: boolean;
var button_export: boolean;

var button_generate_text: String = "Generate";
  
var export_texture: Texture2D;
var export_bytes: byte[];
var export_file: String = "";
var export_path: String;
var export_name: String;
var export_color_advanced: boolean = true;
var export_color: Color = Color.white;
var export_color_curve_advanced: boolean = false;
var export_color_curve: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);
var export_color_curve_red: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);
var export_color_curve_green: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);
var export_color_curve_blue: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);

// generate 
var seed: int = 10;
var generate: boolean = false;  
var generateDone: boolean = false;
var generate_manual: boolean = false;
var generate_speed: int = 10;
var generate_speed_display: boolean = false;
var generate_sub_break: boolean = false;
var generate_pause: boolean = false; 
var generate_call_time: float;
var generate_call_time2: float;
var generate_call_delay: float;
var generate_time: float;
var generate_time_start: float;
var generate_on_top: boolean = true;
var generate_world_mode: boolean = false;
var generate_auto: boolean = false;
var generate_auto_mode: int = 1;
var generate_auto_delay1: float = 0;
var generate_auto_delay2: float = 0.2;
var generate_call: boolean = false;
var generate_error: boolean = false;
var generate_export: int = 0;

var heights: float[,];
var alphamap: float[,,];
var tree_instances: List.<TreeInstance> = new List.<TreeInstance>();
var grass_resolution_old: int = 0;
var color: Color;

var object_speed: int = 3;
var runtime: boolean = false;
var auto_speed: boolean = false;
var auto_speed_time: float;
var auto_speed_object_time: float;
var min_speed: int = 3;
var frames: float;
var object_frames: float;
var target_frame: int = 60;

var only_heightmap: boolean = false;
var terrain_index_old: int = -1;
var tree_color: Color;
var layer_x: float;
var layer_y: float;
var unload_textures: boolean = true;
var clean_memory: boolean = true;
var splat_total: float;
var objects_placed: List.<distance_class> = new List.<distance_class>();
var object_info: distance_class = new distance_class();

var heightmap_x: int;
var heightmap_y: int;
var heightmap_x_old: int;
var heightmap_y_old: int;
var detailmap_x: int;
var detailmap_y: int;
var h_local_x: int;
var h_local_y: int;
var map_x: int;
var map_y: int;

var measure_normal: boolean = false;

var place: boolean = true;
var position: Vector3;
var scale: Vector3;
var height: float;
var height_interpolated: float;		
var degree: float;
var normal: Vector3;

var local_x_rot: float;
var local_y_rot: float;
var local_x: float;
var local_y: float;
var a: float;
var b: float;

var random: System.Random = new System.Random();

var measure_tool: boolean = false;
var measure_tool_foldout: boolean = true;
var measure_tool_active: boolean = false;
var measure_tool_undock: boolean = false;
var measure_tool_clicked: boolean = false;
var measure_tool_range: float = 10000;
var measure_tool_inrange: boolean;
var measure_tool_terrain_point: Vector2;
var measure_tool_terrain_point_interpolated: Vector2;
var measure_tool_converter_foldout: boolean = false;
var measure_tool_converter_height_input: float;
var measure_tool_converter_height: float;
var measure_tool_converter_angle_input: float;
var measure_tool_converter_angle: float;

var stitch_tool: boolean = true;
var stitch_tool_foldout: boolean = true;
var stitch_tool_border_influence: float = 20;
var stitch_tool_curve: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);
var stitch_tool_strength: float = 1;
var stitch_command: boolean = false;

var smooth_tool: boolean = true;
var smooth_tool_foldout: boolean = true;
var smooth_tool_strength: float = 1;
var smooth_tool_repeat: int = 1;
var smooth_tool_advanced: boolean = false;
var smooth_tool_layer_strength: float = 1;
var smooth_command: boolean = false;
var smooth_tool_terrain: String[];
var smooth_tool_terrain_select: int;
var smooth_tool_height_curve: animation_curve_class = new animation_curve_class();
var smooth_tool_angle_curve: animation_curve_class = new animation_curve_class();

var quick_tools: boolean = true;
var quick_tools_foldout: boolean = false;

var slice_tool: boolean = true;
var slice_tool_active: boolean = false;
var slice_tool_foldout: boolean = true;
var slice_tool_heightmap_foldout: boolean = false;
var slice_tool_all_foldout: boolean = false;
var slice_tool_rect: Rect;
var slice_tool_terrain: Terrain;
var slice_tool_erase_terrain_scene: boolean = true;
var slice_tool_erase_terrain_data: boolean = false;
var slice_tool_offset: Vector2 = new Vector2();
var slice_tool_min_height: float = 0;

var sphere_draw: boolean = true;
var sphere_radius: float = 10;
var measure_tool_point_old: Vector3;
var image_tools: boolean = false;
var texture_tool: texture_tool_class = new texture_tool_class();
var pattern_tool: pattern_tool_class = new pattern_tool_class();
var heightmap_tool: heightmap_tool_class = new heightmap_tool_class();

var description_display: boolean = true;
var description_space: float = 15;
var curve_in_memory_old: animation_curve_class;

var meshcapture_tool: boolean = true;
var meshcapture_tool_foldout: boolean = true;
var meshcapture_tool_object: GameObject;
var meshcapture_tool_image: Texture2D;
var meshcapture_tool_pivot: Transform;
var meshcapture_tool_image_width: int = 128;
var meshcapture_tool_image_height: int = 128;
var meshcapture_tool_scale: float = 1;
var meshcapture_tool_save_scale: boolean = true;
var meshcapture_tool_shadows: boolean = false;
var meshcapture_tool_color: Color = Color.white;
var meshcapture_background_color: Color = Color.black;

var row_object_count: int = 0;
var break_x: boolean = false;
var break_time: float = 0.2;
var break_time_set: float;
var generate_settings: boolean = false;
var generate_settings_foldout: boolean = true;

var tile_resolution: int = 1000;

var trees_maximum: int = 1000;

var script_base: terraincomposer_save;
var tree_script: save_trees;
var grass_script: save_grass;
var tc_id: int;
var settings: settings_class = new settings_class();
var hit : RaycastHit;
var layerHit: int;
			
var TerrainComposer_Parent: GameObject;

@HideInInspector
var filter_value: float;
@HideInInspector
var filter_strength: float;
@HideInInspector
var filter_input: float;
@HideInInspector
var filter_combine: float;
@HideInInspector
var filter_combine_start: float;
@HideInInspector
var subfilter_value: float;

@HideInInspector
var byte_hi2: int;
@HideInInspector
var byte_hi: int;
@HideInInspector
var byte_lo: int;
var raw_files: List.<raw_file_class> = new List.<raw_file_class>();
var converted_resolutions: boolean = false;
var converted_version: float = 0;

var RTP_LODmanager1: GameObject;
var rtpLod_script: Component; 

var pointsRange: List.<object_point_class> = new List.<object_point_class>();
var placedObjects: List.<GameObject> = new List.<GameObject>();
	
// prelayer functions
function add_prelayer(search_level: boolean)
{
	prelayers.Add(new prelayer_class(0,prelayers.Count));
	prelayers[prelayers.Count-1].index = prelayers.Count-1;
	prelayers[prelayers.Count-1].prearea.area_max = settings.area_max;
	prelayers[prelayers.Count-1].prearea.max();
	prelayers[prelayers.Count-1].set_prelayer_text();
	if (search_level){search_level_prelayer(0,prelayers.Count-1,0);}
}

function erase_prelayer(prelayer_index: int)
{
	erase_layers(prelayers[prelayer_index]);
	if (prelayer_index < prelayers.Count-1){swap_prelayer1(prelayer_index,prelayers.Count-1);}
	prelayers.RemoveAt(prelayers.Count-1);
	
	if (prelayer_index < prelayers.Count)
	{
		search_prelayer(prelayer_index);
		prelayers[prelayer_index].index = prelayer_index;
		prelayers[prelayer_index].set_prelayer_text();
	}
}

function search_prelayer(prelayer_index: int)
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_object: int = 0;count_object < prelayers[count_prelayer].layer[count_layer].object_output.object.Count;++count_object)
			{
				if (prelayers[count_prelayer].layer[count_layer].object_output.object[count_object].prelayer_index == prelayers.Count)
				{
					prelayers[count_prelayer].layer[count_layer].object_output.object[count_object].prelayer_index = prelayer_index;
					return;
				}
			}
		}
	}
}

function search_level_prelayer(prelayer_index: int,find_index: int,level: int)
{
	for (var count_layer: int = 0;count_layer < prelayers[prelayer_index].layer.Count;++count_layer)
	{
		for (var count_object: int = 0;count_object < prelayers[prelayer_index].layer[count_layer].object_output.object.Count;++count_object)
		{
			if (prelayers[prelayer_index].layer[count_layer].object_output.object[count_object].prelayer_created)
			{
				++level;
				if (prelayers[prelayer_index].layer[count_layer].object_output.object[count_object].prelayer_index == find_index)
				{
					prelayers[prelayers[prelayer_index].layer[count_layer].object_output.object[count_object].prelayer_index].level = level;
					return;
				}
				search_level_prelayer(prelayers[prelayer_index].layer[count_layer].object_output.object[count_object].prelayer_index,find_index,level);
				--level;
			}
		}
	}
}

function swap_prelayer1(prelayer_index1: int,prelayer_index2: int)
{
	var prelayer2: prelayer_class = prelayers[prelayer_index1];
	
	prelayers[prelayer_index1] = prelayers[prelayer_index2];
	prelayers[prelayer_index2] = prelayers[prelayer_index1];
}

// description functions
function new_layergroup(prelayer1: prelayer_class,description_number:int)
{
	var length: int = prelayer1.predescription.description[description_number].layer_index.Count;
	
	for (var count_layer: int = 0;count_layer < length;++count_layer)
	{
		erase_layer(prelayer1,prelayer1.predescription.description[description_number].layer_index[0],description_number,0,true,true,false);
	}
}

function erase_description(prelayer1: prelayer_class,description_number: int)
{
	if (prelayer1.predescription.description.Count > 1)
	{
		var length: int = prelayer1.predescription.description[description_number].layer_index.Count;
		
		for (var count_layer_index: int = 0;count_layer_index < length;++count_layer_index)
		{
			erase_layer(prelayer1,prelayer1.predescription.description[description_number].layer_index[0],description_number,0,true,true,false);
		}
	
		prelayer1.predescription.erase_description(description_number);
	}
	count_layers();
}

function swap_description(description_number1: int,description_number2: int,prelayer1: prelayer_class)
{
	if (description_number2 < 0 || description_number2 > prelayer1.predescription.description.Count-1){return;}
	var length1: int = prelayer1.predescription.description[description_number1].layer_index.Count;
	var length2: int = prelayer1.predescription.description[description_number2].layer_index.Count;
	
	var count: int;
	
	var text: String = prelayer1.predescription.description[description_number1].text;
	var edit: boolean = prelayer1.predescription.description[description_number1].edit;
	
	prelayer1.predescription.description[description_number1].text = prelayer1.predescription.description[description_number2].text;
	prelayer1.predescription.description[description_number2].text = text;
	prelayer1.predescription.description[description_number1].edit = prelayer1.predescription.description[description_number2].edit;
	prelayer1.predescription.description[description_number2].edit = edit;	
	
	var foldout2: boolean = prelayer1.predescription.description[description_number1].foldout;
	
	prelayer1.predescription.description[description_number1].foldout = prelayer1.predescription.description[description_number2].foldout;
	prelayer1.predescription.description[description_number2].foldout = foldout2;
	
	for (count = 0;count < length1;++count)
	{
		replace_layer(0,description_number1,description_number2,prelayer1);
	}
	for (count = 0;count < length2;++count)
	{
		replace_layer(0,description_number2,description_number1,prelayer1);
	}
	
	prelayer1.predescription.set_description_enum();
}
	
// layer functions
function replace_layer(source_layer_index: int,source_description_number: int,target_description_number: int,prelayer1: prelayer_class)
{
	var target_layer_number: int = get_layer_position(prelayer1.predescription.description[target_description_number].layer_index.Count,target_description_number,prelayer1);
	add_layer(prelayer1,target_layer_number,layer_output_enum.color,target_description_number,prelayer1.predescription.description[target_description_number].layer_index.Count,false,false,true);
        
    prelayer1.layer[target_layer_number] = copy_layer(prelayer1.layer[prelayer1.predescription.description[source_description_number].layer_index[source_layer_index]],true,true);
    erase_layer(prelayer1,prelayer1.predescription.description[source_description_number].layer_index[source_layer_index],source_description_number,source_layer_index,true,true,true);
}

function count_layers()
{
	if (!layer_count){return;}
	layer_heightmap = layer_color = layer_splat = layer_tree = layer_grass = layer_object = 0;
	
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			switch(prelayers[count_prelayer].layer[count_layer].output)
			{
				case layer_output_enum.heightmap:
					++layer_heightmap;
					break;
				case layer_output_enum.color:
					++layer_color;
					break;
				case layer_output_enum.splat:
					++layer_splat;
					break;
				case layer_output_enum.tree:
					++layer_tree;
					break;
				case layer_output_enum.grass:
					++layer_grass;
					break;
				case layer_output_enum.object:
					++layer_object;
					break;
			}
		}
	}
}
	
function erase_layers(prelayer1: prelayer_class)
{
	var length: int = prelayer1.layer.Count;
	for (var count_layer: int = 0;count_layer < length;++count_layer)
	{
		erase_layer(prelayer1,0,0,0,false,true,false);	
	}
}

function erase_layer(prelayer1: prelayer_class,layer_number: int,description_number: int,layer_index: int,description: boolean,loop_layer: boolean,count_layer: boolean)
{
	if (prelayer1.layer.Count > 0)
	{
		if (loop_layer){loop_layer(prelayer1.layer[layer_number],-1);}
		erase_filters(prelayer1.layer[layer_number].prefilter);
		for (var count_tree: int = 0;count_tree < prelayer1.layer[layer_number].tree_output.tree.Count;++count_tree)
		{
			erase_filters(prelayer1.layer[layer_number].tree_output.tree[count_tree].prefilter);
		}
		prelayer1.layer.RemoveAt(layer_number);
	} 
	// description
	if (description){prelayer1.predescription.erase_layer_index(layer_number,layer_index,description_number);}
	if (count_layer){count_layers();}
	prelayer1.set_prelayer_text();
}

function strip_layer(prelayer1: prelayer_class,layer_number: int)
{
	for (var count_object: int = 0;count_object < prelayer1.layer[layer_number].object_output.object.Count;++count_object)
	{
		if (prelayer1.layer[layer_number].object_output.object[count_object].prelayer_created)
		{
			erase_prelayer(prelayer1.layer[layer_number].object_output.object[count_object].prelayer_index);
		}
	}
	erase_filters(prelayer1.layer[layer_number].prefilter);
	
}

function add_layer(prelayer1: prelayer_class,layer_number: int,layer_output: layer_output_enum,description_number: int,layer_index: int,new_filter: boolean,count_layer: boolean,custom: boolean)
{
	prelayer1.layer.Insert(layer_number,new layer_class());
	if (new_filter)
	{
		add_filter(0,prelayer1.layer[layer_number].prefilter);
	}
	prelayer1.layer[layer_number].output = layer_output;
	
	// description
	prelayer1.predescription.add_layer_index(layer_number,layer_index,description_number);
	
	if (count_layer){count_layers();}
	prelayer1.set_prelayer_text();
	
	// heightmap settings
	if (layer_output == layer_output_enum.heightmap && custom) 
	{
		if (new_filter)
		{
			filter[filter.Count-1].type = condition_type_enum.Always;
			
			/*
			filter[filter.Count-1].precurve_list[0].curve = new AnimationCurve().Linear(0,1,1,1);
			filter[filter.Count-1].precurve_list[0].default_curve = new AnimationCurve(filter[filter.Count-1].precurve_list[0].curve.keys);
			filter[filter.Count-1].precurve_list[1].curve = new AnimationCurve().Linear(0,0,1,1);
			filter[filter.Count-1].precurve_list[1].default_curve = new AnimationCurve(filter[filter.Count-1].precurve_list[0].curve.keys);
			filter[filter.Count-1].precurve_list[0].type = curve_type_enum.Perlin;
			filter[filter.Count-1].precurve_list[1].type = curve_type_enum.Normal;
			*/
		}
	}
}

function swap_layer(prelayer1: prelayer_class,layer_number1: int,prelayer2: prelayer_class,layer_number2: int,blink: boolean)
{
	if (layer_number2 < 0 || layer_number2 > prelayer2.layer.Count-1){return;}
	
	var layer2: layer_class = prelayer1.layer[layer_number1];
	prelayer1.layer[layer_number1] = prelayer2.layer[layer_number2];
	prelayer2.layer[layer_number2] = layer2;
	if (blink) {
		if (prelayer1.layer[layer_number1].color_layer[0] < 1.5){prelayer1.layer[layer_number1].color_layer += Color (1,1,1,1);}
		if (prelayer2.layer[layer_number2].color_layer[0] < 1.5){prelayer2.layer[layer_number2].color_layer += Color (1,1,1,1);}
	}
}

function get_layer_position(layer_index: int,description_number: int,prelayer1: prelayer_class): int
{
	var layer_position: int = 0;
	for (var count_description: int = 0;count_description < prelayer1.predescription.description.Count;++count_description)
	{
		if (count_description == description_number){return (layer_position+layer_index);}
		layer_position += prelayer1.predescription.description[count_description].layer_index.Count;
	}
	return -1;
}

function get_layer_description(prelayer1: prelayer_class,layer_index: int): int
{
	for (var count_description: int = 0;count_description < prelayer1.predescription.description.Count;++count_description)
	{
		for (var count_layer: int = 0;count_layer < prelayer1.predescription.description[count_description].layer_index.Count;++count_layer)
		{
			if (prelayer1.predescription.description[count_description].layer_index[count_layer] == layer_index){return count_description;}
		}
	}
	return -1;
}

function layer_sort(prelayer: prelayer_class,description_number: int)
{
	var sort_low: int;
	var sort_set1: boolean = false;
	var sort_set2: boolean = false;
	var sort_set3: boolean = false;
	var sort_set4: boolean = false;
	var sort_set5: boolean = false;
	var sort_set6: boolean = false;
	var sort_pos1: int;
	var sort_pos2: int;
	var sort_pos3: int;
	var sort_pos4: int;
	var sort_pos5: int;
	var sort_pos6: int;
	for (var count_layer: int = 0;count_layer < prelayer.predescription.description[description_number].layer_index.Count;++count_layer)
	{
		sort_set1 = false;
		sort_set2 = false;
		sort_set3 = false;
		sort_set4 = false;
		sort_set5 = false;
		sort_set6 = false;
		
		for (var count_layer2: int = count_layer;count_layer2 < prelayer.predescription.description[description_number].layer_index.Count;++count_layer2)
		{
			if (!sort_set1){if (prelayer.layer[prelayer.predescription.description[description_number].layer_index[count_layer2]].output == layer_output_enum.heightmap){sort_pos1 = count_layer2;sort_set1 = true;}}
			if (!sort_set2){if (prelayer.layer[prelayer.predescription.description[description_number].layer_index[count_layer2]].output == layer_output_enum.color){sort_pos2 = count_layer2;sort_set2 = true;}}
			if (!sort_set3){if (prelayer.layer[prelayer.predescription.description[description_number].layer_index[count_layer2]].output == layer_output_enum.splat){sort_pos3 = count_layer2;sort_set3 = true;}}
			if (!sort_set4){if (prelayer.layer[prelayer.predescription.description[description_number].layer_index[count_layer2]].output == layer_output_enum.tree){sort_pos4 = count_layer2;sort_set4 = true;}}
			if (!sort_set5){if (prelayer.layer[prelayer.predescription.description[description_number].layer_index[count_layer2]].output == layer_output_enum.grass){sort_pos5 = count_layer2;sort_set5 = true;}}
			if (!sort_set6){if (prelayer.layer[prelayer.predescription.description[description_number].layer_index[count_layer2]].output == layer_output_enum.object){sort_pos6 = count_layer2;sort_set6 = true;}}
		}
		if (sort_set1){swap_layer(prelayer,prelayer.predescription.description[description_number].layer_index[count_layer],prelayer,prelayer.predescription.description[description_number].layer_index[sort_pos1],false);}
			else if (sort_set2){swap_layer(prelayer,prelayer.predescription.description[description_number].layer_index[count_layer],prelayer,prelayer.predescription.description[description_number].layer_index[sort_pos2],false);}
				else if (sort_set3){swap_layer(prelayer,prelayer.predescription.description[description_number].layer_index[count_layer],prelayer,prelayer.predescription.description[description_number].layer_index[sort_pos3],false);}
					else if (sort_set4){swap_layer(prelayer,prelayer.predescription.description[description_number].layer_index[count_layer],prelayer,prelayer.predescription.description[description_number].layer_index[sort_pos4],false);}
						else if (sort_set5){swap_layer(prelayer,prelayer.predescription.description[description_number].layer_index[count_layer],prelayer,prelayer.predescription.description[description_number].layer_index[sort_pos5],false);}
							else if (sort_set6){swap_layer(prelayer,prelayer.predescription.description[description_number].layer_index[count_layer],prelayer,prelayer.predescription.description[description_number].layer_index[sort_pos6],false);}				
	}
}

function LayerSort(prelayer: prelayer_class,layerGroupIndex: int)
{
	var layerGroup: description_class = prelayer.predescription.description[layerGroupIndex];
	var layer1: layer_class;
	var layer2: layer_class;
	
	var index: int = -1;
	var rank1: int;
	var rank2: int;
	
	for (var i: int = 1;i < layerGroup.layer_index.Count;++i) {
		layer1 = prelayer.layer[layerGroup.layer_index[i]];
		layer2 = prelayer.layer[layerGroup.layer_index[i-1]];
		
		rank1 = layer1.output;
		rank2 = layer2.output;
		
		if (rank1 < rank2) {
			swap_layer(prelayer,prelayer.predescription.description[layerGroupIndex].layer_index[i],prelayer,prelayer.predescription.description[layerGroupIndex].layer_index[i-1],false);
			if (index == -1) index = i;
			if (i > 1) i -= 2; else {i = index;index = -1;}
		}
		else if (index != -1) {i = index;index = -1;}
	} 
}

function layers_sort(prelayer: prelayer_class)
{
	for (var count_description: int = 0;count_description < prelayer.predescription.description.Count;++count_description)
	{
		LayerSort(prelayer,count_description);
	}
}

function erase_filters(prefilter: prefilter_class)
{
	var length: int = prefilter.filter_index.Count;
	
	for (var count_filter: int = 0;count_filter < length;++count_filter)
	{
		erase_filter(0,prefilter);
	}
}

function add_filter(filter_number: int,prefilter: prefilter_class)
{
	filter.Add(new filter_class());
	prefilter.filter_index.Insert(filter_number,filter.Count-1);
	
	if (terrains.Count > 1){filter[filter.Count-1].preimage.image_mode = image_mode_enum.MultiTerrain;}

	prefilter.set_filter_text();	
}

function add_animation_curve(precurve_list: List.<animation_curve_class>,curve_number: int,copy: boolean)
{
	if (!copy)
	{
		precurve_list.Insert(curve_number,new animation_curve_class());
		precurve_list[curve_number].curve = new AnimationCurve.Linear(0,0,1,0);
		precurve_list[curve_number].default_curve = new AnimationCurve(precurve_list[curve_number].curve.keys);
	}
	else 
	{
		precurve_list.Insert(curve_number,copy_animation_curve(precurve_list[curve_number-1]));
	}
}

function erase_animation_curve(precurve_list: List.<animation_curve_class>,curve_number: int)
{
	if (precurve_list.Count > 0)
	{
		precurve_list.RemoveAt(curve_number);
	}
}

function swap_animation_curve(curve_list: List.<animation_curve_class>,curve_number1: int,curve_number2: int)
{
	var curve3: animation_curve_class = curve_list[curve_number1];
	
	curve_list[curve_number1] = curve_list[curve_number2];
	curve_list[curve_number2] = curve3;
}

function erase_filter(filter_number: int,prefilter: prefilter_class)
{
	if (prefilter.filter_index.Count > 0)
	{
		erase_subfilters(filter[prefilter.filter_index[filter_number]]);
		var filter_index: int = prefilter.filter_index[filter_number];
		swap_filter2(filter_index,filter.Count-1,false);
		filter.RemoveAt(filter.Count-1);
		prefilter.filter_index.RemoveAt(filter_number);
		relink_filter_index(filter_index);
		prefilter.set_filter_text();
	}
}

function erase_filter_reference(prefilter: prefilter_class,filter_index: int)
{
	prefilter.filter_index.RemoveAt(filter_index);
	prefilter.set_filter_text();	
}

function erase_filter_unlinked(filter_number: int)
{
		swap_filter2(filter_number,filter.Count-1,false);
		filter.RemoveAt(filter.Count-1);
		relink_filter_index(filter_number);
}

function swap_filter(prefilter1: prefilter_class,filter_index1: int,prefilter2: prefilter_class,filter_index2: int)
{
	if (filter_index2 < 0 || filter_index2 > prefilter2.filter_index.Count-1){return;}
	
	var filter2: filter_class = filter[prefilter1.filter_index[filter_index1]];
	filter[prefilter1.filter_index[filter_index1]] = filter[prefilter2.filter_index[filter_index2]];
	filter[prefilter2.filter_index[filter_index2]] = filter2;
	if (filter[prefilter1.filter_index[filter_index1]].color_filter[0] < 1.5){filter[prefilter1.filter_index[filter_index1]].color_filter += Color(1,1,1,1);}
	if (filter[prefilter2.filter_index[filter_index2]].color_filter[0] < 1.5){filter[prefilter2.filter_index[filter_index2]].color_filter += Color(1,1,1,1);}
}

function swap_filter2(filter_number1: int,filter_number2: int,blink: boolean)
{
	var filter2: filter_class = filter[filter_number1];
	filter[filter_number1] = filter[filter_number2];
	filter[filter_number2] = filter2;
	if (blink)
	{
		if (filter[filter_number1].color_filter[0] < 1.5){filter[filter_number1].color_filter += Color(1,1,1,1);}
		if (filter[filter_number2].color_filter[0] < 1.5){filter[filter_number2].color_filter += Color(1,1,1,1);}
	}
}

function swap_object(object_output1: object_output_class,object_number1: int,object_output2: object_output_class,object_number2: int)
{
	var object2: object_class = object_output1.object[object_number1];
	var object_value2: float = object_output1.object_value.value[object_number1];
	var object_active2: boolean = object_output1.object_value.active[object_number1];
	
	object_output1.object[object_number1] = object_output2.object[object_number2];
	object_output2.object[object_number2] = object2;
	if (object_output1.object[object_number1].color_object[0] > 0.5){object_output1.object[object_number1].color_object += Color(-0.5,0,-0.5,0);}
	if (object_output2.object[object_number2].color_object[0] > 0.5){object_output2.object[object_number2].color_object += Color(-0.5,0,-0.5,0);}
	object_output1.object_value.value[object_number1] = object_output2.object_value.value[object_number2];
	object_output2.object_value.value[object_number2] = object_value2;
	object_output1.object_value.active[object_number1] = object_output2.object_value.active[object_number2];
	object_output2.object_value.active[object_number2] = object_active2;
	object_output1.object_value.calc_value();
	if (object_output1 != object_output2){object_output2.object_value.calc_value();}
}

function swap_tree(tree_output1: tree_output_class,tree_number1: int,tree_output2: tree_output_class,tree_number2: int)
{
	var tree2: tree_class = tree_output1.tree[tree_number1];
	var tree_value2: float = tree_output1.tree_value.value[tree_number1];
	var tree_active2: boolean = tree_output1.tree_value.active[tree_number1];
	
	tree_output1.tree[tree_number1] = tree_output2.tree[tree_number2];
	tree_output2.tree[tree_number2] = tree2;
	if (tree_output1.tree[tree_number1].color_tree[0] < 1.5){tree_output1.tree[tree_number1].color_tree += Color(0.5,0.5,0.5,0);}
	if (tree_output2.tree[tree_number2].color_tree[0] < 1.5){tree_output2.tree[tree_number2].color_tree += Color(0.5,0.5,0.5,0);}
	tree_output1.tree_value.value[tree_number1] = tree_output2.tree_value.value[tree_number2];
	tree_output2.tree_value.value[tree_number2] = tree_value2;
	tree_output1.tree_value.active[tree_number1] = tree_output2.tree_value.active[tree_number2];
	tree_output2.tree_value.active[tree_number2] = tree_active2;
	tree_output1.tree_value.calc_value();
	if (tree_output1 != tree_output2){tree_output2.tree_value.calc_value();}
}

function add_object(object_output: object_output_class,object_number: int)
{
	object_output.object.Insert(object_number,new object_class());		
	object_output.object_value.add_value(object_number,50);
	object_output.set_object_text();
}
	
function erase_object(object_output: object_output_class,object_number: int)
{
	if (object_output.object.Count > 0)
	{
		if (object_output.object[object_number].prelayer_created)
		{
			erase_prelayer(object_output.object[object_number].prelayer_index);
		}
		object_output.object.RemoveAt(object_number);
		object_output.object_value.erase_value(object_number);
		object_output.set_object_text();
	}
}

function clear_object(object_output: object_output_class)
{
	var length: int = object_output.object.Count;
	
	for (var count_object: int = 0;count_object < length;++count_object)
	{
		erase_object(object_output,object_output.object.Count-1);
	}
}

function swap_color_range(precolor_range1: precolor_range_class,color_range_number1: int,precolor_range2: precolor_range_class,color_range_number2: int)
{
	var color_range2: color_range_class = precolor_range1.color_range[color_range_number1];
	var color_range_value2: float = precolor_range1.color_range_value.value[color_range_number1];
	var color_range_active2: boolean = precolor_range1.color_range_value.active[color_range_number1];
	
	precolor_range1.color_range[color_range_number1] = precolor_range2.color_range[color_range_number2];
	precolor_range2.color_range[color_range_number2] = color_range2;
	
	if (precolor_range1.color_range[color_range_number1].color_color_range[0] < 1.5){precolor_range1.color_range[color_range_number1].color_color_range += Color(1,1,1,1);}
	if (precolor_range2.color_range[color_range_number2].color_color_range[0] < 1.5){precolor_range2.color_range[color_range_number2].color_color_range += Color(1,1,1,1);}
	
	precolor_range1.color_range_value.value[color_range_number1] = precolor_range2.color_range_value.value[color_range_number2];
	precolor_range2.color_range_value.value[color_range_number2] = color_range_value2;
	
	precolor_range1.color_range_value.active[color_range_number1] = precolor_range2.color_range_value.active[color_range_number2];
	precolor_range2.color_range_value.active[color_range_number2] = color_range_active2;
	
	precolor_range1.color_range_value.calc_value();
	precolor_range1.set_precolor_range_curve();
	if (precolor_range1 != precolor_range2){precolor_range2.color_range_value.calc_value();precolor_range2.set_precolor_range_curve();}
	if (precolor_range1.one_color){precolor_range1.color_range[color_range_number1].one_color = true;}
	if (precolor_range2.one_color){precolor_range2.color_range[color_range_number2].one_color = true;}
}

function change_filters_active(prefilter: prefilter_class,invert: boolean)
{
	for (var count_filter: int = 0;count_filter < prefilter.filter_index.Count;++count_filter)
	{
		if (!invert)
		{
			filter[prefilter.filter_index[count_filter]].active = prefilter.filters_active;
		}
		else
		{
			filter[prefilter.filter_index[count_filter]].active = !filter[prefilter.filter_index[count_filter]].active;
		}
	}
}

function change_filters_foldout(prefilter: prefilter_class,invert: boolean)
{
	for (var count_filter: int = 0;count_filter < prefilter.filter_index.Count;++count_filter)
	{
		if (!invert)
		{
			filter[prefilter.filter_index[count_filter]].foldout = prefilter.filters_foldout;
		}
		else
		{
			filter[prefilter.filter_index[count_filter]].foldout = !filter[prefilter.filter_index[count_filter]].foldout;
		}
	}
}

function change_subfilters_active(presubfilter: presubfilter_class,invert: boolean)
{
	for (var count_subfilter: int = 0;count_subfilter < presubfilter.subfilter_index.Count;++count_subfilter)
	{
		if (!invert)
		{
			subfilter[presubfilter.subfilter_index[count_subfilter]].active = presubfilter.subfilters_active;
		}
		else
		{
			subfilter[presubfilter.subfilter_index[count_subfilter]].active = !subfilter[presubfilter.subfilter_index[count_subfilter]].active;
		}
	}
}

function change_subfilters_foldout(presubfilter: presubfilter_class,invert: boolean)
{
	for (var count_subfilter: int = 0;count_subfilter < presubfilter.subfilter_index.Count;++count_subfilter)
	{
		if (!invert)
		{
			subfilter[presubfilter.subfilter_index[count_subfilter]].foldout = presubfilter.subfilters_foldout;
		}
		else
		{
			subfilter[presubfilter.subfilter_index[count_subfilter]].foldout = !subfilter[presubfilter.subfilter_index[count_subfilter]].foldout;	
		}
	}
}

function change_terrains_active(invert: boolean)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (!invert)
		{
			terrains[count_terrain].active = terrains_active;
		}
		else
		{
			terrains[count_terrain].active = !terrains[count_terrain].active;
		}
	}
}

function change_meshes_active(invert: boolean)
{
	for (var i: int = 0;i < meshes.Count;++i)
	{
		if (!invert)
		{
			meshes[i].active = meshes_active;
		}
		else
		{
			meshes[i].active = !meshes[i].active;
		}
	}
}

function change_terrains_foldout(invert: boolean)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (!invert)
		{
			terrains[count_terrain].foldout = terrains_foldout2;
		}
		else
		{
			terrains[count_terrain].foldout = !terrains[count_terrain].foldout;
		}
	}
}

function change_meshes_foldout(invert: boolean)
{
	for (var i: int = 0;i < meshes.Count;++i)
	{
		if (!invert)
		{
			meshes[i].foldout = meshes_foldout2;
		}
		else
		{
			meshes[i].foldout = !meshes[i].foldout;
		}
	}
}

function change_trees_active(tree_output: tree_output_class,invert: boolean)
{
	for (var count_tree: int = 0;count_tree < tree_output.tree.Count;++count_tree)
	{
		if (!invert)
		{
			tree_output.tree_value.active[count_tree] = tree_output.trees_active;
		}
		else
		{
			tree_output.tree_value.active[count_tree] = !tree_output.tree_value.active[count_tree];
		}
	}
	tree_output.tree_value.calc_value();
}

function change_trees_foldout(tree_output: tree_output_class,invert: boolean)
{
	for (var count_tree: int = 0;count_tree < tree_output.tree.Count;++count_tree)
	{
		if (!invert)
		{
			tree_output.tree[count_tree].foldout = tree_output.trees_foldout;
		}
		else
		{
			tree_output.tree[count_tree].foldout = !tree_output.tree[count_tree].foldout;
		}
	}
}

function change_trees_settings_foldout(preterrain1: terrain_class,invert: boolean)
{
	for (var count_tree: int = 0;count_tree < preterrain1.treePrototypes.Count;++count_tree)
	{
		if (!invert)
		{
			preterrain1.treePrototypes[count_tree].foldout = preterrain1.trees_foldout;	
		}
		else
		{
			preterrain1.treePrototypes[count_tree].foldout = !preterrain1.treePrototypes[count_tree].foldout;
		}
	}
}

function change_splats_settings_foldout(preterrain1: terrain_class,invert: boolean)
{
	for (var count_splat: int = 0;count_splat < preterrain1.splatPrototypes.Count;++count_splat)
	{
		if (!invert)
		{
			preterrain1.splatPrototypes[count_splat].foldout = preterrain1.splats_foldout;	
		}
		else
		{
			preterrain1.splatPrototypes[count_splat].foldout = !preterrain1.splatPrototypes[count_splat].foldout;
		}
	}
}

function change_color_splats_settings_foldout(preterrain1: terrain_class,invert: boolean)
{
	for (var count_splat: int = 0;count_splat < settings.color_splatPrototypes.Length;++count_splat)
	{
		if (!invert)
		{
			settings.color_splatPrototypes[count_splat].foldout = preterrain1.splats_foldout;	
		}
		else
		{
			settings.color_splatPrototypes[count_splat].foldout = !settings.color_splatPrototypes[count_splat].foldout;
		}
	}
}

function change_details_settings_foldout(preterrain1: terrain_class,invert: boolean)
{
	for (var count_detail: int = 0;count_detail < preterrain1.detailPrototypes.Count;++count_detail)
	{
		if (!invert)
		{
			preterrain1.detailPrototypes[count_detail].foldout = preterrain1.details_foldout;	
		}
		else
		{
			preterrain1.detailPrototypes[count_detail].foldout = !preterrain1.detailPrototypes[count_detail].foldout;
		}
	}
}

function change_objects_active(object_output: object_output_class,invert: boolean)
{
	for (var count_object: int = 0;count_object < object_output.object.Count;++count_object)
	{
		if (!invert)
		{
			object_output.object_value.active[count_object] = object_output.objects_active;
		}
		else
		{
			object_output.object_value.active[count_object] = !object_output.object_value.active[count_object];
		}
	}
	object_output.object_value.calc_value();
}

function change_objects_foldout(object_output: object_output_class,invert: boolean)
{
	for (var count_object: int = 0;count_object < object_output.object.Count;++count_object)
	{
		if (!invert)
		{
			object_output.object[count_object].foldout = object_output.objects_foldout;	
		}
		else
		{
			object_output.object[count_object].foldout = !object_output.object[count_object].foldout;
		}
	}
}

function change_color_ranges_active(precolor_range: precolor_range_class,invert: boolean)
{
	for (var count_color_range: int = 0;count_color_range < precolor_range.color_range.Count;++count_color_range)
	{
		if (!invert)
		{
			precolor_range.color_range_value.active[count_color_range] = precolor_range.color_ranges_active;
		}
		else
		{
			precolor_range.color_range_value.active[count_color_range] = !precolor_range.color_range_value.active[count_color_range];
		}
	}
}

// subfilter functions
function erase_subfilters(filter: filter_class)
{
	var length: int = filter.presubfilter.subfilter_index.Count;
	var subfilter_index: int;
	for (var count_subfilter: int = 0;count_subfilter < length;++count_subfilter)
	{	
		erase_subfilter(0,filter.presubfilter);
	}
}

function add_subfilter(subfilter_number: int,presubfilter: presubfilter_class)
{
	subfilter.Add(new subfilter_class());
	presubfilter.subfilter_index.Insert(subfilter_number,subfilter.Count-1);
	
	if (terrains.Count > 1){subfilter[subfilter.Count-1].preimage.image_mode = image_mode_enum.MultiTerrain;}
	
	presubfilter.set_subfilter_text();	
}

function add_line_point(line_list: List.<line_list_class>,line_point_number: int)
{
	line_list.Insert(line_point_number,new line_list_class());
}

function erase_line_point(line_list: List.<line_list_class>,line_point_number: int)
{
	line_list.RemoveAt(line_point_number);
}

function erase_subfilter(subfilter_number: int,presubfilter: presubfilter_class)
{
	if (presubfilter.subfilter_index.Count > 0)
	{
		var subfilter_index: int = presubfilter.subfilter_index[subfilter_number];
		swap_subfilter2(subfilter_index,subfilter.Count-1,false);
		subfilter.RemoveAt(subfilter.Count-1);
		presubfilter.subfilter_index.RemoveAt(subfilter_number);
		relink_subfilter_index(subfilter_index);
		presubfilter.set_subfilter_text();
	}
}

function erase_subfilter_reference(presubfilter: presubfilter_class,subfilter_index: int)
{
	presubfilter.subfilter_index.RemoveAt(subfilter_index);
	presubfilter.set_subfilter_text();
}

function erase_subfilter_unlinked(subfilter_number: int)
{
	swap_subfilter2(subfilter_number,subfilter.Count-1,false);
	subfilter.RemoveAt(subfilter.Count-1);
	relink_subfilter_index(subfilter_number);
}

function swap_subfilter(presubfilter1: presubfilter_class,subfilter_index1: int,presubfilter2: presubfilter_class,subfilter_index2: int)
{
	if (subfilter_index2 < 0 || subfilter_index2 > presubfilter2.subfilter_index.Count-1){return;}
	
	var subfilter2: subfilter_class = subfilter[presubfilter1.subfilter_index[subfilter_index1]];
	subfilter[presubfilter1.subfilter_index[subfilter_index1]] = subfilter[presubfilter2.subfilter_index[subfilter_index2]];
	subfilter[presubfilter2.subfilter_index[subfilter_index2]] = subfilter2;
	if (subfilter[presubfilter1.subfilter_index[subfilter_index1]].color_subfilter[0] < 1.5){subfilter[presubfilter1.subfilter_index[subfilter_index1]].color_subfilter += Color(1,1,1,1);}
	if (subfilter[presubfilter2.subfilter_index[subfilter_index2]].color_subfilter[0] < 1.5){subfilter[presubfilter2.subfilter_index[subfilter_index2]].color_subfilter += Color(1,1,1,1);}
}

function swap_subfilter2(subfilter_number1: int,subfilter_number2: int,blink: boolean)
{
	var subfilter2: subfilter_class = subfilter[subfilter_number1];
	subfilter[subfilter_number1] = subfilter[subfilter_number2];
	subfilter[subfilter_number2] = subfilter2;
	if (blink)
	{
		if (subfilter[subfilter_number1].color_subfilter[0] < 1.5){subfilter[subfilter_number1].color_subfilter += Color(1,1,1,1);}
		if (subfilter[subfilter_number2].color_subfilter[0] < 1.5){subfilter[subfilter_number2].color_subfilter += Color(1,1,1,1);}
	}
}

function new_layers()
{
	filter.Clear();
	subfilter.Clear();
	prelayers.Clear();
	reset_swapcopy();
	disable_outputs();
	prelayers.Add(new prelayer_class(0,0));
	prelayer = prelayers[0];
	prelayer.prearea.active = false;
	filename = String.Empty;
	set_area_resolution(terrains[0],prelayer.prearea);
	// add_filter(0,prelayers[0].layer[0].prefilter);
	settings.colormap = false;
	count_layers();
}

function reset_swapcopy()
{
	swap_layer_select = false;
	swap_filter_select = false;
	swap_subfilter_select = false;
	swap_object_select = false;
	swap_color_range_select = false;
	swap_description_select = false;
	copy_layer_select = false;
	copy_filter_select = false;
	copy_subfilter_select = false;
	copy_object_select = false;
	copy_color_range_select = false;
	copy_description_select = false;
	
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		for (var count_curve: int = 0;count_curve < filter[count_filter].precurve_list.Count;++count_curve)
		{
			filter[count_filter].precurve_list[count_curve].curve_text = "Curve";
		}
	}
	
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
	{
		for (count_curve = 0;count_curve < subfilter[count_subfilter].precurve_list.Count;++count_curve)
		{
			subfilter[count_subfilter].precurve_list[count_curve].curve_text = "Curve";
		}
	}
}

function reset_software_version()
{
	software_id = 0;
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			prelayers[count_prelayer].layer[count_layer].software_id = 0;
		}
	}
}

function get_output_length(layer: layer_class): int
{
	if (layer.output == layer_output_enum.heightmap){return 0;}
	if (layer.output == layer_output_enum.color){return 0;} 
	if (layer.output == layer_output_enum.splat){return layer.splat_output.splat.Count;}
	if (layer.output == layer_output_enum.tree){return layer.tree_output.tree.Count;}
	if (layer.output == layer_output_enum.grass){return layer.grass_output.grass.Count;}
	if (layer.output == layer_output_enum.object){return layer.object_output.object.Count;}
	return -1;
}

function set_view_only_selected(prelayer: prelayer_class,selected: layer_output_enum,disable_view: boolean)
{
	if (disable_view) {prelayer.view_heightmap_layer = prelayer.view_color_layer = prelayer.view_splat_layer = prelayer.view_tree_layer = prelayer.view_grass_layer = prelayer.view_object_layer = false;}
	if (selected == layer_output_enum.heightmap){prelayer.view_heightmap_layer = true;}
	if (selected == layer_output_enum.color){prelayer.view_color_layer = true;}
	if (selected == layer_output_enum.splat){prelayer.view_splat_layer = true;}
	if (selected == layer_output_enum.tree){prelayer.view_tree_layer = true;}
	if (selected == layer_output_enum.grass){prelayer.view_grass_layer = true;}
	if (selected == layer_output_enum.object){prelayer.view_object_layer = true;}
}	

function set_output(selected: layer_output_enum)
{
	if (selected == layer_output_enum.heightmap){disable_outputs();heightmap_output = true;}
	if (selected == layer_output_enum.color){disable_outputs();color_output = true;}
	if (selected == layer_output_enum.splat){disable_outputs();splat_output = true;}
	if (selected == layer_output_enum.tree){disable_outputs();tree_output = true;}
	if (selected == layer_output_enum.grass){disable_outputs();grass_output = true;}
	if (selected == layer_output_enum.object){disable_outputs();object_output = true;}
}

function swap_search_layer(prelayer1: prelayer_class,prelayer2: prelayer_class,layer: layer_class,text1: String,text2: String): boolean
{
	if (prelayer2.index > 0)
	{
		for (var count_layer: int = 0;count_layer < prelayer1.layer.Count;++count_layer)
		{
			for (var count_object: int = 0;count_object < prelayer1.layer[count_layer].object_output.object.Count;++count_object)
			{
				if (prelayer1.layer[count_layer].object_output.object[count_object].prelayer_created)
				{
					for (var count_layer2: int = 0;count_layer2 < prelayers[prelayer1.layer[count_layer].object_output.object[count_object].prelayer_index].layer.Count;++count_layer2)
					{
						if (prelayers[prelayer1.layer[count_layer].object_output.object[count_object].prelayer_index].layer[count_layer2] == layer)
						{
							prelayer1.layer[count_layer].swap_text = prelayer1.layer[count_layer].swap_text.Replace(text1,text2);
						}
						if (prelayers[prelayer1.layer[count_layer].object_output.object[count_object].prelayer_index].layer.Count > 0)
						{
							if (swap_search_layer(prelayers[prelayer1.layer[count_layer].object_output.object[count_object].prelayer_index],prelayer2,layer,text1,text2))
							{
								prelayer1.layer[count_layer].swap_text = prelayer1.layer[count_layer].swap_text.Replace(text1,text2);
								return true;
							}
						}
					}
				}
			}
		}
	}
	return false;
}

function set_area_cube(terrain_number: int)
{
	var current_terrain: terrain_class = terrains[terrain_number];
	var scale: Vector3;
	var width: float = current_terrain.terrain.terrainData.size.x/resolution;
	var length: float = current_terrain.terrain.terrainData.size.z/resolution;
	var position: Vector3 = current_terrain.terrain.transform.position;
	
	scale.x = (current_terrain.prearea.area.xMax - current_terrain.prearea.area.x)*width;
	scale.z = (current_terrain.prearea.area.yMax - current_terrain.prearea.area.y)*length;
	scale.y = 50;
	
	position.x += (current_terrain.prearea.area.x*width)+(scale.x/2);
	position.z += (current_terrain.prearea.area.y*length)+(scale.z/2);
	position.y = transform.position.y;
	
	transform.position = position;
	transform.localScale = scale;
}

function calc_area_max(prearea: area_class)
{
	var area: Rect;
	
	area.width = terrains[0].tiles.x * terrains[0].size.x;
	area.height = terrains[0].tiles.y * terrains[0].size.z;
	
	var left_bottom_tile: int;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].tile_z == 0 && terrains[count_terrain].tile_x == 0)
		{
			left_bottom_tile = count_terrain;
			if (!terrains[count_terrain].terrain){return;}
			break;
		}
	}
	area.x = terrains[left_bottom_tile].terrain.transform.position.x;
	area.y = terrains[left_bottom_tile].terrain.transform.position.z;
	
	prearea.area_max = area;
	prearea.round_area_to_step(prearea.area_max);
	
	correct_area_max(prearea);
}

function correct_area_max(prearea: area_class)
{
	if (prearea.area.xMin < prearea.area_max.xMin){prearea.area.xMin = prearea.area_max.xMin;}
	if (prearea.area.xMax > prearea.area_max.xMax){prearea.area.xMax = prearea.area_max.xMax;}
	if (prearea.area.yMin < prearea.area_max.yMin){prearea.area.yMin = prearea.area_max.yMin;}
	if (prearea.area.yMax > prearea.area_max.yMax){prearea.area.yMax = prearea.area_max.yMax;}
}

function set_terrain_length(length_new: int)
{	
	if (length_new != terrains.Count)
	{
		if (length_new > terrains.Count)
		{
			terrains.Add(new terrain_class());
			if (terrains.Count > 1)
			{
				terrains[terrains.Count-1].size = terrains[terrains.Count-2].size;
				terrains[terrains.Count-1].heightmap_resolution_list = terrains[terrains.Count-2].heightmap_resolution_list;
				terrains[terrains.Count-1].splatmap_resolution_list = terrains[terrains.Count-2].splatmap_resolution_list;
				terrains[terrains.Count-1].basemap_resolution_list = terrains[terrains.Count-2].basemap_resolution_list;
				terrains[terrains.Count-1].detailmap_resolution_list = terrains[terrains.Count-2].detailmap_resolution_list;
				terrains[terrains.Count-1].detail_resolution_per_patch_list = terrains[terrains.Count-2].detail_resolution_per_patch_list;
				
				set_terrain_resolution_from_list(terrains[terrains.Count-1]);
			}
			terrains[terrains.Count-1].prearea.area.xMax = resolution;
			terrains[terrains.Count-1].prearea.area.yMax = resolution;
			terrains[terrains.Count-1].index = terrains.Count-1;
		}
		else
		{
			terrains.RemoveAt(terrains.Count-1);
		}
	}
	
	if (terrains.Count == 1){terrains[0].tile_x = 0;terrains[0].tile_z = 0;terrains[0].tiles = Vector2(1,1);}
	
	calc_terrain_one_more_tile();
	set_smooth_tool_terrain_popup();
	set_terrain_text(); 
} 

function add_terrain(terrain_number: int)
{
	terrains.Insert(terrain_number,new terrain_class());
	
	terrains[terrains.Count-1].prearea.area.xMax = resolution;
	terrains[terrains.Count-1].prearea.area.yMax = resolution;
	terrains[terrains.Count-1].index = terrain_number;
	
	set_smooth_tool_terrain_popup();
	set_terrain_text(); 
}

function SetTerrainDefault(preterrain: terrain_class)
{
	preterrain.size = new Vector3(1000,500,1000);
}

function clear_terrains()
{
	terrains.Clear();
	add_terrain(0);
	SetTerrainDefault(terrains[0]);
}

function clear_meshes()
{
	meshes.Clear();
	meshes.Add(new mesh_class());
}

function clear_terrain_list(deleteTerrainHierarchy: boolean) 
{
	for (var i: int = 0;i < terrains.Count;++i) {
		if (deleteTerrainHierarchy) {
			DeleteTerrain(terrains[i]);
		}
		if (i > 0) {
			terrains.RemoveAt(i);
			--i;	
		}
	}
}

function DeleteTerrain(preterrain: terrain_class)
{
	if (preterrain.terrain != null) {
		#if UNITY_EDITOR	
		DestroyImmediate(preterrain.terrain.gameObject);
		#else
		Destroy(preterrain.terrain.gameObject);
		#endif
	}
}

function set_terrain_text()
{
	if (terrains.Count > 1){terrain_text = "Terrains("+terrains.Count+")";} else {terrain_text = "Terrain("+terrains.Count+")";}
}

function erase_raw_file(raw_file_index: int): boolean
{
	if (raw_file_index < raw_files.Count)
	{
		raw_files[raw_file_index] = raw_files[raw_files.Count-1];
		raw_files.RemoveAt(raw_files.Count-1);
		loop_raw_file(raw_file_index,false,true,false);
		return true;
	}
	return false;
}

function check_raw_file_in_list(file: String): int
{
	for (var count_raw_file: int = 0;count_raw_file < raw_files.Count;++count_raw_file)
	{
		if (file.ToLower() == raw_files[count_raw_file].file.ToLower()){return count_raw_file;}
	}
	return -1;
}

function strip_auto_search_file(auto_search: auto_search_class)
{
	var digit: String = new String("0"[0],auto_search.digits);
	
	var format: String = auto_search.format.Replace("%x",auto_search.start_x.ToString(digit));
	format = format.Replace("%y",auto_search.start_y.ToString(digit));
	format = format.Replace("%n",auto_search.start_n.ToString(digit));
	
	auto_search.filename = Path.GetFileNameWithoutExtension(auto_search.path_full).Replace(format,String.Empty);
	auto_search.extension = Path.GetExtension(auto_search.path_full);
	
	if (auto_search.extension.Length != 0){auto_search.filename = auto_search.filename.Replace(auto_search.extension,String.Empty);}
}

function clean_raw_file_list()
{
	loop_raw_file(0,false,false,true);
	
	for (var count_raw_file: int = 0;count_raw_file < raw_files.Count;++count_raw_file)
	{
		if (!raw_files[count_raw_file].linked){erase_raw_file(count_raw_file);}
	}
}

function loop_raw_file(raw_file_index: int,check_double: boolean,relink: boolean,mark_linked: boolean): boolean
{
	var count_assigned: int = 0;
	var count_index: int = 0;
	
	if (mark_linked)
	{
		for (var count_raw_file: int = 0;count_raw_file < raw_files.Count;++count_raw_file)
		{
			if (!raw_files[count_raw_file].created){raw_files[count_raw_file].linked = false;}
		}
	}
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].raw_file_index > -1)
		{
			if (mark_linked){raw_files[terrains[count_terrain].raw_file_index].linked = true;}
			if (check_double)
			{
				if (terrains[count_terrain].raw_file_index == raw_file_index){++count_assigned;}
				if (count_assigned > 1){return true;}
			}
			if (relink)
			{
				if (terrains[count_terrain].raw_file_index == raw_files.Count){terrains[count_terrain].raw_file_index = raw_file_index;}
			}
		}
	}
	
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		if (filter[count_filter].raw) {
			for (count_index = 0;count_index < filter[count_filter].raw.file_index.Count;++count_index)
			{
				if (filter[count_filter].raw.file_index[count_index] > -1)
				{
					if (mark_linked){raw_files[filter[count_filter].raw.file_index[count_index]].linked = true;}
					if (check_double)
					{
						if (filter[count_filter].raw.file_index[count_index] == raw_file_index){++count_assigned;}	
						if (count_assigned > 1){return true;}
					}
					if (relink)
					{
						if (filter[count_filter].raw.file_index[count_index] == raw_files.Count){filter[count_filter].raw.file_index[count_index] = raw_file_index;}
					}
				}
			}
		}
	}
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
	{
		if (subfilter[count_subfilter].raw) {
			for (count_index = 0;count_index < subfilter[count_subfilter].raw.file_index.Count;++count_index)
			{
				if (subfilter[count_subfilter].raw.file_index[count_index] > -1)
				{
					if (mark_linked){raw_files[subfilter[count_subfilter].raw.file_index[count_index]].linked = true;}
					if (check_double)
					{
						if (subfilter[count_subfilter].raw.file_index[count_index] == raw_file_index){++count_assigned;}
						if (count_assigned > 1){return true;}
					}
					if (relink)
					{
						if (subfilter[count_subfilter].raw.file_index[count_index] == raw_files.Count){subfilter[count_subfilter].raw.file_index[count_index] = raw_file_index;}
					}
				}
			}
		}
	}
	return false;
}

function reset_raw_file(index: int)
{
	for (var i: int = 0;i < filter.Count;++i) {
		if (filter[i].raw != null) {
			for (var t: int = 0;t < filter[i].raw.file_index.Count;++t) {
				if (filter[i].raw.file_index[t] == index) {
					filter[i].raw.file_index[t] = -1;
				}
			}
		}
	}
	
	for (i = 0;i < subfilter.Count;++i) {
		if (subfilter[i].raw != null) {
			for (t = 0;t < subfilter[i].raw.file_index.Count;++t) {
				if (subfilter[i].raw.file_index[t] == index) {
					subfilter[i].raw.file_index[t] = -1;
				}
			}
		}
	}
}

function reset_all_outputs()
{
	terrain_reset_heightmap(terrains[0],true);
	terrain_all_reset_splat();
	terrain_reset_trees(terrains[0],true);
	terrain_reset_grass(terrains[0],true);
	terrain_reset_heightmap(terrains[0],true);
	loop_prelayer("(cpo)",0,true);
}

function terrain_reset_heightmap(preterrain1: terrain_class,all: boolean)
{
	if (!preterrain1.terrain) {return;}
	if (!preterrain1.terrain.terrainData) {return;}
	var heights: float [,] = new float[preterrain1.terrain.terrainData.heightmapResolution,preterrain1.terrain.terrainData.heightmapResolution];
	
	if (!all)
	{
		if (!preterrain1.terrain){return;}
		preterrain1.terrain.terrainData.SetHeights(0,0,heights);
		preterrain1.color_terrain = Color(0.5,0.5,1,1);
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (!terrains[count_terrain].terrain){continue;}
			if (terrains[count_terrain].terrain.terrainData.heightmapResolution != Mathf.Sqrt(heights.Length))
			{
				heights = new float[terrains[count_terrain].terrain.terrainData.heightmapResolution,terrains[count_terrain].terrain.terrainData.heightmapResolution];
			}
			terrains[count_terrain].terrain.terrainData.SetHeights(0,0,heights);
			terrains[count_terrain].color_terrain = Color(0.5,0.5,1,1);
		} 
	}
}


function terrain_reset_splat(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	// if (!settings.runtime_create_terrain) {
		assign_terrain_splat_alpha(preterrain1);
			
		if (preterrain1.splat_alpha) {
			if (preterrain1.splat_alpha.Length > 0){texture_fill(preterrain1.splat_alpha[0],Color(1,0,0,0),true);}
			
			if (preterrain1.splat_alpha.Length > 1)
			{
				for (var count_alpha: int = 1;count_alpha < preterrain1.splat_alpha.Length;++count_alpha)
				{
					texture_fill(preterrain1.splat_alpha[count_alpha],Color(0,0,0,0),true);
				}
			}
			preterrain1.terrain.terrainData.SetAlphamaps(0,0,preterrain1.terrain.terrainData.GetAlphamaps(0,0,1,1));
			preterrain1.color_terrain = Color(0.5,0.5,1,1);
		}
//	}
//	else {
//		var length: ulong;
//		var resolution: int = preterrain1.terrain.terrainData.alphamapResolution;
//		var splat_length: int = preterrain1.terrain.terrainData.alphamapLayers;
//		var change: boolean = false;
//		var x: int;
//		var y: int;
//		
//		length = resolution*resolution*splat_length;
//	 	if (!alphamap) {
//	 		alphamap = new float [resolution,resolution,splat_length];
//	 		change = true;
//	 	}
//	 	else if (length != alphamap.Length) {
//	 		alphamap = new float [resolution,resolution,splat_length];
//	 		change = true;
//	 	}
//	 	
//	 	if (change) {
//	 		for (y = 0;y < resolution;++y) {
//	 			for (x = 0;x < resolution;++x) {
//	 				alphamap[x,y,0] = 1;
//	 			}
//	 		}
//	 	}
//	 	
//	 	preterrain1.terrain.terrainData.SetAlphamaps(0,0,alphamap);
//	}
}

function terrain_all_reset_splat()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		terrain_reset_splat(terrains[count_terrain]);
	}
//	if (settings.runtime_create_terrain) {
//		alphamap = new float[0,0,0];
//	}
}

function texture_fill(texture: Texture2D,color: Color,apply: boolean)
{
	if (texture == null) return;
	var width: int = texture.width;
	var height: int = texture.height;
	
	for (var y: int = 0;y < height;++y)
	{
		for (var x: int = 0;x < width;++x)
		{
			texture.SetPixel(x,y,color);
		}
	}
	
	if (apply){texture.Apply();}
}

function terrain_reset_trees(preterrain1: terrain_class,all: boolean)
{
	if (!all)
	{
		if (!preterrain1.terrain) {return;}
		if (!preterrain1.terrain.terrainData) {return;}
		preterrain1.terrain.terrainData.treeInstances = new TreeInstance[0];
		preterrain1.color_terrain = Color(0.5,0.5,1,1);
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (!terrains[count_terrain].terrain) {continue;}
			if (!terrains[count_terrain].terrain.terrainData) {continue;}
			terrains[count_terrain].terrain.terrainData.treeInstances = new TreeInstance[0];
			terrains[count_terrain].terrain.Flush();
			terrains[count_terrain].color_terrain = Color(0.5,0.5,1,1);
		}
	}	
}

function terrain_reset_grass(preterrain1: terrain_class,all: boolean)
{
	if (!preterrain1.terrain) {return;}
	if (!preterrain1.terrain.terrainData) {return;}
	var detail_layer: int[,] = new int[preterrain1.terrain.terrainData.detailResolution,preterrain1.terrain.terrainData.detailResolution];
	var count_detail: int;
			        						        				
	if (!all)
	{
		if (!preterrain1.terrain){return;}
		for (count_detail = 0;count_detail < preterrain1.terrain.terrainData.detailPrototypes.Length;++count_detail)
		{
			preterrain1.terrain.terrainData.SetDetailLayer(0,0,count_detail,detail_layer);
		}
		preterrain1.color_terrain = Color(0.5,0.5,1,1);
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (!terrains[count_terrain].terrain){continue;}
			if (terrains[count_terrain].terrain.terrainData.detailResolution != Mathf.Sqrt(detail_layer.Length))
			{
				detail_layer = new int[terrains[count_terrain].terrain.terrainData.detailResolution,terrains[count_terrain].terrain.terrainData.detailResolution];
			}
			for (count_detail = 0;count_detail < terrains[count_terrain].terrain.terrainData.detailPrototypes.Length;++count_detail)
			{
				terrains[count_terrain].terrain.terrainData.SetDetailLayer(0,0,count_detail,detail_layer);
			}
			terrains[count_terrain].color_terrain = Color(0.5,0.5,1,1);
		}
	}
}

function terrains_check_double(preterrain: terrain_class): boolean
{
	var double_terrain: boolean = false;
	for (var count1: int = 0;count1 < terrains.Count;++count1)
	{
		if (terrains[count1].terrain == preterrain.terrain && preterrain.terrain != null && terrains[count1] != preterrain){preterrain.terrain = null;double_terrain = true;}
		
	}
	return double_terrain;
}

function erase_terrain(number: int)
{
	if (terrains.Count > 1)
	{
		terrains.RemoveAt(number);		
	}
	else
	{
		terrains[number] = null;
	}  
	if (terrains.Count == 1){terrains[0].tile_x = 0;terrains[0].tile_z = 0;terrains[0].tiles = Vector2(1,1);}
	
	set_smooth_tool_terrain_popup();
	set_terrain_text();
} 

function restore_references()
{
	var transform_parent: GameObject;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		var terrain_gameobject: GameObject;
		if (terrains[count_terrain].name != "")
		{
			terrain_gameobject = GameObject.Find(terrains[count_terrain].name);
			if (terrain_gameobject){terrains[count_terrain].terrain = terrain_gameobject.GetComponent(Terrain);}
		}
	}
	
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_object: int = 0;count_object < prelayers[count_prelayer].layer[count_layer].object_output.object.Count;++count_object)
			{
				var current_object: object_class = prelayers[count_prelayer].layer[count_layer].object_output.object[count_object];
				if (current_object.name != "" && !current_object.object1)
				{
					current_object.object1 = GameObject.Find(current_object.name);
				}
				if (current_object.parent_name != "" && !current_object.parent)
				{
					transform_parent = GameObject.Find(current_object.parent_name);
					if (transform_parent){current_object.parent = transform_parent.transform;}
				}
			}
		}
	}
}

function set_references()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			terrains[count_terrain].name = terrains[count_terrain].terrain.name;
		}
	}
	
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_object: int = 0;count_object < prelayers[count_prelayer].layer[count_layer].object_output.object.Count;++count_object)
			{
				var current_object: object_class = prelayers[count_prelayer].layer[count_layer].object_output.object[count_object];
				if (current_object.object1)
				{
					current_object.name = current_object.object1.name;
				}
				if (current_object.parent)
				{
					current_object.parent_name = current_object.parent.name;
				}
			}
		}
	}
}

function calc_color_pos(color: Color,color_start: Color,color_end: Color): float 
{
	var color_start2: Color = color_start;
	var color_range: Color;
	var color_range_total: float;
	var color_total: float;
	
	if (color_start.r > color_end.r){color_start.r = color_end.r;color_end.r = color_start2.r;}
	if (color_start.g > color_end.g){color_start.g = color_end.g;color_end.g = color_start2.g;}
	if (color_start.b > color_end.b){color_start.b = color_end.b;color_end.b = color_start2.b;}
	
	color_range = color_end - color_start;
	color -= color_start;
	
	if (color.r < 0 || color.g < 0 || color.b < 0){return 0;}
	if (color.r > color_range.r || color.g > color_range.g || color.b > color_range.b){return 0;}
		
	color_range_total += (color_range.r+color_range.g+color_range.b);
	color_total += (color.r+color.g+color.b);
	if (color_range_total != 0){return (color_total/color_range_total);} else {return 1;}
}

function color_in_range(color: Color,color_start: Color,color_end: Color): boolean
{
	var color_start2: Color = color_start;
	
	if (color_start.r > color_end.r){color_start.r = color_end.r;color_end.r = color_start2.r;}
	if (color_start.g > color_end.g){color_start.g = color_end.g;color_end.g = color_start2.g;}
	if (color_start.b > color_end.b){color_start.b = color_end.b;color_end.b = color_start2.b;}
	if (color.r >= color_start.r && color.r <= color_end.r
			&& color.g >= color_start.g && color.g <= color_end.g
				&& color.b >= color_start.b && color.b <= color_end.b){return true;} else {return false;}
}

function random_color_from_range(color_start: Color,color_end: Color): Color
{
	var color_new: Color;
		
	var curve_r: AnimationCurve = new AnimationCurve().Linear(0,color_start.r,1,color_end.r);
	var curve_g: AnimationCurve = new AnimationCurve().Linear(0,color_start.g,1,color_end.g);
	var curve_b: AnimationCurve = new AnimationCurve().Linear(0,color_start.b,1,color_end.b);
		
	var random_range: float = UnityEngine.Random.Range(0.0,1.0);
	
	color_new.r = curve_r.Evaluate(random_range);
	color_new.g = curve_g.Evaluate(random_range);
	color_new.b = curve_b.Evaluate(random_range);
	color_new.a = 1;
	return color_new;
}

function convert_16to8_bit(value: float)
{
	value *= 65535;
	
	var value_int: ushort = value;
	
	byte_hi = value_int >> 8;
	byte_lo = value_int-(byte_hi << 8);
}
	
function convert_24to8_bit(value: float)
{
	value *= 8388608;
	
	var value_int: uint = value;
	
	byte_hi2 = value_int >> 16;
	byte_hi = (value_int-(byte_hi2 << 16)) >> 8;
	byte_lo = value_int-(byte_hi2 << 16) - (byte_hi << 8);
	
}

function export_meshcapture(): int
{
	if (!meshcapture_tool_object){return -1;}
	
	var mesh1: MeshFilter[] = meshcapture_tool_object.GetComponentsInChildren.<MeshFilter>();
	
	var vertices: Vector3[];
	meshcapture_tool_image = new Texture2D(meshcapture_tool_image_width,meshcapture_tool_image_height);//,TextureFormat.ARGB32, false);
	var position: Vector3[] = new Vector3[3];
	var triangles: int[];
	var mesh: Mesh;
	var pivot: Vector3;
	var relative_position: Vector3;
	var object: Transform;
	
	meshcapture_tool_image.wrapMode =  TextureWrapMode.Clamp;
	
	if (meshcapture_tool_pivot){pivot = meshcapture_tool_pivot.position;} else {pivot = meshcapture_tool_object.transform.position;}
	
	if (mesh1)
	{
		var pixels: Color[] = new Color[meshcapture_tool_image_width*meshcapture_tool_image_height];
		
		for (var pixel: Color in pixels){pixel = meshcapture_background_color;}
		
		meshcapture_tool_image.SetPixels(pixels);
		
		for (var meshfilter: Component in mesh1)
		{
			mesh = meshfilter.GetComponent(MeshFilter).sharedMesh;
			if (!mesh){continue;}
			vertices = mesh.vertices;
			triangles = mesh.triangles;
			object = meshfilter.gameObject.transform;
			var normals: Vector3[] = mesh.normals;
			
			for (var counter: int = 0;counter < triangles.Length/3;++counter)
			{
				var pos: int = triangles[counter*3];
				var pos1: int = triangles[(counter*3)+1];
				var pos2: int = triangles[(counter*3)+2];
				
				position[0] = object.TransformPoint(vertices[pos])-pivot;
				position[1] = object.TransformPoint(vertices[pos1])-pivot;
				position[2] = object.TransformPoint(vertices[pos2])-pivot;
				
				var pos_v: Vector3 = position[0];
				var pos_n: Vector3 = normals[pos];
				pos_n.Normalize();
				pos_v.Normalize();
				color1 = meshcapture_tool_color;
				
				if (meshcapture_tool_shadows)
				{
					color1.r = Mathf.Abs((pos_n.x+pos_n.y+pos_n.z)/3);
					color1.g = Mathf.Abs((pos_n.x+pos_n.y+pos_n.z)/3);
					color1.b = Mathf.Abs((pos_n.x+pos_n.y+pos_n.z)/3);
					
					color1.r *= meshcapture_tool_color.r;
					color1.g *= meshcapture_tool_color.g;
					color1.b *= meshcapture_tool_color.b;
				}
				
				position[0].x *= meshcapture_tool_scale; 
				position[0].z *= meshcapture_tool_scale;
				position[0].y *= meshcapture_tool_scale;
				position[0].x += meshcapture_tool_image_width/2;
				position[0].z += meshcapture_tool_image_height/2;
				position[0].y += meshcapture_tool_image_height/2;
				
				position[1].x *= meshcapture_tool_scale;
				position[1].z *= meshcapture_tool_scale;
				position[1].y *= meshcapture_tool_scale;
				position[1].x += meshcapture_tool_image_width/2;
				position[1].z += meshcapture_tool_image_height/2;
				position[1].y += meshcapture_tool_image_height/2;
				
				position[2].x *= meshcapture_tool_scale;
				position[2].z *= meshcapture_tool_scale;
				position[2].y *= meshcapture_tool_scale;
				position[2].x += meshcapture_tool_image_width/2;
				position[2].z += meshcapture_tool_image_height/2;
				position[2].y += meshcapture_tool_image_height/2;
				
				var xx: float = 0;
				var xx2: float = 700;
				var xx3: float = 900;
				Line(meshcapture_tool_image,position[0].x-xx,position[0].z,position[1].x-xx,position[1].z,color1);
				Line(meshcapture_tool_image,position[0].x-xx,position[0].z,position[2].x-xx,position[2].z,color1);
				Line(meshcapture_tool_image,position[1].x-xx,position[1].z,position[2].x-xx,position[2].z,color1);
			}
		}
		
		if (meshcapture_tool_save_scale)
 		{
 			var color_scale: Color = convert_float_to_color(meshcapture_tool_scale);
 			var color_temp: Color;
 			color_temp = meshcapture_tool_image.GetPixel(0,0);
 			color_temp[3] = color_scale[0];
 			meshcapture_tool_image.SetPixel(0,0,color_temp);
 			color_temp = meshcapture_tool_image.GetPixel(1,0);
 			color_temp[3] = color_scale[1];
 			meshcapture_tool_image.SetPixel(1,0,color_temp);
 			color_temp = meshcapture_tool_image.GetPixel(2,0);
 		    color_temp[3] = color_scale[2];
 			meshcapture_tool_image.SetPixel(2,0,color_temp);
 	    	color_temp = meshcapture_tool_image.GetPixel(3,0);
 			color_temp[3] = color_scale[3];
 			meshcapture_tool_image.SetPixel(3,0,color_temp);
 		}
		meshcapture_tool_image.Apply();
	}
	return 1;
}

function Line (tex : Texture2D, x0 : int, y0 : int, x1 : int, y1 : int, col : Color) 
{
	var dy: int = y1-y0;
	var dx: int = x1-x0;
 
	var stepx: int;
	var stepy: int;
 
	if (dy < 0) {dy = -dy;stepy = -1;}
	else {stepy = 1;}
	if (dx < 0) {dx = -dx;stepx = -1;}
	else {stepx = 1;}
	dy <<= 1;
	dx <<= 1;
 
	tex.SetPixel(x0, y0, col);
	if (dx > dy) 
	{
		var fraction: int = dy-(dx >> 1);
		while (x0 != x1) 
		{
			if (fraction >= 0) 
			{
				y0 += stepy;
				fraction -= dx;
			}
			x0 += stepx;
			fraction += dy;
			tex.SetPixel(x0,y0,col);
		}
	}
	else 
	{
		fraction = dx - (dy >> 1);
		while (y0 != y1) {
			if (fraction >= 0) 
			{
				x0 += stepx;
				fraction -= dy;
			}
			y0 += stepy;
			fraction += dx;
			tex.SetPixel(x0,y0,col);
		}
	}
}

function texture_fill_color(texture1: Texture2D,color: Color)
{
	var resolution: float = texture1.width*texture1.height;
	var fillcolor: Color[] = new Color[resolution];
	
	for (color1 in fillcolor){color1 = color;}
	
	texture1.SetPixels(0,0,texture1.width,texture1.height,fillcolor); 
}

function tree_placed_reset()
{
	for (var count_layer: int = 0;count_layer < prelayer.layer.Count;++count_layer)
	{
		if (prelayer.layer[count_layer].output == layer_output_enum.tree)
		{
			for (var count_tree: int = 0;count_tree < prelayer.layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				prelayer.layer[count_layer].tree_output.tree[count_tree].placed = 0;
			}
		}
	}
}

function disable_outputs()
{
	heightmap_output = false;
	color_output = false;
	splat_output = false;
	tree_output = false;
	grass_output = false;
	object_output = false;
}

function check_treemap(): boolean
{
	for (var count_treemap: int = 0;count_treemap < settings.treemap.Count;++count_treemap) {
		if (settings.treemap[count_treemap].map) {
			if (settings.treemap[count_treemap].load) {
				return true;
			}
		}
	}
	return false;
}

function check_grassmap(): boolean
{
	for (var count_grassmap: int = 0;count_grassmap < settings.grassmap.Count;++count_grassmap) {
		if (settings.grassmap[count_grassmap].map) {
			if (settings.grassmap[count_grassmap].load) {
				return true;
			}
		}
	}
	return false;
}

function generate_begin_mesh(): int
{
	// Debug.Log("Generate mesh begin");
	prelayer = prelayers[0];
	UnityEngine.Random.seed = seed;
	
	prelayer.count_terrain = 0;
	
	for (var i: int = 0;i < meshes.Count;++i) {
		if (!meshes[i].gameObject || !meshes[i].meshFilter || !meshes[i].mesh || !meshes[i].active) {
			meshes.RemoveAt(i);
			--i;
		}
	}
	
	get_meshes_areas();
	calc_total_mesh_area();
	get_meshes_minmax_height();
	
	generate_pause = false;
	prelayer_stack.Add(0);
	
	// reset placement counters
	link_placed_reference();
	loop_prelayer("(gfc)(slv)(ocr)(asr)(cpo)(ias)(eho)(st)(cmn)(ed)",0,false);
	
	if (!find_mesh()){return -1;}
					
	if (prelayer.layer.Count == 0) 	return -2;
	
	if (prelayers.Count > 1){area_stack_enabled = true;}
	
	#if !UNITY_WEBPLAYER && !UNITY_WP8
	load_raw_heightmaps();
	#endif
	
	generate_time_start = Time.realtimeSinceStartup;
	generate_time = 0;
	tree_number = 0;
	auto_speed_time = Time.realtimeSinceStartup;
	
	generate_mesh_start();
	
	return 1;
}

// generate_begin
function generate_begin(): int
{
	if (heightmap_output)
	{
		if (!color_output && !splat_output && !tree_output && !grass_output && !object_output){only_heightmap = true;}
	}
	
	prelayer = prelayers[0];
	
	UnityEngine.Random.seed = seed;
	
	// if (settings.resolution_density){settings.resolution_density_conversion = (1.0/(settings.resolution_density_min*1.0));}
	
	// if (slice_tool_active && !slice_tool_terrain){return -6;}
	prelayer.count_terrain = 0;
	
	generate_world_mode = prelayers[0].prearea.active;
	var count_terrain2: int = 0;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		terrains[count_terrain].index = count_terrain;
		terrains[count_terrain].index_old = count_terrain2;
		++count_terrain2;
		if(!terrains[count_terrain].terrain){terrains.RemoveAt(count_terrain);--count_terrain;continue;} 
		if(!terrains[count_terrain].terrain.terrainData){terrains.RemoveAt(count_terrain);--count_terrain;}
	}
	
	assign_all_terrain_splat_alpha();
	
	if (terrains.Count == 0) {return -2;}
	
	get_terrains_position();
	
	for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
    {
    	terrains[count_terrain].heightmap_resolution = terrains[count_terrain].terrain.terrainData.heightmapResolution;
		terrains[count_terrain].splatmap_resolution = terrains[count_terrain].terrain.terrainData.alphamapResolution;
		terrains[count_terrain].detail_resolution = terrains[count_terrain].terrain.terrainData.detailResolution;
    	
    	if (terrains[count_terrain].prearea.resolution_mode == resolution_mode_enum.Automatic){select_automatic_step_resolution(terrains[count_terrain],terrains[count_terrain].prearea);}
    	set_area_resolution(terrains[count_terrain],terrains[count_terrain].prearea);
    	terrains[count_terrain].prearea.round_area_to_step(terrains[count_terrain].prearea.area);
    	terrains[count_terrain].prearea.area_old = terrains[count_terrain].prearea.area;
    	
    	if (!world_output) {
    		terrains[count_terrain].prearea.area.x += terrains[count_terrain].terrain.transform.position.x;
    		terrains[count_terrain].prearea.area.y += terrains[count_terrain].terrain.transform.position.z;
    	}
    	if (!object_output) {
	    	terrains[count_terrain].prearea.area.xMax += terrains[count_terrain].prearea.step.x/2;
	    	terrains[count_terrain].prearea.area.yMin -= terrains[count_terrain].prearea.step.y/2;
	    }
    	
		if (color_output)
		{
			terrains[count_terrain].color_length = 3;
			terrains[count_terrain].color = new float[3];
			terrains[count_terrain].color_layer = new float[3];
		}
		if (splat_output)
		{
			terrains[count_terrain].splat_length = terrains[count_terrain].terrain.terrainData.splatPrototypes.Length;
			if (terrains[count_terrain].splat_length == 0 && (color_output || splat_output)){preterrain = terrains[count_terrain];return -3;}
			if (terrains[count_terrain].splat_length == 1 && splat_output){preterrain = terrains[count_terrain];return -5;}
			if (terrains[count_terrain].splat_length < terrains[0].splat_length){preterrain = terrains[count_terrain];return -7;}
				
			terrains[count_terrain].splat = new float[terrains[count_terrain].splat_length];
			terrains[count_terrain].splat_calc = new float[terrains[count_terrain].splat_length];
			terrains[count_terrain].splat_layer = new float[Mathf.Ceil(terrains[count_terrain].splat_length/4.0)*4.0];
		}
		
		if (button_export)
		{
			if (!export_texture){export_texture = new Texture2D(terrains[0].prearea.resolution,terrains[0].prearea.resolution,TextureFormat.RGB24, false);}
		}
		
		if (grass_output) {
			if (terrains[count_terrain].terrain.terrainData.detailPrototypes.Length < terrains[0].terrain.terrainData.detailPrototypes.Length){preterrain = terrains[count_terrain];return -8;}
			terrains[count_terrain].grass = new float[terrains[count_terrain].terrain.terrainData.detailPrototypes.Length];
		}
    }
    
    if (heightmap_output)
	{
		heights = new float[terrains[0].terrain.terrainData.heightmapResolution,terrains[0].terrain.terrainData.heightmapResolution];
		// script_base.terrains[count_terrain].heights = terrains[count_terrain].heights;
	}
	
	if (grass_output)
	{
		grass_detail = new detail_class[terrains[0].terrain.terrainData.detailPrototypes.Length];
		
		for (var count_detail: int = 0;count_detail < grass_detail.Length;++count_detail) {
			grass_detail[count_detail] = new detail_class();
			grass_detail[count_detail].detail = new int[terrains[0].detail_resolution,terrains[0].detail_resolution];
		}
		grass_resolution_old = preterrain.detail_resolution;
	}
	
	
    generate_pause = false;
	prelayer_stack.Add(0);
	
	// reset placement counters
	link_placed_reference();
	loop_prelayer("(gfc)(slv)(ocr)(asr)(cpo)(ias)(eho)(st)(cmn)(ed)",0,false);
	
	if (!find_terrain(true)){return -1;}
	preterrain = terrains[prelayer.count_terrain];
    
	if (generate_world_mode)
	{
		// prelayer.prearea.area.yMin -= (prelayer.prearea.step.y/2);
    	// prelayer.prearea.area.yMax += (prelayer.prearea.step.y/2);
    	// prelayer.prearea.area.xMin -= (prelayer.prearea.step.x/2);
    	// prelayer.prearea.area.xMax += (prelayer.prearea.step.x/2); 
    }
     
	#if !UNITY_WEBPLAYER && !UNITY_WP8
	load_raw_heightmaps();
	#endif
					
	if (!heightmap_output_layer){heightmap_output = false;}
	if (prelayer.layer.Count == 0) {
		if ((tree_output && check_treemap()) || (grass_output && check_grassmap())) {
		
		}
		else {
			return -2;
		}
	}
	
	if (prelayers.Count > 1){area_stack_enabled = true;}
	
	generate_time_start = Time.realtimeSinceStartup;
	generate_time = 0;
	
	tree_number = 0;
	
	auto_speed_time = Time.realtimeSinceStartup;
	
	generate_terrain_start();
	
	return 1;
}

function GenerateHeightmapBegin()
{
	only_heightmap = true;
	
	prelayer = prelayers[0];
	
	UnityEngine.Random.seed = seed;
	
	// if (settings.resolution_density){settings.resolution_density_conversion = (1.0/(settings.resolution_density_min*1.0));}
	
	// if (slice_tool_active && !slice_tool_terrain){return -6;}
	prelayer.count_terrain = 0;
	
	generate_world_mode = prelayers[0].prearea.active;
	
	generate_pause = false;
	prelayer_stack.Add(0);
	
	if (!find_terrain(true)){return -1;}
	preterrain = terrains[prelayer.count_terrain];
    
	#if !UNITY_WEBPLAYER && !UNITY_WP8
	load_raw_heightmaps();
	#endif
					
	if (!heightmap_output_layer){heightmap_output = false;}
	
	if (prelayers.Count > 1){area_stack_enabled = true;}
	
	generate_time_start = Time.realtimeSinceStartup;
	generate_time = 0;
	
	auto_speed_time = Time.realtimeSinceStartup;
	
	generate_terrain_start();
	
	return 1;
}

//function CreateAreaStackHeightmap()
//{
//	var conversion: Vector2;
//	var area: Rect = new Rect();
//	var heightmapResolution;
//	
//	for (var i: int = 0;i < terrains.Count;++i) {
//		heightmapResolution = terrains[i].heightmap_resolution;
//		conversion.x = terrains[i].size.x/heightmapResolution;
//		conversion.y = terrains[i].size.y/heightmapResolution;
//		area.xMin = Mathf.Round((terrains[i].area.xMin/terrains[i].size.x)*heightmapResolution);
//		area.xMax = Mathf.Round((terrains[i].area.xMax/terrains[i].size.x)*heightmapResolution);
//		area.yMin = Mathf.Round((terrains[i].area.yMin/terrains[i].size.z)*heightmapResolution);
//		area.yMax = Mathf.Round((terrains[i].area.yMax/terrains[i].size.z)*heightmapResolution);
//		
//		areaStack.Add(new GenerateArea_Class(area,conversion,terrains[i]));	
//	}
//}

function select_automatic_step_resolution(preterrain1: terrain_class,prearea: area_class)
{
	var resolution: int = 0;
	
	if (preterrain1.terrain.terrainData.heightmapResolution > resolution && heightmap_output){resolution = preterrain1.terrain.terrainData.heightmapResolution;prearea.resolution_mode = resolution_mode_enum.Heightmap;}
	if (preterrain1.terrain.terrainData.alphamapResolution > resolution && color_output){resolution = colormap_resolution;prearea.resolution_mode = resolution_mode_enum.Colormap;}
	if (preterrain1.terrain.terrainData.alphamapResolution > resolution && splat_output){resolution = preterrain1.terrain.terrainData.alphamapResolution;prearea.resolution_mode = resolution_mode_enum.Splatmap;}
	if (preterrain1.terrain.terrainData.detailResolution > resolution && grass_output){resolution = preterrain1.terrain.terrainData.detailResolution;prearea.resolution_mode = resolution_mode_enum.Detailmap;}
	if (prearea.tree_resolution > resolution && tree_output){resolution = prearea.tree_resolution;prearea.resolution_mode = resolution_mode_enum.Tree;}
	if (prearea.object_resolution > resolution && object_output){resolution = prearea.object_resolution;prearea.resolution_mode = resolution_mode_enum.Object;}
	
	if (resolution == 0){resolution = resolution_mode_enum.Detailmap;prearea.resolution_mode = resolution_mode_enum.Detailmap;}
}

function select_automatic_step_resolution_mesh(prearea: area_class) 
{
	resolution = object_resolution;
	prearea.resolution_mode = resolution_mode_enum.Object;
}

function generate_mesh_start()
{
	premesh = meshes[prelayer.count_terrain];
	var rect: Rect = get_mesh_area(prelayer.count_terrain);
	
	rect.xMin = Mathf.Ceil(rect.xMin/object_resolution)*object_resolution;
	rect.yMin = Mathf.Ceil(rect.yMin/object_resolution)*object_resolution;
	rect.xMax = Mathf.Floor(rect.xMax/object_resolution)*object_resolution;
	rect.yMax = Mathf.Floor(rect.yMax/object_resolution)*object_resolution;
	
	prelayer.prearea.area.xMin = rect.xMin;
	prelayer.prearea.area.yMin = rect.yMin;
	prelayer.prearea.area.width = rect.width;
	prelayer.prearea.area.height = rect.height;
	
	prelayer.y = prelayer.prearea.area.yMax;
	// select_image_prelayer();
}

function get_mesh_area(count_terrain: int): Rect
{
	var rect: Rect;
	rect.xMin = meshes[count_terrain].mesh.bounds.center.x-meshes[count_terrain].mesh.bounds.extents.x+meshes[count_terrain].gameObject.transform.position.x;
	rect.yMin = meshes[count_terrain].mesh.bounds.center.z-meshes[count_terrain].mesh.bounds.extents.z+meshes[count_terrain].gameObject.transform.position.z;
	rect.width = meshes[count_terrain].mesh.bounds.size.x;
	rect.height = meshes[count_terrain].mesh.bounds.size.z;
	
	return rect;
}

function get_meshes_areas()
{
	for (var i: int = 0;i < meshes.Count;++i) {
		meshes[i].area = get_mesh_area(i);
	}
}

function calc_total_mesh_area()
{
	var rect: Rect;
	meshes_area.area = get_mesh_area(0);
		
	for (var i: int = 1;i < meshes.Count;++i) {
		rect = get_mesh_area(i);
		if (rect.xMin < meshes_area.area.xMin) meshes_area.area.xMin = rect.xMin;
		if (rect.xMax > meshes_area.area.xMax) meshes_area.area.xMax = rect.xMax;
		if (rect.yMin < meshes_area.area.yMin) meshes_area.area.yMin = rect.yMin;
		if (rect.yMax > meshes_area.area.yMax) meshes_area.area.yMax = rect.yMax;
	}
}

function GetMeshHeightSlope(premesh1: mesh_class,position: Vector2)
{
	var ray: Ray;
	ray.direction = new Vector3(0,-1,0);
	ray.origin = new Vector3(position.x,premesh1.transform.position.y+1000,position.y);
	var hit: RaycastHit;
	var hit2: RaycastHit;
	// if (Physics.CapsuleCast(new Vector3(position.x,premesh1.transform.position.y+1000,position.y),new Vector3(position.x,premesh1.transform.position.y+1001,position.y),50,new Vector3(0,-1,0),hit,2000)) {
	if (Physics.Raycast(ray,hit,2000)) {
		if ((hit.collider.gameObject.layer & meshes_layer) == meshes_layer) {
			mesh_measure.hit = true;
			mesh_measure.height = hit.point.y; 
			mesh_measure.degree = 1-((hit.normal.y-0.5)*2);
			// Debug.Log(mesh_measure.degree);
			mesh_measure.normal = hit.normal;
			mesh_measure.transform = hit.transform;
			return;
		}
	}
	mesh_measure.hit = false;
}

// generate_terrain_start
function generate_terrain_start()
{
	if (!generate_world_mode)
	{
		prelayer.prearea = preterrain.prearea;
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	 	{
	 		terrains[count_terrain].on_row = false;
	 	}
	 	preterrain.on_row = true;
	}
		
	prelayer.y = prelayer.prearea.area.yMax;
	
	select_image_prelayer();
	
	if (button_export)
	{
		if (heightmap_output){export_bytes = new byte[Mathf.Pow(preterrain.terrain.terrainData.heightmapResolution,2)*2];}
	}
}

// generate_output
function generate_output(prelayer3: prelayer_class): int
{
	generate_error = true;
	
	if (prelayer3.prearea.step.x == 0 || prelayer3.prearea.step.y == 0){generate = false;Debug.Log("Area size is 0...");return -1;}
	
	frames = 1/(Time.realtimeSinceStartup-auto_speed_time);
 	auto_speed_time = Time.realtimeSinceStartup;
 	generate_speed = 10000;
 	
 	break_x = false; 
 	row_object_count = 0;
   
 	for(prelayer3.counter_y = prelayer3.y;prelayer3.counter_y >= prelayer3.y-(generate_speed*prelayer.prearea.step.y);prelayer3.counter_y -= prelayer.prearea.step.y)
 	{
 		generate_call_time = Time.realtimeSinceStartup;
 		var y: float = prelayer3.y;
 		var count_terrain: int;
 			
 		if (prelayer3.counter_y < prelayer3.prearea.area.yMin)
	 	{
	 		if (prelayer_stack.Count > 1)
	 		{
	 			// if (line_output){line_generate(prelayer3.index);}
	 			prelayer_stack.RemoveAt(prelayer_stack.Count-1);
	 			// area_stack.Add(prelayer.prearea.area);
	 			prelayer = prelayers[prelayer_stack[prelayer_stack.Count-1]];
	 			generate_error = false;
	 			return 2;
	 		}
	 		if (generate_world_mode)
	 		{
	 			generate = false;
	 			for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
		 		{
		 			terrain_apply(terrains[count_terrain]); 	
		 		}
	 		}
	 		else
	 		{
	 			if (settings.showTerrains) {
	 				if (prelayer3.count_terrain >= terrains.Count-1){generate = false;} 
	 				terrain_apply(terrains[prelayer3.count_terrain]);
	 			}
	 			else {
	 				if (prelayer3.count_terrain >= meshes.Count-1){generate = false;} 
	 			}
	 		}
	 		
	 		if (button_export)
	 		{
	 			export_name = export_file;
	 			if (terrains.Count > 1){export_name += "_"+prelayer.count_terrain;}
				
				if (settings.colormap || preterrain.rtp_script)
				{
					if (settings.colormap_auto_assign || settings.normalmap_auto_assign){script_base.preterrain = script_base.terrains[prelayer3.count_terrain];}
				}
				
				generate_export = 1;
			}
	 		
	 		generate_time = Time.realtimeSinceStartup - generate_time_start;
	 		
	 		if (generate)
	 		{
	 			++prelayer3.count_terrain;
	 			if (settings.showTerrains) {
		 			if (find_terrain(false))
		 			{
		 				preterrain = terrains[prelayer3.count_terrain];
		 				generate_terrain_start();
		 			}
		 			else {generate = false;}
		 		}
		 		else {
		 			if (find_mesh()) {
		 				generate_mesh_start();
		 			}
		 			else generate = false;
		 		}
	 		} 
	 		else {
	 			// if (settings.showTerrains) set_neighbor(1); 
	 			// FlushTerrains();
	 			
	 			object_apply();
	 		}
	 		// if (!generate && line_output){line_generate(0);}
	 		generate_error = false;
	 		return 2;
 		}	
 		
 		if (generate_world_mode || prelayer3.index > 0)
 		{
	 		for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
	 		{
	 			if (terrains[count_terrain].rect.Contains(Vector2(terrains[count_terrain].prearea.area.x,y))){terrains[count_terrain].on_row = true;} else {terrains[count_terrain].on_row = false;}
	 		}
	 	}
 	    
 		for (prelayer3.x = prelayer3.prearea.area.x+prelayer3.break_x_value;prelayer3.x <= prelayer3.prearea.area.xMax;prelayer3.x += prelayer3.prearea.step.x)
 		{
 			var x: float = prelayer3.x;
 			var curve: float;
			var strength: float;
			var strength2: float;
			var counter_y: float = prelayer3.counter_y;
			
			if (generate_world_mode || prelayer3.index > 0)
			{
				var out_of_range: boolean = true;
				
				for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
				{
					if (terrains[count_terrain].rect.Contains(Vector2(x,counter_y)))
					{
						out_of_range = false;
						preterrain = terrains[count_terrain];
						break;
					}
				}
				if (out_of_range) {continue;}
 			}
 			
 			local_x = x-preterrain.rect.x;
			local_y = counter_y-preterrain.rect.y;	
 			
			if (prelayer3.prearea.rotation_active) {
				var rotation_pos: Vector2 = calc_rotation_pixel(x,counter_y,prelayer3.prearea.center.x,prelayer3.prearea.center.y,prelayer3.prearea.rotation.y);
				x = rotation_pos.x;
				counter_y = rotation_pos.y;
			}
			
			local_x_rot = x-preterrain.rect.x;
			local_y_rot = counter_y-preterrain.rect.y;	
	 		
			if (!only_heightmap)
	 		{
	 			if (settings.showTerrains) {
	 				degree = (calc_terrain_angle(preterrain,local_x_rot,local_y_rot,settings.smooth_angle)*settings.global_degree_strength)+settings.global_degree_level;
	 				height = ((preterrain.terrain.terrainData.GetHeight(local_x_rot/preterrain.heightmap_conversion.x,local_y_rot/preterrain.heightmap_conversion.y)/preterrain.size.y)*settings.global_height_strength)+settings.global_height_level;
	 				if (measure_normal){normal = preterrain.terrain.terrainData.GetInterpolatedNormal((local_x_rot/preterrain.size.x),(local_y_rot/preterrain.size.z));}
	 			} else {
	 				GetMeshHeightSlope(premesh,new Vector2(x,counter_y));
	 				if (mesh_measure.hit) {
		 				degree = mesh_measure.degree*90;
		 				height = (mesh_measure.height-mesh_measure.transform.position.y)/meshes_heightscale;
		 				normal = mesh_measure.normal;
		 			}
		 			else continue;
	 			}
	 		}
	 		
			
			random_range = UnityEngine.Random.Range(0.00,1000.00);
			
			// color-splat output
			if (!heightmap_output)
			{
				map_x = Mathf.Round(local_x_rot/preterrain.splatmap_conversion.x);
				map_y = Mathf.Round(local_y_rot/preterrain.splatmap_conversion.y);
				if (map_y > preterrain.splatmap_resolution-1){map_y = preterrain.splatmap_resolution-1;}
				else if (map_y < 0){map_y = 0;}
				if (map_x > preterrain.splatmap_resolution-1){map_x = preterrain.splatmap_resolution-1;}
				else if (map_x < 0){map_x = 0;}
			}
			
			// grass_output
			if (grass_output)
			{
				detailmap_x = Mathf.Floor(local_x_rot/preterrain.detailmap_conversion.x);
				detailmap_y = Mathf.Floor(local_y_rot/preterrain.detailmap_conversion.y);
				
				if (detailmap_x > preterrain.detail_resolution-1){detailmap_x = preterrain.detail_resolution-1;}
				else if (detailmap_x < 0){detailmap_x = 0;}
				if (detailmap_y > preterrain.detail_resolution-1){detailmap_y = preterrain.detail_resolution-1;}
				else if (detailmap_y < 0){detailmap_y = 0;}
			}
			
			// heightmap output
			else if (heightmap_output)
			{
				heightmap_x = Mathf.Round(local_x_rot/preterrain.heightmap_conversion.x); 
				heightmap_y = Mathf.Round(local_y_rot/preterrain.heightmap_conversion.y);
				
				// if (heightmap_x_old == heightmap_x && heightmap_y_old == heightmap_y){Debug.Log("Hit");}
				
				heightmap_x_old = heightmap_x;
				heightmap_y_old = heightmap_y;
				
				if (heightmap_y > preterrain.heightmap_resolution-1){heightmap_y = preterrain.heightmap_resolution-1;}
				else if (heightmap_y < 0){heightmap_y = 0;}
				if (heightmap_x > preterrain.heightmap_resolution-1){heightmap_x = preterrain.heightmap_resolution-1;}
				else if (heightmap_x < 0){heightmap_x = 0;}
				
 				heights[heightmap_y,heightmap_x]  = 0;
			}
			
			overlap = false;
			
			// process all layers
			for (var count_layer: int = 0;count_layer < prelayer3.layer.Count;++count_layer)
			{
				current_layer = prelayer3.layer[count_layer];
				
	        	filter_value = 0;
	        	filter_strength = 1;
	        	
				// process all filters
				if (current_layer.output == layer_output_enum.heightmap)
				{
					layer_x = heightmap_x*preterrain.heightmap_conversion.x;
					layer_y = heightmap_y*preterrain.heightmap_conversion.y;
				}
				else if (current_layer.output == layer_output_enum.color || current_layer.output == layer_output_enum.splat)
				{
					layer_x = map_x*preterrain.splatmap_conversion.x;
					layer_y = map_y*preterrain.splatmap_conversion.y;
				}
				else if (current_layer.output == layer_output_enum.grass)
				{
					layer_x = detailmap_x*preterrain.detailmap_conversion.x;
					layer_y = detailmap_y*preterrain.detailmap_conversion.y;
				}
				else {layer_x = local_x_rot;layer_y = local_y_rot;}
				
				for (var count_filter: int = 0;count_filter < current_layer.prefilter.filter_index.Count;++count_filter)
				{
					calc_filter_value(filter[current_layer.prefilter.filter_index[count_filter]],counter_y,x);
				}
				
				// tree generate
				switch(current_layer.output)
				{
					// tree
					case layer_output_enum.tree:
						if (overlap) break;
						if (subfilter_value*current_layer.strength > 0)
						{
							// if (local_x_rot < prelayer3.prearea.step.x){continue;}
							// if (local_y_rot > preterrain.size.z-prelayer3.prearea.step.y){continue;}
							if (current_layer.tree_output.tree.Count == 0){continue;}
							var tempInstance: TreeInstance;
							var tree_filter_strength: float = 0;
							var tree_filter_curve: float;
							var tree_filter_random_curve: float;
							var place: boolean = true;
							var tree_index: int = Mathf.FloorToInt(current_layer.tree_output.tree_value.curve.Evaluate(filter_value)*(current_layer.tree_output.tree.Count));
							if (tree_index > current_layer.tree_output.tree.Count-1){tree_index = current_layer.tree_output.tree.Count-1;}
							if (tree_index < 0){tree_index = 0;}
							
							var current_tree3: tree_class = current_layer.tree_output.tree[tree_index];
							tempInstance.prototypeIndex = current_tree3.prototypeindex;
							
							if (current_layer.positionSeed) {
								if (counter_y == 0 || x == 0) {
									UnityEngine.Random.seed = (seed-10)+((counter_y+1)*(x+1))+10000000+(count_layer);								
								}
								else {
									UnityEngine.Random.seed = (seed-10)+(counter_y*x)+(count_layer);							
								}
							}
					
							random_range2 = UnityEngine.Random.value;
							if (random_range2 > ((subfilter_value*current_layer.strength))){continue;}
							filter_value = 0;
							for (var count_tree_filter: int = 0;count_tree_filter < current_tree3.prefilter.filter_index.Count;++count_tree_filter)
							{
								calc_filter_value(filter[current_tree3.prefilter.filter_index[count_tree_filter]],counter_y,x);
							}	
							
							var tree_height_range: float = current_tree3.height_end-current_tree3.height_start;
							
							var tree_height_pos: float = (tree_height_range*filter_value);
							var tree_height: float = tree_height_pos+current_tree3.height_start;
							
							var tree_height_pos_ratio: float = tree_height_pos/tree_height_range;
							
							var tree_width_range: float = current_tree3.width_end-current_tree3.width_start;
							
							var tree_width_start_n: float = ((tree_width_range*tree_height_pos_ratio)-(current_tree3.unlink*tree_height_pos))+current_tree3.width_start;
							if (tree_width_start_n < current_tree3.width_start){tree_width_start_n = current_tree3.width_start;}
							var tree_width_end_n: float = ((tree_width_range*tree_height_pos_ratio)+(current_tree3.unlink*tree_height_pos))+current_tree3.width_start;
							if (tree_width_end_n > current_tree3.width_end){tree_width_end_n = current_tree3.width_end;}
							
							var tree_width: float = UnityEngine.Random.Range(tree_width_start_n,tree_width_end_n);
							
							scale = Vector3(tree_width,tree_height,tree_width);
							var random_pos_x: float = 0;
							var random_pos_z: float = 0; 
							
							if (current_tree3.random_position)
							{	
								random_pos_x = UnityEngine.Random.Range(-prelayer3.prearea.step.x/2,prelayer.prearea.step.x/2);
								random_pos_z = UnityEngine.Random.Range(-prelayer3.prearea.step.y/2,prelayer.prearea.step.y/2);
							}
							
							var height2: float = preterrain.terrain.terrainData.GetInterpolatedHeight((local_x_rot+random_pos_x)/preterrain.size.x,(local_y_rot+random_pos_z)/preterrain.size.z);
							
							position = Vector3(local_x_rot+random_pos_x,height2+current_tree3.height,local_y_rot+random_pos_z);
							
							if (current_tree3.distance_level != distance_level_enum.This || (current_tree3.min_distance.x != 0 || current_tree3.min_distance.z != 0 || current_tree3.min_distance.y != 0))
							{
								object_info.position = position+Vector3(preterrain.rect.x,0,preterrain.rect.y);
								object_info.min_distance = current_tree3.min_distance;
								if (current_tree3.distance_include_scale){object_info.min_distance = Vector3(object_info.min_distance.x*scale.x,object_info.min_distance.y*scale.y,object_info.min_distance.z*scale.z);}
								if (current_tree3.distance_include_scale_group){object_info.min_distance = object_info.min_distance*current_layer.tree_output.scale;}
								
								object_info.distance_rotation = current_tree3.distance_rotation_mode;
								object_info.distance_mode = current_tree3.distance_mode;
								
								switch(current_tree3.distance_level)
								{
									case distance_level_enum.This:
										place = check_object_distance(current_tree3.objects_placed);
										break;
										
									case distance_level_enum.Layer:
										place = check_object_distance(current_layer.objects_placed);
										break;
									
									case distance_level_enum.LayerLevel:
										place = check_object_distance(prelayer3.objects_placed);
										break;
										
									case distance_level_enum.Global:
										place = check_object_distance(objects_placed);
										break;
								}	
							}
							
							if (current_tree3.raycast) {
								/*
								if (Physics.SphereCast (position+Vector3(0,current_tree3.cast_height,0),current_tree3.ray_radius,current_tree3.ray_direction,hit,current_tree3.ray_length)) {
									layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
									if (layerHit &  current_tree3.layerMask) {
										position.y = hit.point.y;
									} 
								}
								*/
								
								if (current_tree3.raycast_mode == raycast_mode_enum.Hit) {
									if (Physics.SphereCast (Vector3(x+random_pos_x+(prelayer.prearea.step.x/2),(height*preterrain.size.y)+current_tree3.cast_height,prelayer.counter_y+random_pos_z),current_tree3.ray_radius,current_tree3.ray_direction,hit,current_tree3.ray_length,current_tree3.layerMask)) {
										layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
										if (layerHit & current_tree3.layerMask) {
											continue;
										} 
									}
								}
								else {
									if (Physics.Raycast (Vector3(x+random_pos_x+(prelayer.prearea.step.x/2),current_tree3.cast_height,prelayer.counter_y+random_pos_z),current_tree3.ray_direction,hit,current_tree3.ray_length,current_tree3.layerMask)) {
										layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
										if (layerHit &  current_tree3.layerMask) {
											position.y = hit.point.y;
										} 
									}
								}
							}
															
							if (place)
							{																																																																								
								tempInstance.position = Vector3(position.x/preterrain.size.x,position.y/preterrain.size.y,position.z/preterrain.size.z);
								if (current_tree3.precolor_range.color_range.Count != 0)
								{
									var color_range_number: int = Mathf.FloorToInt(current_tree3.precolor_range.color_range_value.curve.Evaluate(subfilter_value)*current_tree3.precolor_range.color_range.Count);
									if (color_range_number > current_tree3.precolor_range.color_range.Count-1){color_range_number = current_tree3.precolor_range.color_range.Count-1;}
									var color_range: color_range_class = current_tree3.precolor_range.color_range[color_range_number];
									tree_color = random_color_from_range(color_range.color_start,color_range.color_end);
								}
												
								tempInstance.color = tree_color;
								
								tempInstance.lightmapColor = tree_color;
								tempInstance.heightScale = scale.y*current_layer.tree_output.scale;
								tempInstance.widthScale = scale.x*current_layer.tree_output.scale;
								#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_01 && !UNITY_4_2 && !UNITY_4_3 && !UNITY_4_4 && !UNITY_4_5 && !UNITY_4_6
								tempInstance.rotation = UnityEngine.Random.Range(0,Mathf.PI*2);
								#endif
																
								tree_instances.Add(tempInstance);
								++current_tree3.placed;
								++prelayer.layer[count_layer].tree_output.placed;
								
								current_tree3.placed_reference.placed = current_tree3.placed;
								prelayer.layer[count_layer].tree_output.placed_reference.placed = prelayer.layer[count_layer].tree_output.placed;

								if (current_layer.nonOverlap) overlap = true;
							}
						}
						break;
					
					// grass generate
					case layer_output_enum.grass:
						if (subfilter_value*current_layer.strength > 0)
						{
							var count_grass: int;
							var grass_total = 0;
							for (count_grass = 0;count_grass < preterrain.grass.Length;++count_grass) {
								grass_total += preterrain.grass[count_grass];
								grass_detail[count_grass].detail[detailmap_y,detailmap_x] += preterrain.grass[count_grass]*settings.grass_density;
								if (grass_detail[count_grass].detail[detailmap_y,detailmap_x] < 0) grass_detail[count_grass].detail[detailmap_y,detailmap_x] = 0;
								else if (grass_detail[count_grass].detail[detailmap_y,detailmap_x] > 16) grass_detail[count_grass].detail[detailmap_y,detailmap_x] = 16;
							}
							if (current_layer.nonOverlap && grass_total > 0) overlap = true;
						}
						for (count_value = 0;count_value < preterrain.grass.Length;++count_value)
						{
							preterrain.grass[count_value] = 0;
						}
						break;
					
					// object generate
					case layer_output_enum.object:
						if (overlap) {break;}
						if (subfilter_value*current_layer.strength*filter_strength > 0)
						{
							// if (local_x_rot < prelayer3.prearea.step.x){continue;}
							// if (local_y_rot > preterrain.size.z-prelayer3.prearea.step.y){continue;}

							if (current_layer.object_output.object.Count == 0){continue;}
							
							/*
							if (current_layer.object_output.object_mode == object_mode_enum.LinePlacement)
							{
								var pixel_color: Color = calc_image_value(current_layer.object_output.line_placement.preimage,local_x_rot,local_y_rot);
								if (pixel_color[0] == current_layer.object_output.line_placement.line_list[0].color[0])
								{
									if (current_layer.object_output.placed_reference)
									{
										height_interpolated = preterrain.terrain.terrainData.GetInterpolatedHeight((local_x_rot)/preterrain.size.x,(local_y_rot)/preterrain.size.z);
										current_layer.object_output.placed_reference.line_placement.line_list[0].points[(pixel_color[2]*255)] = new Vector3(x,height_interpolated,counter_y);
									}
								}
								continue;
							}
							*/
							
							var object_index: int = current_layer.object_output.object_value.curve.Evaluate(filter_value)*(current_layer.object_output.object.Count);
							if (object_index > current_layer.object_output.object.Count-1){object_index = current_layer.object_output.object.Count-1;}
							if (object_index < 0){object_index = 0;}
							var current_object: object_class = current_layer.object_output.object[object_index];
							if (current_object.place_maximum) {
								if (current_object.placed_prelayer >= current_object.place_max) {
									continue;
								}
							}
							
							if (current_layer.positionSeed) {
								if (counter_y == 0 || x == 0) {
									UnityEngine.Random.seed = (seed-10)+((counter_y+1)*(x+1))+10000000+(count_layer);								
								}
								else {
									UnityEngine.Random.seed = (seed-10)+(counter_y*x)+(count_layer);							
								}
							}
					
							random_range2 = UnityEngine.Random.Range(0.0,1.0);
							// Mathf.PerlinNoise(-x*counter_y,counter_y*x);
							//Debug.Log(random_range2);
							
							if (random_range2 > ((subfilter_value*current_layer.strength*filter_strength))){continue;}
							place = true;
							
							var clear_list: boolean = true;
							var rotation: Quaternion = Quaternion.identity;
							var count_object: int;
							
							position = Vector3(x,0,counter_y);
							// var position_random: Vector3;
							var position_start: Vector3 = current_object.position_start;
							var position_end: Vector3 = current_object.position_end; 
							var position_random: Vector3;
							
							position_random.x = UnityEngine.Random.Range(position_start.x,position_end.x);
							position_random.y = UnityEngine.Random.Range(position_start.y,position_end.y);
							position_random.z = UnityEngine.Random.Range(position_start.z,position_end.z);
							
							if (current_object.random_position) {
								position_random.x += UnityEngine.Random.Range(-prelayer3.prearea.step.x,prelayer3.prearea.step.x);
								position_random.z += UnityEngine.Random.Range(-prelayer3.prearea.step.y,prelayer3.prearea.step.y);
							}
							
							position += position_random;
							
							// Debug.Log(preterrain.prearea.area);
							if (settings.showTerrains) {
								if (!preterrain.prearea.area.Contains(Vector2(position.x,position.z))) continue;
							}
							else 
								if (!premesh.area.Contains(Vector2(position.x,position.z))) continue;
							
							if (current_object.terrain_rotate) {
								var rotation1: Vector3 = preterrain.terrain.terrainData.GetInterpolatedNormal(((local_x_rot+position_random.x)/preterrain.size.x),((local_y_rot+position_random.y)/preterrain.size.z));
								rotation1.x = (rotation1.x/3)*2;
								rotation1.z = (rotation1.z/3)*2;
								
								rotation = Quaternion.FromToRotation(Vector3.up,rotation1);
							    // rotation *= Quaternion.AngleAxis(90, Vector3.right);
							}
				
							if (!current_object.rotation_map.active) {
								rotation *= Quaternion.AngleAxis(UnityEngine.Random.Range(current_object.rotation_start.x,current_object.rotation_end.x), Vector3.right);
								rotation *= Quaternion.AngleAxis(UnityEngine.Random.Range(current_object.rotation_start.y,current_object.rotation_end.y), Vector3.up);
								rotation *= Quaternion.AngleAxis(UnityEngine.Random.Range(current_object.rotation_start.z,current_object.rotation_end.z), Vector3.forward);
								
								rotation *= Quaternion.Euler(current_object.parent_rotation);
							}
							else {
								rotation *= Quaternion.AngleAxis(current_object.rotation_map.calc_rotation(get_image_pixel(current_object.rotation_map.preimage,local_x,local_y)),Vector3.up);
							}
							
							if (current_object.look_at_parent) {
								rotation.y = Quaternion.LookRotation(Vector3(prelayer3.prearea.area.center.x,0,prelayer3.prearea.area.center.y)-position).eulerAngles.y;
							}
								
							if (current_object.rotation_steps)
							{
								var rotation2: Vector3 = rotation.eulerAngles;
								if (current_object.rotation_step.x != 0){rotation2.x = Mathf.Round(rotation2.x/current_object.rotation_step.x)*current_object.rotation_step.x;}
								if (current_object.rotation_step.y != 0){rotation2.y = Mathf.Round(rotation2.y/current_object.rotation_step.y)*current_object.rotation_step.y;}
								if (current_object.rotation_step.z != 0){rotation2.z = Mathf.Round(rotation2.z/current_object.rotation_step.z)*current_object.rotation_step.z;}
								rotation.eulerAngles = rotation2;
							}	
									
							if (current_layer.object_output.group_rotation)
							{
								var object_index_rot: int = check_object_rotate(current_layer.object_output.objects_placed,current_layer.object_output.objects_placed_rot,position,current_layer.object_output.min_distance_x_rot,current_layer.object_output.min_distance_z_rot);
									
								if (object_index_rot != -1)
								{
									rotation.eulerAngles = current_layer.object_output.objects_placed_rot[object_index_rot];
									
									if (current_layer.object_output.group_rotation_steps)
									{
										if (current_layer.object_output.group_rotation_step.x != 0){rotation.x += Mathf.Round(UnityEngine.Random.Range(0,360/current_layer.object_output.group_rotation_step.x))*current_layer.object_output.group_rotation_step.x;}
										if (current_layer.object_output.group_rotation_step.y != 0){rotation.y += Mathf.Round(UnityEngine.Random.Range(0,360/current_layer.object_output.group_rotation_step.y))*current_layer.object_output.group_rotation_step.y;}
										if (current_layer.object_output.group_rotation_step.z != 0){rotation.z += Mathf.Round(UnityEngine.Random.Range(0,360/current_layer.object_output.group_rotation_step.z))*current_layer.object_output.group_rotation_step.z;}
									}
								}
							}	
							
							if (current_object.terrain_height) {
								if (settings.showTerrains) {
									height_interpolated = preterrain.terrain.terrainData.GetInterpolatedHeight((local_x_rot+position_random.x)/preterrain.size.x,(local_y_rot+position_random.z)/preterrain.size.z);
									position.y = (height_interpolated)+preterrain.terrain.transform.position.y+position_random.y;
								}
								else {
									GetMeshHeightSlope(premesh,new Vector2(x+position_random.x,counter_y+position_random.z));
	 								if (mesh_measure.hit) {
	 									height_interpolated = mesh_measure.height;
	 									degree = mesh_measure.degree;
	 									position.y = height_interpolated+position_random.y;
	 								}
	 								else {
	 									continue;
	 								}
								}
							}
							
							if (current_object.sphereOverlapRadius > 0) {
								if (Physics.OverlapSphere(new Vector3(position.x,position.y+current_object.sphereOverlapHeight,position.z),current_object.sphereOverlapRadius).Length != 0) {
									continue;
								}
							}
							
							position.y -= degree*current_object.slopeY;
							
							var scale_x_range: float = current_object.scale_end.x-current_object.scale_start.x;
							scale.x = UnityEngine.Random.Range(current_object.scale_start.x,current_object.scale_end.x);
							//scale.x = (current_object.scaleCurve.Evaluate((scale.x-current_object.scale_start.x)/scale_x_range)*scale_x_range)+current_object.scale_start.x;
							
							var scale_x_pos: float = scale.x-current_object.scale_start.x;
							var scale_x_pos_ratio: float = scale_x_pos/scale_x_range;
							
							var scale_y_range: float = current_object.scale_end.y-current_object.scale_start.y;
							var scale_y_start_n: float = ((scale_y_range*scale_x_pos_ratio)-(current_object.unlink_y*scale_x_pos))+current_object.scale_start.y;
							if (scale_y_start_n < current_object.scale_start.y){scale_y_start_n = current_object.scale_start.y;}
							var scale_y_end_n: float = ((scale_y_range*scale_x_pos_ratio)+(current_object.unlink_y*scale_x_pos))+current_object.scale_start.y;
							if (scale_y_end_n > current_object.scale_end.y){scale_y_end_n = current_object.scale_end.y;}
							
							scale.y = UnityEngine.Random.Range(scale_y_start_n,scale_y_end_n);
							//scale.y = (current_object.scaleCurve.Evaluate((scale.y-current_object.scale_start.y)/scale_y_range)*scale_y_range)+current_object.scale_start.y;
							
							var scale_z_range: float = current_object.scale_end.z-current_object.scale_start.z;
							var scale_z_start_n: float = ((scale_z_range*scale_x_pos_ratio)-(current_object.unlink_z*scale_x_pos))+current_object.scale_start.z;
							if (scale_z_start_n < current_object.scale_start.z){scale_z_start_n = current_object.scale_start.z;}
							var scale_z_end_n: float = ((scale_z_range*scale_x_pos_ratio)+(current_object.unlink_z*scale_x_pos))+current_object.scale_start.z;
							if (scale_z_end_n > current_object.scale_end.z){scale_z_end_n = current_object.scale_end.z;}
							
							scale.z = UnityEngine.Random.Range(scale_z_start_n,scale_z_end_n);
							//scale.z = (current_object.scaleCurve.Evaluate((scale.z-current_object.scale_start.z)/scale_z_range)*scale_z_range)+current_object.scale_start.z;
							
							if (current_object.raycast) {
								/*
								if (Physics.SphereCast (position+Vector3(0,current_object.cast_height,0),current_object.ray_radius,current_object.ray_direction,hit,current_object.ray_length)) {
									layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
									if (layerHit &  current_object.layerMask) {
										position.y = hit.point.y;
									} 
								}
								*/
								
								if (current_object.raycast_mode == raycast_mode_enum.Hit) {
									if (Physics.SphereCast (Vector3(x+(prelayer.prearea.step.x/2),(height*preterrain.size.y)+current_object.cast_height,prelayer.counter_y),current_object.ray_radius,current_object.ray_direction,hit,current_object.ray_length,current_object.layerMask)) {
										layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
										if (layerHit & current_object.layerMask) {
											continue;
										} 
									}
								}
								else {
									if (Physics.Raycast (Vector3(x+(prelayer.prearea.step.x/2),current_object.cast_height,prelayer.counter_y),current_object.ray_direction,hit,current_object.ray_length,current_object.layerMask)) {
										layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
										if (layerHit &  current_object.layerMask) {
											position.y = hit.point.y;
										} 
									}
								}
							}
							
							if (current_object.pivot_center) {
								position.y += scale.y/2;	
							}
							
							var distanceCheck: boolean = false;
							
							if (current_object.distance_level != distance_level_enum.This || (current_object.min_distance.x != 0 || current_object.min_distance.z != 0 || current_object.min_distance.y != 0))
							{
								distanceCheck = true;
								object_info.position = position;
								object_info.rotation = rotation.eulerAngles; 
								object_info.min_distance = current_object.min_distance;
								if (current_object.distance_include_scale){object_info.min_distance = Vector3(object_info.min_distance.x*scale.x,object_info.min_distance.y*scale.y,object_info.min_distance.z*scale.z);}
								if (current_object.distance_include_scale_group){object_info.min_distance = object_info.min_distance*current_layer.object_output.scale;}
								if (current_object.includeScale) object_info.min_distance = Vector3.Scale(object_info.min_distance,current_object.object1.transform.lossyScale);
								
								object_info.distance_rotation = current_object.distance_rotation_mode;
								object_info.distance_mode = current_object.distance_mode;
								
								switch(current_object.distance_level)
								{
									case distance_level_enum.This:
										place = check_object_distance(current_object.objects_placed);
										break;
										
									case distance_level_enum.Layer:
										place = check_object_distance(current_layer.objects_placed);
										break;
									
									case distance_level_enum.LayerLevel:
										place = check_object_distance(prelayer3.objects_placed);
										break;
										
									case distance_level_enum.Global:
										place = check_object_distance(objects_placed);
										break;
								}	
								
							}
							
							scale *= current_layer.object_output.scale; 
							if (current_object.includeScale) scale = Vector3.Scale(scale,current_object.object1.transform.localScale);
							
							if (place)
							{
								var resolution1: float = preterrain.size.z; 
								resolution1 = resolution1 / preterrain.heightmap_resolution;
								
								if (current_layer.nonOverlap) overlap = true;								

								if (current_object.objectStream) {
									// combine_script.objectsCreate[combine_script.objectsCreate.Count-1].objects.Add(new object_point_class2(current_object.objectIndex,position,rotation,scale));
								}
								else {
									var object1: GameObject;
								
									#if UNITY_EDITOR
									if (!current_object.prefab) {
									#endif
										object1 = Instantiate(current_object.object1,position,Quaternion.identity);
										pointsRange.Add(new object_point_class(Vector2(position.x,position.z),object1));
									#if UNITY_EDITOR
									}
									else {
										object1 = PrefabUtility.InstantiatePrefab(current_object.object1 as GameObject) as GameObject;
										object1.transform.position = position;
									}
									#endif
									
									if (current_object.lookAtObject != null) {
										object1.transform.LookAt(current_object.lookAtObject);
										object1.transform.eulerAngles = new Vector3(rotation.eulerAngles.x,object1.transform.eulerAngles.y+rotation.eulerAngles.y,rotation.eulerAngles.z);
									}
									else object1.transform.rotation = rotation;
									
									object1.transform.localScale = scale;
									#if !UNITY_3_4 && !UNITY_3_5
										object1.SetActive(false);
									#else
										object1.active = false;
									#endif	
									
									
									
									placedObjects.Add(object1);									

									var material_index: int = 0;
									if (current_object.object_material.active){material_index = current_object.object_material.set_material(object1,0);}
									
									// combine children
									if (current_object.combine)
									{
										if (current_object.object_material.combine_count[material_index] >= current_object.mesh_combine || (!current_object.combine_total && current_object.placed_prelayer == 0)){current_object.object_material.combine_count[material_index] = 0;}
										 									
										if (current_object.object_material.combine_count[material_index] == 0)
										{
											var mat_text: String;
											if (current_object.object_material.material.Count > 1){mat_text = "_mat"+material_index;}
											current_object.object_material.combine_parent[material_index] = Instantiate(Combine_Children);
											if (settings.parentObjectsTerrain) {
												current_object.object_material.combine_parent[material_index].transform.parent = preterrain.objectParent.transform;	
											}
											else {
												current_object.object_material.combine_parent[material_index].transform.parent = current_object.parent;
											}
											if (current_object.combine_parent_name == ""){current_object.object_material.combine_parent[material_index].name = current_object.object1.name+mat_text;} else {current_object.object_material.combine_parent[material_index].name = current_object.combine_parent_name+mat_text;}
											
										}
										object1.transform.parent = current_object.object_material.combine_parent[material_index].transform;
										
									} 
									else {
										if (settings.parentObjectsTerrain) {
											object1.transform.parent = preterrain.objectParent.transform;
										}
										else {
											object1.transform.parent = current_object.parent;
										}
									}
									
									current_object.object_material.combine_count[material_index] += 1;
									object1.name = current_object.object1.name+"_"+current_object.placed;
								}
								
								if (distanceCheck)
								{
									current_layer.object_output.objects_placed.Add(position);
									if (current_layer.object_output.group_rotation){current_layer.object_output.objects_placed_rot.Add(rotation.eulerAngles);}
								}
								++current_object.placed;
								++current_object.placed_prelayer;
								++current_layer.object_output.placed;
								++row_object_count;
								
								current_object.placed_reference.placed = current_object.placed;
								current_layer.object_output.placed_reference.placed = current_layer.object_output.placed;
								
								current_object.object2 = object1;
								
								if (current_object.prelayer_created)
								{
									if (prelayers[current_object.prelayer_index].prearea.active)
									{
										set_object_child(current_object,rotation.eulerAngles);
										prelayer3.x += prelayer3.prearea.step.x;
										prelayer3.y = prelayer3.counter_y;
										if (prelayer3.x <= prelayer.prearea.area.xMax){prelayer3.break_x_value = prelayer3.x-prelayer3.prearea.area.x;}
										else {prelayer3.y -= prelayer3.prearea.step.y;prelayer3.break_x_value = 0;}
										prelayer_stack.Add(current_object.prelayer_index);
										prelayer = prelayers[current_object.prelayer_index];
											
										prelayer.prearea.area.x = position.x+(prelayer.prearea.area_old.x)*scale.x;
										prelayer.prearea.area.y = position.z+(prelayer.prearea.area_old.y)*scale.z;
										
										prelayer.prearea.area.width = prelayer.prearea.area_old.width*scale.x;
										prelayer.prearea.area.height = prelayer.prearea.area_old.height*scale.z;
										
										if (rotation.y != 0)
										{
											prelayer.prearea.rotation = rotation.eulerAngles;
											prelayer.prearea.rotation_active = true;
										}
										
										prelayer.prearea.step.y = Mathf.Sqrt(Mathf.Pow(prelayer.prearea.step_old.x,2)+Mathf.Pow(prelayer.prearea.step_old.y,2))/2;
										prelayer.prearea.step.x = prelayer.prearea.step.y;
										
										prelayer.prearea.center = Vector2(position.x,position.z);
										prelayer.y = prelayer.prearea.area.yMax; 
										generate_error = false;
										return 3;
									}
								}
							} 
						}	
						break;
						
						// heightmap generate
						case layer_output_enum.heightmap:
							if (!button_export)
							{
								heights[heightmap_y,heightmap_x] += filter_value*current_layer.strength;
							}
							break;	
						}
				// splatmap generate
				if (current_layer.output == layer_output_enum.splat)
				{
                    for (count_value = 0;count_value < preterrain.splat_length;++count_value)
					{
						preterrain.splat_layer[count_value] += preterrain.splat[count_value];
					}
					for (count_value = 0;count_value < preterrain.splat.length;++count_value)
					{
						preterrain.splat[count_value] = 0;
					}
				}
				// colormap generate
				if (current_layer.output == layer_output_enum.color)
				{
					for (count_value = 0;count_value < preterrain.color_length;++count_value)
					{
						preterrain.color_layer[count_value] += preterrain.color[count_value];
					}
					for (count_value = 0;count_value < preterrain.color_length;++count_value)
					{
						preterrain.color[count_value] = 0;
					}
				}
			}
			
			if (button_export)
			{
				var color3: Color;
				if (color_output)
				{
					for (count_value = 0;count_value < 3;++count_value)
					{
						color3[count_value] = (preterrain.color_layer[count_value]);
						preterrain.color_layer[count_value] = 0;
					}
				}
				if (splat_output)
				{
					for (count_value = 0;count_value < 3;++count_value)
					{
						color3[count_value] = (preterrain.splat_layer[count_value]);
						preterrain.splat_layer[count_value] = 0;
					}
				}
				
				if (heightmap_output)
				{
					convert_16to8_bit(heights[heightmap_y,heightmap_x]);
					color3[0] = 0;
					color3[1] = (byte_hi*1.0)/255;
					color3[2] = (byte_lo*1.0)/255;
					color3[3] = 0;
					
					export_bytes[((heightmap_x*2)+(heightmap_y*2049*2))] = byte_hi;
					export_bytes[(((heightmap_x*2)+1)+(heightmap_y*2049*2))] = byte_lo;
				}
				
				export_texture.SetPixel(map_x,map_y,color3); 
			}
			else
			{
				if (splat_output) {
					var splatTotal: float;
					// if (!settings.runtime_create_terrain) {
						var splat_length: int = preterrain.splat_layer.Length/4;
						splatTotal = 0; 
						  			    
						for (count_value = 0;count_value < preterrain.splat_layer.Length;++count_value) {
							splatTotal += preterrain.splat_layer[count_value];
						}
						// if (splatTotal < 1) splatTotal = 1;		
						for (var count_alpha: int = 0;count_alpha < splat_length;++count_alpha)
						{    			     
							for (count_value = 0;count_value < 4;++count_value)
							{
							    color3[count_value] = preterrain.splat_layer[(count_alpha*4)+count_value]/splatTotal;
								preterrain.splat_layer[(count_alpha*4)+count_value] = 0;
							}
							// Debug.Log("Splatmap: "+color3);
							preterrain.splat_alpha[count_alpha].SetPixel(map_x,map_y,color3);
						}
//					}
//					else {
//						splatTotal = 0;   			    
//						for (count_value = 0;count_value < 4;++count_value) {
//							splatTotal += preterrain.splat[count_value]+preterrain.splat_layer[count_value];
//						}	
//						if (splatTotal < 1) splatTotal = 1;	
//						for (count_value = 0;count_value < preterrain.splat_length;++count_value) {
//							alphamap[map_y,map_x,count_value] = preterrain.splat_layer[count_value]/splatTotal;
//							preterrain.splat_layer[count_value] = 0;
//						}
//					}
				}
				
				if (color_output) {
					if (!settings.direct_colormap) {
						// if (!settings.runtime_create_terrain) {
							color3[3] = 0;
							for (count_value = 0;count_value < 3;++count_value)
							{
							    color3[count_value] = preterrain.color_layer[count_value];
								preterrain.color_layer[count_value] = 0;
							}
							preterrain.splat_alpha[count_alpha].SetPixel(map_x,map_y,color3);
//						}
//						else {
//							for (count_value = 0;count_value < preterrain.color_length;++count_value) {
//								alphamap[map_y,map_x,count_value] = preterrain.color_layer[count_value];
//								preterrain.color_layer[count_value] = 0;
//							}
//						}
					}
					else {
						color3[3] = 1;
						for (count_value = 0;count_value < 3;++count_value) {
							color3[count_value] = preterrain.color_layer[count_value];
							preterrain.color_layer[count_value] = 0;
						}
						preterrain.ColorGlobal.SetPixel(map_x,map_y,color3);
					}
				}
			}
			
			if (Time.realtimeSinceStartup-auto_speed_time > (1.0/target_frame))
			{
				// Debug.Log("Generate Frame: "+1/(Time.realtimeSinceStartup-auto_speed_time));
				prelayer3.break_x_value = (prelayer3.x-prelayer3.prearea.area.x)+prelayer3.prearea.step.x;
				
				row_object_count = 0;
				break_x = true;
				prelayer3.y = prelayer3.counter_y;
				generate_time = Time.realtimeSinceStartup - generate_time_start;
				
				generate_error = false;
				//Debug.Log("return frame");
				return 4;
			}
			else {
				// Debug.Log("Loop Frame: "+1/(Time.realtimeSinceStartup-auto_speed_time));
			}
		} 
		prelayer3.break_x_value = 0;
 	}
   							
   prelayer3.y -= ((generate_speed+1)*prelayer.prearea.step.y);
   
   generate_time = Time.realtimeSinceStartup - generate_time_start;
   
   generate_error = false;
   return 1;
}  

function set_object_child(object: object_class,rotation: Vector3)
{
	for (var count_object: int = 0;count_object < object.object_child.Count;++count_object)
	{
		object.object_child[count_object].parent_rotation = rotation;
		if (!object.object_child[count_object].place_maximum_total){object.object_child[count_object].placed_prelayer = 0;}
		if (!object.object_child[count_object].parent || object.object_child[count_object].parent_set){object.object_child[count_object].parent = object.object2.transform;object.object_child[count_object].parent_set = true;}
	}
}

function create_object_child_list(object: object_class)
{
	if (!object.prelayer_created){return;}
	
	for (var count_layer: int = 0;count_layer < prelayers[object.prelayer_index].layer.Count;++count_layer)
	{
		if (prelayers[object.prelayer_index].layer[count_layer].output == layer_output_enum.object)
		{
			for (var count_object: int = 0;count_object < prelayers[object.prelayer_index].layer[count_layer].object_output.object.Count;++count_object)
			{
				object.object_child.Add(prelayers[object.prelayer_index].layer[count_layer].object_output.object[count_object]);
			}
		}
	}
}

function calc_filter_value(filter: filter_class,counter_y: float,x: float)
{
	var range: float;
	var value0: float;
	var color0: Color;
	var color1: Color;
	filter_input = 0;
	filter_strength = filter.strength;
	var splatmap: boolean = false;
	
	if (filter.device == filter_devices_enum.Standard)
	{	
		switch (filter.type)
		{
			// height filter
			case condition_type_enum.Height:
				filter_input = height;
				break;
			
			// current filter
			case condition_type_enum.Current:
				if (filter.change_mode == change_mode_enum.filter)
				{
					filter_input = filter_value;
				}
				else
				{
					if (current_layer.output == layer_output_enum.heightmap)
					{
						filter_input = filter_value+heights[heightmap_y,heightmap_x];
					}
				}
				break;
			
			// always filter
			case condition_type_enum.Always:
				filter_input = filter.curve_position;
				break;
			
			// steepness filter
			case condition_type_enum.Steepness:
				filter_input = degree/90;
				break;
			
			// direction filter
			case condition_type_enum.Direction:
				var curve_x: float;
				var curve_y: float;
				var curve_z: float;
				
				if (normal.x >= 0){curve_x = filter.precurve_x_right.curve.Evaluate(normal.x);}
					else {curve_x = filter.precurve_x_left.curve.Evaluate(normal.x);}
				if (normal.z >= 0){curve_z = filter.precurve_z_right.curve.Evaluate(normal.z);}
					else {curve_z = filter.precurve_z_left.curve.Evaluate(normal.z);}
				curve_y = filter.precurve_y.curve.Evaluate(normal.y);
				
				var curve_total = curve_x+curve_y+curve_z;
				filter_input = curve_total;
				break;
			
			// image filter
			case condition_type_enum.Image:
				color1 = calc_image_value(filter.preimage,layer_x,layer_y);
				if (filter.preimage.splatmap) {
					splatmap = true;
					if (!filter.preimage.includeAlpha) color1.a = 0;
				}
				if (filter.preimage.output) filter_input = filter.preimage.output_pos;
				// Debug.Log(color1);
				break;
				
			// raw heightmap filter
			case condition_type_enum.RawHeightmap:
				calc_raw_value(filter.raw,layer_x,layer_y);
				filter_input = filter.raw.output_pos;
				break;
			
			// random filter
			case condition_type_enum.Random:
				filter_input = UnityEngine.Random.Range(0.0,1.0);
				break;
			
			//random range
			case condition_type_enum.RandomRange:
				if(random_range > filter.range_start && random_range < filter.range_end)
				{
					filter_input = UnityEngine.Random.Range(0.0,1.0);
				}
				break;
				
			// splatmap filter
			case condition_type_enum.Splatmap:
				if (splat_output) {
					filter_input = preterrain.splat_layer[filter.splat_index];
					if (filter_input < filter.curve_position) filter_input = 0;
				}
				else if (filter.splatmap < preterrain.splat_alpha.Length) {
					color = preterrain.splat_alpha[filter.splatmap].GetPixel(map_x,map_y);
					filter_input = color[filter.splat_index-(filter.splatmap*4)];
					if (filter_input < filter.curve_position) filter_input = 0;
				}
				else {
					filter_input = 1;
				}
				break;
				
			// raycast filter
			case condition_type_enum.RayCast:
				if (filter.raycast_mode == raycast_mode_enum.Hit) {
					if (Physics.SphereCast (Vector3(x+(prelayer.prearea.step.x/2),(height*preterrain.size.y)+filter.cast_height,prelayer.counter_y),(prelayer.prearea.step.x/2)*filter.ray_radius,filter.ray_direction,hit,filter.ray_length,filter.layerMask)) {
					layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
						if (layerHit &  filter.layerMask) {
							filter_input = 0;
						} 
						else {
							filter_input = 1;
						}
					}
					else {
						filter_input = 1;
					}
				}
				else if (filter.raycast_mode == raycast_mode_enum.Height) {
					if (Physics.Raycast (Vector3(x+(prelayer.prearea.step.x/2),filter.cast_height,prelayer.counter_y),filter.ray_direction,hit,filter.ray_length,filter.layerMask)) {
						layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
						if (layerHit &  filter.layerMask) {
							filter_input = hit.point.y/preterrain.terrain.terrainData.size.y;
						} 
						else {
							//filter_input = 0;
							filter_strength = 0;
						}
					}
					else {
						//filter_input = 0;
						filter_strength = 0;
					}
				}
			}
	}
	else if (filter.device == filter_devices_enum.Math)
	{
		switch(filter.type2)
		{
			case device2_type_enum.Sin:
				filter_input = Mathf.Sin((x*1.0)/20);
				break;
			
			case device2_type_enum.Sin:
			filter_input = Mathf.Cos((x*1.0)/20);
				break;
		}
	}
	
	// curve
	for (var count_curve: int = 0;count_curve < filter.precurve_list.Count;++count_curve)
	{
		switch(filter.precurve_list[count_curve].type)
		{
			case curve_type_enum.Normal:
				filter_input = filter.precurve_list[count_curve].curve.Evaluate(filter_input);
				break;
			case curve_type_enum.Random:
			    range = filter.precurve_list[count_curve].curve.Evaluate(filter_input);
				if (!filter.precurve_list[count_curve].abs){filter_input += UnityEngine.Random.Range(-range,range);} else {filter_input += UnityEngine.Random.Range(0,range);}
				break;
			case curve_type_enum.Perlin:
				var pos: Vector2;
				if (filter.precurve_list[count_curve].rotation) pos = calc_rotation_pixel(x,counter_y,0,0,-filter.precurve_list[count_curve].rotation_value); else pos = new Vector2(x,counter_y);
				value0 = filter.precurve_list[count_curve].curve.Evaluate(filter_input);
				range = perlin_noise(pos.x,pos.y,filter.precurve_list[count_curve].offset.x,filter.precurve_list[count_curve].offset.y,filter.precurve_list[count_curve].frequency,filter.precurve_list[count_curve].detail,filter.precurve_list[count_curve].detail_strength)*value0*filter.precurve_list[count_curve].strength;
				if (!filter.precurve_list[count_curve].abs){filter_input += ((range*2)-(value0));} else {filter_input += range;}
				break;
		}
	}
								
	// subfilter
	if (filter.presubfilter.subfilter_index.Count > 0)
	{
		if (filter.sub_strength_set){subfilter_value = 0;} else {subfilter_value = 1;}

		// subfilters
		for (var count_subfilter: int = 0;count_subfilter < filter.presubfilter.subfilter_index.Count;++count_subfilter)
		{
			current_subfilter = subfilter[filter.presubfilter.subfilter_index[count_subfilter]];
			
			calc_subfilter_value(filter,current_subfilter,counter_y,x);	
		}
		 
		if (filter.last_value_declared)
		{
			var pos_x: int = (x-prelayer.prearea.area.xMin)/prelayer.prearea.step.x;
			filter.last_value_y[pos_x] = filter_input;
			filter.last_pos_x = pos_x;
			filter.last_value_x[0] = filter_input;
		}
	} 
	else
	{
		subfilter_value = 1;
	} 
	
	var splat_total: float = 0;
	
	// Debug.Log(filter_combine);
	
	if (!filter.combine){filter_input += filter_combine;filter_combine = 0;filter_combine_start = 0;}
	else {
		if (filter_combine_start != 0) {filter_combine_start = filter_value;}
	}
	
	if (current_layer.output == layer_output_enum.splat) {
		if (!(filter.type == condition_type_enum.Image && filter.preimage.edge_blur))
		{
//			for (count_value = 0;count_value < current_layer.splat_output.splat.Count;++count_value)
//			{
//				current_layer.splat_output.splat_calc[count_value] = current_layer.splat_output.curves[count_value].curve.Evaluate(current_layer.splat_output.splat_value.curve.Evaluate(filter_input));
//			}
			
			for (count_value = 0;count_value < preterrain.splat.Length;++count_value) {
				preterrain.splat_calc[count_value] = 0;
			}
			
			// if (filter1.mode == filter_mode_enum.Single)
			// {
				// filter_input += filter_value;
				for (count_value = 0;count_value < current_layer.splat_output.splat.Count;++count_value)
				{
					if (current_layer.splat_output.splat_custom[count_value].custom)
					{
						for (var count_value2: int = 0;count_value2 < preterrain.splat.Length;++count_value2) {
							preterrain.splat_calc[count_value2] += current_layer.splat_output.curves[count_value].curve.Evaluate(current_layer.splat_output.splat_value.curve.Evaluate(filter_input))*(current_layer.splat_output.splat_custom[count_value].value[count_value2]/current_layer.splat_output.splat_custom[count_value].totalValue);
						}	
					}
					else
					{
						preterrain.splat_calc[current_layer.splat_output.splat[count_value]] += current_layer.splat_output.curves[count_value].curve.Evaluate(current_layer.splat_output.splat_value.curve.Evaluate(filter_input));
					}
				}
			// }
		}
	}
	
	// color calculate
	if (current_layer.output == layer_output_enum.color)
	{
		if (filter.type == condition_type_enum.Image && filter.preimage.rgb)
		{
			color0 = color1;
		}
		else
		{
			color0[0] = current_layer.color_output.precolor_range[filter.color_output_index].curve_red.Evaluate(current_layer.color_output.precolor_range[filter.color_output_index].color_range_value.curve.Evaluate(filter_input));
			color0[1] = current_layer.color_output.precolor_range[filter.color_output_index].curve_green.Evaluate(current_layer.color_output.precolor_range[filter.color_output_index].color_range_value.curve.Evaluate(filter_input));
			color0[2] = current_layer.color_output.precolor_range[filter.color_output_index].curve_blue.Evaluate(current_layer.color_output.precolor_range[filter.color_output_index].color_range_value.curve.Evaluate(filter_input));
			color0[3] = 0;
		}
			
		if (export_color_advanced)
		{
			color0 *= export_color;
		
			if (export_color_curve_advanced)
			{
				color0[0] = export_color_curve_red.Evaluate(color0[0]);
				color0[1] = export_color_curve_green.Evaluate(color0[1]);
				color0[2] = export_color_curve_blue.Evaluate(color0[2]);
			}
			else
			{
				color0[0] = export_color_curve.Evaluate(color0[0]);
				color0[1] = export_color_curve.Evaluate(color0[1]);
				color0[2] = export_color_curve.Evaluate(color0[2]);
			}
		}
	}
	
	// grass calculate
	else if (current_layer.output == layer_output_enum.grass)
	{
		for (count_value = 0;count_value < current_layer.grass_output.grass_calc.Count;++count_value)
		{
			current_layer.grass_output.grass_calc[count_value] = current_layer.grass_output.curves[count_value].curve.Evaluate(current_layer.grass_output.grass_value.curve.Evaluate(filter_input));
		}
	}
	
	// filter output
	switch (filter.output)
	{
		// add filter
		case condition_output_enum.add:
			if (current_layer.output == layer_output_enum.heightmap){filter_value += filter_input*filter_strength*subfilter_value;}
				else {filter_value += filter_input;}
				
			if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
			if (current_layer.output == layer_output_enum.color)
			{
				for (count_value = 0;count_value < 3;++count_value)
				{
					preterrain.color[count_value] += color0[count_value]*(current_layer.strength*filter_strength*subfilter_value);
				}
			}
			if (current_layer.output == layer_output_enum.splat)
			{
				if (!splatmap) {
					for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
					{
						preterrain.splat[count_value] += preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value);
					}
				}
				else {
					for (count_value = 0;count_value < 4;++count_value)
					{
						if (count_value > preterrain.splat.Length-1) {break;}
						preterrain.splat[current_layer.splat_output.splat[count_value]] += (color1[count_value]*(current_layer.strength*filter_strength*subfilter_value));
					}
					// Debug.Log(splatTotal);
				}
			}
			else if (current_layer.output == layer_output_enum.grass)
			{
				for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
				{
					preterrain.grass[current_layer.grass_output.grass[count_value].prototypeindex] += current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value);
				}
			}
			break;	
		
		// subtract filter
		case condition_output_enum.subtract:
			if (current_layer.output == layer_output_enum.heightmap){filter_value -= filter_input*filter_strength*subfilter_value;}
				else {filter_value -= filter_input;}
			
			if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
			
			if (current_layer.output == layer_output_enum.color)
			{
				for (count_value = 0;count_value < 3;++count_value)
				{
					preterrain.color[count_value] -= (color0[count_value]*(current_layer.strength*filter_strength*subfilter_value));
				}
			}
			if (current_layer.output == layer_output_enum.splat)
			{
				if (!splatmap) {
					for(count_value = 0;count_value < preterrain.splat.Length;++count_value)
					{
						preterrain.splat[count_value] -= preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value);
					}
				}
				else {
					for (count_value = 0;count_value < 4;++count_value)
					{
						if (count_value > preterrain.splat.Length-1) {break;}
						preterrain.splat[current_layer.splat_output.splat[count_value]] -= color1[count_value]*(current_layer.strength*filter_strength*subfilter_value);
					}
				}
			}
			else if (current_layer.output == layer_output_enum.grass)
			{
				for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
				{
					preterrain.grass[current_layer.grass_output.grass[count_value].prototypeindex] -= current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value);
				}
			}
			break;
		
		// change filter
		case condition_output_enum.change:
			if (current_layer.output == layer_output_enum.heightmap)
			{
				if (filter.change_mode == change_mode_enum.filter)
				{
					filter_value = (filter_value*(1-(subfilter_value*filter_strength)))+(filter_input*(subfilter_value*filter_strength)); 
				}
				else
				{
					if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
					heights[heightmap_y,heightmap_x] = ((heights[heightmap_y,heightmap_x]+filter_value)*(1-(subfilter_value*filter_strength)))+(filter_input*(subfilter_value*filter_strength));
				}
			}
			else {filter_value = (filter_value*(1-(subfilter_value)))+(filter_input*(subfilter_value));}
			
			if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
			
			if (current_layer.output == layer_output_enum.color)
			{
				if (filter.type == condition_type_enum.Current)
				{
					if (filter.change_mode == change_mode_enum.filter)
					{
						for(count_value = 0;count_value < 3;++count_value)
						{
							preterrain.color[count_value] = preterrain.color[count_value]-(preterrain.color[count_value]*(1-subfilter_value)*current_layer.strength*filter_strength);
						}
					}
					else
					{
						for(count_value = 0;count_value < 3;++count_value)
						{
							preterrain.color_layer[count_value] = preterrain.color_layer[count_value]-(preterrain.color_layer[count_value]*(1-subfilter_value)*current_layer.strength*filter_strength);
						}
					}
				}
				else 
				{
					for(count_value = 0;count_value < 3;++count_value)
					{
						preterrain.color_layer[count_value] = (preterrain.color_layer[count_value]*(1-(subfilter_value*filter_strength*current_layer.strength)))+(color0[count_value]*subfilter_value*filter_strength*current_layer.strength);
					}
				}
			}
			if (current_layer.output == layer_output_enum.splat)
			{
				if (filter.type == condition_type_enum.Current)
				{
					if (filter.change_mode == change_mode_enum.filter)
					{
						for(count_value = 0;count_value < preterrain.splat.Length;++count_value)
						{
							preterrain.splat[count_value] = preterrain.splat[count_value]-(preterrain.splat[count_value]*(1-subfilter_value)*current_layer.strength*filter_strength);
						}
					}
					else
					{
						for(count_value = 0;count_value < preterrain.splat.Length;++count_value)
						{	
							preterrain.splat_layer[count_value] = preterrain.splat_layer[count_value]-(preterrain.splat_layer[count_value]*(1-subfilter_value)*current_layer.strength*filter_strength);
						}
					}
				}
				else 
				{
					if (filter.change_mode == change_mode_enum.filter)
					{
						if (!splatmap) {
							for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
							{
								preterrain.splat[count_value] = (preterrain.splat[count_value]*(1-(filter_strength*current_layer.strength*subfilter_value)))+(preterrain.splat_calc[count_value]*subfilter_value*filter_strength*current_layer.strength);
							}
						}
						else {
							for (count_value = 0;count_value < 4;++count_value)
							{ 
								if (count_value > preterrain.splat.Length-1) {break;}
								preterrain.splat[current_layer.splat_output.splat[count_value]] = (preterrain.splat[current_layer.splat_output.splat[count_value]]*(1-(filter_strength*current_layer.strength*subfilter_value)))+(color1[count_value]*(current_layer.strength*filter_strength*subfilter_value));
							}
						}
					}
					else
					{
						for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
						{
							preterrain.splat_layer[count_value] = preterrain.splat_layer[count_value]*(1-(filter_strength*current_layer.strength*subfilter_value));
						}
						if (!splatmap) {
							for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
							{
								preterrain.splat[count_value] += (preterrain.splat_calc[count_value]*subfilter_value*filter_strength*current_layer.strength);
							}
						}
						else {
							for (count_value = 0;count_value < 4;++count_value)
							{
								if (count_value > preterrain.splat.Length-1) {break;}
								preterrain.splat[current_layer.splat_output.splat[count_value]] += color1[count_value]*(current_layer.strength*filter_strength*subfilter_value);
							}
						}	
					}				
				}
			}
			break;
		
		// multiply	filter
		case condition_output_enum.multiply:
			if (current_layer.output == layer_output_enum.heightmap){filter_value *= filter_input*filter_strength*subfilter_value;}
				else {filter_value *= filter_input;}
			
			if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
			
			if (current_layer.output == layer_output_enum.color)
			{
				for (count_value = 0;count_value < current_layer.splat_output.splat.Count;++count_value)
				{
					preterrain.color[count_value] *= color0[count_value]*(current_layer.strength*filter_strength*subfilter_value);
				}
			}
			if (current_layer.output == layer_output_enum.splat)
			{
				if (!splatmap) {
					for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
					{
						preterrain.splat[count_value] *= preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value);
					}
				}
				else {
					for (count_value = 0;count_value < 4;++count_value)
					{
						if (count_value > preterrain.splat.Length-1) {break;}
						preterrain.splat[current_layer.splat_output.splat[count_value]] *= color1[count_value]*(current_layer.strength*filter_strength*subfilter_value);
					}
				}
			}
			else if (current_layer.output == layer_output_enum.grass)
			{
				for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
				{
					preterrain.grass[current_layer.grass_output.grass[count_value].prototypeindex] *= current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value);		
				}
			}
			break;
		
		// divide filter
		case condition_output_enum.divide:
			
			if (current_layer.output == layer_output_enum.heightmap){if (filter_input*filter_strength*subfilter_value != 0){filter_value = filter_value / (filter_input*filter_strength*subfilter_value);}}
			else {if (filter_input != 0){filter_value = filter_value / filter_input;}}
			
			if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
			
			if (current_layer.output == layer_output_enum.color)
			{
				for(count_value = 0;count_value < 3;++count_value)
				{
					if (color0[count_value]*(current_layer.strength*filter_strength*subfilter_value) != 0){preterrain.color[count_value] = preterrain.color[count_value]/(color0[count_value]*(current_layer.strength*filter_strength*subfilter_value));}
				}
			}
			if (current_layer.output == layer_output_enum.splat)
			{
				if (!splatmap) {
					for(count_value = 0;count_value < preterrain.splat.Length;++count_value)
					{
						if (preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value) != 0){preterrain.splat[count_value] = preterrain.splat[count_value]/(preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value));}
					}
				}
				else {
					for (count_value = 0;count_value < 4;++count_value)
					{
						if (count_value > preterrain.splat.Length-1) {break;}
						if (color1[count_value]*(current_layer.strength*filter_strength*subfilter_value) != 0) {
							preterrain.splat[current_layer.splat_output.splat[count_value]] /= color1[count_value]*(current_layer.strength*filter_strength*subfilter_value);
						}
					}
				}
			}
			else if (current_layer.output == layer_output_enum.grass)
			{
				for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
				{
					if (current_layer.grass_output.grass_calc[current_layer.grass_output.grass[count_value].prototypeindex]*(current_layer.strength*subfilter_value) != 0){preterrain.grass[count_value] = preterrain.grass[count_value]/current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value);}
				}
			}
			break;
		
		// average filter
		case condition_output_enum.average:
			if (current_layer.output == layer_output_enum.heightmap){filter_value += (filter_input*filter_strength*subfilter_value)/current_layer.prefilter.filter_index.Count;}
				else {filter_value += filter_input/current_layer.prefilter.filter_index.Count;}
			
			if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
			
			if (current_layer.output == layer_output_enum.color)
			{
				for(count_value = 0;count_value < 3;++count_value)
				{
					preterrain.color[count_value] += (color0[0]*(current_layer.strength*filter_strength*subfilter_value))/current_layer.prefilter.filter_index.Count;
				}
			}
			if (current_layer.output == layer_output_enum.splat)
			{
				if (!splatmap) {
					for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
					{
						preterrain.splat[count_value] += (preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value))/current_layer.prefilter.filter_index.Count;
					}
				}
				else {
					for (count_value = 0;count_value < 4;++count_value)
					{
						if (count_value > preterrain.splat.Length-1) {break;}
						preterrain.splat[current_layer.splat_output.splat[count_value]] += color1[count_value]*(current_layer.strength*filter_strength*subfilter_value)/current_layer.prefilter.filter_index.Count;
					}
				}
			}
			else if (current_layer.output == layer_output_enum.grass)
			{
				for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
				{
					preterrain.grass[current_layer.grass_output.grass[count_value].prototypeindex] += (current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value))/current_layer.prefilter.filter_index.Count;		
				}
			}
			break;
			
		// difference filter
		case condition_output_enum.difference:
			if (current_layer.output == layer_output_enum.heightmap){filter_value  = Mathf.Abs(filter_value-(filter_input*filter_strength*subfilter_value));}
				else {filter_value = Mathf.Abs(filter_value-filter_input);}
			
			if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
			
			if (current_layer.output == layer_output_enum.color)
			{
				for(count_value = 0;count_value < 3;++count_value)
				{
					preterrain.color[count_value] = Mathf.Abs(preterrain.color[count_value]-(color0[0]*(current_layer.strength*filter_strength*subfilter_value)));
				}
			}
			if (current_layer.output == layer_output_enum.splat)
			{
				if (!splatmap) {
					for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
					{
						preterrain.splat[count_value] = Mathf.Abs(preterrain.splat[count_value]-(preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value)));
					}
				}
				else {
					for (count_value = 0;count_value < 4;++count_value)
					{
						if (count_value > preterrain.splat.Length-1) {break;}
						preterrain.splat[current_layer.splat_output.splat[count_value]] += Mathf.Abs(preterrain.splat[count_value]-(color1[count_value]*(current_layer.strength*filter_strength*subfilter_value)));
					}
				}
			}
			else if (current_layer.output == layer_output_enum.grass)
			{
				for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
				{
					preterrain.grass[current_layer.grass_output.grass[count_value].prototypeindex] = Mathf.Abs(preterrain.grass[count_value]-(current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value)));		
				}
			}
			break;
			
		// max filter
		case condition_output_enum.max:
			if (filter_input*filter_strength*subfilter_value > filter_value)
			{
				if (current_layer.output == layer_output_enum.heightmap){filter_value = filter_input*filter_strength*subfilter_value;}
					// else {filter_value = filter_input;}
				
				if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}					
					
				if (current_layer.output == layer_output_enum.color)
				{
					for (count_value = 0;count_value < 3;++count_value)
					{
						preterrain.color[count_value] = color0[count_value]*(current_layer.strength*filter_strength*subfilter_value);
					}
				}
				if (current_layer.output == layer_output_enum.splat)
				{
					if (!splatmap) {
						for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
						{
							preterrain.splat[count_value] = preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value);
						}
					}
					else {
						for (count_value = 0;count_value < 4;++count_value)
						{
							if (count_value > preterrain.splat.Length-1) {break;}
							preterrain.splat[current_layer.splat_output.splat[count_value]] = color1[count_value]*(current_layer.strength*filter_strength*subfilter_value);
						}
					}
				}
				if (current_layer.output == layer_output_enum.grass)
				{
					for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
					{
						preterrain.grass[current_layer.grass_output.grass[count_value].prototypeindex] = current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value);		
					}
				}
			}
			break;	
		
		// min filter
		case condition_output_enum.min:
			if (filter_input*filter_strength*subfilter_value < filter_value)
			{
				if (current_layer.output == layer_output_enum.heightmap){filter_value = filter_input*filter_strength*subfilter_value;}
					else {filter_value = filter_input;}
				
				if (filter.combine) {filter_combine = filter_value-filter_combine_start;return;}
				
				if (current_layer.output == layer_output_enum.color)
				{
					for (count_value = 0;count_value < 3;++count_value)
					{
						preterrain.color[count_value] = color0[count_value]*(current_layer.strength*filter_strength*subfilter_value);
					}
				}
				if (current_layer.output == layer_output_enum.splat)
				{
					if (!splatmap) {
						for (count_value = 0;count_value < preterrain.splat.Length;++count_value)
						{
							preterrain.splat[count_value] = preterrain.splat_calc[count_value]*(current_layer.strength*filter_strength*subfilter_value);
						}
					}
					else {
						for (count_value = 0;count_value < 4;++count_value)
						{
							if (count_value > preterrain.splat.Length-1) {break;}
							preterrain.splat[current_layer.splat_output.splat[count_value]] = color1[count_value]*(current_layer.strength*filter_strength*subfilter_value);
						}
					}
				}
				else if (current_layer.output == layer_output_enum.grass)
				{
					for (count_value = 0;count_value < current_layer.grass_output.grass.Count;++count_value)
					{
						preterrain.grass[current_layer.grass_output.grass[count_value].prototypeindex] = current_layer.grass_output.grass_calc[count_value]*(current_layer.strength*subfilter_value);		
					}
				}
			}
			break;
	}
} 	

// subfilter
function calc_subfilter_value(filter: filter_class,subfilter: subfilter_class,counter_y: float,x: float)
{
	var subfilter_input: float = 0;
	var random: float = UnityEngine.Random.Range(0.0,1.0);
	var range: float;
	var value0: float;
	var count_curve: int;

	switch (subfilter.type)
	{
		// random_range subfilter
		case condition_type_enum.RandomRange:
			if(random_range >= subfilter.range_start && random_range <= subfilter.range_end)
			{
				subfilter_input = random;
				++subfilter.range_count;
			}
			break;
		
		// random subfilter
		case condition_type_enum.Random:
			subfilter_input = random;
			break;
	
		// height subfilter
		case condition_type_enum.Height:
			subfilter_input = height;
			// Debug.Log(height);
			break;
		
		// steepness subfilter
		case condition_type_enum.Steepness:
			subfilter_input = degree/90;
			break;
		
		// always subfilter
		case condition_type_enum.Always:
			subfilter_input = subfilter.curve_position;
			break;
		
		// image subfilter
		case condition_type_enum.Image:
			color = calc_image_value(subfilter.preimage,layer_x,layer_y);
			if (subfilter.preimage.output)
			{
				subfilter_input = subfilter.preimage.output_pos;
				if (current_layer.output == layer_output_enum.tree && subfilter.from_tree)
				{
					tree_color[0] = color[0]*subfilter.strength;
					tree_color[1] = color[1]*subfilter.strength;
					tree_color[2] = color[2]*subfilter.strength;
					for (count_curve = 0;count_curve < subfilter.precurve_list.Count;++count_curve)
					{
						switch(subfilter.precurve_list[count_curve].type)
						{
							case curve_type_enum.Normal:
								tree_color[0] = subfilter.precurve_list[count_curve].curve.Evaluate(tree_color[0]);
								tree_color[1] = subfilter.precurve_list[count_curve].curve.Evaluate(tree_color[1]);
								tree_color[2] = subfilter.precurve_list[count_curve].curve.Evaluate(tree_color[2]);
								break;
						}
					}
				}
			}
			break;
		
		// raw heightmap subfilter
		case condition_type_enum.RawHeightmap:
			calc_raw_value(subfilter.raw,layer_x,layer_y);
			subfilter_input = subfilter.raw.output_pos;
			break;
		
		// maxcount subfilter
		case condition_type_enum.MaxCount:
			if (subfilter.output_count >= subfilter.output_max)
			{
				subfilter_value = 0;
				return;
			}
			if (subfilter_value >= subfilter.output_count_min){++subfilter.output_count;}
			break;
			
		// splatmap subfilter
		case condition_type_enum.Splatmap:
			if (splat_output) {
				subfilter_input = preterrain.splat_layer[subfilter.splat_index];
				if (subfilter_input < subfilter.curve_position) subfilter_input = 0;
			}
			else if (subfilter.splatmap < preterrain.splat_alpha.Length) {
				color = preterrain.splat_alpha[subfilter.splatmap].GetPixel(map_x,map_y);
				subfilter_input = color[subfilter.splat_index-(subfilter.splatmap*4)];
				if (subfilter_input < subfilter.curve_position) subfilter_input = 0;
			} 
			else {
				subfilter_input = 1;
			}
			break;
			
		// raycast subfilter
		case condition_type_enum.RayCast:
			// Debug.Log(height);
			if (subfilter.raycast_mode == raycast_mode_enum.Hit) {
				if (Physics.SphereCast (Vector3(x+(prelayer.prearea.step.x/2),(height*preterrain.size.y)+subfilter.cast_height,prelayer.counter_y),(prelayer.prearea.step.x/2)*subfilter.ray_radius,subfilter.ray_direction,hit,subfilter.ray_length,subfilter.layerMask)) {
					layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
					if (layerHit & subfilter.layerMask) {
						subfilter_input = 0;
					} 
					else {
						subfilter_input = 1;
					}
				}
				else {
					subfilter_input = 1;
				}
			}
			else if (subfilter.raycast_mode == raycast_mode_enum.Height) {
				if (Physics.Raycast (Vector3(x+(prelayer.prearea.step.x/2),subfilter.cast_height,prelayer.counter_y),subfilter.ray_direction,hit,subfilter.ray_length,subfilter.layerMask)) {
				layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
					if (layerHit &  subfilter.layerMask) {
						subfilter_input = hit.point.y/preterrain.terrain.terrainData.size.y;
					} 
					else {
						subfilter_input = 0;
					}
				}
				else {
					subfilter_input = 0;
				}
			}
			
			break;
	}
	
	for (count_curve = 0;count_curve < subfilter.precurve_list.Count;++count_curve)
	{
		switch(subfilter.precurve_list[count_curve].type)
		{
			case curve_type_enum.Normal:
				subfilter_input = subfilter.precurve_list[count_curve].curve.Evaluate(subfilter_input);
				break;
			case curve_type_enum.Random:
			    range = subfilter.precurve_list[count_curve].curve.Evaluate(subfilter_input);
				if (!subfilter.precurve_list[count_curve].abs){subfilter_input += UnityEngine.Random.Range(-range,range);} else {subfilter_input += UnityEngine.Random.Range(0,range);}
				break;
			case curve_type_enum.Perlin:
				var pos: Vector2;
				if (subfilter.precurve_list[count_curve].rotation) pos = calc_rotation_pixel(x,counter_y,0,0,-subfilter.precurve_list[count_curve].rotation_value); else pos = new Vector2(x,counter_y);
				value0 = subfilter.precurve_list[count_curve].curve.Evaluate(subfilter_input);
				range = perlin_noise(pos.x,pos.y,subfilter.precurve_list[count_curve].offset.x,subfilter.precurve_list[count_curve].offset.y,subfilter.precurve_list[count_curve].frequency,subfilter.precurve_list[count_curve].detail,subfilter.precurve_list[count_curve].detail_strength)*value0*subfilter.precurve_list[count_curve].strength;
				if (!subfilter.precurve_list[count_curve].abs){subfilter_input += ((range*2)-(value0));} else {subfilter_input += range;}
				break;
		}
	}
	
	if (subfilter.mode != subfilter_mode_enum.strength)
	{
		var curve1: float = filter_input;
		var curve2: float = filter_input;
		var pos_x: int = (x-prelayer.prearea.area.xMin)/prelayer.prearea.step.x;
		
		if (Mathf.Abs(pos_x - filter.last_pos_x) <= prelayer.prearea.step.x)
		{
			if (subfilter.mode == subfilter_mode_enum.smooth)
			{
				curve1 = Mathf.SmoothStep(filter.last_value_x[0],curve1,1-(subfilter_input))*subfilter.strength;
			}
			if (subfilter.mode == subfilter_mode_enum.lerp)
			{
				curve1 = Mathf.Lerp(filter.last_value_x[0],curve1,1-(subfilter_input))*subfilter.strength;
			}
		}
			
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].rect.Contains(Vector2(Mathf.Round(x/preterrain.heightmap_conversion.x)*preterrain.heightmap_conversion.x,(counter_y+preterrain.heightmap_conversion.y))))
			{
				if (count_terrain == preterrain.index)
				{
					if (subfilter.mode == subfilter_mode_enum.smooth)
					{
						curve2 = Mathf.SmoothStep(filter.last_value_y[pos_x],curve2,1-(subfilter_input))*subfilter.strength;
					}
					else if (subfilter.mode == subfilter_mode_enum.lerp)
					{
						curve2 = Mathf.Lerp(filter.last_value_y[pos_x],curve2,1-(subfilter_input))*subfilter.strength;
					}
				}
			}
		}
		filter_input = (curve1+curve2)/2;
		return;
	}
	
	switch (subfilter.output)
	{
		// add subfilter
		case subfilter_output_enum.add:
			subfilter_value += subfilter_input*subfilter.strength;
			break;

		// subtract subfilter					
		case subfilter_output_enum.subtract:
			subfilter_value -= subfilter_input*subfilter.strength;
			break;

		// min subfilter					
		case subfilter_output_enum.min:
			if ((subfilter_input*subfilter.strength) < subfilter_value){subfilter_value = (subfilter_input*subfilter.strength)+(subfilter_value*(1-subfilter.strength));}
			break;
		
		// max subfilter		
		case subfilter_output_enum.max:
			if ((subfilter_input*subfilter.strength) > subfilter_value){subfilter_value = (subfilter_input*subfilter.strength)+(subfilter_value*(1-subfilter.strength));}
			break;
		
		// average subfilter			
		case subfilter_output_enum.average:
			subfilter_value += (subfilter_input*subfilter.strength)/filter.presubfilter.subfilter_index.Count;
			break;
	}
}

function getRawTerrainTile(raw: raw_class)
{
	if (raw.flipTotalY) {
		raw.raw_number = (preterrain.tiles.x*preterrain.tiles.y)-(preterrain.index_old+1);
		if (!raw.flipTotalX) {
			var floor: int = Mathf.Floor(raw.raw_number/preterrain.tiles.x)*preterrain.tiles.x;
			raw.raw_number = (floor+floor+preterrain.tiles.x)-(raw.raw_number+1);
		}
	}
	else {
		raw.raw_number = preterrain.index_old;
		if (raw.flipTotalX) {
			floor = Mathf.Floor(raw.raw_number/preterrain.tiles.x)*preterrain.tiles.x;
			raw.raw_number = (floor+floor+preterrain.tiles.x)-(raw.raw_number+1);
		}
	}
	
	
	if (raw.raw_number > raw.file_index.Count-1) raw.raw_number = 0; 
}

function Fraq(v: float): float
{
	return (v-Mathf.Floor(v));
}


function calc_raw_value(raw: raw_class,local_x: float,local_y: float)
{
	if (raw.raw_list_mode == list_condition_enum.Terrain) getRawTerrainTile(raw);
	if (raw.raw_number > raw.file_index.Count-1){raw.raw_number = 0;}
	
	var pos: Vector2;
	var pos1: Vector2;
	var pos2: Vector2;
	var width: float = 0;
	var height: float = 0;
	var flip_x: float = 1;
	var flip_y: float = 1;
	
	var rawFile: raw_file_class = raw_files[raw.file_index[raw.raw_number]];
	
	if (raw.flip_x){flip_x = -1;width = raw_files[raw.file_index[raw.raw_number]].resolution.x-1;} 
	if (!raw.flip_y){flip_y = -1;height = raw_files[raw.file_index[raw.raw_number]].resolution.y-1;} 
	
	if (raw.raw_mode == image_mode_enum.MultiTerrain)
	{
		if (settings.showMeshes) {
			pos.x = Mathf.Round(((((raw_files[raw.file_index[raw.raw_number]].resolution.x-1)/meshes_area.area.width)*(prelayer.x-meshes_area.area.xMin)*flip_x)-raw.tile_offset_x+width)/raw.tile_x);
			pos.y = Mathf.Round(((((raw_files[raw.file_index[raw.raw_number]].resolution.y-1)/meshes_area.area.height)*(prelayer.counter_y-meshes_area.area.yMin)*flip_y)-raw.tile_offset_y+height)/raw.tile_y);
		}
		else {
			var tile_x: float;
			var tile_y: float;
			
			tile_x = ((((raw_files[raw.file_index[raw.raw_number]].resolution.x-1)/preterrain.tiles.x))*preterrain.tile_x);
			tile_y = ((((raw_files[raw.file_index[raw.raw_number]].resolution.y-1)/preterrain.tiles.y))*preterrain.tile_z);
			
			pos.x = Mathf.Round((((((local_x)/raw.conversion_step.x)+tile_x)*flip_x)-raw.tile_offset_x+width)/raw.tile_x);
			pos.y = Mathf.Round((((((local_y)/raw.conversion_step.y)+tile_y)*flip_y)-raw.tile_offset_y+height)/raw.tile_y);
		}
		// Debug.Log("local_x: "+local_x+" local_y: "+local_y+" pos_x: "+pos.x+" pos_y: "+pos.y); 
	}
	else 
	{
		if (raw.raw_mode == image_mode_enum.Terrain)
		{
			if (settings.showMeshes) {
				pos.x = Mathf.Round(((((raw_files[raw.file_index[raw.raw_number]].resolution.x-1)/premesh.area.width)*(prelayer.x-premesh.area.xMin)*flip_x)-raw.tile_offset_x+width)/raw.tile_x);
				pos.y = Mathf.Round(((((raw_files[raw.file_index[raw.raw_number]].resolution.y-1)/premesh.area.height)*(prelayer.counter_y-premesh.area.yMin)*flip_y)-raw.tile_offset_y+height)/raw.tile_y);
			}
			else {
				pos.x = ((((local_x/raw.conversion_step.x)*flip_x)-raw.tile_offset_x+width)/raw.tile_x);
				pos.y = ((((local_y/raw.conversion_step.y)*flip_y)-raw.tile_offset_y+height)/raw.tile_y);
			}
		}
		else
		{
			if (settings.showMeshes) {
				pos.x = Mathf.Round(((((raw_files[raw.file_index[raw.raw_number]].resolution.x-1)/premesh.area.width)*(prelayer.x-premesh.area.xMin)*flip_x)-raw.tile_offset_x+width)/raw.tile_x);
				pos.y = Mathf.Round(((((raw_files[raw.file_index[raw.raw_number]].resolution.y-1)/premesh.area.height)*(prelayer.counter_y-premesh.area.yMin)*flip_y)-raw.tile_offset_y+height)/raw.tile_y);
			}
			else {
				pos.x = (((((local_x-prelayer.prearea.area_old.x)/raw.conversion_step.x)*flip_x)-raw.tile_offset_x+width)/raw.tile_x);
				pos.y = (((((local_y-prelayer.prearea.area_old.y)/raw.conversion_step.y)*flip_y)-raw.tile_offset_y+height)/raw.tile_y);
			}
		}
	}
	
	if (raw.rotation) 
	{
		pos = calc_rotation_pixel(pos.x,pos.y,raw_files[raw.file_index[raw.raw_number]].resolution.x/2/raw.conversion_step.x,raw_files[raw.file_index[raw.raw_number]].resolution.y/2/raw.conversion_step.y,raw.rotation_value);
	}
	// h_local_x = pos.x;
	// h_local_y = pos.y;
					
	// if (h_local_y < 0){h_local_y = 0;}
	// if (h_local_y > raw_files[raw.file_index[raw.raw_number]].resolution.y-1){h_local_y = raw_files[raw.file_index[raw.raw_number]].resolution.y-1;}
	// if (h_local_x < 0){h_local_x = 0;}
	// if (h_local_x > raw_files[raw.file_index[raw.raw_number]].resolution.x-1){h_local_x = raw_files[raw.file_index[raw.raw_number]].resolution.x-1;}
	
	pos1.x = Mathf.Floor(pos.x);
	pos1.y = Mathf.Floor(pos.y);
	
	pos2.x = Mathf.Ceil(pos.x);
	pos2.y = Mathf.Ceil(pos.y);
	
	var delta_pos_x: float = pos.x-pos1.x;
	var delta_pos_y: float = pos.y-pos1.y;
	
//	if (pos1.x < 0) {pos1.x = 0;}
//	if (pos1.x > raw_files[raw.file_index[raw.raw_number]].resolution.x-1) {pos1.x = raw_files[raw.file_index[raw.raw_number]].resolution.x-1;}
//	if (pos1.y < 0) {pos1.y = 0;}
//	if (pos1.y > raw_files[raw.file_index[raw.raw_number]].resolution.y-1) {pos1.y = raw_files[raw.file_index[raw.raw_number]].resolution.y-1;}
//	
//	if (pos2.x < 0) {pos2.x = 0;}
//	if (pos2.x > raw_files[raw.file_index[raw.raw_number]].resolution.x-1) {pos2.x = raw_files[raw.file_index[raw.raw_number]].resolution.x-1;}
//	if (pos2.y < 0) {pos2.y = 0;}
//	if (pos2.y > raw_files[raw.file_index[raw.raw_number]].resolution.y-1) {pos2.y = raw_files[raw.file_index[raw.raw_number]].resolution.y-1;}
	
	if (raw.clamp) {
		// Debug.Log(pos1);
		if (pos1.x < 0 || pos1.x >= rawFile.resolution.x) {raw.output_pos = 0;return;}
		if (pos1.y < 0 || pos1.y >= rawFile.resolution.y) {raw.output_pos = 0;return;}
		if (pos2.x < 0 || pos2.x >= rawFile.resolution.x) {raw.output_pos = 0;return;}
		if (pos2.y < 0 || pos2.y >= rawFile.resolution.y) {raw.output_pos = 0;return;}
	}
	else {
		pos1 = new Vector2(Mathf.Round(Fraq(pos1.x/rawFile.resolution.x)*rawFile.resolution.x),Mathf.Round(Fraq(pos1.y/rawFile.resolution.y)*rawFile.resolution.y));
		pos2 = new Vector2(Mathf.Round(Fraq(pos2.x/rawFile.resolution.x)*rawFile.resolution.x),Mathf.Round(Fraq(pos2.y/rawFile.resolution.y)*rawFile.resolution.y));
	}
	
	var index1: int = (pos1.y*(raw_files[raw.file_index[raw.raw_number]].resolution.x)*2)+(pos1.x*2);
	var index2: int = (pos1.y*(raw_files[raw.file_index[raw.raw_number]].resolution.x)*2)+(pos2.x*2);
	var index3: int = (pos2.y*(raw_files[raw.file_index[raw.raw_number]].resolution.x)*2)+(pos1.x*2);
	var index4: int = (pos2.y*(raw_files[raw.file_index[raw.raw_number]].resolution.x)*2)+(pos2.x*2);
		
	if (index1 > raw_files[raw.file_index[raw.raw_number]].bytes.Length-1) {
		Debug.Log("The Raw Heightmap file '"+raw_files[raw.file_index[raw.raw_number]].file+"' has a lower resolution than selected. Please check the File size. It should be X*Y*2 = "
			+raw_files[raw.file_index[raw.raw_number]].resolution.x+"*"+raw_files[raw.file_index[raw.raw_number]].resolution.y+"*2 = "
			+(raw_files[raw.file_index[raw.raw_number]].resolution.x*raw_files[raw.file_index[raw.raw_number]].resolution.y*2)+" Bytes ("+raw_files[raw.file_index[raw.raw_number]].resolution.x+"*"+raw_files[raw.file_index[raw.raw_number]].resolution.y+" resolution). But the File size is "+raw_files[raw.file_index[raw.raw_number]].bytes.Length
			+" Bytes ("+Mathf.Round(Mathf.Sqrt(raw_files[raw.file_index[raw.raw_number]].bytes.Length/2))+"x"+
			Mathf.Round(Mathf.Sqrt(raw_files[raw.file_index[raw.raw_number]].bytes.Length/2))+" resolution).");
			
		prelayer.x = 999999999999;
		prelayer.counter_y = -99999999999;
		generate = false;
		return;
	}
	
	var height1: float;
	var height2: float;
	var height3: float;
	var height4: float;
		
	if (raw_files[raw.file_index[raw.raw_number]].mode == raw_mode_enum.Mac)
	{
    	height1 = ((raw_files[raw.file_index[raw.raw_number]].bytes[index1]*256.0)+raw_files[raw.file_index[raw.raw_number]].bytes[index1+1])/65535.0;
    	height2 = ((raw_files[raw.file_index[raw.raw_number]].bytes[index2]*256.0)+raw_files[raw.file_index[raw.raw_number]].bytes[index2+1])/65535.0;
    	height3 = ((raw_files[raw.file_index[raw.raw_number]].bytes[index3]*256.0)+raw_files[raw.file_index[raw.raw_number]].bytes[index3+1])/65535.0;
    	height4 = ((raw_files[raw.file_index[raw.raw_number]].bytes[index4]*256.0)+raw_files[raw.file_index[raw.raw_number]].bytes[index4+1])/65535.0;
    }
	else if (raw_files[raw.file_index[raw.raw_number]].mode == raw_mode_enum.Windows)
	{
		height1 = (raw_files[raw.file_index[raw.raw_number]].bytes[index1]+(raw_files[raw.file_index[raw.raw_number]].bytes[index1+1]*256.0))/65535.0;
		height2 = (raw_files[raw.file_index[raw.raw_number]].bytes[index2]+(raw_files[raw.file_index[raw.raw_number]].bytes[index2+1]*256.0))/65535.0;
		height3 = (raw_files[raw.file_index[raw.raw_number]].bytes[index3]+(raw_files[raw.file_index[raw.raw_number]].bytes[index3+1]*256.0))/65535.0;
		height4 = (raw_files[raw.file_index[raw.raw_number]].bytes[index4]+(raw_files[raw.file_index[raw.raw_number]].bytes[index4+1]*256.0))/65535.0;
	}
	
	var height_x1: float = height1+((height2-height1)*delta_pos_x);
	var height_x2: float = height3+((height4-height3)*delta_pos_x);
	
	raw.output_pos = height_x1+((height_x2-height_x1)*delta_pos_y);
	
	// if (pos1.y == 10) {Debug.Log(raw.output_pos);}
}

function generate_filter(filter: filter_class)
{
	var layer: layer_class = new layer_class();
	var area: Rect = terrains[0].prearea.area;
	var step: Vector2 = Vector2(area.width/128,area.height/128);
	var color: Color = Color(1,1,1,1);
	
	current_layer = layer;
	current_layer.output = layer_output_enum.heightmap;
	
	for (var y: float = area.yMin;y < area.yMax;y += step.y)
	{
		for (var x: float = area.xMin;x < area.xMax;x += step.x)
		{
			filter_value = 0;
			calc_filter_value(filter,y,x);
			color[0] = filter_value;
			color[1] = filter_value;
			color[2] = filter_value;
			filter.preview_texture.SetPixel(x/step.x,y/step.y,color);
		}
	}
	
	filter.preview_texture.Apply();
}

function set_image_terrain_mode(terrain_index: int)
{
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter) {
		if (filter[count_filter].type == condition_type_enum.Image) {
			if (filter[count_filter].preimage.image_list_mode == list_condition_enum.Terrain)
			{
				if (filter[count_filter].preimage.short_list) {
					#if UNITY_EDITOR
					filter[count_filter].preimage.image[0] = null;
					filter[count_filter].preimage.image[0] = AssetDatabase.LoadAssetAtPath(filter[count_filter].preimage.auto_search.get_file(terrains[terrain_index].tile_x,terrains[terrain_index].tile_z,terrains[terrain_index].index_old),Texture2D);
					// Debug.Log(terrains[terrain_index].tile_x+", "+terrains[terrain_index].tile_z+" : "+terrains[terrain_index].index_old+"   -> "+filter[count_filter].preimage.auto_search.get_file(terrains[terrain_index].tile_x,terrains[terrain_index].tile_z,terrains[terrain_index].index_old));
					// Debug.Log(filter[count_filter].preimage.auto_search.get_file(terrains[terrain_index].tile_x,terrains[terrain_index].tile_z,terrains[terrain_index].index_old)+" -> "+terrain_index);
					// Debug.Log(filter[count_filter].preimage.auto_search.get_file(terrains[terrain_index].tile_x,terrains[terrain_index].tiles.y-1-terrains[terrain_index].tile_z,terrains[terrain_index].index_old));//+" terrain"+terrain_index+" tile_x: "+preter);
					#endif
				}
				else {
					filter[count_filter].preimage.image_number = terrains[terrain_index].index_old;
					if (filter[count_filter].preimage.image_number > filter[count_filter].preimage.image.Count-1) {filter[count_filter].preimage.image_number = filter[count_filter].preimage.image.Count-1;}
					// Debug.Log("preterrain: "+terrains[terrain_index].index_old);
				}
			}
		}
	}
	
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter) {
		if (subfilter[count_subfilter].type == condition_type_enum.Image) {
			if (subfilter[count_subfilter].preimage.image_list_mode == list_condition_enum.Terrain)
			{
				if (subfilter[count_subfilter].preimage.short_list) {
					#if UNITY_EDITOR
					subfilter[count_subfilter].preimage.image[0] = null;
					subfilter[count_subfilter].preimage.image[0] = AssetDatabase.LoadAssetAtPath(subfilter[count_subfilter].preimage.auto_search.get_file(terrains[terrain_index].tile_x,terrains[terrain_index].tile_z,terrains[terrain_index].index_old),Texture2D);
					#endif
				}
				else {
					subfilter[count_subfilter].preimage.image_number = terrains[terrain_index].index_old;
					if (subfilter[count_subfilter].preimage.image_number > subfilter[count_subfilter].preimage.image.Count-1) {subfilter[count_subfilter].preimage.image_number = subfilter[count_subfilter].preimage.image.Count-1;}
				}
			}
		}
	}
}

var imagePosition: Vector2;

function get_image_pixel(preimage: image_class,local_x: float,local_y: float): Color
{
	if (!preimage.image[preimage.image_number]) {return Color(0,0,0);}
	
	var width: float = 0;
	var height: float = 0;
	var flip_x: float = 1;
	var flip_y: float = 1;
	var color1: Color;
			
	// object prelayer offset
	local_x -= prelayer.prearea.image_offset.x;
	local_y -= prelayer.prearea.image_offset.y;
	
	
	if (preimage.flip_x){flip_x = -1;width = preimage.image[preimage.image_number].width-1;}  
	if (preimage.flip_y){flip_y = -1;height = preimage.image[preimage.image_number].height-1;} 
	
	if (preimage.image_mode == image_mode_enum.Terrain)
	{
		if (settings.showMeshes) {
			imagePosition.x = Mathf.Round((((preimage.image[preimage.image_number].width/premesh.area.width)*(prelayer.x-premesh.area.xMin)*flip_x)-preimage.tile_offset_x+width)/preimage.tile_x);
			imagePosition.y = Mathf.Round((((preimage.image[preimage.image_number].height/premesh.area.height)*(prelayer.counter_y-premesh.area.yMin)*flip_y)-preimage.tile_offset_y+height)/preimage.tile_y);
		}
		else {
			imagePosition.x = Mathf.Round((((local_x/preimage.conversion_step.x)*flip_x)-preimage.tile_offset_x+width)/preimage.tile_x);
			imagePosition.y = Mathf.Round((((local_y/preimage.conversion_step.y)*flip_y)-preimage.tile_offset_y+height)/preimage.tile_y);
		}
	}
	else 
	{
		if (preimage.image_mode == image_mode_enum.MultiTerrain)
		{
			if (settings.showMeshes) {
				imagePosition.x = Mathf.Round((((preimage.image[preimage.image_number].width/meshes_area.area.width)*(prelayer.x-meshes_area.area.xMin)*flip_x)-preimage.tile_offset_x+width)/preimage.tile_x);
				imagePosition.y = Mathf.Round((((preimage.image[preimage.image_number].height/meshes_area.area.height)*(prelayer.counter_y-meshes_area.area.yMin)*flip_y)-preimage.tile_offset_y+height)/preimage.tile_y);
			}
			else {
				var tile_x: float;
				var tile_y: float;
				
				tile_x = (((preimage.image[preimage.image_number].width)/preterrain.tiles.x))*preterrain.tile_x;
				tile_y = (((preimage.image[preimage.image_number].height)/preterrain.tiles.y))*preterrain.tile_z;
				
				imagePosition.x = Mathf.Round(((((local_x/preimage.conversion_step.x)+tile_x)*flip_x)-preimage.tile_offset_x+width)/preimage.tile_x);
				imagePosition.y = Mathf.Round(((((local_y/preimage.conversion_step.y)+tile_y)*flip_y)-preimage.tile_offset_y+height)/preimage.tile_y);
			}
		}
		else
		{
			if (settings.showMeshes) {
				imagePosition.x = Mathf.Round((((preimage.image[preimage.image_number].width/premesh.area.width)*(prelayer.x-premesh.area.xMin)*flip_x)-preimage.tile_offset_x+width)/preimage.tile_x);
				imagePosition.y = Mathf.Round((((preimage.image[preimage.image_number].height/premesh.area.height)*(prelayer.counter_y-premesh.area.yMin)*flip_y)-preimage.tile_offset_y+height)/preimage.tile_y);
			}
			else {
				imagePosition.x = ((((local_x-prelayer.prearea.area_old.x)/preimage.conversion_step.x)*flip_x)-preimage.tile_offset_x+width)/preimage.tile_x;
				imagePosition.y = ((((local_y-prelayer.prearea.area_old.y)/preimage.conversion_step.y)*flip_y)-preimage.tile_offset_y+height)/preimage.tile_y;
			}
		}
	}
	
	if (preimage.rotation)
	{
		imagePosition = calc_rotation_pixel(imagePosition.x,imagePosition.y,preimage.image[preimage.image_number].width/2/preimage.conversion_step.x,preimage.image[preimage.image_number].height/2/preimage.conversion_step.y,preimage.rotation_value);
	}
	
	var inrange: boolean = true;
	
	if (preimage.clamp)
	{
		if (imagePosition.x > preimage.image[preimage.image_number].width || imagePosition.x < 0 || imagePosition.y > preimage.image[preimage.image_number].height || imagePosition.y < 0) {
			color1 = Color.black;
		}
		else {
			color1 = preimage.image[preimage.image_number].GetPixel(imagePosition.x,imagePosition.y);
		}
	}
	else {
		color1 = preimage.image[preimage.image_number].GetPixel(imagePosition.x,imagePosition.y);
	}
	
	color1 *= preimage.image_color;
	// Debug.Log("pos: "+imagePosition+" color: "+color1);
	return color1;
}
	
function calc_image_value(preimage: image_class,local_x: float,local_y: float): Color
{
	var color1: Color = get_image_pixel(preimage,local_x,local_y);
	var output: float;
	
	preimage.output = true;
	preimage.output_pos = color1[0];
	
	if (!preimage.edge_blur || current_layer.output != layer_output_enum.splat)
	{
		if (preimage.precolor_range.color_range.Count > 0)
		{
			preimage.output = false;
			for (count_color_range = 0;count_color_range < preimage.precolor_range.color_range.Count;++count_color_range)
			{
				var color_start: Color = preimage.precolor_range.color_range[count_color_range].color_start;		
				var color_end: Color = preimage.precolor_range.color_range[count_color_range].color_end;
				if (preimage.select_mode == select_mode_enum.free)
				{
					output = preimage.precolor_range.color_range[count_color_range].output;
				}
				else
				{
					switch(current_layer.output)
					{
						case layer_output_enum.color:
							output = current_layer.color_output.precolor_range[0].color_range_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
							break;
						case layer_output_enum.splat:
							if (current_layer.splat_output.splat.Count > 0)
							{
								output = current_layer.splat_output.splat_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
							}
							break;
						case layer_output_enum.tree:
							output = current_layer.tree_output.tree_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
							break;
						case layer_output_enum.grass:
							output = current_layer.grass_output.grass_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
							break;
						case layer_output_enum.object:
							output = current_layer.object_output.object_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
							break;
					}
				}
				if (preimage.precolor_range.color_range[count_color_range].one_color)
				{
					if (preimage.precolor_range.color_range[count_color_range].color_start == color1 && !preimage.precolor_range.color_range[count_color_range].invert)
					{
						preimage.output_pos = output; 
						preimage.output = true;
					} 
					else if (preimage.precolor_range.color_range[count_color_range].invert)
					{
						preimage.output_pos = output;
						preimage.output = true;
					}
				}
				else if (color_in_range(color1,color_start,color_end))
				{
					if (!preimage.precolor_range.color_range[count_color_range].invert)
					{
						if (preimage.select_mode == select_mode_enum.free) {
							preimage.output_pos = preimage.precolor_range.color_range[count_color_range].curve.Evaluate(calc_color_pos(color1,color_start,color_end));
						}
						else {
							preimage.output_pos = output;
							preimage.output_alpha = calc_color_pos(color1,color_start,color_end);
							filter_strength = calc_color_pos(color1,color_start,color_end);
						}
						preimage.output = true;
					}
				} 
				else 
				{
					if (preimage.precolor_range.color_range[count_color_range].invert)
					{
						if (preimage.select_mode == select_mode_enum.free) {
							preimage.output_pos = 1-preimage.precolor_range.color_range[count_color_range].curve.Evaluate(calc_color_pos(color1,color_start,color_end));
							preimage.output = true;
						}
						else {
							preimage.output_pos = output;
							preimage.output_alpha = calc_color_pos(color1,color_start,color_end);
						}
					}
				}
			}	
		}
	}
	else
	{
		var value0: float;
		var radius: float = preimage.edge_blur_radius;
		var radius2: float = (radius*2)+1;
		var splatIndex: int;
		imagePosition.x -= radius;
		imagePosition.y -= radius;
		if (imagePosition.x < 0){imagePosition.x = 0;radius2 -= radius;}
		if (imagePosition.y < 0){imagePosition.y = 0;radius2 -= radius;}
		if (imagePosition.x > preimage.image[preimage.image_number].width-radius2-1){imagePosition.x = preimage.image[preimage.image_number].width-radius2-1;radius2 -= radius;}
		if (imagePosition.y > preimage.image[preimage.image_number].height-radius2-1){imagePosition.y = preimage.image[preimage.image_number].height-radius2-1;radius2 -= radius;}
		
		var pixels: Color[] = preimage.image[preimage.image_number].GetPixels(imagePosition.x,imagePosition.y,radius2,radius2);
		
		for (var count_splat_calc: int = 0;count_splat_calc < preterrain.splat.Length;++count_splat_calc) {
			preterrain.splat_calc[count_splat_calc] = 0;
		}
		
		for (var count_pixel: int = 0;count_pixel < pixels.Length;++count_pixel)
		{
			if (current_layer.splat_output.splat.Count > 0)
			{
				for (count_color_range = 0;count_color_range < preimage.precolor_range.color_range.Count;++count_color_range)
				{
					if (pixels[count_pixel] == preimage.precolor_range.color_range[count_color_range].color_start)
					{
						if (preimage.select_mode == select_mode_enum.free)
						{
							splatIndex = preimage.precolor_range.color_range[count_color_range].output;
						}
						else
						{
							splatIndex = preimage.precolor_range.color_range[count_color_range].select_output;		
						}
							//switch(current_layer.output)
							//{
								//case layer_output_enum.splat:
									
									// output = current_layer.splat_output.splat_value.select_value[current_layer.splat_output.splat[preimage.precolor_range.color_range[count_color_range].select_output]];
									// preterrain.splat_calc[current_layer.splat_output.splat[output*current_layer.splat_output.splat.Count]] += 1.0/(pixels.Length*1.0);				
									
									if (!current_layer.splat_output.splat_custom[splatIndex].custom)
									{
										output = current_layer.splat_output.splat[splatIndex];
										preterrain.splat_calc[output] += 1.0/(pixels.Length*1.0);				
									}
									else {
										for (var i: int = 0; i < preterrain.splat_calc.Length; i++) {
											preterrain.splat_calc[i] += 1.0/(pixels.Length*1.0) * (current_layer.splat_output.splat_custom[splatIndex].value[i] / current_layer.splat_output.splat_custom[splatIndex].totalValue);		
										}
									}
									
									// Debug.Log("x "+local_x+" y "+local_y+" output "+output);
									
									//break;
								/*case layer_output_enum.color:
									output = current_layer.color_output.precolor_range[current_filter.color_output_index].color_range_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
									break;
								case layer_output_enum.tree:
									output = current_layer.tree_output.tree_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
									break;
								case layer_output_enum.grass:
									output = current_layer.grass_output.grass_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
									current_layer.grass_output.grass_calc[current_layer.grass_output.grass[output*current_layer.grass_output.grass.Count].prototypeindex] += 1.0/(pixels.Length*1.0);
									break;
								case layer_output_enum.object:
									output = current_layer.object_output.object_value.select_value[preimage.precolor_range.color_range[count_color_range].select_output];				
									break;*/
							//}
						
					}
				}
			}
		}
	}
	
	return color1;
}

// loop prelayer
function loop_prelayer(command: String,index: int,loop_inactive: boolean)
{
	var clear_parent_object: boolean = false;
	var image_auto_scale: boolean = false;
	var texture_resize_null: boolean = false;
	var erase_deactive: boolean = false;
	var store_last_values: boolean = false;
	var unload_texture: boolean = false;
	var fold_layer: boolean = false;
	var create_object_child_list: boolean = false;
	var automatic_step_resolution: boolean = false;
	var fix_database: boolean = false;
	var info_database: boolean = false;
	var enable_heightmap_output: boolean = false;
	var reset_swap_copy: boolean = false;
	var check_measure_normal: boolean = false;
	var close_all_foldout: boolean = false;
	var foldout_filter: boolean = false;
	var foldout_subfilter: boolean = false;
	var generate_first_call: boolean = false;
	var set_as_default: boolean = false;
	var syncSplatCustom: boolean = false;
	var fold_layer_output: layer_output_enum;
	var fold_layers_foldout: boolean;
	var count_splat: int;
	var count_tree: int;
	var count_object: int;
	
	if (command.Contains("(ssc)")) {syncSplatCustom = true;}
	if (command.IndexOf("(gfc)") != -1){generate_first_call = true;}
	if (command.IndexOf("(cmn)") != -1){check_measure_normal = true;}
	if (command.IndexOf("(rsc") != -1){reset_swap_copy = true;}
	if (command.IndexOf("(ias)") != -1){image_auto_scale = true;}
	if (command.IndexOf("(trn)") != -1){texture_resize_null = true;}
	if (command.IndexOf("(ed)") != -1){erase_deactive = true;}
	if (command.IndexOf("(slv)") != -1){store_last_values = true;}
	if (command.IndexOf("(ut)") != -1){unload_texture = true;}
	if (command.IndexOf("(ocr)") != -1){create_object_child_list = true;}
	if (command.IndexOf("(asr)") != -1){automatic_step_resolution = true;}
	if (command.IndexOf("(cpo)") != -1){clear_parent_object = true;}
	if (command.IndexOf("(inf)") != -1){info_database = true;}
	if (command.IndexOf("(eho)") != -1){enable_heightmap_output = true;}
	if (command.IndexOf("(caf)") != -1){close_all_foldout = true;} 
	if (command.IndexOf("(ff)") != -1){foldout_filter = true;}
	if (command.IndexOf("(fs)") != -1){foldout_subfilter = true;}
	if (command.IndexOf("(sad)") != -1){set_as_default = true;}
	if (command.IndexOf("(fix)") != -1){fix_database = true;}
	
	if (fix_database || info_database)
	{
		reset_link_filter();
		reset_link_subfilter();
		settings.prelayers_linked = 0;
		settings.filters_linked = 0;
		settings.subfilters_linked = 0;
	}
	
	if (command.IndexOf("(fl)") != -1)
	{
		if (command.IndexOf("(heightmap)") != -1){fold_layer_output = layer_output_enum.heightmap;}
		else if (command.IndexOf("(color)") != -1){fold_layer_output = layer_output_enum.color;}
		else if (command.IndexOf("(splat)") != -1){fold_layer_output = layer_output_enum.splat;}
		else if (command.IndexOf("(tree)") != -1){fold_layer_output = layer_output_enum.tree;}
		else if (command.IndexOf("(grass)") != -1){fold_layer_output = layer_output_enum.grass;}
		else if (command.IndexOf("(object)") != -1){fold_layer_output = layer_output_enum.object;}
		
		if (command.IndexOf("(true)") != -1){fold_layers_foldout = true;} 
		else if (command.IndexOf("(false)") != -1){fold_layers_foldout = false;}
		fold_layer = true;
	}
	
	for (count_prelayer = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		var prelayer1: prelayer_class = prelayers[count_prelayer];
		if (automatic_step_resolution)
		{
			if (settings.showTerrains) {
				if (prelayers[count_prelayer].prearea.resolution_mode == resolution_mode_enum.Automatic){select_automatic_step_resolution(terrains[0],prelayers[count_prelayer].prearea);}
				set_area_resolution(terrains[0],prelayers[count_prelayer].prearea);
				prelayers[count_prelayer].prearea.area_old = prelayers[count_prelayer].prearea.area;
				prelayers[count_prelayer].prearea.step_old = prelayers[count_prelayer].prearea.step;
			}
			else {
				select_automatic_step_resolution_mesh(prelayers[count_prelayer].prearea);
				set_area_resolution(prelayers[count_prelayer].prearea);
				prelayers[count_prelayer].prearea.area_old = prelayers[count_prelayer].prearea.area;
				prelayers[count_prelayer].prearea.step_old = prelayers[count_prelayer].prearea.step;
			}
		}
		
		if (reset_swap_copy || close_all_foldout)
		{
			for (var count_description: int = 0;count_description < prelayers[count_prelayer].predescription.description.Count;++count_description)
			{
				if (reset_swap_copy)
				{
					prelayers[count_prelayer].predescription.description[count_description].swap_text = "S";
					prelayers[count_prelayer].predescription.description[count_description].swap_select = false;
					prelayers[count_prelayer].predescription.description[count_description].copy_select = false;
				}
				if (close_all_foldout)
				{
					prelayers[count_prelayer].predescription.description[count_description].foldout = false;
				}
			}
		}
		
		if (close_all_foldout)
		{
			prelayers[count_prelayer].prearea.foldout = false;
		}
		
		for (count_layer = 0;count_layer < prelayer1.layer.Count;++count_layer)
		{
			var current_layer1: layer_class = prelayer1.layer[count_layer];
			
			if (erase_deactive)
			{
				var erase_layer: boolean = false;
				if (!current_layer1.active){erase_layer = true;}
					else if(!((current_layer1.output == layer_output_enum.color && color_output) 
		        			|| (current_layer1.output == layer_output_enum.splat && splat_output)
		        				|| (current_layer1.output == layer_output_enum.tree && tree_output)
		        					|| (current_layer1.output == layer_output_enum.grass && grass_output)
		        						|| (current_layer1.output == layer_output_enum.object && object_output)
		        						 	|| (current_layer1.output == layer_output_enum.heightmap && heightmap_output)))
		        	{erase_layer = true;}
		        if (erase_layer){erase_layer(prelayer1,count_layer,0,0,false,true,false);--count_layer;continue;}
		        
		        if (current_layer1.output == layer_output_enum.color)
		     	{
		     		for (var count_precolor_range: int = 0;count_precolor_range < current_layer1.color_output.precolor_range.Count;++count_precolor_range)
			     	{
			     		for (var count_color_range: int = 0;count_color_range < current_layer1.color_output.precolor_range[count_precolor_range].color_range.Count;++count_color_range)
			     		{
			     			if (!current_layer1.color_output.precolor_range[count_precolor_range].color_range_value.active[count_color_range])
			     			{
			     				current_layer1.color_output.precolor_range[count_precolor_range].erase_color_range(count_color_range);
			     				loop_prefilter_index(current_layer1.prefilter,count_color_range);
				    			--count_color_range;
			     				continue;
			     			}
			     		}
			     	}
		     	}
		        else if (current_layer1.output == layer_output_enum.splat)
		        {
		        	for (count_splat = 0;count_splat < current_layer1.splat_output.splat.Count;++count_splat)
				    {
				    	if (!current_layer1.splat_output.splat_value.active[count_splat] || current_layer1.splat_output.splat[count_splat] > terrains[0].terrain.terrainData.splatPrototypes.Length-1)
				    	{
				    		current_layer1.splat_output.erase_splat(count_splat);
				    		loop_prefilter_index(current_layer1.prefilter,count_splat);
				    		--count_splat;
				    		continue;
				    	}
				    }
		        }
		        else if (current_layer1.output == layer_output_enum.grass)
				{
					for (var count_grass: int = 0;count_grass < current_layer1.grass_output.grass_value.active.Count;++count_grass)
					{
						if (!current_layer1.grass_output.grass_value.active[count_grass] || current_layer1.grass_output.grass[count_grass].prototypeindex > terrains[0].terrain.terrainData.detailPrototypes.Length-1)
						{
							current_layer1.grass_output.erase_grass(count_grass);
							loop_prefilter_index(current_layer1.prefilter,count_grass);
				    		--count_grass;
						}
					}
				}
			}
			
			if (syncSplatCustom) {
				current_layer1.splat_output.SyncSplatCustom(masterTerrain.splatPrototypes.Count);
			}
			
			if (reset_swap_copy)
			{
				current_layer1.swap_text = "S";
				current_layer1.swap_select = false;
				current_layer1.copy_select = false;
				current_layer1.tree_output.placed = 0;
				current_layer1.object_output.placed = 0;
				current_layer1.text_placed = String.Empty;
				
				for (count_tree = 0;count_tree < current_layer1.tree_output.tree.Count;++count_tree)
				{
					current_layer1.tree_output.tree[count_tree].placed = 0;
				}
				for (count_object = 0;count_object < current_layer1.object_output.object.Count;++count_object)
				{
					current_layer1.object_output.object[count_object].placed = 0;
				}
			}
			
			if (close_all_foldout)
			{
				current_layer1.foldout = false;
				
				current_layer1.tree_output.foldout = false;
				for (count_tree = 0;count_tree < current_layer1.tree_output.tree.Count;++count_tree)
				{
					current_layer1.tree_output.tree[count_tree].foldout = false;
					current_layer1.tree_output.tree[count_tree].scale_foldout = false;
					current_layer1.tree_output.tree[count_tree].distance_foldout = false;
					current_layer1.tree_output.tree[count_tree].data_foldout = false;
					current_layer1.tree_output.tree[count_tree].precolor_range.foldout = false;
				}
				
				current_layer1.object_output.foldout = false;
					
				for (count_object = 0;count_object < current_layer1.object_output.object.Count;++count_object)
				{
					current_layer1.object_output.object[count_object].foldout = false;
					current_layer1.object_output.object[count_object].data_foldout = false;
					current_layer1.object_output.object[count_object].transform_foldout = false;
					current_layer1.object_output.object[count_object].settings_foldout = false;
					current_layer1.object_output.object[count_object].distance_foldout = false;
					current_layer1.object_output.object[count_object].rotation_foldout = false;
					current_layer1.object_output.object[count_object].rotation_map_foldout = false;
				}
			}
			
			if (current_layer1.active || loop_inactive)
			{
				if (enable_heightmap_output)
				{
					if (current_layer1.output == layer_output_enum.heightmap) {
						if (current_layer1.smooth) {smooth_command = true;}
						heightmap_output_layer = true;
					}
				}
				
				if (fold_layer)
				{
					if (current_layer1.output == fold_layer_output)
					{
						if (fold_layers_foldout){current_layer1.foldout = false;} else {current_layer1.foldout = true;}
					} else {current_layer1.foldout = false;}
				}
				
				for (count_tree = 0;count_tree < current_layer1.tree_output.tree.Count;++count_tree)
				{
					if (erase_deactive)
					{
						if (!current_layer1.tree_output.tree_value.active[count_tree] || current_layer1.tree_output.tree[count_tree].prototypeindex > terrains[0].terrain.terrainData.treePrototypes.Length-1)
						{
							current_layer1.tree_output.erase_tree(count_tree,this);
							loop_prefilter_index(current_layer1.prefilter,count_tree);
				    		--count_tree;
							continue;
						}
						else
						{
							erase_deactive_color_range(current_layer1.tree_output.tree[count_tree].precolor_range);
						}
					}
						
					// call loop tree prefilter
					call_from = 1;
					loop_prefilter(current_layer1.tree_output.tree[count_tree].prefilter,index,fix_database,info_database,loop_inactive,image_auto_scale,texture_resize_null,unload_texture,erase_deactive,store_last_values,reset_swap_copy,check_measure_normal,close_all_foldout,foldout_filter,foldout_subfilter,set_as_default);
				}
				
				
				if (current_layer1.output == layer_output_enum.object)
				{
					for (count_object = 0;count_object < current_layer1.object_output.object.Count;++count_object)
					{
						if (erase_deactive && (!current_layer1.object_output.object_value.active[count_object] || !current_layer1.object_output.object[count_object].object1))
						{
							erase_object(prelayers[count_prelayer].layer[count_layer].object_output,count_object);
							loop_prefilter_index(current_layer1.prefilter,count_object);
				    		--count_object;
							continue;
						}
						
						var current_object1: object_class = current_layer1.object_output.object[count_object];
						
						if (fix_database || info_database)
						{
							if (current_object1.prelayer_created)
							{
								if (current_object1.prelayer_index > prelayers.Count-1)
								{
									if (!info_database)
									{
										Debug.Log("Prelayer reference -> "+current_object1.prelayer_index+" not found, erasing reference entry...");
										current_object1.prelayer_created = false;
										current_object1.prelayer_index = -1;
									}
								}
								else
								{
									if (!info_database){prelayers[current_object1.prelayer_index].linked = true;} else {settings.prelayers_linked += 1;}
								}
							}
						}
						if (((current_layer1.object_output.object_value.active[count_object] && object_output) || loop_inactive) && clear_parent_object)
						{
							if (create_object_child_list){create_object_child_list(current_object1);}
							if (current_object1.parent_clear || loop_inactive) clear_parent_object(current_object1);
						}
						if (current_object1.rotation_map.active)
						{
							current_object1.rotation_map.preimage.set_image_auto_scale(terrains[0],prelayers[count_prelayer].prearea.area_old,0);
						}
					}
				}
				
				// call loop prefilter
				call_from = 0;
				loop_prefilter(current_layer1.prefilter,index,fix_database,info_database,loop_inactive,image_auto_scale,texture_resize_null,unload_texture,erase_deactive,store_last_values,reset_swap_copy,check_measure_normal,close_all_foldout,foldout_filter,foldout_subfilter,set_as_default);
			}
		}
	}
	
	if (info_database || fix_database)
	{
		erase_unlinked_prelayer(fix_database);
		erase_unlinked_filter(fix_database);
		erase_unlinked_subfilter(fix_database);
	}
}

// loop prefilter
function loop_prefilter(prefilter1: prefilter_class,index: int,fix_database: boolean,info_database: boolean,loop_inactive: boolean,image_auto_scale: boolean,texture_resize_null: boolean,unload_texture: boolean,erase_deactive: boolean,store_last_values: boolean,reset_swap_copy: boolean,check_measure_normal: boolean,close_all_foldout: boolean,foldout_filter: boolean,foldout_subfilter: boolean,set_as_default: boolean)
{
	if (close_all_foldout){prefilter1.foldout = false;}
	
	for (count_filter = 0;count_filter < prefilter1.filter_index.Count;++count_filter)
	{
		var current_filter1: filter_class = filter[prefilter1.filter_index[count_filter]];
		
		// erase filter
		if (erase_deactive)
		{
			if (!current_filter1.active)
			{
				erase_filter(count_filter,prefilter1);
				--count_filter;
				continue;
			}
			else 
			{
				erase_deactive_color_range(current_filter1.preimage.precolor_range);
				erase_deactive_animation_curve(current_filter1.precurve_list);
			} 
		}
		
		if (fix_database || info_database)
		{
			if (prefilter1.filter_index[count_filter] > filter.Count-1)
			{
				Debug.Log("Filter reference -> "+prefilter1.filter_index[count_filter]+" not found, erasing reference entry...");
				if (!info_database)
				{
					erase_filter_reference(prefilter1,count_filter);
					--count_filter;
					continue;
				}
			}
			else if (filter[prefilter1.filter_index[count_filter]].linked)
			{
				Debug.Log("Filter double linked -> "+prefilter1.filter_index[count_filter]);
				if (fix_database)
				{
					filter.Add(new filter_class());
					filter[filter.Count-1] = copy_filter(filter[prefilter1.filter_index[count_filter]],true);
					prefilter1.filter_index[count_filter] = filter.Count-1;
					continue;
				}
			}	
			else
			{	
				filter[prefilter1.filter_index[count_filter]].linked = true;
				if (filter[prefilter1.filter_index[count_filter]].linked){settings.filters_linked += 1;}
			}
		}
		
		if (foldout_filter)
		{
			if (prefilter1.filter_index[count_filter] == index)
			{
				var description_number: int = get_layer_description(prelayers[count_prelayer],count_layer);
				if (description_number != -1){prelayers[count_prelayer].predescription.description[description_number].foldout = true;}
				prelayers[count_prelayer].foldout = true;
				prelayers[count_prelayer].layer[count_layer].foldout = true;
				if (call_from == 1)
				{
					prelayers[count_prelayer].layer[count_layer].tree_output.foldout = true;
					prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].foldout = true;
				}
				prefilter1.foldout = true;
				current_filter1.foldout = true;
			}
		}
		if (set_as_default)
		{
			for (var count_curve: int = 0;count_curve < current_filter1.precurve_list.Count;++count_curve)
			{
				current_filter1.precurve_list[count_curve].set_as_default();
			}
		}
		if (close_all_foldout){current_filter1.foldout = false;current_filter1.presubfilter.foldout = false;}
		if (reset_swap_copy)
		{
			filter[prefilter1.filter_index[count_filter]].swap_text = "S";
			filter[prefilter1.filter_index[count_filter]].swap_select = false;
			filter[prefilter1.filter_index[count_filter]].copy_select = false;
		}
		
		if (check_measure_normal)
		{
			if (current_filter1.active && !measure_normal)
			{
				if (current_filter1.type == condition_type_enum.Direction)
				{
					measure_normal = true;
				}
			}
		}
		
		if (current_filter1.active || loop_inactive)
		{
			if (image_auto_scale)
			{
				if (current_filter1.preimage.image_auto_scale)
				{
//					if (settings.showMeshes) {
//						current_filter1.preimage.set_image_auto_scale(meshes_area.area,get_mesh_area(0),get_mesh_area(0),0);
//					}
					if (settings.showTerrains) {
						if (!prelayers[count_prelayer].prearea.active){current_filter1.preimage.set_image_auto_scale(terrains[0],terrains[0].prearea.area_old,0);}
						else current_filter1.preimage.set_image_auto_scale(terrains[0],prelayers[count_prelayer].prearea.area_old,0);
					}
				}
			}
			// filter_index-1 from erase filter
			if (unload_texture)
			{
				if (current_filter1.preimage.image.Count > 0)
				{
					for (var count_image: int = 0;count_image < current_filter1.preimage.image.Count;++count_image)
					{
						if (current_filter.preimage.image[count_image]){UnityEngine.Resources.UnloadAsset(current_filter1.preimage.image[count_image]);}
					}
				}
			}
			// reset sub strength set
			current_filter1.sub_strength_set = false;
						
			// loop subfilter
			for (count_subfilter = 0;count_subfilter < current_filter1.presubfilter.subfilter_index.Count;++count_subfilter)
			{
				var current_subfilter1: subfilter_class = subfilter[current_filter1.presubfilter.subfilter_index[count_subfilter]];
				
				if (erase_deactive)
				{
					if (!current_subfilter1.active)
					{
						erase_subfilter(count_subfilter,current_filter1.presubfilter);
						--count_subfilter;
						continue;
					}
					else 
					{
					 	erase_deactive_animation_curve(current_subfilter1.precurve_list);
						erase_deactive_color_range(current_subfilter1.preimage.precolor_range);
					}
				}
				
				if (fix_database || info_database)
				{
					if (current_filter1.presubfilter.subfilter_index[count_subfilter] > subfilter.Count-1)
					{
						Debug.Log("Subfilter reference -> "+current_filter1.presubfilter.subfilter_index[count_subfilter]+" not found, erasing reference entry...");
						if (!info_database)
						{
							erase_subfilter_reference(current_filter1.presubfilter,count_subfilter);
							--count_subfilter;
							continue;
						}
					}
					if (subfilter[current_filter1.presubfilter.subfilter_index[count_subfilter]].linked)
					{
						Debug.Log("Subfilter double linked -> "+current_filter1.presubfilter.subfilter_index[count_subfilter]);
						if (fix_database)
						{
							subfilter.Add(new subfilter_class());
							subfilter[subfilter.Count-1] = copy_subfilter(subfilter[current_filter1.presubfilter.subfilter_index[count_subfilter]]);
							current_filter1.presubfilter.subfilter_index[count_subfilter] = subfilter.Count-1;
							continue;
						}
					}
					else
					{
						subfilter[current_filter1.presubfilter.subfilter_index[count_subfilter]].linked = true;
						if (filter[prefilter1.filter_index[count_filter]].linked){settings.subfilters_linked += 1;}
					}
				}
				
				if (foldout_subfilter)
				{
					if (current_filter1.presubfilter.subfilter_index[count_subfilter] == index)
					{
						var description_number1: int = get_layer_description(prelayers[count_prelayer],count_layer);
						if (description_number1 != -1){prelayers[count_prelayer].predescription.description[description_number1].foldout = true;}
						prelayers[count_prelayer].foldout = true;
						prelayers[count_prelayer].layer[count_layer].foldout = true;
						if (call_from == 1)
						{
							prelayers[count_prelayer].layer[count_layer].tree_output.foldout = true;
							prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].foldout = true;
						}
						prefilter1.foldout = true;
						current_subfilter1.foldout = true;
						current_filter1.foldout = true;
						current_filter1.presubfilter.foldout = true;
					}
				}
				if (set_as_default)
				{
					current_subfilter1.precurve.set_as_default();
					current_subfilter1.prerandom_curve.set_as_default();
				}
				if (close_all_foldout){current_subfilter1.foldout = false;}
				if (check_measure_normal)
				{
					if (current_subfilter1.active && !measure_normal)
					{
						if (current_subfilter1.type == condition_type_enum.Direction)
						{
							measure_normal = true;
						}
					}
				}
				if (reset_swap_copy)
				{
					current_subfilter1.swap_text = "S";
					current_subfilter1.swap_select = false;
					current_subfilter1.copy_select = false;
				}
				
				if (current_subfilter1.active || loop_inactive)
				{
					if (image_auto_scale)
					{
						if (current_subfilter1.preimage.image_auto_scale)
						{
//							if (settings.showMeshes) {
//								current_subfilter1.preimage.set_image_auto_scale(meshes_area.area,get_mesh_area(0),get_mesh_area(0),0);
//							}
							if (settings.showTerrains) {
								if (!prelayers[count_prelayer].prearea.active){current_subfilter1.preimage.set_image_auto_scale(terrains[0],terrains[0].prearea.area_old,0);}
								else {current_subfilter1.preimage.set_image_auto_scale(terrains[0],prelayers[count_prelayer].prearea.area_old,0);}
							}
						}
					}
					if (current_subfilter1.mode == subfilter_mode_enum.strength){current_filter1.sub_strength_set = true;} 
					if (store_last_values && current_subfilter1.mode != subfilter_mode_enum.strength && !current_filter.last_value_declared)
					{
						current_filter1.last_value_x = new float[1];
						if (generate_world_mode)
						{
							current_filter1.last_value_y = new float[(prelayers[count_prelayer].prearea.area.width/prelayers[count_prelayer].prearea.step.x)+1];
						}
						else
						{
							current_filter1.last_value_y = new float[(terrains[0].size.x/terrains[0].prearea.step.x)+2];	
						}
						current_filter1.last_pos_x = 4097;
						current_filter1.last_value_declared = true;
					}
								
					if (unload_texture)
					{
						for (count_image = 0;count_image < current_subfilter1.preimage.image.Count;++count_image)
						{							
							if (current_subfilter1.preimage.image)
							{
								UnityEngine.Resources.UnloadAsset(current_subfilter1.preimage.image[count_image]);
							}
						}
					}	
				}
			}
		}
	}
}

function get_terrain_size(terrain_index: int): Rect
{
	var rect: Rect;
	if (terrains[terrain_index].terrain) {
		if (terrains[terrain_index].terrain.terrainData) {
			rect.width = terrains[terrain_index].terrain.terrainData.size.x;
			rect.height = terrains[terrain_index].terrain.terrainData.size.z;
		}
	}
	return rect;
}

function get_total_terrain_size(): Rect
{
	var rect: Rect;
	if (terrains[0].terrain) {
		if (terrains[0].terrain.terrainData) {
			rect.width = terrains[0].terrain.terrainData.size.x*terrains[0].tiles.x;
			rect.height = terrains[0].terrain.terrainData.size.z*terrains[0].tiles.y;
		}
	}
	return rect;
}

function loop_prefilter_index(prefilter1: prefilter_class,index: int)
{
	for (var count_filter: int = 0;count_filter < prefilter1.filter_index.Count;++count_filter)
	{
		if (filter[prefilter1.filter_index[count_filter]].type == condition_type_enum.Image)
		{	
			if (filter[prefilter1.filter_index[count_filter]].preimage.select_mode == select_mode_enum.select)
			{
				for (var count_color_range: int = 0;count_color_range < filter[prefilter1.filter_index[count_filter]].preimage.precolor_range.color_range.Count;++count_color_range)
				{
					if (filter[prefilter1.filter_index[count_filter]].preimage.precolor_range.color_range[count_color_range].select_output == index)
					{
						filter[prefilter1.filter_index[count_filter]].preimage.precolor_range.erase_color_range(count_color_range);
						--count_color_range;
						continue;
					}
					if (filter[prefilter1.filter_index[count_filter]].preimage.precolor_range.color_range[count_color_range].select_output > index){filter[prefilter1.filter_index[count_filter]].preimage.precolor_range.color_range[count_color_range].select_output = index;}
				}
			}
		}
	}	
}

function disable_prefilter_select_mode(prefilter1: prefilter_class)
{
	for (var count_filter: int = 0;count_filter < prefilter1.filter_index.Count;++count_filter)
	{
		filter[prefilter1.filter_index[count_filter]].preimage.select_mode = select_mode_enum.free;
	}	
}

function link_placed_reference()
{
	if (!script_base) {return;}
	var count_layer: int;
	var count_tree: int;
	var count_object: int;
	
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (count_layer = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			if (prelayers[count_prelayer].layer[count_layer].active)
			{
				if (prelayers[count_prelayer].layer[count_layer].output == layer_output_enum.tree)
				{
					prelayers[count_prelayer].layer[count_layer].tree_output.placed = 0;
					prelayers[count_prelayer].layer[count_layer].tree_output.placed_reference = script_base.prelayers[count_prelayer].layer[count_layer].tree_output;
					for (count_tree = 0;count_tree < prelayers[count_prelayer].layer[count_layer].tree_output.tree.Count;++count_tree)
					{
						prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].placed = 0;
						prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].placed_reference = script_base.prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree];
					}
				}
				if (prelayers[count_prelayer].layer[count_layer].output == layer_output_enum.object)
				{
					prelayers[count_prelayer].layer[count_layer].object_output.placed = 0;
					prelayers[count_prelayer].layer[count_layer].object_output.placed_reference = script_base.prelayers[count_prelayer].layer[count_layer].object_output;
					// prelayers[count_prelayer].layer[count_layer].object_output.placed_reference = script_base.prelayers[count_prelayer].layer[count_layer].object_output;
					
					
					if (prelayers[count_prelayer].layer[count_layer].object_output.object_mode == object_mode_enum.LinePlacement)
					{
						script_base.prelayers[count_prelayer].layer[count_layer].object_output.line_placement.line_list[0].points.Clear();
						for (var count_point: int = 0;count_point < prelayers[count_prelayer].layer[count_layer].object_output.line_placement.line_list[0].point_length;++count_point)
						{
							script_base.prelayers[count_prelayer].layer[count_layer].object_output.line_placement.line_list[0].points.Add(Vector3(0,0,0));
						}
						if (prelayers[count_prelayer].layer[count_layer].object_output.line_placement.preimage.image_auto_scale)
						{
//							if (settings.showMeshes) {
//								prelayers[count_prelayer].layer[count_layer].object_output.line_placement.preimage.set_image_auto_scale(meshes_area.area,get_mesh_area(0),get_mesh_area(0),0);
//							}
							if (settings.showTerrains) {
								if (!generate_world_mode && count_prelayer < 1){prelayers[count_prelayer].layer[count_layer].object_output.line_placement.preimage.set_image_auto_scale(terrains[0],terrains[0].prearea.area_old,0);}
								else {prelayers[count_prelayer].layer[count_layer].object_output.line_placement.preimage.set_image_auto_scale(terrains[0],prelayers[count_prelayer].prearea.area_old,0);}
							}
						}
						line_output = true;
					}
					
					for (count_object = 0;count_object < prelayers[count_prelayer].layer[count_layer].object_output.object.Count;++count_object)
					{
						prelayers[count_prelayer].layer[count_layer].object_output.object[count_object].placed = 0;
						prelayers[count_prelayer].layer[count_layer].object_output.object[count_object].placed_reference = script_base.prelayers[count_prelayer].layer[count_layer].object_output.object[count_object];
					}
				}
			}
		}
	}
}

//function line_generate(count_prelayer: int)
//{
//	var count_layer: int;
//	var count_tree: int;
//	var count_object: int;
//	
//	for (count_layer = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
//	{
//		if (prelayers[count_prelayer].layer[count_layer].output == layer_output_enum.object)
//		{
//			if (prelayers[count_prelayer].layer[count_layer].object_output.object_mode == object_mode_enum.LinePlacement)
//			{
//				create_object_line(prelayers[count_prelayer].layer[count_layer].object_output);
//			}
//		}
//	}
//}

function erase_deactive_color_range(precolor_range: precolor_range_class)
{
	for (var count_color_range: int = 0;count_color_range < precolor_range.color_range.Count;++count_color_range)
	{
		if (!precolor_range.color_range_value.active[count_color_range]){precolor_range.erase_color_range(count_color_range);--count_color_range;}
	}
}

function erase_deactive_animation_curve(precurve_list: List.<animation_curve_class>)
{
	for (var count_curve: int = 0;count_curve < precurve_list.Count;++count_curve)
	{
		if (!precurve_list[count_curve].active){erase_animation_curve(precurve_list,count_curve);--count_curve;}
	}
}

function clear_parent_object(current_object1: object_class)
{
	var child: Transform;
	if (settings.parentObjectsTerrain) {
		for (var i: int = 0;i < terrains.Count;++i) {
			for (var t: int = 0;t < terrains[i].terrain.transform.childCount;++t) {
				child = terrains[i].terrain.transform.GetChild(t);
				if (child.name == "Objects") {
					DestroyImmediate(child.gameObject); 
					--t;
				}
			}
		}	
	}
	else {
		var parent: Transform = current_object1.parent;
		if (parent && current_object1.parent_clear)
		{
			var parent_id: int = parent.gameObject.GetInstanceID();
			var children: Transform[] = parent.GetComponentsInChildren.<Transform>(true);
			if (children)
			{
				for(child in children)
				{
					if (child){if (child.gameObject.GetInstanceID() != parent_id){DestroyImmediate(child.gameObject);}}
				}
			}
		}
	}
}

function unload_textures1()
{
	var count_image: int;
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		for (count_image = 0;count_image < filter[count_filter].preimage.image.Count;++count_image)
		{
			if (filter[count_filter].preimage.image[count_image]){UnityEngine.Resources.UnloadAsset(filter[count_filter].preimage.image[count_image]);}
		}
	}
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
	{
		for (count_image = 0;count_image < subfilter[count_subfilter].preimage.image.Count;++count_image)
		{
			if (subfilter[count_subfilter].preimage.image[count_image]){UnityEngine.Resources.UnloadAsset(subfilter[count_subfilter].preimage.image[count_image]);}	
		}
	}
	if (settings.showTerrains) {
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain.terrainData.splatPrototypes.Length > 0)
			{
				for (var count_alpha: int = 0;count_alpha < terrains[count_terrain].splat_alpha.Length;++count_alpha)
				{
					if (terrains[count_terrain].splat_alpha[count_alpha]){terrains[count_terrain].splat_alpha[count_alpha] = null;}
				}
			}
		}
	}
}

function loop_layer(layer: layer_class,command: int)
{
	for (var count_object: int = 0;count_object < layer.object_output.object.Count;++count_object)
	{
		if (layer.object_output.object[count_object].prelayer_created)
		{
			if (command == 1)
			{
				add_prelayer(false);
				var prelayer_index: int = prelayers.Count-1;
				prelayers[prelayer_index] = copy_prelayer(prelayers[layer.object_output.object[count_object].prelayer_index],true);
				layer.object_output.object[count_object].prelayer_index = prelayer_index;
				prelayers[prelayer_index].index = prelayer_index;
				prelayers[prelayer_index].set_prelayer_text();
				
				for (var count_layer: int = 0;count_layer < prelayers[prelayer_index].layer.Count;++count_layer)
				{
					loop_layer(prelayers[prelayer_index].layer[count_layer],1);
				}
			}
			else if (command == -1)
			{
				erase_prelayer(layer.object_output.object[count_object].prelayer_index);
			}
		}
	}
}

function loop_object_copy(object: object_class)
{
	if (object.prelayer_created)
	{
		for (var count_layer: int = 0;count_layer < prelayers[object.prelayer_index].layer.Count;++count_layer)
		{
			loop_layer_copy(prelayers[object.prelayer_index].layer[count_layer]);
		}
	}
}

function loop_layer_copy(layer: layer_class)
{
	for (var count_object: int = 0;count_object < layer.object_output.object.Count;++count_object)
	{
		layer.object_output.object[count_object].swap_select = false;
		layer.object_output.object[count_object].copy_select = false;
		layer.object_output.object[count_object].swap_text = "S";
		layer.object_output.object[count_object].placed = 0;
		layer.object_output.placed = 0;
		
		if (layer.object_output.object[count_object].prelayer_created)
		{
			var prelayer_index: int = layer.object_output.object[count_object].prelayer_index;
			for (var count_layer: int = 0;count_layer < prelayers[prelayer_index].layer.Count;++count_layer)
			{
				loop_layer_copy(prelayers[prelayer_index].layer[count_layer]);
			}
		}
	}
	
	var count_color_range: int;
	
	for (var count_precolor_range: int = 0;count_precolor_range < layer.color_output.precolor_range.Count;++count_precolor_range)
	{
		for (count_color_range = 0;count_color_range < layer.color_output.precolor_range[count_precolor_range].color_range.Count;++count_color_range)
		{
			layer.color_output.precolor_range[count_precolor_range].color_range[count_color_range].swap_select = false;
			layer.color_output.precolor_range[count_precolor_range].color_range[count_color_range].copy_select = false;
			layer.color_output.precolor_range[count_precolor_range].color_range[count_color_range].swap_text = "S";
		}
	}
	
	for (var count_tree: int = 0;count_tree < layer.tree_output.tree.Count;++count_tree)
	{
		layer.tree_output.tree[count_tree].swap_select = false;
		layer.tree_output.tree[count_tree].copy_select = false;
		layer.tree_output.tree[count_tree].swap_text = "S";
		layer.tree_output.placed = 0;
		layer.tree_output.tree[count_tree].placed = 0;
		layer.tree_output.tree[count_tree].placed = 0;
	}
				
	layer.swap_select = false;
	layer.copy_select = false;
	layer.swap_text = "S";
	
}

function check_object_rotate(objects_placed: List.<Vector3>,objects_placed_rot: List.<Vector3>,position: Vector3,min_distance_rot_x: int,min_distance_rot_z: int): int
{
	var distance: Vector3;
	
	for (var count_object: int = 0;count_object < objects_placed.Count;++count_object)
	{
		distance = position-objects_placed[count_object];
		if (Mathf.Abs(distance.x) <= min_distance_rot_x && Mathf.Abs(distance.z) <= min_distance_rot_z){return count_object;}
	}
	return -1;
}

function check_object_distance(object_placed_list: List.<distance_class>): boolean
{
	var distance: float;
	var distance_z: float;
	
	for (var count_object: int = object_placed_list.Count-1;count_object >= 0;--count_object)
	{
		distance = Vector3.Distance(object_info.position,object_placed_list[count_object].position);
		distance_z = object_placed_list[count_object].position.z-object_info.position.z;
		
		if (distance < object_info.min_distance.x && distance < object_placed_list[count_object].min_distance.x)
		{
			return false;
		}
	}
	object_placed_list.Add(new distance_class());
	
	object_placed_list[object_placed_list.Count-1].position = object_info.position;
	object_placed_list[object_placed_list.Count-1].rotation = object_info.rotation;
	object_placed_list[object_placed_list.Count-1].min_distance = object_info.min_distance;
	object_placed_list[object_placed_list.Count-1].min_distance_rotation_group = object_info.min_distance_rotation_group;
	object_placed_list[object_placed_list.Count-1].distance_rotation = object_info.distance_rotation;
	object_placed_list[object_placed_list.Count-1].distance_mode = object_info.distance_mode;
	object_placed_list[object_placed_list.Count-1].rotation_group = object_info.rotation_group;
	return true;
}

function relink_subfilter_index(subfilter_index: int)
{
	for(var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		for (var count_subfilter: int = 0;count_subfilter < filter[count_filter].presubfilter.subfilter_index.Count;++count_subfilter)
		{
			if (filter[count_filter].presubfilter.subfilter_index[count_subfilter] == subfilter.Count)
			{
				filter[count_filter].presubfilter.subfilter_index[count_subfilter] = subfilter_index;
				return;
			}						
		}
	}
}

function relink_filter_index(filter_index: int)
{
	for(var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for(var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for(var count_filter: int = 0;count_filter < prelayers[count_prelayer].layer[count_layer].prefilter.filter_index.Count;++count_filter)
			{
				if (prelayers[count_prelayer].layer[count_layer].prefilter.filter_index[count_filter] == filter.Count)
				{
					prelayers[count_prelayer].layer[count_layer].prefilter.filter_index[count_filter] = filter_index;
					return;
				}
			}
			for (var count_tree: int = 0;count_tree < prelayers[count_prelayer].layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				for (count_filter = 0;count_filter < prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].prefilter.filter_index.Count;++count_filter)
				{
					if (prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].prefilter.filter_index[count_filter] == filter.Count)
					{
						prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].prefilter.filter_index[count_filter] = filter_index;
						return;
					}
				}
			}
		}
	}
}

function search_filter_index(filter_index: int): boolean
{
	for(var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for(var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for(var count_filter: int = 0;count_filter < prelayers[count_prelayer].layer[count_layer].prefilter.filter_index.Count;++count_filter)
			{
				if (prelayers[count_prelayer].layer[count_layer].prefilter.filter_index[count_filter] == filter_index)
				{
					filter[filter_index].linked = true;
					return true;
				}
			}
			for (var count_tree: int = 0;count_tree < prelayers[count_prelayer].layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				for (count_filter = 0;count_filter < prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].prefilter.filter_index.Count;++count_filter)
				{
					if (prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].prefilter.filter_index[count_filter] == filter_index)
					{
						filter[filter_index].linked = true;
						return true;
					}
				}
			}
		}
	}
	return false;
}

function search_subfilter_index(subfilter_index: int):boolean
{
	for(var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		for (var count_subfilter: int = 0;count_subfilter < filter[count_filter].presubfilter.subfilter_index.Count;++count_subfilter)
		{
			if (filter[count_filter].presubfilter.subfilter_index[count_subfilter] == subfilter_index)
			{
				subfilter[subfilter_index].linked = true;
				return true;
			}						
		}
	}
	return false;
}

function reset_link_prelayer()
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		prelayers[count_prelayer].linked = false;
	}
}

function reset_link_filter()
{
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		filter[count_filter].linked = false;
	}
}

function reset_link_subfilter()
{
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
	{
		subfilter[count_subfilter].linked = false;
	}
}

function erase_unlinked_prelayer(erase: boolean)
{
	for (var count_prelayer: int = 1;count_prelayer < prelayers.Count;++count_prelayer)
	{
		if (!prelayers[count_prelayer].linked)
		{
			if (erase)
			{
				Debug.Log("Erasing unlinked Prelayer -> "+count_prelayer);
				erase_prelayer(count_prelayer);
				--count_prelayer;
			}
			else
			{
				Debug.Log("Unlinked Prelayer -> "+count_prelayer);
			}
		}
	}
}

function erase_unlinked_filter(erase: boolean)
{
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		if (!filter[count_filter].linked)
		{
			if (erase)
			{
				Debug.Log("Erasing unlinked Filter -> "+count_filter);
				erase_filter_unlinked(count_filter);
				--count_filter;
			}
			else
			{
				Debug.Log("Unlinked Filter -> "+count_filter);
			}
		}
	}
}

function erase_unlinked_subfilter(erase: boolean)
{
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
	{
		if (!subfilter[count_subfilter].linked)
		{
			if (erase)
			{
				Debug.Log("Erasing unlinked Subfilter -> "+count_subfilter);
				erase_subfilter_unlinked(count_subfilter);		
				--count_subfilter;
			}
			else
			{
				Debug.Log("Unlinked subfilter -> "+count_subfilter);
			}
		}	
	}
}

function select_image_prelayer()
{
	var current_filter1: filter_class;
	for (var count_layer: int = 0;count_layer < prelayer.layer.Count;++count_layer)
	{
		for (var count_filter: int = 0;count_filter < prelayer.layer[count_layer].prefilter.filter_index.Count;++count_filter)
		{
			current_filter1 = filter[prelayer.layer[count_layer].prefilter.filter_index[count_filter]];
			select_image_filter(current_filter1);
			select_image_subfilter(current_filter1);
		}
		if (prelayer.layer[count_layer].output == layer_output_enum.tree)
		{
			for (var count_tree: int = 0;count_tree < prelayer.layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				for (count_filter = 0;count_filter < prelayer.layer[count_layer].tree_output.tree[count_tree].prefilter.filter_index.Count;++count_filter)
				{
					current_filter1 = filter[prelayer.layer[count_layer].tree_output.tree[count_tree].prefilter.filter_index[count_filter]];
					select_image_filter(current_filter1);
					select_image_subfilter(current_filter1);
				}
			}
		}
	}
}

function select_image_filter(current_filter1: filter_class)
{
	if (current_filter1.type == condition_type_enum.Image)
	{
		if (current_filter1.preimage.image_list_mode == list_condition_enum.Random)
		{
			current_filter1.preimage.image_number = UnityEngine.Random.Range(0,current_filter1.preimage.image.Count-1);
		}
	}
}

function select_image_subfilter(current_filter1: filter_class)
{
	var current_subfilter: subfilter_class;
	for (var count_subfilter: int = 0;count_subfilter < current_filter1.presubfilter.subfilter_index.Count;++count_subfilter)
	{
		current_subfilter = subfilter[current_filter1.presubfilter.subfilter_index[count_subfilter]];
		if (current_subfilter.type == condition_type_enum.Image)
		{
		    if (current_subfilter.preimage.image_list_mode == list_condition_enum.Random)
			{
				current_subfilter.preimage.image_number = UnityEngine.Random.Range(0,current_subfilter.preimage.image.Count-1);
			}
		}
	}
}

function search_filter_swap(): int
{
	for (var count_filter: int;count_filter < filter.Count;++count_filter)
	{
		if (filter[count_filter].swap_select){return count_filter;}
	}
	return -1;
}

function search_filter_copy(): int
{
	for (var count_filter: int;count_filter < filter.Count;++count_filter)
	{
		if (filter[count_filter].copy_select){return count_filter;}
	}
	return -1;
}

function search_subfilter_swap(): int
{
	for (var count_subfilter: int;count_subfilter < subfilter.Count;++count_subfilter)
	{
		if (subfilter[count_subfilter].swap_select){return count_subfilter;}
	}
	return -1;
}

function search_subfilter_copy(): int
{
	for (var count_subfilter: int;count_subfilter < subfilter.Count;++count_subfilter)
	{
		if (subfilter[count_subfilter].copy_select){return count_subfilter;}
	}
	copy_subfilter_select = false;
	return -1;
}

function search_layer_swap()
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			if (prelayers[count_prelayer].layer[count_layer].swap_select){swap_prelayer_index = count_prelayer;swap_layer_index = count_layer;return;}
		}
	}
}

function search_layer_copy()
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			if (prelayers[count_prelayer].layer[count_layer].copy_select){copy_prelayer_index = count_prelayer;copy_layer_index = count_layer;return;}
		}
	}
}

function search_description_swap()
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_description: int = 0;count_description < prelayers[count_prelayer].predescription.description.Count;++count_description)
		{
			if (prelayers[count_prelayer].predescription.description[count_description].swap_select)
			{
				swap_description_prelayer_index = count_prelayer;
				swap_description_position = count_description;
				return;
			}
		}
	}
}

function search_description_copy()
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_description: int = 0;count_description < prelayers[count_prelayer].predescription.description.Count;++count_description)
		{
			if (prelayers[count_prelayer].predescription.description[count_description].copy_select)
			{
				copy_description_prelayer_index = count_prelayer;
				copy_description_position = count_description;
				return;
			}
		}
	}
}

function search_object_swap()
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_object: int = 0;count_object < prelayers[count_prelayer].layer[count_layer].object_output.object.Count;++count_object)
			{
				if (prelayers[count_prelayer].layer[count_layer].object_output.object[count_object].swap_select)
				{
					swap_object_output = prelayers[count_prelayer].layer[count_layer].object_output;
					swap_object_number = count_object;
					return;
				}
			}
		}
	}
}

function search_object_copy(): object_class
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_object: int = 0;count_object < prelayers[count_prelayer].layer[count_layer].object_output.object.Count;++count_object)
			{
				if (prelayers[count_prelayer].layer[count_layer].object_output.object[count_object].copy_select){return prelayers[count_prelayer].layer[count_layer].object_output.object[count_object];}
			}
		}
	}
	return new object_class();
}

function search_tree_swap()
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_tree: int = 0;count_tree < prelayers[count_prelayer].layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				if (prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].swap_select)
				{
					swap_tree_output = prelayers[count_prelayer].layer[count_layer].tree_output;
					swap_tree_position = count_tree;
					return;
				}			
			}
		}
	}
}

function search_tree_copy(): tree_class
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_tree: int = 0;count_tree < prelayers[count_prelayer].layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				if (prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].copy_select)
				{
					return prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree];
				}			
			}
		}
	}
	return new tree_class(script,false);
}

function search_color_range_swap()
{
	var count_color_range: int;
	
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_precolor_range: int = 0;count_precolor_range < prelayers[count_prelayer].layer[count_layer].color_output.precolor_range.Count;++count_precolor_range)
			{
				for (count_color_range = 0;count_color_range < prelayers[count_prelayer].layer[count_layer].color_output.precolor_range[count_precolor_range].color_range.Count;++count_color_range)
				{
					if (prelayers[count_prelayer].layer[count_layer].color_output.precolor_range[count_precolor_range].color_range[count_color_range].swap_select)
					{
						swap_precolor_range = prelayers[count_prelayer].layer[count_layer].color_output.precolor_range[count_precolor_range];
						swap_color_range_number = count_color_range;
						return;
					}
				}
			}
			for (var count_tree: int = 0;count_tree < prelayers[count_prelayer].layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				for (count_color_range = 0;count_color_range < prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].precolor_range.color_range.Count;++count_color_range)
				{
					if (prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].precolor_range.color_range[count_color_range].swap_select)
					{
						swap_precolor_range = prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].precolor_range;
						swap_color_range_number = count_color_range;
						
						return;
					}
				}
			}
		}
	}
	
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		for (count_color_range = 0;count_color_range < filter[count_filter].preimage.precolor_range.color_range.Count;++count_color_range)
		{
			if (filter[count_filter].preimage.precolor_range.color_range[count_color_range].swap_select)
			{
				swap_precolor_range = filter[count_filter].preimage.precolor_range;
				swap_color_range_number = count_color_range;
				return;
			}
		}
	}
	
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
	{
		for (count_color_range = 0;count_color_range < subfilter[count_subfilter].preimage.precolor_range.color_range.Count;++count_color_range)
		{
			if (subfilter[count_subfilter].preimage.precolor_range.color_range[count_color_range].swap_select)
			{
				swap_precolor_range = subfilter[count_subfilter].preimage.precolor_range;
				swap_color_range_number = count_color_range;
				return;
			}
		}
	}
	
	for (var count_pattern: int = 0;count_pattern < pattern_tool.patterns.Count;++count_pattern)
	{
		for (count_color_range = 0;count_color_range < pattern_tool.patterns[count_pattern].precolor_range.color_range.Count;++count_color_range)
		{
			if (pattern_tool.patterns[count_pattern].precolor_range.color_range[count_color_range].swap_select)
			{
				swap_precolor_range = pattern_tool.patterns[count_pattern].precolor_range;
				swap_color_range_number = count_color_range;
				return;
			}
		}
	}
	
	for (count_color_range = 0;count_color_range < texture_tool.precolor_range.color_range.Count;++count_color_range)
	{
		if (texture_tool.precolor_range.color_range[count_color_range].swap_select)
		{
			swap_precolor_range = texture_tool.precolor_range;
			swap_color_range_number = count_color_range;
			return;
		}
	}
}

function search_color_range_copy(): color_range_class
{
	var count_color_range: int;
	
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			for (var count_precolor_range: int = 0;count_precolor_range < prelayers[count_prelayer].layer[count_layer].color_output.precolor_range.Count;++count_precolor_range)
			{
				for (count_color_range = 0;count_color_range < prelayers[count_prelayer].layer[count_layer].color_output.precolor_range[count_precolor_range].color_range.Count;++count_color_range)
				{
					if (prelayers[count_prelayer].layer[count_layer].color_output.precolor_range[count_precolor_range].color_range[count_color_range].copy_select)
					{
						return prelayers[count_prelayer].layer[count_layer].color_output.precolor_range[count_precolor_range].color_range[count_color_range];
					}
				}
			}
			for (var count_tree: int = 0;count_tree < prelayers[count_prelayer].layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				for (count_color_range = 0;count_color_range < prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].precolor_range.color_range.Count;++count_color_range)
				{
					if (prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].precolor_range.color_range[count_color_range].copy_select)
					
					return prelayers[count_prelayer].layer[count_layer].tree_output.tree[count_tree].precolor_range.color_range[count_color_range];
				}
			}
		}
	}
	
	for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
	{
		for (count_color_range = 0;count_color_range < filter[count_filter].preimage.precolor_range.color_range.Count;++count_color_range)
		{
			if (filter[count_filter].preimage.precolor_range.color_range[count_color_range].copy_select)
			{
				return filter[count_filter].preimage.precolor_range.color_range[count_color_range];
			}
		}
	}
	
	for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
	{
		for (count_color_range = 0;count_color_range < subfilter[count_subfilter].preimage.precolor_range.color_range.Count;++count_color_range)
		{
			if (subfilter[count_subfilter].preimage.precolor_range.color_range[count_color_range].copy_select)
			{
				return subfilter[count_subfilter].preimage.precolor_range.color_range[count_color_range];
			}
		}
	}
	
	for (var count_pattern: int = 0;count_pattern < pattern_tool.patterns.Count;++count_pattern)
	{
		for (count_color_range = 0;count_color_range < pattern_tool.patterns[count_pattern].precolor_range.color_range.Count;++count_color_range)
		{
			if (pattern_tool.patterns[count_pattern].precolor_range.color_range[count_color_range].copy_select)
			{
				return pattern_tool.patterns[count_pattern].precolor_range.color_range[count_color_range];
			}
		}
	}
	
	for (count_color_range = 0;count_color_range < texture_tool.precolor_range.color_range.Count;++count_color_range)
	{
		if (texture_tool.precolor_range.color_range[count_color_range].copy_select)
		{
			return texture_tool.precolor_range.color_range[count_color_range];
		}
	}
	
	return new color_range_class();
}

function get_import_resolution_to_list(resolution: int): int
{
	var list_index: int = -1;
	
	switch (resolution)
	{
		case 32: list_index = 0;break;
		case 64: list_index = 1;break;
		case 128: list_index = 2;break;
		case 256: list_index = 3;break;
		case 512: list_index = 4;break;
		case 1024: list_index = 5;break;
		case 2048: list_index = 6;break;
		case 4096: list_index = 7;
	}
	
	return list_index;
}

function set_import_resolution_from_list(resolution_index: int): int
{
	var resolution: int = -1;
	
	switch (resolution_index)
	{
		case 0: resolution = 32;break;
		case 1: resolution = 64;break;
		case 2: resolution = 128;break;
		case 3: resolution = 256;break;
		case 4: resolution = 512;break;
		case 5: resolution = 1024;break;
		case 6: resolution = 2048;break;
		case 7: resolution = 4096;
	}
	
	return resolution;
}

function get_terrain_resolution_to_list(preterrain1: terrain_class)
{
	if (preterrain1.heightmap_resolution == 4097){preterrain1.heightmap_resolution_list = 0;}
	else if (preterrain1.heightmap_resolution == 2049){preterrain1.heightmap_resolution_list = 1;}
	else if (preterrain1.heightmap_resolution == 1025){preterrain1.heightmap_resolution_list = 2;}
	else if (preterrain1.heightmap_resolution == 513){preterrain1.heightmap_resolution_list = 3;}
	else if (preterrain1.heightmap_resolution == 257){preterrain1.heightmap_resolution_list = 4;}
	else if (preterrain1.heightmap_resolution == 129){preterrain1.heightmap_resolution_list = 5;}
	else if (preterrain1.heightmap_resolution == 65){preterrain1.heightmap_resolution_list = 6;}
	else if (preterrain1.heightmap_resolution == 33){preterrain1.heightmap_resolution_list = 7;}
	
	if (preterrain1.splatmap_resolution == 2048){preterrain1.splatmap_resolution_list = 0;}
	else if (preterrain1.splatmap_resolution == 1024){preterrain1.splatmap_resolution_list = 1;}
	else if (preterrain1.splatmap_resolution == 512){preterrain1.splatmap_resolution_list = 2;}
	else if (preterrain1.splatmap_resolution == 256){preterrain1.splatmap_resolution_list = 3;}
	else if (preterrain1.splatmap_resolution == 128){preterrain1.splatmap_resolution_list = 4;}
	else if (preterrain1.splatmap_resolution == 64){preterrain1.splatmap_resolution_list = 5;}
	else if (preterrain1.splatmap_resolution == 32){preterrain1.splatmap_resolution_list = 6;}
	else if (preterrain1.splatmap_resolution == 16){preterrain1.splatmap_resolution_list = 7;}
	
	if (preterrain1.basemap_resolution == 2048){preterrain1.basemap_resolution_list = 0;}
	else if (preterrain1.basemap_resolution == 1024){preterrain1.basemap_resolution_list = 1;}
	else if (preterrain1.basemap_resolution == 512){preterrain1.basemap_resolution_list = 2;}
	else if (preterrain1.basemap_resolution == 256){preterrain1.basemap_resolution_list = 3;}
	else if (preterrain1.basemap_resolution == 128){preterrain1.basemap_resolution_list = 4;}
	else if (preterrain1.basemap_resolution == 64){preterrain1.basemap_resolution_list = 5;}
	else if (preterrain1.basemap_resolution == 32){preterrain1.basemap_resolution_list = 6;}
	else if (preterrain1.basemap_resolution == 16){preterrain1.basemap_resolution_list = 7;}
	
	if (preterrain1.detail_resolution_per_patch == 128){preterrain1.detail_resolution_per_patch_list = 4;}
	else if (preterrain1.detail_resolution_per_patch == 64){preterrain1.detail_resolution_per_patch_list = 3;}
	else if (preterrain1.detail_resolution_per_patch == 32){preterrain1.detail_resolution_per_patch_list = 2;}
	else if (preterrain1.detail_resolution_per_patch == 16){preterrain1.detail_resolution_per_patch_list = 1;}
	else if (preterrain1.detail_resolution_per_patch == 8){preterrain1.detail_resolution_per_patch_list = 0;}
}

function set_terrain_resolution_from_list(preterrain1: terrain_class)
{
	if (preterrain1.heightmap_resolution_list == 0){preterrain1.heightmap_resolution = 4097;}
	else if (preterrain1.heightmap_resolution_list == 1){preterrain1.heightmap_resolution = 2049;}
	else if (preterrain1.heightmap_resolution_list == 2){preterrain1.heightmap_resolution = 1025;}
	else if (preterrain1.heightmap_resolution_list == 3){preterrain1.heightmap_resolution = 513;}
	else if (preterrain1.heightmap_resolution_list == 4){preterrain1.heightmap_resolution = 257;}
	else if (preterrain1.heightmap_resolution_list == 5){preterrain1.heightmap_resolution = 129;}
	else if (preterrain1.heightmap_resolution_list == 6){preterrain1.heightmap_resolution = 65;}
	else if (preterrain1.heightmap_resolution_list == 7){preterrain1.heightmap_resolution = 33;}
	
	if (preterrain1.splatmap_resolution_list == 0){preterrain1.splatmap_resolution = 2048;}
	else if (preterrain1.splatmap_resolution_list == 1){preterrain1.splatmap_resolution = 1024;}
	else if (preterrain1.splatmap_resolution_list == 2){preterrain1.splatmap_resolution = 512;}
	else if (preterrain1.splatmap_resolution_list == 3){preterrain1.splatmap_resolution = 256;}
	else if (preterrain1.splatmap_resolution_list == 4){preterrain1.splatmap_resolution = 128;}
	else if (preterrain1.splatmap_resolution_list == 5){preterrain1.splatmap_resolution = 64;}
	else if (preterrain1.splatmap_resolution_list == 6){preterrain1.splatmap_resolution = 32;}
	else if (preterrain1.splatmap_resolution_list == 7){preterrain1.splatmap_resolution = 16;}
	
	if (preterrain1.basemap_resolution_list == 0){preterrain1.basemap_resolution = 2048;}
	else if (preterrain1.basemap_resolution_list == 1){preterrain1.basemap_resolution = 1024;}
	else if (preterrain1.basemap_resolution_list == 2){preterrain1.basemap_resolution = 512;}
	else if (preterrain1.basemap_resolution_list == 3){preterrain1.basemap_resolution = 256;}
	else if (preterrain1.basemap_resolution_list == 4){preterrain1.basemap_resolution = 128;}
	else if (preterrain1.basemap_resolution_list == 5){preterrain1.basemap_resolution = 64;}
	else if (preterrain1.basemap_resolution_list == 6){preterrain1.basemap_resolution = 32;}
	else if (preterrain1.basemap_resolution_list == 7){preterrain1.basemap_resolution = 16;}
	
	if (preterrain1.detail_resolution_per_patch_list == 0){preterrain1.detail_resolution_per_patch = 8;}
	else if (preterrain1.detail_resolution_per_patch_list == 1){preterrain1.detail_resolution_per_patch = 16;}
	else if (preterrain1.detail_resolution_per_patch_list == 2){preterrain1.detail_resolution_per_patch = 32;}
	else if (preterrain1.detail_resolution_per_patch_list == 3){preterrain1.detail_resolution_per_patch = 64;}
	else if (preterrain1.detail_resolution_per_patch_list == 4){preterrain1.detail_resolution_per_patch = 128;}
}

function get_terrains_position()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		terrains[count_terrain].rect.x = terrains[count_terrain].terrain.transform.position.x;
	    terrains[count_terrain].rect.y = terrains[count_terrain].terrain.transform.position.z;
	    terrains[count_terrain].rect.width = terrains[count_terrain].terrain.terrainData.size.x;
	    terrains[count_terrain].rect.height = terrains[count_terrain].terrain.terrainData.size.z;
	}
	if (slice_tool && slice_tool_terrain)
	{
		slice_tool_rect.x = slice_tool_terrain.transform.position.x;
	    slice_tool_rect.y = slice_tool_terrain.transform.position.z;
	    slice_tool_rect.width = slice_tool_terrain.terrainData.size.x;
	    slice_tool_rect.height = slice_tool_terrain.terrainData.size.z;
	}
}

function set_basemap_max(editor: boolean)
{
	if (terrains.Count > 1)
	{
		if (editor){settings.editor_basemap_distance_max = terrains[0].tiles.x * terrains[0].size.x;}
			else {settings.runtime_basemap_distance_max = terrains[0].tiles.x * terrains[0].size.x;}
	}
	else
	{
		if (editor){settings.editor_basemap_distance_max = terrains[0].size.x;}
			else {settings.runtime_basemap_distance_max = terrains[0].size.x;}
	}
}

function get_all_terrain_settings(command: String)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		get_terrain_settings(terrains[count_terrain],command);
		check_synchronous_terrain_size(terrains[count_terrain]);
	}	
}

function get_terrain_settings(preterrain1: terrain_class,command: String)
{
	if (preterrain1.terrain)
	{
		if (!preterrain1.terrain.terrainData){return;}
		var command_size: boolean = false;
		var command_resolutions: boolean = false;
		var command_conversions: boolean = false;
		var command_all: boolean = false;
		var command_first: boolean = false;
		var command_splat: boolean = false;
		var command_trees: boolean = false;
		var command_grass: boolean = false;
		
		if (command.IndexOf("(siz)") != -1){command_size = true;}
		if (command.IndexOf("(res)") != -1){command_resolutions = true;}
		if (command.IndexOf("(con)") != -1){command_conversions = true;}
		if (command.IndexOf("(all)") != -1){command_all = true;}
		if (command.IndexOf("(fir)") != -1){command_first = true;}
		if (command.IndexOf("(spl)") != -1){command_splat = true;}
		if (command.IndexOf("(tre)") != -1){command_trees = true;}
		if (command.IndexOf("(gra)") != -1){command_grass = true;}
		
		preterrain1.splat_length = preterrain1.terrain.terrainData.splatPrototypes.Length;
		preterrain1.name = preterrain1.terrain.name;
		
		if (command_size || command_all)
		{
			preterrain1.size = preterrain1.terrain.terrainData.size;
			check_synchronous_terrain_size(preterrain1);
			
			preterrain1.scale.x = preterrain1.size.x/preterrain1.terrain.terrainData.heightmapResolution;
			preterrain1.scale.y = preterrain1.size.y/preterrain1.terrain.terrainData.heightmapResolution;
			preterrain1.scale.z = preterrain1.size.z/preterrain1.terrain.terrainData.heightmapResolution;
		}
		if (command_resolutions || command_all)
		{
			preterrain1.heightmap_resolution = preterrain1.terrain.terrainData.heightmapResolution;
			preterrain1.splatmap_resolution = preterrain1.terrain.terrainData.alphamapResolution;
			preterrain1.detail_resolution = preterrain1.terrain.terrainData.detailResolution;
			preterrain1.basemap_resolution = preterrain1.terrain.terrainData.baseMapResolution;
			get_terrain_resolution_to_list(preterrain1);
			check_synchronous_terrain_resolutions(preterrain1);
		}
		if (command_conversions || command_all)
		{	
			preterrain1.heightmap_conversion.x = preterrain1.terrain.terrainData.size.x/(preterrain1.terrain.terrainData.heightmapResolution-1);
			preterrain1.heightmap_conversion.y = preterrain1.terrain.terrainData.size.z/(preterrain1.terrain.terrainData.heightmapResolution-1);
		
			preterrain1.splatmap_conversion.x = preterrain1.terrain.terrainData.size.x/(preterrain1.terrain.terrainData.alphamapResolution-1);
			preterrain1.splatmap_conversion.y = preterrain1.terrain.terrainData.size.z/(preterrain1.terrain.terrainData.alphamapResolution-1);
		
			preterrain1.detailmap_conversion.x = preterrain1.terrain.terrainData.size.x/(preterrain1.terrain.terrainData.detailResolution-1);
			preterrain1.detailmap_conversion.y = preterrain1.terrain.terrainData.size.z/(preterrain1.terrain.terrainData.detailResolution-1);
			
			set_area_resolution(preterrain1,preterrain1.prearea);
    	}
		
		if (command_first) 
		{
			preterrain1.prearea.area_max = Rect(0,0,preterrain1.terrain.terrainData.size.x,preterrain1.terrain.terrainData.size.z);
			preterrain1.prearea.area = preterrain1.prearea.area_max;
			preterrain1.prearea.set_resolution_mode_text();
			get_terrain_parameter_settings(preterrain1);
		}
		
		if (command_size || command_all || command_conversions || command_resolutions || command_first)
		{
			set_area_resolution(preterrain1,preterrain1.prearea);
			set_area_resolution_prelayers(preterrain1);
		} 
		
		if (preterrain1.prearea.area.xMax > preterrain1.terrain.terrainData.size.x){preterrain1.prearea.area.xMax = preterrain1.terrain.terrainData.size.x;}
		if (preterrain1.prearea.area.yMax > preterrain1.terrain.terrainData.size.y){preterrain1.prearea.area.yMax = preterrain1.terrain.terrainData.size.z;}
		
		if (command_splat){get_terrain_splat_textures(preterrain1);check_synchronous_terrain_splat_textures(preterrain1);}
		if (command_trees){get_terrain_trees(preterrain1);check_synchronous_terrain_trees(preterrain1);}
		if (command_grass ){get_terrain_details(preterrain1);check_synchronous_terrain_detail(preterrain1);}
	}
}

function set_area_resolution_prelayers(preterrain1: terrain_class)
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		set_area_resolution(preterrain1,prelayers[count_prelayer].prearea);
	}
}

function set_area_resolution(prearea: area_class)
{
	prearea.step.x = object_resolution;
	prearea.step.y = object_resolution;
	prearea.conversion_step = prearea.step;
	prearea.resolution = object_resolution;
}

function set_area_resolution(preterrain1: terrain_class,prearea: area_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	
	if (prearea.resolution_mode == resolution_mode_enum.Heightmap)
	{
		prearea.step.x = preterrain1.terrain.terrainData.size.x/(preterrain1.terrain.terrainData.heightmapResolution-1);
		prearea.step.y = preterrain1.terrain.terrainData.size.z/(preterrain1.terrain.terrainData.heightmapResolution-1);
		prearea.conversion_step = prearea.step;
		prearea.resolution = preterrain1.heightmap_resolution;
	}
	else if (prearea.resolution_mode == resolution_mode_enum.Colormap)
	{
		prearea.step.x = preterrain1.terrain.terrainData.size.x/(colormap_resolution);
		prearea.step.y = preterrain1.terrain.terrainData.size.z/(colormap_resolution);
		preterrain1.splatmap_conversion.x = preterrain1.terrain.terrainData.size.x/(colormap_resolution-1);
		preterrain1.splatmap_conversion.y = preterrain1.terrain.terrainData.size.z/(colormap_resolution-1);
		preterrain1.splatmap_resolution = colormap_resolution;
		
		prearea.conversion_step = prearea.step;
		prearea.resolution = colormap_resolution;
	}
	else if (prearea.resolution_mode == resolution_mode_enum.Splatmap)
	{
		prearea.step.x = preterrain1.terrain.terrainData.size.x/(preterrain1.terrain.terrainData.alphamapResolution);
		prearea.step.y = preterrain1.terrain.terrainData.size.z/(preterrain1.terrain.terrainData.alphamapResolution);
		prearea.conversion_step = prearea.step;
		prearea.resolution = preterrain1.splatmap_resolution;
	}
	else if (prearea.resolution_mode == resolution_mode_enum.Detailmap)
	{
		prearea.step.x = preterrain1.terrain.terrainData.size.x/(preterrain1.terrain.terrainData.detailResolution);
		prearea.step.y = preterrain1.terrain.terrainData.size.z/(preterrain1.terrain.terrainData.detailResolution);
		prearea.conversion_step = prearea.step;
		prearea.resolution = preterrain1.detail_resolution;
	}
	else if (prearea.resolution_mode == resolution_mode_enum.Tree)
	{
		prearea.step.x = preterrain1.terrain.terrainData.size.x/(prearea.tree_resolution);
		prearea.step.y = preterrain1.terrain.terrainData.size.z/(prearea.tree_resolution);
		prearea.conversion_step = prearea.step;
		prearea.resolution = prearea.tree_resolution;
	}
	else if (prearea.resolution_mode == resolution_mode_enum.Object)
	{
		prearea.step.x = preterrain1.terrain.terrainData.size.x/(prearea.object_resolution);
		prearea.step.y = preterrain1.terrain.terrainData.size.z/(prearea.object_resolution);
		prearea.conversion_step = prearea.step;
		prearea.resolution = prearea.object_resolution;
	}
	else if (prearea.resolution_mode == resolution_mode_enum.Units)
	{
		prearea.step.x = 1;
		prearea.step.y = 1;
		prearea.conversion_step = prearea.step;
		prearea.resolution = preterrain1.terrain.terrainData.size.x;
	}
	else if (prearea.resolution_mode == resolution_mode_enum.Custom)
	{
		prearea.resolution = preterrain1.terrain.terrainData.size.x/prearea.step.x;
		prearea.conversion_step = prearea.step;
	}	
}

function get_terrain_parameter_settings(preterrain1: terrain_class)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		terrains[count_terrain].settings_editor = preterrain1.settings_editor;
		terrains[count_terrain].settings_runtime = preterrain1.settings_runtime;
		
		if (!terrains[count_terrain].terrain){continue;}
		if (!terrains[count_terrain].terrain.terrainData){continue;}
		if (terrains[count_terrain].settings_editor)
		{
			terrains[count_terrain].heightmapPixelError = terrains[count_terrain].terrain.heightmapPixelError;
			terrains[count_terrain].heightmapMaximumLOD = terrains[count_terrain].terrain.heightmapMaximumLOD;
			terrains[count_terrain].basemapDistance = terrains[count_terrain].terrain.basemapDistance;
			terrains[count_terrain].castShadows = terrains[count_terrain].terrain.castShadows;
			terrains[count_terrain].draw = terrains[count_terrain].editor_draw;
			terrains[count_terrain].treeDistance = terrains[count_terrain].terrain.treeDistance;
			terrains[count_terrain].detailObjectDistance = terrains[count_terrain].terrain.detailObjectDistance;
			terrains[count_terrain].detailObjectDensity = terrains[count_terrain].terrain.detailObjectDensity;
			terrains[count_terrain].treeBillboardDistance = terrains[count_terrain].terrain.treeBillboardDistance;
			terrains[count_terrain].treeCrossFadeLength = terrains[count_terrain].terrain.treeCrossFadeLength;
			terrains[count_terrain].treeMaximumFullLODCount = terrains[count_terrain].terrain.treeMaximumFullLODCount;
		}
		else
		{
			terrains[count_terrain].script_terrainDetail = terrains[count_terrain].terrain.gameObject.GetComponent(TerrainDetail);
			
			if (!terrains[count_terrain].script_terrainDetail)
			{
				terrains[count_terrain].script_terrainDetail = terrains[count_terrain].terrain.gameObject.AddComponent(TerrainDetail);
			}
			
			terrains[count_terrain].heightmapPixelError = terrains[count_terrain].script_terrainDetail.heightmapPixelError;
			terrains[count_terrain].heightmapMaximumLOD = terrains[count_terrain].script_terrainDetail.heightmapMaximumLOD;
			terrains[count_terrain].basemapDistance = terrains[count_terrain].script_terrainDetail.basemapDistance;
			terrains[count_terrain].castShadows = terrains[count_terrain].script_terrainDetail.castShadows;
			terrains[count_terrain].draw = terrains[count_terrain].script_terrainDetail.draw;
			terrains[count_terrain].treeDistance = terrains[count_terrain].script_terrainDetail.treeDistance;
			terrains[count_terrain].detailObjectDistance = terrains[count_terrain].script_terrainDetail.detailObjectDistance;
			terrains[count_terrain].detailObjectDensity = terrains[count_terrain].script_terrainDetail.detailObjectDensity;
			terrains[count_terrain].treeBillboardDistance = terrains[count_terrain].script_terrainDetail.treeBillboardDistance;
			terrains[count_terrain].treeCrossFadeLength = terrains[count_terrain].script_terrainDetail.treeCrossFadeLength;
			terrains[count_terrain].treeMaximumFullLODCount = terrains[count_terrain].script_terrainDetail.treeMaximumFullLODCount;
		}
	}
}

function set_terrain_parameters(preterrain1: terrain_class,preterrain2: terrain_class)
{
	preterrain1.terrain.heightmapPixelError = preterrain2.heightmapPixelError;
	preterrain1.terrain.heightmapMaximumLOD = preterrain2.heightmapMaximumLOD;
	preterrain1.terrain.basemapDistance = preterrain2.basemapDistance;
	preterrain1.terrain.castShadows = preterrain2.castShadows;
	preterrain1.terrain.treeDistance = preterrain2.treeDistance;
	preterrain1.terrain.detailObjectDistance = preterrain2.detailObjectDistance;
	preterrain1.terrain.detailObjectDensity = preterrain2.detailObjectDensity;
	preterrain1.terrain.treeBillboardDistance = preterrain2.treeBillboardDistance;
	preterrain1.terrain.treeCrossFadeLength = preterrain2.treeCrossFadeLength;
	preterrain1.terrain.treeMaximumFullLODCount = preterrain2.treeMaximumFullLODCount;
}

function set_terrain_pixelerror(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor){preterrain1.terrain.heightmapPixelError = preterrain1.heightmapPixelError;}
				else {preterrain1.script_terrainDetail.heightmapPixelError = preterrain1.heightmapPixelError;}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].heightmapPixelError = preterrain1.heightmapPixelError;
				
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.heightmapPixelError = preterrain1.heightmapPixelError;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.heightmapPixelError = preterrain1.heightmapPixelError;
				}
			}
		}	
	}
}

function set_terrain_heightmap_lod(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor){preterrain1.terrain.heightmapMaximumLOD = preterrain1.heightmapMaximumLOD;}
				else {preterrain1.script_terrainDetail.heightmapMaximumLOD = preterrain1.heightmapMaximumLOD;}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].heightmapMaximumLOD = preterrain1.heightmapMaximumLOD;
				
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.heightmapMaximumLOD = preterrain1.heightmapMaximumLOD;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.heightmapMaximumLOD = preterrain1.heightmapMaximumLOD;
				}
			}
		}	
	}
}

function set_terrain_draw(preterrain1: terrain_class,all_terrain: boolean,draw: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (draw)
			{
				if (preterrain1.settings_editor)
				{
					preterrain1.terrain.detailObjectDistance = preterrain1.detailObjectDistance;
					preterrain1.terrain.treeDistance = preterrain1.treeDistance;
					preterrain1.editor_draw = true;
				}
				else
				{
					preterrain1.script_terrainDetail.draw = true;
				}
			}
			else
			{
				if (preterrain1.settings_editor)
				{
					preterrain1.terrain.detailObjectDistance = 0;
					preterrain1.terrain.treeDistance = 0;
					preterrain1.editor_draw = false;
				}
				else 
				{
					preterrain1.script_terrainDetail.draw = false;
				}
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				if (draw)
				{
					if (preterrain1.settings_editor)
					{
						terrains[count_terrain].terrain.detailObjectDistance = preterrain1.detailObjectDistance;	
						terrains[count_terrain].terrain.treeDistance = preterrain1.treeDistance;
						terrains[count_terrain].editor_draw = true;
					}
					else
					{
						terrains[count_terrain].script_terrainDetail.draw = true;
					}
				}
				else
				{
					if (preterrain1.settings_editor)
					{	
						terrains[count_terrain].terrain.detailObjectDistance = 0;
						terrains[count_terrain].terrain.treeDistance = 0;
						terrains[count_terrain].editor_draw = false;
					}
					else
					{
						terrains[count_terrain].script_terrainDetail.draw = false;
					}
				}
			}
		}	
	}

}

function set_terrain_basemap_distance(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor){preterrain1.terrain.basemapDistance = preterrain1.basemapDistance;}
				else {preterrain1.script_terrainDetail.basemapDistance = preterrain1.basemapDistance;}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].basemapDistance = preterrain1.basemapDistance;
				
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.basemapDistance = preterrain1.basemapDistance;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.basemapDistance = preterrain1.basemapDistance;
				}
			}
		}	
	}
}

function set_terrain_detail_distance(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor)
			{
				preterrain1.terrain.detailObjectDistance = preterrain1.detailObjectDistance;
			}
			else
			{
				preterrain1.script_terrainDetail.detailObjectDistance = preterrain1.detailObjectDistance;
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			terrains[count_terrain].detailObjectDistance = preterrain1.detailObjectDistance;
			
			if (terrains[count_terrain].terrain)
			{
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.detailObjectDistance = preterrain1.detailObjectDistance;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.detailObjectDistance = preterrain1.detailObjectDistance;
				}
			}
		}	
	}
}

function set_terrain_detail_density(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor)
			{
				preterrain1.terrain.detailObjectDensity = preterrain1.detailObjectDensity;
			}
			else
			{
				preterrain1.script_terrainDetail.detailObjectDensity = preterrain1.detailObjectDensity;
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].detailObjectDensity = preterrain1.detailObjectDensity;
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.detailObjectDensity = preterrain1.detailObjectDensity;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.detailObjectDensity = preterrain1.detailObjectDensity;	
				}
			}
		}	
	}
}

function set_terrain_tree_distance(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor)
			{
				preterrain1.terrain.treeDistance = preterrain1.treeDistance;
			}
			else
			{
				preterrain1.script_terrainDetail.treeDistance = preterrain1.treeDistance;
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			terrains[count_terrain].treeDistance = preterrain1.treeDistance;
			
			if (terrains[count_terrain].terrain)
			{
				if (preterrain1.settings_editor)
				{	
					terrains[count_terrain].terrain.treeDistance = preterrain1.treeDistance;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.treeDistance = preterrain1.treeDistance;	
				}
			}
		}	
	}
}

function set_terrain_tree_billboard_distance(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor)
			{
				preterrain1.terrain.treeBillboardDistance = preterrain1.treeBillboardDistance;
			}
			else
			{
				preterrain1.script_terrainDetail.treeBillboardDistance = preterrain1.treeBillboardDistance;
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			terrains[count_terrain].treeBillboardDistance = preterrain1.treeBillboardDistance;
			
			if (terrains[count_terrain].terrain)
			{
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.treeBillboardDistance = preterrain1.treeBillboardDistance;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.treeBillboardDistance = preterrain1.treeBillboardDistance;		
				}
			}
		}	
	}
}

function set_terrain_tree_billboard_fade_length(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor)
			{
				preterrain1.terrain.treeCrossFadeLength = preterrain1.treeCrossFadeLength;
			}
			else
			{
				preterrain1.script_terrainDetail.treeCrossFadeLength = preterrain1.treeCrossFadeLength;
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].treeCrossFadeLength = preterrain1.treeCrossFadeLength;	
				
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.treeCrossFadeLength = preterrain1.treeCrossFadeLength;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.treeCrossFadeLength = preterrain1.treeCrossFadeLength;
				}
			}
		}	
	}
}

function set_terrain_tree_max_mesh(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor)
			{
				preterrain1.terrain.treeMaximumFullLODCount = preterrain1.treeMaximumFullLODCount;
			}
			else
			{
				preterrain1.script_terrainDetail.treeMaximumFullLODCount = preterrain1.treeMaximumFullLODCount;
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			terrains[count_terrain].treeMaximumFullLODCount = preterrain1.treeMaximumFullLODCount;
			
			if (terrains[count_terrain].terrain)
			{
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.treeMaximumFullLODCount = preterrain1.treeMaximumFullLODCount;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.treeMaximumFullLODCount = preterrain1.treeMaximumFullLODCount;	
				}
			}
		}	
	}
}

function set_terrain_shadow(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			if (preterrain1.settings_editor)
			{
				preterrain1.terrain.castShadows = preterrain1.castShadows;
			}
			else
			{
				preterrain1.script_terrainDetail.castShadows = preterrain1.castShadows;
			}
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			terrains[count_terrain].castShadows = preterrain1.castShadows;	
			
			if (terrains[count_terrain].terrain)
			{
				if (preterrain1.settings_editor)
				{
					terrains[count_terrain].terrain.castShadows = preterrain1.castShadows;	
				}
				else
				{
					terrains[count_terrain].script_terrainDetail.castShadows = preterrain1.castShadows;	
				}
			}
		}	 
	} 
}

#if !UNITY_3_4 && !UNITY_3_5
function set_terrain_material(preterrain1: terrain_class,all_terrain: boolean)
{
	if (all_terrain)
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].terrain.materialTemplate = preterrain1.terrain.materialTemplate;	
			}
		}	
	}
}
#endif

function set_terrain_wind_speed(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			preterrain1.terrain.terrainData.wavingGrassSpeed = preterrain1.wavingGrassSpeed;
			return;
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].terrain.terrainData.wavingGrassSpeed = preterrain1.wavingGrassSpeed;	
				terrains[count_terrain].wavingGrassSpeed = preterrain1.wavingGrassSpeed;
			}
		}	
	}
}

function set_terrain_wind_amount(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			preterrain1.terrain.terrainData.wavingGrassAmount = preterrain1.wavingGrassAmount;
			return;
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].terrain.terrainData.wavingGrassAmount = preterrain1.wavingGrassAmount;	
				terrains[count_terrain].wavingGrassAmount = preterrain1.wavingGrassAmount;	
			}
		}	
	}
}

function set_terrain_wind_bending(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			preterrain1.terrain.terrainData.wavingGrassStrength = preterrain1.wavingGrassStrength;
			return;
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].terrain.terrainData.wavingGrassStrength = preterrain1.wavingGrassStrength;
				terrains[count_terrain].wavingGrassStrength = preterrain1.wavingGrassStrength;		
			}
		}	
	}
}

function set_terrain_grass_tint(preterrain1: terrain_class,all_terrain: boolean)
{
	if (!all_terrain)
	{
		if (preterrain1.terrain)
		{
			preterrain1.terrain.terrainData.wavingGrassTint = preterrain1.wavingGrassTint;
			return;
		}
	}
	else
	{
		for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].terrain)
			{
				terrains[count_terrain].terrain.terrainData.wavingGrassTint = preterrain1.wavingGrassTint;	
				terrains[count_terrain].wavingGrassTint = preterrain1.wavingGrassTint;
			}
		}	
	}
}

function set_terrain_settings(preterrain1: terrain_class,command: String)
{
	if (preterrain1.terrain)
	{
		var command_size: boolean = false;
		var command_all: boolean = false;
		var command_resolutions: boolean = false;
		
		if (command.IndexOf("(siz)") != -1){command_size = true;}
		if (command.IndexOf("(res)") != -1){command_resolutions = true;}
		if (command.IndexOf("(all)") != -1){command_all = true;}
		
		if (command_resolutions || command_all)
		{
			if (preterrain1.terrain.terrainData.heightmapResolution != preterrain1.heightmap_resolution)
			{
				preterrain1.terrain.terrainData.heightmapResolution = preterrain1.heightmap_resolution;
				preterrain1.terrain.terrainData.size = preterrain1.size;
			}
			if (preterrain1.terrain.terrainData.alphamapResolution != preterrain1.splatmap_resolution){preterrain1.terrain.terrainData.alphamapResolution = preterrain1.splatmap_resolution;}
			if (preterrain1.terrain.terrainData.baseMapResolution != preterrain1.basemap_resolution){preterrain1.terrain.terrainData.baseMapResolution = preterrain1.basemap_resolution;}
			preterrain1.terrain.terrainData.SetDetailResolution(preterrain1.detail_resolution,preterrain1.detail_resolution_per_patch);
		}
		
		if (command_size || command_all)
		{
			var size_old: Vector3 = preterrain1.terrain.terrainData.size;
			
			if (preterrain1.terrain.terrainData.size != preterrain1.size)
			{
				preterrain1.terrain.terrainData.size = preterrain1.size;
			}	
			var size_factor: Vector2;
			size_factor.x = preterrain1.size.x/size_old.x;
			size_factor.y = preterrain1.size.z/size_old.z;
			
			// Debug.Log("size_old: "+size_old+" size new: "+preterrain1.terrain.terrainData.size);
			
			preterrain1.prearea.area_max.xMin = 0;
			preterrain1.prearea.area_max.yMin = 0;
			preterrain1.prearea.area_max.xMax = preterrain1.terrain.terrainData.size.x;
			preterrain1.prearea.area_max.yMax = preterrain1.terrain.terrainData.size.z;
			// Debug.Log(preterrain1.prearea.area);
			preterrain1.prearea.area.xMin *= size_factor.x;
			preterrain1.prearea.area.xMax *= size_factor.x;
			preterrain1.prearea.area.yMin *= size_factor.y;
			preterrain1.prearea.area.yMax *= size_factor.y;
			// Debug.Log(preterrain1.prearea.area);
		}
		
		get_terrain_settings(preterrain1,"(con)"+command);
	}
}

function setTerrainAreaMax(preterrain1: terrain_class)
{
	if (!preterrain1.terrain) return;
	if (!preterrain1.terrain.terrainData) return;
	preterrain1.prearea.area_max = new Rect(0,0,preterrain1.terrain.terrainData.size.x,preterrain1.terrain.terrainData.size.z);
	preterrain1.prearea.area = preterrain1.prearea.area_max;
}

function set_all_terrain_area(preterrain1: terrain_class)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		terrains[count_terrain].prearea.resolution_mode = preterrain1.prearea.resolution_mode;
		terrains[count_terrain].prearea.area = preterrain1.prearea.area;
		terrains[count_terrain].prearea.step = preterrain1.prearea.step;
		terrains[count_terrain].prearea.tree_resolution = preterrain1.prearea.tree_resolution;
		terrains[count_terrain].prearea.object_resolution = preterrain1.prearea.object_resolution;
		// terrains[count_terrain].prearea.colormap_resolution = preterrain1.prearea.colormap_resolution;
		// terrains[count_terrain].tree_resolution_active = preterrain1.tree_resolution_active;
		// terrains[count_terrain].object_resolution_active = preterrain1.object_resolution_active;
		terrains[count_terrain].prearea.set_resolution_mode_text();
		terrains[count_terrain].color_terrain = Color(0.5,1,0.5);
	}
}

function set_all_terrain_settings(preterrain1: terrain_class,command: String)
{
	var command_size: boolean = false;
	var command_resolution: boolean = false;
	
	if (command.IndexOf("(siz)") != -1){command_size = true;}
	if (command.IndexOf("(res)") != -1){command_resolution = true;}
	
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (command_size){terrains[count_terrain].size = preterrain1.size;}
		if (command_resolution)
		{
			terrains[count_terrain].heightmap_resolution = preterrain1.heightmap_resolution;
			terrains[count_terrain].splatmap_resolution = preterrain1.splatmap_resolution;
			terrains[count_terrain].detail_resolution = preterrain1.detail_resolution;
			terrains[count_terrain].basemap_resolution = preterrain1.basemap_resolution;
			terrains[count_terrain].detail_resolution_per_patch = preterrain1.detail_resolution_per_patch;
		}	
		terrains[count_terrain].color_terrain = Color(0.5,1,0.5);
		
		set_terrain_settings(terrains[count_terrain],command);
		get_terrain_settings(terrains[count_terrain],command);
	}
}

function object_apply()
{
	if (!object_output) return;
	
	if (placedObjects.Count > 0) {
		for (var i: int = 0;i < placedObjects.Count;++i) {
			#if !UNITY_3_4 && !UNITY_3_5
				placedObjects[i].SetActive(true);
			#else
				placedObjects[i].active = true;
			#endif
		}
		placedObjects.Clear();
	}
}

function terrain_apply(preterrain1: terrain_class)
{
	if ((runtime || settings.direct_colormap )&& color_output ) {
		preterrain1.ColorGlobal.Apply();
	}
	
	if (splat_output || color_output && !button_export && !settings.direct_colormap)
	{
//		if (!settings.runtime_create_terrain) {
			for (var count_alpha: int = 0;count_alpha < preterrain1.splat_alpha.Length;++count_alpha)
			{
				preterrain1.splat_alpha[count_alpha].Apply();
			}
			
			preterrain1.terrain.terrainData.SetAlphamaps(0,0,preterrain1.terrain.terrainData.GetAlphamaps(0,0,1,1));
//		}
//		else {
//			preterrain1.terrain.terrainData.SetAlphamaps(0,0,alphamap);
//		}
	}
	if (grass_output)
	{
		for (var count_grass: int;count_grass < preterrain1.grass.Length;++count_grass)
		{
			preterrain1.terrain.terrainData.SetDetailLayer(0,0,count_grass,grass_detail[count_grass].detail);
			
			for (var count_detail_y: int = 0;count_detail_y < preterrain1.detail_resolution;++count_detail_y) {
				for (var count_detail_x: int = 0;count_detail_x < preterrain1.detail_resolution;++count_detail_x) {
					grass_detail[count_grass].detail[count_detail_x,count_detail_y] = 0;
				}	
			}
		}
	}
	if (heightmap_output)
	{
		preterrain1.terrain.terrainData.SetHeights(0,0,heights);
		if (smooth_command){smooth_terrain(preterrain1,smooth_tool_layer_strength);}
	}
	if (tree_output)
	{
		preterrain1.terrain.terrainData.treeInstances = new TreeInstance[tree_instances.Count];
		preterrain1.terrain.terrainData.treeInstances = tree_instances.ToArray();
	}
	
	// VersionControl.Provider.Checkout(preterrain1.terrain.terrainData,CheckoutMode.Both);
	// if (preterrain1.rtp_script) {
	//	preterrain1.rtp_script.globalSettingsHolder.RefreshAll();		
	// }
	preterrain1.terrain.Flush();
}

function FlushTerrains()
{
	for (var i: int = 0; i < terrains.Count; i++) if (terrains[i].terrain != null && terrains[i].active) terrains[i].terrain.Flush();
}

function get_terrain_alpha(preterrain1: terrain_class,local_x: int,local_y: int,alpha_index: int): float
{
	var alpha_map: int = alpha_index/4;
	var alpha_color: Color = preterrain1.splat_alpha[alpha_map].GetPixel(local_x,local_y);

	return alpha_color[alpha_index-(alpha_map*4)];
}

function set_all_tree_filters(tree_output: tree_output_class,tree_number: int,all: boolean)
{
	for (var count_tree: int = 0;count_tree < tree_output.tree.Count;++count_tree)
	{
		if (tree_output.tree_value.active[count_tree] || all)
		{
			if (count_tree != tree_number)
			{
				erase_filters(tree_output.tree[count_tree].prefilter);
				tree_output.tree[count_tree].prefilter = copy_prefilter(tree_output.tree[tree_number].prefilter);
			}		
			if (tree_output.tree[count_tree].color_tree[0] < 1.5){tree_output.tree[count_tree].color_tree += Color(0.5,0.5,0.5,0.5);}
		}
	}
}

function set_all_tree_precolor_range(tree_output: tree_output_class,tree_number: int,all: boolean)
{
	for (var count_tree: int = 0;count_tree < tree_output.tree.Count;++count_tree)
	{
		if (tree_output.tree_value.active[count_tree] || all)
		{
			if (count_tree != tree_number)
			{
				tree_output.tree[count_tree].precolor_range = copy_precolor_range(tree_output.tree[tree_number].precolor_range);
			}
			if (tree_output.tree[count_tree].color_tree[0] < 1.5){tree_output.tree[count_tree].color_tree += Color(0.5,0.5,0.5,0.5);}
		}
	}
}

function set_auto_object(object_output: object_output_class): boolean
{
	if (!object_output.search_object){return false;}
	var objects: Transform[] = object_output.search_object.GetComponentsInChildren.<Transform>();
	var name_old: String;
	
	add_object(object_output,object_output.object.Count);
	object_output.object[object_output.object.Count-1].object1 = objects[1].gameObject;
	name_old = objects[1].name;
	
	for (var count_object: int = 2;count_object < objects.Length;++count_object)
	{
		if (objects[count_object].name != name_old)
		{
			add_object(object_output,object_output.object.Count);
			object_output.object[object_output.object.Count-1].object1 = objects[count_object].gameObject;
			name_old = objects[count_object].name;
		}
		else if (object_output.search_erase_doubles){DestroyImmediate(objects[count_object].gameObject);}
	}
	return true;
}


function create_terrain(preterrain: terrain_class,tiles: Vector2)
{
	var terrainData: TerrainData;
	var terrainObject: GameObject;
	var terrain: Terrain;
	var colliderScript: TerrainCollider;
	
	var nameString: String;
	var path: String;
	var index: int;
	
	DeleteTerrain(terrains[0]);
	// terrains[0] = copy_terrain(preterrain);
	
	clear_terrain_list(true);
	
	if (terrains[0].size.x == 0) terrains[0].size.x = 1000;
	if (terrains[0].size.y == 0) terrains[0].size.y = 500;
	if (terrains[0].size.z == 0) terrains[0].size.z = 1000;
	
	for (var y: int = 0;y < tiles.y;++y) {
		for (var x: int = 0;x < tiles.x;++x) {
			if (x !=0 || y != 0) terrains.Add(new terrain_class());
			
			index = terrains.Count-1;
			
			if (x !=0 || y != 0) terrains[index] = copy_terrain(terrains[0]);
			
			terrains[index].tile_x = x;
			terrains[index].tile_z = y;
			terrains[index].tiles = tiles;
			terrains[index].index = index;
			
			terrainObject = new GameObject();
			if (terrain_parent) terrainObject.transform.parent = terrain_parent;
			terrain = terrainObject.AddComponent(Terrain);
			colliderScript = terrainObject.AddComponent(TerrainCollider);
			
			nameString = "_x"+x.ToString()+"_y"+y.ToString();
			terrain.name = terrain_scene_name+nameString;
			
			terrainData = new TerrainData();
			terrainData.size = terrains[0].size;
			terrain.terrainData = terrainData;
			colliderScript.terrainData = terrainData;
			
			terrains[index].terrain = terrain;
			set_terrain_splat_textures(terrains[index],terrains[index]);
			set_terrain_trees(terrains[index]);
			set_terrain_details(terrains[index]);
			set_terrain_settings(terrains[index],"(all)");
			
			#if !UNITY_3_4 && !UNITY_3_5
	    	if (settings.copy_terrain_material) {
	    		terrain.materialTemplate = terrains[0].terrain.materialTemplate;
	    	}
	    	#endif
			
			set_terrain_parameters(terrains[index],terrains[0]);
			get_terrain_parameter_settings(terrains[index]);
			
			terrains[index].foldout = false;
	    	if (terrains[0].rtp_script) {assign_rtp_single(terrains[index]);}
	    }
	}
	
	FitTerrainTiles(preterrain,true);
}

function create_terrain2(preterrain1: terrain_class,length: int,name_number: int)
{
	for (var count_terrain: int = 0;count_terrain < length;++count_terrain)
	{
	    var terrainData: TerrainData = new TerrainData();
			
		terrainData.heightmapResolution = preterrain1.heightmap_resolution;
		terrainData.baseMapResolution = preterrain1.basemap_resolution;
		terrainData.alphamapResolution = preterrain1.splatmap_resolution;
		terrainData.SetDetailResolution(preterrain1.detail_resolution,preterrain1.detail_resolution_per_patch);
		if (preterrain1.size.x == 0){preterrain1.size.x = 1000;}
		if (preterrain1.size.y == 0){preterrain1.size.y = 500;}
		if (preterrain1.size.z == 0){preterrain1.size.z = 1000;}
	    terrainData.size = preterrain1.size;
    
	    var object: GameObject = Terrain.CreateTerrainGameObject(terrainData);
	    if (preterrain1.parent){object.transform.parent = preterrain1.parent;}
	   
	    var terrain: Terrain = object.GetComponent(Terrain);
	    // var script_collider: TerrainCollider = object.AddComponent(TerrainCollider);
	    terrain.name = terrain_scene_name+(count_terrain+name_number);
	    // terrain.terrainData = terrainDatas[terrainDatas.Count-1];
	    // var path: String = script.terrain_path;
	    //path = "Assets"+path.Replace(Application.dataPath,String.Empty);
	    // path += "/"+script.terrain_asset_name+(count_terrain+name_number)+".asset";
		// AssetDatabase.CreateAsset(terrainData,path);
	    // script_collider.terrainData = terrainData;
	    if (terrains.Count < count_terrain+name_number){set_terrain_length(terrains.Count+1);}
	    terrains[count_terrain+name_number-1].terrain = terrain;
		if (count_terrain != 0) 
	    	set_terrain_parameters(terrains[count_terrain+name_number-1],terrains[name_number-1]);
		else 
			set_terrain_parameters(terrains[count_terrain+name_number-1],terrains[count_terrain+name_number-1]);
	    get_terrain_settings(terrains[count_terrain+name_number-1],"(res)(con)(fir)");
	    terrains[count_terrain+name_number-1].tile_x = 0;
	    terrains[count_terrain+name_number-1].tile_z = 0;
	    terrains[count_terrain+name_number-1].tiles = Vector2(1,1);
	    terrains[count_terrain+name_number-1].terrain.transform.position = Vector3(-preterrain1.size.x/2,0,-preterrain1.size.z/2);
	    terrains[count_terrain+name_number-1].prearea.max();
	}
	
	set_all_terrain_area(preterrain1);
	set_all_terrain_splat_textures(preterrain1,true,true);
	assign_all_terrain_splat_alpha();
	set_all_terrain_trees(preterrain1);
	set_all_terrain_details(preterrain1);
}

function assign_all_terrain_splat_alpha()
{
	for (var i: int = 0;i < terrains.Count;++i) {
		assign_terrain_splat_alpha(terrains[i]);
	}
}

function assign_terrain_splat_alpha(preterrain1: terrain_class)
{
	if (preterrain1.terrain) 
	{
		if (!preterrain1.terrain.terrainData){return;}
		if (preterrain1.terrain.terrainData.splatPrototypes.Length < 1){return;}
		
		var terrainDataType: Type = preterrain1.terrain.terrainData.GetType();
		
		var info: PropertyInfo = terrainDataType.GetProperty("alphamapTextures", BindingFlags.Instance | BindingFlags.NonPublic);
		
		if (info == null) info = terrainDataType.GetProperty("alphamapTextures", BindingFlags.Instance | BindingFlags.Public);
		if (info != null) {
			preterrain1.splat_alpha = info.GetValue(preterrain1.terrain.terrainData, null) as Texture2D[];
		} 
		else{
			Debug.LogError("Can't access alphamapTexture directly...");
		}
	}
}

function randomize_layer_offset(layer_output: layer_output_enum,offset: Vector2,seed: int)
{
	UnityEngine.Random.seed = seed;
	for (var count_layer: int = 0;count_layer < prelayers[0].layer.Count;++count_layer) {
		if (prelayers[0].layer[count_layer].output == layer_output) {
			prelayers[0].layer[count_layer].offset = Vector2(UnityEngine.Random.Range(offset.x,offset.y),UnityEngine.Random.Range(offset.x,offset.y));
			prelayers[0].layer[count_layer].offset_middle = prelayers[0].layer[count_layer].offset;
		}
	}	
}

function set_auto_terrain()
{
	var terrains2: Terrain[] = FindObjectsOfType(Terrain);
	
	if (terrains2.Length > 0)
	{
		terrains.Clear();
		var count_terrain: int;
		
		for (count_terrain = 0;count_terrain < terrains2.Length;++count_terrain)
		{
			var name: String = terrains2[count_terrain].name;
			var numbersOnly: String = Regex.Replace(name, "[^0-9]", "");
 		
 			var number: float = 0;
 			if (Single.TryParse(numbersOnly,number))
 			{
 				terrains.Add(new terrain_class());
 				terrains[terrains.Count-1].terrain = terrains2[count_terrain];
				terrains[terrains.Count-1].name = terrains[terrains.Count-1].terrain.name;
				terrains[terrains.Count-1].index = terrains.Count-1;
				get_terrain_settings(terrains[terrains.Count-1],"(all)(fir)(spl)(tre)");
 			} 
 		}
	}
	set_smooth_tool_terrain_popup();
	set_terrain_text();
}

function AutoSearchTerrains()
{
	var terrainObjects: Terrain[];
	
	var terrain: Terrain;
	var terrainArea: Rect;
	var tile: Vector2 = new Vector2();
	var tiles: Vector2 = Vector2.zero;
	var tempTerrains: List.<TempTerrain_Class> = new List.<TempTerrain_Class>();
	
	if (terrainSearchParent != null) {
		terrainObjects = terrainSearchParent.GetComponentsInChildren.<Terrain>();
	}
	else {
		terrainObjects = FindObjectsOfType(Terrain);
	}
	
	// Debug.Log(terrainObjects.Length);
	
	if (terrainObjects.Length == 0) return;
	
	terrains.Clear();
	
	terrainArea = GetTerrainsArea(terrainObjects);			
	tiles.x = Mathf.Round((terrainArea.width)/terrainObjects[0].terrainData.size.x);
	tiles.y = Mathf.Round((terrainArea.height)/terrainObjects[0].terrainData.size.z);
	
	// Debug.Log(terrainArea);
	// Debug.Log(terrainObjects.Length);
	// Debug.Log(tiles);
	
	for (var i: int = 0;i < terrainObjects.Length;++i) {
		terrain = terrainObjects[i];
		tile.x = Mathf.Round((terrain.transform.position.x-terrainArea.xMin)/terrain.terrainData.size.x);
		tile.y = Mathf.Round((terrain.transform.position.z-terrainArea.yMin)/terrain.terrainData.size.z);
		tempTerrains.Add(new TempTerrain_Class(terrain,tile));	
	}
	
	for (var y: int = 0;y < tiles.y;++y) {
		for (var x: int = 0;x < tiles.x;++x) {
			for (i = 0;i < tempTerrains.Count;++i) {
				if (x == tempTerrains[i].tile.x	&& y == tempTerrains[i].tile.y) {
					terrains.Add(new terrain_class());
					terrains[terrains.Count-1].terrain = tempTerrains[i].terrain;
					terrains[terrains.Count-1].tile_x = tempTerrains[i].tile.x;
					terrains[terrains.Count-1].tile_z = tempTerrains[i].tile.y;
					terrains[terrains.Count-1].tiles = tiles;
					get_terrain_settings(terrains[terrains.Count-1],"(all)(fir)(spl)(tre)");
					break;
				}
			}
		}
	}
}

function AutoSearchTiles()
{
	var preterrain: terrain_class;
	var terrainArea: Rect;
	var tile: Vector2 = new Vector2();
	var tiles: Vector2 = Vector2.zero;
	var tempTerrains: List.<terrain_class> = new List.<terrain_class>();
	var terrainIndex = -1;
	
	terrainArea = GetTerrainsArea();
	
	for (var i: int = 0;i < terrains.Count;++i) {			
		if (terrains[i].terrain != null) {
			if (terrains[i].terrain.terrainData != null) {terrainIndex = i;break;}
		}	
	}
	if (terrainIndex == -1) return;
	
	tiles.x = Mathf.Round((terrainArea.width)/terrains[terrainIndex].terrain.terrainData.size.x);
	tiles.y = Mathf.Round((terrainArea.height)/terrains[terrainIndex].terrain.terrainData.size.z);
	
	// Debug.Log(terrainArea);
	// Debug.Log(terrains.Length);
	// Debug.Log(tiles);
	
	for (i = 0;i < terrains.Count;++i) {
		preterrain = terrains[i];
		preterrain.tiles = tiles;
		tempTerrains.Add(terrains[i]);	
		if (preterrain.terrain == null) continue;
		if (preterrain.terrain.terrainData == null) continue;
		preterrain.tile_x = Mathf.Round((preterrain.terrain.transform.position.x-terrainArea.xMin)/preterrain.terrain.terrainData.size.x);
		preterrain.tile_z = Mathf.Round((preterrain.terrain.transform.position.z-terrainArea.yMin)/preterrain.terrain.terrainData.size.z);
	}
	
	terrains.Clear();
	
	for (var y: int = 0;y < tiles.y;++y) {
		for (var x: int = 0;x < tiles.x;++x) {
			for (i = 0;i < tempTerrains.Count;++i) {
				if (x == tempTerrains[i].tile_x	&& y == tempTerrains[i].tile_z) {
					
					terrains.Add(tempTerrains[i]);
					// terrains[terrains.Count-1].terrain = tempTerrains[i].terrain;
					// terrains[terrains.Count-1].tile_x = tempTerrains[i].tile.x;
					// terrains[terrains.Count-1].tile_z = tempTerrains[i].tile.y;
					// terrains[terrains.Count-1].tiles = tiles;
					// get_terrain_settings(terrains[terrains.Count-1],"(all)(fir)(spl)(tre)");
					break;
				}
			}
		}
	}
}

function GetTerrainsArea(terrainObjects: Terrain[]): Rect
{
	var xMin: float = 99999999999;
	var xMax: float = -99999999999;
	var zMin: float = 99999999999;
	var zMax: float = -99999999999;
	
	var size: Vector3;
	
	for (var i: int = 0;i < terrainObjects.Length;++i) {
		if (terrainObjects[i].terrainData == null) continue;
		size = terrainObjects[i].terrainData.size;
		if (terrainObjects[i].transform.position.x <= xMin) {
			xMin = terrainObjects[i].transform.position.x;
		}
		if (terrainObjects[i].transform.position.z <= zMin) {
			zMin = terrainObjects[i].transform.position.z;
		}
		if (terrainObjects[i].transform.position.x+size.x >= xMax) {
			xMax = terrainObjects[i].transform.position.x+size.x;
		}
		if (terrainObjects[i].transform.position.z+size.z >= zMax) {
			zMax = terrainObjects[i].transform.position.z+size.z;
		}
	}
	
	return new Rect(xMin,zMin,xMax-xMin,zMax-zMin);
}

function GetTerrainsArea(): Rect
{
	var xMin: float = 99999999999;
	var xMax: float = -99999999999;
	var zMin: float = 99999999999;
	var zMax: float = -99999999999;
	
	var size: Vector3;
	
	for (var i: int = 0;i < terrains.Count;++i) {
		if (terrains[i].terrain == null) continue;
		if (terrains[i].terrain.terrainData == null) continue;
		size = terrains[i].terrain.terrainData.size;
		if (terrains[i].terrain.transform.position.x <= xMin) {
			xMin = terrains[i].terrain.transform.position.x;
		}
		if (terrains[i].terrain.transform.position.z <= zMin) {
			zMin = terrains[i].terrain.transform.position.z;
		}
		if (terrains[i].terrain.transform.position.x+size.x >= xMax) {
			xMax = terrains[i].terrain.transform.position.x+size.x;
		}
		if (terrains[i].terrain.transform.position.z+size.z >= zMax) {
			zMax = terrains[i].terrain.transform.position.z+size.z;
		}
	}
	
	return new Rect(xMin,zMin,xMax-xMin,zMax-zMin);
}

function set_auto_mesh()
{
	var meshes2: MeshFilter[];
	if (object_search == null) meshes2 = FindObjectsOfType(MeshFilter);
	else meshes2 = object_search.GetComponentsInChildren.<MeshFilter>();
	
	if (meshes2 != null) {
		if (meshes2.Length > 0) {
			meshes.Clear();
			
			for (var i:int = 0;i < meshes2.Length;++i) {
				if ((meshes2[i].gameObject.layer & meshes_layer) == meshes_layer) {
					meshes.Add(new mesh_class());
					
					meshes[meshes.Count-1].gameObject = meshes2[i].gameObject;
					meshes[meshes.Count-1].transform = meshes2[i].transform;
					meshes[meshes.Count-1].collider = meshes2[i].GetComponent(MeshCollider);
					meshes[meshes.Count-1].meshFilter = meshes2[i].GetComponent(MeshFilter);
					meshes[meshes.Count-1].mesh = meshes[meshes.Count-1].meshFilter.sharedMesh;
				}
			}
		}
	}
}
/*
function set_auto_terrain()
{
	var terrains2: Terrain[] = FindObjectsOfType(Terrain);
	var terrains3: List.<Terrain> = new List.<Terrain>();
	
	if (terrains2.Length > 0)
	{
		terrains.Clear();
		var list: List.<int> = new List.<int>();
		var count_terrain: int;
		
		for (count_terrain = 0;count_terrain < terrains2.Length;++count_terrain)
		{
			var name: String = terrains2[count_terrain].name;
			var numbersOnly: String = Regex.Replace(name, "[^0-9]", "");
 		
 			var number: float = 0;
 			if (Single.TryParse(numbersOnly,number))
 			{
 				list.Add(number);
 				terrains3.Add(terrains2[count_terrain]);
 				terrains.Add(new terrain_class());
 			} 
 		}
		
		if (list.Count > 0)
		{
			for (count_terrain = 0;count_terrain < list.Count;++count_terrain)
			{
				var pos: int = get_rank_in_list(list,count_terrain);
				terrains[pos].terrain = terrains3[count_terrain];
				terrains[pos].name = terrains[pos].terrain.name;
				terrains[pos].index = pos;
				get_terrain_settings(terrains[pos],"(all)(fir)(spl)(tre)");
			}
		}
	}
	set_smooth_tool_terrain_popup();
	set_terrain_text();
}
*/

function get_rank_in_list(list: List.<int>,number: int): int
{
	var rank: int = 0;
	for (var count: int = 0;count < list.Count;++count)
	{
		if (list[number] > list[count]){++rank;}
	}
	return rank;
}

function check_terrains_assigned(): boolean
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (!terrains[count_terrain].terrain){return false;}
		if (!terrains[count_terrain].terrain.terrainData){return false;}
	}
	return true;
}


function find_mesh(): boolean
{
	if (prelayer.count_terrain < meshes.Count) return true; else return false;
}


function find_terrain(first: boolean): boolean
{
	var length: ulong;
	
	for (var count_terrain: int = prelayer.count_terrain;count_terrain < terrains.Count;++count_terrain)
	{
 		if (terrains[count_terrain].active) {
 			tree_instances.Clear();
 			
 			for (var count_treemap: int = 0;count_treemap < settings.treemap.Count;++count_treemap) {
	 			if (tree_output && settings.treemap[count_treemap].load && settings.treemap[count_treemap].map) {
	 				load_tree(count_treemap,count_terrain);
	 			}
	 		}
	 		
	 		if ((runtime || settings.direct_colormap )&& color_output && terrains[count_terrain].rtp_script) {
	 			var t: Type = terrains[count_terrain].rtp_script.GetType();
	 			var info: FieldInfo = t.GetField("ColorGlobal");
	 			terrains[count_terrain].ColorGlobal = info.GetValue (terrains[count_terrain].rtp_script) as Texture2D;
	 		}
	 		
	 		if (object_output) {
	 			if (settings.parentObjectsTerrain) {
	 				terrains[count_terrain].objectParent = new GameObject();
	 				terrains[count_terrain].objectParent.transform.parent = terrains[count_terrain].terrain.transform;
	 				terrains[count_terrain].objectParent.name = "Objects";
	 			}
	 		}
	 		
	 		if (!first) {
	 			if (heightmap_output) {
	 				length = terrains[count_terrain].heightmap_resolution*terrains[count_terrain].heightmap_resolution;
	 				if (length != heights.Length) {
	 					heights = new float[terrains[count_terrain].heightmap_resolution,terrains[count_terrain].heightmap_resolution];
	 				}
	 			}
//	 			if ((splat_output || color_output) && settings.runtime_create_terrain) {
//	 				length = terrains[count_terrain].splatmap_resolution*terrains[count_terrain].splatmap_resolution*terrains[count_terrain].splat_length;
//	 				if (length != alphamap.Length) {
//	 					alphamap = new float [terrains[count_terrain].splatmap_resolution,terrains[count_terrain].splatmap_resolution,terrains[count_terrain].splat_length];
//	 				}
//	 			}
	 			
	 			if (grass_output) {
	 				if (terrains[count_terrain].terrain.terrainData.detailPrototypes.Length > grass_detail.Length) {grass_detail = new detail_class[terrains[count_terrain].terrain.terrainData.detailPrototypes.Length];}
 					for (var count_detail: int = 0;count_detail < grass_detail.Length;++count_detail) {
						if (!grass_detail[count_detail]) {grass_detail[count_detail] = new detail_class();}
						if (grass_detail[count_detail].detail) {
							if (terrains[count_terrain].detail_resolution*terrains[count_terrain].detail_resolution != grass_detail[count_detail].detail.Length) {
	 							grass_detail[count_detail].detail = new int[terrains[count_terrain].detail_resolution,terrains[count_terrain].detail_resolution];
	 						}
						}
						else {
							grass_detail[count_detail].detail = new int[terrains[count_terrain].detail_resolution,terrains[count_terrain].detail_resolution];
						}
					}
				}
			} 
//			else {
//				if ((splat_output || color_output) && settings.create_runtime_terrain) {
//					alphamap = new float [terrains[count_terrain].splatmap_resolution,terrains[count_terrain].splatmap_resolution,terrains[count_terrain].splat_length];
//				}
//			}
			
			for (var count_grassmap: int = 0;count_grassmap < settings.grassmap.Count;++count_grassmap) {
	 			if (grass_output && settings.grassmap[count_grassmap].load && settings.grassmap[count_grassmap].map) {
	 				load_grass(count_grassmap,count_terrain);
	 			}
	 		}
	 		
			if (prelayer.count_terrain > 0) {
 				set_image_terrain_mode(count_terrain);
 			}
 			return true;
 		}
 		++prelayer.count_terrain;
 	}
 	return false;
}

function load_tree(treemap_index: int,terrain_index: int) 
{
	tree_script = settings.treemap[treemap_index].map.GetComponent("save_trees") as save_trees;
	
	if (tree_script.tree_save.Count-1 < terrain_index) {return;}
			
	var length: int = tree_script.tree_save[terrain_index].treeInstances.Count;
	var tempInstance: TreeInstance;
	var prototype: int;
	var size: Vector3 = terrains[terrain_index].terrain.terrainData.size;
	
	for (var count_tree: int = 0;count_tree < length;++count_tree) {
		// tree_script.tree_save[count_terrain].tree_instances.Add(new treeInstance_class());
		
		prototype = tree_script.tree_save[terrain_index].treeInstances[count_tree].prototypeIndex;
		if (UnityEngine.Random.Range(0.0,1.0) > settings.treemap[treemap_index].tree_param[prototype].density) {continue;}
		
		tempInstance.position = tree_script.tree_save[terrain_index].treeInstances[count_tree].position;
		tempInstance.position.y = terrains[terrain_index].terrain.terrainData.GetInterpolatedHeight(tempInstance.position.x,tempInstance.position.z)/size.y;
		tempInstance.widthScale = tree_script.tree_save[terrain_index].treeInstances[count_tree].widthScale*settings.treemap[treemap_index].tree_param[prototype].scale;
		tempInstance.heightScale = tree_script.tree_save[terrain_index].treeInstances[count_tree].heightScale*settings.treemap[treemap_index].tree_param[prototype].scale;
		tempInstance.color = tree_script.tree_save[terrain_index].treeInstances[count_tree].color;
		tempInstance.lightmapColor = tree_script.tree_save[terrain_index].treeInstances[count_tree].lightmapColor;
		tempInstance.prototypeIndex = settings.treemap[treemap_index].tree_param[prototype].prototype;
		
		tree_instances.Add(tempInstance);
	}
}

function load_grass(grassmap_index: int,terrain_index: int) 
{
	grass_script = settings.grassmap[grassmap_index].map.GetComponent("save_grass") as save_grass;
	
	if (grass_script.grass_save.Count-1 < terrain_index) {return;}
	var resolution: int = grass_script.grass_save[terrain_index].resolution;	
	var resolution2: int;	
	var length: int = grass_script.grass_save[terrain_index].details.Count;
	var resolution_conversion: float = (resolution/terrains[terrain_index].detail_resolution)*(resolution/terrains[terrain_index].detail_resolution);
	var length2: int;
	
	for (var count_grass: int = 0;count_grass < length;++count_grass) {
		if (count_grass > terrains[terrain_index].terrain.terrainData.detailPrototypes.Length-1){return;}
		// grass_script.grass_save[count_terrain].grass_instances.Add(new grassInstance_class());
		
		length2 = grass_detail[settings.grassmap[grassmap_index].grass_param[count_grass].prototype].detail.Length;
		resolution2 = terrains[terrain_index].detail_resolution;
	
		for (var count_detail: int = 0;count_detail < length2;++count_detail) {
			// if (UnityEngine.Random.Range(0.0,1.0) > settings.grassmap[grassmap_index].grass_param[count_grass].density) {continue;}
			// Debug.Log((count_detail-((count_detail/resolution)*resolution)));
			grass_detail[settings.grassmap[grassmap_index].grass_param[count_grass].prototype].detail [(count_detail-((count_detail/resolution2)*resolution2)),(count_detail/(resolution2))] += 
				grass_script.grass_save[terrain_index].details[count_grass].detail[count_detail*resolution_conversion]*settings.grassmap[grassmap_index].grass_param[count_grass].density;
		}
	}
}

function assign_rtp(active: boolean,open_link: boolean)
{
	var t: Type;
	var info: FieldInfo;
	var t2: Type;
	
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain) {
		if (!terrains[count_terrain].terrain) {continue;}
		if (active) {
			assign_rtp_single(terrains[count_terrain]);
			/*
			if (!terrains[count_terrain].rtp_script) {
				if (open_link) {
					Application.OpenURL ("http://forum.unity3d.com/threads/206516-Relief-Terrain-Pack-(RTP)-v3-on-AssetStore");
				}
				Debug.Log("RTP Relief Terrain Package is not installed, you can read more about it at the Asset Store");
				break;
			}
			*/
		} 
		else {
			terrains[count_terrain].rtp_script = null;
		}
	}
}

function assign_rtp_single(terrain1: terrain_class)
{
	#if UNITY_EDITOR
	terrain1.rtp_script = terrain1.terrain.GetComponent("ReliefTerrain");
	if (!terrain1.rtp_script) {
		var t: Type = TC.GetType(typeof(MonoBehaviour),"ReliefTerrain");
		if (t != null) terrain1.rtp_script = terrain1.terrain.gameObject.AddComponent(t);
	}
	#endif
}

function center_terrain_position(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	preterrain1.terrain.transform.position = Vector3(-preterrain1.terrain.terrainData.size.x/2,0,-preterrain1.terrain.terrainData.size.z/2);
}

function check_terrains_square(): boolean
{
	var tiles_length: float = terrains.Count;
	var tile_size: float = Mathf.Round(Mathf.Sqrt(tiles_length));
	
	if (tile_size != Mathf.Sqrt(tiles_length))
	{
		return false;
	}
	return true;
}

function FitTerrainTiles(preterrain1: terrain_class,refit: boolean): int
{
	var size: Vector3 = preterrain1.size;
	var tiles: Vector2 = preterrain1.tiles;
	var startPos: Vector3 = new Vector3(-((size.x*tiles.x)/2),0,-((size.z*tiles.y)/2));
	var pos: Vector3;
	
	set_all_terrain_settings(preterrain1,"(siz)");
	
	
	
	if (refit) {
		for (var i: int = 0;i < terrains.Count;++i) {
			pos = startPos+new Vector3(terrains[i].tile_x*size.x,0,terrains[i].tile_z*size.z);
			terrains[i].color_terrain = Color(0.5,1,0.5);
			if (terrains[i].terrain != null) {
				terrains[i].terrain.transform.position = pos;
			}
		}
	}
	
	tile_resolution = tiles.x*size.x;
	terrains[0].SetAllNeighbors(terrains);
	set_neighbor2(1);
	return 1;
}

function fit_terrain_tiles(preterrain1: terrain_class,refit: boolean): int
{
	if (terrains.Count < 2){center_terrain_position(terrains[0]);return 1;}
	
	if (!check_terrains_assigned()){return -2;}
	
	var size: Vector3 = preterrain1.size;
	
	var tiles_length: float = terrains.Count;
	var tile_size: float = Mathf.Round(Mathf.Sqrt(tiles_length));
	
	if (tile_size != Mathf.Sqrt(tiles_length))
	{
		reset_terrains_tiles(this);
		return -3;
	}
		
	set_all_terrain_settings(preterrain1,"(siz)");
	
	for (var count_x: float = 0;count_x < tile_size;++count_x)
	{
		for (var count_y: float = 0;count_y < tile_size;++count_y)
		{
			var index: float = (count_x*tile_size)+count_y;
			if (index < terrains.Count)
			{
				var pos: Vector3;
				var pos_tile: Vector3;
				if (tile_size == 2)
				{
					pos_tile.z = (tile_size-count_y-2);
					pos.z = pos_tile.z*size.z;
					
					pos_tile.x = (-tile_size+count_x+1);
					pos.x = pos_tile.x*size.x;
					pos.y = 0;
				}
				else 
				{	
					pos_tile.z = ((tile_size-(count_y*2)-2)/2);
					pos.z = pos_tile.z*size.z;
					pos_tile.x = ((-tile_size+(count_x*2))/2);
					pos.x = pos_tile.x*size.x;
					pos.y = 0;
				}
				
				if (refit){terrains[index].terrain.transform.position = pos;}
				terrains[index].tile_x = count_x;
				terrains[index].tile_z = (tile_size-count_y-1);
				terrains[index].tiles.x = tile_size;
				terrains[index].tiles.y = tile_size;
				terrains[index].color_terrain = Color(0.5,1,0.5);
			}
		}
	}
	// set_basemap_max();
	tile_resolution = tile_size*size.x;
	terrains[0].SetAllNeighbors(terrains);
	set_neighbor2(1);
	
	return 1;
}

function set_neighbor2(mode: int)
{
	var script_neighbor: TerrainNeighbors;
	var terrain_number: int;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			script_neighbor = terrains[count_terrain].terrain.GetComponent(TerrainNeighbors);
				
			if (mode == 1)
			{
				if (!script_neighbor){script_neighbor = terrains[count_terrain].terrain.gameObject.AddComponent(TerrainNeighbors);}
				
				script_neighbor.left = null;
				script_neighbor.top = null;
				script_neighbor.right = null;
				script_neighbor.bottom = null;
				
				terrain_number = search_tile(terrains[count_terrain].tile_x-1,terrains[count_terrain].tile_z);
				if (terrain_number != -1){script_neighbor.left = terrains[terrain_number].terrain;}
				terrain_number = search_tile(terrains[count_terrain].tile_x,terrains[count_terrain].tile_z+1);
				if (terrain_number != -1){script_neighbor.top = terrains[terrain_number].terrain;}
				terrain_number = search_tile(terrains[count_terrain].tile_x+1,terrains[count_terrain].tile_z);
				if (terrain_number != -1){script_neighbor.right = terrains[terrain_number].terrain;}
				terrain_number = search_tile(terrains[count_terrain].tile_x,terrains[count_terrain].tile_z-1);
				if (terrain_number != -1){script_neighbor.bottom = terrains[terrain_number].terrain;}
			}
			if (mode == -1)
			{
				if (script_neighbor)
				{
					DestroyImmediate(script_neighbor);
				}
			}
		}
	}
}



function set_detail_script(mode: int)
{
	var script_detail: TerrainDetail;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			script_detail = terrains[count_terrain].terrain.GetComponent(TerrainDetail);
			
			if (mode == 1)
			{	
				if (!script_detail){script_detail = terrains[count_terrain].terrain.gameObject.AddComponent(TerrainDetail);}
			}
			if (mode == -1)
			{
				if (script_detail)
				{
					DestroyImmediate(script_detail);
				}
			}
		}
	}
}

function search_tile(tile_x: int,tile_z: int): int
{
	if (tile_x > terrains[0].tiles.x-1 || tile_x < 0){return -1;}
	if (tile_z > terrains[0].tiles.y-1 || tile_z < 0){return -1;}
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].tile_x == tile_x && terrains[count_terrain].tile_z == tile_z){return count_terrain;}
	}
	return -1;
}

function set_all_trees_settings_terrain(preterrain1: terrain_class,tree_number: int)
{
	for (var count_tree: int = 0;count_tree < preterrain1.treePrototypes.Count;++count_tree)
	{
		preterrain1.treePrototypes[count_tree].bendFactor = preterrain1.treePrototypes[tree_number].bendFactor;
	}
	if (preterrain1.color_terrain[0] < 1.5){preterrain1.color_terrain += Color(0.5,1,0.5,0.5);}
}

function set_all_trees_settings_terrains(preterrain1: terrain_class,tree_number: int)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		for (var count_tree: int = 0;count_tree < preterrain1.treePrototypes.Count;++count_tree)
		{
			if (terrains[count_terrain].treePrototypes.Count-1 < count_tree){continue;}
			terrains[count_terrain].treePrototypes[count_tree].bendFactor = preterrain1.treePrototypes[tree_number].bendFactor;
		}
		check_synchronous_terrain_trees(terrains[count_terrain]);
		if (terrains[count_terrain].color_terrain[0] < 1.5){terrains[count_terrain].color_terrain += Color(0.5,1,0.5,0.5);}
	}
}

function set_all_terrain_splat_textures(preterrain1: terrain_class,copy: boolean,flash: boolean)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			if (copy){set_terrain_splat_textures(preterrain1,terrains[count_terrain]);}
				else {set_terrain_splat_textures(terrains[count_terrain],terrains[count_terrain]);}
			get_terrain_splat_textures(terrains[count_terrain]);
			if (flash){if (terrains[count_terrain].color_terrain[0] < 1.5){terrains[count_terrain].color_terrain = Color(0.5,1,0.5);}}
		}
	}
}

function set_all_terrain_color_textures(flash: boolean)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		set_terrain_color_textures(terrains[count_terrain]);
		// check_synchronous_terrain_splat_textures(terrains[count_terrain]);
		if (flash){if (terrains[count_terrain].color_terrain[0] < 1.5){terrains[count_terrain].color_terrain = Color(0.5,1,0.5);}}
	}
}

function set_terrain_color_textures(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	
	if (preterrain1.rtp_script) {
		var t: Type = preterrain1.rtp_script.GetType();
		var info: FieldInfo = t.GetField("globalSettingsHolder");
		var globalSettingsHolder = info.GetValue (preterrain1.rtp_script);
	 	var t2: Type = globalSettingsHolder.GetType(); 
	 	var info2: FieldInfo = t2.GetField("splats");
	 	var info3: FieldInfo = t2.GetField("Bumps");
	 	var info4: FieldInfo = t2.GetField("Heights");
	 	
	 	var splats: Texture2D[] = new Texture2D[preterrain1.splatPrototypes.Count];	
 		var Bumps: Texture2D[] = new Texture2D[preterrain1.splatPrototypes.Count];	
 		var Heights: Texture2D[] = new Texture2D[preterrain1.splatPrototypes.Count];	
 	}
	
	var splatPrototypes: List.<SplatPrototype> = new List.<SplatPrototype>();
	
	for (var count_splat: int = 0;count_splat < settings.color_splatPrototypes.Length;++count_splat)
	{
		splatPrototypes.Add(new SplatPrototype());
		
		if (preterrain1.rtp_script) {	
			if (settings.color_splatPrototypes[count_splat].texture) {
				splats[count_splat] = settings.color_splatPrototypes[count_splat].texture;
				Bumps[count_splat] = null;
				Heights[count_splat] = null;
			}
 		}
 		if (settings.color_splatPrototypes[count_splat].texture)
		{
			splatPrototypes[count_splat].texture = settings.color_splatPrototypes[count_splat].texture;
			splatPrototypes[count_splat].tileSize = settings.color_splatPrototypes[count_splat].tileSize;
			splatPrototypes[count_splat].tileOffset = settings.color_splatPrototypes[count_splat].tileOffset;
		}
	}
	preterrain1.terrain.terrainData.splatPrototypes = splatPrototypes.ToArray();
	
	if (preterrain1.rtp_script) {
		info2.SetValue (globalSettingsHolder,splats);
		info3.SetValue (globalSettingsHolder,Bumps);
		info4.SetValue (globalSettingsHolder,Heights);
	}
}

function set_terrain_splat_textures(preterrain1: terrain_class,preterrain2: terrain_class)
{
	if (!preterrain1.terrain){return;}
	
	if (preterrain1.rtp_script) {
		var t: Type = preterrain1.rtp_script.GetType();
		var info: FieldInfo = t.GetField("globalSettingsHolder");
		var globalSettingsHolder = info.GetValue (preterrain1.rtp_script);
	 	var t2: Type = globalSettingsHolder.GetType(); 
	 	var info2: FieldInfo = t2.GetField("splats");
	 	var info3: FieldInfo = t2.GetField("Bumps");
	 	var info4: FieldInfo = t2.GetField("Heights");
	 	
	 	var splats: Texture2D[] = new Texture2D[preterrain1.splatPrototypes.Count];	
 		var Bumps: Texture2D[] = new Texture2D[preterrain1.splatPrototypes.Count];	
 		var Heights: Texture2D[] = new Texture2D[preterrain1.splatPrototypes.Count];	
 		
 		// Debug.Log(splats.Length);
 		// Debug.Log(Bumps.Length);
 		// Debug.Log(Heights.Length);
 	}
 				
	var splatPrototypes: List.<SplatPrototype> = new List.<SplatPrototype>();
	for (var count_splat: int = 0;count_splat < preterrain1.splatPrototypes.Count;++count_splat)
	{
		if (preterrain1.splatPrototypes[count_splat].texture)
		{
			splatPrototypes.Add(new SplatPrototype());
		
			if (settings.colormap && count_splat == 0)
			{
				splatPrototypes[count_splat].texture = preterrain2.splatPrototypes[count_splat].texture;
				#if !UNITY_3_4 && !UNITY_3_5
				splatPrototypes[count_splat].normalMap = preterrain2.splatPrototypes[count_splat].normalMap;
				#endif
				splatPrototypes[count_splat].tileSize = preterrain2.splatPrototypes[count_splat].tileSize;
				splatPrototypes[count_splat].tileOffset = preterrain2.splatPrototypes[count_splat].tileOffset;
			}
			else
			{
				splatPrototypes[count_splat].texture = preterrain1.splatPrototypes[count_splat].texture;
				#if !UNITY_3_4 && !UNITY_3_5
				splatPrototypes[count_splat].normalMap = preterrain1.splatPrototypes[count_splat].normalMap;
				#endif
				splatPrototypes[count_splat].tileSize = preterrain1.splatPrototypes[count_splat].tileSize;
				splatPrototypes[count_splat].tileOffset = preterrain1.splatPrototypes[count_splat].tileOffset;
			}
		}
		else {
			// Debug.Log("Remove splat");
			preterrain1.splatPrototypes.RemoveAt(count_splat);
			--count_splat;
		}
		if (preterrain1.rtp_script) {	
			splats[count_splat] = preterrain1.splatPrototypes[count_splat].texture;
			Bumps[count_splat] = preterrain1.splatPrototypes[count_splat].normal_texture;
			Heights[count_splat] = preterrain1.splatPrototypes[count_splat].height_texture;
 		}
	}
	
	// Debug.Log("splat count "+splatPrototypes.Count);
	// Debug.Log(preterrain2.terrain.name);
	
	preterrain2.terrain.terrainData.splatPrototypes = splatPrototypes.ToArray();
	// Debug.Log(preterrain2.terrain.terrainData.splatPrototypes.Length);
	if (preterrain1.rtp_script) {
		info2.SetValue (globalSettingsHolder,splats);
		info3.SetValue (globalSettingsHolder,Bumps);
		info4.SetValue (globalSettingsHolder,Heights);
	}
	
	// var methodInfo: MethodInfo = t.GetMethod("RefreshTextures1");
	// var obj: Object[] = new Object[0];
	// methodInfo.Invoke(preterrain1.rtp_script,null);
	if (preterrain1 == masterTerrain) {
		loop_prelayer("(ssc)",0,true);
	}
}

function set_colormap(active: boolean,all_parameters: boolean)
{
	var count_terrain: int = 0;
	
	if (active)
	{
		var tileSize: float;
		for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (all_parameters){terrains[count_terrain].add_splatprototype(0);}
			if (terrains[count_terrain].terrain){tileSize = terrains[count_terrain].terrain.terrainData.size.x;} else {tileSize = terrains[count_terrain].size.x;}
			if (terrains[count_terrain].splatPrototypes.Count > 0) {
				if (all_parameters)
				{
					terrains[count_terrain].splatPrototypes[0].texture = terrains[count_terrain].colormap.texture;
				}
				terrains[count_terrain].colormap.tileSize = Vector2(tileSize,tileSize);
				terrains[count_terrain].splatPrototypes[0].tileSize = terrains[count_terrain].colormap.tileSize;
				terrains[count_terrain].splatPrototypes[0].tileOffset = terrains[count_terrain].colormap.tileOffset;
				if (terrains[count_terrain].splatPrototypes[0].texture)
				{
					set_terrain_splat_textures(terrains[count_terrain],terrains[count_terrain]);
				}
			}
		}
	}
	else
	{
		for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
		{
			if (terrains[count_terrain].splatPrototypes.Count > 0) {
				terrains[count_terrain].colormap.texture = terrains[count_terrain].splatPrototypes[0].texture;
				terrains[count_terrain].erase_splatprototype(0);	
				set_terrain_splat_textures(terrains[count_terrain],terrains[count_terrain]);
			}
		}
	}
	loop_colormap(active);
}

function loop_colormap(active: boolean)
{
	for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
	{
		for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
		{
			if (prelayers[count_prelayer].layer[count_layer].output == layer_output_enum.splat)
			{
				for (var count_splat: int = 0;count_splat < prelayers[count_prelayer].layer[count_layer].splat_output.splat.Count;++count_splat)
				{
					if (prelayers[count_prelayer].layer[count_layer].splat_output.splat[count_splat] == 0)
					{
						if (!active){prelayers[count_prelayer].layer[count_layer].splat_output.splat_value.active[count_splat] = false;}
							else 
							{
								prelayers[count_prelayer].layer[count_layer].splat_output.splat[count_splat] += 1;
								prelayers[count_prelayer].layer[count_layer].splat_output.splat_value.active[count_splat] = true;
							}
					}
					else
					{
						if (!active){prelayers[count_prelayer].layer[count_layer].splat_output.splat[count_splat] -= 1;}
							else {prelayers[count_prelayer].layer[count_layer].splat_output.splat[count_splat] += 1;}
					}
				}
			}
		}
	}
}

function get_all_terrain_splat_textures()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain) {
		get_terrain_splat_textures(terrains[count_terrain]);
		check_synchronous_terrain_textures(terrains[count_terrain]);
	}
}

function get_terrain_splat_textures(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	 
	if (preterrain1.rtp_script) {
		var t: Type = preterrain1.rtp_script.GetType();
	 	var info: FieldInfo = t.GetField("globalSettingsHolder");
	 	var globalSettingsHolder = info.GetValue (preterrain1.rtp_script);
	 	var t2: Type = globalSettingsHolder.GetType(); 
	 	var info2: FieldInfo = t2.GetField("splats");
	 	var splats: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	 	info2 = t2.GetField("Bumps");
	 	var Bumps: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	 	info2 = t2.GetField("Heights");
	 	var Heights: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	}
	
	for (var count_splat: int = 0;count_splat < preterrain1.terrain.terrainData.splatPrototypes.Length;++count_splat)
	{
		if (preterrain1.splatPrototypes.Count-1 < count_splat){preterrain1.splatPrototypes.Add(new splatPrototype_class());}
		
		preterrain1.splatPrototypes[count_splat].tileSize = preterrain1.terrain.terrainData.splatPrototypes[count_splat].tileSize;
		preterrain1.splatPrototypes[count_splat].tileOffset = preterrain1.terrain.terrainData.splatPrototypes[count_splat].tileOffset;
		
		if (!preterrain1.rtp_script) {
			preterrain1.splatPrototypes[count_splat].texture = preterrain1.terrain.terrainData.splatPrototypes[count_splat].texture;
			#if !UNITY_3_4 && !UNITY_3_5
			preterrain1.splatPrototypes[count_splat].normalMap = preterrain1.terrain.terrainData.splatPrototypes[count_splat].normalMap;
			#endif
		}
		else {
			preterrain1.splatPrototypes[count_splat].texture = splats[count_splat];
			preterrain1.splatPrototypes[count_splat].normal_texture = Bumps[count_splat];
			preterrain1.splatPrototypes[count_splat].height_texture = Heights[count_splat];
		}
	}
	
	var delta_splat: int = preterrain1.splatPrototypes.Count - preterrain1.terrain.terrainData.splatPrototypes.Length;
	
	for (count_splat = 0;count_splat < delta_splat;++count_splat)
	{
		preterrain1.splatPrototypes.RemoveAt(preterrain1.splatPrototypes.Count-1);		
	}
}

function check_synchronous_terrains_textures()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		check_synchronous_terrain_textures(terrains[count_terrain]);
	}
}

function check_synchronous_terrain_textures(preterrain1: terrain_class)
{
	// if (color_output){check_synchronous_terrain_color_textures(preterrain1);}
	// else {
		check_synchronous_terrain_splat_textures(preterrain1);
	// }
}

function check_synchronous_terrains_splat_textures()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		check_synchronous_terrain_splat_textures(terrains[count_terrain]);
	}
}

function check_synchronous_terrain_splat_textures(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	
	if (preterrain1.rtp_script) {
		var t: Type = preterrain1.rtp_script.GetType();
	 	var info: FieldInfo = t.GetField("globalSettingsHolder");
	 	var globalSettingsHolder = info.GetValue (preterrain1.rtp_script);
	 	var t2: Type = globalSettingsHolder.GetType(); 
	 	var info2: FieldInfo = t2.GetField("splats");
	 	var splats: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	 	info2 = t2.GetField("Bumps");
	 	var Bumps: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	 	info2 = t2.GetField("Heights");
	 	var Heights: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	}
	
	var synchronous: boolean = true;
	if (preterrain1.splatPrototypes.Count != preterrain1.terrain.terrainData.splatPrototypes.Length){synchronous = false;}
	else
	{
		for (var count_splat: int = 0;count_splat < preterrain1.splatPrototypes.Count;++count_splat)
		{
			if (!preterrain1.rtp_script) {
				if (preterrain1.splatPrototypes[count_splat].texture != preterrain1.terrain.terrainData.splatPrototypes[count_splat].texture){synchronous = false;break;}
				#if !UNITY_3_4 && !UNITY_3_5
				if (preterrain1.splatPrototypes[count_splat].normalMap != preterrain1.terrain.terrainData.splatPrototypes[count_splat].normalMap){synchronous = false;break;}
				#endif
				if (preterrain1.splatPrototypes[count_splat].tileOffset != preterrain1.terrain.terrainData.splatPrototypes[count_splat].tileOffset){synchronous = false;break;}
			} 
			else {
				if (preterrain1.splatPrototypes[count_splat].texture != splats[count_splat]) {synchronous = false;break;}
				if (preterrain1.splatPrototypes[count_splat].normal_texture != Bumps[count_splat]) {synchronous = false;break;}
				if (preterrain1.splatPrototypes[count_splat].height_texture != Heights[count_splat]) {synchronous = false;break;}
			}
		}
	}
	preterrain1.splat_synchronous = synchronous;
}

function check_synchronous_terrains_color_textures()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		check_synchronous_terrain_color_textures(terrains[count_terrain]);
	}
}

function check_synchronous_terrain_color_textures(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	
	if (preterrain1.rtp_script) {
		var t: Type = preterrain1.rtp_script.GetType();
	 	var info: FieldInfo = t.GetField("globalSettingsHolder");
	 	var globalSettingsHolder = info.GetValue (preterrain1.rtp_script);
	 	var t2: Type = globalSettingsHolder.GetType(); 
	 	var info2: FieldInfo = t2.GetField("splats");
	 	var splats: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	 	info2 = t2.GetField("Bumps");
	 	var Bumps: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	 	info2 = t2.GetField("Heights");
	 	var Heights: Texture2D[] = info2.GetValue (globalSettingsHolder) as Texture2D[]; 
	}
	 
	var synchronous: boolean = true;
	if (settings.color_splatPrototypes.Length != preterrain1.terrain.terrainData.splatPrototypes.Length){synchronous = false;}
	else
	{
		for (var count_splat: int = 0;count_splat < settings.color_splatPrototypes.Length;++count_splat)
		{
			if (!preterrain1.rtp_script) {
				if (settings.color_splatPrototypes[count_splat].texture != preterrain1.terrain.terrainData.splatPrototypes[count_splat].texture){synchronous = false;break;}
				if (settings.color_splatPrototypes[count_splat].tileOffset != preterrain1.terrain.terrainData.splatPrototypes[count_splat].tileOffset){synchronous = false;break;}
			}
			else {
				if (settings.color_splatPrototypes[count_splat].texture != splats[count_splat]) {synchronous = false;break;}
			}
		}
	}
	preterrain1.splat_synchronous = synchronous;
}

function check_synchronous_terrain_size(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	var synchronous: boolean = true;
	
	if (preterrain1.size.x != preterrain1.terrain.terrainData.size.x || preterrain1.size.y != preterrain1.terrain.terrainData.size.y || preterrain1.size.z != preterrain1.terrain.terrainData.size.z)
	{
		synchronous = false;
	}
	preterrain1.size_synchronous = synchronous;
}

function check_synchronous_terrain_resolutions(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	var synchronous: boolean = true; 
	
	if (preterrain1.heightmap_resolution != preterrain1.terrain.terrainData.heightmapResolution || preterrain1.splatmap_resolution != preterrain1.terrain.terrainData.alphamapResolution || preterrain1.detail_resolution != preterrain1.terrain.terrainData.detailResolution || preterrain1.basemap_resolution != preterrain1.terrain.terrainData.baseMapResolution)
	{
		synchronous = false;
	}
	preterrain1.resolutions_synchronous = synchronous;
}

function copy_terrain_splat(splatPrototype1: splatPrototype_class,splatPrototype2: splatPrototype_class)
{
	splatPrototype2.texture = splatPrototype1.texture;
	splatPrototype2.tileSize_old = splatPrototype1.tileSize_old;
	splatPrototype2.tileOffset = splatPrototype1.tileOffset;
	splatPrototype2.normal_texture = splatPrototype1.normal_texture;
	splatPrototype2.normal_tileSize = splatPrototype1.normal_tileSize;
	splatPrototype2.height_texture = splatPrototype1.height_texture;
	
}

function copy_terrain_splats(preterrain1: terrain_class,preterrain2: terrain_class)
{
	for (var count_splat: int = 0;count_splat < preterrain1.splatPrototypes.Count;++count_splat)
	{
		if (preterrain2.splatPrototypes.Count < preterrain1.splatPrototypes.Count){preterrain2.splatPrototypes.Add(new splatPrototype_class());}
		copy_terrain_splat(preterrain1.splatPrototypes[count_splat],preterrain2.splatPrototypes[count_splat]);
	}
}

function swap_terrain_splat(preterrain1: terrain_class,splat_number1: int,splat_number2: int)
{
	if (splat_number2 > -1 && splat_number2 < preterrain1.splatPrototypes.Count)
	{
		var splatPrototype2: splatPrototype_class = preterrain1.splatPrototypes[splat_number1];
		
		preterrain1.splatPrototypes[splat_number1] = preterrain1.splatPrototypes[splat_number2];
		preterrain1.splatPrototypes[splat_number2] = splatPrototype2;
	}
}

function set_all_terrain_trees(preterrain1: terrain_class)
{
	set_terrain_trees(preterrain1);
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			terrains[count_terrain].terrain.terrainData.treePrototypes = preterrain1.terrain.terrainData.treePrototypes;
			get_terrain_trees(terrains[count_terrain]);
			terrains[count_terrain].color_terrain = Color(0.5,1,0.5);
			check_synchronous_terrain_trees(terrains[count_terrain]);
		}
	}
}

function set_terrain_trees(preterrain1: terrain_class)
{
	var treePrototypes: List.<TreePrototype> = new List.<TreePrototype>();
	for (var count_tree: int = 0;count_tree < preterrain1.treePrototypes.Count;++count_tree)
	{
		if (preterrain1.treePrototypes[count_tree].prefab)
		{
			treePrototypes.Add(new TreePrototype());
			treePrototypes[count_tree].prefab = preterrain1.treePrototypes[count_tree].prefab;
			treePrototypes[count_tree].bendFactor = preterrain1.treePrototypes[count_tree].bendFactor;
		}
	}
	preterrain1.terrain.terrainData.treePrototypes = treePrototypes.ToArray();
}

function get_all_terrain_trees()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain) {
		get_terrain_trees(terrains[count_terrain]);
		check_synchronous_terrain_trees(terrains[count_terrain]);
	}
}

function get_terrain_trees(preterrain1: terrain_class)
{
	preterrain1.treePrototypes.Clear();
	for (var count_tree: int = 0;count_tree < preterrain1.terrain.terrainData.treePrototypes.Length;++count_tree)
	{
		preterrain1.treePrototypes.Add(new treePrototype_class());
		preterrain1.treePrototypes[count_tree].prefab = preterrain1.terrain.terrainData.treePrototypes[count_tree].prefab;
		preterrain1.treePrototypes[count_tree].bendFactor = preterrain1.terrain.terrainData.treePrototypes[count_tree].bendFactor;
	}
}

function check_synchronous_terrain_trees(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	var synchronous: boolean = true;
	
	if (preterrain1.treePrototypes.Count != preterrain1.terrain.terrainData.treePrototypes.Length){synchronous = false;}
	else
	{
		for (var count_tree: int = 0;count_tree < preterrain1.treePrototypes.Count;++count_tree)
		{
			if (preterrain1.treePrototypes[count_tree].prefab != preterrain1.terrain.terrainData.treePrototypes[count_tree].prefab){synchronous = false;break;}
			if (preterrain1.treePrototypes[count_tree].bendFactor != preterrain1.terrain.terrainData.treePrototypes[count_tree].bendFactor){synchronous = false;break;}
		}
	}
	preterrain1.tree_synchronous = synchronous;
}

function copy_terrain_tree(treePrototype1: treePrototype_class,treePrototype2: treePrototype_class)
{
	treePrototype2.prefab = treePrototype1.prefab;
	treePrototype2.bendFactor = treePrototype1.bendFactor;
} 

function copy_terrain_trees(preterrain1: terrain_class,preterrain2: terrain_class)
{
	for (var count_tree: int = 0;count_tree < preterrain1.treePrototypes.Count;++count_tree)
	{
		if (preterrain2.treePrototypes.Count < preterrain1.treePrototypes.Count){preterrain2.treePrototypes.Add(treePrototype_class());}
		copy_terrain_tree(preterrain1.treePrototypes[count_tree],preterrain2.treePrototypes[count_tree]);
	}
}

function swap_terrain_tree(preterrain1: terrain_class,tree_number1: int, tree_number2: int)
{
	if (tree_number2 > -1 && tree_number2 < preterrain1.treePrototypes.Count)
	{
		var treePrototype2: treePrototype_class = preterrain1.treePrototypes[tree_number1];
		
		preterrain1.treePrototypes[tree_number1] = preterrain1.treePrototypes[tree_number2];
		preterrain1.treePrototypes[tree_number2] = treePrototype2;
	}
}

function set_terrain_details(preterrain1: terrain_class)
{
	var detailPrototypes: List.<DetailPrototype> = new List.<DetailPrototype>();
	for (var count_detail: int = 0;count_detail < preterrain1.detailPrototypes.Count;++count_detail)
	{
		if (preterrain1.detailPrototypes[count_detail].prototype || preterrain1.detailPrototypes[count_detail].prototypeTexture)
		{
			detailPrototypes.Add(new DetailPrototype());
			detailPrototypes[count_detail].renderMode = preterrain1.detailPrototypes[count_detail].renderMode;
			if (preterrain1.detailPrototypes[count_detail].usePrototypeMesh) {
				detailPrototypes[count_detail].usePrototypeMesh = true;
				detailPrototypes[count_detail].prototype = preterrain1.detailPrototypes[count_detail].prototype;
				detailPrototypes[count_detail].minWidth = -1;
				detailPrototypes[count_detail].maxWidth = preterrain1.detailPrototypes[count_detail].maxWidth+1;
				detailPrototypes[count_detail].minHeight = -1;
				detailPrototypes[count_detail].maxHeight = preterrain1.detailPrototypes[count_detail].maxHeight+1;
			} 
			else {
				detailPrototypes[count_detail].prototypeTexture = preterrain1.detailPrototypes[count_detail].prototypeTexture;
				detailPrototypes[count_detail].minWidth = preterrain1.detailPrototypes[count_detail].minWidth;
				detailPrototypes[count_detail].maxWidth = preterrain1.detailPrototypes[count_detail].maxWidth;
				detailPrototypes[count_detail].minHeight = preterrain1.detailPrototypes[count_detail].minHeight;
				detailPrototypes[count_detail].maxHeight = preterrain1.detailPrototypes[count_detail].maxHeight;
			}
			detailPrototypes[count_detail].noiseSpread = preterrain1.detailPrototypes[count_detail].noiseSpread;
			detailPrototypes[count_detail].healthyColor = preterrain1.detailPrototypes[count_detail].healthyColor;
			detailPrototypes[count_detail].dryColor = preterrain1.detailPrototypes[count_detail].dryColor;
			detailPrototypes[count_detail].bendFactor = preterrain1.detailPrototypes[count_detail].bendFactor;
		}
	}
	preterrain1.terrain.terrainData.detailPrototypes = detailPrototypes.ToArray();
	preterrain1.detail_scale = 1;
}

function copy_terrain_detail(detailPrototype1: detailPrototype_class,detailPrototype2: detailPrototype_class)
{
	detailPrototype2.prototype = detailPrototype1.prototype;
	detailPrototype2.prototypeTexture = detailPrototype1.prototypeTexture;
	detailPrototype2.minWidth = detailPrototype1.minWidth;
	detailPrototype2.maxWidth = detailPrototype1.maxWidth;
	detailPrototype2.minHeight = detailPrototype1.minHeight;
	detailPrototype2.maxHeight = detailPrototype1.maxHeight;
	detailPrototype2.noiseSpread = detailPrototype1.noiseSpread;
	detailPrototype2.healthyColor = detailPrototype1.healthyColor;
	detailPrototype2.dryColor = detailPrototype1.dryColor;
	detailPrototype2.renderMode = detailPrototype1.renderMode;
	detailPrototype2.bendFactor = detailPrototype1.bendFactor;
}

function copy_terrain_details(preterrain1: terrain_class,preterrain2: terrain_class)
{
	for (var count_detail: int = 0;count_detail < preterrain1.detailPrototypes.Count;++count_detail)
	{
		if (preterrain2.detailPrototypes.Count < preterrain1.detailPrototypes.Count){preterrain2.detailPrototypes.Add(detailPrototype_class());}
		copy_terrain_detail(preterrain1.detailPrototypes[count_detail],preterrain2.detailPrototypes[count_detail]);
	}
}

function swap_terrain_detail(preterrain1: terrain_class,detail_number1: int,detail_number2: int)
{
	if (detail_number2 > -1 && detail_number2 < preterrain1.detailPrototypes.Count)
	{
		var detailPrototype2: detailPrototype_class = preterrain1.detailPrototypes[detail_number1];
		
		preterrain1.detailPrototypes[detail_number1] = preterrain1.detailPrototypes[detail_number2];
		preterrain1.detailPrototypes[detail_number2] = detailPrototype2;
	} 
}

function get_all_terrain_details()
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain) {
		get_terrain_details(terrains[count_terrain]);
		check_synchronous_terrain_detail(terrains[count_terrain]);
	}
}

function get_terrain_details(preterrain1: terrain_class)
{
	for (var count_detail: int = 0;count_detail < preterrain1.terrain.terrainData.detailPrototypes.Length;++count_detail)
	{
		if (preterrain1.detailPrototypes.Count < preterrain1.terrain.terrainData.detailPrototypes.Length){preterrain1.detailPrototypes.Add(new detailPrototype_class());}
		else if (preterrain1.detailPrototypes.Count > preterrain1.terrain.terrainData.detailPrototypes.Length)
		{
			preterrain1.detailPrototypes.RemoveAt(count_detail);
		}
		if (preterrain1.detailPrototypes[count_detail].usePrototypeMesh) {
			preterrain1.detailPrototypes[count_detail].prototype = preterrain1.terrain.terrainData.detailPrototypes[count_detail].prototype;
			preterrain1.detailPrototypes[count_detail].minWidth = preterrain1.terrain.terrainData.detailPrototypes[count_detail].minWidth;
			preterrain1.detailPrototypes[count_detail].maxWidth = preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxWidth-1;
			preterrain1.detailPrototypes[count_detail].minHeight = preterrain1.terrain.terrainData.detailPrototypes[count_detail].minHeight;
			preterrain1.detailPrototypes[count_detail].maxHeight = preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxHeight-1;
		}
		else {
			preterrain1.detailPrototypes[count_detail].prototypeTexture = preterrain1.terrain.terrainData.detailPrototypes[count_detail].prototypeTexture;
			preterrain1.detailPrototypes[count_detail].minWidth = preterrain1.terrain.terrainData.detailPrototypes[count_detail].minWidth;
			preterrain1.detailPrototypes[count_detail].maxWidth = preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxWidth;
			preterrain1.detailPrototypes[count_detail].minHeight = preterrain1.terrain.terrainData.detailPrototypes[count_detail].minHeight;
			preterrain1.detailPrototypes[count_detail].maxHeight = preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxHeight;
		}
		preterrain1.detailPrototypes[count_detail].noiseSpread = preterrain1.terrain.terrainData.detailPrototypes[count_detail].noiseSpread;
		preterrain1.detailPrototypes[count_detail].healthyColor = preterrain1.terrain.terrainData.detailPrototypes[count_detail].healthyColor;
		preterrain1.detailPrototypes[count_detail].dryColor = preterrain1.terrain.terrainData.detailPrototypes[count_detail].dryColor;
		preterrain1.detailPrototypes[count_detail].renderMode = preterrain1.terrain.terrainData.detailPrototypes[count_detail].renderMode;
		preterrain1.detailPrototypes[count_detail].bendFactor = preterrain1.terrain.terrainData.detailPrototypes[count_detail].bendFactor;
	}
	if (preterrain1.terrain.terrainData.detailPrototypes.Length == 0){preterrain1.detailPrototypes.Clear();}
}

function check_synchronous_terrain_detail(preterrain1: terrain_class)
{
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	var synchronous: boolean = true;
	
	if (preterrain1.detailPrototypes.Count != preterrain1.terrain.terrainData.detailPrototypes.Length){synchronous = false;}
	else
	{
		for (var count_detail: int = 0;count_detail < preterrain1.detailPrototypes.Count;++count_detail)
		{
			if (preterrain1.detailPrototypes[count_detail].usePrototypeMesh) {
				if (preterrain1.detailPrototypes[count_detail].prototype != preterrain1.terrain.terrainData.detailPrototypes[count_detail].prototype){synchronous = false;break;}
				if (preterrain1.detailPrototypes[count_detail].maxWidth != preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxWidth-1){synchronous = false;break;}
				if (preterrain1.detailPrototypes[count_detail].maxHeight != preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxHeight-1){synchronous = false;break;}
			}
			else {
				if (preterrain1.detailPrototypes[count_detail].prototypeTexture != preterrain1.terrain.terrainData.detailPrototypes[count_detail].prototypeTexture){synchronous = false;break;}
				if (preterrain1.detailPrototypes[count_detail].minWidth != preterrain1.terrain.terrainData.detailPrototypes[count_detail].minWidth){synchronous = false;break;}
				if (preterrain1.detailPrototypes[count_detail].maxWidth != preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxWidth){synchronous = false;break;}
				if (preterrain1.detailPrototypes[count_detail].minHeight != preterrain1.terrain.terrainData.detailPrototypes[count_detail].minHeight){synchronous = false;break;}
				if (preterrain1.detailPrototypes[count_detail].maxHeight != preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxHeight){synchronous = false;break;}
			}
			if (preterrain1.detailPrototypes[count_detail].noiseSpread != preterrain1.terrain.terrainData.detailPrototypes[count_detail].noiseSpread){synchronous = false;break;}
			if (preterrain1.detailPrototypes[count_detail].healthyColor != preterrain1.terrain.terrainData.detailPrototypes[count_detail].healthyColor){synchronous = false;break;}
			if (preterrain1.detailPrototypes[count_detail].dryColor != preterrain1.terrain.terrainData.detailPrototypes[count_detail].dryColor){synchronous = false;break;}
			if (preterrain1.detailPrototypes[count_detail].renderMode != preterrain1.terrain.terrainData.detailPrototypes[count_detail].renderMode){synchronous = false;break;}
			if (preterrain1.detailPrototypes[count_detail].bendFactor != preterrain1.terrain.terrainData.detailPrototypes[count_detail].bendFactor){synchronous = false;break;}
		}
	}
	preterrain1.detail_synchronous = synchronous;
}

function change_terrain_detail_scale(preterrain1: terrain_class)
{
	if (preterrain1.terrain.terrainData.detailPrototypes.Length < preterrain1.detailPrototypes.Count){return;}
	for (var count_detail: int = 0;count_detail < preterrain1.detailPrototypes.Count;++count_detail)
	{
		preterrain1.detailPrototypes[count_detail].minWidth = preterrain1.terrain.terrainData.detailPrototypes[count_detail].minWidth*preterrain1.detail_scale;
		preterrain1.detailPrototypes[count_detail].maxWidth = preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxWidth*preterrain1.detail_scale;
		preterrain1.detailPrototypes[count_detail].minHeight = preterrain1.terrain.terrainData.detailPrototypes[count_detail].minHeight*preterrain1.detail_scale;
		preterrain1.detailPrototypes[count_detail].maxHeight = preterrain1.terrain.terrainData.detailPrototypes[count_detail].maxHeight*preterrain1.detail_scale;
	}
}

function set_all_terrain_details(preterrain1: terrain_class)
{
	set_terrain_details(preterrain1);
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			terrains[count_terrain].terrain.terrainData.detailPrototypes = preterrain1.terrain.terrainData.detailPrototypes;
			get_terrain_details(terrains[count_terrain]);
			terrains[count_terrain].color_terrain = Color(0.5,1,0.5);
			check_synchronous_terrain_detail(terrains[count_terrain]);
		}
	}
}

function convert_float_to_color(value_float: float): Color
{
	var bytes: byte[] = new byte[4]; 
    var color: Color;
    var value_temp: float;
        		    		    		    		
    bytes = BitConverter.GetBytes(value_float); 
        		
    value_temp = bytes[0]; 
    color[0] = value_temp/255;
    value_temp = bytes[1];
    color[1] = value_temp/255;
    value_temp = bytes[2];
    color[2] = value_temp/255;
    value_temp = bytes[3];
    color[3] = value_temp/255;
   	
    return color;     		
}

function convert_color_to_float(color: Color): float
{	
	var bytes: byte[] = new byte[4]; 
	
	bytes[0] = color[0]*255;
    bytes[1] = color[1]*255;
    bytes[2] = color[2]*255;
    bytes[3] = color[3]*255;
	
	var value_float: float = BitConverter.ToSingle(bytes,0);

	return value_float;
}

function get_scale_from_image(image: Texture2D): float
{
	var color: Color;
	var color2: Color;
	var value_float: float;
	
	color2 = image.GetPixel(0,0);
	color[0] = color2[3];
	color2 = image.GetPixel(1,0);
	color[1] = color2[3];
	color2 = image.GetPixel(2,0);
	color[2] = color2[3];
	color2 = image.GetPixel(3,0);
	color[3] = color2[3];
	
	value_float = convert_color_to_float(color);
	
	return value_float;
}

function calc_rotation_pixel(x: float,y: float,xx: float, yy: float,rotation: float): Vector2
{
	var dx: float = x-xx;
	var dy: float = y-yy;
	var length: float = Mathf.Sqrt((dx*dx)+(dy*dy));
	
	if (length != 0)
	{
		dx = dx / length;
		dy = dy / length;
	}
	
	
	var rad: float = Mathf.Acos(dx);
	
	if (dy < 0){rad = (Mathf.PI*2)-rad;}
	
	rad -= (rotation*Mathf.Deg2Rad);
	
	dx = Mathf.Cos(rad)*length;
	dy = Mathf.Sin(rad)*length;
	
	var pos: Vector2;
	pos.x = dx+xx;
	pos.y = dy+yy;
	return pos;
}

function copy_prelayer(prelayer1: prelayer_class,copy_filter): prelayer_class
{
	var prelayer2: prelayer_class;
	
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
	
	script3.prelayer = prelayer1;
	
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	prelayer2 = script3.prelayer;
	DestroyImmediate(object2);
	
	if (copy_filter)
	{
		for (var count_layer: int = 0;count_layer < prelayer1.layer.Count;++count_layer)
		{
			prelayer2.layer[count_layer].prefilter = copy_prefilter(prelayer1.layer[count_layer].prefilter);
		}
	}
	
	return prelayer2;
}

function copy_layergroup(prelayer1: prelayer_class,description_number: int,copy_filter: boolean): prelayer_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
	var prelayer2: prelayer_class;
	
	script3.prelayer = new prelayer_class(0,0);
	
	for (var count_layer: int = 0;count_layer < prelayer1.predescription.description[description_number].layer_index.Count;++count_layer)
	{
		script3.prelayer.layer.Insert(count_layer,new layer_class());
		script3.prelayer.layer[count_layer] = copy_layer(prelayer1.layer[prelayer1.predescription.description[description_number].layer_index[count_layer]],false,false);
	}
	
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	prelayer2 = script3.prelayer;
	DestroyImmediate(object2);
	
	if (copy_filter)
	{
		for (count_layer = 0;count_layer < prelayer1.layer.Count;++count_layer)
		{
			prelayer2.layer[count_layer].prefilter = copy_prefilter(prelayer1.layer[count_layer].prefilter);
			for (var count_tree: int = 0;count_tree < prelayer1.layer[count_layer].tree_output.tree.Count;++count_tree)
			{
				prelayer2.layer[count_layer].tree_output.tree[count_tree].prefilter = copy_prefilter(prelayer1.layer[count_layer].tree_output.tree[count_tree].prefilter);
			}
		}
	}
	return prelayer2;
}

function copy_layer(layer: layer_class,copy_filter: boolean,loop: boolean): layer_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
	
	script3.layer = layer;
	
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	layer = script3.layer;
	DestroyImmediate(object2);
	
	if (copy_filter)
	{
		script3.layer.prefilter = copy_prefilter(layer.prefilter);
		for (var count_tree: int = 0;count_tree < layer.tree_output.tree.Count;++count_tree)
		{
			script3.layer.tree_output.tree[count_tree].prefilter = copy_prefilter(layer.tree_output.tree[count_tree].prefilter);
		}
	}
	
	layer.text_placed = String.Empty;
	
	if (loop){loop_layer(layer,1);}
	layer.swap_text = "S";
	layer.swap_select = false;
	layer.copy_select = false;
	layer.color_layer = Color(2,2,2,1);
	return layer;
} 

function save_loop_layer(prelayer_number: int,layer_number: int,prelayer_number_save: int,layer_number_save: int,script3: save_template)
{
	script3.prelayers[prelayer_number_save].layer[layer_number_save].swap_text = "S";
	script3.prelayers[prelayer_number_save].layer[layer_number_save].swap_select = false;
	script3.prelayers[prelayer_number_save].layer[layer_number_save].copy_select = false;
		
	for (var count_filter: int = 0;count_filter < prelayers[prelayer_number].layer[layer_number].prefilter.filter_index.Count;++count_filter)
	{
		script3.filters.Add(copy_filter(filter[prelayers[prelayer_number].layer[layer_number].prefilter.filter_index[count_filter]],false));
		script3.prelayers[prelayer_number_save].layer[layer_number_save].prefilter.filter_index[count_filter] = script3.filters.Count-1;
		
		for (var count_subfilter: int = 0;count_subfilter < filter[prelayers[prelayer_number].layer[layer_number].prefilter.filter_index[count_filter]].presubfilter.subfilter_index.Count;++count_subfilter)
		{
			script3.subfilters.Add(copy_subfilter(subfilter[filter[prelayers[prelayer_number].layer[layer_number].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]]));
			script3.filters[script3.filters.Count-1].presubfilter.subfilter_index[count_subfilter] = script3.subfilters.Count-1;	
		}
	}
	for (var count_tree: int = 0;count_tree < prelayers[prelayer_number].layer[layer_number].tree_output.tree.Count;++count_tree)
	{
		for (count_filter = 0;count_filter < prelayers[prelayer_number].layer[layer_number].tree_output.tree[count_tree].prefilter.filter_index.Count;++count_filter)
		{
			script3.filters.Add(copy_filter(filter[prelayers[prelayer_number].layer[layer_number].tree_output.tree[count_tree].prefilter.filter_index[count_filter]],false));
			script3.prelayers[prelayer_number_save].layer[layer_number_save].tree_output.tree[count_tree].prefilter.filter_index[count_filter] = script3.filters.Count-1;
			
			for (count_subfilter = 0;count_subfilter < filter[prelayers[prelayer_number].layer[layer_number].tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index.Count;++count_subfilter)
			{
				script3.subfilters.Add(copy_subfilter(subfilter[filter[prelayers[prelayer_number].layer[layer_number].tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]]));
				script3.filters[script3.filters.Count-1].presubfilter.subfilter_index[count_subfilter] = script3.subfilters.Count-1;			
			}
		}
	}
	
	for (var count_object: int = 0;count_object < prelayers[prelayer_number].layer[layer_number].object_output.object.Count;++count_object)
	{
		if (prelayers[prelayer_number].layer[layer_number].object_output.object[count_object].prelayer_created)
		{
			script3.prelayers.Add(copy_prelayer(prelayers[prelayers[prelayer_number].layer[layer_number].object_output.object[count_object].prelayer_index],false));
			script3.prelayers[prelayer_number_save].layer[layer_number_save].object_output.object[count_object].prelayer_index = script3.prelayers.Count-1;
			
			for (var count_layer: int = 0;count_layer < prelayers[prelayers[prelayer_number].layer[layer_number].object_output.object[count_object].prelayer_index].layer.Count;++count_layer)
			{
				save_loop_layer(prelayers[prelayer_number].layer[layer_number].object_output.object[count_object].prelayer_index,count_layer,prelayer_number_save+1,count_layer,script3);
			}
		}
	}
}

function load_loop_layer(prelayer_number: int,layer_number: int,prelayer_number_load: int,layer_number_load: int,script3: save_template)
{
	for (var count_filter: int = 0;count_filter < script3.prelayers[prelayer_number_load].layer[layer_number_load].prefilter.filter_index.Count;++count_filter)
	{
		filter.Add(copy_filter(script3.filters[script3.prelayers[prelayer_number_load].layer[layer_number_load].prefilter.filter_index[count_filter]],false));
		prelayers[prelayer_number].layer[layer_number].prefilter.filter_index[count_filter] = filter.Count-1;
		
		for (var count_subfilter: int = 0;count_subfilter < filter[filter.Count-1].presubfilter.subfilter_index.Count;++count_subfilter)
		{
			subfilter.Add(copy_subfilter(script3.subfilters[filter[filter.Count-1].presubfilter.subfilter_index[count_subfilter]]));
			filter[filter.Count-1].presubfilter.subfilter_index[count_subfilter] = subfilter.Count-1;
		}
	}
	for (var count_tree: int = 0;count_tree < script3.prelayers[prelayer_number_load].layer[layer_number_load].tree_output.tree.Count;++count_tree)
	{
		for (count_filter = 0;count_filter < script3.prelayers[prelayer_number_load].layer[layer_number_load].tree_output.tree[count_tree].prefilter.filter_index.Count;++count_filter)
		{
			filter.Add(copy_filter(script3.filters[script3.prelayers[prelayer_number_load].layer[layer_number_load].tree_output.tree[count_tree].prefilter.filter_index[count_filter]],false));
			prelayers[prelayer_number].layer[layer_number].tree_output.tree[count_tree].prefilter.filter_index[count_filter] = filter.Count-1;
			
			for (count_subfilter = 0;count_subfilter < filter[filter.Count-1].presubfilter.subfilter_index.Count;++count_subfilter)
			{
				subfilter.Add(copy_subfilter(script3.subfilters[filter[filter.Count-1].presubfilter.subfilter_index[count_subfilter]]));
				filter[filter.Count-1].presubfilter.subfilter_index[count_subfilter] = subfilter.Count-1;
			}
		}
	}
	
	for (var count_object: int = 0;count_object < script3.prelayers[prelayer_number_load].layer[layer_number_load].object_output.object.Count;++count_object)
	{
		if (script3.prelayers[prelayer_number_load].layer[layer_number_load].object_output.object[count_object].prelayer_created)
		{
			prelayers.Add(copy_prelayer(script3.prelayers[script3.prelayers[prelayer_number_load].layer[layer_number_load].object_output.object[count_object].prelayer_index],false));
			prelayers[prelayer_number].layer[layer_number].object_output.object[count_object].prelayer_index = prelayers.Count-1;
			
			for (var count_layer: int = 0;count_layer < script3.prelayers[script3.prelayers[prelayer_number_load].layer[layer_number_load].object_output.object[count_object].prelayer_index].layer.Count;++count_layer)
			{
				load_loop_layer(prelayers.Count-1,count_layer,script3.prelayers[prelayer_number_load].layer[layer_number_load].object_output.object[count_object].prelayer_index,count_layer,script3);
			}
		}
	}
}

function copy_description(prelayer1: prelayer_class,description_number: int,target_prelayer: prelayer_class,target_description_number: int)
{
	target_prelayer.predescription.description[target_description_number].text = prelayer1.predescription.description[description_number].text+"#";
	target_prelayer.predescription.description[target_description_number].edit = prelayer1.predescription.description[description_number].edit;
	target_prelayer.predescription.description[target_description_number].layers_active = prelayer1.predescription.description[description_number].layers_active;
	
	var layer_position: int = get_layer_position(0,target_description_number,target_prelayer);
	var length: int = prelayer1.predescription.description[description_number].layer_index.Count;
	
	for (var count_layer: int = 0;count_layer < length;++count_layer)
	{
		add_layer(target_prelayer,layer_position,layer_output_enum.color,target_description_number,0,false,false,false);
	        
	    target_prelayer.layer[layer_position] = copy_layer(prelayer1.layer[prelayer1.predescription.description[description_number].layer_index[length-1-count_layer]],true,true);
	}
	count_layers();
}

function copy_prefilter(prefilter: prefilter_class): prefilter_class
{
	var prefilter2: prefilter_class = new prefilter_class();
	
	for (var count_filter: int = 0;count_filter < prefilter.filter_index.Count;++count_filter)
	{
		filter.Add(copy_filter(filter[prefilter.filter_index[count_filter]],true));
		prefilter2.filter_index.Add(filter.Count-1);
	}
	prefilter2.set_filter_text();
	
	return prefilter2;
}

function copy_filter(filter: filter_class,copy_subfilter: boolean): filter_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
	
	script3.filter = filter;
	
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	filter = script3.filter;
	DestroyImmediate(object2);
	
	if (copy_subfilter)
	{
		for (var count_subfilter: int;count_subfilter < filter.presubfilter.subfilter_index.Count;++count_subfilter)
		{
			subfilter.Add(copy_subfilter(subfilter[filter.presubfilter.subfilter_index[count_subfilter]]));
			filter.presubfilter.subfilter_index[count_subfilter] = subfilter.Count-1;
		}
	}
	
	for (var count_color_range: int = 0;count_color_range < filter.preimage.precolor_range.color_range.Count;++count_color_range)
	{
		filter.preimage.precolor_range.color_range[count_color_range].swap_text = "S";
		filter.preimage.precolor_range.color_range[count_color_range].swap_select = false;
		filter.preimage.precolor_range.color_range[count_color_range].copy_select = false;
	}
	
	filter.swap_text = "S";
	filter.swap_select = false;
	filter.copy_select = false;
	filter.prerandom_curve.curve_text = "Curve";
	filter.precurve_x_left.curve_text = "Curve";
	filter.precurve_x_right.curve_text = "Curve";
	filter.precurve_z_left.curve_text = "Curve";
	filter.precurve_z_right.curve_text = "Curve";
	filter.color_filter = Color(2,2,2,1);
	return filter;
}

function copy_subfilter(subfilter: subfilter_class): subfilter_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
	
	script3.subfilter = subfilter;
	
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	subfilter = script3.subfilter;
	DestroyImmediate(object2);
	subfilter.swap_text = "S";
	subfilter.swap_select = false;
	subfilter.copy_select = false;
	
	for (var count_color_range: int = 0;count_color_range < subfilter.preimage.precolor_range.color_range.Count;++count_color_range)
	{
		subfilter.preimage.precolor_range.color_range[count_color_range].swap_text = "S";
		subfilter.preimage.precolor_range.color_range[count_color_range].swap_select = false;
		subfilter.preimage.precolor_range.color_range[count_color_range].copy_select = false;
	}
	subfilter.color_subfilter = Color(2,2,2,1);
	return subfilter;
}

function copy_terrain(preterrain1: terrain_class): terrain_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
		
	script3.preterrain = preterrain1;
		
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	preterrain1 = script3.preterrain;
	DestroyImmediate(object2);
	
	return preterrain1;
}

function copy_splat_custom(custom_splat1: splat_custom_class): splat_custom_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
		
	script3.splat_custom = custom_splat1;
		
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	custom_splat1 = script3.splat_custom;
	DestroyImmediate(object2);
	return custom_splat1;
}

function copy_terrain2(terrain1: Terrain): Terrain
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
		
	script3.terrain = terrain1;
		
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	terrain1 = script3.terrain;
	DestroyImmediate(object2);
	
	return terrain1;
}

function copy_animation_curve(animation_curve: animation_curve_class): animation_curve_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
		
	script3.animation_curve = animation_curve;
		
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	animation_curve = script3.animation_curve;
	DestroyImmediate(object2);
	return animation_curve;
}

function copy_color_range(color_range: color_range_class): color_range_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
		
	script3.color_range = color_range;
		
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	color_range = script3.color_range;
	DestroyImmediate(object2);
	color_range.swap_text = "S";
	color_range.swap_select = false;
	color_range.copy_select = false;	
	return color_range;
}

function copy_precolor_range(precolor_range: precolor_range_class): precolor_range_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
		
	script3.precolor_range = precolor_range;
		
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	precolor_range = script3.precolor_range;
	DestroyImmediate(object2);
	return precolor_range;
}

function copy_tree(tree: tree_class): tree_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
	
	script3.tree = tree;
	
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	tree = script3.tree;
	DestroyImmediate(object2);
	
	for (var count_filter: int = 0;count_filter < tree.prefilter.filter_index.Count;++count_filter)
	{
		filter.Add(copy_filter(filter[tree.prefilter.filter_index[count_filter]],true));
		tree.prefilter.filter_index[count_filter] = filter.Count-1;
	}
	tree.placed = 0;
	tree.swap_select = false;
	tree.copy_select = false;
	tree.swap_text = "S";
	return tree;
}	

function copy_object(object1: object_class): object_class
{
	var object: GameObject = new GameObject();
	var script3: save_template = object.AddComponent(save_template);
	
	script3.object = object1;
	
	var object2: GameObject = Instantiate(object);
	DestroyImmediate(object);
	script3 = object2.GetComponent(save_template);
	object1 = script3.object;
	DestroyImmediate(object2);
	object1.color_object = Color(2,2,2,1);
	object1.swap_text = "S";
	object1.swap_select = false;
	object1.copy_select = false;
	object1.placed = 0;
	return object1;
}

function check_terrains_same_resolution(): int
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (!terrains[count_terrain].terrain){return -2;}
		if (!terrains[count_terrain].terrain.terrainData){return -2;}
		if (terrains[count_terrain].terrain.terrainData.heightmapResolution != terrains[0].terrain.terrainData.heightmapResolution){return -1;}
	}
	return 1;
}

function stitch_terrains(border_influence: float): boolean
{
	var line_x: float = Mathf.Round(border_influence/terrains[0].heightmap_conversion.x);
	var line_y: float = Mathf.Round(border_influence/terrains[0].heightmap_conversion.y);
	
	if (border_influence < terrains[0].heightmap_conversion.x*1.5){return false;}
	var strength: float = stitch_tool_strength;
	var count_terrain2: int;
	var terrain_x: int;
	var terrain_y: int;
	var x1: float;
	var y1: float;
	var heights_x1: float[,];
	var heights_x2: float[,];
	
	var height0: float;
	var height1: float;
	var height2: float;
	
	var height_e1: float;
	var height_e2: float;
	var delta_e1: float;
	var delta_e2: float;
	
	var height_o1: float;
	var height_o2: float;
	var delta_o1: float;
	var delta_o2: float;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		terrain_x = -1;
		terrain_y = -1;
		
		for (count_terrain2 = 0;count_terrain2 < terrains.Count;++count_terrain2)
		{
			if (count_terrain2 == count_terrain){continue;}
			if (terrains[count_terrain2].rect.Contains(Vector2(terrains[count_terrain].rect.center.x,terrains[count_terrain].rect.yMax+terrains[count_terrain].heightmap_conversion.y)) && terrain_x == -1)
			{
				terrain_x = count_terrain2;
			}
			if (terrains[count_terrain2].rect.Contains(Vector2(terrains[count_terrain].rect.xMin-terrains[count_terrain].heightmap_conversion.x,terrains[count_terrain].rect.center.y)) && terrain_y == -1)
			{
				terrain_y = count_terrain2;
			}
		}
		
		if (terrain_x != -1)
		{
			heights_x1 = terrains[count_terrain].terrain.terrainData.GetHeights(0,terrains[count_terrain].heightmap_resolution-(line_y),terrains[count_terrain].heightmap_resolution,line_y);
			heights_x2 = terrains[terrain_x].terrain.terrainData.GetHeights(0,0,terrains[count_terrain].heightmap_resolution,line_y);
			
			for (var x: int = 0;x < terrains[count_terrain].heightmap_resolution;++x)
			{
				height_e1 = heights_x1[0,x];
				height_e2 = heights_x2[line_y-1,x];
				
				for (y1 = 0;y1 < line_y-1;++y1)
				{
					if (y1 == 0) 
					{
						height1 = heights_x1[line_y-y1-1,x];
						height2 = heights_x2[y1,x];
						height0 = (height_e1+height_e2)/2;
						//height0 *= (stitch_tool_curve.Evaluate(0.5)+0.5);
						delta_e1 = (height_e1-height0)/(line_y-1);
						// delta_o1 = (height_e1-height1)/(line_y-1);
						
						delta_e2 = (height_e2-height0)/(line_y-1);
						// delta_o2 = (height_e2-height2)/(line_y-1);
						
						heights_x1[line_y-y1-1,x] = height0;
						heights_x2[y1,x] = height0;
					}
					else
					{
						heights_x1[line_y-y1-1,x] = height0+(delta_e1*y1);
						heights_x2[y1,x] = height0+(delta_e2*y1);
					}
				}	
			}
			terrains[count_terrain].terrain.terrainData.SetHeights(0,terrains[count_terrain].heightmap_resolution-line_y,heights_x1);
			terrains[terrain_x].terrain.terrainData.SetHeights(0,0,heights_x2);
		} 
		
		if (terrain_y != -1)
		{
			heights_x1 = terrains[count_terrain].terrain.terrainData.GetHeights(0,0,line_x,terrains[count_terrain].heightmap_resolution);
			heights_x2 = terrains[terrain_y].terrain.terrainData.GetHeights(terrains[count_terrain].heightmap_resolution-line_x,0,line_x,terrains[count_terrain].heightmap_resolution);
			
			for (var y: int = 0;y < terrains[count_terrain].heightmap_resolution;++y)
			{
				height_e1 = heights_x1[y,line_x-1];
				height_e2 = heights_x2[y,0];
				
				for (x1 = 0;x1 < line_x-1;++x1)
				{
					if (x1 == 0)
					{
						height1 = heights_x1[y,x1];
						height2 = heights_x2[y,line_x-x1-1];
						height0 = (height_e1+height_e2)/2;
						delta_e1 = (height_e1-height0)/(line_x-1);
						delta_e2 = (height_e2-height0)/(line_x-1);
						heights_x1[y,x1] = height0;
						heights_x2[y,line_x-x1-1] = height0;
					}
					else
					{
						heights_x1[y,x1] = height0+(delta_e1*x1);
						heights_x2[y,line_x-x1-1] = height0+(delta_e2*x1);
					}
				}	
			}
			terrains[count_terrain].terrain.terrainData.SetHeights(0,0,heights_x1);
			terrains[terrain_y].terrain.terrainData.SetHeights(terrains[count_terrain].heightmap_resolution-line_x,0,heights_x2);
		}
		if (terrains[count_terrain].color_terrain[0] < 1.5){terrains[count_terrain].color_terrain += Color(0.5,0.5,1,0.5);}
	}
	return true;
}

function stitch_splatmap()
{
	if (terrains.Count < 2){return;}
	
	var map: float[,,];
	var terrain_index2: int;
	var resolution: int;
	
	for (var terrain_index: int = 0;terrain_index < terrains.Count;++terrain_index) {
		
		// vertical
		terrain_index2 = search_terrain_top(terrains[terrain_index]);
		
		if (terrain_index2 != -1) {
			resolution = terrains[terrain_index2].terrain.terrainData.alphamapResolution;
			if (terrains[terrain_index].terrain.terrainData.alphamapResolution != resolution){continue;}
			if (terrains[terrain_index].terrain.terrainData.splatPrototypes.Length != terrains[terrain_index2].terrain.terrainData.splatPrototypes.Length) continue;
																
			map = terrains[terrain_index2].terrain.terrainData.GetAlphamaps(0,0,resolution,1);
			terrains[terrain_index].terrain.terrainData.SetAlphamaps(0,resolution-1,map);
		}
		
		// horizontal
		terrain_index2 = search_terrain_left(terrains[terrain_index]);
		
		if (terrain_index2 != -1) {
			resolution = terrains[terrain_index2].terrain.terrainData.alphamapResolution;
		    if (terrains[terrain_index].terrain.terrainData.alphamapResolution != resolution){continue;}
			if (terrains[terrain_index].terrain.terrainData.splatPrototypes.Length != terrains[terrain_index2].terrain.terrainData.splatPrototypes.Length) continue;
			
			map = terrains[terrain_index2].terrain.terrainData.GetAlphamaps(resolution-1,0,1,resolution);
			terrains[terrain_index].terrain.terrainData.SetAlphamaps(0,0,map);
		}
	}
}

function search_terrain_top(preterrain1: terrain_class): int
{
	if (preterrain1.terrain == null) return -1;
	if (preterrain1.terrain.terrainData == null) return -1;
	
	for (var count: int = 0;count < terrains.Count;++count) {
		if (terrains[count].terrain == null) continue;
		if (terrains[count].terrain.terrainData == null) continue;
		if (terrains[count].terrain.transform.position.x == preterrain1.terrain.transform.position.x && terrains[count].terrain.transform.position.z == preterrain1.terrain.transform.position.z+preterrain1.terrain.terrainData.size.z) return count;
	}
	return -1;
}

function search_terrain_left(preterrain1: terrain_class): int
{ 
	if (preterrain1.terrain == null) return -1;
	if (preterrain1.terrain.terrainData == null) return -1;
	
	for (var count: int = 0;count < terrains.Count;++count) {
		if (terrains[count].terrain == null) continue;
		if (terrains[count].terrain.terrainData == null) continue;
		if (terrains[count].terrain.transform.position.z == preterrain1.terrain.transform.position.z && terrains[count].terrain.transform.position.x == preterrain1.terrain.transform.position.x-preterrain1.terrain.terrainData.size.x) return count;
	}
	return -1;
}

function smooth_terrain(preterrain1: terrain_class,strength: float)
{
	if (!preterrain1.terrain){return;}
	
	var heightmap_resolution: int = preterrain1.terrain.terrainData.heightmapResolution;
	var delta_point: float;
	var point1: float;
	var height: float = 1;
	var angle: float = 1;
	var new_point: float = 0;
	var new_count: int = 0;
	
	var point: float;
	var point3: float;
	var new_height: float;
	
	heights = preterrain1.terrain.terrainData.GetHeights(0,0,heightmap_resolution,heightmap_resolution);
	
	for (var count_strength: int = 0;count_strength < smooth_tool_repeat;++count_strength)
	{
		for (var y: int = 0;y < heightmap_resolution;++y)
		{
			for (var x: int = 1;x < heightmap_resolution-1;++x)
			{
				point1 = heights[x-1,y];
				point = heights[x,y];
				point3 = heights[x+1,y];
				
				delta_point = point-((point1+point3)/2);
				if (smooth_tool_advanced)
				{
					height = smooth_tool_height_curve.curve.Evaluate(point);
					angle = smooth_tool_angle_curve.curve.Evaluate(calc_terrain_angle(preterrain1,x,y,settings.smooth_angle)/90);
				}
				delta_point *= (1-(strength*height*angle));
				new_height = delta_point+((point1+point3)/2);
				heights[x,y] = new_height;
			}
		} 
	
		for (y = 1;y < heightmap_resolution-1;++y)
		{
			for (x = 0;x < heightmap_resolution;++x)
			{
				point1 = heights[x,y-1];
				point = heights[x,y];
				point3 = heights[x,y+1];
				
				delta_point = point-((point1+point3)/2);
				if (smooth_tool_advanced)
				{
					height = smooth_tool_height_curve.curve.Evaluate(point);
					angle = smooth_tool_angle_curve.curve.Evaluate(calc_terrain_angle(preterrain1,x,y,settings.smooth_angle)/90);
				}
				delta_point *= (1-(strength*height*angle));
				new_height = delta_point+((point1+point3)/2);
				heights[x,y] = new_height;
			}
		}
		
		/*
		for (var y: int = 1;y < heightmap_resolution-1;++y)
		{
			for (var x: int = 1;x < heightmap_resolution-1;++x)
			{
				point1 = heights[x,y];
				
				if (x-1 > 0) {
					new_point += heights[x-1,y];
					++new_count;
				}
				if (x+1 < heightmap_resolution-1) {
					new_point += heights[x+1,y];
					++new_count;
				}
				if (y-1 > 0) {
					new_point += heights[x,y-1];
					++new_count;
				}
				if (y+1 < heightmap_resolution-1) {
					new_point += heights[x,y+1];
					++new_count;
				}
				
				new_point = (new_point+point1)/(new_count+1);
				
				if (smooth_tool_advanced)
				{
					height = smooth_tool_height_curve.curve.Evaluate(point1);
					angle = smooth_tool_angle_curve.curve.Evaluate(calc_terrain_angle(preterrain1,x,y,settings.smooth_angle)/90);
				}
				// new_point *= (1-(strength*height*angle));
				heights[x,y] = (point1*(1-(strength*height*angle)))+(new_point*(strength*height*angle));
				new_count = 0;
				new_point = 0;
			}
		} 
		*/
		
		/*
		for (y = 1;y < heightmap_resolution-1;++y)
		{
			for (x = 0;x < heightmap_resolution;++x)
			{
				point1 = heights[x,y-1];
				point = heights[x,y];
				point3 = heights[x,y+1];
				
				delta_point = point-((point1+point3)/2);
				if (smooth_tool_advanced)
				{
					height = smooth_tool_height_curve.curve.Evaluate(point);
					angle = smooth_tool_angle_curve.curve.Evaluate(calc_terrain_angle(preterrain1,x,y,settings.smooth_angle)/90);
				}
				delta_point *= (1-(strength*height*angle));
				new_height = delta_point+((point1+point3)/2);
				heights[x,y] = new_height;
			}
		}
		*/
	}
	
	preterrain1.terrain.terrainData.SetHeights(0,0,heights);
	if (preterrain1.color_terrain[0] < 1.5){preterrain1.color_terrain += Color(0.5,0.5,1,0.5);}
}

function get_terrains_minmax()
{
	var heightmapResolution: float;
	var height: float;
	var degree: float;
	var size: Vector3;
	
	settings.terrainMinHeight = 100000000;
	settings.terrainMaxHeight = 0;
	settings.terrainMinDegree = 100;
	settings.terrainMaxDegree = 0;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain) {
		if (!terrains[count_terrain].terrain) {continue;}
		if (!terrains[count_terrain].terrain.terrainData) {continue;}
		heightmapResolution = terrains[count_terrain].terrain.terrainData.heightmapResolution;	
		size = terrains[count_terrain].terrain.terrainData.size;
		
		for (var y: int = 0;y < heightmapResolution;++y) {
			for (var x: int = 0;x < heightmapResolution;++x) {
				height = terrains[count_terrain].terrain.terrainData.GetHeight(x,y);
				if (height < settings.terrainMinHeight) {settings.terrainMinHeight = height;}
				if (height > settings.terrainMaxHeight) {settings.terrainMaxHeight = height;}
				
				degree = calc_terrain_angle(terrains[count_terrain],(x/heightmapResolution)*size.x,(y/heightmapResolution)*size.z,settings.smooth_angle);
				if (degree < settings.terrainMinDegree) {settings.terrainMinDegree = degree;}
				if (degree > settings.terrainMaxDegree) {settings.terrainMaxDegree = degree;}
			}
		}
	}
}

function get_meshes_minmax_height()
{
	settings.terrainMinHeight = 100000000;
	settings.terrainMaxHeight = 0;
	settings.terrainMinDegree = 0;
	settings.terrainMaxDegree = 0;
	
//	var startX: int;
//	var startZ: int;
//	var endX: int;
//	var endZ: int;
	
	for (var i: int = 0;i < meshes.Count;++i) {
		if (meshes[i].mesh) {
			if (meshes[i].mesh.bounds.min.y < settings.terrainMinHeight) settings.terrainMinHeight = meshes[i].mesh.bounds.min.y;
			if (meshes[i].mesh.bounds.max.y > settings.terrainMaxHeight) settings.terrainMaxHeight = meshes[i].mesh.bounds.max.y;
			
//			startX = meshes[i].mesh.bounds.center.x-meshes[i].mesh.bounds.extents.x;
//			startZ = meshes[i].mesh.bounds.center.z-meshes[i].mesh.bounds.extents.z;
//			endX = meshes[i].mesh.bounds.center.x+meshes[i].mesh.bounds.extents.x;
//			endZ = meshes[i].mesh.bounds.center.z+meshes[i].mesh.bounds.extents.z;
//			
//			for (var z: int = startZ;z < endZ;++z) {
//				for (var x: int = startX;x < endX;++x) {
//					GetMeshHeightSlope(meshes[i],new Vector2(x,z));
//					if (mesh_measure.degree < settings.terrainMinDegree) settings.terrainMinDegree = mesh_measure.degree;
//					if (mesh_measure.degree > settings.terrainMaxDegree) settings.terrainMaxDegree = mesh_measure.degree;
//				}
//			}
		}
	}
	
	meshes_heightscale = settings.terrainMaxHeight;
}

function smooth_all_terrain(strength: float)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain) {
		if (terrains[count_terrain].active) 
			smooth_terrain(terrains[count_terrain],strength);
	}
}

function set_smooth_tool_terrain_popup()
{
	if (terrains.Count > 1)
	{
		smooth_tool_terrain = new String[terrains.Count+1];
		smooth_tool_terrain[terrains.Count] = "All";
		smooth_tool_terrain_select = terrains.Count;
	} 
		else 
		{
			smooth_tool_terrain = new String[1];
			smooth_tool_terrain_select = 0;
		}
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		smooth_tool_terrain[count_terrain] = terrains[count_terrain].name;	
	}
}

function convert_software_version() 
{
	if (converted_version < 1.04)
	{
		// convert to filter select
		var count_color_range: int = 0;
		
		for (var count_prelayer: int = 0;count_prelayer < prelayers.Count;++count_prelayer)
		{
			for (var count_layer: int = 0;count_layer < prelayers[count_prelayer].layer.Count;++count_layer)
			{
				for (var count_precolor_range: int = 0;count_precolor_range < prelayers[count_prelayer].layer[count_layer].color_output.precolor_range.Count;++count_precolor_range)
				{
					convert_precolor_range(prelayers[count_prelayer].layer[count_layer].color_output.precolor_range[count_precolor_range]);
				}
			}
		}
		
		for (var count_filter: int = 0;count_filter < filter.Count;++count_filter)
		{
			convert_precolor_range(filter[count_filter].preimage.precolor_range);
		}
		
		for (var count_subfilter: int = 0;count_subfilter < subfilter.Count;++count_subfilter)
		{
			convert_precolor_range(subfilter[count_subfilter].preimage.precolor_range);
		}
		
		converted_version = 1.04;	
	}
	
	if (converted_version < 1.8) {
		// Debug.Log("Sync software");
		for (var i: int = 0;i < prelayers.Count;++i) {
			for (var t: int = 0;t < prelayers[i].layer.Count;++t) {
				prelayers[i].layer[t].splat_output.splat_value.SyncValueMulti();
				prelayers[i].layer[t].grass_output.grass_value.SyncValueMulti();
				prelayers[i].layer[t].tree_output.tree_value.SyncValueMulti();
				prelayers[i].layer[t].object_output.object_value.SyncValueMulti();
			}
		}
		SyncSplatCustom();
		converted_version = 1.8;
	}
}

function SyncSplatCustom()
{
	for (var i: int = 0;i < prelayers.Count;++i) {
			for (var t: int = 0;t < prelayers[i].layer.Count;++t) {
				prelayers[i].layer[t].splat_output.SyncSplatCustom(terrains[0].splatPrototypes.Count);
		}
	}
}

function convert_precolor_range(precolor_range: precolor_range_class)
{
	precolor_range.color_range_value.calc_value();
}

function filter_texture(previewMode: int)
{
	if (!texture_tool.preimage.image[0]){return;}
	var width: int = texture_tool.preimage.image[0].width;
	var height: int = texture_tool.preimage.image[0].height;
	
	if (texture_tool.preimage.image.Count == 1){texture_tool.preimage.image.Add(new Texture2D(1,1));}
	if (!texture_tool.preimage.image[1]){texture_tool.preimage.image[1] = new Texture2D(1,1);}
	
	
	if (texture_tool.preimage.image[1].width != texture_tool.resolution_display.x || texture_tool.preimage.image[1].height != texture_tool.resolution_display.x)
	{
		texture_tool.preimage.image[1].Resize(texture_tool.resolution_display.x,texture_tool.resolution_display.y);
	}
	
	var width2: int = texture_tool.preimage.image[1].width;
	var height2: int = texture_tool.preimage.image[1].height; 
	
	var conversion: Vector2 = new Vector2(width/width2,height/height2);
	
	var color_range_length: int = texture_tool.precolor_range.color_range.Count;
	var in_range: boolean = false;
	var color_start: Color;
	var color_end: Color;
	
	var pixel: Color;
	
	for (var y: int = 0;y < height2;++y)
	{
		for (var x: int = 0;x < width2;++x) 
		{
			in_range = false;
			pixel = texture_tool.preimage.image[0].GetPixel(x*conversion.x,y*conversion.y);
			
			for (var count_color_range: int = 0;count_color_range < color_range_length;++count_color_range)
			{
				if (texture_tool.precolor_range.color_range_value.active[count_color_range])
				{
					color_start = texture_tool.precolor_range.color_range[count_color_range].color_start;
					color_end = texture_tool.precolor_range.color_range[count_color_range].color_end;
					if (texture_tool.precolor_range.color_range[count_color_range].one_color) {
						if (pixel == color_start) {
							in_range = true;
							if (previewMode & 1) {
								pixel = choose_color(count_color_range,1);
							}
						}
					}
					else if (color_in_range(pixel,color_start,color_end))
					{
					 	if (!texture_tool.precolor_range.color_range[count_color_range].invert) {
					 		if (previewMode & 1) {pixel = choose_color(count_color_range,texture_tool.precolor_range.color_range[count_color_range].curve.Evaluate(calc_color_pos(pixel,color_start,color_end)));} 
					 		in_range = true;
					 	} 
					}
					else if (texture_tool.precolor_range.color_range[count_color_range].invert) {
						in_range = true;
						if (previewMode & 1) {pixel = choose_color(count_color_range,1-texture_tool.precolor_range.color_range[count_color_range].curve.Evaluate(calc_color_pos(pixel,color_start,color_end)));} 
					}
				}
			}
			if (!in_range){
				if (!(previewMode & 2)) {pixel = Color(0,0,0);}
			} 
			texture_tool.preimage.image[1].SetPixel(x,y,pixel);
		}
	}
	texture_tool.preimage.image[1].Apply();
}

function choose_color(index: int,falloff: float): Color
{
	var color: Color = Color.red;
	
	switch(index) {
		case 0:
			color = Color.red*falloff;
			break;
		case 1: 
			color = Color.green*falloff;
			break;
		case 2: 
			color = Color.blue*falloff;
			break;
		case 3:
			color = Color.yellow*falloff;
			break;
		case 4:
			color = Color.white*falloff;
			break;
		case 5:
			color = Color.cyan*falloff;
			break;
		case 6:
			color = Color.magenta*falloff;
			break;
		case 7:
			color = Color.grey*falloff;
			break;
	}
	return color;
}

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

function perlin_noise(x: float,y: float,offset_x: float,offset_y: float,frequency: float,octaves: float,detail_strength: float): float
{
	frequency *= current_layer.zoom;
	offset_x += current_layer.offset.x;
	offset_y += current_layer.offset.y;
	
	var perlin: float = (Mathf.PerlinNoise((x+(frequency*(offset_x+50)))/frequency,(y+(frequency*(offset_y+50)))/frequency));
    var pow_octave: float = 2;
				
	for (var count_octaves: float = 1;count_octaves < octaves;++count_octaves)
	{
		perlin += (Mathf.PerlinNoise((x+(frequency*(offset_x+50)))/(frequency/pow_octave),(y+(frequency*(offset_y+50)))/(frequency/pow_octave))-0.5)/pow_octave;
		pow_octave *= detail_strength;
	}
	return perlin;
}

function clamp_range(number: float,start: float,end: float) 
{
	return (((end-start)*number)+start);
}

function create_perlin(preview_resolution: int,resolution: int,mode: export_mode_enum,save: boolean)
{
	var step: float = (resolution*1.0)/(preview_resolution*1.0);
	
	var count_octaves: int;
	var y: float;
	var x: float;
	var pow_octave: float;
	var pow_resolution: int = preview_resolution*preview_resolution;
	var pos: int;
	var frequency: float = heightmap_tool.perlin.frequency;
	
	if (mode == export_mode_enum.Image)
	{
		if (mode == export_mode_enum.Image){var pixels: Color[] = new Color[pow_resolution];}
	
		var color: Color;
		
		for (y = 0;y < resolution;y += step)
		{
			for (x = 0;x < resolution;x += step)
			{
				color[0] = (Mathf.PerlinNoise((-(resolution/2)+x+(frequency*(heightmap_tool.perlin.offset.x+5000)))/frequency,(-(resolution/2)+y+(frequency*(heightmap_tool.perlin.offset.y+5000)))/frequency));
				pow_octave = 2;
				
				for (count_octaves = 1;count_octaves < heightmap_tool.perlin.octaves;++count_octaves)
				{
					color[0] += (Mathf.PerlinNoise((-(resolution/2)+x+(frequency*(heightmap_tool.perlin.offset.x+5000)))/(frequency/pow_octave),(-(resolution/2)+y+(frequency*(heightmap_tool.perlin.offset.y+5000)))/(frequency/pow_octave))-0.5)/pow_octave;
					pow_octave *= 2;//heightmap_tool.pow_strength;
				}
				color[0] = color[0];
				color[1] = color[0];
				color[2] = color[0];
				
				pos = (x/step)+((y/step)*preview_resolution);
				if (pos > pow_resolution-1){pos = pow_resolution-1;}
				
				pixels[pos] = color;
			}
		}
		
		if (save)
		{
		    if (preview_resolution != heightmap_tool.output_texture.width)
			{
				heightmap_tool.output_texture.Resize(resolution,resolution);
			}
			heightmap_tool.output_texture.SetPixels(pixels);
			heightmap_tool.output_texture.Apply();
		}
		else
		{
			heightmap_tool.preview_texture.SetPixels(pixels);
			heightmap_tool.preview_texture.Apply();
		}
		return;
	}
	else if (mode == export_mode_enum.Raw && save)
	{
		heightmap_tool.raw_save_file.bytes = new byte[resolution*resolution*2];
		
		var count_x: int = 0;
		var count_y: int = 0;
		var byte_hi: int;
		var byte_lo: int;
		var i: int = 0;
		var value_int: ushort;
		var height: float;
		    	    	    	    	    	    	    	    	    	    	    	    	
	    if (heightmap_tool.raw_save_file.mode == raw_mode_enum.Mac)
	    {
		   	for (x = 0;x < resolution;++x) 
		   	{
				for (y = 0;y < resolution;++y) 
				{
				
					height = (Mathf.PerlinNoise((x+heightmap_tool.perlin.offset.x+1000000)/heightmap_tool.perlin.frequency,(y+heightmap_tool.perlin.offset.y+1000000)/heightmap_tool.perlin.frequency));
					pow_octave = 2;
					
					for (count_octaves = 1;count_octaves < heightmap_tool.perlin.octaves;++count_octaves)
					{
						height += (Mathf.PerlinNoise((x+heightmap_tool.perlin.offset.x+1000000)/(heightmap_tool.perlin.frequency/pow_octave),(y+heightmap_tool.perlin.offset.y+1000000)/(heightmap_tool.perlin.frequency/pow_octave))-0.5)/pow_octave;
						pow_octave *= 2;
					}
					
					height = heightmap_tool.perlin.precurve.curve.Evaluate(height)*65535;
					
					if (height < 0){height = 0;}
					if (height > 65535){height = 65535;}
	
					value_int = height;
					
					byte_hi = value_int >> 8;
					byte_lo = value_int-(byte_hi << 8);
					
					heightmap_tool.raw_save_file.bytes[i++] = byte_hi;
					heightmap_tool.raw_save_file.bytes[i++] = byte_lo;
				}
			}
		}
				
		else if (heightmap_tool.raw_save_file.mode == raw_mode_enum.Windows)
		{
			for (x = 0;x < resolution;++x) 
		   	{
				for (y = 0;y < resolution;++y) 
				{
					height = (Mathf.PerlinNoise((x+heightmap_tool.perlin.offset.x+1000000)/heightmap_tool.perlin.frequency,(y+heightmap_tool.perlin.offset.y+1000000)/heightmap_tool.perlin.frequency));
					pow_octave = 2;
					
					for (count_octaves = 1;count_octaves < heightmap_tool.perlin.octaves;++count_octaves)
					{
						height += (Mathf.PerlinNoise((x+heightmap_tool.perlin.offset.x+1000000)/(heightmap_tool.perlin.frequency/pow_octave),(y+heightmap_tool.perlin.offset.y+1000000)/(heightmap_tool.perlin.frequency/pow_octave))-0.5)/pow_octave;
						pow_octave *= 2;
					}
					
					height = heightmap_tool.perlin.precurve.curve.Evaluate(height)*65535;
					
					if (height < 0){height = 0;}
					if (height > 65535){height = 65535;}
					
					value_int = height;
					
					byte_hi = value_int >> 8;
					byte_lo = value_int-(byte_hi << 8);
					
					heightmap_tool.raw_save_file.bytes[i++] = byte_lo;
					heightmap_tool.raw_save_file.bytes[i++] = byte_hi;
				}
			}
		}
	}
}

function generate_pattern_start(): boolean
{
	if (pattern_tool.clear)
	{
		for (var y: int = 0;y < pattern_tool.output_texture.height;++y)
		{
			for (var x: int = 0;x < pattern_tool.output_texture.width;++x)
			{
				pattern_tool.output_texture.SetPixel(x,y,Color(0,0,0));
			}
		}
	}
	pattern_tool.place_total = 0;
	
	for (var count_pattern: int = 0;count_pattern < pattern_tool.patterns.Count;++count_pattern)
	{
		if (!pattern_tool.patterns[count_pattern].input_texture){return false;}
		
		pattern_tool.patterns[count_pattern].pattern_placed.Clear();
		pattern_tool.patterns[count_pattern].placed_max = false;
		pattern_tool.place_total += pattern_tool.patterns[count_pattern].place_max;
		pattern_tool.patterns[count_pattern].width = pattern_tool.patterns[count_pattern].input_texture.width/pattern_tool.patterns[count_pattern].count_x;
		pattern_tool.patterns[count_pattern].height = pattern_tool.patterns[count_pattern].input_texture.height/pattern_tool.patterns[count_pattern].count_y;
	}
	return true;
}

function generate_pattern(): boolean
{
	var generate_stop: boolean = true;
	pick_pattern();
	draw_pattern();
	
	for (var count_pattern: int = 0;count_pattern < pattern_tool.patterns.Count;++count_pattern)
	{
		if (!pattern_tool.patterns[count_pattern].placed_max && pattern_tool.patterns[count_pattern].active){generate_stop = false;}
	}
	return generate_stop;
}

function pick_pattern()
{
	var pattern_index: int;
	
	do
	{
		pattern_index = UnityEngine.Random.Range(0,pattern_tool.patterns.Count);
	}
	while (pattern_tool.patterns[pattern_index].placed_max || !pattern_tool.patterns[pattern_index].active);
	
	pattern_tool.current_pattern = pattern_tool.patterns[pattern_index];
	pattern_tool.current_pattern.current_x = UnityEngine.Random.Range(0,pattern_tool.current_pattern.count_x);
	pattern_tool.current_pattern.current_y = UnityEngine.Random.Range(0,pattern_tool.current_pattern.count_y);
	pattern_tool.current_pattern.rotation = UnityEngine.Random.Range(pattern_tool.current_pattern.rotation_start,pattern_tool.current_pattern.rotation_end);
	
	pattern_tool.current_pattern.width2 = pattern_tool.current_pattern.width/2;
	pattern_tool.current_pattern.height2 = pattern_tool.current_pattern.height/2;
	
	pattern_tool.current_pattern.start_x = pattern_tool.current_pattern.current_x*pattern_tool.current_pattern.width;
	pattern_tool.current_pattern.start_y = pattern_tool.current_pattern.current_y*pattern_tool.current_pattern.height;
	
	pattern_tool.current_pattern.scale.x = 1/(UnityEngine.Random.Range(pattern_tool.current_pattern.scale_start.x,pattern_tool.current_pattern.scale_end.x));
	var range_scale_x: float = pattern_tool.current_pattern.scale_end.x-pattern_tool.current_pattern.scale_start.x;
	var scale_xn: float = pattern_tool.current_pattern.scale.x-pattern_tool.current_pattern.scale_start.x;
	var pos_scale_x: float = (scale_xn/range_scale_x)*100;
	
	pattern_tool.current_pattern.scale.y = pattern_tool.current_pattern.scale.x;
	var range_scale_y: float = pattern_tool.current_pattern.scale_end.y-pattern_tool.current_pattern.scale_start.y;
	var scale_yn: float = pattern_tool.current_pattern.scale.y-pattern_tool.current_pattern.scale_start.y;
	var pos_scale_y: float = (scale_yn/range_scale_y)*100;
	
	var delta_pos: float = Mathf.Abs(pos_scale_x-pos_scale_y);
}

function draw_pattern()
{
	if (pattern_tool.current_pattern.pattern_placed.Count >= pattern_tool.current_pattern.place_max){pattern_tool.current_pattern.placed_max = true;return;}
	
	var pivot: Vector2;
	var pixel: Color;
	var pixel2: Color;
	var pixel_pos: Vector2;
	var new_pos: Vector2;
	var place: boolean = false;
	pivot.x = UnityEngine.Random.Range(0-(pattern_tool.current_pattern.width),pattern_tool.output_texture.width);
	pivot.y = UnityEngine.Random.Range(0-(pattern_tool.current_pattern.height),pattern_tool.output_texture.height);
	var rotation: float = pattern_tool.current_pattern.rotation;
	
	for (var y: float = 0;y < pattern_tool.current_pattern.height+pattern_tool.current_pattern.height2;y += pattern_tool.current_pattern.scale.y)
	{
		for (var x: float = 0;x < pattern_tool.current_pattern.width+pattern_tool.current_pattern.width2;x += pattern_tool.current_pattern.scale.x)
		{
			new_pos.x = (x/pattern_tool.current_pattern.scale.x)+pivot.x;
			new_pos.y = (y/pattern_tool.current_pattern.scale.y)+pivot.y;
			if (new_pos.x >= pattern_tool.output_resolution.x || new_pos.y >= pattern_tool.output_resolution.y || new_pos.x < 0 || new_pos.y < 0){continue;}
			
			pixel_pos.x = x+pattern_tool.current_pattern.start_x-(pattern_tool.current_pattern.width2/2);
			pixel_pos.y = y+pattern_tool.current_pattern.start_y-(pattern_tool.current_pattern.height2/2);
			pixel_pos = calc_rotation_pixel(pixel_pos.x,pixel_pos.y,pattern_tool.current_pattern.start_x+(pattern_tool.current_pattern.width/2),pattern_tool.current_pattern.start_y+(pattern_tool.current_pattern.height/2),pattern_tool.current_pattern.rotation);
			if (pixel_pos.x-pattern_tool.current_pattern.start_x < 0 || pixel_pos.x-pattern_tool.current_pattern.start_x > pattern_tool.current_pattern.width){continue;}
			if (pixel_pos.y-pattern_tool.current_pattern.start_y < 0 || pixel_pos.y-pattern_tool.current_pattern.start_y > pattern_tool.current_pattern.height){continue;}
			pixel = pattern_tool.current_pattern.input_texture.GetPixel(pixel_pos.x,pixel_pos.y)*pattern_tool.current_pattern.color;
			pixel[0] *= pattern_tool.current_pattern.strength;
			pixel[1] *= pattern_tool.current_pattern.strength;
			pixel[2] *= pattern_tool.current_pattern.strength;
			
			pixel2 = pattern_tool.output_texture.GetPixel(new_pos.x,new_pos.y);
			place = false;
			for (var count_color_range: int = 0;count_color_range < pattern_tool.current_pattern.precolor_range.color_range.Count;++count_color_range)
			{
				if (color_in_range(pixel,pattern_tool.current_pattern.precolor_range.color_range[count_color_range].color_start,pattern_tool.current_pattern.precolor_range.color_range[count_color_range].color_end))
				{
					if (!pattern_tool.current_pattern.precolor_range.color_range[count_color_range].invert){place = true;}
				} else if (pattern_tool.current_pattern.precolor_range.color_range[count_color_range].invert){place = true;}
			}
			switch(pattern_tool.current_pattern.output)
			{
				case condition_output_enum.add:
					pixel += pixel2;
					break;
				
				case condition_output_enum.subtract:
					pixel = pixel2-pixel;
					break;
				
				case condition_output_enum.change:
					break;
				
				case condition_output_enum.multiply:
					pixel = pixel2*pixel;
					break;
					
				case condition_output_enum.divide:
					pixel[0] = pixel2[0]/pixel[0];
					pixel[1] = pixel2[1]/pixel[1];
					pixel[2] = pixel2[2]/pixel[2];
					break;
					
				case condition_output_enum.difference:
					pixel[0] = Mathf.Abs(pixel2[0]-pixel[0]);
					pixel[1] = Mathf.Abs(pixel2[1]-pixel[1]);
					pixel[2] = Mathf.Abs(pixel2[2]-pixel[2]);
					break;
				
				case condition_output_enum.average:
					pixel = (pixel+pixel2)/2;
					break;
					
				case condition_output_enum.max:
					if (pixel[0] < pixel2[0] && pixel[1] < pixel2[1] && pixel[2] < pixel2[2]){place = false;}
					break;
				
				case condition_output_enum.max:
					if (pixel[0] > pixel2[0] && pixel[1] > pixel2[1] && pixel[2] > pixel2[2]){place = false;}
					break;
			}
			
			if (place){pattern_tool.output_texture.SetPixel(new_pos.x,new_pos.y,pixel);}
			
		}
	}
	pattern_tool.current_pattern.pattern_placed.Add(pivot);
}

function calc_floor(number: float): float
{
	var number_int: int = number;
	return number_int; 
}

function normalize_splat(preterrain1: terrain_class)
{
	var splat_length: int = preterrain1.terrain.terrainData.splatPrototypes.Length;
	preterrain1.map = preterrain1.terrain.terrainData.GetAlphamaps(0,0,preterrain1.terrain.terrainData.alphamapResolution,preterrain1.terrain.terrainData.alphamapResolution);
	var splat_total: float;
	
	for (var count_y: int = 0;count_y < preterrain.splatmap_resolution;++count_y)
	{
		for (var count_x: int = 0;count_x < preterrain.splatmap_resolution;++count_x)
		{
			splat_total = 0;
			
			for (var count_splat: int = 0;count_splat < splat_length;++count_splat)
			{
				splat_total += preterrain1.map[count_x,count_y,count_splat];
			}
			
			for (count_splat = 0;count_splat < splat_length;++count_splat)
			{
				preterrain1.map[count_x,count_y,count_splat] = preterrain1.map[count_x,count_y,count_splat]/(splat_total);
			}
		}
	}
	preterrain1.terrain.terrainData.SetAlphamaps(0,0,preterrain1.map);
}

function calc_terrain_angle(preterrain1: terrain_class,x: float, y: float,smooth: int): float
{
	var size: Vector3 = preterrain1.terrain.terrainData.size;
	var resolution: float = preterrain1.terrain.terrainData.heightmapResolution;
    var conversion: float = size.x/(resolution-1);
	
	var px: short = (x/conversion);
	var py: short = (y/conversion);
	var multi_terrain: boolean = false;
	
	var p1_x: short = px - smooth;
	var p1_y: short = py + smooth;
	var terrainP1 : terrain_class = preterrain1;
	
	var p2_x: short = px + smooth;
	var p2_y: short = py + smooth;
	var terrainP2 : terrain_class = preterrain1;
	
	var p3_x: short = px - smooth;
	var p3_y: short = py - smooth;
	var terrainP3 : terrain_class = preterrain1;
	
	var p4_x: short = px + smooth;
	var p4_y: short = py - smooth;
	var terrainP4 : terrain_class = preterrain1;
	
	if (p1_x < 0)
	{
		if (preterrain1.neighbors[3] != null)
		{
			// --p1_tile_x;
			// --p3_tile_x;
			terrainP1 = preterrain1.neighbors[3];
			
			p1_x = (resolution-1)+p1_x;
			p3_x = p1_x;
			multi_terrain = true;
		}
		else 
		{
			p2_x -= p1_x;
			p4_x = p2_x;
			p1_x = 0;
			p3_x = p1_x;
		}
	}
	else if (p2_x > resolution-1)
	{
		if (preterrain1.neighbors[1] != null)
		{
			// ++p2_tile_x;
			// ++p4_tile_x;
			terrainP2 = preterrain1.neighbors[1];
			p2_x -= (resolution-1);
			p4_x = p2_x;
			multi_terrain = true;
		}
		else 
		{
			p1_x -= (p2_x-(resolution-1));
			p3_x = p1_x;
			p2_x = resolution-1;
			p4_x = p2_x;
		}
	}
	if (p3_y < 0)
	{
		if (terrainP1.neighbors[0] != null)
		{
			// --p3_tile_y;
			// --p4_tile_y;
			terrainP3 = terrainP1.neighbors[0];
			p3_y = (resolution-1)+p3_y;			
			p4_y = p3_y;
			multi_terrain = true;
		}
		else
		{
			p1_y -= p3_y;
			p2_y = p1_y;
			p3_y = 0;
			p4_y = p3_y;
		}
	}
	else if (p1_y > resolution-1)
	{
		if (terrainP2.neighbors[2] != null)
		{
			//++p1_tile_y;
			//++p2_tile_y;
			terrainP4 = terrainP2.neighbors[2];
			p1_y -= (resolution-1);
			p2_y = p1_y;
			multi_terrain = true;
		}
		else
		{
			p3_y -= (p1_y-(resolution-1));
			p4_y = p3_y;
			p1_y = (resolution-1);
			p2_y = p1_y;
		}
	}
	
	var point1: float;
	var point2: float;
	var point3: float;
	var point4: float;
	
	if (multi_terrain)
	{
		point1 = terrainP1.terrain.terrainData.GetHeight(p1_x,p1_y);
		point2 = terrainP2.terrain.terrainData.GetHeight(p2_x,p2_y);
		point3 = terrainP3.terrain.terrainData.GetHeight(p3_x,p3_y);
		point4 = terrainP4.terrain.terrainData.GetHeight(p4_x,p4_y);
	}
	else
	{
		point1 = preterrain1.terrain.terrainData.GetHeight(p1_x,p1_y);
		point2 = preterrain1.terrain.terrainData.GetHeight(p2_x,p2_y);
		point3 = preterrain1.terrain.terrainData.GetHeight(p3_x,p3_y);
		point4 = preterrain1.terrain.terrainData.GetHeight(p4_x,p4_y);
	}
		
	var low: float;
	var high: float;
	
    if (point1 > point2){high = point1;low = point2;} else {high = point2;low = point1;}
    if (point3 > high){high = point3;}
    if (point4 > high){high = point4;}
    
    if (point3 < low){low = point3;}
    if (point4 < low){low = point4;}
        
	var delta_y: float = Mathf.Round((high-low)*(101-settings.round_angle))/(101-settings.round_angle);
	var delta_x: float = (size.x/resolution)*((smooth*2.0)+1);
	
	var angle: float = Mathf.Atan(delta_y/delta_x)*Rad2Deg;
		
	return angle;
}

function find_terrain_by_position(position: Vector3): int
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].rect.Contains(Vector2(position.x,position.z))) {
			return count_terrain;
		}
	}
	
	return -1;
}

function find_terrain(tile_x: int,tile_y: int): int
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].tile_x == tile_x && terrains[count_terrain].tile_z == tile_y){return count_terrain;}
	}
	if (!generate_error)
	{
		Debug.Log("The order of the terrains has been changed! If you have more terrains please shift click <Fit All> in Terrain List -> Data -> Size.");
		generate_error = true;
		reset_terrains_tiles(script_base);
	}
	return 0;
}

function calc_terrain_needed_tiles()
{
	// terrain_instances = Mathf.Pow(terrain_tiles,2)-(terrains.Count-1);
	// terrain_instances = (terrainTiles.x*terrainTiles.y);
	terrainInstances = new Vector2(terrainTiles.x-terrains[0].tiles.x,terrainTiles.y-terrains[0].tiles.y);
	terrain_instances = (terrainTiles.x*terrainTiles.y)-terrains.Count;
}

function calc_terrain_one_more_tile()
{ 
	terrain_tiles = terrains[0].tiles.x+1;
	calc_terrain_needed_tiles();
}

function calc_terrain_tile(terrain_index: int,tiles: tile_class): tile_class
{
	var tile: tile_class = new tile_class();
	
	tile.y = terrain_index/tiles.x; 
	tile.x = terrain_index-(tile.y*tiles.x);
	
	return tile;
}

function calc_terrain_index2(tile: tile_class,tiles: tile_class): int
{
	return (tile.x+(tile.y*tiles.x));
}

function find_terrain_by_name(terrain: Terrain):int
{
	var name: String = terrain.name;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			if (terrains[count_terrain].terrain.name == name){return count_terrain;}	
		}
	}
	return -1;
}

function reset_terrains_tiles(script_save: terraincomposer_save)
{
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		script_save.terrains[count_terrain].tiles = Vector2(1,1);
		script_save.terrains[count_terrain].tile_x = 0;
		script_save.terrains[count_terrain].tile_z = 0;
	}
}

function sec_to_timeMin(seconds: float,display_seconds: boolean): String
{
	var minutes: int = seconds/60;
	seconds -= minutes*60;
	
	if (minutes == 0)
	{
		return (seconds.ToString("F2"));
	}
	
	var roundSeconds: int = seconds;
	seconds -= roundSeconds;
	
	var miliSeconds: int = (seconds*100); 
	 
	if (display_seconds)
	{
		return (minutes.ToString()+":"+roundSeconds.ToString("D2")+"."+miliSeconds.ToString("D2"));
	}
	else
	{
		return (minutes.ToString()+":"+roundSeconds.ToString("D2"));
	}
}

function get_rtp_lodmanager()
{
	RTP_LODmanager1 = GameObject.Find("_RTP_LODmanager");
	if (RTP_LODmanager1) {rtpLod_script = RTP_LODmanager1.GetComponent("RTP_LODmanager");}
}


// generate heightmap
//function GenerateHeightmap(prelayer3: prelayer_class): int
//{
//	generate_error = true;
//	
//	if (prelayer3.prearea.step.x == 0 || prelayer3.prearea.step.y == 0){generate = false;Debug.Log("Area size is 0...");return -1;}
//	
//	frames = 1/(Time.realtimeSinceStartup-auto_speed_time);
// 	auto_speed_time = Time.realtimeSinceStartup;
// 	
// 	break_x = false; 
// 	row_object_count = 0;
// 	
// 	for (y: float = prelayer3.y;prelayer3 
//   
// 	for(prelayer3.counter_y = prelayer3.y;prelayer3.counter_y >= prelayer3.y-(generate_speed*prelayer.prearea.step.y);prelayer3.counter_y -= prelayer.prearea.step.y)
// 	{
// 		generate_call_time = Time.realtimeSinceStartup;
// 		var y: float = prelayer3.y;
// 		var count_terrain: int;
// 			
// 		if (prelayer3.counter_y < prelayer3.prearea.area.yMin)
//	 	{
//	 		if (prelayer_stack.Count > 1)
//	 		{
//	 			// if (line_output){line_generate(prelayer3.index);}
//	 			prelayer_stack.RemoveAt(prelayer_stack.Count-1);
//	 			// area_stack.Add(prelayer.prearea.area);
//	 			prelayer = prelayers[prelayer_stack[prelayer_stack.Count-1]];
//	 			generate_error = false;
//	 			return 2;
//	 		}
//	 		if (generate_world_mode)
//	 		{
//	 			generate = false;
//	 			for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
//		 		{
//		 			terrain_apply(terrains[count_terrain]); 	
//		 		}
//	 		}
//	 		else
//	 		{
//	 			if (settings.showTerrains) {
//	 				if (prelayer3.count_terrain >= terrains.Count-1){generate = false;} 
//	 				terrain_apply(terrains[prelayer3.count_terrain]);
//	 			}
//	 			else {
//	 				if (prelayer3.count_terrain >= meshes.Count-1){generate = false;} 
//	 			}
//	 		}
//	 		
//	 		if (button_export)
//	 		{
//	 			export_name = export_file;
//	 			if (terrains.Count > 1){export_name += "_"+prelayer.count_terrain;}
//				
//				if (settings.colormap || preterrain.rtp_script)
//				{
//					if (settings.colormap_auto_assign || settings.normalmap_auto_assign){script_base.preterrain = script_base.terrains[prelayer3.count_terrain];}
//				}
//				
//				generate_export = 1;
//			}
//	 		
//	 		generate_time = Time.realtimeSinceStartup - generate_time_start;
//	 		
//	 		if (generate)
//	 		{
//	 			++prelayer3.count_terrain;
//	 			if (settings.showTerrains) {
//		 			if (find_terrain(false))
//		 			{
//		 				preterrain = terrains[prelayer3.count_terrain];
//		 				generate_terrain_start();
//		 			}
//		 			else {generate = false;}
//		 		}
//		 		else {
//		 			if (find_mesh()) {
//		 				generate_mesh_start();
//		 			}
//		 			else generate = false;
//		 		}
//	 		} 
//	 		else {
//	 			if (settings.showTerrains) set_neighbor(1); 
//	 			object_apply();
//	 		}
//	 		// if (!generate && line_output){line_generate(0);}
//	 		generate_error = false;
//	 		return 2;
// 		}	
// 		
// 		if (generate_world_mode || prelayer3.index > 0)
// 		{
//	 		for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
//	 		{
//	 			if (terrains[count_terrain].rect.Contains(Vector2(terrains[count_terrain].prearea.area.x,y))){terrains[count_terrain].on_row = true;} else {terrains[count_terrain].on_row = false;}
//	 		}
//	 	}
// 	    
// 		for (prelayer3.x = prelayer3.prearea.area.x+prelayer3.break_x_value;prelayer3.x <= prelayer3.prearea.area.xMax;prelayer3.x += prelayer3.prearea.step.x)
// 		{
// 			var x: float = prelayer3.x;
// 			var curve: float;
//			var strength: float;
//			var strength2: float;
//			var counter_y: float = prelayer3.counter_y;
//			
//			local_x = x-preterrain.rect.x;
//			local_y = counter_y-preterrain.rect.y;	
// 			
//			if (prelayer3.prearea.rotation_active) {
//				var rotation_pos: Vector2 = calc_rotation_pixel(x,counter_y,prelayer3.prearea.center.x,prelayer3.prearea.center.y,prelayer3.prearea.rotation.y);
//				x = rotation_pos.x;
//				counter_y = rotation_pos.y;
//			}
//			
//			local_x_rot = x-preterrain.rect.x;
//			local_y_rot = counter_y-preterrain.rect.y;	
//	 		
//			random_range = UnityEngine.Random.Range(0.00,1000.00);
//			
//			// heightmap output
//				heightmap_x = Mathf.Round(local_x_rot/preterrain.heightmap_conversion.x); 
//				heightmap_y = Mathf.Round(local_y_rot/preterrain.heightmap_conversion.y);
//				
//				// if (heightmap_x_old == heightmap_x && heightmap_y_old == heightmap_y){Debug.Log("Hit");}
//				
//				heightmap_x_old = heightmap_x;
//				heightmap_y_old = heightmap_y;
//				
//				if (heightmap_y > preterrain.heightmap_resolution-1){heightmap_y = preterrain.heightmap_resolution-1;}
//				else if (heightmap_y < 0){heightmap_y = 0;}
//				if (heightmap_x > preterrain.heightmap_resolution-1){heightmap_x = preterrain.heightmap_resolution-1;}
//				else if (heightmap_x < 0){heightmap_x = 0;}
//				
// 				heights[heightmap_y,heightmap_x]  = 0;
//			
//			overlap = false;
//			
//			// process all layers
//			for (var count_layer: int = 0;count_layer < prelayer3.layer.Count;++count_layer)
//			{
//				current_layer = prelayer3.layer[count_layer];
//				
//	        	filter_value = 0;
//	        	filter_strength = 1;
//	        	
//				// process all filters
//				if (current_layer.output == layer_output_enum.heightmap)
//				{
//					layer_x = heightmap_x*preterrain.heightmap_conversion.x;
//					layer_y = heightmap_y*preterrain.heightmap_conversion.y;
//				}
//				
//				for (var count_filter: int = 0;count_filter < current_layer.prefilter.filter_index.Count;++count_filter)
//				{
//					calc_filter_value(filter[current_layer.prefilter.filter_index[count_filter]],counter_y,x);
//				}
//				
//				// heightmap generate
//				heights[heightmap_y,heightmap_x] += filter_value*current_layer.strength;
//				
//			if (auto_speed)
//			{
//				if (Time.realtimeSinceStartup-auto_speed_time > (1.0/target_frame))
//				{
//					// Debug.Log("Generate Frame: "+1/(Time.realtimeSinceStartup-auto_speed_time));
//					prelayer3.break_x_value = (prelayer3.x-prelayer3.prearea.area.x)+prelayer3.prearea.step.x;
//					
//					row_object_count = 0;
//					break_x = true;
//					prelayer3.y = prelayer3.counter_y;
//					generate_time = Time.realtimeSinceStartup - generate_time_start;
//					
//					generate_error = false;
//					//Debug.Log("return frame");
//					return 4;
//				}
//				else {
//					// Debug.Log("Loop Frame: "+1/(Time.realtimeSinceStartup-auto_speed_time));
//				}
//			} 
//		} 
//		prelayer3.break_x_value = 0;
// 	}
//   							
//   prelayer3.y -= ((generate_speed+1)*prelayer.prearea.step.y);
//   
//   generate_time = Time.realtimeSinceStartup - generate_time_start;
//   
//   generate_error = false;
//   return 1;
//}  

// generate_object
function generate_object(prelayer3: prelayer_class): int
{
	frames = 1/(Time.realtimeSinceStartup-auto_speed_time);
 	auto_speed_time = Time.realtimeSinceStartup;
 	
 	break_x = false; 
 	row_object_count = 0;
   
 	for(prelayer3.counter_y = prelayer3.y;prelayer3.counter_y >= prelayer3.y-(generate_speed*prelayer.prearea.step.y);prelayer3.counter_y -= prelayer.prearea.step.y)
 	{
 		generate_call_time = Time.realtimeSinceStartup;
 		var y: float = prelayer3.y;
 		var count_terrain: int;
 			
 		if (prelayer3.counter_y < prelayer3.prearea.area.yMin)
	 	{
	 		if (prelayer_stack.Count > 1) {
	 			prelayer_stack.RemoveAt(prelayer_stack.Count-1);
	 			prelayer = prelayers[prelayer_stack[prelayer_stack.Count-1]];
	 			generate_error = false;
	 			return 2;
	 		}
	 		if (generate_world_mode)
	 		{
	 			generate = false;
	 			for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
		 		{
		 			terrain_apply(terrains[count_terrain]); 	
		 		}
	 		}
	 		generate_time = Time.realtimeSinceStartup - generate_time_start;
	 		
	 		if (generate)
	 		{
	 			++prelayer3.count_terrain;
	 			if (find_terrain(false))
	 			{
	 				preterrain = terrains[prelayer3.count_terrain];
	 				generate_terrain_start();
	 			}
	 			else {generate = false;generateDone = true;}
	 		} 
	 		else {
	 			// set_neighbor(1);
	 		}
	 		generate_error = false;
	 		return 2;
 		}	
 		
 		if (generate_world_mode || prelayer3.index > 0)
 		{
	 		for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
	 		{
	 			if (terrains[count_terrain].rect.Contains(Vector2(terrains[count_terrain].prearea.area.x,y))){terrains[count_terrain].on_row = true;} else {terrains[count_terrain].on_row = false;}
	 		}
	 	}
 	    
 		for (prelayer3.x = prelayer3.prearea.area.x+prelayer3.break_x_value;prelayer3.x <= prelayer3.prearea.area.xMax;prelayer3.x += prelayer3.prearea.step.x)
 		{
 			var x: float = prelayer3.x;
 			var curve: float;
			var strength: float;
			var strength2: float;
			var counter_y: float = prelayer3.counter_y;
			
			if (generate_world_mode || prelayer3.index > 0)
			{
				var out_of_range: boolean = true;
				
				for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain)
				{
					if (terrains[count_terrain].rect.Contains(Vector2(x,counter_y)))
					{
						out_of_range = false;
						preterrain = terrains[count_terrain];
						break;
					}
				}
				if (out_of_range) {continue;}
				
				if (prelayer3.prearea.rotation_active) {
					var rotation_pos: Vector2 = calc_rotation_pixel(x,counter_y,prelayer3.prearea.center.x,prelayer3.prearea.center.y,prelayer3.prearea.rotation.y);
					x = rotation_pos.x;
					counter_y = rotation_pos.y;
				}
 			}
 			
 			local_x = x-preterrain.rect.x;
			local_y = counter_y-preterrain.rect.y;	
 			
			local_x_rot = x-preterrain.rect.x;
			local_y_rot = counter_y-preterrain.rect.y;	
	 		
			if (settings.showTerrains) {
	 			degree = (calc_terrain_angle(preterrain,local_x_rot,local_y_rot,settings.smooth_angle)*settings.global_degree_strength)+settings.global_degree_level;
	 			height = ((preterrain.terrain.terrainData.GetHeight(local_x_rot/preterrain.heightmap_conversion.x,local_y_rot/preterrain.heightmap_conversion.y)/preterrain.size.y)*settings.global_height_strength)+settings.global_height_level;
	 		}
	 		
	 		// if (measure_normal){normal = preterrain.terrain.terrainData.GetInterpolatedNormal((local_x_rot/preterrain.size.x),(local_y_rot/preterrain.size.z));}
			
			random_range = UnityEngine.Random.Range(0.00,1000.00);
			
			// process all layers
			for (var count_layer: int = 0;count_layer < prelayer3.layer.Count;++count_layer)
			{
				current_layer = prelayer3.layer[count_layer];
				
	        	filter_value = 0;
	        	filter_strength = 1;
	        	
				// process all filters
				layer_x = local_x_rot;
				layer_y = local_y_rot;}
				
				for (var count_filter: int = 0;count_filter < current_layer.prefilter.filter_index.Count;++count_filter) {
					calc_filter_value(filter[current_layer.prefilter.filter_index[count_filter]],counter_y,x);
				}
				
				if (subfilter_value*current_layer.strength*filter_strength > 0)
				{
					// if (local_x_rot < prelayer3.prearea.step.x){continue;}
					// if (local_y_rot > preterrain.size.z-prelayer3.prearea.step.y){continue;}
	
					var object_index: int = current_layer.object_output.object_value.curve.Evaluate(filter_value)*(current_layer.object_output.object.Count);
					var current_object: object_class = current_layer.object_output.object[object_index];
					
					if (current_layer.positionSeed) {
						if (counter_y == 0 || x == 0) {
							UnityEngine.Random.seed = (seed-10)+((counter_y+1)*(x+1))+10000000*(count_layer+1);								
						}
						else {
							UnityEngine.Random.seed = (seed-10)+(counter_y*x)*(count_layer+1);							
						}
					}
					
					random_range2 = UnityEngine.Random.Range(0.0,1.0);
					
					if (random_range2 > ((subfilter_value*current_layer.strength*filter_strength))){continue;}
					place = true;
					
					var clear_list: boolean = true;
					var rotation: Quaternion = Quaternion.identity;
					var count_object: int;
					
					position = Vector3(x,0,counter_y);
					// var position_random: Vector3;
					var position_start: Vector3 = current_object.position_start;
					var position_end: Vector3 = current_object.position_end;
					var position_random: Vector3;
					
					position_random.x = UnityEngine.Random.Range(position_start.x,position_end.x);
					position_random.y = UnityEngine.Random.Range(position_start.y,position_end.y);
					position_random.z = UnityEngine.Random.Range(position_start.z,position_end.z);
					
					if (current_object.random_position) {
						position_random.x += UnityEngine.Random.Range(-prelayer3.prearea.step.x,prelayer3.prearea.step.x);
						position_random.z += UnityEngine.Random.Range(-prelayer3.prearea.step.y,prelayer3.prearea.step.y);
					}
					
					position += position_random;
					
					if (current_object.terrain_rotate) {
						var rotation1: Vector3 = preterrain.terrain.terrainData.GetInterpolatedNormal(((local_x_rot+position_random.x)/preterrain.size.x),((local_y_rot+position_random.y)/preterrain.size.z));
						rotation1.x = (rotation1.x/3)*2;
						rotation1.z = (rotation1.z/3)*2;
						
						rotation = Quaternion.FromToRotation(Vector3.up,rotation1);
					    // rotation *= Quaternion.AngleAxis(90, Vector3.right);
					}
		
					rotation *= Quaternion.AngleAxis(UnityEngine.Random.Range(current_object.rotation_start.x,current_object.rotation_end.x), Vector3.right);
					rotation *= Quaternion.AngleAxis(UnityEngine.Random.Range(current_object.rotation_start.y,current_object.rotation_end.y), Vector3.up);
					rotation *= Quaternion.AngleAxis(UnityEngine.Random.Range(current_object.rotation_start.z,current_object.rotation_end.z), Vector3.forward);
					
					rotation *= Quaternion.Euler(current_object.parent_rotation);
					
					if (current_object.terrain_height) {
						height_interpolated = preterrain.terrain.terrainData.GetInterpolatedHeight((local_x_rot+position_random.x)/preterrain.size.x,(local_y_rot+position_random.z)/preterrain.size.z);
					
						position.y = (height_interpolated)+preterrain.terrain.transform.position.y+position_random.y;
					}
					
					var scale_x_range: float = current_object.scale_end.x-current_object.scale_start.x;
					scale.x = UnityEngine.Random.Range(current_object.scale_start.x,current_object.scale_end.x);
					//scale.x = (current_object.scaleCurve.Evaluate((scale.x-current_object.scale_start.x)/scale_x_range)*scale_x_range)+current_object.scale_start.x;
					
					var scale_x_pos: float = scale.x-current_object.scale_start.x;
					var scale_x_pos_ratio: float = scale_x_pos/scale_x_range;
					
					var scale_y_range: float = current_object.scale_end.y-current_object.scale_start.y;
					var scale_y_start_n: float = ((scale_y_range*scale_x_pos_ratio)-(current_object.unlink_y*scale_x_pos))+current_object.scale_start.y;
					if (scale_y_start_n < current_object.scale_start.y){scale_y_start_n = current_object.scale_start.y;}
					var scale_y_end_n: float = ((scale_y_range*scale_x_pos_ratio)+(current_object.unlink_y*scale_x_pos))+current_object.scale_start.y;
					if (scale_y_end_n > current_object.scale_end.y){scale_y_end_n = current_object.scale_end.y;}
					
					scale.y = UnityEngine.Random.Range(scale_y_start_n,scale_y_end_n);
					//scale.y = (current_object.scaleCurve.Evaluate((scale.y-current_object.scale_start.y)/scale_y_range)*scale_y_range)+current_object.scale_start.y;
					
					var scale_z_range: float = current_object.scale_end.z-current_object.scale_start.z;
					var scale_z_start_n: float = ((scale_z_range*scale_x_pos_ratio)-(current_object.unlink_z*scale_x_pos))+current_object.scale_start.z;
					if (scale_z_start_n < current_object.scale_start.z){scale_z_start_n = current_object.scale_start.z;}
					var scale_z_end_n: float = ((scale_z_range*scale_x_pos_ratio)+(current_object.unlink_z*scale_x_pos))+current_object.scale_start.z;
					if (scale_z_end_n > current_object.scale_end.z){scale_z_end_n = current_object.scale_end.z;}
					
					scale.z = UnityEngine.Random.Range(scale_z_start_n,scale_z_end_n);
					//scale.z = (current_object.scaleCurve.Evaluate((scale.z-current_object.scale_start.z)/scale_z_range)*scale_z_range)+current_object.scale_start.z;
					
					if (current_object.raycast) {
						if (Physics.SphereCast (position+Vector3(0,current_object.cast_height,0),current_object.ray_radius,current_object.ray_direction,hit,current_object.ray_length)) {
							layerHit = Mathf.Pow(2,hit.transform.gameObject.layer);
							if (layerHit &  current_object.layerMask) {
								position.y = hit.point.y;
							} 
						}
					}
					
					if (current_object.pivot_center) {
						position.y += scale.y/2;	
					}
					
					var distanceCheck: boolean = false;
					
					scale *= current_layer.object_output.scale;
					
					if (place)
					{
						var resolution1: float = preterrain.size.z; 
						resolution1 = resolution1 / preterrain.heightmap_resolution;
						
						// combine_script.objectsCreate[combine_script.objectsCreate.Count-1].objects.Add(new object_point_class2(current_object.objectIndex,position,rotation,scale));
						
						++current_object.placed;
						++current_object.placed_prelayer;
						++current_layer.object_output.placed;
						++row_object_count;
						
						// current_object.object2 = object1;
						
						if (current_object.prelayer_created)
						{
							if (prelayers[current_object.prelayer_index].prearea.active)
							{
								set_object_child(current_object,rotation.eulerAngles);
								prelayer3.x += prelayer3.prearea.step.x;
								prelayer3.y = prelayer3.counter_y;
								if (prelayer3.x <= prelayer.prearea.area.xMax){prelayer3.break_x_value = prelayer3.x-prelayer3.prearea.area.x;}
								else {prelayer3.y -= prelayer3.prearea.step.y;prelayer3.break_x_value = 0;}
								prelayer_stack.Add(current_object.prelayer_index);
								prelayer = prelayers[current_object.prelayer_index];
									
								prelayer.prearea.area.x = position.x+(prelayer.prearea.area_old.x)*scale.x;
								prelayer.prearea.area.y = position.z+(prelayer.prearea.area_old.y)*scale.z;
								
								prelayer.prearea.area.width = prelayer.prearea.area_old.width*scale.x;
								prelayer.prearea.area.height = prelayer.prearea.area_old.height*scale.z;
								
								if (rotation.y != 0)
								{
									prelayer.prearea.rotation = rotation.eulerAngles;
									prelayer.prearea.rotation_active = true;
								}
								
								prelayer.prearea.step.y = Mathf.Sqrt(Mathf.Pow(prelayer.prearea.step_old.x,2)+Mathf.Pow(prelayer.prearea.step_old.y,2))/2;
								prelayer.prearea.step.x = prelayer.prearea.step.y;
								
								prelayer.prearea.center = Vector2(position.x,position.z);
								prelayer.y = prelayer.prearea.area.yMax; 
								return 3;
							}
						}
					} 
				}	
			
		} 
		/*
		if (Time.realtimeSinceStartup-auto_speed_time > (1.0/target_frame))
		{
			prelayer3.y = prelayer3.counter_y;
			generate_time = Time.realtimeSinceStartup - generate_time_start;
			
			return 4;
		} 
		*/
	}
   							
	prelayer3.y -= ((generate_speed+1)*prelayer.prearea.step.y);
	generate_time = Time.realtimeSinceStartup - generate_time_start;
   
	return 1;
} 

function convert_terrains_to_mesh(): String
{
	var parent_object: GameObject;
	var child: GameObject;
	
	var vertex: List.<vertex_class> = new List.<vertex_class>();
	
	var pos: int;
	var resolution: int;
	var count_terrain: int;
	
	var mesh: List.<Mesh> = new List.<Mesh>();
	var x: int;
	var y: int;
	var preterrain1 = terrains[0];
	var normal: normal_class;
	
	var conversion: Vector3;
	var tt1: float = Time.realtimeSinceStartup;
	var countTerrain: int = 0;
	
	for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain) {
		if (!terrains[count_terrain].terrain) {return ("All terrains must be assigned");}
		if (!terrains[count_terrain].terrain.terrainData) {return ("All terrainData's must be assigned");}
		if (terrains[count_terrain].terrain.terrainData.heightmapResolution > 129) {return ("Can only convert 33, 65 and 129 heightmap resolution at the moment");}
		if (terrains[count_terrain].active) ++countTerrain;
	}
	if (countTerrain == 0) return ("Please activate at least 1 terrain");
	
	countTerrain = 0;
	parent_object = new GameObject();
	parent_object.name = "Terrains Mesh";
	
	for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain) {
		if (!terrains[count_terrain].active) continue;
		resolution = terrains[count_terrain].terrain.terrainData.heightmapResolution;
		conversion.x = preterrain1.terrain.terrainData.size.x/(resolution-1);
		conversion.z = preterrain1.terrain.terrainData.size.z/(resolution-1);
		conversion.y = preterrain1.terrain.terrainData.size.y;
	
		terrains[count_terrain].index = count_terrain;
		mesh.Add(convert_terrain_to_mesh(terrains[count_terrain],parent_object));
		vertex.Add(new vertex_class());
		vertex[countTerrain].vertices = mesh[countTerrain].vertices;
		++countTerrain;
	}
	
	// Debug.Log(Time.realtimeSinceStartup-tt1);
	
//	var normals: Vector3[] = new Vector3[mesh[0].vertices.Length];
//	var tangents: Vector4[] = new Vector4[mesh[0].vertices.Length];
//	var g: int = 0;
//	var size: Vector3;
	
//	for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain) {
//		if (!terrains[count_terrain].active) continue;
//		resolution = terrains[count_terrain].terrain.terrainData.heightmapResolution;
//		size = terrains[count_terrain].terrain.terrainData.size;
//		
//		for (y = 1;y < resolution-1;++y) {
//			for (x = 1;x < resolution-1;++x) {
//				pos = (y*resolution)+x;
//				normal = calc_normal(conversion.x,vertex[countTerrain],pos,resolution);
//				normals[pos] = normal.normal;
//				tangents[pos] = normal.tangent;
//			}
//		}
//		// left
//		for (y = 0;y < resolution;++y) {
//			pos = (y*resolution);
//			
//			if (y > 0 && y < resolution-1) {
//				normal = calc_normal_border_left(terrains[count_terrain],conversion.x,vertex,y,resolution,size);
//				normals[pos] = normal.normal;
//				tangents[pos] = normal.tangent;
//			}
//			
//			if (y > 0 && y < resolution-1) {
//				normal = calc_normal_border_right(terrains[count_terrain],conversion.x,vertex,y,resolution,size);
//				normals[pos+resolution-1] = normal.normal;
//				tangents[pos+resolution-1] = normal.tangent;
//			}
//			
//			normal = calc_normal_border_top(terrains[count_terrain],conversion.x,vertex,y,resolution,size);
//			normals[y+(resolution*(resolution-1))] = normal.normal;
//			tangents[y+(resolution*(resolution-1))] = normal.tangent;
//			
//			normal = calc_normal_border_bottom(terrains[count_terrain],conversion.x,vertex,y,resolution,size);
//			normals[y] = normal.normal;
//			tangents[y] = normal.tangent;
//		}
//		
//		// mesh[count_terrain].normals = normals;
//		// mesh[count_terrain].tangents = tangents;
//		++countTerrain;
//	}
	
	var mesh1: Mesh;
	countTerrain = 0;
	
	#if UNITY_EDITOR || UNITY_WP8
	for (count_terrain = 0;count_terrain < terrains.Count;++count_terrain) {
		if (!terrains[count_terrain].active) continue;
		mesh1 = mesh[countTerrain];
		mesh1.RecalculateNormals();
		AssetDatabase.CreateAsset(mesh1,settings.mesh_path.Replace(Application.dataPath,"Assets")+"/"+terrains[count_terrain].name+".asset");
		AssetDatabase.SaveAssets();
		++countTerrain;
	}
	#endif
	
	return "Converting "+countTerrain.ToString()+" terrains to meshes done";
}

class vertex_class
{
	var vertices: Vector3[];
}

function convert_terrain_to_mesh(preterrain1: terrain_class,parent: GameObject): Mesh
{
	var tt1: float = Time.realtimeSinceStartup;
	
	if (!preterrain1.terrain){return;}
	if (!preterrain1.terrain.terrainData){return;}
	
	var resolution: int = preterrain1.terrain.terrainData.heightmapResolution;
	var resolution_square: int = resolution*resolution;
	
	var vertices: Vector3[] = new Vector3[resolution_square];
	var count_vertice: int = 0;
	var uvs: Vector2[] = new Vector2[vertices.Length];
	
	//heights = preterrain1.terrain.terrainData.GetHeights(0,0,resolution,resolution);
	var conversion_x: float = preterrain1.terrain.terrainData.size.x/(resolution-1);
	var conversion_z: float = preterrain1.terrain.terrainData.size.z/(resolution-1);
	var conversion_y: float = preterrain1.terrain.terrainData.size.y;
	var y: int;
	var x: int;
	var height_scale: float = preterrain1.terrain.terrainData.size.y;
	
	var terrain_pos: Vector3 = preterrain1.terrain.transform.position;
	
	for (y = 0;y < resolution;++y)
	{
		for (x = 0;x < resolution;++x)
		{
			vertices[count_vertice] = Vector3(x*conversion_x,preterrain1.terrain.terrainData.GetHeight(x,y),y*conversion_z);
			// vertices[count_vertice] = Vector3(x*conversion_x,0*conversion_y,y*conversion_z);
			// vertex_list[Vector2(vertices[count_vertice].x+terrain_pos.x,vertices[count_vertice].z+terrain_pos.z)] = new vertex_class(Vector3(vertices[count_vertice].x+terrain_pos.x,vertices[count_vertice].y,vertices[count_vertice].z+terrain_pos.z));
			
			uvs[count_vertice++] = Vector2((x*1.0)/resolution,(y*1.0)/resolution);
		}
	}
	
	var triangles: int[] = new int[vertices.Length*6];
	var count_triangle: int = 0;
	var vert_x: int;
	var vert_y: int;
	
	for (y = 0;y < resolution-1;++y)
	{
		for (x = 0;x < resolution-1;++x)
		{
			vert_x = (y*resolution)+x;
			triangles[count_triangle++] = vert_x+1;
			triangles[count_triangle++] = vert_x;
			triangles[count_triangle++] = vert_x+resolution;
			
			triangles[count_triangle++] = vert_x+1;
			triangles[count_triangle++] = vert_x+resolution; 
			triangles[count_triangle++] = vert_x+resolution+1;
		}
	}
	
	var object: GameObject = new GameObject();
	object.transform.position = preterrain1.terrain.transform.position;
	object.transform.parent = parent.transform;
	object.name = preterrain1.name;
	var mesh: Mesh = new Mesh();
	var mesh_filter: MeshFilter = object.AddComponent(MeshFilter);
	var mesh_renderer: MeshRenderer = object.AddComponent(MeshRenderer);
	mesh_renderer.material = settings.mesh_material;
	
	mesh_filter.mesh = mesh;
	
	mesh.vertices = vertices;
	mesh.triangles = triangles;
		
	// mesh.normals = vertices;
	// mesh.tangents = tangent;
	// mesh.RecalculateNormals();
	mesh.uv = uvs;
	
	var tt2: float = Time.realtimeSinceStartup-tt1;
	
	// object.AddComponent(TerrainCollider);
	
	var tt3: float = Time.realtimeSinceStartup-tt1;
	
	// Debug.Log("Convert time1: "+tt2+" frame: "+(1/tt2));
	// Debug.Log("Convert time2: "+tt3+" frame: "+(1/tt3));
	
	return mesh;
}

class normal_class 
{
	var normal: Vector3;
	var tangent: Vector3;
}

function calc_normal(space: float,vertex: vertex_class,pos: int,resolution: int): normal_class
{
	var normal: normal_class = new normal_class();
	
	var p0: Vector3;
	var p1: Vector3;
	var p2: Vector3;
	var p3: Vector3;
	var p4: Vector3;
	var p5: Vector3;
	var p6: Vector3;
	var p7: Vector3;
	var p8: Vector3;
	
	var n: Vector3;
	
	var t: Vector4;
	var lt: float;
	var rt: float;
	
	p0 = vertex.vertices[pos];
	p1 = vertex.vertices[pos-resolution-1];
	p2 = vertex.vertices[pos-resolution];
	p3 = vertex.vertices[pos-resolution+1];
	p4 = vertex.vertices[pos-1];
	p5 = vertex.vertices[pos+1];
	p6 = vertex.vertices[pos+resolution-1];
	p7 = vertex.vertices[pos+resolution];
	p8 = vertex.vertices[pos+resolution+1];
	
	n = Vector3.Cross((p1 - p0), (p2 - p0));
	n += Vector3.Cross((p2 - p0), (p3 - p0));
	n += Vector3.Cross((p4 - p0), (p1 - p0));
	n += Vector3.Cross((p3 - p0), (p5 - p0));
	n += Vector3.Cross((p6 - p0), (p4 - p0));
	n += Vector3.Cross((p5 - p0), (p8 - p0));
	n += Vector3.Cross((p7 - p0), (p6 - p0));
	n += Vector3.Cross((p8 - p0), (p7 - p0));
	
	n = (n/8.0).normalized;
	n.y *= -1;
	
	normal.normal = n;
	
	lt = p4.y;
	rt = p5.y;
	
	t = Vector4(-space,rt-lt,0,-space);
	normal.tangent = t.normalized;
	
	return normal;
}

function calc_normal_border_left(preterrain1: terrain_class,space: float,vertex: List.<vertex_class>,y: int,resolution: int,size: Vector3): normal_class
{
	var normal: normal_class = new normal_class();
	
	var p0: Vector3;
	var p1: Vector3;
	var p2: Vector3;
	var p3: Vector3;
	var p4: Vector3;
	var p5: Vector3;
	var p6: Vector3;
	var p7: Vector3;
	var p8: Vector3;
	
	var p1_a: boolean = true;
	var p2_a: boolean = true;
	var p3_a: boolean = true;
	var p4_a: boolean = true;
	var p6_a: boolean = true;
	var p7_a: boolean = true;
	var p8_a: boolean = true;
	
	var n: Vector3 = Vector3.zero;
	
	var t: Vector4;
	var lt: float;
	var rt: float;
	
	var total: float = 0;
	
	p0 = vertex[preterrain1.index].vertices[(y*resolution)];
	
	if (preterrain1.neighbor.left > -1) {
		p1 = vertex[preterrain1.neighbor.left].vertices[resolution-2+((y-1)*resolution)]-Vector3(size.x,0,0);
		p4 = vertex[preterrain1.neighbor.left].vertices[resolution-2+(y*resolution)]-Vector3(size.x,0,0);
		p6 = vertex[preterrain1.neighbor.left].vertices[resolution-2+((y+1)*resolution)]-Vector3(size.x,0,0);
	} 
	else {
		p1_a = false;
		p4_a = false;
		p6_a = false;
	}
	
	p2 = vertex[preterrain1.index].vertices[((y-1)*resolution)];
	p3 = vertex[preterrain1.index].vertices[1+((y-1)*resolution)];
	p7 = vertex[preterrain1.index].vertices[((y+1)*resolution)];
	p8 = vertex[preterrain1.index].vertices[1+((y+1)*resolution)];
	
	p5 = vertex[preterrain1.index].vertices[1+(y*resolution)];
	
	if (p1_a && p2_a){n = Vector3.Cross((p1 - p0), (p2 - p0));++total;}
	if (p2_a && p3_a){n += Vector3.Cross((p2 - p0), (p3 - p0));++total;}
	if (p4_a && p1_a){n += Vector3.Cross((p4 - p0), (p1 - p0));++total;}
	if (p3_a){n += Vector3.Cross((p3 - p0), (p5 - p0));++total;}
	if (p6_a && p4_a){n += Vector3.Cross((p6 - p0), (p4 - p0));++total;}
	if (p8_a){n += Vector3.Cross((p5 - p0), (p8 - p0));++total;}
	if (p6_a && p7_a){n += Vector3.Cross((p7 - p0), (p6 - p0));++total;}
	if (p7_a && p8_a){n += Vector3.Cross((p8 - p0), (p7 - p0));++total;}
	
	n = (n/total).normalized;
	n.y *= -1;
	normal.normal = n;
	
	if (p4_a){lt = p4.y;} else {lt = p0.y;}
	rt = p5.y;
	
	t = Vector4(-space,rt-lt,0,-space);
	normal.tangent = t.normalized;
	
	return normal;
}

function calc_normal_border_right(preterrain1: terrain_class,space: float,vertex: List.<vertex_class>,y: int,resolution: int,size: Vector3): normal_class
{
	var normal: normal_class = new normal_class();
	
	var p0: Vector3; 
	var p1: Vector3;
	var p2: Vector3;
	var p3: Vector3;
	var p4: Vector3;
	var p5: Vector3;
	var p6: Vector3;
	var p7: Vector3;
	var p8: Vector3;
	
	var p1_a: boolean = true;
	var p2_a: boolean = true;
	var p3_a: boolean = true;
	var p5_a: boolean = true;
	var p6_a: boolean = true;
	var p7_a: boolean = true;
	var p8_a: boolean = true;
	
	var n: Vector3 = Vector3.zero;
	
	var t: Vector4;
	var lt: float;
	var rt: float;
	
	var total: float = 0;
	
	if (preterrain1.neighbor.right > -1) {
		// p1 = vertex[preterrain1.neighbor.left].vertices[pos+resolution-1];
		p3 = vertex[preterrain1.neighbor.right].vertices[1+((y-1)*resolution)]+Vector3(size.x,0,0);
		p5 = vertex[preterrain1.neighbor.right].vertices[1+(y*resolution)]+Vector3(size.x,0,0);
		p8 = vertex[preterrain1.neighbor.right].vertices[1+((y+1)*resolution)]+Vector3(size.x,0,0);
	} 
	else {
		p3_a = false;
		p5_a = false;
		p8_a = false;
	}
	
	p1 = vertex[preterrain1.index].vertices[resolution-2+((y-1)*resolution)];
	p2 = vertex[preterrain1.index].vertices[resolution-1+((y-1)*resolution)];
	p6 = vertex[preterrain1.index].vertices[resolution-2+((y+1)*resolution)];
	p7 = vertex[preterrain1.index].vertices[resolution-1+((y+1)*resolution)];
	
	p0 = vertex[preterrain1.index].vertices[resolution-1+(y*resolution)];
	p4 = vertex[preterrain1.index].vertices[resolution-2+(y*resolution)];
	
	if (p1_a && p2_a) {n = Vector3.Cross((p1 - p0), (p2 - p0));++total;}
	if (p2_a && p3_a) {n += Vector3.Cross((p2 - p0), (p3 - p0));++total;}
	if (p1_a) {n += Vector3.Cross((p4 - p0), (p1 - p0));++total;}
	if (p3_a && p5_a) {n += Vector3.Cross((p3 - p0), (p5 - p0));++total;}
	if (p6_a) {n += Vector3.Cross((p6 - p0), (p4 - p0));++total;}
	if (p5_a && p8_a) {n += Vector3.Cross((p5 - p0), (p8 - p0));++total;}
	if (p6_a && p7_a) {n += Vector3.Cross((p7 - p0), (p6 - p0));++total;}
	if (p8_a && p7_a) {n += Vector3.Cross((p8 - p0), (p7 - p0));++total;}
	
	n = (n/total).normalized;
	n.y *= -1;
	normal.normal = n;
		
	lt = p4.y;
	if (p5_a) {rt = p5.y;} else {rt = p0.y;}
	
	t = Vector4(-space,rt-lt,0,-space);
	normal.tangent = t.normalized;
	
	return normal;
}

function calc_normal_border_top(preterrain1: terrain_class,space: float,vertex: List.<vertex_class>,x: int,resolution: int,size: Vector3): normal_class
{
	var normal: normal_class = new normal_class();
	
	var p0: Vector3; 
	var p1: Vector3;
	var p2: Vector3;
	var p3: Vector3;
	var p4: Vector3;
	var p5: Vector3;
	var p6: Vector3;
	var p7: Vector3;
	var p8: Vector3;
	
	var p1_a: boolean = true;
	var p3_a: boolean = true;
	var p4_a: boolean = true;
	var p5_a: boolean = true;
	var p6_a: boolean = true;
	var p7_a: boolean = true;
	var p8_a: boolean = true;
	
	var n: Vector3 = Vector3.zero;
	
	var t: Vector4;
	var lt: float;
	var rt: float;
	
	var total: float = 0;
	
	if (x+1 > resolution-1) {
		if (preterrain1.neighbor.right > -1) {
			p5 = vertex[preterrain1.neighbor.right].vertices[1+(resolution*(resolution-1))]+Vector3(size.x,0,0);
			p3 = vertex[preterrain1.neighbor.right].vertices[1+(resolution*(resolution-2))]+Vector3(size.x,0,0);
			
			if (preterrain1.neighbor.top_right > -1) {
				p8 = vertex[preterrain1.neighbor.top_right].vertices[resolution+1]+Vector3(size.x,0,size.z);
			} 
			else {
				p8_a = false;
			}	
		}
		else {
			p3_a = false;
			p5_a = false;
			p8_a = false;
		}
		
		if (preterrain1.neighbor.top > -1) {
			// p1 = vertex[preterrain1.neighbor.left].vertices[pos+resolution-1];
			p6 = vertex[preterrain1.neighbor.top].vertices[x-1+resolution]+Vector3(0,0,size.z);
			p7 = vertex[preterrain1.neighbor.top].vertices[x+resolution]+Vector3(0,0,size.z);
		} 
		else {
			p6_a = false;
			p7_a = false;
		}
		
		p1 = vertex[preterrain1.index].vertices[x-1+(resolution*(resolution-2))];
		p4 = vertex[preterrain1.index].vertices[x-1+(resolution*(resolution-1))];
	}
	else if (x-1 < 0) {
		if (preterrain1.neighbor.left > -1) {
			p1 = vertex[preterrain1.neighbor.left].vertices[resolution-2+(resolution*(resolution-2))]-Vector3(size.x,0,0);
			p4 = vertex[preterrain1.neighbor.left].vertices[resolution-2+(resolution*(resolution-1))]-Vector3(size.x,0,0);
			
			if (preterrain1.neighbor.top_left > -1) {
				p6 = vertex[preterrain1.neighbor.top_left].vertices[resolution-2+resolution]-Vector3(size.x,0,-size.z);
			}
			else {
				p6_a = false;
			}
		}
		else {
			p1_a = false;
			p4_a = false;
			p6_a = false;
		} 
		
		if (preterrain1.neighbor.top > -1) {
			// p1 = vertex[preterrain1.neighbor.left].vertices[pos+resolution-1];
			p7 = vertex[preterrain1.neighbor.top].vertices[x+resolution]+Vector3(0,0,size.z);
			p8 = vertex[preterrain1.neighbor.top].vertices[x+1+resolution]+Vector3(0,0,size.z);
		} 
		else {
			p7_a = false;
			p8_a = false;
		}
		
		p3 = vertex[preterrain1.index].vertices[x+1+(resolution*(resolution-2))];
		p5 = vertex[preterrain1.index].vertices[x+1+(resolution*(resolution-1))];
	} 
	else {
		if (preterrain1.neighbor.top > -1) {
			// p1 = vertex[preterrain1.neighbor.left].vertices[pos+resolution-1];
			p6 = vertex[preterrain1.neighbor.top].vertices[x-1+resolution]+Vector3(0,0,size.z);
			p7 = vertex[preterrain1.neighbor.top].vertices[x+resolution]+Vector3(0,0,size.z);
			p8 = vertex[preterrain1.neighbor.top].vertices[x+1+resolution]+Vector3(0,0,size.z);
		} 
		else {
			p6_a = false;
			p7_a = false;
			p8_a = false;
		}
		
		p1 = vertex[preterrain1.index].vertices[x-1+(resolution*(resolution-2))];
		p3 = vertex[preterrain1.index].vertices[x+1+(resolution*(resolution-2))];
		p4 = vertex[preterrain1.index].vertices[x-1+(resolution*(resolution-1))];
		p5 = vertex[preterrain1.index].vertices[x+1+(resolution*(resolution-1))];
	}
	
	p0 = vertex[preterrain1.index].vertices[x+(resolution*(resolution-1))];
	p2 = vertex[preterrain1.index].vertices[x+(resolution*(resolution-2))];
	
	if (p1_a) {n = Vector3.Cross((p1 - p0), (p2 - p0));++total;}
	if (p3_a) {n += Vector3.Cross((p2 - p0), (p3 - p0));++total;}
	if (p1_a && p4_a) {n += Vector3.Cross((p4 - p0), (p1 - p0));++total;}
	if (p3_a && p5_a) {n += Vector3.Cross((p3 - p0), (p5 - p0));++total;}
	if (p6_a && p4_a) {n += Vector3.Cross((p6 - p0), (p4 - p0));++total;}
	if (p5_a && p8_a) {n += Vector3.Cross((p5 - p0), (p8 - p0));++total;}
	if (p6_a && p7_a) {n += Vector3.Cross((p7 - p0), (p6 - p0));++total;}
	if (p8_a && p7_a) {n += Vector3.Cross((p8 - p0), (p7 - p0));++total;}
	
	n = (n/total).normalized;
	n.y *= -1;
	normal.normal = n;
		
	if (p4_a) {lt = p4.y;} else {lt = p0.y;}
	if (p5_a) {rt = p5.y;} else {rt = p0.y;}
	
	t = Vector4(-space,rt-lt,0,-space);
	normal.tangent = t.normalized;
	
	return normal;
}

function calc_normal_border_bottom(preterrain1: terrain_class,space: float,vertex: List.<vertex_class>,x: int,resolution: int,size: Vector3): normal_class
{
	var normal: normal_class = new normal_class();
	
	var p0: Vector3; 
	var p1: Vector3;
	var p2: Vector3;
	var p3: Vector3;
	var p4: Vector3;
	var p5: Vector3;
	var p6: Vector3;
	var p7: Vector3;
	var p8: Vector3;
	
	var p1_a: boolean = true;
	var p2_a: boolean = true;
	var p3_a: boolean = true;
	var p4_a: boolean = true;
	var p5_a: boolean = true;
	var p6_a: boolean = true;
	var p8_a: boolean = true;
	
	var n: Vector3 = Vector3.zero;
	
	var t: Vector4;
	var lt: float;
	var rt: float;
	
	var total: float = 0;
	
	if (x+1 > resolution-1) {
		if (preterrain1.neighbor.right > -1) {
			p5 = vertex[preterrain1.neighbor.right].vertices[1]+Vector3(size.x,0,0);
			p8 = vertex[preterrain1.neighbor.right].vertices[1+resolution]+Vector3(size.x,0,0);
			
			if (preterrain1.neighbor.bottom_right > -1) {
				p3 = vertex[preterrain1.neighbor.bottom_right].vertices[1+(resolution*(resolution-2))]+Vector3(size.x,0,-size.z);
			} 
			else {
				p3_a = false;
			}	
		}
		else {
			p3_a = false;
			p5_a = false;
			p8_a = false;
		}
		
		if (preterrain1.neighbor.bottom > -1) {
			// p1 = vertex[preterrain1.neighbor.left].vertices[pos+resolution-1];
			p1 = vertex[preterrain1.neighbor.bottom].vertices[x-1+(resolution*(resolution-2))]-Vector3(0,0,size.z);
			p2 = vertex[preterrain1.neighbor.bottom].vertices[x+(resolution*(resolution-2))]-Vector3(0,0,size.z);
		} 
		else {
			p1_a = false;
			p2_a = false;
		}
		
		p6 = vertex[preterrain1.index].vertices[x-1+resolution];
		p4 = vertex[preterrain1.index].vertices[x-1];
	}
	else if (x-1 < 0) {
		if (preterrain1.neighbor.left > -1) {
			p6 = vertex[preterrain1.neighbor.left].vertices[resolution-2+resolution]-Vector3(size.x,0,0);
			p4 = vertex[preterrain1.neighbor.left].vertices[resolution-2]-Vector3(size.x,0,0);
			
			if (preterrain1.neighbor.bottom_left > -1) {
				p1 = vertex[preterrain1.neighbor.bottom_left].vertices[resolution-2+(resolution*(resolution-2))]-Vector3(size.x,0,size.z);
			}
			else {
				p1_a = false;
			}
		}
		else {
			p1_a = false;
			p4_a = false;
			p6_a = false;
		} 
		
		if (preterrain1.neighbor.bottom > -1) {
			// p1 = vertex[preterrain1.neighbor.left].vertices[pos+resolution-1];
			p2 = vertex[preterrain1.neighbor.bottom].vertices[x+(resolution*(resolution-2))]-Vector3(0,0,size.z);
			p3 = vertex[preterrain1.neighbor.bottom].vertices[x+1+(resolution*(resolution-2))]-Vector3(0,0,size.z);
		} 
		else {
			p2_a = false;
			p3_a = false;
		}
		
		p8 = vertex[preterrain1.index].vertices[x+1+resolution];
		p5 = vertex[preterrain1.index].vertices[x+1];
	} 
	else {
		if (preterrain1.neighbor.bottom > -1) {
			// p1 = vertex[preterrain1.neighbor.left].vertices[pos+resolution-1];
			p1 = vertex[preterrain1.neighbor.bottom].vertices[x-1+(resolution*(resolution-2))]-Vector3(0,0,size.z);
			p2 = vertex[preterrain1.neighbor.bottom].vertices[x+(resolution*(resolution-2))]-Vector3(0,0,size.z);
			p3 = vertex[preterrain1.neighbor.bottom].vertices[x+1+(resolution*(resolution-2))]-Vector3(0,0,size.z);
		} 
		else {
			p1_a = false;
			p2_a = false;
			p3_a = false;
		}
		
		p6 = vertex[preterrain1.index].vertices[x-1+resolution];
		p8 = vertex[preterrain1.index].vertices[x+1+resolution];
		p4 = vertex[preterrain1.index].vertices[x-1];
		p5 = vertex[preterrain1.index].vertices[x+1];
	}
	
	p0 = vertex[preterrain1.index].vertices[x];
	p7 = vertex[preterrain1.index].vertices[x+resolution];
	
	if (p1_a && p2_a) {n = Vector3.Cross((p1 - p0), (p2 - p0));++total;}
	if (p3_a && p2_a) {n += Vector3.Cross((p2 - p0), (p3 - p0));++total;}
	if (p1_a && p4_a) {n += Vector3.Cross((p4 - p0), (p1 - p0));++total;}
	if (p3_a && p5_a) {n += Vector3.Cross((p3 - p0), (p5 - p0));++total;}
	if (p6_a && p4_a) {n += Vector3.Cross((p6 - p0), (p4 - p0));++total;}
	if (p5_a && p8_a) {n += Vector3.Cross((p5 - p0), (p8 - p0));++total;}
	if (p6_a) {n += Vector3.Cross((p7 - p0), (p6 - p0));++total;}
	if (p8_a) {n += Vector3.Cross((p8 - p0), (p7 - p0));++total;}
	
	n = (n/total).normalized;
	n.y *= -1;
	normal.normal = n;
		
	if (p4_a) {lt = p4.y;} else {lt = p0.y;}
	if (p5_a) {rt = p5.y;} else {rt = p0.y;}
	
	t = Vector4(-space,rt-lt,0,-space);
	normal.tangent = t.normalized;
	
	return normal;
}

function set_terrains_neighbor()
{
	var terrain_number: int;
	
	for (var count_terrain: int = 0;count_terrain < terrains.Count;++count_terrain)
	{
		if (terrains[count_terrain].terrain)
		{
			terrain_number = search_tile(terrains[count_terrain].tile_x-1,terrains[count_terrain].tile_z);
			if (terrain_number != -1){terrains[count_terrain].neighbor.left = terrain_number;} else {terrains[count_terrain].neighbor.left = -1;}
			
			terrain_number = search_tile(terrains[count_terrain].tile_x,terrains[count_terrain].tile_z-1);
			if (terrain_number != -1){terrains[count_terrain].neighbor.top = terrain_number;} else {terrains[count_terrain].neighbor.top = -1;}
			
			terrain_number = search_tile(terrains[count_terrain].tile_x+1,terrains[count_terrain].tile_z);
			if (terrain_number != -1){terrains[count_terrain].neighbor.right = terrain_number;} else {terrains[count_terrain].neighbor.right = -1;}
			
			terrain_number = search_tile(terrains[count_terrain].tile_x,terrains[count_terrain].tile_z+1);
			if (terrain_number != -1){terrains[count_terrain].neighbor.bottom = terrain_number;} else {terrains[count_terrain].neighbor.bottom = -1;}
			
			terrain_number = search_tile(terrains[count_terrain].tile_x+1,terrains[count_terrain].tile_z+1);
			if (terrain_number != -1){terrains[count_terrain].neighbor.bottom_right = terrain_number;} else {terrains[count_terrain].neighbor.bottom_right = -1;}
			
			terrain_number = search_tile(terrains[count_terrain].tile_x-1,terrains[count_terrain].tile_z+1);
			if (terrain_number != -1){terrains[count_terrain].neighbor.bottom_left = terrain_number;} else {terrains[count_terrain].neighbor.bottom_left = -1;}
			
			terrain_number = search_tile(terrains[count_terrain].tile_x+1,terrains[count_terrain].tile_z-1);
			if (terrain_number != -1){terrains[count_terrain].neighbor.top_right = terrain_number;} else {terrains[count_terrain].neighbor.top_right = -1;}
			
			terrain_number = search_tile(terrains[count_terrain].tile_x-1,terrains[count_terrain].tile_z-1);
			if (terrain_number != -1){terrains[count_terrain].neighbor.top_left = terrain_number;} else {terrains[count_terrain].neighbor.top_left = -1;}
			
			terrains[count_terrain].neighbor.self = count_terrain;
			terrains[count_terrain].index = count_terrain;
		}
	}
}

#if !UNITY_WEBPLAYER && !UNITY_WP8
function load_raw_heightmaps()
{	
	var current_filter1: filter_class;
	var length: ulong;
	var resolution: ulong;
	
	for (var count_prelayer1: int = 0;count_prelayer1 < prelayers.Count;++count_prelayer1)
	{
		for (var count_layer1: int = 0;count_layer1 < prelayers[count_prelayer1].layer.Count;++count_layer1)
		{
			for (var count_filter: int = 0;count_filter < prelayers[count_prelayer1].layer[count_layer1].prefilter.filter_index.Count;++count_filter)
			{
				current_filter1 = filter[prelayers[count_prelayer1].layer[count_layer1].prefilter.filter_index[count_filter]];
					
				if (current_filter1.type == condition_type_enum.RawHeightmap)
				{
					for (var count_index: int = 0;count_index < current_filter1.raw.file_index.Count;++count_index)
					{
						if (current_filter1.raw.file_index[count_index] > -1)
						{
							if (!raw_files[current_filter1.raw.file_index[count_index]].loaded)
							{
								if (!raw_files[current_filter1.raw.file_index[count_index]].exists())
								{
									if (script_base != null) script_base.erase_raw_file(count_index);
									erase_raw_file(count_index);
									current_filter1.raw.file_index.RemoveAt(count_index);
									--count_index;
									if (current_filter1.raw.file_index.Count == 0)
									{
										erase_filter(count_filter,prelayers[count_prelayer1].layer[count_layer1].prefilter);
										--count_filter;
									}
									continue;
								}
								raw_files[current_filter1.raw.file_index[count_index]].bytes = File.ReadAllBytes(raw_files[current_filter1.raw.file_index[count_index]].file);
								length = raw_files[current_filter1.raw.file_index[count_index]].bytes.Length;
								resolution = raw_files[current_filter1.raw.file_index[count_index]].resolution.x*raw_files[current_filter1.raw.file_index[count_index]].resolution.y*2;
								if (length == resolution) {
									raw_files[current_filter1.raw.file_index[count_index]].loaded = true;
								}
								else {
									// this.ShowNotification(GUIContent("Heightmap loading because of selected resolution failed. Please check the console"));
									Debug.Log("Prelayer"+count_prelayer1+" -> Layer"+count_layer1+" -> Filter"+count_index
										+"\nThe Raw Heightmap file '"+raw_files[current_filter1.raw.file_index[count_index]].file+"' has a lower resolution than selected. Please check the File size. It should be X*Y*2 = "
										+raw_files[current_filter1.raw.file_index[count_index]].resolution.x+"*"+raw_files[current_filter1.raw.file_index[count_index]].resolution.y+"*2 = "
										+raw_files[current_filter1.raw.file_index[count_index]].resolution.x*raw_files[current_filter1.raw.file_index[count_index]].resolution.y*2+" Bytes ("+raw_files[current_filter1.raw.file_index[count_index]].resolution.x+"*"+raw_files[current_filter1.raw.file_index[count_index]].resolution.y+" resolution). But the File size is "+raw_files[current_filter1.raw.file_index[count_index]].bytes.Length
										+" Bytes ("+Mathf.Round(Mathf.Sqrt(raw_files[current_filter1.raw.file_index[count_index]].bytes.Length/2))+"x"+
										Mathf.Round(Mathf.Sqrt(raw_files[current_filter1.raw.file_index[count_index]].bytes.Length/2))+" resolution).");
		
									erase_raw_file(count_index);
									current_filter1.raw.file_index.RemoveAt(count_index);
									--count_index;
									if (current_filter1.raw.file_index.Count == 0)
									{
										erase_filter(count_filter,prelayers[count_prelayer1].layer[count_layer1].prefilter);
										--count_filter;
									}
									continue;
								}
							}
							if (count_prelayer1 == 0 && !prelayers[0].prearea.active){current_filter1.raw.set_raw_auto_scale(terrains[0],terrains[0].prearea.area_old,raw_files,count_index);}
							else 
							{
								current_filter1.raw.set_raw_auto_scale(terrains[0],prelayers[count_prelayer1].prearea.area_old,raw_files,count_index);
							}
						} 
						else 
						{
							current_filter1.raw.file_index.RemoveAt(count_index);
							--count_index;
							if (current_filter1.raw.file_index.Count == 0)
							{
								erase_filter(count_filter,prelayers[count_prelayer1].layer[count_layer1].prefilter);
								--count_filter;
								continue;
							}
						}
					}
				}
				load_raw_subfilter(current_filter1,count_prelayer1,count_layer1);
			}
		}
	}
}

function load_raw_subfilter(filter1: filter_class,count_prelayer1:int ,count_layer1: int)
{
	var current_subfilter1: subfilter_class;
	var length: ulong;
	var resolution: ulong;
	
	for (var count_subfilter: int = 0;count_subfilter < filter1.presubfilter.subfilter_index.Count;++count_subfilter)
	{
		current_subfilter1 = subfilter[filter1.presubfilter.subfilter_index[count_subfilter]];
			
		if (current_subfilter1.type == condition_type_enum.RawHeightmap)
		{
			for (var count_index: int = 0;count_index < current_subfilter1.raw.file_index.Count;++count_index)
			{
				if (current_subfilter1.raw.file_index[count_index] > -1)
				{
					if (!raw_files[current_subfilter1.raw.file_index[count_index]].loaded)
					{
						if (!raw_files[current_subfilter1.raw.file_index[count_index]].exists())
						{
							script.erase_raw_file(count_index);
							erase_raw_file(count_index);
							current_subfilter1.raw.file_index.RemoveAt(count_index);
							--count_index;
							if (current_subfilter1.raw.file_index.Count == 0)
							{
								erase_subfilter(count_subfilter,filter1.presubfilter);
								--count_subfilter;
							}
							continue;
						}
						raw_files[current_subfilter1.raw.file_index[count_index]].bytes = File.ReadAllBytes(raw_files[current_subfilter1.raw.file_index[count_index]].file);
						length = raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length;
						resolution = raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x*raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y*2;
						if (length == resolution) {
							raw_files[current_subfilter1.raw.file_index[count_index]].loaded = true;
						}
						else {
							// this.ShowNotification(GUIContent("Heightmap loading because of selected resolution failed. Please check the console"));
							Debug.Log("Prelayer"+count_prelayer1+" -> Layer"+count_layer1+" -> subfilter"+count_index
								+"\nThe Raw Heightmap file '"+raw_files[current_subfilter1.raw.file_index[count_index]].file+"' has a lower resolution than selected. Please check the File size. It should be X*Y*2 = "
								+raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x+"*"+raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y+"*2 = "
								+raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x*raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y*2+" Bytes ("+raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x+"*"+raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y+" resolution). But the File size is "+raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length
								+" Bytes ("+Mathf.Round(Mathf.Sqrt(raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length/2))+"x"+
								Mathf.Round(Mathf.Sqrt(raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length/2))+" resolution).");

							erase_raw_file(count_index);
							current_subfilter1.raw.file_index.RemoveAt(count_index);
							--count_index;
							if (current_subfilter1.raw.file_index.Count == 0)
							{
								erase_subfilter(count_subfilter,filter1.presubfilter);
								--count_subfilter;
							}
							continue;
						}
					}
					if (count_prelayer1 == 0 && !prelayers[0].prearea.active){current_subfilter1.raw.set_raw_auto_scale(terrains[0],terrains[0].prearea.area_old,raw_files,count_index);}
					else 
					{
						current_subfilter1.raw.set_raw_auto_scale(terrains[0],prelayers[count_prelayer1].prearea.area_old,raw_files,count_index);
					}
				} 
				else 
				{
					current_subfilter1.raw.file_index.RemoveAt(count_index);
					--count_index;
					if (current_subfilter1.raw.file_index.Count == 0)
					{
						erase_subfilter(count_subfilter,filter1.presubfilter);
						--count_subfilter;
						continue;
					}
				}
			}
		}
	}
}
#endif