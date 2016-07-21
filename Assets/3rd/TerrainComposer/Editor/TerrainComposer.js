#pragma downcast
import System.IO;
import System;
import System.Collections.Generic;
import System.Text;
import System.Net.NetworkInformation;
import System.Reflection;
// import UnityEditor.VersionControl;

class TerrainComposer extends EditorWindow 
{
    var install_path: String = "";
    var source: GameObject;
    var count_terrain: int;
    var counter2: int;
    var count_filter: int;
    var count_subfilter: int;
    
    // static var TCLogo: Texture;
  	var button_heightmap: Texture;
    var button_colormap: Texture;
    var button_splatmap: Texture;
    var button_tree: Texture;
    var button_grass: Texture;
    var button_object: Texture;
    var button_export: Texture;
    var button_measure_tool: Texture;
    var button_meshcapture_tool: Texture;
    var button_help: Texture;
    var button_tools: Texture;
    var button_terrain: Texture;
    var button_globe: Texture;
    var button_reset: Texture;
    var button_settings: Texture;
    var button_resolution: Texture;
    var button_size: Texture;
    var button_localArea: Texture;
    var button_script: Texture;
    var button_stitch: Texture;
    var button_smooth: Texture;
    var button_search: Texture;
    var button_open: Texture;
    var button_slice: Texture;
    var button_convert: Texture;
    var button_sun: Texture;
    var button_global: Texture;
    var button_folder: Texture;
    var button_rtp: Texture;
    var palette_texture: Texture;
  
    var progress_bar: float;
    var set_pass: boolean = false;
    var run_in_background: boolean;
    
    var generate_window_height: float;
    var window_start: float;
    var gui_height: float = 19;
    
    var select_window: AssignTextures;
    var info_window: EditorWindow;
    var preview_window: ShowTexture;
    var texture_tool: EditorWindow;
    var measure_tool: EditorWindow;
    var map_window: EditorWindow;
    static var window: EditorWindow;
	
    var timer1: float;
    
   	var curve_copy: AnimationCurve = new AnimationCurve();
   	var curve_layer_position: int = -1;
   	var curve_filter_position: int = -1;
   	var curve_subfilter_position: int = -1; 
	static var disabled: boolean = false;
    
    static var new_window: boolean = false;
    var new_description: boolean = false;
    var new_description_number: int;
    var current_layer_number: int;
    var menu_layer_number;
    var current_prelayer_number: int;
    var menu_prelayer_number;
    var current_description_number: int;
    var menu_description_number;
 	var current_tree_number: int;
 	var current_terrain: terrain_class;
 	var current_mesh: mesh_class;
 	
    var key: Event;
    static var e_old: Event;
    var mouse_position: Vector2;
    var count_something: float = 0;
    var content_checked: boolean = false;

    var first_init: boolean = false;
    
    var current_layer: layer_class;
    var current_filter: filter_class;
    var current_subfilter: subfilter_class;
    var current_preimage: image_class;
    var current_precolor_range: precolor_range_class;
	
	var scrollPos: Vector2;
	var lastRect2: Rect;
	var grassRect: Rect;
	var splatRect: Rect;
	var last_control: String;
	var countRect: Rect;
	
    static var TerrainComposer_Scene: GameObject;
    var Global_Settings_Scene: GameObject;
    static var script: terraincomposer_save;
    static var script2: terraincomposer_save;
    var global_script: global_settings_tc;
    static var Generate_Scene: GameObject;
    static var Generate_Scene_name: String;
	var map_tc: boolean = false;
    var measure_tool_id: int;
    static var script_set: boolean = false;
    static var script_failed: boolean = false;
    
    static var Save_Layer: GameObject;
    static var script3: save_template;
    
    static var terrain_reference: boolean = true;
    static var object_reference: boolean = true;
    
    var path: String;
    
    var filter_text: String;
    var filter_text2: String;
    var subfilter_text: String;
    var subfilter_text2: String;
   	var gui_changed_old: boolean;
   	var gui_changed_old2: boolean;
   	var gui_changed_window: boolean;
   	var time_generate_call: float;
   	
   	static var terrain_measure: Terrain;
   	static var hit_mesh: GameObject;
   	static var height: float;
    static var degree: float;
    static var degree2: float;
    static var normal: Vector3;
    static var hit: RaycastHit;
    static var splat: float[,,];
    static var splat_length: int;
    static var detail_length: int;
    static var detail: int[] = new int[32];
    static var detail1: int[,];
    static var heightmap_scale: Vector3;
    
    var save_global_time: float;
    
    var tooltip_text: String;
    
  	var mouseOver: EditorWindow;
  	var reload: boolean = false;
  	
  	var changed_input: boolean;
  	var changed_start: float;
  	
  	var startup: boolean;
  	
  	var rtp_rect1: Rect;
  	var rtp_rect2: Rect;
  	
  	var layerMasks: List.<String> = new List.<String>();
  	// var layerIndex: List.<in>;
  	var layerMasks_display: String[];
  	
  	@MenuItem ("Window/Terrain Composer")
    
	static function ShowWindow() 
	{
        
        window = EditorWindow.GetWindow (TerrainComposer);
        
        #if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
        window.title = "TerrainComp.";
        #else
        window.titleContent = new GUIContent("TerrainComp.");
        #endif
    }
    
    /*
    static function Init () 
    {
        ScriptableObject.CreateInstance.<TerrainComposer>();
    }
    */
    
    function OnEnable()
    {
    	disabled = false;
    	GetInstallPath();
    	if (Drawing_tc1.lineMaterial == null)
    		Drawing_tc1.lineMaterial = AssetDatabase.LoadAssetAtPath(install_path+"/Templates/Drawing_tc.mat",Material) as Material;
    	
    	if ((!TerrainComposer_Scene || !script || !global_script) && !script_failed) {
        	Get_TerrainComposer_Scene();
        }
        
        
        // var cb: EditorApplication.CallbackFunction = MyUpdate;
    	
    	// EditorApplication.update = System.Delegate.Combine(cb,EditorApplication.update);
		
		// set_all_image_import_settings();
		// check_terrains();
		if (Type.GetType("Map_tc")) {map_tc = true;} else {map_tc = false;}
		
		load_button_textures();
		
		content_checked = false;
	}
	
	function GetInstallPath()
	{
		install_path = AssetDatabase.GetAssetPath(MonoScript.FromScriptableObject(this));
		var index: int = install_path.LastIndexOf("/Editor");
		
		install_path = install_path.Substring(0,index);
		if (GUIW.sliderBaseMiddle == null) GUIW.LoadTextures(install_path);
		// Debug.Log (install_path);
		// TC.fullInstallPath = Application.dataPath.Replace("Assets","")+TC.installPath;
	}
		
	function content_startup()
    {
    	if (read_checked() != System.DateTime.Now.Day)
    	{
	    	if (read_check() > 0)
		    {
		    	check_content_version();
		    }
		}
    }
    
    function Get_TerrainComposer_Scene()
    {
     	TerrainComposer_Scene = GameObject.Find("TerrainComposer_Save");
     	if (!TerrainComposer_Scene) {
     		TerrainComposer_Scene = GameObject.Find("TerrainComposer");
     		if (TerrainComposer_Scene) {
     			TerrainComposer_Scene.name = "TerrainComposer_Save";
     			create_terraincomposer_parent();
     			parent_terraincomposer_children();
     		}
     	}
        var set_path: boolean = false;
        
        if (TerrainComposer_Scene)
        {
        	script = TerrainComposer_Scene.GetComponent(terraincomposer_save);
        	if (script)
        	{
        		script_set = true;
        		load_global_settings();
        		return; 
        	}
        }
        else {set_path = true;}
        
        load_terraincomposer(install_path+"/Templates/new_setup.prefab",false,false,false);
        load_global_settings();
        
        if (!script || !TerrainComposer_Scene)
        {
        	script_set = false;
        	script_failed = true;
        	this.ShowNotification(GUIContent("File missing! Reinstall package..."));
        } 
        
        this.Repaint();	
    }
    
    function OnDisable()
    { 
    	script = null;
    	disabled = true;	
    	
    	// var cb: EditorApplication.CallbackFunction = MyUpdate;
		
		// EditorApplication.update = System.Delegate.Remove(EditorApplication.update,cb);
	}
	
	function OnDestroy()
	{
		
	}
    
	function OnFocus()
	{
		Get_TerrainComposer_Scene();
		GetInstallPath();
		set_paths();
		
		if (script) {
			script.tc_id = this.GetInstanceID();
			script.get_rtp_lodmanager();
			script.convert_software_version();
			RefreshRawFiles();
			
			script.terrains[0].SetAllNeighbors(script.terrains);
			script.set_neighbor2(1);
		}
		
		if (layerMasks.Count == 0) {create_layer_mask();}
	}
	
	function OnLostFocus()
	{
		if (global_script != null) EditorUtility.SetDirty (global_script);
		if (script != null) EditorUtility.SetDirty (script);
	}
			
	function load_button_textures()
    {
    	// var install_path: String = "Assets/TerrainComposer";
    	// TCLogo = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/TCLogo.png",Texture);
    	
        button_heightmap = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_heightmap.png",Texture);
	    button_colormap = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_colormap.png",Texture);
	    button_splatmap = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_splatmap.png",Texture);
	    button_tree = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_tree.png",Texture);
	    button_grass = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_grass.png",Texture);
	    button_object = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_objects.png",Texture);
	    button_export = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_savedisk.png",Texture);
	    button_measure_tool = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_measure_tool.png",Texture); 
	    button_meshcapture_tool = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_meshcapture_tool.png",Texture);
	    button_tools = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_tools.png",Texture); 
	    button_terrain = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_terrain.png",Texture);
	    button_globe = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_globe.png",Texture);
	    button_help = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_help.png",Texture); 
	    
	    button_reset = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_reset.png",Texture);
	    button_settings = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_settings.png",Texture);
	    button_resolution = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_resolution.png",Texture);
	    button_size = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_size.png",Texture);
	    button_localArea = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_localArea.png",Texture);
	    button_script = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_script.png",Texture);
	    button_stitch = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_stitch.png",Texture);
	    button_smooth = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_smooth.png",Texture);
	    button_search = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_search.png",Texture);
	    button_open = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_open.png",Texture);
	    button_slice = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_slice.png",Texture);
	    button_convert = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_convert.png",Texture);
	    button_sun = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_sun.png",Texture);
	    button_global = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_global.png",Texture);
	    button_folder = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_folder.png",Texture);
	    button_rtp = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/button_rtp.png",Texture);
	   
	    
	    palette_texture = AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/Palette.png",Texture);  
	}
	
	function OnInspectorUpdate()
	{
		if (!script || !global_script) {return;}
		
		check_content_done();
		
		if (script.settings.project_prefab) {
        	if (changed_input) {
	        	if (Time.realtimeSinceStartup > changed_start+1) {
	        		EditorUtility.SetDirty(script);	
	        		changed_input = false;
	        	}
	        }
        }
        
        if (Time.realtimeSinceStartup > save_global_time+(global_script.settings.save_global_timer*60)) {
        	if (!map_window) {
        		save_global_settings();
        	}
        	save_global_time = Time.realtimeSinceStartup;
        }
		
		if (!startup) {
			starup = true;
		}
	}	
	
	function OnGUI() 
    {
        gui_changed_window = false;
        key = Event.current;
        
        if ((!TerrainComposer_Scene || !script || !global_script) && !script_failed){
        	if (key.type == EventType.Repaint){Get_TerrainComposer_Scene();return;} else {return;}
        }
		
		if (key.type == EventType.KeyDown || key.type == EventType.MouseDown) {
        	changed_start = Time.realtimeSinceStartup;
        	changed_input = true;
        }
        
        script.masterTerrain = script.terrains[0];
        
        if (global_script.settings.color.backgroundActive)
        {
	       	if (script.tex1) {
	       		// GUI.color = global_script.settings.color.backgroundColor;
	       		EditorGUI.DrawPreviewTexture(Rect(0,17,position.width,position.height),script.tex1);
	       		// GUI.color = UnityEngine.Color.white;
	       	}
	       	else {	   		    
		    	script.tex1 = new Texture2D(1,1); 
		 		script.tex1.SetPixel(0,0,global_script.settings.color.backgroundColor);
				script.tex1.Apply();
			}
		}
        
		EditorGUILayout.BeginHorizontal();
        var rect: Rect;
        var menu: GenericMenu;
        if (GUILayout.Button("File",EditorStyles.toolbarButton,GUILayout.Width(55)))
        {
        	 rect = GUILayoutUtility.GetLastRect();
        	 rect.y += 18;
        	 menu = new GenericMenu ();                                
        	 menu.AddItem (new GUIContent ("New"), false, main_menu, "new");                
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent ("Open"), false, main_menu, "open");                
        	               
        	 menu.AddItem (new GUIContent ("Save"), false, main_menu, "save");                                
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent ("Close"), false, main_menu, "close");  
        	 menu.DropDown (rect);
        }
        if (global_script.settings.undo) {
	        if (GUILayout.Button("Edit",EditorStyles.toolbarButton,GUILayout.Width(55)))
	        {
	        	 rect = GUILayoutUtility.GetLastRect();
	        	 rect.y += 18;
	        	 rect.x += 55;
	        	 menu = new GenericMenu ();                                
	        	 menu.AddItem (new GUIContent("Undo"),false,main_menu,"undo");  
	        	 menu.AddItem (new GUIContent("Redo"),false,main_menu,"redo");
	        	 menu.DropDown (rect);              
	        }
	    }
        if (GUILayout.Button("Tools",EditorStyles.toolbarButton,GUILayout.Width(55)))
        {
        	 rect = GUILayoutUtility.GetLastRect();
        	 rect.y += 18;
        	 rect.x += 110; 
        	 if (!global_script.settings.undo) rect.x -= 55;
        	 
        	 menu = new GenericMenu ();                                
        	 menu.AddItem (new GUIContent("Measure Tool"),script.measure_tool, main_menu, "measure_tool");  
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Quick Tools"),script.quick_tools, main_menu, "quick_tools");  
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Mesh Capture Tool"),script.meshcapture_tool, main_menu, "meshcapture_tool"); 
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Image Filter Tool"),false,main_menu,"texture_tool");
        	 menu.AddItem (new GUIContent("Image Pattern Tool"),false,main_menu,"pattern_tool");             
        	 menu.AddItem (new GUIContent("Image Heigtmap Tool"),false,main_menu,"heightmap_tool");
        	 menu.DropDown (rect);
        }
        if (GUILayout.Button("Options",EditorStyles.toolbarButton,GUILayout.Width(55)))
        {
        	 rect = GUILayoutUtility.GetLastRect();
        	 rect.y += 18;
        	 rect.x += 165;
        	 if (!global_script.settings.undo) rect.x -= 55;
        	 menu = new GenericMenu ();                                
        	 menu.AddItem (new GUIContent("Interface Colors"),global_script.settings.color_scheme_display,main_menu,"color_scheme_display");   
        	 menu.AddSeparator("");
        	 menu.AddItem (new GUIContent("Generate Settings"),script.generate_settings,main_menu,"generate_settings"); 
        	 menu.AddItem (new GUIContent("Terrain Max Settings"),script.settings.terrain_settings,main_menu,"terrain_settings");
        	 menu.AddSeparator("");
        	 menu.AddItem (new GUIContent("Database Restore"),script.settings.database_display,main_menu,"database_restore"); 
        	 menu.DropDown (rect);
        }
        if (GUILayout.Button("View",EditorStyles.toolbarButton,GUILayout.Width(55)))
        {
        	 rect = GUILayoutUtility.GetLastRect();
        	 rect.y += 18;
        	 rect.x += 220;
        	 if (!global_script.settings.undo) rect.x -= 55;
        	 menu = new GenericMenu (); 
        	
        	 menu.AddItem (new GUIContent("Layer Count"),script.layer_count,main_menu,"layer_count"); 
        	 menu.AddItem (new GUIContent("Placed Count"),script.placed_count,main_menu,"placed_count");
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Output Layers Only"),global_script.settings.view_only_output,main_menu,"view_only_output"); 
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Remarks"),script.settings.remarks,main_menu,"remarks");  
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Layer Groups"),script.description_display,main_menu,"description_display");  
        	 menu.AddItem (new GUIContent("Project Info"),script.settings.display_filename,main_menu,"project_info");  
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Terrain Tabs"),script.settings.tabs,main_menu,"tab");
        	 menu.AddItem (new GUIContent("Colors"),global_script.settings.color_scheme,main_menu,"color_scheme");                
        	 menu.AddItem (new GUIContent("Color Curves"),script.settings.display_color_curves,main_menu, "color_curves");
        	 menu.AddItem (new GUIContent("Mix Curves"),script.settings.display_mix_curves,main_menu, "mix_curves");
        	 menu.AddItem (new GUIContent("Box"),script.settings.box_scheme,main_menu, "box_scheme");
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Filter Select Text"),script.settings.filter_select_text,main_menu, "filter_select_text");
        	 if (Application.platform == RuntimePlatform.OSXEditor)
        	 {
        	 	menu.AddItem (new GUIContent("Toggle Long Text"),global_script.settings.toggle_text_long, main_menu, "long_toggle_text");
        	 	menu.AddItem (new GUIContent("Toggle Short Text"),!global_script.settings.toggle_text_long, main_menu, "short_toggle_text");
        		menu.AddItem (new GUIContent("Toggle No Text"),!script.settings.toggle_text, main_menu, "no_toggle_text");
        	 }
        	 else
        	 {
        	 	menu.AddItem (new GUIContent("Toggle Text/Long Text"),global_script.settings.toggle_text_long, main_menu, "long_toggle_text");
        	 	menu.AddItem (new GUIContent("Toggle Text/Short Text"),global_script.settings.toggle_text_short, main_menu, "short_toggle_text");
        	 	menu.AddSeparator ("Toggle Text/"); 
        	 	menu.AddItem (new GUIContent("Toggle Text/No Text"),global_script.settings.toggle_text_no, main_menu, "no_toggle_text");
        	 }
        	 menu.DropDown (rect);
        }
        
        if (GUILayout.Button("Help",EditorStyles.toolbarButton,GUILayout.Width(55)))
        {
        	 rect = GUILayoutUtility.GetLastRect();
        	 rect.y += 18;
        	 rect.x += 275;
        	 if (!global_script.settings.undo) rect.x -= 55;
        	 menu = new GenericMenu (); 
        	
        	 menu.AddItem (new GUIContent("About..."),false,main_menu,"terraincomposer_info");
        	 menu.AddSeparator (""); 
        	 if (!map_tc) {
        	 	// menu.AddItem (new GUIContent("Getting Started"),false,main_menu,"getting_started");
        	 	menu.AddItem (new GUIContent("Main Manual"),false,main_menu,"main_manual");
        	 }
        	 else {
        	 	// menu.AddItem (new GUIContent("TerrainComposer Getting Started"),false,main_menu,"getting_started");
        	 	menu.AddItem (new GUIContent("TerrainComposer Manual"),false,main_menu,"main_manual");
        	 	menu.AddItem (new GUIContent("WorldComposer Manual"),false,main_menu,"wc_manual");
        	 }
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Start Window..."),global_script.settings.download_display,main_menu,"download");
        	
        	 menu.AddItem (new GUIContent("Examples Window..."),global_script.settings.example_display,main_menu,"example");
        	 
        	 menu.AddItem (new GUIContent("Update..."),script.settings.update_display,main_menu,"update");
        	 menu.AddSeparator (""); 
        	 menu.AddItem (new GUIContent("Video Help"),global_script.settings.video_help, main_menu, "video_help");
        	 if (Application.platform == RuntimePlatform.OSXEditor)
        	 {
        	 	menu.AddItem (new GUIContent("Tooltip Long Text"),global_script.settings.toggle_text_long, main_menu, "long_tooltip_text");
        	 	menu.AddItem (new GUIContent("Tooltip Short Text"),!global_script.settings.toggle_text_long, main_menu, "short_tooltip_text");
        	 	menu.AddItem (new GUIContent("Tooltip No Text"),!script.settings.toggle_text, main_menu, "no_tooltip_text");
        	 }
        	 else
        	 {
        	 	menu.AddItem (new GUIContent("Tooltip Text/Long Text"),global_script.settings.tooltip_text_long, main_menu, "long_tooltip_text");
        	 	menu.AddItem (new GUIContent("Tooltip Text/Short Text"),global_script.settings.tooltip_text_short, main_menu, "short_tooltip_text");
        	 	menu.AddSeparator("Tooltip Text/"); 
        	 	menu.AddItem (new GUIContent("Tooltip Text/No Text"),global_script.settings.tooltip_text_no, main_menu, "no_tooltip_text");
        	 }
        	 menu.DropDown (rect);
        }
        
		if (script.settings.display_filename)
		{        
	        if (script.filename == String.Empty){EditorGUILayout.LabelField(" <New Project>");}
	        	else {EditorGUILayout.LabelField(" <"+script.filename+">");}
	    }
	    EditorGUILayout.EndHorizontal();
        
        if (new_window)
        {
        	EditorGUILayout.BeginHorizontal();
        	EditorGUILayout.LabelField("All layer content will be lost. Are you sure?",EditorStyles.boldLabel);
        	if (GUILayout.Button("Yes",GUILayout.Width(40)))
        	{
        		new_description = false;
	        	script.new_layers();
        		new_window = false;
        	}
        	if (GUILayout.Button("No",GUILayout.Width(40)))
        	{
        		new_window = false;
        	}	
        	EditorGUILayout.EndHorizontal();
        }
        GUILayout.Space(5);
        
        EditorGUILayout.BeginHorizontal();
        if (button_heightmap && !script.settings.showMeshes)
        {
        	if (script.heightmap_output){GUI.backgroundColor = Color(0,1,0,1);}
        	if (global_script.settings.tooltip_mode != 0)
        	{
        		tooltip_text = "Heightmap Output";
        	}
        	if (global_script.settings.tooltip_mode == 2)
        	{
        		tooltip_text += "\n\n(Alt Click to Fold/Unfold Heightmap Layers)";
        	}
        	if (GUILayout.Button(GUIContent(button_heightmap,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
        	{
        		toggle_heightmap_output();
        	}
        	if (script.heightmap_output){GUI.backgroundColor = Color.white;}
        }
        else {
        	load_button_textures();
        }
        if (button_colormap && !script.settings.showMeshes)
        {
        	if (script.color_output){GUI.backgroundColor = Color(0,1,0,1);}
	        if (global_script.settings.tooltip_mode != 0)
	        {
	        	tooltip_text = "Colormap Output";
	        }
	        if (global_script.settings.tooltip_mode == 2)
	        {
	        	tooltip_text += "\n\n(Shift Click to keep other Output Buttons enabled)\n(Alt Click to Fold/Unfold Color Layers)";
	        }
	        if (GUILayout.Button(GUIContent(button_colormap,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
	        {
	        	toggle_color_output(); 
	        }
	        if (script.color_output){GUI.backgroundColor = Color.white;}
	    }
        if (button_splatmap && !script.settings.showMeshes)
        {
        	if (script.splat_output){GUI.backgroundColor = Color(0,1,0,1);}
	        if (global_script.settings.tooltip_mode != 0)
	        {
	        	tooltip_text = "Splat Output";
	        }
	        if (global_script.settings.tooltip_mode == 2)
	        {
	        	tooltip_text += "\n\n(Shift Click to keep other Output Buttons enabled)\n(Alt Click to Fold/Unfold Splat Layers)";
	        }
	        if(GUILayout.Button(GUIContent(button_splatmap,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
	        {
	        	toggle_splat_output();
	        }
	        if (script.splat_output){GUI.backgroundColor = Color.white;}
        }
        if (button_tree && !script.settings.showMeshes)
        {
        	if (script.tree_output){GUI.backgroundColor = Color(0,1,0,1);}
	        if (global_script.settings.tooltip_mode != 0)
	        {
	        	tooltip_text = "Tree Output";
	        }
	        if (global_script.settings.tooltip_mode == 2)
	        {
	        	tooltip_text += "\n\n(Shift Click to keep other Output Buttons enabled)\n(Alt Click to Fold/Unfold Tree Layers)";
	        }
	        if (GUILayout.Button(GUIContent(button_tree,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
        	{
        		toggle_tree_output();
        	}
        	if (script.tree_output){GUI.backgroundColor = Color.white;}
        }
        if (button_grass && !script.settings.showMeshes)
        {
        	if (script.grass_output){GUI.backgroundColor = Color(0,1,0,1);}
	       	if (global_script.settings.tooltip_mode != 0)
	       	{
	       		tooltip_text = "Grass/Detail Output";
	       	}
	       	if (global_script.settings.tooltip_mode == 2)
	       	{
	       		tooltip_text += "\n\n(Shift Click to keep other Output Buttons enabled)\n(Alt Click to Fold/Unfold Grass/Detail Layers)";
	       	}
	       	if (GUILayout.Button(GUIContent(button_grass,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
	      	{
        		toggle_grass_output();
       		}
       		if (script.grass_output){GUI.backgroundColor = Color.white;}
       	}
        if (button_object)
        {
        	if (script.object_output){GUI.backgroundColor = Color(0,1,0,1);}
	        if (global_script.settings.tooltip_mode != 0)
	        {
	        	tooltip_text = "Object Output";
	        }
	        if (global_script.settings.tooltip_mode == 2)
	        {
	        	tooltip_text += "\n\n(Shift Click to keep other Output Buttons enabled)\n(Altt Click to Fold/Unfold Object Layers)";
	        }
	        if (GUILayout.Button(GUIContent(button_object,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
	        {
        		toggle_object_output();
        	}
        	if (script.object_output){GUI.backgroundColor = Color.white;}
        }
        if (button_export && !script.settings.showMeshes)
        {
        	if (script.button_export){GUI.backgroundColor = Color(0,1,0,1);}
        	if (global_script.settings.tooltip_mode != 0)
        	{
        		tooltip_text = "Export Output to Image";
        	}
          	if(GUILayout.Button(GUIContent(button_export,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
        	{
        		if (!script2)
        		{
	        		script.button_export = !script.button_export;
	        		
	        		if (script.button_export)
	        		{
	        			// script.tree_output = false;
	        			// script.grass_output = false;
	        			script.object_output = false;
	        		}
	        		else 
	        		{
	        			if (script.meshcapture_tool){script.meshcapture_tool = false;}
	        			if (script.color_output) {
	        				if (script.terrains[0].rtp_script) {
	        					if (!script.terrains[0].rtp_script.ColorGlobal) {
	        						script.color_output = false;
	        					}
	        				}
	        				else {
	        					script.color_output = false;
	        				}
	        			}
	        		}
	        		SetGeneretateButtonText();
	        		button5 = false;
	        	}
	        	else
	        	{
	        		this.ShowNotification(GUIContent("Cannot active Export Button while generating"));
	        	}
        	}
        	GUI.backgroundColor = Color.white;
	    }
        if (button_measure_tool)
        {
        	if (script.measure_tool){GUI.backgroundColor = Color(0,1,0,1);}
        	if (global_script.settings.tooltip_mode != 0)
        	{
        		tooltip_text = "Measure Tool\n\n(Control Right Click in Scene view to lock/unlock the current reading)";
        	}
        	if(GUILayout.Button(GUIContent(button_measure_tool,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
        	{
        		ToggleMeasureTool();
        	}
        	if (script.measure_tool){GUI.backgroundColor = Color.white;}
        }
        if (button_meshcapture_tool)
        {
        	if (script.meshcapture_tool){GUI.backgroundColor = Color(0,1,0,1);}
        	if (global_script.settings.tooltip_mode != 0)
        	{
        		tooltip_text = "Mesh Capture Tool";
        	}
        	if(GUILayout.Button(GUIContent(button_meshcapture_tool,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
        	{
        		toggle_meshcapture_tool();
        	}
        	if (script.meshcapture_tool){GUI.backgroundColor = Color.white;}
        }
        if (button_tools)
        {
           	if (script.image_tools){GUI.backgroundColor = Color(0,1,0,1);}
        	if (global_script.settings.tooltip_mode != 0)
        	{
        		tooltip_text = "Texture Tool and Pattern Tool";
        	}
        	if(GUILayout.Button(GUIContent(button_tools,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
        	{
        		if (!script.image_tools)
        		{
	        		if (script.texture_tool.preimage.image.Count < 2)
		        	{
		        		for (var count_image: int = 0;count_image < 2-script.texture_tool.preimage.image.Count;++count_image)
		        		{
		        			script.texture_tool.preimage.image.Add(new Texture2D(1,1));
		        		}
		        	}
		        	this.Repaint();
		        	create_window_texture_tool();
		        }
		        else
		        {
		        	texture_tool = EditorWindow.GetWindow(FilterTexture);
		        	if (texture_tool){texture_tool.Close();}
		        	script.image_tools = false;
		        }
        	}
        	if (script.image_tools){GUI.backgroundColor = Color.white;}
        }
        if (map_tc) {
	        if (button_globe && global_script.settings.button_world)
	       	{
	       		if (!map_window){script.settings.button_globe = false;}
	       		if (script.settings.button_globe){GUI.backgroundColor = UnityEngine.Color(0,1,0,1);}
	       		if (global_script.settings.tooltip_mode != 0)
	       		{
	       			tooltip_text = "WorldComposer";
	       		}
	       		if (GUILayout.Button(GUIContent(button_globe,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
	       		{
	       			script.settings.button_globe = !script.settings.button_globe;
	       			
	       			if (script.settings.button_globe)
	       			{
	       				var url: String = ""; 
				
						global_script.map_load = false;
						global_script.map_load2 = false;
						global_script.map_load3 = false;
						global_script.map_load4 = false;
				
						create_map_window("World");
						
						map_window.Repaint();
					}
					else
					{
						if (map_window){map_window.Close();}
					}
	       		}
	       		
	       		if (script.settings.button_globe){GUI.backgroundColor = UnityEngine.Color.white;}
	       	}
	    }
	    if (button_help)
        {
           	if (global_script.settings.video_help){GUI.backgroundColor = Color(0,1,0,1);}
        	if (global_script.settings.tooltip_mode != 0)
        	{
        		tooltip_text = "Video Help";
        	}
        	if(GUILayout.Button(GUIContent(button_help,tooltip_text),GUILayout.Width(52),GUILayout.Height(32)))
        	{
        		global_script.settings.video_help = !global_script.settings.video_help;
        		global_script.settings.download_display = global_script.settings.video_help;
        	}
        	GUI.backgroundColor = Color.white;
        }
	    
        EditorGUILayout.EndHorizontal();
        
        EditorGUILayout.BeginHorizontal();
        GUILayout.Space(12);
        if (!script.settings.showMeshes) {
	        if (script.heightmap_output){GUI.color = Color.green;}
	        EditorGUILayout.LabelField("Height",EditorStyles.miniBoldLabel,GUILayout.Width(55));
	        if (script.color_output){GUI.color = Color.green;} else {GUI.color = Color.white;}
	        EditorGUILayout.LabelField("Color",EditorStyles.miniBoldLabel,GUILayout.Width(52));
	        if (script.splat_output){GUI.color = Color.green;} else {GUI.color = Color.white;}
	        EditorGUILayout.LabelField("Splat",EditorStyles.miniBoldLabel,GUILayout.Width(55));
	        if (script.tree_output){GUI.color = Color.green;} else {GUI.color = Color.white;}
	        EditorGUILayout.LabelField("Tree",EditorStyles.miniBoldLabel,GUILayout.Width(50));
	        if (script.grass_output){GUI.color = Color.green;} else {GUI.color = Color.white;}
	        EditorGUILayout.LabelField("Grass",EditorStyles.miniBoldLabel,GUILayout.Width(47));
	    }
	    if (script.object_output){GUI.color = Color.green;} else {GUI.color = Color.white;}
	    if (!script.settings.showMeshes) EditorGUILayout.LabelField("Object",EditorStyles.miniBoldLabel,GUILayout.Width(52));
	    else EditorGUILayout.LabelField("Object",EditorStyles.miniBoldLabel,GUILayout.Width(50));
        
        if (!script.settings.showMeshes) {
	        if (script.button_export){GUI.color = Color.green;} else {GUI.color = Color.white;}
	        EditorGUILayout.LabelField("Export",EditorStyles.miniBoldLabel,GUILayout.Width(50));
	    }    
	    if (script.measure_tool){GUI.color = Color.green;} else {GUI.color = Color.white;}
        EditorGUILayout.LabelField("Measure",EditorStyles.miniBoldLabel,GUILayout.Width(52));
        
        if (script.mesh_capture_tool){GUI.color = Color.green;} else {GUI.color = Color.white;}
        EditorGUILayout.LabelField("Capture",EditorStyles.miniBoldLabel,GUILayout.Width(58));
        
        if (script.image_tools){GUI.color = Color.green;} else {GUI.color = Color.white;}
        EditorGUILayout.LabelField("Tools",EditorStyles.miniBoldLabel,GUILayout.Width(50));
        
        if (map_tc) {
       		if (script.settings.button_globe){GUI.color = UnityEngine.Color.green;} else {GUI.color = UnityEngine.Color.white;}
        	EditorGUILayout.LabelField("World",EditorStyles.miniBoldLabel,GUILayout.Width(52));
        }
        GUILayout.Space(4);
        if (global_script.settings.video_help){GUI.color = Color.green;} else {GUI.color = Color.white;}
        EditorGUILayout.LabelField("Help",EditorStyles.miniBoldLabel,GUILayout.Width(48));
       	
        
        GUI.color = Color.white;
        
        EditorGUILayout.EndHorizontal();
        
        
        if (script.layer_count)
        {
	        EditorGUILayout.BeginHorizontal();
	        GUILayout.Space(20);
	        if (script.layer_heightmap < 10){GUILayout.Space(2);}
	        EditorGUILayout.LabelField("("+script.layer_heightmap+")",GUILayout.Width(40));
	        if (script.layer_heightmap > 9){GUILayout.Space(2);}
	        GUILayout.Space(9.5);
	        if (script.layer_color < 10){GUILayout.Space(2);}
	        EditorGUILayout.LabelField("("+script.layer_color+")",GUILayout.Width(40));
	        if (script.layer_color > 9){GUILayout.Space(2);}
	        GUILayout.Space(9.5);
	        if (script.layer_splat < 10){GUILayout.Space(2);}
	        EditorGUILayout.LabelField("("+script.layer_splat+")",GUILayout.Width(40));
	        if (script.layer_splat > 9){GUILayout.Space(2);}
	        GUILayout.Space(9.5);
	        if (script.layer_tree < 10){GUILayout.Space(2);}
	        EditorGUILayout.LabelField("("+script.layer_tree+")",GUILayout.Width(40));
	        if (script.layer_tree > 9){GUILayout.Space(2);}
	        GUILayout.Space(9.5);
	        if (script.layer_grass < 10){GUILayout.Space(2);}
	        EditorGUILayout.LabelField("("+script.layer_grass+")",GUILayout.Width(40));
	        if (script.layer_grass > 9){GUILayout.Space(2);}
	        GUILayout.Space(10);
	        EditorGUILayout.LabelField("("+script.layer_object+")",GUILayout.Width(40));
	        EditorGUILayout.EndHorizontal();
	    }
        
        EditorGUILayout.Space();
        
        var index: int = -1;
        var options: String[] = ["New","Open","Save"];
        var sizes: int[] = [1,2,3];
  
        Paint();
    }
    
    function Paint()
	{       
		generate_window_height = 65;
		
		/*
		if (GUILayout.Button("Build")) {
			var terrains: TerrainData[] = new TerrainData[script.terrains.Count];
			var path: String;
			
			for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
				path = AssetDatabase.GetAssetPath(script.terrains[count_terrain].terrain.terrainData);
				terrains[count_terrain] = AssetDatabase.LoadAssetAtPath(path,TerrainData);
				Debug.Log(terrains[count_terrain].name);
			}
			
			BuildPipeline.BuildAssetBundle(terrains[0],terrains,"Assets/Bundle.unity3d",BuildAssetBundleOptions.CompleteAssets | BuildAssetBundleOptions.UncompressedAssetBundle);
		}
		*/
		
		if (script.color_output)
		{
			generate_window_height += gui_height*2;
			if (script.export_color_advanced)
			{
				generate_window_height += gui_height*3;
				if (script.export_color_curve_advanced){generate_window_height += (gui_height*2)-2;}
			}
		}
		if (script.button_export)
		{
			generate_window_height += (gui_height*2)+2;
			
			
			if (script.color_output)
			{
				if (script.settings.colormap || script.terrains[0].rtp_script){generate_window_height +=  gui_height;}
			}
			
			if (script.heightmap_output)
			{
				generate_window_height += gui_height;
			}
		}
		if (script.layer_count){window_start = gui_height+2;} else {window_start = 2;}
		
		if (script.meshcapture_tool)
		{
			if (script.meshcapture_tool_foldout){generate_window_height += (gui_height*8)+4;}
		}
		
		if (new_window){window_start += 25;}
		GUILayout.BeginArea(Rect(0,75+window_start,position.width,position.height-generate_window_height-75-window_start));
		
		tooltip_text = String.Empty;
		if (script.settings.update_display)
	    {
	    	GUI.color = Color.green;
	    	GUILayout.BeginVertical("Box");
	    	EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField("Updates",GUILayout.Width(225));
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; gui_changed_window = GUI.changed; GUI.changed = false;
			var update_select: int = read_check();
			GUI.color = Color.white;
			update_select = EditorGUILayout.Popup(update_select,script.settings.update);	    	
			if (GUI.changed)
			{
				write_check(update_select.ToString());
			}
			GUI.changed = gui_changed_old;
			if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
				script.settings.update_display = false;
			}	
			GUILayout.Space(2);
	    	EditorGUILayout.EndHorizontal();
	    	
	    	EditorGUILayout.BeginHorizontal();
	    	GUI.color = Color.green;
			EditorGUILayout.LabelField("Current TerrainComposer Version",GUILayout.Width(225));
			EditorGUILayout.LabelField(" "+read_version().ToString("F3"));
			GUI.color = Color.white;
			if (info_window) {GUI.backgroundColor = Color.green;}
			if (GUILayout.Button("Info",GUILayout.Width(80)))
			{
				create_info_window();
			}
			GUI.backgroundColor = UnityEngine.Color.white;
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUI.color = Color.green;
			EditorGUILayout.LabelField("Available TerrainComposer Version",GUILayout.Width(225));
			if (script.settings.new_version == 0 || script.settings.loading == 1){EditorGUILayout.LabelField("---");}
			else {EditorGUILayout.LabelField(" "+script.settings.new_version.ToString("F3")+"");}
			if (script.settings.loading == 1) {
				EditorGUILayout.LabelField("Checking...",GUILayout.Width(90));
			}
			if (script.settings.loading == 2) {
				EditorGUILayout.LabelField("Downloading..."+Mathf.Round(script.settings.contents.progress*100).ToString()+"%",GUILayout.Width(125));
				if (GUILayout.Button("Stop",GUILayout.Width(50))) {
					script.settings.contents.Dispose();
					script.settings.contents = null;
					script.settings.loading = 0;
				}
				this.Repaint();
			} 
			
			if (script.settings.loading == 0 || script.settings.loading == 3)
			{
				if (!script.settings.update_version && !script.settings.update_version2)
				{
					GUI.color = Color.white;
					if (GUILayout.Button("Check Now",GUILayout.Width(80)))
					{
						check_content_version();
					}
				}
			}
			if (script.settings.update_version && script.settings.loading == 0)
			{
				if (GUILayout.Button("Download",GUILayout.Width(80)))
				{
					content_version();
					script.settings.update_version = false;
				}
			}
			if (script.settings.update_version2)
			{
				if (GUILayout.Button("Import",GUILayout.Width(80)))
				{
					Debug.Log("The 'ArgumentException: Getting control 10's position in a group with only 10 controls when doing Repaint' is not a really an error, just 1 frame draw repaint mismatch of the TerrainComposer window, because the code changes after importing. The console can be cleared after getting the warning.");
					import_contents(Application.dataPath+install_path.Replace("Assets","")+"/Update/TerrainComposer.unitypackage",true);
				}
			}
			EditorGUILayout.EndHorizontal();
			GUI.color = Color.white;
			GUILayout.EndVertical();
	    } 
	    
	    if (global_script.settings.download_display)
	    {
	    	GUI.color = Color.green;
	    	GUILayout.BeginVertical("Box");
	    	
	    	EditorGUILayout.BeginHorizontal();
	    	/*
	    	if (!map_tc) {
				EditorGUILayout.LabelField("Getting Started",EditorStyles.boldLabel);
			}
			else {
				EditorGUILayout.LabelField("TerrainComposer Getting Started",EditorStyles.boldLabel);
			}
			GUI.color = Color.white;
			*/
			EditorGUILayout.BeginHorizontal();
			GUI.color = Color.green;
			if (!map_tc) {
				EditorGUILayout.LabelField("Main Manual",EditorStyles.boldLabel);
			}
			else {
				EditorGUILayout.LabelField("TerrainComposer Main Manual",EditorStyles.boldLabel);
			}
			GUI.color = Color.white;
			if (GUILayout.Button("Click here",GUILayout.Width(78))) {
				Application.OpenURL (Application.dataPath+install_path.Replace("Assets","")+"/TerrainComposer.pdf");
			}
			EditorGUILayout.EndHorizontal();
			
			if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
				global_script.settings.download_display = false;
			}	
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUI.color = Color.green;
	    	EditorGUILayout.LabelField("TerrainComposer short Tutorial Videos",EditorStyles.boldLabel);
			GUI.color = Color.white;
			if (GUILayout.Button("Click here",GUILayout.Width(78))) {
				Application.OpenURL ("http://www.terraincomposer.com/tutorials");
			}
			GUILayout.Space(22);
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
	    	GUI.color = Color.green;
			EditorGUILayout.LabelField("TerrainComposer Forum",EditorStyles.boldLabel);
	    	GUI.color = Color.white;
			if (GUILayout.Button("Click here",GUILayout.Width(78))) {
				Application.OpenURL ("http://forum.unity3d.com/threads/151365-Terrain-Composer-A-Tool-for-making-AAA-photorealistic-Unity-Terrain-in-just-minutes");
			}
	    	GUILayout.Space(22);
			EditorGUILayout.EndHorizontal();
			
			GUILayout.Space(3);			
												
			EditorGUILayout.BeginHorizontal();
	    	GUI.color = Color.green;
			if (map_tc) {
				EditorGUILayout.LabelField("WorldComposer Main Manual",EditorStyles.boldLabel);
			}
			else {
				EditorGUILayout.LabelField("WorldComposer Extension (NEW)",EditorStyles.boldLabel);
			}
			 
			GUI.color = Color.white;
	    	if (map_tc) {
	    		if (GUILayout.Button("Click here",GUILayout.Width(78))) {
					Application.OpenURL (Application.dataPath+install_path.Replace("Assets","")+"/WorldComposer.pdf");
				}
			}
			else {
				if (GUILayout.Button("Click here",GUILayout.Width(78))) {
					Application.OpenURL ("http://www.terraincomposer.com/worldcomposer");
				}
			}
			GUILayout.Space(22);
	    	EditorGUILayout.EndHorizontal();
	    	
	    	EditorGUILayout.BeginHorizontal();
	    	GUI.color = Color.green;
			EditorGUILayout.LabelField("WorldComposer Forum",EditorStyles.boldLabel);
			 
			GUI.color = Color.white;
    		if (GUILayout.Button("Click here",GUILayout.Width(78))) {
				Application.OpenURL ("http://forum.unity3d.com/threads/worldcomposer-a-tool-to-create-real-world-aaa-quality-terrain.215485/");
			}
			
			GUILayout.Space(22);
	    	EditorGUILayout.EndHorizontal();
	    	
	    	GUILayout.Space(3);
	    	EditorGUILayout.BeginHorizontal();
	    	GUI.color = Color.green;
			EditorGUILayout.LabelField("Download",EditorStyles.boldLabel);
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(15);
			GUI.color = Color.green;
			EditorGUILayout.LabelField("Example Package (NEW)");		
			
			GUI.color = Color.white;
			if (global_script.settings.downloading2 == 1) {
				EditorGUILayout.LabelField("Downloading..."+(Mathf.Round(global_script.settings.download2.progress*100)).ToString()+"%",GUILayout.Width(125));
				if (GUILayout.Button("Stop",GUILayout.Width(50))) {
					global_script.settings.download2.Dispose();
					global_script.settings.download2 = null;
					global_script.settings.downloading2 = 0;
				}
				this.Repaint();
			}
			else {
				if (File.Exists(Application.dataPath+"/TerrainComposer Examples/Projects/version1.2.txt")) {
					if (GUILayout.Button("Start Examples",GUILayout.Width(100))) {
						global_script.settings.example_display = true;
						this.ShowNotification(GUIContent("Save your TerrainComposer project before pressing the 'Start' or the 'Create Terrain' button in examples, as it will replace your current TC project"));
    					Debug.Log("Save your TerrainComposer project before pressing the 'Start' or the 'Create Terrain' button in examples, as it will replace your current TC project");
					}
				}
				else {
					#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 	
					if (File.Exists(Application.dataPath+install_path.Replace("Assets","")+"/Download/TerrainComposer_Examples1.2.unitypackage")) {
						if (GUILayout.Button("Import",GUILayout.Width(100))) {
							AssetDatabase.ImportPackage(Application.dataPath+install_path.Replace("Assets","")+"/Download/TerrainComposer_Examples1.2.unitypackage",true);
						}
					}
					else {
						if (GUILayout.Button("Download Link",GUILayout.Width(120))) {
							Application.OpenURL("https://www.dropbox.com/s/nx5r0e6btv24dz4/TerrainComposer_Examples1.2.unitypackage?dl=0");
							Debug.Log("Please import the Example Package manually after downloading by double clicking the package in your computer browser");
						}
						if (GUILayout.Button("Download Direct",GUILayout.Width(120))) {
							global_script.settings.download2 = new WWW("http://www.terraincomposer.com/TerrainComposer_Examples1.2.unitypackage");  
	    					global_script.settings.downloading2 = 1;
	    				}
					}
					#else
					if (File.Exists(Application.dataPath+install_path.Replace("Assets","")+"/Download/TerrainComposer_Examples5.0.unitypackage")) {
						if (GUILayout.Button("Import",GUILayout.Width(100))) {
							AssetDatabase.ImportPackage(Application.dataPath+install_path.Replace("Assets","")+"/Download/TerrainComposer_Examples5.0.unitypackage",true);
						}
					}
					else {
						if (GUILayout.Button("Download Link",GUILayout.Width(120))) {
							Application.OpenURL("https://www.dropbox.com/s/fjhfj5lee4f3rdo/TerrainComposer_Examples5.0.unitypackage?dl=0");
							Debug.Log("Please import the Example Package manually after downloading by double clicking the package in your computer browser");
						}
						if (GUILayout.Button("Download Direct",GUILayout.Width(120))) {
							global_script.settings.download2 = new WWW("http://www.terraincomposer.com/TerrainComposer_Examples5.0.unitypackage");  
	    					global_script.settings.downloading2 = 1;
	    				}
					}
					#endif 
					
				}
			}
			EditorGUILayout.EndHorizontal();
			
			/*
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(15);
			GUI.color = Color.green;
			EditorGUILayout.LabelField("Tutorial Package");		
			
			GUI.color = Color.white;
			if (global_script.settings.downloading == 1) {
				EditorGUILayout.LabelField("Downloading..."+(Mathf.Round(global_script.settings.download.progress*100)).ToString()+"%",GUILayout.Width(125));
				if (GUILayout.Button("Stop",GUILayout.Width(50))) {
					global_script.settings.download.Dispose();
					global_script.settings.download = null;
					global_script.settings.downloading = 0;
				}
				this.Repaint();
			}
			else {
				if (File.Exists(Application.dataPath+"/TerrainComposer Examples/Island/ReadMe.pdf")) {
					if (GUILayout.Button("Run the tutorial",GUILayout.Width(100))) {
						Application.OpenURL (Application.dataPath+"/TerrainComposer Examples/Island/ReadMe.pdf");
					}
				}
				else {
					if (File.Exists(Application.dataPath+"/TerrainComposer/Download/TerrainComposer_Island.unitypackage")) {
						if (GUILayout.Button("Import",GUILayout.Width(100))) {
							AssetDatabase.ImportPackage(Application.dataPath+"/TerrainComposer/Download/TerrainComposer_Island.unitypackage",true);
						}
					}
					else if (GUILayout.Button("Download",GUILayout.Width(100))) {
						global_script.settings.download = new WWW("http://www.terraincomposer.com/TerrainComposer_Island.unitypackage");  
	    				global_script.settings.downloading = 1;
					}
				}
			}
			EditorGUILayout.EndHorizontal();
			*/
			EditorGUILayout.EndVertical();
			
			GUI.color = Color.white;
			
	    }
	   
	    
	    if (script.settings.database_display)
        {
	        EditorGUILayout.BeginHorizontal();
	        if (GUILayout.Button("Info Database",GUILayout.Width(120)))
	        {
	        	script.loop_prelayer("(inf)",0,true);
	        }
	        if (GUILayout.Button("<Fix Database>",GUILayout.Width(120)) && key.shift)
	        {
	        	UndoRegister("Fix Database");
	        	script.loop_prelayer("(fix)(inf)",0,true);
	        }
	        if (GUILayout.Button("Reset Swap/Copy",GUILayout.Width(120)))
	        {
	        	if (!key.shift)
	        	{
	        		script.loop_prelayer("(rsc)",0,true);
	        		script.reset_swapcopy();
	        	}
	        	else
	        	{
					reset_paths(true);
	        		script.settings.new_version = 0;
	        	}
	        }
	        if (GUILayout.Button("<Update Version>",GUILayout.Width(120)))
	        {
	        	if (key.shift && key.control)
	        	{
	        		script.reset_software_version();
	        		convert_old_prelayer(script.prelayers[0],true,true);
	        	}
	        }
	        EditorGUILayout.LabelField("");
	        if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
				script.settings.database_display = false;
			}	
			GUILayout.Space(2);
	        EditorGUILayout.EndHorizontal();
	       
	        EditorGUILayout.BeginHorizontal();
	        EditorGUILayout.LabelField("Actual Layer Levels: ",GUILayout.Width(150));
	        EditorGUILayout.LabelField(""+(script.prelayers.Count-1),GUILayout.Width(70));
	        EditorGUILayout.LabelField("Layer Levels Linked: ",GUILayout.Width(150));
	        EditorGUILayout.LabelField(""+script.settings.prelayers_linked);
	        EditorGUILayout.EndHorizontal();
	        
	        EditorGUILayout.BeginHorizontal();
	        EditorGUILayout.LabelField("Actual Filters: ",GUILayout.Width(150));
	        EditorGUILayout.LabelField(""+script.filter.Count,GUILayout.Width(70));
	        EditorGUILayout.LabelField("Filters Linked: ",GUILayout.Width(150));
	        EditorGUILayout.LabelField(""+script.settings.filters_linked);
	        EditorGUILayout.EndHorizontal();
	       
	        EditorGUILayout.BeginHorizontal();
	        EditorGUILayout.LabelField("Actual Subfilters: ",GUILayout.Width(150));
	        EditorGUILayout.LabelField(""+script.subfilter.Count,GUILayout.Width(70));
	        EditorGUILayout.LabelField("Subfilters Linked: ",GUILayout.Width(150));
	        EditorGUILayout.LabelField(""+script.settings.subfilters_linked);
	        EditorGUILayout.EndHorizontal();
	        
	        EditorGUILayout.BeginHorizontal();
	        EditorGUILayout.LabelField("Filter: ",GUILayout.Width(150));
	        script.settings.filter_foldout_index = EditorGUILayout.IntField(script.settings.filter_foldout_index,GUILayout.Width(70));
	        if (GUILayout.Button("Foldout",GUILayout.Width(60)))
	        {
	        	script.loop_prelayer("(ff)",script.settings.filter_foldout_index,true);
	        }
	        EditorGUILayout.EndHorizontal();
	        
	        EditorGUILayout.BeginHorizontal();
	        EditorGUILayout.LabelField("Subfilter: ",GUILayout.Width(150));
	        script.settings.subfilter_foldout_index = EditorGUILayout.IntField(script.settings.subfilter_foldout_index,GUILayout.Width(70));
	        if (GUILayout.Button("Foldout",GUILayout.Width(60)))
	        {
	        	script.loop_prelayer("(fs)",script.settings.subfilter_foldout_index,true);
	        }
	        EditorGUILayout.EndHorizontal();
	    }
	    
	    if (script.settings.project_prefab) {
	    	var parent_prefab: Object = PrefabUtility.GetPrefabParent(TerrainComposer_Scene);
	    	
	    	if (parent_prefab) {
	    		EditorGUILayout.BeginHorizontal();
	    		EditorGUILayout.LabelField("Project Prefab",GUILayout.Width(120));
	        	if (GUILayout.Button("<Revert>",GUILayout.Width(70)) && key.shift) {
	        		UndoRegister("Revert Project Prefab");
	        		PrefabUtility.RevertPrefabInstance(TerrainComposer_Scene);
				}
	        	if (GUILayout.Button("<Apply>",GUILayout.Width(70)) && key.shift) {
	        		PrefabUtility.ReplacePrefab(TerrainComposer_Scene,PrefabUtility.GetPrefabParent(TerrainComposer_Scene));
				}
	    		EditorGUILayout.EndHorizontal();
	    	}
		}
	    
        if (script.generate_settings)
        {
        	EditorGUILayout.BeginHorizontal();
        	script.generate_settings_foldout = EditorGUILayout.Foldout(script.generate_settings_foldout,"Generate Settings");
        	if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
        		script.generate_settings = false;
        	}
        	GUILayout.Space(2);
        	EditorGUILayout.EndHorizontal();
       		
       		if (script.generate_settings_foldout)
       		{
//       		EditorGUILayout.BeginHorizontal();
//	        	GUILayout.Space(15);
//	        	gui_changed_old = GUI.changed;
//	        	gui_changed_window = GUI.changed; GUI.changed = false;
//	        	EditorGUILayout.LabelField("Generate Speed",GUILayout.Width(170));
//	        	script.generate_speed = EditorGUILayout.IntField(script.generate_speed,GUILayout.Width(50));
//	        	if (GUI.changed)
//	        	{
//	        		if (script.generate_speed < 1){script.generate_speed = 1;}
//	        		if (script2){script2.generate_speed = script.generate_speed;}
//	        	}
//	        	GUI.changed = gui_changed_old;
//	        	EditorGUILayout.EndHorizontal();
//	        	
//	       		EditorGUILayout.BeginHorizontal();
//	        	GUILayout.Space(15);
//	        	EditorGUILayout.LabelField("Object Place Speed",GUILayout.Width(170));
//	        	gui_changed_old = GUI.changed;
//	        	gui_changed_window = GUI.changed; GUI.changed = false;
//	        	script.object_speed = EditorGUILayout.IntField(script.object_speed,GUILayout.Width(50));
//	        	if (GUI.changed)
//	        	{
//	        		if (script.object_speed < 1){script.object_speed = 1;}
//	        		if (script2){script2.object_speed = script.object_speed;}
//	        	}
//	        	GUI.changed = gui_changed_old;
//	        	EditorGUILayout.EndHorizontal();
	        	
//	        	EditorGUILayout.BeginHorizontal();
//		        	GUILayout.Space(15);
//		        	EditorGUILayout.LabelField("Randomize Seed",GUILayout.Width(170));
//		        	script.seed = EditorGUILayout.IntField(script.seed,GUILayout.Width(50));
//		        EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Auto Save Global Settings",GUILayout.Width(170));
	        	global_script.settings.save_global_timer = EditorGUILayout.IntField(global_script.settings.save_global_timer,GUILayout.Width(50));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Grass Density",GUILayout.Width(170));
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	script.settings.grass_density = EditorGUILayout.FloatField(script.settings.grass_density,GUILayout.Width(50));
	        	if (GUI.changed)
	        	{
	        		if (script.settings.grass_density < 0){script.settings.grass_density = 0;}
	        		if (script.settings.grass_density > 16){script.settings.grass_density = 16;}
	        	}
	        	GUI.changed = gui_changed_old;
	        	EditorGUILayout.EndHorizontal();
				
				/*
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Equal Density Resolution",GUILayout.Width(170));
				script.settings.resolution_density = EditorGUILayout.Toggle(script.settings.resolution_density,GUILayout.Width(25));	
				EditorGUILayout.EndHorizontal();
				
				if (script.settings.resolution_density)
				{
					EditorGUILayout.BeginHorizontal();
		        	GUILayout.Space(15);
		        	EditorGUILayout.LabelField("Density Resolution Min",GUILayout.Width(170));
		        	script.settings.resolution_density_min = EditorGUILayout.IntField(script.settings.resolution_density_min,GUILayout.Width(50));
		        	if (GUI.changed)
		        	{
		        		if (script.settings.resolution_density_min < 8){script.settings.resolution_density_min = 8;}
		        		script.settings.resolution_density_conversion = (1.0/(script.settings.resolution_density_min*1.0));
		        	}
		        	GUI.changed = gui_changed_old;
		        	EditorGUILayout.EndHorizontal();
				}
				*/
				EditorGUILayout.BeginHorizontal();
	        		GUILayout.Space(15);
	        		EditorGUILayout.LabelField("Position Seed",GUILayout.Width(170));
	        		global_script.settings.positionSeed = EditorGUILayout.Toggle(global_script.settings.positionSeed,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Undo",GUILayout.Width(170));
	        	global_script.settings.undo = EditorGUILayout.Toggle(global_script.settings.undo,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
				
//				EditorGUILayout.BeginHorizontal();
//	        	GUILayout.Space(15);
//	        	EditorGUILayout.LabelField("Auto Fit Terrains",GUILayout.Width(170));
//	        	script.settings.auto_fit_terrains = EditorGUILayout.Toggle(script.settings.auto_fit_terrains,GUILayout.Width(25));
//	        	EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Progressbar Auto Generate",GUILayout.Width(170));
	        	script.settings.display_bar_auto_generate = EditorGUILayout.Toggle(script.settings.display_bar_auto_generate,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	
				EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Run in Background",GUILayout.Width(170));
	        	script.settings.run_in_background = EditorGUILayout.Toggle(script.settings.run_in_background,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
				
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Unload Textures",GUILayout.Width(170));
	        	script.unload_textures = EditorGUILayout.Toggle(script.unload_textures,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Clean Memory",GUILayout.Width(170));
	        	script.clean_memory = EditorGUILayout.Toggle(script.clean_memory,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	GUILayout.Space(5);
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Project Prefab Mode",GUILayout.Width(170));
	        	script.settings.project_prefab = EditorGUILayout.Toggle(script.settings.project_prefab,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Runtime Create Terrain",GUILayout.Width(170));
	        	script.settings.runtime_create_terrain = EditorGUILayout.Toggle(script.settings.runtime_create_terrain,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Load Terrain Data",GUILayout.Width(170));
	        	global_script.settings.load_terrain_data = EditorGUILayout.Toggle(global_script.settings.load_terrain_data,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Parent Objects to Terrains",GUILayout.Width(170));
	        	script.settings.parentObjectsTerrain = EditorGUILayout.Toggle(script.settings.parentObjectsTerrain,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	GUILayout.Space(5);
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Generate on Unity Terrains",GUILayout.Width(170));
	        	script.settings.showTerrains = EditorGUILayout.Toggle(script.settings.showTerrains,GUILayout.Width(25));
	        	if (!script.settings.showTerrains) script.settings.showMeshes = true; else script.settings.showMeshes = false;
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Generate on Meshes",GUILayout.Width(170));
	        	GUI.changed = false;
	        	script.settings.showMeshes = EditorGUILayout.Toggle(script.settings.showMeshes,GUILayout.Width(25));
	        	if (GUI.changed) {
		        	if (!script.settings.showMeshes) {
		        		script.settings.showTerrains = true;
		        	}
		        	else {
		        		script.settings.showTerrains = false;
		        		script.disable_outputs();
		        		toggle_object_output();
		        		script.button_export = false;
		        		SetGeneretateButtonText();
		        	}
		        }
	        	EditorGUILayout.EndHorizontal();
	        	
	        	/*
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Multi Terrain Optimizer",GUILayout.Width(170));
	        	script.settings.cull_optimizer = EditorGUILayout.Toggle(script.settings.cull_optimizer,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        	*/
	        }
		}        
		
		if (script.settings.terrain_settings)
        {
        	EditorGUILayout.BeginHorizontal();
        	script.settings.terrain_settings_foldout = EditorGUILayout.Foldout(script.settings.terrain_settings_foldout,"Terrain Max Settings");
        	if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
        		script.settings.terrain_settings = false;
        	}
        	GUILayout.Space(2);
        	EditorGUILayout.EndHorizontal();
       		
       		if (script.settings.terrain_settings_foldout)
       		{
       			EditorGUILayout.BeginHorizontal();
		        GUILayout.Space(15);
		        if (script.settings.settings_editor){GUI.backgroundColor = Color.green;}
		        if (GUILayout.Button("Editor",EditorStyles.miniButtonMid,GUILayout.Width(70)))
		        {
		        	script.settings.settings_editor = true;
		        	script.settings.settings_runtime = false;
		        }
		        GUI.backgroundColor = Color.white;
		        if (script.settings.settings_runtime){GUI.backgroundColor = Color.green;}
		        if (GUILayout.Button("Runtime",EditorStyles.miniButtonMid,GUILayout.Width(70)))
		        {
		        	script.settings.settings_editor = false;
		        	script.settings.settings_runtime = true;
		        }
		        GUI.backgroundColor = Color.white;
		        EditorGUILayout.EndHorizontal();
       			
       			if (!script.terrains[0].rtp_script) {
	       			EditorGUILayout.BeginHorizontal();
		        	GUILayout.Space(15);
		        	gui_changed_old = GUI.changed;
		        	gui_changed_window = GUI.changed; GUI.changed = false;
		        	EditorGUILayout.LabelField("Basemap Distance",GUILayout.Width(170));
		        	if (script.settings.settings_editor){script.settings.editor_basemap_distance_max = EditorGUILayout.IntField(script.settings.editor_basemap_distance_max,GUILayout.Width(64));}
		        		else {script.settings.runtime_basemap_distance_max = EditorGUILayout.IntField(script.settings.runtime_basemap_distance_max,GUILayout.Width(64));}
		        	if (GUI.changed)
		        	{
		        		if (script.settings.editor_basemap_distance_max < 0){script.settings.editor_basemap_distance_max = 0;}
		        		if (script.settings.runtime_basemap_distance_max < 0){script.settings.runtime_basemap_distance_max = 0;}
		        	}
		        	GUI.changed = gui_changed_old;
		        	EditorGUILayout.EndHorizontal();
		        }
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	EditorGUILayout.LabelField("Grass Distance",GUILayout.Width(170));
	        	if (script.settings.settings_editor){script.settings.editor_detail_distance_max = EditorGUILayout.IntField(script.settings.editor_detail_distance_max,GUILayout.Width(64));}
	        		else {script.settings.runtime_detail_distance_max = EditorGUILayout.IntField(script.settings.runtime_detail_distance_max,GUILayout.Width(64));}
	        	if (GUI.changed)
	        	{
	        		if (script.settings.editor_detail_distance_max < 0){script.settings.editor_detail_distance_max = 0;}
	        		if (script.settings.runtime_detail_distance_max < 0){script.settings.runtime_detail_distance_max = 0;}
	        	}
	        	GUI.changed = gui_changed_old;
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	EditorGUILayout.LabelField("Tree Distance",GUILayout.Width(170));
	        	if (script.settings.settings_editor){script.settings.editor_tree_distance_max = EditorGUILayout.IntField(script.settings.editor_tree_distance_max,GUILayout.Width(64));}
	        	else {script.settings.runtime_tree_distance_max = EditorGUILayout.IntField(script.settings.runtime_tree_distance_max,GUILayout.Width(64));}
	        	if (GUI.changed)
	        	{
	        		if (script.settings.editor_tree_distance_max < 0){script.settings.editor_tree_distance_max = 0;}
	        		if (script.settings.runtime_tree_distance_max < 0){script.settings.runtime_tree_distance_max = 0;}
	        	}
	        	GUI.changed = gui_changed_old;
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	EditorGUILayout.LabelField("Tree Fade Length",GUILayout.Width(170));
	        	if (script.settings.settings_editor){script.settings.editor_fade_length_max = EditorGUILayout.IntField(script.settings.editor_fade_length_max,GUILayout.Width(64));}
	        		else {script.settings.runtime_fade_length_max = EditorGUILayout.IntField(script.settings.runtime_fade_length_max,GUILayout.Width(64));}
	        	if (GUI.changed)
	        	{
	        		if (script.settings.editor_fade_length_max < 0){script.settings.editor_fade_length_max = 0;}
	        		if (script.settings.runtime_fade_length_max < 0){script.settings.runtime_fade_length_max = 0;}
	        	}
	        	GUI.changed = gui_changed_old;
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	EditorGUILayout.LabelField("Mesh Trees",GUILayout.Width(170));
	        	if (script.settings.settings_editor){script.settings.editor_mesh_trees_max = EditorGUILayout.IntField(script.settings.editor_mesh_trees_max,GUILayout.Width(64));}
	        		else {script.settings.runtime_mesh_trees_max = EditorGUILayout.IntField(script.settings.runtime_mesh_trees_max,GUILayout.Width(64));}
	        	if (GUI.changed)
	        	{
	        		if (script.settings.editor_mesh_trees_max < 0){script.settings.editor_mesh_trees_max = 0;}
	        		if (script.settings.runtime_mesh_trees_max < 0){script.settings.runtime_mesh_trees_max = 0;}
	        	}
	        	GUI.changed = gui_changed_old;
	        	EditorGUILayout.EndHorizontal();
	        	
	        	GUILayout.Space(10);
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	EditorGUILayout.LabelField("Max Terrain Tiles",GUILayout.Width(170));
	        	script.settings.terrain_tiles_max = EditorGUILayout.IntField(script.settings.terrain_tiles_max,GUILayout.Width(64));
	        	if (GUI.changed)
	        	{
	        		if (script.settings.terrain_tiles_max < 1){script.settings.terrain_tiles_max = 1;}
	        	}
	        	GUI.changed = gui_changed_old;
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Restrict Total Resolutions",GUILayout.Width(170));
	        	global_script.settings.restrict_resolutions = EditorGUILayout.Toggle(global_script.settings.restrict_resolutions,GUILayout.Width(25));
	        	EditorGUILayout.EndHorizontal();
	        }
	    }
	        
		if (global_script.settings.color_scheme_display)
        {
        	EditorGUILayout.BeginHorizontal();
        	script.settings.color_scheme_display_foldout = EditorGUILayout.Foldout(script.settings.color_scheme_display_foldout,"Interface Colors");
        	if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
        		global_script.settings.color_scheme_display = false;
        	}
        	GUILayout.Space(2);
        	EditorGUILayout.EndHorizontal();
       		
       		if (script.settings.color_scheme_display_foldout)
       		{
       			EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Background Color",GUILayout.Width(190));
	        	GUI.changed = false;
	        	global_script.settings.color.backgroundColor = EditorGUILayout.ColorField(global_script.settings.color.backgroundColor,GUILayout.Width(150));
	        	gui_changed_old = GUI.changed;
	        	global_script.settings.color.backgroundActive = EditorGUILayout.Toggle(global_script.settings.color.backgroundActive,GUILayout.Width(25));
	        	if (GUI.changed) {
	        		if (!script.tex1) {script.tex1 = new Texture2D(1,1);}
	        		script.tex1.SetPixel(0,0,global_script.settings.color.backgroundColor);
	        		script.tex1.Apply(); 
	        		if (select_window) {select_window.Repaint();}
	        		if (info_window) {info_window.Repaint();}
	        		if (preview_window) {preview_window.Repaint();} 
	        		if (texture_tool) {texture_tool.Repaint();}
	        		if (measure_tool) {measure_tool.Repaint();}
	        	}
	        	GUI.changed = false;
	        	EditorGUILayout.EndHorizontal();
	        	
	        	GUILayout.Space(5);
       			EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Terrain Color",GUILayout.Width(190));
	        	global_script.settings.color.color_terrain = EditorGUILayout.ColorField(global_script.settings.color.color_terrain,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
       			EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Layer Group Color",GUILayout.Width(190));
	        	global_script.settings.color.color_description = EditorGUILayout.ColorField(global_script.settings.color.color_description,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	       		EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Layer Color",GUILayout.Width(190));
	        	global_script.settings.color.color_layer = EditorGUILayout.ColorField(global_script.settings.color.color_layer,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Filter Color",GUILayout.Width(190));
	        	global_script.settings.color.color_filter = EditorGUILayout.ColorField(global_script.settings.color.color_filter,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Subfilter Color",GUILayout.Width(190));
	        	global_script.settings.color.color_subfilter = EditorGUILayout.ColorField(global_script.settings.color.color_subfilter,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Colormap Color",GUILayout.Width(190));
	        	global_script.settings.color.color_colormap = EditorGUILayout.ColorField(global_script.settings.color.color_colormap,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Splatmap Color",GUILayout.Width(190));
	        	global_script.settings.color.color_splat = EditorGUILayout.ColorField(global_script.settings.color.color_splat,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Tree Color",GUILayout.Width(190));
	        	global_script.settings.color.color_tree = EditorGUILayout.ColorField(global_script.settings.color.color_tree,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Tree Color Group",GUILayout.Width(190));
	        	global_script.settings.color.color_tree_precolor_range = EditorGUILayout.ColorField(global_script.settings.color.color_tree_precolor_range,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Tree Filter Color",GUILayout.Width(190));
	        	global_script.settings.color.color_tree_filter = EditorGUILayout.ColorField(global_script.settings.color.color_tree_filter,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Tree Subfilter Color",GUILayout.Width(190));
	        	global_script.settings.color.color_tree_subfilter = EditorGUILayout.ColorField(global_script.settings.color.color_tree_subfilter,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Grass Color",GUILayout.Width(190));
	        	global_script.settings.color.color_grass = EditorGUILayout.ColorField(global_script.settings.color.color_grass,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	EditorGUILayout.LabelField("Object Color",GUILayout.Width(190));
	        	global_script.settings.color.color_object = EditorGUILayout.ColorField(global_script.settings.color.color_object,GUILayout.Width(150));
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(15);
	        	if (GUILayout.Button("<Default Colors>",GUILayout.Width(123)) && key.shift){load_color_layout();}
	        	
       			EditorGUILayout.EndHorizontal();
			}
		}    
		
		GUILayout.Space(2);
		if (key.type == EventType.Repaint) 
		{
		    script.settings.top_rect = GUILayoutUtility.GetLastRect();
			script.settings.top_height = script.settings.top_rect.y;
		}
		scrollPos = EditorGUILayout.BeginScrollView(scrollPos,GUILayout.Width(Screen.width),GUILayout.Height(0));
		
		if (global_script.settings.example_display) {
			EditorGUILayout.BeginHorizontal();
			GUI.color = Color.green;
		    EditorGUILayout.LabelField("Examples",EditorStyles.boldLabel);
		    // global_script.drawGUIBox(Rect(5,0,Screen.width,200),"Examples",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
		    GUI.color = Color.white;
		    if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
				global_script.settings.example_display = false;
			}	
			GUILayout.Space(5);
		    EditorGUILayout.EndHorizontal();
			GUILayout.Space(5);
		    
			EditorGUILayout.BeginHorizontal();
			    gui_changed_old = GUI.changed;
			   	GUI.changed = false;
			   	GUI.color = Color.green;
			   	EditorGUILayout.LabelField("Terrain Resolution",GUILayout.Width(145));
			   	GUI.color = Color.white;
			   	global_script.settings.example_resolution = EditorGUILayout.Slider(global_script.settings.example_resolution,0,4);	
			   	
			   	EditorGUILayout.LabelField(Mathf.Pow(2,7+global_script.settings.example_resolution).ToString(),GUILayout.Width(50));
			   	
				
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
				GUILayout.Space(5);
				GUI.color = Color.green;
		   		EditorGUILayout.LabelField("Tiles X",GUILayout.Width(145));
				GUI.color = Color.white;
				global_script.settings.exampleTerrainTiles.x = EditorGUILayout.IntSlider(global_script.settings.exampleTerrainTiles.x,1,5);
				if (script.terrainTileLink) global_script.settings.exampleTerrainTiles.y = global_script.settings.exampleTerrainTiles.x;
				GUILayout.Space(54);
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
				GUILayout.Space(5);
				GUI.color = Color.green;
				EditorGUILayout.LabelField("Tiles Y",GUILayout.Width(116));
				GUI.color = Color.white;
				script.terrainTileLink = EditorGUILayout.Toggle(script.terrainTileLink,GUILayout.Width(25));
				global_script.settings.exampleTerrainTiles.y = EditorGUILayout.IntSlider(global_script.settings.exampleTerrainTiles.y,1,5);
				GUILayout.Space(54);
			EditorGUILayout.EndHorizontal();
			
			if (GUI.changed) {
				if (global_script.settings.restrict_resolutions) {
			   		if ((global_script.settings.exampleTerrainTiles.x*global_script.settings.exampleTerrainTiles.y)*Mathf.Pow(2,7+global_script.settings.example_resolution) > 8192) {
			   			do {
			   				global_script.settings.exampleTerrainTiles -= new Vector2(1,1);
			   			}
			   			while ((global_script.settings.exampleTerrainTiles.x*global_script.settings.exampleTerrainTiles.y)*Mathf.Pow(2,7+global_script.settings.example_resolution) > 8192);
			   		}
			   	}
		   	}
		   	GUI.changed = gui_changed_old;
		   	
			GUILayout.Space(5);
			
		    EditorGUILayout.BeginHorizontal();
		    GUILayout.Space(153);
		    if (GUILayout.Button("Create Terrains",GUILayout.Width(145))) { 
				if (!check_downloaded_examples()) {return;}
				load_example_presets();
			}
			if (GUILayout.Button("Create Lighting",GUILayout.Width(145))) {
				if (!check_downloaded_examples()) {return;}
				#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 					    					
				RenderSettings.skybox = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer Examples/Assets/Skybox/Skybox_forest.mat",Material);
				RenderSettings.fogColor = Color(0.4980392,0.47058823529,0.42745098);
				RenderSettings.ambientLight = Color(0.443137,0.501960,0.560784);
				#else 
				RenderSettings.fogColor = Color(138.0/255.0,168.0/255.0,203.0/255.0);
				RenderSettings.ambientLight = Color(0.443137,0.501960,0.560784);
				#endif 
				
				RenderSettings.fog = true;
				RenderSettings.fogMode = FogMode.ExponentialSquared;
				RenderSettings.fogDensity = 0.0006;
				
				var light: GameObject = GameObject.Find("Directional light");
				var wind: GameObject = GameObject.Find("WindZone");
				
				if (light == null) light = GameObject.Find("Directional Light");
				
				if (!light) {
					light = Instantiate(AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer Examples/Assets/Prefabs/Directional light.prefab",GameObject));
					light.name = "Directional light";
				}
				script.settings.directional_light = light.GetComponent.<Light>(); 
				if (!wind) {
					wind = Instantiate(AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer Examples/Assets/Prefabs/WindZone.prefab",GameObject));
					wind.name = "WindZone";
				}
			}
			EditorGUILayout.EndHorizontal();
			
			GUILayout.Space(5);
			
	        EditorGUILayout.BeginHorizontal();
	        GUI.color = Color.green;
		    EditorGUILayout.LabelField("Choose Example",GUILayout.Width(143));
		    GUI.color = Color.white;
		    global_script.settings.example_terrain = EditorGUILayout.Popup(global_script.settings.example_terrain,global_script.examples,GUILayout.Width(150),GUILayout.Height(19));    
		    if (GUILayout.Button("Reload",GUILayout.Width(70))) {
		    	script.create_pass = -1;
		    	global_script.settings.example_terrain_old1 = -1;
		    	load_example_terrain(true);
		    }
	        EditorGUILayout.EndHorizontal();
	        
	        EditorGUILayout.BeginHorizontal();
	        GUILayout.Space(153);
	        if (global_script.settings.example_buttons & 1) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
	        if (GUILayout.Button("Heightmap",EditorStyles.miniButtonMid,GUILayout.Width(75),GUILayout.Height(19))) {
	        	if (script.color_output) script.button_export = false;
	        	script.disable_outputs();
	        	if (global_script.settings.example_buttons & 1) {global_script.settings.example_buttons = 0;}
	        	else {
	        		global_script.settings.example_buttons = 1;
	        		script.heightmap_output = true;
	        		script.prelayers[current_prelayer_number].layer_output = layer_output_enum.heightmap;
        			script.set_view_only_selected(script.prelayers[0],script.prelayers[0].layer_output,true);
	        	}
	        }
	        if (global_script.settings.example_buttons & 2) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
	        if (GUILayout.Button("Splatmap",EditorStyles.miniButtonMid,GUILayout.Width(75),GUILayout.Height(19))) {
	        	if (script.color_output) script.button_export = false;
	        	script.disable_outputs();
	        	if (global_script.settings.example_buttons & 2) {global_script.settings.example_buttons = 0;}
	        	else {
	        		global_script.settings.example_buttons = 2;
	        		script.splat_output = true;
	        		script.prelayers[current_prelayer_number].layer_output = layer_output_enum.splat;
        			script.set_view_only_selected(script.prelayers[0],script.prelayers[0].layer_output,true);
	        	}
	        }
	        if (global_script.settings.example_buttons & 4) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
	        if (GUILayout.Button("Trees",EditorStyles.miniButtonMid,GUILayout.Width(75),GUILayout.Height(19))) {
	        	if (script.color_output) script.button_export = false;
	        	script.disable_outputs();
	        	if (global_script.settings.example_buttons & 4) {global_script.settings.example_buttons = 0;}
	        	else {
	        		global_script.settings.example_buttons = 4;
	        		script.tree_output = true;
	        		script.prelayers[current_prelayer_number].layer_output = layer_output_enum.tree;
        			script.set_view_only_selected(script.prelayers[0],script.prelayers[0].layer_output,true);
	        	}
	        }
	        if (global_script.settings.example_buttons & 8) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
	        if (GUILayout.Button("Grass",EditorStyles.miniButtonMid,GUILayout.Width(75),GUILayout.Height(19))) {
	        	if (script.color_output) script.button_export = false;
	        	script.disable_outputs();
	        	if (global_script.settings.example_buttons & 8) {global_script.settings.example_buttons = 0;}
	        	else {
	        		global_script.settings.example_buttons = 8;
	        		script.grass_output = true;
	        		script.prelayers[current_prelayer_number].layer_output = layer_output_enum.grass;
        			script.set_view_only_selected(script.prelayers[0],script.prelayers[0].layer_output,true);
	        	}
	        }
	        if (global_script.settings.example_buttons & 16) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
	        if (GUILayout.Button("Object",EditorStyles.miniButtonMid,GUILayout.Width(75),GUILayout.Height(19))) {
	        	if (script.color_output) script.button_export = false;
	        	script.disable_outputs();
	        	if (global_script.settings.example_buttons & 16) {global_script.settings.example_buttons = 0;}
	        	else {
	        		script.object_output = true;
	        		global_script.settings.example_buttons = 16;
	        		script.prelayers[current_prelayer_number].layer_output = layer_output_enum.object;
        			script.set_view_only_selected(script.prelayers[0],script.prelayers[0].layer_output,true);
	        	}
	        }
	        GUI.backgroundColor = Color.white;
	        EditorGUILayout.EndHorizontal();
	        var count_layer: int;
	        
	        if (global_script.settings.example_buttons & 1) {
	        	
	        	gui_changed_old = GUI.changed;
			    GUI.changed = false;
			    	
	        	for (count_layer = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
	        		if (script.prelayers[0].layer[count_layer].output == layer_output_enum.heightmap) {
		        		
		        		EditorGUILayout.BeginHorizontal();
		        		GUI.color = Color.green;
			    		EditorGUILayout.LabelField(script.prelayers[0].layer[count_layer].text+" Strength",GUILayout.Width(145));
			    		script.prelayers[0].layer[count_layer].strength = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].strength,0,4);
			    		GUI.color = Color.white;
		        		EditorGUILayout.EndHorizontal();	
		        		
		        		EditorGUILayout.BeginHorizontal();
		        		GUI.color = Color.green;
			    		EditorGUILayout.LabelField(script.prelayers[0].layer[count_layer].text+" Zoom",GUILayout.Width(145));
			    		script.prelayers[0].layer[count_layer].zoom = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].zoom,0,10);
	        			GUI.color = Color.white;
		        		EditorGUILayout.EndHorizontal();	
		        		
		        		if (GUI.changed) {generate_auto();}
		        		
		        		GUI.changed = false;
		        		script.prelayers[0].layer[count_layer].offset = draw_offset_range(script.prelayers[0].layer[count_layer].text,script.prelayers[0].layer[count_layer].offset,Vector2(0.5,0.5),script.prelayers[0].layer[count_layer].offset_middle,0);
	        			if (GUI.changed) {
	        				script.prelayers[0].layer[count_layer].offset_middle = script.prelayers[0].layer[count_layer].offset;
	        			}
		        	}
		        }
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(153);
	        	if (GUILayout.Button("Randomize Offset",GUILayout.Width(145))) {
					randomize_layer_offset (layer_output_enum.heightmap,Vector2(-2000,2000));
					generate_auto();
				}
				EditorGUILayout.EndHorizontal();
				if (GUI.changed) {generate_auto();}
		        GUI.changed = gui_changed_old;
		    }
	        else if (global_script.settings.example_buttons & 2) {
	        	for (count_layer = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
	        		if (script.prelayers[0].layer[count_layer].output == layer_output_enum.splat) {
		        		EditorGUILayout.BeginHorizontal();
		        		GUI.color = Color.green;
			    		EditorGUILayout.LabelField(script.prelayers[0].layer[count_layer].text,GUILayout.Width(145));
			    		GUI.color = Color.white;
			    		gui_changed_old = GUI.changed;
			    		GUI.changed = false;
			    		script.prelayers[0].layer[count_layer].active = EditorGUILayout.Toggle (script.prelayers[0].layer[count_layer].active,GUILayout.Width(25));
			    		if (GUI.changed) {
			    			activate_layer(count_layer,layer_output_enum.splat);
			    			generate_auto();
			    		}
			    		GUI.changed = gui_changed_old;
			    		EditorGUILayout.EndHorizontal();	
		        	}	
	        	}
	        }
	        
	        else if (global_script.settings.example_buttons & 4) {
	        	EditorGUILayout.BeginHorizontal();
        		GUI.color = Color.green;
	    		EditorGUILayout.LabelField("Generate Trees",GUILayout.Width(145));
	    		GUI.color = Color.white;
	    		global_script.settings.example_tree_active = EditorGUILayout.Toggle (global_script.settings.example_tree_active,GUILayout.Width(25));
	    		GUI.color = Color.white;
        		EditorGUILayout.EndHorizontal();	
        		
	        	for (count_layer = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
	        		if (script.prelayers[0].layer[count_layer].output == layer_output_enum.tree) {
		        		EditorGUILayout.BeginHorizontal();
		        		GUI.color = Color.green;
			    		EditorGUILayout.LabelField(script.prelayers[0].layer[count_layer].text,GUILayout.Width(145));
			    		GUI.color = Color.white;
			    		gui_changed_old = GUI.changed;
			    		GUI.changed = false;
			    		script.prelayers[0].layer[count_layer].active = EditorGUILayout.Toggle (script.prelayers[0].layer[count_layer].active,GUILayout.Width(25));
			    		if (GUI.changed) {
			    			activate_layer(count_layer,layer_output_enum.tree);
			    		}
			    		EditorGUILayout.EndHorizontal();	
			    			
			    		if (script.prelayers[0].layer[count_layer].active) {
			    			EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Tree Density",GUILayout.Width(145));
				    		script.prelayers[0].layer[count_layer].strength = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].strength,0,1);
				    		GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Tree Zoom",GUILayout.Width(145));
				    		script.prelayers[0].layer[count_layer].zoom = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].zoom,0,10);
		        			GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Tree Area",GUILayout.Width(145));
				    		if (script.prelayers[0].layer[count_layer].prefilter.filter_index.Count > 0) {
				    			if (script.filter[script.prelayers[0].layer[count_layer].prefilter.filter_index[0]].presubfilter.subfilter_index.Count > 2) {
				    				script.subfilter[script.filter[script.prelayers[0].layer[count_layer].prefilter.filter_index[0]].presubfilter.subfilter_index[2]].curve_position = 
				    					EditorGUILayout.Slider (script.subfilter[script.filter[script.prelayers[0].layer[count_layer].prefilter.filter_index[0]].presubfilter.subfilter_index[2]].curve_position,0,1);
				    			}
				    		}
				    		GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Tree Scale",GUILayout.Width(145));
				    		script.prelayers[0].layer[count_layer].tree_output.scale = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].tree_output.scale,0.0001,10);
		        			GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();
			        		if (GUI.changed) {generate_auto();}	
			        		GUI.changed = false;
			        		script.prelayers[0].layer[count_layer].offset = draw_offset_range(script.prelayers[0].layer[count_layer].text,script.prelayers[0].layer[count_layer].offset,Vector2(0.5,0.5),script.prelayers[0].layer[count_layer].offset_middle,0);
		        			if (GUI.changed) {
		        				script.prelayers[0].layer[count_layer].offset_middle = script.prelayers[0].layer[count_layer].offset;
		        				generate_auto();
		        			}	
			        	}
			        	GUI.changed = gui_changed_old;
			        }	
			    }
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(153);
	        	if (GUILayout.Button("Randomize Offset",GUILayout.Width(145))) {
					randomize_layer_offset (layer_output_enum.tree,Vector2(-2000,2000));
					generate_auto();
				}
				EditorGUILayout.EndHorizontal();
	        }
	        
	        else if (global_script.settings.example_buttons & 8) {
	        	EditorGUILayout.BeginHorizontal();
        		GUI.color = Color.green;
	    		EditorGUILayout.LabelField("Generate Grass",GUILayout.Width(145));
	    		GUI.color = Color.white;
	    		global_script.settings.example_grass_active = EditorGUILayout.Toggle (global_script.settings.example_grass_active,GUILayout.Width(25));
	    		GUI.color = Color.white;
        		EditorGUILayout.EndHorizontal();	
	        	for (count_layer = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
	        		if (script.prelayers[0].layer[count_layer].output == layer_output_enum.grass) {
		        		EditorGUILayout.BeginHorizontal();
		        		GUI.color = Color.green;
			    		EditorGUILayout.LabelField(script.prelayers[0].layer[count_layer].text,GUILayout.Width(145));
			    		GUI.color = Color.white;
			    		gui_changed_old = GUI.changed;
			    		GUI.changed = false;
			    		script.prelayers[0].layer[count_layer].active = EditorGUILayout.Toggle (script.prelayers[0].layer[count_layer].active,GUILayout.Width(25));
			    		if (GUI.changed) {
			    			activate_layer(count_layer,layer_output_enum.grass);
			    			generate_auto();
			    		}
			    		GUI.changed = gui_changed_old;
			    		EditorGUILayout.EndHorizontal();	
			    		
			    		if (script.prelayers[0].layer[count_layer].active) {
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Grass Density",GUILayout.Width(145));
				    		script.prelayers[0].layer[count_layer].strength = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].strength,0,1);
				    		GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Grass Mix Rate",GUILayout.Width(145));
				    		gui_changed_old = GUI.changed;
			    			GUI.changed = false;
				    		script.prelayers[0].layer[count_layer].grass_output.mix[0] = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].grass_output.mix[0],0.0001,10);
		        			if (GUI.changed)
					        {
					        	gui_changed_old = true;
					        	script.prelayers[0].layer[count_layer].grass_output.set_grass_curve();
					        	generate_auto();
			           		}
			           		GUI.changed = gui_changed_old;
			           		GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        	}
			        }	
		        }
	        }
	        
	        else if (global_script.settings.example_buttons & 16) {
	        	for (count_layer = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
	        		if (script.prelayers[0].layer[count_layer].output == layer_output_enum.object) {
		        		EditorGUILayout.BeginHorizontal();
		        		GUI.color = Color.green;
			    		EditorGUILayout.LabelField("Generate Objects",GUILayout.Width(145));
			    		GUI.color = Color.white;
			    		global_script.settings.example_object_active = EditorGUILayout.Toggle (global_script.settings.example_object_active,GUILayout.Width(25));
			    		GUI.color = Color.white;
		        		EditorGUILayout.EndHorizontal();	
		        		
		        		EditorGUILayout.BeginHorizontal();
		        		GUI.color = Color.green;
			    		EditorGUILayout.LabelField(script.prelayers[0].layer[count_layer].text,GUILayout.Width(145));
			    		GUI.color = Color.white;
			    		gui_changed_old = GUI.changed;
			    		GUI.changed = false;
			    		script.prelayers[0].layer[count_layer].active = EditorGUILayout.Toggle (script.prelayers[0].layer[count_layer].active,GUILayout.Width(25));
			    		if (GUI.changed) {
			    			activate_layer(count_layer,layer_output_enum.object);
			    		}
			    		EditorGUILayout.EndHorizontal();	
			    		
			    		if (script.prelayers[0].layer[count_layer].active) {
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Object Density",GUILayout.Width(145));
				    		script.prelayers[0].layer[count_layer].strength = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].strength,0,1);
				    		GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Object Zoom",GUILayout.Width(145));
				    		script.prelayers[0].layer[count_layer].zoom = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].zoom,0,10);
		        			GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Object Area",GUILayout.Width(145));
				    		if (script.prelayers[0].layer[count_layer].prefilter.filter_index.Count > 0) {
				    			if (script.filter[script.prelayers[0].layer[count_layer].prefilter.filter_index[0]].presubfilter.subfilter_index.Count > 2) {
				    				script.subfilter[script.filter[script.prelayers[0].layer[count_layer].prefilter.filter_index[0]].presubfilter.subfilter_index[2]].curve_position = 
				    					EditorGUILayout.Slider (script.subfilter[script.filter[script.prelayers[0].layer[count_layer].prefilter.filter_index[0]].presubfilter.subfilter_index[2]].curve_position,0,1);
				    			}
				    		}
				    		GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();	
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUI.color = Color.green;
				    		EditorGUILayout.LabelField("Object Scale",GUILayout.Width(145));
				    		script.prelayers[0].layer[count_layer].object_output.scale = EditorGUILayout.Slider (script.prelayers[0].layer[count_layer].object_output.scale,0.0001,10);
		        			GUI.color = Color.white;
			        		EditorGUILayout.EndHorizontal();
			        		
			        		if (GUI.changed) {generate_auto();}	
			        		GUI.changed = false;
			        		script.prelayers[0].layer[count_layer].offset = draw_offset_range(script.prelayers[0].layer[count_layer].text,script.prelayers[0].layer[count_layer].offset,Vector2(0.5,0.5),script.prelayers[0].layer[count_layer].offset_middle,0);
		        			if (GUI.changed) {
		        				script.prelayers[0].layer[count_layer].offset_middle = script.prelayers[0].layer[count_layer].offset;
		        				generate_auto();
		        			}		
			        	}
			        	GUI.changed = gui_changed_old;
			        	
			        	EditorGUILayout.BeginHorizontal();
			        	GUILayout.Space(153);
			        	if (GUILayout.Button("Randomize Offset",GUILayout.Width(145))) {
							randomize_layer_offset (layer_output_enum.grass,Vector2(-2000,2000));
							generate_auto();
						}
						EditorGUILayout.EndHorizontal();
			    	}	
		        }
	        }
	        
	        GUILayout.Space(10);
	        
	        EditorGUILayout.BeginHorizontal();
	        GUI.color = Color.green;
		    EditorGUILayout.LabelField("Generate",GUILayout.Width(145));
		    GUI.color = Color.white;
		    if (GUILayout.Button("Start",GUILayout.Width(145))) {
				script.button_export = false;
				Repaint();
				if (!check_downloaded_examples()) {return;}
				if (!script.terrains[0].terrain) {
					this.ShowNotification(GUIContent("Create terrains first by clicking the \n'Create Terrains' button"));
				}
				else {
					script.create_pass = -1;
					load_example_terrain(false);
				}
			}
			EditorGUILayout.EndHorizontal();
	    }
	    
        if (script.measure_tool)
        {
        	if (!script.measure_tool_undock){draw_measure_tool();}
        }
        // GUILayout.Space(10);
        // global_script.drawGUIBox(Rect(5,197,Screen.width,384),"Terrain",global_script.map.backgroundColor,global_script.map.titleColor,global_script.map.color);
		
		if (script.settings.showMeshes) {
			script.meshes_foldout = EditorGUILayout.Foldout (script.meshes_foldout,script.mesh_text);
			
			if (script.meshes_foldout) {
				EditorGUILayout.BeginHorizontal();
			        GUILayout.Space(15);
			        // add mesh
		        	if (global_script.settings.tooltip_mode != 0)
		        	{
		        		tooltip_text = "Add a new Mesh";
		        	}
		        	if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25))){script.meshes.Add(new mesh_class());}
		        	
		        	// erase mesh
		        	if (global_script.settings.tooltip_mode != 0)
		        	{
		        		tooltip_text = "Erase the last Mesh\n(Control Click)\n\nClear Mesh List\n(Control Shift Click)";
		        	}
		        	if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)) && script.meshes.Count > 1)
		        	{
		        		if (key.control) {
		        			if (!key.shift)
				    		{
				    			UndoRegister("Erase Mesh");
				        		script.meshes.RemoveAt(script.meshes.Count-1);
				    		}
				    		else
				    		{
				    			UndoRegister("Erase Meshes");
				    			script.clear_meshes();
				    		}
				    	}
				    	else {
							this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
						}
		        	}
		        	
		        	if (global_script.settings.tooltip_mode != 0)
		        	{
		        		tooltip_text = "Auto Search meshes from The Scene\n(Shift Click)";
		        	}
		        	if (GUILayout.Button(GUIContent("<Search>",button_search,tooltip_text),GUILayout.Width(85),GUILayout.Height(19)))
		        	{
		        		if (key.shift) {
			        		script.set_auto_mesh();
			        	}
			        	else {
							this.ShowNotification(GUIContent("Shift click <Search> to search for meshes in the Scene"));
						}
		        	}
		        	
		        	script.meshes_layer = EditorGUILayout.LayerField(script.meshes_layer,GUILayout.Width(75));
		        	
		        	if (global_script.settings.tooltip_mode != 0)
		        	{
		        		tooltip_text = "Fold/Unfold all meshes\n(Click)\n\nInvert Foldout all meshes\n(Shift Click)";
		        	}
		        	if (script.settings.showTerrains) {
			        	if (GUILayout.Button(GUIContent("F",tooltip_text),GUILayout.Width(20)))
			        	{
			        		script.meshes_foldout2 = !script.meshes_foldout2;
			        		script.change_meshes_foldout(key.shift);
			        	}
			        }
		        	
		        	if (global_script.settings.tooltip_mode != 0)
		        	{
		        		tooltip_text = "Activate/Deactivate all meshes\n(Click)\n\nInvert Activation all meshes\n(Shift Click)";
		        	}
		        	if (GUILayout.Button(GUIContent("A",tooltip_text),GUILayout.Width(20)))
		        	{
		        		script.meshes_active = !script.meshes_active;
		        		script.change_meshes_active(key.shift);
		        	}
		        	
		        	if (global_script.settings.tooltip_mode != 0)
		        	{
		        		tooltip_text = "Activate/Deactivate short mesh List display\n(Click)";
		        	}
		        	if (script.settings.display_short_mesh){GUI.backgroundColor = Color.green;}
		        	if (GUILayout.Button(GUIContent("I",tooltip_text),GUILayout.Width(20)))
		        	{
		        		script.settings.display_short_mesh = !script.settings.display_short_mesh;
		        	}
		        	if (script.settings.display_short_mesh){GUI.backgroundColor = Color.white;}
	        
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	            	GUILayout.Space(15);
	            	EditorGUILayout.LabelField("Search in GameObject",GUILayout.Width(200));
	            	script.object_search = EditorGUILayout.ObjectField(script.object_search,Transform,true,GUILayout.Width(182)) as Transform;
	            EditorGUILayout.EndHorizontal();
	            
	            EditorGUILayout.BeginHorizontal();
	            	GUILayout.Space(15);
	            	EditorGUILayout.LabelField("Object Resolution",GUILayout.Width(200));
	            	script.object_resolution = EditorGUILayout.IntField(script.object_resolution,GUILayout.Width(182));
	            EditorGUILayout.EndHorizontal();
	            
	            if (script.meshes.Count == 0){script.meshes.Add(new mesh_class());}
	            
	            if (script.settings.remarks){draw_remarks(script.mesh_remarks,15);}
	            
	            var space: int = 0;
			
				// terrain loop
	            if (!script.settings.display_short_mesh || script.meshes.Count < 3)
	            {
		            for (var i: int = 0;i < script.meshes.Count;++i)
			        {
			        	current_mesh = script.meshes[i];
			        	draw_mesh(space,i);	
					}
				}
				else
				{
					current_mesh = script.meshes[0];
					draw_mesh(space,0);
					if (script.meshes.Count > 1)
					{
						EditorGUILayout.BeginHorizontal();
							GUILayout.Space(27);
							EditorGUILayout.LabelField("...");
						EditorGUILayout.EndHorizontal();
						current_mesh = script.meshes[script.meshes.Count-1];
						draw_mesh(space,script.meshes.Count-1);
					}
				}
			}
		}
		
		if (key.type == EventType.layout){mouse_position = key.mousePosition;}
		
		if (script.settings.showTerrains) {
			script.terrains_foldout = EditorGUILayout.Foldout (script.terrains_foldout,script.terrain_text);
			
			if (key.type == EventType.Repaint)
    		{
    			script.terrainMenuRect = GUILayoutUtility.GetLastRect();
    			script.terrainMenuRect.width = (script.terrain_text.Length*7)-15;
    			script.terrainMenuRect.x += 14;
    			script.terrainMenuRect.y += script.settings.top_height;
    			if (script.settings.top_height > 0) script.terrainMenuRect.y += 3;
    		}
    	
    		if (check_point_in_rect(script.terrainMenuRect,mouse_position - Vector2(-5,0)) && key.type == EventType.layout)
			{
				if (key.button == 1) {
					terrainMenu = new GenericMenu ();    
        	 		terrainMenu.AddItem (new GUIContent("Search Hierarchy"),script.terrainSearch,TerrainMenu,"Search");                
        	 		// terrainMenu.AddSeparator ("File/"); 
        	 		// terrainMenu.AddItem (new GUIContent("File/Open"),false,description_menu,"open");                
        	        // terrainMenu.AddItem (new GUIContent("File/Save"),false,description_menu,"save");    

        	 		script.terrainMenuRect.y += 2;	 
        	 		terrainMenu.DropDown (script.terrainMenuRect);
        	 	}
    		}
			
			// GUILayout.Space(20);
	        // terrain foldout
	        
	        if (script.terrains_foldout)
		    {
		    	if (script.terrainSearch) {
			    	EditorGUILayout.BeginHorizontal();
			    		GUILayout.Space(15);
				    	if (global_script.settings.tooltip_mode != 0)
			        	{
			        		tooltip_text = "Auto Search Terrains from The Scene\n(Shift Click)";
			        	}
			        	EditorGUILayout.LabelField("Search Parent",GUILayout.Width(100));
			        	script.terrainSearchParent = EditorGUILayout.ObjectField(script.terrainSearchParent,Transform,true,GUILayout.Width(195)) as Transform;
			        	if (GUILayout.Button(GUIContent("<Search>",button_search,tooltip_text),GUILayout.Width(85),GUILayout.Height(19)))
			        	{
			        		if (key.shift) {
				        		script.AutoSearchTerrains();
				        		// script.reset_terrains_tiles(script);
				        		// assign_all_terrain_splat_alpha();
				        	}
				        	else {
								this.ShowNotification(GUIContent("Shift click <Search> to search for terrains in the Scene"));
							}
			        	}
			        EditorGUILayout.EndHorizontal();
			    }
		    	
		        var color_terrain: Color;
		        if (global_script.settings.color_scheme){color_terrain = global_script.settings.color.color_terrain;} else {color_terrain = Color.white;}
		        EditorGUILayout.BeginHorizontal();
		        GUILayout.Space(15);
		        // add terrain
	        	if (global_script.settings.tooltip_mode != 0)
	        	{
	        		tooltip_text = "Add a new Terrain";
	        	}
	        	if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25))){script.set_terrain_length(script.terrains.Count+1);}
	        	
	        	// erase terrain
	        	if (global_script.settings.tooltip_mode != 0)
	        	{
	        		tooltip_text = "Erase the last Terrain\n(Control Click)\n\nClear Terrain List\n(Control Shift Click)";
	        	}
	        	if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)) && script.terrains.Count > 1)
	        	{
	        		if (key.control) {
	        			if (!key.shift)
			    		{
			    			UndoRegister("Erase Terrain");
	        				script.set_terrain_length(script.terrains.Count-1);
			    		}
			    		else
			    		{
			    			UndoRegister("Erase Terrains");
			    			script.clear_terrains();
			    		}
			    	}
			    	else {
						this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
					}
	        	}
	        	
	        	if (global_script.settings.tooltip_mode != 0)
	        	{
	        		tooltip_text = "Fold/Unfold all Terrains\n(Click)\n\nInvert Foldout all Terrains\n(Shift Click)";
	        	}
	        	if (GUILayout.Button(GUIContent("F",tooltip_text),GUILayout.Width(20)))
	        	{
	        		script.terrains_foldout2 = !script.terrains_foldout2;
	        		script.change_terrains_foldout(key.shift);
	        	}
	        	
	        	if (global_script.settings.tooltip_mode != 0)
	        	{
	        		tooltip_text = "Activate/Deactivate short Terrain List display\n(Click)";
	        	}
	        	if (script.settings.display_short_terrain){GUI.backgroundColor = Color.green;}
	        	if (GUILayout.Button(GUIContent("I",tooltip_text),GUILayout.Width(20)))
	        	{
	        		script.settings.display_short_terrain = !script.settings.display_short_terrain;
	        	}
	        	if (script.settings.display_short_terrain){GUI.backgroundColor = Color.white;}
	        	
	        	GUILayout.Space(142);
	        	if (global_script.settings.tooltip_mode != 0)
	        	{
	        		tooltip_text = "Activate/Deactivate all Terrains\n(Click)\n\nInvert Activation all Terrains\n(Shift Click)";
	        	}
	        	if (GUILayout.Button(GUIContent("A",tooltip_text),GUILayout.Width(20)))
	        	{
	        		script.terrains_active = !script.terrains_active;
	        		script.change_terrains_active(key.shift);
	        	}
	        	
	        	EditorGUILayout.EndHorizontal();
	            
	            if (script.terrains.Count == 0){script.terrains.Add(new terrain_class());}
	            
	            if (script.settings.remarks){draw_remarks(script.remarks,15);}
	            
	            space = 0;
			
				if (script.settings.tabs){space = -30;} 
	            
	            // terrain loop
	            if (!script.settings.display_short_terrain || script.terrains.Count < 3)
	            {
		            for (count_terrain = 0;count_terrain < script.terrains.Count;++count_terrain)
			        {
			        	current_terrain = script.terrains[count_terrain];
			        	draw_terrain(space);	
					}
				}
				else
				{
					count_terrain = 0;
					current_terrain = script.terrains[0];
					draw_terrain(space);
					if (script.terrains.Count > 1)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(27);
						EditorGUILayout.LabelField("...");
						EditorGUILayout.EndHorizontal();
						count_terrain = script.terrains.Count-1;
						current_terrain = script.terrains[script.terrains.Count-1];
						draw_terrain(space);
					}
				}
				if (script.tree_output) {
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(27);
				EditorGUILayout.LabelField("Total trees placed -> "+GetTreesPlaced().ToString());
				EditorGUILayout.EndHorizontal();
				}
			}
		}			
			if (script.quick_tools)
	        {
	         	GUI.color = Color.white;
	         	EditorGUILayout.BeginHorizontal();
			    // GUILayout.Space(15);
			    script.quick_tools_foldout = EditorGUILayout.Foldout(script.quick_tools_foldout,"Quick Tools");
			    EditorGUILayout.EndHorizontal();
	        	
	        	if (script.quick_tools_foldout)
	        	{
					if (script.settings.tabs)
					{
						space = -15;
						EditorGUILayout.BeginHorizontal();
			        	GUILayout.Space(30);
			        	if (script.stitch_tool_foldout){GUI.backgroundColor = Color.green;}
			        	if (GUILayout.Button(GUIContent("Stitch Tool",button_stitch),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.stitch_tool_foldout)
			        		{
			        			close_quick_tools_foldouts();
			        			script.stitch_tool_foldout = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.stitch_tool_foldout = false;
			        		}
			        	}
			        	
			        	if (script.smooth_tool_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
			        	if (GUILayout.Button(GUIContent("Smooth Tool",button_smooth),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.smooth_tool_foldout)
			        		{
			        			close_quick_tools_foldouts();
			        			script.smooth_tool_foldout = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.smooth_tool_foldout = false;
			        		}
			        	}
			        	
			        	if (script.slice_tool_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
			        	if (GUILayout.Button(GUIContent("Slice Tool",button_slice),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.slice_tool_foldout)
			        		{
			        			close_quick_tools_foldouts();
			        			script.slice_tool_foldout = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.slice_tool_foldout = false;
			        		}
			        	}
			        	if (script.settings.mesh_button){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
			        	if (GUILayout.Button(GUIContent("Mesh Convert",button_convert),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.settings.mesh_button)
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.mesh_button = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.mesh_button = false;
			        		}
			        	}
			        	EditorGUILayout.EndHorizontal();
			        	
			        	EditorGUILayout.BeginHorizontal();
			        	GUILayout.Space(30);
			        	if (script.settings.global_parameters){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
			        	if (GUILayout.Button(GUIContent("Global Param.",button_global),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.settings.global_parameters)
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.global_parameters = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.stitch_tool_foldout = false;
			        		}
			        	}
			        	
			        	if (script.settings.tree_button){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
			        	if (GUILayout.Button(GUIContent("Tree Map",button_tree),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.settings.tree_button)
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.tree_button = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.tree_button = false;
			        		}
			        	}
			        	
			        	if (script.settings.grass_button){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
			        	if (GUILayout.Button(GUIContent("Grass Map",button_grass),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.settings.grass_button)
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.grass_button = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.grass_button = false;
			        		}
			        	}
			        	
			        	if (script.settings.light_button){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
			        	if (GUILayout.Button(GUIContent("Lights Setup",button_sun),EditorStyles.miniButtonMid,GUILayout.Width(110),GUILayout.Height(19)))
			        	{
			        		if (!script.settings.light_button)
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.light_button = true;
			        		}
			        		else
			        		{
			        			close_quick_tools_foldouts();
			        			script.settings.light_button = false;
			        		}
			        	}
			        	
			        	GUI.backgroundColor = Color.white;
			       		EditorGUILayout.EndHorizontal();
				    }
					
					
					if (!script.settings.tabs)
					{
						EditorGUILayout.BeginHorizontal();
					    GUILayout.Space(30);
					    script.stitch_tool_foldout = EditorGUILayout.Foldout(script.stitch_tool_foldout,"Stitch Tool");
					    EditorGUILayout.EndHorizontal();
					}
				        
				    if (script.stitch_tool_foldout)
				    {
				    	EditorGUILayout.BeginHorizontal();
						GUILayout.Space(45+space);
						if (script.terrains[0].terrain)
				    	{
					    	if (script.terrains[0].terrain.terrainData)
					    	{
						    	EditorGUILayout.LabelField("Border Influence",GUILayout.Width(120));
						        gui_changed_old = GUI.changed;
						        gui_changed_window = GUI.changed; GUI.changed = false;
						        script.stitch_tool_border_influence = EditorGUILayout.Slider(script.stitch_tool_border_influence,script.terrains[0].heightmap_conversion.x*1.5,script.terrains[0].terrain.terrainData.size.x);
						        EditorGUILayout.LabelField("("+(script.stitch_tool_border_influence/script.terrains[0].heightmap_conversion.x).ToString("F2")+")");
						        if (GUI.changed)
						        {
						        	if (script.stitch_tool_border_influence < script.terrains[0].heightmap_conversion.x*1.5){script.stitch_tool_border_influence = Mathf.Ceil(script.terrains[0].heightmap_conversion.x*1.5);}
						        	if (script.stitch_tool_border_influence > script.terrains[0].terrain.terrainData.size.x){script.stitch_tool_border_influence = script.terrains[0].terrain.terrainData.size.x;}
						        }
						        GUI.changed = gui_changed_old;
						    }
					    } 
					    else
					    {
					    	EditorGUILayout.LabelField("Assign a terrain to Terrain List0");
					    }
					    EditorGUILayout.EndHorizontal();
										        				        
						if (script.terrains.Count < 2)
						{
							GUILayout.Space(5);
							EditorGUILayout.BeginHorizontal();
				        	GUILayout.Space(45+space);
				        	EditorGUILayout.LabelField("Multiple Terrains are needed");
							EditorGUILayout.EndHorizontal();
						}
						else
						{
							if (current_terrain.tiles.x == 1 || current_terrain.tiles.y == 1)
							{
								GUILayout.Space(5);
								EditorGUILayout.BeginHorizontal();
					       		GUILayout.Space(45+space);
					       		EditorGUILayout.LabelField("Terrains are not fitted to one big Tile",GUILayout.Width(220));
					       		GUI.color = Color.red;
				        		if (global_script.settings.tooltip_mode != 0)
						        {
						        	tooltip_text = "The terrains are not fitted together to one big Tile\n\nClick to foldout Size\n\nShift Click to Fit All";
						        }
				        		if (GUILayout.Button(GUIContent("",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(23)))
				        		{
				        			if (!key.shift)
				        			{
					        			script.terrains[0].prearea.foldout = false;
					        			script.terrains[0].data_foldout = true;
					        			script.terrains[0].foldout = true;
					        			script.terrains[0].size_foldout = true;
					        			script.terrains[0].resolution_foldout = false;script.terrains[0].splat_foldout = false;script.terrains[0].tree_foldout = false;script.terrains[0].detail_foldout = false;
					        		}
					        		else
					        		{
					        			fit_all_terrains(script.terrains[0]);
					        		}
				        		}
				        		GUI.color = color_terrain;
								EditorGUILayout.EndHorizontal();
							}
							else
							{
								EditorGUILayout.BeginHorizontal();
					       		GUILayout.Space(45+space);
								if (GUILayout.Button("Stitch",GUILayout.Width(70)))
								{
									if (script.stitch_tool_border_influence < script.terrains[0].heightmap_conversion.x*1.5){script.stitch_tool_border_influence = Mathf.Ceil(script.terrains[0].heightmap_conversion.x*1.5);}
				        			if (script.stitch_tool_border_influence > script.terrains[0].terrain.terrainData.size.x){script.stitch_tool_border_influence = script.terrains[0].terrain.terrainData.size.x;}
									stitch_terrains();	
								}
								EditorGUILayout.EndHorizontal();
							}
						}
			        }
			        
			        if (!script.settings.tabs)
			        {
				        EditorGUILayout.BeginHorizontal();
					    GUILayout.Space(30);
					    script.slice_tool_foldout = EditorGUILayout.Foldout(script.slice_tool_foldout,"Slice Tool");
					    EditorGUILayout.EndHorizontal();
					}
				        
				    if (script.slice_tool_foldout)
				    {
				    	/*
				    	EditorGUILayout.BeginHorizontal();
					    GUILayout.Space(45+space);
					    script.slice_tool_heightmap_foldout = EditorGUILayout.Foldout(script.slice_tool_heightmap_foldout,"Only heightmap");
				    	EditorGUILayout.EndHorizontal();
					        
				    	if (script.slice_tool_heightmap_foldout)
				    	{
					    	EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(60+space);
					        EditorGUILayout.LabelField("Slice Active",GUILayout.Width(120));
					        gui_changed_old = GUI.changed;
					        gui_changed_window = GUI.changed; GUI.changed = false;
					        script.slice_tool_active = EditorGUILayout.Toggle(script.slice_tool_active,GUILayout.Width(25));
					        if (GUI.changed){if (!script.slice_tool_active){script.button_generate_text = "Generate";slice_tool_active = false;} else {script.button_generate_text = "Slice";}}
					        GUI.changed = gui_changed_old;
					        EditorGUILayout.EndHorizontal();
					        
					        EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(60+space);
					        EditorGUILayout.LabelField("Slice Terrain",GUILayout.Width(120));
					        script.slice_tool_terrain = EditorGUILayout.ObjectField(script.slice_tool_terrain, Terrain,true,GUILayout.Width(200)) as Terrain;
					        EditorGUILayout.EndHorizontal();
					        
					        EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(60+space);
					        EditorGUILayout.LabelField("Out of range Height",GUILayout.Width(120));
					        script.slice_tool_min_height = EditorGUILayout.FloatField(script.slice_tool_min_height,GUILayout.Width(70));
					        EditorGUILayout.EndHorizontal();
					        
					        EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(60+space);
					        script.slice_tool_offset = EditorGUILayout.Vector2Field("Position Offset",script.slice_tool_offset);
					        EditorGUILayout.EndHorizontal();
					        
					        if (script.terrains.Count < 2)
							{
								GUILayout.Space(5);
								EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	EditorGUILayout.LabelField("Multiple Terrains are needed");
								EditorGUILayout.EndHorizontal();
							}
							else
							{
								if (current_terrain.tiles.x == 0 || current_terrain.tiles.y == 0)
								{
									GUILayout.Space(5);
									EditorGUILayout.BeginHorizontal();
						       		GUILayout.Space(60+space);
						       		EditorGUILayout.LabelField("Terrains are not fitted to one big Tile",GUILayout.Width(220));
						       		GUI.color = Color.red;
					        		if (global_script.settings.tooltip_mode != 0)
							        {
							        	tooltip_text = "The terrains are not fitted together to one big Tile\n\nClick to foldout Size\n\nShift Click to Fit All";
							        }
					        		if (GUILayout.Button(GUIContent("",tooltip_text),GUILayout.Width(23)))
					        		{
						        		if (!key.shift)
						        		{
						        			script.terrains[0].prearea.foldout = false;
						        			script.terrains[0].data_foldout = true;
						        			script.terrains[0].foldout = true;
						        			script.terrains[0].size_foldout = true;
						        			script.terrains[0].resolution_foldout = false;script.terrains[0].splat_foldout = false;script.terrains[0].tree_foldout = false;script.terrains[0].detail_foldout = false;
						        		}
						        		else
						        		{
						        			fit_all_terrains();
						        		}
					        		}
					        		GUI.color = color_terrain;
									EditorGUILayout.EndHorizontal();
								}
								else
								{
									if (script.slice_tool_terrain)
									{
										EditorGUILayout.BeginHorizontal();
							       		GUILayout.Space(60+space);
										EditorGUILayout.LabelField("Add Heightmap Layer, Filter on -> Height");
										EditorGUILayout.EndHorizontal();
									}
								}
							}
						}
						EditorGUILayout.BeginHorizontal();
					    GUILayout.Space(45+space);
					    script.slice_tool_all_foldout = EditorGUILayout.Foldout(script.slice_tool_all_foldout,"All Settings");
				    	EditorGUILayout.EndHorizontal();
				    
				    	
				    	if (script.slice_tool_all_foldout)
				    	{
				    	*/
				    		draw_terrain_store(45+space,1);
				    		
				    		EditorGUILayout.BeginHorizontal();
				    		GUILayout.Space(45+space);
				    		if (script.terrains.Count == 1)
				    		{
				    			EditorGUILayout.LabelField("Erase Terrain Scene",GUILayout.Width(160));
				    		}
				    		else
				    		{
				    			EditorGUILayout.LabelField("Erase Terrains Scene",GUILayout.Width(160));
				    		}
				    		gui_changed_old = GUI.changed;
				    		gui_changed_window = GUI.changed; GUI.changed = false;
				    		script.slice_tool_erase_terrain_scene = EditorGUILayout.Toggle(script.slice_tool_erase_terrain_scene,GUILayout.Width(25));
				    		if (GUI.changed)
				    		{
				    			if (!script.slice_tool_erase_terrain_scene){script.slice_tool_erase_terrain_data = false;}
				    		}
				    		GUI.changed = gui_changed_old;
				    		EditorGUILayout.EndHorizontal();
				    		
				    		
				    		EditorGUILayout.BeginHorizontal();
				    		GUILayout.Space(45+space);
				    		EditorGUILayout.LabelField("Erase TerrainData Project",GUILayout.Width(160));
				    		if (script.slice_tool_erase_terrain_data){GUI.color = Color.red;}
				    		gui_changed_old = GUI.changed;
				    		gui_changed_window = GUI.changed; GUI.changed = false;
				    		script.slice_tool_erase_terrain_data = EditorGUILayout.Toggle(script.slice_tool_erase_terrain_data,GUILayout.Width(25));
				    		if (GUI.changed)
				    		{
				    			if (script.slice_tool_erase_terrain_data){script.slice_tool_erase_terrain_scene = true;}
				    		}
				    		GUI.changed = gui_changed_old;
				    		if (script.slice_tool_erase_terrain_data){EditorGUILayout.LabelField("<- This will erase the old TerrainData from your project",EditorStyles.boldLabel);}
				    		GUI.color = Color.white;
				    		EditorGUILayout.EndHorizontal();
				    		
				    		EditorGUILayout.BeginHorizontal();
				    		GUILayout.Space(45+space);
				    		if (GUILayout.Button("<Slice>",GUILayout.Width(70)))
				    		{
				    			if (key.shift) {
				    				slice_terrains();
				    			}
				    			else {
									this.ShowNotification(GUIContent("Shift click <Slice> to start slicing"));
								}
				    		}	
				    		EditorGUILayout.EndHorizontal();
				    	//}	
				    }
				    
				    if (!script.settings.tabs)
		        	{
			        	EditorGUILayout.BeginHorizontal();
			       		GUILayout.Space(30);
			       		script.settings.mesh_button = EditorGUILayout.Foldout(script.settings.mesh_button,"Mesh Convert");
			       		EditorGUILayout.EndHorizontal();
			       	}
				    
				    if (script.settings.mesh_button)
				    {
				    	EditorGUILayout.BeginHorizontal();
						GUILayout.Space(45+space);
						EditorGUILayout.LabelField("Path",GUILayout.Width(160));
						EditorGUILayout.LabelField(script.settings.mesh_path);
						if (GUILayout.Button(GUIContent(">Change",button_folder),GUILayout.Width(85),GUILayout.Height(19)))
						{
							if (!key.shift) {
								var mesh_path: String;
								mesh_path = EditorUtility.OpenFolderPanel("Export File Path",script.settings.mesh_path,"");
							   	if (mesh_path != ""){script.settings.mesh_path = mesh_path;}
							} 
							else {
								script.settings.mesh_path = Application.dataPath;
							}
						}
						EditorGUILayout.EndHorizontal();
				    	
				    	EditorGUILayout.BeginHorizontal();
							GUILayout.Space(45+space);
							EditorGUILayout.LabelField("Material",GUILayout.Width(160));
							script.settings.mesh_material = EditorGUILayout.ObjectField(script.settings.mesh_material,Material,false);
						EditorGUILayout.EndHorizontal();
				    	
				    	EditorGUILayout.BeginHorizontal();
				       		GUILayout.Space(45+space);
				       		EditorGUILayout.LabelField("Save as Unity Mesh",GUILayout.Width(160));
				       		script.settings.saveMesh = EditorGUILayout.Toggle(script.settings.saveMesh,GUILayout.Width(25));
				       		if (script.settings.saveMesh) script.settings.saveObj = false;
				       	EditorGUILayout.EndHorizontal();
				    	
				    	EditorGUILayout.BeginHorizontal();
				       		GUILayout.Space(45+space);
				       		EditorGUILayout.LabelField("Save as Obj",GUILayout.Width(160));
				       		script.settings.saveObj = EditorGUILayout.Toggle(script.settings.saveObj,GUILayout.Width(25));
				       		if (script.settings.saveObj) script.settings.saveMesh = false;
				       	EditorGUILayout.EndHorizontal();
				       	
				       	if (script.settings.saveObj) {
				       		EditorGUILayout.BeginHorizontal();
					       		GUILayout.Space(45+space);
					       		EditorGUILayout.LabelField("Export Format",GUILayout.Width(160));
					       		script.settings.saveFormat = EditorGUILayout.EnumPopup(script.settings.saveFormat);
							EditorGUILayout.EndHorizontal();
							
							EditorGUILayout.BeginHorizontal();
					       		GUILayout.Space(45+space);
					       		EditorGUILayout.LabelField("Resolution",GUILayout.Width(160));
					       		script.settings.saveResolution = EditorGUILayout.EnumPopup(script.settings.saveResolution);
							EditorGUILayout.EndHorizontal();
							
					       	EditorGUILayout.BeginHorizontal();
					       		GUILayout.Space(45+space);
					       		EditorGUILayout.LabelField("Swap UVs",GUILayout.Width(160));
					       		script.settings.swapUV = EditorGUILayout.Toggle(script.settings.swapUV,GUILayout.Width(25));
					       	EditorGUILayout.EndHorizontal();
					    }
				    	
				    	if (script.settings.saveObj || script.settings.saveMesh) {
					    	EditorGUILayout.BeginHorizontal();
					       		GUILayout.Space(45+space);
					       		var mesh_button_text: String;
					       		if (script.terrains.Count < 2){button_mesh_text = "Convert Terrain";} else {button_mesh_text = "Convert Terrains";}
					       		if (GUILayout.Button(button_mesh_text,GUILayout.Width(120))) { 
					       			if (script.settings.saveMesh) this.ShowNotification(GUIContent(script.convert_terrains_to_mesh()));
					       		    else if (script.settings.saveObj) {
					       		    	ExportTerrainsObj(script.settings.swapUV,script.settings.saveFormat,script.settings.saveResolution);
					       		    }
					       		}
				       		EditorGUILayout.EndHorizontal();
				       	}
			       	}
		        	
		        	if (!script.settings.tabs)
		        	{
			        	EditorGUILayout.BeginHorizontal();
			       		GUILayout.Space(30);
			       		script.smooth_tool_foldout = EditorGUILayout.Foldout(script.smooth_tool_foldout,"Smooth Tool");
			       		EditorGUILayout.EndHorizontal();
			       	}
		       		
		       		if (script.smooth_tool_foldout)
		       		{
//		       			if (script.terrains.Count > 1)
//		       			{
//			       			EditorGUILayout.BeginHorizontal();
//			       			GUILayout.Space(45+space);
//							EditorGUILayout.LabelField("Terrain",GUILayout.Width(120));	
//							script.smooth_tool_terrain_select = EditorGUILayout.Popup(script.smooth_tool_terrain_select,script.smooth_tool_terrain,GUILayout.Width(64));							       			
//				       		EditorGUILayout.EndHorizontal();
//				       	}
			       		EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
						EditorGUILayout.LabelField("Layer Strength",GUILayout.Width(120));								       		
						gui_changed_old = GUI.changed;
						gui_changed_window = GUI.changed; GUI.changed = false;
						script.smooth_tool_layer_strength = EditorGUILayout.IntField(script.smooth_tool_layer_strength,GUILayout.Width(50));
						if (GUI.changed)
						{
							if (script.smooth_tool_strength < 1){script.smooth_tool_strength = 1;}
						}
						EditorGUILayout.EndHorizontal();
			       		
			       		EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
						EditorGUILayout.LabelField("Strength",GUILayout.Width(120));								       		
						gui_changed_window = GUI.changed; GUI.changed = false;
						script.smooth_tool_strength = EditorGUILayout.FloatField(script.smooth_tool_strength,GUILayout.Width(50));
						if (GUI.changed)
						{
							if (script.smooth_tool_strength < 0){script.smooth_tool_strength = 0;}
							if (script.smooth_tool_strength > 1){script.smooth_tool_strength = 1;}
						}
						GUI.changed = gui_changed_old;
			       		EditorGUILayout.EndHorizontal();
			       		
			       		EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
						EditorGUILayout.LabelField("Repeat",GUILayout.Width(120));								       		
						gui_changed_window = GUI.changed; GUI.changed = false;
						script.smooth_tool_repeat = EditorGUILayout.FloatField(script.smooth_tool_repeat,GUILayout.Width(50));
						if (GUI.changed)
						{
							if (script.smooth_tool_repeat < 0){script.smooth_tool_repeat = 0;}
						}
						GUI.changed = gui_changed_old;
			       		EditorGUILayout.EndHorizontal();
			       		
			       		EditorGUILayout.BeginHorizontal();
			       		GUILayout.Space(45+space);
			       		EditorGUILayout.LabelField("Advanced",GUILayout.Width(120));
				       	script.smooth_tool_advanced = EditorGUILayout.Toggle(script.smooth_tool_advanced,GUILayout.Width(25));
			       		EditorGUILayout.EndHorizontal();
			       		
			       		if (script.smooth_tool_advanced)
				       	{
				       		EditorGUILayout.BeginHorizontal();
			       			GUILayout.Space(45+space);
				       		EditorGUILayout.LabelField("Height Curve",GUILayout.Width(120));
				       		script.smooth_tool_height_curve.curve = EditorGUILayout.CurveField(script.smooth_tool_height_curve.curve);
				       		EditorGUILayout.EndHorizontal();
				       		
				       		EditorGUILayout.BeginHorizontal();
			       			GUILayout.Space(45+space);
				       		EditorGUILayout.LabelField("Steepness Curve",GUILayout.Width(120));
				       		script.smooth_tool_angle_curve.curve = EditorGUILayout.CurveField(script.smooth_tool_angle_curve.curve);
				       		EditorGUILayout.EndHorizontal();
				       	}
			       		
			       		EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
			       		if (GUILayout.Button("Smooth",GUILayout.Width(70)))
			       		{
			       			//if (script.smooth_tool_terrain_select < script.terrains.Count){script.smooth_terrain(script.terrains[script.smooth_tool_terrain_select],script.smooth_tool_strength);}
			       				script.smooth_all_terrain(script.smooth_tool_strength);
			       		}
			       		EditorGUILayout.EndHorizontal();
			       	}
			       	
			       	if (!script.settings.tabs)
			       	{
				       	EditorGUILayout.BeginHorizontal();
			       		GUILayout.Space(30);
			       		script.settings.global_parameters = EditorGUILayout.Foldout(script.settings.global_parameters,"Global Parameters");
			       		EditorGUILayout.EndHorizontal();
			       	}
		       		
		       		gui_changed_old = GUI.changed;
		       		gui_changed_window = GUI.changed; GUI.changed = false;
		       		if (script.settings.global_parameters)
		       		{
		       			EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
		       			EditorGUILayout.LabelField("Height Scale",GUILayout.Width(150));
		       			script.settings.global_height_strength = EditorGUILayout.Slider(script.settings.global_height_strength,0,5);
		       			EditorGUILayout.EndHorizontal();
		       			
		       			EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
		       			EditorGUILayout.LabelField("Height Sea Level",GUILayout.Width(150));
		       			script.settings.global_height_level = EditorGUILayout.Slider(script.settings.global_height_level,0,1);
		       			EditorGUILayout.EndHorizontal();
		       			
		       			GUILayout.Space(2);
		       			
		       			EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
		       			EditorGUILayout.LabelField("Degree Scale",GUILayout.Width(150));
		       			script.settings.global_degree_strength = EditorGUILayout.Slider(script.settings.global_degree_strength,0,5);
		       			EditorGUILayout.EndHorizontal();
		       			
		       			EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
		       			EditorGUILayout.LabelField("Degree Sea Level",GUILayout.Width(150));
		       			script.settings.global_degree_level = EditorGUILayout.Slider(script.settings.global_degree_level,0,1);
		       			EditorGUILayout.EndHorizontal();
		       			
		       			EditorGUILayout.BeginHorizontal();
						GUILayout.Space(45+space);
						EditorGUILayout.LabelField("Angle Smoothing",GUILayout.Width(150));
						script.settings.smooth_angle = EditorGUILayout.Slider(script.settings.smooth_angle,1,100);	
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(45+space);
						EditorGUILayout.LabelField("Angle Rounding",GUILayout.Width(150));
						script.settings.round_angle = EditorGUILayout.Slider(script.settings.round_angle,0,100);	
						EditorGUILayout.EndHorizontal();
						
						GUILayout.Space(4);
				
		       			EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
		       			EditorGUILayout.LabelField("Stitch Heightmap",GUILayout.Width(150));
		       			script.settings.stitch_heightmap = EditorGUILayout.Toggle(script.settings.stitch_heightmap);
		       			EditorGUILayout.EndHorizontal();
		       			
		       			EditorGUILayout.BeginHorizontal();
		       			GUILayout.Space(45+space);
		       			EditorGUILayout.LabelField("Stitch Splatmap",GUILayout.Width(150));
		       			script.settings.stitch_splatmap = EditorGUILayout.Toggle(script.settings.stitch_splatmap);
		       			EditorGUILayout.EndHorizontal();
		       		}
		       		if (GUI.changed)
		       		{
		       			generate_auto();
		       		}
		       		GUI.changed = gui_changed_old;
		       		if (script.settings.tree_button)
		       		{
		       			EditorGUILayout.BeginHorizontal();
	        			GUILayout.Space(45+space);
	        			if (GUILayout.Button("+",GUILayout.Width(25))) {
	        				script.settings.treemap.Add(new tree_map_class());
	        			}
	        			if (GUILayout.Button("-",GUILayout.Width(25)) && script.settings.treemap.Count > 0) {
	        				if (key.control) {
	        					script.settings.treemap.RemoveAt(script.settings.treemap.Count-1);
	        				}
	        				else {
	        					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
	        				}
	        			}
	        			if (GUILayout.Button("F",GUILayout.Width(25)) && script.settings.treemap.Count > 0) {
	        				script.settings.tree_foldouts = !script.settings.tree_foldouts;
	        				var count_tree_foldout: int;
	        				
	        				if (!key.shift) {
		        				for (count_tree_foldout = 0;count_tree_foldout < script.settings.treemap.Count;++count_tree_foldout) {
		        					script.settings.treemap[count_tree_foldout].foldout = script.settings.tree_foldouts;
		        				}
		        			}
		        			else {
		        				for (count_tree_foldout = 0;count_tree_foldout < script.settings.treemap.Count;++count_tree_foldout) {
		        					script.settings.treemap[count_tree_foldout].foldout = !script.settings.treemap[count_tree_foldout].foldout;
		        				}
		        			}
	        			}
	        			if (GUILayout.Button("A",GUILayout.Width(25)) && script.settings.treemap.Count > 0) {
	        				script.settings.tree_actives = !script.settings.tree_actives;
	        				var count_tree_actives: int;
	        				
	        				if (!key.shift) {
		        				for (count_tree_actives = 0;count_tree_actives < script.settings.treemap.Count;++count_tree_actives) {
		        					script.settings.treemap[count_tree_actives].load = script.settings.tree_actives;
		        				}
		        			}
		        			else {
		        				for (count_tree_actives = 0;count_tree_actives < script.settings.treemap.Count;++count_tree_actives) {
		        					script.settings.treemap[count_tree_actives].load = !script.settings.treemap[count_tree_actives].load;
		        				}
		        			}
	        			}
	        			EditorGUILayout.EndHorizontal();
	        				
	       				for (var count_treemap: int = 0;count_treemap < script.settings.treemap.Count;++count_treemap) {
		        			EditorGUILayout.BeginHorizontal();
	        				GUILayout.Space(55+space);
	        				
	        				EditorGUILayout.LabelField("Tree map file",GUILayout.Width(147));
	        				if (key.type == EventType.Repaint) {script.settings.treemap[count_treemap].rect = GUILayoutUtility.GetLastRect();}
	        				script.settings.treemap[count_treemap].foldout = EditorGUI.Foldout(Rect(script.settings.treemap[count_treemap].rect.x-10,script.settings.treemap[count_treemap].rect.y-1,10,20),script.settings.treemap[count_treemap].foldout,"");
	        				
	        				gui_changed_old = GUI.changed;
	        				GUI.changed = false;
		        			script.settings.treemap[count_treemap].map = EditorGUILayout.ObjectField(script.settings.treemap[count_treemap].map,GameObject,false,GUILayout.Width(200)) as GameObject;
		        			if (GUI.changed) {
		        				script.settings.treemap[count_treemap].treeTypes = script.settings.treemap[count_treemap].map.GetComponent("save_trees").treeTypes;
		        				
		        				script.settings.treemap[count_treemap].tree_param.Clear();
		        				for (var count_tree_param1: int = 0;count_tree_param1 < script.settings.treemap[count_treemap].treeTypes;++count_tree_param1) {
		        					script.settings.treemap[count_treemap].tree_param.Add(new tree_parameter_class());
		        					script.settings.treemap[count_treemap].tree_param[count_tree_param1].prototype = count_tree_param1;
		        					
		        					if (script.settings.treemap[count_treemap].tree_param[count_tree_param1].prototype > script.terrains[0].terrain.terrainData.treePrototypes.Length-1) {	
			        					script.settings.treemap[count_treemap].tree_param[count_tree_param1].prototype = script.terrains[0].terrain.terrainData.treePrototypes.Length-1;
			        				}
			        				else if (script.settings.treemap[count_treemap].tree_param[count_tree_param1].prototype < 0) {	
			        					script.settings.treemap[count_treemap].tree_param[count_tree_param1].prototype = 0;
			        				}
		        				}
		        			}
		        			EditorGUILayout.LabelField("Generate",GUILayout.Width(64));
		        			GUI.changed = false;
		        			script.settings.treemap[count_treemap].load = EditorGUILayout.Toggle(script.settings.treemap[count_treemap].load,GUILayout.Width(25));
		        			if (GUI.changed) {
		        				generate_auto();
		        			}
		        			GUI.changed = gui_changed_old;
		        			/*
		        			if (GUILayout.Button("<Load>",GUILayout.Width(64)) && key.shift) {
		        				load_trees(count_treemap);
		        			}
		        			*/
			        			if (GUILayout.Button("-",GUILayout.Width(25)) && script.settings.treemap.Count > 0) {
		        				if (key.control) {
		        					script.settings.treemap.RemoveAt(count_treemap);
		        					return;
		        				}
		        				else {
		        					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
		        				}
		        			}
		        			EditorGUILayout.EndHorizontal();
		        			
		        			if (script.settings.treemap[count_treemap].foldout) {
			        			for (var count_tree_param: int = 0;count_tree_param < script.settings.treemap[count_treemap].treeTypes;++count_tree_param) {
			        			
			        				EditorGUILayout.BeginHorizontal();
				        			GUILayout.Space(60+space);
				        			EditorGUILayout.LabelField("Tree"+count_tree_param+" Prototype",GUILayout.Width(158));
				        			gui_changed_old = GUI.changed;
				        			GUI.changed = false;
				        			script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype = EditorGUILayout.IntField(script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype,GUILayout.Width(55));
				        			if (GUILayout.Button("+",GUILayout.Width(25))) {
				        				++script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype;
				        				GUI.changed = true;
				        			}
				        			if (GUILayout.Button("-",GUILayout.Width(25))) {
				        				--script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype;
				        				GUI.changed = true;
				        			}
				        			if (GUI.changed){
				        				if (script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype > script.terrains[0].terrain.terrainData.treePrototypes.Length-1) {	
				        					script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype = script.terrains[0].terrain.terrainData.treePrototypes.Length-1;
				        				}
				        				else if (script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype < 0) {	
				        					script.settings.treemap[count_treemap].tree_param[count_tree_param].prototype = 0;
				        				}
						       			generate_auto();
						       		}
						       		GUI.changed = gui_changed_old;
				        			EditorGUILayout.EndHorizontal();
				        			
				        			EditorGUILayout.BeginHorizontal();
				        			GUILayout.Space(60+space);
				        			EditorGUILayout.LabelField("Tree"+count_tree_param+" Density",GUILayout.Width(158));
				        			gui_changed_old = GUI.changed;
				        			GUI.changed = false;
				        			script.settings.treemap[count_treemap].tree_param[count_tree_param].density = EditorGUILayout.Slider(script.settings.treemap[count_treemap].tree_param[count_tree_param].density,0.0,1.0);
				        			if (GUI.changed){
						       			generate_auto();
						       		}
						       		GUI.changed = gui_changed_old;
				        			EditorGUILayout.EndHorizontal();
				        			
				        			EditorGUILayout.BeginHorizontal();
				        			GUILayout.Space(60+space);
				        			EditorGUILayout.LabelField("Tree"+count_tree_param+" Scale",GUILayout.Width(158));
				        			gui_changed_old = GUI.changed;
				        			GUI.changed = false;
				        			script.settings.treemap[count_treemap].tree_param[count_tree_param].scale = EditorGUILayout.Slider(script.settings.treemap[count_treemap].tree_param[count_tree_param].scale,0.0,10.0);
				        			if (GUI.changed){
						       			generate_auto();
						       		}
						       		GUI.changed = gui_changed_old;
				        			EditorGUILayout.EndHorizontal();
				        		}
				        	}
		        		}
	        		}
	        		if (script.settings.grass_button)
		       		{
		       			EditorGUILayout.BeginHorizontal();
	        			GUILayout.Space(45+space);
	        			if (GUILayout.Button("+",GUILayout.Width(25))) {
	        				script.settings.grassmap.Add(new grass_map_class());
	        			}
	        			if (GUILayout.Button("-",GUILayout.Width(25)) && script.settings.grassmap.Count > 0) {
	        				if (key.control) {
	        					script.settings.grassmap.RemoveAt(script.settings.grassmap.Count-1);
	        				}
	        				else {
	        					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
	        				}
	        			}
	        			if (GUILayout.Button("F",GUILayout.Width(25)) && script.settings.grassmap.Count > 0) {
	        				script.settings.grass_foldouts = !script.settings.grass_foldouts;
	        				var count_grass_foldout: int;
	        				
	        				if (!key.shift) {
		        				for (count_grass_foldout = 0;count_grass_foldout < script.settings.grassmap.Count;++count_grass_foldout) {
		        					script.settings.grassmap[count_grass_foldout].foldout = script.settings.grass_foldouts;
		        				}
		        			}
		        			else {
		        				for (count_grass_foldout = 0;count_grass_foldout < script.settings.grassmap.Count;++count_grass_foldout) {
		        					script.settings.grassmap[count_grass_foldout].foldout = !script.settings.grassmap[count_grass_foldout].foldout;
		        				}
		        			}
	        			}
	        			if (GUILayout.Button("A",GUILayout.Width(25)) && script.settings.grassmap.Count > 0) {
	        				script.settings.grass_actives = !script.settings.grass_actives;
	        				var count_grass_actives: int;
	        				
	        				if (!key.shift) {
		        				for (count_grass_actives = 0;count_grass_actives < script.settings.grassmap.Count;++count_grass_actives) {
		        					script.settings.grassmap[count_grass_actives].load = script.settings.grass_actives;
		        				}
		        			}
		        			else {
		        				for (count_grass_actives = 0;count_grass_actives < script.settings.grassmap.Count;++count_grass_actives) {
		        					script.settings.grassmap[count_grass_actives].load = !script.settings.grassmap[count_grass_actives].load;
		        				}
		        			}
	        			}
	        			EditorGUILayout.EndHorizontal();
	        				
	       				for (var count_grassmap: int = 0;count_grassmap < script.settings.grassmap.Count;++count_grassmap) {
		        			EditorGUILayout.BeginHorizontal();
	        				GUILayout.Space(55+space);
	        				
	        				EditorGUILayout.LabelField("grass map file",GUILayout.Width(147));
	        				if (key.type == EventType.Repaint) {script.settings.grassmap[count_grassmap].rect = GUILayoutUtility.GetLastRect();}
	        				script.settings.grassmap[count_grassmap].foldout = EditorGUI.Foldout(Rect(script.settings.grassmap[count_grassmap].rect.x-10,script.settings.grassmap[count_grassmap].rect.y-1,10,20),script.settings.grassmap[count_grassmap].foldout,"");
	        				
	        				gui_changed_old = GUI.changed;
	        				GUI.changed = false;
		        			script.settings.grassmap[count_grassmap].map = EditorGUILayout.ObjectField(script.settings.grassmap[count_grassmap].map,GameObject,false,GUILayout.Width(200)) as GameObject;
		        			if (GUI.changed) {
		        				script.settings.grassmap[count_grassmap].grassTypes = script.settings.grassmap[count_grassmap].map.GetComponent("save_grass").grass_save[0].details.Count;
		        				
		        				script.settings.grassmap[count_grassmap].grass_param.Clear();
		        				for (var count_grass_param1: int = 0;count_grass_param1 < script.settings.grassmap[count_grassmap].grassTypes;++count_grass_param1) {
		        					script.settings.grassmap[count_grassmap].grass_param.Add(new grass_parameter_class());
		        					script.settings.grassmap[count_grassmap].grass_param[count_grass_param1].prototype = count_grass_param1;
		        					
		        					if (script.settings.grassmap[count_grassmap].grass_param[count_grass_param1].prototype > script.terrains[0].terrain.terrainData.detailPrototypes.Length-1) {	
			        					script.settings.grassmap[count_grassmap].grass_param[count_grass_param1].prototype = script.terrains[0].terrain.terrainData.detailPrototypes.Length-1;
			        				}
			        				else if (script.settings.grassmap[count_grassmap].grass_param[count_grass_param1].prototype < 0) {	
			        					script.settings.grassmap[count_grassmap].grass_param[count_grass_param1].prototype = 0;
			        				}
		        				}
		        			}
		        			GUI.changed = false;
		        			EditorGUILayout.LabelField("Generate",GUILayout.Width(64));
		        			script.settings.grassmap[count_grassmap].load = EditorGUILayout.Toggle(script.settings.grassmap[count_grassmap].load,GUILayout.Width(25));
		        			if (GUI.changed) {
		        				generate_auto();
		        			}
		        			GUI.changed = gui_changed_old;
		        			/*
		        			if (GUILayout.Button("<Load>",GUILayout.Width(64)) && key.shift) {
		        				// load_grass(count_grassmap);
		        			}
		        			*/
			        			if (GUILayout.Button("-",GUILayout.Width(25)) && script.settings.grassmap.Count > 0) {
		        				if (key.control) {
		        					script.settings.grassmap.RemoveAt(count_grassmap);
		        					return;
		        				}
		        				else {
		        					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
		        				}
		        			}
		        			EditorGUILayout.EndHorizontal();
		        			
		        			if (script.settings.grassmap[count_grassmap].foldout) {
			        			for (var count_grass_param: int = 0;count_grass_param < script.settings.grassmap[count_grassmap].grassTypes;++count_grass_param) {
			        			
			        				EditorGUILayout.BeginHorizontal();
				        			GUILayout.Space(60+space);
				        			EditorGUILayout.LabelField("grass"+count_grass_param+" Prototype",GUILayout.Width(158));
				        			script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype = EditorGUILayout.IntField(script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype,GUILayout.Width(55));
				        			if (GUILayout.Button("+",GUILayout.Width(25))) {
				        				++script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype;
				        				GUI.changed = true;
				        			}
				        			if (GUILayout.Button("-",GUILayout.Width(25))) {
				        				--script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype;
				        				GUI.changed = true;
				        			}
				        			if (GUI.changed){
				        				if (script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype > script.terrains[0].terrain.terrainData.detailPrototypes.Length-1) {	
				        					script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype = script.terrains[0].terrain.terrainData.detailPrototypes.Length-1;
				        				}
				        				else if (script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype < 0) {	
				        					script.settings.grassmap[count_grassmap].grass_param[count_grass_param].prototype = 0;
				        				}
						       			generate_auto();
						       		}
						       		GUI.changed = gui_changed_old;
				        			EditorGUILayout.EndHorizontal();
				        			
				        			EditorGUILayout.BeginHorizontal();
				        			GUILayout.Space(60+space);
				        			EditorGUILayout.LabelField("grass"+count_grass_param+" Density",GUILayout.Width(158));
				        			gui_changed_old = GUI.changed;
				        			GUI.changed = false;
				        			script.settings.grassmap[count_grassmap].grass_param[count_grass_param].density = EditorGUILayout.Slider(script.settings.grassmap[count_grassmap].grass_param[count_grass_param].density,0.0,10.0);
				        			if (GUI.changed){
						       			generate_auto();
						       		}
						       		GUI.changed = gui_changed_old;
				        			EditorGUILayout.EndHorizontal();
				        		}
				        	}
				    	}
	        		}
	        		
	        		if (!script.settings.tabs)
					{
						EditorGUILayout.BeginHorizontal();
					    GUILayout.Space(30);
					    script.settings.light_button = EditorGUILayout.Foldout(script.settings.light_button,"Lights Setup");
					    EditorGUILayout.EndHorizontal();
					}
	        		
    		    	if (script.settings.light_button) {
			        	EditorGUILayout.BeginHorizontal();
        				GUILayout.Space(45+space);
        				
        				if (script.settings.directional_light == null) {
        					var lightObject: GameObject =  GameObject.Find("Directional light");
        					if (lightObject != null) script.settings.directional_light = lightObject.GetComponent.<Light>();
        				}
        				
        				EditorGUILayout.LabelField("Directional Light",GUILayout.Width(160));
        				script.settings.directional_light = EditorGUILayout.ObjectField(script.settings.directional_light,Light,true);
        				EditorGUILayout.EndHorizontal();
        				
        				if (script.settings.directional_light) {
        					EditorGUILayout.BeginHorizontal();
	        				GUILayout.Space(45+space);
	        				
	        				EditorGUILayout.LabelField("Color",GUILayout.Width(160));
	        				script.settings.directional_light.color = EditorGUILayout.ColorField(script.settings.directional_light.color);
	        				EditorGUILayout.EndHorizontal();
	        				
	        				EditorGUILayout.BeginHorizontal();
	        				GUILayout.Space(45+space);
	        				
	        				EditorGUILayout.LabelField("Intensity",GUILayout.Width(160));
	        				script.settings.directional_light.intensity = EditorGUILayout.Slider(script.settings.directional_light.intensity,0,10);
	        				EditorGUILayout.EndHorizontal();
	        				
	        				EditorGUILayout.BeginHorizontal();
	        				GUILayout.Space(45+space);
	        				
	        				EditorGUILayout.LabelField("Shadows",GUILayout.Width(160));
	        				script.settings.directional_light.shadows = EditorGUILayout.EnumPopup(script.settings.directional_light.shadows);
	        				EditorGUILayout.EndHorizontal();
	        				
	        				if (script.settings.directional_light.shadows != LightShadows.None) {
	        					
	        					EditorGUILayout.BeginHorizontal();
		        				GUILayout.Space(55+space);
		        				EditorGUILayout.LabelField("Strength",GUILayout.Width(150));
		        				script.settings.directional_light.shadowStrength = EditorGUILayout.Slider(script.settings.directional_light.shadowStrength,0,1);
		        				EditorGUILayout.EndHorizontal();
		        				
		        				EditorGUILayout.BeginHorizontal();
		        				GUILayout.Space(55+space);
		        				EditorGUILayout.LabelField("Bias",GUILayout.Width(150));
		        				script.settings.directional_light.shadowBias = EditorGUILayout.Slider(script.settings.directional_light.shadowBias,0,0.5);
		        				EditorGUILayout.EndHorizontal();
		        				
		        				if (script.settings.directional_light.shadows == LightShadows.Soft) {
		        					#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6
		        					EditorGUILayout.BeginHorizontal();
			        				GUILayout.Space(55+space); 
			        				EditorGUILayout.LabelField("Softness",GUILayout.Width(150));
			        				script.settings.directional_light.shadowSoftness = EditorGUILayout.Slider(script.settings.directional_light.shadowSoftness,1,8);
			        				EditorGUILayout.EndHorizontal();
		        					
		        					EditorGUILayout.BeginHorizontal();
			        				GUILayout.Space(55+space);
			        				EditorGUILayout.LabelField("Softness Fade",GUILayout.Width(150));
			        				script.settings.directional_light.shadowSoftnessFade = EditorGUILayout.Slider(script.settings.directional_light.shadowSoftnessFade,0.1,5);
			        				EditorGUILayout.EndHorizontal();
		        					#endif
		        				}
		        				
		        				EditorGUILayout.BeginHorizontal();
		        				GUILayout.Space(55+space);
		        				EditorGUILayout.LabelField("Distance",GUILayout.Width(150));
		        				QualitySettings.shadowDistance = EditorGUILayout.IntField(QualitySettings.shadowDistance);
		        				EditorGUILayout.EndHorizontal();
		        			}
	        				
	        				EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(45+space);
		        				
	        				EditorGUILayout.LabelField("Flare",GUILayout.Width(160));
	        				script.settings.directional_light.flare = EditorGUILayout.ObjectField(script.settings.directional_light.flare,Flare,false);
	        				EditorGUILayout.EndHorizontal();
		        			
        				}
        				GUILayout.Space(3);
        				EditorGUILayout.BeginHorizontal();
        				GUILayout.Space(45+space);
        				EditorGUILayout.LabelField("Fog",GUILayout.Width(160));
        				RenderSettings.fog = EditorGUILayout.Toggle(RenderSettings.fog,GUILayout.Width(25)); 
        				EditorGUILayout.EndHorizontal();
        				
        				EditorGUILayout.BeginHorizontal();
        				GUILayout.Space(45+space);
        				EditorGUILayout.LabelField("Fog Color",GUILayout.Width(160));
        				RenderSettings.fogColor = EditorGUILayout.ColorField(RenderSettings.fogColor);
        				EditorGUILayout.EndHorizontal();
        				
        				EditorGUILayout.BeginHorizontal();
        				GUILayout.Space(45+space);
        				EditorGUILayout.LabelField("Fog Mode",GUILayout.Width(160));
        				RenderSettings.fogMode = EditorGUILayout.EnumPopup(RenderSettings.fogMode);
        				EditorGUILayout.EndHorizontal();
        				
        				EditorGUILayout.BeginHorizontal();
        				GUILayout.Space(45+space);
        				EditorGUILayout.LabelField("Fog Denisty",GUILayout.Width(160));
        				RenderSettings.fogDensity = EditorGUILayout.FloatField(RenderSettings.fogDensity);
        				EditorGUILayout.EndHorizontal();
        				
        				GUILayout.Space(3);
        				EditorGUILayout.BeginHorizontal();
        				GUILayout.Space(45+space);
        				EditorGUILayout.LabelField("Ambient Light",GUILayout.Width(160));
        				RenderSettings.ambientLight = EditorGUILayout.ColorField(RenderSettings.ambientLight);
        				EditorGUILayout.EndHorizontal();
        				
        				GUILayout.Space(3);
        				EditorGUILayout.BeginHorizontal();
        				GUILayout.Space(45+space);
        				EditorGUILayout.LabelField("Skybox",GUILayout.Width(160));
        				RenderSettings.skybox = EditorGUILayout.ObjectField(RenderSettings.skybox,Material,false);
        				EditorGUILayout.EndHorizontal();
        			}
		        	
		       	}
		    }
	    
	    
	    if (script.show_prelayer > script.prelayers.Count-1){script.show_prelayer = 0;}
	    draw_prelayer(script.prelayers[script.show_prelayer],script.show_prelayer,3,String.Empty,1);
		
		GUILayout.Space(5);
        EditorGUILayout.EndScrollView();
        if (global_script.settings.color_scheme){GUI.color = Color.white;}
        
        GUILayout.EndArea();
        
        GUILayout.BeginArea(Rect(0,position.height-generate_window_height,position.width,generate_window_height));
		GUILayout.BeginVertical("Box");
        
        if (script.meshcapture_tool)
        {
        	EditorGUILayout.BeginHorizontal();
        	script.meshcapture_tool_foldout = EditorGUILayout.Foldout(script.meshcapture_tool_foldout,"Mesh Capture Tool");
        	if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
				script.meshcapture_tool = false;
			}	
			GUILayout.Space(2); 
        	EditorGUILayout.EndHorizontal();
        	
        	if (script.meshcapture_tool_foldout)
        	{
        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Object",GUILayout.Width(120));
        		script.meshcapture_tool_object = EditorGUILayout.ObjectField(script.meshcapture_tool_object,GameObject,true,GUILayout.Width(200)) as GameObject;
        		EditorGUILayout.EndHorizontal();
        		
        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Pivot",GUILayout.Width(120));
        		script.meshcapture_tool_pivot = EditorGUILayout.ObjectField(script.meshcapture_tool_pivot,Transform,true,GUILayout.Width(200)) as Transform;
        		EditorGUILayout.EndHorizontal();
        		
        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Image Width",GUILayout.Width(120));
        		script.meshcapture_tool_image_width = EditorGUILayout.IntField(script.meshcapture_tool_image_width,GUILayout.Width(50));
        		EditorGUILayout.EndHorizontal();
        		
        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Image Height",GUILayout.Width(120));
        		script.meshcapture_tool_image_height = EditorGUILayout.IntField(script.meshcapture_tool_image_height,GUILayout.Width(50));
        		EditorGUILayout.EndHorizontal();
        		
        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Mesh Scale",GUILayout.Width(120));
        		script.meshcapture_tool_scale = EditorGUILayout.FloatField(script.meshcapture_tool_scale,GUILayout.Width(120));
        		if (GUILayout.Button("Scale",GUILayout.Width(50)))
        		{
        			script.meshcapture_tool_scale = 1;
        		}
        		EditorGUILayout.EndHorizontal();
        		
        		/*
        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Save Scale",GUILayout.Width(120));
        		script.meshcapture_tool_save_scale = EditorGUILayout.Toggle(script.meshcapture_tool_save_scale,GUILayout.Width(25));
        		EditorGUILayout.EndHorizontal();
        		*/

        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Shadow Color",GUILayout.Width(120));
        		script.meshcapture_tool_shadows = EditorGUILayout.Toggle(script.meshcapture_tool_shadows,GUILayout.Width(25));
				EditorGUILayout.EndHorizontal();
        		
        		EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Mesh Color",GUILayout.Width(120));
        		script.meshcapture_tool_color = EditorGUILayout.ColorField(script.meshcapture_tool_color,GUILayout.Width(120));
        		EditorGUILayout.EndHorizontal();
        		
 				EditorGUILayout.BeginHorizontal();
        		GUILayout.Space(15);
        		EditorGUILayout.LabelField("Background Color",GUILayout.Width(120));
        		script.meshcapture_background_color = EditorGUILayout.ColorField(script.meshcapture_background_color,GUILayout.Width(120));
        		EditorGUILayout.EndHorizontal();
        	}
        }
        var generate_call_time: float = 0;
        if (script2){generate_call_time = script2.generate_call_time2;}
        
        EditorGUILayout.BeginHorizontal();
        if (!script.meshcapture_tool){EditorGUILayout.LabelField("Generation time: "+script.generate_time.ToString("F2"), GUILayout.Width(160));}
        if (script2)
        {
        	GUI.color = Color(1-(Mathf.Abs(Mathf.Cos(progress_bar/2))),Mathf.Abs(Mathf.Cos(progress_bar/2)),Mathf.Abs(Mathf.Cos(progress_bar/2)));
        	EditorGUILayout.LabelField("-->",GUILayout.Width(25));
        	GUI.color = Color.white;
        	var terrain_text: String;
        	var comma: String;
        	
        	if (script2.settings.showTerrains) {
	        	for (count_terrain2 = 0;count_terrain2 < script2.terrains.Count;++count_terrain2)
	        	{
	        		if (script2.terrains[count_terrain2].on_row)
	        		{
	        			terrain_text += comma+" "+script2.terrains[count_terrain2].name;
	        			comma = ",";
	        		}
	        	}
	        }
	        else {
	        	terrain_text = script2.meshes[script2.prelayer.count_terrain].gameObject.name;
	        }
        	
        	if (script.settings.display_bar_generate_auto || !script.generate_auto)
        	{       	       
	        	for (var count_prelayers: int = 0;count_prelayers < script2.prelayer_stack.Count;++count_prelayers)
		       	{
						if (script2.prelayers[script2.prelayer_stack[count_prelayers]].prearea.area.width*script2.prelayers[script2.prelayer_stack[count_prelayers]].prearea.area.height > 2048)
						{        			
		        			var length: float = script2.prelayers[script2.prelayer_stack[count_prelayers]].prearea.area.height;
			        		var start_x3: float = script2.prelayers[script2.prelayer_stack[count_prelayers]].prearea.area.y;
			        		if (count_prelayers == 0){progress_bar = 100-(((script2.prelayers[script2.prelayer_stack[count_prelayers]].y-start_x3)/length)*100);}
			        		
			        		var rect: Rect = GUILayoutUtility.GetLastRect();
			        		rect.x += 30;
			        		rect.y += count_prelayers*20;
			        		rect.width = position.width-200; 
			        		rect.height = 18;
			        		EditorGUI.ProgressBar(rect,progress_bar/100,""+Mathf.Round(progress_bar)+"%");
			        	}
		        }
		   }     
		   EditorGUILayout.LabelField(""+terrain_text);
		  
        }
        EditorGUILayout.EndHorizontal();
        
        GUILayout.Space(2);
		
        if (script.button_export)
        {
			if (script.heightmap_output && !script.meshcapture_tool)
			{
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField("Export Heightmaps",GUILayout.Width(125));
				EditorGUILayout.LabelField("Combined",GUILayout.Width(70));
				script.settings.export_heightmap_combined = EditorGUILayout.Toggle(script.settings.export_heightmap_combined,GUILayout.Width(25));
				/*
				if (GUILayout.Button("<Auto Assign>",EditorStyles.miniButtonMid,GUILayout.Width(100)))
				{
					if (key.shift) {
						var file_info: FileInfo;
						for (count_terrain = 0;count_terrain < script.terrains.Count;++count_terrain)
						{
							if (script.terrains[count_terrain].active)
							{
								script.terrains[count_terrain].raw_save_file.file = script.raw_save_path+"/"+script.terrains[count_terrain].name;
								file_info = new FileInfo(script.terrains[count_terrain].raw_save_file.file);
								script.terrains[count_terrain].raw_save_file.filename = file_info.Name;
							}
						}
					}
					else {
						this.ShowNotification(GUIContent("Shift click <Auto Assign> to start auto assigning the save path and filenames, the first Path/Name has to be assigned manually"));
					}
				}
				*/
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField("Byte Order",GUILayout.Width(125));
				gui_changed_old = GUI.changed;
				gui_changed_window = GUI.changed; GUI.changed = false;
				script.terrains[0].raw_save_file.mode = EditorGUILayout.EnumPopup(script.terrains[0].raw_save_file.mode);
				if (GUI.changed)
				{
					for (count_terrain = 0;count_terrain < script.terrains.Count;++count_terrain)
					{
						if (script.terrains[count_terrain].active)
						{
							script.terrains[count_terrain].raw_save_file.mode = script.terrains[0].raw_save_file.mode;
						}
					}
				}
				GUI.changed = gui_changed_old;
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField("Path/Name",GUILayout.Width(125));
				EditorGUILayout.LabelField(script.terrains[0].raw_save_file.file);
				
				if (GUILayout.Button("Save As",GUILayout.Width(64)))
				{
					var defaultname: String;
					if (script.terrains[0].raw_save_file.file == String.Empty){defaultname = script.terrains[0].name;} else {defaultname = script.terrains[0].raw_save_file.filename;}
					if (script.raw_save_path == String.Empty){script.raw_save_path = Application.dataPath;}
					defaultname = EditorUtility.SaveFilePanel("Save Heightmap As",script.raw_save_path,defaultname,"");
					if (defaultname.Length != 0)
					{
						script.terrains[0].raw_save_file.file = defaultname;
						
						var file_info2: FileInfo = new FileInfo(defaultname);								
						script.raw_save_path = file_info2.DirectoryName.Replace("\\","/");
						script.terrains[0].raw_save_file.filename = file_info2.Name;
					}
				}
				EditorGUILayout.EndHorizontal(); 
			}        
        	else
        	{
	        	EditorGUILayout.BeginHorizontal();
	        	EditorGUILayout.LabelField("Path",GUILayout.Width(160));
	        	EditorGUILayout.LabelField(""+script.export_path);
	        	if (!script2)
	        	{
	        		if (GUILayout.Button(GUIContent(">Change",button_folder),GUILayout.Width(85),GUILayout.Height(19)))
	        		{
	        			if (!key.shift)
	        			{
		        			var export_path: String = EditorUtility.OpenFolderPanel("Export File Path",script.export_path,"");
		        			if (export_path != "")
		        			{
		        				script.export_path = export_path;
		        				if (export_path.IndexOf(Application.dataPath) == -1)
		        				{
		        					script.settings.colormap_assign = false;
		        					script.settings.colormap_auto_assign = false;
		        					script.settings.normalmap_auto_assign = false;
		        				}
		        			}
		        		}
		        		else
		        		{
		        			script.export_path = Application.dataPath;
		        			script.settings.colormap_assign = true;
		        		}
	        		}
	    		}
	        	EditorGUILayout.EndHorizontal();
	        	
	        	EditorGUILayout.BeginHorizontal();
	        	if (!script2)
	        	{
	        		EditorGUILayout.LabelField("Filename",GUILayout.Width(160));
	        		script.export_file = EditorGUILayout.TextField(script.export_file);
	        	} 
	        	else 
	        	{
	        		EditorGUILayout.LabelField("Filename",GUILayout.Width(160));
	        		EditorGUILayout.LabelField(script2.export_file);
	        	}
	        	EditorGUILayout.EndHorizontal();
	        }
        }
        
        if (script.color_output)
        {
        	if (script.button_export)
        	{
	        	if (script.settings.colormap || script.terrains[0].rtp_script)
	        	{
		        	EditorGUILayout.BeginHorizontal();
		        	EditorGUILayout.LabelField("Auto Assign",GUILayout.Width(160));
			        EditorGUILayout.LabelField("Colormap",GUILayout.Width(80));
			        gui_changed_old = GUI.changed;
			        gui_changed_window = GUI.changed; 
			        GUI.changed = false;
			        if (!script.settings.colormap_assign){GUI.backgroundColor = Color.red;}
			        script.settings.colormap_auto_assign = EditorGUILayout.Toggle(script.settings.colormap_auto_assign,GUILayout.Width(25));
			        if (GUI.changed)
			        {
			        	if (!script.settings.colormap_assign)
			        	{
			        		script.settings.colormap_auto_assign = false;
			        		this.ShowNotification(GUIContent("Can't Assign colormap, because the export path is outside the project folder\n\n(Shift Click '>Change' to set path to project folder)"));
			        	}
			        	if (script.settings.colormap_auto_assign){script.settings.normalmap_auto_assign = false;}
			        }
			        if (!script.settings.colormap_assign){GUI.backgroundColor = Color.white;}
			        
		        	if (script.terrains[0].rtp_script)
		        	{
			        	EditorGUILayout.LabelField("Normalmap",GUILayout.Width(80));
				        gui_changed_window = GUI.changed; GUI.changed = false;
				        if (!script.settings.colormap_assign){GUI.backgroundColor = Color.red;}
				        script.settings.normalmap_auto_assign = EditorGUILayout.Toggle(script.settings.normalmap_auto_assign,GUILayout.Width(25));
				        if (GUI.changed)
				        {
				        	if (!script.settings.colormap_assign)
				        	{
				        		script.settings.normalmap_auto_assign = false;
				        		this.ShowNotification(GUIContent("Can't Assign colormap, because the export path is outside the project folder\n\n(Shift Click '>Change' to set path to project folder)"));
				        	}
				        	if (script.settings.normalmap_auto_assign){script.settings.colormap_auto_assign = false;}
				        }
				        if (!script.settings.colormap_assign){GUI.backgroundColor = Color.white;}
				    }
		        	
		        	GUI.changed = gui_changed_old;
		        	EditorGUILayout.EndHorizontal();
		        }
		        
		        	EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField("Colormap Resolution",GUILayout.Width(160));
					gui_changed_old = GUI.changed;
					gui_changed_window = GUI.changed; GUI.changed = false;
					script.colormap_resolution = EditorGUILayout.IntField(script.colormap_resolution,GUILayout.Width(55));	
					if (GUI.changed)
					{
						if (script.colormap_resolution < 8){script.colormap_resolution = 8;}	
					}
					GUI.changed = gui_changed_old;
					// prearea.object_resolution_active = EditorGUILayout.Toggle(prearea.object_resolution_active,GUILayout.Width(25));
					EditorGUILayout.EndHorizontal();
		    }
        	
        	EditorGUILayout.BeginHorizontal();
        	EditorGUILayout.LabelField("Color Advanced",GUILayout.Width(160));
        	gui_changed_old = GUI.changed;
        	gui_changed_window = GUI.changed; GUI.changed = false;
	        script.export_color_advanced = EditorGUILayout.Toggle(script.export_color_advanced,GUILayout.Width(25));
	        if (GUI.changed) {
	        	this.Repaint();return;
	        }
	        GUI.changed = gui_changed_old;
        	EditorGUILayout.EndHorizontal();
            
	        if (script.export_color_advanced)
	        {
	        	EditorGUILayout.BeginHorizontal();
	        	gui_changed_old = false;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
		        EditorGUILayout.LabelField("Color Channel",GUILayout.Width(160));
		        script.export_color = EditorGUILayout.ColorField(script.export_color);
		        EditorGUILayout.EndHorizontal();
		        
		        EditorGUILayout.BeginHorizontal();
		        EditorGUILayout.LabelField("Color Curve Advanced",GUILayout.Width(160));
		    	script.export_color_curve_advanced = EditorGUILayout.Toggle(script.export_color_curve_advanced,GUILayout.Width(25));
        	    EditorGUILayout.EndHorizontal();
                
		        if (script.export_color_curve_advanced)
		        {
		        	EditorGUILayout.BeginHorizontal();
			        EditorGUILayout.LabelField("Color Curve Red",GUILayout.Width(160));
			        script.export_color_curve_red = EditorGUILayout.CurveField(script.export_color_curve_red);
			        EditorGUILayout.EndHorizontal();
			        
			        EditorGUILayout.BeginHorizontal();
			        EditorGUILayout.LabelField("Color Curve Green",GUILayout.Width(160));
			        script.export_color_curve_green = EditorGUILayout.CurveField(script.export_color_curve_green);
			        EditorGUILayout.EndHorizontal();
			        
			        EditorGUILayout.BeginHorizontal();
			        EditorGUILayout.LabelField("Color Curve Blue",GUILayout.Width(160));
			        script.export_color_curve_blue = EditorGUILayout.CurveField(script.export_color_curve_blue);
			        EditorGUILayout.EndHorizontal();
		        }
		        else
		        {
			        EditorGUILayout.BeginHorizontal();
			        EditorGUILayout.LabelField("Color Curve",GUILayout.Width(160));
			        script.export_color_curve = EditorGUILayout.CurveField(script.export_color_curve);
			        EditorGUILayout.EndHorizontal();
			    }
			    
			    if (GUI.changed)
			    {
			        gui_changed_old = true;
			    	generate_auto();
			    }
			    GUI.changed = gui_changed_old;
		    }
	    }
        
        if (script.generate_auto && !script.button_export)
    	{
    		EditorGUILayout.BeginHorizontal();
	    		if (script.generate_auto_mode == 1)
	    		{
	    			EditorGUILayout.LabelField("Auto (Fast) -> Delay",GUILayout.Width(140));
	    			script.generate_auto_delay1 = EditorGUILayout.Slider(script.generate_auto_delay1,0,1);
	    		}
	    		else if (script.generate_auto_mode == 2)
	    		{
	    			EditorGUILayout.LabelField("Auto (Slow) -> Delay",GUILayout.Width(140));
	    			script.generate_auto_delay2 = EditorGUILayout.Slider(script.generate_auto_delay2,0.1,4);
	    		}
    			GUI.backgroundColor = UnityEngine.Color(0.2,0.4,1);
	        	// EditorGUILayout.LabelField("");
	        	EditorGUILayout.LabelField("Seed",GUILayout.Width(50));
	        	script.seed = EditorGUILayout.IntField(script.seed,GUILayout.Width(50));
	        	// GUILayout.Space(54);
    		EditorGUILayout.EndHorizontal();
    	} else {
    		// GUILayout.Space(19); 
    		EditorGUILayout.BeginHorizontal();
	    		GUI.backgroundColor = UnityEngine.Color(0.2,0.4,1);
	        	EditorGUILayout.LabelField("");
	        	EditorGUILayout.LabelField("Seed",GUILayout.Width(50));
	        	script.seed = EditorGUILayout.IntField(script.seed,GUILayout.Width(50));
	        	// GUILayout.Space(54);
        	EditorGUILayout.EndHorizontal();
		}
        	
        if (!script2 || script.generate_auto)
        {
        	// generate button
        	EditorGUILayout.BeginHorizontal();
        	GUI.backgroundColor = Color(0.2,0.4,1);
        	if (script.heightmap_output || script.color_output || script.splat_output || script.tree_output || script.grass_output || script.object_output || script.meshcapture_tool)
        	{
	        	if (GUILayout.Button(script.button_generate_text,GUILayout.Width(85)) || (key.control && key.keyCode == KeyCode.G))
	        	{
	        		if (!script.meshcapture_tool)
	        		{
	        			if (script.button_export && !script.color_output)
	        			{
	        				if (script.heightmap_output) {
		        				var export_text: String;
		        				var active: boolean = false;
		        				var path_set: boolean = false;
		        				
		        				if (!script.settings.export_heightmap_combined) {
			        				for (count_terrain = 0;count_terrain < script.terrains.Count;++count_terrain)
			        				{
			        					if (script.terrains[count_terrain].active && script.terrains[count_terrain].terrain)
			        					{
			        						active = true;
			        						path_set = true;
			        						save_raw(count_terrain,script.terrains[0].raw_save_file);
			        						export_text += "Exported --> "+script.terrains[0].raw_save_file.filename+"_"+count_terrain.ToString()+"\n";
			        					}
			        				} 
			        			}
			        			else {
			        				save_combined_raw(script.terrains[0].raw_save_file);
			        				active = true;
			        				path_set = true;
			        				export_text += "Exported --> "+script.terrains[0].raw_save_file.filename+".raw";
			        			}
		        				if (active)
		        				{
		        					if (path_set)
		        					{	
		        						this.ShowNotification(GUIContent(export_text));
		        						AssetDatabase.Refresh();
		        					}
		        				} 
		        				else {this.ShowNotification(GUIContent("No Terrain is active"));}
		        			}
							else if (script.splat_output) {
								ExportSplatmaps();
							}
		        			else if (script.tree_output) {
		        				save_trees();
		        			}
		        			else if (script.grass_output) {
		        				save_grass();
		        			}
	        			}
	        			else
	        			{
							if (key.shift)
							{
								script.generate_auto = !script.generate_auto;
								if (!script.generate_auto)
								{
									script.generate_call = false;
									script.generate_call_delay = -1;
								}
							}
							else if (key.alt)
							{
								if (script.generate_auto)
								{
									if (script.generate_auto_mode == 2){script.generate_auto_mode = 1;}
									else if (script.generate_auto_mode == 1){script.generate_auto_mode = 2;}
								}
							}
							else if (key.control)
							{
								script.generate_speed_display = !script.generate_speed_display;
							}
							else 
							{
								script.generate_call_delay = -1;
								script.generate_call = false;
								script.generate_manual = true;
								generate_startup();
							}
	        			}
	        		}
	        		else 
	        		{
	        			if (script.export_meshcapture() == -1){this.ShowNotification(GUIContent("No GameObject assigned"));}
	        				else 
	        				{
	        					export_texture_to_file(script.export_path,script.export_file,script.meshcapture_tool_image);

								var pixels2: Color[] = new Color[2];
								script.meshcapture_tool_image.Resize(1,1);
								script.meshcapture_tool_image.SetPixels(pixels2);
								script.meshcapture_tool_image.Apply();
								DestroyImmediate(script.meshcapture_tool_image.image);
								AssetDatabase.Refresh();
							}
	        		}
	        	}
	        	
	        	if (script.generate_auto){GUI.backgroundColor = UnityEngine.Color.green;}
	     	  	if (GUILayout.Button("Auto",GUILayout.Width(50))) {
	     	  		if (key.button == 0) {
			    		script.generate_auto = !script.generate_auto;
			    		generate_auto();
			    	}
			    	else {
			    		if (script.generate_auto) {
			    			if (script.generate_auto_mode == 2){script.generate_auto_mode = 1;}
							else if (script.generate_auto_mode == 1){script.generate_auto_mode = 2;}
						}
						script.generate_auto = true;
			    	}
			    }
	        	
	        	EditorGUILayout.LabelField("-->",EditorStyles.boldLabel,GUILayout.Width(25));
	        	if (script.heightmap_output){EditorGUILayout.LabelField("Heightmap",EditorStyles.boldLabel,GUILayout.Width(75));}
	        	if (script.color_output){EditorGUILayout.LabelField("Colormap",EditorStyles.boldLabel,GUILayout.Width(67));}
	        	if (script.splat_output){EditorGUILayout.LabelField("Splatmap",EditorStyles.boldLabel,GUILayout.Width(65));}
	        	if (script.tree_output){EditorGUILayout.LabelField("Tree",EditorStyles.boldLabel,GUILayout.Width(35));}
	        	if (script.grass_output){EditorGUILayout.LabelField("Grass",EditorStyles.boldLabel,GUILayout.Width(45));}
	        	if (script.object_output){EditorGUILayout.LabelField("Object",EditorStyles.boldLabel,GUILayout.Width(50));}
	        	if (script.meshcapture_tool){EditorGUILayout.LabelField("Mesh Capture",EditorStyles.boldLabel,GUILayout.Width(100));}
	        	EditorGUILayout.LabelField("");
	        }
	        else
	        {
	        	EditorGUILayout.LabelField("Choose an Output Button --> Height,Color,Splat,Tree,Grass or Object",EditorStyles.boldLabel);
	        }
        	GUI.backgroundColor = Color.white;
        } 
        else 
        {
	        if (script2.generate && !script.generate_auto)
	        {
	        	var button_pause_text: String;
	        	if (script2.generate_pause){button_pause_text = "Resume";} else {button_pause_text = "Pause";}
	        	EditorGUILayout.BeginHorizontal();
	        	if (GUILayout.Button(button_pause_text,GUILayout.Width(60)) || (key.keyCode == KeyCode.P && key.control)){script2.generate_pause = !script2.generate_pause;}
	        	if (script.create_pass == -1) {
		        	if (GUILayout.Button("Restart",GUILayout.Width(60)))
		        	{
		        		generate_stop();
		        		generate_startup();
		        	}
		        }
	        	if (GUILayout.Button("Stop",GUILayout.Width(50)) || (key.keyCode == KeyCode.S && key.control))
	        	{
	        		script.generate_call_delay = -1;
					script.generate_call = false;
					script.create_pass = -1;
	        		generate_stop();
	        	}
	        	EditorGUILayout.LabelField("");
	        }
        }
        
        GUI.backgroundColor = UnityEngine.Color(0.2,0.4,1);
        
    	EditorGUILayout.LabelField("Frames",GUILayout.Width(50));
	    gui_changed_old = GUI.changed;
	    GUI.changed = false;
	    global_script.target_frame = EditorGUILayout.IntField(global_script.target_frame,GUILayout.Width(50));
	    if (GUI.changed) {
			
	    }
	    if (global_script.target_frame < 10){global_script.target_frame = 10;}
	    if (script2)
	    {
	    	script2.target_frame = global_script.target_frame;
	    }
	   
	    GUI.backgroundColor = UnityEngine.Color.white;
       	EditorGUILayout.EndHorizontal();
	    
	    if (!(script.heightmap_output || script.color_output || script.splat_output || script.tree_output || script.grass_output || script.object_output || script.meshcapture_tool)) GUILayout.Space(3); else GUILayout.Space(1);
	    
		GUILayout.EndArea();
		GUILayout.EndVertical();
	}
	    
    function generate_stop()
    {
		script.generate_manual = false;
		Application.runInBackground = run_in_background;
		
		if (script2.unload_textures)
		{
			script2.unload_textures1();
			if (script2.export_texture)
			{
				script2.export_texture.Resize(0,0);
				script2.export_texture.Apply();
			}
		}
		for (var count_terrain1: int = 0;count_terrain1 < script2.terrains.Count;++count_terrain1)
		{
	    	if (script2.terrains[count_terrain1].heights)
	    	{
	    		if (script2.terrains[count_terrain1].heights.Length > 0){script2.terrains[count_terrain1].heights = new float[0,0];}
	    	}
	    	for (var count_grass: int = 0;count_grass < script2.grass_detail.Length;++count_grass)
	    	{
	    		if (script2.grass_detail[count_grass])
	    		{
	    			if (script2.grass_detail[count_grass].detail) {
	    				if (script2.grass_detail[count_grass].detail.Length > 0){script2.grass_detail[count_grass].detail = new int[0,0];}
	    			}
	    		}
	    	}
	    }
    	var clean_memory: boolean = script2.clean_memory;
    	script2 = null;
    	DestroyImmediate(Generate_Scene);
    	if (clean_memory)
    	{
    		UnityEngine.Resources.UnloadUnusedAssets();
			System.GC.Collect();
		}
		
		if (script.create_pass != -1) {++script.create_pass;create_example(String.Empty,false,script.file_name);}
	}
	
	function Update() 
    {    
    	if (!script || !global_script){return;}
		
		if (Time.realtimeSinceStartup > time_generate_call+script.generate_call_delay && script.generate_call_delay != -1)
		{
			if (!script2){generate_startup();script.generate_call_delay = -1;script.generate_call = false;}
		}
    	
    	if (!script2){return;}  
    	
    	if (script2.generate && !script2.generate_pause)
    	{
    		script.generate_time = script2.generate_time;
    		
    		if (script2.generate_error) {
    			this.ShowNotification(GUIContent("Error in generate loop, please contact Nathaniel_Doldersum@hotmail.com and send a screenshot of the Unity Console"));
    			Debug.Log("Error in generate loop, please contact Nathaniel_Doldersum@hotmail.com and send a screenshot of the Unity Console");
    			generate_stop();
    			// save_terraincomposer(Application.dataPath+"/TerrainComposer/Bug Report/BugReport.prefab");
    			this.Repaint();
    			return;
    		}
    		if (script2.generate_output(script2.prelayer) == 2)
    		{
    			if ((script2.settings.colormap || script2.terrains[0].rtp_script) && script2.button_export)
				{
					if (script2.settings.colormap_auto_assign) {
						assign_colormap();
					}
					else if (script2.settings.normalmap_auto_assign) {
						assign_normalmap();
					}
				}	
    		}
    		if (script2.generate_export == 1)
			{
				script2.export_texture.Apply();
				export_texture_to_file(script2.export_path,script2.export_name,script2.export_texture);
				script2.generate_export = 0;
				script2.export_texture.Resize(script2.preterrain.prearea.resolution,script2.preterrain.prearea.resolution,TextureFormat.RGB24, false);
				// texture_fill_color(export_texture,Color.black);
				script2.export_texture.Apply();
			}
    		if (!script2.generate)
    		{
    			if (script2.settings.stitch_heightmap && script.heightmap_output)
    			{
    				stitch_terrains();
    			}
    			if (script2.settings.stitch_splatmap && script2.splat_output)
    			{
    				script2.stitch_splatmap();
    			}
    			if (script2.button_export)
    			{
    				AssetDatabase.Refresh();
    			}	
    			generate_stop();
    		}
    		this.Repaint();
    	}
    }
    
    function assign_colormap()
    {
    	AssetDatabase.Refresh();
		set_image_import_settings(script.preterrain.splatPrototypes[0].texture,1,1,-1,-1);
		
		if (!script.terrains[0].rtp_script) {				
			if (script.preterrain.splatPrototypes.Count == 0){script.set_colormap(true,true);}
			script.preterrain.splatPrototypes[0].texture = AssetDatabase.LoadAssetAtPath(script2.export_path.Replace(Application.dataPath,"Assets")+"/"+script2.export_name+".png",Texture) as Texture2D;
			// script.set_terrain_splat_textures(script.preterrain,script.preterrain);
			script.check_synchronous_terrain_textures(current_terrain);
		} 
		else {
			script.preterrain.rtp_script.ColorGlobal = AssetDatabase.LoadAssetAtPath(script2.export_path.Replace(Application.dataPath,"Assets")+"/"+script2.export_name+".png",Texture) as Texture2D;
			script.preterrain.rtp_script.globalSettingsHolder.RefreshAll();
		}
    }
    
    function assign_normalmap()
    {
    	AssetDatabase.Refresh();
		set_image_import_settings(script.preterrain.splatPrototypes[0].texture,1,1,-1,-1);
		
		// script.set_terrain_splat_textures(script.preterrain,script.preterrain);
		
		if (!script.terrains[0].rtp_script) {
			script.preterrain.splatPrototypes[0].normal_texture = AssetDatabase.LoadAssetAtPath(script2.export_path.Replace(Application.dataPath,"Assets")+"/"+script2.export_name+".png",Texture) as Texture2D;
			set_image_import_settings(script.preterrain.splatPrototypes[0].normal_texture,1,1,-1,-1);
			script.set_terrain_splat_textures(script.preterrain,script.preterrain);
			script.check_synchronous_terrain_textures(current_terrain); 
		}
		else {
			script.preterrain.rtp_script.NormalGlobal = AssetDatabase.LoadAssetAtPath(script2.export_path.Replace(Application.dataPath,"Assets")+"/"+script2.export_name+".png",Texture) as Texture2D;
			script.preterrain.rtp_script.globalSettingsHolder.RefreshAll();
		}
    }
    
	function check_point_in_rect(rect: Rect,point: Vector2): boolean
	{
		var in_rect: boolean = false;
		
		if (point.x > rect.xMin && point.x < rect.xMin+rect.width && point.y > rect.y && point.y < rect.y+rect.height){in_rect = true;}
		
		return in_rect;
	}
	
	function generate_startup()
	{
		var direct_colormap: boolean;
		
		//if (script.color_output && !script.button_export){direct_colormap = set_terrain_color_textures();}
		if (script.color_output && !script.button_export){direct_colormap = true;}
		if (script.splat_output && !script.button_export){set_terrain_splat_textures();}
		
		if (script.settings.run_in_background)
		{
			run_in_background = script.settings.run_in_background;
			Application.runInBackground = true;
		}
		
		Generate_Scene = GameObject.Find("<Generating>");
		if (Generate_Scene){DestroyImmediate(Generate_Scene);}
		Generate_Scene = Instantiate(TerrainComposer_Scene);
		Generate_Scene.name = "<Generating>";
		Generate_Scene_name = Generate_Scene.name;
		script2 = Generate_Scene.GetComponent(terraincomposer_save);
		script2.script_base = script;
		
		script2.settings.direct_colormap = direct_colormap;
		
		var generate_code: int;
		// Debug.Log("Generate Startup");
		if (script.settings.showTerrains) generate_code = script2.generate_begin();
		else {
			var noColliderReport: String = "";
			for (var i: int = 0;i < script.meshes.Count;++i) {
				if (script.meshes[i]) {
					if (script.meshes[i].gameObject) {
						if (script.meshes[i].gameObject.GetComponent.<Collider>() == null) noColliderReport += script.meshes[i].gameObject.name+"\n";
					}
				}
			}
			if (noColliderReport.Length != 0) {
				noColliderReport += "\nPlease add a mesh collider to your meshes in the Meshes list";
				ShowNotification(new GUIContent(noColliderReport));
			}
			
			generate_code = script2.generate_begin_mesh();
		}
			
		#if UNITY_WEBPLAYER
		load_raw_heightmaps();
		#endif
		
		if (generate_code == 1)
		{
			if (!global_script.auto_speed){
				script2.generate_speed = script.generate_speed;} 
			else {
				script2.generate_speed = 100000;
				script2.auto_speed = true;
				script2.target_frame = global_script.target_frame;
			}
				
			script2.generate = true;
		} 
        	else 
        	{
        		if (generate_code == -1){this.ShowNotification(GUIContent("No Terrain is Active or Assigned"));}
        		if (generate_code == -2 && script.generate_manual){this.ShowNotification(GUIContent("Current settings will not generate an output"));}
        		if (generate_code == -3)
        		{
        			this.ShowNotification(GUIContent("Please assign splat textures to "+script2.preterrain.terrain.name));
        			script.terrains_foldout = true;
        			script.terrains[script2.preterrain.index_old].foldout = true;
        			script.terrains[script2.preterrain.index_old].splat_foldout = true;
        			script.terrains[script2.preterrain.index_old].data_foldout = true;
        			script.terrains[script2.preterrain.index_old].size_foldout = false;
        			script.terrains[script2.preterrain.index_old].resolution_foldout = false;
        			script.terrains[script2.preterrain.index_old].reset_foldout = false;
        			script.terrains[script2.preterrain.index_old].scripts_foldout = false;
        			script.terrains[script2.preterrain.index_old].tree_foldout = false;
        			script.terrains[script2.preterrain.index_old].detail_foldout = false;
        		}
        		if (generate_code == -4){this.ShowNotification(GUIContent("For the Color Output to work you need to assign the Red, Green and Blue splat texture to "+script2.preterrain.terrain.name));}
        		if (generate_code == -5){this.ShowNotification(GUIContent("There is only 1 splat texture assigned to "+script2.preterrain.terrain.name+"\n\nSplat Output needs at least 2 splat texures to have effect"));}
        		if (generate_code == -6){this.ShowNotification(GUIContent("Please assign a Terrain for Slicing"));}
        		if (generate_code == -7){this.ShowNotification(GUIContent("The splat length of "+script2.preterrain.terrain.name+" ("+script2.preterrain.terrain.terrainData.splatPrototypes.Length+" splats)"+" should be the same or higher than "+script2.terrains[0].terrain.name+" ("+script2.terrains[0].terrain.terrainData.splatPrototypes.Length+" splats)"));}
        		if (generate_code == -8){this.ShowNotification(GUIContent("The grass/detail length of "+script2.preterrain.terrain.name+" ("+script2.preterrain.terrain.terrainData.detailPrototypes.Length+" grass)"+" should the same or higher than "+script2.terrains[0].terrain.name+" ("+script2.terrains[0].terrain.terrainData.detailPrototypes.Length+" grass)"));}
        		
        		// generate_stop();
        		DestroyImmediate(Generate_Scene);
        	}
	}
	
	function generate_auto()
	{
		// if (script.button_export) {return;}
		if (script.generate_auto)
		{
			if (script.generate_auto_mode == 1 && !script.generate_call)
			{
				script.generate_call_delay = script.generate_auto_delay1;
				time_generate_call = Time.realtimeSinceStartup;
				script.generate_call = true;
			}
			else if (script.generate_auto_mode == 2)
			{
				script.generate_call_delay = script.generate_auto_delay2;
				time_generate_call = Time.realtimeSinceStartup;
			}
		}
	}
	
	function draw_mesh(space: int,index: int)
	{
		// current_mesh.mesh = 
		EditorGUILayout.BeginHorizontal();
			GUILayout.Space(15);
			gui_changed_old = GUI.changed;
			GUI.changed = false;
			current_mesh.gameObject = EditorGUILayout.ObjectField(current_mesh.gameObject,GameObject,true,GUILayout.Width(200));// as Mesh;	
			if (GUI.changed) {
				if (current_mesh.gameObject != null) {
					current_mesh.meshFilter = current_mesh.gameObject.GetComponent(MeshFilter);
					if (current_mesh.meshFilter != null) {
						current_mesh.mesh = current_mesh.meshFilter.sharedMesh;
					}
					else {
						current_mesh.mesh = null;
					}
				}
				else {
					current_mesh.meshFilter = null;
					current_mesh.mesh = null;
				}
			}
			GUI.changed = gui_changed_old;
			
			EditorGUILayout.ObjectField(current_mesh.mesh,Mesh,true,GUILayout.Width(200));// as Mesh;	
			
			if (!global_script.settings.toggle_text_no){
				if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
			}
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			current_mesh.active = EditorGUILayout.Toggle(current_mesh.active);
			if (GUI.changed) {
			 	gui_changed_old = true;
			}
			GUI.changed = gui_changed_old;
			if (global_script.settings.tooltip_mode != 0) {
				tooltip_text = "Erase this Mesh\n\n(Control Click)";
			}
				
			if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)) && script.meshes.Count > 1)
			{
				if (key.control) {
					UndoRegister("Erase Mesh");
					script.meshes.RemoveAt(index);
				    this.Repaint();
					return;
				}
				else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
				}
			} 
		EditorGUILayout.EndHorizontal();
	}
	
	function draw_terrain(space: int)
	{
		color_terrain = global_script.settings.color.color_terrain;
	    if (!current_terrain.active){color_terrain += Color(-0.2,-0.2,-0.2,0);} 
	        	
	    if (current_terrain.color_terrain != color_terrain)
		{
			if (current_terrain.color_terrain[0] > color_terrain[0]){current_terrain.color_terrain[0] -= 0.003;} 
		    else if (current_terrain.color_terrain[0]+0.01 < color_terrain[0]){current_terrain.color_terrain[0] += 0.003;}	
		           			else {current_terrain.color_terrain[0] = color_terrain[0];}
		           	if (current_terrain.color_terrain[1] > color_terrain[1]){current_terrain.color_terrain[1] -= 0.003;} 
		           		else if (current_terrain.color_terrain[1]+0.01 < color_terrain[1]){current_terrain.color_terrain[1] += 0.003;}
		           			else {current_terrain.color_terrain[1] = color_terrain[1];}
					if (current_terrain.color_terrain[2] > color_terrain[2]){current_terrain.color_terrain[2] -= 0.003;} 
						else if (current_terrain.color_terrain[2]+0.01 < color_terrain[2]){current_terrain.color_terrain[2] += 0.003;}
							else {current_terrain.color_terrain[2] = color_terrain[2];}
					if (current_terrain.color_terrain[3] > color_terrain[3]){current_terrain.color_terrain[3] -= 0.003;} 
						else if (current_terrain.color_terrain[3]+0.01 < color_terrain[3]){current_terrain.color_terrain[3] += 0.003;}
							else {current_terrain.color_terrain[3] = color_terrain[3];}
		        	this.Repaint();
		        }
		        
		        if (global_script.settings.color_scheme){color_terrain = current_terrain.color_terrain;} else {color_terrain = Color.white;}
		        GUI.color = color_terrain;
	        	
	        	EditorGUILayout.BeginHorizontal();
	      		GUILayout.Space(30);
	        	var Lastrect2: Rect = GUILayoutUtility.GetLastRect();
	        	Lastrect2.x += 15;
	        	Lastrect2.y += 2;
	        	Lastrect2.width = 15;
	        	Lastrect2.height = 15;
	        	var backgroundcolor: Color = Color.white;
	      	  	if (script2)
	      	  	{
	      	  		if (script2.generate)
	      	  		{
	      	  			for (var count_terrain2: int = 0;count_terrain2 < script2.terrains.Count;++count_terrain2)
	      	  			{
	      	  				if (script2.terrains[count_terrain2].index_old == count_terrain)
	      	  				{
	      	  					if (script2.terrains[count_terrain2].on_row)
	      	  					{
	      	  						GUI.color = Color(1-(Mathf.Abs(Mathf.Cos(progress_bar/2))),Mathf.Abs(Mathf.Cos(progress_bar/2)),Mathf.Abs(Mathf.Cos(progress_bar/2)));
	      	  						backgroundcolor = Color(1-(progress_bar/100),1,1-(progress_bar/100));
	      	  					}
	      	  				}
	      	  			}
	      	  		}
	       		}
	       		
	       	  	current_terrain.foldout = EditorGUI.Foldout(Lastrect2,current_terrain.foldout,"");
	       	  	GUI.color = color_terrain;
	       	  	if (script2)
	        	{
	        		if (script2.generate){GUI.backgroundColor = backgroundcolor;} 
	        	}
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	
	        	// terrain foldout
	        	current_terrain.terrain = EditorGUILayout.ObjectField(current_terrain.terrain,Terrain,true,GUILayout.Width(200)) as Terrain;
	        	if (GUI.changed)
	        	{
	        		if (script.terrains_check_double(current_terrain)){this.ShowNotification(GUIContent("The terrain is already in list!"));}
	        		if (current_terrain.terrain){current_terrain.name = current_terrain.terrain.name;}
	        		if (current_terrain)
	        		{
	        			script.get_terrain_settings(current_terrain,"(all)(fir)");
	        			// script.assign_terrain_splat_alpha(current_terrain);
	        		}
	        		script.AutoSearchTiles();
	        	}
	        	GUI.changed = gui_changed_old;
	        	GUI.backgroundColor = Color.white;
	        	
	        	if (current_terrain.terrain)
	        	{
		        	if (current_terrain.terrain.terrainData)
		        	{
		        		/*
		        		if (GUILayout.Button(GUIContent(current_terrain.prearea.resolution_mode_text,current_terrain.prearea.resolution_tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(50)))
			        	{
			        		current_terrain.foldout = true;
			        		current_terrain.data_foldout = false;
			        		current_terrain.prearea.foldout = true;
			        	}
			        	*/
		        
//			        	if (script.terrains.Count > 1)
//			        	{
//			        		if (current_terrain.tiles.x == 1 || current_terrain.tiles.y == 1)
//			        		{
//			        			GUI.color = Color.red;
//			        			if (global_script.settings.tooltip_mode != 0)
//						        {
//						        	tooltip_text = "The terrains are not fitted together to one big Tile\n\nClick to foldout Size\n\nShift Click to Fit All";
//						        }
//			        			if (GUILayout.Button(GUIContent("",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(23)))
//			        			{
//			        				if (!key.shift)
//			        				{
//				        				current_terrain.prearea.foldout = false;
//				        				current_terrain.data_foldout = true;
//				        				current_terrain.foldout = true;
//				        				current_terrain.size_foldout = true;
//				        				current_terrain.resolution_foldout = false;
//				        				current_terrain.splat_foldout = false;
//				        				current_terrain.tree_foldout = false;
//				        				current_terrain.detail_foldout = false;
//				        			}
//				        			else
//				        			{
//				        				fit_all_terrains(current_terrain);
//				        			}
//			        			}
//			        			GUI.color = color_terrain;
//			        		}
//			        	}
			        	
			        	if (script.settings.terrainDataDisplay) {
	    					EditorGUILayout.LabelField("->",GUILayout.Width(20));
	    					gui_changed_old = GUI.changed;
	        				GUI.changed = false;
	        				current_terrain.terrain.terrainData = EditorGUILayout.ObjectField(current_terrain.terrain.terrainData,TerrainData,false);
	        				if (GUI.changed) {
	        					terrainCollider = current_terrain.terrain.gameObject.GetComponent(TerrainCollider);
	        					if (terrainCollider) {terrainCollider.terrainData = current_terrain.terrain.terrainData;
	        						current_terrain.terrain.Flush();
	        						SceneView.RepaintAll();
	        					}
	        				}
	        				GUI.changed = gui_changed_old;
	        			}
        				
        				// EditorGUILayout.LabelField("Show",GUILayout.Width(50));
        				// script.settings.terrainDataDisplay = EditorGUILayout.Toggle(script.settings.terrainDataDisplay,GUILayout.Width(25));
        			}
			        else
		        	{
		        		EditorGUILayout.LabelField("Missing TerrainData. Fix this manually in the Scene or create a new terrain");
		        		if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)) && script.terrains.Count > 1)
				       	{
				       		if (key.control) {
				       			UndoRegister("Erase Terrain");
				       			script.erase_terrain(count_terrain);
					       		this.Repaint();
						       	return;
						    }
						    else {
								this.ShowNotification(GUIContent("Control click the '-' button to erase"));
							}
				       	}
				       	EditorGUILayout.EndHorizontal();
		        		return;
		        	}
		        }
		        
		        if (!global_script.settings.toggle_text_no)
			    {
			   		if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
			   	}
			   	gui_changed_old = GUI.changed;
			   	gui_changed_window = GUI.changed; GUI.changed = false;
			   	current_terrain.active = EditorGUILayout.Toggle(current_terrain.active);
			   	if (GUI.changed)
			   	{
			    	gui_changed_old = true;
			    }
			       	GUI.changed = gui_changed_old;
			       	if (global_script.settings.tooltip_mode != 0)
				{
					tooltip_text = "Erase this Terrain\n\n(Control Click)";
				}
				
		        if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)) && script.terrains.Count > 1)
			    {
			       	if (key.control) {
			       		UndoRegister("Erase Terrain");
			       		script.erase_terrain(count_terrain);
				       	this.Repaint();
					    return;
					}
					else {
						this.ShowNotification(GUIContent("Control click the '-' button to erase"));
					}
			    } 
			    
		       	EditorGUILayout.EndHorizontal();
	        	
	        	if (current_terrain.foldout)
	        	{
	        		if (script.settings.tabs)
	        		{
		        		EditorGUILayout.BeginHorizontal();
		        		GUILayout.Space(30);
		        		if (current_terrain.prearea.foldout){GUI.backgroundColor = Color.green;}
		        		if (GUILayout.Button(GUIContent("Local Area",button_localArea),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.prearea.foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.prearea.foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.prearea.foldout = false;
		        			}
		        		}
		        		
		        		current_terrain.maps_foldout = false;
//		        		if (current_terrain.maps_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
//		        		if (GUILayout.Button(GUIContent("Heightmaps",button_heightmap),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
//		        		{
//		        			if (!current_terrain.maps_foldout)
//		        			{
//		        				close_terrain_foldouts(current_terrain);
//		        				current_terrain.maps_foldout = true;
//		        			}
//		        			else
//		        			{
//		        				close_terrain_foldouts(current_terrain);
//		        				current_terrain.maps_foldout = false;
//		        			}
//		        		}
		        		
		        		if (current_terrain.size_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		        		if (GUILayout.Button(GUIContent("Size",button_size),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.size_foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.size_foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.size_foldout = false;
		        			}
		        		}
		        		
		        		if (current_terrain.resolution_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		        		if (GUILayout.Button(GUIContent("Resolutions",button_resolution),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.resolution_foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.resolution_foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.resolution_foldout = false;
		        			}
		        		}
		        		
		        		if (current_terrain.settings_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		        		if (GUILayout.Button(GUIContent("Settings",button_settings),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.settings_foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.settings_foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.settings_foldout = false;
		        			}
		        		}
		        		EditorGUILayout.EndHorizontal();
		        		
		        		if (current_terrain.splat_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		        		EditorGUILayout.BeginHorizontal();
		        		GUILayout.Space(30);
		        		if (GUILayout.Button(GUIContent("Splat Textures",button_splatmap),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.splat_foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.splat_foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.splat_foldout = false;
		        			}
		        		}
		        		
		        		if (current_terrain.tree_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		        		if (GUILayout.Button(GUIContent("Trees",button_tree),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.tree_foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.tree_foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.tree_foldout = false;	
		        			}
		        		}
		        		
		        		if (current_terrain.detail_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		        		if (GUILayout.Button(GUIContent("Grass/Details",button_grass),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.detail_foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.detail_foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.detail_foldout = false;
		        			}
		        		}
		        		
		        		if (current_terrain.reset_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		        		if (GUILayout.Button(GUIContent("Reset",button_reset),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
		        		{
		        			if (!current_terrain.reset_foldout)
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.reset_foldout = true;
		        			}
		        			else
		        			{
		        				close_terrain_foldouts(current_terrain);
		        				current_terrain.reset_foldout = false;
		        			}
		        		}
		        		
		        		current_terrain.scripts_foldout = false;
		        		
//		        		if (current_terrain.scripts_foldout){GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
//		        		if (GUILayout.Button(GUIContent("RTP",button_rtp),EditorStyles.miniButtonMid,GUILayout.Width(95),GUILayout.Height(19)))
//		        		{
//		        			if (!current_terrain.scripts_foldout)
//		        			{
//		        				close_terrain_foldouts(current_terrain);
//		        				current_terrain.scripts_foldout = true;
//		        			}
//		        			else
//		        			{
//		        				close_terrain_foldouts(current_terrain);
//		        				current_terrain.scripts_foldout = false;
//		        			}
//		        		}
			       		EditorGUILayout.EndHorizontal();
		        		GUI.backgroundColor = Color.white;
		        	}
	        		
	        		// if (current_terrain.terrain)
	        		// {
	        			if (!script.settings.tabs){draw_area(0,current_terrain.prearea,current_terrain,0,false);}
	        				else {draw_area(0,current_terrain.prearea,current_terrain,-15,false);}
	        		// }
	        		
	        		if (!script.settings.tabs)
		        	{
						EditorGUILayout.BeginHorizontal();
			        	GUILayout.Space(30);
			        	current_terrain.data_foldout = EditorGUILayout.Foldout(current_terrain.data_foldout,"Data");
			        	EditorGUILayout.EndHorizontal();
			        }
	        		
	        		if (current_terrain.data_foldout || script.settings.tabs)
	        		{
	        			if (!script.settings.tabs)
	        			{
		        			EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.maps_foldout = EditorGUILayout.Foldout(current_terrain.maps_foldout,"Heightmaps");
			        		EditorGUILayout.EndHorizontal();
			        	}
		        		
		        		// terrain heightmap foldout
		        		if (current_terrain.maps_foldout)
	        			{
	        				/*
	        				if (global_script.settings.video_help)
			        		{
				        		EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	GUI.backgroundColor = Color(0.3,0.7,1);
					        	if (GUILayout.Button("Help Heightmaps -> ",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					        	{
					        	
					        	}
					        	GUI.backgroundColor = Color.white;
				        		EditorGUILayout.EndHorizontal();
				        	}
				        	*/
				        	
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
		        			EditorGUILayout.LabelField("Heightmap File",GUILayout.Width(147));
		        			
		        			if (current_terrain.raw_file_index > script.raw_files.Count-1){current_terrain.raw_file_index = -1;return;}
		        			if (current_terrain.raw_file_index < 0){EditorGUILayout.LabelField("Not Loaded",GUILayout.Width(70));}
		        			else
		        			{
		        				EditorGUILayout.LabelField(GUIContent(script.raw_files[current_terrain.raw_file_index].filename,script.raw_files[current_terrain.raw_file_index].file),GUILayout.Width(script.raw_files[current_terrain.raw_file_index].filename.Length*8));
		        			}
		        			if (GUILayout.Button(GUIContent(">Open",button_open),GUILayout.Width(70),GUILayout.Height(19)))
		        			{
		        				if (key.control)
		        				{
		        					current_terrain.raw_file_index = -1;
		        					script.clean_raw_file_list();
		        				}
		        			    else if (!key.shift)
		        				{
			        				var raw_file: String;
			        				
			        				if (script.raw_path == String.Empty){script.raw_path = Application.dataPath;}  
			        				
			        				if (Application.platform == RuntimePlatform.OSXEditor){raw_file = EditorUtility.OpenFilePanel("Open Heightmap File",script.raw_path,"raw");}
			        				else {raw_file = EditorUtility.OpenFilePanel("Open Heightmap File",script.raw_path,"Raw;*.r16;*.raw");}
			        						        						        				
			        				if (raw_file.Length != 0)
			        				{
			        					var raw_file_index: int = add_raw_file(raw_file);
			        					
			        					if (raw_file_index == -2){this.ShowNotification(GUIContent("Raw file has invalid resolution"));}
			        					if (raw_file_index > -1)
			        					{
			        						current_terrain.raw_file_index = raw_file_index;
			        						script.raw_path = raw_file;
			        						script.clean_raw_file_list();
			        					}
									}
								}
								else 
								{
									script.raw_path = Application.dataPath;
								}
		        			}
		        			EditorGUILayout.EndHorizontal();
		        			
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
		        			if (current_terrain.raw_file_index < 0){EditorGUILayout.LabelField("This function is deprecated",EditorStyles.boldLabel);}
		        			EditorGUILayout.EndHorizontal();
		        			
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
		        			if (current_terrain.raw_file_index < 0){EditorGUILayout.LabelField("Use A filter in a heightmap layer, with input -> Raw Heightmap, this has much more features");} 
		        			EditorGUILayout.EndHorizontal();
		        			
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
		        			if (current_terrain.raw_file_index < 0){EditorGUILayout.LabelField("(If using this function, the heightmap resolution from the raw file must be the same as the heightmap resolution)");}
		        			EditorGUILayout.EndHorizontal();
		        			
		        			
		        			if (current_terrain.raw_file_index > -1)
		        			{
			        			EditorGUILayout.BeginHorizontal();
			        			GUILayout.Space(60+space);
			        			EditorGUILayout.LabelField("Resolution",GUILayout.Width(147));
			        			EditorGUILayout.LabelField(""+script.raw_files[current_terrain.raw_file_index].resolution);
			        			EditorGUILayout.EndHorizontal();
			        			
			        			EditorGUILayout.BeginHorizontal();
			        			GUILayout.Space(60+space);
			        			EditorGUILayout.LabelField("Byte Order",GUILayout.Width(147));
			        			script.raw_files[current_terrain.raw_file_index].mode = EditorGUILayout.EnumPopup(script.raw_files[current_terrain.raw_file_index].mode,GUILayout.Width(64));
		        				EditorGUILayout.EndHorizontal();
			        		
			        		
			        			EditorGUILayout.BeginHorizontal();
			        			GUILayout.Space(60+space);
			        			if (GUILayout.Button("<Assign>",GUILayout.Width(70)))
			        			{
			        				if (key.shift) {
			        					assign_heightmap(current_terrain);
			        				}
			        				else {
										this.ShowNotification(GUIContent("Shift click <Assign> to assign the heightmap"));
									}
			        			}
			        			if (script.terrains.Count > 1)
			        			{
				        			if (GUILayout.Button("<Assign All>",GUILayout.Width(85)))
				        			{
				        				if (key.shift) {
				        					assign_heightmap_all_terrain();
				        				}
				        				else {
											this.ShowNotification(GUIContent("Shift click <Assign All>"));
										}
				        			}
				        			if (GUILayout.Button("<Auto Search>",GUILayout.Width(100)))
				        			{
				        				if (key.shift) {
				        					auto_search_heightmap(current_terrain);
				        				}
				        				else {
											this.ShowNotification(GUIContent("Shift click <Auto Search> to auto assign the heightmaps to each terrain, the first heightmap has to be assigned for this"));
										}
				        			}
			        			}
			        			EditorGUILayout.EndHorizontal();
			        		}
		        		}
		        		
		        		if (!script.settings.tabs)
		        		{
		        			EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.size_foldout = EditorGUILayout.Foldout(current_terrain.size_foldout,"Size");
			        		EditorGUILayout.EndHorizontal();
			        	}
	        		
	        			if (current_terrain.size_foldout)
	        			{
		        			if (global_script.settings.video_help)
		        			{
			        			EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		GUI.backgroundColor = Color(0.3,0.7,1);
				        		if (GUILayout.Button("Help Video Size",EditorStyles.miniButtonMid,GUILayout.Width(153)))
				        		{
				        			Application.OpenURL("http://www.youtube.com/watch?v=64MRPwcHrbY");
				        		}
				        		GUI.backgroundColor = Color.white;
			        			EditorGUILayout.EndHorizontal();
			        		}
			        		
		        			EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);
			        		gui_changed_old = GUI.changed;
			        		gui_changed_window = GUI.changed; GUI.changed = false;
			        		current_terrain.size = EditorGUILayout.Vector3Field("Size",current_terrain.size);
			        		// current_terrain.size_xz_link = EditorGUILayout.Toggle(current_terrain.size_xz_link,GUILayout.Width(25));
			        		
			        		if (GUI.changed)
			        		{
			        			if (current_terrain.size_xz_link){current_terrain.size.z = current_terrain.size.x;}
			        			if (current_terrain.size.x < 1){current_terrain.size.x = 1;}
			        			if (current_terrain.size.y < 1){current_terrain.size.y = 1;}
			        			if (current_terrain.size.z < 1){current_terrain.size.z = 1;}
			        			script.check_synchronous_terrain_size(current_terrain);
			        		}
			        		GUI.changed = gui_changed_old;
			        		EditorGUILayout.EndHorizontal();
			        		
			        		if (current_terrain.terrain)
			        		{
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		if (global_script.settings.tooltip_mode != 0)
				        		{
				    				tooltip_text = "Get Terrain Size from "+current_terrain.name+" in Scene\n\n(Shift Click)";
				    			}
				        		if (GUILayout.Button(GUIContent("<Get>",tooltip_text),GUILayout.Width(75))) {
				        			if (key.shift) {
				        				script.get_terrain_settings(current_terrain,"(siz)(con)");
				        				script.check_synchronous_terrain_size(current_terrain);
				        			}
				        			else {
										this.ShowNotification(GUIContent("Shift click <Get> to get the terrain size"));
									}
				        		}
				        		if (script.terrains.Count > 1) {
					        		if (GUILayout.Button(GUIContent("<Get All>",tooltip_text),GUILayout.Width(75))) {
					        			if (key.shift) {
					        				script.get_all_terrain_settings("(siz)(con)");
					        			}
					        			else {
											this.ShowNotification(GUIContent("Shift click <Get All> to get all terrain sizes"));
										}
					        		}
					        	}
				        		if (!current_terrain.size_synchronous)
				        		{
				        			GUI.color = Color.green;
				        		}
				        		if (global_script.settings.tooltip_mode != 0)
				        		{
				    				tooltip_text = "Set Terrain Size to "+current_terrain.name+" in Scene\n\n(Shift Click)";
				    			}
				        		if (GUILayout.Button(GUIContent("<Set>",tooltip_text),GUILayout.Width(75)))
				        		{
				        			if (key.shift) {
				        				script.set_terrain_settings(current_terrain,"(siz)(con)");
				        				script.check_synchronous_terrain_size(current_terrain);
				        				if (script.terrains.Count == 1){fit_all_terrains(current_terrain);}
				        			}
				        			else {
										this.ShowNotification(GUIContent("Shift click <Set> to set the terrain size"));
									}
				        		}
				        		GUI.color = color_terrain;
					        	if (script.terrains.Count > 1)
					        	{
//					        		if (current_terrain.tiles.x == 1 || current_terrain.tiles.y == 1)
//					        		{
//					        			GUI.color = Color.red;
//					        		}
					        		if (global_script.settings.tooltip_mode != 0)
					        		{
					    				tooltip_text = "Fit all Terrains together to one big Tile\n\n(Shift Click)";
					    			}
						        	if (GUILayout.Button(GUIContent("<Fit All>",tooltip_text),GUILayout.Width(80)))
						        	{
						        		if (key.shift) {
						        			fit_all_terrains(current_terrain);
						        			if (script.settings.colormap){script.set_colormap(script.settings.colormap,false);}
						        		}
						        		else {
											this.ShowNotification(GUIContent("Shift click <Fit All> to stitch the terrains together to one big tile"));
										}
						        	}
						        	GUI.color = color_terrain;
						    	}
						    	else
						    	{
						    		if (GUILayout.Button(GUIContent("<Center>",tooltip_text),GUILayout.Width(80)))
						        	{
						        		if (key.shift) {
						        			fit_all_terrains(current_terrain);
						        			if (script.settings.colormap){script.set_colormap(script.settings.colormap,false);}
						        		}
						        		else {
											this.ShowNotification(GUIContent("Shift click <Center> to center the terrain at World Centerpoint 0,0,0"));
										}
						        	}
						    	}
						    	EditorGUILayout.EndHorizontal();
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		EditorGUILayout.Vector3Field("Scale",current_terrain.scale);
				        		EditorGUILayout.EndHorizontal();
				        		/*
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60);
				        		current_terrain.terrain.transform.position = EditorGUILayout.Vector3Field("Position",current_terrain.terrain.transform.position);
				        		EditorGUILayout.EndHorizontal();*/
				        	}
			        		
			        		GUILayout.Space(5);
			        	}
		        		
		        		if (!script.settings.tabs)
		        		{
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.resolution_foldout = EditorGUILayout.Foldout(current_terrain.resolution_foldout,"Resolutions");
			        		EditorGUILayout.EndHorizontal();
			        	}
		        		
		        		if (current_terrain.resolution_foldout)
		        		{
			        		/*
			        		if (global_script.settings.video_help)
		        			{
			        			EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		GUI.backgroundColor = Color(0.3,0.7,1);
				        		if (GUILayout.Button("Help Video Resolutions",EditorStyles.miniButtonMid,GUILayout.Width(153)))
				        		{
				        			
				        		}
				        		GUI.backgroundColor = Color.white;
			        			EditorGUILayout.EndHorizontal();
			        		}
			        		*/
			        		
			        		gui_changed_old = GUI.changed;
			        		gui_changed_window = GUI.changed; GUI.changed = false;
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);
			        		EditorGUILayout.LabelField("Heightmap Resolution",GUILayout.Width(135));
			        		var list: int = current_terrain.heightmap_resolution_list;
			        		list = GUILayout.HorizontalSlider(list,9,0,GUILayout.Width(210));
			        		if (GUI.changed)
			        		{
			        			if (list > 7){list = 7;}
			        		}
			        		current_terrain.heightmap_resolution_list = list;
			        		current_terrain.heightmap_resolution_list = EditorGUILayout.Popup(current_terrain.heightmap_resolution_list,script.heightmap_resolution_list,GUILayout.Width(70));
			        		// if (current_terrain.tiles.x > 1 || current_terrain.tiles.y > 1) {
			        			EditorGUILayout.LabelField("("+(current_terrain.tiles.x*current_terrain.heightmap_resolution).ToString()+"x"+(current_terrain.tiles.y*current_terrain.heightmap_resolution).ToString()+")");
			        		// }
			        		EditorGUILayout.EndHorizontal();
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);
			        		EditorGUILayout.LabelField("Splatmap Resolution",GUILayout.Width(135));
			        		list = current_terrain.splatmap_resolution_list+1;
			        		list = GUILayout.HorizontalSlider(list,9,0,GUILayout.Width(210));
			        		if (GUI.changed)
			        		{
			        			if (list > 8){list = 8;}
			        			if (list < 1){list = 1;}
			        		}
			        		current_terrain.splatmap_resolution_list = list-1;
			        		current_terrain.splatmap_resolution_list = EditorGUILayout.Popup(current_terrain.splatmap_resolution_list,script.splatmap_resolution_list,GUILayout.Width(70));
			        		// if (current_terrain.tiles.x > 1 || current_terrain.tiles.y > 1) {
			        			EditorGUILayout.LabelField("("+(current_terrain.tiles.x*current_terrain.splatmap_resolution).ToString()+"x"+(current_terrain.tiles.y*current_terrain.splatmap_resolution).ToString()+")");
			        		// }
			        		EditorGUILayout.EndHorizontal();
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);
			        		EditorGUILayout.LabelField("Basemap Resolution",GUILayout.Width(135));
			        		list = current_terrain.basemap_resolution_list+1;
			        		list = GUILayout.HorizontalSlider(list,9,0,GUILayout.Width(210));
			        		if (GUI.changed)
			        		{
			        			if (list > 8){list = 8;}
			        			if (list < 1){list = 1;}
			        		}
			        		current_terrain.basemap_resolution_list = list-1;
			        		current_terrain.basemap_resolution_list = EditorGUILayout.Popup(current_terrain.basemap_resolution_list,script.splatmap_resolution_list,GUILayout.Width(70));
			        		// if (current_terrain.tiles.x > 1 || current_terrain.tiles.y > 1) {
			        			EditorGUILayout.LabelField("("+(current_terrain.tiles.x*current_terrain.basemap_resolution).ToString()+"x"+(current_terrain.tiles.y*current_terrain.basemap_resolution).ToString()+")");
			        		// }
			        		EditorGUILayout.EndHorizontal();
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);
			        		EditorGUILayout.LabelField("Grass Resolution",GUILayout.Width(135+214));
			        		//GUILayout.HorizontalSlider(current_terrain.detail_resolution,-270,2330,GUILayout.Width(210));
			        		current_terrain.detail_resolution = EditorGUILayout.IntField(current_terrain.detail_resolution,GUILayout.Width(70));
			        		if (GUI.changed)
			        		{
			        			if (current_terrain.detail_resolution < 16){current_terrain.detail_resolution = 16;}
			        			else if (current_terrain.detail_resolution > 2048){current_terrain.detail_resolution = 2048;}
			        		}
			        		// if (current_terrain.tiles.x > 1 || current_terrain.tiles.y > 1) {
			        			EditorGUILayout.LabelField("("+(current_terrain.tiles.x*current_terrain.detail_resolution).ToString()+"x"+(current_terrain.tiles.y*current_terrain.detail_resolution).ToString()+")");
			        		// }
			        		EditorGUILayout.EndHorizontal();
			        		
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);
			        		EditorGUILayout.LabelField("Grass Per Patch",GUILayout.Width(135));
			        		list = current_terrain.detail_resolution_per_patch_list;
			        		list = GUILayout.HorizontalSlider(list,0,4,GUILayout.Width(210));
			        		if (GUI.changed)
			        		{
			        			if (list < 0){list = 0;}
			        		}
			        		current_terrain.detail_resolution_per_patch_list = list;
			        		current_terrain.detail_resolution_per_patch_list = EditorGUILayout.Popup(current_terrain.detail_resolution_per_patch_list,script.detail_resolution_per_patch_list,GUILayout.Width(70));
			        		EditorGUILayout.EndHorizontal();
			        		
			        		if (GUI.changed){script.set_terrain_resolution_from_list(current_terrain);script.check_synchronous_terrain_resolutions(current_terrain);}
			        		GUI.changed = gui_changed_old;
			        		
			        		if (current_terrain.terrain)
			        		{
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		if (global_script.settings.tooltip_mode != 0)
				        		{
				    				tooltip_text = "Get Terrain Resolutions from "+current_terrain.name+" in Scene\n\n(Shift Click)";
				    			}
				        		if (GUILayout.Button(GUIContent("<Get>",tooltip_text),GUILayout.Width(75)))
				        		{
					        		if (key.shift) {
					        			script.get_terrain_settings(current_terrain,"(res)(con)");script.check_synchronous_terrain_resolutions(current_terrain);
					        		}
					        		else {
										this.ShowNotification(GUIContent("Shift click <Get> to get the terrain current resolutions"));
									}
	 					        }
	 					        if (script.terrains.Count > 1) {
		 					        if (GUILayout.Button(GUIContent("<Get All>",tooltip_text),GUILayout.Width(75)))
					        		{
						        		if (key.shift) {
						        			script.get_all_terrain_settings("(res)(con)");
						        		}
						        		else {
											this.ShowNotification(GUIContent("Shift click <Get All> to get the terrain current resolutions"));
										}
		 					        }
		 					    }
				        		if (!current_terrain.resolutions_synchronous)
						        {
						        	GUI.color = Color.green;
						        }
						        if (global_script.settings.tooltip_mode != 0)
				        		{
				    				tooltip_text = "Set Terrain Resolutions to "+current_terrain.name+" in Scene\n\n(Shift Click)";
				    			}
				        		if (GUILayout.Button(GUIContent("<Set>",tooltip_text),GUILayout.Width(75)))
						        {
						        	if (!check_resolutions_out_of_range(current_terrain)) {
					        			if (key.shift) {
								        	if (script2)
							        		{
							        			set_pass = false;
							        			if (script2.generate)
							        			{
							        				script2.generate = false;
							        				generate_stop();
							        			}
							        			set_pass = true;
								        	}
			 					        	else {set_pass = true;}
			 					        	if (set_pass)
			 					        	{
			 					        		script.set_terrain_settings(current_terrain,"(res)(con)");
			 					        		script.check_synchronous_terrain_resolutions(current_terrain);
			 					        		generate_auto();
			 					        	}
			 					        }
			 					        else {
											this.ShowNotification(GUIContent("Shift click <Set> to apply to chosen resolutions to the terrain"));
										}
									}
						        }
						        GUI.color = color_terrain;
						        if (script.terrains.Count > 1)
						        {
						        	if (global_script.settings.tooltip_mode != 0)
					        		{
					    				tooltip_text = "Set all terrains Resolutions the same as "+current_terrain.name+"\n\n(Shift Click)";
					    			}
						        	if ((GUILayout.Button(GUIContent("<Set All>",tooltip_text),GUILayout.Width(80))))
						        	{
						        		if (!check_resolutions_out_of_range(current_terrain)) {
						        			
							        		if (key.shift) {
								        		set_pass = false;
								        		if (script2)
									        	{
									        		set_pass = false;
									        		if (script2.generate)
									        		{
									        			script2.generate = false;
									        			generate_stop();
									        		}
									        		set_pass = true;
										        }
					 					        else {set_pass = true;}
								        			
								        		if (set_pass)
								        		{
								        			script.set_all_terrain_settings(current_terrain,"(res)");
								        			script.check_synchronous_terrain_resolutions(current_terrain);
								        			generate_auto();
								        		}
								        	}
								        	else {
												this.ShowNotification(GUIContent("Shift click <Set All> to apply chosen resolutions to all terrains"));
											}
										}
						        	}
					        	}
					        	EditorGUILayout.EndHorizontal();
					        }
		        		}
		        		
		        		// terrain settings
		        		if (!script.settings.tabs)
		        		{
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.settings_foldout = EditorGUILayout.Foldout(current_terrain.settings_foldout,"Settings");
			        		EditorGUILayout.EndHorizontal();
			        	}
		        		
		        		if (current_terrain.settings_foldout)
		        		{
		        			/*
		        			if (script.settings.tabs)
		        			{
		        				EditorGUILayout.BeginHorizontal();
		        				GUILayout.Space(29);
		        				GUI.backgroundColor = Color.green;
		        				EditorGUILayout.LabelField("Settings",EditorStyles.miniButtonMid,GUILayout.Width(475),GUILayout.Height(19));
		        				GUI.backgroundColor = Color.white;
		        				EditorGUILayout.EndHorizontal();
		        			}
		        			*/
		        			
		        			if (global_script.settings.video_help)
		        			{
			        			/*
			        			EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		GUI.backgroundColor = Color(0.3,0.7,1);
				        		if (GUILayout.Button("Help Video Settings",EditorStyles.miniButtonMid,GUILayout.Width(153)))
				        		{
				        		
				        		}
				        		GUI.backgroundColor = Color.white;
			        			EditorGUILayout.EndHorizontal();
			        			*/
			        		}
		        			
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
		        			if (current_terrain.settings_editor){GUI.backgroundColor = Color.green;}
		        			if (GUILayout.Button("Editor",EditorStyles.miniButtonMid,GUILayout.Width(70)))
		        			{
		        				current_terrain.settings_editor = true;
		        				current_terrain.settings_runtime = false;
		        				script.get_terrain_parameter_settings(current_terrain);
		        			}
		        			GUI.backgroundColor = Color.white;
		        			if (current_terrain.settings_runtime){GUI.backgroundColor = Color.green;}
		        			if (GUILayout.Button("Runtime",EditorStyles.miniButtonMid,GUILayout.Width(70)))
		        			{
		        				current_terrain.settings_editor = false;
		        				current_terrain.settings_runtime = true;
		        				script.get_terrain_parameter_settings(current_terrain);
		        			}
		        			GUI.backgroundColor = Color.white;
		        			EditorGUILayout.EndHorizontal();
		        			
		        			if (current_terrain.terrain) {
		        				if (current_terrain.terrain.terrainData) {
				        			EditorGUILayout.BeginHorizontal();
				        				GUILayout.Space(60+space);
				        				EditorGUILayout.LabelField("Terrain Data",GUILayout.Width(160));
				        				gui_changed_old = GUI.changed;
				        				GUI.changed = false;
				        				current_terrain.terrain.terrainData = EditorGUILayout.ObjectField(current_terrain.terrain.terrainData,TerrainData,false);
				        				if (GUI.changed) {
				        					terrainCollider = current_terrain.terrain.gameObject.GetComponent(TerrainCollider);
				        					if (terrainCollider) {terrainCollider.terrainData = current_terrain.terrain.terrainData;
				        						current_terrain.terrain.Flush();
				        						SceneView.RepaintAll();
				        					}
				        				}
				        				GUI.changed = gui_changed_old;
				        				
				        				EditorGUILayout.LabelField("Show",GUILayout.Width(40));
				        				script.settings.terrainDataDisplay = EditorGUILayout.Toggle(script.settings.terrainDataDisplay,GUILayout.Width(25));
				        			EditorGUILayout.EndHorizontal();
				        		}
				        	}
		        		
		        			gui_changed_old = GUI.changed;
			        		gui_changed_window = GUI.changed; GUI.changed = false;	
			        		if (script.terrains.Count > 1)
			        		{	
				        		EditorGUILayout.BeginHorizontal();
			        			GUILayout.Space(60+space);	
			        			EditorGUILayout.LabelField("Apply to all Terrains",GUILayout.Width(160)); 
				        		current_terrain.settings_all_terrain = EditorGUILayout.Toggle(current_terrain.settings_all_terrain,GUILayout.Width(25));
				        		EditorGUILayout.EndHorizontal();
				        	}
		        			
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);	
		        			current_terrain.base_terrain_foldout = EditorGUILayout.Foldout(current_terrain.base_terrain_foldout,"Base Terrain");
		        			EditorGUILayout.EndHorizontal();
		        			
		        			if (current_terrain.base_terrain_foldout)
		        			{
			        			EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		if (current_terrain.settings_runtime){GUI.color = Color.green;}
				        		EditorGUILayout.LabelField("Pixel Error",GUILayout.Width(147));
				        		current_terrain.heightmapPixelError = EditorGUILayout.Slider(current_terrain.heightmapPixelError,1.0,200.0);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_pixelerror(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); ;
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		if (current_terrain.settings_runtime){GUI.color = Color.green;}
				        		EditorGUILayout.LabelField("Heightmap Max LOD",GUILayout.Width(147));
				        		current_terrain.heightmapMaximumLOD = EditorGUILayout.Slider(current_terrain.heightmapMaximumLOD,0,10);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_heightmap_lod(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); ;
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		if (!current_terrain.rtp_script) {
					        		EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);	
					        		EditorGUILayout.LabelField("Basemap Distance",GUILayout.Width(147));
					        		gui_changed_window = GUI.changed; GUI.changed = false;
					        		if (current_terrain.settings_editor){current_terrain.basemapDistance = EditorGUILayout.Slider(current_terrain.basemapDistance,1.0,script.settings.editor_basemap_distance_max);}
					        			else {current_terrain.basemapDistance = EditorGUILayout.Slider(current_terrain.basemapDistance,1.0,script.settings.runtime_basemap_distance_max);}
					        		if (GUI.changed)
					        		{
					        			script.set_terrain_basemap_distance(current_terrain,current_terrain.settings_all_terrain);
					        			SceneView.RepaintAll(); 
					        		}
					        		EditorGUILayout.EndHorizontal();
					        	}
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);		
				        		EditorGUILayout.LabelField("Cast Shadows",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.castShadows = EditorGUILayout.Toggle(current_terrain.castShadows,GUILayout.Width(25));
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_shadow(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		
				        		EditorGUILayout.EndHorizontal();
				        	}
			        		GUI.changed = gui_changed_old;
			        		
			        		EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);	
		        			if (current_terrain.settings_runtime)
				        	{
				        		if (global_script.settings.color_scheme){GUI.color = color_terrain;} else {GUI.color = Color.white;}
				        	}
		        			current_terrain.tree_detail_objects_foldout = EditorGUILayout.Foldout(current_terrain.tree_detail_objects_foldout,"Tree & Detail Terrain");
		        			if (current_terrain.settings_runtime)
				        	{
				        		GUI.color = Color.green;
				        	}
		        			EditorGUILayout.EndHorizontal();
		        			
		        			if (current_terrain.tree_detail_objects_foldout)
		        			{
			        			EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);		
				        		EditorGUILayout.LabelField("Draw",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.draw = EditorGUILayout.Toggle(current_terrain.draw,GUILayout.Width(25));
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_draw(current_terrain,current_terrain.settings_all_terrain,current_terrain.draw);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Grass Distance",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		if (current_terrain.settings_editor){current_terrain.detailObjectDistance = EditorGUILayout.Slider(current_terrain.detailObjectDistance,0,script.settings.editor_detail_distance_max);}
				        			else {current_terrain.detailObjectDistance = EditorGUILayout.Slider(current_terrain.detailObjectDistance,0,script.settings.runtime_detail_distance_max);}
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_detail_distance(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Grass Density",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.detailObjectDensity = EditorGUILayout.Slider(current_terrain.detailObjectDensity,0.0,1.0);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_detail_density(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		GUILayout.Space(2);
				        		
				        		#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_01 && !UNITY_4_2 && !UNITY_4_3 && !UNITY_4_4 && !UNITY_4_5 && !UNITY_4_6 
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);
				        		EditorGUILayout.LabelField("SpeedTrees have to be setup on the SpeedTree itself");
				        		EditorGUILayout.EndHorizontal();
					        	#endif
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Tree Distance",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		if (current_terrain.settings_editor){current_terrain.treeDistance = EditorGUILayout.Slider(current_terrain.treeDistance,0,script.settings.editor_tree_distance_max);}
				        			else {current_terrain.treeDistance = EditorGUILayout.Slider(current_terrain.treeDistance,0,script.settings.runtime_tree_distance_max);}
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_tree_distance(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Billboard Start",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.treeBillboardDistance = EditorGUILayout.Slider(current_terrain.treeBillboardDistance,0,2000);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_tree_billboard_distance(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Fade Length",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		if (current_terrain.settings_editor){current_terrain.treeCrossFadeLength = EditorGUILayout.Slider(current_terrain.treeCrossFadeLength,0,script.settings.editor_fade_length_max);}
				        			else {current_terrain.treeCrossFadeLength = EditorGUILayout.Slider(current_terrain.treeCrossFadeLength,0,script.settings.runtime_fade_length_max);}
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_tree_billboard_fade_length(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
				        		
				        		EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Max Mesh Trees",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		if (current_terrain.settings_editor){current_terrain.treeMaximumFullLODCount = EditorGUILayout.Slider(current_terrain.treeMaximumFullLODCount,0,script.settings.editor_mesh_trees_max);}
				        			else {current_terrain.treeMaximumFullLODCount = EditorGUILayout.Slider(current_terrain.treeMaximumFullLODCount,0,script.settings.runtime_mesh_trees_max);}
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_tree_max_mesh(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
				        	}
			        		if (current_terrain.settings_runtime)
				        	{
				        		if (global_script.settings.color_scheme){GUI.color = color_terrain;} else {GUI.color = Color.white;}
				        	}
			        		
			        		EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);	
		        			current_terrain.wind_settings_foldout = EditorGUILayout.Foldout(current_terrain.wind_settings_foldout,"Wind Settings");
		        			EditorGUILayout.EndHorizontal();
		        			
		        			if (current_terrain.wind_settings_foldout)
		        			{
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Speed",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.wavingGrassStrength = EditorGUILayout.Slider(current_terrain.wavingGrassStrength,0.0,1.0);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_wind_bending(current_terrain,current_terrain.settings_all_terrain);
				        		}
				        		EditorGUILayout.EndHorizontal();
		        			}
		        			
		        			if (current_terrain.wind_settings_foldout)
		        			{
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Size",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.wavingGrassSpeed = EditorGUILayout.Slider(current_terrain.wavingGrassSpeed,0.0,1.0);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_wind_speed(current_terrain,current_terrain.settings_all_terrain);
				        		}
				        		EditorGUILayout.EndHorizontal();
		        			}
		        			
		        			if (current_terrain.wind_settings_foldout)
		        			{
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Bending",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.wavingGrassAmount = EditorGUILayout.Slider(current_terrain.wavingGrassAmount,0.0,1.0);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_wind_amount(current_terrain,current_terrain.settings_all_terrain);
				        		}
				        		EditorGUILayout.EndHorizontal();
		        			}
		        			
		        			if (current_terrain.wind_settings_foldout)
		        			{
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(75+space);	
				        		EditorGUILayout.LabelField("Grass Tint",GUILayout.Width(147));
				        		gui_changed_window = GUI.changed; GUI.changed = false;
				        		current_terrain.wavingGrassTint = EditorGUILayout.ColorField(current_terrain.wavingGrassTint);
				        		if (GUI.changed)
				        		{
				        			script.set_terrain_grass_tint(current_terrain,current_terrain.settings_all_terrain);
				        			SceneView.RepaintAll(); 
				        		}
				        		EditorGUILayout.EndHorizontal();
		        			}
						}
		        		
		        		// terrain splat
		        		if (!script.settings.tabs)
		        		{
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.splat_foldout = EditorGUILayout.Foldout(current_terrain.splat_foldout,"Splat Textures");
			        		EditorGUILayout.EndHorizontal();
		        		}
		        		
		        		if (current_terrain.splat_foldout)
		        		{
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
	        				if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Add a new Splat Texture";
					    	}
		        			if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
		        			{
		        				current_terrain.add_splatprototype(current_terrain.splatPrototypes.Count);
		        				if (key.shift && current_terrain.splatPrototypes.Count > 1)
			        			{
			        				script.copy_terrain_splat(current_terrain.splatPrototypes[current_terrain.splatPrototypes.Count-2],current_terrain.splatPrototypes[current_terrain.splatPrototypes.Count-1]);
			        			}
			        			if (!script.color_output){script.check_synchronous_terrain_textures(current_terrain);}
			        				else {script.check_synchronous_terrain_textures(current_terrain);}
		        			}
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Erase the last Splat Texture\n\n(Control Click)";
					    	}
		        			if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)))
		        			{
		        				if (key.control) {
		        					if (!key.shift)
			        				{
			        					UndoRegister("Erase Splat");
			        					if (script.settings.colormap) {
		    								if (current_terrain.splatPrototypes.Count > 1) {
		    									current_terrain.erase_splatprototype(current_terrain.splatPrototypes.Count-1);
		    								}
		    							}
		    							else {
		    								current_terrain.erase_splatprototype(current_terrain.splatPrototypes.Count-1);
		    							}
		    						}
		    						else
		    						{
		    							UndoRegister("Erase Splats");
			        					if (script.settings.colormap) {
		    								if (current_terrain.splatPrototypes.Count > 1) {
		    									current_terrain.splatPrototypes.RemoveRange(1,current_terrain.splatPrototypes.Count-1);
		    								}
		    							}
		    							else {
		    								current_terrain.clear_splatprototype();
		    							}
		    						}
			        				this.Repaint();
			        				return;
			        			}
			        			else {
									this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
								}
		        			}
			        		
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Fold/Unfold all Splat settings\n(Click)\n\nInvert Foldout all Splat settings\n(Shift Click)";
					    	}
					    	
					    	if (!current_terrain.rtp_script) {
			        			if (GUILayout.Button(GUIContent("F",tooltip_text),GUILayout.Width(20)))
			        			{
			        				current_terrain.splats_foldout = !current_terrain.splats_foldout;
			        				if (!script.color_output)
			        				{
			        					script.change_splats_settings_foldout(current_terrain,key.shift);
			        				}
			        				else
			        				{
			        					script.change_color_splats_settings_foldout(current_terrain,key.shift);
			        				} 
			        			}
			        		}
		        			
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Enable/Disable RTP Terrain Relief Pack Shader\n(Shift Click)\n\nIf you don't have RTP and want to know more about it.\n(Shift Click) -> TC will open RTP on the Asset Store in your browser when it's not installed";
					    	}
					    	
				    		if (current_terrain.rtp_script) {GUI.backgroundColor = Color.green;}
		        			if (GUILayout.Button(GUIContent("<RTP>",button_rtp,tooltip_text),GUILayout.Width(90),GUILayout.Height(19))) {
		        				// script.settings.colormap = !script.settings.colormap;
		        				// init_colormap();
		        				// script.set_colormap(script.settings.colormap,true);
		        				// script.check_synchronous_terrains_textures();
		        				// global_settings.settings.rtp = !global_settings.settings.rtp;
		        				if (key.shift) {
			        				if (current_terrain.rtp_script) {
			        					script.assign_rtp(false,false); 
			        				}
			        				else {
			        					if (File.Exists(Application.dataPath+"/ReliefPack/Scripts/ReliefTerrain/ReliefTerrain.cs")) {
			        						if (current_terrain.terrain) {
				        						if (current_terrain.splatPrototypes.Count < 4 || current_terrain.terrain.terrainData.splatPrototypes.Length < 4) {
				        							this.ShowNotification(GUIContent("Assign 4 or 8 splat textures before applying RTP script"));
				        							for (var count_splat1: int = 0;current_terrain.splatPrototypes.Count < 4;++count_splat1) {
				        								if (current_terrain.splatPrototypes.Count > 0) {
				        									current_terrain.add_splatprototype(current_terrain.splatPrototypes.Count-1); 
				        								}
				        								else {
				        									current_terrain.add_splatprototype(0);
				        								}
				        							}
				        							script.check_synchronous_terrains_textures();
				        							return;
				        						}
				        					}
				        					else {
				        						return;
				        					}
			        					}
			        					script.assign_rtp(true,true);
			        					script.get_rtp_lodmanager();
			        					if (current_terrain.rtp_script) {
			        						script.settings.colormap = false;
			        					}
		        					}
			        			}
			        			else {
									this.ShowNotification(GUIContent("Shift click <RTP> to activate/deactivate automatic colormap assigning for the Relief Terrain Pack shader, if you do not have RTP shader shift clicking will open RTP on the Asset Store in your browser to get more information about it"));
								}
			    			}
		        			GUI.backgroundColor = Color.white;
			        		
			        		if (current_terrain.rtp_script) {
			        			if (GUILayout.Button("Refresh",GUILayout.Width(90))) {
			        				current_terrain.rtp_script.globalSettingsHolder.RefreshAll();
			        			}
			        		}
		        					        			
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Enable/Disable Colormap as splat texture\n(Shift Click)";
					    	}
		        			
			        			if (!current_terrain.rtp_script) {
			        				if (script.settings.colormap) {GUI.backgroundColor = Color.green;} 
				        			if (GUILayout.Button(GUIContent("<Colormap>",tooltip_text),GUILayout.Width(90)))
				        			{
				        				if (key.shift) {
					        				script.settings.colormap = !script.settings.colormap;
					        				init_colormap(); 
					        				script.set_colormap(script.settings.colormap,true);
					        				script.check_synchronous_terrains_textures();
					        			}
					        			else {
											this.ShowNotification(GUIContent("Shift click <Colormap> to activate/deactive the Colormap on splat texture slot0"));
										}
				        			}
				        		}
			        			GUI.backgroundColor = Color.white;
			        			EditorGUILayout.EndHorizontal();
				        			
			        			if (current_terrain.rtp_script) {
			        				EditorGUILayout.BeginHorizontal();
			        				GUILayout.Space(60+space);
			        				gui_changed_old = GUI.changed;
			        				GUI.changed = false;
			        				current_terrain.rtp_script.ColorGlobal = EditorGUILayout.ObjectField(current_terrain.rtp_script.ColorGlobal,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
			        				if (GUI.changed) { 
			        					var path: String = AssetDatabase.GetAssetPath(current_terrain.rtp_script.ColorGlobal);
			        					global_script.set_image_import_settings(path,true,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
			        					current_terrain.rtp_script.globalSettingsHolder.RefreshAll();
						        		if (select_window) {select_window.Repaint();}
			        				}
			        				GUI.changed = gui_changed_old;
			        				
			        				EditorGUILayout.LabelField("Colormap",GUILayout.Width(73));
			        				if (select_window) {if (select_window.mode == 0) {GUI.backgroundColor = Color.green;}}
			        				if (key.type == EventType.Repaint) {rtp_rect1 = GUILayoutUtility.GetLastRect();}
			        				if (GUI.Button(Rect(rtp_rect1.x,rtp_rect1.y+19,65,19),"Select")) {
			        					// Debug.Log("select");
			        					if (!select_window){create_select_window(0);} 
			        					else {
			        						if (select_window.mode == 0) {select_window.Close();} else {select_window.mode = 0;select_window.Repaint();}
			        					}
			        				}
			        				GUI.backgroundColor = Color.white;
			        				
			        				if (script.rtpLod_script) {
				        				if (script.rtpLod_script.RTP_NORMALGLOBAL_FIRST || script.rtpLod_script.RTP_NORMALGLOBAL_ADD || script.rtpLod_script.RTP_NORMALGLOBAL) {
				        					gui_changed_old = GUI.changed;
			        						GUI.changed = false;
			        						
				        					current_terrain.rtp_script.NormalGlobal = EditorGUILayout.ObjectField(current_terrain.rtp_script.NormalGlobal,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
				        					if (GUI.changed) { 
					        					var path1: String = AssetDatabase.GetAssetPath(current_terrain.rtp_script.NormalGlobal);
					        					global_script.set_image_import_settings(path1,true,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
					        					current_terrain.rtp_script.globalSettingsHolder.RefreshAll();
					        					if (select_window) {select_window.Repaint();}
								        	}
			        				
				        					EditorGUILayout.LabelField("Normalmap",GUILayout.Width(73));
					        				if (select_window) {if (select_window.mode == 1) {GUI.backgroundColor = Color.green;}}
					        				if (key.type == EventType.Repaint) {rtp_rect2 = GUILayoutUtility.GetLastRect();}
					        				if (GUI.Button(Rect(rtp_rect2.x,rtp_rect1.y+19,65,19),"Select")) {
					        					if (!select_window){create_select_window(1);} 
					        					else {
					        						if (select_window.mode == 1) {select_window.Close();} else {select_window.mode = 1;select_window.Repaint();}
					        					}
					        				}
					        				GUI.backgroundColor = Color.white;
				        				
				        				}
				        			}
			        				
			        				EditorGUILayout.EndHorizontal();
			        			}
			        			
			        			if (global_script.settings.video_help)
			        			{
				        			EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(60+space);
					        		GUI.backgroundColor = Color(0.3,0.7,1);
					        		if (GUILayout.Button("Help Splat Textures -> 2 Videos",EditorStyles.miniButtonMid,GUILayout.Width(190)))
					        		{
					        			script.settings.help_splat_textures_foldout = !script.settings.help_splat_textures_foldout;
					        		}
					        		GUI.backgroundColor = Color.white;
				        			EditorGUILayout.EndHorizontal();
				        			
				        			if (script.settings.help_splat_textures_foldout)
				        			{
				        				EditorGUILayout.BeginHorizontal();
						        		GUILayout.Space(75+space);
						        		GUI.backgroundColor = Color(0.3,0.7,1);
						        		if (GUILayout.Button("Assigning Splat Textures",EditorStyles.miniButtonMid,GUILayout.Width(190)))
						        		{
						        			Application.OpenURL("http://www.youtube.com/watch?v=PKcBk34KMfE");
						        		}
						        		EditorGUILayout.EndHorizontal();
				        			
				        				EditorGUILayout.BeginHorizontal();
						        		GUILayout.Space(75+space);
						        		if (GUILayout.Button("Tile Size Splat Textures",EditorStyles.miniButtonMid,GUILayout.Width(190)))
						        		{
						        			Application.OpenURL("http://www.youtube.com/watch?v=r1--YTtpJCs");
						        		}
						        		GUI.backgroundColor = Color.white;
					        			EditorGUILayout.EndHorizontal();
				        			}
				        		} 
				        		
			        			EditorGUILayout.BeginHorizontal();
							    GUILayout.Space(60+space);
					        	EditorGUILayout.LabelField("Apply settings to all terrains",GUILayout.Width(165)); 
					        	script.settings.splat_apply_all = EditorGUILayout.Toggle(script.settings.splat_apply_all,GUILayout.Width(25));
					        	EditorGUILayout.EndHorizontal();
			        		
			        			/*
				        		if (global_script.settings.video_help)
			        			{
				        			EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(60+space);
					        		GUI.backgroundColor = Color(0.3,0.7,1);
					        		if (GUILayout.Button("Help Video Color Textures",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					        		{
					        		
					        		}
					        		GUI.backgroundColor = Color.white;
				        			EditorGUILayout.EndHorizontal();
				        		}
				        		*/
			        		
			        		gui_changed_old = GUI.changed;
		        			gui_changed_window = GUI.changed; GUI.changed = false;
		        			var count_splat: int;
		        			
		        			#if !UNITY_3_4 && !UNITY_3_5 
			        		if (current_terrain.terrain) {
			        			EditorGUILayout.BeginHorizontal();
			        			GUILayout.Space(60+space);		
			        			EditorGUILayout.LabelField("Material",GUILayout.Width(77));
			        			gui_changed_window = GUI.changed; GUI.changed = false;
			        			current_terrain.terrain.materialTemplate = EditorGUILayout.ObjectField(current_terrain.terrain.materialTemplate,Material,true,GUILayout.Width(268));
			        			if (GUI.changed)
			        			{
				        			script.set_terrain_material(current_terrain,current_terrain.settings_all_terrain);
				        		}
					        	EditorGUILayout.EndHorizontal();
			        		}
			        		
			        		GUILayout.Space(5);
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);		
			        		EditorGUILayout.LabelField("Splat Textures");
			        		EditorGUILayout.EndHorizontal();
			        		#endif
		        			
		        				for (count_splat = 0;count_splat < current_terrain.splatPrototypes.Count;++count_splat)
			        			{
			        				if (count_splat == 0)
			        				{
				        				if (current_terrain.rtp_script) {
					        				EditorGUILayout.BeginHorizontal();
							        		GUILayout.Space(80+space);
					        				EditorGUILayout.LabelField("Splat",GUILayout.Width(55));
					        				EditorGUILayout.LabelField("Normal",GUILayout.Width(55));
						        			EditorGUILayout.LabelField("Height",GUILayout.Width(55));
						        			EditorGUILayout.EndHorizontal();
					        			}
					        			#if !UNITY_3_4 && !UNITY_3_5
				        				else {
				        					EditorGUILayout.BeginHorizontal();
							        		GUILayout.Space(80+space);
				        					EditorGUILayout.LabelField("Splat",GUILayout.Width(55));
					        				EditorGUILayout.LabelField("Normal",GUILayout.Width(55));
						        			EditorGUILayout.EndHorizontal();
				        				}
				        				#endif
			        				}
			        				
			        				EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(60+space);
					        		EditorGUILayout.LabelField(""+count_splat+".",GUILayout.Width(16));
					        		gui_changed_old = GUI.changed;
					        		gui_changed_window = GUI.changed; 
					        		GUI.changed = false;
		        					current_terrain.splatPrototypes[count_splat].texture = EditorGUILayout.ObjectField(current_terrain.splatPrototypes[count_splat].texture,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
			        				if (GUI.changed)
			        				{
			        					current_terrain.splatPrototypes[count_splat].import_max_size_list = script.get_import_resolution_to_list(get_image_import_max_size(current_terrain.splatPrototypes[count_splat].texture,false));
			        				}
			        				if (current_terrain.rtp_script) {
										current_terrain.splatPrototypes[count_splat].normal_texture = EditorGUILayout.ObjectField(current_terrain.splatPrototypes[count_splat].normal_texture,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
										current_terrain.splatPrototypes[count_splat].height_texture = EditorGUILayout.ObjectField(current_terrain.splatPrototypes[count_splat].height_texture,Texture,true,GUILayout.Width(55),GUILayout.Height(55));			        							
			        				}
			        				else
			        				#if !UNITY_3_4 && !UNITY_3_5
			        				current_terrain.splatPrototypes[count_splat].normalMap = EditorGUILayout.ObjectField(current_terrain.splatPrototypes[count_splat].normalMap,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
			        				#endif
			        				if (GUI.changed) {
			        					script.check_synchronous_terrain_textures(current_terrain);
			        				}
			        				GUI.changed = gui_changed_old;
			        				
			        				if (count_splat > -1)
			        				{
				        				if (global_script.settings.tooltip_mode != 0) {
							    			tooltip_text = "Add Splat Texture Preset from saved file";
							    		}
								        if (GUILayout.Button(GUIContent("Add",tooltip_text),GUILayout.Width(35))) {
							        		var path_splat_open2: String = EditorUtility.OpenFilePanel("Open Splat Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/splat","prefab");
								    		
								    		if (path_splat_open2.Length != 0)
								    		{
								    			load_splat_preset(path_splat_open2,current_terrain,count_splat,true);	
								    			script.check_synchronous_terrain_textures(current_terrain);
								    		}
							        	}
							        	
							        	
				        				if (global_script.settings.tooltip_mode != 0)
								        {
								    		tooltip_text = "Move Splat Texture up";
								    	}
								    	if (count_splat > 0) {
									    	if (GUILayout.Button(GUIContent("▲",tooltip_text),GUILayout.Width(25)))
					        				{
					        					script.swap_terrain_splat(current_terrain,count_splat,count_splat-1);script.check_synchronous_terrain_textures(current_terrain);
					        				}		
					        			}
					        			else {
					        				GUILayout.Space(29);
					        			}
				        				// if (key.type == EventType.Repaint) {
				        				current_terrain.splat_rect = GUILayoutUtility.GetLastRect();//}
							           	 
				        				if (count_splat < current_terrain.splatPrototypes.Count-1) {
					        				if (global_script.settings.tooltip_mode != 0)
									        {
									    		tooltip_text = "Move Splat Texture down";
									    	}
									    	if (GUILayout.Button(GUIContent("▼",tooltip_text),GUILayout.Width(25))){script.swap_terrain_splat(current_terrain,count_splat,count_splat+1);script.check_synchronous_terrain_textures(current_terrain);}		 
									    }
									    else {
					        				GUILayout.Space(29);
					        			}
								        							            
							            if (global_script.settings.tooltip_mode != 0)
								        {
								    		tooltip_text = "Insert a new Splat Texture";
								    	}
							            if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
							            {
							            	current_terrain.add_splatprototype(count_splat+1);
					        				if (key.shift)
					        				{
					        					script.copy_terrain_splat(current_terrain.splatPrototypes[count_splat],current_terrain.splatPrototypes[count_splat+1]);
					        				}
					        				script.check_synchronous_terrain_textures(current_terrain);
							            } 
							            if (global_script.settings.tooltip_mode != 0)
								        {
								    		tooltip_text = "Erase this Splat Texture\n\n(Control Click)";
								    	}	
							        	if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)))
							        	{
							        		if (key.control) {
							        			UndoRegister("Erase Splat");
							        			if (script.settings.colormap) {
				    								if (count_splat != 0) {
					    								current_terrain.erase_splatprototype(count_splat);
					    								script.check_synchronous_terrain_textures(current_terrain);
					    								this.Repaint();
					    								return;
				    								}
				    							}
				    							else {
				    								current_terrain.erase_splatprototype(count_splat);
				    								script.check_synchronous_terrain_textures(current_terrain);
				    								this.Repaint();
				    								return;
				    							}
								        	}
								        	else {
												this.ShowNotification(GUIContent("Control click the '-' button to erase"));
											}
							        	}
						        		EditorGUILayout.EndHorizontal();
						        		
						        		if (count_splat == 0 && script.settings.colormap)
								    	{
								    		if (select_window) {GUI.backgroundColor = Color.green;}
								    		if (GUI.Button(new Rect(current_terrain.splat_rect.x-35,current_terrain.splat_rect.y+27,70,17),"Select"))
								    		{
								    			if (!select_window){create_select_window(0);} else {select_window.Close();}
								    		}
								    		GUI.backgroundColor = Color.white;
								    	}
						        		
//						        		EditorGUILayout.BeginHorizontal();
//						        		GUILayout.Space(80+space);
//				        				
//				        				/*
//				        				if (current_terrain.splatPrototypes[count_splat].texture) {
//				        					EditorGUI.LabelField(Rect(current_terrain.splat_rect.x,current_terrain.splat_rect.y+20,300,17),""+current_terrain.splatPrototypes[count_splat].texture.name);
//				        				}
//				        				else {EditorGUILayout.LabelField("Empty",GUILayout.Width(55));}
//				        				*/
//				        				
//				        				EditorGUILayout.EndHorizontal();
				        				
				        				if (!current_terrain.rtp_script) {
					        				EditorGUILayout.BeginHorizontal();
							        		GUILayout.Space(79+space);
							        		current_terrain.splatPrototypes[count_splat].foldout = EditorGUILayout.Foldout(current_terrain.splatPrototypes[count_splat].foldout,"Settings");
							        		EditorGUILayout.EndHorizontal();
							        		if (GUI.changed)
											{
												script.check_synchronous_terrain_textures(current_terrain);
											}
											GUI.changed = gui_changed_old;
							        		
					        				if (current_terrain.splatPrototypes[count_splat].foldout)
					        				{
					        					/*
					        					if (current_terrain.splatPrototypes[count_splat].texture)
					        					{
						        					EditorGUILayout.BeginHorizontal();
													GUILayout.Space(94);
													EditorGUILayout.LabelField("Import Max Size",GUILayout.Width(125));
													gui_changed_old = GUI.changed;
													gui_changed_window = GUI.changed; GUI.changed = false;
													current_terrain.splatPrototypes[count_splat].import_max_size_list = EditorGUILayout.Popup(current_terrain.splatPrototypes[count_splat].import_max_size_list,script.image_import_max_settings,GUILayout.Width(100));
													if (GUI.changed)
													{
														gui_changed_old = true;
														set_image_import_settings(current_terrain.splatPrototypes[count_splat].texture,-1,-1,-1,Mathf.Pow(2,current_terrain.splatPrototypes[count_splat].import_max_size_list+5));
													}
						        					EditorGUILayout.EndHorizontal();
						        					
						        					EditorGUILayout.BeginHorizontal();
										        	GUILayout.Space(94);
										        	EditorGUILayout.LabelField("Resolution",GUILayout.Width(125));
										        	EditorGUILayout.LabelField(current_terrain.splatPrototypes[count_splat].texture.width+"x"+current_terrain.splatPrototypes[count_splat].texture.height);
										        	EditorGUILayout.EndHorizontal();
										        }
										        */
					        					
				        						GUI.changed = gui_changed_old;
					        					gui_changed_window = GUI.changed; GUI.changed = false;
					        					EditorGUILayout.BeginHorizontal();
								        		GUILayout.Space(94+space);
								        		EditorGUILayout.LabelField("Tile Size",GUILayout.Width(125));
								        		current_terrain.splatPrototypes[count_splat].tileSize.x = EditorGUILayout.Slider(current_terrain.splatPrototypes[count_splat].tileSize.x,1,20000);
									        	current_terrain.splatPrototypes[count_splat].tileSize.y = current_terrain.splatPrototypes[count_splat].tileSize.x;
								        		/*
								        		EditorGUILayout.LabelField("X",GUILayout.Width(30));
								        		GUI.SetNextControlName("tile_x"+count_splat);
								        		current_terrain.splatPrototypes[count_splat].tileSize.x = EditorGUILayout.FloatField(current_terrain.splatPrototypes[count_splat].tileSize.x,GUILayout.Width(70));
						        				EditorGUILayout.LabelField("Y",GUILayout.Width(30));
						        				GUI.SetNextControlName("tile_y"+count_splat);
								        		current_terrain.splatPrototypes[count_splat].tileSize.y = EditorGUILayout.FloatField(current_terrain.splatPrototypes[count_splat].tileSize.y,GUILayout.Width(70));
								        		current_terrain.splatPrototypes[count_splat].tileSize_link = EditorGUILayout.Toggle(current_terrain.splatPrototypes[count_splat].tileSize_link,GUILayout.Width(25));
								        		if (current_terrain.splatPrototypes[count_splat].tileSize_link){current_terrain.splatPrototypes[count_splat].tileSize.y = current_terrain.splatPrototypes[count_splat].tileSize.x;}
								        		*/
						        				EditorGUILayout.EndHorizontal();
												
												EditorGUILayout.BeginHorizontal();
								        		GUILayout.Space(94+space);
								        		EditorGUILayout.LabelField("Tile Offset",GUILayout.Width(125));
								        		EditorGUILayout.LabelField("X",GUILayout.Width(30));
								        		current_terrain.splatPrototypes[count_splat].tileOffset.x = EditorGUILayout.FloatField(current_terrain.splatPrototypes[count_splat].tileOffset.x,GUILayout.Width(70));
												EditorGUILayout.LabelField("Y",GUILayout.Width(30));
								        		current_terrain.splatPrototypes[count_splat].tileOffset.y = EditorGUILayout.FloatField(current_terrain.splatPrototypes[count_splat].tileOffset.y,GUILayout.Width(70));
												EditorGUILayout.EndHorizontal();
												if (GUI.changed)
												{
													if (!script.settings.splat_apply_all)
													{
														script.set_terrain_splat_textures(current_terrain,current_terrain);
													}
													else
													{
														script.set_all_terrain_splat_textures(current_terrain,true,false);
													}
													SceneView.RepaintAll();
												}
												GUI.changed = gui_changed_old;
											}
										}
									}
									else
									{
										EditorGUILayout.EndHorizontal();
									}
								}
							
								EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Open Splat Texture Preset from saved file";
					    		}
					        	if (GUILayout.Button(GUIContent("Open",tooltip_text),GUILayout.Width(75))) {
					        		var path_splat_open1: String = EditorUtility.OpenFilePanel("Open Splat Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/splat","prefab");
						    		
						    		if (path_splat_open1.Length != 0)
						    		{
						    			load_splat_preset(path_splat_open1,current_terrain,0,false);	
						    			script.check_synchronous_terrain_textures(current_terrain);
						    		}
					        	}
					        	if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Save Splat Texture Preset";
					    		}
					        	if (GUILayout.Button(GUIContent("Save",tooltip_text),GUILayout.Width(75))) {
									var path_splat_save: String = EditorUtility.SaveFilePanel("Save Splat Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/splat","","prefab");
						    		
						    		if (path_splat_save.Length != 0)
						    		{
						    			save_splat_preset1(path_splat_save,current_terrain);	
						    		}
					        	}	
			        			EditorGUILayout.EndHorizontal();
			        			
			        		if (current_terrain.terrain)
							{							
			        			GUILayout.Space(5);
					        	
			        			EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
				        		if (global_script.settings.tooltip_mode != 0)
					        	{
					    			tooltip_text = "Get Splat Textures from "+current_terrain.name+" in Scene\n\n(Shift Click)";
					    		}
					        	if (GUILayout.Button(GUIContent("<Get>",tooltip_text),GUILayout.Width(75)))
					        	{
					        		if (key.shift) {
					        			if (current_terrain.rtp_script) {current_terrain.rtp_script.globalSettingsHolder.RefreshAll();}
					        			script.get_terrain_splat_textures(current_terrain);script.check_synchronous_terrain_textures(current_terrain);
					        		}
					        		else {
										this.ShowNotification(GUIContent("Shift click <Get> to get the current assigned splat textures from the terrain"));
									}
					        	}
					        	if (script.terrains.Count > 1) {
						        	if (GUILayout.Button(GUIContent("<Get All>",tooltip_text),GUILayout.Width(75)))
						        	{
						        		if (key.shift) {
						        			if (current_terrain.rtp_script) {current_terrain.rtp_script.globalSettingsHolder.RefreshAll();}
						        			script.get_all_terrain_splat_textures(); 
						        		}
						        		else {
											this.ShowNotification(GUIContent("Shift click <Get All> to get the current assigned splat textures from all terrains"));
										}
						        	}
						        }
						    	if (!current_terrain.splat_synchronous)
					        	{
					        		GUI.color = Color.green;
					        	}
					        	if (global_script.settings.tooltip_mode != 0)
					        	{
					    			tooltip_text = "Set Splat Textures to "+current_terrain.name+" in Scene\n\n(Shift Click)";
					    		}
					        	if (GUILayout.Button(GUIContent("<Set>",tooltip_text),GUILayout.Width(75)))
					        	{
					        		if (key.shift) {
						        		script.set_terrain_splat_textures(current_terrain,current_terrain);
							        	if (current_terrain.rtp_script) {
							        		create_rtp_combined_textures(current_terrain);
							        		current_terrain.rtp_script.globalSettingsHolder.RefreshAll();
							        	}
							        	// script.check_synchronous_terrain_textures(current_terrain);
							        		// script.set_terrain_color_textures(current_terrain);
							        		// if (current_terrain.rtp_script) {current_terrain.rtp_script.globalSettingsHolder.RefreshAll();}
							        		script.check_synchronous_terrain_textures(current_terrain);
							        }
							        else {
										this.ShowNotification(GUIContent("Shift click <Set> to assign the chosen splat texture to the terrain"));
									}
					        	}
					        	GUI.color = color_terrain;
					        	if (script.terrains.Count > 1)
			        			{
					        		if (global_script.settings.tooltip_mode != 0)
						        	{
						    			tooltip_text = "Set all terrains Splat Textures the same as "+current_terrain.name+"\n\n(Shift Click)";
						    		}
					        		if (GUILayout.Button(GUIContent("<Set All>",tooltip_text),GUILayout.Width(75)))
					        		{
					        			if (key.shift) {
						        			set_all_terrain_splat_textures(current_terrain);
						        			if (current_terrain.rtp_script) {
						        				create_rtp_combined_textures(current_terrain);
						        				current_terrain.rtp_script.globalSettingsHolder.RefreshAll();
						        			}
						        		}
						        		else {
											this.ShowNotification(GUIContent("Shift click <Set All> to assign to chosen splat textures to all terrains"));
										}
					        		}
					        	}
					        	EditorGUILayout.EndHorizontal();
					        }
				        }
		        		
		        		if (!script.settings.tabs)
		        		{
				        	EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.tree_foldout = EditorGUILayout.Foldout(current_terrain.tree_foldout,"Trees");
			        		EditorGUILayout.EndHorizontal();
			        	}
		        		
		        		if (current_terrain.tree_foldout)
		        		{
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Add a new Tree";
					    	}
		        			if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
		        			{
		        				current_terrain.add_treeprototype(current_terrain.treePrototypes.Count);
		        				if (key.shift && current_terrain.treePrototypes.Count > 1)
			        			{
			        				script.copy_terrain_tree(current_terrain.treePrototypes[current_terrain.treePrototypes.Count-2],current_terrain.treePrototypes[current_terrain.treePrototypes.Count-1]);
			        			}
			        			script.check_synchronous_terrain_trees(current_terrain);
		        			}
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Erase the last Tree\n\n(Control Click)";
					    	}
		        			if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)))
		        			{
		        				if (key.control) {
			        				if (!key.shift)	{
			        					UndoRegister("Erase Tree");
			        					current_terrain.erase_treeprototype(current_terrain.treePrototypes.Count-1);
		    						}
		    						else {
		    							UndoRegister("Erase Trees");
		    							current_terrain.clear_treeprototype();
		    						}
		    						script.check_synchronous_terrain_trees(current_terrain);
			        				this.Repaint();
			        				return;
			        			}
			        			else {
									this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
								}
		        			}
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Fold/Unfold all Trees settings\n(Click)\n\nInvert Foldout all Trees settings\n(Shift Click)";
					    	}
		        			if (GUILayout.Button(GUIContent("F",tooltip_text),GUILayout.Width(20)))
		        			{
		        				current_terrain.trees_foldout = !current_terrain.trees_foldout;
		        				script.change_trees_settings_foldout(current_terrain,key.shift);
		        			}
		        			
		        			EditorGUILayout.EndHorizontal();
		        			if (global_script.settings.video_help)
			        		{
				        		EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	GUI.backgroundColor = Color(0.3,0.7,1);
					        	if (GUILayout.Button("Help Video Trees",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					        	{
					        		Application.OpenURL("http://www.youtube.com/watch?v=xIGHfNzpoao");
					        	}
					        	GUI.backgroundColor = Color.white;
				        		EditorGUILayout.EndHorizontal();
				        	}
				        	
		        			for (count_tree = 0;count_tree < current_terrain.treePrototypes.Count;++count_tree)
		        			{
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		
				        		if (!current_terrain.treePrototypes[count_tree].prefab){GUILayout.Button(GUIContent("Empty"),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64));}
				        		else
				        		{
									#if !UNITY_3_4 && !UNITY_3_5
								    current_terrain.treePrototypes[count_tree].texture = AssetPreview.GetAssetPreview(current_terrain.treePrototypes[count_tree].prefab);
									#else
								    current_terrain.treePrototypes[count_tree].texture = EditorUtility.GetAssetPreview(current_terrain.treePrototypes[count_tree].prefab);
								    #endif
								    if (global_script.settings.tooltip_mode == 2)
									{
										tooltip_text = "Click to preview\n\nClick again to close preview";
									} else {tooltip_text = "";}
								    if (GUILayout.Button(GUIContent(current_terrain.treePrototypes[count_tree].texture,tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64))){create_preview_window(current_terrain.treePrototypes[count_tree].texture,"Tree Preview");}
						    	}
		        				
				        		EditorGUILayout.LabelField(""+count_tree+".",GUILayout.Width(20));
				        		gui_changed_old = GUI.changed;
				        		gui_changed_window = GUI.changed; GUI.changed = false;
		        				current_terrain.treePrototypes[count_tree].prefab = EditorGUILayout.ObjectField(current_terrain.treePrototypes[count_tree].prefab,GameObject,true,GUILayout.Width(250));
		        				if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Add Tree Texture Preset from saved file";
					    		}
						        if (GUILayout.Button(GUIContent("Add",tooltip_text),GUILayout.Width(35))) {
					        		var path_tree_open2: String = EditorUtility.OpenFilePanel("Open Tree Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/tree","prefab");
						    		
						    		if (path_tree_open2.Length != 0)
						    		{
						    			load_tree_preset(path_tree_open2,current_terrain,count_tree,true);	
						    			script.check_synchronous_terrain_trees(current_terrain);
						    		}
					        	}	
					        	if (current_terrain.treePrototypes.Count > 1) {
						        	if (count_tree > 0) {
				        				if (global_script.settings.tooltip_mode != 0)
								        {
								    		tooltip_text = "Move Tree up";
								    	}
								    	if (GUILayout.Button(GUIContent("▲",tooltip_text),GUILayout.Width(25))){script.swap_terrain_tree(current_terrain,count_tree,count_tree-1);script.check_synchronous_terrain_trees(current_terrain);}		 
								    }
								    else {
								    	GUILayout.Space(29);
								    }
								    if (count_tree < current_terrain.treePrototypes.Count-1) {
							           	if (global_script.settings.tooltip_mode != 0)
								        {
								    		tooltip_text = "Move Tree down";
								    	}
							           	if (GUILayout.Button(GUIContent("▼",tooltip_text),GUILayout.Width(25))){script.swap_terrain_tree(current_terrain,count_tree,count_tree+1);script.check_synchronous_terrain_trees(current_terrain);}		 
							        }
							        else {
								    	GUILayout.Space(29);
								    }
							    }
					            if (global_script.settings.tooltip_mode != 0)
						        {
						    		tooltip_text = "Insert a new Tree";
						    	}
					            if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
					            {
					            	current_terrain.add_treeprototype(count_tree+1);
			        				if (key.shift)
			        				{
			        					script.copy_terrain_tree(current_terrain.treePrototypes[count_tree],current_terrain.treePrototypes[count_tree+1]);
			        				}
			        				script.check_synchronous_terrain_trees(current_terrain);
					            } 	
					            if (global_script.settings.tooltip_mode != 0)
						        {
						    		tooltip_text = "Erase this Tree\n\n(Control Click)";
						    	}
					        	if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)))
					        	{
					        		if (key.control) {
					        			UndoRegister("Erase Tree");
		    							current_terrain.erase_treeprototype(count_tree);
		    							script.check_synchronous_terrain_trees(current_terrain);
						        		this.Repaint();
			        					return;
			        				}
			        				else {
										this.ShowNotification(GUIContent("Control click the '-' button to erase"));
									}
					        	}
		        				EditorGUILayout.EndHorizontal();
		        				
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		current_terrain.treePrototypes[count_tree].foldout = EditorGUILayout.Foldout(current_terrain.treePrototypes[count_tree].foldout,"Settings");
				        		EditorGUILayout.EndHorizontal();
				        		
		        				if (current_terrain.treePrototypes[count_tree].foldout)
		        				{
			        				EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);
					        		current_terrain.treePrototypes[count_tree].bendFactor = EditorGUILayout.FloatField("Bend Factor",current_terrain.treePrototypes[count_tree].bendFactor,GUILayout.Width(200));
					        		if (global_script.settings.tooltip_mode != 0)
							        {
							    		tooltip_text = "Set this bendfactor to all Trees in this Terrain\n(Click)\n\nSet this bendfactor to all Trees in the Terrains\n(Shift Click)";
							    	}
					        		if (GUILayout.Button(GUIContent(">Set All",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(65)))
					        		{
					        			UndoRegister("Set All Trees Settings");
					        			if (!key.shft)
					        			{
					        				generate_auto();
	    									script.set_all_trees_settings_terrain(current_terrain,count_tree);
	    								}
	    								else
	    								{
	    									generate_auto();
	    									script.set_all_trees_settings_terrains(current_terrain,count_tree);
	    								}
					        		}
			        				EditorGUILayout.EndHorizontal();
			        			}
			        			if (GUI.changed){script.check_synchronous_terrain_trees(current_terrain);this.Repaint();}
			        			GUI.changed = gui_changed_old;
							}
							
								EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Open Tree Preset from saved file";
					    		}
					        	if (GUILayout.Button(GUIContent("Open",tooltip_text),GUILayout.Width(75))) {
					        		var path_tree_open1: String = EditorUtility.OpenFilePanel("Open Tree Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/tree","prefab");
						    		
						    		if (path_tree_open1.Length != 0)
						    		{
						    			load_tree_preset(path_tree_open1,current_terrain,0,false);	
						    			script.check_synchronous_terrain_trees(current_terrain);
						    			this.Repaint();
						    		}
					        	}
					        	if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Save Tree Texture Preset";
					    		}
					        	if (GUILayout.Button(GUIContent("Save",tooltip_text),GUILayout.Width(75))) {
									var path_tree_save: String = EditorUtility.SaveFilePanel("Save Tree Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/tree","","prefab");
						    		
						    		if (path_tree_save.Length != 0)
						    		{
						    			save_tree_preset1(path_tree_save,current_terrain);	
						    		}
					        	}	
			        			EditorGUILayout.EndHorizontal();
			        			
			        		if (current_terrain.terrain)
							{
			        			GUILayout.Space(5);
			        			
			        			EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	if (global_script.settings.tooltip_mode != 0)
							    {
							    	tooltip_text = "Get Trees from "+current_terrain.name+" in Scene\n\n(Shift Click)";
							    }
					        	if (GUILayout.Button(GUIContent("<Get>",tooltip_text),GUILayout.Width(75)))
					        	{
					        		if (key.shift) {
						        		script.get_terrain_trees(current_terrain);
						        		script.check_synchronous_terrain_trees(current_terrain);
						        		this.Repaint();
						        	}
						        	else {
										this.ShowNotification(GUIContent("Shift click <Get> to get the current assigned trees from the terrain"));
									}
					        	}
					        	if (script.terrains.Count > 1) {
						        	if (GUILayout.Button(GUIContent("<Get All>",tooltip_text),GUILayout.Width(75)))
						        	{
						        		if (key.shift) {
							        		script.get_all_terrain_trees();
							        		this.Repaint();
							        	}
							        	else {
											this.ShowNotification(GUIContent("Shift click <Get All> to get the current assigned trees from all terrains"));
										}
						        	}
						        }
					        	if (!current_terrain.tree_synchronous)
					        	{
					        		GUI.color = Color.green;
					        	}
					        	if (global_script.settings.tooltip_mode != 0)
							    {
							    	tooltip_text = "Set Trees to "+current_terrain.name+" in Scene\n\n(Shift Click)";
							    }
					        	if (GUILayout.Button(GUIContent("<Set>",tooltip_text),GUILayout.Width(75)))
					        	{
					        		if (key.shift) {
					        			script.set_terrain_trees(current_terrain);
					        			script.check_synchronous_terrain_trees(current_terrain);
					        		}
					        		else {
										this.ShowNotification(GUIContent("Shift click <Get> to assign the chosen trees to the terrain"));
									}
					        	}
					        	GUI.color = color_terrain;
					        	if (script.terrains.Count > 1)
			        			{
					        		if (global_script.settings.tooltip_mode != 0)
								    {
								    	tooltip_text = "Set all terrains Trees the same as "+current_terrain.name+"\n\n(Shift Click)";
								    }
					        		if (GUILayout.Button(GUIContent("<Set All>",tooltip_text),GUILayout.Width(75)))
					        		{
					        			if (key.shift) {
					        				script.set_all_terrain_trees(current_terrain);
					        				script.check_synchronous_terrain_trees(current_terrain);
					        			}
					        			else {
											this.ShowNotification(GUIContent("Shift click <Set All> to assign the chosen trees to all terrains"));
										}
					            	}
						        }
					        	EditorGUILayout.EndHorizontal();
					        }
			       		}
			       		
			       		if (!script.settings.tabs)
		        		{
			        		EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(45);
		        			current_terrain.detail_foldout = EditorGUILayout.Foldout(current_terrain.detail_foldout,"Grass/Details");
		        			EditorGUILayout.EndHorizontal();
		        		}
		        		
		        		if (current_terrain.detail_foldout)
		        		{
		        			EditorGUILayout.BeginHorizontal();
		        			GUILayout.Space(60+space);
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Add a new Grass/Detail";
					    	}
		        			if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
		        			{
		        				current_terrain.add_detailprototype(current_terrain.detailPrototypes.Count);
		        				if (key.shift && current_terrain.detailPrototypes.Count > 1)
		        				{
		        					script.copy_terrain_detail(current_terrain.detailPrototypes[current_terrain.detailPrototypes.Count-2],current_terrain.detailPrototypes[current_terrain.detailPrototypes.Count-1]);
		        				}
		        				script.check_synchronous_terrain_detail(current_terrain);
		        			}
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Erase the last Grass/Detail\n\n(Control Click)";
					    	}
		        			if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)))
		        			{
		        				if (key.control) {
		        					if (!key.shift)
			        				{
			        					UndoRegister("Erase Grass");
			        					current_terrain.erase_detailprototype(current_terrain.detailPrototypes.Count-1);
		    						}
		    						else
		    						{
		    							UndoRegister("Erase Grasses");
		    							current_terrain.clear_detailprototype();
		    						}
		    						script.check_synchronous_terrain_detail(current_terrain);
			        				this.Repaint();
			        				return;
			        			}
			        			else {
									this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
								}
		        			}
		        			if (global_script.settings.tooltip_mode != 0)
					        {
					    		tooltip_text = "Fold/Unfold all Grass/Details settings\n(Click)\n\nInvert Foldout all Grass/Details settings\n(Shift Click)";
					    	}
		        			if (GUILayout.Button(GUIContent("F",tooltip_text),GUILayout.Width(20)))
		        			{
		        				current_terrain.details_foldout = !current_terrain.details_foldout;
		        				script.change_details_settings_foldout(current_terrain,key.shift);
		        			}
		        			EditorGUILayout.EndHorizontal();
		        			
		        			if (global_script.settings.video_help)
			        		{
				        		EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	GUI.backgroundColor = Color(0.3,0.7,1);
					        	if (GUILayout.Button("Help Grass -> 2 Videos",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					        	{
					        		script.settings.help_grass_foldout = !script.settings.help_grass_foldout;
					        	}
					        	EditorGUILayout.EndHorizontal();
				        		
				        		if (script.settings.help_grass_foldout)
				        		{
				        			EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);
					        		if (GUILayout.Button("Assign Grass",EditorStyles.miniButtonMid,GUILayout.Width(153)))
						        	{
						        		Application.OpenURL("http://www.youtube.com/watch?v=7MAk4iO21ZQ");
						        	}
					        		EditorGUILayout.EndHorizontal();
					        		EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);
					        		if (GUILayout.Button("Grass Settings",EditorStyles.miniButtonMid,GUILayout.Width(153)))
						        	{
						        		Application.OpenURL("http://www.youtube.com/watch?v=a8RuQS4A5RA");
						        	}
					        		EditorGUILayout.EndHorizontal();
				        		}
				        		GUI.backgroundColor = Color.white;
				        		
				        	}
		        			for (count_detail = 0;count_detail < current_terrain.detailPrototypes.Count;++count_detail)
		        			{
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60+space);
				        		if (current_terrain.detailPrototypes[count_detail].usePrototypeMesh) {
				        			current_terrain.detailPrototypes[count_detail].prototype = EditorGUILayout.ObjectField(current_terrain.detailPrototypes[count_detail].prototype,GameObject,true,GUILayout.Width(175)) as GameObject;
				        		} 
				        		else {
				        			current_terrain.detailPrototypes[count_detail].prototypeTexture = EditorGUILayout.ObjectField(current_terrain.detailPrototypes[count_detail].prototypeTexture,Texture2D,true,GUILayout.Width(55),GUILayout.Height(55));
				        			if (current_terrain.detailPrototypes[count_detail].prototypeTexture) {
			        					EditorGUILayout.LabelField(current_terrain.detailPrototypes[count_detail].prototypeTexture.name,GUILayout.Width(116));
			        				}
			        				else {
			        					GUILayout.Space(120);
			        				}
				        		}
				        		EditorGUILayout.LabelField(""+count_detail+".",GUILayout.Width(20));
				        		EditorGUILayout.LabelField("Mesh",GUILayout.Width(40));
				        		current_terrain.detailPrototypes[count_detail].usePrototypeMesh = EditorGUILayout.Toggle(current_terrain.detailPrototypes[count_detail].usePrototypeMesh,GUILayout.Width(25));
				        		if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Add Grass/Detail Preset from saved file";
					    		}
						        if (GUILayout.Button(GUIContent("Add",tooltip_text),GUILayout.Width(35))) {
					        		var path_grass_open2: String = EditorUtility.OpenFilePanel("Open Grass/Detail Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/grass","prefab");
						    		
						    		if (path_grass_open2.Length != 0)
						    		{
						    			load_grass_preset(path_grass_open2,current_terrain,count_detail,true);	
						    			script.check_synchronous_terrain_textures(current_terrain);
						    		}
					        	}
					        	if (count_detail > 0) {
					        		if (global_script.settings.tooltip_mode != 0)
							        {
							    		tooltip_text = "Move Grass/Detail up";
							    	}
			        				if (GUILayout.Button(GUIContent("▲",tooltip_text),GUILayout.Width(25)) && count_detail > 0){script.swap_terrain_detail(current_terrain,count_detail,count_detail-1);script.check_synchronous_terrain_detail(current_terrain);}		 
			        			}
			        			else {
			        				GUILayout.Space(29);
			        			}
			        			if (count_detail < current_terrain.detailPrototypes.Count-1) {
						           	if (global_script.settings.tooltip_mode != 0)
							        {
							    		tooltip_text = "Move Grass/Detail down";
							    	}
						           	if (GUILayout.Button(GUIContent("▼",tooltip_text),GUILayout.Width(25))){script.swap_terrain_detail(current_terrain,count_detail,count_detail+1);script.check_synchronous_terrain_detail(current_terrain);}		 
						        }
						        else {
			        				GUILayout.Space(29);
			        			}
					            if (global_script.settings.tooltip_mode != 0)
						        {
						    		tooltip_text = "Insert a new Grass/Detail";
						    	}
					            if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
					            {
					            	current_terrain.add_detailprototype(count_detail+1);
			        				if (key.shift)
			        				{
			        					script.copy_terrain_detail(current_terrain.detailPrototypes[count_detail],current_terrain.detailPrototypes[count_detail+1]);
			        				}
			        				script.check_synchronous_terrain_detail(current_terrain);
					            } 	
					            if (global_script.settings.tooltip_mode != 0)
						        {
						    		tooltip_text = "Erase this Grass/Detail\n\n(Control Click)";
						    	}
					        	if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)))
					        	{
					        		if (key.control) {
					        			UndoRegister("Erase Grass");
					        			current_terrain.erase_detailprototype(count_detail);
		    							script.check_synchronous_terrain_detail(current_terrain);
						        		this.Repaint();
			        					return;
			        				}
			        				else {
										this.ShowNotification(GUIContent("Control click the '-' button to erase"));
									}
					        	}
		        				EditorGUILayout.EndHorizontal();
		        				
		        				EditorGUILayout.BeginHorizontal();
				        		GUILayout.Space(60);
				        		current_terrain.detailPrototypes[count_detail].foldout = EditorGUILayout.Foldout(current_terrain.detailPrototypes[count_detail].foldout,"Settings");
				        		EditorGUILayout.EndHorizontal();
				        		
		        				if (current_terrain.detailPrototypes[count_detail].foldout)
		        				{
			        				if (!current_terrain.detailPrototypes[count_detail].usePrototypeMesh) {
				        				EditorGUILayout.BeginHorizontal();
						        		GUILayout.Space(75+space);
						        		gui_changed_old = GUI.changed;
						        		gui_changed_window = GUI.changed; GUI.changed = false;
						        		current_terrain.detailPrototypes[count_detail].minWidth = EditorGUILayout.FloatField("Min. Width",current_terrain.detailPrototypes[count_detail].minWidth,GUILayout.Width(200));
				        				EditorGUILayout.EndHorizontal();
				        			}
			        				
			        				EditorGUILayout.BeginHorizontal();
						        	GUILayout.Space(75+space);
						        	if (!current_terrain.detailPrototypes[count_detail].usePrototypeMesh) {
			        					current_terrain.detailPrototypes[count_detail].maxWidth = EditorGUILayout.FloatField("Max. Width",current_terrain.detailPrototypes[count_detail].maxWidth,GUILayout.Width(200));
			        				}
			        				else {
			        					current_terrain.detailPrototypes[count_detail].maxWidth = EditorGUILayout.FloatField("Ramdom Width",current_terrain.detailPrototypes[count_detail].maxWidth,GUILayout.Width(200));
			        				}
				        			EditorGUILayout.EndHorizontal();
				        			
				        			if (!current_terrain.detailPrototypes[count_detail].usePrototypeMesh) {
				        				EditorGUILayout.BeginHorizontal();
						        		GUILayout.Space(75+space);
						        		current_terrain.detailPrototypes[count_detail].minHeight = EditorGUILayout.FloatField("Min. Height",current_terrain.detailPrototypes[count_detail].minHeight,GUILayout.Width(200));
				        				EditorGUILayout.EndHorizontal();
				        			}
			        				
			        				EditorGUILayout.BeginHorizontal();
						        	GUILayout.Space(75+space);
						        	if (!current_terrain.detailPrototypes[count_detail].usePrototypeMesh) {
				        				current_terrain.detailPrototypes[count_detail].maxHeight = EditorGUILayout.FloatField("Max. Height",current_terrain.detailPrototypes[count_detail].maxHeight,GUILayout.Width(200));
				        			}
				        			else {
				        				current_terrain.detailPrototypes[count_detail].maxHeight = EditorGUILayout.FloatField("Random Height",current_terrain.detailPrototypes[count_detail].maxHeight,GUILayout.Width(200));
				        			}
				        			EditorGUILayout.EndHorizontal();
				        			
			        				EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);
					        		current_terrain.detailPrototypes[count_detail].noiseSpread = EditorGUILayout.FloatField("Noise Spread",current_terrain.detailPrototypes[count_detail].noiseSpread,GUILayout.Width(200));
			        				EditorGUILayout.EndHorizontal();
			        				
			        				if (!current_terrain.detailPrototypes[count_detail].usePrototypeMesh) {
				        				EditorGUILayout.BeginHorizontal();
						        		GUILayout.Space(75+space);
						        		current_terrain.detailPrototypes[count_detail].bendFactor = EditorGUILayout.FloatField("Bend Factor",current_terrain.detailPrototypes[count_detail].bendFactor,GUILayout.Width(200));
				        				EditorGUILayout.EndHorizontal();
				        			}
			        				
			        				EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);
					        		current_terrain.detailPrototypes[count_detail].healthyColor = EditorGUILayout.ColorField("Healthy Color",current_terrain.detailPrototypes[count_detail].healthyColor,GUILayout.Width(300));
			        				EditorGUILayout.EndHorizontal();
			        				
			        				EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);
					        		current_terrain.detailPrototypes[count_detail].dryColor = EditorGUILayout.ColorField("Dry Color",current_terrain.detailPrototypes[count_detail].dryColor,GUILayout.Width(300));
			        				EditorGUILayout.EndHorizontal();
			        				
			        				EditorGUILayout.BeginHorizontal();
					        		GUILayout.Space(75+space);
					        		current_terrain.detailPrototypes[count_detail].renderMode = EditorGUILayout.EnumPopup("Render Mode",current_terrain.detailPrototypes[count_detail].renderMode,GUILayout.Width(300));
			        				EditorGUILayout.EndHorizontal();
			        			}
		        				
							}
							if (GUI.changed){script.check_synchronous_terrain_detail(current_terrain);}
		        			
							if (current_terrain.detailPrototypes.Count > 0)
							{
								EditorGUILayout.BeginHorizontal(); 
				           		GUILayout.Space(60+space);
			        			EditorGUILayout.LabelField("Scale",GUILayout.Width(147));
			        			gui_changed_window = GUI.changed; GUI.changed = false;
			        			current_terrain.detail_scale = EditorGUILayout.Slider(current_terrain.detail_scale,0,10,GUILayout.Width(200));
				            	EditorGUILayout.EndHorizontal();
				            	if (GUI.changed)
				            	{
				            		script.change_terrain_detail_scale(current_terrain);
				            		script.check_synchronous_terrain_detail(current_terrain);
				            	}
			        			GUI.changed = gui_changed_old;
							}
							
								EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Open Grass/Detail Preset from saved file";
					    		}
					        	if (GUILayout.Button(GUIContent("Open",tooltip_text),GUILayout.Width(75))) {
					        		var path_grass_open1: String = EditorUtility.OpenFilePanel("Open Grass/Detail Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/grass","prefab");
						    		
						    		if (path_grass_open1.Length != 0)
						    		{
						    			load_grass_preset(path_grass_open1,current_terrain,0,false);	
						    			script.check_synchronous_terrain_textures(current_terrain);
						    		}
					        	}
					        	if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Save grass Texture Preset";
					    		}
					        	if (GUILayout.Button(GUIContent("Save",tooltip_text),GUILayout.Width(75))) {
									var path_grass_save: String = EditorUtility.SaveFilePanel("Save Grass/Detail Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/grass","","prefab");
						    		
						    		if (path_grass_save.Length != 0)
						    		{
						    			save_grass_preset1(path_grass_save,current_terrain);	
						    		}
					        	}	
			        			EditorGUILayout.EndHorizontal();
			        			
			        			
			        		if (current_terrain.terrain)
							{
			        			GUILayout.Space(5);
			        			
			        			EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	if (global_script.settings.tooltip_mode != 0)
							    {
							    	tooltip_text = "Get Grass/Detail from "+current_terrain.name+" in Scene\n\n(Shift Click)";
							    }
					        	if (GUILayout.Button(GUIContent("<Get>",tooltip_text),GUILayout.Width(75)))
					        	{
					        		if (key.shift) {
					        			script.get_terrain_details(current_terrain);
					        			script.check_synchronous_terrain_detail(current_terrain);
					        		}
					        		else {
										this.ShowNotification(GUIContent("Shift click <Get> to get the current assigned grass textures from the terrain"));
									}
					        	}
					        	if (script.terrains.Count > 1) {
						        	if (GUILayout.Button(GUIContent("<Get All>",tooltip_text),GUILayout.Width(75)))
						        	{
						        		if (key.shift) {
						        			script.get_all_terrain_details();
						        		}
						        		else {
											this.ShowNotification(GUIContent("Shift click <Get All> to get the current assigned grass textures from all terrains"));
										}
						        	}
						        }
					        	if (!current_terrain.detail_synchronous)
					        	{
					        		GUI.color = Color.green;
					        	}
					        	if (global_script.settings.tooltip_mode != 0)
							    {
							    	tooltip_text = "Set Grass/Detail to "+current_terrain.name+" in Scene\n\n(Shift Click)";
							    }
					        	if (GUILayout.Button(GUIContent("<Set>",tooltip_text),GUILayout.Width(75)))
					        	{
					        		if (key.shift) {
						        		script.set_terrain_details(current_terrain);
						        		script.check_synchronous_terrain_detail(current_terrain);
						        	}
						        	else {
										this.ShowNotification(GUIContent("Shift click <Set> to assign the chosen grass textures to the terrain"));
									}
					        	}
					        	GUI.color = color_terrain;
					        	if (script.terrains.Count > 1)
			        			{
					        		if (global_script.settings.tooltip_mode != 0)
								    {
								    	tooltip_text = "Set all terrains Grass/Detail the same as "+current_terrain.name+"\n\n(Shift Click)";
								    }
					        		if (GUILayout.Button(GUIContent("<Set All>",tooltip_text),GUILayout.Width(75)))
					        		{
					        			if (key.shift) {
					        				script.set_all_terrain_details(current_terrain);
					        				script.check_synchronous_terrain_detail(current_terrain);
					        			}
					        			else {
											this.ShowNotification(GUIContent("Shift click <Set All> to assign the chosen grass textures to all terrains"));
										}
						        	}
						        }
					        	EditorGUILayout.EndHorizontal();
					        }
			       		}
			       		
			       		if (!script.settings.tabs)
		        		{
				        	EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.reset_foldout = EditorGUILayout.Foldout(current_terrain.reset_foldout,"Reset");
			        		EditorGUILayout.EndHorizontal();
			        	}
		        		
		        		if (current_terrain.reset_foldout && current_terrain.terrain)
		        		{
			       			if (global_script.settings.video_help)
			        		{
				        		EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	GUI.backgroundColor = Color(0.3,0.7,1);
					        	if (GUILayout.Button("Help Video Reset",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					        	{
					        		Application.OpenURL("http://www.youtube.com/watch?v=n3Ur6A5rpBc");
					        	}
					        	GUI.backgroundColor = Color.white;
				        		EditorGUILayout.EndHorizontal();
				        	}
				        	
			       			EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(60+space);
			        		if (global_script.settings.tooltip_mode != 0)
						    {
						    	tooltip_text = "Reset Heightmap Data of "+current_terrain.name+" in Scene\n(Control Click)\n\nReset Heightmap Data of all Terrains\n(Control Shift Click)";
						    }
				        	if (GUILayout.Button(GUIContent("-Reset Heightmap-",tooltip_text),GUILayout.Width(125)))
			        		{
			        			if (key.control) {
				        			if (!key.alt)
				        			{
				        				var heights: float [,] = new float[current_terrain.terrain.terrainData.heightmapResolution,current_terrain.terrain.terrainData.heightmapResolution];
					        			if (key.shift)
					        			{
					        				script.terrain_reset_heightmap(current_terrain,true);
					        			}
					        			else
					        			{
					        				script.terrain_reset_heightmap(current_terrain,false);
					        			}
					        		}
					        		else
					        		{
					        			if (!key.shift)
					        			{
					        				assign_heightmap(current_terrain);
					        			}
					        			else
					        			{
					        				assign_heightmap_all_terrain();	
					        			}
					        		}
					        	}
					        	else {
									this.ShowNotification(GUIContent("Control click the '-Reset Heightmap-' button to reset the terrain heightmap\nControl Shift click the '-Reset Heightmap-' button to reset the heightmaps from all terrains"));
								}
			        		}
			        		if (global_script.settings.tooltip_mode != 0)
						    {
						    	tooltip_text = "Reset Splatmap Data of "+current_terrain.name+" in Scene\n(Control Click)\n\nReset Splatmap Data of all Terrains\n(Control Shift Click)";
						    }
			        		if (GUILayout.Button(GUIContent("-Reset Splatmap-",tooltip_text),GUILayout.Width(125)))
			        		{
			        			if (key.control) {
				        			if (key.shift)
				        			{
				        				script.terrain_all_reset_splat();
				        			}
				        			else
				        			{
				        				script.terrain_reset_splat(current_terrain);	
				        			}
				        		}
				        		else {
									this.ShowNotification(GUIContent("Control click the '-Reset Splatmap-' button to reset the terrain splatmap\nControl Shift click the '-Reset Splatmap-' button to reset the splatmaps from all terrains"));
								}
			        		}
			        		if (global_script.settings.tooltip_mode != 0)
						    {
						    	tooltip_text = "Reset placed Trees in "+current_terrain.name+" in Scene\n(Control Click)\n\nReset placed Trees in all Terrains\n(Control Shift Click)";
						    }
			        		if (GUILayout.Button(GUIContent("-Reset Trees-",tooltip_text),GUILayout.Width(105)))
			        		{
			        			if (key.control) {
				        			if (key.shift)
				        			{
				        				script.terrain_reset_trees(current_terrain,true);
				        			}
				        			else
				        			{
				        				script.terrain_reset_trees(current_terrain,false);
				        			}
				        		}
				        		else {
									this.ShowNotification(GUIContent("Control click the '-Reset Trees-' button to reset the terrain trees\nControl Shift click the '-Reset Trees-' button to reset the trees from all terrains"));
								}
			        		}
			        		if (global_script.settings.tooltip_mode != 0)
						    {
						    	tooltip_text = "Reset Detail/Grass Data of "+current_terrain.name+" in Scene\n(Control Click)\n\nReset Detail/Grass Data of all Terrains\n(Control Shift Click)";
						    }
			        		if (GUILayout.Button(GUIContent("-Reset Grass-",tooltip_text),GUILayout.Width(105)))
			        		{
			        			if (key.control) {
				        			if (current_terrain.terrain.terrainData.detailPrototypes.Length > 0)
				        			{
				        				if (key.shift)
					        			{
					        				script.terrain_reset_grass(current_terrain,true);
					        			}
					        			else
					        			{
					        				script.terrain_reset_grass(current_terrain,false);
					        			}
					        		}
					        	}
					        	else {
									this.ShowNotification(GUIContent("Control click the '-Reset Detail-' button to reset the terrain grass\nControl Shift click the '-Reset Detail-' button to reset the grass from all terrains"));
								}
			        		}
			        		if (global_script.settings.tooltip_mode != 0)
						    {
						    	tooltip_text = "Erase placed Objects in Scene\n(Control Click)";
						    }
			        		if (GUILayout.Button(GUIContent("-Reset Objects-",tooltip_text),GUILayout.Width(115)))
			        		{
			        			if (key.control) {
			        				script.loop_prelayer("(cpo)",0,true);
			        			}
			        			else {
									this.ShowNotification(GUIContent("Control click the '-Reset Objects-' button to reset all the placed objects"));
								}
				        	}
			        		EditorGUILayout.EndHorizontal();
			        	}
			        	
			        	if (!script.settings.tabs)
		        		{
				        	EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45);
			        		current_terrain.scripts_foldout = EditorGUILayout.Foldout(current_terrain.scripts_foldout,"Scripts");
			        		EditorGUILayout.EndHorizontal();
			        	}
		        		
		        		if (current_terrain.scripts_foldout && current_terrain.terrain)
		        		{
		        			
		        			/*
		        			if (global_script.settings.video_help)
			        		{
				        		EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	GUI.backgroundColor = Color(0.3,0.7,1);
					        	if (GUILayout.Button("Help Video Scripts",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					        	{
					        	
					        	}
					        	GUI.backgroundColor = Color.white;
				        		EditorGUILayout.EndHorizontal();
				        	}
				        	*/
				        	//if (current_terrain.rtp_script) {
					        	EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	
					        	if (global_script.settings.tooltip_mode != 0) {
					    			tooltip_text = "Open RTP Preset from saved file";
					    		}
					        	if (GUILayout.Button(GUIContent("Open",tooltip_text),GUILayout.Width(75))) {
					        		var path_rtp_open1: String = EditorUtility.OpenFilePanel("Open RTP Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/RTP","prefab");
						    		
						    		if (path_rtp_open1.Length != 0)
						    		{
						    			load_rtp_preset(path_rtp_open1,current_terrain,0,false);	
						    			script.check_synchronous_terrain_textures(current_terrain);
						    		}
					        	}
			        			if (current_terrain.rtp_script) {
			        				if (global_script.settings.tooltip_mode != 0) {
					    				tooltip_text = "Save RTP Preset";
						    		}
						        	if (GUILayout.Button(GUIContent("Save",tooltip_text),GUILayout.Width(75))) {
										var path_rtp_save: String = EditorUtility.SaveFilePanel("Save RTP Preset",Application.dataPath+install_path.Replace("Assets","")+"/save/presets/RTP","","prefab");
							    		
							    		if (path_rtp_save.Length != 0)
							    		{
							    			save_rtp_preset1(path_rtp_save,current_terrain,true);	
							    		}
						        	}	
			        			}
			        			EditorGUILayout.EndHorizontal();
			        			
			        			EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	EditorGUILayout.LabelField("Select properties to load from preset");
					        	EditorGUILayout.EndHorizontal();
			        			
			        			
			        			EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	EditorGUILayout.LabelField("Color maps",GUILayout.Width(90));
					        	script.settings.load_colormap = EditorGUILayout.Toggle(script.settings.load_colormap,GUILayout.Width(25));
					        	EditorGUILayout.LabelField("Normal maps",GUILayout.Width(90));
					        	script.settings.load_normalmap = EditorGUILayout.Toggle(script.settings.load_normalmap,GUILayout.Width(25));
					        	EditorGUILayout.LabelField("Tree maps",GUILayout.Width(90));
					        	script.settings.load_treemap = EditorGUILayout.Toggle(script.settings.load_treemap,GUILayout.Width(25));
					        	
					        	if (GUILayout.Button("A",GUILayout.Width(20))) {
					        		if (script.settings.load_colormap) {
					        			script.settings.load_colormap = false;
					        			script.settings.load_normalmap = false;
					        			script.settings.load_treemap  = false;
					        		}
					        		else {
					        			script.settings.load_colormap = true;
					        			script.settings.load_normalmap = true;
					        			script.settings.load_treemap  = true;
					        		}
					        	}
					        	EditorGUILayout.EndHorizontal();
			        			
			        			EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	EditorGUILayout.LabelField("Control maps",GUILayout.Width(90));
					        	script.settings.load_controlmap = EditorGUILayout.Toggle(script.settings.load_controlmap,GUILayout.Width(25));
					        	EditorGUILayout.LabelField("Bump Global",GUILayout.Width(90));
					        	script.settings.load_bumpglobal = EditorGUILayout.Toggle(script.settings.load_bumpglobal,GUILayout.Width(25));
					        	
					        	GUILayout.Space(123);
					        	if (GUILayout.Button("A",GUILayout.Width(20))) {
					        		if (script.settings.load_controlmap) {
					        			script.settings.load_controlmap = false;
					        			script.settings.load_bumpglobal = false;
					        		}
					        		else {
					        			script.settings.load_controlmap = true;
					        			script.settings.load_bumpglobal = true;
					        		}
					        	}
					        	EditorGUILayout.EndHorizontal();
					        	
					        	EditorGUILayout.BeginHorizontal();
					        	GUILayout.Space(60+space);
					        	EditorGUILayout.LabelField("Layer Textures",GUILayout.Width(90));
					        	script.settings.load_layers = EditorGUILayout.Toggle(script.settings.load_layers,GUILayout.Width(25));
					        	EditorGUILayout.LabelField("Layer Settings",GUILayout.Width(90));
					        	script.settings.load_layers_settings = EditorGUILayout.Toggle(script.settings.load_layers_settings,GUILayout.Width(25));
					        	GUILayout.Space(123);
					        	if (GUILayout.Button("A",GUILayout.Width(20))) {
					        		if (script.settings.load_layers) {
					        			script.settings.load_layers = false;
					        			script.settings.load_layers_settings = false;
					        		}
					        		else {
					        			script.settings.load_layers = true;
					        			script.settings.load_layers_settings = true;
					        		}
					        	}
					        	EditorGUILayout.EndHorizontal();
					       // }
				        	
		        			/*
		        			if (script.terrains.Count > 1)
		        			{
		        				EditorGUILayout.BeginHorizontal();
		        				GUILayout.Space(60+space);
		        				
		        				if (current_terrain.terrain.GetComponent(TerrainNeighbors))
		        				{
		        					if (global_script.settings.tooltip_mode != 0)
								    {
								    	tooltip_text = "Remove Neighbors script for all terrains in Scene";
								    }
		        					if (GUILayout.Button(GUIContent("Remove Neighbors",tooltip_text),GUILayout.Width(140)))
			        				{
			        					script.set_neighbor(-1);
			        				}
		        					EditorGUILayout.LabelField("ON");
		        				}
		        				else
		        				{
		        					if (global_script.settings.tooltip_mode != 0)
								    {
								    	tooltip_text = "Add Neighbors script to all terrains in Scene\n\nThis will create seamless borders between Terrains in Runtime";
								    }
		        					if (GUILayout.Button(GUIContent("Add NeighBors",tooltip_text),GUILayout.Width(140)))
			        				{
			        					script.set_neighbor(1);
			        				}
		        					EditorGUILayout.LabelField("OFF");
		        				}
		        				EditorGUILayout.EndHorizontal();
		        			}	
		        			*/	        			
		        		}
		        	}
		        	
		        	if (!current_terrain.size_synchronous || !current_terrain.resolutions_synchronous || !current_terrain.splat_synchronous || !current_terrain.tree_synchronous || !current_terrain.detail_synchronous)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(30);
						if (!current_terrain.size_synchronous)
						{
							GUI.color = Color.green;
							
						    if (global_script.settings.tooltip_mode != 0)
						    {
							   	tooltip_text = "The Terrain Size is not Synchronous with "+current_terrain.name+" in Scene\n\nClick to foldout Size";
						    }
						    if(GUILayout.Button(GUIContent("SZ",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(28)))
							{
								current_terrain.foldout = true;
								current_terrain.data_foldout = true;
								current_terrain.size_foldout = true;
								current_terrain.resolution_foldout = false;
								current_terrain.splat_foldout = false;current_terrain.tree_foldout = false;current_terrain.detail_foldout = false;current_terrain.prearea.foldout = false;
							}
							GUI.color = color_terrain;
						} 
						
				        if (!current_terrain.resolutions_synchronous)
						{
							GUI.color = Color.green;
							if (global_script.settings.tooltip_mode != 0)
						    {
						    	tooltip_text = "The Terrain Resolutions are not Synchronous with "+current_terrain.name+" in Scene\n\nClick to foldout Resolutions";
						    }
							if(GUILayout.Button(GUIContent("R",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(23)))
							{
								current_terrain.foldout = true;current_terrain.data_foldout = true;current_terrain.resolution_foldout = true;
								current_terrain.splat_foldout = false;current_terrain.tree_foldout = false;current_terrain.detail_foldout = false;current_terrain.prearea.foldout = false;current_terrain.size_foldout = false;
							}
							GUI.color = color_terrain;
						} 				        
									
				        if (!current_terrain.splat_synchronous)
				        {
				        	GUI.color = Color.green;
				        	if (global_script.settings.tooltip_mode != 0)
						    {
							   	tooltip_text = "The Terrain Splat Textures are not Synchronous with "+current_terrain.name+" in Scene\n\nClick to foldout Splat Textures";
						    }
				        	if(GUILayout.Button(GUIContent("S",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(23)))
				        	{
				        		current_terrain.foldout = true;current_terrain.data_foldout = true;current_terrain.splat_foldout = true;
				        		current_terrain.resolution_foldout = false;current_terrain.tree_foldout = false;current_terrain.detail_foldout = false;current_terrain.prearea.foldout = false;current_terrain.size_foldout = false;
				        	}
				        	GUI.color = color_terrain;
				        } 
				        	
				        if (!current_terrain.tree_synchronous)
				        {
				        	GUI.color = Color.green;
				        	if (global_script.settings.tooltip_mode != 0)
						    {
							   	tooltip_text = "The Terrain Trees are not Synchronous with "+current_terrain.name+" in Scene\n\nClick to foldout Trees";
						    }
				        	if(GUILayout.Button(GUIContent("T",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(23)))
				        	{
				        		current_terrain.foldout = true;current_terrain.data_foldout = true;current_terrain.tree_foldout = true;
				        		current_terrain.splat_foldout = false;current_terrain.resolution_foldout = false;current_terrain.detail_foldout = false;current_terrain.prearea.foldout = false;current_terrain.size_foldout = false;
				        	}
				        	GUI.color = color_terrain;
				        } 
				        	
				        if (!current_terrain.detail_synchronous)
				        {
				        	GUI.color = Color.green;
				        	if (global_script.settings.tooltip_mode != 0)
						    {
							   	tooltip_text = "The Terrain Grass/Details are not Synchronous with "+current_terrain.name+" in Scene\n\nClick to foldout Grass/Details";
						    }
				        	if(GUILayout.Button(GUIContent("D",tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(23)))
				        	{
				        		current_terrain.foldout = true;current_terrain.data_foldout = true;current_terrain.detail_foldout = true;
				        		current_terrain.splat_foldout = false;current_terrain.tree_foldout = false;current_terrain.resolution_foldout = false;current_terrain.prearea.foldout = false;current_terrain.size_foldout = false;
				        	}
				        	GUI.color = color_terrain;
				        }
				    	EditorGUILayout.EndHorizontal();
				    }
					    
				    EditorGUILayout.BeginHorizontal();
					GUILayout.Space(30);
					if (current_terrain.terrain){EditorGUILayout.LabelField("Trees placed: "+current_terrain.terrain.terrainData.treeInstances.Length,GUILayout.Width(250));}
					EditorGUILayout.EndHorizontal();
					
					if (!current_terrain.terrain)
					{
						GUILayout.Space(5);
						
						if (global_script.settings.video_help)
			        	{
				        	EditorGUILayout.BeginHorizontal();
					       	GUILayout.Space(30);
					       	GUI.backgroundColor = Color(0.3,0.7,1);
					       	if (GUILayout.Button("Help Video Creating Terrain",EditorStyles.miniButtonMid,GUILayout.Width(200)))
					       	{
					       		Application.OpenURL("http://www.youtube.com/watch?v=7EPCNMR5fec");
					       	}
					       	GUI.backgroundColor = Color.white;
				        	EditorGUILayout.EndHorizontal();
				        }
						
						draw_terrain_store(30,0);
			        	
			        	if (script.terrains.Count > 1)
						{
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(30);
							EditorGUILayout.LabelField("Copy Settings Terrain",GUILayout.Width(160));
							// EditorGUILayout.LabelField("Terrain",GUILayout.Width(70));
							gui_changed_old = GUI.changed;
							gui_changed_window = GUI.changed; GUI.changed = false;
							current_terrain.copy_terrain = EditorGUILayout.IntField(current_terrain.copy_terrain,GUILayout.Width(50));
							if (GUI.changed)
							{
								if (current_terrain.copy_terrain == count_terrain){--current_terrain.copy_terrain;}
								if (current_terrain.copy_terrain < 0){current_terrain.copy_terrain = 0;}
								if (current_terrain.copy_terrain > script.terrains.Count-1){current_terrain.copy_terrain = script.terrains.Count-1;}
							}
							GUI.changed = gui_changed_old;
							current_terrain.copy_terrain_settings = EditorGUILayout.Toggle(current_terrain.copy_terrain_settings,GUILayout.Width(25));
							EditorGUILayout.EndHorizontal();
							
							#if !UNITY_3_4 && !UNITY_3_5
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(30);
							EditorGUILayout.LabelField("Copy Material Terrain",GUILayout.Width(160));
							script.settings.copy_terrain_material = EditorGUILayout.Toggle(script.settings.copy_terrain_material,GUILayout.Width(25));
							EditorGUILayout.EndHorizontal();
							#endif
						}
			        	
			        	gui_changed_window = GUI.changed; 
						GUI.changed = false;
						
			        	EditorGUILayout.BeginHorizontal();
						GUILayout.Space(30);
//						EditorGUILayout.LabelField("Terrain Instances",GUILayout.Width(160));
//						gui_changed_old = GUI.changed;
//						gui_changed_window = GUI.changed; 
//						GUI.changed = false;
//						script.terrain_instances = EditorGUILayout.IntField(script.terrain_instances,GUILayout.Width(50));
//						if (GUI.changed)
//						{
//							if (script.terrain_instances < -script.terrains.Count){script.terrain_instances = -script.terrains.Count;}
//						}
						EditorGUILayout.LabelField("Tiles X",GUILayout.Width(160));
						script.terrainTiles.x = EditorGUILayout.IntSlider(script.terrainTiles.x,1,script.settings.terrain_tiles_max);
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(30);
						EditorGUILayout.LabelField("Tiles Y",GUILayout.Width(131));
						script.terrainTileLink = EditorGUILayout.Toggle(script.terrainTileLink,GUILayout.Width(25));
						script.terrainTiles.y = EditorGUILayout.IntSlider(script.terrainTiles.y,1,script.settings.terrain_tiles_max);
						EditorGUILayout.EndHorizontal();
						
						if (GUI.changed)
						{
							if (script.terrainTileLink) script.terrainTiles.y = script.terrainTiles.x;
							current_terrain.tiles = script.terrainTiles;
							script.calc_terrain_needed_tiles();
						}
						GUI.changed = gui_changed_old;
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(30);
						var button_text: String;
						if (script.terrainTiles.x == 1 && script.terrainTiles.y == 1){button_text = "Create Terrain";} else {button_text = "Create Terrains";}
						//if (script.terrain_instances > 0)
						//{
							if (GUILayout.Button(button_text,GUILayout.Width(150)))
							{
								// create_terrain(current_terrain,script.terrain_instances,1+count_terrain,1+count_terrain,script.terrain_path,script.terrain_parent);
								if (!check_resolutions_out_of_range(current_terrain)) {
									CreateTerrains(current_terrain,script.terrain_path,script.terrain_parent,script.terrainTiles);
									// if (script.settings.auto_fit_terrains){fit_all_terrains();}
									generate_auto();
								}
							}
//							GUILayout.Space(11);
//							EditorGUILayout.LabelField("-> Erase TerrainData Assets from Project",GUILayout.Width(250));
//							script.terrain_asset_erase = EditorGUILayout.Toggle(script.terrain_asset_erase,GUILayout.Width(25));
							
						// }
//						if (script.terrain_instances < 0)
//						{
//							GUI.backgroundColor = Color.red;
//							if (GUILayout.Button("-Erase Terrains-",GUILayout.Width(150)) && key.control)
//							{
//								CreateTerrains(current_terrain,script.terrain_path,script.terrain_parent);
//								// erase_terrains(script.terrain_instances*-1,script.terrain_asset_erase);
//								if (script.settings.auto_fit_terrains){fit_all_terrains();}
//								generate_auto();
//							}
//							GUILayout.Space(7);
//							EditorGUILayout.LabelField("-> Erase TerrainData Assets from Project",GUILayout.Width(250));
//							if (!script.terrain_asset_erase){GUI.backgroundColor = Color.white;}
//							script.terrain_asset_erase = EditorGUILayout.Toggle(script.terrain_asset_erase,GUILayout.Width(25));
//							GUI.backgroundColor = Color.white;
//						}
						EditorGUILayout.EndHorizontal();
					}
				}
	}
	
	function draw_terrain_store(space: int,draw_from: int)
	{
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space);
		EditorGUILayout.LabelField("Path",GUILayout.Width(160));
		if (draw_from == 0)
		{
			EditorGUILayout.LabelField(""+script.terrain_path);
		}
		else
		{
			EditorGUILayout.LabelField(""+script.terrain_slice_path);
		}
		if (GUILayout.Button(GUIContent(">Change",button_folder),GUILayout.Width(85),GUILayout.Height(19)))
		{
			if (!key.shift)
			{
				var terrain_path: String;
				if (draw_from == 0)
				{
					terrain_path = EditorUtility.OpenFolderPanel("Export File Path",script.terrain_path,"");
			    	if (terrain_path != ""){script.terrain_path = terrain_path;}
			    }
			    else
			    {
					terrain_path = EditorUtility.OpenFolderPanel("Export File Path",script.terrain_slice_path,"");
			    	if (terrain_path != ""){script.terrain_slice_path = terrain_path;}
			    }
			}
			else
			{
				if (draw_from == 0)
				{
					script.terrain_path = Application.dataPath;
				}
				else
				{
					script.terrain_slice_path = Application.dataPath;
				}
			}
		}
		EditorGUILayout.EndHorizontal();
			        	
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space);
		EditorGUILayout.LabelField("Terrain Asset Name",GUILayout.Width(160));
		script.terrain_asset_name = EditorGUILayout.TextField(script.terrain_asset_name);
		EditorGUILayout.EndHorizontal();
			        	
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space);
		EditorGUILayout.LabelField("Terrain Scene Name",GUILayout.Width(160));
		script.terrain_scene_name = EditorGUILayout.TextField(script.terrain_scene_name);
		EditorGUILayout.EndHorizontal();
			        	
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space);
		EditorGUILayout.LabelField("Scene Parent",GUILayout.Width(160));
		if (draw_from == 0)
		{
			script.terrain_parent = EditorGUILayout.ObjectField(script.terrain_parent,Transform,true);
		}
		else
		{
			script.terrain_slice_parent = EditorGUILayout.ObjectField(script.terrain_slice_parent,Transform,true);
		}
		
		if (GUILayout.Button("Create",GUILayout.Width(64)))
		{
			create_terrain_scene_parent(draw_from);
		}
		EditorGUILayout.EndHorizontal();
	}
	
	function draw_prelayer(prelayer: prelayer_class,prelayer_number: int,space: int,text: String,layer_minimum: int)
	{
        gui_changed_old2 = GUI.changed;
        gui_changed_window = GUI.changed; GUI.changed = false;
        current_prelayer_number = prelayer.index;
	    
	    prelayer.interface_display_layergroup = prelayer.interface_display_layer;
	    
	    // prelayer
        if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_layer;}
        EditorGUILayout.BeginHorizontal();
        GUILayout.Space(space);
        if (prelayer.index > 0){text = "Object Layer Level "+prelayer_number+" ("+prelayer.layer.Count.ToString()+")";} else {text = "Layer Level "+prelayer_number+" ("+prelayer.layer.Count.ToString()+")";}
        if (script.show_prelayer > 0)
        {
        	for (var count_level: int = 0;count_level < prelayer.level;++count_level){text = text.Insert(0,"<");}
        }
        
        gui_changed_old = GUI.changed;
        prelayer.foldout = EditorGUILayout.Foldout (prelayer.foldout,text);//text+prelayer.layer_text);
        GUI.changed = gui_changed_old;
        
        if (key.type == EventType.Repaint)
		{
			prelayer.menuRect = GUILayoutUtility.GetLastRect();
			prelayer.menuRect.width = (text.Length*7)-15;
			prelayer.menuRect.x += 16;
			prelayer.menuRect.y += script.settings.top_height;
			if (script.settings.top_height > 0) prelayer.menuRect.y += 3;
		}
        
        if (check_point_in_rect(prelayer.menuRect,mouse_position - Vector2(-5,0)) && key.type == EventType.layout)
		{
			if (key.button == 1) {
				menu_prelayer_number = current_prelayer_number;
				// menu_description_number = current_description_number;
				// menu_layer_number = current_layer_number;
				var layerlevel_menu1: GenericMenu;
    	 		var layerlevel_menu_data: menu_arguments_class[] = new menu_arguments_class[3];
    	 		      	 		
    	 		layerlevel_menu1 = new GenericMenu ();    
    	 		layerlevel_menu1.AddItem (new GUIContent("Fold Out Layers"),false,layerlevel_menu,"fold_out");    
    	        layerlevel_menu1.AddItem (new GUIContent("Fold In Layers"),false,layerlevel_menu,"fold_in");    
    	        layerlevel_menu1.AddSeparator (""); 
    	        layerlevel_menu1.AddItem (new GUIContent("Interface Buttons"),prelayer.interface_display_layer,layerlevel_menu,"interface_buttons");    
    	        
    	 		prelayer.menuRect.y += 2;	 
    	 		layerlevel_menu1.DropDown (prelayer.menuRect);
    	 	}
    	}
        
        EditorGUILayout.EndHorizontal();
        
	    if (prelayer.foldout)
	    {
	        EditorGUILayout.BeginHorizontal();
	        GUILayout.Space(space+15);
	        if (global_script.settings.tooltip_mode != 0)
			{
				tooltip_text = "Add a new Layer\n(Click)\n\nDuplicate this Layer\n(Shift Click)";
			}
	      	if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
	      	{
	      		var layer_position: int = script.get_layer_position(prelayer.predescription.description[prelayer.predescription.description_position].layer_index.Count-1,prelayer.predescription.description_position,prelayer);
	      		add_layer(prelayer,layer_position,prelayer.predescription.description_position,prelayer.predescription.description[prelayer.predescription.description_position].layer_index.Count,true);
	      	}
	      	if (global_script.settings.tooltip_mode != 0)
			{
				tooltip_text = "Erase the last Layer\n\n(Control Click)";
			}
//        	if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)) && prelayer.layer.Count > 0)
//        	{
//        		if (key.control) {
//	        		if (script.description_display)
//	        		{
//	        			if (prelayer.predescription.description[prelayer.predescription.description_position].layer_index.Count > 0)
//	        			{
//	        				erase_layer(prelayer,prelayer.layer.Count-1,prelayer.predescription.description_position,prelayer.predescription.description[prelayer.predescription.description_position].layer_index.Count-1);
//	        				this.Repaint();
//	        				return;
//	        			}
//	        		}
//	        	}
//	        	else {
//					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
//				}
//	        }
        	gui_changed_old = GUI.changed;
        	gui_changed_window = GUI.changed; GUI.changed = false;
        	prelayer.layer_output = EditorGUILayout.EnumPopup("",prelayer.layer_output,GUILayout.Width(80));
        
        	if (GUI.changed)
        	{
        		if (prelayer.view_only_selected || global_script.settings.view_only_output){script.set_view_only_selected(prelayer,prelayer.layer_output,true);}
        		if (global_script.settings.view_only_output){
        			script.set_output(prelayer.layer_output);	
        		}
        	}
        	GUI.changed = gui_changed_old;
        	if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_description;}
        	prelayer.predescription.description_position = EditorGUILayout.Popup(prelayer.predescription.description_position,prelayer.predescription.description_enum,GUILayout.Width((prelayer.predescription.description_enum[prelayer.predescription.description_position].Length*10.0)+10));
        	if (global_script.settings.tooltip_mode != 0)
			{
				tooltip_text = "Display Layer Menu (Click)\n\nTo view another ObjectLayer Level -> Enter the ObjectLayer Level number in the number field or (Shift Click) on this button at the ObjectLayer\n\n(Shift Click again to return to Layer Level 0)";
			}
			if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_layer;}
        	
        	var button_view: boolean;
        	
        	if (script.prelayers.Count > 1) {
        		button_view = GUILayout.Button(GUIContent("→View",tooltip_text),GUILayout.Width(50));
        	}
        	else {
        		button_view = GUILayout.Button(GUIContent("View",tooltip_text),GUILayout.Width(50));
        	}
			
	        if (key.type == EventType.Repaint) 
			{
        		prelayer.view_menu_rect = GUILayoutUtility.GetLastRect();
        	}
        
            if (button_view)
        	{
        		if (key.shift)
        		{
        			if (prelayer.index == script.show_prelayer){script.show_prelayer = 0;}
        			else {script.show_prelayer = prelayer.index;}
        		}
        		else
        		{
	        		var userdata1: menu_arguments_class[] = new menu_arguments_class[8];
	        	 	var menu: GenericMenu;
	        	 		
	        		userdata1[0] = new menu_arguments_class();
	        		userdata1[0].name = "view_heightmap_layer";
	        		userdata1[0].prelayer = prelayer;
	        		userdata1[1] = new menu_arguments_class();
	        		userdata1[1].name = "view_color_layer";
	        		userdata1[1].prelayer = prelayer;
	        		userdata1[2] = new menu_arguments_class();
	        		userdata1[2].name = "view_splat_layer";
	        		userdata1[2].prelayer = prelayer;
	        		userdata1[3] = new menu_arguments_class();
	        		userdata1[3].name = "view_tree_layer";
	        		userdata1[3].prelayer = prelayer;
	        		userdata1[4] = new menu_arguments_class();
	        		userdata1[4].name = "view_grass_layer";
	        		userdata1[4].prelayer = prelayer;
	        		userdata1[5] = new menu_arguments_class();
	        		userdata1[5].name = "view_object_layer";
	        		userdata1[5].prelayer = prelayer;
	        		userdata1[6] = new menu_arguments_class();
	        		userdata1[6].name = "view_only_selected";
	        		userdata1[6].prelayer = prelayer;
	        		userdata1[7] = new menu_arguments_class();
	        		userdata1[7].name = "view_all";
	        		userdata1[7].prelayer = prelayer;
	        			
	        	 	menu = new GenericMenu (); 
	        	
	        		menu.AddItem (new GUIContent("Heigthmap"),prelayer.view_heightmap_layer, view_menu, userdata1[0]);                
	        	 	menu.AddItem (new GUIContent("Color"),prelayer.view_color_layer, view_menu, userdata1[1]);                
	        	 	menu.AddItem (new GUIContent("Splat"),prelayer.view_splat_layer, view_menu, userdata1[2]);                
	        	 	menu.AddItem (new GUIContent("Tree"),prelayer.view_tree_layer, view_menu, userdata1[3]);                
	        	 	menu.AddItem (new GUIContent("Grass"),prelayer.view_grass_layer, view_menu, userdata1[4]);                
	        	 	menu.AddItem (new GUIContent("Object"),prelayer.view_object_layer, view_menu, userdata1[5]);                
	        	 	menu.AddSeparator (""); 
	        	 	menu.AddItem (new GUIContent("Only Selected"),prelayer.view_only_selected, view_menu, userdata1[6]);                              
	        	 	menu.AddItem (new GUIContent("All"),false, view_menu, userdata1[7]);
	        	 	
	        	 	menu.DropDown (prelayer.view_menu_rect);
	        	 }
        	}
        	
        	if (script.show_prelayer < 0){script.show_prelayer = 0;}
			if (script.show_prelayer > script.prelayers.Count-1){script.show_prelayer = script.prelayers.Count-1;}        	
        	
        	if (script.prelayers.Count > 1) {
	        	if (prelayer.index == script.show_prelayer)
	        	{
	        		script.show_prelayer = EditorGUILayout.IntField(script.show_prelayer,GUILayout.Width(45));        	
				}
			}
//        	if (global_script.settings.tooltip_mode != 0)
//			{
//				tooltip_text = "Sort all Layers in the next order:\n\n1. Heightmap\n2. Colormap\n3. Splatmap\n4. Tree\n5. Grass/Detail\n6. Object\n\n(Shift Click)";
//			}
//			if (GUILayout.Button(GUIContent("<Sort>",tooltip_text),GUILayout.Width(55)))
//        	{
//        		if (key.shift) {
//        			UndoRegister("Sort Layers");
//        			script.layers_sort(prelayer);	
//        		}
//        		else {
//					this.ShowNotification(GUIContent("Shift click <Sort> to sort all layers in the next order:\n\n1. Heightmap\n2. Colormap\n3. Splatmap\n4. Tree\n5. Grass/Detail\n6. Object"));
//				}
//        	}
//        	if (global_script.settings.tooltip_mode != 0)
//			{
//				tooltip_text = "Fold/Unfold all Layers\n(Click)\n\nInvert Foldout all layers\n(Shift Click)\n\nClose every Foldout\n(Alt Click)";
//			}
//        	if (GUILayout.Button(GUIContent("F",tooltip_text),GUILayout.Width(20)))
//        	{
//        		if (!key.alt){prelayer.layers_foldout = !prelayer.layers_foldout;prelayer.change_foldout_layers(key.shift);}
//        		else
//        		{
//        			script.loop_prelayer("(caf)",0,true);
//        		}
//        	}
			EditorGUILayout.LabelField("");
        	if (global_script.settings.tooltip_mode != 0)
			{
				tooltip_text = "Activate/Deactivate all Layers\n(Click)\n\nInvert Activation all layers\n(Shift Click)";
			}
        	if (GUILayout.Button(GUIContent("A",tooltip_text),GUILayout.Width(20))){prelayer.layers_active = !prelayer.layers_active;prelayer.change_layers_active(key.shift);}
        	GUILayout.Space(163);
        	if (global_script.settings.tooltip_mode != 0)
			{
				tooltip_text = "Display/Hide Layer Interface Buttons\n(Click)\n\nDisplay/Hide LayerGroup Interface Buttons\n(Shift Click)";
			}
//        	if (GUILayout.Button(GUIContent("»I",tooltip_text),GUILayout.Width(25)))
//        	{
//        		prelayer.interface_display_layer = !prelayer.interface_display_layer;
//        		prelayer.interface_display_layergroup = prelayer.interface_display_layer;
//        	}
        	EditorGUILayout.EndHorizontal();
        	
        	if (global_script.settings.video_help)
		    {
			    EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+15);
				GUI.backgroundColor = Color(0.3,0.7,1);
				GUI.color = Color.white;
				if (GUILayout.Button("Help Video LayerLevel",EditorStyles.miniButtonMid,GUILayout.Width(153)))
				{
					Application.OpenURL("http://www.youtube.com/watch?v=mHhBPY0pvwM");		
				}
				GUI.backgroundColor = Color.white;
				if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_layer;}
				EditorGUILayout.EndHorizontal();
			}
        	
        	if (script.settings.remarks)
        	{
        		GUI.color = Color.white;
        		draw_remarks(prelayer.remarks,space+15);
        		if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_layer;}
        	}
        	
        	if (prelayer.index > 0) {
	        	if (!prelayer.prearea.active){GUI.color += Color(-0.3,-0.3,-0.3,0);}
	        	draw_area(prelayer.index,prelayer.prearea,script.terrains[0],space-15,true);
	        	if (!prelayer.prearea.active){GUI.color += Color(0.3,0.3,0.3,0);}
	        }
        	
        	GUILayout.Space(2);
        	for (count_description = 0;count_description < prelayer.predescription.description.Count;++count_description)
	        {
	        	if (script.description_display)
        		{
	        		EditorGUILayout.BeginHorizontal();
	        		GUILayout.Space(space+15);
	        		if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_description;}
	        		
	        		if (prelayer.predescription.description[count_description].text.Length == 0) {
	        			prelayer.predescription.description[count_description].text = "LayerGroup "+count_description.ToString();
	        			prelayer.predescription.set_description_enum();
	        		}
	        		var text1: String = prelayer.predescription.description[count_description].text+" ("+prelayer.predescription.description[count_description].layer_index.Count+")";
	        		gui_changed_old = GUI.changed;
	        		prelayer.predescription.description[count_description].foldout = EditorGUILayout.Foldout(prelayer.predescription.description[count_description].foldout,text1);
	        		GUI.changed = gui_changed_old;
	        		
	        		if (key.type == EventType.Repaint)
	        		{
	        			prelayer.predescription.description[count_description].rect = GUILayoutUtility.GetLastRect();
	        			prelayer.predescription.description[count_description].rect.width = (text1.Length*7)-15;
	        			prelayer.predescription.description[count_description].rect.x += 14;
	        			prelayer.predescription.description[count_description].rect.y += script.settings.top_height;
	        			if (script.settings.top_height > 0) prelayer.predescription.description[count_description].rect.y += 3;
	        		}
	        	
	        		if (check_point_in_rect(prelayer.predescription.description[count_description].rect,mouse_position - Vector2(-5,0)) && key.type == EventType.layout)
					{
						if (key.button == 0 && key.clickCount == 2) {
							prelayer.predescription.description[count_description].edit = !prelayer.predescription.description[count_description].edit;
							this.Repaint();
						}
						else {
							if (key.button == 1) {
								menu_prelayer_number = current_prelayer_number;
								menu_description_number = current_description_number;
								menu_layer_number = current_layer_number;
								var description_menu1: GenericMenu;
			        	 		var description_menu_data: menu_arguments_class[] = new menu_arguments_class[3];
			        	 		      	 		
			        	 		description_menu1 = new GenericMenu ();    
			        	 		current_description_number = count_description;                            
			        	 		description_menu1.AddItem (new GUIContent("File/New"),false,description_menu,"new");                
			        	 		description_menu1.AddSeparator ("File/"); 
			        	 		description_menu1.AddItem (new GUIContent("File/Open"),false,description_menu,"open");                
			        	        description_menu1.AddItem (new GUIContent("File/Save"),false,description_menu,"save");    
	//		        	        description_menu1.AddSeparator (""); 
	//		        	        description_menu1.AddItem (new GUIContent("Activate Layers"),false,description_menu,"activate");    
	//		        	        description_menu1.AddItem (new GUIContent("Deactivate Layers"),false,description_menu,"deactivate");    
			        	        description_menu1.AddSeparator (""); 
			        	 		description_menu1.AddItem (new GUIContent("Fold Out Layers"),false,description_menu,"fold_out");    
			        	        description_menu1.AddItem (new GUIContent("Fold In Layers"),false,description_menu,"fold_in");    
			        	        
			        	        // description_menu1.AddSeparator (""); 
			        	        // description_menu1.AddItem (new GUIContent("Sort Layers"),false,description_menu,"sort");
			        	 		
			        	 		prelayer.predescription.description[count_description].rect.y += 2;	 
			        	 		description_menu1.DropDown (prelayer.predescription.description[count_description].rect);
			        	 	}
		        		}	
					}
					if (prelayer.interface_display_layergroup)
					{
						GUILayout.Space(50);
//						if (global_script.settings.tooltip_mode != 0)
//						{
//							tooltip_text = "Edit LayerGroup name\n\n(You can change LayerGroup names for better overview)";
//						}
//						if (GUILayout.Button(GUIContent("E",tooltip_text),GUILayout.Width(25))){prelayer.predescription.description[count_description].edit = !prelayer.predescription.description[count_description].edit;}
//						if (global_script.settings.tooltip_mode != 0)
//						{
//							tooltip_text = "LayerGroup Popup Menu for New/Load/Save and Sorting Layers";
//						}
						// var button_description: boolean = GUILayout.Button(GUIContent("Menu",tooltip_text),GUILayout.Width(55));
//			        	if (key.type == EventType.Repaint) 
//						{
//		        	 		prelayer.predescription.description[count_description].menu_rect = GUILayoutUtility.GetLastRect();
//		        	 	}
		        	 	
//		        	 	if (global_script.settings.tooltip_mode != 0)
//						{
//							tooltip_text = "Fold/Unfold Layers from this LayerGroup\n(Click)\n\nInvert Foldout Layers from this LayerGroup(Shift Click)";
//						}
//						if (GUILayout.Button(GUIContent("F",tooltip_text),GUILayout.Width(20)))	
//		        		{
//		        			prelayer.predescription.description[count_description].layers_foldout = !prelayer.predescription.description[count_description].layers_foldout;
//							prelayer.change_layers_foldout_from_description(count_description,key.shift);
//		        		}
						if (global_script.settings.toggle_text_no){GUILayout.Space(0);} 
						else 
						{
							if (global_script.settings.toggle_text_long){GUILayout.Space(34);} else {GUILayout.Space(12);}
						}
					}
					if (global_script.settings.tooltip_mode != 0)
					{
						tooltip_text = "Activate/Deactive Layers from this LayerGroup\n(Click)\n\nInvert Activation Layers from this LayerGroup\n(Shift Click)";
					}
		        	if (GUILayout.Button(GUIContent("A",tooltip_text),GUILayout.Width(20)))	
		        	{
		        		prelayer.predescription.description[count_description].layers_active = !prelayer.predescription.description[count_description].layers_active;
						prelayer.change_layers_active_from_description(count_description,key.shift,script.heightmap_output,script.color_output,script.splat_output,script.tree_output,script.grass_output,script.object_output);
		        	}
		        	GUILayout.Space(8);
		        		
		        	if (prelayer.interface_display_layergroup)
					{
						if (prelayer.predescription.description.Count > 1) {
			        		if (count_description > 0) {
				        		if (global_script.settings.tooltip_mode != 0)
								{
									tooltip_text = "Move LayerGroup up";
								}
				        		if (GUILayout.Button(GUIContent("▲",tooltip_text),GUILayout.Width(25))){script.swap_description(count_description,count_description-1,prelayer);}	
				        	}
				        	else {
				        		GUILayout.Space(29);
				        	}
				        	if (count_description < prelayer.predescription.description.Count-1) {
				        		if (global_script.settings.tooltip_mode != 0)
								{
									tooltip_text = "Move LayerGroup down";
								} 		 
					           	if (GUILayout.Button(GUIContent("▼",tooltip_text),GUILayout.Width(25))){script.swap_description(count_description,count_description+1,prelayer);}		 
					        }
					        else {
					        	GUILayout.Space(29);
					        }
				        }
				        else {
				        	GUILayout.Space(58);
				        }
		        		
		        		
		        		if (global_script.settings.tooltip_mode != 0)
						{
							tooltip_text = "Swap Selector -> Click to swap with another LayerGroup\n\n(Alt Click)To copy this LayerGroup\n(Alt Click -> '+' on LayerGroup)To paste";
						}	 
			           	if (GUILayout.Button(GUIContent(prelayer.predescription.description[count_description].swap_text,tooltip_text),GUILayout.Width(35)))
			           	{
			           		swap_description(prelayer,prelayer.predescription.description[count_description],count_description);
					   	}
					   	
			            if (global_script.settings.tooltip_mode != 0)
						{
							tooltip_text = "Add a new LayerGroup\n(Click)\n\nDuplicate this LayerGroup\n(Shift Click)";
						}
			            if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
			            {
			            	add_description(prelayer,count_description);
			            }
			            if (global_script.settings.tooltip_mode != 0)
						{
							tooltip_text = "Erase this LayerGroup\n\n(Control Click)";
						} 	
			        	if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)))
			        	{
			        		if (key.control) {
			        			if ( prelayer.predescription.description.Count > 1) {
			        				erase_description(prelayer,count_description);
			        				this.Repaint();
			        				return;
			        			}
			        			else {
			        				this.ShowNotification(GUIContent("There must always be 1 LayerGroup"));
			        			}
			        		}
			        		else {
								this.ShowNotification(GUIContent("Control click the '-' button to erase"));
							}
			        	}
			        }
			        
			        if (prelayer.predescription.description[count_description].disable_edit && key.type == EventType.Layout)
			        {
			        	prelayer.predescription.description[count_description].edit = false;
			        	prelayer.predescription.description[count_description].disable_edit = false;
			        }
	        		EditorGUILayout.EndHorizontal();
	        		
	        		GUILayout.Space(2);
	        		
	        		if (prelayer.predescription.description[count_description].edit)
	        		{
	        			EditorGUILayout.BeginHorizontal();
	        			GUILayout.Space(space+30);
	        			
	        			gui_changed_old = GUI.changed;
	        			gui_changed_window = GUI.changed; 
	        			GUI.changed = false;
	        			GUI.SetNextControlName ("des"+count_description);
	        			prelayer.predescription.description[count_description].text = EditorGUILayout.TextField(prelayer.predescription.description[count_description].text);
	        			if (key.keyCode == KeyCode.Return && GUI.GetNameOfFocusedControl() == "des"+count_description)
	        			{
	        				prelayer.predescription.description[count_description].disable_edit = true;
	        				prelayer.predescription.set_description_enum();
	        			}
	        			if (GUI.changed)
	        			{
	        				prelayer.predescription.set_description_enum();
	        			}
	        			EditorGUILayout.EndHorizontal();
		    	
	        			GUI.changed = gui_changed_old;
	        		}
	        		
	        		if (new_description)
				    {
				       	if (count_description == new_description_number)
				       	{
					       	EditorGUILayout.BeginHorizontal();
					       	GUILayout.Space(space+30);
					       	EditorGUILayout.LabelField("All layer content of this Group will be lost. Are you sure?",EditorStyles.boldLabel,GUILayout.Width(389));
					       	if (GUILayout.Button("Yes",GUILayout.Width(40)))
					       	{	
					       		UndoRegister("New LayerGroup");
					       		script.new_layergroup(prelayer,count_description);
					       		new_description = false;
					       	}
					       	if (GUILayout.Button("No",GUILayout.Width(40)))
					       	{
					       		new_description = false;
					       	}	
					       	EditorGUILayout.EndHorizontal();
					    }
				    }
				}
		        
	        	if (prelayer.predescription.description[count_description].foldout || !script.description_display)
	        	{
	        		if (global_script.settings.color_scheme){GUI.color = Color.white;}
	        		if (script.settings.remarks)
	        		{
	        			draw_remarks(prelayer.predescription.description[count_description].remarks,33);
	        		}
	        		for (var count_layer: int = 0;count_layer < prelayer.predescription.description[count_description].layer_index.Count;++count_layer)
	        		{
	        			current_layer_number = count_layer;
	        			draw_layer(prelayer,prelayer.predescription.description[count_description].layer_index[count_layer],count_layer,count_description,space+15,String.Empty,layer_minimum);
	        			if (GUI.changed){generate_auto();GUI.changed = false;}
	        		}
	        		if (script.description_display && prelayer.predescription.description[count_description].layer_index.Count > 0){GUILayout.Space(5);}
	        	}
			}   	                 	                
	    } 
	    if (global_script.settings.color_scheme){GUI.color = Color.white;}
	    
		GUI.changed = gui_changed_old2;
	}
	
	function draw_remarks(remarks: remarks_class,space: float)
	{
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space);
		gui_changed_old = GUI.changed;
		remarks.textfield_foldout = EditorGUILayout.Foldout(remarks.textfield_foldout,"Remarks");
		GUI.changed = gui_changed_old;
		EditorGUILayout.EndHorizontal();
			           	
		if (remarks.textfield_foldout)
		{
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+15);
			
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			remarks.textfield = EditorGUILayout.TextArea(remarks.textfield,GUILayout.Height(5+(remarks.textfield_length*13.1)));
			if (GUI.changed)
			{
				remarks.textfield_length = remarks.textfield.Split("\n"[0]).Length;
			}
			GUI.changed = gui_changed_old;
			
			EditorGUILayout.EndHorizontal();
		}
	}

	function draw_layer(prelayer: prelayer_class,layer_number: int,count_layer: int,count_description: int,space: int,text: String,layer_minimum: int)
	{
		current_layer = prelayer.layer[layer_number];
		
	    if((current_layer.output == layer_output_enum.color && prelayer.view_color_layer) 
	    	|| (current_layer.output == layer_output_enum.splat && prelayer.view_splat_layer)
	    		|| (current_layer.output == layer_output_enum.tree && prelayer.view_tree_layer)
	    			|| (current_layer.output == layer_output_enum.grass && prelayer.view_grass_layer)
	    				|| (current_layer.output == layer_output_enum.object && prelayer.view_object_layer)
	       					 || (current_layer.output == layer_output_enum.heightmap && prelayer.view_heightmap_layer))
	    {
	    	color_layer = global_script.settings.color.color_layer;
	        
	        if (!current_layer.active){color_layer += Color(-0.3,-0.3,-0.3,0);} 
	        	
	        if (current_layer.color_layer != color_layer)
		    {
		    	if (current_layer.color_layer[0] > color_layer[0]){current_layer.color_layer[0] -= 0.004;} 
		        	else if (current_layer.color_layer[0]+0.01 < color_layer[0]){current_layer.color_layer[0] += 0.004;}	
		        		else {current_layer.color_layer[0] = color_layer[0];}
		        if (current_layer.color_layer[1] > color_layer[1]){current_layer.color_layer[1] -= 0.004;} 
		        	else if (current_layer.color_layer[1]+0.01 < color_layer[1]){current_layer.color_layer[1] += 0.004;}
		           		else {current_layer.color_layer[1] = color_layer[1];}
				if (current_layer.color_layer[2] > color_layer[2]){current_layer.color_layer[2] -= 0.004;} 
					else if (current_layer.color_layer[2]+0.01 < color_layer[2]){current_layer.color_layer[2] += 0.004;}
						else {current_layer.color_layer[2] = color_layer[2];}
				if (current_layer.color_layer[3] > color_layer[3]){current_layer.color_layer[3] -= 0.004;} 
					else if (current_layer.color_layer[3]+0.01 < color_layer[3]){current_layer.color_layer[3] += 0.004;}
						else {current_layer.color_layer[3] = color_layer[3];}
		        this.Repaint();
			}
			
		    if (global_script.settings.color_scheme){GUI.color = current_layer.color_layer;} else {GUI.color = Color.white;}
	        
	        if (script.settings.box_scheme){GUILayout.BeginVertical("Box");}
	        	
	        EditorGUILayout.BeginHorizontal();
	        GUILayout.Space(space+15); 
	        
	        if (current_layer.text == String.Empty){text += "Layer "+layer_number;} 
	        else 
	        {
	        	text = current_layer.text;
	        	
	        	var display_number: int = text.IndexOf("#n");
	        	if (display_number != -1){text = text.Replace("#n",""+layer_number);}
	        }
	        
	        text += " ("+current_layer.output+") ";
	        
	        if (current_layer.output == layer_output_enum.tree) {
	        	text += "(P "+current_layer.tree_output.placed.ToString()+")";
	        }
	        else if (current_layer.output == layer_output_enum.object) {
	        	text += "(P "+current_layer.object_output.placed.ToString()+")";
	        }
	  
	        // layer text
	        gui_changed_old = GUI.changed;
	        current_layer.foldout = EditorGUILayout.Foldout(current_layer.foldout,text); 
	        GUI.changed = gui_changed_old;
	        if (key.type == EventType.Repaint)
	        {
	        	current_layer.rect = GUILayoutUtility.GetLastRect();
	        	current_layer.rect.width = (text.Length*7)-15;
	        	current_layer.rect.x += 14;
	        	current_layer.rect.y += script.settings.top_height;
	        	if (script.settings.top_height > 0) current_layer.rect.y += 3;
	        }
	        if (check_point_in_rect(current_layer.rect,mouse_position - Vector2(-5,0)) && key.type == EventType.layout)
			{
				if (key.clickCount == 2 && key.button == 0) {
					current_layer.edit = !current_layer.edit;
					this.Repaint();
				}
				else {
					if (key.button == 1)
		        	{
		        		menu_prelayer_number = current_prelayer_number;
		        		menu_predescription_number = current_description_number;
		        		menu_layer_number = layer_number;
		        				         		
		         		var menu: GenericMenu;
		         		var userdata: menu_arguments_class[] = new menu_arguments_class[prelayer.predescription.description.Count];
		         		var userdata1: menu_arguments_class[] = new menu_arguments_class[3];
		         		
		         		userdata1[0] = new menu_arguments_class();
		         		userdata1[0].name = "new";
		         		userdata1[1] = new menu_arguments_class();
		         		userdata1[1].name = "open";
		         		userdata1[2] = new menu_arguments_class();
		         		userdata1[2].name = "save";
		         		
		         		menu = new GenericMenu ();                                
		         		if (Application.platform == RuntimePlatform.OSXEditor)
		         		{
			       	 		menu.AddItem (new GUIContent ("New"), false, layer_menu, userdata1[0]);                
			       	 		menu.AddSeparator (""); 
			       	 		menu.AddItem (new GUIContent ("Open"), false, layer_menu, userdata1[1]);                
			       	               
			       	 		menu.AddItem (new GUIContent ("Save"), false, layer_menu, userdata1[2]);                                
			       	 	}
			       	 	else
			       	 	{
			       	 		menu.AddItem (new GUIContent ("File/New"), false, layer_menu, userdata1[0]);                
			       	 		menu.AddSeparator ("File/"); 
			       	 		menu.AddItem (new GUIContent ("File/Open"), false, layer_menu, userdata1[1]);                
			       	               
			       	 		menu.AddItem (new GUIContent ("File/Save"), false, layer_menu, userdata1[2]);
			       	 	}
		         		menu.AddSeparator (""); 
		         		
		         		for (var count_description1: int = 0;count_description1 < prelayer.predescription.description.Count;++count_description1)
		         		{
		         			userdata[count_description1] = new menu_arguments_class();
		         			userdata[count_description1].number0 = count_description;
		         			userdata[count_description1].number1 = count_description1;
		         			userdata[count_description1].name = "parent";
		         			userdata[count_description1].prelayer = prelayer;
		         			userdata[count_description1].number2 = count_layer;
		         			if (Application.platform == RuntimePlatform.OSXEditor)
		         			{
		         				menu.AddItem (new GUIContent("Parent -> "+prelayer.predescription.description[count_description1].text),false,layer_menu,userdata[count_description1]);	
		         			}
		         			else
		         			{
		         				menu.AddItem (new GUIContent("Parent/"+prelayer.predescription.description[count_description1].text),false,layer_menu,userdata[count_description1]);
		         			}
		         		}
		         		current_layer.rect.y += 2;	
		         		menu.DropDown (current_layer.rect);
		        	}
		        }
			}
			if (prelayer.interface_display_layer)
			{
//				if (global_script.settings.tooltip_mode != 0)
//				{
//					tooltip_text = "Edit Layer name\n\nYou can change Layer names for better overview\nTo display the number type '#n'";
//				}
//				if (GUILayout.Button(GUIContent("E",tooltip_text),GUILayout.Width(25))){current_layer.edit = !current_layer.edit;}
//				if (global_script.settings.tooltip_mode != 0)
//				{
//					tooltip_text = "Layer Popup Menu for New/Load/Save and Moving the Layer to another LayerGroup";
//				} 
		       	// var button_layer: boolean = GUILayout.Button(GUIContent("Layer",tooltip_text),GUILayout.Width(55));
		       	
	           	if (global_script.settings.toggle_text_no){GUILayout.Space(27);} else {GUILayout.Space(7);}
		    }
		       		
		    if (!global_script.settings.toggle_text_no)
		    {
		    	if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
		    }
		    
		    gui_changed_old = GUI.changed;
		    gui_changed_window = GUI.changed; GUI.changed = false;
		    current_layer.active = EditorGUILayout.Toggle(current_layer.active,GUILayout.Width(25)); 
		    if (GUI.changed)
		    {
		    	gui_changed_old = true;
		    }
		    GUI.changed = gui_changed_old;
		        
		    if (prelayer.interface_display_layer)
			{
				if (layer_number > 0) {
					if (prelayer.layer[layer_number].output == prelayer.layer[layer_number-1].output) {
						if (global_script.settings.tooltip_mode != 0)
						{
							tooltip_text = "Move layer up";
						} 
				    	if (GUILayout.Button(GUIContent("▲",tooltip_text),GUILayout.Width(25)))
				    	{
				    		script.swap_layer(prelayer,layer_number,prelayer,layer_number-1,true);
				    		script.layers_sort(prelayer);
				    		generate_auto();
				    		this.Repaint();
				    		return;
				    	} 
				    }
				    else {
				    	GUILayout.Space(29);
				    }
			    }
			    else {
			    	GUILayout.Space(29);
			    }
			    if (layer_number < prelayer.layer.Count-1) {
			    	if (prelayer.layer[layer_number].output == prelayer.layer[layer_number+1].output) {
						if (global_script.settings.tooltip_mode != 0)
						{
							tooltip_text = "Move layer down";
						} 
				        if (GUILayout.Button(GUIContent("▼",tooltip_text),GUILayout.Width(25)))
				        {
				        	script.swap_layer(prelayer,layer_number,prelayer,layer_number+1,true);
				        	script.layers_sort(prelayer);
				        	generate_auto();
				        	this.Repaint();
				        	return;
				        }
				    }
				    else {
				    	GUILayout.Space(29);
				    }
			    }
			    else {
			    	GUILayout.Space(29);
			    }
		        
		    	if (global_script.settings.tooltip_mode != 0)
				{
					tooltip_text = "Swap Selector -> Click to swap with another Layer\n\n(Alt Click)To copy this Layer\n(Alt Click -> '+' on Layer)To paste";
				}	 		 
		        if (GUILayout.Button(GUIContent(current_layer.swap_text,tooltip_text),GUILayout.Width(35)))
		        {
					swap_layer(current_layer,layer_number,prelayer);
					generate_auto();
					this.Repaint();
					return;
		        } 		
		         		 
		        if (global_script.settings.tooltip_mode != 0)
				{
					tooltip_text = "Add a new Layer\n(Click)\n\nDuplicate last Layer\n(Shift Click)";
				}
		        if (GUILayout.Button(GUIContent("+",tooltip_text),GUILayout.Width(25)))
		        {
		        	add_layer(prelayer,layer_number,count_description,count_layer+1,true);
		        	generate_auto();
		        } 	
		        if (global_script.settings.tooltip_mode != 0)
				{
					tooltip_text = "Erase this Layer\n\n(Control Click)";
				}
		        if (GUILayout.Button(GUIContent("-",tooltip_text),GUILayout.Width(25)) && prelayer.layer.Count > 0)
		        {
		        	if (key.control) {
			        	erase_layer(prelayer,layer_number,count_description,count_layer);
			        	generate_auto();
			        	this.Repaint();
			        	return;
			        }
			        else {
						this.ShowNotification(GUIContent("Control click the '-' button to erase"));
					}
		        }
		    }
	        	
	        if (current_layer.disable_edit && key.type == EventType.Layout)
		    {
		    	current_layer.edit = false;
		        current_layer.disable_edit = false;
		    }
	        			
	        EditorGUILayout.EndHorizontal();
	        	
	        if (current_layer.edit)
	        {
	        	GUILayout.Space(3);
	        	EditorGUILayout.BeginHorizontal();
	        	GUILayout.Space(space+30);
	        		
	        	gui_changed_old = GUI.changed;
	        	gui_changed_window = GUI.changed; GUI.changed = false;
	        	GUI.SetNextControlName ("la"+count_layer);
	        	current_layer.text = EditorGUILayout.TextField(current_layer.text);
	        	if (key.keyCode == KeyCode.Return  && GUI.GetNameOfFocusedControl() == "la"+count_layer)
	        	{
	        		current_layer.disable_edit = true;
	        	}
	        	if (GUI.changed)
	        	{
	        	
	        	}
	        	EditorGUILayout.EndHorizontal();
		    			
	        	GUI.changed = gui_changed_old;
	        }
	        	
	        if (global_script.settings.color_scheme){GUI.color = Color.white;}
	        
	        GUILayout.Space(2);
	        
	        if (current_layer.foldout)
	        {
	        	GUILayout.Space(5);
	           	
	           	if (global_script.settings.video_help)
			    {
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(30+space);
					GUI.backgroundColor = Color(0.3,0.7,1);
					if (current_layer.output == layer_output_enum.heightmap)
					{
						if (GUILayout.Button("Help Heightmap Layer -> 2 Videos",EditorStyles.miniButtonMid,GUILayout.Width(193)))
						{
						      	script.settings.help_heightmap_layer_foldout = !script.settings.help_heightmap_layer_foldout;
					    }
			        	
		        		if (script.settings.help_heightmap_layer_foldout)
		        		{
		        			EditorGUILayout.EndHorizontal();
		        			EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45+space);
			        		if (GUILayout.Button("Procedural Heightmap",EditorStyles.miniButtonMid,GUILayout.Width(153)))
				        	{
				        		Application.OpenURL("http://www.youtube.com/watch?v=8ZiT0GBjXXE");
				        	}
			        		EditorGUILayout.EndHorizontal();
			        		EditorGUILayout.BeginHorizontal();
			        		GUILayout.Space(45+space);
			        		if (GUILayout.Button("Import Heightmap",EditorStyles.miniButtonMid,GUILayout.Width(153)))
				        	{
				        		Application.OpenURL("http://www.youtube.com/watch?v=0zuCmpp66H8");
				        	}
			        	}	
					}
					/*
					else if (current_layer.output == layer_output_enum.color)
					{
						if (GUILayout.Button("Help Video Color Layer",EditorStyles.miniButtonMid,GUILayout.Width(173)))
						{
						      	
						}
					}
					else if (current_layer.output == layer_output_enum.splat)
					{
						if (GUILayout.Button("Help Video Splat Layer",EditorStyles.miniButtonMid,GUILayout.Width(173)))
						{
						      	
						}
					}
					*/
					else if (current_layer.output == layer_output_enum.tree)
					{
						if (GUILayout.Button("Help Video Tree Layer",EditorStyles.miniButtonMid,GUILayout.Width(173)))
						{
							Application.OpenURL("http://www.youtube.com/watch?v=y1fk7OoBbO4");      	
						}
					}
					else if (current_layer.output == layer_output_enum.grass)
					{
						if (GUILayout.Button("Help Video Grass Layer",EditorStyles.miniButtonMid,GUILayout.Width(173)))
						{
							Application.OpenURL("http://www.youtube.com/watch?v=VG42GJZ1m0E");
						}
					}
					/*
					else if (current_layer.output == layer_output_enum.object)
					{
						if (GUILayout.Button("Help Video Object Layer",EditorStyles.miniButtonMid,GUILayout.Width(173)))
						{
						      	
						}
					}
					*/ 
					GUI.backgroundColor = Color.white;
				    EditorGUILayout.EndHorizontal();
				}
			
	           	EditorGUILayout.BeginHorizontal();
	           	GUILayout.Space(space+30);
	           	gui_changed_old = GUI.changed;
	           	gui_changed_window = GUI.changed; GUI.changed = false;
	           	current_layer.output = EditorGUILayout.EnumPopup("Output",current_layer.output);
	           	if (GUI.changed)
	           	{
	           		gui_changed_old = true;
	           		if (current_layer.output == layer_output_enum.heightmap){script.disable_prefilter_select_mode(current_layer.prefilter);}
	           		current_layer.text_placed = String.Empty;
	           		script.count_layers();
	           		
	         		if (prelayer.view_only_selected || global_script.settings.view_only_output){script.set_view_only_selected(prelayer,current_layer.output,true);}
        			if (global_script.settings.view_only_output) script.set_output(current_layer.output);	
        		}
	           	GUI.changed = gui_changed_old;
	           	EditorGUILayout.EndHorizontal();
	           	
	           	// heightmap layer
	           	if (current_layer.output == layer_output_enum.heightmap || current_layer.output == layer_output_enum.color || current_layer.output == layer_output_enum.splat)
	           	{
//					if (script.terrains.Count > 1)
//					{
//						EditorGUILayout.BeginHorizontal();
//		           		GUILayout.Space(space+30);
//		           		EditorGUILayout.LabelField("Stitch Borders",GUILayout.Width(147));
//		           		if (!current_layer.height_output){current_layer.height_output = new height_output_class();}
//		           		EditorGUILayout.EndHorizontal();
//		           	}
		           		
	           		if (current_layer.output == layer_output_enum.heightmap)
	           		{
		           		EditorGUILayout.BeginHorizontal();
			           	GUILayout.Space(space+30);
			           	EditorGUILayout.LabelField("Smooth",GUILayout.Width(147));
			           	current_layer.smooth = EditorGUILayout.Toggle(current_layer.smooth,GUILayout.Width(25));  
			           	EditorGUILayout.EndHorizontal();
			       }
				}
	           	if (current_layer.output == layer_output_enum.color)
	           	{
	           		if (script.settings.remarks){draw_remarks(current_layer.remarks,space+30);}
	           	}
	           	else if (current_layer.output == layer_output_enum.splat)
		        {
		        	EditorGUILayout.BeginHorizontal();
	           			GUILayout.Space(space+30);
	           			gui_changed_old = GUI.changed;
	           			GUI.changed = false;
		           		current_layer.splat_output.splat_value.mode = EditorGUILayout.EnumPopup("Slider Mode",current_layer.splat_output.splat_value.mode,GUILayout.Width(300));
		           		if (GUI.changed) {
		           			current_layer.splat_output.splat_value.calc_value();
		           			gui_changed_old = true;
		           		}
		           		GUI.changed = gui_changed_old;
		           	EditorGUILayout.EndHorizontal();
		           	
		        	EditorGUILayout.BeginHorizontal();
	           		GUILayout.Space(space+30);
		           	current_layer.splat_output.mix_mode = EditorGUILayout.EnumPopup("Mix Mode",current_layer.splat_output.mix_mode,GUILayout.Width(300));
		           	EditorGUILayout.EndHorizontal();
		           	
		           	if (script.settings.remarks)
		           	{
						draw_remarks(current_layer.remarks,space+30);
				    }
		        }
		        else if (current_layer.output == layer_output_enum.tree)
		        {
		        	EditorGUILayout.BeginHorizontal();
	           			GUILayout.Space(space+30);
		           		current_layer.tree_output.tree_value.mode = EditorGUILayout.EnumPopup("Slider Mode",current_layer.tree_output.tree_value.mode,GUILayout.Width(300));
		           	EditorGUILayout.EndHorizontal();
		           	
					var tree_output_text: String;
		           	if (script.masterTerrain.terrain)
		           	{
		           		if (script.masterTerrain.terrain.terrainData.treePrototypes.Length == 0)
			           	{
			           		tree_output_text = " (No trees defined)";
		        		}
		        	}
		           	if (script.settings.remarks){draw_remarks(current_layer.remarks,space+30);}		
		        }
		        else if (current_layer.output == layer_output_enum.grass)
			    {
			    	EditorGUILayout.BeginHorizontal();
	           			GUILayout.Space(space+30);
		           		current_layer.grass_output.grass_value.mode = EditorGUILayout.EnumPopup("Slider Mode",current_layer.grass_output.grass_value.mode,GUILayout.Width(300));
		           	EditorGUILayout.EndHorizontal();
		           	   
			        EditorGUILayout.BeginHorizontal();
		           	GUILayout.Space(space+30);
			        current_layer.grass_output.mix_mode = EditorGUILayout.EnumPopup("Mix Mode",current_layer.grass_output.mix_mode,GUILayout.Width(300));
			        EditorGUILayout.EndHorizontal();
			        
			        if (script.settings.remarks){draw_remarks(current_layer.remarks,space+30);}
		   		}
		   		else if (current_layer.output == layer_output_enum.object) {
		   			EditorGUILayout.BeginHorizontal();
	           			GUILayout.Space(space+30);
		           		current_layer.object_output.object_value.mode = EditorGUILayout.EnumPopup("Slider Mode",current_layer.object_output.object_value.mode,GUILayout.Width(300));
		           	EditorGUILayout.EndHorizontal();
		   		}
				if (current_layer.output == layer_output_enum.tree || current_layer.output == layer_output_enum.grass || current_layer.output == layer_output_enum.object) {
					EditorGUILayout.BeginHorizontal();
			           	GUILayout.Space(space+30);
			           	EditorGUILayout.LabelField("Position Seed",GUILayout.Width(147));
						current_layer.positionSeed = EditorGUILayout.Toggle(current_layer.positionSeed,GUILayout.Width(25));
					EditorGUILayout.EndHorizontal();
					
					EditorGUILayout.BeginHorizontal();
			           	GUILayout.Space(space+30);
			           	EditorGUILayout.LabelField("Prevent Overlap",GUILayout.Width(147));
						current_layer.nonOverlap = EditorGUILayout.Toggle(current_layer.nonOverlap,GUILayout.Width(25));
					EditorGUILayout.EndHorizontal();
				}
				
				if (current_layer.output == layer_output_enum.grass) {
					if (current_layer.strength*script.settings.grass_density < 1){GUI.backgroundColor = Color.red;}
				}
				
				//if (current_layer.output != layer_output_enum.color) {
					GUILayout.Space(3);
		            EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+30);
					EditorGUILayout.LabelField("Strength",GUILayout.Width(147));
					current_layer.strength = EditorGUILayout.Slider(current_layer.strength,0,1);
					EditorGUILayout.EndHorizontal();
				// }
				GUI.backgroundColor = Color.white;
				
				if (current_layer.output == layer_output_enum.tree) {
		            EditorGUILayout.BeginHorizontal(); 
		           	GUILayout.Space(space+30);
	        		EditorGUILayout.LabelField("Scale",GUILayout.Width(147));
	        		current_layer.tree_output.scale = EditorGUILayout.Slider(current_layer.tree_output.scale,0,30);
		            EditorGUILayout.EndHorizontal();
		        }
		        
		        if (current_layer.output == layer_output_enum.object) {
		        	GUILayout.Space(2);      		      			      		      			
	        		EditorGUILayout.BeginHorizontal(); 
	        		GUILayout.Space(space+30);
	    			EditorGUILayout.LabelField("Scale",GUILayout.Width(147));
	    			current_layer.object_output.scale = EditorGUILayout.Slider(current_layer.object_output.scale,0,30);
	        		EditorGUILayout.EndHorizontal();
		        }
	           	
	           	if (current_layer.output == layer_output_enum.heightmap) {if (script.settings.remarks){draw_remarks(current_layer.remarks,space+30);}}
				
				// colormap	layer     			           			
	           	if (current_layer.output == layer_output_enum.color)
	           	{
	           		var color_colormap: Color = global_script.settings.color.color_colormap;
	           		if (global_script.settings.color_scheme){GUI.color = color_colormap;}
	           		EditorGUILayout.BeginHorizontal();
	           		GUILayout.Space(space+30);
	           		gui_changed_old = GUI.changed;
	           		current_layer.color_output.foldout = EditorGUILayout.Foldout(current_layer.color_output.foldout,current_layer.color_output.color_text);  
	           		GUI.changed = gui_changed_old;
	           		EditorGUILayout.EndHorizontal();
	           		
					if (current_layer.color_output.foldout)
	           		{
	           			EditorGUILayout.BeginHorizontal(); 
	           			GUILayout.Space(space+45);
	           			if (GUILayout.Button("+",GUILayout.Width(25)))
	           			{
	           				current_layer.color_output.set_precolor_range_length(current_layer.color_output.precolor_range.Count+1);
	           				current_layer.color_output.precolor_range[current_layer.color_output.precolor_range.Count-1].one_color = true;
	           				generate_auto();
	           			}
        				if (GUILayout.Button("-",GUILayout.Width(25)) && current_layer.color_output.precolor_range.Count > 1)
        				{
        					if (key.control) {
        						UndoRegister("Erase ColorGroup");
        						current_layer.color_output.set_precolor_range_length(current_layer.color_output.precolor_range.Count-1);
		    					generate_auto();
		    				}
		    				else {
								this.ShowNotification(GUIContent("Control click the '-' button to erase"));
							}
    					} 
	           			EditorGUILayout.EndHorizontal();
	           			
	           			for (var count_precolor_range: int = 0;count_precolor_range < current_layer.color_output.precolor_range.Count;++count_precolor_range)
		           		{
			        		draw_precolor_range(current_layer.color_output.precolor_range[count_precolor_range],space+45,true,0,color_colormap,true,true,true,0);
		           		}
		           	}
		        }
		        
				// splat layer
				if (current_layer.output == layer_output_enum.splat)
		        {
		        	var color_splat: Color = global_script.settings.color.color_splat;
			        
		        	if (current_layer.splat_output.mix_mode == mix_mode_enum.Group && current_layer.splat_output.splat.Count > 0)
			        {
				    	if (global_script.settings.color_scheme){GUI.color = Color.green;}
				        EditorGUILayout.BeginHorizontal();
				        GUILayout.Space(space+30);
				        EditorGUILayout.LabelField("Mix rate",GUILayout.Width(147));
				        gui_changed_old = GUI.changed;
				        gui_changed_window = GUI.changed; GUI.changed = false;
				        current_layer.splat_output.mix[0] = EditorGUILayout.Slider(current_layer.splat_output.mix[0],0,10);
				        if (GUI.changed)
				        {
				        	gui_changed_old = true;
				        	current_layer.splat_output.set_splat_curve();
		           		}
		           		GUI.changed = gui_changed_old;
				        EditorGUILayout.EndHorizontal();
				        if (global_script.settings.color_scheme){GUI.color = color_splat;}
					}
					
		           	var splat_text: String;
		           	
		           	if (script.masterTerrain.splatPrototypes.Count == 0)
			        {
				    	splat_text = " --> Please assign splat textures to the ";
				        if (script.terrains.Count > 1){splat_text += "Terrains.";} else {splat_text += "Terrain.";}
				    }
				    
		           	if (global_script.settings.color_scheme){GUI.color = color_splat;}
		           	EditorGUILayout.BeginHorizontal();
	           		GUILayout.Space(space+30);
	           		gui_changed_old = GUI.changed;
	           		current_layer.splat_output.foldout = EditorGUILayout.Foldout(current_layer.splat_output.foldout,current_layer.splat_output.splat_text+splat_text);  
	           		GUI.changed = gui_changed_old;
	           		EditorGUILayout.EndHorizontal();

					// splat_foldout
	        		if (current_layer.splat_output.foldout)
	        		{
			        	EditorGUILayout.BeginHorizontal(); 
			           	GUILayout.Space(space+45);
			           	if (GUILayout.Button("+",GUILayout.Width(25)))
			           	{
			           		add_splat(current_layer.splat_output,current_layer.splat_output.splat.Count-1,key.shift);
			           		generate_auto();
			           	}
		        		if (GUILayout.Button("-",GUILayout.Width(25)) && current_layer.splat_output.splat.Count > 0)
		        		{
		        			if (key.control) {
			        			if (!key.shift)
			        			{
			        				UndoRegister("Erase Splat");
			        				current_layer.splat_output.erase_splat(current_layer.splat_output.splat.Count-1);
			        			}
			        			else
			        			{
			        				UndoRegister("Erase Splats");
			        				current_layer.splat_output.clear_splat();
			        			}
			        			generate_auto();
			        			this.Repaint();
			        			return;
			        		}
			        		else {
								this.ShowNotification(GUIContent("Control click the '-' button to erase"));
							}
		        		} 
		        		if (GUILayout.Button("F",GUILayout.Width(20))) current_layer.splat_output.FoldAllSplatCustom(key.shift);
		        		if (GUILayout.Button("R",GUILayout.Width(25))) {current_layer.splat_output.splat_value.reset_values();generate_auto();}
			        					
						EditorGUILayout.EndHorizontal();
				        
				       
					   	GUILayout.Space(5);
					    for (var count_splat: int = 0;count_splat < current_layer.splat_output.splat.Count;++count_splat)
	           			{
	           				if (global_script.settings.color_scheme)
	           				{
	           					if (!current_layer.splat_output.splat_value.active[count_splat]){color_splat += Color(-0.3,-0.3,-0.3,0);}
	           				 	GUI.color = color_splat;
	           				}
	           				EditorGUILayout.BeginHorizontal();
	           				GUILayout.Space(space+45); 
	           				if (current_layer.output.splat)
  				        	{				    		
								EditorGUILayout.BeginHorizontal();
						
								// splat text
								if (current_layer.splat_output.splat[count_splat] < script.masterTerrain.splatPrototypes.Count)
								{
//									EditorGUILayout.LabelField(""+count_splat+").",GUILayout.Width(27));
//									GUILayout.Space(50);
//									if (key.type == EventType.Repaint){splatRect = GUILayoutUtility.GetLastRect();}
//									if (script.masterTerrain.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture) {
//										EditorGUI.DrawPreviewTexture(Rect(splatRect.x,splatRect.y,50,50),script.masterTerrain.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture);
//									}
									// EditorGUILayout.LabelField(GUIContent(),GUILayout.Width(50),GUILayout.Height(50));
									
									EditorGUILayout.LabelField(""+count_splat+").",GUILayout.Width(23));
									// EditorGUILayout.LabelField(GUIContent(script.masterTerrain.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture),GUILayout.Width(50),GUILayout.Height(50));
									if (script.masterTerrain.splatPrototypes.Count-1 >= current_layer.splat_output.splat[count_splat]){
										if (script.masterTerrain.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture) {
											if (GUILayout.Button(String.Empty,GUILayout.Width(81),GUILayout.Height(80)))
											{
												if (!current_layer.splat_output.splat_custom[count_splat].custom) {
													create_preview_window(script.masterTerrain.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture,"Splat Mix");
												}
												else {
													create_preview_window(script.masterTerrain,current_layer.splat_output.splat_custom[count_splat]);
												}
												GUI.changed = false;
											}
											if (key.type == EventType.Repaint){current_layer.splat_output.rect = GUILayoutUtility.GetLastRect();}
											// if (key.type == EventType.Repaint){current_layer.splat_output.rect1 = GUILayoutUtility.GetLastRect();}
											
											if (!current_layer.splat_output.splat_custom[count_splat].custom) {
												if (script.masterTerrain.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture) {
													EditorGUI.DrawPreviewTexture(Rect(current_layer.splat_output.rect.x+3,current_layer.splat_output.rect.y+3,75,75),script.masterTerrain.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture);
												}
											}
											else
											{
//												if (!current_layer.splat_output.splat_custom[count_splat].texture)
//												{
//													current_layer.splat_output.splat_custom[count_splat].calc_splat_value(script.masterTerrain,global_script.splat_custom_texture_resolution1,current_layer.splat_output.splat[count_splat]);
//												}
												current_layer.splat_output.splat_custom[count_splat].CalcTotalValue();
												
												for (var i: int = 0;i < current_layer.splat_output.splat_custom[count_splat].value.Count;++i) {
													GUI.color = new Color(1,1,1,current_layer.splat_output.splat_custom[count_splat].value[i]/current_layer.splat_output.splat_custom[count_splat].totalValue);
													if (GUI.color.a > 0) {
														if (script.masterTerrain.terrain.terrainData.splatPrototypes.Length > current_layer.splat_output.splat[count_splat]) {
															if (script.masterTerrain.terrain.terrainData.splatPrototypes[current_layer.splat_output.splat[count_splat]].texture) {
																EditorGUI.DrawPreviewTexture(Rect(current_layer.splat_output.rect.x+3,current_layer.splat_output.rect.y+3.5,75,75),script.masterTerrain.terrain.terrainData.splatPrototypes[i].texture);
															}
														}
													}
												}
												GUI.color = Color.white;
											}
											// GUILayout.Space(38);
//											if (global_script.preview_texture && script.settings.use_splat_color)  
//								        	{
//								        		gui_changed_old = GUI.changed;
//								        		GUI.changed = false;
//								        		script.settings.splat_colors[count_splat] = EditorGUI.ColorField(Rect(current_layer.splat_output.rect1.x+63,current_layer.splat_output.rect1.y+20,40,16),script.settings.splat_colors[count_splat]);
//								        		if (GUI.changed)
//								        		{
//								        			// if (global_script.preview_texture){set_layer_preview(current_prelayer_number,current_layer_number);}
//								        		}
//								        		GUI.changed = gui_changed_old;
//								        	}
										} 
									}
								}
								else {
									//EditorGUILayout.BeginHorizontal();
									EditorGUILayout.LabelField(""+count_splat+").",GUILayout.Width(24));
									// GUILayout.Space(50);
									if (key.type == EventType.Repaint){splatRect = GUILayoutUtility.GetLastRect();}
									
									GUILayout.Button("Empty",GUILayout.Width(80),GUILayout.Height(80));
									
									//EditorGUILayout.EndHorizontal();
								}
								
//								if (!current_layer.splat_output.mix_overview)
//								{
//									gui_changed_old = GUI.changed;
//			           				gui_changed_window = GUI.changed; GUI.changed = false;
//									current_layer.splat_output.splat_value.value[count_splat] = EditorGUILayout.Slider(current_layer.splat_output.splat_value.value[count_splat],1,100);
//									if (global_script.settings.tooltip_mode != 0)
//						        	{
//						        		tooltip_text = "Center this value to 50";
//						        	}
//									if (GUILayout.Button(GUIContent("C",tooltip_text),GUILayout.Width(25)))
//									{
//										current_layer.splat_output.splat_value.value[count_splat] = 50;
//										GUI.changed = true;
//										generate_auto();
//									}
//									EditorGUILayout.LabelField(current_layer.splat_output.splat_value.text[count_splat],GUILayout.Width(90));
//									if (GUI.changed)
//									{
//										gui_changed_old = true;
//										current_layer.splat_output.splat_value.calc_value();
//									}
//									GUI.changed = gui_changed_old;
//								}
								GUILayout.Space(15);
								if (key.type == EventType.Repaint){current_layer.splat_output.splat_custom[count_splat].rect = GUILayoutUtility.GetLastRect();}
								
								gui_changed_old = GUI.changed;
								current_layer.splat_output.splat_custom[count_splat].foldout = EditorGUI.Foldout(Rect(current_layer.splat_output.splat_custom[count_splat].rect.x+2,current_layer.splat_output.splat_custom[count_splat].rect.y+2,15,19),current_layer.splat_output.splat_custom[count_splat].foldout,String.Empty);
								GUI.changed = gui_changed_old;
								if (!current_layer.splat_output.splat_custom[count_splat].custom)
								{
									gui_changed_old = GUI.changed;
									gui_changed_window = GUI.changed; 
									GUI.changed = false;
									current_layer.splat_output.splat[count_splat] = EditorGUILayout.IntField(current_layer.splat_output.splat[count_splat],GUILayout.Width(25));
									if (GUILayout.Button("+",GUILayout.Width(25)))
									{
										if (!key.shift)
										{
											current_layer.splat_output.splat[count_splat] += 1;
										}
										else
										{
											if (count_splat > 0){current_layer.splat_output.splat[count_splat] = current_layer.splat_output.splat[count_splat-1]+1;}
											else {current_layer.splat_output.splat[count_splat] += 1;}
										}
										GUI.changed = true;
									}
									if (GUILayout.Button("-",GUILayout.Width(25)))
									{
										current_layer.splat_output.splat[count_splat] -= 1;
										GUI.changed = true;
									}
									
									if (GUI.changed)
									{
										if (current_layer.splat_output.splat[count_splat] < 0)
										{
											current_layer.splat_output.splat[count_splat] = 0;
										}
										if (current_layer.splat_output.splat[count_splat] > script.masterTerrain.splatPrototypes.Count-1)
										{
											if (script.masterTerrain.splatPrototypes.Count > 0)
											{
												current_layer.splat_output.splat[count_splat] = script.masterTerrain.splatPrototypes.Count-1;
											}
											else
											{
												current_layer.splat_output.splat[count_splat] = 0;
											}
										}
										generate_auto();
									}
									GUI.changed = gui_changed_old;
								}
								else
								{
									EditorGUILayout.LabelField("Custom",GUILayout.Width(83));
									//GUILayout.Space(87);
								}
								DrawValueSlider(current_layer.splat_output.splat_value,count_splat,true,25);
								EditorGUILayout.EndHorizontal();
							}
														
	           				if (!global_script.settings.toggle_text_no)
					        {
					        	if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
					        }
					         
					        gui_changed_old = GUI.changed;
					        gui_changed_window = GUI.changed; GUI.changed = false;
					        current_layer.splat_output.splat_value.active[count_splat] = EditorGUILayout.Toggle(current_layer.splat_output.splat_value.active[count_splat],GUILayout.Width(25));
					        if (GUI.changed)
					        {
					        	gui_changed_old = true;
					        	current_layer.splat_output.splat_value.Active(count_splat);
					        	current_layer.splat_output.splat_value.calc_value();
					        	current_layer.splat_output.set_splat_curve();
		           			}
							GUI.changed = gui_changed_old;
								 
	           				if (script.settings.display_mix_curves){current_layer.splat_output.curves[count_splat].curve = EditorGUILayout.CurveField(current_layer.splat_output.curves[count_splat].curve);}
	           			     
	           			    if (count_splat > 0) { 
		           			    if (GUILayout.Button("▲",GUILayout.Width(25)))
		           			    {
		           			    	current_layer.splat_output.swap_splat(count_splat,count_splat-1);
		           			    	generate_auto();
		           			    } 		 
		           			}
		           			else {
		           				GUILayout.Space(29);
		           			}
		           			if (count_splat < current_layer.splat_output.splat.Count-1) {
		           			    if (GUILayout.Button("▼",GUILayout.Width(25)))
		           			    {
		           			    	current_layer.splat_output.swap_splat(count_splat,count_splat+1);
		           			    	generate_auto();
		           			    } 		 
		           			}
		           			else {
		           				GUILayout.Space(29);
		           			}
	           			    if (GUILayout.Button("+",GUILayout.Width(25)))
	           			    {
	           			    	add_splat(current_layer.splat_output,count_splat,key.shift);
	           			    	generate_auto();
	           			    } 		 
	           			    if (GUILayout.Button("-",GUILayout.Width(25)) && current_layer.splat_output.splat.Count > 0)
	           			    {
	           			    	if (key.control) {
		           			    	current_layer.splat_output.erase_splat(count_splat);
		           			    	generate_auto();
		           			     	this.Repaint();
		           			     	return;
		           			    }
		           			    else {
									this.ShowNotification(GUIContent("Control click the '-' button to erase"));
								}
	           			    } 		 
	           				EditorGUILayout.EndHorizontal();
	           				
	           				if (current_layer.splat_output.splat_custom[count_splat].foldout)
	           				{
	           					EditorGUILayout.BeginHorizontal();
	           					GUILayout.Space(space+90);
	           					EditorGUILayout.LabelField("Custom",GUILayout.Width(100));
	           					gui_changed_old = GUI.changed;
	           					GUI.changed = false;
	           					current_layer.splat_output.splat_custom[count_splat].custom = EditorGUILayout.Toggle(current_layer.splat_output.splat_custom[count_splat].custom,GUILayout.Width(25));
	           					if (GUI.changed)
	           					{
	           						gui_changed_old = true;
	           						if (current_layer.splat_output.splat_custom[count_splat].custom)
	           						{
	           							current_layer.splat_output.splat_custom[count_splat].CalcTotalValue();
	           						}
	           						// if (preview_windows.Count > 0) {preview_windows_repaint();}
	           					}
	           					GUI.changed = gui_changed_old;
	           					EditorGUILayout.EndHorizontal();
	           					
	           					var count_splat2: int;
	           					
//	           					if (current_layer.splat_output.splat_custom[count_splat].value.Count < script.masterTerrain.splatPrototypes.Count)
//	           					{
//	           						var splat_length: int = script.masterTerrain.splatPrototypes.Count-current_layer.splat_output.splat_custom[count_splat].value1.Count;
//	           						
//	           						for (count_splat2 = 0;count_splat2 < splat_length;++count_splat2)
//	           						{
//	           							current_layer.splat_output.splat_custom[count_splat].value.Add(0);
//	           						}
//	           					}
	           					
	           					for (count_splat2 = 0;count_splat2 < current_layer.splat_output.splat_custom[count_splat].value.Count;++count_splat2)
	           					{
	           						EditorGUILayout.BeginHorizontal();
	           						GUILayout.Space(space+90);
	           						EditorGUILayout.LabelField("Splat"+count_splat2.ToString(),GUILayout.Width(100));
	           						if (key.type == EventType.Repaint){current_layer.splat_output.splat_custom[count_splat].rect3 = GUILayoutUtility.GetLastRect();}
	           						if (script.masterTerrain.splatPrototypes.Count-1 >= count_splat2) {
	           							if (script.masterTerrain.splatPrototypes[count_splat2].texture) {
	           								EditorGUI.DrawPreviewTexture(Rect(current_layer.splat_output.splat_custom[count_splat].rect3.x+60,current_layer.splat_output.splat_custom[count_splat].rect3.y-2,25,25),script.masterTerrain.splatPrototypes[count_splat2].texture);
	           							}
	           						}
	           						gui_changed_old = GUI.changed;
	           						GUI.changed = false;
	           						current_layer.splat_output.splat_custom[count_splat].value[count_splat2] = EditorGUILayout.Slider(current_layer.splat_output.splat_custom[count_splat].value[count_splat2],0,1,GUILayout.Width(200));
	           						if (GUI.changed)
	           						{
	           							gui_changed_old = true;
	           							current_layer.splat_output.splat_custom[count_splat].CalcTotalValue();
	           							current_layer.splat_output.splat_custom[count_splat].changed = true;
	           							// if (preview_windows.Count > 0) {preview_windows_repaint();}
	           						}
	           						GUI.changed = gui_changed_old;
	           						// GUILayout.Space(25);
	           						EditorGUILayout.EndHorizontal();
	           						GUILayout.Space(9);
	           					}
	           				}
	           				 
	           				if (global_script.settings.color_scheme)
	           				{
	           					if (!current_layer.splat_output.splat_value.active[count_splat]){color_splat += Color(0.3,0.3,0.3,0);}
	           				 	GUI.color = color_splat;
	           				}
	           				if (current_layer.splat_output.mix_mode == mix_mode_enum.Single && count_splat < current_layer.splat_output.splat.Count-1)
				            {
					        	if (global_script.settings.color_scheme)
					         	{
					         		GUI.color = Color.green;
					         	}
					         	EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+125);
					           	EditorGUILayout.LabelField("Mix rate",GUILayout.Width(55));
					           	gui_changed_old = GUI.changed;
					           	gui_changed_window = GUI.changed; GUI.changed = false;
					           	current_layer.splat_output.mix[count_splat+1] = EditorGUILayout.Slider(current_layer.splat_output.mix[count_splat+1],0,1);
					           	if (GUI.changed)
					           	{
					           		gui_changed_old = true;
					           		current_layer.splat_output.set_splat_curve();
			           			}
			           			GUI.changed = gui_changed_old;
					           	EditorGUILayout.EndHorizontal();
					           	if (global_script.settings.color_scheme){GUI.color = color_splat;}
					           	GUILayout.Space(16);
					         }
					         else {// if (current_layer.splat_output.splat[count_splat] < script.masterTerrain.splatPrototypes.Count) {
					         	// GUILayout.Space(33);
					         }
					    }
					    // splat for end
					}
				}
	        	
	        	// tree layer
		        if (current_layer.output == layer_output_enum.tree)
		        {
		           	var color_tree: Color = global_script.settings.color.color_tree;
		           	
			        if (global_script.settings.color_scheme){GUI.color = color_tree;}			           		
		           	EditorGUILayout.BeginHorizontal();
	           		GUILayout.Space(space+30);
	           		gui_changed_old = GUI.changed;
	           		current_layer.tree_output.foldout = EditorGUILayout.Foldout(current_layer.tree_output.foldout,current_layer.tree_output.tree_text+tree_output_text);  
	           		GUI.changed = gui_changed_old;
	           		EditorGUILayout.EndHorizontal();
  	
					// tree_foldout
	        		if (current_layer.tree_output.foldout)
	        		{
			        	EditorGUILayout.BeginHorizontal(); 
			           	GUILayout.Space(space+45);
		        		if (GUILayout.Button("+",GUILayout.Width(25)))
		        		{
		        			add_tree(current_layer.tree_output.tree.Count-1,current_layer.tree_output);
		        			generate_auto();
		        		}
		        		if (GUILayout.Button("-",GUILayout.Width(25)))
		        		{
		        			if (key.control) {
			        			if (!key.shift)
			        			{
			        				erase_tree(current_layer.tree_output.tree.Count-1,current_layer.tree_output);
			        			}
			        			else
			        			{
			        				UndoRegister("Erase Trees");
			        				current_layer.tree_output.clear_tree(script);
			        			}
			        			generate_auto();
			        			this.Repaint();
			        			return;
			        		}
			        		else {
								this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
							}
		        		} 
		        		
		        		if (current_layer.tree_output.tree.Count > 0) {	
			        		if (GUILayout.Button("F",GUILayout.Width(20)))
							{
								current_layer.tree_output.trees_foldout = !current_layer.tree_output.trees_foldout;
								script.change_trees_foldout(current_layer.tree_output,key.shift);
							}
							
							if (GUILayout.Button("R",GUILayout.Width(25))) {current_layer.tree_output.tree_value.reset_values();generate_auto();}
							
							EditorGUILayout.LabelField("");
			        		if (GUILayout.Button("A",GUILayout.Width(20))) {
								if (!key.shift) current_layer.tree_output.trees_active = !current_layer.tree_output.trees_active;
								script.change_trees_active(current_layer.tree_output,key.shift);
							}
							GUILayout.Space(163);
						}
//						if (global_script.settings.tooltip_mode != 0)
//						{
//							tooltip_text = "Show/Hide Layer Interface Buttons\n(Click)\n\nShow/Hide Tree Icons\n(Shift Click)";
//						}
//						if (GUILayout.Button(GUIContent("»I",tooltip_text),GUILayout.Width(25)))
//						{
//							if (!key.shift){current_layer.tree_output.interface_display = !current_layer.tree_output.interface_display;}
//							else
//							{
//								current_layer.tree_output.icon_display = !current_layer.tree_output.icon_display;
//							}
//						}
						EditorGUILayout.EndHorizontal();
			            
			            for (var count_tree: int = 0;count_tree < current_layer.tree_output.tree.Count;++count_tree)
		           		{
		           	   		var current_tree: tree_class = current_layer.tree_output.tree[count_tree];
		           	   		current_tree_number = count_tree;
		           	   		if (!current_layer.tree_output.tree_value.active[count_tree])
							{
								color_tree += Color(-0.2,-0.2,-0.2,0);
							}
		           	   		
		           			if (current_tree.color_tree != color_tree)
		           			{
		           				if (current_tree.color_tree[0] > color_tree[0]){current_tree.color_tree[0] -= 0.003;} 
		           					else if (current_tree.color_tree[0]+0.01 < color_tree[0]){current_tree.color_tree[0] += 0.003;}	
		           						else {current_tree.color_tree[0] = color_tree[0];}
		           				if (current_tree.color_tree[1] > color_tree[1]){current_tree.color_tree[1] -= 0.003;} 
		           					else if (current_tree.color_tree[1]+0.01 < color_tree[1]){current_tree.color_tree[1] += 0.003;}
		           						else {current_tree.color_tree[1] = color_tree[1];}
		           				if (current_tree.color_tree[2] > color_tree[2]){current_tree.color_tree[2] -= 0.003;} 
		           					else if (current_tree.color_tree[2]+0.01 < color_tree[2]){current_tree.color_tree[2] += 0.003;}
		           						else {current_tree.color_tree[2] = color_tree[2];}
		           				if (current_tree.color_tree[3] > color_tree[3]){current_tree.color_tree[3] -= 0.003;} 
		           					else if (current_tree.color_tree[3]+0.01 < color_tree[3]){current_tree.color_tree[3] += 0.003;}
		           						else {current_tree.color_tree[3] = color_tree[3];}
		           				this.Repaint();
		           			}
		           			color_tree = current_tree.color_tree;
		           					           			
							if (global_script.settings.color_scheme){GUI.color = color_tree;}
		           			
							EditorGUILayout.BeginHorizontal();
	           				GUILayout.Space(space+45); 
							
							// if (current_layer.tree_output.icon_display)
	        				// {
		        				GUI.color = Color.white;
		        				if (current_tree.prototypeindex < script.masterTerrain.treePrototypes.Count)
		        				{
			        				if (!script.masterTerrain.treePrototypes[current_tree.prototypeindex].prefab){GUILayout.Button(GUIContent("Empty"),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64));}
							       	else
							       	{
										#if !UNITY_3_4 && !UNITY_3_5
									    script.masterTerrain.treePrototypes[current_tree.prototypeindex].texture = AssetPreview.GetAssetPreview(script.masterTerrain.treePrototypes[current_tree.prototypeindex].prefab);
										#else
									    script.masterTerrain.treePrototypes[current_tree.prototypeindex].texture = EditorUtility.GetAssetPreview(script.masterTerrain.treePrototypes[current_tree.prototypeindex].prefab);
									    #endif
							        	
							        	if (global_script.settings.tooltip_mode == 2)
										{
											tooltip_text = "Click to preview\n\nClick again to close preview";
										} else {tooltip_text = "";}
							        	if (GUILayout.Button(GUIContent(script.masterTerrain.treePrototypes[current_tree.prototypeindex].texture,tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64))){create_preview_window(script.masterTerrain.treePrototypes[current_tree.prototypeindex].texture,"Tree Preview");}
							        	
							        	GUI.color = UnityEngine.Color.green;
							        	if (key.type == EventType.Repaint){countRect = GUILayoutUtility.GetLastRect();}
							        	EditorGUI.LabelField(Rect(countRect.x+3,countRect.y+45,64,20),current_tree.placed.ToString(),EditorStyles.miniLabel);
							        	GUI.color = color_tree;
							        	EditorGUI.LabelField(Rect(countRect.x+64,countRect.y+20,64,20),count_tree.ToString()+").",EditorStyles.miniLabel);
							        	GUI.color = UnityEngine.Color.white;
							        }	 
							    }
							   	else {GUILayout.Button(GUIContent("Not\nAssigned"),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64));}
							   	if (global_script.settings.color_scheme){GUI.color = color_tree;}
							// }
							
								var tree_text: String = "Not Assigned";
								if (current_tree.prototypeindex < script.masterTerrain.treePrototypes.Count)
								{
									if (script.masterTerrain.treePrototypes[current_tree.prototypeindex].prefab)
									{
										tree_text = script.masterTerrain.treePrototypes[current_tree.prototypeindex].prefab.name;
										if (tree_text.Length > 8){tree_text = tree_text.Substring(0,6);}
									}
								}
								
//								// tree counter
//			           		    if (script2)
//			           		    {
//			           		    	if (current_tree.placed_reference)
//			           		     	{
//			           		     		current_tree.placed = current_tree.placed_reference.placed;
//			           		    	}
//				           		}
				           		    
//				           		if (script.placed_count)
//				           		{
//				           			if (current_tree.placed > 0){tree_text += " (P "+current_tree.placed+")";}
//				           		}
			
								// tree text
								gui_changed_old = GUI.changed;
								current_tree.foldout = EditorGUILayout.Foldout(current_tree.foldout,tree_text);
								GUI.changed = gui_changed_old;
								GUILayout.Space(35);
								
								gui_changed_old = GUI.changed;
								gui_changed_window = GUI.changed; GUI.changed = false;
								current_tree.prototypeindex = EditorGUILayout.IntField(current_tree.prototypeindex,GUILayout.Width(25));
								if (GUILayout.Button("+",GUILayout.Width(25)))
								{
									if (!key.shift)
									{
										current_tree.prototypeindex += 1;
									}
									else
									{
										if (count_tree > 0){current_tree.prototypeindex = current_layer.tree_output.tree[count_tree-1].prototypeindex+1;}
										else {current_tree.prototypeindex += 1;}
									}
									GUI.changed = true;
								}
								if (GUILayout.Button("-",GUILayout.Width(25)) && current_tree.prototypeindex > 0)
								{
									current_tree.prototypeindex -= 1;
									GUI.changed = true;
								}
								if (GUI.changed)
								{
									gui_changed_old = true;
									if (script.masterTerrain.treePrototypes.Count > 0)
									{
										if (current_tree.prototypeindex > script.masterTerrain.treePrototypes.Count-1)
										{
											current_tree.prototypeindex = script.masterTerrain.treePrototypes.Count-1;
										}
										if (current_tree.prototypeindex < 0)
										{
											current_tree.prototypeindex = 0;
										}
										current_tree.count_mesh(script.masterTerrain.treePrototypes[current_tree.prototypeindex].prefab);
									}
								}
								
//		           				gui_changed_window = GUI.changed; GUI.changed = false;
//								current_layer.tree_output.tree_value.value[count_tree] = EditorGUILayout.Slider(current_layer.tree_output.tree_value.value[count_tree],0.1,100);
//								if (global_script.settings.tooltip_mode != 0)
//						       	{
//						        	tooltip_text = "Center this value to 50";
//						        }
//								if (GUILayout.Button(GUIContent("C",tooltip_text),GUILayout.Width(25))){current_layer.tree_output.tree_value.value[count_tree] = 50;GUI.changed = true;}
//								EditorGUILayout.LabelField(current_layer.tree_output.tree_value.text[count_tree],GUILayout.Width(90));
//								if (GUI.changed)
//								{
//									gui_changed_old = true;
//									current_layer.tree_output.tree_value.calc_value();
//								}
								GUI.changed = gui_changed_old;
								DrawValueSlider(current_layer.tree_output.tree_value,count_tree,true,25);
									
							if (!global_script.settings.toggle_text_no)
					        {
					        	if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
					        }
					        gui_changed_old = GUI.changed;
					        gui_changed_window = GUI.changed; GUI.changed = false;
					        current_layer.tree_output.tree_value.active[count_tree] = EditorGUILayout.Toggle(current_layer.tree_output.tree_value.active[count_tree],GUILayout.Width(25));
					        if (GUI.changed)
					        {
					        	gui_changed_old = true;
					        	current_layer.tree_output.tree_value.calc_value();
					        }
							GUI.changed = gui_changed_old;
								 	 
							// if (current_layer.tree_output.interface_display)
							// {
								if (count_tree > 0) {
			           				if (GUILayout.Button("▲",GUILayout.Width(25))) {
			           					current_layer.tree_output.swap_tree(count_tree,count_tree-1);
			           					generate_auto();
			           				}
			           			}
			           			else {
			           				GUILayout.Space(29);
			           			}
			           			if (count_tree < current_layer.tree_output.tree.Count-1) {
			           				if (GUILayout.Button("▼",GUILayout.Width(25))) {
				           				current_layer.tree_output.swap_tree(count_tree,count_tree+1);
				           				generate_auto();
				           			}
				           		}
				           		else {
			           				GUILayout.Space(29);
			           			}
			           			if (GUILayout.Button(current_tree.swap_text,GUILayout.Width(35)))
			           			{
			           				swap_tree(current_layer.tree_output,count_tree);
			           				generate_auto();
			           			} 	
			           			if (GUILayout.Button("+",GUILayout.Width(25)))
			           			{
			           				add_tree(count_tree,current_layer.tree_output);
			           				generate_auto();
			           			}	 
			           			if (GUILayout.Button("-",GUILayout.Width(25))){
			           				if (key.control) {
			           					erase_tree(count_tree,current_layer.tree_output);
			           					generate_auto();
			           					this.Repaint();
			           					return;
			           				}
			           				else {
										this.ShowNotification(GUIContent("Control click the '-' button to erase"));
									}
			           			}
			           		// }
		           			EditorGUILayout.EndHorizontal();
		           			
		           			if (current_tree.foldout)
		           			{
			           			EditorGUILayout.BeginHorizontal();
						        GUILayout.Space(space+60);
						        gui_changed_old = GUI.changed;
						        current_tree.data_foldout = EditorGUILayout.Foldout(current_tree.data_foldout,"Data");
						        GUI.changed = gui_changed_old;
						        EditorGUILayout.EndHorizontal(); 
									 	
								if (current_tree.data_foldout)
			    	     		{
				    	     		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Vertices length",GUILayout.Width(140));
					           		EditorGUILayout.LabelField(""+current_tree.mesh_length,GUILayout.Width(140));
					           		EditorGUILayout.EndHorizontal();
					           					
					           		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Trianlges length",GUILayout.Width(140));
					           		EditorGUILayout.LabelField(""+current_tree.mesh_triangles/3,GUILayout.Width(140));
					           		EditorGUILayout.EndHorizontal();
					           				 
					           		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Combine max",GUILayout.Width(140));
					           		EditorGUILayout.LabelField(""+current_tree.mesh_combine,GUILayout.Width(140));
					           		EditorGUILayout.EndHorizontal();
				    	     				 	
				    	     		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Size",GUILayout.Width(140));
					           		EditorGUILayout.LabelField(""+current_tree.mesh_size,GUILayout.Width(170));
					           		EditorGUILayout.EndHorizontal();
					           				 	
					           		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Size Scale",GUILayout.Width(140));
					           		EditorGUILayout.LabelField(""+current_tree.mesh_size*current_layer.tree_output.scale,GUILayout.Width(170));
					           		EditorGUILayout.EndHorizontal();
					           	}	
		           				
		           				EditorGUILayout.BeginHorizontal();
						        GUILayout.Space(space+60);
						        gui_changed_old = GUI.changed;
						        current_tree.scale_foldout = EditorGUILayout.Foldout(current_tree.scale_foldout,"Scale");
						        GUI.changed = gui_changed_old;
						        EditorGUILayout.EndHorizontal(); 
		           				
		           				if (current_tree.scale_foldout)
		           				{
			           				GUILayout.Space(5);
			           				EditorGUILayout.BeginHorizontal();
				           			GUILayout.Space(space+75);
				           			EditorGUILayout.LabelField("Height",GUILayout.Width(85));
				           			GUILayout.Space(29);
				           			current_tree.height_start = EditorGUILayout.FloatField(Mathf.Round(current_tree.height_start*100)/100,GUILayout.Width(35));
				           			EditorGUILayout.MinMaxSlider(current_tree.height_start,current_tree.height_end,0,30);
				           			current_tree.height_end = EditorGUILayout.FloatField(Mathf.Round(current_tree.height_end*100)/100,GUILayout.Width(35));
				           			GUILayout.Space(29);
				           			EditorGUILayout.EndHorizontal();
				           			
				           			EditorGUILayout.BeginHorizontal();
				           			GUILayout.Space(space+75);
				           			EditorGUILayout.LabelField("Width ",GUILayout.Width(85));
				           			current_tree.link_start = EditorGUILayout.Toggle(current_tree.link_start,GUILayout.Width(25));
				           			current_tree.width_start = EditorGUILayout.FloatField(Mathf.Round(current_tree.width_start*100)/100,GUILayout.Width(35));
				           			EditorGUILayout.MinMaxSlider(current_tree.width_start,current_tree.width_end,0,30);
				           			current_tree.width_end = EditorGUILayout.FloatField(Mathf.Round(current_tree.width_end*100)/100,GUILayout.Width(35));
				           			current_tree.link_end = EditorGUILayout.Toggle(current_tree.link_end,GUILayout.Width(25));
				           			 			
				           			if (current_tree.link_start){current_tree.width_start = current_tree.height_start;}
				           			if (current_tree.width_start > current_tree.width_end){current_tree.width_start = current_tree.width_end;}
				           			if (current_tree.width_end < current_tree.width_start){current_tree.width_end = current_tree.width_start;}
				           			EditorGUILayout.EndHorizontal();
				           						           				 			
				           			EditorGUILayout.BeginHorizontal();
				           			GUILayout.Space(space+75);
				           			EditorGUILayout.LabelField("Unlink",GUILayout.Width(115));
				           			current_tree.unlink = EditorGUILayout.Slider(current_tree.unlink,0,2,GUILayout.Width(267));
				           			EditorGUILayout.EndHorizontal();
				           			
				           			if (current_tree.link_end){current_tree.width_end = current_tree.height_end;}
				           			
				           			if (global_script.settings.tooltip_mode != 0)
				           			{
				           				tooltip_text = "Set these Scale Parameters to all active Trees in this Layer (Click)\n\nSet these Scale Parameters to all Trees in this Layer (Shift Click)";
				           			}
				           			
				           			EditorGUILayout.BeginHorizontal();
				           			GUILayout.Space(space+75);
				           			EditorGUILayout.LabelField("Added Height",GUILayout.Width(115));
				           			current_tree.height = EditorGUILayout.FloatField(current_tree.height,GUILayout.Width(75));
				           	   		EditorGUILayout.EndHorizontal();	
				           			
				           			EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+75);
									EditorGUILayout.LabelField("Ray Cast",GUILayout.Width(115));
									current_tree.raycast = EditorGUILayout.Toggle(current_tree.raycast,GUILayout.Width(25));
									EditorGUILayout.EndHorizontal();
						           	
						           	if (current_tree.raycast) {
							           	EditorGUILayout.BeginHorizontal();
										GUILayout.Space(space+85);
										EditorGUILayout.LabelField("Ray Cast Mode",GUILayout.Width(105));
										current_tree.raycast_mode = EditorGUILayout.EnumPopup(current_tree.raycast_mode);
										EditorGUILayout.EndHorizontal();
							
							           	EditorGUILayout.BeginHorizontal();
										GUILayout.Space(space+85);
										EditorGUILayout.LabelField("Layer",GUILayout.Width(105));
										current_tree.layerMask = EditorGUILayout.MaskField(current_tree.layerMask,layerMasks_display);
										if (GUILayout.Button("Refresh",EditorStyles.miniButtonMid,GUILayout.Width(65))) {
											create_layer_mask();
										}
										GUILayout.Space(5);
										EditorGUILayout.EndHorizontal();
										
										EditorGUILayout.BeginHorizontal();
										GUILayout.Space(space+85);
										EditorGUILayout.LabelField("Cast Direction",GUILayout.Width(105));
										EditorGUILayout.LabelField("X",GUILayout.Width(15));
										current_tree.ray_direction.x = EditorGUILayout.FloatField(current_tree.ray_direction.x);
										EditorGUILayout.LabelField("Y",GUILayout.Width(15));
										current_tree.ray_direction.y = EditorGUILayout.FloatField(current_tree.ray_direction.y);
										EditorGUILayout.LabelField("Z",GUILayout.Width(15));
										current_tree.ray_direction.z = EditorGUILayout.FloatField(current_tree.ray_direction.z);
										EditorGUILayout.EndHorizontal();
										
										EditorGUILayout.BeginHorizontal();
										GUILayout.Space(space+85);
										EditorGUILayout.LabelField("Cast Height",GUILayout.Width(105));
										current_tree.cast_height = EditorGUILayout.FloatField(current_tree.cast_height);
										EditorGUILayout.EndHorizontal();
										
										EditorGUILayout.BeginHorizontal();
										GUILayout.Space(space+85);
										EditorGUILayout.LabelField("Ray Length",GUILayout.Width(105));
										current_tree.ray_length = EditorGUILayout.FloatField(current_tree.ray_length);
										EditorGUILayout.EndHorizontal();
										
										EditorGUILayout.BeginHorizontal();
										GUILayout.Space(space+85);
										EditorGUILayout.LabelField("Ray Radius",GUILayout.Width(105));
										current_tree.ray_radius = EditorGUILayout.FloatField(current_tree.ray_radius);
										EditorGUILayout.EndHorizontal();
									}
									
									EditorGUILayout.BeginHorizontal();
				           			GUILayout.Space(space+75);
				           			EditorGUILayout.LabelField("Random Position",GUILayout.Width(115));
				           			current_tree.random_position = EditorGUILayout.Toggle(current_tree.random_position,GUILayout.Width(25));
				           	   		EditorGUILayout.EndHorizontal();	
				           			
				           			if (current_layer.tree_output.tree.Count > 1)
				           			{
					           			EditorGUILayout.BeginHorizontal();
					           			GUILayout.Space(space+75);
					           			if (GUILayout.Button(GUIContent(">Set All",tooltip_text),GUILayout.Width(65)))
						           		{
						           			UndoRegister("Set All Scale Tree"); 
						           			current_layer.tree_output.set_scale(current_tree,count_tree,key.shift);	
						           			generate_auto();
						           		}
						           		EditorGUILayout.EndHorizontal();
						           	}
				           		}
			           			
			           			EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+60);
				           		gui_changed_old = GUI.changed;
				           		current_tree.distance_foldout = EditorGUILayout.Foldout(current_tree.distance_foldout,"Distance");
				           		GUI.changed = gui_changed_old;
				           		EditorGUILayout.EndHorizontal();
				           				
				           		if (current_tree.distance_foldout)
				           		{ 
					           		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Distance Level",GUILayout.Width(140));
					           		current_tree.distance_level = EditorGUILayout.EnumPopup(current_tree.distance_level,GUILayout.Width(250));
					           		EditorGUILayout.EndHorizontal();
					           		
					        		if (current_tree.distance_mode == distance_mode_enum.Square)
									{
										EditorGUILayout.BeginHorizontal();
						        		GUILayout.Space(space+75);
						        		EditorGUILayout.LabelField("Distance Rotation",GUILayout.Width(140));
						        		current_tree.distance_rotation_mode = EditorGUILayout.EnumPopup(current_tree.distance_rotation_mode,GUILayout.Width(250));
						        		EditorGUILayout.EndHorizontal();
											
										EditorGUILayout.BeginHorizontal();
						           		GUILayout.Space(space+75);
						           		EditorGUILayout.LabelField("Min. Distance X",GUILayout.Width(140));
						           		current_tree.min_distance.x = EditorGUILayout.Slider(current_tree.min_distance.x,0,2048,GUILayout.Width(250));
						           		EditorGUILayout.EndHorizontal();
						           				
						           		EditorGUILayout.BeginHorizontal();
						           		GUILayout.Space(space+75);
						           		EditorGUILayout.LabelField("Min. Distance Z",GUILayout.Width(140));
						           		current_tree.min_distance.z = EditorGUILayout.Slider(current_tree.min_distance.z,0,2048,GUILayout.Width(250));
						           		EditorGUILayout.EndHorizontal();
						           	}
						           	else
						           	{
						           		EditorGUILayout.BeginHorizontal();
						           		GUILayout.Space(space+75);
						           		EditorGUILayout.LabelField("Min. Distance",GUILayout.Width(140));
						           		current_tree.min_distance.x = EditorGUILayout.Slider(current_tree.min_distance.x,0,2048,GUILayout.Width(250));
						           		EditorGUILayout.EndHorizontal();
						           	}
						           			
						           	EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Include Scale",GUILayout.Width(140));
						           	current_tree.distance_include_scale = EditorGUILayout.Toggle(current_tree.distance_include_scale,GUILayout.Width(25));
						           	EditorGUILayout.EndHorizontal();
						           			
						           	EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Include Scale Group",GUILayout.Width(140));
						           	current_tree.distance_include_scale_group = EditorGUILayout.Toggle(current_tree.distance_include_scale_group,GUILayout.Width(25));
						           	EditorGUILayout.EndHorizontal();
						           	
						           	if (global_script.settings.tooltip_mode != 0)
				           			{
				           				tooltip_text = "Set these Distance Parameters to all active Trees in this Layer (Click)\n\nSet this Distance Parameters to all Trees in this Layer (Shift Click)";
				           			}
						           	
						           	if (current_layer.tree_output.tree.Count > 1)
						           	{
							           	EditorGUILayout.BeginHorizontal();
					           			GUILayout.Space(space+75);
					           			if (GUILayout.Button(GUIContent(">Set All",tooltip_text),GUILayout.Width(65)))
					           			{
					           				UndoRegister("Set All Distance Tree");
					           				generate_auto();
					           				current_layer.tree_output.set_distance(current_tree,count_tree,key.shift);	
					           			}
					           			EditorGUILayout.EndHorizontal();
						           	}
						        }
		           				draw_precolor_range(current_tree.precolor_range,space+60,false,0,global_script.settings.color.color_tree_precolor_range,true,true,false,3);
				           		draw_filter(prelayer,current_tree.prefilter,script.filter,space+15+script.description_space,global_script.settings.color.color_tree_filter,global_script.settings.color.color_tree_subfilter,1,count_tree);
		           		}
		           		color_tree = global_script.settings.color.color_tree;
		           		if (!current_layer.tree_output.tree_value.active[count_tree])
						{
							if (global_script.settings.color_scheme){GUI.color = color_tree;}
		           		}
		           	}
		        }
			}
			
			// grass layer	
			if (current_layer.output == layer_output_enum.grass)
		    {
		    	var color_grass: Color = global_script.settings.color.color_grass;
		    	
		    	if (current_layer.grass_output.mix_mode == mix_mode_enum.Group)
			    {
					if (global_script.settings.color_scheme){GUI.color = Color.green;}
				    
				    if (current_layer.grass_output.grass.Count > 0)
				    {
					    EditorGUILayout.BeginHorizontal();
					    GUILayout.Space(space+30);
					    EditorGUILayout.LabelField("Mix rate",GUILayout.Width(147));
					    gui_changed_old = GUI.changed;
					    gui_changed_window = GUI.changed; GUI.changed = false;
					    current_layer.grass_output.mix[0] = EditorGUILayout.Slider(current_layer.grass_output.mix[0],0,30);
					    if (GUI.changed)
					    {
					    	gui_changed_old = true;
					    	current_layer.grass_output.set_grass_curve();
					    }
			           	GUI.changed = gui_changed_old;
					    EditorGUILayout.EndHorizontal();
					}
				    
				    if (global_script.settings.color_scheme){GUI.color = color_grass;}
				}    
	    
			    if (global_script.settings.color_scheme){GUI.color = color_grass;}
		        EditorGUILayout.BeginHorizontal();
	           	GUILayout.Space(space+30);
	           	gui_changed_old = GUI.changed;
	           	current_layer.grass_output.foldout = EditorGUILayout.Foldout(current_layer.grass_output.foldout,current_layer.grass_output.grass_text);  
	           	GUI.changed = gui_changed_old;
	           	EditorGUILayout.EndHorizontal();
  	  			
  	 			// grass_foldout
	        	if (current_layer.grass_output.foldout && script.masterTerrain)
	        	{
			    	EditorGUILayout.BeginHorizontal(); 
			        GUILayout.Space(space+45);
			        if (GUILayout.Button("+",GUILayout.Width(25)))
			        {
			        	add_grass(current_layer.grass_output,current_layer.grass_output.grass.Count-1,key.shift);
			        }
		        	if (GUILayout.Button("-",GUILayout.Width(25)))
		        	{
		        		if (key.control) {
			        		if (!key.shift)
			        		{
			        			UndoRegister("Erase Grass");
								current_layer.grass_output.erase_grass(current_layer.grass_output.grass.Count-1);
							}
							else
							{
								UndoRegister("Erase Grasses");
								current_layer.grass_output.clear_grass();
							}
			        		this.Repaint();
			        		return;
			        	}
			        	else {
							this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
						}
		        	} 
		        	if (GUILayout.Button("R",GUILayout.Width(25))) {current_layer.grass_output.grass_value.reset_values();generate_auto();}
			        EditorGUILayout.EndHorizontal();
			        
			        for (var count_grass: int = 0;count_grass < current_layer.grass_output.grass.Count;++count_grass)
		           	{
		           		var current_grass: grass_class = current_layer.grass_output.grass[count_grass];
		           		var draw_grass_texture: boolean = false;
		           				 		 
		           		if (global_script.settings.color_scheme)
		           		{
		           			if (!current_layer.grass_output.grass_value.active[count_grass]){color_grass += Color(-0.3,-0.3,-0.3,0);}
		           			GUI.color = color_grass;
		           		}
		           				 
		           		EditorGUILayout.BeginHorizontal();
		           		GUILayout.Space(space+45); 
		           		if (current_layer.grass_output.grass[count_grass].prototypeindex < script.masterTerrain.detailPrototypes.Count)
						{
							// grass text
							// EditorGUILayout.ObjectField(script.masterTerrain.detailPrototypes[current_grass.prototypeindex].prototypeTexture,Texture,false,GUILayout.Height(50),GUILayout.Width(50));
							if (script.masterTerrain.detailPrototypes[current_grass.prototypeindex].prototype && script.masterTerrain.detailPrototypes[current_grass.prototypeindex].usePrototypeMesh) {
								EditorGUILayout.LabelField(count_grass+").",GUILayout.Width(27));
								if (key.type == EventType.Repaint){grassRect = GUILayoutUtility.GetLastRect();}
								draw_grass_texture = true; 
								#if !UNITY_3_4 && !UNITY_3_5
							    script.masterTerrain.detailPrototypes[current_grass.prototypeindex].previewTexture = AssetPreview.GetAssetPreview(script.masterTerrain.detailPrototypes[current_grass.prototypeindex].prototype);
								#else
							    script.masterTerrain.detailPrototypes[current_grass.prototypeindex].previewTexture = EditorUtility.GetAssetPreview(script.masterTerrain.detailPrototypes[current_grass.prototypeindex].prototype);
								#endif
								
								if (script.masterTerrain.detailPrototypes[current_grass.prototypeindex].previewTexture) {
									EditorGUI.DrawPreviewTexture(Rect(grassRect.x+25,grassRect.y,50,50),script.masterTerrain.detailPrototypes[current_grass.prototypeindex].previewTexture);
									GUILayout.Space(50);
								}
								else {
									GUI.Button(Rect(grassRect.x+25,grassRect.y,50,50),Substring(script.masterTerrain.detailPrototypes[current_grass.prototypeindex].prototype.name,".",5),EditorStyles.miniButtonMid);
									GUILayout.Space(50);
								}
							}
							if (script.masterTerrain.detailPrototypes[current_grass.prototypeindex].prototypeTexture && !script.masterTerrain.detailPrototypes[current_grass.prototypeindex].usePrototypeMesh)
							{
								EditorGUILayout.LabelField(count_grass+").",GUILayout.Width(27));
								if (key.type == EventType.Repaint){grassRect = GUILayoutUtility.GetLastRect();}
								draw_grass_texture = true;
								EditorGUI.DrawPreviewTexture(Rect(grassRect.x+25,grassRect.y,50,50),script.masterTerrain.detailPrototypes[current_grass.prototypeindex].prototypeTexture);
								GUILayout.Space(50);
							}
						}
						else {
							EditorGUILayout.LabelField(count_grass+").",GUILayout.Width(27));
							if (key.type == EventType.Repaint){grassRect = GUILayoutUtility.GetLastRect();}
							GUI.Button(Rect(grassRect.x+25,grassRect.y,50,50),"Empty",EditorStyles.miniButtonMid);
							GUILayout.Space(50);
						}
						
						gui_changed_old = GUI.changed;
						gui_changed_window = GUI.changed; GUI.changed = false;
						current_grass.prototypeindex = EditorGUILayout.IntField(current_grass.prototypeindex,GUILayout.Width(25));
						if (GUILayout.Button("+",GUILayout.Width(25)))
						{
							if (!key.shift)
							{
								current_grass.prototypeindex += 1;
							}
							else
							{
								if (count_grass > 0){current_grass.prototypeindex = current_layer.grass_output.grass[count_grass-1].prototypeindex+1;}
								else {current_grass.prototypeindex += 1;}
							}
							generate_auto();
							// GUI.changed = true;
						}
						if (GUILayout.Button("-",GUILayout.Width(25)) && current_grass.prototypeindex > 0)
						{
							current_grass.prototypeindex -= 1;
							generate_auto();
							// GUI.changed = true;
						}
						
						if (GUI.changed)
						{
							if (script.masterTerrain.detailPrototypes.Count > 0)
							{
								if (current_grass.prototypeindex > script.masterTerrain.detailPrototypes.Count-1)
								{
									current_grass.prototypeindex = script.masterTerrain.detailPrototypes.Count-1;
								}
								if (current_grass.prototypeindex < 0)
								{
									current_grass.prototypeindex = 0;
								}
							}
						}
						GUI.changed = gui_changed_old;	
						DrawValueSlider(current_layer.grass_output.grass_value,count_grass,true,25);						 	 											 	 						 	 
								 
						if (!global_script.settings.toggle_text_no)
						{
							if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
						}
						gui_changed_window = GUI.changed; GUI.changed = false;
						current_layer.grass_output.grass_value.active[count_grass] = EditorGUILayout.Toggle(current_layer.grass_output.grass_value.active[count_grass],GUILayout.Width(25));
						if (GUI.changed)
						{
							gui_changed_old = true;
							current_layer.grass_output.grass_value.calc_value();
							current_layer.grass_output.set_grass_curve();
						}
						GUI.changed = gui_changed_old;
								 
	           			if (script.settings.display_mix_curves){current_layer.grass_output.curves[count_grass].curve = EditorGUILayout.CurveField(current_layer.grass_output.curves[count_grass].curve);}
		           		
		           		if (count_grass > 0) {		  
			           		if (GUILayout.Button("▲",GUILayout.Width(25)) && count_grass > 0)
			           		{
			           			if (current_layer.grass_output.swap_grass(count_grass,count_grass-1))
			           			{
			           				generate_auto();
			           			}
			           		} 		 
			           	} 
			           	else {
			           		GUILayout.Space(29);
			           	}
			           	if (count_grass < current_layer.grass_output.grass.Count-1) {
			           		if (GUILayout.Button("▼",GUILayout.Width(25)))
			           		{
			           			if (current_layer.grass_output.swap_grass(count_grass,count_grass+1))
			           			{
			           				generate_auto();
			           			}
			           		}
			           	}
			           	else {
			           		GUILayout.Space(29);
			           	}
		           		if (GUILayout.Button("+",GUILayout.Width(25)))
		           		{
		           			add_grass(current_layer.grass_output,count_grass,key.shift);
		           			generate_auto();
		           		}	 
		           		if (GUILayout.Button("-",GUILayout.Width(25)))
		           		{
		           			if (key.control) {
			           			current_layer.grass_output.erase_grass(count_grass);
			           			generate_auto();
			           			this.Repaint();
			        			return;
			        		}
			        		else {
								this.ShowNotification(GUIContent("Control click the '-' button to erase"));
							}
		           		}
		           		EditorGUILayout.EndHorizontal();
		           		GUILayout.Space(32);
						
		           	    GUILayout.Space(1); 
		           		if (global_script.settings.color_scheme)
		           		{
		           			if (!current_layer.grass_output.grass_value.active[count_grass]){color_grass += Color(0.3,0.3,0.3,0);}
		           			GUI.color = color_grass;
		           		}
		           		if (current_layer.grass_output.mix_mode == mix_mode_enum.Single && count_grass < current_layer.grass_output.grass.Count-1)
				        {
					    	if (global_script.settings.color_scheme)
					        {
					        	GUI.color = Color.green;
					        }
					        EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(space+95);
					        EditorGUILayout.LabelField("Mix rate",GUILayout.Width(60));
					        gui_changed_old = GUI.changed;
					        gui_changed_window = GUI.changed; GUI.changed = false;
					        current_layer.grass_output.mix[count_grass+1] = EditorGUILayout.Slider(current_layer.grass_output.mix[count_grass+1],0,5);
					        if (GUI.changed)
					        {
					        	gui_changed_old = true;
					        	current_layer.grass_output.set_grass_curve();
			           		}
			           		GUI.changed = gui_changed_old;
					        EditorGUILayout.EndHorizontal();
					        if (global_script.settings.color_scheme){GUI.color = color_grass;}
					      }
			       	}
		        }	
		        
		        GUI.backgroundColor = Color.white;
			}
	        
	        // object layer
		    if (current_layer.output == layer_output_enum.object)
		    {
		    	var color_object: Color = global_script.settings.color.color_object;
		        if (script.settings.remarks){draw_remarks(current_layer.remarks,space+30);}
		        if (global_script.settings.color_scheme){GUI.color = color_object;}
		        	
				EditorGUILayout.BeginHorizontal();
	           	GUILayout.Space(space+30);
	           	gui_changed_old = GUI.changed;
	           	current_layer.object_output.foldout = EditorGUILayout.Foldout(current_layer.object_output.foldout,current_layer.object_output.object_text);  
	           	GUI.changed = gui_changed_old;
	           	EditorGUILayout.EndHorizontal();
	           	
				// object_foldout
	       		if (current_layer.object_output.foldout)
	       		{
					EditorGUILayout.BeginHorizontal(); 
			    	GUILayout.Space(space+45);
			        if (GUILayout.Button("+",GUILayout.Width(25))){add_object(current_layer.object_output.object.Count-1,current_layer.object_output);}
		        	if (GUILayout.Button("-",GUILayout.Width(25)) && current_layer.object_output.object.Count > 1)
		        	{
		        		if (key.control) {
			        		if (!key.shift)
			        		{
			        			erase_object(current_layer.object_output.object.Count-1,current_layer.object_output);
			        		}
					        else
					        {
					        	UndoRegister("Erase Objects");
					        	script.clear_object(current_layer.object_output);
					        }
			        		this.Repaint();
			        		return;
			        	}
			        	else {
							this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
						}
		        	} 
		        	if (GUILayout.Button("F",GUILayout.Width(20)))
					{
						current_layer.object_output.object_foldout = !current_layer.object_output.object_foldout;
						script.change_objects_foldout(current_layer.object_output,key.shift);
					}
					
					
					if (global_script.settings.tooltip_mode != 0) {
						tooltip_text = "Create a GameObject in the Hierarchy to use as a parent for placed object from this layer.";
					}
		        	if (GUILayout.Button(new GUIContent("P",tooltip_text),GUILayout.Width(20)))
					{
						create_object_parent_layer(current_layer);
					}
					
					if (GUILayout.Button("R",GUILayout.Width(25))) current_layer.object_output.object_value.reset_values();
					
//					if (GUILayout.Button("»I«",GUILayout.Width(35)))
//					{
//						if (key.alt){current_layer.object_output.search_active = !current_layer.object_output.search_active;}
//						else 
//						if (key.shift)
//						{
//							current_layer.object_output.icon_display = !current_layer.object_output.icon_display;
//						}
//						else
//						{
//							
//							current_layer.object_output.interface_display = !current_layer.object_output.interface_display;
//						}
//					}
					EditorGUILayout.LabelField("");
					if (GUILayout.Button("A",GUILayout.Width(20))) {
						if (!key.shift) current_layer.object_output.object_active = !current_layer.object_output.object_active;
						script.change_objects_active(current_layer.object_output,key.shift);
					}
					GUILayout.Space(163);
			        EditorGUILayout.EndHorizontal();
			        
//			        if (current_layer.object_output.search_active)
//			        {
//			        	EditorGUILayout.BeginHorizontal();
//						GUILayout.Space(space+45);
//						EditorGUILayout.LabelField("Parent Object",GUILayout.Width(147));
//						current_layer.object_output.search_object = EditorGUILayout.ObjectField(current_layer.object_output.search_object,Transform,true) as Transform;
//			        	if (GUILayout.Button("<Search>",GUILayout.Width(70)) && key.shift)
//			        	{
//			        		script.set_auto_object(current_layer.object_output);
//			        	}
//						EditorGUILayout.EndHorizontal();
//						
//			        	// EditorGUILayout.BeginHorizontal();
//						// GUILayout.Space(space+45);
//						
////			        	if (GUILayout.Button("<Arrange>",GUILayout.Width(80)) && key.shift)
////			        	{
////			        		script.arrange_objects_scene(current_layer.object_output);
////			        	}
//			        	// EditorGUILayout.EndHorizontal();
//			        }
			        
			        for (var count_object: int = 0;count_object < current_layer.object_output.object.Count;++count_object)
		           	{
			        	var current_object: object_class = current_layer.object_output.object[count_object];
			        	
			        	if (!current_layer.object_output.object_value.active[count_object])
			           	{
			           		color_object += Color(-0.2,-0.2,-0.2,0);
			           		GUI.color = color_object;
			           	}
			        	
			           	if (current_object.color_object != color_object)
		           		{
		           			if (current_object.color_object[0] > color_object[0]){current_object.color_object[0] -= 0.003;} 
		           				else if (current_object.color_object[0]+0.01 < color_object[0]){current_object.color_object[0] += 0.003;}
		           					else {current_object.color_object[0] = color_object[0];}
		           			if (current_object.color_object[1] > color_object[1]){current_object.color_object[1] -= 0.003;} 
		           				else if (current_object.color_object[1]+0.01 < color_object[1]){current_object.color_object[1] += 0.003;}
		           					else {current_object.color_object[1] = color_object[1];}
		           			if (current_object.color_object[2] > color_object[2]){current_object.color_object[2] -= 0.003;} 
		           				else if (current_object.color_object[2]+0.01 < color_object[2]){current_object.color_object[2] += 0.003;}
		           					else {current_object.color_object[2] = color_object[2];}
		           			this.Repaint();
		           		}
		           		color_object = current_object.color_object;
			           	if (global_script.settings.color_scheme){GUI.color = color_object;}			    			    			 			    			    			 
			           	EditorGUILayout.BeginHorizontal();
			           	GUILayout.Space(space+45); 
			           	
			           	// if (current_layer.object_output.icon_display)
	        			// {
		        			if (!current_object.object1){GUILayout.Button(GUIContent("Empty"),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64));}
					        else
		        			{
			        			if (AssetDatabase.Contains(current_object.object1))
			        			{
									#if !UNITY_3_4 && !UNITY_3_5
									current_object.preview_texture = AssetPreview.GetAssetPreview(current_object.object1);
									#else
								    current_object.preview_texture = EditorUtility.GetAssetPreview(current_object.object1);
								    #endif
							        		
							    	if (global_script.settings.tooltip_mode == 2)
									{
										tooltip_text = "Click to preview\n\nClick again to close preview";
									} else {tooltip_text = "";}
							        if (GUILayout.Button(GUIContent(current_object.preview_texture,tooltip_text),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64))){create_preview_window(current_object.preview_texture,"Object Preview");}
							    }
							    else {
							    	GUILayout.Button(GUIContent(Substring(current_object.object1.name,".",8)),EditorStyles.miniButtonMid,GUILayout.Width(64),GUILayout.Height(64));
							    }
						  	}	
						  	
						  	GUI.color = UnityEngine.Color.green;
							countRect = GUILayoutUtility.GetLastRect();
							EditorGUI.LabelField(Rect(countRect.x+3,countRect.y+45,64,20),current_object.placed.ToString(),EditorStyles.miniLabel);
							GUI.color = UnityEngine.Color.white; 
							
							EditorGUI.LabelField(Rect(countRect.x+64,countRect.y,64,20),count_object.ToString()+").",EditorStyles.miniLabel);
						// }
						
			           	if (!global_script.settings.color_scheme){color_object = global_script.settings.color.color_object;} 
			           	gui_changed_old = GUI.changed;
			           	countRect.x += 66;
			           	countRect.y += 47;
			           	countRect.width = 25;
			           	countRect.height = 20;
			           	current_object.foldout = EditorGUI.Foldout(countRect,current_object.foldout,"");
						GUI.changed = gui_changed_old;
			           	GUILayout.Space(15);
			    		DrawValueSlider(current_layer.object_output.object_value,count_object,true,25);
			    		
			    		GUI.changed = false;
						current_object.object1 = EditorGUILayout.ObjectField(current_object.object1,GameObject,true) as GameObject;
						if (GUI.changed)
						{
							gui_changed_old = true;
							if (current_object.object1)
							{
								current_object.name = current_object.object1.name;
								if (PrefabUtility.GetPrefabType(current_object.object1) == PrefabType.None) {
									current_object.prefab = false;
								}
								if (!current_object.combine_parent_name_input){current_object.combine_parent_name = current_object.object1.name;}
							}
							current_object.count_mesh();
						}
									 
						if (!global_script.settings.toggle_text_no)
	        			{
	        				if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
	        			}
	        			gui_changed_window = GUI.changed; GUI.changed = false;
						current_layer.object_output.object_value.active[count_object] = EditorGUILayout.Toggle(current_layer.object_output.object_value.active[count_object],GUILayout.Width(25));
						if (GUI.changed)
		           		{
		           			gui_changed_old = true;
		           			current_layer.object_output.object_value.calc_value();
		           		}
		           		GUI.changed = gui_changed_old;
		           					 
		           		// if (current_layer.object_output.interface_display)
		           		// {
		           			if (count_object > 0) {
					        	if (GUILayout.Button("▲",GUILayout.Width(25)))
					        	{
					        		current_layer.object_output.swap_object(count_object,count_object-1);
					        		this.Repaint();
					        		return;
					        	} 		 
					        }
					        else {
					        	GUILayout.Space(29);
					        }
					        if (count_object < current_layer.object_output.object.Count-1) {
					        	if (GUILayout.Button("▼",GUILayout.Width(25)))
					           	{
					           		current_layer.object_output.swap_object(count_object,count_object+1);
					           		this.Repaint();
					           		return;
					           	}
					        }
					        else {
					        	GUILayout.Space(29);
					        }
				           	if (GUILayout.Button(current_object.swap_text,GUILayout.Width(35)))
				           	{
				           		swap_object(current_object,count_object,current_layer.object_output);
				           		this.Repaint();
				           		return;
				            } 
				           	if (GUILayout.Button("+",GUILayout.Width(25))){add_object(count_object,current_layer.object_output);}	 
				           	if (GUILayout.Button("-",GUILayout.Width(25)))
				           	{
				           		if (key.control) {
				           			erase_object(count_object,current_layer.object_output);
					           		this.Repaint();
					           		return;
					           	}
					           	else {
									this.ShowNotification(GUIContent("Control click the '-' button to erase"));
								}
				           	}
			           	// }
			           	EditorGUILayout.EndHorizontal();
			           				 
			           	if (current_object.foldout)
			           	{
			           		EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(space+60);
					        gui_changed_old = GUI.changed;
					        current_object.data_foldout = EditorGUILayout.Foldout(current_object.data_foldout,"Data");
					        GUI.changed = gui_changed_old;
					        EditorGUILayout.EndHorizontal(); 
								 	
							if (current_object.data_foldout)
		    	     		{
			    	     		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Vertices length",GUILayout.Width(140));
				           		EditorGUILayout.LabelField(""+current_object.mesh_length,GUILayout.Width(140));
				           		EditorGUILayout.EndHorizontal();
				           					
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Trianlges length",GUILayout.Width(140));
				           		EditorGUILayout.LabelField(""+current_object.mesh_triangles/3,GUILayout.Width(140));
				           		EditorGUILayout.EndHorizontal();
				           				 
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Combine max",GUILayout.Width(140));
				           		EditorGUILayout.LabelField(""+current_object.mesh_combine,GUILayout.Width(140));
				           		EditorGUILayout.EndHorizontal();
			    	     				 	
			    	     		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Size",GUILayout.Width(140));
				           		EditorGUILayout.LabelField(""+current_object.mesh_size,GUILayout.Width(170));
				           		EditorGUILayout.EndHorizontal();
				           				 	
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Size Scale",GUILayout.Width(140));
				           		EditorGUILayout.LabelField(""+current_object.mesh_size*current_layer.object_output.scale,GUILayout.Width(170));
				           		EditorGUILayout.EndHorizontal();
				           		
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		if (GUILayout.Button("Create Connection Points",GUILayout.Width(170)))
				           		{
				           			current_object.object2 = Instantiate(current_object.object1);
				           			var point1: GameObject = new GameObject();
				           			point1.transform.position = current_object.object2.transform.position;
				           			point1.transform.parent = current_object.object2.transform;
				           			point1.transform.Translate(-current_object.mesh_size.x/2,current_object.mesh_size.y,current_object.mesh_size.z/2);

				           			var point2: GameObject = new GameObject();
				           			point2.transform.position = current_object.object2.transform.position;
				           			point2.transform.parent = current_object.object2.transform;
				           			point2.transform.Translate(current_object.mesh_size.x/2,current_object.mesh_size.y,current_object.mesh_size.z/2);
				           			
				           			var point3: GameObject = new GameObject();
				           			point3.transform.position = current_object.object2.transform.position;
				           			point3.transform.parent = current_object.object2.transform;
				           			point3.transform.Translate(current_object.mesh_size.x/2,current_object.mesh_size.y,-current_object.mesh_size.z/2);
				           			
				         			var point4: GameObject = new GameObject();
				           			point4.transform.position = current_object.object2.transform.position;
				           			point4.transform.parent = current_object.object2.transform;
				           			point4.transform.Translate(-current_object.mesh_size.x/2,current_object.mesh_size.y,-current_object.mesh_size.z/2);				           			
				           		}
				           		EditorGUILayout.EndHorizontal();
					     	}	
			    	     	EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(space+60);
					        gui_changed_old = GUI.changed;
					        current_object.settings_foldout = EditorGUILayout.Foldout(current_object.settings_foldout,"Settings");
					        GUI.changed = gui_changed_old;
					        EditorGUILayout.EndHorizontal();				
					           			 
					        if (current_object.settings_foldout)
					        {
					        	GUILayout.Space(5);
			    	     		EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Parent",GUILayout.Width(140));
					           	gui_changed_old = GUI.changed;
					           	gui_changed_window = GUI.changed; GUI.changed = false;
					           	current_object.parent = EditorGUILayout.ObjectField(current_object.parent,Transform,true) as Transform;
				           		if (GUI.changed)
				           		{
				           			if (current_object.parent){current_object.parent_name = current_object.parent.name;}
				           		}
				           		GUI.changed = gui_changed_old;
				           		
				           		if (GUILayout.Button("Create",GUILayout.Width(64)))
				           		{
				           			create_object_parent2(current_object);
				           		}
				           		EditorGUILayout.EndHorizontal();
				           				 	
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Clear Parent",GUILayout.Width(140));
				           		current_object.parent_clear = EditorGUILayout.Toggle(current_object.parent_clear,GUILayout.Width(25));
				           		if (GUILayout.Button("<Clear>",EditorStyles.miniButtonMid,GUILayout.Width(70)))
				           		{
				           			if (key.shift) {
					           			if (!script2)
					           			{
					           				script.clear_parent_object(current_object);
					           			}
					           			else
					           			{
					           				this.ShowNotification(GUIContent("Can't clear parent when Generating"));
					           			}
					           		}
					           		else {
			        					this.ShowNotification(GUIContent("Shift click <Clear> to erase the this placed objects from the Scene, you need to assign a Parent for it to work"));
			        				}
				           		}
				           		EditorGUILayout.EndHorizontal();
				           		
				           		EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Prefab Link",GUILayout.Width(140));
					           	gui_changed_old = GUI.changed;
					           	current_object.prefab = EditorGUILayout.Toggle(current_object.prefab,GUILayout.Width(25));
					           	if (GUI.changed) {
					           		if (current_object.object1) {
						           		if (PrefabUtility.GetPrefabType(current_object.object1) == PrefabType.None || !AssetDatabase.Contains(current_object.object1)) {
											if (current_object.prefab) {
												current_object.prefab = false;
												this.ShowNotification(GUIContent("Selected object is not a prefab. Please select a prefab from your Project window"));
											}
										}
									}
					           	}
					           	GUI.changed = gui_changed_old;
				           		EditorGUILayout.EndHorizontal();
				           				 	
				           		EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Combine Meshes",GUILayout.Width(140));
					           	current_object.combine = EditorGUILayout.Toggle(current_object.combine,GUILayout.Width(25));
				           		EditorGUILayout.EndHorizontal();
				           					
				           		if (current_object.combine)
				           		{
					           		if (prelayer.index > 0)
					           		{
					           			EditorGUILayout.BeginHorizontal();
							           	GUILayout.Space(space+75);
							           	EditorGUILayout.LabelField("Combine Total",GUILayout.Width(140));
							           	current_object.combine_total = EditorGUILayout.Toggle(current_object.combine_total,GUILayout.Width(25));
						           		EditorGUILayout.EndHorizontal();
						           	}
				           						
				           			EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Combine Name",GUILayout.Width(140));
					           		gui_changed_old = GUI.changed;
					           		gui_changed_window = GUI.changed; GUI.changed = false;
					           		current_object.combine_parent_name = EditorGUILayout.TextField(current_object.combine_parent_name);
					           		if (GUI.changed){current_object.combine_parent_name_input = true;}
					           		GUI.changed = gui_changed_old;
				           			EditorGUILayout.EndHorizontal();	
			           			}
			           			
			           			/*
			           			EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Stream",GUILayout.Width(140));
					           	gui_changed_old = GUI.changed;
					           	GUI.changed = false;
					           	current_object.objectStream = EditorGUILayout.Toggle(current_object.objectStream,GUILayout.Width(25));
					           	if (GUI.changed) {
					           		if (current_object.objectStream) {
					           			current_object.combine = false;
					           		}
					           	}
					           	GUI.changed = gui_changed_old;
				           		EditorGUILayout.EndHorizontal();
				           		
				           		if (current_object.objectStream) {
					           		EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Object Index",GUILayout.Width(140));
						           	current_object.objectIndex = EditorGUILayout.IntField(current_object.objectIndex,GUILayout.Width(75));
						           	EditorGUILayout.EndHorizontal();
						        }
						        */
			           			
				           		EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Place Max",GUILayout.Width(140));
					           	current_object.place_maximum = EditorGUILayout.Toggle(current_object.place_maximum,GUILayout.Width(25));
				           		EditorGUILayout.EndHorizontal();	 
				           					
				           		if (current_object.place_maximum)
				           		{
					           		EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Place Max",GUILayout.Width(140));
						           	gui_changed_old = GUI.changed;
						           	gui_changed_window = GUI.changed; GUI.changed = false;
						           	current_object.place_max = EditorGUILayout.IntField(current_object.place_max,GUILayout.Width(250));
						           	if (GUI.changed)
						           	{
						           		gui_changed_old = true;
						           		if (current_object.place_max < 0){current_object.place_max = 0;}
						           	}
						           	GUI.changed = gui_changed_old;
						           	EditorGUILayout.EndHorizontal();
						           				 
						           	if (prelayer.index > 0)
						           	{
							        	EditorGUILayout.BeginHorizontal();
							           	GUILayout.Space(space+75);
							           	EditorGUILayout.LabelField("Place Total",GUILayout.Width(140));
							           	current_object.place_maximum_total = EditorGUILayout.Toggle(current_object.place_maximum_total,GUILayout.Width(25));
						           		EditorGUILayout.EndHorizontal();	
						           	}
						        }
						        if (global_script.settings.tooltip_mode != 0)
				           			{
				           				tooltip_text = "Set these Settings Parameters to all active Objects in this Layer (Click)\n\nSet these Settings Parameters to all Objects in this Layer (Shift Click)";
				           			}
				           			EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           			
				           			if (current_layer.object_output.object.Count > 1)
				           			{
					           			if (GUILayout.Button(GUIContent(">Set All",tooltip_text),GUILayout.Width(65)))
					           			{
					           				UndoRegister("Set All Settings Objects");
					           				current_layer.object_output.set_settings(current_object,count_object,key.shift);	
					           				generate_auto();
					           			}
					           		}
				           			
						        if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_layer;}
							    if (current_object.prelayer_created)
						       	{
							       	if (GUILayout.Button("-Erase Layer Level-",GUILayout.Width(140)) && key.control)
									{
										UndoRegister("Erase Layer Level");
					   					script.erase_prelayer(current_object.prelayer_index);
										current_object.prelayer_created = false;
										script.count_layers();
										this.Repaint();
						       			return;
									}
								}
								else
								{
									
									if(GUILayout.Button("Create Layer Level",GUILayout.Width(140)))
									{
										current_object.prelayer_created = true;
										current_object.prelayer_index = script.prelayers.Count;
										script.add_prelayer(true);
										script.prelayers[script.prelayers.Count-1].prearea.area_max = script.settings.area_max;
										script.prelayers[script.prelayers.Count-1].prearea.max();
										script.set_area_resolution(script.terrains[0],script.prelayers[script.prelayers.Count-1].prearea);
									}
								}
								EditorGUILayout.EndHorizontal();
								if (global_script.settings.color_scheme){GUI.color = Color.white;}
					        }
				           				
			    	     	EditorGUILayout.BeginHorizontal();
			    	     	GUILayout.Space(space+60);
			    	     	gui_changed_old = GUI.changed;
			    	     	current_object.object_material.foldout = EditorGUILayout.Foldout(current_object.object_material.foldout,"Materials");
			    	     	GUI.changed = gui_changed_old;
			    	     	EditorGUILayout.EndHorizontal();
		    	     				 	
		    	     		if (current_object.object_material.foldout)
		    	     		{
		    	     			EditorGUILayout.BeginHorizontal();
			    	     		GUILayout.Space(space+75);
			    	     		if (GUILayout.Button("+",GUILayout.Width(25))){current_object.object_material.add_material(current_object.object_material.material.Count);}	 
			           			if (GUILayout.Button("-",GUILayout.Width(25)) && current_object.object_material.material.Count > 1)
			           			{
			           				if (key.control) {
			           					UndoRegister("Erase Material");
				           				current_object.object_material.erase_material(current_object.object_material.material.Count-1);
				           			    this.Repaint();
			        					return;
			        				}
			        				else {
										this.ShowNotification(GUIContent("Control click the '-' button to erase"));
									}
			           			}
		    	     			EditorGUILayout.EndHorizontal();
				    	     				
				    	     	EditorGUILayout.BeginHorizontal();
			    	     		GUILayout.Space(space+75);
			    	     		EditorGUILayout.LabelField("Active",GUILayout.Width(100));
			    	     		current_object.object_material.active = EditorGUILayout.Toggle(current_object.object_material.active,GUILayout.Width(25));
			    	     		EditorGUILayout.EndHorizontal();
				    	     				
		    	     			for (var count_material: int = 0;count_material < current_object.object_material.material.Count;++count_material)
		    	     			{
		    	     				EditorGUILayout.BeginHorizontal();
				    	     		GUILayout.Space(space+75);
				    	     		EditorGUILayout.LabelField(""+count_material+":",GUILayout.Width(20));
				    	     		current_object.object_material.material[count_material] = EditorGUILayout.ObjectField(current_object.object_material.material[count_material],Material,false);
				    	     		if (GUILayout.Button("+",GUILayout.Width(25))){current_object.object_material.add_material(count_material+1);}	 
				    	     		if (GUILayout.Button("-",GUILayout.Width(25)) && current_object.object_material.material.Count > 1)
				           			{
				           				if (key.control) {
				           					UndoRegister("Erase Material");
					           				current_object.object_material.erase_material(count_material);
					           			    this.Repaint();
				        					return;
				        				}
				        				else {
											this.ShowNotification(GUIContent("Control click the '-' button to erase"));
										}
				           			}
				    	     		EditorGUILayout.EndHorizontal();
				    	     					
				    	     		if (current_object.object_material.material[count_material])
		    	     				{	
				    	     			EditorGUILayout.BeginHorizontal();
				    	     			GUILayout.Space(space+99);
				    	     			var main_color: Color = current_object.object_material.material[count_material].GetColor("_Color");
			    	     				main_color = EditorGUILayout.ColorField(main_color);
			    	     				current_object.object_material.material[count_material].SetColor("_Color",main_color);
			    	     				EditorGUILayout.EndHorizontal();
			    	     				 			
			    	     				gui_changed_old = GUI.changed;
						           		gui_changed_window = GUI.changed; GUI.changed = false;
										EditorGUILayout.BeginHorizontal();
				    	     			GUILayout.Space(space+99);
										current_object.object_material.material_value.value[count_material] = EditorGUILayout.Slider(current_object.object_material.material_value.value[count_material],1,100);
										if (GUI.changed)
										{
											gui_changed_old = true;
											current_object.object_material.material_value.calc_value();
										}
										GUI.changed = gui_changed_old;
										EditorGUILayout.EndHorizontal();
							    	 }
		    	     			}
		    	     		}
		    	     		EditorGUILayout.BeginHorizontal();
				           	GUILayout.Space(space+60);
				           	gui_changed_old = GUI.changed;
		    	     		current_object.transform_foldout = EditorGUILayout.Foldout(current_object.transform_foldout,"Transform");
		    	     		GUI.changed = gui_changed_old;
		    	     		EditorGUILayout.EndHorizontal();
		    	     				 	
		    	     		if (current_object.transform_foldout)
		    	     		{
			    	     		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Scale    ",GUILayout.Width(55));
				           		if (GUILayout.Button("L",GUILayout.Width(20)))
				           		{
				           			current_object.scale_link = !current_object.scale_link;
				           			if (current_object.scale_link)
				           			{
				           				current_object.scale_link_start_y = current_object.scale_link_end_y = current_object.scale_link_start_z = current_object.scale_link_end_z = true;
				           			} 
				           			else
				           			{
				           				current_object.scale_link_start_y = current_object.scale_link_end_y = current_object.scale_link_start_z = current_object.scale_link_end_z = false;
				           			}
				           		}
				           		GUILayout.Space(5);
				           				
				           		// scale
				           		if (GUILayout.Button("X",GUILayout.Width(20))){current_object.scale_start.x = 1;current_object.scale_end.x = 1;}
				           		current_object.scale_start.x = EditorGUILayout.FloatField(Mathf.Round(current_object.scale_start.x*100)/100,GUILayout.Width(40));
				           		if (current_object.scale_start.x > current_object.scale_end.x){current_object.scale_end.x = current_object.scale_start.x;}
				           		EditorGUILayout.MinMaxSlider(current_object.scale_start.x,current_object.scale_end.x,0,10);
				           		current_object.scale_end.x = EditorGUILayout.FloatField(Mathf.Round(current_object.scale_end.x*100)/100,GUILayout.Width(40));
				           		GUILayout.Space(29);
				           		EditorGUILayout.EndHorizontal();
	
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+134);
				           		current_object.scale_link_start_y = EditorGUILayout.Toggle(current_object.scale_link_start_y,GUILayout.Width(25));
				           		if (current_object.scale_link_start_y){current_object.scale_start.y = current_object.scale_start.x;}
				           		if (GUILayout.Button("Y",GUILayout.Width(20))){current_object.scale_start.y = 1;current_object.scale_end.y = 1;}
				           		current_object.scale_start.y = EditorGUILayout.FloatField(Mathf.Round(current_object.scale_start.y*100)/100,GUILayout.Width(40));
				           		if (current_object.scale_start.y > current_object.scale_end.y){current_object.scale_end.y = current_object.scale_start.y;}
				           		EditorGUILayout.MinMaxSlider(current_object.scale_start.y,current_object.scale_end.y,0,10);
				           		current_object.scale_end.y = EditorGUILayout.FloatField(Mathf.Round(current_object.scale_end.y*100)/100,GUILayout.Width(40));
				           		current_object.scale_link_end_y = EditorGUILayout.Toggle(current_object.scale_link_end_y,GUILayout.Width(25));
				           		if (current_object.scale_link_end_y){current_object.scale_end.y = current_object.scale_end.x;}
				           		EditorGUILayout.EndHorizontal();
				           				
				  			    EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+134);
				           		current_object.scale_link_start_z = EditorGUILayout.Toggle(current_object.scale_link_start_z,GUILayout.Width(25));
				           		if (current_object.scale_link_start_z){current_object.scale_start.z = current_object.scale_start.x;}
				           		if (GUILayout.Button("Z",GUILayout.Width(20))){current_object.scale_start.z = 1;current_object.scale_end.z = 1;}
				           		current_object.scale_start.z = EditorGUILayout.FloatField(Mathf.Round(current_object.scale_start.z*100)/100,GUILayout.Width(40));
				           		if (current_object.scale_start.z > current_object.scale_end.z){current_object.scale_end.z = current_object.scale_start.z;}
				           		EditorGUILayout.MinMaxSlider(current_object.scale_start.z,current_object.scale_end.z,0,10);
				           		current_object.scale_end.z = EditorGUILayout.FloatField(Mathf.Round(current_object.scale_end.z*100)/100,GUILayout.Width(40));
				           		current_object.scale_link_end_z = EditorGUILayout.Toggle(current_object.scale_link_end_z,GUILayout.Width(25));
				           		if (current_object.scale_link_end_z){current_object.scale_end.z = current_object.scale_end.x;}
				           		EditorGUILayout.EndHorizontal();
	         				 	
	         				    // unlink
	         				    EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+132);
				           		EditorGUILayout.LabelField("Unlink Y",GUILayout.Width(95));
				           		current_object.unlink_y = EditorGUILayout.Slider(current_object.unlink_y,0,2);
				           		GUILayout.Space(29);
				           		EditorGUILayout.EndHorizontal();
				           		
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+132);
				           		EditorGUILayout.LabelField("Unlink Z",GUILayout.Width(95));
				           		current_object.unlink_z = EditorGUILayout.Slider(current_object.unlink_z,0,2);
				           		GUILayout.Space(29);
				           		EditorGUILayout.EndHorizontal();
				           		
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+132);
				           		EditorGUILayout.LabelField("Scale Curve",GUILayout.Width(95));
				           		current_object.scaleCurve = EditorGUILayout.CurveField(current_object.scaleCurve);
				           		GUILayout.Space(29);
				           		EditorGUILayout.EndHorizontal();
									         				    	         				 				 			 			 
	         				 	// rotation
	         				 	GUILayout.Space(4);
				           		EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75); 
				           		EditorGUILayout.LabelField("Rotation",GUILayout.Width(55)); 
				           		if (GUILayout.Button("L",GUILayout.Width(20)))
				           		{
				           			current_object.rotation_link = !current_object.rotation_link;
				           			if (current_object.rotation_link)
				           			{
				           				current_object.rotation_link_start_y = current_object.rotation_link_end_y = current_object.rotation_link_start_z = current_object.rotation_link_end_z = true;
				           			} 
				           			else
				           			{
				           				current_object.rotation_link_start_y = current_object.rotation_link_end_y = current_object.rotation_link_start_z = current_object.rotation_link_end_z = false;
				           			}
				           		}
			 	          		GUILayout.Space(5);
				           		if (GUILayout.Button("X",GUILayout.Width(20))){current_object.rotation_start.x = 0;current_object.rotation_end.x = 0;}
				           		current_object.rotation_start.x = EditorGUILayout.FloatField(Mathf.Round(current_object.rotation_start.x*100)/100,GUILayout.Width(40));
				           		if (current_object.rotation_start.x > current_object.rotation_end.x){current_object.rotation_end.x = current_object.rotation_start.x;}
				           		EditorGUILayout.MinMaxSlider(current_object.rotation_start.x,current_object.rotation_end.x,-180,180);
				           		current_object.rotation_end.x = EditorGUILayout.FloatField(Mathf.Round(current_object.rotation_end.x*100)/100,GUILayout.Width(40));
				           		EditorGUILayout.LabelField("",GUILayout.Width(25));
				           		EditorGUILayout.EndHorizontal();
	
	           				 	EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("",GUILayout.Width(55));
				           		current_object.rotation_link_start_y = EditorGUILayout.Toggle(current_object.rotation_link_start_y,GUILayout.Width(25));
				           		if (current_object.rotation_link_start_y){current_object.rotation_start.y = current_object.rotation_start.x;}
				           		if (GUILayout.Button("Y",GUILayout.Width(20))){current_object.rotation_start.y = 0;current_object.rotation_end.y = 0;}
				           		current_object.rotation_start.y = EditorGUILayout.FloatField(Mathf.Round(current_object.rotation_start.y*100)/100,GUILayout.Width(40));
				           		if (current_object.rotation_start.y > current_object.rotation_end.y){current_object.rotation_end.y = current_object.rotation_start.y;}
				           		EditorGUILayout.MinMaxSlider(current_object.rotation_start.y,current_object.rotation_end.y,-180,180);
				           		current_object.rotation_end.y = EditorGUILayout.FloatField(Mathf.Round(current_object.rotation_end.y*100)/100,GUILayout.Width(40));
				           		current_object.rotation_link_end_y = EditorGUILayout.Toggle(current_object.rotation_link_end_y,GUILayout.Width(25));
				           		if (current_object.rotation_link_end_y){current_object.rotation_end.y = current_object.rotation_end.x;}
				           		EditorGUILayout.EndHorizontal();
				           				
				  			    EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("",GUILayout.Width(55));
				           		current_object.rotation_link_start_z = EditorGUILayout.Toggle(current_object.rotation_link_start_z,GUILayout.Width(25));
				           		if (current_object.rotation_link_start_z){current_object.rotation_start.z = current_object.rotation_start.x;}
				           		if (GUILayout.Button("Z",GUILayout.Width(20))){current_object.rotation_start.z = 0;current_object.rotation_end.z = 0;}
				           		current_object.rotation_start.z = EditorGUILayout.FloatField(Mathf.Round(current_object.rotation_start.z*100)/100,GUILayout.Width(40));
				           		if (current_object.rotation_start.z > current_object.rotation_end.z){current_object.rotation_end.z = current_object.rotation_start.z;}
				           		EditorGUILayout.MinMaxSlider(current_object.rotation_start.z,current_object.rotation_end.z,-180,180);
				           		current_object.rotation_end.z = EditorGUILayout.FloatField(Mathf.Round(current_object.rotation_end.z*100)/100,GUILayout.Width(40));
				           		current_object.rotation_link_end_z = EditorGUILayout.Toggle(current_object.rotation_link_end_z,GUILayout.Width(25));
				           		if (current_object.rotation_link_end_z){current_object.rotation_end.z = current_object.rotation_end.x;}
				           		EditorGUILayout.EndHorizontal();
				           				 	
				           		// position
	  			           		GUILayout.Space(4);
				           		EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Position",GUILayout.Width(55));
					           	GUILayout.Space(29);
					           	if (GUILayout.Button("X",GUILayout.Width(20))){current_object.position_start.x = 0;current_object.position_end.x = 0;}
					           	current_object.position_start.x = EditorGUILayout.FloatField(current_object.position_start.x,GUILayout.Width(40));
					           	EditorGUILayout.MinMaxSlider(current_object.position_start.x,current_object.position_end.x,-1000,1000);
					           	current_object.position_end.x = EditorGUILayout.FloatField(current_object.position_end.x,GUILayout.Width(40));
					           	if (current_object.position_start.x > current_object.position_end.x){current_object.position_end.x = current_object.position_start.x;}
					           	GUILayout.Space(space+10);
					           	EditorGUILayout.EndHorizontal();		           				 	
					           			
					           	EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+79);
				           		EditorGUILayout.LabelField("",GUILayout.Width(80)); 		
					           	if (GUILayout.Button("Y",GUILayout.Width(20))){current_object.position_start.y = 0;current_object.position_end.y = 0;}
					           	current_object.position_start.y = EditorGUILayout.FloatField(current_object.position_start.y,GUILayout.Width(40));
					           	EditorGUILayout.MinMaxSlider(current_object.position_start.y,current_object.position_end.y,-1000,1000);
					           	current_object.position_end.y = EditorGUILayout.FloatField(current_object.position_end.y,GUILayout.Width(40));
					           	if (current_object.position_start.y > current_object.position_end.y){current_object.position_end.y = current_object.position_start.y;}
					           	GUILayout.Space(space+10);
					           	EditorGUILayout.EndHorizontal();	 		 		
					           					 		 		
					           	EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+79);
				           		EditorGUILayout.LabelField("",GUILayout.Width(80)); 		
					           	if (GUILayout.Button("Z",GUILayout.Width(20))){current_object.position_start.z = 0;current_object.position_end.z = 0;}
					           	current_object.position_start.z = EditorGUILayout.FloatField(current_object.position_start.z,GUILayout.Width(40));
					           	EditorGUILayout.MinMaxSlider(current_object.position_start.z,current_object.position_end.z,-1000,1000);
					           	current_object.position_end.z = EditorGUILayout.FloatField(current_object.position_end.z,GUILayout.Width(40));
					           	if (current_object.position_start.z > current_object.position_end.z){current_object.position_end.z = current_object.position_start.z;}
					           	GUILayout.Space(space+10);
					           	EditorGUILayout.EndHorizontal();
					           	
					           	EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+75);
								EditorGUILayout.LabelField("Ray Cast",GUILayout.Width(150));
								current_object.raycast = EditorGUILayout.Toggle(current_object.raycast,GUILayout.Width(25));
								EditorGUILayout.EndHorizontal();
					           	
					           	if (current_object.raycast) {
						           	EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+85);
									EditorGUILayout.LabelField("Ray Cast Mode",GUILayout.Width(140));
									current_object.raycast_mode = EditorGUILayout.EnumPopup(current_object.raycast_mode);
									EditorGUILayout.EndHorizontal();
						
						           	EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+85);
									EditorGUILayout.LabelField("Layer",GUILayout.Width(140));
									current_object.layerMask = EditorGUILayout.MaskField(current_object.layerMask,layerMasks_display);
									if (GUILayout.Button("Refresh",EditorStyles.miniButtonMid,GUILayout.Width(65))) {
										create_layer_mask();
									}
									GUILayout.Space(5);
									EditorGUILayout.EndHorizontal();
									
									EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+85);
									EditorGUILayout.LabelField("Cast Direction",GUILayout.Width(140));
									EditorGUILayout.LabelField("X",GUILayout.Width(15));
									current_object.ray_direction.x = EditorGUILayout.FloatField(current_object.ray_direction.x);
									EditorGUILayout.LabelField("Y",GUILayout.Width(15));
									current_object.ray_direction.y = EditorGUILayout.FloatField(current_object.ray_direction.y);
									EditorGUILayout.LabelField("Z",GUILayout.Width(15));
									current_object.ray_direction.z = EditorGUILayout.FloatField(current_object.ray_direction.z);
									EditorGUILayout.EndHorizontal();
									
									EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+85);
									EditorGUILayout.LabelField("Cast Height",GUILayout.Width(140));
									current_object.cast_height = EditorGUILayout.FloatField(current_object.cast_height);
									EditorGUILayout.EndHorizontal();
									
									EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+85);
									EditorGUILayout.LabelField("Ray Length",GUILayout.Width(140));
									current_object.ray_length = EditorGUILayout.FloatField(current_object.ray_length);
									EditorGUILayout.EndHorizontal();
									
									EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+85);
									EditorGUILayout.LabelField("Ray Radius",GUILayout.Width(140));
									current_object.ray_radius = EditorGUILayout.FloatField(current_object.ray_radius);
									EditorGUILayout.EndHorizontal();
								}
								
								EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+75);
									EditorGUILayout.LabelField("Sphere Overlap Radius",GUILayout.Width(150));
									current_object.sphereOverlapRadius = EditorGUILayout.FloatField(current_object.sphereOverlapRadius);
								EditorGUILayout.EndHorizontal();
					           	
					           	EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+75);
									EditorGUILayout.LabelField("Sphere Overlap Height",GUILayout.Width(150));
									current_object.sphereOverlapHeight = EditorGUILayout.FloatField(current_object.sphereOverlapHeight);
								EditorGUILayout.EndHorizontal();
								
								EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+75);
									EditorGUILayout.LabelField("Slope Y",GUILayout.Width(150));
									current_object.slopeY = EditorGUILayout.FloatField(current_object.slopeY);
								EditorGUILayout.EndHorizontal();
					           	
					           	/*
					           	EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Equal Density Resolution",GUILayout.Width(150));
				           		current_object.equal_density = EditorGUILayout.Toggle(current_object.equal_density,GUILayout.Width(25));
				           	   	EditorGUILayout.EndHorizontal();
					           	*/
					           	
					           	EditorGUILayout.BeginHorizontal();
				           		GUILayout.Space(space+75);
				           		EditorGUILayout.LabelField("Random Position",GUILayout.Width(150));
				           		current_object.random_position = EditorGUILayout.Toggle(current_object.random_position,GUILayout.Width(25));
				           	   	EditorGUILayout.EndHorizontal();	
				           	   	
				           	   	EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+75);
								EditorGUILayout.LabelField("Pivot Center",GUILayout.Width(150));
								current_object.pivot_center = EditorGUILayout.Toggle(current_object.pivot_center,GUILayout.Width(25));
								EditorGUILayout.EndHorizontal();
								
								EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Include Object Scale",GUILayout.Width(150));
					           	current_object.includeScale = EditorGUILayout.Toggle(current_object.includeScale,GUILayout.Width(25));
					           	EditorGUILayout.EndHorizontal();	
					           					
					           	EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Include Terrain Height",GUILayout.Width(150));
					           	current_object.terrain_height = EditorGUILayout.Toggle(current_object.terrain_height,GUILayout.Width(25));
					           	EditorGUILayout.EndHorizontal();	
					           				
					           	EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Include Terrain Rotation",GUILayout.Width(150));
					           	current_object.terrain_rotate = EditorGUILayout.Toggle(current_object.terrain_rotate,GUILayout.Width(25));
					           	EditorGUILayout.EndHorizontal();
					           	
					           	EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Look at Object",GUILayout.Width(150));
						           	current_object.lookAtObject = EditorGUILayout.ObjectField(current_object.lookAtObject,Transform,true) as Transform;
					           	EditorGUILayout.EndHorizontal();	
					           	
//					           	EditorGUILayout.BeginHorizontal();
//					           	GUILayout.Space(space+75);
//					           	EditorGUILayout.LabelField("Place in Terrain Bounds",GUILayout.Width(150));
//					           	current_object.placeInside = EditorGUILayout.Toggle(current_object.placeInside,GUILayout.Width(25));
//					           	EditorGUILayout.EndHorizontal();	
					           				
					           	if (global_script.settings.tooltip_mode != 0)
						        {
						        	tooltip_text = "Set these Transform Parameters to all active Objects in this Layer (Click)\n\nSet these Transform Parameters to all Objects in this Layer (Shift Click)";
						        }
						        if (current_layer.object_output.object.Count > 1)
						        {
							    	EditorGUILayout.BeginHorizontal();
							        GUILayout.Space(space+75);
							        if (GUILayout.Button(GUIContent(">Set All",tooltip_text),GUILayout.Width(65)))
							        {
							        	UndoRegister("Set All Transforms Objects");
							        	generate_auto();
							           	current_layer.object_output.set_transform(current_object,count_object,key.shift);	
							        }
							        EditorGUILayout.EndHorizontal();
							    }
							}
							
				           	EditorGUILayout.BeginHorizontal();
					        GUILayout.Space(space+60);
					        gui_changed_old = GUI.changed;
					        current_object.rotation_foldout = EditorGUILayout.Foldout(current_object.rotation_foldout,"Rotation");
					        GUI.changed = gui_changed_old;
					        EditorGUILayout.EndHorizontal();	
					           				
				           	if (current_object.rotation_foldout)
				           	{
//					        	EditorGUILayout.BeginHorizontal();
//					           	GUILayout.Space(space+75);
//					           	gui_changed_old = GUI.changed;
//					           	current_object.rotation_map_foldout = EditorGUILayout.Foldout(current_object.rotation_map_foldout,"Rotation Map");
//					           	GUI.changed = gui_changed_old;
//					           	EditorGUILayout.EndHorizontal();	
//					           				
//				           				
//					           	if (current_object.rotation_map_foldout)
//					           	{
//					           		EditorGUILayout.BeginHorizontal();
//					           		GUILayout.Space(space+90);
//					           		EditorGUILayout.LabelField("Active",GUILayout.Width(115));
//					           		current_object.rotation_map.active = EditorGUILayout.Toggle(current_object.rotation_map.active,GUILayout.Width(25));
//					           		EditorGUILayout.EndHorizontal();	
//					           				
//					           		draw_image(current_object.rotation_map.preimage,space-120,color_object,false,5);
//					           	}
//					           			
					           	EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Rotation Snapping",GUILayout.Width(140));
					           	current_object.rotation_steps = EditorGUILayout.Toggle(current_object.rotation_steps,GUILayout.Width(25));
					           	EditorGUILayout.EndHorizontal();	
					           				
					           	if (current_object.rotation_steps)
					           	{
						        	EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Rotation Snap X",GUILayout.Width(140));
					           		current_object.rotation_step.x = EditorGUILayout.FloatField(current_object.rotation_step.x);
					           		EditorGUILayout.EndHorizontal();
					           				 	
					           		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Rotation Snap Y",GUILayout.Width(140));
					           		current_object.rotation_step.y = EditorGUILayout.FloatField(current_object.rotation_step.y);
					           		EditorGUILayout.EndHorizontal();
					           				 	
					           		EditorGUILayout.BeginHorizontal();
					           		GUILayout.Space(space+75);
					           		EditorGUILayout.LabelField("Rotation Snap Z",GUILayout.Width(140));
					           		current_object.rotation_step.z = EditorGUILayout.FloatField(current_object.rotation_step.z);
					           		EditorGUILayout.EndHorizontal();
					           	} 	
					           				
					           	EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Look at Parent",GUILayout.Width(140));
					           	current_object.look_at_parent = EditorGUILayout.Toggle(current_object.look_at_parent,GUILayout.Width(25));
					           	EditorGUILayout.EndHorizontal();
					           				
					           	if (global_script.settings.tooltip_mode != 0)
						        {
						        	tooltip_text = "Set these Rotation Parameters to all active Objects in this Layer (Click)\n\nSet these Rotation Parameters to all Objects in this Layer (Shift Click)";
						  		}
						  		if (current_layer.object_output.object.Count > 1)
						    	{
							    	EditorGUILayout.BeginHorizontal();
							        GUILayout.Space(space+75);
							        if (GUILayout.Button(GUIContent(">Set All",tooltip_text),GUILayout.Width(65)))
							        {
							        	UndoRegister("Set All Rotation Objects");
							        	generate_auto();
							           	current_layer.object_output.set_rotation(current_object,count_object,key.shift);	
							        }
							        EditorGUILayout.EndHorizontal();
							    }
							}	 		 		 		 		 		
				           				
				           	EditorGUILayout.BeginHorizontal();
				           	GUILayout.Space(space+60);
				           	gui_changed_old = GUI.changed;
				           	current_object.distance_foldout = EditorGUILayout.Foldout(current_object.distance_foldout,"Distance");
				           	GUI.changed = gui_changed_old;
				           	EditorGUILayout.EndHorizontal();
				           				
				           	if (current_object.distance_foldout)
				           	{ 
					        	EditorGUILayout.BeginHorizontal();
					           	GUILayout.Space(space+75);
					           	EditorGUILayout.LabelField("Distance Level",GUILayout.Width(140));
					           	current_object.distance_level = EditorGUILayout.EnumPopup(current_object.distance_level,GUILayout.Width(250));
					           	EditorGUILayout.EndHorizontal();
					           	
					        	if (current_object.distance_mode == distance_mode_enum.Square)
								{
									EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Distance Rotation",GUILayout.Width(140));
						           	current_object.distance_rotation_mode = EditorGUILayout.EnumPopup(current_object.distance_rotation_mode,GUILayout.Width(250));
						           	EditorGUILayout.EndHorizontal();
												
									EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Min. Distance X",GUILayout.Width(140));
						           	current_object.min_distance.x = EditorGUILayout.Slider(current_object.min_distance.x,0,2048,GUILayout.Width(250));
						           	EditorGUILayout.EndHorizontal();
						           				
						           	EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Min. Distance Z",GUILayout.Width(140));
						           	current_object.min_distance.z = EditorGUILayout.Slider(current_object.min_distance.z,0,2048,GUILayout.Width(250));
						           	EditorGUILayout.EndHorizontal();
						        }
						        else
						        {
						        	EditorGUILayout.BeginHorizontal();
						           	GUILayout.Space(space+75);
						           	EditorGUILayout.LabelField("Min. Distance",GUILayout.Width(140));
						           	current_object.min_distance.x = EditorGUILayout.Slider(current_object.min_distance.x,0,2048,GUILayout.Width(250));
						           	EditorGUILayout.EndHorizontal();
						        }
						           			
						        EditorGUILayout.BeginHorizontal();
						        GUILayout.Space(space+75);
						        EditorGUILayout.LabelField("Include Scale",GUILayout.Width(140));
						        current_object.distance_include_scale = EditorGUILayout.Toggle(current_object.distance_include_scale,GUILayout.Width(25));
						        EditorGUILayout.EndHorizontal();
						           			
						        EditorGUILayout.BeginHorizontal();
						        GUILayout.Space(space+75);
						        EditorGUILayout.LabelField("Include Scale Group",GUILayout.Width(140));
						        current_object.distance_include_scale_group = EditorGUILayout.Toggle(current_object.distance_include_scale_group,GUILayout.Width(25));
						        EditorGUILayout.EndHorizontal();
						           			
						        if (global_script.settings.tooltip_mode != 0)
						        {
						        	tooltip_text = "Set these Distance Parameters to all active Objects in this Layer (Click)\n\nSet these Distance Parameters to all Objects in this Layer (Shift Click)";
						        }
						        if (current_layer.object_output.object.Count > 1)
						        {
							    	EditorGUILayout.BeginHorizontal();
							        GUILayout.Space(space+75);
							        if (GUILayout.Button(GUIContent(">Set All",tooltip_text),GUILayout.Width(65)))
							        {
							        	UndoRegister("Set All Distance Objects");
							        	generate_auto();
							           	current_layer.object_output.set_distance(current_object,count_object,key.shift);	
							        }
							        EditorGUILayout.EndHorizontal();
							    }
							}
			           			
							if (current_object.prelayer_created)
							{
								if (global_script.settings.color_scheme){GUI.color = global_script.settings.color.color_layer;}
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+60);
											
								EditorGUILayout.EndHorizontal();
								draw_prelayer(script.prelayers[current_object.prelayer_index],current_object.prelayer_index,space+60,String.Empty,0);
								current_layer = prelayer.layer[layer_number];
							}
						}			
						
						color_object = global_script.settings.color.color_object;
		           		if (!current_layer.object_output.object_value.active[count_object])
						{
							GUI.color = color_object;
						}
					}GUILayout.Space(5);
				}GUILayout.Space(1); 
			}
			
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+30);
				current_layer.height_output.perlin_foldout = EditorGUILayout.Foldout(current_layer.height_output.perlin_foldout,"Perlin Total");
				EditorGUILayout.EndHorizontal();
				
				if (current_layer.height_output.perlin_foldout)
				{
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+45);
					EditorGUILayout.LabelField("Zoom",GUILayout.Width(147));
					current_layer.zoom = EditorGUILayout.Slider(current_layer.zoom,0,10);
					EditorGUILayout.EndHorizontal();
					
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+45);
					EditorGUILayout.LabelField("Offset Range",GUILayout.Width(147));
					if (current_layer.offset_range.x < 1){EditorGUILayout.LabelField(current_layer.offset_range.x.ToString("F2"),GUILayout.Width(50));}
						else {EditorGUILayout.LabelField(current_layer.offset_range.x.ToString("F0"),GUILayout.Width(50));}
					if (GUILayout.Button("+",EditorStyles.miniButtonMid,GUILayout.Width(30)))
					{
						current_layer.offset_range.x *= 2;
						current_layer.offset_range.y *= 2;
						current_layer.offset_middle.x = current_layer.offset.x;
						current_layer.offset_middle.y = current_layer.offset.y;
					}
					if (GUILayout.Button("-",EditorStyles.miniButtonMid,GUILayout.Width(30)))
					{
						if (current_layer.offset_range.x > 0.001)
						{
							current_layer.offset_range.x = current_layer.offset_range.x / 2;
							current_layer.offset_range.y = current_layer.offset_range.y / 2;
							current_layer.offset_middle.x = current_layer.offset.x;
							current_layer.offset_middle.y = current_layer.offset.y;
						}
					}
					GUILayout.Space(5);
					if (GUILayout.Button("Randomize",EditorStyles.miniButtonMid,GUILayout.Width(70)))
					{
						UnityEngine.Random.seed = EditorApplication.timeSinceStartup;
						current_layer.offset = Vector2(UnityEngine.Random.Range(-current_layer.offset_range.x+current_layer.offset_middle.x,current_layer.offset_range.y+current_layer.offset_middle.x),UnityEngine.Random.Range(-current_layer.offset_range.y+current_layer.offset_middle.y,current_layer.offset_range.y+current_layer.offset_middle.y));
						generate_auto();
					}
					if (GUILayout.Button("Reset",EditorStyles.miniButtonMid,GUILayout.Width(70)))
					{
						current_layer.offset = Vector2(0,0);
						current_layer.offset_middle = Vector2(0,0);
						generate_auto();
					}
					EditorGUILayout.EndHorizontal();							
								
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+45);
					EditorGUILayout.LabelField("Offset X",GUILayout.Width(147));
					current_layer.offset.x = EditorGUILayout.Slider(current_layer.offset.x,-current_layer.offset_range.x+current_layer.offset_middle.x,current_layer.offset_range.y+current_layer.offset_middle.x);
					EditorGUILayout.EndHorizontal();
							
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+45);
					EditorGUILayout.LabelField("Offset Y",GUILayout.Width(147));
					current_layer.offset.y = EditorGUILayout.Slider(current_layer.offset.y,-current_layer.offset_range.y+current_layer.offset_middle.y,current_layer.offset_range.y+current_layer.offset_middle.y);
					EditorGUILayout.EndHorizontal();
				}
			
			switch (current_layer.output)
			{	
				case layer_output_enum.heightmap:
					filter_text2 = "Height Select";
					subfilter_text2 = "Height Select";
					break;
				case layer_output_enum.color:
					filter_text2 = "Color Select";
					subfilter_text2 = "Color Alpha";
					break;
				case layer_output_enum.splat:
					filter_text2 = "Splat Select";
					subfilter_text2 = "Splat Alpha";
					break;
				case layer_output_enum.tree:
					filter_text2 = "Tree Select";
					subfilter_text2 = "Tree Density";
					break;
				case layer_output_enum.grass:
					filter_text2 = "Grass Select";
					subfilter_text2 = "Grass Density";
					break;
				case layer_output_enum.object:
					filter_text2 = "Object Select";
					subfilter_text2 = "Object Density";
					break;
			}
			
			if (script.settings.filter_select_text)
			{
				filter_text = filter_text2;
				subfilter_text = subfilter_text2;
			}
			else
			{
				filter_text = "Filter";
				subfilter_text = "Mask";
			}
			draw_filter(prelayer,current_layer.prefilter,script.filter,space,global_script.settings.color.color_filter,global_script.settings.color.color_subfilter,0,count_layer);
		}
		if (script.settings.box_scheme){GUILayout.EndVertical();}
	}	
	// if (script.settings.box_scheme && prelayer.foldout){GUILayout.Space(5);GUILayout.EndVertical();}
}
 	
	function draw_filter(prelayer: prelayer_class,prefilter: prefilter_class,filter: List.<filter_class>,space: int,color_filter: Color,color_subfilter: Color,position_prefilter: int,current_number: int)
	{
		if (position_prefilter == 1){filter_text = "Tree Scale Select";subfilter_text = "Tree Color Select";} 
		if (!current_layer.active){color_filter += Color(0,0,0,-0.4);}
		if (global_script.settings.color_scheme){GUI.color = color_filter;}
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+30);
		gui_changed_old = GUI.changed;
		prefilter.foldout = EditorGUILayout.Foldout(prefilter.foldout,prefilter.filter_text);
		GUI.changed = gui_changed_old;
		EditorGUILayout.EndHorizontal();
		        	
		if (prefilter.foldout)
		{
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+45);
			if (GUILayout.Button("+",GUILayout.Width(25)))
			{
				add_filter(prefilter.filter_index.Count-1,prelayer,prefilter);
				generate_auto();
			}
			if (GUILayout.Button("-",GUILayout.Width(25)) && prefilter.filter_index.Count > 0)
			{
				if (key.control) {
					if (!key.shift)
					{
						erase_filter(prefilter.filter_index.Count-1,prefilter);
					}
					else
					{
						UndoRegister("Erase Filters");
						script.erase_filters(prefilter);
					}
					generate_auto();
				}
				else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
				}
			}
			if (prefilter.filter_index.Count > 0) {
				if (GUILayout.Button("F",GUILayout.Width(20)))
				{
					prefilter.filters_foldout = !prefilter.filters_foldout;
					script.change_filters_foldout(prefilter,key.shift);
				}
				EditorGUILayout.LabelField("");
				
				if (GUILayout.Button("A",GUILayout.Width(20)))
				{
					prefilter.filters_active = !prefilter.filters_active;
					script.change_filters_active(prefilter,key.shift);
					generate_auto();
				}
				GUILayout.Space(163);
			}
			
			if (position_prefilter == 1)
			{
				if (current_layer.tree_output.tree.Count > 1)
				{
					if (GUILayout.Button(">Set All",GUILayout.Width(65)))
					{
						UndoRegister("Set All Tree Filters");
						generate_auto();
						script.set_all_tree_filters(current_layer.tree_output,current_number,key.shift);
					}
				}
			}
			EditorGUILayout.EndHorizontal();
		}
		   	
		// filter loop
		for (count_filter = 0;count_filter < prefilter.filter_index.Count;++count_filter)
		{
			current_filter = script.filter[prefilter.filter_index[count_filter]];
				
			if (prefilter.foldout)
			{
				color_filter = global_script.settings.color.color_filter;
				
				if (!current_filter.active){color_filter += Color(-0.3,-0.3,-0.3,0);}
				if (!current_layer.active){color_filter += Color(0,0,0,-0.4);}
		        	
		        if (current_filter.color_filter != color_filter)
			    {
			    	if (current_filter.color_filter[0] > color_filter[0]){current_filter.color_filter[0] -= 0.004;} 
			        	else if (current_filter.color_filter[0]+0.01 < color_filter[0]){current_filter.color_filter[0] += 0.004;}	
			        		else {current_filter.color_filter[0] = color_filter[0];}
			        if (current_filter.color_filter[1] > color_filter[1]){current_filter.color_filter[1] -= 0.004;} 
			        	else if (current_filter.color_filter[1]+0.01 < color_filter[1]){current_filter.color_filter[1] += 0.004;}
			           		else {current_filter.color_filter[1] = color_filter[1];}
					if (current_filter.color_filter[2] > color_filter[2]){current_filter.color_filter[2] -= 0.004;} 
						else if (current_filter.color_filter[2]+0.01 < color_filter[2]){current_filter.color_filter[2] += 0.004;}
							else {current_filter.color_filter[2] = color_filter[2];}
					if (current_filter.color_filter[3] > color_filter[3]){current_filter.color_filter[3] -= 0.004;} 
						else if (current_filter.color_filter[3]+0.01 < color_filter[3]){current_filter.color_filter[3] += 0.004;}
							else {current_filter.color_filter[3] = color_filter[3];}
			        this.Repaint();
				}
				if (global_script.settings.color_scheme){GUI.color = current_filter.color_filter;} else {GUI.color = Color.white;}
				
				if (script.settings.box_scheme){GUILayout.BeginVertical("Box");}												
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+45);
				
				// filter text
				if (!script.settings.database_display)
				{
					gui_changed_old = GUI.changed;
					current_filter.foldout = EditorGUILayout.Foldout(current_filter.foldout,filter_text+count_filter+" ("+current_filter.type+")");
					GUI.changed = gui_changed_old;
				}
				else
				{
					gui_changed_old = GUI.changed;
					current_filter.foldout = EditorGUILayout.Foldout(current_filter.foldout,filter_text+""+count_filter+" ("+current_filter.type+")"+":--> "+prefilter.filter_index[count_filter]);
					GUI.changed = gui_changed_old;
				}
				if (!global_script.settings.toggle_text_no)
				{
					if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
				}
				
				current_filter.active = EditorGUILayout.Toggle(current_filter.active,GUILayout.Width(25));
				
				if (count_filter > 0) {			 			 
					if (GUILayout.Button("▲",GUILayout.Width(25)) && count_filter > 0)
					{
						script.swap_filter(prefilter,count_filter,prefilter,count_filter-1);
						generate_auto();
					} 
				}
				else {
					GUILayout.Space(29);
				}
				if (count_filter < prefilter.filter_index.Count-1) {
					if (GUILayout.Button("▼",GUILayout.Width(25)))
					{
						script.swap_filter(prefilter,count_filter,prefilter,count_filter+1);
						generate_auto();
					} 		 
				}
				else {
					GUILayout.Space(29);
				}
				if (GUILayout.Button(current_filter.swap_text,GUILayout.Width(35)))
		        {
					swap_filter(current_filter,count_filter,prefilter);
			  	} 
				if (GUILayout.Button("+",GUILayout.Width(25)))
				{
					add_filter(count_filter,prelayer,prefilter);
					generate_auto();
				} 		 
				if (GUILayout.Button("-",GUILayout.Width(25)) && prefilter.filter_index.Count > 0)
				{
					if (key.control) {
						erase_filter(count_filter,prefilter);
						generate_auto();
					}
					else {
						this.ShowNotification(GUIContent("Control click the '-' button to erase"));
					}
				} 
									 
				EditorGUILayout.EndHorizontal();
							
				GUILayout.Space(2);
				if (current_filter.foldout)
				{
					GUILayout.Space(5);
					if (current_layer.output == layer_output_enum.color)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						current_filter.color_output_index = EditorGUILayout.Popup("Color Output",current_filter.color_output_index,current_layer.color_output.precolor_range_enum);
						EditorGUILayout.EndHorizontal();
					}
					
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+60);
					EditorGUILayout.LabelField("Device",GUILayout.Width(145));
					current_filter.device = EditorGUILayout.EnumPopup(current_filter.device);
					/*
					GUI.color = Color.white;
					if (GUILayout.Button("Preview",GUILayout.Width(70)))
					{
						script.generate_filter(current_filter);
					}
					EditorGUILayout.LabelField(GUIContent(current_filter.preview_texture),GUILayout.Width(128),GUILayout.Height(128));
					GUI.color = color_filter;
					*/
					EditorGUILayout.EndHorizontal();
					
					GUILayout.Space(5);
					
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+60);
					EditorGUILayout.LabelField("Input",GUILayout.Width(145));
					if (current_filter.device == filter_devices_enum.Standard)
					{
						gui_changed_old = GUI.changed;
						gui_changed_window = GUI.changed; 
						GUI.changed = false;
						if (current_layer.output == layer_output_enum.heightmap) {
							current_filter.type = script.GetCondtionTypeEnum(EditorGUILayout.EnumPopup(script.GetHeightmapEnum(current_filter.type)));
						}
						else {
							current_filter.type = EditorGUILayout.EnumPopup(current_filter.type);
						}
						if (GUI.changed)
						{
							// if (preview_window){preview_window.text = current_filter.type.ToString();preview_window.Repaint();}
							gui_changed_old = true;
							if (current_filter.type == condition_type_enum.RawHeightmap)
							{
								if (current_filter.raw == null)
								{
									current_filter.raw = new raw_class();
								}
							}
						}
						GUI.changed = gui_changed_old;
					}
					else if (current_filter.device == filter_devices_enum.Math)
					{
						current_filter.type2 = EditorGUILayout.EnumPopup(current_filter.type2);
					}
					EditorGUILayout.EndHorizontal();
					
					if (current_filter.type == condition_type_enum.RawHeightmap)
					{
						draw_raw_heightmap(current_filter.raw,space);	 
					}
					else if (current_filter.type == condition_type_enum.Image)
					{
						draw_image(current_filter.preimage,space,color_filter,true,1);			
					}
					else if (current_filter.type == condition_type_enum.Direction)
					{	
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Normal X",GUILayout.Width(80));
						if (GUILayout.Button(current_filter.precurve_x_left.curve_text,GUILayout.Width(63)))
						{
							curve_menu_button(current_filter.precurve_x_left,script.get_output_length(current_layer),current_filter.curve_x_left_menu_rect);
						}
						if (key.type == EventType.Repaint){current_filter.curve_x_left_menu_rect = GUILayoutUtility.GetLastRect();}
						current_filter.precurve_x_left.curve = EditorGUILayout.CurveField(current_filter.precurve_x_left.curve);
						current_filter.precurve_x_right.curve = EditorGUILayout.CurveField(current_filter.precurve_x_right.curve);
						if (GUILayout.Button(current_filter.precurve_x_right.curve_text,GUILayout.Width(63)))
						{
							curve_menu_button(current_filter.precurve_x_right,script.get_output_length(current_layer),current_filter.curve_x_right_menu_rect);
						}
						if (key.type == EventType.Repaint){current_filter.curve_x_right_menu_rect = GUILayoutUtility.GetLastRect();}
						EditorGUILayout.EndHorizontal();
											
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Normal Z",GUILayout.Width(80));
						if (GUILayout.Button(current_filter.precurve_z_left.curve_text,GUILayout.Width(63)))
						{
							curve_menu_button(current_filter.precurve_z_left,script.get_output_length(current_layer),current_filter.curve_z_left_menu_rect);
						}
						if (key.type == EventType.Repaint){current_filter.curve_z_left_menu_rect = GUILayoutUtility.GetLastRect();}
						current_filter.precurve_z_left.curve = EditorGUILayout.CurveField(current_filter.precurve_z_left.curve);
						current_filter.precurve_z_right.curve = EditorGUILayout.CurveField(current_filter.precurve_z_right.curve);
						if (GUILayout.Button(current_filter.precurve_z_right.curve_text,GUILayout.Width(63)))
						{
							curve_menu_button(current_filter.precurve_z_right,script.get_output_length(current_layer),current_filter.curve_z_right_menu_rect);
						}
						if (key.type == EventType.Repaint){current_filter.curve_z_right_menu_rect = GUILayoutUtility.GetLastRect();}
						EditorGUILayout.EndHorizontal();
											
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Normal Y",GUILayout.Width(147));
						current_filter.precurve_y.curve = EditorGUILayout.CurveField(current_filter.precurve_y.curve);
						if (GUILayout.Button(current_filter.precurve_y.curve_text,GUILayout.Width(63)))
						{
							curve_menu_button(current_filter.precurve_y,script.get_output_length(current_layer),current_filter.curve_y_menu_rect);
						}
						if (key.type == EventType.Repaint){current_filter.curve_y_menu_rect = GUILayoutUtility.GetLastRect();}
						EditorGUILayout.EndHorizontal();
					}
								
					else if (current_filter.type == condition_type_enum.RandomRange)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						current_filter.range_start = EditorGUILayout.FloatField("Range Start",current_filter.range_start);
						EditorGUILayout.EndHorizontal();
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						current_filter.range_end = EditorGUILayout.FloatField("Range End",current_filter.range_end);
						EditorGUILayout.EndHorizontal();
					}	
					
					else if (current_filter.type == condition_type_enum.Splatmap) {
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Splat texture",GUILayout.Width(145));
						if (key.type == EventType.Repaint){splatRect = GUILayoutUtility.GetLastRect();}
						if (current_filter.splat_index < script.masterTerrain.splatPrototypes.Count) {
							GUI.color = Color.white;
							EditorGUI.DrawPreviewTexture(Rect(splatRect.x+149,splatRect.y,50,50),script.terrains[0].splatPrototypes[current_filter.splat_index].texture);
							GUI.color = color_filter;
							GUILayout.Space(54);
						}
						else {
							current_filter.splat_index = script.masterTerrain.splatPrototypes.Count-1;
							if (current_filter.splat_index < 0) {current_filter.splat_index = 0;}
						}
						gui_changed_old = GUI.changed;
						GUI.changed = false;
						current_filter.splat_index = EditorGUILayout.Slider(current_filter.splat_index,0,script.terrains[0].splatPrototypes.Count-1);
						if (GUI.changed) {
							if (current_filter.splat_index < 0) {current_filter.splat_index = 0;}
							current_filter.splatmap = (current_filter.splat_index/4);
							gui_changed_old = true;
							
						}
						GUI.changed = gui_changed_old;
						EditorGUILayout.EndHorizontal();
						if (current_filter.splat_index < script.masterTerrain.splatPrototypes.Count) {
							GUILayout.Space(35);
						}
					}
					else if (current_filter.type == condition_type_enum.RayCast)	{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Ray Cast Mode",GUILayout.Width(145));
						current_filter.raycast_mode = EditorGUILayout.EnumPopup(current_filter.raycast_mode);
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Layer",GUILayout.Width(145));
						current_filter.layerMask = EditorGUILayout.MaskField(current_filter.layerMask,layerMasks_display);
						if (GUILayout.Button("Refresh",EditorStyles.miniButtonMid,GUILayout.Width(65))) {
							create_layer_mask();
						}
						GUILayout.Space(5);
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Cast Direction",GUILayout.Width(145));
						EditorGUILayout.LabelField("X",GUILayout.Width(15));
						current_filter.ray_direction.x = EditorGUILayout.FloatField(current_filter.ray_direction.x);
						EditorGUILayout.LabelField("Y",GUILayout.Width(15));
						current_filter.ray_direction.y = EditorGUILayout.FloatField(current_filter.ray_direction.y);
						EditorGUILayout.LabelField("Z",GUILayout.Width(15));
						current_filter.ray_direction.z = EditorGUILayout.FloatField(current_filter.ray_direction.z);
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Cast Height",GUILayout.Width(145));
						current_filter.cast_height = EditorGUILayout.FloatField(current_filter.cast_height);
						EditorGUILayout.EndHorizontal();
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Ray Length",GUILayout.Width(145));
						current_filter.ray_length = EditorGUILayout.FloatField(current_filter.ray_length);
						EditorGUILayout.EndHorizontal();
						if (current_filter.raycast_mode == raycast_mode_enum.Hit) {
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(space+60);
							EditorGUILayout.LabelField("Ray Radius Scale",GUILayout.Width(145));
							current_filter.ray_radius = EditorGUILayout.FloatField(current_filter.ray_radius);
							EditorGUILayout.EndHorizontal();
						}
					}
					
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+60);
					EditorGUILayout.LabelField("Output",GUILayout.Width(145));
					current_filter.output = EditorGUILayout.EnumPopup(current_filter.output);
					if (count_filter < prefilter.filter_index.Count-1) {
						EditorGUILayout.LabelField("Combine",GUILayout.Width(55));
						current_filter.combine = EditorGUILayout.Toggle(current_filter.combine,GUILayout.Width(25));
					}
					EditorGUILayout.EndHorizontal();
					
					if (current_filter.output == condition_output_enum.change)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Level",GUILayout.Width(145));
						current_filter.change_mode = EditorGUILayout.EnumPopup(current_filter.change_mode);
						EditorGUILayout.EndHorizontal();
					}	
	
					if (current_filter.type == condition_type_enum.Always)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+60);
						EditorGUILayout.LabelField("Position",GUILayout.Width(145));
						current_filter.curve_position = EditorGUILayout.Slider(current_filter.curve_position,0,1);
						EditorGUILayout.EndHorizontal();
					}
												
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+60);
					EditorGUILayout.LabelField("Strength",GUILayout.Width(145));
					current_filter.strength = EditorGUILayout.Slider(current_filter.strength,0,4);
					EditorGUILayout.EndHorizontal();
					
					draw_curve(current_filter.precurve_list,space,color_filter,1);
					
					draw_subfilter(prelayer,current_filter,color_subfilter,space);	
									
				}
				if (script.settings.box_scheme){GUILayout.EndVertical();}
	  		}
	  		
	  	}
		GUILayout.Space(5);
	}
	
	function draw_curve(precurve_list: List.<animation_curve_class>,space: int,color_curve: Color,call_from: int)
	{
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+60);
		gui_changed_old = GUI.changed;
		current_filter.curve_foldout = EditorGUILayout.Foldout(current_filter.curve_foldout,"Curves");
		GUI.changed = gui_changed_old;
		EditorGUILayout.EndHorizontal();
		
		
		if (current_filter.curve_foldout)
		{
			for (var count_curve: int = 0;count_curve < precurve_list.Count;++count_curve)
			{
				if (!precurve_list[count_curve].active){color_curve += Color(-0.3,-0.3,-0.3,0);}
				if (global_script.settings.color_scheme){GUI.color = color_curve;}
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+75);
				EditorGUILayout.LabelField("Curve ("+precurve_list[count_curve].type+")",GUILayout.Width(130));
				if (count_curve == 0)
				{
					if (GUILayout.Button("H",EditorStyles.miniButtonMid,GUILayout.Width(20)))
					{
						if (call_from == 1)
						{
							create_curve_help_window(AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/curve_help.png",Texture),"Curve Help",current_filter.type.ToString());
						}
						else if (call_from == 2)
						{
							create_curve_help_window(AssetDatabase.LoadAssetAtPath(install_path+"/Buttons/curve_help.png",Texture),"Curve Help",current_filter.type.ToString());
						}
					}
				}
				else
				{
					GUILayout.Space(24);
				}
				precurve_list[count_curve].curve = EditorGUILayout.CurveField(precurve_list[count_curve].curve);
				if (GUILayout.Button(precurve_list[count_curve].curve_text,EditorStyles.miniButtonMid,GUILayout.Width(63)))
				{
					if (key.control && !key.shift)
					{
						UndoRegister("Default Curve");
						precurve_list[count_curve].set_default();
						generate_auto();
					}
					else if (key.alt)
					{
						if (key.shift)
						{
							script.loop_prelayer("(sad)",0,true);
						}
					}
					else
					{
						curve_menu_button(precurve_list[count_curve],script.get_output_length(current_layer),precurve_list[count_curve].menu_rect);
					}
				}
				if (key.type == EventType.Repaint){precurve_list[count_curve].menu_rect = GUILayoutUtility.GetLastRect();}
				precurve_list[count_curve].type = EditorGUILayout.EnumPopup(precurve_list[count_curve].type,GUILayout.Width(64));
				if (!global_script.settings.toggle_text_no)
				{
					if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
				}
				precurve_list[count_curve].active = EditorGUILayout.Toggle(precurve_list[count_curve].active,GUILayout.Width(25));
				if (count_curve > 0) {
					if (GUILayout.Button("▲",EditorStyles.miniButtonMid,GUILayout.Width(25)))
					{
						script.swap_animation_curve(precurve_list,count_curve,count_curve-1);
						generate_auto();
					}
				}
				else {
					GUILayout.Space(25);
				}
				if (count_curve < precurve_list.Count-1) {
					if (GUILayout.Button("▼",EditorStyles.miniButtonMid,GUILayout.Width(25)))
					{
						script.swap_animation_curve(precurve_list,count_curve,count_curve+1);
						generate_auto();
					}
				}
				else {
					GUILayout.Space(25);
				}
				if (GUILayout.Button("+",EditorStyles.miniButtonMid,GUILayout.Width(25)))
				{
					if (!key.shift){script.add_animation_curve(precurve_list,count_curve+1,false);}
						else {script.add_animation_curve(precurve_list,count_curve+1,true);}
					generate_auto();
				} 		 
				if (GUILayout.Button("-",EditorStyles.miniButtonMid,GUILayout.Width(25)))
				{
					if (key.control) {
						if (precurve_list.Count > 1)
						{
							UndoRegister("Erase Curve");
							script.erase_animation_curve(precurve_list,count_curve);
							generate_auto();
							this.Repaint();
							return;
						}
						else
						{
							precurve_list[count_curve].active = false;
						}
					}
					else {
						this.ShowNotification(GUIContent("Control click the '-' button to erase"));
					}
				} 						
				
				EditorGUILayout.EndHorizontal();
				
				if (precurve_list[count_curve].type == curve_type_enum.Perlin)
				{
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+90);
					gui_changed_old = GUI.changed;
					precurve_list[count_curve].settings_foldout = EditorGUILayout.Foldout(precurve_list[count_curve].settings_foldout,"Settings");
					GUI.changed = gui_changed_old;
					EditorGUILayout.EndHorizontal();
					
					if (precurve_list[count_curve].settings_foldout)
					{
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+105);
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+105);
						EditorGUILayout.LabelField("Zoom",GUILayout.Width(130));
						precurve_list[count_curve].frequency = EditorGUILayout.Slider(precurve_list[count_curve].frequency,1,4096);
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+105);
						EditorGUILayout.LabelField("Strength",GUILayout.Width(130));
						precurve_list[count_curve].strength = EditorGUILayout.Slider(precurve_list[count_curve].strength,0,4);
						EditorGUILayout.EndHorizontal();
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+105);
						EditorGUILayout.LabelField("Detail",GUILayout.Width(130));
						precurve_list[count_curve].detail = EditorGUILayout.Slider(precurve_list[count_curve].detail,1,12);
						EditorGUILayout.EndHorizontal();
						
					
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+105);
						EditorGUILayout.LabelField("Detail Strength",GUILayout.Width(130));
						precurve_list[count_curve].detail_strength = EditorGUILayout.Slider(precurve_list[count_curve].detail_strength,1,12);
						EditorGUILayout.EndHorizontal();
					
						draw_offset_range(precurve_list,count_curve,space);	
						
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+105);
						EditorGUILayout.LabelField("Abs",GUILayout.Width(130));
						gui_changed_old = GUI.changed;
						gui_changed_window = GUI.changed; GUI.changed = false;
						precurve_list[count_curve].abs = EditorGUILayout.Toggle(precurve_list[count_curve].abs,GUILayout.Width(25));
						if (GUI.changed)
						{
							gui_changed_old = true;
						}
						GUI.changed = gui_changed_old;
						EditorGUILayout.EndHorizontal();
					}
				}
				else if (precurve_list[count_curve].type == curve_type_enum.Random)
				{
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+90);
					EditorGUILayout.LabelField("Abs",GUILayout.Width(130));
					gui_changed_old = GUI.changed;
					gui_changed_window = GUI.changed; GUI.changed = false;
					precurve_list[count_curve].abs = EditorGUILayout.Toggle(precurve_list[count_curve].abs,GUILayout.Width(25));
					if (GUI.changed)
					{
						gui_changed_old = true;
					}
					GUI.changed = gui_changed_old;
					EditorGUILayout.EndHorizontal();
				}
				
				
				if (!precurve_list[count_curve].active){color_curve += Color(0.3,0.3,0.3,0);}
			}
		}
	}
	
	function draw_offset_range(precurve_list: List.<animation_curve_class>,count_curve: int,space: int)
	{
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+105);
		EditorGUILayout.LabelField("Offset Range",GUILayout.Width(130));
		if (precurve_list[count_curve].offset_range.x < 1){EditorGUILayout.LabelField(precurve_list[count_curve].offset_range.x.ToString("F2"),GUILayout.Width(50));}
			else {EditorGUILayout.LabelField(precurve_list[count_curve].offset_range.x.ToString("F0"),GUILayout.Width(50));}
		if (GUILayout.Button("+",EditorStyles.miniButtonMid,GUILayout.Width(30)))
		{
			precurve_list[count_curve].offset_range.x *= 2;
			precurve_list[count_curve].offset_range.y *= 2;
			precurve_list[count_curve].offset_middle.x = precurve_list[count_curve].offset.x;
			precurve_list[count_curve].offset_middle.y = precurve_list[count_curve].offset.y;
		}
		if (GUILayout.Button("-",EditorStyles.miniButtonMid,GUILayout.Width(30)))
		{
			if (precurve_list[count_curve].offset_range.x > 0.001)
			{
				precurve_list[count_curve].offset_range.x = precurve_list[count_curve].offset_range.x / 2;
				precurve_list[count_curve].offset_range.y = precurve_list[count_curve].offset_range.y / 2;
				precurve_list[count_curve].offset_middle.x = precurve_list[count_curve].offset.x;
				precurve_list[count_curve].offset_middle.y = precurve_list[count_curve].offset.y;
			}
		}
		GUILayout.Space(5);
		if (GUILayout.Button("Randomize",EditorStyles.miniButtonMid,GUILayout.Width(70)))
		{
			UnityEngine.Random.seed = EditorApplication.timeSinceStartup;
			precurve_list[count_curve].offset = Vector2(UnityEngine.Random.Range(-precurve_list[count_curve].offset_range.x+precurve_list[count_curve].offset_middle.x,precurve_list[count_curve].offset_range.y+precurve_list[count_curve].offset_middle.x),UnityEngine.Random.Range(-precurve_list[count_curve].offset_range.y+precurve_list[count_curve].offset_middle.y,precurve_list[count_curve].offset_range.y+precurve_list[count_curve].offset_middle.y));
			generate_auto();
		}
		if (GUILayout.Button("Reset",EditorStyles.miniButtonMid,GUILayout.Width(70)))
		{
			precurve_list[count_curve].offset = Vector2(0,0);
			precurve_list[count_curve].offset_middle = Vector2(0,0);
			generate_auto();
		}
		EditorGUILayout.EndHorizontal();							
					
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+105);
		EditorGUILayout.LabelField("Offset X",GUILayout.Width(130));
		precurve_list[count_curve].offset.x = EditorGUILayout.Slider(precurve_list[count_curve].offset.x,-precurve_list[count_curve].offset_range.x+precurve_list[count_curve].offset_middle.x,precurve_list[count_curve].offset_range.y+precurve_list[count_curve].offset_middle.x);
		EditorGUILayout.EndHorizontal();
				
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+105);
		EditorGUILayout.LabelField("Offset Y",GUILayout.Width(130));
		precurve_list[count_curve].offset.y = EditorGUILayout.Slider(precurve_list[count_curve].offset.y,-precurve_list[count_curve].offset_range.y+precurve_list[count_curve].offset_middle.y,precurve_list[count_curve].offset_range.y+precurve_list[count_curve].offset_middle.y);
		EditorGUILayout.EndHorizontal();
		
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+105);
		EditorGUILayout.LabelField("Rotate",GUILayout.Width(130));
		precurve_list[count_curve].rotation = EditorGUILayout.Toggle(precurve_list[count_curve].rotation,GUILayout.Width(25));
		EditorGUILayout.EndHorizontal();
		
		if (precurve_list[count_curve].rotation)
		{
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+105);
			EditorGUILayout.LabelField("Rotation value",GUILayout.Width(130));
			precurve_list[count_curve].rotation_value = EditorGUILayout.Slider(precurve_list[count_curve].rotation_value,-180,180);
			EditorGUILayout.EndHorizontal();
		}
	}
	
	function draw_offset_range(text: String,offset: Vector2,offset_range: Vector2,offset_middle: Vector2,space: int): Vector2
	{
		GUI.color = Color.green;
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField(text+" Offset X",GUILayout.Width(145));
		offset.x = EditorGUILayout.Slider(offset.x,-offset_range.x+offset_middle.x,offset_range.y+offset_middle.x);
		EditorGUILayout.EndHorizontal();
				
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField(text+" Offset Y",GUILayout.Width(145));
		offset.y = EditorGUILayout.Slider(offset.y,-offset_range.y+offset_middle.y,offset_range.y+offset_middle.y);
		EditorGUILayout.EndHorizontal();
		
		GUI.color = Color.white;
		return offset;
	}
	
	function draw_subfilter(prelayer: prelayer_class,current_filter: filter_class,color_subfilter: Color,space: int)
	{
		// subfilter
		if (!global_script.settings.color_scheme){color_subfilter = Color.white;}
		if (!current_filter.active || !current_layer.active){color_subfilter += Color(0,0,0,-0.4);}
	    GUI.color = color_subfilter;
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+60);
		
		// presubfilter text
		gui_changed_old = GUI.changed;
		current_filter.presubfilter.foldout = EditorGUILayout.Foldout(current_filter.presubfilter.foldout,current_filter.presubfilter.subfilter_text);
		GUI.changed = gui_changed_old;
		EditorGUILayout.EndHorizontal();
		if (current_filter.presubfilter.foldout)
		{
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+75);
			if (GUILayout.Button("+",GUILayout.Width(25)))
			{
				add_subfilter(current_filter.presubfilter.subfilter_index.Count-1,prelayer,current_filter.presubfilter);
				generate_auto();
			}
		    if (GUILayout.Button("-",GUILayout.Width(25)) && current_filter.presubfilter.subfilter_index.Count > 0)
		    {
		    	if (key.control) {
			    	if (!key.shift)
			    	{
			    		erase_subfilter(current_filter.presubfilter.subfilter_index.Count-1,current_filter.presubfilter);
					}
					else
					{
						UndoRegister("Erase Subfilters");
						script.erase_subfilters(current_filter);
					}
			    	generate_auto();
			    }
			    else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase\nControl Shift click the '-' button to erase all"));
				}
		    }
		    if (current_filter.presubfilter.subfilter_index.Count > 0) {
			    if (GUILayout.Button("F",GUILayout.Width(20)))
				{
					current_filter.presubfilter.subfilters_foldout = !current_filter.presubfilter.subfilters_foldout;
					script.change_subfilters_foldout(current_filter.presubfilter,key.shift);
				} 
				 EditorGUILayout.LabelField("");
				
			    if (GUILayout.Button("A",GUILayout.Width(20)))
				{
					current_filter.presubfilter.subfilters_active = !current_filter.presubfilter.subfilters_active;
					script.change_subfilters_active(current_filter.presubfilter,key.shift);
					generate_auto();
				}
				GUILayout.Space(162);
			}
			
			EditorGUILayout.EndHorizontal();
									
			//subfilter foldout
			if (current_filter.presubfilter.subfilter_index.Count > 0)
			{
				for (count_subfilter = 0;count_subfilter < current_filter.presubfilter.subfilter_index.Count;++count_subfilter)
				{
					current_subfilter = script.subfilter[current_filter.presubfilter.subfilter_index[count_subfilter]];		
					
					color_subfilter = global_script.settings.color.color_subfilter;
					
					if (!current_subfilter.active){color_subfilter += Color(-0.3,-0.3,-0.3,0);}
					if (!current_filter.active || !current_layer.active){color_subfilter += Color(0,0,0,-0.4);}
	        	
			        if (current_subfilter.color_subfilter != color_subfilter)
				    {
				    	if (current_subfilter.color_subfilter[0] > color_subfilter[0]){current_subfilter.color_subfilter[0] -= 0.004;} 
				        	else if (current_subfilter.color_subfilter[0]+0.01 < color_subfilter[0]){current_subfilter.color_subfilter[0] += 0.004;}	
				        		else {current_subfilter.color_subfilter[0] = color_subfilter[0];}
				        if (current_subfilter.color_subfilter[1] > color_subfilter[1]){current_subfilter.color_subfilter[1] -= 0.004;} 
				        	else if (current_subfilter.color_subfilter[1]+0.01 < color_subfilter[1]){current_subfilter.color_subfilter[1] += 0.004;}
				           		else {current_subfilter.color_subfilter[1] = color_subfilter[1];}
						if (current_subfilter.color_subfilter[2] > color_subfilter[2]){current_subfilter.color_subfilter[2] -= 0.004;} 
							else if (current_subfilter.color_subfilter[2]+0.01 < color_subfilter[2]){current_subfilter.color_subfilter[2] += 0.004;}
								else {current_subfilter.color_subfilter[2] = color_subfilter[2];}
						if (current_subfilter.color_subfilter[3] > color_subfilter[3]){current_subfilter.color_subfilter[3] -= 0.004;} 
							else if (current_subfilter.color_subfilter[3]+0.01 < color_subfilter[3]){current_subfilter.color_subfilter[3] += 0.004;}
								else {current_subfilter.color_subfilter[3] = color_subfilter[3];}
				        this.Repaint();
					}
			    	if (global_script.settings.color_scheme){GUI.color = current_subfilter.color_subfilter;} else {GUI.color = Color.white;}
					
					if (script.settings.box_scheme){GUILayout.BeginVertical("Box");}
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+75);
					
					// subfilter text	
					var random_range_text: String;
					if (!script.settings.database_display)
					{
						gui_changed_old = GUI.changed;
						current_subfilter.foldout = EditorGUILayout.Foldout(current_subfilter.foldout,subfilter_text+count_subfilter+" ("+current_subfilter.type+")"+random_range_text);
						GUI.changed = gui_changed_old;
					}
					else
					{
						gui_changed_old = GUI.changed;
						current_subfilter.foldout = EditorGUILayout.Foldout(current_subfilter.foldout,subfilter_text+count_subfilter+" ("+current_subfilter.type+")"+random_range_text+":--> "+current_filter.presubfilter.subfilter_index[count_subfilter]);
						GUI.changed = gui_changed_old;
					}
					if (!global_script.settings.toggle_text_no)
					{
						if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
					}
					gui_changed_old = GUI.changed;
					gui_changed_window = GUI.changed; GUI.changed = false;
					current_subfilter.active = EditorGUILayout.Toggle(current_subfilter.active,GUILayout.Width(25));
					if (GUI.changed)
					{
						gui_changed_old = true;
					}
					GUI.changed = gui_changed_old;
					
					if (count_subfilter > 0) {									
						if (GUILayout.Button("▲",GUILayout.Width(25)))
						{
							script.swap_subfilter(current_filter.presubfilter,count_subfilter,current_filter.presubfilter,count_subfilter-1);
							generate_auto();
						} 
					}
					else {
						GUILayout.Space(29);
					}
					
					if (count_subfilter < current_filter.presubfilter.subfilter_index.Count-1) {
						if (GUILayout.Button("▼",GUILayout.Width(25)))
						{
							script.swap_subfilter(current_filter.presubfilter,count_subfilter,current_filter.presubfilter,count_subfilter+1);
							generate_auto();
						}
					}
					else {
						GUILayout.Space(29);
					}

					if (GUILayout.Button(current_subfilter.swap_text,GUILayout.Width(34)))
					{
						swap_subfilter(current_subfilter,count_subfilter,current_filter.presubfilter);
					} 		
					if (GUILayout.Button("+",GUILayout.Width(25)))
					{
						add_subfilter(count_subfilter,prelayer,current_filter.presubfilter);
						generate_auto();
					} 		 
					if (GUILayout.Button("-",GUILayout.Width(25)))
					{
						if (key.control) {
							erase_subfilter(count_subfilter,current_filter.presubfilter);
							generate_auto();
						}
						else {
							this.ShowNotification(GUIContent("Control click the '-' button to erase"));
						}
					} 
					EditorGUILayout.EndHorizontal();
					
					GUILayout.Space(2);
					if (current_subfilter.foldout)
					{
						GUILayout.Space(5);
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+90);
						EditorGUILayout.LabelField("Mode",GUILayout.Width(145));
						current_subfilter.mode = EditorGUILayout.EnumPopup(current_subfilter.mode);
						EditorGUILayout.EndHorizontal();
	
						GUILayout.Space(5);
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+90);
						EditorGUILayout.LabelField("Input",GUILayout.Width(145));
						gui_changed_old = GUI.changed;
						if (current_layer.output == layer_output_enum.heightmap) {
							current_subfilter.type = script.GetCondtionTypeEnum(EditorGUILayout.EnumPopup(script.GetHeightmapEnum(current_subfilter.type)));
						}
						else {
							current_subfilter.type = EditorGUILayout.EnumPopup(current_subfilter.type);
						}
						if (GUI.changed) {
							gui_changed_old = true;
							if (current_subfilter.type == condition_type_enum.RawHeightmap)
							{
								if (current_subfilter.raw == null) {
									current_subfilter.raw = new raw_class();
								}
							}
						}
						GUI.changed = gui_changed_old;
						EditorGUILayout.EndHorizontal();
						
						if (current_subfilter.type == condition_type_enum.MaxCount)
						{
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(space+90);
							EditorGUILayout.LabelField("Max Count",GUILayout.Width(145));
							current_subfilter.output_max = EditorGUILayout.IntField(current_subfilter.output_max);
							EditorGUILayout.EndHorizontal();
							
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(space+90);
							EditorGUILayout.LabelField("Min Value",GUILayout.Width(145));
							current_subfilter.output_count_min = EditorGUILayout.FloatField(current_subfilter.output_count_min);
							EditorGUILayout.EndHorizontal();
						}	
						else
						{
							if (current_subfilter.mode == subfilter_mode_enum.strength)
							{
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Output",GUILayout.Width(145));
								current_subfilter.output = EditorGUILayout.EnumPopup(current_subfilter.output);
								EditorGUILayout.EndHorizontal();
							}
							
							if (current_subfilter.type == condition_type_enum.RawHeightmap)
							{
								draw_raw_heightmap(current_subfilter.raw,space+30);	 
							}
							else if (current_subfilter.type == condition_type_enum.Image)
							{
								draw_image(current_subfilter.preimage,30+space,color_subfilter,true,2);							
							}
							
							if (current_subfilter.type == condition_type_enum.Splatmap) {
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Splat texture",GUILayout.Width(145));
								if (key.type == EventType.Repaint){splatRect = GUILayoutUtility.GetLastRect();}
								if (current_subfilter.splat_index < script.masterTerrain.splatPrototypes.Count) {
									GUI.color = Color.white;
									EditorGUI.DrawPreviewTexture(Rect(splatRect.x+149,splatRect.y,50,50),script.terrains[0].splatPrototypes[current_subfilter.splat_index].texture);
									GUILayout.Space(54);
									GUI.color = color_subfilter;
								}
								else {
									current_subfilter.splat_index = script.terrains[current_layer.splat_output.splat_terrain].splatPrototypes.Count-1;
									if (current_subfilter.splat_index < 0) {current_subfilter.splat_index = 0;}
								}
								gui_changed_old = GUI.changed;
								GUI.changed = false;
								current_subfilter.splat_index = EditorGUILayout.Slider(current_subfilter.splat_index,0,script.terrains[0].splatPrototypes.Count-1);
								if (GUI.changed) {
									if (current_subfilter.splat_index < 0) {current_subfilter.splat_index = 0;}
									current_subfilter.splatmap = (current_subfilter.splat_index/4);
									gui_changed_old = true;
								}
								GUI.changed = gui_changed_old;
								EditorGUILayout.EndHorizontal();
								if (current_subfilter.splat_index < script.masterTerrain.splatPrototypes.Count) {
									GUILayout.Space(35);
								}
							}
							if (current_subfilter.type == condition_type_enum.Always || current_subfilter.type == condition_type_enum.Splatmap)
							{
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Position",GUILayout.Width(145));
								current_subfilter.curve_position = EditorGUILayout.Slider(current_subfilter.curve_position,0,1);
								EditorGUILayout.EndHorizontal();
							}
							else if (current_subfilter.type == condition_type_enum.RayCast)
							{
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("RayCast Mode",GUILayout.Width(145));
								current_subfilter.raycast_mode = EditorGUILayout.EnumPopup(current_subfilter.raycast_mode);
								EditorGUILayout.EndHorizontal();
								
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Layer",GUILayout.Width(145));
								current_subfilter.layerMask = EditorGUILayout.MaskField(current_subfilter.layerMask,layerMasks_display);
								if (GUILayout.Button("Refresh",EditorStyles.miniButtonMid,GUILayout.Width(65))) {
									create_layer_mask();
								}
								GUILayout.Space(5);
								EditorGUILayout.EndHorizontal();
								
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Cast Direction",GUILayout.Width(145));
								EditorGUILayout.LabelField("X",GUILayout.Width(15));
								current_subfilter.ray_direction.x = EditorGUILayout.FloatField(current_subfilter.ray_direction.x);
								EditorGUILayout.LabelField("Y",GUILayout.Width(15));
								current_subfilter.ray_direction.y = EditorGUILayout.FloatField(current_subfilter.ray_direction.y);
								EditorGUILayout.LabelField("Z",GUILayout.Width(15));
								current_subfilter.ray_direction.z = EditorGUILayout.FloatField(current_subfilter.ray_direction.z);
								EditorGUILayout.EndHorizontal();
								
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Cast Height",GUILayout.Width(145));
								current_subfilter.cast_height = EditorGUILayout.FloatField(current_subfilter.cast_height);
								EditorGUILayout.EndHorizontal();
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Ray Length",GUILayout.Width(145));
								current_subfilter.ray_length = EditorGUILayout.FloatField(current_subfilter.ray_length);
								EditorGUILayout.EndHorizontal();
								if (current_subfilter.raycast_mode == raycast_mode_enum.Hit) {
									EditorGUILayout.BeginHorizontal();
									GUILayout.Space(space+90);
									EditorGUILayout.LabelField("Ray Radius Scale",GUILayout.Width(145));
									current_subfilter.ray_radius = EditorGUILayout.FloatField(current_subfilter.ray_radius);
									EditorGUILayout.EndHorizontal();
								}
							}
							
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(space+90);
							EditorGUILayout.LabelField("Strength",GUILayout.Width(145));
							current_subfilter.strength = EditorGUILayout.Slider(current_subfilter.strength,0,1);
							EditorGUILayout.EndHorizontal();
													
							if (current_subfilter.type == condition_type_enum.RandomRange)
							{
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Range Start",GUILayout.Width(145));
								current_subfilter.range_start = EditorGUILayout.FloatField(current_subfilter.range_start);
								EditorGUILayout.EndHorizontal();
								EditorGUILayout.BeginHorizontal();
								GUILayout.Space(space+90);
								EditorGUILayout.LabelField("Range End",GUILayout.Width(145));
								current_subfilter.range_end = EditorGUILayout.FloatField(current_subfilter.range_end);
								EditorGUILayout.EndHorizontal();
							}
													
							draw_curve(current_subfilter.precurve_list,space+30,color_subfilter,2);
						}
					}
					GUILayout.Space(1);
					if (script.settings.box_scheme){GUILayout.EndVertical();}
				}
			}
		}
	}
	
	function draw_auto_search(auto_search: auto_search_class,space: int)
	{
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Naming String",GUILayout.Width(115));
		gui_changed_old = GUI.changed;
		gui_changed_window = GUI.changed; GUI.changed = false;
		auto_search.format = EditorGUILayout.TextField(auto_search.format,GUILayout.Width(119));
		EditorGUILayout.LabelField("("+auto_search.output_format+")");
		EditorGUILayout.EndHorizontal();
				
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Digits Length",GUILayout.Width(115));
		auto_search.digits = EditorGUILayout.IntField(auto_search.digits,GUILayout.Width(119));
		EditorGUILayout.EndHorizontal();
				
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Start %x",GUILayout.Width(115));
		auto_search.start_x = EditorGUILayout.IntField(auto_search.start_x,GUILayout.Width(119));
		if (auto_search.start_x < 0){auto_search.start_x = 0;}
		EditorGUILayout.EndHorizontal();
		
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Start %y",GUILayout.Width(115));
		auto_search.start_y = EditorGUILayout.IntField(auto_search.start_y,GUILayout.Width(119));
		if (auto_search.start_y < 0){auto_search.start_n = 0;}
		EditorGUILayout.EndHorizontal();
			
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Start %n",GUILayout.Width(115));
		auto_search.start_n = EditorGUILayout.IntField(auto_search.start_n,GUILayout.Width(119));
		if (auto_search.start_n < 0){auto_search.start_y = 0;}
		EditorGUILayout.EndHorizontal();
		if (GUI.changed)
		{
			auto_search.set_output_format();
		}
		GUI.changed = gui_changed_old;
		
		/*
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Set Default",GUILayout.Width(115+space2));
		if (GUILayout.Button("Default",GUILayout.Width(119)))
		{
			save_name_string(auto_search,true);
			auto_search.select_index = 0;
		}
		EditorGUILayout.EndHorizontal();
		*/
		
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Save Current",GUILayout.Width(115));
		if (GUILayout.Button("Save",GUILayout.Width(119)))
		{
			save_name_string(auto_search,false);
		}
		EditorGUILayout.EndHorizontal();
		
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+225);
		EditorGUILayout.LabelField("Erase Current",GUILayout.Width(115));
		if (GUILayout.Button("-Erase-",GUILayout.Width(119)) && key.control)
		{
			erase_name_string(auto_search);
		}
		EditorGUILayout.EndHorizontal();
	
		GUILayout.Space(5);
	}	
	
	class name_string_arguments_class
    {
    	var auto_search: auto_search_class;
    	var index: int;
    }
    
    function name_string_menu(obj: name_string_arguments_class)
	{
		obj.auto_search.select_index = obj.index;
		set_auto_search(obj.auto_search);
	}
	
	function set_auto_search(auto_search: auto_search_class)
	{
		var index: int = auto_search.select_index;
		
		if (!global_script){load_global_settings();}
		
		auto_search.format = global_script.auto_search_list[index].format;
		auto_search.digits = global_script.auto_search_list[index].digits;
		auto_search.start_x = global_script.auto_search_list[index].start_x;
		auto_search.start_y = global_script.auto_search_list[index].start_y;
		auto_search.start_n = global_script.auto_search_list[index].start_n;
		auto_search.output_format = global_script.auto_search_list[index].output_format;
	}
		
	function draw_auto_search_select(auto_search: auto_search_class,button_select: boolean)
	{
		if (button_select)
	    {
	    	var menu: GenericMenu = new GenericMenu ();                              
	        var length: int = global_script.auto_search_list.Count;
	        var text1: String;
	         		
	        var userdata: name_string_arguments_class[] = new name_string_arguments_class[length];
	         		 		
	        for (var count_search: int = 0;count_search < length;++count_search)
	        {
		    	userdata[count_search] = new name_string_arguments_class();
		        userdata[count_search].index = count_search;
		        userdata[count_search].auto_search = auto_search; 
		         		
		        text1 = "'"+global_script.auto_search_list[count_search].format+"'"+" (Digits: "+global_script.auto_search_list[count_search].digits.ToString()+", Start x"+global_script.auto_search_list[count_search].start_x.ToString()+", Start y"+global_script.auto_search_list[count_search].start_y.ToString()+", Start n: "+global_script.auto_search_list[count_search].start_n.ToString()+") --> ("+global_script.auto_search_list[count_search].output_format+")";
		      	if (count_search == auto_search.select_index)
		      	{
		      		menu.AddItem (new GUIContent(text1),true,name_string_menu,userdata[count_search]);                
		      	}
		      	else
		      	{
		      		menu.AddItem (new GUIContent(text1),false,name_string_menu,userdata[count_search]);                
		      	}   		
			}
		    
		    menu.DropDown (auto_search.menu_rect);
		}
	}
					
	function draw_image(preimage: image_class,space: int,color_filter: Color,draw_color_range: boolean,call_from: int)
	{
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+210);
		if (global_script.settings.color_scheme){GUI.color = Color.white;}							
		var count_row: int = 0;
		var count_image: int = 0;
		for (var y: int = script.terrains[0].tiles.y-1;y >= 0;--y) {
			for (var x: int = 0;x < script.terrains[0].tiles.x;++x) {
				count_image = (y*script.terrains[0].tiles.x)+x;
				if (count_image >= preimage.image.Count) break;
				gui_changed_old = GUI.changed;
				gui_changed_window = GUI.changed; GUI.changed = false;
				if (y == 0 && x == 0 && preimage.image.Count > 1) GUI.backgroundColor = Color.red;
				preimage.image[count_image] = EditorGUILayout.ObjectField(preimage.image[count_image],Texture2D,true,GUILayout.Width(50),GUILayout.Height(50)) as Texture2D;
				GUI.backgroundColor = Color.white;
				if (GUI.changed)
				{	
					gui_changed_old = true;
					if (preimage.pattern)
					{
						preimage.pattern_width = preimage.image.width / preimage.pattern_list[0].count_x;
						preimage.pattern_height = preimage.image.height / preimage.pattern_list[0].count_y;
					}
					if (preimage.image[count_image])
					{
						if (count_image == 0)
						{
							preimage.auto_search.path_full = AssetDatabase.GetAssetPath(preimage.image[0]);
							preimage.import_max_size_list = script.get_import_resolution_to_list(get_image_import_max_size(preimage.image[0],true));
						}
						set_image_import_settings(preimage.image[count_image],1,1,-1,-1);
					}
					
					preimage.short_list = false;
				}
				if (preimage.image.Count == 1 && preimage.image[count_image]){EditorGUILayout.LabelField(preimage.image[count_image].name);}
				GUI.changed = gui_changed_old;
				++count_row;
				if (count_row >= script.terrains[0].tiles.x)
				{
					count_row = 0;
					EditorGUILayout.EndHorizontal();
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+210);
				}
			}
		}
		EditorGUILayout.EndHorizontal();
		
		if (global_script.settings.color_scheme){GUI.color = color_filter;}							
		
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+210);
		gui_changed_old = GUI.changed;
		preimage.settings_foldout = EditorGUILayout.Foldout(preimage.settings_foldout,"Settings");
		GUI.changed = gui_changed_old;
		EditorGUILayout.EndHorizontal();
		
		if (preimage.settings_foldout)
		{
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Flip X",GUILayout.Width(35));
			preimage.flip_x = EditorGUILayout.Toggle(preimage.flip_x,GUILayout.Width(25));
			EditorGUILayout.LabelField("Flip Y",GUILayout.Width(35));
			preimage.flip_y = EditorGUILayout.Toggle(preimage.flip_y,GUILayout.Width(25));
			GUILayout.Space(7);
			EditorGUILayout.LabelField("Auto Scale",GUILayout.Width(65));
			preimage.image_auto_scale = EditorGUILayout.Toggle(preimage.image_auto_scale,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			
			if (GUILayout.Button("Adjust List",GUILayout.Width(85)))
			{
				preimage.short_list = false;
				preimage.adjust_list();
				if (preimage.list_length > 1){preimage.image_mode = image_mode_enum.Terrain;}
				else if (preimage.list_length == 1 && script.terrains.Count > 1){preimage.image_mode = image_mode_enum.MultiTerrain;}
			}
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			preimage.list_length = EditorGUILayout.IntField(preimage.list_length,GUILayout.Width(50));
			if (GUI.changed)
			{
				gui_changed_old = true;
				if (preimage.list_length < 1){preimage.list_length = 1;}
			}
			GUI.changed = gui_changed_old;
			if (global_script.settings.tooltip_mode != 0)
        	{
    			tooltip_text = "Auto complete the list\n(Click)\n\nSet search parameters\n(Alt Click)";
	        }
	        
	        // EditorGUILayout.LabelField("Auto Search",GUILayout.Width(115));
			if (GUILayout.Button(GUIContent(">Auto Search",tooltip_text),GUILayout.Width(95)))
			{
				if (key.shift) {
					UndoRegister("Auto Search Image");
					script.strip_auto_search_file(preimage.auto_search);
					auto_search_list(preimage);
				} 
				else {
					draw_auto_search_select(preimage.auto_search,true);
				}
			}
			if (key.type == EventType.Repaint) {
				preimage.auto_search.menu_rect = GUILayoutUtility.GetLastRect();
		    }
		    GUILayout.Space(10);
			preimage.auto_search.display = EditorGUI.Foldout(Rect(preimage.auto_search.menu_rect.x+95,preimage.auto_search.menu_rect.y,15,19),preimage.auto_search.display,String.Empty);
			EditorGUILayout.LabelField("("+preimage.auto_search.output_format+")");			
			EditorGUILayout.EndHorizontal();
			
			if (preimage.auto_search.display)
			{
				draw_auto_search(preimage.auto_search,space);
			}
			
			if (preimage.image.Count > 1)
			{
//				EditorGUILayout.BeginHorizontal();
//				GUILayout.Space(space+225);
//				EditorGUILayout.LabelField("Row Length",GUILayout.Width(115));
//				preimage.list_row = EditorGUILayout.IntField(preimage.list_row,GUILayout.Width(70));
//				EditorGUILayout.EndHorizontal();
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("List Mode",GUILayout.Width(115));
				preimage.image_list_mode = EditorGUILayout.EnumPopup(preimage.image_list_mode,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
			}
			else {
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Load on generate",GUILayout.Width(115));
				gui_changed_old = GUI.changed;
				GUI.changed = false;
				preimage.short_list = EditorGUILayout.Toggle(preimage.short_list,GUILayout.Width(25));
				if (GUI.changed) {
					if (preimage.short_list) {
						script.strip_auto_search_file(preimage.auto_search);
						auto_search_list(preimage);
					}
				}
				GUI.changed = gui_changed_old;
				EditorGUILayout.EndHorizontal();
			}
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Image Mode",GUILayout.Width(115));
			preimage.image_mode = EditorGUILayout.EnumPopup(preimage.image_mode,GUILayout.Width(119));
			EditorGUILayout.EndHorizontal();
			
			if (preimage.image[0])
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Import Max Size",GUILayout.Width(115));
				gui_changed_old = GUI.changed;
				GUI.changed = false;
				preimage.import_max_size_list = EditorGUILayout.Popup(preimage.import_max_size_list,script.image_import_max_settings,GUILayout.Width(119));
				if (GUI.changed)
				{
					gui_changed_old = true;
					set_image_import_settings(preimage.image[0],-1,-1,-1,script.set_import_resolution_from_list(preimage.import_max_size_list));
					if (preimage.short_list) {auto_search_list(preimage);}
					AssetDatabase.Refresh();
				}
				GUI.changed = gui_changed_old;
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Image Resolution",GUILayout.Width(115));
				EditorGUILayout.LabelField(preimage.image[0].width+"x"+preimage.image[0].height);
				EditorGUILayout.EndHorizontal();
			}
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Splatmap",GUILayout.Width(115));
			preimage.splatmap = EditorGUILayout.Toggle(preimage.splatmap,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Alpha channel",GUILayout.Width(115));
			preimage.includeAlpha = EditorGUILayout.Toggle(preimage.includeAlpha,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Clamp",GUILayout.Width(115));
			preimage.clamp = EditorGUILayout.Toggle(preimage.clamp,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Rotate",GUILayout.Width(115));
			preimage.rotation = EditorGUILayout.Toggle(preimage.rotation,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			if (preimage.rotation)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Rotation value",GUILayout.Width(115));
				preimage.rotation_value = EditorGUILayout.Slider(preimage.rotation_value,-180,180);
				EditorGUILayout.EndHorizontal();
			}
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("RGB",GUILayout.Width(115));
			preimage.rgb = EditorGUILayout.Toggle(preimage.rgb,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			if (current_layer.output == layer_output_enum.splat)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Edge Blur",GUILayout.Width(115));
				preimage.edge_blur = EditorGUILayout.Toggle(preimage.edge_blur,GUILayout.Width(25));
				EditorGUILayout.EndHorizontal();
				
				if (preimage.edge_blur)
				{
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+225);
					EditorGUILayout.LabelField("Edge Blur Radius",GUILayout.Width(115));
					gui_changed_old = GUI.changed;
					gui_changed_window = GUI.changed; GUI.changed = false;
					preimage.edge_blur_radius = EditorGUILayout.FloatField(preimage.edge_blur_radius,GUILayout.Width(70));
					if (GUI.changed)
					{
						gui_changed_old = true;
						if (preimage.edge_blur_radius < 0.5){preimage.edge_blur_radius = 0.5;}
					}
					GUI.changed = gui_changed_old;
					EditorGUILayout.EndHorizontal();
				}
			}
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Image Color",GUILayout.Width(115));
			preimage.image_color = EditorGUILayout.ColorField(preimage.image_color,GUILayout.Width(109));
			EditorGUILayout.EndHorizontal();
			
			if (!preimage.image_auto_scale)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Step",GUILayout.Width(97));
				EditorGUILayout.LabelField("X",GUILayout.Width(15));
				preimage.conversion_step.x = EditorGUILayout.FloatField(preimage.conversion_step.x,GUILayout.Width(70));
				EditorGUILayout.LabelField("Y",GUILayout.Width(15));
				preimage.conversion_step.y = EditorGUILayout.FloatField(preimage.conversion_step.y,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
			}
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Scale",GUILayout.Width(97));
			EditorGUILayout.LabelField("X",GUILayout.Width(15));
			preimage.tile_x = EditorGUILayout.FloatField(preimage.tile_x,GUILayout.Width(70));
			EditorGUILayout.LabelField("Y",GUILayout.Width(15));
			preimage.tile_y = EditorGUILayout.FloatField(preimage.tile_y,GUILayout.Width(70));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Offset",GUILayout.Width(97));
			EditorGUILayout.LabelField("X",GUILayout.Width(15));
			preimage.tile_offset_x = EditorGUILayout.FloatField(preimage.tile_offset_x,GUILayout.Width(70));
			EditorGUILayout.LabelField("Y",GUILayout.Width(15));
			preimage.tile_offset_y = EditorGUILayout.FloatField(preimage.tile_offset_y,GUILayout.Width(70));
			EditorGUILayout.EndHorizontal();
		}	
		if (draw_color_range && !preimage.splatmap)
		{	
			current_preimage = preimage;
			draw_precolor_range(preimage.precolor_range,space+210,false,0,color_filter,true,false,false,call_from);
		}
	}
	
	function draw_raw_heightmap(raw: raw_class,space: int)
	{
		var space_list: int = 0;
		if (raw.file_index.Count > 1)
		{
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+210);
			gui_changed_old = GUI.changed;
			raw.foldout = EditorGUILayout.Foldout(raw.foldout,"Raw File List");
			GUI.changed = gui_changed_old;
			EditorGUILayout.EndHorizontal();
			space_list = 15;
		}
		
		if (raw.foldout || raw.file_index.Count < 2)
		{
			for (var count_file_index: int = 0;count_file_index < raw.file_index.Count;++count_file_index)
			{
				if (raw.display_short_list)
				{
					if (count_file_index == 1)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+space_list+225);
						EditorGUILayout.LabelField("...");
						EditorGUILayout.EndHorizontal();
						continue;
					}
					else if (count_file_index != 0 && count_file_index < raw.file_index.Count-1){continue;}
				}
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+space_list+210);
				var raw_file_text: String;
				var raw_file_path: String;
				
				if (raw.file_index[count_file_index] > script.raw_files.Count-1){raw.file_index[count_file_index] = -1;}
				
				if (raw.file_index[count_file_index] > -1)
				{
					raw_file_text = script.raw_files[raw.file_index[count_file_index]].filename;
					raw_file_path = script.raw_files[raw.file_index[count_file_index]].file;
				}
				else
				{
					raw_file_text = "Not Loaded";
					raw_file_path = "";
				}
				
				gui_changed_old = GUI.changed;
				raw.file_foldout[count_file_index] = EditorGUILayout.Foldout(raw.file_foldout[count_file_index],GUIContent(raw_file_text+" ("+count_file_index+")",raw_file_path));
				GUI.changed = gui_changed_old;
				
				if (count_file_index == 0)
				{
					if (GUILayout.Button("Reset",GUILayout.Width(50)) && key.control) {
						raw.file_index.Clear();
						raw.file_index.Add(-1);
						raw.file_foldout.Add(true);
						this.Repaint();
						return;
					}
					
					if (GUILayout.Button("Change",GUILayout.Width(60))) {
						if (raw.file_index[count_file_index] != -1) {
							var folder: String;
							
				        	folder = EditorUtility.OpenFolderPanel("Change relative folders",Application.dataPath,"");
				        	if (folder.Length != 0) {
				        		ChangeRawFolders(script.raw_files[raw.file_index[count_file_index]].file, folder);
				        	}	
			        	}
			        	else ShowNotification(new GUIContent("Please load a raw heightmap first for this to work"));
					}
					if (raw.file_index.Count > 2) {
						if (GUILayout.Button("I",GUILayout.Width(25)))
						{
							raw.display_short_list = !raw.display_short_list;
						}
					}
				}
				
				if (GUILayout.Button(GUIContent(">Open",button_open),GUILayout.Width(70),GUILayout.Height(19)))
				{
					if (key.control)
					{
						raw.path = String.Empty;
						raw.file_index[count_file_index] = -1;
						script.clean_raw_file_list();
					}
					else
					{
						if (key.shift)
						{
							raw.path = Application.dataPath;
						}
						else
						{
							var raw_file: String;
					       				
						    if (raw.path == String.Empty){raw.path = Application.dataPath;}  
						        				
							if (Application.platform == RuntimePlatform.OSXEditor){raw_file = EditorUtility.OpenFilePanel("Open Heightmap File",raw.path,"raw");}
			        		else {raw_file = EditorUtility.OpenFilePanel("Open Heightmap File",raw.path,"Raw;*.r16;*.raw");}
			        				
						        				
						    if (raw_file.Length != 0)
						    {
						     	raw.file_index[count_file_index] = add_raw_file(raw_file);
						     	if (raw.file_index[count_file_index] == -2) {
						     		this.ShowNotification(GUIContent("Raw file has non square resolution, enter it manually"));
						     		Debug.Log("Raw file has non resolution. Enter the resolution manually.");
						     	}
						    	if (raw.file_index[count_file_index] > -1)
						    	{
						   			raw.path = raw_file;
						    		script.clean_raw_file_list();
						    		script.raw_files[raw.file_index[count_file_index]].created = false;
						    	}
						    	if (count_file_index == 0){raw.auto_search.path_full = raw_file;}
								EditorGUILayout.EndHorizontal();
						    }
						}
					}
				}
				EditorGUILayout.EndHorizontal();
				
				if (raw.file_foldout[count_file_index])
			    {    			
					if (raw.file_index[count_file_index] > -1)
					{
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+space_list+225);
						EditorGUILayout.LabelField("Resolution",GUILayout.Width(147));
						EditorGUILayout.LabelField("Square",GUILayout.Width(55));
						script.raw_files[raw.file_index[count_file_index]].square = EditorGUILayout.Toggle(script.raw_files[raw.file_index[count_file_index]].square,GUILayout.Width(25));
						if (script.raw_files[raw.file_index[count_file_index]].square) {
							EditorGUILayout.LabelField(String.Empty+script.raw_files[raw.file_index[count_file_index]].resolution,GUILayout.Width(150));
						}
						EditorGUILayout.EndHorizontal();
						
						if (!script.raw_files[raw.file_index[count_file_index]].square) {
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(space+space_list+225);
							EditorGUILayout.LabelField("Resolution X",GUILayout.Width(147));
							script.raw_files[raw.file_index[count_file_index]].resolution.x = EditorGUILayout.IntField(script.raw_files[raw.file_index[count_file_index]].resolution.x,GUILayout.Width(150));
							EditorGUILayout.EndHorizontal();
							
							EditorGUILayout.BeginHorizontal();
							GUILayout.Space(space+space_list+225);
							EditorGUILayout.LabelField("Resolution Y",GUILayout.Width(147));
							script.raw_files[raw.file_index[count_file_index]].resolution.y = EditorGUILayout.IntField(script.raw_files[raw.file_index[count_file_index]].resolution.y,GUILayout.Width(150));
							EditorGUILayout.EndHorizontal();
						}				   				        			
						        			        			        			
						EditorGUILayout.BeginHorizontal();
						GUILayout.Space(space+space_list+225);
						EditorGUILayout.LabelField("Byte Order",GUILayout.Width(147));
						script.raw_files[raw.file_index[count_file_index]].mode = EditorGUILayout.EnumPopup(script.raw_files[raw.file_index[count_file_index]].mode,GUILayout.Width(64));
					    EditorGUILayout.EndHorizontal();
					}
				}
			}
		}
		
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space+210);
		gui_changed_old = GUI.changed;
		raw.settings_foldout = EditorGUILayout.Foldout(raw.settings_foldout,"Settings");
		GUI.changed = gui_changed_old;
		EditorGUILayout.EndHorizontal();
		
		if (raw.settings_foldout)
		{
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Flip X",GUILayout.Width(35));
			raw.flip_x = EditorGUILayout.Toggle(raw.flip_x,GUILayout.Width(25));
			EditorGUILayout.LabelField("Flip Y",GUILayout.Width(35));
			raw.flip_y = EditorGUILayout.Toggle(raw.flip_y,GUILayout.Width(25));
			if (raw.file_index.Count > 1) {
				GUILayout.Space(7);
				EditorGUILayout.LabelField("Flip total X",GUILayout.Width(65));
				raw.flipTotalX = EditorGUILayout.Toggle(raw.flipTotalX,GUILayout.Width(25));
				EditorGUILayout.LabelField("Flip total Y",GUILayout.Width(65));
				raw.flipTotalY = EditorGUILayout.Toggle(raw.flipTotalY,GUILayout.Width(25));
			}
			
			raw.raw_auto_scale = true;
//			EditorGUILayout.LabelField("Auto Scale",GUILayout.Width(65));
//			raw.raw_auto_scale = EditorGUILayout.Toggle(raw.raw_auto_scale,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			if (GUILayout.Button("Adjust List",GUILayout.Width(85)))
			{
				raw.adjust_list();
				script.clean_raw_file_list();
			}
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			raw.list_length = EditorGUILayout.IntField(raw.list_length,GUILayout.Width(50));
			if (GUI.changed)
			{
				if (raw.list_length < 1){raw.list_length = 1;}
			}
			GUI.changed = gui_changed_old;
			if (global_script.settings.tooltip_mode != 0)
        	{
    			tooltip_text = "Auto complete the list\n(Click)\n\nSet search parameters\n(Alt Click)";
	        }
			if (GUILayout.Button(GUIContent(">Auto Search",tooltip_text),GUILayout.Width(95)))
			{
				if (key.shift) {
					UndoRegister("Auto Search Image");
					script.strip_auto_search_file(raw.auto_search);
					auto_search_raw(raw);
				} 
				else {
					draw_auto_search_select(raw.auto_search,true);
				}
			}
			if (key.type == EventType.Repaint) {
				raw.auto_search.menu_rect = GUILayoutUtility.GetLastRect();
		    }
		    GUILayout.Space(10);
			raw.auto_search.display = EditorGUI.Foldout(Rect(raw.auto_search.menu_rect.x+95,raw.auto_search.menu_rect.y,15,19),raw.auto_search.display,String.Empty);
			EditorGUILayout.LabelField("("+raw.auto_search.output_format+")");			
			EditorGUILayout.EndHorizontal();
			
			if (raw.auto_search.display)
			{
				draw_auto_search(raw.auto_search,space);
			}
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Stretch Mode",GUILayout.Width(115));
			raw.raw_mode = EditorGUILayout.EnumPopup(raw.raw_mode,GUILayout.Width(109));
			EditorGUILayout.EndHorizontal();
			
			if (raw.file_index.Count > 1)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("List Mode",GUILayout.Width(115));
				raw.raw_list_mode = EditorGUILayout.EnumPopup(raw.raw_list_mode,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Row Length",GUILayout.Width(115));
				raw.list_row = EditorGUILayout.IntField(raw.list_row,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
			}
			
			if (!raw.raw_auto_scale)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Step X",GUILayout.Width(115));
				raw.conversion_step.x = EditorGUILayout.FloatField(raw.conversion_step.x,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Step Y",GUILayout.Width(115));
				raw.conversion_step.y = EditorGUILayout.FloatField(raw.conversion_step.y,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
			}
			
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Scale X",GUILayout.Width(115));
			GUILayout.Space(29);
			raw.tile_x = EditorGUILayout.Slider(raw.tile_x,0.001,4);
			EditorGUILayout.EndHorizontal();
										
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Scale Y",GUILayout.Width(115));
			raw.tile_link = EditorGUILayout.Toggle(raw.tile_link,GUILayout.Width(25));
			raw.tile_y = EditorGUILayout.Slider(raw.tile_y,0.001,4);
			EditorGUILayout.EndHorizontal();
			
			if (GUI.changed)
			{
				gui_changed_old = true;
				if (raw.tile_link){raw.tile_y = raw.tile_x;}
			}
			GUI.changed = gui_changed_old;
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Clamp",GUILayout.Width(115));
			raw.clamp = EditorGUILayout.Toggle(raw.clamp,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Tile Offset X",GUILayout.Width(115));
			raw.tile_offset_x = EditorGUILayout.Slider(raw.tile_offset_x,-script.terrains[0].size.x,script.terrains[0].size.x);
			EditorGUILayout.EndHorizontal();
		
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Tile Offset Y",GUILayout.Width(115));
			raw.tile_offset_y = EditorGUILayout.Slider(raw.tile_offset_y,-script.terrains[0].size.z,script.terrains[0].size.z);
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.LabelField("Rotate",GUILayout.Width(115));
			raw.rotation = EditorGUILayout.Toggle(raw.rotation,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			if (raw.rotation)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+225);
				EditorGUILayout.LabelField("Rotation value",GUILayout.Width(115));
				raw.rotation_value = EditorGUILayout.Slider(raw.rotation_value,-180,180);
				EditorGUILayout.EndHorizontal();
			}
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+225);
			EditorGUILayout.EndHorizontal();
		}
	}
	
	function draw_area(prelayer_number: int,prearea: area_class,current_terrain: terrain_class,space: int,world_area: boolean)
	{
		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(30+space);
		var text: String;
		
		if (world_area){text = "World ";} else {text = "Local ";}
		if (global_script.settings.tooltip_mode > 0)
		{
			if (global_script.settings.tooltip_mode == 2)
			{
				if (!world_area)
				{
					tooltip_text = "Here you can create the custom (Local) Area output for each terrain";
				}
				else
				{
					tooltip_text = "Here you can create you custom (World) Area output for each terrain";
				}
			}
			else
			{
				tooltip_text = String.Empty;
			}
		}
		gui_changed_old = GUI.changed;
		if (!script.settings.tabs || world_area)
		{
			prearea.foldout = EditorGUILayout.Foldout(prearea.foldout,GUIContent(text+"Area",tooltip_text));
		}
		GUI.changed = gui_changed_old;
		if (world_area)
		{
		    if (!global_script.settings.toggle_text_no)
		    {
		    	if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(40));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
		    }
		    prearea.active = EditorGUILayout.Toggle(prearea.active,GUILayout.Width(25));
		}
	    EditorGUILayout.EndHorizontal();
	       		
	    if (prearea.foldout)
	    {
			/*if (script.settings.tabs)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(30);
				GUI.backgroundColor = Color.green;
				EditorGUILayout.LabelField("Local Area",EditorStyles.miniButtonMid,GUILayout.Width(474),GUILayout.Height(19));
				GUI.backgroundColor = Color.white;
				EditorGUILayout.EndHorizontal();
			
			if (global_script.settings.video_help)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(46+space);
				GUI.backgroundColor = Color(0.3,0.7,1);
				GUI.color = Color.white;
				if (!world_area)
				{
					if (GUILayout.Button("Help Video Local Area",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					{
						        	
					}
				}
				else
				{
					if (GUILayout.Button("Help Video World Area",EditorStyles.miniButtonMid,GUILayout.Width(153)))
					{
						        	
					}
				}
				GUI.backgroundColor = Color.white;
				
				EditorGUILayout.EndHorizontal();
			}
			*/
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(45+space);
			var button_text: String;
			
			if (world_area)
			{
				if (global_script.settings.tooltip_mode != 0)
        		{
    				tooltip_text = "Set Wold Area to Maximum Area\n\nTo calculate the Maximum Area (Shift Click)";
	        	}
				button_text = ">Max";
			} 
			else 
			{
				if (global_script.settings.tooltip_mode != 0)
        		{
    				tooltip_text = "Set Local Area to Maximum";
    			}
				button_text = "Max";
			}
			
			if (GUILayout.Button(GUIContent(button_text,tooltip_text),GUILayout.Width(45)))
			{
				if (key.shift && world_area){script.calc_area_max(prearea);} else {prearea.max();}
				prearea.set_resolution_mode_text();
			}
			
			if (!world_area)
			{
				
				if (global_script.settings.tooltip_mode != 0)
        		{
    				tooltip_text = "Set all the Terrains Local Area the same as "+current_terrain.name;
    			}
				if (script.terrains.Count > 1)
				{
					if (GUILayout.Button(GUIContent("<Set All>",tooltip_text),GUILayout.Width(75))) {
						if (key.shift) {
							script.set_all_terrain_area(current_terrain);
						}
						else {
			        		this.ShowNotification(GUIContent("Shift click <Set All> to set this Local Area to all terrains"));
			        	}
					}
				}
			}
			
			EditorGUILayout.EndHorizontal();
						
		    gui_changed_old = GUI.changed;
		    gui_changed_window = GUI.changed; GUI.changed = false;
		    EditorGUILayout.BeginHorizontal();
			GUILayout.Space(45+space);
			var start_x: float = prearea.area.xMin;
			var end_x: float = prearea.area.xMax;
			EditorGUILayout.LabelField("Area X",GUILayout.Width(135));
			start_x = EditorGUILayout.FloatField(start_x,GUILayout.Width(55));
			GUILayout.Space(19);
			EditorGUILayout.MinMaxSlider(start_x,end_x,prearea.area_max.x,prearea.area_max.xMax,GUILayout.Width(180)); 
			GUILayout.Space(19);
			end_x = EditorGUILayout.FloatField(end_x,GUILayout.Width(55));
		    if (GUI.changed)
		    {
		    	if (start_x < prearea.area_max.xMin){start_x = prearea.area_max.xMin;}
		    	if (start_x > prearea.area_max.xMax){start_x = prearea.area_max.xMax;}
		    	if (end_x < prearea.area_max.xMin){end_x = prearea.area_max.xMin;}
		    	if (end_x > prearea.area_max.xMax){end_x = prearea.area_max.xMax;}
		    	if (end_x < start_x){end_x = start_x;}
		    	prearea.set_resolution_mode_text();
		    }
		    prearea.area.xMin = start_x;
		    prearea.area.xMax = end_x;
		   	EditorGUILayout.EndHorizontal();
		    
		    gui_changed_window = GUI.changed; GUI.changed = false;  		
		   	EditorGUILayout.BeginHorizontal();
			GUILayout.Space(45+space);
			var start_y: float = prearea.area.yMin;
			var end_y: float = prearea.area.yMax;
			EditorGUILayout.LabelField("Area Z",GUILayout.Width(135));
			start_y = EditorGUILayout.FloatField(start_y,GUILayout.Width(55));
			prearea.link_start = EditorGUILayout.Toggle(prearea.link_start,GUILayout.Width(15));
			EditorGUILayout.MinMaxSlider(start_y,end_y,prearea.area_max.y,prearea.area_max.yMax,GUILayout.Width(180)); 
		    prearea.link_end = EditorGUILayout.Toggle(prearea.link_end,GUILayout.Width(15));
		    end_y = EditorGUILayout.FloatField(end_y,GUILayout.Width(55));
		    if (prearea.link_start){start_y = start_x;if (start_y > end_y){end_y = start_y;}}
		    if (prearea.link_end){end_y = end_x;if(end_y < start_y){start_y = end_y;}}
		    if (GUI.changed)
		    {
		    	if (start_y < prearea.area_max.yMin){start_y = prearea.area_max.yMin;}
		    	if (start_y > prearea.area_max.yMax){start_y = prearea.area_max.yMax;}
		    	if (end_y < prearea.area_max.yMin){end_y = prearea.area_max.yMin;}
		    	if (end_y > prearea.area_max.yMax){end_y = prearea.area_max.yMax;}
		    	if (end_y < start_y){end_y = start_y;}
		    }
		    
			prearea.area.yMin = start_y;
		    prearea.area.yMax = end_y;
		    EditorGUILayout.EndHorizontal();
		    GUI.changed = gui_changed_old;
		    
		    EditorGUILayout.BeginHorizontal();
			GUILayout.Space(45+space);
			EditorGUILayout.LabelField("Tree Resolution",GUILayout.Width(135));
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			prearea.tree_resolution = EditorGUILayout.IntField(prearea.tree_resolution,GUILayout.Width(55));	
			if (GUI.changed)
			{
				if (prearea.tree_resolution < 8){prearea.tree_resolution = 8;}
			}
			GUI.changed = gui_changed_old;
			// prearea.tree_resolution_active = EditorGUILayout.Toggle(prearea.tree_resolution_active,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(45+space);
			EditorGUILayout.LabelField("Object Resolution",GUILayout.Width(135));
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			prearea.object_resolution = EditorGUILayout.IntField(prearea.object_resolution,GUILayout.Width(55));	
			if (GUI.changed)
			{
				if (prearea.object_resolution < 8){prearea.object_resolution = 8;}	
			}
			GUI.changed = gui_changed_old;
			// prearea.object_resolution_active = EditorGUILayout.Toggle(prearea.object_resolution_active,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			if (world_area)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(45+space);
				EditorGUILayout.LabelField("Maximum Area");
				EditorGUILayout.EndHorizontal();
				
				gui_changed_old = GUI.changed;
				gui_changed_window = GUI.changed; GUI.changed = false;
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(45+space);
				EditorGUILayout.LabelField("X min",GUILayout.Width(120));
				prearea.area_max.xMin = EditorGUILayout.FloatField(prearea.area_max.xMin,GUILayout.Width(100));
				EditorGUILayout.LabelField("X max",GUILayout.Width(120));
				prearea.area_max.xMax = EditorGUILayout.FloatField(prearea.area_max.xMax,GUILayout.Width(100));
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(45+space);
				EditorGUILayout.LabelField("Z min",GUILayout.Width(120));
				prearea.area_max.yMin = EditorGUILayout.FloatField(prearea.area_max.yMin,GUILayout.Width(100));
				EditorGUILayout.LabelField("Z max",GUILayout.Width(120));
				prearea.area_max.yMax = EditorGUILayout.FloatField(prearea.area_max.yMax,GUILayout.Width(100));
				EditorGUILayout.EndHorizontal();
				GUI.changed = gui_changed_old;
			}
			
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(45+space);
			EditorGUILayout.LabelField("Mode",GUILayout.Width(135));
			GUI.changed = gui_changed_old;
			gui_changed_window = GUI.changed; GUI.changed = false;
			prearea.resolution_mode = EditorGUILayout.EnumPopup(prearea.resolution_mode,GUILayout.Width(80));
			if (GUI.changed){script.set_area_resolution(current_terrain,prearea);prearea.set_resolution_mode_text();}
			EditorGUILayout.EndHorizontal();
			
		    if (prearea.resolution_mode != resolution_mode_enum.Automatic)
		    {			
				if (prearea.resolution_mode == resolution_mode_enum.Custom)
				{
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(45+space);
				 	EditorGUILayout.LabelField("Resolution",GUILayout.Width(135));
				 	gui_changed_old = GUI.changed;
				 	gui_changed_window = GUI.changed; GUI.changed = false;
					prearea.custom_resolution = EditorGUILayout.FloatField(prearea.custom_resolution,GUILayout.Width(80));
					if (GUI.changed)
					{
						if (prearea.custom_resolution < 1){prearea.custom_resolution = 1;}
						prearea.step.x = script.terrains[0].size.x/prearea.custom_resolution;
						prearea.step.y = prearea.step.x;
					}
					GUI.changed = gui_changed_old;
					EditorGUILayout.EndHorizontal();
				}
				else
				{
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(45+space);
				 	EditorGUILayout.LabelField("Resolution",GUILayout.Width(135));
				 	EditorGUILayout.LabelField(String.Empty+prearea.resolution);
					EditorGUILayout.EndHorizontal();
				}
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(45+space);
				if (prearea.resolution_mode == resolution_mode_enum.Custom)
				{
					gui_changed_window = GUI.changed; GUI.changed = false;
					prearea.step = EditorGUILayout.Vector2Field("Step",prearea.step);
					if (GUI.changed)
					{
						if (prearea.step.x <= 0){prearea.step.x = 1;}
						if (prearea.step.y <= 0){prearea.step.y = 1;}
					}
				}
				else {EditorGUILayout.Vector2Field("Step",prearea.step);}
				EditorGUILayout.EndHorizontal();
			}
			GUI.changed = gui_changed_old;
		}
	}
	
	function draw_precolor_range(precolor_range: precolor_range_class,space: int,one_color: boolean, minimum: int,color_color_range1: Color,display_swap: boolean,display_value: boolean,erase_button: boolean,call_from: int)
	{
 		if (!script){return;}
 		if (global_script.settings.color_scheme){GUI.color = color_color_range1;}
 		
 		mouse_position = Event.current.mousePosition;
 		
 		EditorGUILayout.BeginHorizontal();
		GUILayout.Space(space);
		gui_changed_old = GUI.changed;
		precolor_range.foldout = EditorGUILayout.Foldout(precolor_range.foldout,precolor_range.text);
		GUI.changed = gui_changed_old;
		
		if (key.type == EventType.Repaint) 
		{
        	precolor_range.menu_rect = GUILayoutUtility.GetLastRect();
        	precolor_range.menu_rect.width = (precolor_range.text.Length*7)-15;
        	precolor_range.menu_rect.x += 14;
        	precolor_range.menu_rect.y += script.settings.top_height;
        	if (script.settings.top_height > 0) precolor_range.menu_rect.y += 3;
        }
        
        if (key.button == 1) { 	
	    	if (check_point_in_rect(precolor_range.menu_rect,mouse_position - Vector2(-5,0)) && key.type == EventType.layout)
			{
				var menu: GenericMenu;
	        	var userdata: menu_arguments_class[] = new menu_arguments_class[3];
	        	 		
	        	userdata[0] = new menu_arguments_class();
	        	userdata[0].name = "new";
	        	userdata[1] = new menu_arguments_class();
	        	userdata[1].name = "open";
	        	userdata[2] = new menu_arguments_class();
	        	userdata[2].name = "save";
	        	 		
	        	menu = new GenericMenu ();                                
	        	menu.AddItem(new GUIContent("New"),false,precolor_menu,userdata[0]);                
	        	menu.AddSeparator (""); 
	        	menu.AddItem(new GUIContent("Open"),false,precolor_menu,userdata[1]);                
	        	               
	        	menu.AddItem(new GUIContent("Save"),false,precolor_menu,userdata[2]);                                
	        	 		
	        	current_precolor_range = precolor_range;	
	        	precolor_range.menu_rect.y += 2;	
	        	menu.DropDown (precolor_range.menu_rect);
	        }
        }
		
		if (erase_button)
		{
			if (GUILayout.Button("-",GUILayout.Width(25)))
			{
				if (key.control) {
					UndoRegister("ColorGroup Erase");
					current_layer.color_output.erase_precolor_range(precolor_range.index-1);
					generate_auto();
					this.Repaint();
			        return;
			    }
			    else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
				}
			}
		}
		EditorGUILayout.EndHorizontal();
		
		if (precolor_range.foldout)
		{
			if (call_from == 1)
			{
				if (current_layer.output != layer_output_enum.heightmap)
				{
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+15);
					EditorGUILayout.LabelField("Mode",GUILayout.Width(55));
					current_preimage.select_mode = EditorGUILayout.EnumPopup(current_preimage.select_mode,GUILayout.Width(109));
					EditorGUILayout.EndHorizontal();
				}
			}
			EditorGUILayout.BeginHorizontal();
			GUILayout.Space(space+15);
			if (GUILayout.Button("+",GUILayout.Width(25)))
			{
				add_color_range(precolor_range.color_range.Count-1,precolor_range,one_color,true);
				if (script.generate_auto)
				{
					if (call_from != 4 && call_from != 5){generate_auto();}
				}
			}
			if (GUILayout.Button("-",GUILayout.Width(25)) && precolor_range.color_range.Count > minimum)
			{
				if (key.control) {
					if (!key.shift)
		        	{
		        		erase_color_range(precolor_range.color_range.Count-1,precolor_range);
		        	}
					else 
					{
						UndoRegister("Erase Colors");
		        		precolor_range.clear_color_range();
					}
					
					if (script.generate_auto)
					{
						if (call_from != 4 && call_from != 5){generate_auto();}
					}
				}
				else {
					this.ShowNotification(GUIContent("Control click the '-' button to erase"));
				}
			}
			if (global_script.settings.tooltip_mode != 0)
        	{
        		tooltip_text = "Detect the colors in the image automatically\n\n(Shift Click)";
        	}
        	if (call_from == 1 || call_from == 2)
        	{
				if (GUILayout.Button(GUIContent("<Detect>",tooltip_text),GUILayout.Width(75)))
			    {
			    	UndoRegister("Detect Colors");
	        		if (key.shift) {
			    		precolor_range.detect_colors_image(current_preimage.image[0]);
			    	}
			    	else {
			       		this.ShowNotification(GUIContent("Shift click <Detect Color> to detect the colors in the image automatically"));
			       	}
			    }
			    
			    gui_changed_old = GUI.changed;
			    gui_changed_window = GUI.changed; GUI.changed = false;
			    precolor_range.detect_max = EditorGUILayout.IntField(precolor_range.detect_max,GUILayout.Width(30));
			    if (GUI.changed)
			    {
			    	if (precolor_range.detect_max < 1){precolor_range.detect_max = 1;}
			    	if (precolor_range.detect_max > 100){precolor_range.detect_max = 100;}
			    }
			    GUI.changed = gui_changed_old;
			}
		    if (!global_script.settings.toggle_text_no)
	        {
	        	if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Palette",GUILayout.Width(50));} else {EditorGUILayout.LabelField("Pal",GUILayout.Width(28));}
	        }  
		     
		    precolor_range.palette = EditorGUILayout.Toggle(precolor_range.palette,GUILayout.Width(15));
			
			if (call_from == 3)
			{
				if (GUILayout.Button(">Set All",GUILayout.Width(65)))
				{
					script.set_all_tree_precolor_range(current_layer.tree_output,current_tree_number,key.shift);	
					generate_auto();	
				}
			}
			
			if (precolor_range.color_range.Count > 0) {
				EditorGUILayout.LabelField("");
				if (GUILayout.Button("A",GUILayout.Width(20)))
				{
					precolor_range.color_ranges_active = !precolor_range.color_ranges_active;
					script.change_color_ranges_active(precolor_range,key.shift);
				}	
				GUILayout.Space(163);
			}
//			if (GUILayout.Button("I",GUILayout.Width(20)))
//			{
//				precolor_range.interface_display = !precolor_range.interface_display;
//			}
			
			EditorGUILayout.EndHorizontal();
			
			if (precolor_range.palette)
		    {
		    	EditorGUILayout.BeginHorizontal();
		        GUILayout.Space(space+15);
		        var color_old: Color = GUI.color;
		        GUI.color = Color.white;
		        GUILayout.Button(palette_texture,"");	 
		        GUI.color = color_old;
		    	EditorGUILayout.EndHorizontal();
		    }
		     
		    if (precolor_range.color_range.Count > 0)
			{
				if (display_value) {
					EditorGUILayout.BeginHorizontal();
			        	GUILayout.Space(space+15);
			        	gui_changed_old = GUI.changed;
	           			GUI.changed = false;
	           			EditorGUILayout.LabelField("Slider",GUILayout.Width(55));
		           		precolor_range.color_range_value.mode = EditorGUILayout.EnumPopup(precolor_range.color_range_value.mode,GUILayout.Width(70));
		           		if (GUI.changed) {
		           			precolor_range.color_range_value.calc_value();
		           			gui_changed_old = true;
		           		}
		           		GUI.changed = gui_changed_old;
		           		if (GUILayout.Button("R",GUILayout.Width(25))) {precolor_range.color_range_value.reset_values();generate_auto();}
		        	EditorGUILayout.EndHorizontal();
		        	GUILayout.Space(2);
				}
				for (var count_color_range1: int = 0;count_color_range1 < precolor_range.color_range.Count;++count_color_range1)
				{
					color_color_range = color_color_range1;
					
					if (!precolor_range.color_range_value.active[count_color_range1]){color_color_range += Color(-0.2,-0.2,-0.2,0);}
				
			        if (precolor_range.color_range[count_color_range1].color_color_range != color_color_range)
				    {
				    	if (precolor_range.color_range[count_color_range1].color_color_range[0] > color_color_range[0]){precolor_range.color_range[count_color_range1].color_color_range[0] -= 0.004;} 
				        	else if (precolor_range.color_range[count_color_range1].color_color_range[0]+0.01 < color_color_range[0]){precolor_range.color_range[count_color_range1].color_color_range[0] += 0.004;}	
				        		else {precolor_range.color_range[count_color_range1].color_color_range[0] = color_color_range[0];}
				        if (precolor_range.color_range[count_color_range1].color_color_range[1] > color_color_range[1]){precolor_range.color_range[count_color_range1].color_color_range[1] -= 0.004;} 
				        	else if (precolor_range.color_range[count_color_range1].color_color_range[1]+0.01 < color_color_range[1]){precolor_range.color_range[count_color_range1].color_color_range[1] += 0.004;}
				           		else {precolor_range.color_range[count_color_range1].color_color_range[1] = color_color_range[1];}
						if (precolor_range.color_range[count_color_range1].color_color_range[2] > color_color_range[2]){precolor_range.color_range[count_color_range1].color_color_range[2] -= 0.004;} 
							else if (precolor_range.color_range[count_color_range1].color_color_range[2]+0.01 < color_color_range[2]){precolor_range.color_range[count_color_range1].color_color_range[2] += 0.004;}
								else {precolor_range.color_range[count_color_range1].color_color_range[2] = color_color_range[2];}
						if (precolor_range.color_range[count_color_range1].color_color_range[3] > color_color_range[3]){precolor_range.color_range[count_color_range1].color_color_range[3] -= 0.004;} 
							else if (precolor_range.color_range[count_color_range1].color_color_range[3]+0.01 < color_color_range[3]){precolor_range.color_range[count_color_range1].color_color_range[3] += 0.004;}
								else {precolor_range.color_range[count_color_range1].color_color_range[3] = color_color_range[3];}
				        this.Repaint();
				        if (texture_tool){texture_tool.Repaint();}
					}
			    	if (global_script.settings.color_scheme){GUI.color = precolor_range.color_range[count_color_range1].color_color_range;} else {GUI.color = Color.white;}
			    	
					EditorGUILayout.BeginHorizontal();
					GUILayout.Space(space+15);
					
					// color range text
					EditorGUILayout.LabelField("Color"+count_color_range1,GUILayout.Width(55));
					
					var color_old1: Color = precolor_range.color_range[count_color_range1].color_start;
					precolor_range.color_range[count_color_range1].color_start = EditorGUILayout.ColorField(precolor_range.color_range[count_color_range1].color_start);
					if (color_old1 != precolor_range.color_range[count_color_range1].color_start) {precolor_range.set_precolor_range_curve();}
					
					if (!precolor_range.color_range[count_color_range1].one_color)
					{
						precolor_range.color_range[count_color_range1].color_end = EditorGUILayout.ColorField(precolor_range.color_range[count_color_range1].color_end);
						
						if (call_from != 1 || current_preimage.select_mode != select_mode_enum.select)
						{
							gui_changed_old = GUI.changed;
							gui_changed_window = GUI.changed; GUI.changed = false;
							precolor_range.color_range[count_color_range1].curve = EditorGUILayout.CurveField(precolor_range.color_range[count_color_range1].curve,GUILayout.Width(30));
							if (GUI.changed)
							{
								gui_changed_old = true;
								precolor_range.color_range[count_color_range1].output = precolor_range.color_range[count_color_range1].curve.Evaluate(1);
							}
							GUI.changed = gui_changed_old;																														
							if (GUILayout.Button(precolor_range.color_range[count_color_range1].curve_text,GUILayout.Width(63)))
							{
								if (key.control && !key.shift)
								{
									UndoRegister("Default Curve");
									precolor_range.color_range[count_color_range1].set_default();
									generate_auto();
								}
								else if (key.alt)
								{
									if (key.shift)
									{
										script.loop_prelayer("(sad)",0,true);
									}
								}
								else
								{
									curve_menu_button(precolor_range.color_range[count_color_range1],script.get_output_length(current_layer),precolor_range.color_range[count_color_range1].curve_menu_rect);
								}
							}
							if (key.type == EventType.Repaint){precolor_range.color_range[count_color_range1].curve_menu_rect = GUILayoutUtility.GetLastRect();}
						}
					} 
					else if (!one_color)
					{
						if (call_from != 1 || current_preimage.select_mode != select_mode_enum.select)
						{
							gui_changed_old = GUI.changed;
							gui_changed_window = GUI.changed; GUI.changed = false;
							precolor_range.color_range[count_color_range1].output = EditorGUILayout.FloatField(precolor_range.color_range[count_color_range1].output,GUILayout.Width(55));
							if (GUI.changed)
							{
								gui_changed_old = true;
								precolor_range.color_range[count_color_range1].change_key(1,precolor_range.color_range[count_color_range1].output);
							}
							GUI.changed = gui_changed_old;
						}
					}
					
					if (call_from == 1)
					{
						if (current_preimage.select_mode == select_mode_enum.select)
						{
							precolor_range.color_range[count_color_range1].select_output = EditorGUILayout.IntField(precolor_range.color_range[count_color_range1].select_output,GUILayout.Width(25));
							if (GUILayout.Button("+",GUILayout.Width(25)))
							{
								if (!key.shift)
								{
									++precolor_range.color_range[count_color_range1].select_output;
								}
								else
								{
									if (count_color_range1 > 1){precolor_range.color_range[count_color_range1].select_output = precolor_range.color_range[count_color_range1-1].select_output+1;}
									else 
									{
										++precolor_range.color_range[count_color_range1].select_output;
									}
								}
								
								generate_auto();
							}
							if (GUILayout.Button("-",GUILayout.Width(25)))
							{
								--precolor_range.color_range[count_color_range1].select_output;
								generate_auto();
							}
							
							if (precolor_range.color_range[count_color_range1].select_output < 0){precolor_range.color_range[count_color_range1].select_output = 0;}
							
							switch (current_layer.output)
							{
								case layer_output_enum.color:
									if (precolor_range.color_range[count_color_range1].select_output > current_layer.color_output.precolor_range[current_filter.color_output_index].color_range.Count-1 && precolor_range.color_range[count_color_range1].select_output != 0){precolor_range.color_range[count_color_range1].select_output = current_layer.color_output.precolor_range[current_filter.color_output_index].color_range.Count-1;}
									break;
								case layer_output_enum.splat:
									if (precolor_range.color_range[count_color_range1].select_output > current_layer.splat_output.splat.Count-1 && precolor_range.color_range[count_color_range1].select_output != 0){precolor_range.color_range[count_color_range1].select_output = current_layer.splat_output.splat.Count-1;}
									break;
								case layer_output_enum.tree:
									if (precolor_range.color_range[count_color_range1].select_output > current_layer.tree_output.tree.Count-1 && precolor_range.color_range[count_color_range1].select_output != 0){precolor_range.color_range[count_color_range1].select_output = current_layer.tree_output.tree.Count-1;}
									break;
								case layer_output_enum.grass:
									if (precolor_range.color_range[count_color_range1].select_output > current_layer.grass_output.grass.Count-1 && precolor_range.color_range[count_color_range1].select_output != 0){precolor_range.color_range[count_color_range1].select_output = current_layer.grass_output.grass.Count-1;}
									break;
								case layer_output_enum.object:
									if (precolor_range.color_range[count_color_range1].select_output > current_layer.object_output.object.Count-1 && precolor_range.color_range[count_color_range1].select_output != 0){precolor_range.color_range[count_color_range1].select_output = current_layer.object_output.object.Count-1;}
									break;
							}
						}
					}
					
					if (!global_script.settings.toggle_text_no)
					{
						if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Invert",GUILayout.Width(40));} else {EditorGUILayout.LabelField("Inv",GUILayout.Width(28));}
					}
					gui_changed_old = GUI.changed;
					gui_changed_window = GUI.changed; GUI.changed = false;
					precolor_range.color_range[count_color_range1].invert = EditorGUILayout.Toggle(precolor_range.color_range[count_color_range1].invert,GUILayout.Width(25));
					if (GUI.changed)
					{
						gui_changed_old = true;
						if (key.shift)
						{
							precolor_range.color_range[count_color_range1].invert = !precolor_range.color_range[count_color_range1].invert;
							precolor_range.invert_color_range(count_color_range1);
						}
					}
					GUI.changed = gui_changed_old;
					if (display_value)
					{
						DrawValueSlider(precolor_range.color_range_value,count_color_range1,true,5);
						
//						gui_changed_old = GUI.changed;
//			           	gui_changed_window = GUI.changed; GUI.changed = false;
//						precolor_range.color_range_value.value[count_color_range1] = EditorGUILayout.Slider(precolor_range.color_range_value.value[count_color_range1],1,100);
//						if (global_script.settings.tooltip_mode != 0)
//						{
//							tooltip_text = "Center this value to 50";
//						}
//						if (GUILayout.Button(GUIContent("C",tooltip_text),GUILayout.Width(25))){precolor_range.color_range_value.value[count_color_range1] = 50;GUI.changed = true;}
//						EditorGUILayout.LabelField(precolor_range.color_range_value.text[count_color_range1],GUILayout.Width(90));
//						if (GUI.changed) 
//						{
//							gui_changed_old = true;
//							precolor_range.color_range_value.calc_value();
//						}
//						GUI.changed = gui_changed_old;
					}
					// EditorGUILayout.EndHorizontal();
					// continue;
					if (!global_script.settings.toggle_text_no && !one_color)
					{
						if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("One Color",GUILayout.Width(65));} else {EditorGUILayout.LabelField("One",GUILayout.Width(28));}
					}
					if (!one_color){precolor_range.color_range[count_color_range1].one_color = EditorGUILayout.Toggle(precolor_range.color_range[count_color_range1].one_color,GUILayout.Width(25));}
					
					if (!global_script.settings.toggle_text_no)
	        		{
	        			if (global_script.settings.toggle_text_long){EditorGUILayout.LabelField("Active",GUILayout.Width(40));} else {EditorGUILayout.LabelField("Act",GUILayout.Width(28));}
	        		}
	        		gui_changed_old = GUI.changed;
	        		gui_changed_window = GUI.changed; GUI.changed = false;
					precolor_range.color_range_value.active[count_color_range1] = EditorGUILayout.Toggle(precolor_range.color_range_value.active[count_color_range1],GUILayout.Width(25));
	        		if (GUI.changed)
					{
						gui_changed_old = true;
						precolor_range.color_range_value.calc_value();
					}
					GUI.changed = gui_changed_old;
	        		
	        		// if (precolor_range.interface_display)
	        		// {
	        			if (count_color_range1 > 0) {
							if (GUILayout.Button("▲",GUILayout.Width(25)))
				            {
				           		precolor_range.swap_color(count_color_range1,count_color_range1-1);           			  	
				           		if (script.generate_auto)
								{
									if (call_from != 4 && call_from != 5){generate_auto();}
								}
				           	} 		 
				        }
				        else {
				        	GUILayout.Space(29);
				        }
			           	if (count_color_range1 < precolor_range.color_range.Count-1) {
				           	if (GUILayout.Button("▼",GUILayout.Width(25)))
				           	{
				           		precolor_range.swap_color(count_color_range1,count_color_range1+1);
				           		if (script.generate_auto)
								{
									if (call_from != 4 && call_from != 5){generate_auto();}
								}
				           	} 
				        }
				        else {
				        	GUILayout.Space(29);
				        }
				        if (display_swap)
			           	{
				           	if (GUILayout.Button(precolor_range.color_range[count_color_range1].swap_text,GUILayout.Width(35)))
				           	{
				           		swap_color_range(precolor_range.color_range[count_color_range1],count_color_range1,precolor_range);	
				           		if (!script.swap_color_range_select)
				           		{
				           			this.Repaint();
				           			if (texture_tool){texture_tool.Repaint();}
				           		}
				           		generate_auto();
				           	}
			           	}
						
						if (GUILayout.Button("+",GUILayout.Width(25)))
						{
							add_color_range(count_color_range1,precolor_range,one_color,true);
							if (script.generate_auto)
							{
								if (call_from != 4 && call_from != 5){generate_auto();}
							}
						}
						if (GUILayout.Button("-",GUILayout.Width(25)) && precolor_range.color_range.Count > minimum)
						{
							if (key.control) {
								erase_color_range(count_color_range1,precolor_range);
								
								if (script.generate_auto)
								{
									if (call_from != 4 && call_from != 5){generate_auto();}
								}
								return;
							}
							else {
								this.ShowNotification(GUIContent("Control click the '-' button to erase"));
							}
						}
					//}
					EditorGUILayout.EndHorizontal();
				}
			}	
			if (script.settings.display_color_curves && one_color)
			{
				EditorGUILayout.BeginHorizontal();
			    GUILayout.Space(space+15);
				EditorGUILayout.LabelField("Red",GUILayout.Width(55));
			    EditorGUILayout.CurveField(precolor_range.curve_red);
			    EditorGUILayout.EndHorizontal();
			    EditorGUILayout.BeginHorizontal();
			    GUILayout.Space(space+15);
			    EditorGUILayout.LabelField("Green",GUILayout.Width(55));
			    EditorGUILayout.CurveField(precolor_range.curve_green);
			    EditorGUILayout.EndHorizontal();
			    EditorGUILayout.BeginHorizontal();
			    GUILayout.Space(space+15);
			    EditorGUILayout.LabelField("Blue",GUILayout.Width(55));
			    EditorGUILayout.CurveField(precolor_range.curve_blue);
			    EditorGUILayout.EndHorizontal();
			}
		}		
		if (global_script.settings.color_scheme){GUI.color = color_color_range1;}
	 }
	 
	// description functions
	function add_description(prelayer: prelayer_class,description_number: int)
	{
		prelayer.predescription.add_description(description_number+1);
		
		if (key.shift)
		{
			script.copy_description(prelayer,description_number,prelayer,description_number+1);
		}
		else if (key.alt && script.copy_description_select)
		{
			script.search_description_copy();
			script.copy_description(script.prelayers[script.copy_description_prelayer_index],script.copy_description_position,prelayer,description_number+1);
		}
		else
		{
			prelayer.predescription.description[description_number+1].text = "LayerGroup "+prelayer.predescription.description.Count;
			prelayer.predescription.description[description_number+1].edit = true;
		}
		prelayer.predescription.set_description_enum();
	}
	
	function erase_description(prelayer: prelayer_class,count_description: int)
	{
		UndoRegister("Erase LayerGroup");
		script.erase_description(prelayer,count_description);
	}
	
	function toggle_heightmap_output()
	{
		if (script.color_output) script.button_export = false;
		
		if (script.settings.showMeshes) {
			ShowNotification(new GUIContent("Generate on Meshes is active. In this mode it is only possible to use Object output."));	
			return;
		}
		
		if (key.alt)
        {
        	script.layer_heightmap_foldout = !script.layer_heightmap_foldout;
        	if (script.layer_heightmap_foldout){script.loop_prelayer("(fl)(heightmap)(true)",0,true);} else {script.loop_prelayer("(fl)(heightmap)(false)",0,true);}
        }
        else
        {
        	script.heightmap_output = !script.heightmap_output;
        	if (script.heightmap_output)
        	{
        		global_script.settings.example_buttons = 1;
        		if (global_script.settings.view_only_output) {
        			script.prelayers[current_prelayer_number].layer_output = layer_output_enum.heightmap;
        			script.set_view_only_selected(script.prelayers[current_prelayer_number],script.prelayers[current_prelayer_number].layer_output,true);
        		}
        		
        		script.color_output = false;
        		script.splat_output = false;
        		script.tree_output = false; 
        		script.grass_output = false;
        		script.object_output = false;
        		script.meshcapture_tool = false;
        	}
        	SetGeneretateButtonText();
        }
	}
	
	function toggle_color_output()
	{
		if (script.settings.showMeshes) {
			ShowNotification(new GUIContent("Generate on Meshes is active. In this mode it is only possible to use Object output."));	
			return;
		}
		if (key.alt)
       	{
       		script.layer_color_foldout = !script.layer_color_foldout;
       		if (script.layer_color_foldout){script.loop_prelayer("(fl)(color)(true)",0,true);} else {script.loop_prelayer("(fl)(color)(false)",0,true);}
       	}
       	else
       	{
       		script.color_output = !script.color_output;
       		
       		if (script.color_output)
       		{
       			if (!script.terrains[0].rtp_script) {script.button_export = true;}
       			else {
       				if (!script.terrains[0].rtp_script.ColorGlobal) {script.button_export = true;}
       			}
       			global_script.settings.example_buttons = 0;
       			if (global_script.settings.view_only_output) {
        			script.prelayers[current_prelayer_number].layer_output = layer_output_enum.color;
        			script.set_view_only_selected(script.prelayers[current_prelayer_number],script.prelayers[current_prelayer_number].layer_output,false);
        			script.prelayers[current_prelayer_number].view_splat_layer = false;
        		}
       			
       			script.meshcapture_tool = false;
        		script.splat_output = false;
       			       			       			
       			// init_color_splat_textures();
       			script.check_synchronous_terrains_textures();
       			script.heightmap_output = false;
       			
       			if (!key.shift || script.button_export) {
       				script.tree_output = false;
        			script.grass_output = false;
        			script.object_output = false;
        			
        			if (global_script.settings.view_only_output) {
        				script.prelayers[current_prelayer_number].view_heightmap_layer = false;
        				script.prelayers[current_prelayer_number].view_tree_layer = false;
        				script.prelayers[current_prelayer_number].view_grass_layer = false;
        				script.prelayers[current_prelayer_number].view_object_layer = false;
        			}
       			}
       		}
       		else {
       			script.button_export = false;
       		}
       		SetGeneretateButtonText();
       	}
    } 
	
	function toggle_splat_output()
	{
		if (script.color_output) script.button_export = false;
		if (script.settings.showMeshes) {
			ShowNotification(new GUIContent("Generate on Meshes is active. In this mode it is only possible to use Object output."));	
			return;
		}
		if (key.alt)
        {
        	script.layer_splat_foldout = !script.layer_splat_foldout;
        	if (script.layer_splat_foldout){script.loop_prelayer("(fl)(splat)(true)",0,true);} else {script.loop_prelayer("(fl)(splat)(false)",0,true);}
        }
        else
        {
        	script.splat_output = !script.splat_output;
        	
        	if (script.splat_output)
        	{
        		global_script.settings.example_buttons = 2;
        		if (global_script.settings.view_only_output) {
        			script.prelayers[current_prelayer_number].layer_output = layer_output_enum.splat;
        			script.set_view_only_selected(script.prelayers[current_prelayer_number],script.prelayers[current_prelayer_number].layer_output,false);
        			script.prelayers[current_prelayer_number].view_color_layer = false;
        		}
        		
        		script.meshcapture_tool = false;
        		script.color_output = false;
        		script.check_synchronous_terrains_textures();
        		script.heightmap_output = false;
        		
        		if (!key.shift || script.button_export) {
        			script.tree_output = false;
        			script.grass_output = false; 
        			script.object_output = false;
        			
        			if (global_script.settings.view_only_output) {
        				script.prelayers[current_prelayer_number].view_heightmap_layer = false;
        				script.prelayers[current_prelayer_number].view_tree_layer = false;
        				script.prelayers[current_prelayer_number].view_grass_layer = false;
        				script.prelayers[current_prelayer_number].view_object_layer = false;
        			}
        		}
        	}
        	SetGeneretateButtonText();
        }
    }
	
	function toggle_tree_output()
	{
		if (script.color_output) script.button_export = false;
		if (script.settings.showMeshes) {
			ShowNotification(new GUIContent("Generate on Meshes is active. In this mode it is only possible to use Object output."));	
			return;
		}
		// if (!script.button_export)
		// {
			if (key.alt)
	        {
	        	script.layer_tree_foldout = !script.layer_tree_foldout;
	        	if (script.layer_tree_foldout){script.loop_prelayer("(fl)(tree)(true)",0,true);} else {script.loop_prelayer("(fl)(tree)(false)",0,true);}
	        }
	        else
	        {
	        	script.tree_output = !script.tree_output;
	        	
	        	if (script.tree_output)
	        	{
	        		global_script.settings.example_buttons = 4;
	        		
	        		if (global_script.settings.view_only_output) {
	        			script.prelayers[current_prelayer_number].layer_output = layer_output_enum.tree;
	        			script.set_view_only_selected(script.prelayers[current_prelayer_number],script.prelayers[current_prelayer_number].layer_output,false);
	        			script.prelayers[current_prelayer_number].view_heightmap_layer = false;
        			}
        			
	        		script.heightmap_output = false;
	        		script.meshcapture_tool = false;
	        		
	        		if (!key.shift || script.button_export) {
	        			script.color_output = false;
	        			script.splat_output = false;
	        			script.grass_output = false;
	        			script.object_output = false;
	        			
	        			if (global_script.settings.view_only_output) {
	        				script.prelayers[current_prelayer_number].view_color_layer = false;
	        				script.prelayers[current_prelayer_number].view_splat_layer = false;
	        				script.prelayers[current_prelayer_number].view_grass_layer = false;
	        				script.prelayers[current_prelayer_number].view_object_layer = false;
	        			}
        			}	        		
	        	}
	        	SetGeneretateButtonText();
	       }
		//}
    }
	
	function toggle_grass_output()
	{
		if (script.color_output) script.button_export = false;
		if (script.settings.showMeshes) {
			ShowNotification(new GUIContent("Generate on Meshes is active. In this mode it is only possible to use Object output."));	
			return;
		}
		if (key.alt)
       	{
      		script.layer_grass_foldout = !script.layer_grass_foldout;
       		if (script.layer_grass_foldout){script.loop_prelayer("(fl)(grass)(true)",0,true);} else {script.loop_prelayer("(fl)(grass)(false)",0,true);}
       	}
       	else
       	{
      		script.grass_output = !script.grass_output;
      		
      		if (script.grass_output)
      		{
      			global_script.settings.example_buttons = 8;
      			
      			if (global_script.settings.view_only_output) {
        			script.prelayers[current_prelayer_number].layer_output = layer_output_enum.grass;
        			script.set_view_only_selected(script.prelayers[current_prelayer_number],script.prelayers[current_prelayer_number].layer_output,false);
        			script.prelayers[current_prelayer_number].view_heightmap_layer = false;
    			}
    			
      			script.heightmap_output = false;
      			script.meshcapture_tool = false;
      			
      			if (!key.shift || script.button_export) {
      				script.color_output = false;
      				script.splat_output = false;
      				script.tree_output = false;
    				script.object_output = false;
    				
    				if (global_script.settings.view_only_output) {
        				script.prelayers[current_prelayer_number].view_color_layer = false;
        				script.prelayers[current_prelayer_number].view_splat_layer = false;
        				script.prelayers[current_prelayer_number].view_tree_layer = false;
        				script.prelayers[current_prelayer_number].view_object_layer = false;
        			}
      			}
        	}
        	SetGeneretateButtonText();
       	}
	}
	
	function toggle_object_output()
	{
		if (script.color_output) script.button_export = false;
		if (!script.button_export)
		{
			if (key.alt)
	        {
	        	script.layer_object_foldout = !script.layer_object_foldout;
	        	if (script.layer_object_foldout){script.loop_prelayer("(fl)(object)(true)",0,true);} else {script.loop_prelayer("(fl)(object)(false)",0,true);}
	        }
	        else
	        {
	        	script.object_output = !script.object_output;
	           	if (script.settings.showMeshes) script.object_output = true;
	           	
	           	if (script.object_output)
	           	{
	           		global_script.settings.example_buttons = 16;
	           		if (global_script.settings.view_only_output) {
	        			script.prelayers[current_prelayer_number].layer_output = layer_output_enum.object;
	        			script.set_view_only_selected(script.prelayers[current_prelayer_number],script.prelayers[current_prelayer_number].layer_output,false);
	        			script.prelayers[current_prelayer_number].view_heightmap_layer = false;
        			}
        			
	           		script.heightmap_output = false;
	           		script.meshcapture_tool = false;
	           		
	           		if (!key.shift) {
	           			script.color_output = false;
	           			script.splat_output = false;
	           			script.tree_output = false;
        				script.grass_output = false;
        				
        				if (global_script.settings.view_only_output) {
	        				script.prelayers[current_prelayer_number].view_color_layer = false;
	        				script.prelayers[current_prelayer_number].view_splat_layer = false;
	        				script.prelayers[current_prelayer_number].view_tree_layer = false;
	        				script.prelayers[current_prelayer_number].view_grass_layer = false;
	        			}
        			}
	        	}
	        }
		}
    }
	
	function toggle_meshcapture_tool()
	{
		if (!script2)
        {
        	script.meshcapture_tool = !script.meshcapture_tool;
	        script.button_export = script.meshcapture_tool;
	        if (script.button_export)
	        {
	        	script.heightmap_output = false;
	        	script.color_output = false;
	        	script.splat_output = false;
	        	script.tree_output = false;
	        	script.grass_output = false;
	        	script.object_output = false;
	        }
	        SetGeneretateButtonText();
	    }
	    else
	    {
	    	this.ShowNotification(GUIContent("Cannot activate the Mesh Capture Tool while generating"));
	    }
	}
	
	function SetGeneretateButtonText()
	{
		if (script.button_export) {
			if (script.heightmap_output) {
				script.button_generate_text = "Export .Raw";
			}
			else if (script.color_output || script.splat_output || script.meshcapture_tool) {
				script.button_generate_text = "Export .Png";
			}
			else if (script.tree_output || script.grass_output) {
				script.button_generate_text = "Export Map";
			}
		}
		else {
			script.button_generate_text = "Generate";
		}
	}
	
	// layer_functions 
	function add_layer(prelayer: prelayer_class,layer_number: int,description_position: int,layer_index: int,custom: boolean)
	{
	    if (key.shift && layer_number > -1)
	    {
	    	script.add_layer(prelayer,layer_number+1,prelayer.layer_output,description_position,layer_index,false,false,false);
	    	prelayer.layer[layer_number+1] = script.copy_layer(prelayer.layer[layer_number],true,true);
	    	script.loop_layer_copy(prelayer.layer[layer_number+1]);
	    	script.count_layers();
	    }
	    else if (key.alt && script.copy_layer_select)
	    {
	    	script.add_layer(prelayer,layer_number+1,prelayer.layer_output,description_position,layer_index,false,false,false);
			script.search_layer_copy();
			prelayer.layer[layer_number+1] = script.copy_layer(script.prelayers[script.copy_prelayer_index].layer[script.copy_layer_index],true,true);
			script.loop_layer_copy(prelayer.layer[layer_number+1]);
			script.count_layers();
		}
	    else
	    {
	    	script.add_layer(prelayer,layer_number+1,prelayer.layer_output,description_position,layer_index,true,true,custom);
	    	
	    	prelayer.layer[layer_number+1].color_output.precolor_range[0].color_range_value.mode = SliderMode_Enum.MinMax;
	    	prelayer.layer[layer_number+1].color_output.precolor_range[0].color_range_value.reset_value_multi();
	    	prelayer.layer[layer_number+1].splat_output.splat_value.mode = SliderMode_Enum.MinMax;
	    	prelayer.layer[layer_number+1].splat_output.splat_value.reset_value_multi();
	    	prelayer.layer[layer_number+1].tree_output.tree_value.mode = SliderMode_Enum.MinMax;
	    	prelayer.layer[layer_number+1].tree_output.tree_value.reset_value_multi();
	    	prelayer.layer[layer_number+1].grass_output.grass_value.mode = SliderMode_Enum.MinMax;
	    	prelayer.layer[layer_number+1].grass_output.grass_value.reset_value_multi();
	    	prelayer.layer[layer_number+1].object_output.object_value.mode = SliderMode_Enum.MinMax;
	    	prelayer.layer[layer_number+1].object_output.object_value.reset_value_multi();
	    	
	    	prelayer.layer[layer_number+1].splat_output.SyncSplatCustom(script.masterTerrain.splatPrototypes.Count);
	    	prelayer.layer[layer_number+1].positionSeed = global_script.settings.positionSeed;
	    }
	    script.layers_sort(prelayer);
	}

	function add_layer2(prelayer: prelayer_class,layer_number: int,description_position: int,layer_index: int,custom: boolean) 
	{
		script.add_layer(prelayer,layer_number+1,prelayer.layer_output,description_position,layer_index,true,true,custom);
		script.layers_sort(prelayer);
	}

	function erase_layer(prelayer: prelayer_class,layer_number: int,description_index: int,layer_index: int)
	{
		var current_layer: layer_class = prelayer.layer[layer_number];
		if((current_layer.output == layer_output_enum.color && prelayer.view_color_layer) 
	    	|| (current_layer.output == layer_output_enum.splat && prelayer.view_splat_layer)
	    		|| (current_layer.output == layer_output_enum.tree && prelayer.view_tree_layer)
	    			|| (current_layer.output == layer_output_enum.grass && prelayer.view_grass_layer)
	    				|| (current_layer.output == layer_output_enum.object && prelayer.view_object_layer)
	       					 || (current_layer.output == layer_output_enum.heightmap && prelayer.view_heightmap_layer))
	    {
			UndoRegister("Erase Layer");
	    	script.erase_layer(prelayer,layer_number,description_index,layer_index,true,true,true);
	    	script.layers_sort(prelayer);
	    }
	}
	
	function swap_layer(layer: layer_class,layer_number: int,prelayer: prelayer_class)
	{
		if (!key.alt)
		{		           	   	
			if (!script.swap_layer_select)
		    {
		    	layer.swap_text = layer.swap_text.Replace("S","?");
		        layer.swap_select = true;
		        script.swap_layer_select = true;
		    } 
		    else
		    {
		    	script.search_layer_swap();
		    	if (prelayer.index == script.swap_prelayer_index)
		        {
			       	script.swap_layer(prelayer,layer_number,script.prelayers[script.swap_prelayer_index],script.swap_layer_index,true);
			       	prelayer.layer[layer_number].swap_text = prelayer.layer[layer_number].swap_text.Replace("?","S");
			       	prelayer.layer[layer_number].swap_select = false;
			       	script.swap_layer_select = false;
		        }
		        else
		        {
		         	this.ShowNotification(GUIContent("Swapping not allowed!"));
		        }
		     }
		 }
		 else
		 {
		 	if (script.copy_layer_select)
		    {
		    	script.search_layer_copy();
		    	script.prelayers[script.copy_prelayer_index].layer[script.copy_layer_index].swap_text = script.prelayers[script.copy_prelayer_index].layer[script.copy_layer_index].swap_text.Replace("*","");
		    	script.prelayers[script.copy_prelayer_index].layer[script.copy_layer_index].copy_select = false;
		    }
		    script.copy_layer_select = true;
		    layer.copy_select = true;
		    layer.swap_text = layer.swap_text.Insert(0,"*")+"*";
		 }
		 script.layers_sort(prelayer);
	}
	
	// filter_functions
	function add_filter(filter_number: int,prelayer: prelayer_class,prefilter: prefilter_class)
	{
		script.add_filter(filter_number+1,prefilter);
		if (prelayer.index > 0){script.filter[script.filter.Count-1].preimage.image_auto_scale = false;}
		if (key.shift && filter_number > -1)
		{
			script.filter[script.filter.Count-1] = script.copy_filter(script.filter[prefilter.filter_index[filter_number]],true);
			script.filter[prefilter.filter_index[filter_number+1]] = script.filter[script.filter.Count-1];
		}
		else if (key.alt && script.copy_filter_select)
		{
			var filter_position: int = script.search_filter_copy();
			script.filter[script.filter.Count-1] = script.copy_filter(script.filter[filter_position],true);
			script.filter[prefilter.filter_index[filter_number+1]] = script.filter[script.filter.Count-1];
		}
		else if (current_layer.output == layer_output_enum.heightmap) {
			script.filter[script.filter.Count-1].type = condition_type_enum.Always;
			prefilter.set_filter_text();
		}
	} 	
	
	function add_filter2(filter_number: int,prelayer: prelayer_class,prefilter: prefilter_class)
	{
		script.add_filter(filter_number+1,prefilter);
		if (prelayer.index > 0){script.filter[script.filter.Count-1].preimage.image_auto_scale = false;}
	}
	
	function erase_filter(filter_number: int,prefilter: prefilter_class)
	{
		UndoRegister("Erase Filter");
		script.erase_filter(filter_number,prefilter);
		if (prefilter.filter_index.Count > 0) {
			script.filter[prefilter.filter_index[prefilter.filter_index.Count-1]].combine = false;
		}
	}
	
	function swap_filter(filter: filter_class,filter_index: int,prefilter: prefilter_class)
	{
	  	var filter_position: int;
	  	if (!key.alt)
	  	{
		   	if (!script.swap_filter_select)
		   	{
		   		filter.swap_select = true;
		   		script.swap_filter_select = true;
		   		filter.swap_text = filter.swap_text.Replace("S","?");
		   	} 
		   	else
		   	{
		   		filter_position = script.search_filter_swap();
		   		script.filter[filter_position].swap_text = script.filter[filter_position].swap_text.Replace("?","S");
		        script.filter[filter_position].swap_select = false;
		    	script.swap_filter_select = false;
		        script.swap_filter2(prefilter.filter_index[filter_index],filter_position,true);
		        generate_auto();
		    }
		 }
		 else
		 {
		 	if (script.copy_filter_select)
		    {
		    	filter_position = script.search_filter_copy();
		    	if (filter_position != -1) {
		    		script.filter[filter_position].swap_text = script.filter[filter_position].swap_text.Replace("*","");
					script.filter[filter_position].copy_select = false;		    	
				}
		    }
		    script.copy_filter_select = true;
		    filter.copy_select = true;
		    filter.swap_text = filter.swap_text.Insert(0,"*")+"*";
		 }     
	}
	
	function swap_description(prelayer: prelayer_class,description: description_class,description_number: int)
	{
		if (!key.alt)
		{
			if (!script.swap_description_select)
			{
				description.swap_select = true;
				script.swap_description_select = true;
				description.swap_text = description.swap_text.Replace("S","?");
			}
			else
			{
				script.search_description_swap();
				if (prelayer.index != script.swap_description_prelayer_index){this.ShowNotification(GUIContent("Swapping not allowed!"));return;}
				script.prelayers[script.swap_description_prelayer_index].predescription.description[script.swap_description_position].swap_text = script.prelayers[script.swap_description_prelayer_index].predescription.description[script.swap_description_position].swap_text.Replace("?","S");
				script.prelayers[script.swap_description_prelayer_index].predescription.description[script.swap_description_position].swap_select = false;
				script.swap_description_select = false;
				if (description_number != script.swap_description_position){script.swap_description(script.swap_description_position,description_number,prelayer);}
			}
		}
		else
		{
			if (script.copy_description_select)
			{
				script.search_description_copy();
				if (script.copy_destiption_prelayer_index != -1) {
					script.prelayers[script.copy_description_prelayer_index].predescription.description[script.copy_description_position].swap_text = script.prelayers[script.copy_description_prelayer_index].predescription.description[script.copy_description_position].swap_text.Replace("*","");
					script.prelayers[script.copy_description_prelayer_index].predescription.description[script.copy_description_position].copy_select = false;				
				}
			}
			script.copy_description_select = true;
		 	description.copy_select = true;
		 	description.swap_text = description.swap_text.Insert(0,"*")+"*";
		}
	}
	// subfilter_functions
	function add_subfilter(subfilter_number: int,prelayer: prelayer_class,presubfilter: presubfilter_class)
	{
		script.add_subfilter(subfilter_number+1,presubfilter);
		
		// auto place > 0 on output -> min
		if (subfilter_number+1 > 0){script.subfilter[script.subfilter.Count-1].output = subfilter_output_enum.min;}
		
		if (prelayer.index > 0){script.subfilter[script.subfilter.Count-1].preimage.image_auto_scale = false;}
		if (key.shift && subfilter_number > -1)
		{
			script.subfilter[script.subfilter.Count-1] = script.copy_subfilter(script.subfilter[presubfilter.subfilter_index[subfilter_number]]);
			script.subfilter[presubfilter.subfilter_index[subfilter_number+1]] = script.subfilter[script.subfilter.Count-1];
		}
		else if (key.alt && script.copy_subfilter_select)
		{
			var subfilter_position: int = script.search_subfilter_copy();
			script.subfilter[script.subfilter.Count-1] = script.copy_subfilter(script.subfilter[subfilter_position]);
			script.subfilter[current_filter.presubfilter.subfilter_index[subfilter_number+1]] = script.subfilter[script.subfilter.Count-1];
		}
		else if (current_layer.output == layer_output_enum.heightmap) {
			script.subfilter[script.subfilter.Count-1].type = condition_type_enum.Always;
			presubfilter.set_subfilter_text();
		}
	}
	
	function erase_subfilter(subfilter_number: int,presubfilter: presubfilter_class)
	{
		UndoRegister("Erase Subfilter");
		script.erase_subfilter(subfilter_number,presubfilter);
	}	
	
	function swap_subfilter(subfilter: subfilter_class,subfilter_number: int,presubfilter: presubfilter_class)
	{
		var subfilter_position: int;
		if (!key.alt)
		{
			if (!script.swap_subfilter_select)
			{
				script.swap_subfilter_select = true;
				subfilter.swap_select = true;
				subfilter.swap_text = subfilter.swap_text.Replace("S","?");
			} 
			else
			{
				subfilter_position = script.search_subfilter_swap();
				script.subfilter[subfilter_position].swap_text = script.subfilter[subfilter_position].swap_text.Replace("?","S");
				script.subfilter[subfilter_position].swap_select = false;
				script.swap_subfilter_select = false;
				script.swap_subfilter2(presubfilter.subfilter_index[subfilter_number],subfilter_position,true);
				generate_auto();
			}
		}
		else
		{
			if (script.copy_subfilter_select)
			{
				subfilter_position = script.search_subfilter_copy();
				if (subfilter_position != -1)
				{
					script.subfilter[subfilter_position].swap_text = script.subfilter[subfilter_position].swap_text.Replace("*","");				
					script.subfilter[subfilter_position].copy_select = false;
				}
			}
			script.copy_subfilter_select = true;
			subfilter.copy_select = true;
			subfilter.swap_text = subfilter.swap_text.Insert(0,"*") + "*";
		}
	}
	
	// color_range_functions
	function add_color_range(color_range_number: int,precolor_range: precolor_range_class,one_color: boolean,allow_copy: boolean)
	{
		precolor_range.add_color_range(color_range_number+1,one_color);
		if (key.shift && allow_copy && color_range_number > -1)
		{
			precolor_range.color_range[color_range_number+1] = script.copy_color_range(precolor_range.color_range[color_range_number]);
		}
		else if (key.alt && script.copy_color_range_select)
		{
			precolor_range.color_range[color_range_number+1] = script.copy_color_range(script.search_color_range_copy());
			precolor_range.color_range[color_range_number+1].one_color = one_color;
		}
	}
	
	function erase_color_range(color_range_number: int,precolor_range: precolor_range_class)
	{
		UndoRegister("Erase Color Range");
		precolor_range.erase_color_range(color_range_number);
	}
	
	function swap_color_range(color_range: color_range_class,color_range_number: int,precolor_range: precolor_range_class)
	{
		if (!key.alt)
		{	
			if (!script.swap_color_range_select)
		    {
		    	color_range.swap_text = color_range.swap_text.Replace("S","?");
		        color_range.swap_select = true;
		        script.swap_color_range_select = true;
		    } 
		    else
		    {
		        script.search_color_range_swap();
		        script.swap_color_range(precolor_range,color_range_number,script.swap_precolor_range,script.swap_color_range_number);
		        precolor_range.color_range[color_range_number].swap_text = precolor_range.color_range[color_range_number].swap_text.Replace("?","S");
		        precolor_range.color_range[color_range_number].swap_select = false;
		        script.swap_color_range_select = false;
		    }
		}
		else
		{
			if (script.copy_color_range_select)
			{
				var color_range1: color_range_class = script.search_color_range_copy();
				color_range1.swap_text = color_range1.swap_text.Replace("*","");
				color_range1.copy_select = false;
			}
			script.copy_color_range_select = true;
			color_range.copy_select = true;
			color_range.swap_text = color_range.swap_text.Insert(0,"*")+"*";
		}
	}
	
	// splat functions
	function add_splat(splat_output: splat_output_class,splat_number: int,copy: boolean)
	{
		var splat_index: int = 0;
		
		if (copy && splat_number >= 0)
		{
			splat_index = splat_output.splat[splat_number];
		}
		else
		{
			if (splat_output.splat.Count > 0)
			{
				splat_index = splat_output.splat[splat_number]+1;
				
				if (splat_index+1 > script.masterTerrain.splatPrototypes.Count-1)
				{
					if (script.masterTerrain.splatPrototypes.Count > 0){splat_index = script.masterTerrain.splatPrototypes.Count-1;}
				}
			}
		}
		
		splat_output.add_splat(splat_number+1,splat_index,script.masterTerrain.splatPrototypes.Count);
		if (copy) {
			splat_output.splat_custom[splat_number+1] = script.copy_splat_custom(splat_output.splat_custom[splat_number]);
		}
	}
	
	// tree functions
	function add_tree(tree_number: int,tree_output: tree_output_class)
	{
		if (key.shift && tree_number >= 0)
		{
			tree_output.add_tree(tree_number+1,script,false);
			tree_output.tree[tree_number+1] = script.copy_tree(tree_output.tree[tree_number]);
		}
		else if (key.alt && script.copy_tree_select)
		{
			tree_output.add_tree(tree_number+1,script,false);
			tree_output.tree[tree_number+1] = script.copy_tree(script.copy_tree1);
			tree_output.tree[tree_number+1].swap_text = "S";
		}
		else 
		{
			tree_output.add_tree(tree_number+1,script,true);
			
			if (tree_output.tree.Count > 1)
			{
				tree_output.tree[tree_number+1].prototypeindex = tree_output.tree[tree_number].prototypeindex+1;
			
				if (tree_output.tree[tree_number+1].prototypeindex+1 > script.masterTerrain.treePrototypes.Count-1)
				{
					if (script.masterTerrain.treePrototypes.Count > 0){tree_output.tree[tree_number+1].prototypeindex = script.masterTerrain.treePrototypes.Count-1;}
				}
			}
		}
	}
	
	function erase_tree(tree_number: int,tree_output: tree_output_class)
	{
		UndoRegister("Erase Tree");
		tree_output.erase_tree(tree_number,script);
	}
	
	function swap_tree(tree_output: tree_output_class,tree_number: int)
	{
		if (!key.alt)
		{
			if (!script.swap_tree_select)
			{
				tree_output.tree[tree_number].swap_text = tree_output.tree[tree_number].swap_text.Replace("S","?");
				tree_output.tree[tree_number].swap_select = true;
				script.swap_tree_select = true;
			}
			else
			{
				script.search_tree_swap();
				script.swap_tree_output.tree[script.swap_tree_position].swap_text = script.swap_tree_output.tree[script.swap_tree_position].swap_text.Replace("?","S");
				script.swap_tree_output.tree[script.swap_tree_position].swap_select = false;
				script.swap_tree_select = false;
				script.swap_tree (tree_output,tree_number,script.swap_tree_output,script.swap_tree_position);
			}
		}
		else
		{
			if (script.copy_tree_select)
			{
				script.copy_tree1.swap_text = script.copy_tree1.swap_text.Replace("*","");
			}
			script.copy_tree1 = tree_output.tree[tree_number];
			script.copy_tree_select = true;
			tree_output.tree[tree_number].swap_text = tree_output.tree[tree_number].swap_text.Insert(0,"*")+"*";
			tree_output.calc_tree_value();
		}
	}
	
	// grass functions
	function add_grass(grass_output: grass_output_class,grass_number: int,copy: boolean)
	{
		grass_output.add_grass(grass_number+1);
		
		if (copy && grass_number >= 0){grass_output.grass[grass_number+1].prototypeindex = grass_output.grass[grass_number].prototypeindex;}
		else
		{
			if (grass_output.grass.Count > 1)
			{
				grass_output.grass[grass_number+1].prototypeindex = grass_output.grass[grass_number].prototypeindex+1;
				
				if (grass_output.grass[grass_number+1].prototypeindex+1 > script.masterTerrain.detailPrototypes.Count-1)
				{
					if (script.masterTerrain.detailPrototypes.Count > 0){grass_output.grass[grass_number+1].prototypeindex = script.masterTerrain.detailPrototypes.Count-1;}
				}
			}
		}
	}
	
	// object_functions
	function add_object(object_number: int,object_output: object_output_class)
	{
		script.add_object(object_output,object_number+1);
		
		if (key.shift && object_number > -1)
		{
			object_output.object[object_number+1] = script.copy_object(object_output.object[object_number]);
			script.loop_object_copy(object_output.object[object_number+1]);
		}
		else if (key.alt && script.copy_object_select)
		{
			object_output.object[object_number+1] = script.copy_object(script.search_object_copy());
			script.loop_object_copy(object_output.object[object_number+1]);
		}
	}
	
	function erase_object(object_number: int,object_output: object_output_class)
	{
		UndoRegister("Object Erase");
		script.erase_object(object_output,object_number);
	}
	
	function swap_object(object: object_class,object_number: int,object_output: object_output_class)
	{
		if (!key.alt)
		{
			if (!script.swap_object_select)
			{
				object.swap_text = object.swap_text.Replace("S","?");
				object.swap_select = true;
				script.swap_object_select = true;
			}
			else
			{
				script.search_object_swap();
				script.swap_object(object_output,object_number,script.swap_object_output,script.swap_object_number);
				object_output.object[object_number].swap_text = object_output.object[object_number].swap_text.Replace("?","S");
				object_output.object[object_number].swap_select = false;
				script.swap_object_select = false;
			}
		}
		else
		{
			if (script.copy_object_select)
			{	
				var object3: object_class = script.search_object_copy();
				object3.swap_text = object3.swap_text.Replace("*","");
				object3.copy_select = false;
			}
			object.copy_select = true;
			script.copy_object_select = true;
			object.swap_text = object.swap_text.Insert(0,"*")+"*";
		}
	}	
	
	function save_terraincomposer(path1: String)
	{
		var file_info: FileInfo = new FileInfo(path1);
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
    	
    	script.filename = file_info.Name.Replace(".prefab","");
		
		var prefab: Object;
		
    	script.set_references();
		
		AssetDatabase.DeleteAsset(path1);
		prefab = PrefabUtility.CreateEmptyPrefab(path1);
		
		if (script.settings.project_prefab) {
			PrefabUtility.ReplacePrefab(TerrainComposer_Scene,prefab,ReplacePrefabOptions.ConnectToPrefab);
		} 
		else {
			PrefabUtility.ReplacePrefab(TerrainComposer_Scene,prefab,ReplacePrefabOptions.ReplaceNameBased);
		}
		
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
	}	
	
	function save_splat_preset1(path1: String,preterrain1: terrain_class)
	{
		var file_info: FileInfo = new FileInfo(path1);
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
		
    	var object: GameObject = new GameObject();
		var script3: save_splat_preset = object.AddComponent(save_splat_preset);
		
		script3.splatPrototypes = preterrain1.splatPrototypes;
		
		AssetDatabase.DeleteAsset(path1);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path1);
		
		PrefabUtility.ReplacePrefab(object,prefab,ReplacePrefabOptions.ReplaceNameBased);
		
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		
		DestroyImmediate(object);
		
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
	}	
	
	function save_tree_preset1(path1: String,preterrain1: terrain_class)
	{
		var file_info: FileInfo = new FileInfo(path1);
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
		
    	var object: GameObject = new GameObject();
		var script3: save_tree_preset = object.AddComponent(save_tree_preset);
		
		script3.treePrototypes = preterrain1.treePrototypes;
		
		AssetDatabase.DeleteAsset(path1);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path1);
		
		PrefabUtility.ReplacePrefab(object,prefab,ReplacePrefabOptions.ReplaceNameBased);
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		
		DestroyImmediate(object);
		
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
	}	
	
	function save_grass_preset1(path1: String,preterrain1: terrain_class)
	{
		var file_info: FileInfo = new FileInfo(path1);
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
		
    	var object: GameObject = new GameObject();
		var script3: save_grass_preset = object.AddComponent(save_grass_preset);
		
		script3.detailPrototypes = preterrain1.detailPrototypes;
		
		AssetDatabase.DeleteAsset(path1);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path1);
		
		PrefabUtility.ReplacePrefab(object,prefab,ReplacePrefabOptions.ReplaceNameBased);
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		
		DestroyImmediate(object);
		
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
	}	
	
	function load_splat_preset(path1: String,preterrain1: terrain_class,splat_index,add: boolean)
	{
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
    	
    	var object: GameObject = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
    	var script3: save_splat_preset = object.GetComponent(save_splat_preset);
    	
    	if (script3) {
	    	if (!add) {
	    		preterrain1.splatPrototypes = script3.splatPrototypes;
	    	}
	    	else {
	    		for (var count_splat: int = 0;count_splat < script3.splatPrototypes.Count;++count_splat) {
	    			preterrain1.splatPrototypes.Insert(splat_index,script3.splatPrototypes[count_splat]);
	    		}
	    	}
	    	preterrain1.clear_null_splatprototype();
	    }
	    else {this.ShowNotification(GUIContent("This file is not a Splat preset"));}
    	
    	DestroyImmediate(object);
	}
	
	function load_tree_preset(path1: String,preterrain1: terrain_class,tree_index: int,add: boolean)
	{
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
    	
    	var object: GameObject = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
    	var script3: save_tree_preset = object.GetComponent(save_tree_preset);
    	
    	if (script3) {
	    	if (!add) {
	    		preterrain1.treePrototypes = script3.treePrototypes;
	    	}
	    	else {
	    		for (var count_tree: int = 0;count_tree < script3.treePrototypes.Count;++count_tree) {
	    			preterrain1.treePrototypes.Insert(tree_index,script3.treePrototypes[count_tree]);
	    		}
	    	}
	    	preterrain1.clear_null_treeprototype();
	    }
	    else {this.ShowNotification(GUIContent("This file is not a Tree preset"));}
    	
    	
    	DestroyImmediate(object);
	}
	
	function load_grass_preset(path1: String,preterrain1: terrain_class,grass_index: int,add: boolean)
	{
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
    	
    	var object: GameObject = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
    	var script3: save_grass_preset = object.GetComponent(save_grass_preset);
    	
    	if (script3) {
	    	if (!add) {
	    		preterrain1.detailPrototypes = script3.detailPrototypes;
	    	}
	    	else {
	    		for (var count_grass: int = 0;count_grass < script3.detailPrototypes.Count;++count_grass) {
	    			preterrain1.detailPrototypes.Insert(grass_index,script3.detailPrototypes[count_grass]);
	    		}
	    	}
	    	preterrain1.clear_null_detailprototype();
	    }
	   	else {this.ShowNotification(GUIContent("This file is not a Grass/Detail preset"));}
    	
    	DestroyImmediate(object);
	}
	
	function save_color_layout()
	{
		var path1: String = install_path+"/Templates/new_setup.prefab";
		TerrainComposer_Clone = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
		TerrainComposer_Clone.name = "<TC_Clone>";
		var script_clone: terraincomposer_save = TerrainComposer_Clone.GetComponent(terraincomposer_save);
		script_clone.settings.color = global_script.settings.color;
		
		AssetDatabase.DeleteAsset(path1);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path1);
		PrefabUtility.ReplacePrefab(TerrainComposer_Clone,prefab,ReplacePrefabOptions.ReplaceNameBased);
		DestroyImmediate(TerrainComposer_Clone);
	}
	
	function load_color_layout()
	{
		var path1: String = install_path+"/Templates/new_setup.prefab";
		TerrainComposer_Clone = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
		TerrainComposer_Clone.name = "<TC_Clone>";
		var script_clone: terraincomposer_save = TerrainComposer_Clone.GetComponent(terraincomposer_save);
		global_script.settings.color = script_clone.settings.color;
		
		DestroyImmediate(TerrainComposer_Clone);
	}
	
	function set_paths()
	{
		if (script)
		{
			if (script.export_path.Length == 0){script.export_path = Application.dataPath;}
        	if (script.terrain_path.Length == 0){script.terrain_path = Application.dataPath;}
        	if (script.terrain_slice_path.Length == 0){script.terrain_slice_path = Application.dataPath;}
        	if (script.settings.mesh_path.Length == 0){script.settings.mesh_path = Application.dataPath;}
        }
    }
    
    function create_terraincomposer_parent(): GameObject
	{
		var object: GameObject = new GameObject();
		
		object.name = "_TerrainComposer";
		object.transform.position = Vector3(0,0,0);
		
		return object;
	}
	
	function parent_terraincomposer_children()
	{
		var parent: GameObject = GameObject.Find("_TerrainComposer");
		
		if (parent) {
			TerrainComposer_Save = GameObject.Find("TerrainComposer_Save");
			if (TerrainComposer_Save){TerrainComposer_Save.transform.parent = parent.transform;}
			Global_Settings = GameObject.Find("global_settings");
			if (Global_Settings) {Global_Settings.transform.parent = parent.transform;}
		}
	}
    
    function load_terraincomposer(path1: String,backup: boolean,reference_restore: boolean,prefab: boolean) 
    {
    	var count: int;
    	
    	path1 = path1.Replace(Application.dataPath+"/","Assets/");
    	
    	var TerrainComposer_Scene_Old: GameObject = TerrainComposer_Scene;
       	var script_old: terraincomposer_save = script;
    	
    	var project_prefab: boolean = false;
    	
    	if (script) {
    		project_prefab = script.settings.project_prefab;
    	}
    	
    	if (prefab && project_prefab) {
    		TerrainComposer_Scene = PrefabUtility.InstantiatePrefab(AssetDatabase.LoadAssetAtPath(path1,GameObject));
    	}
    	else {
    		TerrainComposer_Scene = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
    	} 
    	TerrainComposer_Scene.name = "TerrainComposer_Save";
    	script = TerrainComposer_Scene.GetComponent(terraincomposer_save);
    	
    	script.TerrainComposer_Parent = GameObject.Find("_TerrainComposer");
       	if (!script.TerrainComposer_Parent){script.TerrainComposer_Parent = create_terraincomposer_parent();}

    	TerrainComposer_Scene.transform.parent = script.TerrainComposer_Parent.transform;
	   	
	   	if (script_old && !global_script.settings.load_terrain_data)
    	{
    		script.settings.display_short_terrain = script_old.settings.display_short_terrain;
    		script.terrain_parent = script_old.terrain_parent;
    		script.terrains.Clear();
    		for (var count_terrain: int = 0;count_terrain < script_old.terrains.Count;++count_terrain) {
	    		script.add_terrain(count_terrain);
	    		script.terrains[count_terrain] = script.copy_terrain(script_old.terrains[count_terrain]);
	    	}
	    }
	    
    	if (TerrainComposer_Scene_Old)
    	{
    		DestroyImmediate(TerrainComposer_Scene_Old);
    	}
	    
    	script.TerrainComposer_Parent = GameObject.Find("_TerrainComposer");
	   	if (!script.TerrainComposer_Parent) {
	   		script.TerrainComposer_Parent = create_terraincomposer_parent();
	   		parent_terraincomposer_children();
	   	}
		
      	if (reference_restore){script.restore_references();}
    	script.count_layers();
    	reset_paths(false);
    	script.filename = Path.GetFileNameWithoutExtension(path1);
    	set_paths();
    	set_all_image_import_settings();
    	check_terrains();	
    	
    	script.convert_software_version();
    	this.Repaint();
    }
    
    function load_global_settings()
    {
    	var path: String = install_path+"/Templates/global_settings.prefab";
    	
    	if (!File.Exists(Application.dataPath+install_path.Replace("Assets","")+"/Templates/global_settings.prefab")) {
    		 if (!File.Exists(Application.dataPath+install_path.Replace("Assets","")+"/Templates/global_settings 1.prefab")) {
    		 	FileUtil.CopyFileOrDirectory (install_path+"/Templates/global_settings 2.prefab",install_path+"/Templates/global_settings.prefab");
    		 }
    		 else {
    		 	FileUtil.CopyFileOrDirectory (install_path+"/Templates/global_settings 1.prefab",install_path+"/Templates/global_settings.prefab");
    		 }
    		 return;
    	}
    	
    	Global_Settings_Scene = AssetDatabase.LoadAssetAtPath(path,GameObject);
    	if (Global_Settings_Scene) {
    		global_script = Global_Settings_Scene.GetComponent(global_settings_tc);
    		this.Repaint();
    	}
    	else {
    		AssetDatabase.Refresh();
    	}
    }
    
    /*
    function save_global_settings()
	{	 
		if (global_script) {
		
			var path1: String = "Assets/TerrainComposer/Templates/global_settings.prefab"; 
			
			Global_Settings_Scene = GameObject.Find("global_settings");
	        
	        if (Global_Settings_Scene) {
	        	global_script = Global_Settings_Scene.GetComponent(global_settings_tc);
	      		
	      		if (global_script) {
					AssetDatabase.DeleteAsset(path1);
					var prefab: Object = PrefabUtility.CreateEmptyPrefab(path1);
					PrefabUtility.ReplacePrefab(Global_Settings_Scene,prefab,ReplacePrefabOptions.ReplaceNameBased);
					PrefabUtility.DisconnectPrefabInstance(Global_Settings_Scene);
					
					AssetDatabase.SaveAssets();
					AssetDatabase.Refresh();
				}
			}
		}
	}
	*/
	
	function save_global_settings()
	{	
		EditorUtility.SetDirty (global_script);
		EditorApplication.SaveAssets();
	}
     
    function load_layer(prelayer_number: int,layer_number: int,path: String): boolean
	{
		UndoRegister("Load Layer");
		var Load_Layer: GameObject;
		
		Load_Layer = Instantiate(AssetDatabase.LoadAssetAtPath(path,GameObject));
		
		Load_Layer.name = "<Load_Layer>";
	    var script3: save_template = Load_Layer.GetComponent(save_template);
	    if (script3)
	    {
		    script.strip_layer(script.prelayers[prelayer_number],layer_number);
		    
		    script.prelayers[prelayer_number].layer[layer_number] = script.copy_layer(script3.prelayers[0].layer[0],false,false);
		  
		    script.load_loop_layer(prelayer_number,layer_number,0,0,script3);
			
			DestroyImmediate(Load_Layer);
			script.count_layers();
			
			return true;
		}
		else 
		{
			DestroyImmediate(Load_Layer);
			this.ShowNotification(GUIContent("Loading file failed!"));
			return false;
		}
	}
	
	function convert_old_layer(layer: layer_class,report: boolean,update_version: boolean): boolean
	{
		if (script)
		{
			var software_id_new: float = 1.32;
			var software_id_old = layer.software_id;
			
			if (software_id_old < software_id_new)
			{
				for (var count_filter: int = 0;count_filter < layer.prefilter.filter_index.Count;++count_filter)
				{
					script.filter[layer.prefilter.filter_index[count_filter]].precurve_list[0] = script.filter[layer.prefilter.filter_index[count_filter]].precurve;
					
					if (script.filter[layer.prefilter.filter_index[count_filter]].precurve_list.Count > 1)
					{
						script.filter[layer.prefilter.filter_index[count_filter]].precurve_list[1] = script.filter[layer.prefilter.filter_index[count_filter]].prerandom_curve;
						script.filter[layer.prefilter.filter_index[count_filter]].precurve_list[1].type = curve_type_enum.Random;
					}
					
					for (var count_subfilter: int = 0;count_subfilter < script.filter[layer.prefilter.filter_index[count_filter]].presubfilter.subfilter_index.Count;++count_subfilter)
					{
						script.subfilter[script.filter[layer.prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list[0] = script.subfilter[script.filter[layer.prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve;
						
						if (script.subfilter[script.filter[layer.prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list.Count > 1)
						{
							script.subfilter[script.filter[layer.prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list[1] = script.subfilter[script.filter[layer.prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].prerandom_curve;
							script.subfilter[script.filter[layer.prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list[1].type = curve_type_enum.Random;
						}
					}
				}	
				for (var count_tree: int = 0;count_tree < layer.tree_output.tree.Count;++count_tree)
				{	
					for (count_filter = 0;count_filter < layer.tree_output.tree[count_tree].prefilter.filter_index.Count;++count_filter)
					{
						script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].precurve_list[0] = script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].precurve;
						
						if (script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].precurve_list.Count > 1)
						{
							script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].precurve_list[1] = script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].prerandom_curve;
							script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].precurve_list[1].type = curve_type_enum.Random;
						}
						for (count_subfilter = 0;count_subfilter < script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index.Count;++count_subfilter)
						{
							script.subfilter[script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list[0] = script.subfilter[script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve;
								
							if (script.subfilter[script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list.Count > 1)
							{
								script.subfilter[script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list[1] = script.subfilter[script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].prerandom_curve;
								script.subfilter[script.filter[layer.tree_output.tree[count_tree].prefilter.filter_index[count_filter]].presubfilter.subfilter_index[count_subfilter]].precurve_list[1].type = curve_type_enum.Random;
							}
						}
					}	
				}
				for (var count_object: int = 0;count_object < layer.object_output.object.Count;++count_object)
				{
					if (layer.object_output.object[count_object].prelayer_created){convert_old_prelayer(script.prelayers[layer.object_output.object[count_object].prelayer_index],false,false);}
				}	
				if (update_version)
				{
					layer.software_id = software_id_new;
				}
				return true;
			}
		}
		return false;
	}
	
	function convert_old_prelayer(prelayer: prelayer_class,report: boolean,update_version: boolean): boolean
	{
		if (script)
		{
			var software_id_new: float = 1.32;
			var software_id_old: float = script.software_id;
			
			if (software_id_old < software_id_new)
			{
				for (var count_layer: int = 0;count_layer < prelayer.layer.Count;++count_layer)
				{
					convert_old_layer(prelayer.layer[count_layer],false,true);
				}
				if (report)
				{
					Debug.Log("Converted filter/subfilter curves older TC file version -> "+script.software_version+" to version -> "+software_id_new);
				}
				if (update_version)
				{
					script.software_id = software_id_new;
					script.software_version = "Beta";
				}
				return true;
			}
		}
		return false;
	}
	
	function load_layergroup(path1: String,prelayer_number: int,description_number: int,layer_number: int)
	{
		UndoRegister("Load LayerGroup");
		var converted: boolean = false;
		
		var Load_LayerGroup: GameObject = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
		Load_LayerGroup.name = "<Load_LayerGroup>";
		
		var script3: save_template = Load_LayerGroup.GetComponent(save_template);
		var layer_index_length: int = script.prelayers[prelayer_number].predescription.description[description_number].layer_index.Count;
		var layer_position: int;
		
		layer_position = script.get_layer_position(script.prelayers[prelayer_number].predescription.description[description_number].layer_index.Count-1,description_number,script.prelayers[prelayer_number]);
	    
		for (var count_layer: int = 0;count_layer < script3.prelayers[0].layer.Count;++count_layer)
		{
	      	script.add_layer(script.prelayers[prelayer_number],layer_position+count_layer+1,layer_output_enum.color,description_number,script.prelayers[prelayer_number].predescription.description[description_number].layer_index.Count,false,false,false);
	      	
			script.prelayers[prelayer_number].layer[layer_position+count_layer+1] = script.copy_layer(script3.prelayers[0].layer[count_layer],false,false);
			script.load_loop_layer(prelayer_number,layer_position+count_layer+1,0,count_layer,script3);
		}
		DestroyImmediate(Load_LayerGroup);
		script.count_layers();
	}
    
    function load_precolor_range(path1: String)
    {
    	path1 = "Assets"+path1.Replace(Application.dataPath,String.Empty);
    	if (!load_precolor_range2(current_precolor_range,path1))
    	{
    		this.ShowNotification(GUIContent("Loading file failed!"));
    	}
    }
    
    function load_precolor_range2(precolor_range: precolor_range_class,path: String): boolean
	{
		var Precolor_Range: GameObject = Instantiate(AssetDatabase.LoadAssetAtPath(path,GameObject));
		Precolor_Range.name = "<Color_Range>";
		var script3: save_template = Precolor_Range.GetComponent(save_template);
		
		precolor_range.color_range.Clear();
		precolor_range.color_range = script3.precolor_range.color_range;
		precolor_range.color_range_value = script3.precolor_range.color_range_value;
		precolor_range.set_precolor_range_curve();
		DestroyImmediate(Precolor_Range);
		return true;
	}
    
    function save_layer(path: String,prelayer_number: int,layer_number: int)
	{
		path = "Assets"+path.Replace(Application.dataPath,String.Empty);
		
		var Save_Layer: GameObject = new GameObject();
		Save_Layer.name = "<Save_Layer>";
		var script3: save_template = Save_Layer.AddComponent(save_template);
		script3.filters = new List.<filter_class>();
		script3.subfilters = new List.<subfilter_class>();
		script3.prelayers = new List.<prelayer_class>();
		script3.prelayers.Add(new prelayer_class(0,0));
		script3.prelayers[0].layer.Add(new layer_class());
		script3.prelayers[0].layer[0] = script.copy_layer(script.prelayers[prelayer_number].layer[layer_number],false,false);
		script.save_loop_layer(prelayer_number,layer_number,0,0,script3);
		
		AssetDatabase.DeleteAsset(path);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path);    
		PrefabUtility.ReplacePrefab(Save_Layer,prefab);
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		AssetDatabase.Refresh();
		DestroyImmediate(Save_Layer);
	}
	
	function save_layergroup(path: String,prelayer_number: int,description_number: int)
	{
		path = "Assets"+path.Replace(Application.dataPath,String.Empty);
	
		var Save_LayerGroup: GameObject = new GameObject();
		Save_LayerGroup.name = "<Save_LayerGroup>";
		var script3: save_template = Save_LayerGroup.AddComponent(save_template);
		script3.filters = new List.<filter_class>();
		script3.subfilters = new List.<subfilter_class>();
		script3.prelayers = new List.<prelayer_class>();
		script3.prelayers.Add(new prelayer_class(0,0));
		script3.prelayers[0] = script.copy_layergroup(script.prelayers[prelayer_number],description_number,false);
		
		for (var count_layer: int = 0;count_layer < script.prelayers[prelayer_number].predescription.description[description_number].layer_index.Count;++count_layer)
		{
			script.save_loop_layer(prelayer_number,script.prelayers[prelayer_number].predescription.description[description_number].layer_index[count_layer],0,count_layer,script3);
		}
		
		AssetDatabase.DeleteAsset(path);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path);    
		PrefabUtility.ReplacePrefab(Save_LayerGroup,prefab);
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		AssetDatabase.Refresh();
		DestroyImmediate(Save_LayerGroup);
	}
	
	function save_precolor_range(path1: String)
	{
		path1 = "Assets"+path1.Replace(Application.dataPath,String.Empty);
		save_precolor_range2(current_precolor_range,path1);
	}
	
	function save_precolor_range2(precolor_range: precolor_range_class,path: String)
	{
		var Precolor_Range: GameObject = new GameObject();
		Precolor_Range.name = "<Color_Range>";
		var script3: save_template = Precolor_Range.AddComponent(save_template);
		script3.precolor_range = precolor_range;
		
		AssetDatabase.DeleteAsset(path);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path);
		PrefabUtility.ReplacePrefab(Precolor_Range,prefab);
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		AssetDatabase.Refresh();
		DestroyImmediate(Precolor_Range);
	}
	
	function main_menu(obj:Object) 
    {        
    	if (obj == "undo"){Undo.PerformUndo();}
    	if (obj == "redo"){Undo.PerformRedo();}
    	if (obj == "tab"){script.settings.tabs = !script.settings.tabs;}
    	if (obj == "color_scheme"){global_script.settings.color_scheme = !global_script.settings.color_scheme;} 
    	if (obj == "box_scheme"){script.settings.box_scheme = !script.settings.box_scheme;} 
    	if (obj == "color_curves"){script.settings.display_color_curves = !script.settings.display_color_curves;} 
    	if (obj == "mix_curves"){script.settings.display_mix_curves = !script.settings.display_mix_curves;} 
    	if (obj == "description_display"){script.description_display = !script.description_display;}
    	if (obj == "project_info"){script.settings.display_filename = !script.settings.display_filename;}
    	if (obj == "view_only_output"){global_script.settings.view_only_output = !global_script.settings.view_only_output;}
    	if (obj == "no_toggle_text")
    	{
    		global_script.settings.toggle_text_no = true;
    		global_script.settings.toggle_text_short = false;
    		global_script.settings.toggle_text_long = false;
    	}
    	
    	if (obj == "long_toggle_text")
    	{
    		global_script.settings.toggle_text_no = false;
    		global_script.settings.toggle_text_short =false;
    		global_script.settings.toggle_text_long = true;
    	}
    	if (obj == "short_toggle_text")
    	{
    		global_script.settings.toggle_text_no = false;
    		global_script.settings.toggle_text_short = true;
    		global_script.settings.toggle_text_long = false;
    	}
    	if (obj == "filter_select_text")
    	{
    		script.settings.filter_select_text = !script.settings.filter_select_text;
    	}
    	if (obj == "long_tooltip_text"){global_script.settings.tooltip_mode = 2;global_script.settings.tooltip_text_long = true;global_script.settings.tooltip_text_short = false;global_script.settings.tooltip_text_no = false;}
    	if (obj == "video_help"){global_script.settings.video_help = !global_script.settings.video_help;}
    	if (obj == "short_tooltip_text"){global_script.settings.tooltip_mode = 1;global_script.settings.tooltip_text_short = true;global_script.settings.tooltip_text_long = false;global_script.settings.tooltip_text_no = false;}
    	if (obj == "no_tooltip_text")
    	{
    		global_script.settings.tooltip_mode = 0;
    		global_script.settings.tooltip_text_no = true;
    		global_script.settings.tooltip_text_long = false;
    		global_script.settings.tooltip_text_short = false;
    		tooltip_text = String.Empty;
    	}
    	if (obj == "terraincomposer_info"){this.ShowNotification(GUIContent("TerrainComposer Version "+read_version().ToString("F2")));}
    	if (obj == "getting_started")
    	{
    		Application.OpenURL(Application.dataPath+install_path.Replace("Assets","")+"/TerrainComposer Getting Started.pdf");
    	}
    	if (obj == "main_manual")
    	{
    		Application.OpenURL(Application.dataPath+install_path.Replace("Assets","")+"/TerrainComposer.pdf");
    	}
    	if (obj == "wc_manual")
    	{
    		Application.OpenURL(Application.dataPath+install_path.Replace("Assets","")+"/WorldComposer.pdf");
    	}
    	if (obj == "update")
    	{
    		script.settings.update_display = !script.settings.update_display;
    	}
    	if (obj == "download") {
    		global_script.settings.download_display = !global_script.settings.download_display;
    	}
    	if (obj == "example") {
    		global_script.settings.example_display = !global_script.settings.example_display;
    		if (global_script.settings.example_display) {
    			this.ShowNotification(GUIContent("Save your TerrainComposer project before pressing the 'Start' or the 'Create Terrain' button in examples, as it will replace your current TC project"));
    			Debug.Log("Save your TerrainComposer project before pressing the 'Start' or the 'Create Terrain' button in examples, as it will replace your current TC project");
    		}
    	}
    	
    	if (obj == "layer_count") {
    		script.layer_count = !script.layer_count;
    		if (script.layer_count) script.count_layers();
    	}
    	if (obj == "placed_count"){script.placed_count = !script.placed_count;}
    	if (obj == "terrain_reference"){terrain_reference = !terrain_reference;}
    	if (obj == "object_reference"){object_reference = !object_reference;}
    	
    	if (obj == "generate_settings")
    	{
    		script.generate_settings = !script.generate_settings;
    	}
    	if (obj == "terrain_settings")
    	{
    		script.settings.terrain_settings = !script.settings.terrain_settings;
    	}
    	if (obj == "database_restore")
    	{
    		script.settings.database_display = !script.settings.database_display;
    		if (script.settings.database_display)
    		{
    			UndoRegister("Fix Database");
    			script.loop_prelayer("(fix)(inf)",0,true);
    		}
    	}
    	if (obj == "color_scheme_display")
    	{
    		global_script.settings.color_scheme_display = !global_script.settings.color_scheme_display;
    	}
    	if (obj == "remarks"){script.settings.remarks = !script.settings.remarks;}
    	if (obj == "meshcapture_tool")
    	{
    		toggle_meshcapture_tool();
    	}
    	if (obj == "measure_tool")
    	{
    		ToggleMeasureTool();
    	}
    	if (obj == "quick_tools")
    	{
    		script.quick_tools = !script.quick_tools;
    	}
    	if (obj == "slice_tool")
    	{
    		script.slice_tool = !script.slice_tool;
    		SetGeneretateButtonText();
    	}
    	if (obj == "texture_tool")
    	{
    		script.pattern_tool.active = false;
    		script.heightmap_tool.active = false;
    		script.texture_tool.active = true;
    		create_window_texture_tool();
    	}
    	if (obj == "pattern_tool")
    	{
    		script.pattern_tool.active = true;
    		script.heightmap_tool.active = false;
    		script.texture_tool.active = false;
    		create_window_texture_tool();
    	}
    	if (obj == "heightmap_tool")
    	{
    		script.heightmap_tool.active = true;
    		script.pattern_tool.active = false;
    		script.texture_tool.active = false;
    		create_window_texture_tool();
    	}
    	
    	if (obj == "new"){new_window = true;}
    	if (obj == "open")
    	{
    		path = EditorUtility.OpenFilePanel("Open File",Application.dataPath+install_path.Replace("Assets","")+"/save/projects","prefab");
    		
    		if (path.Length != 0){load_terraincomposer(path,true,true,true);}
    	}
    	if (obj == "save")
    	{
    		path = EditorUtility.SaveFilePanel("Save File",Application.dataPath+install_path.Replace("Assets","")+"/save/projects","","prefab");
    		
    		if (path.Length != 0)
    		{
    			save_terraincomposer(path);
    		}
    	}
    	if (obj == "close")
    	{
    		this.Close();	
    	}	
    }
       	       
    class menu_arguments_class
    {
    	var name: String;
    	var name2: String;
    	var number0: int;
    	var number1: int;
    	var number2: int;
    	var prelayer: prelayer_class;
    }
    
    function TerrainMenu(command: String)
    {
    	if (command == "Search") {
    		script.terrainSearch = !script.terrainSearch;
    	}
    }
    
    function layer_menu(obj: menu_arguments_class) 
    {        
    	var command: String = obj.name;
    	
    	if (command == "new")
    	{
    		UndoRegister("New Layer");
    		script.prelayers[menu_prelayer_number].new_layer(menu_layer_number,script.filter);
    	}
    	if (command == "open")
    	{
    		path = EditorUtility.OpenFilePanel("Open File",Application.dataPath+install_path.Replace("Assets","")+"/save/layers","prefab");
    		
    		if (path.Length != 0){load_layer(menu_prelayer_number,menu_layer_number,path.Replace(Application.dataPath,"Assets"));}
    	}
    	
    	if (command == "save")
    	{
    		path = EditorUtility.SaveFilePanel("Save File",Application.dataPath+install_path.Replace("Assets","")+"/save/layers","","prefab");
    		
    		if (path.Length != 0)
    		{
    			save_layer(path,menu_prelayer_number,menu_layer_number);
    		}
    	}
    	
    	if (command == "parent")
    	{
	    	script.replace_layer(obj.number2,obj.number0,obj.number1,obj.prelayer);
        }
    }
    
    function layerlevel_menu(command: String) 
    {
    	if (command == "fold_in") {
    		script.prelayers[menu_prelayer_number].layers_foldout = false;
    		script.prelayers[menu_prelayer_number].change_foldout_layers(false);
    	}
    	if (command == "fold_out") {
    		script.prelayers[menu_prelayer_number].layers_foldout = true;
    		script.prelayers[menu_prelayer_number].change_foldout_layers(false);
    	}
    	if (command == "interface_buttons") {
    		script.prelayers[menu_prelayer_number].interface_display_layer = !script.prelayers[menu_prelayer_number].interface_display_layer;
        	script.prelayers[menu_prelayer_number].interface_display_layergroup = script.prelayers[menu_prelayer_number].interface_display_layer;
        	Repaint();
    	}
    }
    
    function description_menu(command: String) 
    {        
    	if (command == "new")
    	{
    		new_description = true;
    		new_description_number = menu_description_number;
    	}
    	if (command == "open")
    	{
    		path = EditorUtility.OpenFilePanel("Open File",Application.dataPath+install_path.Replace("Assets","")+"/save/LayerGroups","prefab");
    		
    		if (path.Length != 0)
    		{
    			load_layergroup(path.Replace(Application.dataPath,"Assets"),menu_prelayer_number,menu_description_number,menu_layer_number);
    		}
    	}
    	if (command == "save")
    	{
    		path = EditorUtility.SaveFilePanel("Save File",Application.dataPath+install_path.Replace("Assets","")+"/save/LayerGroups","","prefab");
    		
    		if (path.Length != 0)
    		{
    			save_layergroup(path,menu_prelayer_number,menu_description_number);
    		}
    	}
    	
    	if (command == "fold_in") {
    		script.prelayers[menu_prelayer_number].predescription.description[menu_description_number].layers_foldout = false;
    		script.prelayers[menu_prelayer_number].change_layers_foldout_from_description(menu_description_number,false,script.heightmap_output,script.color_output,script.splat_output,script.tree_output,script.grass_output,script.object_output);
    	}
    	if (command == "fold_out") {
    		script.prelayers[menu_prelayer_number].predescription.description[menu_description_number].layers_foldout = true;
    		script.prelayers[menu_prelayer_number].change_layers_foldout_from_description(menu_description_number,false,script.heightmap_output,script.color_output,script.splat_output,script.tree_output,script.grass_output,script.object_output);
    	}
    	
//    	if (command == "sort")
//    	{
//    		UndoRegister("Sort LayerGroup");
//	    	script.layer_sort(script.prelayers[menu_prelayer_number],menu_description_number);                            
//        }
    }
    
    function precolor_menu(obj: menu_arguments_class) 
    {        
    	var command: String = obj.name;
    	
    	if (command == "open")
    	{
    		path = EditorUtility.OpenFilePanel("Open File",Application.dataPath+install_path.Replace("Assets","")+"/save/colors","prefab");
    		
    		if (path.Length != 0){load_precolor_range(path);}
    	}
    	if (command == "save")
    	{
    		path = EditorUtility.SaveFilePanel("Save File",Application.dataPath+install_path.Replace("Assets","")+"/save/colors","","prefab");
    		
    		if (path.Length != 0)
    		{
    			save_precolor_range(path);
    		}
    	}
    }
    
    function view_menu(obj: menu_arguments_class)
    {
    	var command: String = obj.name;
    	
    	if (command == "view_heightmap_layer"){obj.prelayer.view_heightmap_layer = !obj.prelayer.view_heightmap_layer;}
    	if (command == "view_color_layer"){obj.prelayer.view_color_layer = !obj.prelayer.view_color_layer;}
    	if (command == "view_splat_layer"){obj.prelayer.view_splat_layer = !obj.prelayer.view_splat_layer;}
    	if (command == "view_tree_layer"){obj.prelayer.view_tree_layer = !obj.prelayer.view_tree_layer;}
    	if (command == "view_grass_layer"){obj.prelayer.view_grass_layer = !obj.prelayer.view_grass_layer;}
    	if (command == "view_object_layer"){obj.prelayer.view_object_layer = !obj.prelayer.view_object_layer;}
    	
    	if (command == "view_only_selected")
    	{
    		obj.prelayer.view_only_selected = !obj.prelayer.view_only_selected;
    		if (obj.prelayer.view_only_selected){script.set_view_only_selected(obj.prelayer,obj.prelayer.layer_output,true);}
    	}
    	if (command == "view_all")
    	{
    		obj.prelayer.view_only_selected = false;
    		obj.prelayer.view_heightmap_layer = obj.prelayer.view_color_layer = obj.prelayer.view_splat_layer = obj.prelayer.view_tree_layer = obj.prelayer.view_grass_layer = obj.prelayer.view_object_layer = true;
    	}
    }
    
    function curve_menu(obj: curve_menu_arguments_class)
    {
    	var command: String = obj.name;
    	var curve: AnimationCurve;
    	if (command == "add_key")
    	{
    		var value0: float = obj.output_key;
    		var length: float = obj.output_length;
    		curve = new AnimationCurve(obj.precurve.curve.keys);
    		var value_y: float = 0;
    		if (obj.param0 == "height"){value_y = height/heightmap_scale.y;}
    		if (obj.param0 == "degree"){value_y = degree/90;}
    		var key1: Keyframe;
    		key1.time = value0/(length-1);
    		key1.value = value_y;
    		if (curve.AddKey(key1) == -1){curve.MoveKey(value0/(length-1),key1);}
    		obj.precurve.curve = new AnimationCurve(curve.keys);
    	}
    	
    	else if (obj.name == "copy")
    	{
    		if (script.curve_in_memory_old){script.curve_in_memory_old.curve_in_memory = false;script.curve_in_memory_old.curve_text = "Curve";}
    		curve_copy = obj.precurve.curve;
    		obj.precurve.curve_in_memory = true; 
    		obj.precurve.curve_text = "*Curve*";
    		script.curve_in_memory_old = obj.precurve;
    	}
    	else if (obj.name == "paste")
    	{
    		if (curve_copy){obj.precurve.curve = new AnimationCurve(curve_copy.keys);}
    	}
    	
    	else if (obj.name == "set_zero")
    	{
    		UndoRegister("Set Zero Curve");
    		obj.precurve.set_zero();
			generate_auto();
    	}
    	else if (obj.name == "invert")
    	{
    		obj.precurve.set_invert();
    		generate_auto();
    	}
    	else if (obj.name == "default")
    	{
    		UndoRegister("Default Curve");
			obj.precurve.set_default();
			generate_auto();
    	}
    	if (obj.name == "set default")
    	{
    		UndoRegister("Set Default Curve");
			obj.precurve.set_as_default();
		}
    	else if (obj.name == "default_perlin")
    	{
    		obj.precurve.default_perlin();
    		curve_change = true;
    		generate_auto();
    	}
    	
    	this.Repaint();
    }
    
    class curve_menu_arguments_class 
    {
    	var precurve: animation_curve_class = new animation_curve_class();
    	var output_length: float;
    	var output_key: float;
    	var name: String;
    	var param0: String;
    }
    
    function curve_menu_button(precurve: animation_curve_class,output_length: int,rect: Rect)
    {
    	var userdata: curve_menu_arguments_class[] = new curve_menu_arguments_class[7];
    	
        var menu: GenericMenu;
    	menu = new GenericMenu ();
    	userdata[0] = new curve_menu_arguments_class(); 
    	userdata[0].name = "copy";                   
    	userdata[0].precurve = precurve;            
       	
       	userdata[1] = new curve_menu_arguments_class();
       	userdata[1].name = "paste";
       	userdata[1].precurve = precurve; 
       	
       	userdata[2] = new curve_menu_arguments_class(); 
        userdata[2].precurve = precurve;
    	userdata[2].name = "set_zero";   
                       
        userdata[3] = new curve_menu_arguments_class(); 
        userdata[3].precurve = precurve;
    	userdata[3].name = "invert";  
    	
    	userdata[4] = new curve_menu_arguments_class(); 
    	userdata[4].precurve = precurve;
    	userdata[4].name = "default";  
    	
    	userdata[5] = new curve_menu_arguments_class(); 
    	userdata[5].precurve = precurve;
    	userdata[5].name = "set default";   
    	
    	userdata[6] = new curve_menu_arguments_class(); 
    	userdata[6].precurve = precurve;
    	userdata[6].name = "default_perlin";   
    	
    	if (Application.platform == RuntimePlatform.OSXEditor)
    	{
        	menu.AddItem (new GUIContent("Copy"),false,curve_menu,userdata[0]);
	        menu.AddItem (new GUIContent("Paste"),false,curve_menu,userdata[1]);                
	        menu.AddSeparator(""); 
	     	menu.AddItem (new GUIContent("Invert"),false,curve_menu,userdata[3]);                
	        menu.AddItem (new GUIContent("Set Zero"),false,curve_menu,userdata[2]);                
	     	menu.AddItem (new GUIContent("Default"),false,curve_menu,userdata[4]);                
	        menu.AddSeparator(""); 
	        menu.AddItem (new GUIContent("Set Default"),false,curve_menu,userdata[5]);
	        menu.AddSeparator(""); 
	        menu.AddItem (new GUIContent("Default Perlin"),false,curve_menu,userdata[6]);                
        }
        else
        {	
        	menu.AddItem (new GUIContent("Edit/Copy"),false,curve_menu,userdata[0]);
	        menu.AddItem (new GUIContent("Edit/Paste"),false,curve_menu,userdata[1]);                
	        menu.AddSeparator(""); 
	     	menu.AddItem (new GUIContent("Line/Invert"),false,curve_menu,userdata[3]);                
	        menu.AddItem (new GUIContent("Line/Set Zero"),false,curve_menu,userdata[2]);                
	     	menu.AddItem (new GUIContent("Line/Default"),false,curve_menu,userdata[4]);                
	        menu.AddSeparator("Line/"); 
	        menu.AddItem (new GUIContent("Line/Set Default"),false,curve_menu,userdata[5]);                
	        menu.AddSeparator("Line/"); 
	        menu.AddItem (new GUIContent("Line/Default Perlin"),false,curve_menu,userdata[6]);
        }
      
        menu.DropDown (rect);
    }
    
    function copy_curve(curve1: AnimationCurve,curve2: AnimationCurve)
    {
    	curve1 = new AnimationCurve(curve2.keys);
    }

	static function get_terrain_point(terrain: Terrain,point: Vector3,interpolated: boolean): Vector2
	{
		var terrain_point: Vector2;
		
		var position: Vector3 = point-terrain.transform.position;
		var resolution: float;
		if (interpolated){resolution = terrain.terrainData.heightmapResolution;} else {resolution = terrain.terrainData.alphamapResolution;}
								
		var rel_x: float = terrain.terrainData.size.x / resolution;
		var rel_z: float = terrain.terrainData.size.z / resolution;
		terrain_point.x = (position.x/rel_x);
		terrain_point.y = (position.z/rel_z);
		
		if (interpolated)
		{
			terrain_point.x = terrain_point.x / resolution;
			terrain_point.y = terrain_point.y / resolution;
		}
		return terrain_point;
	}	
	
	function auto_search_list(preimage: image_class)
	{
		// if (preimage.image.Count > 1)
		// {
			if (!preimage.image[0]){return;}
			var path: String = AssetDatabase.GetAssetPath(preimage.image[0]);
			if (path == String.Empty){return;}
			var name: String = Path.GetFileName(path);
			path = path.Replace("/"+name,String.Empty);
			preimage.auto_search.path = path;
			
			var image_search_format: String = preimage.auto_search.format;
			var format: String;
			var digit: String = new String("0"[0],preimage.auto_search.digits);
			
			var tiles: Vector2 = script.terrains[0].tiles;
			
			var count_image: int = 0;
			var texture: Texture2D;
					
			for (var y: int = 0;y < tiles.y;++y) { 
				for (var x: int = 0;x < tiles.x;++x) {
					if (x == 0 && y == 0) {++count_image;continue;}
					// x = terrainArea.terrains[count_terrain].tile_x;
					// y = terrainArea.terrains[0].tiles.y-terrainArea.terrains[count_terrain].tile_z-1;
					format = image_search_format.Replace("%x",(x+preimage.auto_search.start_x).ToString(digit));
					format = format. Replace("%y",(y+preimage.auto_search.start_y).ToString(digit));
					format = format.Replace("%n",(count_image+preimage.auto_search.start_n).ToString(digit));
					
					// Debug.Log("terrain"+count_terrain+" "+x+","+y+" format: "+format);
					
					if (!preimage.short_list) {
						texture = AssetDatabase.LoadAssetAtPath(path+"/"+preimage.auto_search.filename+format+preimage.auto_search.extension,Texture2D);
					
						preimage.image[count_image] = texture;
					}
					
					global_script.set_image_import_settings(path+"/"+preimage.auto_search.filename+format+preimage.auto_search.extension,true,TextureImporterFormat.RGB24,TextureWrapMode.Clamp,script.set_import_resolution_from_list(preimage.import_max_size_list),true,FilterMode.Trilinear,9,9);
					
					++count_image;
				}
			}
		//}
	}
	
//	function auto_search_list2(preimage: image_class)
//	{
//		// if (preimage.image.Count > 1)
//		// {
//			if (!preimage.image[0]){return;}
//			var path: String = AssetDatabase.GetAssetPath(preimage.image[0]);
//			if (path == String.Empty){return;}
//			var name: String = Path.GetFileName(path);
//			path = path.Replace("/"+name,String.Empty);
//			preimage.auto_search.path = path;
//			
//			var image_search_format: String = preimage.auto_search.format;
//			var format: String;
//			var digit: String = new String("0"[0],preimage.auto_search.digits);
//			
//			var tiles: int;
//			
//			if (!preimage.short_list) {
//		    	tiles = Mathf.Sqrt(preimage.image.Count);
//		    }
//		    else {
//		    	tiles = Mathf.Sqrt(terrainArea.terrains.Count);
//		    }
//			var count_image: int = 0;
//			var texture: Texture2D;
//			var x: int;
//			var y: int;
//					
//			for (var count_terrain: int = 0;count_terrain < terrainArea.terrains.Count;++count_terrain)
//			{
//				x = terrainArea.terrains[count_terrain].tile_x;
//				y = terrainArea.terrains[0].tiles.y-terrainArea.terrains[count_terrain].tile_z-1;
//				format = image_search_format.Replace("%x",(x+preimage.auto_search.start_x).ToString(digit));
//				format = format.Replace("%y",(y+preimage.auto_search.start_y).ToString(digit));
//				format = format.Replace("%n",(count_image+preimage.auto_search.start_n).ToString(digit));
//				
//				// Debug.Log("terrain"+count_terrain+" "+x+","+y+" format: "+format);
//				
//				if (!preimage.short_list) {
//					texture = AssetDatabase.LoadAssetAtPath(path+"/"+preimage.auto_search.filename+format+preimage.auto_search.extension,Texture2D);
//				
//					preimage.image[count_image] = texture;
//				}
//				
//				global_script.set_image_import_settings(path+"/"+preimage.auto_search.filename+format+preimage.auto_search.extension,true,TextureImporterFormat.RGB24,TextureWrapMode.Clamp,script.set_import_resolution_from_list(preimage.import_max_size_list),true,FilterMode.Trilinear,9,9);
//				
//				++count_image;
//			}
//		//}
//	}
	
	function strip_auto_search_image_file(preimage: image_class)
	{
		var path: String = AssetDatabase.GetAssetPath(preimage.image[0]);
		if (path.Length == 0){return;}
		var digit_x: String = new String(preimage.auto_search.start_x.ToString()[0],preimage.auto_search.digits);
		var digit_y: String = new String(preimage.auto_search.start_y.ToString()[0],preimage.auto_search.digits);
		var number: int = 0;
		
		var format: String = preimage.auto_search.format.Replace("%x",number.ToString(digit_x));
		format = format.Replace("%y",number.ToString(digit_y));
		format = format.Replace("%n",number.ToString(digit_x));
		
		preimage.auto_search.filename = (Path.GetFileNameWithoutExtension(path)).Replace(format,String.Empty);;
		preimage.auto_search.extension = Path.GetExtension(path);
		
		//preimage.auto_search_filename = preimage.auto_search_filename.Replace(preimage.auto_search_extension,String.Empty);
	}
	
	function save_name_string(auto_search: auto_search_class,default1: boolean)
	{
		for (var count_search: int = 0;count_search < global_script.auto_search_list.Count;++count_search)
		{
			if (auto_search.format == global_script.auto_search_list[count_search].format && auto_search.digits == global_script.auto_search_list[count_search].digits
				&& auto_search.start_x == global_script.auto_search_list[count_search].start_x && auto_search.start_y == global_script.auto_search_list[count_search].start_y
					&& auto_search.start_n == global_script.auto_search_list[count_search].start_n)
			{
				if (default1)
				{
					global_script.auto_search_list.Insert(0,global_script.auto_search_list[count_search]);
					global_script.auto_search_list.RemoveAt(count_search+1);
					save_global_settings();
					return;
				}
				else
				{
					ShowNotification(GUIContent("The Naming String is already in the global list"));
					return;
				}
			}
		
		}
		global_script.auto_search_list.Add(new auto_search_class());
		
		global_script.auto_search_list[global_script.auto_search_list.Count-1].format = auto_search.format;
		global_script.auto_search_list[global_script.auto_search_list.Count-1].digits = auto_search.digits;
		global_script.auto_search_list[global_script.auto_search_list.Count-1].start_x = auto_search.start_x;
		global_script.auto_search_list[global_script.auto_search_list.Count-1].start_y = auto_search.start_y;
		global_script.auto_search_list[global_script.auto_search_list.Count-1].start_n = auto_search.start_n;
		global_script.auto_search_list[global_script.auto_search_list.Count-1].output_format = auto_search.output_format;
		
		auto_search.select_index = global_script.auto_search_list.Count-1;
		
		save_global_settings();		
	}
	
	function erase_name_string(auto_search: auto_search_class)
	{
		for (var count_search: int = 0;count_search < global_script.auto_search_list.Count;++count_search)
		{
			if (auto_search.format == global_script.auto_search_list[count_search].format && auto_search.digits == global_script.auto_search_list[count_search].digits
				&& auto_search.start_x == global_script.auto_search_list[count_search].start_x && auto_search.start_y == global_script.auto_search_list[count_search].start_y
					&& auto_search.start_n == global_script.auto_search_list[count_search].start_n)
			{
				global_script.auto_search_list.RemoveAt(count_search);
				auto_search.select_index = 0;
				save_global_settings();		
				return;
			}
		
		}
		
		ShowNotification(GUIContent("The Naming String is not in the global list"));
	}

	function erase_terrains(length: int,terrainData: boolean)
	{
		for (var count_terrain1: int = 0;count_terrain1 < length+1;++count_terrain1)
		{
			erase_terrain(script.terrains[script.terrains.Count-1],terrainData);
			script.set_terrain_length(script.terrains.Count-1);	
		}
		// script.reset_terrains_tiles(script);
		// if (script.settings.auto_fit_terrains){fit_all_terrains();}
		if (terrainData){AssetDatabase.Refresh();}
	}
	
	function erase_terrain(preterrain: terrain_class,terrainData: boolean)
	{
		if (preterrain.terrain)
		{
			if (terrainData){AssetDatabase.DeleteAsset(AssetDatabase.GetAssetPath(preterrain.terrain.terrainData));} 
			DestroyImmediate(preterrain.terrain.gameObject);
		}
	}
	
		
	function create_terrain(preterrain: terrain_class,length: int,start_number: int,name_number: int,terrain_path: String,terrain_parent: Transform)
	{
		/*
		if (script.settings.cull_optimizer) {
			assign_cull_script();
		}
		*/
		var terrainNameString: String;
		var copy_terrain_settings: boolean = false;
		if (script.terrains.Count > 1 && preterrain.index > 0 && preterrain.copy_terrain_settings){copy_terrain_settings = true;}
		
		for (var count_terrain1: int = 0;count_terrain1 < length;++count_terrain1)
		{
		    var terrainData: TerrainData = new TerrainData();
			
			terrainData.heightmapResolution = preterrain.heightmap_resolution;
			terrainData.baseMapResolution = preterrain.basemap_resolution;
			terrainData.alphamapResolution = preterrain.splatmap_resolution;
			terrainData.SetDetailResolution(preterrain.detail_resolution,preterrain.detail_resolution_per_patch);
			if (preterrain.size.x <= 0){preterrain.size.x = 1000;}
			if (preterrain.size.z <= 0){preterrain.size.z = 1000;}
			if (preterrain.size.y <= 0){preterrain.size.y = 250;}
			terrainData.size = preterrain.size;
	    
		    var object: GameObject = new GameObject(); 
		    if (terrain_parent){object.transform.parent = terrain_parent;}
		   
		    var terrain: Terrain = object.AddComponent(Terrain);
		    var script_collider: TerrainCollider = object.AddComponent(TerrainCollider);
		    terrainNameString = count_terrain1.ToString()+name_number.ToString();
		    terrain.name = script.terrain_scene_name+terrainNameString;
		    terrain.terrainData = terrainData;
		    var path: String = terrain_path;
		    path = "Assets"+path.Replace(Application.dataPath,String.Empty);
		    path += "/"+script.terrain_asset_name+terrainNameString+".asset";
			AssetDatabase.CreateAsset(terrainData,path);
		    script_collider.terrainData = terrainData;
		    if (script.terrains.Count < count_terrain1+start_number){script.set_terrain_length(script.terrains.Count+1);}
		    if (copy_terrain_settings) {
		    	script.terrains[count_terrain1+start_number-1] = script.copy_terrain(script.terrains[preterrain.copy_terrain]);
		    	#if !UNITY_3_4 && !UNITY_3_5
		    	if (script.settings.copy_terrain_material) {
		    		terrain.materialTemplate = script.terrains[preterrain.copy_terrain].terrain.materialTemplate;
		    	}
		    	#endif
		    }
		    
		    script.terrains[count_terrain1+start_number-1].terrain = terrain;
		    script.set_terrain_parameters(script.terrains[count_terrain1+start_number-1],script.terrains[start_number-1]);
		    script.get_terrain_settings(script.terrains[count_terrain1+start_number-1],"(res)(con)(fir)");
		    script.terrains[count_terrain1+start_number-1].tile_x = 0;
		    script.terrains[count_terrain1+start_number-1].tile_z = 0;
		    script.terrains[count_terrain1+start_number-1].tiles = Vector2(1,1);
		    script.terrains[count_terrain1+start_number-1].terrain.transform.position = Vector3(-preterrain.size.x/2,0,-preterrain.size.z/2);
		    script.set_terrain_splat_textures(script.terrains[count_terrain1+start_number-1],script.terrains[start_number-1]);
		    script.set_terrain_trees(script.terrains[count_terrain1+start_number-1]);
		    script.set_terrain_details(script.terrains[count_terrain1+start_number-1]);
		    script.terrains[count_terrain1+start_number-1].prearea.max();
		    script.terrains[count_terrain1+start_number-1].foldout = false;
		    if (script.terrains[count_terrain1+start_number-1].rtp_script) {script.assign_rtp_single(script.terrains[start_number-1]);}
		    // script.assign_terrain_splat_alpha(script.terrains[count_terrain1+start_number-1]);
		}
		AssetDatabase.Refresh();
		if (select_window) {select_window.Repaint();}
	}
	
	function CreateTerrains(preterrain: terrain_class,terrain_path: String,terrain_parent: Transform,tiles: Vector2)
	{
		var terrainData: TerrainData;
		var terrainObject: GameObject;
		var terrain: Terrain;
		var colliderScript: TerrainCollider;
		
		var nameString: String;
		var path: String;
		var index: int;
		
		script.DeleteTerrain(script.terrains[0]);
		// script.terrains[0] = script.copy_terrain(preterrain);
		
		script.clear_terrain_list(true);
		
		if (script.terrains[0].size.x == 0) script.terrains[0].size.x = 1000;
		if (script.terrains[0].size.y == 0) script.terrains[0].size.y = 500;
		if (script.terrains[0].size.z == 0) script.terrains[0].size.z = 1000;
		
		for (var y: int = 0;y < tiles.y;++y) {
			for (var x: int = 0;x < tiles.x;++x) {
				if (x !=0 || y != 0) script.terrains.Add(new terrain_class());
				
				index = script.terrains.Count-1;
				
				if (x !=0 || y != 0) script.terrains[index] = script.copy_terrain(script.terrains[0]);
				
				script.terrains[index].tile_x = x;
				script.terrains[index].tile_z = y;
				script.terrains[index].tiles = tiles;
				script.terrains[index].index = index;
				
				terrainObject = new GameObject();
				if (terrain_parent) terrainObject.transform.parent = terrain_parent;
				terrain = terrainObject.AddComponent(Terrain);
				colliderScript = terrainObject.AddComponent(TerrainCollider);
				
				nameString = "_x"+x.ToString()+"_y"+y.ToString();
				terrain.name = script.terrain_scene_name+nameString;
				
				terrainData = new TerrainData();
				terrainData.size = script.terrains[0].size;
				terrain.terrainData = terrainData;
				colliderScript.terrainData = terrainData;
				
				script.terrains[index].terrain = terrain;
				// script.setTerrainAreaMax(script.terrains[index]);
				script.set_terrain_settings(script.terrains[index],"(all)");
				// script.set_terrain_splat_textures(script.terrains[index],script.terrains[0]);
				// script.set_terrain_trees(script.terrains[index]);
				// script.set_terrain_details(script.terrains[index]);
												
				#if !UNITY_3_4 && !UNITY_3_5
		    	if (script.settings.copy_terrain_material) {
		    		terrain.materialTemplate = script.terrains[0].terrain.materialTemplate;
		    	}
		    	#endif
				
				path = terrain_path;
		    	path = "Assets"+path.Replace(Application.dataPath,String.Empty);
		    	path += "/"+script.terrain_asset_name+nameString+".asset";
		    	AssetDatabase.DeleteAsset(path);
				AssetDatabase.CreateAsset(terrainData,path);
				
				script.set_terrain_parameters(script.terrains[index],script.terrains[0]);
				// script.get_terrain_parameter_settings(script.terrains[index]);
				
				script.terrains[index].foldout = false;
		    	if (script.terrains[0].rtp_script) {script.assign_rtp_single(script.terrains[index]);}
		    }
		}
		
		script.set_all_terrain_area(script.terrains[0]);
		script.assign_all_terrain_splat_alpha();
		script.set_all_terrain_splat_textures(script.terrains[0],true,true);
		script.set_all_terrain_trees(script.terrains[0]);
		script.set_all_terrain_details(script.terrains[0]);
		
		fit_all_terrains(script.terrains[0]);
	}
	
	function check_terrains()
	{
		for (var count_terrain1: int = 0;count_terrain1 < script.terrains.Count;++count_terrain1)
		{
			script.check_synchronous_terrain_size(script.terrains[count_terrain1]);
			if (!script.color_output){script.check_synchronous_terrain_textures(script.terrains[count_terrain1]);}
				else {script.check_synchronous_terrain_textures(script.terrains[count_terrain1]);}
			script.check_synchronous_terrain_resolutions(script.terrains[count_terrain1]);
			script.check_synchronous_terrain_trees(script.terrains[count_terrain1]);
			script.check_synchronous_terrain_detail(script.terrains[count_terrain1]);
			
			// script.assign_terrain_splat_alpha(script.terrains[count_terrain1]);
		}
	}
	
	var notify: String = "";
	
	function ExportSplatmaps()
	{
		for (var countTerrain: int = 0;countTerrain < script.terrains.Count;++countTerrain) {
			if (script.terrains[countTerrain].active) ExportSplatmap(script.terrains[countTerrain],countTerrain);
		
		}
		if (notify != "") {
			ShowNotification(new GUIContent(notify));
			notify = "";
		}		
		AssetDatabase.Refresh();
	}

	function ExportSplatmap(preterrain1: terrain_class,index: int)
	{
		if (preterrain1.terrain) 
		{
			if (!preterrain1.terrain.terrainData){return;}
			if (preterrain1.terrain.terrainData.splatPrototypes.Length < 1){return;}
			
			// update_terrain_asset(preterrain1);
			
			var terrainDataType: Type = preterrain1.terrain.terrainData.GetType();
			var info: PropertyInfo = terrainDataType.GetProperty("alphamapTextures", BindingFlags.Instance | BindingFlags.NonPublic);
			if (info == null) info = terrainDataType.GetProperty("alphamapTextures", BindingFlags.Instance | BindingFlags.Public);
			if (info != null) {
				preterrain1.splat_alpha = info.GetValue(preterrain1.terrain.terrainData, null) as Texture2D[];
				for (var i: int = 0;i < preterrain1.splat_alpha.Length;++i) {
					export_texture_to_file (script.export_path,script.export_file+Convert.ToChar(i+65)+"_"+index.ToString(),preterrain1.splat_alpha[i]);
					AssetDatabase.Refresh();
					set_image_import_settings((script.export_path+"/"+script.export_file+Convert.ToChar(i+65)+"_"+index.ToString()+".png").Replace(Application.dataPath,"Assets"),0,1,2,0);
					notify += "Exported -> "+script.export_file+Convert.ToChar(i+65)+"_"+index.ToString()+"\n";
				}
			} 
			else{
				Debug.LogError("Can't access alphamapTexture directly...");
			}
		}
	}
	
//	function assign_all_terrain_splat_alpha()
//	{
//		for (var count_terrain1: int = 0;count_terrain1 < script.terrains.Count;++count_terrain1)
//		{
//			script.assign_terrain_splat_alpha(script.terrains[count_terrain1]);
//		}
//	}
	
	function update_terrain_asset(preterrain: terrain_class)
	{
		if (preterrain.terrain)
		{
			var path: String = AssetDatabase.GetAssetPath(preterrain.terrain.terrainData);
			
			AssetDatabase.ImportAsset(path);
        }
	}
	
	function update_all_terrain_asset()
	{
		for (var count_terrain1: int = 0;count_terrain1 < script.terrains.Count;++count_terrain1)
		{
			update_terrain_asset(script.terrains[count_terrain1]);
		}
	}
	
	function check_content_done()
	{
	    if (!content_checked)
        {
	        if (EditorApplication.timeSinceStartup < 120)
	        {
	        	set_all_image_import_settings();
	        	if (read_check() > 0)
	        	{
	        		check_content_version();
	        		content_checked = true;
	        	}
	        	else
	        	{
	        		content_checked = true;
	        	}
	        }
	    }
	    
	    if (global_script.settings.downloading == 1) {
	    	if (global_script.settings.download) {
	    		if (global_script.settings.download.isDone) {
	        		global_script.settings.downloading = 0;
	        		if (!global_script.settings.download.error) {
	        			File.WriteAllBytes(Application.dataPath+install_path.Replace("Assets","")+"/Download/TerrainComposer_Island.unitypackage",global_script.settings.download.bytes);
	        		}
	        	}
	        } 
	        else {
	        	global_script.settings.downloading = 0;
	        }
	    }
	    
	    if (global_script.settings.downloading2 == 1) {
	    	if (global_script.settings.download2) {
	    		if (global_script.settings.download2.isDone) {
	        		global_script.settings.downloading2 = 0;
	        		if (!global_script.settings.download2.error) {
	        			#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 
	        			File.WriteAllBytes(Application.dataPath+install_path.Replace("Assets","")+"/Download/TerrainComposer_Examples1.2.unitypackage",global_script.settings.download2.bytes);
	        			#else
	        			File.WriteAllBytes(Application.dataPath+install_path.Replace("Assets","")+"/Download/TerrainComposer_Examples5.0.unitypackage",global_script.settings.download2.bytes);
	        			#endif
	        		}
	        	}
	        } 
	        else {
	        	global_script.settings.downloading2 = 0;
	        }
	    }
	    
	    if (script.settings.loading > 0)
        {
        	if (!script.settings.contents){script.settings.loading = 0;return;}
        	
        	var update_select: int = read_check();
        	if (script.settings.loading == 1)
        	{
	        	if (script.settings.contents.isDone)
	        	{
	        		script.settings.loading = 0;
	        		var new_version: float;
	        		var old_version: float;
	        		
	        		old_version = read_version();
	        		write_checked(System.DateTime.Now.Day.ToString());
	        		if (Single.TryParse(script.settings.contents.text,new_version))
	        		{
		        		script.settings.new_version = new_version;
		        		script.settings.old_version = old_version;
		        		if (new_version > old_version)
		        		{
		        			this.ShowNotification (GUIContent("A new TerrainComposer update is available"));
		        			if (update_select == 0)
		        			{
		        				script.settings.update_version = true;
		        			}
		        			else if (update_select == 1)
		        			{
		        				script.settings.update_display = true;
		        				script.settings.update_version = true;
		        			}
		        			else if (update_select > 1)
		        			{
		        				script.settings.update_version = true;
		        				content_version();		
		        			}
		        		}
		        		else
		        		{
		        			script.settings.update_version = false;
		        		}
		        	}
		        }
	        }
        	else if (script.settings.loading == 2)
        	{
	        	if (!script.settings.contents){script.settings.loading = 0;return;}
        	
	        	if (script.settings.contents.isDone)
	        	{
	        		script.settings.loading = 0;
	        		script.settings.update_version2 = true;
	        		script.settings.update_version = false;
	        		File.WriteAllBytes(Application.dataPath+install_path.Replace("Assets","")+"/Update/TerrainComposer.unitypackage",script.settings.contents.bytes);
	        		if (update_select < 3)
	        		{
	        			script.settings.update_display = true;
	        		}
	        		else if (update_select == 3)
	        		{
	        			script.settings.update_display = true;
	        			import_contents(Application.dataPath+install_path.Replace("Assets","")+"/Update/TerrainComposer.unitypackage",false);
	        		}
	        		else if (update_select == 4)
	        		{
	        			import_contents(Application.dataPath+install_path.Replace("Assets","")+"/Update/TerrainComposer.unitypackage",false);
	        		}
	        	}
	        }
	        else if (script.settings.loading == 3)
	        {
	        	if (script.settings.new_version == read_version())
	        	{
	        		AssetDatabase.SaveAssets();
	        		AssetDatabase.Refresh();
	        		script.settings.loading = 4;
	        	}
	        	else if (EditorApplication.timeSinceStartup > script.settings.time_out + 60){script.settings.loading = 0;Debug.Log("Time out with importing TerrainComposer update...");}
	        }
	        else if (script.settings.loading == 4) {
	        		load_button_textures();
	        		Debug.Log("Updated TerrainComposer version "+script.settings.old_version+" to version "+read_version().ToString("F3"));
	        		this.ShowNotification(GUIContent("Updated TerrainComposer version "+script.settings.old_version+" to version "+read_version().ToString("F3")));
	        		// create_info_window();
					script.settings.loading = 0;
	        		global_script.settings.download_display = true;
	        		this.Repaint();
	        }
	    }
	}
	
//	function init_color_splat_textures()
//	{
//		if (global_script.settings.color_splatPrototypes.Length < 4) {
//			global_script.settings.color_splatPrototypes = new splatPrototype_class[4];
//			for (var count_splat: int = 0;count_splat < 4;++count_splat) {
//				global_script.settings.color_splatPrototypes[count_splat] = new splatPrototype_class();
//			}
//		}
//		
//		if (!global_script.settings.color_splatPrototypes[3].texture)
//		{
//			global_script.settings.color_splatPrototypes[0].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/ground_red.png",Texture) as Texture2D;	
//			global_script.settings.color_splatPrototypes[1].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/ground_green.png",Texture) as Texture2D;	
//			global_script.settings.color_splatPrototypes[2].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/ground_blue.png",Texture) as Texture2D;	
//			global_script.settings.color_splatPrototypes[3].texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Templates/Textures/black.png",Texture) as Texture2D;	
//			
//			set_image_import_settings(global_script.settings.color_splatPrototypes[0].texture,1,1,-1,-1);
//			set_image_import_settings(global_script.settings.color_splatPrototypes[1].texture,1,1,-1,-1);
//			set_image_import_settings(global_script.settings.color_splatPrototypes[2].texture,1,1,-1,-1);
//			set_image_import_settings(global_script.settings.color_splatPrototypes[3].texture,1,1,-1,-1);
//		}
//	}
	
	function init_colormap()
	{
		if (script.settings.colormap)
		{
			for (var count_terrain1: int = 0;count_terrain1 < script.terrains.Count;++count_terrain1)
			{
				if (!script.terrains[count_terrain1].colormap.texture)
				{
					script.terrains[count_terrain1].colormap.texture = AssetDatabase.LoadAssetAtPath(install_path+"/Templates/Textures/black.png",Texture) as Texture2D;	
				}
			}
		}
	}
	
//	function set_terrain_color_textures(): boolean
//	{
//		var refresh_rtp: boolean = false;
//		
//		if (script.terrains[0].rtp_script) {
//			if (script.terrains[0].rtp_script.ColorGlobal) {
//				// set_rtp_colormap_import_settings();
//				return true;
//			}
//		}
//		
//		for (var count_terrain1: int = 0;count_terrain1 < script.terrains.Count;++count_terrain1)
//		{
//			if (!script.terrains[count_terrain1].terrain){continue;}
//			if (!script.terrains[count_terrain1].terrain.terrainData){continue;}
//			script.check_synchronous_terrain_textures(script.terrains[count_terrain1]);
//			if (!script.terrains[count_terrain1].splat_synchronous)
//			{
//				init_color_splat_textures();
//				script.set_terrain_color_textures(script.terrains[count_terrain1]);
//				// assign_all_terrain_splat_alpha();
//				script.check_synchronous_terrain_textures(script.terrains[count_terrain1]);
//				refresh_rtp = true;
//			}
//		}
//		
//		if (refresh_rtp && script.terrains[0].rtp_script) {
//			script.terrains[0].rtp_script.globalSettingsHolder.RefreshAll();
//		}
//		
//		return false;
//	}
	
	function set_rtp_colormap_import_settings()
	{
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			set_image_import_settings(script.terrains[count_terrain].rtp_script.ColorGlobal,1,1,2,-1);
		}
	}
	
	function set_terrain_splat_textures()
	{
		var refresh_rtp: boolean = false;
		for (var count_terrain1: int = 0;count_terrain1 < script.terrains.Count;++count_terrain1)
		{
			if (!script.terrains[count_terrain1].terrain){continue;}
			if (!script.terrains[count_terrain1].terrain.terrainData){continue;}
			script.check_synchronous_terrain_textures(script.terrains[count_terrain1]);
			if (!script.terrains[count_terrain1].splat_synchronous)
			{
				script.set_terrain_splat_textures(script.terrains[count_terrain1],script.terrains[count_terrain1]);
				// script.assign_terrain_splat_alpha(script.terrains[count_terrain1]);
				script.check_synchronous_terrain_textures(script.terrains[count_terrain1]);
				refresh_rtp = true;
			}
		}
		
		if (refresh_rtp && script.terrains[0].rtp_script) {
			script.terrains[0].rtp_script.globalSettingsHolder.RefreshAll();
		}
	}
	
	function set_image_import_settings(image: Texture2D,read: int,truecolor: int,wrapmode: int,maxsize: int)
	{
		if (!image){return;}
		
		var path: String = AssetDatabase.GetAssetPath(image);
		if (path.Length == 0){return;}
		var textureImporter: TextureImporter = AssetImporter.GetAtPath(path) as TextureImporter;
		
		var change: boolean = false;
		
		if (!textureImporter.isReadable && read > 0)
		{
			textureImporter.isReadable = true;
			change = true;
		}
		
		if (textureImporter.textureFormat != TextureImporterFormat.AutomaticTruecolor && truecolor > 0)
		{
			textureImporter.textureFormat = TextureImporterFormat.AutomaticTruecolor;
			change = true;
		}
		
		if (wrapmode > 0)
		{
			if (wrapmode == 1){textureImporter.wrapMode = TextureWrapMode.Repeat;}
			if (wrapmode == 2){textureImporter.wrapMode = TextureWrapMode.Clamp;}
			change = true;
		}
		
		if (maxsize > 0)
		{
			textureImporter.maxTextureSize = maxsize;
			change = true;
		}
		
		if (change){AssetDatabase.ImportAsset(path);}
	}
	
	function set_image_import_settings(path: String,read: int,truecolor: int,wrapmode: int,maxsize: int)
	{
		if (path.Length == 0){return;}
		var textureImporter: TextureImporter = AssetImporter.GetAtPath(path) as TextureImporter;
		
		if (textureImporter == null) return;
		
		var change: boolean = false;
		
		if (!textureImporter.isReadable && read > 0)
		{
			textureImporter.isReadable = true;
			change = true;
		}
		
		if (textureImporter.textureFormat != TextureImporterFormat.AutomaticTruecolor && truecolor > 0)
		{
			textureImporter.textureFormat = TextureImporterFormat.AutomaticTruecolor;
			change = true;
		}
		
		if (wrapmode > 0)
		{
			if (wrapmode == 1){textureImporter.wrapMode = TextureWrapMode.Repeat;}
			if (wrapmode == 2){textureImporter.wrapMode = TextureWrapMode.Clamp;}
			change = true;
		}
		
		if (maxsize > 0)
		{
			textureImporter.maxTextureSize = maxsize;
			change = true;
		}
		
		if (change){AssetDatabase.ImportAsset(path);}
	}
	
	function get_image_import_max_size(texture: Texture2D,set_max: boolean): int
	{
		if (!texture){return;}
		
		var path: String = AssetDatabase.GetAssetPath(texture);
		if (path.Length == 0){return;}
		var textureImporter: TextureImporter = AssetImporter.GetAtPath(path) as TextureImporter;
		
		if (set_max)
		{
			textureImporter.maxTextureSize = texture.width;
			AssetDatabase.ImportAsset(path);
		}
		
		return textureImporter.maxTextureSize;
	}
	
	function set_all_image_import_settings()
	{
		var count_image: int;
		
		for (var count_filter: int = 0;count_filter < script.filter.Count;++count_filter)
		{
			for (count_image = 0;count_image < script.filter[count_filter].preimage.image.Count;++count_image)
			{
				set_image_import_settings(script.filter[count_filter].preimage.image[count_image],1,1,-1,-1);
			}
		}
		
		for (var count_subfilter: int = 0;count_subfilter < script.subfilter.Count;++count_subfilter)
		{
			for (count_image = 0;count_image < script.subfilter[count_subfilter].preimage.image.Count;++count_image)
			{
				set_image_import_settings(script.subfilter[count_subfilter].preimage.image[count_image],1,1,-1,-1);
			}
		}
	}
	
	function assign_combinechildren()
	{
		script.Combine_Children = AssetDatabase.LoadAssetAtPath(install_path+"/CombineChildren.prefab",GameObject);
	}
	
	function import_contents(path: String,window: boolean)
	{
		var file_info: FileInfo = new FileInfo(Application.dataPath+"/tc_build/build.txt");
		if (file_info.Exists){Debug.Log("Updating canceled because of development version");} 
		else 
		{
			AssetDatabase.Refresh();
			AssetDatabase.ImportPackage(path,window);
			this.OnEnable();
			this.Repaint();
			// create_info_window();
		}
	
		script.settings.update_version2 = false;
		script.settings.time_out = EditorApplication.timeSinceStartup;
		script.settings.loading = 3;
	}
	
	function fit_all_terrains(preterrain: terrain_class)
	{
		var fit: int = script.FitTerrainTiles(preterrain,true);
		// script.set_terrain_settings(script.preterrain,"(siz)");
		if (fit == -1){this.ShowNotification(GUIContent("Only one Terrain tile!"));}
		if (fit == -2){this.ShowNotification(GUIContent("Assign all Terrains!"));}
		if (fit == -3)
		{
			calc_terrains_needed_square();			
		}
	}
	
	function calc_terrains_needed_square()
	{
		var terrain_needed: int = Mathf.Sqrt(script.terrains.Count);
		var terrain_needed_min: int = script.terrains.Count-Mathf.Pow(terrain_needed,2);
		var terrain_needed_max: int = Mathf.Pow(terrain_needed+1,2)-script.terrains.Count;
		var terrain_text1: String;
		var terrain_text2: String;
					        			
		if (terrain_needed_min < 2){terrain_text1 = "terrain";} else {terrain_text1 = "terrains";}
		if (terrain_needed_max < 2){terrain_text2 = "terrain";} else {terrain_text2 = "terrains";}
					        			
		this.ShowNotification(GUIContent("Terrain List length needs to be 1,4,9,16,25,36,49,64,etc. You need to add "+terrain_needed_max+" "+terrain_text2+" or erase "+terrain_needed_min+" "+terrain_text1));
	}
	
	function CheckIP()
	{
		script.settings.myExt = WWW("http://checkip.dyndns.org");
	    if(script.settings.myExt == null){return;}
	    script.settings.ipr = true;
	}
	
	function create_window_texture_tool()
	{
		script.image_tools = true;
		texture_tool = EditorWindow.GetWindow(FilterTexture);
	    texture_tool.ShowWindow();
	    texture_tool.script = script;
	    texture_tool.global_script = global_script;
	    texture_tool.tc_script = this;
	    texture_tool.pattern_first_init();
	    texture_tool.heightmap_first_init();
	}
	
	function create_map_window(text: String)
	{
		map_window = EditorWindow.GetWindow(Type.GetType("Map_tc"));
				
		// preview_window.minSize = Vector2(1536,768);
		#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
		map_window.title = text;
		#else
		map_window.titleContent = new GUIContent(text);
		#endif
		map_window.display_text = false;
		map_window.minSize = Vector2(8,8);
		// preview_window.maxSize = Vector2(1600,800);
		
		map_window.tc_script = this;
		// map_window.request_map();
		map_window.Repaint();
	}
	
	function process_out(bytes: byte[]): byte[]
	{
		for (var count_byte: int = 0;count_byte < bytes.Length;++count_byte)
		{
			bytes[count_byte] = 255-bytes[count_byte];
		}
		return bytes;
	}
	
	function create_window_measure_tool()
	{
		measure_tool = EditorWindow.GetWindow (MeasureTool);
		measure_tool_id = measure_tool.GetInstanceID();
	    measure_tool.ShowWindow();
	    measure_tool.script = script;
	    measure_tool.global_script = global_script;
	    measure_tool.tc_script = this;
	}
	
	function create_preview_window(texture: Texture2D,text: String)
	{
		if (!texture){return;}
		preview_window = EditorWindow.GetWindow(ShowTexture);
		if (preview_window.texture == texture && !preview_window.displaySplat){preview_window.Close();return;}
		preview_window.minSize = Vector2(512,512);
		#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
		preview_window.title = text;
		#else
		preview_window.titleContent = new GUIContent(text);
		#endif
		preview_window.texture = texture;
		preview_window.display_text = false;
		preview_window.displaySplat = false;
	}
	
	function create_preview_window(preterrain: terrain_class,splat_custom: splat_custom_class)
	{
		preview_window = EditorWindow.GetWindow(ShowTexture);
		if (preview_window.splat_custom == splat_custom && preview_window.texture == null){preview_window.Close();return;}
		preview_window.minSize = Vector2(512,512);
		#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
		preview_window.title = "Splat Mix";
		#else
		preview_window.titleContent = new GUIContent("Splat Mix");
		#endif
		preview_window.displaySplat = true;
		preview_window.splatPrototypes = preterrain.splatPrototypes;
		preview_window.splat_custom = splat_custom;
		preview_window.texture = null;
		
		preview_window.display_text = false;
	}
	
	function create_select_window(mode: int)
	{
		select_window = EditorWindow.GetWindow(AssignTextures);
		// if (preview_window.texture == texture){preview_window.Close();return;}
		// select_window.minSize = Vector2(512,512);
		select_window.mode = mode;
		#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
		select_window.title = "Select";
		#else
		select_window.titleContent = new GUIContent("Select");
		#endif
		select_window.script = script;
		select_window.tc_script = this;
		select_window.global_script = global_script;
	}
	
	function create_curve_help_window(texture: Texture2D,text: String,input: String)
	{
		if (!texture){return;}
		preview_window = EditorWindow.GetWindow(ShowTexture);
		if (preview_window.texture == texture){preview_window.Close();return;}
		preview_window.minSize = Vector2(512,512);
		#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
		preview_window.title = text;
		#else
		preview_window.titleContent = new GUIContent(text);
		#endif
		preview_window.texture = texture;
		preview_window.text = input;
		preview_window.display_text = true;
	}
	
	function stitch_terrains()
	{
		var same_code:int = script.check_terrains_same_resolution();
		if (same_code == 1)
		{
			script.get_terrains_position();
			if (script.stitch_terrains(script.stitch_tool_border_influence)){script.stitch_terrains(script.terrains[0].heightmap_conversion.x*1.5);}
		}
		else if (same_code == -1){this.ShowNotification(GUIContent("The heightmap resolution of all Terrains must be the same"));}
		else if (same_code == -2){this.ShowNotification(GUIContent("All Terrains must be assigned"));}
	}
	
	function read_version(): float
	{
		var sr: StreamReader = new File.OpenText(Application.dataPath+install_path.Replace("Assets","")+"/Update/version.txt");
		var text: String = sr.ReadLine();
		sr.Close();
		
		var version: float;
		Single.TryParse(text,version);
		
		return version;
	}
	
	function write_check(text: String)
	{
		var sw: StreamWriter = new StreamWriter(Application.dataPath+install_path.Replace("Assets","")+"/Update/check.txt");
		sw.WriteLine(text);
		sw.Close();
	}
	
	function read_check(): int
	{
		if (!File.Exists(Application.dataPath+install_path.Replace("Assets","")+"/Update/check.txt")){write_check("1");}
		
		var sr: StreamReader = new File.OpenText(Application.dataPath+install_path.Replace("Assets","")+"/Update/check.txt");
		var text: String = sr.ReadLine();
		sr.Close();
		
		var version: int;
		Int32.TryParse(text,version);
		
		return version;
	}
	
	function write_checked(text: String)
	{
		var sw: StreamWriter = new StreamWriter(Application.dataPath+install_path.Replace("Assets","")+"/Update/last_checked.txt");
		sw.WriteLine(text);
		sw.Close();
	}
	
	function read_checked(): float
	{
		if (!File.Exists(Application.dataPath+install_path.Replace("Assets","")+"/Update/last_checked.txt")){write_checked("-1");}
		
		var sr: StreamReader = new File.OpenText(Application.dataPath+install_path.Replace("Assets","")+"/Update/last_checked.txt");
		
		var text: String = sr.ReadLine();
		sr.Close();
		
		var version: float;
		Single.TryParse(text,version);
		
		return version;
	}
	
	function contents_text()
	{
		//FileStream fileStream = new FileStream("Path here", FileMode.Open);
	}
	
	function add_raw_file(file: String): int
	{
		var inlist: int = script.check_raw_file_in_list(file);
		var file_info: FileInfo = new FileInfo(file);
		if (file_info.Exists)
		{
			var resolution: float = Mathf.Sqrt(file_info.Length/2);
			
			if (inlist != -1)
			{
				script.raw_files[inlist].resolution.x = resolution;
				script.raw_files[inlist].resolution.y = resolution;
				return inlist;
			}
			
			script.raw_files.Add(new raw_file_class());
			script.raw_files[script.raw_files.Count-1].filename = file_info.Name;
			script.raw_files[script.raw_files.Count-1].file = file;
			script.raw_files[script.raw_files.Count-1].resolution.x = resolution;
			script.raw_files[script.raw_files.Count-1].resolution.y = resolution;
			script.raw_files[script.raw_files.Count-1].assigned = true;
			script.raw_files[script.raw_files.Count-1].created = true;
			
			if (resolution != Mathf.Round(Mathf.Sqrt(file_info.Length/2))){
				script.raw_files[script.raw_files.Count-1].square = false;
			}
			
			return (script.raw_files.Count-1);
		}
		return -1;
	}
	
	function auto_search_heightmap(preterrain1: terrain_class)
	{
		var file: String = script.raw_files[preterrain1.raw_file_index].file;
		var file_info: FileInfo = new FileInfo(file);
		
		var path: String = file_info.DirectoryName.Replace("\\","/");
		var name: String = file_info.Name;
		var new_name: String;
		var raw_file_index: int;
		
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain)
		{
			if (!script.terrains[count_terrain].terrain){continue;}
			if (!script.terrains[count_terrain].terrain.terrainData){continue;}
			new_name = path+"/"+Path.GetFileNameWithoutExtension(file)+count_terrain.ToString()+".raw";
			raw_file_index = add_raw_file(new_name);
			
			if (raw_file_index > -1)
			{
				script.terrains[count_terrain].raw_file_index = raw_file_index;
				script.raw_files[raw_file_index].mode = script.raw_files[preterrain1.raw_file_index].mode;
				if (script.terrains[count_terrain].color_terrain[0] < 1.5){script.terrains[count_terrain].color_terrain += Color(0.5,0.5,1,0.5);}
			}
		}
		script.clean_raw_file_list();
	}
	
	function RefreshRawFiles()
	{
		var file_info: FileInfo;
		var resolution: float;
		
		for (var i: int = 0;i< script.raw_files.Count;++i) {
			if (script.raw_files[i] == null) continue;
			if (script.raw_files[i].square) {
				
				file_info = new FileInfo(script.raw_files[i].file);
				if (file_info.Exists)
				{
					resolution = Mathf.Sqrt(file_info.Length/2);
					
					script.raw_files[i].resolution.x = resolution;
					script.raw_files[i].resolution.y = resolution;
					
					if (resolution != Mathf.Round(Mathf.Sqrt(file_info.Length/2))){
						script.raw_files[i].square = false;
					}
				}
				else {
					Debug.Log("The raw file "+script.raw_files[i].file+" does not exists anymore, please reload it in your filter(s)/mask(s)");
					ShowNotification(new GUIContent("The raw file "+script.raw_files[i].file+" does not exists anymore, please reload it in your filter(s)/mask(s)"));
					// script.reset_raw_file(i);
					// script.erase_raw_file(i);
					// --i;
				}
			}
		}
	}
	
	function ChangeRawFolders(source: String, destination: String)
	{
		var index: int;
		var file: String;
		var log: String;
		
		source = source.Substring(0, source.LastIndexOf("/"));
		// Debug.Log(source);
		
		for (var i: int = 0;i< script.raw_files.Count;++i) {
			file = script.raw_files[i].file;
			// Debug.Log(file);
			if (file.Contains(source)) {
				index = file.LastIndexOf("/");
				script.raw_files[i].file = destination+"/"+file.Substring(index + 1, file.Length - (index + 1));
				log += "Changed "+file+" to "+script.raw_files[i].file+"\n";
				// Debug.Log(destination+"/"+file.Substring(index + 1, file.Length - (index + 1)));
			}
		}
		
		Debug.Log(log);
	}
	
	function auto_search_raw(raw: raw_class)
	{
		if (raw.file_index.Count < 2 || raw.file_index[0] < 0){return;}
		if (!script.raw_files[raw.file_index[0]].assigned){return;}
		
		var name: String = script.raw_files[raw.file_index[0]].filename;
		var path: String = script.raw_files[raw.file_index[0]].file.Replace(name,String.Empty);
		var file_index: int;
		var count_raw: int = 0;
		
		var raw_search_format: String = raw.auto_search.format;
		var format: String;
		var digit: String = new String("0"[0],raw.auto_search.digits);
		var start_y = raw.auto_search.start_y;
		var tiles: Vector2 = script.terrains[0].tiles;
		
		for (var y: int = 0;y < tiles.y;++y) {
			if (count_raw >= raw.file_index.Count) break;
			for (var x: int = 0;x < tiles.x;++x) {
				if (x == 0 && y == 0) {++count_raw;continue;}
				format = raw_search_format.Replace("%x",(x+raw.auto_search.start_x).ToString(digit));
				format = format.Replace("%y",(y+raw.auto_search.start_y).ToString(digit));
				format = format.Replace("%n",(count_raw+raw.auto_search.start_n).ToString(digit));
				
				file_index = add_raw_file(path+raw.auto_search.filename+format+raw.auto_search.extension);
				if (file_index > -1){raw.file_index[count_raw] = file_index;}
				++count_raw;
			}
		}
		script.clean_raw_file_list();
	}
	
	function auto_search_raw2(raw: raw_class)
	{
		if (raw.file_index.Count < 2 || raw.file_index[0] < 0){return;}
		if (!script.raw_files[raw.file_index[0]].assigned){return;}
		
		var name: String = script.raw_files[raw.file_index[0]].filename;
		var path: String = script.raw_files[raw.file_index[0]].file.Replace(name,String.Empty);
		var file_index: int;
		var count_raw: int = 0;
		
		var raw_search_format: String = raw.auto_search.format;
		var format: String;
		var digit: String = new String("0"[0],raw.auto_search.digits);
		var start_y = raw.auto_search.start_y;
		var tiles: int = Mathf.Sqrt(raw.file_index.Count);
		
		for (var x: int = 0;x < tiles;++x)
		{
			for (var y: int = 0;y < tiles;++y)
			{
				format = raw_search_format.Replace("%x",(x+raw.auto_search.start_x).ToString(digit));
				format = format.Replace("%y",(y+raw.auto_search.start_y).ToString(digit));
				format = format.Replace("%n",(count_raw+raw.auto_search.start_n).ToString(digit));
				
				file_index = add_raw_file(path+raw.auto_search.filename+format+raw.auto_search.extension);
				if (file_index > -1){raw.file_index[count_raw] = file_index;}
				++count_raw;
			}
		}
		script.clean_raw_file_list();
	}
	
	
	function save_raw(terrain_index,raw_file: raw_file_class)
	{
		if (!script.terrains[terrain_index].terrain){return;}
		
		var resolution: float = script.terrains[terrain_index].terrain.terrainData.heightmapResolution;
		
		var bytes: byte[] = new byte[resolution*resolution*2];
		
		heights = script.terrains[terrain_index].terrain.terrainData.GetHeights(0,0,resolution,resolution);
		
		var count_x: int = 0;
		var count_y: int = 0;
		var byte_hi: int;
		var byte_lo: int;
		var i: int = 0;
		var value_int: ushort;
		var height: float;
		    	    	    	    	    	    	    	    	    	    	    	    	
	    if (raw_file.mode == raw_mode_enum.Mac)
	    {
		   	for (count_y = 0;count_y < resolution;++count_y) 
		   	{
				for (count_x = 0;count_x < resolution;++count_x) 
				{
					height = heights[resolution-1-count_y,count_x]*65535;
	
					value_int = height;
					
					byte_hi = value_int >> 8;
					byte_lo = value_int-(byte_hi << 8);
					
					bytes[i++] = byte_hi;
					bytes[i++] = byte_lo;
				}
			}
		}
				
		else if (raw_file.mode == raw_mode_enum.Windows)
		{
			for (count_y = 0;count_y < resolution;++count_y) 
		   	{
				for (count_x = 0;count_x < resolution;++count_x) 
				{
					height = heights[resolution-count_y-1,count_x]*65535;
	
					value_int = height;
					
					byte_hi = value_int >> 8;
					byte_lo = value_int-(byte_hi << 8);
					
					bytes[i++] = byte_lo;
					bytes[i++] = byte_hi;
				}
			}
		}
		
		File.WriteAllBytes(raw_file.file+"_"+count_terrain.ToString()+".raw",bytes);
		heights = new float[0,0];
		bytes = new byte[0];
	}
	
	function save_combined_raw(raw_file: raw_file_class)
	{
		var export_file: FileStream;
		var path: String = raw_file.file+".raw";
		var count_x: int = 0;
		var count_y: int = 0;
		var byte_hi: int;
		var byte_lo: int;
		var value_int: ushort;
		var height: float;
		var position: ulong;
		var terrainPosition: ulong;
		var totalWidth: int;
		var resolution: float = script.terrains[0].terrain.terrainData.heightmapResolution-1;
		var bytes: byte[] = new byte[resolution*2];
		
		totalWidth = resolution*script.terrains[0].tiles.x;
		
		export_file = new FileStream(path,FileMode.Create);
		
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			if (!script.terrains[count_terrain].terrain){return;}
			if (!script.terrains[count_terrain].terrain.terrainData){return;}
			// if (!script.terrains[count_terrain].active) {continue;}
			
			heights = script.terrains[count_terrain].terrain.terrainData.GetHeights(0,0,resolution,resolution);
			
			// terrainPosition = ;
			
			terrainPosition = ((script.terrains[count_terrain].tiles.y-script.terrains[count_terrain].tile_z-1)*totalWidth*2*(resolution))+(script.terrains[count_terrain].tile_x*(resolution)*2);
			position = totalWidth*2;
			export_file.Seek (terrainPosition,SeekOrigin.Begin);
																											
			if (raw_file.mode == raw_mode_enum.Windows)
			{
				for (count_y = 0;count_y < resolution;++count_y) 
			   	{
					for (count_x = 0;count_x < resolution;++count_x) 
					{
						height = heights[resolution-count_y-1,count_x]*65535;
		
						value_int = height;
						
						byte_hi = value_int >> 8;
						byte_lo = value_int-(byte_hi << 8);
						
						bytes[count_x*2] = byte_lo;
						bytes[(count_x*2)+1] = byte_hi;
					}
					export_file.Write (bytes,0,resolution*2);
					export_file.Seek (position-(resolution*2),SeekOrigin.Current);
				}
			}
			
			else if (raw_file.mode == raw_mode_enum.Mac)
		    {
			   	for (count_y = 0;count_y < resolution;++count_y) 
			   	{
					for (count_x = 0;count_x < resolution;++count_x) 
					{
						height = heights[resolution-count_y-1,count_x]*65535;
		
						value_int = height;
						
						byte_hi = value_int >> 8;
						byte_lo = value_int-(byte_hi << 8);
						
						bytes[count_x*2] = byte_hi;
						bytes[(count_x*2)+1] = byte_lo;
					}
					export_file.Write (bytes,0,resolution*2);
					export_file.Seek (position-(resolution*2),SeekOrigin.Current);
				}
			}
		}
		
		heights = new float[0,0];
		bytes = new byte[0];
		
		export_file.Close();
	}
	
	function save_trees()
	{
		var Trees: GameObject;
		Trees = new GameObject();
		var tree_script: save_trees = Trees.AddComponent.<save_trees>();
		var treeInstances: TreeInstance[];
		var treeTypes: int = 0;
		
		
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			if (!script.terrains[count_terrain].terrain) {continue;}
			if (!script.terrains[count_terrain].terrain.terrainData) {continue;}
			
			if (script.terrains[count_terrain].terrain.terrainData.treePrototypes.Length > treeTypes) {
				treeTypes = script.terrains[count_terrain].terrain.terrainData.treePrototypes.Length;
			}
			
			tree_script.tree_save.Add(new tree_save_class());
			
			treeInstances = script.terrains[count_terrain].terrain.terrainData.treeInstances;
			for (var count_tree: int = 0;count_tree < treeInstances.Length;++count_tree) {
				tree_script.tree_save[count_terrain].treeInstances.Add(new treeInstance_class());
				
				tree_script.tree_save[count_terrain].treeInstances[count_tree].position = treeInstances[count_tree].position;
				tree_script.tree_save[count_terrain].treeInstances[count_tree].widthScale = treeInstances[count_tree].widthScale;
				tree_script.tree_save[count_terrain].treeInstances[count_tree].heightScale = treeInstances[count_tree].heightScale;
				tree_script.tree_save[count_terrain].treeInstances[count_tree].color = treeInstances[count_tree].color;
				tree_script.tree_save[count_terrain].treeInstances[count_tree].lightmapColor = treeInstances[count_tree].lightmapColor;
				tree_script.tree_save[count_terrain].treeInstances[count_tree].prototypeIndex = treeInstances[count_tree].prototypeIndex;
				
			}
		}
		
		tree_script.treeTypes = treeTypes;
		
		var path1: String = script.export_path;
		var filename: String = script.export_file;
		
		path1 = path1.Replace(Application.dataPath,"Assets");
    	path1 += "/"+filename+".prefab";
    	var prefab: Object;
    	AssetDatabase.DeleteAsset(path1);
		prefab = PrefabUtility.CreateEmptyPrefab(path1);
		
		PrefabUtility.ReplacePrefab(Trees,prefab,ReplacePrefabOptions.ReplaceNameBased);
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
		
		DestroyImmediate(Trees);
	}
	
	function save_grass()
	{
		var Grass: GameObject;
		Grass = new GameObject();
		var grass_script: save_grass = Grass.AddComponent.<save_grass>();
		var grassCount: int;
		var length: int;
		var detail: int[,];
		var resolution: int;
		
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			if (!script.terrains[count_terrain].terrain) {continue;}
			if (!script.terrains[count_terrain].terrain.terrainData) {continue;}
			
			grass_script.grass_save.Add(new grass_save_class());
			
			grassCount = script.terrains[count_terrain].terrain.terrainData.detailPrototypes.Length;
			length = script.terrains[count_terrain].terrain.terrainData.detailPrototypes.Length;
			resolution = script.terrains[count_terrain].terrain.terrainData.detailResolution;
			
			if (!detail) {
				detail = new int[resolution,resolution];
			}
			
			if (detail.Length != resolution*resolution) {
				detail = new int[resolution,resolution];
			}
			
			for (var count_grass: int = 0;count_grass < grassCount;++count_grass) {
				detail = script.terrains[count_terrain].terrain.terrainData.GetDetailLayer(0,0,resolution,resolution,count_grass);
				grass_script.grass_save[count_terrain].resolution = resolution;
				grass_script.grass_save[count_terrain].details.Add(new detail_save_class());
				for (var count_detail: int = 0;count_detail < detail.Length;++count_detail) {
					grass_script.grass_save[count_terrain].details[count_grass].detail.Add(detail[count_detail-((count_detail/resolution)*resolution),count_detail/resolution]);
				}
			}
		}
		
		var path1: String = script.export_path;
		var filename: String = script.export_file;
		
		path1 = path1.Replace(Application.dataPath,"Assets");
    	path1 += "/"+filename+".prefab";
    	var prefab: Object;
    	
    	AssetDatabase.DeleteAsset(path1);
		prefab = PrefabUtility.CreateEmptyPrefab(path1);
		
		PrefabUtility.ReplacePrefab(Grass,prefab,ReplacePrefabOptions.ReplaceNameBased);
		// VersionControl.Provider.Checkout(prefab,CheckoutMode.Both);
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
		
		DestroyImmediate(Grass);
	}
	
	function load_trees(treemap_index: int)
	{
		// var Trees: GameObject = new GameObject();
		/*
		var path1: String = script.export_path;
		var filename: String = script.export_file;
		
		path1 = path1.Replace(Application.dataPath,"Assets/");
    	path1 += filename+".prefab";
    	
		Trees = AssetDatabase.LoadAssetAtPath(path1,GameObject);
    	*/
    	
		var tree_script: save_trees = script.settings.treemap[treemap_index].map.GetComponent("save_trees");
		var treeInstances: List.<TreeInstance> = new List.<TreeInstance>();
		var tempInstance: TreeInstance;
		var length: int;
		var prototype: int;
		
		UnityEngine.Random.seed = 10;
		
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			if (!script.terrains[count_terrain].terrain) {continue;}
			if (!script.terrains[count_terrain].terrain.terrainData) {continue;}
			// tree_script.tree_save.Add(new tree_save_class());
			
			if (tree_script.tree_save.Count-1 < count_terrain) {return;}
			
			length = tree_script.tree_save[count_terrain].treeInstances.Count;
			treeInstances.Clear();
			
			for (var count_tree: int = 0;count_tree < length;++count_tree) {
				// tree_script.tree_save[count_terrain].treeInstances.Add(new treeInstance_class());
				prototype = tree_script.tree_save[count_terrain].treeInstances[count_tree].prototypeIndex;
				if (UnityEngine.Random.Range(0.0,1.0) > script.settings.treemap[treemap_index].tree_param[prototype].density) {continue;}
				
				tempInstance.position = tree_script.tree_save[count_terrain].treeInstances[count_tree].position;
				tempInstance.widthScale = tree_script.tree_save[count_terrain].treeInstances[count_tree].widthScale*script.settings.treemap[treemap_index].tree_param[prototype].scale;;
				tempInstance.heightScale = tree_script.tree_save[count_terrain].treeInstances[count_tree].heightScale*script.settings.treemap[treemap_index].tree_param[prototype].scale;
				tempInstance.color = tree_script.tree_save[count_terrain].treeInstances[count_tree].color;
				tempInstance.lightmapColor = tree_script.tree_save[count_terrain].treeInstances[count_tree].lightmapColor;
				tempInstance.prototypeIndex = script.settings.treemap[treemap_index].tree_param[prototype].prototype;
				
				treeInstances.Add(tempInstance);
			}
			
			script.terrains[count_terrain].terrain.terrainData.treeInstances = treeInstances.ToArray();
		}
		
		// DestroyImmediate(Trees);
	}
	
	function export_texture_to_file(path: String,file: String,export_texture: Texture2D)
	{
		var bytes: byte[] = export_texture.EncodeToPNG();
		File.WriteAllBytes(path+"/"+file+".png",bytes);	
	}
	
	function export_bytes_to_file(path: String,file: String)
	{
		File.WriteAllBytes(path+"/"+file+".tc",script.export_bytes);	
	} 
	
	function assign_heightmap_all_terrain()
	{
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain)
		{
			if (!script.terrains[count_terrain].terrain){continue;}
			if (script.terrains[count_terrain].raw_file_index > -1)
			{
				assign_heightmap(script.terrains[count_terrain]);
			}
		}
	}

	function assign_heightmap(preterrain1: terrain_class)
	{
	   	var count_x: int;
		var count_y: int;        	
	    var raw_file_index: int = preterrain1.raw_file_index;
	    
	    if (raw_file_index < 0){return;}
	    
	    var size: int = script.raw_files[raw_file_index].resolution.x;
	    var i: int = 0;
	    
	    if (!preterrain1.terrain){return;}
	    if (!preterrain1.terrain.terrainData){return;}
	    if (!script.raw_files[raw_file_index].assigned){return;}
	    
	    if (size > preterrain1.terrain.terrainData.heightmapResolution)
	    {
	    	Debug.Log("The resolution of "+preterrain1.terrain.name+" is "+preterrain1.terrain.terrainData.heightmapResolution+", the Raw File resolution is "+size+". The Terrain resolution needs to be the same or higher...");
	    	return;
	    }
	    
	    heights = new float[size,size];
	    
		script.raw_files[raw_file_index].bytes = File.ReadAllBytes(script.raw_files[raw_file_index].file);
		    	    	    	    	    	    	
	    if (script.raw_files[raw_file_index].mode == raw_mode_enum.Mac)
	    {
		   	for (count_x=0;count_x<size;++count_x) 
		   	{
				for (count_y=0;count_y<size;++count_y) 
				{
					heights[count_x,count_y] = (script.raw_files[raw_file_index].bytes[i++]*256.0+script.raw_files[raw_file_index].bytes[i++])/65535.0;
				}
			}
		}
				
		if (script.raw_files[raw_file_index].mode == raw_mode_enum.Windows)
		{
			for (count_x=0;count_x<size;++count_x) 
			{
				for (count_y=0;count_y<size;++count_y) 
				{
					heights[count_x,count_y] = (script.raw_files[raw_file_index].bytes[i++]+script.raw_files[raw_file_index].bytes[i++]*256.0)/65535.0;
				}
			}
		}
	        	
	    preterrain1.terrain.terrainData.SetHeights(0,0,heights);
	    script.raw_files[raw_file_index].bytes = new byte[0];
	    if (preterrain1.color_terrain[0] < 1.5){preterrain1.color_terrain += Color(0.5,0.5,1,0.5);}
	}
	
	function content_version()
    {
		var enc: Encoding = Encoding.Unicode;

		script.settings.contents = new WWW(enc.GetString(process_out(File.ReadAllBytes(Application.dataPath+install_path.Replace("Assets","")+"/templates/content2.dat"))));
    	script.settings.loading = 2;
	}
	
	function check_content_version()
	{
		var enc: Encoding = Encoding.Unicode;
		
		if (script) {
			script.settings.contents = new WWW(enc.GetString(process_out(File.ReadAllBytes(Application.dataPath+install_path.Replace("Assets","")+"/templates/content1.dat"))));
    		script.settings.loading = 1;
    	}
	}
	
	function close_terrain_foldouts(preterrain1: terrain_class)
	{
		preterrain1.prearea.foldout = false;
		preterrain1.maps_foldout = false;
		preterrain1.size_foldout = false;
		preterrain1.resolution_foldout = false;
		preterrain1.settings_foldout = false;
		preterrain1.splat_foldout = false;
		preterrain1.tree_foldout = false;
		preterrain1.detail_foldout = false;
		preterrain1.reset_foldout = false;
		preterrain1.scripts_foldout = false;
	}
	
	function close_quick_tools_foldouts()
	{
		script.stitch_tool_foldout = false;
		script.slice_tool_foldout = false;
		script.smooth_tool_foldout = false;
		script.settings.global_parameters = false;
		script.settings.tree_button = false;
		script.settings.grass_button = false;
		script.settings.mesh_button = false;
		script.settings.light_button = false;
	}
	
	function create_object_parent(object1: object_class)
	{
		var SceneParent: GameObject = new GameObject();
		SceneParent.name = "Stones";
			
		SceneParent.transform.position = Vector3(0,0,0);
	}
	
	function create_object_parent2(object1: object_class)
	{
		var SceneParent: GameObject = new GameObject();
		if (!object1){SceneParent.name = "Objects";} else {
			if (object1.object1) {
				SceneParent.name = object1.object1.name+"s";
			}
			else {
				SceneParent.name = "Objects";
			}
		}
		SceneParent.transform.position = Vector3(0,0,0);
		object1.parent = SceneParent.transform;
	}
	
	function slice_terrains()
	{
		if (!script.check_terrains_assigned())
		{
			this.ShowNotification(GUIContent("All terrains must be assigned"));
			return;
		}
		
		if (!script.check_terrains_square())
		{
			calc_terrains_needed_square();
			return;
		}
		
		var terrain_length: int = script.terrains.Count;
		var terrain_index_start: int = script.terrains.Count;
		var terrain_new: terrain_class;
		var x: int;
		var y: int;
		
		var heights: float[,] = new float [1,1];
		var map: float[,,];
		var detail: int[,];
		var tree: TreeInstance;
		var trees: TreeInstance[];
		var count_detail: int;
		var count_terrain1: int;
		var count_tree1: int;
		var file_info: FileInfo;
		var path: String;
		
		var terrain_index: int = 0;
		
		for (count_terrain1 = 0;count_terrain1 < script.terrains.Count;++count_terrain1)
		{
			if (script.terrains[count_terrain1].terrain.terrainData.heightmapResolution < 65)
			{
				this.ShowNotification(GUIContent("Heightmap resolution of "+script.terrains[count_terrain1].name+" is 33, this cannot be made smaller"));
				Debug.Log("Slice Tool -> Heightmap resolution of "+script.terrains[count_terrain1].name+" is 33, this cannot be made smaller");
				return;		
			}	
			if (script.terrains[count_terrain1].terrain.terrainData.alphamapResolution < 64)
			{
				this.ShowNotification(GUIContent("Splatmap resolution of "+script.terrains[count_terrain1].name+" is 32, this cannot be made smaller"));
				Debug.Log("Slice Tool -> Splatmap resolution of "+script.terrains[count_terrain1].name+" is 33, this cannot be made smaller");
				return;
			}
			if (script.terrains[count_terrain1].terrain.terrainData.detailResolution < 32)
			{
				this.ShowNotification(GUIContent("Grass resolution of "+script.terrains[count_terrain1].name+" is smaller than 32, this cannot be made smaller, read console suggestion"));
				Debug.Log("Slice Tool -> Make the detail resolution at least 32. This can be done without effecting the rest of the resolutions.");
				return;
			}
			
			path = script.terrain_slice_path+"/"+script.terrain_asset_name+count_terrain1.ToString()+".asset";
			file_info = new FileInfo(path);
			if (file_info.Exists)
			{
				this.ShowNotification(GUIContent("Terrain Asset Name "+path+" already exist in your project, choose a different name or path"));
				Debug.Log("Slice Tool -> Terrain Asset Name "+path+" already exist in your project, choose a different Terrain Asset Name or Path.");
				return;
			} 
		}
		
		var pos: Vector3;
		
		for (var count_x: int = 0;count_x < script.terrains[0].tiles.x;++count_x)
		{
			for (var row: float = 0;row < 2;++row)
			{
				for (var count_y: int = 0;count_y < script.terrains[0].tiles.y;++count_y)
				{
					count_terrain1 = count_y+(count_x*script.terrains[0].tiles.y);
					pos = script.terrains[count_terrain1].terrain.transform.position;
					
					for (var count_terrain2: float = 0;count_terrain2 < 2;++count_terrain2)
					{
						++terrain_index;
						script.add_terrain(script.terrains.Count);
						script.terrains[script.terrains.Count-1].copy_terrain = count_terrain1;
						
						create_terrain(script.terrains[count_terrain1],1,script.terrains.Count,terrain_index,script.terrain_slice_path,script.terrain_slice_parent);
						
						terrain_new = script.terrains[script.terrains.Count-1];
						
						terrain_new.heightmap_resolution = ((script.terrains[count_terrain1].terrain.terrainData.heightmapResolution-1)/2)+1;
						terrain_new.splatmap_resolution = script.terrains[count_terrain1].terrain.terrainData.alphamapResolution/2;
						terrain_new.basemap_resolution = script.terrains[count_terrain1].terrain.terrainData.baseMapResolution/2;
						terrain_new.detail_resolution = script.terrains[count_terrain1].terrain.terrainData.detailResolution/2;
						terrain_new.detail_resolution_per_patch = script.terrains[count_terrain1].detail_resolution_per_patch;
						script.get_terrain_resolution_to_list(terrain_new);
						
						script.terrains[script.terrains.Count-1].size = Vector3(script.terrains[count_terrain1].terrain.terrainData.size.x/2,script.terrains[count_terrain1].terrain.terrainData.size.y,script.terrains[count_terrain1].terrain.terrainData.size.z/2);
						
						script.set_terrain_settings(terrain_new,"(all)");
						
						script.set_terrain_splat_textures(script.terrains[count_terrain1],terrain_new);
						script.get_terrain_splat_textures(terrain_new);
						// script.assign_terrain_splat_alpha(terrain_new);
						script.copy_terrain_details(script.terrains[count_terrain1],terrain_new);
						script.set_terrain_details(terrain_new);
						script.copy_terrain_trees(script.terrains[count_terrain1],terrain_new);
						script.set_terrain_trees(terrain_new);
						update_terrain_asset(terrain_new);
						// script.check_synchronous_terrain_textures(terrain_new);
						
						script.tree_instances.Clear();
						
						if (heights.Length != (terrain_new.heightmap_resolution*2)){heights = new float [terrain_new.heightmap_resolution,terrain_new.heightmap_resolution];}
						map = new float [terrain_new.splatmap_resolution,terrain_new.splatmap_resolution,terrain_new.terrain.terrainData.splatPrototypes.Length];
						detail = new int [terrain_new.detail_resolution,terrain_new.detail_resolution];
						
						heights = script.terrains[count_terrain1].terrain.terrainData.GetHeights((terrain_new.heightmap_resolution-1)*row,(terrain_new.heightmap_resolution-1)*(1-count_terrain2),terrain_new.heightmap_resolution,terrain_new.heightmap_resolution);
						terrain_new.terrain.terrainData.SetHeights(0,0,heights);
							
						map = script.terrains[count_terrain1].terrain.terrainData.GetAlphamaps((terrain_new.splatmap_resolution-1)*row,(terrain_new.splatmap_resolution-1)*(1-count_terrain2),terrain_new.splatmap_resolution,terrain_new.splatmap_resolution);
						terrain_new.terrain.terrainData.SetAlphamaps(0,0,map);
						
						for (count_detail = 0;count_detail < terrain_new.terrain.terrainData.detailPrototypes.Length;++count_detail)
						{
							detail = script.terrains[count_terrain1].terrain.terrainData.GetDetailLayer((terrain_new.detail_resolution-1)*row,(terrain_new.detail_resolution-1)*(1-count_terrain2),terrain_new.detail_resolution,terrain_new.detail_resolution,count_detail);
							terrain_new.terrain.terrainData.SetDetailLayer(0,0,count_detail,detail);
						}
						
						trees = script.terrains[count_terrain1].terrain.terrainData.treeInstances.Clone();
						
						for (count_tree1 = 0;count_tree1 < trees.Length;++count_tree1)
						{
							tree = trees[count_tree1];
							if (tree.position.x < (0.5+(row/2)) && tree.position.x > (row/2))
							{
								if (tree.position.z < (1-(count_terrain2/2)) && tree.position.z > (0.5-(count_terrain2/2)))
								{
									tree.position = Vector3((tree.position.x -(row/2))*2,tree.position.y,(tree.position.z-(0.5-(count_terrain2/2)))*2);
									script.tree_instances.Add(tree);
								}
							} 
						}
													
						terrain_new.terrain.terrainData.treeInstances = new TreeInstance[script.tree_instances.Count];
						terrain_new.terrain.terrainData.treeInstances = script.tree_instances.ToArray();
						terrain_new.terrain.transform.position = new Vector3(pos.x+(terrain_new.size.x*row),pos.y,pos.z+(terrain_new.size.z*(1-count_terrain2)));
						terrain_new.terrain.name = "Terrain_x"+(row+(count_y*2)).ToString()+"_y"+((1-count_terrain2)+(count_x*2)).ToString();
					}
				}
			}
		}
		
		for (count_terrain1 = 0;count_terrain1 < terrain_length;++count_terrain1)
		{
			if (!script.slice_tool_erase_terrain_scene)
			{
				#if !UNITY_3_4 && !UNITY_3_5
				script.terrains[0].terrain.gameObject.SetActive(false);
				#else
				script.terrains[0].terrain.gameObject.active = false;
				#endif
			}
			else
			{
				if (script.slice_tool_erase_terrain_data)
				{
					erase_terrain(script.terrains[0],true);
				}
				else
				{
					DestroyImmediate(script.terrains[0].terrain.gameObject);
				}
			}
			
			script.erase_terrain(0);
		}
		script.AutoSearchTiles();
		// script.FitTerrainTiles(script.terrains[0],true);
		script.stitch_splatmap();
	}
	
	function import_terrain_wc(name: String) 
	{
		if (!map_window) {map_window = EditorWindow.GetWindow(Type.GetType("Map_tc"));} 
		key = Event.current;
		
		var layer_index1: int;
		var layer_position: int = script.prelayers[0].predescription.description[0].layer_index.Count-1;	
		var layer1: layer_class;
		var filter1: filter_class;
		var path: String;
		
		script.terrains.Clear();
		
		for (var count_layer: int = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
			if (script.prelayers[0].layer[count_layer].output == layer_output_enum.heightmap) {script.prelayers[0].layer[count_layer].active = false;}	
		}
		
		if (layer_position > -1) {
			layer_index = script.prelayers[0].predescription.description[0].layer_index[layer_position]+1;	
		} 
		else { 
			layer_index = 0;
		}
			
		add_layer2(script.prelayers[0],layer_position,0,layer_index,false);
		
		layer1 = script.prelayers[0].layer[layer_index];
		layer1.output = layer_output_enum.heightmap;
		layer1.text = name; 
		filter1 = script.filter[layer1.prefilter.filter_index[0]];
		filter1.type = condition_type_enum.RawHeightmap;
		filter1.raw = new raw_class();
		filter1.raw.raw_mode = image_mode_enum.MultiTerrain;
		filter1.raw.flip_y = false;
		filter1.raw.tile_offset_x = (map_window.create_area.heightmap_offset.x);
		filter1.raw.tile_offset_y = map_window.create_area.heightmap_offset.y;
		// filter1.precurve_list[0].curve = new AnimationCurve.Linear(0,0,0.89,0.89);
		// filter1.precurve_list[0].curve.AddKey(1,0);
		// filter1.precurve_list[0].set_curve_linear();
		if (map_window.create_area.normalizeHeightmap) path = map_window.create_area.export_heightmap_path+"/"+map_window.create_area.export_heightmap_filename+"_N.raw";
		else path = map_window.create_area.export_heightmap_path+"/"+map_window.create_area.export_heightmap_filename+".raw";
		if (!File.Exists(path)) {
			this.ShowNotification(GUIContent("Raw file does not exists!"));
			this.Repaint();
			return;
		}
		filter1.raw.file_index[0] = add_raw_file(path);
			        						        					
		if (filter1.raw.file_index[0] > -1)
		{
			script.raw_files[filter1.raw.file_index[0]].resolution = map_window.create_area.heightmap_resolution;
			script.clean_raw_file_list();
		}
		
		add_filter2(0,script.prelayers[0],layer1.prefilter);
		
		filter1 = script.filter[layer1.prefilter.filter_index[1]];
		if (!map_window.create_area.filter_perlin) {filter1.active = false;}
		filter1.type = condition_type_enum.Always;
		filter1.strength = 0.002;
		filter1.precurve_list[0].curve = new AnimationCurve.Linear(0,1,1,1);
		filter1.precurve_list[0].default_curve = new AnimationCurve.Linear(0,1,1,1);
		filter1.precurve_list[0].type = curve_type_enum.Perlin;
		filter1.precurve_list[0].frequency = 150;
		filter1.precurve_list[0].detail = 12;
		
		// add_layer(prelayer: prelayer_class,layer_position,description_position: int,layer_index: int);
	 	for (var count_terrain: int = 0;count_terrain < map_window.terrain_region.area[0].terrains.Count;++count_terrain) {
	 		script.add_terrain(script.terrains.Count);
	 		copy_terrain2(script.terrains[count_terrain],map_window.terrain_region.area[0].terrains[count_terrain],map_window.create_area.do_image);
	 		script.terrains[count_terrain].tiles.x = map_window.create_area.tiles.x;
	 		script.terrains[count_terrain].tiles.y = map_window.create_area.tiles.y;
	 		script.terrains[count_terrain].index = count_terrain;
	 		script.get_terrain_settings(script.terrains[count_terrain],"(fir)(all)");
	 	}
	 	
	 	script.assign_rtp(true,false);
	 	
	 	// assign_all_terrain_splat_alpha();
	 	
	 	script.settings.display_short_terrain = true;
	 	if (!script.terrains[0].rtp_script) {
	 		script.settings.colormap = true;
	 	}
		
		script.disable_outputs();
		script.heightmap_output = true;
		script.button_export = false;
		SetGeneretateButtonText();
	
		if (map_window.create_area.do_heightmap) {
			generate_startup();
		}
		
		this.Repaint();
	}
	
	function copy_terrain2(preterrain1: terrain_class,preterrain2: terrain_class2,splat: boolean)
	{
		preterrain1.terrain = preterrain2.terrain;
		preterrain1.parent = preterrain2.parent;
		preterrain1.name = preterrain2.name;
		if (preterrain2.rtp_script) {
			preterrain1.rtp_script = preterrain2.rtp_script;
		}
		else if (splat) {
			if (preterrain2.splatPrototypes.Count > 0) {
				preterrain1.add_splatprototype(0);
				preterrain1.splatPrototypes[0].texture = preterrain2.splatPrototypes[0].texture;
			}
		}
		preterrain1.tile_x = preterrain2.tile_x;
		preterrain1.tile_z = preterrain2.tile_z;
		
		// preterrain1.neighbor = preterrain2.neighbor;
	}
//#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
//	@DrawGizmo(GizmoType.NotSelected | GizmoType.Active)
//#endif
//
//#if UNITY_5_1 || (!UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_01 && !UNITY_4_2 && !UNITY_4_3 && !UNITY_4_4 && !UNITY_4_5 && !UNITY_4_6 && !UNITY_5_0 && !UNITY5_0_1)
//	@DrawGizmo(GizmoType.NonSelected | GizmoType.Active)
//#endif 
//
//#if UNITY_5_0_1
//#endif	
	@DrawGizmo(3)

	static function RenderCustomGizmo(objectTransform: Transform,gizmoType:  GizmoType)
    {
    	var e: Event = Event.current;
        if (e == null || !script || !script.measure_tool_active || e_old == null){e_old = e;return;}
		
		if (e.button == 1 && e_old.button != 1 && e.control){script.measure_tool_clicked = !script.measure_tool_clicked;}
        e_old = e;
		
		if (!script.measure_tool_clicked) 
    	{	            
	    	var ray: Ray = HandleUtility.GUIPointToWorldRay (e.mousePosition);
	    	
	    	if (Physics.Raycast (ray.origin, ray.direction,hit,script.measure_tool_range))
	    	{
	    		script.measure_tool_inrange = true;
	        	if (script.sphere_draw)
	        	{
	        		Gizmos.color = Color.red;
	            	Gizmos.DrawSphere(hit.point,script.sphere_radius);
	            	script.measure_tool_point_old = hit.point;
	        	}
				hit_mesh = hit.collider.gameObject;
				if (hit_mesh){terrain_measure = hit_mesh.GetComponent(Terrain);}
				if (terrain_measure)
	            {
	            	heightmap_scale = terrain_measure.terrainData.size;
	            	height = terrain_measure.SampleHeight(hit.point);
	            	var terrain_point_interpolated: Vector2 = get_terrain_point(terrain_measure,hit.point,true);
	            	var terrain_point: Vector2 = get_terrain_point(terrain_measure,hit.point,false);
	            	script.measure_tool_terrain_point = terrain_point;
	            	script.measure_tool_terrain_point_interpolated = terrain_point_interpolated;
	            	normal = terrain_measure.terrainData.GetInterpolatedNormal(terrain_point_interpolated.x,terrain_point_interpolated.y);
	            	var px: float = (hit.point.x-terrain_measure.transform.position.x);
	            	var pz: float = (hit.point.z-terrain_measure.transform.position.z);
	            	
	            	var terrain_index: int = script.find_terrain_by_name(terrain_measure);
	            	if (terrain_index != -1)
	            	{
	            		if (script.terrains[terrain_index].terrain) {
	            			if (script.terrains[terrain_index].terrain.terrainData) {
	            				degree = script.calc_terrain_angle(script.terrains[terrain_index],px,pz,script.settings.smooth_angle);//hit.point.x-terrain_measure.transform.position.x,hit.point.z-terrain_measure.tranform.position.z);
	            			}
	            		}
	            	}
	            	
	            	splat_length = terrain_measure.terrainData.splatPrototypes.Length;
	            	if (splat_length > 0){splat = terrain_measure.terrainData.GetAlphamaps(terrain_point.x,terrain_point.y,1,1);}
	            	detail_length = terrain_measure.terrainData.detailPrototypes.Length;
	            	
	            	for (var count_detail: int = 0;count_detail < detail_length;++count_detail)
	            	{
	            		detail1 = terrain_measure.terrainData.GetDetailLayer(terrain_point_interpolated.x*terrain_measure.terrainData.detailResolution,terrain_point_interpolated.y*terrain_measure.terrainData.detailResolution,1,1,count_detail);
	            		detail[count_detail] = detail1[0,0];
	            	}
	            }
	            else
	            {
	            	if (hit.collider.GetComponent(MeshFilter)) {
	            		script.get_meshes_minmax_height();
	            		heightmap_scale.y = script.settings.terrainMaxHeight;
	            	
	            		height = hit.point.y-hit.collider.transform.position.y;
	            		normal = hit.normal;
	            		degree = hit.normal.y*90;
	            	}	
	            }
				SceneView.lastActiveSceneView.Repaint();	
			} else {script.measure_tool_inrange = false;}
	    }
	    else
	    {
			Gizmos.color = Color.red;
	    	Gizmos.DrawSphere(script.measure_tool_point_old,script.sphere_radius);
		}
    }
    
    function reset_paths(global: boolean)
	{
		script.raw_path = String.Empty;
		script.raw_save_path = String.Empty;
		script.terrain_path = String.Empty;
		script.terrain_slice_path = String.Empty;
		script.export_path = String.Empty;
		script.heightmap_tool.export_path = String.Empty;
		script.pattern_tool.export_path = String.Empty;
		script.settings.mesh_path = String.Empty;
		
		if (global && key.control) {
			for (var count_region: int = 0;count_region < global_script.map.region.Count;++count_region) {
				for (var count_area: int = 0;count_area < global_script.map.region[count_region].area.Count;++count_area) {
					global_script.map.region[count_region].area[count_area].export_heightmap_path = String.Empty;
					global_script.map.region[count_region].area[count_area].export_image_path = String.Empty;
					global_script.map.region[count_region].area[count_area].import_heightmap_path_full = String.Empty;
					global_script.map.region[count_region].area[count_area].export_terrain_path = String.Empty;
					
					global_script.map.region[count_region].area[count_area].export_heightmap_changed = false;
					global_script.map.region[count_region].area[count_area].export_terrain_changed = false;
					global_script.map.region[count_region].area[count_area].export_image_changed = false;
				}
			}
			
			global_script.map.bingKey[0].reset();
			if (map_window) {map_window.Repaint();}
			save_global_settings();
		}
		this.Repaint();
	}
	
	function draw_measure_tool()
	{
       	if (!script){return;}
       	if (!script.measure_tool_undock) {
       		EditorGUILayout.BeginHorizontal();
       		script.measure_tool_foldout = EditorGUILayout.Foldout(script.measure_tool_foldout,"Measure Tool");
       		if (GUILayout.Button("X",EditorStyles.miniButtonMid,GUILayout.Width(19))) {
				script.measure_tool = false;
			}	
			GUILayout.Space(2);
			EditorGUILayout.EndHorizontal();
       	}
       	
       	if (script.measure_tool_foldout || script.measure_tool_undock)
       	{
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("Active",GUILayout.Width(100));
	       	gui_changed_old = GUI.changed;
	       	gui_changed_window = GUI.changed; GUI.changed = false;
	       	script.measure_tool_active = EditorGUILayout.Toggle(script.measure_tool_active,GUILayout.Width(25));
	       	if (GUI.changed)
	       	{
	       		if (script.measure_tool_undock){script.measure_tool = script.measure_tool_active;this.Repaint();}
	       	}
	       	GUI.changed = gui_changed_old;
			if (!script.measure_tool_undock)
			{	       	
		       	if (global_script.settings.tooltip_mode != 0)
		    	{
		    		tooltip_text = "Put Measure Tool in seperate window";
		    	}
		       	if (GUILayout.Button(GUIContent("Undock",tooltip_text),GUILayout.Width(70)))
		       	{
		       		script.measure_tool_undock = true;
		       		create_window_measure_tool();
		       	}
		    }
		    else
		    {
		    	if (global_script.settings.tooltip_mode != 0)
		    	{
		    		tooltip_text = "Put Measure Tool in TerrainComposer window";
		    	}
		    	if (GUILayout.Button(GUIContent("Dock",tooltip_text),GUILayout.Width(70)))
		       	{
		       		script.measure_tool_undock = false;
		       		measure_tool.undock = false;
		       		measure_tool.Close();
		       	}
		    }
			EditorGUILayout.EndHorizontal();
	       	
	       	GUILayout.Space(5);
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	if (terrain_measure)
	       	{
	       		EditorGUILayout.LabelField("Terrain",GUILayout.Width(100));
	       		EditorGUILayout.LabelField(""+terrain_measure.name);
	       	}
	       	else
	       	{
	       		if (hit_mesh)
	       		{
	       			EditorGUILayout.LabelField("Mesh",GUILayout.Width(100));
	       			EditorGUILayout.LabelField(""+hit_mesh.name,GUILayout.Width(70));
	       		}
	       		else
	       		{
	       			EditorGUILayout.LabelField("?",GUILayout.Width(70));
	       		}
	       	}
	       	EditorGUILayout.EndHorizontal();
	       	
	       	GUILayout.Space(5);
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("World Pos",GUILayout.Width(100));
	       	EditorGUILayout.LabelField("X "+hit.point.x,GUILayout.Width(150));
	       	EditorGUILayout.EndHorizontal();
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(119);
	       	EditorGUILayout.LabelField("Y "+hit.point.y,GUILayout.Width(150));
			EditorGUILayout.EndHorizontal();
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(119);
	       	EditorGUILayout.LabelField("Z "+hit.point.z,GUILayout.Width(150));
			EditorGUILayout.EndHorizontal();
	       	
	       	GUILayout.Space(5);
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("Local Pos",GUILayout.Width(100));
	       	EditorGUILayout.LabelField("X "+script.measure_tool_terrain_point.x,GUILayout.Width(70));
	       	EditorGUILayout.LabelField("("+script.measure_tool_terrain_point_interpolated.x.ToString("F2")+")",GUILayout.Width(40));
	       	EditorGUILayout.EndHorizontal();
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(119);
	       	EditorGUILayout.LabelField("Y "+script.measure_tool_terrain_point.y,GUILayout.Width(70));
			EditorGUILayout.LabelField("("+script.measure_tool_terrain_point_interpolated.y.ToString("F2")+")",GUILayout.Width(40));
	       	EditorGUILayout.EndHorizontal();
	       	
	       	GUILayout.Space(5);
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	var locked: String;
	       	if (script.measure_tool_clicked){locked = " locked";}
	       	if (global_script.settings.color_scheme){GUI.color = Color.yellow;}
	       	EditorGUILayout.LabelField("Height",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(""+height.ToString("F2"),GUILayout.Width(50));
	       	EditorGUILayout.LabelField("("+(height/heightmap_scale.y).ToString("F3")+")",GUILayout.Width(70));
	       	EditorGUILayout.LabelField(locked);
	       	EditorGUILayout.EndHorizontal();
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	if (global_script.settings.color_scheme){GUI.color = Color(0.85,0.85,0);}
	       	EditorGUILayout.LabelField("Steepness",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(""+degree.ToString("F2"),GUILayout.Width(50));
	       	EditorGUILayout.LabelField("("+(degree/90).ToString("F3")+")",GUILayout.Width(70));
	       	EditorGUILayout.LabelField(locked);
	       	EditorGUILayout.EndHorizontal();  
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	if (global_script.settings.color_scheme){GUI.color = Color(0.7,0.7,0);}
	       	EditorGUILayout.LabelField("Normal",GUILayout.Width(100));
	       	EditorGUILayout.LabelField("("+normal.x.ToString("F2")+", "+normal.y.ToString("F2")+", "+normal.z.ToString("F2")+")",GUILayout.Width(124));
	       	EditorGUILayout.LabelField(locked);
	       	EditorGUILayout.EndHorizontal();  
	       	GUILayout.Space(10);
			
		  	if (global_script.settings.color_scheme){GUI.color = Color.cyan;}
	     					        		        	
	       	var splat_total: float = 0;
	       	
			for (var count_splat: int = 0;count_splat < splat_length;++count_splat)
			{	        		
	       		EditorGUILayout.BeginHorizontal();
	       		GUILayout.Space(15);
	       		EditorGUILayout.LabelField("Splat"+count_splat+"",GUILayout.Width(100));
	       		EditorGUILayout.LabelField(""+splat[0,0,count_splat].ToString("F3"),GUILayout.Width(50));
	       		splat_total += splat[0,0,count_splat];
	       		GUILayout.Space(74);
	       		EditorGUILayout.LabelField(locked);
	       		EditorGUILayout.EndHorizontal();  
	       	}
	       	
	       	GUILayout.Space(5);
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	if (global_script.settings.color_scheme){GUI.color = Color.cyan+Color(0.2,0.2,0.2);}
	       	EditorGUILayout.LabelField("Splat Total",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(""+splat_total.ToString("F3"),GUILayout.Width(50));
	       	GUILayout.Space(74);
	       	EditorGUILayout.LabelField(locked);
	       	EditorGUILayout.EndHorizontal();  
	       	
	       	if (global_script.settings.color_scheme){GUI.color = Color.cyan-Color(0.3,0,3,0.3);}
			
			GUILayout.Space(5);
	       		      					        		        	
	       	var detail_total: float = 0;
	       	
			for (var count_detail: int = 0;count_detail < detail_length;++count_detail)
			{	        		
	       		EditorGUILayout.BeginHorizontal();
	       		GUILayout.Space(15);
	       		EditorGUILayout.LabelField("Detail"+count_detail+"",GUILayout.Width(100));
	       		EditorGUILayout.LabelField(""+detail[count_detail],GUILayout.Width(50));
	       		detail_total += detail[count_detail];
	       		GUILayout.Space(74);
	       		EditorGUILayout.LabelField(locked);
	       		EditorGUILayout.EndHorizontal();  
	       	}
	       	
	       	GUILayout.Space(5);
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	if (global_script.settings.color_scheme){GUI.color = Color.green;}
	       	EditorGUILayout.LabelField("Grass Total",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(""+detail_total.ToString("F2"),GUILayout.Width(50));
	       	GUILayout.Space(74);
	       	EditorGUILayout.LabelField(locked); 
	       	EditorGUILayout.EndHorizontal();  
	       	
	       	GUILayout.Space(5);
	       	if (global_script.settings.color_scheme){GUI.color = Color.white;}
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("Min Height",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(script.settings.terrainMinHeight.ToString("F2"),GUILayout.Width(50));
	       	EditorGUILayout.LabelField("("+(script.settings.terrainMinHeight/heightmap_scale.y).ToString("F3")+")",GUILayout.Width(70));
	       	if (GUILayout.Button("Calc",GUILayout.Width(55))) {
	       		if (script.settings.showTerrains) script.get_terrains_minmax();
	       		else script.get_meshes_minmax_height();
	       	}
	       	EditorGUILayout.EndHorizontal();
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("Max Height",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(script.settings.terrainMaxHeight.ToString("F2"),GUILayout.Width(50));
	       	EditorGUILayout.LabelField("("+(script.settings.terrainMaxHeight/heightmap_scale.y).ToString("F3")+")",GUILayout.Width(70));
	       	EditorGUILayout.EndHorizontal(); 
	       
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("Min Steepness",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(script.settings.terrainMinDegree.ToString("F2"),GUILayout.Width(50));
	       	EditorGUILayout.LabelField("("+(script.settings.terrainMinDegree/90).ToString("F3")+")",GUILayout.Width(70));
	       	EditorGUILayout.EndHorizontal(); 
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("Max Steepness",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(script.settings.terrainMaxDegree.ToString("F2"),GUILayout.Width(50));
	       	EditorGUILayout.LabelField("("+(script.settings.terrainMaxDegree/90).ToString("F3")+")",GUILayout.Width(70));
	       	EditorGUILayout.EndHorizontal(); 
	       	
	       	GUILayout.Space(5);
	       	
	       	key = Event.current;
	       	
			if (key.keyCode == KeyCode.M && key.type == EventType.KeyDown) {
	   			if (script.settings.measure_distance_mode == 0) {
	   				if (script.settings.measure_distance1) {
	   					DestroyImmediate(script.settings.measure_distance1);
	   				}
	   				if (script.settings.measure_distance2) {
	   					DestroyImmediate(script.settings.measure_distance2);
	   				}
		   			script.settings.measure_distance1 = new GameObject();
		   			var parent: Transform = GameObject.Find("_TerrainComposer").transform;
		   			script.settings.measure_distance1.transform.parent = parent;
		   			script.settings.measure_distance1.transform.position = hit.point;
		   			script.settings.measure_distance2 = Instantiate(script.settings.measure_distance_prefab);
		   			script.settings.measure_distance2.transform.parent = parent;
		   			script.settings.measure_distance1.name = "Measure Point 1";
		   			script.settings.measure_distance2.name = "Measure Point 2";
		   			// script.settings.measure_distance1.transform.position = hit.point;
		   			script.settings.measure_distance_mode = 1;
	   			}
	   			else if (script.settings.measure_distance_mode == 1) {
	   				script.settings.measure_distance_mode = 0;
	   			}
	   		}

	       	if (script.settings.measure_distance_mode == 1) {
	       		if (script.measure_tool_inrange) {
		       		if (!script.settings.measure_distance2) {script.settings.measure_distance_mode = 0;return;}
		       		script.settings.measure_distance = Vector3.Distance(script.settings.measure_distance1.transform.position,hit.point);
		       		script.settings.measure_distance2.transform.localScale.z = script.settings.measure_distance;
		       		script.settings.measure_distance2.transform.position = hit.point-(hit.point-script.settings.measure_distance1.transform.position)/2;
		       		script.settings.measure_distance2.transform.LookAt(script.settings.measure_distance1.transform);
		       	}
	       	}
	       	
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	EditorGUILayout.LabelField("Measure Dist.",GUILayout.Width(100));
	       	EditorGUILayout.LabelField(script.settings.measure_distance.ToString("F2"),GUILayout.Width(50));
	       	if (GUILayout.Button("Clear",GUILayout.Width(55))) {
	      	 	if (script.settings.measure_distance1) {
	   				DestroyImmediate(script.settings.measure_distance1);
	   			}
	   			if (script.settings.measure_distance2) {
	   				DestroyImmediate(script.settings.measure_distance2);
	   			}
	       	}
	       	EditorGUILayout.EndHorizontal();  
			
			GUILayout.Space(5);
			
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
	       	var range_text: String;
	       	if (script.measure_tool_inrange){range_text = "*";} else {range_text = "?";}
			EditorGUILayout.LabelField("Measure Range",GUILayout.Width(100));
			script.measure_tool_range = EditorGUILayout.Slider(script.measure_tool_range,1,100000,GUILayout.Width(300));
			EditorGUILayout.LabelField(range_text,GUILayout.Width(100));
			EditorGUILayout.EndHorizontal();  
			
			EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
			EditorGUILayout.LabelField("Sphere Radius",GUILayout.Width(100));
			script.sphere_radius = EditorGUILayout.Slider(script.sphere_radius,0.1,50,GUILayout.Width(300));
			EditorGUILayout.EndHorizontal();  
			
			GUILayout.Space(5);
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
			EditorGUILayout.LabelField("Sphere Gizmos",GUILayout.Width(100));
			script.sphere_draw = EditorGUILayout.Toggle(script.sphere_draw,GUILayout.Width(25));	        	      
			EditorGUILayout.EndHorizontal(); 
			
			GUILayout.Space(5);
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
			EditorGUILayout.LabelField("Converter Calculator");
			EditorGUILayout.EndHorizontal(); 
			
	       	EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
			EditorGUILayout.LabelField("Height",GUILayout.Width(100));
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			script.measure_tool_converter_height_input = EditorGUILayout.FloatField(script.measure_tool_converter_height_input,GUILayout.Width(80));	        	      
			if (GUI.changed)
			{
				if (terrain_measure){script.measure_tool_converter_height = script.measure_tool_converter_height_input/terrain_measure.terrainData.size.y;}
			}
			EditorGUILayout.LabelField("-> "+script.measure_tool_converter_height.ToString("f3"));
			GUI.changed = gui_changed_old;
			EditorGUILayout.EndHorizontal(); 
			
			EditorGUILayout.BeginHorizontal();
	       	GUILayout.Space(15);
			EditorGUILayout.LabelField("Steepness",GUILayout.Width(100));
			gui_changed_old = GUI.changed;
			gui_changed_window = GUI.changed; GUI.changed = false;
			script.measure_tool_converter_angle_input = EditorGUILayout.FloatField(script.measure_tool_converter_angle_input,GUILayout.Width(80));	        	      
			if (GUI.changed)
			{
				script.measure_tool_converter_angle = script.measure_tool_converter_angle_input/90;
			}
			EditorGUILayout.LabelField("-> "+script.measure_tool_converter_angle.ToString("f3"));
			GUI.changed = gui_changed_old;
			EditorGUILayout.EndHorizontal(); 
			
			if (script.measure_tool_active && !script.measure_tool_undock){this.Repaint();}
       	}
	}	 
	
	function create_info_window()
	{
		if (info_window){info_window.Close();return;}
		info_window = EditorWindow.GetWindow(Info_tc);
		info_window.global_script = global_script;
		// info_window.script = script;
		info_window.backgroundColor = global_script.settings.color.backgroundColor;
		info_window.backgroundActive = global_script.settings.color.backgroundActive;
		
		info_window.text = String.Empty;
		var sr: StreamReader = new File.OpenText(Application.dataPath+install_path.Replace("Assets","")+"/TerrainComposer Release Notes.txt");
		
		info_window.update_height = 0;
		sr.ReadLine();
		sr.ReadLine();
		sr.ReadLine();
		
		do {
			info_window.text += sr.ReadLine()+"\n";
			info_window.update_height += 13;
		}
		while (!sr.EndOfStream);
		sr.Close();
		
		info_window.update_height += 13;
		info_window.minSize = Vector2(1024,512);
		#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
		info_window.title = "Release Notes";
		#else
		info_window.titleContent = new GUIContent("Release Notes");
		#endif
		info_window.parent = this;
	}
	
	function save_rtp_preset1(path1: String,preterrain1: terrain_class,textures: boolean)
	{
		var rt2: Component = preterrain1.rtp_script;
		
		var file_info: FileInfo = new FileInfo(path1);
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
		
    	var object: GameObject = new GameObject();
		var rt1: save_rtp_preset = object.AddComponent(save_rtp_preset);
		
		rt1.NormalGlobal = new Texture2D[script.terrains.Count];
		rt1.TreesGlobal = new Texture2D[script.terrains.Count];
		rt1.ColorGlobal = new Texture2D[script.terrains.Count];
		
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			rt1.NormalGlobal[count_terrain] = script.terrains[count_terrain].rtp_script.NormalGlobal;
			rt1.TreesGlobal[count_terrain] = script.terrains[count_terrain].rtp_script.TreesGlobal;
			rt1.ColorGlobal[count_terrain] = script.terrains[count_terrain].rtp_script.ColorGlobal;
		}
		rt1.BumpGlobalCombined = rt2.BumpGlobalCombined;
		rt1.controlA = rt2.controlA;
		rt1.controlB = rt2.controlB;
		rt1.controlC = rt2.controlC;
		
		rt1.distance_start = rt2.globalSettingsHolder.distance_start;
		rt1.distance_transition = rt2.globalSettingsHolder.distance_transition;
		rt1.RTP_MIP_BIAS = rt2.globalSettingsHolder.RTP_MIP_BIAS;
		rt1._SpecColor = rt2.globalSettingsHolder._SpecColor;
		rt1.rtp_customAmbientCorrection = rt2.globalSettingsHolder.rtp_customAmbientCorrection;
		rt1.RTP_LightDefVector = rt2.globalSettingsHolder.RTP_LightDefVector;
		rt1.RTP_LightDefVector = rt2.globalSettingsHolder.RTP_LightDefVector;
		rt1.RTP_ReflexLightDiffuseColor = rt2.globalSettingsHolder.RTP_ReflexLightDiffuseColor;
		rt1.RTP_ReflexLightDiffuseColor = rt2.globalSettingsHolder.RTP_ReflexLightDiffuseColor;
		rt1.RTP_LightDefVector = rt2.globalSettingsHolder.RTP_LightDefVector;
		rt1.RTP_ReflexLightSpecColor = rt2.globalSettingsHolder.RTP_ReflexLightSpecColor;
		rt1.RTP_AOsharpness = rt2.globalSettingsHolder.RTP_AOsharpness;
		rt1.RTP_AOamp = rt2.globalSettingsHolder.RTP_AOamp;
		
		rt1.blendMultiplier = rt2.globalSettingsHolder.blendMultiplier;
		rt1.VerticalTexture = rt2.globalSettingsHolder.VerticalTexture;
		rt1.VerticalTextureTiling = rt2.globalSettingsHolder.VerticalTextureTiling;
		rt1.VerticalTextureGlobalBumpInfluence = rt2.globalSettingsHolder.VerticalTextureGlobalBumpInfluence;
		rt1.GlobalColorMapBlendValues = rt2.globalSettingsHolder.GlobalColorMapBlendValues;
		rt1._GlobalColorMapNearMIP = rt2.globalSettingsHolder._GlobalColorMapNearMIP;
		rt1.GlobalColorMapSaturation = rt2.globalSettingsHolder.GlobalColorMapSaturation;
		rt1.GlobalColorMapBrightness = rt2.globalSettingsHolder.GlobalColorMapBrightness;
		
		rt1.global_normalMap_multiplier = rt2.globalSettingsHolder.global_normalMap_multiplier;
		rt1.trees_pixel_distance_start = rt2.globalSettingsHolder.trees_pixel_distance_start;
		rt1.trees_pixel_distance_transition = rt2.globalSettingsHolder.trees_pixel_distance_transition;
		rt1.trees_pixel_blend_val = rt2.globalSettingsHolder.trees_pixel_blend_val;
		rt1.trees_shadow_distance_start = rt2.globalSettingsHolder.trees_shadow_distance_start;
		rt1.trees_shadow_distance_transition = rt2.globalSettingsHolder.trees_shadow_distance_transition;
		rt1.trees_shadow_value = rt2.globalSettingsHolder.trees_shadow_value;
		
		rt1._snow_strength = rt2.globalSettingsHolder._snow_strength;
		rt1._global_color_brightness_to_snow = rt2.globalSettingsHolder._global_color_brightness_to_snow;
		rt1._snow_slope_factor = rt2.globalSettingsHolder._snow_slope_factor;
		rt1._snow_height_treshold = rt2.globalSettingsHolder._snow_height_treshold;
		rt1._snow_height_transition = rt2.globalSettingsHolder._snow_height_transition;
		rt1._snow_color = rt2.globalSettingsHolder._snow_color;
		rt1._snow_specular = rt2.globalSettingsHolder._snow_specular;
		rt1._snow_gloss = rt2.globalSettingsHolder._snow_gloss;
		rt1._snow_reflectivness = rt2.globalSettingsHolder._snow_reflectivness;
		rt1._snow_edge_definition = rt2.globalSettingsHolder._snow_edge_definition;
		rt1._snow_deep_factor = rt2.globalSettingsHolder._snow_deep_factor;
		
		rt1.BumpMapGlobalScale = rt2.globalSettingsHolder.BumpMapGlobalScale;
		rt1.rtp_mipoffset_globalnorm = rt2.globalSettingsHolder.rtp_mipoffset_globalnorm;
		rt1.distance_start_bumpglobal = rt2.globalSettingsHolder.distance_start_bumpglobal;
		rt1.rtp_perlin_start_val = rt2.globalSettingsHolder.rtp_perlin_start_val;
		rt1.distance_transition_bumpglobal = rt2.globalSettingsHolder.distance_transition_bumpglobal;
		rt1._FarNormalDamp = rt2.globalSettingsHolder._FarNormalDamp;
		
		rt1.TERRAIN_GlobalWetness = rt2.globalSettingsHolder.TERRAIN_GlobalWetness;
		rt1.TERRAIN_WaterSpecularity = rt2.globalSettingsHolder.TERRAIN_WaterSpecularity;
		rt1.TERRAIN_FlowSpeed = rt2.globalSettingsHolder.TERRAIN_FlowSpeed;
		rt1.TERRAIN_FlowScale = rt2.globalSettingsHolder.TERRAIN_FlowScale;
		rt1.TERRAIN_FlowMipOffset = rt2.globalSettingsHolder.TERRAIN_FlowMipOffset;
		rt1.TERRAIN_mipoffset_flowSpeed = rt2.globalSettingsHolder.TERRAIN_mipoffset_flowSpeed;
		rt1.TERRAIN_WetDarkening = rt2.globalSettingsHolder.TERRAIN_WetDarkening;
		
		rt1.TERRAIN_RainIntensity = rt2.globalSettingsHolder.TERRAIN_RainIntensity;
		rt1.TERRAIN_WetDropletsStrength = rt2.globalSettingsHolder.TERRAIN_WetDropletsStrength;
		rt1.TERRAIN_DropletsSpeed = rt2.globalSettingsHolder.TERRAIN_DropletsSpeed;
		rt1.TERRAIN_RippleScale = rt2.globalSettingsHolder.TERRAIN_RippleScale;
		
		rt1.TERRAIN_CausticsAnimSpeed = rt2.globalSettingsHolder.TERRAIN_CausticsAnimSpeed;
		rt1.TERRAIN_CausticsColor = rt2.globalSettingsHolder.TERRAIN_CausticsColor;
		rt1.TERRAIN_CausticsWaterLevel = rt2.globalSettingsHolder.TERRAIN_CausticsWaterLevel;
		rt1.TERRAIN_CausticsWaterLevelByAngle = rt2.globalSettingsHolder.TERRAIN_CausticsWaterLevelByAngle;
		rt1.TERRAIN_CausticsWaterShallowFadeLength = rt2.globalSettingsHolder.TERRAIN_CausticsWaterShallowFadeLength;
		rt1.TERRAIN_CausticsWaterDeepFadeLength = rt2.globalSettingsHolder.TERRAIN_CausticsWaterDeepFadeLength;
		rt1.TERRAIN_CausticsTilingScale = rt2.globalSettingsHolder.TERRAIN_CausticsTilingScale;
		
		rt1._SuperDetailTiling = rt2.globalSettingsHolder._SuperDetailTiling;
		rt1.TERRAIN_ReflColorA = rt2.globalSettingsHolder.TERRAIN_ReflColorA;
		rt1.TERRAIN_ReflColorB = rt2.globalSettingsHolder.TERRAIN_ReflColorB;
		rt1.TERRAIN_ReflDistortion = rt2.globalSettingsHolder.TERRAIN_ReflDistortion;
		rt1.TERRAIN_ReflectionRotSpeed = rt2.globalSettingsHolder.TERRAIN_ReflectionRotSpeed;
		rt1.TERRAIN_FresnelPow = rt2.globalSettingsHolder.TERRAIN_FresnelPow;
		rt1.TERRAIN_FresnelOffset = rt2.globalSettingsHolder.TERRAIN_FresnelOffset;
		
		rt1.splats = rt2.globalSettingsHolder.splats;
		rt1.splat_atlases = rt2.globalSettingsHolder.splat_atlases;
		rt1.Bumps = rt2.globalSettingsHolder.Bumps;
		rt1.Bump01 = rt2.globalSettingsHolder.Bump01;
		rt1.Bump23 = rt2.globalSettingsHolder.Bump23;
		rt1.Bump45 = rt2.globalSettingsHolder.Bump45;
		rt1.Bump67 = rt2.globalSettingsHolder.Bump67;
		rt1.Bump89 = rt2.globalSettingsHolder.Bump89;
		rt1.BumpAB = rt2.globalSettingsHolder.BumpAB;
		rt1.Heights = rt2.globalSettingsHolder.Heights;
		rt1.HeightMap = rt2.globalSettingsHolder.HeightMap;
		rt1.HeightMap2 = rt2.globalSettingsHolder.HeightMap2;
		rt1.HeightMap3 = rt2.globalSettingsHolder.HeightMap3;
		rt1.Substances = rt2.globalSettingsHolder.Substances;
		
		rt1.Spec = rt2.globalSettingsHolder.Spec;
		rt1.FarGlossCorrection = rt2.globalSettingsHolder.FarGlossCorrection;
		rt1.PER_LAYER_HEIGHT_MODIFIER = rt2.globalSettingsHolder.PER_LAYER_HEIGHT_MODIFIER;
		rt1.MIPmult = rt2.globalSettingsHolder.MIPmult;
		rt1.GlobalColorPerLayer = rt2.globalSettingsHolder.GlobalColorPerLayer;
		rt1.MixScale = rt2.globalSettingsHolder.MixScale;
		rt1.MixBlend = rt2.globalSettingsHolder.MixBlend;
		rt1.MixSaturation = rt2.globalSettingsHolder.MixSaturation;
		rt1._BumpMapGlobalStrength = rt2.globalSettingsHolder._BumpMapGlobalStrength;
		rt1._SuperDetailStrengthNormal = rt2.globalSettingsHolder._SuperDetailStrengthNormal;
		rt1._SuperDetailStrengthMultA = rt2.globalSettingsHolder._SuperDetailStrengthMultA;
		rt1._SuperDetailStrengthMultASelfMaskNear = rt2.globalSettingsHolder._SuperDetailStrengthMultASelfMaskNear;
		rt1._SuperDetailStrengthMultASelfMaskFar = rt2.globalSettingsHolder._SuperDetailStrengthMultASelfMaskFar;
		rt1._SuperDetailStrengthMultB = rt2.globalSettingsHolder._SuperDetailStrengthMultB;
		rt1._SuperDetailStrengthMultBSelfMaskNear = rt2.globalSettingsHolder._SuperDetailStrengthMultBSelfMaskNear;
		rt1._SuperDetailStrengthMultBSelfMaskFar = rt2.globalSettingsHolder._SuperDetailStrengthMultBSelfMaskFar;
		rt1.VerticalTextureStrength = rt2.globalSettingsHolder.VerticalTextureStrength;
		rt1._snow_strength_per_layer = rt2.globalSettingsHolder._snow_strength_per_layer;
		rt1.TERRAIN_LayerWetStrength = rt2.globalSettingsHolder.TERRAIN_LayerWetStrength;
		rt1.TERRAIN_WaterColor = rt2.globalSettingsHolder.TERRAIN_WaterColor;
		rt1.TERRAIN_WaterLevel = rt2.globalSettingsHolder.TERRAIN_WaterLevel;
		rt1.TERRAIN_WaterLevelSlopeDamp = rt2.globalSettingsHolder.TERRAIN_WaterLevelSlopeDamp;
		rt1.TERRAIN_WaterEdge = rt2.globalSettingsHolder.TERRAIN_WaterEdge;
		rt1.TERRAIN_WaterOpacity = rt2.globalSettingsHolder.TERRAIN_WaterOpacity;
		rt1.TERRAIN_WaterGloss = rt2.globalSettingsHolder.TERRAIN_WaterGloss;
		rt1.TERRAIN_Refraction = rt2.globalSettingsHolder.TERRAIN_Refraction;
		rt1.TERRAIN_Flow = rt2.globalSettingsHolder.TERRAIN_Flow;
		rt1.TERRAIN_WetSpecularity = rt2.globalSettingsHolder.TERRAIN_WetSpecularity;
		rt1.TERRAIN_WetReflection = rt2.globalSettingsHolder.TERRAIN_WetReflection;
		rt1.TERRAIN_WetRefraction = rt2.globalSettingsHolder.TERRAIN_WetRefraction;
		rt1.TERRAIN_WetRefraction = rt2.globalSettingsHolder.TERRAIN_WetRefraction;
		
		rt1.ReliefTransform = rt2.globalSettingsHolder.ReliefTransform;
		
		
		AssetDatabase.DeleteAsset(path1);
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(path1);
		
		PrefabUtility.ReplacePrefab(object,prefab,ReplacePrefabOptions.ReplaceNameBased);
		
		DestroyImmediate(object);
		
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
	}
	
	function load_rtp_preset(path1: String,preterrain1: terrain_class,splat_index,add: boolean)
	{
		path1 = path1.Replace(Application.dataPath+"/","Assets/");
    	
    	var object: GameObject = Instantiate(AssetDatabase.LoadAssetAtPath(path1,GameObject));
    	var rt1: save_rtp_preset = object.GetComponent(save_rtp_preset);
    	var rt2: Component;
    	
    	if (script.settings.load_layers) {
				script.terrains[0].splatPrototypes.Clear();
				
				for (var count_splat: int = 0;count_splat < rt1.splats.Length;++count_splat) {
					script.terrains[0].splatPrototypes.Add (new splatPrototype_class());
					script.terrains[0].splatPrototypes[count_splat].texture = rt1.splats[count_splat];
					script.terrains[0].splatPrototypes[count_splat].normal_texture = rt1.Bumps[count_splat];
					script.terrains[0].splatPrototypes[count_splat].height_texture = rt1.Heights[count_splat];
				}
				
				script.set_all_terrain_splat_textures(script.terrains[0],true,true);
						        			
				// assign_all_terrain_splat_alpha();
				script.assign_rtp(true,true);
				script.get_rtp_lodmanager();
				
				rt2 = script.terrains[0].rtp_script;
				
				if (!rt2) {return;}
				
				rt2.globalSettingsHolder.splats = rt1.splats;
				rt2.globalSettingsHolder.splat_atlases = rt1.splat_atlases;
				rt2.globalSettingsHolder.Bumps = rt1.Bumps;
				rt2.globalSettingsHolder.Bump01 = rt1.Bump01;
				rt2.globalSettingsHolder.Bump23 = rt1.Bump23;
				rt2.globalSettingsHolder.Bump45 = rt1.Bump45;
				if (rt1.Bump67) {
					rt2.globalSettingsHolder.Bump67 = rt1.Bump67;
				}
				rt2.globalSettingsHolder.Bump89 = rt1.Bump89;
				rt2.globalSettingsHolder.BumpAB = rt1.BumpAB;
				rt2.globalSettingsHolder.Heights = rt1.Heights;
				rt2.globalSettingsHolder.HeightMap = rt1.HeightMap;
				rt2.globalSettingsHolder.HeightMap2 = rt1.HeightMap2;
				rt2.globalSettingsHolder.HeightMap3 = rt1.HeightMap3;
				rt2.globalSettingsHolder.Substances = rt1.Substances;
				
				script.get_all_terrain_splat_textures(); 
			}
    	else {
    		rt2 = script.terrains[0].rtp_script;
    	}
    	
    	if (rt1 && rt2) {
	    	
	    	for (var count_terrain: int = 0; count_terrain < script.terrains.Count;++count_terrain) {
	    		if (rt1.NormalGlobal.Length < count_terrain+1) {break;}
	    		if (script.settings.load_normalmap) {
	    			script.terrains[count_terrain].rtp_script.NormalGlobal = rt1.NormalGlobal[count_terrain];
	    		}
	    		if (script.settings.load_colormap) {
	    			script.terrains[count_terrain].rtp_script.ColorGlobal = rt1.ColorGlobal[count_terrain];
	    		}
	    		if (script.settings.load_treemap) {
					script.terrains[count_terrain].rtp_script.TreesGlobal = rt1.TreesGlobal[count_terrain];
				}
			}
			if (script.settings.load_bumpglobal) {
				rt2.BumpGlobalCombined = rt1.BumpGlobalCombined;
			}
			if (script.settings.load_controlmap) {
				rt2.controlA = rt1.controlA;
				rt2.controlB = rt1.controlB;
				rt2.controlC = rt1.controlC;
			}
			
			rt2.globalSettingsHolder.distance_start = rt1.distance_start;
			rt2.globalSettingsHolder.distance_transition = rt1.distance_transition;
			rt2.globalSettingsHolder.RTP_MIP_BIAS = rt1.RTP_MIP_BIAS;
			rt2.globalSettingsHolder._SpecColor = rt1._SpecColor;
			rt2.globalSettingsHolder.rtp_customAmbientCorrection = rt1.rtp_customAmbientCorrection;
			rt2.globalSettingsHolder.RTP_LightDefVector = rt1.RTP_LightDefVector;
			rt2.globalSettingsHolder.RTP_LightDefVector = rt1.RTP_LightDefVector;
			rt2.globalSettingsHolder.RTP_ReflexLightDiffuseColor = rt1.RTP_ReflexLightDiffuseColor;
			rt2.globalSettingsHolder.RTP_ReflexLightDiffuseColor = rt1.RTP_ReflexLightDiffuseColor;
			rt2.globalSettingsHolder.RTP_LightDefVector = rt1.RTP_LightDefVector;
			rt2.globalSettingsHolder.RTP_ReflexLightSpecColor = rt1.RTP_ReflexLightSpecColor;
			rt2.globalSettingsHolder.RTP_AOsharpness = rt1.RTP_AOsharpness;
			rt2.globalSettingsHolder.RTP_AOamp = rt1.RTP_AOamp;
			
			rt2.globalSettingsHolder.blendMultiplier = rt1.blendMultiplier;
			rt2.globalSettingsHolder.VerticalTexture = rt1.VerticalTexture;
			rt2.globalSettingsHolder.VerticalTextureTiling = rt1.VerticalTextureTiling;
			rt2.globalSettingsHolder.VerticalTextureGlobalBumpInfluence = rt1.VerticalTextureGlobalBumpInfluence;
			rt2.globalSettingsHolder.GlobalColorMapBlendValues = rt1.GlobalColorMapBlendValues;
			rt2.globalSettingsHolder._GlobalColorMapNearMIP = rt1._GlobalColorMapNearMIP;
			rt2.globalSettingsHolder.GlobalColorMapSaturation = rt1.GlobalColorMapSaturation;
			rt2.globalSettingsHolder.GlobalColorMapBrightness = rt1.GlobalColorMapBrightness;
			
			rt2.globalSettingsHolder.global_normalMap_multiplier = rt1.global_normalMap_multiplier;
			rt2.globalSettingsHolder.trees_pixel_distance_start = rt1.trees_pixel_distance_start;
			rt2.globalSettingsHolder.trees_pixel_distance_transition = rt1.trees_pixel_distance_transition;
			rt2.globalSettingsHolder.trees_pixel_blend_val = rt1.trees_pixel_blend_val;
			rt2.globalSettingsHolder.trees_shadow_distance_start = rt1.trees_shadow_distance_start;
			rt2.globalSettingsHolder.trees_shadow_distance_transition = rt1.trees_shadow_distance_transition;
			rt2.globalSettingsHolder.trees_shadow_value = rt1.trees_shadow_value;
			
			rt2.globalSettingsHolder._snow_strength = rt1._snow_strength;
			rt2.globalSettingsHolder._global_color_brightness_to_snow = rt1._global_color_brightness_to_snow;
			rt2.globalSettingsHolder._snow_slope_factor = rt1._snow_slope_factor;
			rt2.globalSettingsHolder._snow_height_treshold = rt1._snow_height_treshold;
			rt2.globalSettingsHolder._snow_height_transition = rt1._snow_height_transition;
			rt2.globalSettingsHolder._snow_color = rt1._snow_color;
			rt2.globalSettingsHolder._snow_specular = rt1._snow_specular;
			rt2.globalSettingsHolder._snow_gloss = rt1._snow_gloss;
			rt2.globalSettingsHolder._snow_reflectivness = rt1._snow_reflectivness;
			rt2.globalSettingsHolder._snow_edge_definition = rt1._snow_edge_definition;
			rt2.globalSettingsHolder._snow_deep_factor = rt1._snow_deep_factor;
			
			rt2.globalSettingsHolder.BumpMapGlobalScale = rt1.BumpMapGlobalScale;
			rt2.globalSettingsHolder.rtp_mipoffset_globalnorm = rt1.rtp_mipoffset_globalnorm;
			rt2.globalSettingsHolder.distance_start_bumpglobal = rt1.distance_start_bumpglobal;
			rt2.globalSettingsHolder.rtp_perlin_start_val = rt1.rtp_perlin_start_val;
			rt2.globalSettingsHolder.distance_transition_bumpglobal = rt1.distance_transition_bumpglobal;
			rt2.globalSettingsHolder._FarNormalDamp = rt1._FarNormalDamp;
			
			rt2.globalSettingsHolder.TERRAIN_GlobalWetness = rt1.TERRAIN_GlobalWetness;
			rt2.globalSettingsHolder.TERRAIN_WaterSpecularity = rt1.TERRAIN_WaterSpecularity;
			rt2.globalSettingsHolder.TERRAIN_FlowSpeed = rt1.TERRAIN_FlowSpeed;
			rt2.globalSettingsHolder.TERRAIN_FlowScale = rt1.TERRAIN_FlowScale;
			rt2.globalSettingsHolder.TERRAIN_FlowMipOffset = rt1.TERRAIN_FlowMipOffset;
			rt2.globalSettingsHolder.TERRAIN_mipoffset_flowSpeed = rt1.TERRAIN_mipoffset_flowSpeed;
			rt2.globalSettingsHolder.TERRAIN_WetDarkening = rt1.TERRAIN_WetDarkening;
			
			rt2.globalSettingsHolder.TERRAIN_RainIntensity = rt1.TERRAIN_RainIntensity;
			rt2.globalSettingsHolder.TERRAIN_WetDropletsStrength = rt1.TERRAIN_WetDropletsStrength;
			rt2.globalSettingsHolder.TERRAIN_DropletsSpeed = rt1.TERRAIN_DropletsSpeed;
			rt2.globalSettingsHolder.TERRAIN_RippleScale = rt1.TERRAIN_RippleScale;
			
			rt2.globalSettingsHolder.TERRAIN_CausticsAnimSpeed = rt1.TERRAIN_CausticsAnimSpeed;
			rt2.globalSettingsHolder.TERRAIN_CausticsColor = rt1.TERRAIN_CausticsColor;
			rt2.globalSettingsHolder.TERRAIN_CausticsWaterLevel = rt1.TERRAIN_CausticsWaterLevel;
			rt2.globalSettingsHolder.TERRAIN_CausticsWaterLevelByAngle = rt1.TERRAIN_CausticsWaterLevelByAngle;
			rt2.globalSettingsHolder.TERRAIN_CausticsWaterShallowFadeLength = rt1.TERRAIN_CausticsWaterShallowFadeLength;
			rt2.globalSettingsHolder.TERRAIN_CausticsWaterDeepFadeLength = rt1.TERRAIN_CausticsWaterDeepFadeLength;
			rt2.globalSettingsHolder.TERRAIN_CausticsTilingScale = rt1.TERRAIN_CausticsTilingScale;
			
			rt2.globalSettingsHolder._SuperDetailTiling = rt1._SuperDetailTiling;
			rt2.globalSettingsHolder.TERRAIN_ReflColorA = rt1.TERRAIN_ReflColorA;
			rt2.globalSettingsHolder.TERRAIN_ReflColorB = rt1.TERRAIN_ReflColorB;
			rt2.globalSettingsHolder.TERRAIN_ReflDistortion = rt1.TERRAIN_ReflDistortion;
			rt2.globalSettingsHolder.TERRAIN_ReflectionRotSpeed = rt1.TERRAIN_ReflectionRotSpeed;
			rt2.globalSettingsHolder.TERRAIN_FresnelPow = rt1.TERRAIN_FresnelPow;
			rt2.globalSettingsHolder.TERRAIN_FresnelOffset = rt1.TERRAIN_FresnelOffset;
			
			if (script.settings.load_layers_settings) {
				rt2.globalSettingsHolder.Spec = rt1.Spec;
				rt2.globalSettingsHolder.FarGlossCorrection = rt1.FarGlossCorrection;
				rt2.globalSettingsHolder.PER_LAYER_HEIGHT_MODIFIER = rt1.PER_LAYER_HEIGHT_MODIFIER;
				rt2.globalSettingsHolder.MIPmult = rt1.MIPmult;
				rt2.globalSettingsHolder.GlobalColorPerLayer = rt1.GlobalColorPerLayer;
				rt2.globalSettingsHolder.MixScale = rt1.MixScale;
				rt2.globalSettingsHolder.MixBlend = rt1.MixBlend;
				rt2.globalSettingsHolder.MixSaturation = rt1.MixSaturation;
				rt2.globalSettingsHolder._BumpMapGlobalStrength = rt1._BumpMapGlobalStrength;
				rt2.globalSettingsHolder._SuperDetailStrengthNormal = rt1._SuperDetailStrengthNormal;
				rt2.globalSettingsHolder._SuperDetailStrengthMultA = rt1._SuperDetailStrengthMultA;
				rt2.globalSettingsHolder._SuperDetailStrengthMultASelfMaskNear = rt1._SuperDetailStrengthMultASelfMaskNear;
				rt2.globalSettingsHolder._SuperDetailStrengthMultASelfMaskFar = rt1._SuperDetailStrengthMultASelfMaskFar;
				rt2.globalSettingsHolder._SuperDetailStrengthMultB = rt1._SuperDetailStrengthMultB;
				rt2.globalSettingsHolder._SuperDetailStrengthMultBSelfMaskNear = rt1._SuperDetailStrengthMultBSelfMaskNear;
				rt2.globalSettingsHolder._SuperDetailStrengthMultBSelfMaskFar = rt1._SuperDetailStrengthMultBSelfMaskFar;
				rt2.globalSettingsHolder.VerticalTextureStrength = rt1.VerticalTextureStrength;
				rt2.globalSettingsHolder._snow_strength_per_layer = rt1._snow_strength_per_layer;
				rt2.globalSettingsHolder.TERRAIN_LayerWetStrength = rt1.TERRAIN_LayerWetStrength;
				rt2.globalSettingsHolder.TERRAIN_WaterColor = rt1.TERRAIN_WaterColor;
				rt2.globalSettingsHolder.TERRAIN_WaterLevel = rt1.TERRAIN_WaterLevel;
				rt2.globalSettingsHolder.TERRAIN_WaterLevelSlopeDamp = rt1.TERRAIN_WaterLevelSlopeDamp;
				rt2.globalSettingsHolder.TERRAIN_WaterEdge = rt1.TERRAIN_WaterEdge;
				rt2.globalSettingsHolder.TERRAIN_WaterOpacity = rt1.TERRAIN_WaterOpacity;
				rt2.globalSettingsHolder.TERRAIN_WaterGloss = rt1.TERRAIN_WaterGloss;
				rt2.globalSettingsHolder.TERRAIN_Refraction = rt1.TERRAIN_Refraction;
				rt2.globalSettingsHolder.TERRAIN_Flow = rt1.TERRAIN_Flow;
				rt2.globalSettingsHolder.TERRAIN_WetSpecularity = rt1.TERRAIN_WetSpecularity;
				rt2.globalSettingsHolder.TERRAIN_WetReflection = rt1.TERRAIN_WetReflection;
				rt2.globalSettingsHolder.TERRAIN_WetRefraction = rt1.TERRAIN_WetRefraction;
				rt2.globalSettingsHolder.TERRAIN_WetRefraction = rt1.TERRAIN_WetRefraction;
			}
			
			rt2.globalSettingsHolder.ReliefTransform = rt1.ReliefTransform;
			
			if (script.settings.load_layers) {
				create_rtp_combined_textures(script.terrains[0]);
			}
			else {
				rt2.globalSettingsHolder.RefreshAll();
			}
	    }
	    else {this.ShowNotification(GUIContent("This file is not a RTPv3 preset"));}
    	
    	DestroyImmediate(object);
	}

	function check_resolutions_out_of_range(preterrain1: terrain_class): boolean
	{
		if (!global_script.settings.restrict_resolutions) {return false;}
		var out_of_range: boolean = false;
		if (preterrain1.tiles.x*preterrain1.heightmap_resolution > 8193 || preterrain1.tiles.y*preterrain1.heightmap_resolution > 8193) {
			this.ShowNotification(GUIContent("Warning!\nTotal heightmap resolution is "+(preterrain1.tiles.x*preterrain1.heightmap_resolution)+" and exceeds 8193...\nSee console..."));
			Debug.Log("You are exceeding the heightmap resolution behond 8193 (keep in mind your performance and memory limitations in Unity4), you can unlock this by going to TC Menu -> Options -> Terrain Max Settings -> Disable 'Restrict Total Resolutions'.");
			out_of_range = true;
			do {
				++preterrain1.heightmap_resolution_list;
				script.set_terrain_resolution_from_list(preterrain1);
			}
			while (preterrain1.tiles.x*preterrain1.heightmap_resolution > 8193 || preterrain1.tiles.y*preterrain1.heightmap_resolution > 8193);
		}
		if (preterrain1.tiles.x*preterrain1.splatmap_resolution > 8192 || preterrain1.tiles.y*preterrain1.splatmap_resolution > 8192) {
			this.ShowNotification(GUIContent("Warning!\nTotal splatmap resolution is "+(preterrain1.tiles.x*preterrain1.splatmap_resolution)+" and exceeds 8192...\nSee console..."));
			Debug.Log("You are exceeding the splatmap resolution behond 8193 (keep in mind your performance and memory limitations in Unity4), you can unlock this by going to TC Menu -> Options -> Terrain Max Settings -> Disable 'Restrict Total Resolutions'.");
			out_of_range = true;
			do {
				++preterrain1.splatmap_resolution_list;
				script.set_terrain_resolution_from_list(preterrain1);
			}
			while (preterrain1.tiles.x*preterrain1.splatmap_resolution > 8192 || preterrain1.tiles.y*preterrain1.splatmap_resolution > 8192); 
		}
		if (preterrain1.tiles.x*preterrain1.detail_resolution > 8192 || preterrain1.tiles.y*preterrain1.detail_resolution > 8192) {
			this.ShowNotification(GUIContent("Warning!\nTotal detail resolution is "+(preterrain1.tiles.x*preterrain1.detail_resolution)+" and exceeds 8192...\nSee console..."));
			Debug.Log("You are exceeding the detail resolution behond 8193 (keep in mind your performance and memory limitations in Unity4), you can unlock this by going to TC Menu -> Options -> Terrain Max Settings -> Disable 'Restrict Total Resolutions'.");
			out_of_range = true;
			if (preterrain1.tiles.x > preterrain1.tiles.y) preterrain1.detail_resolution = 8192/preterrain1.tiles.x;
			else preterrain1.detail_resolution = 8192/preterrain1.tiles.y;
			script.set_terrain_resolution_from_list(preterrain1);
		}
		
		if (out_of_range) {
			script.check_synchronous_terrain_resolutions(preterrain1);
			return true;
		}
		return false;
	}
	
	function create_layer_mask()
	{
		layerMasks.Clear();
		/// layerIndex.Clear();
		
		var name: String;
		for (var i: int = 0;i < 32;++i) {
			name = LayerMask.LayerToName(i);
			if (name != "") {
				layerMasks.Add(name);
				// layerIndex.Add(i);
			} 
			else {
				layerMasks.Add("Empty");
			}
		}
		
		layerMasks_display = layerMasks.ToArray();
	}
	
	function create_rtp_combined_textures(preterrain1: terrain_class)
	{
		preterrain1.rtp_script.globalSettingsHolder.RefreshAll();
		var height_created: boolean = true;
		
		if (!preterrain1.rtp_script.globalSettingsHolder.PrepareNormals()) {
			this.ShowNotification(GUIContent("RTP needs the Normal Textures to be readable and they have to be the same size, pleace adjust this in the image import settings"));
			return;
		}
		preterrain1.rtp_script.globalSettingsHolder.HeightMap = rtp_functions.PrepareHeights(0,preterrain1.rtp_script.globalSettingsHolder.numLayers,preterrain1.rtp_script.globalSettingsHolder.Heights);
		if (!preterrain1.rtp_script.globalSettingsHolder.HeightMap) {height_created = false;} 
		
		else if (preterrain1.rtp_script.globalSettingsHolder.numLayers > 4) {
			preterrain1.rtp_script.globalSettingsHolder.HeightMap2 = rtp_functions.PrepareHeights(4,preterrain1.rtp_script.globalSettingsHolder.numLayers,preterrain1.rtp_script.globalSettingsHolder.Heights);
			if (!preterrain1.rtp_script.globalSettingsHolder.HeightMap2) {height_created = false;}
		}
		else if (preterrain1.rtp_script.globalSettingsHolder.numLayers > 8) {
			preterrain1.rtp_script.globalSettingsHolder.HeightMap3 = rtp_functions.PrepareHeights(8,preterrain1.rtp_script.globalSettingsHolder.numLayers,preterrain1.rtp_script.globalSettingsHolder.Heights);
			if (!preterrain1.rtp_script.globalSettingsHolder.HeightMap3 || !height_created) {height_created = false;}
		}
		if (!height_created) {
			this.ShowNotification(GUIContent("RTP needs the Height Textures to be readable and they have to be the same size, pleace adjust this in the image import settings"));
			return;
		}
		// preterrain1.rtp_script.globalSettingsHolder.HeightMap = new Texture2D(512,512);
	}	
	
	function assign_cull_script()
	{
		var camera1: GameObject = GameObject.Find("Main Camera");
		
		if (camera1) {
			if (camera1.tag == "MainCamera") {
				var cull_script: MultiTerrainBoost = camera1.GetComponent("MultiTerrainBoost");  
				if (!cull_script) {
					camera1.AddComponent.<MultiTerrainBoost>();
				}
			}
		}
	}
	
	function create_example(path: String,load_only: boolean,projectName: String)
	{
		if (script.create_pass == -1) {
			if (script.filename != projectName) {
				script.reset_all_outputs();
				erase_objects_parent();
				load_terraincomposer(path,false,false,false);
				if (projectName == "Island_Example") {
					script.raw_files[0].file = Application.dataPath+"/TerrainComposer Examples/Island/Heightmaps/Island.raw";
					script.raw_files[0].filename = "Island.raw";
				}
				create_objects_parent();
			}
			else {
				create_objects_parent();
			}
			global_script.settings.example_terrain_old1 = global_script.settings.example_terrain;
			
			if (load_only) {return;}
			
			script.disable_outputs();
			script.heightmap_output = true;
			script.create_pass = 1;
			generate_startup();
			return;
		}
		
		else if (script.create_pass == 2) {
			script.disable_outputs();
			script.splat_output = true;
			generate_startup();
			return;
		}
		
		else if (script.create_pass == 3) {
			if (global_script.settings.example_object_active) {
				script.disable_outputs();
				script.object_output = true;
				generate_startup();
			}
			else {
				script.create_pass = 4;
			}
		}
		
		else if (script.create_pass == 4) {
			script.disable_outputs();
			if (global_script.settings.example_tree_active) {
				script.tree_output = true;
			}
			
			if (script.tree_output) generate_startup();
		}
		
		else if (script.create_pass == 5) {
			script.disable_outputs();
			if (global_script.settings.example_grass_active) {
				script.grass_output = true;
			}
			script.create_pass = -1;
			if (script.grass_output) generate_startup();
		}
	}
	
	var SceneParent: GameObject;
	
	function create_objects_parent()
	{
		if (!SceneParent) {
			SceneParent = new GameObject();
			SceneParent.name = "Stones";
		}
		
		for (var count_layer: int = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
			if (script.prelayers[0].layer[count_layer].output == layer_output_enum.object) {
				create_object_parent_layer (script.prelayers[0].layer[count_layer]);
			}
		}
	}
	
	function create_object_parent_layer(layer1: layer_class)
	{
		if (!SceneParent) {
			SceneParent = new GameObject();
			SceneParent.name = "Objects"+current_layer_number.ToString();
		}
		SceneParent.transform.position = Vector3(0,0,0);
		if (layer1.output == layer_output_enum.object) {
			for (var count_object: int = 0;count_object < layer1.object_output.object.Count;++count_object) {
				if (!layer1.object_output.object[count_object].parent) {
					layer1.object_output.object[count_object].parent = SceneParent.transform;
				}
			}
		}
	}	
	
	function erase_objects_parent()
	{
		for (var count_layer: int = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
			if (script.prelayers[0].layer[count_layer].output == layer_output_enum.object) {
				for (var count_object: int = 0;count_object < script.prelayers[0].layer[count_layer].object_output.object.Count;++count_object) {
					if (script.prelayers[0].layer[count_layer].object_output.object[count_object].parent) {
						DestroyImmediate(script.prelayers[0].layer[count_layer].object_output.object[count_object].parent.gameObject);
					}
				}
			}
		}
	}
	
	function load_example_terrain(load_only: boolean)
	{
		if (global_script.settings.example_terrain == 0) {
			create_example("Assets/TerrainComposer Examples/Projects/Procedural_Mountains.prefab",load_only,"Procedural_Mountains");
		}
		else if (global_script.settings.example_terrain == 1) {
			create_example("Assets/TerrainComposer Examples/Projects/Procedural_Canyons.prefab",load_only,"Procedural_Canyons");
		}
		else if (global_script.settings.example_terrain == 2) {
			create_example("Assets/TerrainComposer Examples/Projects/Procedural_Plateaus.prefab",load_only,"Procedural_Plateaus");
		}
		else if (global_script.settings.example_terrain == 3) {
			create_example("Assets/TerrainComposer Examples/Projects/Procedural_Islands.prefab",load_only,"Procedural_Islands");	
			script.raw_files[0].file = Application.dataPath+"/TerrainComposer Examples/Textures/circle.raw";
			script.raw_files[0].filename = "circle.raw";		
		}
		else if (global_script.settings.example_terrain == 4) {
			create_example("Assets/TerrainComposer Examples/Projects/Island_Example.prefab",load_only,"Island_Example");
		}
	}
	
	function load_example_presets()
	{
		if (script2) { 
			script.create_pass = -1;
			generate_stop();
		}
		
		script.terrains[0].heightmap_resolution = Mathf.Pow(2,7+global_script.settings.example_resolution)+1;
		script.terrains[0].splatmap_resolution = Mathf.Pow(2,7+global_script.settings.example_resolution);
		script.terrains[0].detail_resolution = Mathf.Pow(2,7+global_script.settings.example_resolution);
		if (script.terrains[0].detail_resolution > 1024) {script.terrains[0].detail_resolution = 1024;}
		
		script.settings.resolution_density = false; 
		script.settings.grass_density = 16;
		script.terrains[0].size = Vector3(1000,500,1000);
		
		//script.terrains[0].heightmapPixelError = 1;
		//script.set_terrain_pixelerror(script.terrains[0],true);
		
		for (var count_terrain: int = 1;count_terrain < script.terrains.Count;++count_terrain) {
			if (!script.terrains[count_terrain].terrain) {script.terrains.RemoveAt(count_terrain);--count_terrain;}
			else if (!script.terrains[count_terrain].terrain.terrainData) {script.terrains.RemoveAt(count_terrain);--count_terrain;}
		}
		
		if (!script.terrain_parent) {create_terrain_scene_parent(0);} 
		// script.terrain_tiles = global_script.settings.example_tiles;
		// var added = false;
		// if (script.terrains[0].terrain) {script.terrains.Add(new terrain_class());added = true;}
		// script.calc_terrain_needed_tiles();
		//if (script.terrains[0].tiles.x != script.terrainTiles.x || script.terrains[0].tiles.y != script.terrainTiles.y) {
		CreateTerrains(script.terrains[0],"/TerrainComposer Examples/Terrains",script.terrain_parent,global_script.settings.exampleTerrainTiles);
		//}
//		else if (script.terrain_instances < 0) {
//			erase_terrains(script.terrain_instances*-1,false);
//		}
		// else if (added) {script.terrains.RemoveAt(script.terrains.Count-1);}
		
		script.set_all_terrain_settings(script.terrains[0],"(res)");
		
		// create_terrain(script.terrains[0],Mathf.Pow(global_script.settings.example_tiles,2),1,1,,script.terrain_parent);
		script.reset_all_outputs();
		fit_all_terrains(script.terrains[0]);
		
		load_splat_preset(install_path+"/Save/Presets/Splat/Splat_example.prefab",script.terrains[0],0,false);	
		set_all_terrain_splat_textures(script.terrains[0]);
		
		load_tree_preset(install_path+"/Save/Presets/Tree/Trees_Example.prefab",script.terrains[0],0,false);	
		script.set_all_terrain_trees(script.terrains[0]);
		load_grass_preset(install_path+"/Save/Presets/Grass/Grass_example.prefab",script.terrains[0],0,false);	
		script.set_all_terrain_details(script.terrains[0]);
		
		script.terrains[0].wavingGrassSpeed = 0.2;
		script.terrains[0].wavingGrassAmount = 0.2;
		script.terrains[0].wavingGrassStrength = 0.7;
		
		script.set_terrain_wind_bending(script.terrains[0],true);
		script.set_terrain_wind_speed(script.terrains[0],true);
		script.set_terrain_wind_amount(script.terrains[0],true);
		
		script.terrains[0].prearea.tree_resolution_active = true;
		script.terrains[0].prearea.tree_resolution = 128;
		script.terrains[0].prearea.object_resolution_active = true;
		script.terrains[0].prearea.object_resolution = 128;
		
		script.set_all_terrain_area(script.terrains[0]);
	}
	
	function set_all_terrain_splat_textures(preterrain1: terrain_class)
	{
		script.set_all_terrain_splat_textures(preterrain1,true,true);
//		if (current_terrain.rtp_script) {
//			create_rtp_combined_textures(preterrain1);
//		}
		script.check_synchronous_terrains_textures();
		
		// assign_all_terrain_splat_alpha();
		// update_all_terrain_asset();
	}
	
	function create_terrain_scene_parent(draw_from: int)
	{
		var SceneParent: GameObject = new GameObject();
		SceneParent.transform.position = Vector3(0,0,0);
		if (draw_from == 0) {
			script.terrain_parent = SceneParent.transform;
			SceneParent.name = "Terrains";
		} 
		else {
			script.terrain_slice_parent = SceneParent.transform;
			SceneParent.name = "Terrains_Sliced";
		}
	}
	
	function activate_layer(layer_index: int,output: layer_output_enum)
	{
		for (var count_layer: int = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
			if (script.prelayers[0].layer[count_layer].output == output) {
				if (layer_index == count_layer) {
					script.prelayers[0].layer[count_layer].active = true;
				}
				else {
					script.prelayers[0].layer[count_layer].active = false;
				}
			}
		}
	}
	
	function randomize_layer_offset(layer_output: layer_output_enum,offset: Vector2)
	{
		UnityEngine.Random.seed = EditorApplication.timeSinceStartup;
		for (var count_layer: int = 0;count_layer < script.prelayers[0].layer.Count;++count_layer) {
			if (script.prelayers[0].layer[count_layer].output == layer_output) {
				script.prelayers[0].layer[count_layer].offset = Vector2(UnityEngine.Random.Range(offset.x,offset.y),UnityEngine.Random.Range(offset.x,offset.y));
				script.prelayers[0].layer[count_layer].offset_middle = script.prelayers[0].layer[count_layer].offset;
			}
		}	
	}
	
	function check_downloaded_examples(): boolean
	{
		if (File.Exists(Application.dataPath+"/TerrainComposer Examples/Projects/version1.2.txt")) { 
			return true;
		}	    
		else { 
			this.ShowNotification(GUIContent("Download and import the Example Package again as it is updated"));
			global_script.settings.download_display = true;
		}
	}
	
	function load_raw_heightmaps()
	{	
		var current_filter1: filter_class;
		var length: ulong;
		var resolution: ulong;
		
		for (var count_prelayer1: int = 0;count_prelayer1 < script2.prelayers.Count;++count_prelayer1)
		{
			for (var count_layer1: int = 0;count_layer1 < script2.prelayers[count_prelayer1].layer.Count;++count_layer1)
			{
				for (var count_filter: int = 0;count_filter < script2.prelayers[count_prelayer1].layer[count_layer1].prefilter.filter_index.Count;++count_filter)
				{
					current_filter1 = script2.filter[script2.prelayers[count_prelayer1].layer[count_layer1].prefilter.filter_index[count_filter]];
						
					if (current_filter1.type == condition_type_enum.RawHeightmap)
					{
						for (var count_index: int = 0;count_index < current_filter1.raw.file_index.Count;++count_index)
						{
							if (current_filter1.raw.file_index[count_index] > -1)
							{
								if (!script2.raw_files[current_filter1.raw.file_index[count_index]].loaded)
								{
									if (!script2.raw_files[current_filter1.raw.file_index[count_index]].exists())
									{
										script.erase_raw_file(count_index);
										script2.erase_raw_file(count_index);
										current_filter1.raw.file_index.RemoveAt(count_index);
										--count_index;
										if (current_filter1.raw.file_index.Count == 0)
										{
											script2.erase_filter(count_filter,script2.prelayers[count_prelayer1].layer[count_layer1].prefilter);
											--count_filter;
										}
										continue;
									}
									script2.raw_files[current_filter1.raw.file_index[count_index]].bytes = File.ReadAllBytes(script2.raw_files[current_filter1.raw.file_index[count_index]].file);
									length = script2.raw_files[current_filter1.raw.file_index[count_index]].bytes.Length;
									resolution = script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.x*script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.y*2;
									if (length == resolution) {
										script2.raw_files[current_filter1.raw.file_index[count_index]].loaded = true;
									}
									else {
										// this.ShowNotification(GUIContent("Heightmap loading because of selected resolution failed. Please check the console"));
										Debug.Log("Prelayer"+count_prelayer1+" -> Layer"+count_layer1+" -> Filter"+count_index
											+"\nThe Raw Heightmap file '"+script2.raw_files[current_filter1.raw.file_index[count_index]].file+"' has a lower resolution than selected. Please check the File size. It should be X*Y*2 = "
											+script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.x+"*"+script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.y+"*2 = "
											+script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.x*script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.y*2+" Bytes ("+script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.x+"*"+script2.raw_files[current_filter1.raw.file_index[count_index]].resolution.y+" resolution). But the File size is "+script2.raw_files[current_filter1.raw.file_index[count_index]].bytes.Length
											+" Bytes ("+Mathf.Round(Mathf.Sqrt(script2.raw_files[current_filter1.raw.file_index[count_index]].bytes.Length/2))+"x"+
											Mathf.Round(Mathf.Sqrt(script2.raw_files[current_filter1.raw.file_index[count_index]].bytes.Length/2))+" resolution).");
			
										script2.erase_raw_file(count_index);
										current_filter1.raw.file_index.RemoveAt(count_index);
										--count_index;
										if (current_filter1.raw.file_index.Count == 0)
										{
											script2.erase_filter(count_filter,script2.prelayers[count_prelayer1].layer[count_layer1].prefilter);
											--count_filter;
										}
										continue;
									}
								}
								if (count_prelayer1 == 0 && !script2.prelayers[0].prearea.active){current_filter1.raw.set_raw_auto_scale(script2.terrains[0],script2.terrains[0].prearea.area_old,script2.raw_files,count_index);}
								else 
								{
									current_filter1.raw.set_raw_auto_scale(script2.terrains[0],script2.prelayers[count_prelayer1].prearea.area_old,script2.raw_files,count_index);
								}
							} 
							else 
							{
								current_filter1.raw.file_index.RemoveAt(count_index);
								--count_index;
								if (current_filter1.raw.file_index.Count == 0)
								{
									script2.erase_filter(count_filter,script2.prelayers[count_prelayer1].layer[count_layer1].prefilter);
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
			current_subfilter1 = script2.subfilter[filter1.presubfilter.subfilter_index[count_subfilter]];
				
			if (current_subfilter1.type == condition_type_enum.RawHeightmap)
			{
				for (var count_index: int = 0;count_index < current_subfilter1.raw.file_index.Count;++count_index)
				{
					if (current_subfilter1.raw.file_index[count_index] > -1)
					{
						if (!script2.raw_files[current_subfilter1.raw.file_index[count_index]].loaded)
						{
							if (!script2.raw_files[current_subfilter1.raw.file_index[count_index]].exists())
							{
								script.erase_raw_file(count_index);
								script2.erase_raw_file(count_index);
								current_subfilter1.raw.file_index.RemoveAt(count_index);
								--count_index;
								if (current_subfilter1.raw.file_index.Count == 0)
								{
									script2.erase_subfilter(count_subfilter,filter1.presubfilter);
									--count_subfilter;
								}
								continue;
							}
							script2.raw_files[current_subfilter1.raw.file_index[count_index]].bytes = File.ReadAllBytes(script2.raw_files[current_subfilter1.raw.file_index[count_index]].file);
							length = script2.raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length;
							resolution = script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x*script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y*2;
							if (length == resolution) {
								script2.raw_files[current_subfilter1.raw.file_index[count_index]].loaded = true;
							}
							else {
								// this.ShowNotification(GUIContent("Heightmap loading because of selected resolution failed. Please check the console"));
								Debug.Log("Prelayer"+count_prelayer1+" -> Layer"+count_layer1+" -> subfilter"+count_index
									+"\nThe Raw Heightmap file '"+script2.raw_files[current_subfilter1.raw.file_index[count_index]].file+"' has a lower resolution than selected. Please check the File size. It should be X*Y*2 = "
									+script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x+"*"+script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y+"*2 = "
									+script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x*script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y*2+" Bytes ("+script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.x+"*"+script2.raw_files[current_subfilter1.raw.file_index[count_index]].resolution.y+" resolution). But the File size is "+script2.raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length
									+" Bytes ("+Mathf.Round(Mathf.Sqrt(script2.raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length/2))+"x"+
									Mathf.Round(Mathf.Sqrt(script2.raw_files[current_subfilter1.raw.file_index[count_index]].bytes.Length/2))+" resolution).");
	
								script2.erase_raw_file(count_index);
								current_subfilter1.raw.file_index.RemoveAt(count_index);
								--count_index;
								if (current_subfilter1.raw.file_index.Count == 0)
								{
									script2.erase_subfilter(count_subfilter,filter1.presubfilter);
									--count_subfilter;
								}
								continue;
							}
						}
						if (count_prelayer1 == 0 && !script2.prelayers[0].prearea.active){current_subfilter1.raw.set_raw_auto_scale(script2.terrains[0],script2.terrains[0].prearea.area_old,script2.raw_files,count_index);}
						else 
						{
							current_subfilter1.raw.set_raw_auto_scale(script2.terrains[0],script2.prelayers[count_prelayer1].prearea.area_old,script2.raw_files,count_index);
						}
					} 
					else 
					{
						current_subfilter1.raw.file_index.RemoveAt(count_index);
						--count_index;
						if (current_subfilter1.raw.file_index.Count == 0)
						{
							script2.erase_subfilter(count_subfilter,filter1.presubfilter);
							--count_subfilter;
							continue;
						}
					}
				}
			}
		}
	}
	
	function GetTreesPlaced(): int
	{
		var treeCount: int = 0;
		for (var i: int = 0;i < script.terrains.Count;++i) {
			if (script.terrains[i].terrain == null) continue;
			if (script.terrains[i].terrain.terrainData == null) continue;
			treeCount += script.terrains[i].terrain.terrainData.treeInstances.Length;
		}
		return treeCount;
	}
	
	function Substring(text: String,text2: String,length: int): String
	{
		if (length < text.Length) {
			return (text.Substring(0,length)+text2);
		}
		else {
			length = text.Length;
			return (text.Substring(0,length));
		}
	}
	
	function UndoRegister(text: String)
	{
		if (global_script.settings.undo) {
			#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
		       	Undo.RecordObject(script,text);
	        #else
	        	Undo.RegisterUndo(script,text);
	        #endif
	    }
	}
	
	function ToggleMeasureTool()
	{
		script.measure_tool = !script.measure_tool;
		if (!script.measure_tool) {
			script.measure_tool_active = false;
			if (measure_tool != null) measure_tool.Close();
		}
		else {
			script.measure_tool_active = true;
			if (script.measure_tool_undock){create_window_measure_tool();}
		}
	}
	
	function DrawValueSlider(prevalue: value_class,index: int,labelSpace: boolean,vClick: int)
	{
		gui_changed_old = GUI.changed;
		GUI.changed = false;
		
		if (prevalue.mode == SliderMode_Enum.One)
		{
			prevalue.value[index] = EditorGUILayout.Slider(prevalue.value[index],1,100);
			
			if (GUI.changed)
			{
				gui_changed_old = true;
				prevalue.calc_value();
			}
		}
		else
		{
			if (index >= prevalue.value_multi.Count) {
				prevalue.SyncValueMulti();
			}
			var value_multi: Vector2 = prevalue.value_multi[index];
			
			if (!prevalue.active[index]){value_multi = Vector2(0,0);}
			
//			if (key.button == 0 && key.isMouse && key.type == EventType.MouseDown && prevalue.rect.Contains(key.mousePosition)) {
//				Undo.RegisterUndo(script,"Value Change"); 
//			}	
			EditorGUILayout.LabelField("");
		 	if (key.type == EventType.Repaint){prevalue.rect[index] = GUILayoutUtility.GetLastRect();}
		 	
			value_multi = GUIW.MinMaxSlider(prevalue.rect[index],value_multi,0,100,new Vector2(Screen.width,vClick));
			// if (GUIW.changed) Repaint();
			
        	if (prevalue.active[index])
			{
				prevalue.value_multi[index] = value_multi;
				if (GUIW.changed) {
					gui_changed_old = true;
					prevalue.set_value_multi(index);
					Repaint();
				}
			}
		}
		
		if (global_script.tooltip_mode != 0)
		{
			tooltip_text = "Center this value to 50";
		}
		
		if (GUILayout.Button(GUIContent("R",tooltip_text),GUILayout.Width(25)))
		{
			prevalue.reset_single_value(index);
			gui_changed_old = true;
			generate_auto();
		}
		EditorGUILayout.LabelField(prevalue.text[index],GUILayout.Width(90));
		
		GUI.changed = gui_changed_old;
	}
	
	var tCount : int;
	var counter : int;
	var totalCount : int;
	var terrainName: String;
	var progressUpdateInterval : int = 10000;
	
	function ExportTerrainsObj(swapUV: boolean, saveFormat: SaveObjFormat, saveResolution: SaveObjResolution) 
	{
		var countTerrain: int = 0;
		
		for (var i: int = 0;i < script.terrains.Count;++i) {
			if (script.terrains[i].active) ++countTerrain;
		}
		if (countTerrain == 0) {
			ShowNotification(new GUIContent("Please activate at least 1 terrain"));
			return;
		}
		
		var path: String;
		var terrainObject: GameObject;
		
		for (i = 0;i < script.terrains.Count;++i) {
			if (script.terrains[i].terrain == null) continue;
			if (script.terrains[i].terrain.terrainData == null) continue;
			if (!script.terrains[i].active) continue;
			path = script.settings.mesh_path+"/"+script.terrains[i].terrain.name+".obj";
			ExportTerrainObj (script.terrains[i].terrain.terrainData,path,swapUV,saveFormat,saveResolution);
		}
		
		AssetDatabase.Refresh();
		var terrainParent: GameObject = new GameObject();
		terrainParent.name = "Terrain Obj";
		var meshRenderer: MeshRenderer;
		var child: Transform;
		
		for (i = 0;i < script.terrains.Count;++i) {
			if (script.terrains[i].terrain == null) continue;
			if (script.terrains[i].terrain.terrainData == null) continue;
			if (!script.terrains[i].active) continue;
			path = script.settings.mesh_path+"/"+script.terrains[i].terrain.name+".obj";
			if (script.settings.mesh_path.Contains(Application.dataPath)) {
				// Debug.Log(path.Replace(Application.dataPath,"Assets"));
				terrainObject = Instantiate(AssetDatabase.LoadAssetAtPath(path.Replace(Application.dataPath,"Assets"),GameObject));
				terrainObject.transform.position = script.terrains[i].terrain.transform.position;
				terrainObject.name = script.terrains[i].terrain.name;
				terrainObject.transform.parent = terrainParent.transform;
				child = terrainObject.transform.GetChild(0);
				if (child != null) {
					meshRenderer = child.GetComponent(MeshRenderer) as MeshRenderer;
					if (meshRenderer != null) meshRenderer.material = script.settings.mesh_material; 
				}
			}
		}
	}

 	function ExportTerrainObj (terrain: TerrainData,fileName: String,swapUV: boolean,saveFormat: SaveObjFormat,saveResolution: SaveObjResolution) 
 	{
		var terrainPos: Vector3;
		terrainName = terrain.name;
		// var fileName = EditorUtility.SaveFilePanel("Export .obj file", "", "Terrain", "obj");
		var w: int = terrain.heightmapWidth;
		var h: int = terrain.heightmapHeight;
		var meshScale: Vector3 = terrain.size;
		var tRes: int = Mathf.Pow(2, parseInt(saveResolution));
		meshScale  = Vector3(meshScale.x/(w-1)*tRes, meshScale.y, meshScale.z/(h-1)*tRes);
		var uvScale: Vector2 = Vector2(1.0/(w-1), 1.0/(h-1));
		var tData: float[,] = terrain.GetHeights(0, 0, w, h);
 
		w = (w-1) / tRes + 1;
		h = (h-1) / tRes + 1;
		var tVertices: Vector3[] = new Vector3[w * h];
		var tUV: Vector2[] = new Vector2[w * h];
		if (saveFormat == SaveObjFormat.Triangles) {
			var tPolys: int [] = new int[(w-1) * (h-1) * 6];
		}
		else {
			tPolys = new int[(w-1) * (h-1) * 4];
		}
 
		// Build vertices and UVs
		if (swapUV) {
			for (y = 0; y < h; y++) {
				for (x = 0; x < w; x++) {
					tVertices[y*w + x] = Vector3.Scale(meshScale, Vector3(-y, tData[x*tRes,y*tRes], x)) + terrainPos;
					tUV[y*w + x] = Vector2.Scale(Vector2(y*tRes, x*tRes), uvScale);
				}
			}
		}
		else {
			for (y = 0; y < h; y++) {
				for (x = 0; x < w; x++) {
					tVertices[y*w + x] = Vector3.Scale(meshScale, Vector3(-y, tData[x*tRes,y*tRes], x)) + terrainPos;
					tUV[y*w + x] = Vector2.Scale(Vector2(y*tRes, x*tRes), uvScale);
				}
			}
		}
 
		var index = 0;
		if (saveFormat == SaveObjFormat.Triangles) {
			// Build triangle indices: 3 indices into vertex array for each triangle
			for (y = 0; y < h-1; y++) {
				for (x = 0; x < w-1; x++) {
					// For each grid cell output two triangles
					tPolys[index++] = (y	 * w) + x;
					tPolys[index++] = ((y+1) * w) + x;
					tPolys[index++] = (y	 * w) + x + 1;
 
					tPolys[index++] = ((y+1) * w) + x;
					tPolys[index++] = ((y+1) * w) + x + 1;
					tPolys[index++] = (y	 * w) + x + 1;
				}
			}
		}
		else {
			// Build quad indices: 4 indices into vertex array for each quad
			for (y = 0; y < h-1; y++) {
				for (x = 0; x < w-1; x++) {
					// For each grid cell output one quad
					tPolys[index++] = (y	 * w) + x;
					tPolys[index++] = ((y+1) * w) + x;
					tPolys[index++] = ((y+1) * w) + x + 1;
					tPolys[index++] = (y	 * w) + x + 1;
				}
			}	
		}
 
		// Export to .obj
		try {
			var sw: StreamWriter = new StreamWriter(fileName);
			sw.WriteLine("# Unity terrain OBJ File");
 
			// Write vertices
			System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("en-US");
			counter = tCount = 0;
			totalCount = (tVertices.Length*2 + (saveFormat == SaveObjFormat.Triangles? tPolys.Length/3 : tPolys.Length/4)) / progressUpdateInterval;
			for (i = 0; i < tVertices.Length; i++) {
				UpdateProgress();
				var sb: StringBuilder = StringBuilder("v ", 20);
				// StringBuilder stuff is done this way because it's faster than using the "{0} {1} {2}"etc. format
				// Which is important when you're exporting huge terrains.
				sb.Append(tVertices[i].x.ToString()).Append(" ").
				   Append(tVertices[i].y.ToString()).Append(" ").
				   Append(tVertices[i].z.ToString());
				sw.WriteLine(sb);
			}
			// Write UVs
			for (i = 0; i < tUV.Length; i++) {
				UpdateProgress();
				sb = StringBuilder("vt ", 22);
				sb.Append(tUV[i].x.ToString()).Append(" ").
				   Append(tUV[i].y.ToString());
				sw.WriteLine(sb);
			}
			if (saveFormat == SaveObjFormat.Triangles) {
				// Write triangles
				for (i = 0; i < tPolys.Length; i += 3) {
					UpdateProgress();
					sb = StringBuilder("f ", 43);
					sb.Append(tPolys[i]+1).Append("/").Append(tPolys[i]+1).Append(" ").
					   Append(tPolys[i+1]+1).Append("/").Append(tPolys[i+1]+1).Append(" ").
					   Append(tPolys[i+2]+1).Append("/").Append(tPolys[i+2]+1);
					sw.WriteLine(sb);
				}
			}
			else {
				// Write quads
				for (i = 0; i < tPolys.Length; i += 4) {
					UpdateProgress();
					sb = StringBuilder("f ", 57);
					sb.Append(tPolys[i]+1).Append("/").Append(tPolys[i]+1).Append(" ").
					   Append(tPolys[i+1]+1).Append("/").Append(tPolys[i+1]+1).Append(" ").
					   Append(tPolys[i+2]+1).Append("/").Append(tPolys[i+2]+1).Append(" ").
					   Append(tPolys[i+3]+1).Append("/").Append(tPolys[i+3]+1);
					sw.WriteLine(sb);
				}		
			}
		}
		catch (err) {
			Debug.Log("Error saving file: " + err.Message);
		}
		sw.Close();
 
		terrain = null;
		EditorUtility.DisplayProgressBar("Saving file to disc.", "This might take a while...", 1);		
		// EditorWindow.GetWindow(ExportTerrain).Close();
		EditorUtility.ClearProgressBar();
	}
 
	function UpdateProgress () {
		if (counter++ == progressUpdateInterval) {
			counter = 0;
			EditorUtility.DisplayProgressBar("Saving "+terrainName+"...", "", Mathf.InverseLerp(0, totalCount, ++tCount));
		}
	}
}