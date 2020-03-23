using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataAccess
{
    public class Common
    {
        // to-do if needed
    }

    public class LogManager
    {
        public static readonly log4net.ILog log =
           log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
    }
}