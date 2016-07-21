#pragma downcast
import System.IO;
import System;
import System.Collections.Generic;

class FilterTexture extends EditorWindow
{
	var script: terraincomposer_save;
	var tc_script: TerrainComposer;
	var global_script: global_settings_tc;
	var TerrainComposer_Scene: GameObject;
	var scrollPos: Vector2;
	var scrollPos2: Vector2;
	var gui_changed_old: boolean;
	var rect1: Rect;
	var rect2: Rect;
	var space: float;
	var scale_old: float;
	var pattern_generate: boolean = false;
	var rect_progressbar: Rect;
	var key: Event;
	var tooltip_text: String;
	var inputTex: Texture2D;
	var outputTex: Texture2D;
	
	var texZoom: float = 1;
	var texOffset: Vector2 = new Vector2(0,0);
	var texZoomTo: float = 1;
	var width: float;
	var height: float;
	var texPreviewMode: int = 0;
	var texAllign: int = 0;
	var texHeight: float;
	var texScrolling: boolean;
	var texResolutionLink: boolean = true;
	var texAutoGenerate: boolean = false;
	
	var return1: boolean = false;
	
	var button0_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_top.png",Texture);
    var button1_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_right_top.png",Texture);
    var button2_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_right.png",Texture);
    var button3_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_right_bottom.png",Texture);
    var button4_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_bottom.png",Texture);
    var button5_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_left_bottom.png",Texture);
    var button6_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_left.png",Texture);
    var button7_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_left_top.png",Texture);
    var button8_texture: Texture = AssetDatabase.LoadAssetAtPath("Assets/TerrainComposer/Buttons/arrow_center.png",Texture);
    
	static function ShowWindow () 
	{
    	var window = EditorWindow.GetWindow(FilterTexture);
    	#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
        window.title = "Image Tools";
        #else
        window.titleContent = new GUIContent("Image Tools");
        #endif
    }
    
    function OnFocus()
	{
		if (!script)
		{
			TerrainComposer_Scene = GameObject.Find("TerrainComposer_Save");
			if (TerrainComposer_Scene)
			{
				script = TerrainComposer_Scene.GetComponent(terraincomposer_save);
			}
		}
		if (!tc_script)
		{
			if (script){tc_script = EditorWindow.GetWindow(Type.GetType("TerrainComposer"));}
		}
	}
	
	function OnDestroy()
	{
		if (!script){OnFocus();}
		if (script) {script.image_tools = false;}
		if (tc_script){tc_script.Repaint();}
	}

	function OnGUI()
	{
		if (!tc_script || !script){OnFocus();return1 = true;return;}
		if (return1){return1 = false;return;}
		
		if (script.tex1)
        {
        	if (global_script.settings.color.backgroundActive) {
		       	GUI.color = global_script.settings.color.backgroundColor;
		       	EditorGUI.DrawPreviewTexture(Rect(0,26,position.width,position.height),script.tex1); 
		       	GUI.color = UnityEngine.Color.white;
		    }
	    }
	    else
	    {
	    	script.tex1 = new Texture2D(1,1);
	    	return;
	    }
	    
	    if (script.texture_tool.active) {
		    if (outputTex && inputTex) {
		    	width = inputTex.width*texZoom;
		    	height = inputTex.height*texZoom;
		    	
				if (texAllign == 0) {EditorGUI.DrawPreviewTexture(Rect((Screen.width/2)-(width/2)+(texOffset.x*texZoom),(Screen.height/2)-(height/2)+(texOffset.y*texZoom),width,height),outputTex);}
				else if (texAllign == 1) {EditorGUI.DrawPreviewTexture(Rect((Screen.width/2)-(width/2)+(texOffset.x*texZoom)+width,(Screen.height/2)-(height/2)+(texOffset.y*texZoom),width,height),outputTex);}
		    }
		    
		    if (inputTex && (texAllign != 0 || !outputTex)) {
		    	width = inputTex.width*texZoom;
		    	height = inputTex.height*texZoom;
		    	
				EditorGUI.DrawPreviewTexture(Rect((Screen.width/2)-(width/2)+(texOffset.x*texZoom),(Screen.height/2)-(height/2)+(texOffset.y*texZoom),width,height),inputTex);
				// (screen.width/2)-(width/2),(screen.height/2)-height/2,width,height
				//EditorGUI.DrawPreviewTexture(Rect(((-offset_map4.x)-(zoom_pos4*((global_script.map4.width*2*2)+offset_map4.x))-(800*3))-(800-position.width/2),((offset_map4.y)-(zoom_pos4*((800*2*2)-offset_map4.y))-(2800))-(400-position.height/2),image_width,image_height),global_script.map4);
			}
		}
		
		tc_script.key = Event.current;
		key = tc_script.key;
      	
      	EditorGUI.DrawPreviewTexture(Rect(0,0,position.width,25),script.tex1);
	    
      	EditorGUILayout.BeginHorizontal();
      	if (script.texture_tool.active){GUI.backgroundColor = Color.green;}
      	if (GUILayout.Button("Image Filter Tool",GUILayout.Width(170)))
      	{
      		script.texture_tool.active = true;
      		script.pattern_tool.active = false;
      		script.heightmap_tool.active = false;
      	}
      	if (script.texture_tool.active){GUI.backgroundColor = Color.white;}
      	if (script.pattern_tool.active){GUI.backgroundColor = Color.green;}
      	if (GUILayout.Button("Image Pattern Tool",GUILayout.Width(170)))
      	{
      		script.texture_tool.active = false;
      		script.pattern_tool.active = true;
      		script.heightmap_tool.active = false;
      		pattern_first_init();
      	}
      	if (script.pattern_tool.active){GUI.backgroundColor = Color.white;}
      	if (script.heightmap_tool.active){GUI.backgroundColor = Color.green;}
		if (GUILayout.Button("Image Heightmap Tool",GUILayout.Width(170)))
      	{
      		script.heightmap_tool.active = true;
      		script.texture_tool.active = false;
      		script.pattern_tool.active = false;
      	}
      	if (script.heightmap_tool.active){GUI.backgroundColor = Color.white;}
      	EditorGUILayout.EndHorizontal();
      	
		if (script.texture_tool.active){texture_tool();} 
		else if (script.pattern_tool.active){pattern_tool();}
		else if (script.heightmap_tool.active){heightmap_tool();}
	}
	
