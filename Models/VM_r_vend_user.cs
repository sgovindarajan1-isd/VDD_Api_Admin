using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eCAPDDApi.Models
{
    public class VM_R_Vend_User
    {
        public string UserId { get; set; }
        public string Tin { get; set; }
        public bool   IsValidUser { get; set; }
        public string UserName { get; set; }
        public string ValidateToken  { get; set; }
        public int PayeeId { get; set; }
    }

    public class VM_Vendor
    {
        public int VendorId { get; set; }
        public int PayeeId { get; set; }
        public string VendorNumber { get; set; }
        public string VendorName { get; set; }
        public string LocationID { get; set; }
        public string VendorAddress { get; set; }
        public string RoutingNumber { get; set; }
        public string AcccountNo { get; set; }
        public string AccountType { get; set; }
        public string RemittanceEmail { get; set; }
        public string Status { get; set; }
    }

    public class VM_AdminUser
    {
        public string UserId { get; set; }
        public string Password { get; set; }
        public string Status { get; set; }
        public bool IsValidUser{ get; set; }
        public string ErrorMessage { get; set; }

        // used to get application list by status
        public string PendingAssignmentStatus { get; set; }
        public string MyapprovalStatus { get; set; }
        public string Age1 { get; set; }
        public string Age2 { get; set; }
        public string Age3 { get; set; }
        //Filter params for Application list
        public int FilterAge { get; set; } 
        public string FilterApptype { get; set; }
        public string FilterUser { get; set; }
        public string FilterStatus { get; set; }
    }

    public class VM_contactus {
        public string Company { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string UserId { get; set; }
    }

    public class VM_vendorDD
    {
        public string Vendorname { get; set; }
        public string Payeename { get; set; }
        public string SSN { get; set; }
        public int AccountType { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankRoutingNo { get; set; }
        public string FinancialIns { get; set; }
        public string DDNotifiEmail { get; set; }
        public string SignerName { get; set; }
        public string SignerTitle { get; set; }
        public string SignerPhone { get; set; }
        public string SignerEmail { get; set; }
        public string Confirmation { get; set; }
        public DateTime SubmitDateTime { get; set; }
        public List<string> LocationIDs { get; set; }

        public string ReturnErrorSuccessMsg { get; set; }


    }
}