using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{

    public class DAL_M_LocationAddress
    {
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
    }
    public class DAL_M_VendorDD
    {
        public string Vendorname { get; set; }
        public string Payeename { get; set; }
        public string Ssn { get; set; }

        public int AccountType { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankRoutingNo { get; set; }
        public string FinancialIns { get; set; }
        public string DDNotifyEmail { get; set; }

        public string Signername { get; set; }   //AuthorizedName
        public string Signertitle { get; set; }  //AuthorizedTitle
        public string Signerphone { get; set; } //AuthorizedPhone
        public string Signeremail { get; set; }  //AuthorizedEmail
        public string Confirmation { get; set; }
        public DateTime SubmitDateTime { get; set; }
        public string VendorAttachmentFileName { get; set; }
        public string VendorReportFileName { get; set; }
        public List<string> LocationIDs { get; set; }
        public string Source_ip { get; set; }
        public string Source_device { get; set; }
        public string User_agent { get; set; }
        public string Host_headers { get; set; }

        //  Used in Application summary
        public string VendorNumber { get; set; }
        public string AliasDBAName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string SSN { get; set; }  //TaxpayerIDNumber

        public string AccountTypeDesc { get; set; }
        public string RequestType { get; set; }
        public string RequestDate { get; set; }
        public string AuthorizedPhoneExt { get; set; }
        public string Comment { get; set; }
        public string ReasonType{ get; set; }

        public string OfficeNotes { get; set; }
        public int Status { get; set; }
        public string StatusDesc { get; set; }
        
        public string ProcessorID { get; set; }
        public string AssignedBy { get; set; }
        public string AssignmentDate { get; set; }

        //  Draft submission informations
        public string AliasDBA { get; set; }
        public string TaxpayerID { get; set; }
        public string CaseNo { get; set; }
        public string PhoneNumber { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentContactName { get; set; }
        public string DepartmentEmail { get; set; }
        public string DepartmentContactNo { get; set; }
        public string ClosedDate { get; set; }
        //

        public List<string> LocationAddress { get; set; }
        public List<DAL_M_LocationAddress> LocationAddressList { get; set; }
        public string LastUpdatedUser { get; set; }
        public int DocumentAttachmentTypeId { get; set; }
        public string DocumentAttachmentTypeName{ get; set; }

    }
}