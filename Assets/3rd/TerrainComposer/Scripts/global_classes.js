static class TC {
	function GetAllSubTypes(aBaseClass: System.Type): System.Type[]
	{
		var result: List.<System.Type> = new List.<System.Type>();
		var AS: System.Reflection.Assembly[] = System.AppDomain.CurrentDomain.GetAssemblies();
		var types: System.Type[];
		 
		for (var A: System.Reflection.Assembly in AS) {
		     types = A.GetTypes();
		     for (var T: System.Type in types) {
		         if (T.IsSubclassOf(aBaseClass))
		             result.Add(T);
		     }
		 }
		 return result.ToArray();
	}
		
	function GetType(t: System.Type,typeName: String): System.Type
	{
		for (var T:System.Type in GetAllSubTypes(t)) {
		     if (T.Name == typeName) {
		     	// Debug.Log(T.Name);
		     	return T;
		     }
		 }
		 return null;
	}
}

class gui_class
{
	var column: List.<float> = new List.<float>();
	
	var y: float;
	var x: float;
	
	function gui_class(columns: int)
	{
		for (var count_column: int = 0;count_column < columns;++count_column) {
			column.Add(0);
		}
	}
	
	function getRect(column_index: int,width: float,y1: float,add_width: boolean,add_height: boolean): Rect
	{
		var x_old: float = x;
		var y_old: float = y;
		if (add_width) {x += width;}
		if (add_height) {y += y1;}
		return Rect(column[column_index]+x_old,y_old,width,y1);
	}
	
	function getRect(column_index: int,x1: float,width: float,y1: float,add_width: boolean,add_height: boolean): Rect
	{
		var x_old: float = x;
		var y_old: float = y;
		if (add_width) {x += width+x1;}
		if (add_height) {y += y1;}
		return Rect(column[column_index]+x_old+x1,y_old,width,y1);
	}
}

class edit_class
{
	var text: String = String.Empty;
	var default_text: String = String.Empty;
	var edit: boolean = false;
	var disable_edit: boolean = false;
	var rect: Rect;
}

class global_settings_class 
{
	var undo: boolean = false;
	var positionSeed: boolean = true;
	var color: color_settings_class = new color_settings_class();
	var color_scheme_display: boolean = false;
	var color_scheme: boolean = true;
	
	var toggle_text_no: boolean = false;
	var toggle_text_short: boolean = true;
	var toggle_text_long: boolean = false;
	var tooltip_text_no: boolean = false;
	var tooltip_text_short: boolean = false;
	var tooltip_text_long: boolean = true;
	var mac_mode: boolean = false;
	
	
	var tooltip_mode: int = 2;
	
	var myExt: WWW;
    var myExt2: WWW;
    var myExt3: WWW;
    var myExt4: WWW;
    
    var restrict_resolutions: boolean = true;
    var load_terrain_data: boolean = false;
    
    var rtp: boolean = false;
    var video_help: boolean = true;
    var view_only_output: boolean = true;
    var save_global_timer: float = 5;
    
    var download: WWW;
    var downloading: int = 0;
    var download_foldout: boolean = true;
    var download_display: boolean = true;
    
    var download2: WWW;
    var downloading2: int = 0;
    var download_foldout2: boolean = true;
    var download_display2: boolean = true;
    
    var wc_contents: WWW;
    var wc_loading: int;
    var old_version: float;
	var new_version: float;
	var update_display: boolean = false;
	var update_display2: boolean = false;
	var update_version: boolean = false;
	var update_version2: boolean = false;
	var update: String[] = ["Don't check","Notify","Download and notify","Download,import and notify","Download and import automatically"]; 
	var time_out: float;
	
    var button_export: boolean = true;
    var button_measure: boolean = true;
    var button_capture: boolean = true;
    var button_tools: boolean = true;
    var button_tiles: boolean = true;
    var button_node: boolean = true; 
    var button_world: boolean = true;
    
    // example
    var example_display: boolean = true;
    var example_resolution: int = 3;
    // var example_tiles: int = 2;
    var exampleTerrainTiles: Vector2 = new Vector2(2,2);
    var example_terrain: int = 0;
    var example_terrain_old1: int = -1;
    var example_tree_active: boolean = true;
    var example_grass_active: boolean = true;
    var example_object_active: boolean = true;
    
    var example_buttons: int = 1;
}

class terrain_region_class
{
	var active: boolean = true;
	var foldout: boolean = true;
	var text: String = "Terrain Area";
	var area: List.<terrain_area_class> = new List.<terrain_area_class>();
	var area_select: int = 0;
	var mode: int = 0;
	var area_size: Rect;
	
	
	// mode
	// 0 -> fitting tiles
	// 1 -> custom tiles
	
	function terrain_region_class()
	{
		area.Add(new terrain_area_class());
	}
	
	function add_area(index: int)
	{
		area.Insert(index,new terrain_area_class());
		set_area_index();
		set_area_text();
		area[index].set_terrain_text();
		area[index].path = Application.dataPath;
	}
	
	function erase_area(index: int)
	{
		area.RemoveAt(index);
		set_area_index();
		set_area_text();
	}
	
	function set_area_index()
	{
		for (var count_area: int = 0;count_area < area.Count;++count_area)
		{
			area[count_area].index = count_area;
		}
	}
	
	function set_area_text()
	{
		if (area.Count > 1){text = "Terrain Areas";} else {text = "Terrain Area";}
	}
} 

// terrain area class
class terrain_area_class
{
	var terrains: List.<terrain_class2> = new List.<terrain_class2>();
	var index: int;
	var tiles: tile_class = new tile_class();
	var tiles_select: tile_class = new tile_class(); 
	var tiles_total: int;
	var tiles_select_total: int;
	var tiles_assigned_total: int;
	var tiles_select_link: boolean = true;
	var size: Vector3;
	var center: Vector3 = new Vector3(0,0,0);
	var edit: boolean = false;
	var disable_edit: boolean = false;
	var area_foldout: boolean = false;
	var tiles_foldout: boolean = false;
	var settings_foldout: boolean = false;
	var center_synchronous: boolean = true; 
	var tile_synchronous: boolean = true;
	var tile_position_synchronous: boolean = true;
	var rect: Rect;
	var rect1: Rect;
	var text: String;
	var text_edit: String = String.Empty;
	var display_short: boolean;
	var remarks: remarks_class = new remarks_class();
	var copy_settings: boolean = true;
	var copy_terrain: int = 0;
	
	var foldout: boolean = true;
	var terrains_active: boolean = true;
	var terrains_scene_active: boolean = true;
	var terrains_foldout: boolean = true;
	
	var auto_search: auto_search_class = new auto_search_class();
	var auto_name: auto_search_class = new auto_search_class();
	
	var path: String;
	var parent: Transform;
	var scene_name: String = "Terrain";
	var asset_name: String = "New Terrain";
	
	var resize: boolean = false;
	
