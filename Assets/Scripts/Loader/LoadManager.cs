using System;
using UnityEngine;
using System.Collections.Generic;
using Tonny.Common.Utility;

#if UNITY_EDITOR
using UnityEditor;
#endif

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

    public class LoadManager : Singleton<LoadManager>
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

        /// <summary>
        /// 资源的依赖关系
        /// </summary>
        private Dictionary<string, string[]> mDependencies = null;
        /// <summary>
        /// 已经下载完毕的AssetBundle包
        /// </summary>
        private Dictionary<string, LoadedAssetBundle> mLoadedAssetBundles = null;
        /// <summary>
        /// 正在下载中的AssetBundle包
        /// </summary>
        private List<string> mDownloadingBundles = null;
        /// <summary>
        /// 下载的AssetBundle以及AssetBundle包中加载具体资源的队列
        /// </summary>
        private List<LoadOperation> mInProgressOperations = null;


        /// <summary>
        /// 初始化LoadManager
        /// </summary>
        public void Init()
        {
            mInProgressOperations = new List<LoadOperation>();
            mDownloadingBundles = new List<string>();
            mLoadedAssetBundles = new Dictionary<string, LoadedAssetBundle>();
            mDependencies = new Dictionary<string, string[]>();
        }

        /// <summary>
        /// 遍历所有LoadOperation对象，更新队列
        /// </summary>
        public void Update()
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

        /// <summary>
        /// DownloadLoadOperation对象下载完成
        /// 1.将创建LoadedAssetBundle对象；
        /// 2.将LoadedAssetBundle对象加入到已经下载完毕的AssetBundle字典中；
        /// 3.从mDownloadingBundles中移除AssetBundle的key；
        /// </summary>
        /// <param name="operation">DownloadLoadOperation</param>
        void ProcessFinishedOperation(LoadOperation operation)
        {
            DownloadLoadOperation download = operation as DownloadLoadOperation;
            if (download == null)
            {
                return;
            }
            mLoadedAssetBundles.Add(download.assetBundleName, download.assetBundle);
            
            mDownloadingBundles.Remove(download.assetBundleName);
        }

        /// <summary>
        /// 下载Asset的接口.
        /// </summary>
        /// <param name="assetBundleName">Ab名</param>
        /// <param name="assetName">资源名</param>
        /// <returns></returns>
        public LoadAssetOperation LoadAssetAsync(string assetBundleName, string assetName)
        {
            LoadAssetOperation operation = null;
#if UNITY_EDITOR
            if (mSimulateInEditor)
            {
                //string[] assetPaths = AssetBundle.GetAssetPathsFromAsse
            }
            else
#endif
            {
                assetBundleName = RemapVariantName(assetBundleName);
                LoadAssetBundle(assetBundleName);
                operation = new LoadAssetFullOperation(assetBundleName, assetName);
                mInProgressOperations.Add(operation);
            }
            return operation;
        }

        public LoadAssetOperation LoadAssetAsync(string assetBundleName, string[] dependencies, System.Type type)
        {
            return null;
        }

        /// <summary>
        /// 下载level的接口
        /// </summary>
        /// <param name="assetBundleName"></param>
        /// <param name="levelName"></param>
        /// <param name="isAdditive"></param>
        /// <returns></returns>
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

        public void LoadDependencies(string assetBundleName,string[] dependencies)
        {
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
                LoadAssetBundleInternal(dependencies[i]);
            }
        }


        protected void LoadAssetBundle(string assetBundleName)
        {
#if UNITY_EDITOR
            if (mSimulateInEditor)
                return;
#endif
            LoadAssetBundleInternal(assetBundleName);
        }

        protected void LoadAssetBundle(string assetBundleName, string[] assetDependecies)
        {
#if UNITY_EDITOR
            if (mSimulateInEditor)
                return;
#endif
            bool isAlreadyProcessed = LoadAssetBundleInternal(assetBundleName);
            if (!isAlreadyProcessed)
            {
                LoadDependencies(assetBundleName,assetDependecies);
            }
        }

        protected bool LoadAssetBundleInternal(string assetBundleName)
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
           
            string url = LoadUtility.GetBundleBaseURL() + assetBundleName;
            WWW www = www = WWW.LoadFromCacheOrDownload(url, 0); ;
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
            LoadedAssetBundle bundle = GetLoadedAssetBundle(assetBundleName);
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
            //string[] bundlesWithVariant = mAssetBundleManifest.GetAllAssetBundlesWithVariant();

            //get base bundle name
            string baseName = assetBundleName.Split('.')[0];
            
            return "";
        }

        public LoadedAssetBundle GetLoadedAssetBundle(string assetBundleName)
        {
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


