The RuntimeTerrains script allows you to create and generate terrains in runtime from your TerrainComposer project.

You need to drag and drop the RuntimeTerrains prefab in your Scene.
There are 2 options. You can precreate the (flat) terrains with TerrainComposer or create the terrains on the fly in runtime.

The RegenerateTerrains you can use for testing generating random terrain. The RuntimeTerrains needs to be assigned to it and
with pressing 'g' in playmode or in build it will regenerate the terrains.

Create terrains on the fly:
This options will save build size and handy for web player builds where small build size is important.
To active, enable 'Create Terrains On The Fly'. You also have to create 1 terrain in your Scene with splat textures assigned. 
Then Unity will render the terrain correct in the build. You can use the lowest resolution terrain for this and disable 
it's rendering. Then after that the terrains in TC terrain list needs to have 1 terrain that is empty and set to 'None'.
The settings you use on that terrain, the runtime terrains will have. The amount of terrains to be created can be selected 
with Terrain Instances slider.

The script options:
---------------------------------------------------------------------
* Move Terrains With Camera -> Unlimited procedural terrains. This will automatically regenerate terrains around the camera.
* Update Check Time -> The interval in which the moving of terrains check is performed.
* Main Camera -> Assign your main camera if you enable 'Move Terrains With Camera'.
---------------------------------------------------------------------

* Generate On Start -> Generate terrains on Scene load, otherwise you have to manually call the 'GenerateStart()' function in
the script.

* Auto Speed -> This can be used if you want to generate terrains while keeping framerate. If not you can create the terrains
with a faster manual speed.

* Target Frames -> While generating with auto speed, TerrainComposer will return from the loop as soon as the fps goes lower 
then the set frames. So with this you can make sure your game keeps running a certain fps, although when using too high 
resolutions, the fps will hang on updating the Unity terrain.

* Generate Speed -> The manual generation speed.

* Heightmap, Splat, Tree, Grass and Object output -> Enables the generating of the output.

* Seed -> Can choose a seed number for random output, it will always give the same 'Random' result for the same number.

* Random Seed -> A random seed will be choosen based on time. The terrains will be really random.

* Randomize and Randomize Range -> Enable/Disable the randomness for the output and choose the random range for it.


If you have any questions, please contact me at Nathaniel_Doldersum@hotmail.com