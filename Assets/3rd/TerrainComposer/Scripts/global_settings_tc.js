#pragma strict
import System.Collections.Generic;
import System.IO;

var tc_script_id: int;
var tc_installed: boolean = false;
var check_image: Texture2D;
var examples: String[] = ["Procedural Mountains","Procedural Canyons","Procedural Plateaus","Procedural Islands","Island Example"];

var layer_count: boolean = true;
var placed_count: boolean = true;
var display_project: boolean = true;
var tabs: boolean = true;

var color_scheme: boolean = true;
var color_layout: color_settings_class = new color_settings_class();
var color_layout_converted: boolean = false; 
var box_scheme: boolean = false;
var display_color_curves: boolean = false;
var display_mix_curves: boolean = true;
var filter_select_text: boolean = true;

var install_path: String;
var install_path_full: String;

var object_fast: boolean = true;
var preview_texture: boolean = true;
var preview_texture_buffer: int = 100;
var preview_colors: boolean = true;
var preview_texture_resolution: int = 128; 
var preview_texture_resolution1: int = 128;
var preview_quick_resolution_min: int = 16;
var preview_splat_brightness: float = 1;
var preview_texture_dock: boolean = true;

var preview_target_frame: int = 30;
var splat_colors: List.<Color> = new List.<Color>();
var splat_custom_texture_resolution: int = 128; 
var splat_custom_texture_resolution1: int = 128;
var tree_colors: List.<Color> = new List.<Color>();
var grass_colors: List.<Color> = new List.<Color>();
var object_colors: List.<Color> = new List.<Color>();

var toggle_text_no: boolean = false;
var toggle_text_short: boolean = true;
var toggle_text_long: boolean = false;
var tooltip_text_no: boolean = false;
var tooltip_text_short: boolean = false;
var tooltip_text_long: boolean = true;
var tooltip_mode: int = 2;

var video_help: boolean = true;

var run_in_background: boolean = true;
var display_bar_auto_generate: boolean = true;

var unload_textures: boolean = false;
var clean_memory: boolean = false;

var auto_speed: boolean = true;
var target_frame: int = 40;

var auto_save: boolean = true;
var auto_save_tc_instances: int = 2;
var auto_save_scene_instances: int = 2;
var auto_save_tc: boolean = true; 
var auto_save_tc_list: List.<String> = new List.<String>(); 
var auto_save_scene: boolean = true;
var auto_save_scene_list: List.<String> = new List.<String>();
var auto_save_timer: float = 10;
var auto_save_time_start: float;
var auto_save_on_play: boolean = true;
var auto_save_path: String;

var terrain_tiles_max: int = 15;

var auto_search_list: List.<auto_search_class> = new List.<auto_search_class>();

var map: map_class = new map_class();

enum map_type_enum {Aerial,AerialWithLabels,Road}
enum condition_output_enum {add = 0,subtract = 1,change = 2,multiply = 3,divide = 4,difference = 5,average = 6,max = 7,min = 8}
enum image_output_enum {add = 0,subtract = 1,change = 2,multiply = 3,divide = 4,difference = 5,average = 6,max = 7,min = 8,content = 9}

var tex1: Texture2D;
var tex2: Texture2D;
var tex3: Texture2D;
var tex4: Texture2D;

var select_window: select_window_class = new select_window_class(); 

var preview_window: List.<int> = new List.<int>();
var PI: float = Mathf.PI;

var map0: Texture2D;
var map1: Texture2D;
var map2: Texture2D;
var map3: Texture2D;
var map4: Texture2D;
var map5: Texture2D;
var map_combine: boolean = false;
var map_load: boolean = false;
var map_load2: boolean = false;
var map_load3: boolean = false;
var map_load4: boolean = false;
var map_zoom1: int;
var map_zoom2: int;
var map_zoom3: int;
var map_zoom4: int;

var map_latlong: latlong_class = new latlong_class();

var map_latlong_center: latlong_class = new latlong_class();

var map_zoom: int = 17;
var map_zoom_old: int;

var settings: global_settings_class = new global_settings_class();

enum raw_mode_enum{Windows,Mac}
enum resolution_mode_enum{Automatic,Heightmap,Splatmap,Tree,Detailmap,Object,Units,Custom,Colormap}

#if UNITY_EDITOR
function drawGUIBox(rect: Rect,text: String,backgroundColor: Color,highlightColor: Color,textColor: Color)
{
	GUI.color = Color(1,1,1,map.alpha);
	
	GUI.color = Color(1,1,1,backgroundColor.a);
	EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y+19,rect.width,rect.height-19),tex2);
	// GUI.color = highlightColor;
	GUI.color = Color(1,1,1,highlightColor.a);
	EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,19),tex3);
	
	GUI.color = textColor;
	EditorGUI.LabelField(Rect(rect.x,rect.y+1,rect.width,19),text,EditorStyles.boldLabel);
	GUI.color = Color.white;
	// gui_y += rect.height+2;
	// gui_height = 0;
}
#endif