	var resize_left: boolean = false;
	var resize_right: boolean = false;
	var resize_top: boolean = false;
	var resize_bottom: boolean = false;
	var resize_topLeft: boolean = false;
	var resize_topRight: boolean = false;
	var resize_bottomLeft: boolean = false;
	var resize_bottomRight: boolean = false;
	var resize_center: boolean = false;
	
	function terrain_area_class()
	{
		set_terrain_text();
	}
	
	function clear()
	{
		terrains.Clear();
		set_terrain_text();
	}
	
	function clear_to_one()
	{
		var length: int = terrains.Count;
		for (var count_terrain: int = 1;count_terrain < length;++count_terrain)
		{
			terrains.RemoveAt(1);
		}
		set_terrain_text();
	}
	
	function set_terrain_text() 
	{
		if (text_edit.Length == 0)
		{
			if (terrains.Count > 1){text = "Terrains";} else {text = "Terrain";}
		}
		else {text = text_edit;}
		
		text += " ("+terrains.Count.ToString()+")";
	}
}

// terrain_class
class terrain_class2
{
	var active: boolean = true;
	var foldout: boolean = false;
	var index: int;
	var index_old: int;
	var on_row: boolean = false;
	var color_terrain: Color = Color(2,2,2,1);
	
	// var heights: float[,];
	var rtp_script: Component;
	
	var splat_alpha: Texture2D[];
	
	var terrain: Terrain;
	var parent: Transform;
	var name: String;
	var prearea: area_class = new area_class();
	var map: float[,,];
	var splatPrototypes: List.<splatPrototype_class> = new List.<splatPrototype_class>();
	var colormap: splatPrototype_class = new splatPrototype_class();
	var splats_foldout: boolean = false;
	var treePrototypes: List.<treePrototype_class> = new List.<treePrototype_class>();
	var trees_foldout: boolean = false;
	var detailPrototypes: List.<detailPrototype_class> = new List.<detailPrototype_class>();
	var details_foldout: boolean = false;
	var tree_instances: List.<TreeInstance> = new List.<TreeInstance>();
	var splat: float[];
	var splat_calc: float[];
	var color: float[];
	var splat_layer: float[];
	var color_layer: float[];
	var grass: float[];
	
	var heightmap_resolution_list: int = 5;
	var splatmap_resolution_list: int = 4;
	var basemap_resolution_list: int = 4;
	var detailmap_resolution_list: int;
	var detail_resolution_per_patch_list: int = 0;
	
	var size: Vector3 = Vector3(1000,250,1000);
	var size_xz_link: boolean = true;
	var tile_x: int;
	var tile_z: int;
	var tiles: Vector2 = Vector2(1,1);
	var rect: Rect;
	
	var data_foldout: boolean = true;
	var scale: Vector3;
	
	var maps_foldout: boolean = false;
	
	var settings_foldout: boolean = false;
	var resolution_foldout: boolean = true;
	var scripts_foldout: boolean = false;
	var reset_foldout: boolean = false;
	var size_foldout: boolean = false;
	
	var raw_file_index: int = -1;
	var raw_save_file: raw_file_class = new raw_file_class();
	
	// resolutions
	var heightmap_resolution: int = 129;
	var splatmap_resolution: int = 128;
	var detail_resolution: int = 128;
	var detail_resolution_per_patch: int = 8;
	var basemap_resolution: int = 128;
	
	var size_synchronous: boolean = true;
	var resolutions_synchronous: boolean = true;
	var splat_synchronous: boolean = true;
	var tree_synchronous: boolean = true;
	var detail_synchronous: boolean = true;
	
	var splatmap_conversion: Vector2;
	var heightmap_conversion: Vector2;
	var detailmap_conversion: Vector2;
	
	var splat_foldout: boolean = false;
	var splat_length: int;
	var color_length: int;
	
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
	// var script_triplanar: TriPlanarTerrainScript_TC;
	
	var settings_runtime: boolean = false;
	var settings_editor: boolean = true;
	
	var wavingGrassSpeed: float = 0.5;
	var wavingGrassAmount: float = 0.5;
	var wavingGrassStrength: float = 0.5;
	var wavingGrassTint: Color = Color(0.698,0.6,0.50);
	
	var neighbor: neighbor_class = new neighbor_class();
	
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
}
 
class neighbor_class
{
	var left: int = -1;
	var right: int = -1;
	var top: int = -1;
	var bottom: int = -1;
	
	var top_left: int = -1;
	var top_right: int = -1;
	var bottom_left: int = -1;
	var bottom_right: int = -1;
	var self: int;
}

class raw_file_class
{
	var assigned: boolean = false;
	var created: boolean = true;
	var file: String = String.Empty;
	var filename: String = String.Empty;
	var mode: raw_mode_enum = raw_mode_enum.Windows;
	var length: int;
	var resolution: Vector2;
	var square: boolean = true;
	var loaded: boolean = false;
	
	var linked: boolean = true;
	
	var bytes: byte[];
	var fs: FileStream;
	var product1: float;
	var product2: float;
	
	function exists(): boolean
	{
		var file_info: FileInfo = new FileInfo(file);
	
		if (file_info.Exists){return true;} else {return false;}
	}
}

// detail_class
class detail_class
{
	var detail: int[,];
}

// map class
class map_class
{	var type: map_type_enum;
	var timeOut: int = 4;
	var active: boolean = true;
	var button_parameters: boolean = true;
	var button_image_editor: boolean = true;
	var button_region: boolean = true;
	var button_image_export: boolean = true; 
	var button_heightmap_export: boolean = true; 
	var button_converter: boolean = false;
	var button_settings: boolean = true;
	var button_create_terrain: boolean = false;
	var button_help: boolean = false;
	var button_update: boolean = false;
	var alpha: float = 0.65;
	var backgroundColor: Color; 
	var titleColor: Color;
	var errorColor: Color = new Color(127.0/255.0,127.0/255.0,127.0/255.0);
	var region_popup_edit: boolean = false;
	var area_popup_edit: boolean = false;
	var disable_region_popup_edit: boolean = false;
	var disable_area_popup_edit: boolean = false;
	
	var region: List.<map_region_class> = new List.<map_region_class>();
	var region_popup: String[];
	var region_select: int = 0;
	var manual_edit: boolean = false;
	
	var region_rect: Rect;
	var area_rect: Rect;
	
	var preimage_edit: preimage_edit_class = new preimage_edit_class();
	
	// var heights: float[,];
	var color_fault: Color;
	var tex1: Texture2D;
	var tex2: Texture2D;
	var tex3: Texture2D;
	
	var file_tex2: FileStream;
	var file_tex3: FileStream;
	
	var tex_swapped: boolean = false;
	var tex2_tile: tile_class = new tile_class();
	var tex3_tile: tile_class = new tile_class();
	var elExt_check: WWW;
	var elExt_check_loaded: boolean = false;
	var elExt_check_assign: boolean = false;

	var elExt: List.<ext_class> = new List.<ext_class>();
	var texExt: List.<ext_class> = new List.<ext_class>();
	
	var time_start_elExt: List.<float> = new List.<float>();
	var time_start_texExt: List.<float> = new List.<float>();
	
