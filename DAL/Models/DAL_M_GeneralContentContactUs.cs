using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_GeneralContentContactUs
    {
        public int ContentID { get; set; }
        public int Active  { get; set; }
        public string Email { get; set; }
        public string MailingAddress { get; set; }
        public string OfficeHours { get; set; }
        public string Phone { get; set; }
        public string LastUpdatedUser { get; set; }
        public string LastUpdatedDateTime { get; set; }
    }

    public class DAL_M_DenialReason
    {
        public int DenialReasonId { get; set; }
        public string DenialReasonText { get; set; }
        public int Active { get; set; }
        public string Action { get; set; }
        public string LastUpdatedUser { get; set; }
        public string LastUpdatedDateTime { get; set; }
    }
}