#pragma strict

class ShowTexture extends EditorWindow
{
	var texture: Texture2D;
	var display_text: boolean = false;
	var displaySplat: boolean = false;
	var splatPrototypes: List.<splatPrototype_class>;
	var splat_custom: splat_custom_class;
	var text: String;
	var rotAngle: float = 90;
	var label_old: float;
	
		
	static function ShowWindow () 
	{
    	var window = EditorWindow.GetWindow (ShowTexture);
    	#if UNITY_3_4 || UNITY_3_5 || UNITY_4_0 || UNITY_4_01 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
        window.title = "Preview";
        #else
        window.titleContent = new GUIContent("Preview");
        #endif
    }
    
 	function OnGUI()
	{
		if (displaySplat) {
			for (var i: int = 0;i < splatPrototypes.Count;++i) {
				GUI.color = new Color(1,1,1,splat_custom.value[i]/splat_custom.totalValue);
				if (GUI.color.a > 0) {
					if (splatPrototypes[i].texture != null)	EditorGUI.DrawPreviewTexture(Rect(0,0,512,512),splatPrototypes[i].texture);
				}
			}
			GUI.color = Color.white;
			Repaint();
		}
		else if (texture)
		{
			GUI.color = Color.white;
			SetGUIRotMatrix(0);
			EditorGUI.DrawPreviewTexture(Rect(0,0,512,512),texture);
		}
		if (display_text)
		{
			GUI.color = Color.red;
			label_old = GUI.skin.label.fontSize;
			GUI.skin.label.fontSize = 20;
			GUI.skin.label.fontStyle = FontStyle.Bold;
			GUI.Label(Rect(225,350,200,30),text);
			
			GUI.skin.label.fontSize = label_old;
			GUI.skin.label.fontStyle = FontStyle.Normal;
			//GUIUtility.RotateAroundPivot(
		}
	}
 
	function SetGUIRotMatrix(angle: float) 
	{
	    var sin: float = Mathf.Sin(angle * Mathf.Deg2Rad);
	    var cos: float = Mathf.Cos(angle * Mathf.Deg2Rad);
	    var rot: Matrix4x4 = Matrix4x4.identity;
	    rot[0, 0] = cos;
	    rot[1, 0] = -sin;
	    rot[0, 1] = sin;
	    rot[1, 1] = cos;
	    GUI.matrix = rot;
	}
}