	var export_texExt: int = 8; 
	var export_elExt: int = 16;
	
	var mode: int = 0;
	
	var export_tex3: boolean = false;
	var export_tex2: boolean = false;
	var export_heightmap_area: latlong_area_class = new latlong_area_class();
	var export_image_area: latlong_area_class = new latlong_area_class();
	
	var export_pullIndex: tile_class = new tile_class();
	var export_pulled: int;
	var export_image_active: boolean = false;
	var export_heightmap_active: boolean = false;
	var export_heightmap_zoom: int;
	var export_heightmap_timeStart: float;
	var export_heightmap_timeEnd: float;
	var export_heightmap_timePause: float;
	var export_heightmap_continue: boolean = true;
	
	var export_heightmap: map_export_class = new map_export_class();
	var export_image: map_export_class = new map_export_class();
	
	var export_image_zoom: int;
	var export_image_timeStart: float;
	var export_image_timeEnd: float;
	var export_image_timePause: float;
	var export_image_continue: boolean = true;
	var export_jpg_quality: int = 100; 
	var export_jpg: boolean = true;
	var export_png: boolean = false;
	var export_raw: boolean = false;
	var color: Color = Color.red;
	
	var key_edit: boolean = false;
	var bingKey: List.<map_key_class> = new List.<map_key_class>();
	var bingKey_selected: int = 0;
	
	var mouse_sensivity: float = 2;
	var path_display: boolean = false;
	
	var warnings: boolean = true;
	var track_tile: boolean = true;
	
	var snap: boolean = false;
	var snapValue: float = 0.1;
	
	function map_class()
	{
		make_region_popup();
	}
	
	function make_region_popup()
	{
		region_popup = new String[region.Count];
		
		for (var count_region: int = 0;count_region < region.Count;++count_region)
		{
			region_popup[count_region] = region[count_region].name;
		}	
	}
}

class buffer_class
{
	var file: FileStream;
	var resolution: Vector2;
	var bytes: byte[];
	var length: ulong;
	var size: Vector2;
	var tiles: tile_class = new tile_class();
	var pos: ulong;
	var row: ulong;
	
	var innerRect: Rect;
	var outerRect: Rect;
	var offset: Vector2;
	var radius: int;
	
	
	function init()
	{
		// size.x = resolution.x/tiles.x;
		// size.y = resolution.y/tiles.y;
		
		tiles.x = Mathf.Ceil(resolution.x/size.x);
		tiles.y = Mathf.Ceil(resolution.x/size.y);
		
		// Debug.Log("Tiles x"+tiles.x+" y"+tiles.y+" resolution: "+resolution.x+" size: "+size.x);
		
		row = resolution.x*3;
	}
	
	function getRects(tile: tile_class)
	{
		var r: int = radius+20;
		
		innerRect.x = (tile.x*size.x)-5;
		innerRect.y = (tile.y*size.y)-5;
		innerRect.width = size.x+10;
		innerRect.height = size.y+10;
		
		if (innerRect.xMin < 0) {innerRect.xMin = 0;}
		if (innerRect.yMin < 0) {innerRect.yMin = 0;}
		if (innerRect.xMax > resolution.x) {innerRect.xMax = resolution.x;}
		if (innerRect.yMax > resolution.y) {innerRect.yMax = resolution.y;}
		
		outerRect.xMin = innerRect.xMin-r;
		outerRect.yMin = innerRect.yMin-r;
		outerRect.xMax = innerRect.xMax+r;
		outerRect.yMax = innerRect.yMax+r;
		
		if (outerRect.xMin < 0) {outerRect.xMin = 0;}
		else if (outerRect.xMax > resolution.x) {outerRect.xMax = resolution.x;}
		if (outerRect.yMin < 0) {outerRect.yMin = 0;}
		else if (outerRect.yMax > resolution.y) {outerRect.yMax = resolution.y;}
		
		length = outerRect.width*outerRect.height*3; 
		
		offset.x = (innerRect.x-outerRect.x);
		offset.y = (innerRect.y-outerRect.y);
		
		if (!bytes) {bytes = new byte[length];}
		if (bytes.Length != length) {bytes = new byte[length];}
		
		// Debug.Log("offset: "+offset); 
		// Debug.Log("inner x: "+innerRect.x+" y: "+innerRect.y+" xMax: "+innerRect.xMax+" yMax: "+innerRect.yMax+" Width: "+innerRect.width+" Height: "+innerRect.height);
		// Debug.Log("outer x: "+outerRect.x+" y: "+outerRect.y+" xMax: "+outerRect.xMax+" yMax: "+outerRect.yMax+" Width: "+outerRect.width+" Height: "+outerRect.height);
		// Debug.Log("bytes: "+bytes.Length);
	}
	
	function read()
	{
		for (var y: int = 0;y < outerRect.height;++y) {
			pos = (row*outerRect.y)+(row*y)+(outerRect.x*3);
			
			file.Seek (pos,SeekOrigin.Begin);
			file.Read (bytes,outerRect.width*y*3,outerRect.width*3);
		}
	}
	
	function write()
	{
		for (var y: int = 0;y < innerRect.height;++y) {
			pos = (row*innerRect.y)+(row*y)+(innerRect.x*3);
			
			file.Seek (pos,SeekOrigin.Begin);
			file.Write (bytes,(outerRect.width*y*3)+(outerRect.width*3*offset.y)+(offset.x*3),innerRect.width*3);
		}
		// file.Write (bytes,outerRect.width*y*3,innerRect.width*3);
	}
	
	function copy_bytes(bytes1: byte[],bytes2: byte[])
	{
		for (var count_byte: ulong = 0;count_byte < bytes1.Length;++count_byte) {
			bytes2[count_byte] = bytes1[count_byte];
		}
	}
	
	function clear_bytes()
	{
		for (var count_byte: ulong = 0;count_byte < bytes.Length;++count_byte) {
			bytes[count_byte] = 0;
		}
	}
}

class map_export_class
{
	var last_tile: boolean = false;
	var tiles: tile_class = new tile_class();
	var tile: tile_class = new tile_class();
	var subtiles: tile_class = new tile_class();
	var subtile: tile_class = new tile_class();
	var subtiles_total: int;
	var subtile_total: int;
	var subtile2_total: int;
	
	var progress: float; 
	
}

class map_key_class
{
	var pulls_startDay: int = 0;
	var pulls_startHour: int = 0;
	var pulls_startMinute: int = 0;
	var pulls: int = 0;
	var key: String;
	
	function reset()
	{
		pulls = 0;
		pulls_startDay = System.DateTime.Now.Day;
		pulls_startHour = System.DateTime.Now.Hour; 
		pulls_startMinute = System.DateTime.Now.Minute;
	}
}

class ext_class
{
	var pull: WWW;
	var loaded: boolean;
	var converted: boolean = false;
	var error: int = 0;
	var tile: tile_class = new tile_class();
	var subtile: tile_class = new tile_class();
	var latlong_area: latlong_area_class = new latlong_area_class();
	var latlong_center: latlong_class = new latlong_class();
	var url: String; 
	var bres: Vector2;
	var zero_error: int = 0;
	var download_error: int = 0;
}

