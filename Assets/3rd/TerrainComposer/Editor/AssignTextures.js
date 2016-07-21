#pragma downcast

class AssignTextures extends EditorWindow
{
	var key: Event;
	var script: terraincomposer_save;
	var tc_script: TerrainComposer;
	var global_script: global_settings_tc;
	var scrollPos: Vector2;
	var rtp: boolean = false;
	var mode: int;
	var path: String;
	
	var TerrainComposer_Scene: GameObject;
	var Global_Settings_Scene: GameObject;
	
	var tooltip_text: String;
	var gui_changed_old: boolean;
	var current_terrain: terrain_class;
	
	static function ShowWindow () 
	{
    	var window = EditorWindow.GetWindow(AssignTextures);
        #if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
        window.title = "Terrain Tiles";
        #else
    	window.titleContent = new GUIContent("Terrain Tiles");    
        #endif
    }
    
    function OnFocus()
	{
		Get_TerrainComposer_Scene();
	}
	
	function OnEnable()
	{
		load_button_textures();
	}
	
	function load_button_textures() 
	{
	   
	}
	
	function Get_TerrainComposer_Scene()
    {
     	TerrainComposer_Scene = GameObject.Find("TerrainComposer_Save");
     	Global_Settings_Scene = GameObject.Find("global_settings");
        
        if (TerrainComposer_Scene)
        {
        	script = TerrainComposer_Scene.GetComponent(terraincomposer_save);
        }
       	
       	if (Global_Settings_Scene)
        {
        	global_script = Global_Settings_Scene.GetComponent(global_settings_tc);
        }
        
        if (!tc_script)
		{ 
			tc_script = EditorWindow.GetWindow(TerrainComposer) as TerrainComposer;
		}
    }
    
	function OnDestroy()
	{
		if (!script){OnFocus();}
		script.image_tools = false;
		if (tc_script){tc_script.Repaint();}
	}

