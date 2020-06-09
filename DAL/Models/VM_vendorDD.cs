using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class VM_vendorDD
    {
        public string vendorname { get; set; }
        public string payeename { get; set; }
        public string ssn { get; set; }

        public int AccountType { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankRoutingNo { get; set; }
        public string FinancialIns { get; set; }
        public string DDNotifiEmail { get; set; }

        public string signername { get; set; }
        public string signertitle { get; set; }
        public string signerphone { get; set; }
        public string signeremail { get; set; }
        public string Confirmation { get; set; }
        public DateTime SubmitDateTime { get; set; }
        public string VendorAttachmentFileName { get; set; }
        public string AttachmentFileName2 { get; set; }

        public List<string> locationIDs { get; set; }
    }
}