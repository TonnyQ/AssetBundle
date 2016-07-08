using UnityEngine;

namespace Tonny.Common.Utility
{
    public class MonoSingleton<T> : MonoBehaviour where T : MonoBehaviour
    {
        private static object _lock = new object();

        private static T _instance;
        public static T Instance
        {
            get
            {
                if (applicationIsQuitting)
                {
                    return null;
                }

                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = (T)FindObjectOfType(typeof(T));
                        if (_instance == null)
                        {
                            GameObject singleton = new GameObject("(singleton) " + typeof(T));
                            _instance = singleton.AddComponent<T>();
                            _transform = singleton.transform;
                            DontDestroyOnLoad(singleton);
                        }
                    }
                    return _instance;
                }
            }
        }

        private static Transform _transform;
        public static Transform node
        {
            get
            {
                return _transform;
            }
        }

        private static bool applicationIsQuitting = false;

        public void OnDestroy()
        {
            applicationIsQuitting = true;
        }
    }
}

