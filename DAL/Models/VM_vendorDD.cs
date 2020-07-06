using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class VM_vendorDD
    {
        public string Vendorname { get; set; }
        public string Payeename { get; set; }
        public string Ssn { get; set; }

        public int AccountType { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankRoutingNo { get; set; }
        public string FinancialIns { get; set; }
        public string DDNotifiEmail { get; set; }

        public string Signername { get; set; }
        public string Signertitle { get; set; }
        public string Signerphone { get; set; }
        public string Signeremail { get; set; }
        public string Confirmation { get; set; }
        public DateTime SubmitDateTime { get; set; }
        public string VendorAttachmentFileName { get; set; }
        public string AttachmentFileName2 { get; set; }
        public List<string> LocationIDs { get; set; }
        public string Source_ip { get; set; }
        public string Source_device { get; set; }
        public string User_agent { get; set; }
        public string Host_headers { get; set; }
    }
}