function drawText(text: String,pos: Vector2,background: boolean,color: Color,backgroundColor: Color,rotation: float,fontSize: float,bold: boolean,mode: int): Vector2
{
	// mode
	// 1 -> allign leftTop
	// 2- > allign centerBottom
	// 3- > alling rightBottom
	// 4- > allign center
	// 5- > allign rightTop
	// 6 -> allign leftBottom
	
	var m1: Matrix4x4 = Matrix4x4.identity; 
	var m2: Matrix4x4 = Matrix4x4.identity;
	
	var old_fontSize: int = GUI.skin.label.fontSize;
	var old_fontStyle: FontStyle = GUI.skin.label.fontStyle;
	var color_old: Color = GUI.color;
 	
	GUI.skin.label.fontSize = fontSize;
	if (bold){GUI.skin.label.fontStyle = FontStyle.Bold;}
	 else {GUI.skin.label.fontStyle = FontStyle.Normal;}
	
	var size: Vector2 =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
	
	m2.SetTRS(Vector3(pos.x,pos.y,0),Quaternion.Euler(0,0,rotation),Vector3.one);
    
	switch (mode)
	{
	    case 1: 
	    	GUI.matrix = m2;
	    	break;
	    case 2:        
			m1.SetTRS(Vector3(-size.x/2,-size.y,0),Quaternion.identity,Vector3.one);
			GUI.matrix = m2*m1;
			break;
		case 3:	
			m1.SetTRS(Vector3(0,-size.y,0),Quaternion.identity,Vector3.one);
			GUI.matrix = m2*m1;
			break;
		case 4:        
			m1.SetTRS(Vector3(-size.x/2,-size.y/2,0),Quaternion.identity,Vector3.one);
			GUI.matrix = m2*m1;
			break;
		case 5: 
	    	m1.SetTRS(Vector3(-size.x,0,0),Quaternion.identity,Vector3.one);
	    	GUI.matrix = m2*m1;
	    	break;
	    case 6: 
	    	m1.SetTRS(Vector3(-size.x,-size.y,0),Quaternion.identity,Vector3.one);
	    	GUI.matrix = m2*m1;
	    	break;
	}
	 
 	if (background)
	{ 
		GUI.color = backgroundColor;
		#if UNITY_EDITOR
		if (!tex4) {tex4 = new Texture2D(1,1);}
		EditorGUI.DrawPreviewTexture(Rect(0,0,size.x,size.y),tex4);
		#endif
	}
 	
 	GUI.color = color;
	GUI.Label(new Rect(0,0,size.x,size.y),text);
	
	GUI.skin.label.fontSize = old_fontSize;
	GUI.skin.label.fontStyle = old_fontStyle;
	GUI.color = color_old;	 
	GUI.matrix = Matrix4x4.identity;
	
	return size;
}

function drawText(rect: Rect,edit: edit_class,background: boolean,color: Color,backgroundColor: Color,fontSize: float,bold: boolean,mode: int): boolean
{
	// mode
	// 1 -> allign leftTop
	// 2- > allign centerBottom
	// 3- > alling leftBottom
	// 4- > allign center
	// 5- > allign rightTop
	// 6- > allign centerTop
	
	var pos: Vector2;
	
	var old_fontSize: int; 
	var old_fontStyle: FontStyle;
	var color_old: Color = GUI.color;
 	
	var size: Vector2; 
	
	if (background)
	{ 
		GUI.color = backgroundColor;
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(pos.x,pos.y,size.x,size.y),tex2);
		#endif
	}
 	
 	GUI.color = color;
 	
 	if (!edit.edit) {
 		old_fontSize = GUI.skin.label.fontSize;
		old_fontStyle = GUI.skin.label.fontStyle;
		
 		GUI.skin.label.fontSize = fontSize;
		
		if (bold){GUI.skin.label.fontStyle = FontStyle.Bold;}
			else {GUI.skin.label.fontStyle = FontStyle.Normal;}
		
		size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(edit.default_text));
		
		pos = calc_rect_allign(rect,size,mode);
		
		GUI.Label(new Rect(pos.x,pos.y,size.x,size.y),edit.default_text);
		
		GUI.skin.label.fontSize = old_fontSize;
		GUI.skin.label.fontStyle = old_fontStyle;
	}
	else {
		old_fontSize = GUI.skin.textField.fontSize;
		old_fontStyle = GUI.skin.textField.fontStyle;
		
		GUI.skin.textField.fontSize = fontSize;
		
		if (bold){GUI.skin.textField.fontStyle = FontStyle.Bold;}
			else {GUI.skin.textField.fontStyle = FontStyle.Normal;}
		
		size =  GUI.skin.GetStyle("TextField").CalcSize(GUIContent(edit.text));
		if (size.x < rect.width){size.x = rect.width;}
		size.x += 10;
		
		pos = calc_rect_allign(rect,size,mode);
		edit.text = GUI.TextField(new Rect(pos.x,pos.y,size.x,size.y),edit.text);
		
		GUI.skin.textField.fontSize = old_fontSize;
		GUI.skin.textField.fontStyle = old_fontStyle;
	}
	
	if (Event.current.button == 0 && Event.current.clickCount == 2 && Event.current.type == EventType.MouseDown) {
		if (Rect(pos.x,pos.y,size.x,size.y).Contains(Event.current.mousePosition)) {
			edit.edit = !edit.edit;
		}
	}
	
	if (Event.current.keyCode == KeyCode.Return || Event.current.keyCode == KeyCode.Escape){
		edit.edit = false;
		GUI.color = color_old;
		return true;
	}
	
	GUI.color = color_old;	 
	return false;
}

function drawText(rect: Rect,text: String,background: boolean,color: Color,backgroundColor: Color,fontSize: float,bold: boolean,mode: int)
{
	// mode
	// 1 -> allign leftTop
	// 2- > allign centerBottom
	// 3- > alling leftBottom
	// 4- > allign center
	// 5- > allign rightTop
	// 6- > allign centerTop
	
	var pos: Vector2;
	
	var old_fontSize: int = GUI.skin.label.fontSize; 
	var old_fontStyle: FontStyle = GUI.skin.label.fontStyle;
	var color_old: Color = GUI.color;
 	
	var size: Vector2; 
	
	if (background)
	{ 
		GUI.color = backgroundColor;
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(pos.x,pos.y,size.x,size.y),tex2);
		#endif
	}
 	
 	GUI.color = color;
 	
	GUI.skin.label.fontSize = fontSize;
	
	if (bold){GUI.skin.label.fontStyle = FontStyle.Bold;}
		else {GUI.skin.label.fontStyle = FontStyle.Normal;}
	
	size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
	
	pos = calc_rect_allign(rect,size,mode);
	
	GUI.Label(new Rect(pos.x,pos.y,size.x,size.y),text);
	
	GUI.skin.label.fontSize = old_fontSize;
	GUI.skin.label.fontStyle = old_fontStyle;
	
	GUI.color = color_old;	 
}

