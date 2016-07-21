#pragma strict

class MeasureTool extends EditorWindow
{
	var TerrainComposer_Scene: GameObject;
	var tc_script: TerrainComposer;
	var script: terraincomposer_save;
	var global_script: global_settings_tc;
	
	var undock: boolean = true;
	
	static function ShowWindow () 
	{
    	var window = EditorWindow.GetWindow (MeasureTool);
    	#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
        window.title = "MeasureTool";
        #else
        window.titleContent = new GUIContent("MeasureTool");
        #endif
    }
    
    function OnFocus()
	{
		TerrainComposer_Scene = GameObject.Find("TerrainComposer_Save");
		if (TerrainComposer_Scene)
		{
			script = TerrainComposer_Scene.GetComponent(terraincomposer_save);
		}
		
		if (!tc_script)
		{
			if (script){tc_script = EditorWindow.GetWindow(Type.GetType("TerrainComposer")) as TerrainComposer;}
		}
	}
	
	function OnDestroy()
	{
		if (undock && script){script.measure_tool = false;script.measure_tool_active = false;}
		if (tc_script){tc_script.Repaint();}
	}
	
	function OnGUI()
	{
		if (!tc_script || !script){OnFocus();return;}
		
		if (!script.tex1) {script.tex1 = new Texture2D(1,1);}
		if (script.tex1 && global_script.settings.color.backgroundActive)
        {
	       	GUI.color = global_script.settings.color.backgroundColor;
	       	EditorGUI.DrawPreviewTexture(Rect(0,0,position.width,position.height),script.tex1);
	       	GUI.color = UnityEngine.Color.white;
	    }
	   
		if (EditorApplication.isPlaying){return;}
		tc_script.draw_measure_tool();
		
		if (script.measure_tool_active){this.Repaint();}
	}
}