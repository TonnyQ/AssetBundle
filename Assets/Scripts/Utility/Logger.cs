using UnityEngine;
using System.Collections;
using System;

namespace Tonny.Common.Utility
{
    public static class Logger
    {
        public static bool LogEnable
        {
            set { Debug.logger.logEnabled = value; }
        }

        public static LogType FilterLogType
        {
            set { Debug.logger.filterLogType = value; }
        }

        public static void Log(object message)
        {
            Debug.Log(message);
        }

        public static void LogWarning(object message)
        {
            Debug.LogWarning(message);
        }

        public static void LogError(object message)
        {
            Debug.LogError(message);
        }

        public static void LogException(Exception message)
        {
            Debug.LogException(message);
        }
    }

}

