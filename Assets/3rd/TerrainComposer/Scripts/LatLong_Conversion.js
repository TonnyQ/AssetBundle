#pragma strict
 
var global_script: global_settings_tc;
var latlong_center: latlong_class = new latlong_class();
var latlong: latlong_class[];
var offset: Vector2 = new Vector2(0,-27);
 
function Start(){
   
    var counter : int = 0;
   
    latlong[2].latitude = 49.34544372558594;
    latlong[2].longitude = -119.579584441234;
   
    for(var p in latlong){
       
        var pos = calc_position(p.latitude, p.longitude);
        var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
        go.transform.position = new Vector3(pos.x, 0, pos.y);
       
        Debug.Log(calc_latlong(go.transform.position).x+" : "+calc_latlong(go.transform.position).y);
       
        go.name = "Test point " + counter;
       
        counter ++;
    }
}
 
function calc_latlong(pos : Vector3) : Vector2
{
 
    var map_pixel: map_pixel_class = new map_pixel_class();
 
    var map_pixel_center: map_pixel_class = global_script.latlong_to_pixel2(latlong_center,19);
 
    var map_resolution: double = global_script.calc_latlong_area_resolution(latlong_center,19);
   
    map_pixel.x = ((pos.x-offset.x)/map_resolution)+map_pixel_center.x;
    map_pixel.y = (-(pos.z-offset.y)/map_resolution)+map_pixel_center.y;
 
    var returnVal : latlong_class = global_script.pixel_to_latlong2(map_pixel,19);
 
    return Vector2(returnVal.longitude, returnVal.latitude);
}
 
function calc_position(lat : double, lon : double) : Vector2
{
    var latlong = new latlong_class(lat, lon);
 
    var returnVal : Vector2;
 
    var map_pixel: map_pixel_class = global_script.latlong_to_pixel2(latlong,19);
    var map_pixel_center: map_pixel_class = global_script.latlong_to_pixel2(latlong_center,19);    
 
    var map_resolution: double = global_script.calc_latlong_area_resolution(latlong_center,19);
   
    returnVal.x = (map_pixel.x-map_pixel_center.x)*map_resolution;
    returnVal.y = (-map_pixel.y+map_pixel_center.y)*map_resolution;
   
    returnVal += offset;
   
    return returnVal;
}