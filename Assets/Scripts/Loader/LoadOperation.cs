using UnityEngine;
using System.Collections;
using Tonny.Common.Utility;
using System;
using UnityEngine.SceneManagement;

namespace Tonny.Common.AssetLoader
{
    /// <summary>
    /// LoadOperation Base Class
    /// </summary>
    public abstract class LoadOperation : IEnumerator
    {
        public object Current
        {
            get { return null; }
        }

        public bool MoveNext()
        {
            return !IsDone();
        }

        public void Reset()
        {
        }

        public abstract bool Update();
        public abstract bool IsDone();
    }

    public abstract class DownloadLoadOperation : LoadOperation
    {
        private bool done;

        public string assetBundleName
        {
            get; private set;
        }

        public LoadedAssetBundle assetBundle
        {
            get; protected set;
        }

        protected abstract bool downloadIsDone { get; }
        protected abstract void FinishDownload();

        public override bool Update()
        {
            if (!downloadIsDone && downloadIsDone)
            {
                FinishDownload();
                done = true;
            }
            return !done;
        }

        public override bool IsDone()
        {
            return done;
        }

        public abstract string GetAssetURL();

        public DownloadLoadOperation(string assetBundleName)
        {
            this.assetBundleName = assetBundleName;
        }
    }

    public class DownloadWebLoadOperation : DownloadLoadOperation
    {
        WWW _www;
        string _url;

        public DownloadWebLoadOperation(string assetBundleName, WWW www)
            :base(assetBundleName)
        {
            if(www == null)
                throw new System.ArgumentNullException("www");

            _url = www.url;
            this._www = www;
        }

        protected override bool downloadIsDone
        {
            get
            {
                return (_www == null) || _www.isDone;
            }
        }

        protected override void FinishDownload()
        {
            if (!string.IsNullOrEmpty(_www.error))
            {
                Debug.LogError(string.Format("Asset load error! Message:{0}",_www.error));
                return;
            }
            AssetBundle bundle = _www.assetBundle;
            if (bundle == null)
            {
                Debug.LogError(string.Format("{0} is not a valid asset bundle.", assetBundleName));
            }
            else
            {
                assetBundle = new LoadedAssetBundle(_www.assetBundle);
            }
            _www.Dispose();
            _www = null;
        }

        public override string GetAssetURL()
        {
            return _url;
        }
    }

    #region Load Level
    public class LoadLevelSimulationOperation : LoadOperation
    {
        private AsyncOperation mOperation;

        public LoadLevelSimulationOperation(string assetBundleName,string levelName,bool isAdditive)
        {
            //string[] levelPaths = UnityEditor.AssetDatabase.GetAssetPathsFromAssetBundleAndAssetName(assetBundleName, levelName);
            string levelPath = "";
            if (string.IsNullOrEmpty(levelPath))
            {
                Debug.LogError("There is no scene with name -" + levelName + "- in " + assetBundleName);
                return;
            }
            Scene scene = SceneManager.GetSceneByPath(levelPath);
            if (isAdditive)
            {
                SceneManager.LoadSceneAsync(scene.name, LoadSceneMode.Additive);
            }
            else
            {
                SceneManager.LoadSceneAsync(scene.name, LoadSceneMode.Single);
            }
        }

        public override bool Update()
        {
            return false;
        }

        public override bool IsDone()
        {
            return mOperation == null || mOperation.isDone;
        }
    }

    public class LoadLevelOperation : LoadOperation
    {
        private string mAssetBundleName;
        private string mLevelName;
        private bool mIsAdditive;
        private string mDownloadingError;
        private AsyncOperation mOperation;

        public LoadLevelOperation(string assetbundleName, string levelName, bool isAdditive)
        {
            mAssetBundleName = assetbundleName;
            mLevelName = levelName;
            mIsAdditive = isAdditive;
        }

        public override bool Update()
        {
            if (mOperation != null)
            {
                return false;
            }
            LoadedAssetBundle bundle = LoadManager.Instance.GetLoadedAssetBundle(mAssetBundleName);
            if (bundle != null)
            {
                LoadSceneMode mode = mIsAdditive ? LoadSceneMode.Additive : LoadSceneMode.Single;
                mOperation = SceneManager.LoadSceneAsync(mLevelName, mode);
                return false;
            }
            else
            {
                return true;
            }
        }

        public override bool IsDone()
        {
            if (mOperation == null && mDownloadingError != null)
            {
                Debug.LogError(mDownloadingError);
                return true;
            }
            return mOperation != null && mOperation.isDone;
        }
    }
    #endregion

    #region Load Asset
    /// <summary>
    /// Base Class of Load Asset
    /// </summary>
    public abstract class LoadAssetOperation : LoadOperation
    {
        public abstract T GetAsset<T>() where T : UnityEngine.Object;
    }

    public class LoadAssetSimulationOperation : LoadAssetOperation
    {
        private UnityEngine.Object mObject;

        public LoadAssetSimulationOperation(UnityEngine.Object sObject)
        {
            mObject = sObject;
        }

        public override T GetAsset<T>()
        {
            return mObject as T;
        }

        public override bool Update()
        {
            return false;
        }

        public override bool IsDone()
        {
            return true;
        }
    }

    public class LoadAssetFullOperation : LoadAssetOperation
    {
        private string mAssetBundleName;
        private string mAssetName;
        protected AssetBundleRequest mBundleRequest = null;

        public LoadAssetFullOperation(string bundleName, string assetName)
        {
            mAssetBundleName = bundleName;
            mAssetName = assetName;
        }

        public override T GetAsset<T>()
        {
            if (mBundleRequest != null && mBundleRequest.isDone)
            {
                return mBundleRequest.asset as T;
            }
            else
            {
                return null;
            }
        }

        public override bool Update()
        {
            if (mBundleRequest != null)
            {
                return false;
            }

            LoadedAssetBundle bundle = LoadManager.Instance.GetLoadedAssetBundle(mAssetBundleName);
            if (bundle != null)
            {
                mBundleRequest = bundle.mAssetBundle.LoadAssetAsync(mAssetName);
                return false;
            }
            else
            {
                return true;
            }
        }

        public override bool IsDone()
        {
            if (mBundleRequest == null)
            {
                return false;
            }
            return mBundleRequest != null && mBundleRequest.isDone;
        }
    }
    #endregion
}

