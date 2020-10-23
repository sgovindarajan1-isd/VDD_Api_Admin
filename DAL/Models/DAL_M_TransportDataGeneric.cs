using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_TransportDataGeneric
    {
        public DateTime TimeLineDate { get; set; }
        public DateTime TimeLineTime { get; set; }
        public string Status { get; set; }
        public string TimeLineMessage { get; set; }
    }
}