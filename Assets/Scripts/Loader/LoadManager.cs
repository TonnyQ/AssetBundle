using System;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Tonny.Common.Utility;
using UnityEditor;

namespace Tonny.Common.AssetLoader
{
    public class LoadedAssetBundle
    {
        public AssetBundle mAssetBundle;
        public int mRefCount;

        internal event Action Unload;

        internal void OnUnloadAssetBundle()
        {
            mAssetBundle.Unload(false);
            if (Unload != null)
            {
                Unload();
            }
        }

        public LoadedAssetBundle(AssetBundle assetBundle)
        {
            mAssetBundle = assetBundle;
            mRefCount = 1;
        }
    }

    public class LoadManager : MonoSingleton<LoadManager>
    {
#if UNITY_EDITOR
        public const string kSimulate = "SimulateAB";
        private static bool mSimulateInEditor = true;
        public static bool SimulateMode
        {
            get
            {
                if (mSimulateInEditor)
                {
                    mSimulateInEditor = EditorPrefs.GetBool("SimulateAB", true);
                }
                return mSimulateInEditor;
            }

            set
            {
                if (mSimulateInEditor != value)
                {
                    mSimulateInEditor = value;
                    EditorPrefs.SetBool(kSimulate,value);
                }
            } 
        }
#endif

        private Dictionary<string, string[]> mDependencies = null;
        private Dictionary<string, LoadedAssetBundle> mLoadedAssetBundles = null;
        private Dictionary<string, string> mDownloadingErrors = null;
        private List<string> mDownloadingBundles = null;
        private List<LoadOperation> mInProgressOperations = null;

        private AssetBundleManifest mAssetBundleManifest = null;
        public AssetBundleManifest AssetBundleManifestObj
        {
            set { mAssetBundleManifest = value; }    
        }

        private string[] mActiveVariants = null;
        public string[] ActiveVariants
        {
            get { return mActiveVariants; }
            set { mActiveVariants = value; }
        }


        public void Init()
        {
            mInProgressOperations = new List<LoadOperation>();
            mDownloadingBundles = new List<string>();
            mLoadedAssetBundles = new Dictionary<string, LoadedAssetBundle>();
            mDependencies = new Dictionary<string, string[]>();
            mDownloadingErrors = new Dictionary<string, string>();
        }

        void Update()
        {
            for (int i = 0; i < mInProgressOperations.Count;)
            {
                var operation = mInProgressOperations[i];
                if (operation == null)
                {
                    continue;
                }
                if (operation.Update())
                {
                    i++;
                }
                else
                {
                    mInProgressOperations.RemoveAt(i);
                    ProcessFinishedOperation(operation);
                }
            }
        }

        void ProcessFinishedOperation(LoadOperation operation)
        {
            DownloadLoadOperation download = operation as DownloadLoadOperation;
            if (download == null)
            {
                return;
            }
            if (download.error == null)
            {
                mLoadedAssetBundles.Add(download.assetBundleName, download.assetBundle);
            }
            else
            {
                string msg = string.Format("Failed downloading bungle {0} from {1} : {2}",
                    download.assetBundleName, download.GetAssetURL(), download.error);
                mDownloadingErrors.Add(download.assetBundleName,msg);
            }
            mDownloadingBundles.Remove(download.assetBundleName);
        }

        public LoadAssetOperation LoadAssetAsync(string assetBundleName, string assetName, System.Type type)
        {
            LoadAssetOperation operation = null;
#if UNITY_EDITOR
            //if (SimulateAssetBundleInEditor)
            //{
            //    string[] assetPaths = AssetBundle.GetAssetPathsFromAsse
            //}
            //else
#endif
            {
                assetBundleName = RemapVariantName(assetBundleName);
                LoadAssetBundle(assetBundleName);
                operation = new LoadAssetFullOperation(assetBundleName, assetName, type);
                mInProgressOperations.Add(operation);
            }
            return operation;
        }

        public LoadOperation LoadLevelAsync(string assetBundleName,string levelName,bool isAdditive)
        {
            LoadOperation operation = null;
#if UNITY_EDITOR
            if (mSimulateInEditor)
            {
                operation = new LoadLevelSimulationOperation(assetBundleName,levelName,isAdditive);
            }
            else
#endif
            {
                assetBundleName = RemapVariantName(assetBundleName);
                LoadAssetBundle(assetBundleName);
                operation = new LoadLevelOperation(assetBundleName,levelName,isAdditive);
                mInProgressOperations.Add(operation);
            }
            return operation;
        }