function calc_rect_allign(rect: Rect,size: Vector2,mode: int): Vector2
{
	var pos: Vector2;
	
	switch (mode)
	{
	    case 1: 
	    	pos.x = rect.x;
	    	pos.y = rect.y;
	    	break;
	    case 2:        
	    	pos.x = rect.x+(rect.width/2)-(size.x/2);
	    	pos.y = rect.yMax;
			break;
		case 3:	
			pos.x = rect.x;
			pos.y = rect.yMax;
			break;
		case 4:        
			pos.x = rect.x+(rect.width/2)-(size.x/2);
			pos.y = rect.y+(rect.height/2)-(size.y/2);
			break;
		case 5: 
			pos.x = rect.xMax-size.x;
			pos.y = rect.y;
	    	break;
	    case 6: 
	    	pos.x = rect.x+(rect.width/2)-(size.x/2);
	    	pos.y = rect.y-size.y;
	    	break;
	}
	
	return pos;
}

function drawGUIBox(rect: Rect,edit: edit_class,fontSize: float,label2: boolean,labelHeight: float,backgroundColor: Color,highlightColor: Color,highlightColor2: Color,textColor: Color,border: boolean,width: int,screen: Rect,select: boolean,select_color: Color,active: boolean): boolean
{
	if (!select) {
		highlightColor += Color(-0.3,-0.3,-0.3);
		highlightColor2 += Color(-0.3,-0.3,-0.3);
	}
	
	// GUI.color = backgroundColor;
	// EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,rect.height),tex1);
	GUI.color = highlightColor;
	#if UNITY_EDITOR
	EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,labelHeight),tex2);
	#endif
	
	var repaint: boolean = drawText(rect,edit,false,textColor,Color(0.1,0.1,0.1,1),fontSize,true,6);
	
	if (label2) {
		GUI.color = highlightColor2;
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.yMax-labelHeight,rect.width,labelHeight),tex2);
		#endif
		GUI.color = Color.white;
		
		if (!active) {
			Drawing_tc1.DrawLine(Vector2(rect.x+1,rect.y+labelHeight+1),Vector2(rect.xMax-1,rect.yMax-labelHeight-1),Color(1,0,0,0.7),3,false,screen);
			Drawing_tc1.DrawLine(Vector2(rect.x+1,rect.yMax-labelHeight-1),Vector2(rect.xMax-1,rect.y+labelHeight+1),Color(1,0,0,0.7),3,false,screen);
		}
	} 
	else if (!active) {
		Drawing_tc1.DrawLine(Vector2(rect.x+1,rect.y+labelHeight+1),Vector2(rect.xMax-1,rect.yMax-1),Color(1,0,0,0.7),3,false,screen);
		Drawing_tc1.DrawLine(Vector2(rect.x+1,rect.yMax-1),Vector2(rect.xMax-1,rect.y+labelHeight+1),Color(1,0,0,0.7),3,false,screen);
	}
	
	if (border) {
		DrawRect(rect,highlightColor,width,screen);
		Drawing_tc1.DrawLine(Vector2(rect.x,rect.y+labelHeight),Vector2(rect.xMax,rect.y+labelHeight),highlightColor,width,false,screen);
		if (label2) {Drawing_tc1.DrawLine(Vector2(rect.x,rect.yMax-labelHeight),Vector2(rect.xMax,rect.yMax-labelHeight),highlightColor,width,false,screen);}
		//Drawing_tc1.DrawLine(Vector2(rect.x,rect.yMax),Vector2(rect.xMax,rect.yMax),highlightColor,width,false,screen);
		//Drawing_tc1.DrawLine(Vector2(rect.xMax-1,rect.y),Vector2(rect.xMax-1,rect.yMax),highlightColor,width,false,screen);
	}
	
	GUI.color = Color.white;
	
	return repaint;
}

function drawJoinNode(rect: Rect,length: int,text: String,fontSize: float,label2: boolean,labelHeight: float,backgroundColor: Color,highlightColor: Color,highlightColor2: Color,textColor: Color,border: boolean,width: int,screen: Rect,select: boolean,select_color: Color,active: boolean)
{
	if (!select) {
		highlightColor += Color(-0.3,-0.3,-0.3);
		highlightColor2 += Color(-0.3,-0.3,-0.3);
	}
	
		// GUI.color = backgroundColor;
	// EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,rect.height),tex1);
	GUI.color = highlightColor;
	var count: int = 0;
	
	for (count = 0;count < length;++count) {
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y+(count*select_window.node_zoom),rect.width,labelHeight),tex2);
		#endif
	}
	
	for (count = 0;count < length;++count) {
		if (count < length-1) {Drawing_tc1.DrawLine(Vector2(rect.x,rect.y+((count+1)*select_window.node_zoom)),Vector2(rect.xMax,rect.y+((count+1)*select_window.node_zoom)),highlightColor,width,false,screen);}
	}
	
	drawText(rect,text,false,textColor,Color(0.1,0.1,0.1,1),fontSize,true,6);
	
	if (border) {
		DrawRect(Rect(rect.x,rect.y,rect.width,length*select_window.node_zoom),highlightColor,width,screen);
		//Drawing_tc1.DrawLine(Vector2(rect.x,rect.yMax),Vector2(rect.xMax,rect.yMax),highlightColor,width,false,screen);
		//Drawing_tc1.DrawLine(Vector2(rect.xMax-1,rect.y),Vector2(rect.xMax-1,rect.yMax),highlightColor,width,false,screen);
	}
	
	GUI.color = Color.white;
}

function get_label_width(text: String, bold: boolean): int
{
	var size: Vector2;
	
	if (bold) {
		var old_fontStyle: FontStyle = GUI.skin.label.fontStyle;
		GUI.skin.label.fontStyle = FontStyle.Bold;
		
		size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
		GUI.skin.label.fontStyle = old_fontStyle;
	}
	else {
		size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
	}
	return size.x;
}

