public static class Drawing_tc1 
{
	var aaLineTex: Texture2D = null;
	var lineTex: Texture2D = null;
	var clippingEnabled: boolean = true;
    var clippingBounds: Rect;
    var lineMaterial: Material = null;
	 
 	private function Drawing_tc1()
 	{
	 	aaLineTex = new Texture2D(1, 3, TextureFormat.ARGB32, true); 
	    aaLineTex.SetPixel(0, 0, new Color(1, 1, 1, 0));
	    aaLineTex.SetPixel(0, 1, Color.white);
	    aaLineTex.SetPixel(0, 2, new Color(1, 1, 1, 0));
	    aaLineTex.Apply();
	    
	    lineTex = new Texture2D(1, 1, TextureFormat.ARGB32, true);
 	    lineTex.SetPixel(0, 1, Color.white);
        lineTex.Apply();
  	}
  	
  	function DrawLineMac(pointA: Vector2,pointB: Vector2,color: Color,width: float,antiAlias: boolean)
    {
    	var savedColor: Color = GUI.color;
        var savedMatrix: Matrix4x4 = GUI.matrix;
        var oldWidth: float = width;
        if (antiAlias) {width *= 3;}
        var angle: float = Vector3.Angle(pointB - pointA, Vector2.right) * (pointA.y <= pointB.y ? 1 : -1);
        var m: float = (pointB - pointA).magnitude;
        
        if (m > 0.01f)
        {
            var dz: Vector3 = Vector3(pointA.x, pointA.y, 0);
            var offset: Vector3 = new Vector3((pointB.x - pointA.x)*0.5f, (pointB.y - pointA.y)*0.5f, 0f);
            var tmp: Vector3 = Vector3.zero;
            if (antiAlias)
                tmp = new Vector3(-oldWidth * 1.5f * Mathf.Sin(angle * Mathf.Deg2Rad), oldWidth * 1.5f * Mathf.Cos(angle * Mathf.Deg2Rad));
            else
                tmp = new Vector3(-oldWidth * 0.5f * Mathf.Sin(angle * Mathf.Deg2Rad), oldWidth * 0.5f * Mathf.Cos(angle * Mathf.Deg2Rad));
            
            GUI.color = color;
            GUI.matrix = translationMatrix(dz) * GUI.matrix;
            GUIUtility.ScaleAroundPivot(Vector2(m, width), Vector2(-0.5f, 0));
            GUI.matrix = translationMatrix(-dz) * GUI.matrix;
            GUIUtility.RotateAroundPivot(angle, Vector2.zero);
            GUI.matrix = translationMatrix(dz - tmp - offset) * GUI.matrix;
            if (antiAlias) {
            	GUI.DrawTexture(Rect(0, 0, 1, 1),aaLineTex);
            } 
            else {
            	GUI.DrawTexture(Rect(0, 0, 1, 1),lineTex);
            }
        }
        GUI.matrix = savedMatrix;
        GUI.color = savedColor;
    }

    function DrawLineWindows(pointA: Vector2,pointB: Vector2,color: Color,width: float,antiAlias: boolean)
    {
        var savedColor: Color = GUI.color;
        var savedMatrix: Matrix4x4 = GUI.matrix;
 
        if (antiAlias) width *= 3;
        var angle: float = Vector3.Angle(pointB - pointA, Vector2.right) * (pointA.y <= pointB.y ? 1 : -1);
 
        var m: float = (pointB - pointA).magnitude;
        var dz: Vector3 = Vector3(pointA.x, pointA.y, 0);
        GUI.color = color;
 
        GUI.matrix = translationMatrix(dz) * GUI.matrix;
        GUIUtility.ScaleAroundPivot(Vector2(m, width), Vector2(-0.5f, 0));
        GUI.matrix = translationMatrix(-dz) * GUI.matrix;
        GUIUtility.RotateAroundPivot(angle, Vector2(0, 0));
        GUI.matrix = translationMatrix(dz + Vector3(width / 2, -m / 2) * Mathf.Sin(angle * Mathf.Deg2Rad)) * GUI.matrix;
        if (!antiAlias) {
        	GUI.DrawTexture(Rect(0, 0, 1, 1), lineTex);
        }
        else {
        	GUI.DrawTexture(Rect(0, 0, 1, 1), aaLineTex);
        }
        GUI.matrix = savedMatrix;
        GUI.color = savedColor;
    }
 
    function DrawLine(pointA: Vector2,pointB: Vector2,color: Color,width: float,antiAlias: boolean,screen: Rect)
    {
        clippingBounds = screen;
		DrawLine(pointA,pointB,color,width);
	}
	