        public void LoadDependencies(string assetBundleName)
        {
            if (mAssetBundleManifest == null)
            {
                Debug.LogError("Please initialize AssetBundleManifest by calling Init()");
                return;
            }

            string[] dependencies = mAssetBundleManifest.GetAllDependencies(assetBundleName);
            if (dependencies == null || dependencies.Length == 0)
            {
                return;
            }


            int len = dependencies.Length;
            for (int i = 0; i < len; ++i)
            {
                dependencies[i] = RemapVariantName(dependencies[i]);
            }

            mDependencies.Add(assetBundleName,dependencies);

            for (int i = 0; i < len; ++i)
            {
                LoadAssetBundleInternal(dependencies[i], false);
            }
        }

        protected void LoadAssetBundle(string assetBundleName)
        {
            LoadAssetBundle(assetBundleName,false);
        }

        protected void LoadAssetBundle(string assetBundleName, bool isLoadingManifest)
        {
#if UNITY_EDITOR
            if (mSimulateInEditor)
                return;
#endif
            //if (!isLoadingManifest)
            //{
            //    if(mAsse)
            //}

            bool isAlreadyProcessed = LoadAssetBundleInternal(assetBundleName, isLoadingManifest);
            if (!isAlreadyProcessed && !isLoadingManifest)
            {
                LoadDependencies(assetBundleName);
            }
        }

        protected bool LoadAssetBundleInternal(string assetBundleName, bool isLoadingManifest)
        {
            LoadedAssetBundle bundle = null;
            //already loaded.
            mLoadedAssetBundles.TryGetValue(assetBundleName, out bundle);
            if (bundle != null)
            {
                bundle.mRefCount++;
                return true;
            }

            if (mDownloadingBundles.Contains(assetBundleName))
            {
                return true;
            }

            WWW www = null;
            string url = LoadUtility.GetBundleBaseURL() + assetBundleName;
            if (isLoadingManifest)
            {
                www = new WWW(url);
            }
            else
            {
                www = WWW.LoadFromCacheOrDownload(url, mAssetBundleManifest.GetAssetBundleHash(assetBundleName), 0);
            }
            mInProgressOperations.Add(new DownloadWebLoadOperation(assetBundleName, www));
            mDownloadingBundles.Add(assetBundleName);
            return false;
        }

        public void UnloadAssetBundle(string assetBundleName)
        {
#if UNITY_EDITOR
            if (mSimulateInEditor)
                return;
#endif
            UnloadAssetBundleInternal(assetBundleName);
            UnloadDependencies(assetBundleName);
        }

        private void UnloadDependencies(string assetBundleName)
        {
            string[] dependencies = null;
            if (!mDependencies.TryGetValue(assetBundleName, out dependencies))
            {
                return;
            }
            for (int i = 0, len = dependencies.Length; i < len; ++i)
            {
                UnloadAssetBundleInternal(dependencies[i]);
            }
            mDependencies.Remove(assetBundleName);
        }

        protected void UnloadAssetBundleInternal(string assetBundleName)
        {
            string error;
            LoadedAssetBundle bundle = GetLoadedAssetBundle(assetBundleName, out error);
            if (bundle == null)
            {
                return;
            }
            if (--bundle.mRefCount == 0)
            {
                bundle.OnUnloadAssetBundle();
                mLoadedAssetBundles.Remove(assetBundleName);
            }
        }

        public string RemapVariantName(string assetBundleName)
        {
            string[] bundlesWithVariant = mAssetBundleManifest.GetAllAssetBundlesWithVariant();

            //get base bundle name
            string baseName = assetBundleName.Split('.')[0];
            
            return "";
        }

        public LoadedAssetBundle GetLoadedAssetBundle(string assetBundleName, out string error)
        {
            if (mDownloadingErrors.TryGetValue(assetBundleName, out error))
            {
                return null;
            }

            LoadedAssetBundle bundle = null;
            if (!mLoadedAssetBundles.TryGetValue(assetBundleName, out bundle))
            {
                return null;
            }

            string[] dependencies = null;
            if (!mDependencies.TryGetValue(assetBundleName, out dependencies))
            {
                return bundle;
            }

            for (int i = 0, len = dependencies.Length; i < len; ++i)
            {
                if (mDownloadingErrors.TryGetValue(dependencies[i], out error))
                {
                    return null;
                }

                LoadedAssetBundle dependentBundle;
                mLoadedAssetBundles.TryGetValue(dependencies[i], out dependentBundle);
                if (dependentBundle == null)
                {
                    return null;
                }
            }
            return bundle;
        }

        public bool IsDownloaded(string assetBundleName)
        {
            return mLoadedAssetBundles.ContainsKey(assetBundleName);
        }
    }
}


