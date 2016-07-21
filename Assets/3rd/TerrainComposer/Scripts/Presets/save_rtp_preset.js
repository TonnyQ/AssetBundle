//#pragma strict
//
//var NormalGlobal: Texture2D[];
//var TreesGlobal: Texture2D[];
//var ColorGlobal: Texture2D[];
//var BumpGlobalCombined: Texture2D;
//var controlA: Texture2D;
//var controlB: Texture2D;
//var controlC: Texture2D;
//
//var distance_start: float;
//var distance_transition: float;
//var RTP_MIP_BIAS: float;
//var _SpecColor: Color;
//var rtp_customAmbientCorrection: Color;
//var RTP_LightDefVector: Vector4; 
//var RTP_ReflexLightDiffuseColor: Color;
//var RTP_ReflexLightSpecColor: Color;
//var RTP_AOsharpness: float; 
//var RTP_AOamp: float;
//
//var blendMultiplier: float;
//var VerticalTexture: Texture2D;
//var VerticalTextureTiling: float;
//var VerticalTextureGlobalBumpInfluence: float;
//var GlobalColorMapBlendValues: Vector3;
//var _GlobalColorMapNearMIP: float;
//var GlobalColorMapSaturation: float;
//var GlobalColorMapBrightness: float;
//
//var global_normalMap_multiplier: float;
//var trees_pixel_distance_start: float;
//var trees_pixel_distance_transition: float;
//var trees_pixel_blend_val: float;
//var trees_shadow_distance_start: float;
//var trees_shadow_distance_transition: float;
//var trees_shadow_value: float;
//
//var _snow_strength: float;
//var _global_color_brightness_to_snow: float;
//var _snow_slope_factor: float;
//var _snow_height_treshold: float;
//var _snow_height_transition: float;
//var _snow_color: Color;
//var _snow_specular: float;
//var _snow_gloss: float;
//var _snow_reflectivness: float;
//var _snow_edge_definition: float;
//var _snow_deep_factor: float;
//
//var BumpMapGlobalScale: float;
//var rtp_mipoffset_globalnorm: float;
//var distance_start_bumpglobal: float;
//var rtp_perlin_start_val: float;
//var distance_transition_bumpglobal: float;
//var _FarNormalDamp: float;
//
//var TERRAIN_GlobalWetness: float;
//var TERRAIN_WaterSpecularity: float;
//var TERRAIN_FlowSpeed: float;
//var TERRAIN_FlowScale: float;
//var TERRAIN_FlowMipOffset: float;
//var TERRAIN_mipoffset_flowSpeed: float;
//var TERRAIN_WetDarkening: float;
//
//var TERRAIN_RainIntensity: float;
//var TERRAIN_WetDropletsStrength: float;
//var TERRAIN_DropletsSpeed: float;
//var TERRAIN_RippleScale: float;
//
//var TERRAIN_CausticsAnimSpeed: float;
//var TERRAIN_CausticsColor: Color;
//var TERRAIN_CausticsWaterLevel: float;
//var TERRAIN_CausticsWaterLevelByAngle: float;
//var TERRAIN_CausticsWaterShallowFadeLength: float;
//var TERRAIN_CausticsWaterDeepFadeLength: float;
//var TERRAIN_CausticsTilingScale: float;
//
//var _SuperDetailTiling: float;
//var TERRAIN_ReflColorA: Color;
//var TERRAIN_ReflColorB: Color;
//var TERRAIN_ReflDistortion: float;
//var TERRAIN_ReflectionRotSpeed: float;
//var TERRAIN_FresnelPow: float;
//var TERRAIN_FresnelOffset: float;
//
//var splats: Texture2D[];
//var splat_atlases: Texture2D[] = new Texture2D[2];
//var Bumps: Texture2D[];
//var Bump01: Texture2D;
//var Bump23: Texture2D;
//var Bump45: Texture2D;
//var Bump67: Texture2D;
//var Bump89: Texture2D;
//var BumpAB: Texture2D;
//var Heights: Texture2D[];
//var HeightMap: Texture2D;
//var HeightMap2: Texture2D;
//var HeightMap3: Texture2D;
//var Substances: ProceduralMaterial[];
//
//var Spec: float[];
//var FarGlossCorrection: float[];
//var PER_LAYER_HEIGHT_MODIFIER: float[];
//var MIPmult: float[];
//var GlobalColorPerLayer: float[];
//var MixScale: float[];
//var MixBlend: float[];
//var MixSaturation: float[];
//var _BumpMapGlobalStrength: float[];
//var _SuperDetailStrengthNormal: float[];
//var _SuperDetailStrengthMultA: float[];
//var _SuperDetailStrengthMultASelfMaskNear: float[];
//var _SuperDetailStrengthMultASelfMaskFar: float[];
//var _SuperDetailStrengthMultB: float[];
//var _SuperDetailStrengthMultBSelfMaskNear: float[];
//var _SuperDetailStrengthMultBSelfMaskFar: float[];
//var VerticalTextureStrength: float[];
//var _snow_strength_per_layer: float[];
//var TERRAIN_LayerWetStrength: float[];
//var TERRAIN_WaterColor: Color[];
//var TERRAIN_WaterLevel: float[];
//var TERRAIN_WaterLevelSlopeDamp: float[];
//var TERRAIN_WaterEdge: float[];
//var TERRAIN_WaterOpacity: float[];
//var TERRAIN_WaterGloss: float[];
//var TERRAIN_Refraction: float[];
//var TERRAIN_Flow: float[];
//var TERRAIN_WetSpecularity: float[];
//var TERRAIN_WetReflection: float[];
//var TERRAIN_WetRefraction: float[];
//
//var ReliefTransform: Vector4;
//
//
//
//
//
//
//
