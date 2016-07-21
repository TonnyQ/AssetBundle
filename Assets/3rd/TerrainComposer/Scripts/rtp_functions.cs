using UnityEngine;
using System.Collections;

public class rtp_functions
{
		public static Texture2D PrepareHeights(int num, int numLayers,Texture2D[] Heights) {
		// ReliefTerrain _targetRT=(ReliefTerrain)target;
		// ReliefTerrainGlobalSettingsHolder _target=_targetRT.globalSettingsHolder;
		
		// Texture2D[] Heights=_target.Heights;
		if (Heights==null) return null;
		
		for(int n=0; n<Heights.Length; n++) {
			int min_size=9999;
			for(int m=(n/4)*4; (m<((n/4)*4+4)) && (m<Heights.Length); m++) {
				if (Heights[m]) {
					if (Heights[m].width<min_size) min_size=Heights[m].width;
				}
			}
			/*
			AssetImporter _importer=AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(Heights[n]));
			if (_importer) {
				TextureImporter tex_importer=(TextureImporter)_importer;
				bool reimport_flag=false;
				if (!tex_importer.isReadable) {
					Debug.LogWarning("Height texture "+n+" ("+Heights[n].name+") has been reimported as readable.");
					tex_importer.isReadable=true;
					reimport_flag=true;
				}
				if (!tex_importer.DoesSourceTextureHaveAlpha() && !tex_importer.grayscaleToAlpha) {
					Debug.LogWarning("Height texture "+n+" ("+Heights[n].name+") has been reimported to have alpha channel.");
					tex_importer.grayscaleToAlpha=true;
					tex_importer.textureFormat=TextureImporterFormat.Alpha8;
					reimport_flag=true;
				}
				if (Heights[n] && Heights[n].width>min_size) {
					Debug.LogWarning("Height texture "+n+" ("+Heights[n].name+") has been reimported with "+min_size+" size.");
					tex_importer.maxTextureSize=min_size;
					reimport_flag=true;
				}
				if (reimport_flag) {
					AssetDatabase.ImportAsset(AssetDatabase.GetAssetPath(Heights[n]),  ImportAssetOptions.ForceUpdate);
				}
			}
			*/					
		}			
		
		Texture2D[] heights=new Texture2D[4];
		int i;
		int _w=256;
		// int _w_idx=0;
		int len= numLayers<12 ? numLayers:12;
		if (num>=len) return null;
		num=(num>>2)*4;
		for(i=num; i<num+4; i++)	{
			if (num<4) {
				heights[i]=i<Heights.Length ? Heights[i] : null;
				if (heights[i]) {
					_w=heights[i].width;
					// _w_idx=i;
				}
			} else if (num<8) {
				heights[i-4]=i<Heights.Length ? Heights[i] : null;
				if (heights[i-4]) {
					_w=heights[i-4].width;
					// _w_idx=i;
				}
			} else {
				heights[i-8]=i<Heights.Length ? Heights[i] : null;
				if (heights[i-8]) {
					_w=heights[i-8].width;
					// _w_idx=i;
				}
			}
		}
		for(i=0; i<4; i++) {
			if (!heights[i]) {
				heights[i]=new Texture2D(_w, _w);
				rtp_functions.FillTex(heights[i], new Color32(255,255,255,255));
			}
		}
			/*
			if (heights[i]) {
				try { 
					heights[i].GetPixels(0,0,4,4,0);
				} catch (Exception e) {
					Debug.LogError("Height texture "+i+" has to be marked as isReadable...");
					Debug.LogError(e.Message);
					// _target.activateObject=heights[i];
					return false;
				}
				if (heights[i].width!=_w) {
					Debug.LogError("Height textures should have the same size ! (check layer "+_w_idx+" and "+(num+i)+")");
					// _target.activateObject=heights[i];
					return false;
				}
			} 
		
			// else {
			if (heights[i] == null) {
				heights[i]=new Texture2D(_w, _w);
				FillTex(heights[i], new Color32(255,255,255,255));
			}
			//}
		}
		*/
		return rtp_functions.CombineHeights(heights[0], heights[1], heights[2], heights[3]);
		/*	
		if (num<4) {
			_target.HeightMap=CombineHeights(heights[0], heights[1], heights[2], heights[3]);
		} else if (num<8) {
			_target.HeightMap2=CombineHeights(heights[0], heights[1], heights[2], heights[3]);
		} else if (num<12) {
			_target.HeightMap3=CombineHeights(heights[0], heights[1], heights[2], heights[3]);
		}
		return true;
		*/
	}
	
	public static Texture2D CombineHeights(Texture2D source_tex0, Texture2D source_tex1, Texture2D source_tex2, Texture2D source_tex3) {
		Texture2D rendered_tex=new Texture2D(source_tex0.width, source_tex0.height, TextureFormat.ARGB32, true, true);
		byte[] colsR=rtp_functions.get_alpha_channel(source_tex0);
		byte[] colsG=rtp_functions.get_alpha_channel(source_tex1);
		byte[] colsB=rtp_functions.get_alpha_channel(source_tex2);
		byte[] colsA=rtp_functions.get_alpha_channel(source_tex3);
		Color32[] cols=rendered_tex.GetPixels32();
		for(int i=0; i<cols.Length; i++) {
			cols[i].r=colsR[i];
			cols[i].g=colsG[i];
			cols[i].b=colsB[i];
			cols[i].a=colsA[i];
		}
		rendered_tex.SetPixels32(cols);
		rendered_tex.Apply(true, false);
		rendered_tex.Compress(true);
		//rendered_tex.Apply(true, true); // (non readable robione przy publishingu)
		rendered_tex.filterMode=FilterMode.Trilinear;
		return rendered_tex;
	}
				
	static byte[] get_alpha_channel(Texture2D source_tex) {
		Color32[] cols=source_tex.GetPixels32();
		byte[] ret=new byte[cols.Length];
		for(int i=0; i<cols.Length; i++) ret[i]=cols[i].a;
		return ret;
	}
	
	static void FillTex(Texture2D tex, Color32 col) {
		Color32[] cols=tex.GetPixels32();
		for(int i=0; i<cols.Length; i++) {
			cols[i].r=col.r;
			cols[i].g=col.g;
			cols[i].b=col.b;
			cols[i].a=col.a;
		}
		tex.SetPixels32(cols);
	}	
}