	function texture_tool()
	{
		// EditorGUILayout.LabelField("Image Filter Tool");
		GUILayout.Space(25);
        gui_changed_old = GUI.changed;
		GUI.changed = false;
		
		inputTex = script.texture_tool.preimage.image[0];
		outputTex = script.texture_tool.preimage.image[1];
		
		if (key.type == EventType.ScrollWheel) {
			//texZoomTo -= key.delta.y;
			
			if (key.delta.y < 0) {
				texZoomTo *= 1.5;
			}
			else {
				texZoomTo /= 1.5;
			}
			
			if (texZoomTo < 0.1) {texZoomTo = 0.1;}
			else if (texZoomTo > 80) {texZoomTo = 80;}
		}
		
		if (key.button == 0) {
			if (key.type == EventType.MouseDown) {
				if (key.mousePosition.y > texHeight+20) {texScrolling = true;} 
			} 
			else if (key.type == EventType.MouseUp) {
				texScrolling = false;
			}
			
			if (texScrolling && key.type == EventType.MouseDrag) {
				texOffset += key.delta/texZoomTo;
				check_texOffset();
				this.Repaint();
			}
		}
		
		if (key.type == EventType.MouseDown && key.button == 1) {
			texZoomTo = 1;
			if (key.clickCount == 2) {
				texOffset = Vector2(0,0);
				this.Repaint();	
			}
		}
		
		if (texZoomTo != texZoom) {
			texZoom = Mathf.Lerp(texZoom,texZoomTo,0.075);
			if (Mathf.Abs(texZoom-texZoomTo) < 0.0001) {texZoom = texZoomTo;}
			// check_texOffset();
			this.Repaint();
		} 
		
		if (!global_script.tex2)
		{
			global_script.tex2 = new Texture2D(1,1);
			global_script.tex2.SetPixel(0,0,global_script.map.backgroundColor);
			global_script.tex2.Apply();
		}
		if (!global_script.tex3)
		{
			global_script.tex3 = new Texture2D(1,1);
			global_script.tex3.SetPixel(0,0,global_script.map.titleColor);
			global_script.tex3.Apply();
		}
		
		// draw cross
		Drawing_tc1.DrawLine(Vector2(position.width/2,(position.height/2)-10),Vector2(position.width/2,(position.height/2)+10),Color.green,1,false,Rect(0,0,position.width,position.height));
		Drawing_tc1.DrawLine(Vector2((position.width/2)-10,position.height/2),Vector2((position.width/2)+10,position.height/2),Color.green,1,false,Rect(0,0,position.width,position.height));
		
		texHeight = 148+script.texture_tool.precolor_range.color_range.Count*20;
		global_script.drawGUIBox(Rect(0,25,Screen.width,texHeight),"Settings",global_script.settings.color.backgroundColor,global_script.map.titleColor,global_script.map.color);
		
        //script.texture_tool.preimage.image[0] = EditorGUILayout.ObjectField(script.texture_tool.preimage.image[0],Texture,true,GUILayout.Width(script.texture_tool.resolution_display.x*script.texture_tool.scale),GUILayout.Height(script.texture_tool.resolution_display.y*script.texture_tool.scale)) as Texture2D;
		if (GUI.changed)
		{
			tc_script.set_image_import_settings(script.texture_tool.preimage.image[0],1,1,-1,-1);
		}
		GUI.changed = gui_changed_old;
		// EditorGUILayout.ObjectField(script.texture_tool.preimage.image[1],Texture,true,GUILayout.Width(script.texture_tool.resolution_display.x*script.texture_tool.scale),GUILayout.Height(script.texture_tool.resolution_display.y*script.texture_tool.scale));
		
		// GUILayout.Space(space);
		
		if (tc_script.key.type == EventType.Repaint)
		{
			rect1 = GUILayoutUtility.GetLastRect();
		}
		EditorGUILayout.BeginHorizontal();
		gui_changed_old = GUI.changed;
		GUI.changed = false;
		script.texture_tool.resolution_display = EditorGUILayout.Vector2Field("Resolution",script.texture_tool.resolution_display,GUILayout.Width(200));
		if (GUI.changed)
		{
			script.texture_tool.rect = Rect(script.texture_tool.resolution_display.x+10,5,script.texture_tool.resolution_display.x,script.texture_tool.resolution_display.y);
			if (texResolutionLink) {script.texture_tool.resolution_display.y = script.texture_tool.resolution_display.x;}
		}
		texResolutionLink = EditorGUILayout.Toggle(texResolutionLink,GUILayout.Width(25));
		/*
		GUI.changed = false;
		scale_old = script.texture_tool.scale;
		script.texture_tool.scale = EditorGUILayout.Slider("Scale",script.texture_tool.scale,0,128);
		if (GUI.changed)
		{
			var delta_scale: float = script.texture_tool.scale - scale_old;
			scrollPos.x *= (1+delta_scale);
			scrollPos.y *= (1+delta_scale);
		}
		GUI.changed = gui_changed_old;
		*/
		GUILayout.Space(5);
		EditorGUILayout.LabelField("Input Image",GUILayout.Width(75));
		script.texture_tool.preimage.image[0] = EditorGUILayout.ObjectField(script.texture_tool.preimage.image[0],Texture,true,GUILayout.Width(55),GUILayout.Height(55)) as Texture2D;
		
		EditorGUILayout.EndHorizontal();
		
		EditorGUILayout.BeginHorizontal();
		if (texAutoGenerate) {GUI.backgroundColor = Color.green;} 
		if(GUILayout.Button("Generate Texture",GUILayout.Width(120))) {
			if (key.shift) {texAutoGenerate = !texAutoGenerate;}
			else {
				generate_texture();
			}
		}
		GUI.backgroundColor = Color.white;
		if (texAllign == 0) {GUI.backgroundColor = Color.green;}
		if(GUILayout.Button("Overlay",EditorStyles.miniButtonMid,GUILayout.Width(75))) {
			texAllign = 0;
		}
		if (texAllign == 1) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if(GUILayout.Button("Compare",EditorStyles.miniButtonMid,GUILayout.Width(75))) {
			texAllign = 1;
		}
		GUILayout.Space(10);
		EditorGUILayout.LabelField("Mode",GUILayout.Width(40));
		if (texPreviewMode & 1) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if(GUILayout.Button("Highlight",EditorStyles.miniButtonMid,GUILayout.Width(75))) {
			if (texPreviewMode & 1) {
				texPreviewMode -= 1;
				if ((texPreviewMode & 2)) {texPreviewMode -= 2;}
			} 
			else {texPreviewMode += 1;} 
			if (texAutoGenerate) {generate_texture();}
		}
		
		if (texPreviewMode & 2) {GUI.backgroundColor = Color.green;} else {GUI.backgroundColor = Color.white;}
		if(GUILayout.Button("Transparent",EditorStyles.miniButtonMid,GUILayout.Width(75))) {
			if (texPreviewMode & 2) {
				texPreviewMode -= 2;
			}
			else {
				texPreviewMode += 2;
				texPreviewMode |= 1;
			}
			if (texAutoGenerate) {generate_texture();}
		}
		
		GUI.backgroundColor = Color.white;
		EditorGUILayout.EndHorizontal();
		
		GUI.changed = false;
		tc_script.draw_precolor_range(script.texture_tool.precolor_range,0,false,0,Color.white,true,false,false,4);
		if (GUI.changed && texAutoGenerate) {
			generate_texture();
		}
		
		GUILayout.Space(10);
		if (tc_script.key.type == EventType.Repaint)
		{
			rect1 = GUILayoutUtility.GetLastRect();
		}
		space = this.position.height-(rect2.yMax-rect1.yMax)-rect1.height;
	}
	
