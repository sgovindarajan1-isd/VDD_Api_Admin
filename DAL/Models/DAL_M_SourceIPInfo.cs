using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_SourceIPInfo
    {
        public string ContinentCode { get; set; }

        public string ContinentName { get; set; }

        public string CountryCode { get; set; }

        public string CountryName { get; set; }

        public string StateProvCode { get; set; }

        public string StateProv { get; set; }

        public string City { get; set; }

        public string Source_IP { get; set; }

        public string Source_Location { get; set; }

        public string Source_Device { get; set; }

        public string Source_Host_Headers { get; set; }
        public string SourceServerName { get; set; }

        public string Source_User_Agent { get; set; }

    }

}