// map region class
class map_region_class
{ 
	var name: String = "Untitled";
	var area: List.<map_area_class> = new List.<map_area_class>();
	var area_popup: String[];
	var area_select: int = 0;
	var center: latlong_class = new latlong_class();
	
	function map_region_class(index: int)
	{
		name += index.ToString();
		// make_area_popup();
	}
	
	function make_area_popup()
	{
		area_popup = new String[area.Count];
		
		for (var count_area: int = 0;count_area < area.Count;++count_area)
		{
			area_popup[count_area] = area[count_area].name;
		}	
	}
}

class tile_class
{
	var x: int = 0;
	var y: int = 0;
	
	function tile_class()
	{
	
	}
	
	function tile_class(x1: int,y2: int)
	{
		x = x1;
		y = y2;
	}
	
	function reset()
	{
		x = 0;
		y = 0;
	}
}

// map area class
class map_area_class
{ 
	var name: String = "Untitled";
	
	var upper_left: latlong_class = new latlong_class();
	var lower_right: latlong_class = new latlong_class();
	var center: latlong_class = new latlong_class();
	var center_height: int;
	var size: map_pixel_class = new map_pixel_class();
	var normalizeHeightmap: boolean = true;
	var normalizedHeight: float;
	
	var created: boolean = false;
	// mode 0 -> Nothing
	// mode 1 -> Area Select
	// mode 2 -> Resize
	var resize: boolean = false;
	var resize_left: boolean = false;
	var resize_right: boolean = false;
	var resize_top: boolean = false;
	var resize_bottom: boolean = false;
	var resize_topLeft: boolean = false;
	var resize_topRight: boolean = false;
	var resize_bottomLeft: boolean = false;
	var resize_bottomRight: boolean = false;
	var resize_center: boolean = false;
	
	var manual_area: boolean = false;
	var heightmap_offset: Vector2 = new Vector2(0,0);
	var heightmap_offset_e: Vector2;
	var image_offset_e: Vector2;
	var image_stop_one: boolean = false;
	
	var select: int = 0;
	var smooth_strength: float = 1;
	
	var width: float;
	var height: float; 
	
	var heightmap_resolution: Vector2;
	var heightmap_scale: double;
	var	heightmap_zoom: int = 0;
	var elevation_zoom: int;
	var heightmap_manual: boolean = false;
	 
	var area_resolution: double;
	var resolution: int = 2048;
	var image_zoom: int = 18;
	var image_changed: boolean = false;
	
	var start_tile_enabled: boolean = false; 
	var start_tile: tile_class = new tile_class();
	var tiles: tile_class = new tile_class();
	
	var export_heightmap_active: boolean = false;
	var export_heightmap_call: boolean = false;
	var export_heightmap_path: String = String.Empty;
	var export_heightmap_filename: String = String.Empty;
	var export_heightmap_changed: boolean = false;
	var export_heightmap_not_fit: boolean = false;  
	var export_heightmap_bres: Vector2;
	
	var export_image_active: boolean = false;
	var export_image_call: boolean = false;
	var export_image_path: String = String.Empty;
	var export_image_filename: String = String.Empty;
	var export_image_changed: boolean = false;
	var export_image_import_settings: boolean = false;
	var export_image_world_file: boolean = false;
	
	var export_terrain_path: String = String.Empty;
	var export_terrain_changed: boolean = false;
	var export_to_terraincomposer: boolean = true;
	var import_heightmap_path_full: String;
	var import_heightmap: boolean = false;
	var filter_perlin: boolean = false;
	
	var converter_source_path_full: String = String.Empty;
	var converter_destination_path_full: String = String.Empty; 
	var converter_resolution: Vector2; 
	var converter_height: float = 9000;
	var converter_import_heightmap: boolean = false; 
	
	var terrain_asset_name: String = String.Empty;
	var terrain_scene_name: String = String.Empty;
	var terrain_name_changed: boolean = false;
	 
	var terrain_height: float = 9000;
	var terrain_scale: float = 1;
	var terrain_curve: AnimationCurve;
	var do_heightmap: boolean = true;
	var do_image: boolean = true;
	var terrain_heightmap_resolution_select: int;
	var terrain_heightmap_resolution: int;
	var terrain_heightmap_resolution_changed: boolean = false;
	var mipmapEnabled: boolean = true;
	var terrain_done: boolean = false;
	#if UNITY_EDITOR
	var filterMode: FilterMode = FilterMode.Trilinear;
	#endif
	var anisoLevel: int = 9; 
	var maxTextureSize: int;
	var maxTextureSize_select: int = 6;
	var maxTextureSize_changed: boolean = false;
	var auto_import_settings_apply = true;
	#if UNITY_EDITOR
	var textureFormat: TextureImporterFormat = TextureImporterFormat.AutomaticCompressed;
	#endif
	
	// var preimage_active: boolean = false;
	var preimage_export_active: boolean = false;
	var preimage_apply: boolean = false;
	var preimage_save_new: boolean = false;
	var preimage_path: String = String.Empty; 
	var preimage_path_changed: boolean = false;
	var preimage_filename: String;
	var preimage_count: int;
		
	function map_area_class(name1: String,index: int)
	{
		name = name1+index.ToString();
		
		terrain_curve = new AnimationCurve.Linear(0,0,1,1);
		terrain_curve.AddKey(1,0);
		terrain_curve = set_curve_linear(terrain_curve);
	}
	
	function reset()
	{
		upper_left.reset();
		lower_right.reset();
		center.reset();
		size.reset();
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
}

class preimage_edit_class
{
	var edit_color: List.<image_edit_class> = new List.<image_edit_class>();
	var y1: int;
	var x1: int;
	var x: int;
	var y: int;
	var frames: float;
	var auto_speed_time: float;
	private var target_frame: float = 30;
	var time_start: float;
	var time: float = 0;;
	var generate: boolean = false;
	var loop: boolean = false;
	var generate_call: boolean = false;
	var active: boolean = true;
	var loop_active: boolean = true;
	var import_settings: boolean = false;
	var regen: boolean = false;
	var regenRaw: boolean = false;
	var border: boolean = false;
	var progress: float;
	
	var resolution: Vector2;
	var resolutionRaw: Vector2;
	var byte1: byte[] = new byte[3];
	
	var raw: boolean = false;
	
	var xx: int = 3;
	var position: Vector2 = new Vector2(x-1,y-1);
	var position2: Vector2;
	var direction: Vector2 = new Vector2(1,0);
	var dir: int = 1;
	var pos_old: Vector2;
	var first: boolean = false;
	var count: int = 0;
	var inputBuffer: buffer_class = new buffer_class();
	var outputBuffer: buffer_class = new buffer_class();
	var radius: int = 300;
	var radiusSelect: int = 300;
	var mode: int = 1;
	var tile: tile_class = new tile_class();
	var repeat: int;
	var repeatAmount: int = 3;
	var content: boolean = true;
			
