#pragma strict

var grass_save: List.<grass_save_class> = new List.<grass_save_class>();

class grass_save_class
{
	var details: List.<detail_save_class> = new List.<detail_save_class>();
	var resolution: int;
}

class detail_save_class
{
	var detail: List.<int> = new List.<int>();
}