function DrawRect(rect: Rect,color: Color,width: float,screen: Rect)
{
	/*
	var xmin0: boolean = false;
	var ymin0: boolean = false;
	var xmax0: boolean = false;
	var ymax0: boolean = false;
	
	var xmin1: boolean = false;
	var ymin1: boolean = false;
	var xmax1: boolean = false;
	var ymax1: boolean = false;
	
	if (rect.xMin < 0){rect.xMin = 0;xmin0 = true;}
	else if (rect.xMin > screen_resolution.x){rect.xMin = screen_resolution.x;xmin1 = true;}
	if (rect.yMin < 0){rect.yMin = 0;ymin0 = true;}
	else if (rect.yMin > screen_resolution.y){rect.yMin = screen_resolution.y;ymin1 = true;}
	if (rect.xMax < 0){rect.xMax = 0;xmax0 = true;}
	else if (rect.xMax > screen_resolution.x){rect.xMax = screen_resolution.x;xmax1 = true;}
	if (rect.yMax < 0){rect.yMax = 0;ymax0 = true;}
	else if (rect.yMax > screen_resolution.y){rect.yMax = screen_resolution.y;ymax1 = true;}
	
	if ((xmin0 && xmax0) || (xmin1 && xmax1)){return;}
	if ((ymin0 && ymax0) || (ymin1 && ymin1)){return;}
	
	if (!ymin0){Drawing_tc1.DrawLine(Vector2(rect.x,rect.y),Vector2(rect.xMax,rect.y),color,width,false,Rect(0,0,screen.width,screen.height));}
	if (!xmin0){Drawing_tc1.DrawLine(Vector2(rect.x,rect.y),Vector2(rect.x,rect.yMax),color,width,false,Rect(0,0,screen.width,screen.height));}
	if (!ymax1){Drawing_tc1.DrawLine(Vector2(rect.x,rect.yMax),Vector2(rect.xMax,rect.yMax),color,width,false,Rect(0,0,screen.width,screen.height));}
	if (!xmax1){Drawing_tc1.DrawLine(Vector2(rect.xMax,rect.y),Vector2(rect.xMax,rect.yMax),color,width,false,Rect(0,0,screen.width,screen.height));}
	*/
	
	// Drawing_tc1.DrawBox(rect,color,width);
	
	Drawing_tc1.DrawLine(Vector2(rect.xMin,rect.yMin),Vector2(rect.xMax,rect.yMin),color,width,false,screen);
	Drawing_tc1.DrawLine(Vector2(rect.xMin,rect.yMin),Vector2(rect.xMin,rect.yMax),color,width,false,screen);
	Drawing_tc1.DrawLine(Vector2(rect.xMin,rect.yMax),Vector2(rect.xMax,rect.yMax),color,width,false,screen);
	Drawing_tc1.DrawLine(Vector2(rect.xMax,rect.yMin),Vector2(rect.xMax,rect.yMax),color,width,false,screen);
	
}

function draw_arrow(point1: Vector2,length: int,length_arrow: int,rotation: float,color: Color,width: int,screen: Rect)
{
	length_arrow = Mathf.Sqrt(2.0)*length_arrow;
	
	var point2: Vector2 = calc_rotation_pixel(point1.x,point1.y-length,point1.x,point1.y,rotation);
	var point3: Vector2 = calc_rotation_pixel(point2.x-length_arrow,point2.y-length_arrow,point2.x,point2.y,-180+rotation);
	var point4: Vector2 = calc_rotation_pixel(point2.x+length_arrow,point2.y-length_arrow,point2.x,point2.y,180+rotation);
	
	Drawing_tc1.DrawLine(point1,point2,color,width,false,screen);
	Drawing_tc1.DrawLine(point2,point3,color,width,false,screen);
	Drawing_tc1.DrawLine(point2,point4,color,width,false,screen);
}

function draw_latlong_raster(latlong1: latlong_class,latlong2: latlong_class,offset: Vector2,zoom: double,current_zoom: double,resolution: int,screen: Rect,color: Color,width: int): boolean
{
	var rounded: boolean = true;
	
	var p1: Vector2 = latlong_to_pixel(latlong1,map_latlong_center,current_zoom,Vector2(screen.width,screen.height));
	var p2: Vector2 = latlong_to_pixel(latlong2,map_latlong_center,current_zoom,Vector2(screen.width,screen.height));
	
	var pixel_resolution: Vector2 = p2-p1;
	
	p1 += Vector2(-offset.x,offset.y);
	p2 += Vector2(-offset.x,offset.y);
	
	// p1 -= screen_resolution/2;
	// p2 -= screen_resolution/2;
	
	var delta_zoom: double = Mathf.Pow(2,zoom-current_zoom);
	
	var step: float = resolution/delta_zoom;
	
	if (Mathf.Abs(Mathf.Round(pixel_resolution.x/step)-(pixel_resolution.x/step)) > 0.01 || Mathf.Abs(Mathf.Round(pixel_resolution.y/step)-(pixel_resolution.y/step)) > 0.01 ) {
		rounded = false;
		color = Color.red; 
	}
	
	for (var x: float = p1.x;x < (p1.x+pixel_resolution.x);x += step)
	{
		Drawing_tc1.DrawLine(Vector2(x,p1.y),Vector2(x,p2.y),color,width,false,screen);
	}
	for (var y: float = p1.y;y < (p1.y+pixel_resolution.y);y += step)
	{
		Drawing_tc1.DrawLine(Vector2(p1.x,y),Vector2(p2.x,y),color,width,false,screen);	
	}
	
	return rounded;
}

function draw_grid(rect: Rect,tile_x: int,tile_y: int,color: Color,width: int,screen: Rect)
{
	var step: Vector2;
	step.x = rect.width/tile_x;
	step.y = rect.height/tile_y; 
	
	for (var x: float = rect.x;x <= rect.xMax+step.x/2;x += step.x)
	{
		Drawing_tc1.DrawLine(Vector2(x,rect.y),Vector2(x,rect.yMax),color,width,false,screen);
	}
	for (var y: float = rect.y;y <= rect.yMax+step.y/2;y += step.y)
	{
		Drawing_tc1.DrawLine(Vector2(rect.x,y),Vector2(rect.xMax,y),color,width,false,screen);	
	}
}

