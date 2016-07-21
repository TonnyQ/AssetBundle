#pragma strict

class Info_tc extends EditorWindow
{
	var text: String;
	var label_old: float;
	var foldout: boolean = true;
	var backgroundColor: Color;
	var backgroundActive: boolean = true;
	var global_script: global_settings_tc;
	var scrollPos: Vector2;
	var update_height: int;
	var parent: EditorWindow;	
		
	static function ShowWindow () 
	{
    	var window = EditorWindow.GetWindow (Info_tc);
    	#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
        window.title = "Update";
        #else
        window.titleContent = new GUIContent("Update");
        #endif
    }
    
    function OnDisable()
    { 
    	if (parent) {
    		// parent.info_window = false;
    		parent.Repaint();
    	}
    }
    
 	function OnGUI()
	{
//		if (global_script.tex1)
//        {
//        	if (backgroundActive) {
//		       	GUI.color = backgroundColor;
//		       	EditorGUI.DrawPreviewTexture(Rect(0,0,position.width,position.height),global_script.tex1);
//		       	GUI.color = UnityEngine.Color.white;
//		    }
//	    }
//	    else
//	    {
//	    	global_script.tex1 = new Texture2D(1,1);
//	    }
		
		GUI.color = Color.white;
		
		scrollPos = EditorGUILayout.BeginScrollView(scrollPos,GUILayout.Width(position.width),GUILayout.Height(position.height));
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField(text,GUILayout.Height(update_height));
		EditorGUILayout.EndHorizontal();
		EditorGUILayout.EndScrollView();
	}
}