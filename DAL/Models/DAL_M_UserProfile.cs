using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_UserProfile
    {
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string Department { get; set; }
        public string UserStatus { get; set; }
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
        public string PermissionId { get; set; }
        public string PermissionName { get; set; }
    }
}