function draw_scale_grid(rect: Rect,offset: Vector2,zoom: float,scale: float,color: Color,width: int,draw_center: boolean,screen: Rect)
{
	var step: float;
	
	step = zoom;
	
	var center: Vector2 = (Vector2(screen.width,screen.height)/2)+offset;
	
	var start: Vector2;
	var end: Vector2;
	
	var delta_x: float = center.x-rect.x;
	var delta_y: float = center.y-rect.y;
	
	var r_x: int = delta_x/step;
	
	r_x = delta_x-(r_x*step);
	r_x += rect.x;
	
	// if (r_x < rect.x){r_x += step;} 
	var count: int = calc_rest_value(((center.x-r_x)/step),10);
	
	if (count < 0){count = -9-count;} else {count = 9-count;}
	
	var count2: int = -((center.x-r_x)/step)+(9-count);
	
	var r_y: int = delta_y/step;
	r_y = delta_y-(r_y*step); 
	r_y += rect.y;
	// if (r_y < rect.y){r_y += step;}
	
	
	for (var x: float = r_x;x <= rect.xMax;x += step)
	{
		Drawing_tc1.DrawLine(Vector2(x,rect.y),Vector2(x,rect.yMax),color,width,false,screen); 
		if (count > 9){count = 0;}
		// if (count == 0){GUI.Label(Rect(x,center.y,100,40),count2.ToString()+"km");count = 0;count2 += 10;}
		++count;
	}
	count = 0;
	count2 = 0;
	for (var y: float = r_y;y <= rect.yMax;y += step)
	{
		Drawing_tc1.DrawLine(Vector2(rect.x,y),Vector2(rect.xMax,y),color,width,false,screen);	
	}
	
	// draw center
	if (draw_center) {
		Drawing_tc1.DrawLine(Vector2(center.x,rect.y),Vector2(center.x,rect.yMax),color,width+2,false,screen);
		Drawing_tc1.DrawLine(Vector2(rect.x,center.y),Vector2(rect.xMax,center.y),color,width+2,false,screen);	
	}
}

function calc_rotation_pixel(x: float,y: float,xx: float, yy: float,rotation: float): Vector2
{
	var delta: Vector2 = Vector2(x-xx,y-yy);
	var length: float = delta.magnitude;
	
	if (length != 0)
	{
		delta.x /= length;
		delta.y /= length;
	}
	
	var rad: float = Mathf.Acos(delta.x);
	
	if (delta.y < 0){rad = (PI*2)-rad;}
	
	rad -= (rotation*Mathf.Deg2Rad);
	
	delta.x = (Mathf.Cos(rad)*length)+xx;
	delta.y = (Mathf.Sin(rad)*length)+yy;
	
	return delta;
}

var minLatitude: double = -85.05112878;
var maxLatitude: double = 85.05112878;
var minLongitude: double = -180;
var maxLongitude: double = 180;

function clip(n: double,minValue: double,maxValue: double): double
{
	return calcMin(calcMax(n,minValue),maxValue);
}

function clip_latlong(latlong: latlong_class): latlong_class
{
	if (latlong.latitude > maxLatitude){latlong.latitude -= (maxLatitude*2);}
	else if (latlong.latitude < minLatitude){latlong.latitude += (maxLatitude*2);}
	if (latlong.longitude > 180){latlong.longitude -= 360;}
	else if (latlong.longitude < -180){latlong.longitude += 360;}
	
	return latlong;
}

function clip_pixel(map_pixel: map_pixel_class,zoom: double): map_pixel_class
{
	var mapSize: double = 256*Mathf.Pow(2,zoom);
	
	if (map_pixel.x > mapSize-1){map_pixel.x -= mapSize-1;}
	else if (map_pixel.x < 0){map_pixel.x = mapSize-1-map_pixel.x;}
	
	if (map_pixel.y > mapSize-1){map_pixel.y -= mapSize-1;}
	else if (map_pixel.y < 0){map_pixel.y = mapSize-1-map_pixel.y;}
	
	return map_pixel;
}

function calcMin(a: double,b: double): double
{
	if (a < b){return a;} else {return b;}
}

function calcMax(a: double,b: double): double
{
	if (a > b){return a;} else {return b;}
}

function mapSize(zoom: int): int
{
	return (Mathf.Pow(2,zoom)*256);
}

function latlong_to_pixel(latlong: latlong_class,latlong_center: latlong_class,zoom: double,screen_resolution: Vector2): Vector2
{
	latlong = clip_latlong(latlong);
	latlong_center = clip_latlong(latlong_center);
	
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
		
	var x: double = (latlong.longitude+180)/360;
	var sinLatitude: double = Mathf.Sin(latlong.latitude*pi/180);
	var y: double = 0.5 - Mathf.Log((1+sinLatitude)/(1-sinLatitude))/(4*pi);
	
	var pixel: Vector2 = Vector2(x,y);
	
	x = (latlong_center.longitude+180)/360;
	sinLatitude = Mathf.Sin(latlong_center.latitude*pi/180);
	y = 0.5 - Mathf.Log((1+sinLatitude)/(1-sinLatitude))/(4*pi);
	
	var pixel2: Vector2 = Vector2(x,y);
	
	var pixel3: Vector2 = pixel-pixel2;
	 
	    
	pixel3 *= 256*Mathf.Pow(2,zoom);
	
	pixel3 += screen_resolution/2;
	
	return pixel3;
}	

function latlong_to_pixel2(latlong: latlong_class,zoom: double): map_pixel_class
{
	latlong = clip_latlong(latlong);
	
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
		
	var x: double = (latlong.longitude+180.0)/360.0;
	var sinLatitude: double = Mathf.Sin(latlong.latitude*pi/180.0);
	var y: double = 0.5 - Mathf.Log((1.0+sinLatitude)/(1.0-sinLatitude))/(4.0*pi);
	
	x *= 256.0*Mathf.Pow(2.0,zoom);
	y *= 256.0*Mathf.Pow(2.0,zoom);
	
	var map_pixel: map_pixel_class = new map_pixel_class();
	
	map_pixel.x = x;
	map_pixel.y = y;
	
	return map_pixel;
}	

function pixel_to_latlong2(map_pixel: map_pixel_class,zoom: double): latlong_class
{
	map_pixel = clip_pixel(map_pixel,zoom);
	
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var mapSize: double = 256.0*Mathf.Pow(2.0,zoom);
	
	var x: double = (map_pixel.x/mapSize)-0.5;
	var y: double = 0.5-(map_pixel.y/mapSize);
	
	var latlong: latlong_class = new latlong_class();
	
	latlong.latitude = 90.0 - 360.0*Mathf.Atan(Mathf.Exp(-y*2.0*pi))/pi;
	latlong.longitude = 360.0*x;
	
	return latlong;
}

