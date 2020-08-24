using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_ApplicationList
    {
        public string UserId { get; set; }
        public string ConfirmationNum { get; set; }
        public string VendorName { get; set; }
        public string ReceivedDate { get; set; }
        public string AssignedDate { get; set; }
        public string ApplicationAge { get; set; }
        public string StatusCode { get; set; }
        public string StatusDesc { get; set; }
        public string RequestType { get; set; }
        public string Age { get; set; }
        public string AgeCount { get; set; }
    }
}