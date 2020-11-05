using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{

    public class DAL_M_LocationAddress
    { 
        public string LocationID { get; set; }
        public string Street { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }

    public class DAL_M_Checklist
    {
        public int CheckListID { get; set; }
        public string ConfirmationNumber { get; set; }
        public string CheckListName { get; set; }
        public int Active { get; set; }
        public string LastUpdatedUser { get; set; }
        public string LastUpdateDateTime { get; set; }
    }

    public class DAL_M_VendorDD
    {
        public string Vendorname { get; set; }
        public string Payeename { get; set; }
        public string Ssn { get; set; }
        public string Application { get; set; }  // concadination of conf num and request type
        public string Linked_ConfirmationNum { get; set; }
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
        public string AttachmentFileName_ddwetform { get; set; }
        public string VendorReportFileName { get; set; }
        public string Source_IP { get; set; }
        public string Source_Device { get; set; }
        public string Source_Location { get; set; }
        public string User_agent { get; set; }
        public string Source_Host_Headers { get; set; }


        //  Used in Application summary
        public string VendorNumber { get; set; }
        public string AliasDBAName { get; set; }        
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }

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
        public string SubmitFromWhere { get; set; }
        public string CaseNo { get; set; }
        public string PhoneNumber { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentContactName { get; set; }
        public string DepartmentEmail { get; set; }
        public string DepartmentContactNo { get; set; }
        public string ClosedDate { get; set; }
        public string TaxpayerID { get; set; }
        //

        public List<string> LocationAddress { get; set; }
        public List<string> LocationIDs { get; set; }
        public List<DAL_M_LocationAddress> LocationAddressList { get; set; }
        public List<string> LocationAddressDescList { get; set; }
        public string LastUpdatedUser { get; set; }
        public int DocumentAttachmentTypeId { get; set; }
        public string DocumentAttachmentTypeName { get; set; }
        public string ReturnErrorSuccessMsg { get; set; }
        public int Active{ get; set; }
    }

    public class DAL_M_LinkApplication
    {
        public string ConfirmationNum { get; set; }
        public string Link_ConfirmationNum { get; set; }
        public string Action { get; set; }
        public string LastUpdatedUser { get; set; }
        public string LastUpdateDateTime { get; set; }
    }
}