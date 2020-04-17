using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class VM_Vendor
    {
        // public int VendorId { get; set; }
        public string VendorNumber { get; set; }
        public string VendorName { get; set; }
        public string VendorAddress { get; set; }
        public string RoutingNumber { get; set; }
        public string AcccountNo { get; set; }
        public string AccountType { get; set; }
        public string RemittanceEmail { get; set; }
        public string Status { get; set; }
    }
}