	function generate_texture()
	{
		var path: String = AssetDatabase.GetAssetPath(inputTex);
		global_script.set_image_import_settings(path,true,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,1);
		var texPreviewMode1: int = texPreviewMode;
		
		script.filter_texture(texPreviewMode1);
	}
	
	function check_texOffset()
	{
		if (texOffset.x*texZoom > width/2) {texOffset.x = (width/2)/texZoom;}
		else if (texOffset.x*texZoom < -width*1.5) {texOffset.x = (-width*1.5)/texZoom;}
		if (texOffset.y*texZoom > (height/2)-10) {texOffset.y = ((height/2)-10)/texZoom;}
		else if (texOffset.y*texZoom < (-height/2)-10) {texOffset.y = ((-height/2)-10)/texZoom;}
	}
	
	function pattern_tool()
	{
		EditorGUILayout.LabelField("Image Pattern Tool");
		EditorGUILayout.ObjectField(script.pattern_tool.output_texture,Texture,false,GUILayout.Width(script.pattern_tool.resolution_display.x),GUILayout.Height(script.pattern_tool.resolution_display.y));
		
		if (tc_script.key.type == EventType.Repaint)
		{
			rect1 = GUILayoutUtility.GetLastRect();
		}
		
		var rect1a: Rect = rect1;
		rect1a.xMax += 20;
		
		script.pattern_tool.output_resolution = EditorGUI.Vector2Field(Rect(rect1a.xMax,rect1a.y,300,50),"Output Resolution",script.pattern_tool.output_resolution);
		rect1a.y += 40;
		
		if (script.pattern_tool.output_resolution.x != script.pattern_tool.output_texture.width || script.pattern_tool.output_resolution.y != script.pattern_tool.output_texture.height)
		{
			
			if (GUI.Button(Rect(rect1a.xMax,rect1a.y,80,17),"Change"))
			{
				script.pattern_tool.output_texture.Resize(script.pattern_tool.output_resolution.x,script.pattern_tool.output_resolution.y);
				script.pattern_tool.output_texture.Apply();
				return;
			}
			rect1a.y += 20;
		}
		
		EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,160,25),"Path");
       	EditorGUI.LabelField(Rect(rect1a.xMax+70,rect1a.y,script.pattern_tool.export_path.Length*6.5,25),""+script.pattern_tool.export_path);
        if (GUI.Button(Rect(70+rect1a.xMax+script.pattern_tool.export_path.Length*6.5,rect1a.y,65,18),"Change"))
        {
       		var export_path: String = EditorUtility.OpenFolderPanel("Export File Path",script.pattern_tool.export_path,"");
        	if (export_path != ""){script.pattern_tool.export_path = export_path;}
		}
		rect1a.y += 20;
		EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,160,17),"Filename");
       	script.pattern_tool.export_file = EditorGUI.TextField(Rect(rect1a.xMax+70,rect1a.y,250,17),script.pattern_tool.export_file);
       	
       	rect1a.y += 20;
       	if (GUI.Button(Rect(rect1a.xMax,rect1a.y,85,18),"Export .PNG"))
       	{
       		tc_script.export_texture_to_file(script.pattern_tool.export_path,script.pattern_tool.export_file,script.pattern_tool.output_texture);
       		AssetDatabase.Refresh();
       	}
       	
       	EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Clear",GUILayout.Width(120));
		script.pattern_tool.clear = EditorGUILayout.Toggle(script.pattern_tool.clear,GUILayout.Width(25));
		EditorGUILayout.EndHorizontal();
		
		scrollPos2 = EditorGUILayout.BeginScrollView(scrollPos2,GUILayout.Width(Screen.width),GUILayout.Height(0));
        
		EditorGUILayout.LabelField("Patterns");
		EditorGUILayout.BeginHorizontal();
		if (GUILayout.Button("+",GUILayout.Width(25)))
		{
			script.pattern_tool.patterns.Add(new pattern_class());
		}
		if (GUILayout.Button("-",GUILayout.Width(25)) && key.control)
		{
			if (script.pattern_tool.patterns.Count > 0){script.pattern_tool.patterns.RemoveAt(script.pattern_tool.patterns.Count-1);}
		}
		EditorGUILayout.EndHorizontal();
		
		for (var count_pattern: int = 0;count_pattern < script.pattern_tool.patterns.Count;++count_pattern)
		{
			EditorGUILayout.BeginHorizontal();
			script.pattern_tool.patterns[count_pattern].foldout = EditorGUILayout.Foldout(script.pattern_tool.patterns[count_pattern].foldout,"Pattern"+count_pattern);
			script.pattern_tool.patterns[count_pattern].active = EditorGUILayout.Toggle(script.pattern_tool.patterns[count_pattern].active,GUILayout.Width(25));
			EditorGUILayout.EndHorizontal();
			
			if (script.pattern_tool.patterns[count_pattern].foldout)
			{
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				gui_changed_old = GUI.changed;
       			GUI.changed = false;
				script.pattern_tool.patterns[count_pattern].input_texture = EditorGUILayout.ObjectField(script.pattern_tool.patterns[count_pattern].input_texture,Texture,true,GUILayout.Width(64),GUILayout.Height(64)) as Texture2D;
				if (GUI.changed)
				{
					tc_script.set_image_import_settings(script.pattern_tool.patterns[count_pattern].input_texture,1,1,-1,-1);
				}
				GUI.changed = gui_changed_old;
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Output",GUILayout.Width(120));
				script.pattern_tool.patterns[count_pattern].output = EditorGUILayout.EnumPopup(script.pattern_tool.patterns[count_pattern].output);
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(space+15);
				EditorGUILayout.LabelField("Strength",GUILayout.Width(120));
				script.pattern_tool.patterns[count_pattern].strength = EditorGUILayout.Slider(script.pattern_tool.patterns[count_pattern].strength,0,1);
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Color",GUILayout.Width(120));
				script.pattern_tool.patterns[count_pattern].color = EditorGUILayout.ColorField(script.pattern_tool.patterns[count_pattern].color);
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Scale",GUILayout.Width(120));
				if (GUILayout.Button("L",GUILayout.Width(20)))
				{
					script.pattern_tool.patterns[count_pattern].scale_link = !script.pattern_tool.patterns[count_pattern].scale_link;
				    if (script.pattern_tool.patterns[count_pattern].scale_link)
				    {
				    	script.pattern_tool.patterns[count_pattern].scale_link_start_y = script.pattern_tool.patterns[count_pattern].scale_link_end_y = script.pattern_tool.patterns[count_pattern].scale_link_start_z = script.pattern_tool.patterns[count_pattern].scale_link_end_z = true;
				    } 
				    else
				    {
				   		script.pattern_tool.patterns[count_pattern].scale_link_start_y = script.pattern_tool.patterns[count_pattern].scale_link_end_y = script.pattern_tool.patterns[count_pattern].scale_link_start_z = script.pattern_tool.patterns[count_pattern].scale_link_end_z = false;
				   	}
				}
				GUILayout.Space(5);
				           				
				// scale
				if (GUILayout.Button("X",GUILayout.Width(20))){script.pattern_tool.patterns[count_pattern].scale_start.x = 1;script.pattern_tool.patterns[count_pattern].scale_end.x = 1;}
				script.pattern_tool.patterns[count_pattern].scale_start.x = EditorGUILayout.FloatField(Mathf.Round(script.pattern_tool.patterns[count_pattern].scale_start.x*100)/100,GUILayout.Width(40));
				if (script.pattern_tool.patterns[count_pattern].scale_start.x > script.pattern_tool.patterns[count_pattern].scale_end.x){script.pattern_tool.patterns[count_pattern].scale_end.x = script.pattern_tool.patterns[count_pattern].scale_start.x;}
				EditorGUILayout.MinMaxSlider(script.pattern_tool.patterns[count_pattern].scale_start.x,script.pattern_tool.patterns[count_pattern].scale_end.x,0.0001,10);
				script.pattern_tool.patterns[count_pattern].scale_end.x = EditorGUILayout.FloatField(Mathf.Round(script.pattern_tool.patterns[count_pattern].scale_end.x*100)/100,GUILayout.Width(40));
				EditorGUILayout.LabelField("",GUILayout.Width(25));
				EditorGUILayout.EndHorizontal();
	
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("",GUILayout.Width(120));
				script.pattern_tool.patterns[count_pattern].scale_link_start_y = EditorGUILayout.Toggle(script.pattern_tool.patterns[count_pattern].scale_link_start_y,GUILayout.Width(25));
				if (script.pattern_tool.patterns[count_pattern].scale_link_start_y){script.pattern_tool.patterns[count_pattern].scale_start.y = script.pattern_tool.patterns[count_pattern].scale_start.x;}
				if (GUILayout.Button("Y",GUILayout.Width(20))){script.pattern_tool.patterns[count_pattern].scale_start.y = 1;script.pattern_tool.patterns[count_pattern].scale_end.y = 1;}
				script.pattern_tool.patterns[count_pattern].scale_start.y = EditorGUILayout.FloatField(Mathf.Round(script.pattern_tool.patterns[count_pattern].scale_start.y*100)/100,GUILayout.Width(40));
				if (script.pattern_tool.patterns[count_pattern].scale_start.y > script.pattern_tool.patterns[count_pattern].scale_end.y){script.pattern_tool.patterns[count_pattern].scale_end.y = script.pattern_tool.patterns[count_pattern].scale_start.y;}
				EditorGUILayout.MinMaxSlider(script.pattern_tool.patterns[count_pattern].scale_start.y,script.pattern_tool.patterns[count_pattern].scale_end.y,0.0001,10);
				script.pattern_tool.patterns[count_pattern].scale_end.y = EditorGUILayout.FloatField(Mathf.Round(script.pattern_tool.patterns[count_pattern].scale_end.y*100)/100,GUILayout.Width(40));
				script.pattern_tool.patterns[count_pattern].scale_link_end_y = EditorGUILayout.Toggle(script.pattern_tool.patterns[count_pattern].scale_link_end_y,GUILayout.Width(25));
				if (script.pattern_tool.patterns[count_pattern].scale_link_end_y){script.pattern_tool.patterns[count_pattern].scale_end.y = script.pattern_tool.patterns[count_pattern].scale_end.x;}
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Unlink",GUILayout.Width(120));
			    script.pattern_tool.patterns[count_pattern].link_scale = EditorGUILayout.Slider(script.pattern_tool.patterns[count_pattern].link_scale,0,100);//,GUILayout.Width(267));
			    GUILayout.Space(29);
			    EditorGUILayout.EndHorizontal();
				
				// rotation
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Rotation",GUILayout.Width(120));
				GUILayout.Space(29);
				
				if (GUILayout.Button("Y",GUILayout.Width(20))){script.pattern_tool.patterns[count_pattern].rotation_start = 0;script.pattern_tool.patterns[count_pattern].rotation_end = 0;}
				
				script.pattern_tool.patterns[count_pattern].rotation_start = EditorGUILayout.FloatField(Mathf.Round(script.pattern_tool.patterns[count_pattern].rotation_start*100)/100,GUILayout.Width(40));
				if (script.pattern_tool.patterns[count_pattern].rotation_start > script.pattern_tool.patterns[count_pattern].rotation_end){script.pattern_tool.patterns[count_pattern].rotation_end = script.pattern_tool.patterns[count_pattern].rotation_start;}
				EditorGUILayout.MinMaxSlider(script.pattern_tool.patterns[count_pattern].rotation_start,script.pattern_tool.patterns[count_pattern].rotation_end,-180,180);
				script.pattern_tool.patterns[count_pattern].rotation_end = EditorGUILayout.FloatField(Mathf.Round(script.pattern_tool.patterns[count_pattern].rotation_end*100)/100,GUILayout.Width(40));
				EditorGUILayout.LabelField("",GUILayout.Width(25));
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.EndHorizontal();
				
				tc_script.draw_precolor_range(script.pattern_tool.patterns[count_pattern].precolor_range,15,false,0,Color.white,true,false,false,5);
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Count X",GUILayout.Width(120));
				script.pattern_tool.patterns[count_pattern].count_x = EditorGUILayout.IntField(script.pattern_tool.patterns[count_pattern].count_x,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Count Y",GUILayout.Width(120));
				script.pattern_tool.patterns[count_pattern].count_y = EditorGUILayout.IntField(script.pattern_tool.patterns[count_pattern].count_y,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
				
				EditorGUILayout.BeginHorizontal();
				GUILayout.Space(15);
				EditorGUILayout.LabelField("Place Max",GUILayout.Width(120));
				script.pattern_tool.patterns[count_pattern].place_max = EditorGUILayout.IntField(script.pattern_tool.patterns[count_pattern].place_max,GUILayout.Width(70));
				EditorGUILayout.EndHorizontal();
			}
		}
		EditorGUILayout.EndScrollView();
		
		if (!pattern_generate)
		{
			if (GUILayout.Button("Generate Texture",GUILayout.Width(120)))
			{
				if (script.pattern_tool.patterns.Count > 0)
				{
					if (script.generate_pattern_start()){pattern_generate = true;} else {this.ShowNotification(GUIContent("Assign an image to all patterns"));}
				}
			}	
		}
		else
		{
			if (GUILayout.Button("Stop",GUILayout.Width(120)))
			{
				pattern_generate = false;
				
			}
			EditorGUILayout.LabelField("");
			if (tc_script.key.type == EventType.Repaint)
			{
				rect_progressbar = GUILayoutUtility.GetLastRect();
			}
			EditorGUI.ProgressBar(rect_progressbar,(script.pattern_tool.patterns[0].pattern_placed.Count*1.0)/script.pattern_tool.place_total,""+(((script.pattern_tool.patterns[0].pattern_placed.Count*1.0)/script.pattern_tool.place_total)*100).ToString("f0")+"%");
		}
	}
	
	// heightmap tool
	function heightmap_tool()
	{
		EditorGUILayout.LabelField("Image Heightmap Tool");
		EditorGUILayout.ObjectField(script.heightmap_tool.preview_texture,Texture,false,GUILayout.Width(script.heightmap_tool.resolution_display.x),GUILayout.Height(script.heightmap_tool.resolution_display.y));
		
		if (tc_script.key.type == EventType.Repaint)
		{
			rect1 = GUILayoutUtility.GetLastRect();
		}
		
		var rect1a: Rect = rect1;
		rect1a.xMax += 20;
		EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,100,17),"Resolution");
		gui_changed_old = GUI.changed;
		GUI.changed = false;
		script.heightmap_tool.output_resolution = EditorGUI.IntField(Rect(rect1a.xMax+100,rect1a.y,80,17),script.heightmap_tool.output_resolution);
		if (GUI.changed)
		{
			if (script.heightmap_tool.output_resolution < 16){script.heightmap_tool.output_resolution = 16;}
			script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
		}
		GUI.changed = gui_changed_old;
		rect1a.y += 20;
		
		EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,160,25),"Path");
       	EditorGUI.LabelField(Rect(rect1a.xMax+100,rect1a.y,script.heightmap_tool.export_path.Length*6.5,25),""+script.heightmap_tool.export_path);
        if (GUI.Button(Rect(100+rect1a.xMax+script.heightmap_tool.export_path.Length*6.5,rect1a.y,65,18),"Change"))
        {
       		var export_path: String = EditorUtility.OpenFolderPanel("Export File Path",script.heightmap_tool.export_path,"");
        	if (export_path != ""){script.heightmap_tool.export_path = export_path;}
		}
		rect1a.y += 20;
		EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,160,17),"Filename");
       	script.heightmap_tool.export_file = EditorGUI.TextField(Rect(rect1a.xMax+100,rect1a.y,250,17),script.heightmap_tool.export_file);
       	
       	rect1a.y += 20;
		EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,160,17),"Save As");
       	script.heightmap_tool.export_mode = EditorGUI.EnumPopup(Rect(rect1a.xMax+100,rect1a.y,250,17),script.heightmap_tool.export_mode);
       	
       	rect1a.y += 20;
       	if (script.heightmap_tool.export_mode == export_mode_enum.Image)
       	{
	       	if (GUI.Button(Rect(rect1a.xMax,rect1a.y,85,18),"Export .Png"))
	       	{
	       		script.create_perlin(script.heightmap_tool.output_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,true);
	       		tc_script.export_texture_to_file(script.heightmap_tool.export_path,script.heightmap_tool.export_file,script.heightmap_tool.output_texture);
	       		AssetDatabase.Refresh();
	       	}
	    }
	    else
	    {
	    	EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,160,17),"Byte Order");
       		script.heightmap_tool.raw_save_file.mode = EditorGUI.EnumPopup(Rect(rect1a.xMax+100,rect1a.y,250,17),script.heightmap_tool.raw_save_file.mode);
       		rect1a.y += 20;
       		if (GUI.Button(Rect(rect1a.xMax,rect1a.y,85,18),"Export .Raw"))
	       	{
	       		script.create_perlin(script.heightmap_tool.output_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Raw,true);
	       		File.WriteAllBytes(script.heightmap_tool.export_path+"/"+script.heightmap_tool.export_file+".raw",script.heightmap_tool.raw_save_file.bytes);
				script.heightmap_tool.raw_save_file.bytes = new byte[0];
	       		AssetDatabase.Refresh();
	       	}
	    }
	       	
       	rect1a.y += 275;
       	var button_size: int = 45;
       	
       	if (GUI.Button(Rect(rect1a.xMax,rect1a.y,button_size,button_size),button7_texture))
       	{
       		if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(-script.heightmap_tool.scroll_offset,script.heightmap_tool.scroll_offset);}
       		else {script.heightmap_tool.perlin.offset += Vector2(-script.heightmap_tool.scroll_offset*3,script.heightmap_tool.scroll_offset*3);}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
       	if (GUI.Button(Rect(rect1a.xMax+button_size,rect1a.y,button_size,button_size),button0_texture))
       	{
			if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(0,script.heightmap_tool.scroll_offset);}
			else {script.heightmap_tool.perlin.offset += Vector2(0,script.heightmap_tool.scroll_offset*3);};
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
    	if (GUI.Button(Rect(rect1a.xMax+(button_size*2),rect1a.y,button_size,button_size),button1_texture))
       	{
       		if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(script.heightmap_tool.scroll_offset,script.heightmap_tool.scroll_offset);}
       		else {script.heightmap_tool.perlin.offset += Vector2(script.heightmap_tool.scroll_offset*3,script.heightmap_tool.scroll_offset*3);}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
    	rect1a.y += button_size;
       	if (GUI.Button(Rect(rect1a.xMax,rect1a.y,button_size,button_size),button6_texture))
       	{
       		if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(-script.heightmap_tool.scroll_offset,0);}
       		else {script.heightmap_tool.perlin.offset += Vector2(-script.heightmap_tool.scroll_offset*3,0);}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
       	// middle button
       	if (script.settings.tooltip_mode != 0)
		{
			tooltip_text = "Reset Position\n(Control Click)\n\nRandomize Position\n(Alt Click)";
		}
       	if (GUI.Button(Rect(rect1a.xMax+button_size,rect1a.y,button_size,button_size),GUIContent(button8_texture,tooltip_text)))
       	{
       		if (key.control){script.heightmap_tool.perlin.offset = script.heightmap_tool.perlin.offset_begin;}
       		if (key.alt){script.heightmap_tool.perlin.offset = Vector2(UnityEngine.Random.Range(0,5000),UnityEngine.Random.Range(0,5000));}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
    	if (GUI.Button(Rect(rect1a.xMax+(button_size*2),rect1a.y,button_size,button_size),button2_texture))
       	{
       		if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(script.heightmap_tool.scroll_offset,0);}
       		else {script.heightmap_tool.perlin.offset += Vector2(script.heightmap_tool.scroll_offset*3,0);}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
    	rect1a.y += button_size;
       	if (GUI.Button(Rect(rect1a.xMax,rect1a.y,button_size,button_size),button5_texture))
       	{
       		if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(-script.heightmap_tool.scroll_offset,-script.heightmap_tool.scroll_offset);}
       		else {script.heightmap_tool.perlin.offset += Vector2(-script.heightmap_tool.scroll_offset*3,-script.heightmap_tool.scroll_offset*3);}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
       	if (GUI.Button(Rect(rect1a.xMax+button_size,rect1a.y,button_size,button_size),button4_texture))
       	{
       		if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(0,-script.heightmap_tool.scroll_offset);}
       		else {script.heightmap_tool.perlin.offset += Vector2(0,-script.heightmap_tool.scroll_offset*2);}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
    	if (GUI.Button(Rect(rect1a.xMax+(button_size*2),rect1a.y,button_size,button_size),button3_texture))
       	{
       		if (!key.shift){script.heightmap_tool.perlin.offset += Vector2(script.heightmap_tool.scroll_offset,-script.heightmap_tool.scroll_offset);}
       		else {script.heightmap_tool.perlin.offset += Vector2(script.heightmap_tool.scroll_offset*3,-script.heightmap_tool.scroll_offset*3);}
       		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
       	}
    	
    	rect1a.y -= button_size*2;
    	rect1a.x += (button_size*3)+10;
    	
    	EditorGUI.LabelField(Rect(rect1a.xMax,rect1a.y,120,17),"Scroll Step");
		script.heightmap_tool.scroll_offset = EditorGUI.FloatField(Rect(rect1a.xMax+130,rect1a.y,80,17),script.heightmap_tool.scroll_offset);
		
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Zoom",GUILayout.Width(140));
		gui_changed_old = GUI.changed;
		GUI.changed = false;
		script.heightmap_tool.perlin.frequency = EditorGUILayout.Slider(script.heightmap_tool.perlin.frequency,0.0001,16384);
		EditorGUILayout.EndHorizontal();

		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Detail",GUILayout.Width(140));
		script.heightmap_tool.perlin.octaves = EditorGUILayout.Slider(script.heightmap_tool.perlin.octaves,1,16);
		EditorGUILayout.EndHorizontal();	
		
		/*
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Power Strength",GUILayout.Width(140));
		script.heightmap_tool.pow_strength = EditorGUILayout.Slider(script.heightmap_tool.pow_strength,1,16);
		EditorGUILayout.EndHorizontal();	
		*/
		
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Height",GUILayout.Width(140));
		script.heightmap_tool.perlin.precurve.curve = EditorGUILayout.CurveField(script.heightmap_tool.perlin.precurve.curve);
		if (GUILayout.Button(script.heightmap_tool.perlin.precurve.curve_text,GUILayout.Width(63)))
		{
			tc_script.curve_menu_button(script.heightmap_tool.perlin.precurve,0,script.heightmap_tool.perlin.curve_menu_rect);
			script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
		}
		if (key.type == EventType.Repaint){script.heightmap_tool.perlin.curve_menu_rect = GUILayoutUtility.GetLastRect();}
		EditorGUILayout.EndHorizontal();		
		
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Position X",GUILayout.Width(140));
		script.heightmap_tool.perlin.offset.x = EditorGUILayout.FloatField(script.heightmap_tool.perlin.offset.x);
		EditorGUILayout.EndHorizontal();		
		
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Position Y",GUILayout.Width(140));
		script.heightmap_tool.perlin.offset.y = EditorGUILayout.FloatField(script.heightmap_tool.perlin.offset.y);
		EditorGUILayout.EndHorizontal();		
		
		if (GUI.changed)
		{
			script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
		}
		GUI.changed = gui_changed_old;
	}
	
	function pattern_first_init()
	{
		if (script.pattern_tool.output_texture == null)
		{
			script.pattern_tool.output_texture = new Texture2D(script.pattern_tool.output_resolution.x,script.pattern_tool.output_resolution.y,TextureFormat.RGB24,false);
		}
		if (script.pattern_tool.export_path.Length == 0)
		{
			script.pattern_tool.export_path = Application.dataPath;
        	script.pattern_tool.first = true;
        }
	}
	
	function heightmap_first_init()
	{
		if (script.heightmap_tool.preview_texture == null)
		{
			script.heightmap_tool.preview_texture = new Texture2D(script.heightmap_tool.preview_resolution,script.heightmap_tool.preview_resolution,TextureFormat.RGB24,false);
		}
		if (script.heightmap_tool.output_texture == null)
		{
			script.heightmap_tool.output_texture = new Texture2D(1,1,TextureFormat.RGB24,false);
		}
		if (script.heightmap_tool.export_path.Length == 0)
		{
			script.heightmap_tool.export_path = Application.dataPath;
		}
		script.create_perlin(script.heightmap_tool.preview_resolution,script.heightmap_tool.output_resolution,export_mode_enum.Image,false);
	}
	
	function Update()
	{
		if (!script){return;}
		if (pattern_generate)
		{
			if (script.generate_pattern())
			{
				pattern_generate = false;
				script.pattern_tool.output_texture.Apply();
			}
			this.Repaint();
		}
	}
}