function pixel_to_latlong(offset: Vector2,latlong_center: latlong_class,zoom: double): latlong_class 
{
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var mapSize: double = 256*Mathf.Pow(2,zoom);
	
	var map_pixel_center: map_pixel_class = latlong_to_pixel2(latlong_center,zoom);
	
	var map_pixel: map_pixel_class = new map_pixel_class();
	
	map_pixel.x = map_pixel_center.x + offset.x;
	map_pixel.y = map_pixel_center.y + offset.y;
	
	var x: double = (map_pixel.x/mapSize)-0.5;
	var y: double = 0.5-(map_pixel.y/mapSize);
	
	var latlong: latlong_class = new latlong_class();
	
	latlong.latitude = 90 - 360*Mathf.Atan(Mathf.Exp(-y*2*pi))/pi;
	latlong.longitude = 360*x;
	
	latlong = clip_latlong(latlong);
	return latlong;
}

function calc_latlong_area_size(latlong1: latlong_class,latlong2: latlong_class,latlong_center: latlong_class): map_pixel_class
{
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong1,19);
	var map_p2: map_pixel_class = latlong_to_pixel2(latlong2,19);
	
	var map_resolution: double = 156543.04*Mathf.Cos(latlong_center.latitude*(pi/180))/(Mathf.Pow(2,19));
	
	var size: map_pixel_class = new map_pixel_class();
	size.x = (map_p2.x-map_p1.x)*map_resolution;
	size.y = (map_p2.y-map_p1.y)*map_resolution;
	
	return size;
}

function calc_latlong_area_resolution(latlong: latlong_class,zoom: double): double
{
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	
	var map_resolution: double = 156543.04*Mathf.Cos(latlong.latitude*(pi/180))/(Mathf.Pow(2,zoom));
	
	return map_resolution;
}

function calc_latlong_area_rounded(latlong1: latlong_class,latlong2: latlong_class,zoom: double,resolution: int,square: boolean,mode: int): latlong_area_class
{
	// mode
	// 1 -> left vertical
	// 2 -> right vertical
	// 3 -> top horizontal
	// 4 -> bottom horizontal
	// 5 -> top left 
	// 6 -> top right
	// 7 -> bottom left
	// 8 -> bottom right
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong1,zoom);
	var map_p2: map_pixel_class = latlong_to_pixel2(latlong2,zoom);
	
	var size: map_pixel_class = new map_pixel_class();
	size.x = Mathf.Round((map_p2.x-map_p1.x)/resolution)*resolution;
	if (square){size.y = size.x;}else {size.y = Mathf.Round((map_p2.y-map_p1.y)/resolution)*resolution;}
	
	
	switch (mode)
	{
		case 1: 
			if (map_p1.x > map_p2.x-resolution){map_p1.x = map_p2.x-resolution;} else {map_p1.x = map_p2.x-size.x;}
			break;
		case 2:
			if (map_p2.x < map_p1.x+resolution){map_p2.x = map_p1.x+resolution;} else {map_p2.x = map_p1.x+size.x;}
			break;
		case 3:
			if (map_p1.y > map_p2.y-resolution){map_p1.y = map_p2.y-resolution;} else {map_p1.y = map_p2.y-size.y;}
			break;
		case 4: 
			if (map_p2.y < map_p1.y+resolution){map_p2.y = map_p1.y+resolution;} else {map_p2.y = map_p1.y+size.y;}
			break;
		case 5: 
			if (map_p1.x > map_p2.x-resolution){map_p1.x = map_p2.x-resolution;} else {map_p1.x = map_p2.x-size.x;}
			if (map_p1.y > map_p2.y-resolution){map_p1.y = map_p2.y-resolution;} else {map_p1.y = map_p2.y-size.y;}
			break;
		case 6:		
			if (map_p2.x < map_p1.x+resolution){map_p2.x = map_p1.x+resolution;} else {map_p2.x = map_p1.x+size.x;}
			if (map_p1.y > map_p2.y-resolution){map_p1.y = map_p2.y-resolution;} else {map_p1.y = map_p2.y-size.y;}
			break;
		case 7:
			if (map_p1.x > map_p2.x-resolution){map_p1.x = map_p2.x-resolution;} else {map_p1.x = map_p2.x-size.x;}
			if (map_p2.y < map_p1.y+resolution){map_p2.y = map_p1.y+resolution;} else {map_p2.y = map_p1.y+size.y;}
			break;
		case 8:
			if (map_p2.x-resolution < map_p1.x){map_p2.x = map_p1.x+resolution;} else {map_p2.x = map_p1.x+size.x;}
			if (map_p2.y-resolution < map_p1.y){map_p2.y = map_p1.y+resolution;} else {map_p2.y = map_p1.y+size.y;}
			break;
	} 
	
	var area: latlong_area_class = new latlong_area_class();
	
	area.latlong1 = pixel_to_latlong2(map_p1,zoom);
	area.latlong2 = pixel_to_latlong2(map_p2,zoom);
	
	return area;
}

function calc_latlong_area_tiles(latlong1: latlong_class,latlong2: latlong_class,zoom: double,resolution: int): tile_class
{
	var tiles: tile_class = new tile_class();
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong1,zoom);
	var map_p2: map_pixel_class = latlong_to_pixel2(latlong2,zoom);
	
	var size: map_pixel_class = new map_pixel_class();
	tiles.x = Mathf.Round((map_p2.x-map_p1.x)/resolution);
	tiles.y = Mathf.Round((map_p2.y-map_p1.y)/resolution);
	
	return tiles;
}

function calc_latlong_center(latlong1: latlong_class,latlong2: latlong_class,zoom: double,screen_resolution: Vector2): latlong_class
{
	var pixel_latlong1: map_pixel_class = latlong_to_pixel2(latlong1,zoom);
	var pixel_latlong2: map_pixel_class = latlong_to_pixel2(latlong2,zoom);
	
	var pixel_center: map_pixel_class = new map_pixel_class();
	
	pixel_center.x = (pixel_latlong1.x+pixel_latlong2.x)/2;
	pixel_center.y = (pixel_latlong1.y+pixel_latlong2.y)/2;
	
	var center: latlong_class = pixel_to_latlong2(pixel_center,zoom);
	
	return center;
}


