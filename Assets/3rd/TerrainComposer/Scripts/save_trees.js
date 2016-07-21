#pragma strict

var tree_save: List.<tree_save_class> = new List.<tree_save_class>();
var treeTypes: int;

class tree_save_class
{
	var treeInstances: List.<treeInstance_class> = new List.<treeInstance_class>();
}

class treeInstance_class
{
	var position: Vector3;
	var widthScale: float;
	var heightScale: float;
	var color: Color;
	var lightmapColor: Color;
	var prototypeIndex: int;
}