	function calc_color_pos(color: Color,color_start: Color,color_end: Color): float
	{
		var color_start2: Color = color_start;
		var color_range: Color;
		if (color_start.r > color_end.r){color_start.r = color_end.r;color_end.r = color_start2.r;}
		if (color_start.g > color_end.g){color_start.g = color_end.g;color_end.g = color_start2.g;}
		if (color_start.b > color_end.b){color_start.b = color_end.b;color_end.b = color_start2.b;}
		color_range = color_end - color_start;
		color -= color_start;
		if (color.r < 0 || color.g < 0 || color.b < 0){return -1;}
		if (color.r > color_range.r || color.g > color_range.g || color.b > color_range.b){return -1;}
			
		var color_range_total: float = (color_range.r+color_range.g+color_range.b);
		var color_total: float = (color.r+color.g+color.b);
		if (color_range_total != 0){return (color_total/color_range_total);} else {return 1;}
	}
	
	function calc_color_from_pos(pos: float,color_start: Color,color_end: Color): Color
	{
		var color_start2: Color = color_start;
		var color_range: Color;
		if (color_start.r > color_end.r){color_start.r = color_end.r;color_end.r = color_start2.r;}
		if (color_start.g > color_end.g){color_start.g = color_end.g;color_end.g = color_start2.g;}
		if (color_start.b > color_end.b){color_start.b = color_end.b;color_end.b = color_start2.b;}
		color_range = color_end - color_start;
		
		var color: Color = color_start+Color(color_range.r*pos,color_range.g*pos,color_range.b*pos);
		// if (color_range_total != 0){return (color_total/color_range_total);} else {return 1;}
		return color;
	}
	
	function swap_color(color_index1: int,color_index2: int) 
	{
		var color3: image_edit_class = edit_color[color_index1];
		
		edit_color[color_index1] = edit_color[color_index2];
		edit_color[color_index2] = color3;
	}
	
	function copy_color(color_index1: int,color_index2: int)
	{
		edit_color[color_index1].color1_start = edit_color[color_index2].color1_start;
		edit_color[color_index1].color1_end = edit_color[color_index2].color1_end;
		edit_color[color_index1].curve1 = edit_color[color_index2].curve1;
		edit_color[color_index1].color2_start = edit_color[color_index2].color2_start;
		edit_color[color_index1].color2_end = edit_color[color_index2].color2_end;
		edit_color[color_index1].curve2 = edit_color[color_index2].curve2;
		edit_color[color_index1].strength = edit_color[color_index2].strength;
		edit_color[color_index1].output = edit_color[color_index2].output;
		edit_color[color_index1].active = edit_color[color_index2].active;
		edit_color[color_index1].solid_color = edit_color[color_index2].solid_color;
	}
	
	function convert_texture_raw(multithread: boolean)
	{
		var count_color: int = 0;
		var color: Color;
		var color2: Color; 
		var color3: Color;
		var color_pos1: float;
		var color_pos2: float;
		var strength: float;
		var curve: float;
		var free: boolean = true;
		
		// frames = 1/(Time.realtimeSinceStartup-auto_speed_time);
 		auto_speed_time = Time.realtimeSinceStartup; 
 		pos_old.y = -100;
		
		for (y = y1;y < (inputBuffer.innerRect.height+inputBuffer.offset.y);++y) {
			
			xx = 3;
			position = new Vector2(-1,y-1);
			direction = new Vector2(1,0);
			dir = 1;	
			count = 0;
			
			for (x = inputBuffer.offset.x+x1;x < (inputBuffer.innerRect.width+inputBuffer.offset.x);++x) {
				color = GetPixelRaw(inputBuffer,x,y);
				color3 = color;
				
				for (count_color = 0;count_color < edit_color.Count;++count_color) {
					if ((edit_color[count_color].active || edit_color[count_color].solid_color)) {
						color_pos1 = calc_color_pos(color,edit_color[count_color].color1_start,edit_color[count_color].color1_end);
						
						if (color_pos1 != -1) {
							color_pos1 = edit_color[count_color].curve1.Evaluate(color_pos1);
							color_pos2 = edit_color[count_color].curve2.Evaluate(color_pos1);
							color2 = calc_color_from_pos(color_pos2,edit_color[count_color].color2_start,edit_color[count_color].color2_end);
							strength = edit_color[count_color].strength;
							
							if (!edit_color[count_color].solid_color) {
								if (edit_color[count_color].output == image_output_enum.content) {
									if (x == pos_old.x+1 && y == pos_old.y && xx > 3) {
										if (dir == 1) {
											if (count == 0) {
												position.x += 1;
												xx -= 2;
											}
											else {
												--count;
											}
										}
										else if (dir == 2) {
											xx -= 2;
										}
										else if (dir == 3 || dir == 4) {
											position.x = x+((xx-1)/2);
											position.y = y-((xx-1)/2);
											dir = 2;
											count = 0;
											direction = Vector2(-1,0); 
										}
										color2 = content_fill_raw(x,y,edit_color[count_color].color1_start,edit_color[count_color].color1_end,edit_color[count_color].color2_start,false);
									}
									else {
										color2 = content_fill_raw(x,y,edit_color[count_color].color1_start,edit_color[count_color].color1_end,edit_color[count_color].color2_start,true);
									}
									pos_old = new Vector2(x,y);
									color3 = color2;
								}
								
								switch (edit_color[count_color].output) {
									case image_output_enum.add:
										color3.r += color2.r*strength;
										color3.g += color2.g*strength;
										color3.b += color2.b*strength;
										break;
									case image_output_enum.subtract:
										color3.r -= color2.r*strength;
										color3.g -= color2.g*strength;
										color3.b -= color2.b*strength;
										break;
									case image_output_enum.change:
										color3.r = (color.r*(1-strength))+color2.r*strength;
										color3.g = (color.g*(1-strength))+color2.g*strength;
										color3.b = (color.b*(1-strength))+color2.b*strength;
										break;
									case image_output_enum.multiply:
										color3.r *= (color2.r*strength);
										color3.g *= (color2.g*strength);
										color3.b *= (color2.b*strength); 
										break;
									case image_output_enum.divide:
										if ((color2.r*strength) != 0) {
											color3.r = color.r/(color2.r*strength);}
										if ((color2.g*strength) != 0) {
											color3.g = color.g/(color2.g*strength);}
										if ((color2.b*strength) != 0) {
											color3.b = color.b/(color2.b*strength);}
										break;
									case image_output_enum.difference:
										color3.r = Mathf.Abs((color2.r*strength)-color.r);
										color3.g = Mathf.Abs((color2.g*strength)-color.g);
										color3.b = Mathf.Abs((color2.b*strength)-color.b);
										break;
									case image_output_enum.average:
										color3.r = (color.r+(color2.r*strength))/2;
										color3.g = (color.g+(color2.g*strength))/2;
										color3.b = (color.b+(color2.b*strength))/2;
										break;
									case image_output_enum.max:
										if (color2.r*strength > color.r) {color3.r = color2.r*strength;}
										if (color2.g*strength > color.g) {color3.g = color2.g*strength;}
										if (color2.b*strength > color.b) {color3.b = color2.b*strength;}
										break;
									case image_output_enum.min:
										if (color2.r*strength < color.r) {color3.r = color2.r*strength;}
										if (color2.g*strength < color.g) {color3.g = color2.g*strength;}
										if (color2.b*strength < color.b) {color3.b = color2.b*strength;}
										break;
								}			
							}
							else {
								color3.r += 1-color_pos1;
								color3.g += color_pos1;
								color3.b += 1;
							}
						}
					}
				}
				if (color3[0] > 1) {color3[0] = 1;}
				else if (color3[0] < 0) {color3[0] = 0;}
				if (color3[1] > 1) {color3[1] = 1;}
				else if (color3[1] < 0) {color3[1] = 0;}
				if (color3[2] > 1) {color3[2] = 1;}
				else if (color3[2] < 0) {color3[2] = 0;}
				
				SetPixelRaw (outputBuffer,x,y,color3);
				
				if (Time.realtimeSinceStartup-auto_speed_time > (1.0/target_frame) && multithread)
				{
					y1 = y;
					x1 = (x-inputBuffer.offset.x)+1;
					// Debug.Log(y1);
					if (mode == 2) {time = Time.realtimeSinceStartup-time_start;}
					// Debug.Log("mode: "+mode+", "+y1);
					return;
				}
			}
			x1 = 0;
		}
		generate = false; 
	}
	
