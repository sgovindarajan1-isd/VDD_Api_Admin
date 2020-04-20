﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eCAPDDApi.Models
{
    public class VM_r_vend_user
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
        public string VendorAddress { get; set; }
        public string RoutingNumber { get; set; }
        public string AcccountNo { get; set; }
        public string AccountType { get; set; }
        public string RemittanceEmail { get; set; }
        public string Status { get; set; }
        
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
}