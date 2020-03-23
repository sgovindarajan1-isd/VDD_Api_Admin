//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.Web.Mvc;
//using System.Web.Routing;
//using DataAccess;

//namespace eCAPDDApi.Infrastructure
//{
//    public class CustomAuthorizeAttribute : AuthorizeAttribute
//    {
//        private readonly string[] allowedroles;
//        public CustomAuthorizeAttribute(params string[] roles)
//        {
//            this.allowedroles = roles;
//        }
//        protected override bool AuthorizeCore(HttpContextBase httpContext)
//        {
//            bool authorize = false;
//            string UserID = Convert.ToString(httpContext.Session["UserId"]);
//            string TIN = Convert.ToString(httpContext.Session["TIN"]);

//            if (VendorSecurity.Login(UserID, TIN))
//            {
//                authorize = true;
//            }
          

//            return authorize;
//        }

//        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
//        {
//            filterContext.Result = new RedirectToRouteResult(
//               new RouteValueDictionary
//               {
//                    { "controller", "Home" },
//                    { "action", "UnAuthorized" }
//               });
//        }
//    }
//}