function calc_latlong_area_from_center(area: map_area_class,center: latlong_class,zoom: double,resolution: Vector2)
{
	var pixel_old_center: map_pixel_class = latlong_to_pixel2(area.center,zoom);
	var pixel_new_center: map_pixel_class = latlong_to_pixel2(center,zoom);
	
	var pixel_latlong1: map_pixel_class = latlong_to_pixel2(area.upper_left,zoom);
	var pixel_latlong2: map_pixel_class = latlong_to_pixel2(area.lower_right,zoom);
	
	var offset: map_pixel_class = new map_pixel_class();
	
	offset.x = pixel_new_center.x-pixel_old_center.x;
	offset.y = pixel_new_center.y-pixel_old_center.y;
	
	pixel_latlong1.x += offset.x;
	pixel_latlong1.y += offset.y;  
	// pixel_latlong2.x += offset.x;
	// pixel_latlong2.y += offset.y;
	
	pixel_latlong2.x = pixel_latlong1.x+resolution.x;
	pixel_latlong2.y = pixel_latlong1.y+resolution.y;
	
	area.upper_left = pixel_to_latlong2(pixel_latlong1,zoom);
	area.lower_right = pixel_to_latlong2(pixel_latlong2,zoom);
	area.center = center;
}

function calc_latlong1_area_from_center(area: map_area_class,center: latlong_class,zoom: double)
{
	var pixel_old_latlong1: map_pixel_class = latlong_to_pixel2(area.upper_left,zoom);
	var pixel_new_latlong1: map_pixel_class = latlong_to_pixel2(center,zoom);
	
	var pixel_center: map_pixel_class = latlong_to_pixel2(area.center,zoom);
	var pixel_latlong2: map_pixel_class = latlong_to_pixel2(area.lower_right,zoom);
	
	var offset: map_pixel_class = new map_pixel_class();
	
	offset.x = pixel_new_latlong1.x-pixel_old_latlong1.x;
	offset.y = pixel_new_latlong1.y-pixel_old_latlong1.y;
	
	pixel_center.x += offset.x;
	pixel_center.y += offset.y;
	pixel_latlong2.x += offset.x;
	pixel_latlong2.y += offset.y;
	
	area.upper_left = center;
	area.center = pixel_to_latlong2(pixel_center,zoom);
	area.lower_right = pixel_to_latlong2(pixel_latlong2,zoom);
}

function calc_latlong2_area_from_center(area: map_area_class,center: latlong_class,zoom: double)
{
	var pixel_old_latlong2: map_pixel_class = latlong_to_pixel2(area.lower_right,zoom);
	var pixel_new_latlong2: map_pixel_class = latlong_to_pixel2(center,zoom);
	
	var pixel_center: map_pixel_class = latlong_to_pixel2(area.center,zoom);
	var pixel_latlong1: map_pixel_class = latlong_to_pixel2(area.upper_left,zoom);
	
	var offset: map_pixel_class = new map_pixel_class();
	
	offset.x = pixel_new_latlong2.x-pixel_old_latlong2.x;
	offset.y = pixel_new_latlong2.y-pixel_old_latlong2.y; 
	
	pixel_center.x += offset.x;
	pixel_center.y += offset.y;
	pixel_latlong1.x += offset.x;
	pixel_latlong1.y += offset.y;
	
	area.lower_right = center;
	area.center = pixel_to_latlong2(pixel_center,zoom);
	area.upper_left = pixel_to_latlong2(pixel_latlong1,zoom);
}

function calc_pixel_zoom(pixel: Vector2,zoom: double,current_zoom: double,screen_resolution: Vector2): Vector2
{
	var delta_zoom: double = Mathf.Pow(2,zoom-current_zoom);
	
	var delta_pixel: Vector2 = pixel-screen_resolution;
	delta_pixel *= delta_zoom;
	
	return (delta_pixel+screen_resolution);
}

/*
function calc_latlong_area_by_tile(latlong: latlong_class,tile: tile_class,zoom: double,resolution: int,bresolution: Vector2,offset: Vector2): latlong_area_class
{
	var latlong_area: latlong_area_class = new latlong_area_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	var minus: Vector2 = Vector2(0,0);
	
	pixel.x += tile.x*resolution;
	pixel.y += tile.y*resolution;
	
	if (tile.x > 0){++pixel.x;minus.x = 1;}
	if (tile.y > 0){++pixel.y;minus.y = 1;}
	
	var latlong_temp: latlong_class = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong1 = latlong_temp;
	
	pixel.x += bresolution.x-minus.x;
	pixel.y += bresolution.y-minus.y; 
	
	latlong_temp = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong2 = latlong_temp;
	
	return latlong_area;
}
*/

function calc_latlong_area_by_tile(latlong: latlong_class,tile: tile_class,zoom: double,resolution: int,bresolution: Vector2,offset: Vector2): latlong_area_class
{
	var factor: float = Mathf.Pow(2,19-zoom);
	zoom = 19;
	resolution *= factor;
	bresolution *= factor;
	
	var latlong_area: latlong_area_class = new latlong_area_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	var minus: Vector2 = Vector2(0,0);
	
	pixel.x += (tile.x*resolution)+offset.x;
	pixel.y += (tile.y*resolution)+offset.y;
	
	if (tile.x > 0){pixel.x += factor;minus.x = factor;}
	if (tile.y > 0){pixel.y += factor;minus.y = factor;}
	
	var latlong_temp: latlong_class = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong1 = latlong_temp;
	
	pixel.x += bresolution.x-minus.x;
	pixel.y += bresolution.y-minus.y; 
	
	latlong_temp = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong2 = latlong_temp;
	
	return latlong_area;
}

/*
function calc_latlong_area_by_tile(latlong: latlong_class,tile: tile_class,zoom: double,resolution: int,bresolution: Vector2): latlong_area_class
{
	var latlong_area: latlong_area_class = new latlong_area_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	var minus: Vector2 = Vector2(0,0);
	
	pixel.x += tile.x*resolution;
	pixel.y += tile.y*resolution;
	
	if (tile.x > 0){++pixel.x;minus.x = 1;}
	if (tile.y > 0){++pixel.y;minus.y = 1;}
	
	var latlong_temp: latlong_class = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong1 = latlong_temp;
	
	pixel.x += bresolution.x-minus.x;
	pixel.y += bresolution.y-minus.y; 
	
	latlong_temp = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong2 = latlong_temp;
	
	return latlong_area;
}
*/

