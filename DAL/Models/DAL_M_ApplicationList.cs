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


        // userd for filtering
        public string VendorNumber { get; set; }  // vendor code
        public string PayeeName { get; set; }
        public string Age1 { get; set; }
        public string Age2 { get; set; }
        public string Age3 { get; set; }
        //Filter params for Application list
        public int FilterAge { get; set; }
        public string FilterApptype { get; set; }
        public string FilterUser { get; set; }
        public string FilterStatus { get; set; }
    }
}