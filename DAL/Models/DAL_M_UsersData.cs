using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_UsersData
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmployeeNumber { get; set; }
        public int IsActive { get; set; }
        public string IsActive_Yes_No { get; set; }
        public string DisbursementCategory { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string LastUpdatedDateTime { get; set; }
        public int IsAdmin { get; set; }
        public int IsSupervisor { get; set; }
        public int IsProcessor { get; set; }
        public int IsDataEntry { get; set; }
        public List<DAL_M_Role> RoleList { get; set; }
    }

    public class DAL_M_Role
    {
        public string UserId { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int Active { get; set; }
    }


}