	function OnGUI()
	{
		if (!tc_script || !script || !global_script){OnFocus();}
		
		key = Event.current;
		
		if (script.tex1 && script.settings.color.backgroundActive)
        {
	       	EditorGUI.DrawPreviewTexture(Rect(0,0,position.width,position.height),script.tex1);
	    }
	    else
	    {
    		script.tex1 = new Texture2D(1,1); 
	 		script.tex1.SetPixel(0,0,script.settings.color.backgroundColor);
			script.tex1.Apply();
	    }
		
		key = Event.current;
			    
    	if (global_script.tooltip_mode != 0)
    	{
			tooltip_text = "Auto complete the list\n(Click)\n\nSet search parameters\n(Alt Click)";
        }
        tc_script.key = Event.current;
        
        if (mode == 0) {
        	EditorGUILayout.LabelField("Colormap");
        }
        else if (mode == 1) {
        	EditorGUILayout.LabelField("Normalmap");	
        }
        
        EditorGUILayout.BeginHorizontal();
		
		if (GUILayout.Button(GUIContent(">Auto Search",tooltip_text),GUILayout.Width(94)))
		{
			if (key.shift)
			{
				if (script.terrains[0].rtp_script) {
					if (mode == 0) {
						if (!script.terrains[0].rtp_script.ColorGlobal) {
							this.ShowNotification(GUIContent("Please assign the first texture (Texture field that is red)"));
						}
						else {
//							#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
//	        					Undo.RecordObject(script,"Auto Search Image");
//							#else
//	        					Undo.RegisterUndo(script,"Auto Search Image");
//							#endif
		        			auto_search_rtp_colormap();
						}
					}
					else if (mode == 1) {
						if (!script.terrains[0].rtp_script.NormalGlobal) {
							this.ShowNotification(GUIContent("Please assign the first texture (Texture field that is red)"));
						}
						else {
//							#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
//	        					Undo.RecordObject(script,"Auto Search Image");
//							#else
//	        					Undo.RegisterUndo(script,"Auto Search Image");
//							#endif
							auto_search_rtp_normalmap();
						}
					}
				}
				else {
					if (!script.terrains[0].splatPrototypes[0].texture) {
						this.ShowNotification(GUIContent("Please assign the first texture (Texture field that is red)"));
					}
					else {
//						#if !UNITY_3_4 && !UNITY_3_5 && !UNITY_4_0 && !UNITY_4_1 && !UNITY_4_2
//        					Undo.RecordObject(script,"Auto Search Image");
//						#else
//        					Undo.RegisterUndo(script,"Auto Search Image");
//						#endif
						auto_search_colormap();
					}
				}
			}
			else
			{
				tc_script.draw_auto_search_select(script.settings.colormap_auto_search,true);
			}
		} 
		
		if (mode != 1) {
			if (key.type == EventType.Repaint) 
			{
		    	script.settings.colormap_auto_search.menu_rect = GUILayoutUtility.GetLastRect();
		    }
			GUILayout.Space(10);
			script.settings.colormap_auto_search.foldout = EditorGUI.Foldout(Rect(script.settings.colormap_auto_search.menu_rect.x+95,script.settings.colormap_auto_search.menu_rect.y,15,19),script.settings.colormap_auto_search.foldout,String.Empty);
			EditorGUILayout.LabelField("("+script.settings.colormap_auto_search.output_format+") (Shift click to do the auto search)");
			EditorGUILayout.EndHorizontal();
			
			if (script.settings.colormap_auto_search.foldout)
			{
				tc_script.draw_auto_search(script.settings.colormap_auto_search,-220);
				GUILayout.Space(5);
			}
		}
		else {
			if (key.type == EventType.Repaint) 
			{
		    	script.settings.normalmap_auto_search.menu_rect = GUILayoutUtility.GetLastRect();
		    }
			GUILayout.Space(10);
			script.settings.normalmap_auto_search.foldout = EditorGUI.Foldout(Rect(script.settings.normalmap_auto_search.menu_rect.x+95,script.settings.normalmap_auto_search.menu_rect.y,15,19),script.settings.normalmap_auto_search.foldout,String.Empty);
			EditorGUILayout.LabelField("("+script.settings.colormap_auto_search.output_format+") (Shift click to do the auto search)");
			EditorGUILayout.EndHorizontal();
			
			if (script.settings.normalmap_auto_search.foldout)
			{
				tc_script.draw_auto_search(script.settings.normalmap_auto_search,-220);
				GUILayout.Space(5);
			}
		}
		
		if (GUILayout.Button("-Reset-",GUILayout.Width(94))) {
			if (key.control) {
				if (script.terrains[0].rtp_script) {
					if (mode == 0) {reset_rtp_colormap();}
					else if (mode == 1) {reset_rtp_normalmap();}
				}
				else {
					reset_colormap();
				}
			}
			else {
				this.ShowNotification(GUIContent("Control click the '-Reset-' button to reset"));
			}
		}
		
		var tiles: tile_class = new tile_class();
		tiles.x = script.terrains[0].tiles.x;
		tiles.y = script.terrains[0].tiles.y;
		
		scrollPos = EditorGUILayout.BeginScrollView(scrollPos,true,true);
		
		var tile_y: int;
		var tile_x: int;
		var count_terrain: int;
		
		for (tile_y = tiles.y-1;tile_y >= 0;--tile_y)
		{
			EditorGUILayout.BeginHorizontal();
			for (tile_x = 0;tile_x < tiles.x;++tile_x)
			{
		
				count_terrain = (tile_y*tiles.x)+tile_x;
				current_terrain = script.terrains[count_terrain];
				gui_changed_old = GUI.changed;
				GUI.changed = false;
				if (tile_x == 0 && tile_y == 0) GUI.backgroundColor = Color.red;
				if (current_terrain.rtp_script) {
					gui_changed_old = GUI.changed;
    				GUI.changed = false;
    				if (mode == 0) {
	    				current_terrain.rtp_script.ColorGlobal = EditorGUILayout.ObjectField(current_terrain.rtp_script.ColorGlobal,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
	    				if (GUI.changed) {
	    					path = AssetDatabase.GetAssetPath(current_terrain.rtp_script.ColorGlobal);
	    					global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
	    					current_terrain.rtp_script.globalSettingsHolder.RefreshAll();
				        }
	    			}
	    			else if (mode == 1) {
	    				current_terrain.rtp_script.NormalGlobal = EditorGUILayout.ObjectField(current_terrain.rtp_script.NormalGlobal,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
	    				if (GUI.changed) {
	    					path = AssetDatabase.GetAssetPath(current_terrain.rtp_script.NormalGlobal);
	    					global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
	    					current_terrain.rtp_script.globalSettingsHolder.RefreshAll();
				        }
	    			}
    				GUI.changed = gui_changed_old;
				}
				else {
					if (current_terrain.splatPrototypes.Count != 0) {
						current_terrain.splatPrototypes[0].texture = EditorGUILayout.ObjectField(current_terrain.splatPrototypes[0].texture,Texture,true,GUILayout.Width(55),GUILayout.Height(55)) as Texture2D;
						if (GUI.changed)
						{
							if (tile_x == 0 && tile_y == 0)
							{
								script.settings.colormap_auto_search.path_full = AssetDatabase.GetAssetPath(current_terrain.splatPrototypes[0].texture);
							}
							tc_script.Repaint();
						}
						GUI.changed = gui_changed_old;
					} 
					else {
						GUI.color = Color.red;
						EditorGUILayout.LabelField("No Splat",GUILayout.Width(55),GUILayout.Height(55));
						GUI.color = Color.white;
					}
				}
				GUI.backgroundColor = Color.white;
			}
			EditorGUILayout.EndHorizontal();
		}
		EditorGUILayout.EndScrollView();
	}
	
	function auto_search_colormap()
	{
		script.settings.colormap_auto_search.path_full = AssetDatabase.GetAssetPath(script.terrains[0].splatPrototypes[0].texture);
		script.settings.colormap_auto_search.strip_file();
		
		for (var count_terrain: int = 1;count_terrain < script.terrains.Count;++count_terrain)
		{
			if (script.terrains[count_terrain].splatPrototypes.Count > 0)
			{
				
				path = script.settings.colormap_auto_search.get_file(script.terrains[count_terrain].tile_x,script.terrains[count_terrain].tile_z,count_terrain);
				script.terrains[count_terrain].splatPrototypes[0].texture = AssetDatabase.LoadAssetAtPath(path,Texture2D);
				
				global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
			}
		}
		
		tc_script.Repaint();
	}
	
	function auto_search_rtp_colormap()
	{
		var path: String;
		script.settings.colormap_auto_search.path_full = AssetDatabase.GetAssetPath(script.terrains[0].rtp_script.ColorGlobal);
		script.settings.colormap_auto_search.strip_file();
							
		
		for (var count_terrain: int = 1;count_terrain < script.terrains.Count;++count_terrain)
		{
			if (script.terrains[count_terrain].rtp_script)
			{
				path = script.settings.colormap_auto_search.get_file(script.terrains[count_terrain].tile_x,script.terrains[count_terrain].tile_z,count_terrain);
				script.terrains[count_terrain].rtp_script.ColorGlobal = AssetDatabase.LoadAssetAtPath(path,Texture2D);
				global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
			}
		}
		script.terrains[0].rtp_script.globalSettingsHolder.RefreshAll();
		
		tc_script.Repaint();
	}
	
	function auto_search_rtp_normalmap()
	{
		var path: String;
		
		script.settings.normalmap_auto_search.path_full = AssetDatabase.GetAssetPath(script.terrains[0].rtp_script.NormalGlobal);
		script.settings.normalmap_auto_search.strip_file();
		
		for (var count_terrain: int = 1;count_terrain < script.terrains.Count;++count_terrain)
		{
			if (script.terrains[count_terrain].rtp_script)
			{
				path = script.settings.normalmap_auto_search.get_file(script.terrains[count_terrain].tile_x,script.terrains[count_terrain].tile_z,count_terrain);
				script.terrains[count_terrain].rtp_script.NormalGlobal = AssetDatabase.LoadAssetAtPath(path,Texture2D);
				global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
			}
		}
		script.terrains[0].rtp_script.globalSettingsHolder.RefreshAll();
	
		tc_script.Repaint();
	}
	
	function reset_colormap()
	{
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			script.terrains[count_terrain].splatPrototypes[0].texture = null;
		}
	}
	
	function reset_rtp_colormap()
	{
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			script.terrains[count_terrain].rtp_script.ColorGlobal = null;
		}
		script.terrains[0].rtp_script.globalSettingsHolder.RefreshAll();
		tc_script.Repaint();
	}
	
	function reset_rtp_normalmap()
	{
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain) {
			script.terrains[count_terrain].rtp_script.NormalGlobal = null;
		}
		script.terrains[0].rtp_script.globalSettingsHolder.RefreshAll();
		tc_script.Repaint();
	}
}
   	
   