	function content_fill_raw(_x: int,_y: int,exclude_start: Color,exclude_end: Color,exclude2: Color,reset : boolean): Color
	{
		var dir_old: Vector2;
		var dir_temp: Vector2;
		// var count: int = 0;
		var color: Color;
		var color2: Color;
		var color7: Color;
		var blur: float = 0;
		var blurAmount: float = 360;
		var blurMin: float = 20;
		var delta: Vector2;
		var delta2: Vector2;
		var length: float;
		
		var deltaColor: float;
		
		var found: boolean = false;
		var accept: boolean = false;
		var angle1: float;
		var angle2: float;
		var bound: boolean = false;
		
		var shadow: boolean = false;
		
		if (reset) {
			xx = 3;
			position = Vector2(_x-1,_y-1);
			direction = Vector2(1,0);
			dir = 1;	
			count = 0;
		}
		
		do
		{
			// if (position.x >= inputBuffer.offset.x && position.y >= inputBuffer.offset.y && position.x < (inputBuffer.innerRect.width+inputBuffer.offset.x) && position.y < (inputBuffer.innerRect.height+inputBuffer.offset.y)) {
				/*
				if (position.x < inputBuffer.offset.x-10) {position.x = inputBuffer.offset.x-10;bound = true;}
				else if (position.x > inputBuffer.innerRect.width+inputBuffer.offset.x+10) {position.x = inputBuffer.innerRect.width+inputBuffer.offset.x+10;bound = true;}
				if (position.y < inputBuffer.offset.y-10) {position.y = inputBuffer.offset.y-10;bound = true;}
				else if (position.y > inputBuffer.innerRect.width+inputBuffer.offset.y+10) {position.y = inputBuffer.innerRect.width+inputBuffer.offset.y+10;bound = true;}
				*/
				
				color = GetPixelRaw(inputBuffer,position.x,position.y);
						
				if (!color_in_range(exclude_start,exclude_end,color)) {
					found = true;break;
				}
			// }
			//}
			// else {
			//	found = true;break;
			// }
			
			++count;
			if (count >= xx && dir == 1) {direction = Vector2(0,1);count = 0;dir = 2;} 
			else if (count >= xx-1 && dir == 2) {direction = Vector2(-1,0);count = 0;dir = 3;}
			else if (count >= xx-1 && dir == 3) {direction = Vector2(0,-1);count = 0;dir = 4;}
			else if (count >= xx-2 && dir == 4) {direction = Vector2(1,0);count = 0;position += Vector2(-1,-2);dir = 1;xx += 2;continue;}
			
			position += direction;
		}
		while (!found);
				
		delta.x = position.x-_x;
		delta.y = position.y-_y;
		length = delta.magnitude;
			
		if (repeat < 1 && length > 4) {
			for (var ys: int = position.y-1;ys <= position.y+1;++ys) {
				for (var xs: int = position.x-1;xs <= position.x+1;++xs) {
					color2 = GetPixelRaw(inputBuffer,xs,ys);
					if (color2[0] <= exclude2[0] && color2[1] <= exclude2[1] && color2[2] <= exclude2[2]) {
						SetPixelRaw(outputBuffer,xs,ys,Color(0,0,0));
					}
				}
			}
		}
					
		//for (var count: int = 0;count < 10;++count) {
		if (repeat < repeatAmount-1) {
			delta2 = (delta/length)*(radius);
			// delta2 = ((delta/length)*2)+(delta*2);
			position2.x = _x+delta2.x;
			position2.y = _y+delta2.y; 
		
			color = GetPixelRaw(inputBuffer,position2.x,position2.y);
			
			if (color_in_range(exclude_start,exclude_end,color)) {
				regen = true;
				shadow = true;	
			}
		}
		
		if (!shadow) {
			color2 = GetPixelRaw(outputBuffer,_x-1,_y);
			if (!color_in_range(exclude_start,exclude_end,color2)) {
				deltaColor = color_difference(color2,color);
				if (GetPixelRaw(inputBuffer,_x-1,_y) == color2) {
					deltaColor *= 10;
				}
				if (deltaColor > blurMin) {
					color7 += color2*(deltaColor/blurAmount);
					blur += deltaColor/blurAmount;
				}
			}
			color2 = GetPixelRaw(outputBuffer,_x,_y-1);
			if (!color_in_range(exclude_start,exclude_end,color2)) {
				deltaColor = color_difference(color2,color);
				if (GetPixelRaw(inputBuffer,_x,_y-1) == color2) {
					deltaColor *= 10;
				}
				if (deltaColor > blurMin) {
					color7 += color2*(deltaColor/blurAmount);
					blur += deltaColor/blurAmount;
				}
			}
			color2 = GetPixelRaw(outputBuffer,_x+1,_y);
			if (!color_in_range(exclude_start,exclude_end,color2)) {
				deltaColor = color_difference(color2,color);
				if (GetPixelRaw(inputBuffer,_x+1,_y) == color2) {
					deltaColor *= 10;
				}
				if (deltaColor > blurMin) {
					color7 += color2*(deltaColor/blurAmount);
					blur += deltaColor/blurAmount;
				}
			}
			color2 = GetPixelRaw(outputBuffer,_x,_y+1);
			if (!color_in_range(exclude_start,exclude_end,color2)) {
				deltaColor = color_difference(color2,color);
				if (GetPixelRaw(inputBuffer,_x,_y+1) == color2) {
					deltaColor *= 10;
				}
				if (deltaColor > blurMin) {
					color7 += color2*(deltaColor/blurAmount);
					blur += deltaColor/blurAmount;
				}
			}
			
			color += color7;
			color /= (1+blur);
		}
		
		SetPixelRaw (outputBuffer,_x,_y,color);
		
		return color;
	}
	