	function curveOutIn(wr: Rect,wr2: Rect,color: Color,shadow: Color,width: int,screen: Rect)
    {
       	BezierLine(
            Vector2(wr.x + wr.width, wr.y + width + wr.height / 2),
            Vector2(wr.x + wr.width + Mathf.Abs(wr2.x - (wr.x + wr.width)) / 2, wr.y + width + wr.height / 2),
            Vector2(wr2.x, wr2.y + width + wr2.height / 2),
            Vector2(wr2.x - Mathf.Abs(wr2.x - (wr.x + wr.width)) / 2, wr2.y + width + wr2.height / 2), shadow, width, true,20,screen);
        BezierLine(
            Vector2(wr.x + wr.width, wr.y + wr.height / 2),
            Vector2(wr.x + wr.width + Mathf.Abs(wr2.x - (wr.x + wr.width)) / 2, wr.y + wr.height / 2),
            Vector2(wr2.x, wr2.y + wr2.height / 2),
            Vector2(wr2.x - Mathf.Abs(wr2.x - (wr.x + wr.width)) / 2, wr2.y + wr2.height / 2), color, width, true,20,screen);
    }
	
	function BezierLine(start: Vector2,startTangent: Vector2,end: Vector2,endTangent: Vector2,color: Color,width: float,antiAlias: boolean,segments: int,screen: Rect)
    {
        var lastV: Vector2 = cubeBezier(start, startTangent, end, endTangent, 0);
 
        for (var i: int = 1; i <= segments; ++i)
        {
            var v: Vector2 = cubeBezier(start, startTangent, end, endTangent, i / segments);
 
            Drawing_tc1.DrawLine(lastV, v, color, width, antiAlias,screen);
 
            lastV = v;
        }
    }
 
    function cubeBezier(s: Vector2,st: Vector2,e: Vector2,et: Vector2,t: float): Vector2
    {
        var rt: float = 1 - t;
 
        return (((s * rt) * rt) * rt) + (((3 * st * rt) * rt) * t) + (((3 * et * rt) * t) * t) + (((e * t) * t) * t);
    }
  
    function translationMatrix(v: Vector3): Matrix4x4
    {
        return Matrix4x4.TRS(v, Quaternion.identity, Vector3.one);
    }
			 
   	class clip_class
	{
		var u1: float;
		var u2: float;
		
		function clip_class(start: float,end: float)
		{
			u1 = start;
			u2 = end;
		}
	}
	// ref u1 u2
    function clip_test(p: float,q: float,u: clip_class): boolean
    {
        var r: float;
        var ret: boolean = true;

        if (p < 0.0)
        {
            r = q / p;
            if (r > u.u2)
                ret = false;
            else if (r > u.u1)
                u.u1 = r;
        }
        else if (p > 0.0)
        {
            r = q / p;
            if (r < u.u1)
                ret = false;
            else if (r < u.u2)
                u.u2 = r;
        }
        else if (q < 0.0)
            ret = false;

        return ret;
    }
    
    class point_class
    {
    	var p1: Vector2;
    	var p2: Vector2;
    	
    	function point_class(start: Vector2,end : Vector2)
    	{
    		p1 = start;
    		p2 = end;
    	}
    }
	