function calc_latlong_area_by_tile2(latlong: latlong_class,tile: tile_class,zoom: double,resolution: int,bresolution: Vector2): latlong_area_class
{
	var latlong_area: latlong_area_class = new latlong_area_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	var minus: Vector2 = Vector2(0,0);
	
	pixel.x += tile.x*(resolution);
	pixel.y += tile.y*(resolution);
	
	var latlong_temp: latlong_class = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong1 = latlong_temp;
	
	pixel.x += bresolution.x;
	pixel.y += bresolution.y; 
	
	latlong_temp = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong2 = latlong_temp;
	
	return latlong_area;
}

function calc_latlong_center_by_tile(latlong: latlong_class,tile: tile_class,subtile: tile_class,subtiles: tile_class,zoom: double,resolution: int,offset: Vector2): latlong_class
{
	var factor: float = Mathf.Pow(2,19-zoom);
	zoom = 19;
	resolution *= factor;
	
	var latlong_center: latlong_class = new latlong_class();
	
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	
	pixel.x += (tile.x*subtiles.x*resolution)+(subtile.x*resolution);//-(tile.x*2);  
	pixel.y += (tile.y*subtiles.y*resolution)+(subtile.y*resolution);//-(tile.y*2);
	
	pixel.x += (resolution/2)+offset.x;
	pixel.y += (resolution/2)+offset.y; 
	
	latlong_center = pixel_to_latlong2(pixel,zoom);
	
	return latlong_center;
}

/*
function calc_latlong_center_by_tile(latlong: latlong_class,tile: tile_class,subtile: tile_class,subtiles: tile_class,zoom: double,resolution: int): latlong_class
{
	var latlong_center: latlong_class = new latlong_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	
	pixel.x += (tile.x*subtiles.x*resolution)+(subtile.x*resolution);//-(tile.x*2);  
	pixel.y += (tile.y*subtiles.y*resolution)+(subtile.y*resolution);//-(tile.y*2);
	
	pixel.x += (resolution/2);
	pixel.y += (resolution/2); 
	
	latlong_center = pixel_to_latlong2(pixel,zoom);
	
	return latlong_center;
}
*/

function calc_rest_value(value1: float,divide: float): int
{
	var r: int = value1/divide;
	
	r = (value1)-(r*divide);
	
	return r;
}

function calc_latlong_to_mercator(latlong: latlong_class): map_pixel_class
{
	var pixel: map_pixel_class = new map_pixel_class();
  
	pixel.x = latlong.latitude * 20037508.34 / 180;
	pixel.y = Mathf.Log(Mathf.Tan((90 + latlong.longitude) * Mathf.PI / 360)) / (Mathf.PI / 180);
	pixel.y = pixel.y * 20037508.34 / 180;
	return pixel;
} 

function calc_mercator_to_latlong (pixel: map_pixel_class): latlong_class
{
	var latlong: latlong_class = new latlong_class();
	
	latlong.longitude = (pixel.x / 20037508.34) * 180;
	latlong.latitude = (pixel.y / 20037508.34) * 180;

	latlong.latitude = 180/Mathf.PI * (2 * Mathf.Atan(Mathf.Exp(latlong.latitude * Mathf.PI / 180)) - Mathf.PI / 2);
	return latlong;
}

function rect_contains(rect1: Rect,rect2: Rect): boolean
{
	if (rect1.Contains(Vector2(rect2.x,rect2.y)) || rect1.Contains(Vector2(rect2.x,rect2.yMax)) 
		|| rect1.Contains(Vector2(rect2.xMax,rect2.y)) || rect1.Contains(Vector2(rect2.xMax,rect2.yMax))) {return true;} else {return false;}
}

function calc_terrain_tile(terrain_index: int,tiles: tile_class): tile_class
{
	var tile: tile_class = new tile_class();
	
	tile.y = terrain_index/tiles.x;
	tile.x = terrain_index-(tile.y*tiles.x);
	
	return tile;
}

#if UNITY_EDITOR
function set_image_import_settings(path: String,read: boolean,format: TextureImporterFormat,wrapmode: TextureWrapMode,maxsize: int,mipmapEnabled: boolean,filterMode: FilterMode,anisoLevel: int,mode: int)
{
	if (path.Length == 0){return;}
	path = path.Replace(Application.dataPath,"Assets");
	var textureImporter: TextureImporter = AssetImporter.GetAtPath(path) as TextureImporter; 
	 
	var change: boolean = false; 
	
	if (textureImporter) {
		if (mode & 1) {
			if (textureImporter.isReadable != read) {
				textureImporter.isReadable = read;
				// Debug.Log("read "+read);
				change = true; 
			}
		}
		
		if (mode & 2) {
			if (textureImporter.textureFormat != format)
			{
				textureImporter.textureFormat = format;
				change = true;
			}
		}
		
		if (mode & 4) {
			if (textureImporter.wrapMode != wrapmode)
			{
				textureImporter.wrapMode = wrapmode;
				change = true;
			}
		}
		
		if (mode & 8) {
			if (textureImporter.maxTextureSize != maxsize)
			{
				textureImporter.maxTextureSize = maxsize;
				change = true;
			}
		}
		
		if (mode & 16) {
			if (textureImporter.mipmapEnabled != mipmapEnabled) {
				textureImporter.mipmapEnabled = mipmapEnabled;
				change = true;
			}
			
		}
		
		if (mode & 32) {
			if (textureImporter.filterMode != filterMode) {
				textureImporter.filterMode = filterMode;
				change = true;
			}
			
		}
		
		if (mode & 64) {
			if (textureImporter.anisoLevel != anisoLevel) {
				textureImporter.anisoLevel = anisoLevel;
				change = true;
			}
			
		}
		
		if (change){AssetDatabase.ImportAsset(path);}
	}
	else {
		Debug.Log("Texture Importer can't find "+path);
	}
}
#endif