	function GetPixelRaw(buffer: buffer_class,x: long,y: long): Color
	{
		if (mode == 1) {
			if (x < 0) {x = 0-x;}
			else if (x > buffer.outerRect.width-1) {x = x-(x-(buffer.outerRect.width-1));}
			if (y < 0) {y = 0-y;}
			else if (y > buffer.outerRect.height-1) {y = y-(y-(buffer.outerRect.height-1));}
		} 
		else {
			if (x < 0 || x > buffer.outerRect.width-1 || y < 0 || y > buffer.outerRect.height-1) {
				return GetPixelRaw2(buffer,x,y);
			}
		}
		
		var pos: ulong = (buffer.outerRect.width*3*y)+(x*3); 
		// if (pos > buffer.bytes.Length-3) {pos = buffer.bytes.Length-3;}
		// Debug.Log(file.length+" pos: "+pos+" x: "+x+" y: "+y); 
		
		return Color((buffer.bytes[pos]*1.0)/255,(buffer.bytes[pos+1]*1.0)/255,(buffer.bytes[pos+2]*1.0)/255);				
	}
	
	function SetPixelRaw(buffer: buffer_class,x: long,y: long,color: Color)
	{
		if (x < 0) {x = 0-x;}
		else if (x > buffer.outerRect.width-1) {x = x-(x-(buffer.outerRect.width-1));}
		if (y < 0) {y = 0-y;}
		else if (y > buffer.outerRect.height-1) {y = y-(y-(buffer.outerRect.height-1));}
		
		var pos: ulong = (buffer.outerRect.width*3*y)+(x*3);
		buffer.bytes[pos] = color[0]*255;
		buffer.bytes[pos+1] = color[1]*255;
		buffer.bytes[pos+2] = color[2]*255;
		
		//file.Write (byte1,0,3);
	}
	
	function GetPixelRaw2(buffer: buffer_class,x: long,y: long): Color
	{
		x += buffer.outerRect.x;
		y += buffer.outerRect.y;
		
		if (x < 0) {x = -x;}
		else if (x > buffer.resolution.x-1) {x = x-(x-buffer.resolution.x-1);}
		if (y < 0) {y = -y;}
		else if (y > buffer.resolution.y-1) {y = y-(y-buffer.resolution.y-1);} 
		
		var pos: ulong = (buffer.row*y)+(x*3);
			
		buffer.file.Seek (pos,SeekOrigin.Begin);
		var byte1: byte[] = new byte[3];
		buffer.file.Read(byte1,0,3);
		return Color((byte1[0]*1.0)/255,(byte1[1]*1.0)/255,(byte1[2]*1.0)/255);
	}
	
	function color_in_range(color_start: Color,color_end: Color,color: Color): boolean
	{
		if ((color[0] >= color_start[0] && color[0] <= color_end[0]) && (color[1] >= color_start[1] && color[1] <= color_end[1]) && (color[2] >= color_start[2] && color[2] <= color_end[2])) {
			return true;
		}
		else {
			return false;
		}
	}
	
	function color_difference(color1: Color,color2: Color): int
	{
		return ((Mathf.Abs(color1[0]-color2[0])+Mathf.Abs(color1[1]-color2[1])+Mathf.Abs(color1[2]-color2[1]))*255);
	}
}

class image_edit_class
{
	var color1_start: Color = new Color(0,0,0,1);
	var color1_end: Color = new Color(0.3,0.3,0.3,1);
	var curve1: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);
	
	var color2_start: Color = new Color(1,1,1,1);
	var color2_end: Color = new Color(1,1,1,1);
	var curve2: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);;
	
	var strength: float = 1;
	var output: image_output_enum;
	var active: boolean = true;
	var solid_color: boolean = false;
	
	var radius: float = 300;
	var repeat: int = 4;
}

class select_window_class
{
	var active: boolean = false; 
	var button_colormap: boolean = false;
	var button_node: boolean = false;
	var button_terrain: boolean = false;
	var button_heightmap: boolean = true;
	var terrain_zoom: float = 40;
	var terrain_zoom2: float = 40;
	var terrain_pos: Vector2 = new Vector2(0,0);
	
	var node_zoom: float = 40;
	var node_zoom2: float = 40;
	var node_pos: Vector2 = new Vector2(0,0);
	var node_grid: boolean = true;
	var node_grid_center: boolean = true;
	
	var mode: int;
	
	// mode 0 -> Activate terrains Scene
	// mode 1 -> Activate terrains generate
	// mode 2 -> Resize tiles
	
	var terrain_offset: Vector2 = new Vector2(0,0);
	var node_offset: Vector2 = new Vector2(0,0);
	
	function select_colormap() {
		button_node = false;
		button_colormap = true;
		button_terrain = false;
	}
	
	function select_terrain() {
		button_node = false;
		button_colormap = false;
		button_terrain = true;
	}
	
	function select_node() {
		button_node = true;
		button_colormap = false;
		button_terrain = false;
	}
}

class map_pixel_class
{
	var x: double;
	var y: double;
	
	function reset()
	{
		x = 0;
		y = 0;
	}
}

class latlong_class
{
	var latitude: double;
	var longitude: double;
	
	function latlong_class()
	{
	
	}
	
	function latlong_class(latitude1: double,longitude1: double)
	{
		latitude = latitude1;
		longitude = longitude1;
	}
	
	function reset()
	{
		latitude = 0;
		longitude = 0;
	}
}

class latlong_area_class 
{
	var latlong1: latlong_class = new latlong_class();
	var latlong2: latlong_class = new latlong_class();
}

class remarks_class
{
	var textfield_foldout: boolean = false;
	var textfield_length: int = 1;
	var textfield: String = String.Empty;
}

class auto_search_class
{
	var path_full: String = String.Empty;
	var path: String = String.Empty;
	var foldout: boolean = false;
	var custom: boolean = false;
	var digits: int = 1;
	var format: String = "%n";
    var filename: String = "tile";
    var fullname: String;
    var name: String;
    var extension: String = ".raw";
    var start_x: int = 0;
    var start_y: int = 0;
    var start_n: int = 1;
    var count_x: int = 1;
    var count_y: int = 1;
    var display: boolean = false;
    
    var select_index: int = -1;
    
    var menu_rect: Rect;
    
    var output_format: String = "1";
    
    function set_output_format()
    {
    	if (digits < 1) {digits = 1;}
    	var digit: String = new String("0"[0],digits);
    	output_format = format.Replace("%x",start_x.ToString(digit));
		output_format = output_format.Replace("%y",start_y.ToString(digit));
		output_format = output_format.Replace("%n",start_n.ToString(digit));
    }
    