	// ref p1 p2
    function segment_rect_intersection(bounds: Rect,p: point_class): boolean
    {
        var dx: float = p.p2.x - p.p1.x;
        var dy: float;
        var u: clip_class = new clip_class(0.0,1.0);
		
		if (clip_test(-dx, p.p1.x - bounds.xMin,u))
        {
        	if (clip_test(dx, bounds.xMax - p.p1.x,u))
            {
                dy = p.p2.y - p.p1.y;
                if (clip_test(-dy, p.p1.y - bounds.yMin,u))
                {
                	if (clip_test(dy, bounds.yMax - p.p1.y,u))
                    {
                        if (u.u2 < 1.0)
                        {
                            p.p2.x = p.p1.x + u.u2 * dx;
                            p.p2.y = p.p1.y + u.u2 * dy;
                        }

                        if (u.u1 > 0.0)
                        {
                            p.p1.x += u.u1 * dx;
                            p.p1.y += u.u1 * dy;
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function BeginGroup(position: Rect)
    {
        clippingEnabled = true;
        clippingBounds = Rect(0, 0, position.width, position.height);
        GUI.BeginGroup(position);
    }

    function EndGroup()
    {
        GUI.EndGroup();
        clippingBounds = Rect(0, 0, Screen.width, Screen.height);
        clippingEnabled = false;
    }

    function DrawLine(start: Vector2,end: Vector2,color: Color,width: float)
    {
        if (Event.current == null)
            return;
        if (Event.current.type != EventType.repaint)
            return;
            
        var p: point_class = new point_class(start,end);

        // if (clippingEnabled) {
       		// if (!segment_rect_intersection(clippingBounds,p))
            	// return;
        // }

        // if (lineMaterial == null) CreateMaterial();

        lineMaterial.SetPass(0);

        var startPt: Vector3;
        var endPt: Vector3;

        if (width == 1) {
            GL.Begin(GL.LINES);
            GL.Color(color);
            startPt = Vector3(start.x, start.y, 0);
            endPt = Vector3(end.x, end.y, 0);
            GL.Vertex(startPt);
            GL.Vertex(endPt);
        }
        else {
            GL.Begin(GL.QUADS);
            GL.Color(color);
            startPt = Vector3(end.y, start.x, 0);
            endPt = Vector3(start.y, end.x, 0);
            var perpendicular: Vector3 = (startPt - endPt).normalized * width/2f;
            var v1: Vector3 = Vector3(start.x, start.y, 0);
            var v2: Vector3 = Vector3(end.x, end.y, 0);
            GL.Vertex(v1 - perpendicular);
            GL.Vertex(v1 + perpendicular);
            GL.Vertex(v2 + perpendicular);
            GL.Vertex(v2 - perpendicular);
	
	    }
        GL.End();
    }

	function DrawBox(box: Rect,color: Color,width: float)
	{
		var p1: Vector2 = Vector2(box.xMin, box.yMin);
		var p2: Vector2 = Vector2(box.xMax, box.yMin);
		var p3: Vector2 = Vector2(box.xMax, box.yMax);
		var p4: Vector2 = Vector2(box.xMin, box.yMax);
		DrawLine(p1, p2, color, width);
		DrawLine(p2, p3, color, width);
		DrawLine(p3, p4, color, width);
		DrawLine(p4, p1, color, width);
	}

	function DrawBox(topLeftCorner: Vector2,bottomRightCorner: Vector2,color: Color,width: float)
	{
		var box: Rect = Rect(topLeftCorner.x, topLeftCorner.y, bottomRightCorner.x - topLeftCorner.x, bottomRightCorner.y - topLeftCorner.y);
		DrawBox(box, color, width);
	}

	function DrawRoundedBox(box: Rect,radius: float,color: Color,width: float)
	{
		var p1: Vector2;
		var p2: Vector2;
		var p3: Vector2;
		var p4: Vector2;
		var p5: Vector2;
		var p6: Vector2;
		var p7: Vector2;
		var p8: Vector2;
		
		p1 = Vector2(box.xMin + radius, box.yMin);
		p2 = Vector2(box.xMax - radius, box.yMin);
		p3 = Vector2(box.xMax, box.yMin + radius);
		p4 = Vector2(box.xMax, box.yMax - radius);
		p5 = Vector2(box.xMax - radius, box.yMax);
		p6 = Vector2(box.xMin + radius, box.yMax);
		p7 = Vector2(box.xMin, box.yMax - radius);
		p8 = Vector2(box.xMin, box.yMin + radius);

		DrawLine(p1, p2, color, width);
		DrawLine(p3, p4, color, width);
		DrawLine(p5, p6, color, width);
		DrawLine(p7, p8, color, width);

		var t1: Vector2;
		var t2: Vector2;
		var halfRadius: float = radius / 2;

		t1 = Vector2(p8.x, p8.y + halfRadius);
		t2 = Vector2(p1.x - halfRadius, p1.y);
		DrawBezier(p8, t1, p1, t2, color, width);

		t1 = Vector2(p2.x + halfRadius, p2.y);
		t2 = Vector2(p3.x, p3.y - halfRadius);
		DrawBezier(p2, t1, p3, t2, color, width);

		t1 = Vector2(p4.x, p4.y + halfRadius);
		t2 = Vector2(p5.x + halfRadius, p5.y);
		DrawBezier(p4, t1, p5, t2, color, width);

		t1 = Vector2(p6.x - halfRadius, p6.y);
		t2 = Vector2(p7.x, p7.y + halfRadius);
		DrawBezier(p6, t1, p7, t2, color, width);
	}

	function DrawConnectingCurve(start: Vector2,end: Vector2,color: Color,width: float)
	{
		var distance: Vector2 = start - end;

		var tangentA: Vector2 = start;
		tangentA.x -= (distance/2).x;
		var tangentB: Vector2 = end;
		tangentB.x += (distance/2).x;

		var segments: int = Mathf.FloorToInt((distance.magnitude / 20) * 3);

		DrawBezier(start, tangentA, end, tangentB, color, width, segments);
	}

	function DrawBezier(start: Vector2,startTangent: Vector2,end: Vector2,endTangent: Vector2,color: Color,width: float)
	{
		var segments: int = Mathf.FloorToInt((start - end).magnitude / 20) * 3; // Three segments per distance of 20
		DrawBezier(start, startTangent, end, endTangent, color, width, segments);
	}

	function DrawBezier(start: Vector2,startTangent: Vector2,end: Vector2,endTangent: Vector2,color: Color,width: float,segments: int)
	{
		var startVector: Vector2 = CubeBezier(start, startTangent, end, endTangent, 0);
		for (var i: int = 1; i <= segments; i++)
		{
			var endVector: Vector2 = CubeBezier(start, startTangent, end, endTangent, i/segments);
			DrawLine(startVector, endVector, color, width);
			startVector = endVector;
		}
	}

	function CubeBezier(s: Vector2,st: Vector2,e: Vector2,et: Vector2,t: float): Vector2
	{
		var rt: float = 1-t;
		var rtt: float = rt * t;
		return rt*rt*rt * s + 3 * rt * rtt * st + 3 * rtt * t * et + t*t*t* e;
    }
}    

