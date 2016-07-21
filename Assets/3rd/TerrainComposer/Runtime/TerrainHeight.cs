using UnityEngine;
using System.Collections;
using System.Collections.Generic;
 
public class TerrainHeight : MonoBehaviour
{
 
    // Assign the Terrain Parent GameObject to TerrainParent
    public GameObject TerrainParent;
   
    List<Transform> terrains = new List<Transform>();
    Rect[] terrainRects;
   
    // Assign a test GameObject to the cube to test
    public Transform cube;
   
    void Awake()
    {
        // Create an Array of all the transforms from the children (terrains) of the parent GameObject
        Transform[] terrainsTemp = TerrainParent.GetComponentsInChildren<Transform>();
        Terrain terrain;
       
        // Create a Generic List without the Parent GameObject in the Array
        for (int countTerrain = 0;countTerrain < terrainsTemp.Length;++countTerrain)
        {
            // checks if item from list is a Terrain
            terrain = terrainsTemp[countTerrain].GetComponent<Terrain>();
            if (terrain){terrains.Add(terrainsTemp[countTerrain]);}
        }
       
        terrainRects = new Rect[terrains.Count];
       
       
        // Create another Array of Rect that contains the area of each terrain
        for (int countTerrain = 0;countTerrain < terrains.Count;++countTerrain)
        {
            terrain = terrains[countTerrain].GetComponent<Terrain>();
           
            terrainRects[countTerrain].x = terrains[countTerrain].position.x;
            terrainRects[countTerrain].y = terrains[countTerrain].position.z;
           
            terrainRects[countTerrain].width = terrain.terrainData.size.x;
            terrainRects[countTerrain].height = terrain.terrainData.size.z;
        }
    }
   
    Terrain GetTerrainTile(Vector3 position)
    {
        for (int countTerrain = 0;countTerrain < terrains.Count;++countTerrain)
        {
            if (terrainRects[countTerrain].Contains(new Vector2(position.x,position.z)))
            {
                return terrains[countTerrain].GetComponent<Terrain>();
            }  
        }
        return null;
    }
   
    float GetTerrainHeight(Vector3 position)
    {
        Terrain terrain = GetTerrainTile(position);
       
        if (terrain)
        {
            return terrain.SampleHeight(position);
        }
        else
        {
            return -1;
        }
    }
   
   
    // Test GetTerrainHeight void with the cube GameObject
    // Display terrain height based on position of cube
    void Update()
    {
        float height = GetTerrainHeight(cube.position);
        Debug.Log("Position: "+cube.position+" height: "+height);
    }
}