	function strip_file(): boolean
	{
		var digit: String = new String("0"[0],digits);
		
		var format: String = format.Replace("%x",start_x.ToString(digit));
		format = format.Replace("%y",start_y.ToString(digit));
		format = format.Replace("%n",start_n.ToString(digit));
		
		if (path_full.Length == 0) {return false;}
		path = Path.GetDirectoryName(path_full);
		filename = Path.GetFileNameWithoutExtension(path_full);
		filename = filename.Replace(format,String.Empty);
		extension = Path.GetExtension(path_full);
		return true;
	}
	
	function strip_name()
	{
		var digit: String = new String("0"[0],digits);
		
		var format1: String = format.Replace("%x",start_x.ToString(digit));
		format1 = format1.Replace("%y",start_y.ToString(digit));
		format1 = format1.Replace("%n",start_n.ToString(digit));
		
		// name = Regex.Replace(fullname,"[0-9]","");
		name = fullname;
		if (format1.Length > 0){name = name.Replace(format1,String.Empty);}
	}
	
	function get_file(count_x: int,count_y: int,count_n: int): String
	{
		var format2: String;
		var digit: String = new String("0"[0],digits);
		var filename2: String;
						
		format2 = format.Replace("%x",(count_x+start_x).ToString(digit));
		format2 = format2.Replace("%y",(count_y+start_y).ToString(digit));
		format2 = format2.Replace("%n",(count_n+start_n).ToString(digit));
		
		filename2 = path+"/"+filename+format2+extension;
		
		return filename2;
	}
	
	function get_name(count_x: int,count_y: int,count_n: int): String
	{
		var format2: String;
		var digit: String = new String("0"[0],digits);
		var name2: String;
						
		format2 = format.Replace("%x",(count_x+start_x).ToString(digit));
		format2 = format2.Replace("%y",(count_y+start_y).ToString(digit));
		format2 = format2.Replace("%n",(count_n+start_n).ToString(digit));
		
		name2 = name+format2;
		
		return name2;
	}
}

// area_class
class area_class
{
	var active: boolean = true;
	var foldout: boolean = false;
	var area: Rect;
	var area_old: Rect;
	var area_max: Rect;
	var center: Vector2;
	var image_offset: Vector2;
	var rotation: Vector3;
	var rotation_active: boolean = false;
	var link_start: boolean = true;
	var link_end: boolean = true;
	
	var resolution: float;
	var custom_resolution: float;
	var step: Vector2;
	var step_old: Vector2;
	var conversion_step: Vector2;
	var resolution_mode: resolution_mode_enum = resolution_mode_enum.Automatic;
	var resolution_mode_text: String;
	var resolution_tooltip_text: String;
	
	var tree_resolution: int = 128;
	var object_resolution: int = 32;
	var colormap_resolution: int = 2048;
	var tree_resolution_active: boolean = false;
	var object_resolution_active: boolean = false;
	
	function max()
	{
		area = area_max;
	}
	
	function round_area_to_step(area1: Rect): Rect
	{
		area1.xMin = Mathf.Round(area1.xMin/step.x)*step.x;
		area1.xMax = Mathf.Round(area1.xMax/step.x)*step.x;
		area1.yMin = Mathf.Round(area1.yMin/step.y)*step.y;
		area1.yMax = Mathf.Round(area1.yMax/step.y)*step.y;
		
		return area1;
	}
	
	function set_resolution_mode_text()
	{
		if (area == area_max)
		{
			resolution_mode_text = "M";
			resolution_tooltip_text = "Maximum Area Selected";
		} 
		else 
		{
			resolution_mode_text = "C";
			resolution_tooltip_text = "Custum Area Selected";
		}
		
		if (resolution_mode == resolution_mode_enum.Automatic){resolution_mode_text += "-> A";resolution_tooltip_text += "\n\nStep Mode is on Automatic";}
		else if (resolution_mode == resolution_mode_enum.Heightmap){resolution_mode_text += "-> H";resolution_tooltip_text += "\n\nStep Mode is on Heightmap";}
		else if (resolution_mode == resolution_mode_enum.Splatmap){resolution_mode_text += "-> S";resolution_tooltip_text += "\n\nStep Mode is on Splatmap";}
		else if (resolution_mode == resolution_mode_enum.Detailmap){resolution_mode_text += "-> D";resolution_tooltip_text += "\n\nStep Mode is on Detailmap";}
		else if (resolution_mode == resolution_mode_enum.Tree){resolution_mode_text += "-> T";resolution_tooltip_text += "\n\nStep Mode is on Tree";}
		else if (resolution_mode == resolution_mode_enum.Object){resolution_mode_text += "-> O";resolution_tooltip_text += "\n\nStep Mode is on Object";}
		else if (resolution_mode == resolution_mode_enum.Units){resolution_mode_text += "-> U";resolution_tooltip_text += "\n\nStep Mode is on Units";}
		else if (resolution_mode == resolution_mode_enum.Custom){resolution_mode_text += "-> C";resolution_tooltip_text += "\n\nStep Mode is on Custom";}
	}
}

class splatPrototype_class
{
	var foldout: boolean = false;
	var texture: Texture2D;
	var tileSize: Vector2 = Vector2(10,10);
	var tileSize_link: boolean = true;
	var tileSize_old: Vector2;
	var tileOffset: Vector2 = Vector2(0,0);
	
	var normal_tileSize: Vector2 = Vector2(10,10);
	var strength: float = 1;
    var strength_splat: float = 1;
    var normal_texture: Texture2D;
	var normalMap: Texture2D;
	var height_texture: Texture2D;
	var specular_texture: Texture2D;	
	
	var import_max_size_list: int;
}

class treePrototype_class
{
	var prefab: GameObject;
	var texture: Texture2D;
	var bendFactor: float = 0.3;
	var foldout: boolean = false;
}

class detailPrototype_class
{
	var foldout: boolean = false;
	var prototype: GameObject;
	var previewTexture: Texture2D;
	var prototypeTexture: Texture2D;
	var minWidth: float = 1;
	var maxWidth: float = 2;
	var minHeight: float = 1;
	var maxHeight: float = 2;
	var noiseSpread: float = 0.1;
	var bendFactor: float;
	var healthyColor: Color = Color.white;
	var dryColor: Color = Color(0.8,0.76,0.53);
	var renderMode: DetailRenderMode = DetailRenderMode.Grass;
	
	var usePrototypeMesh: boolean = false;
}

class color_settings_class
{
	var backgroundColor: Color = Color (0,0,0,0.5);
	var backgroundActive: boolean = false;
	
	var color_description: Color = Color(1,0.45,0);
	var color_layer: Color = Color.yellow;
	var color_filter: Color = Color.cyan;
	var color_subfilter: Color = Color.green;
	var color_colormap: Color = Color.white;
	var color_splat: Color = Color.white;
	var color_tree: Color = Color(1,0.7,0.4);
	var color_tree_precolor_range: Color = Color(1,0.84,0.64);
	var color_tree_filter: Color = Color(0.5,1,1);
	var color_tree_subfilter: Color = Color(0.5,1,0.5);
	var color_grass: Color = Color.white;
	var color_object: Color = Color.white;
	var color_terrain: Color = Color.white;
}