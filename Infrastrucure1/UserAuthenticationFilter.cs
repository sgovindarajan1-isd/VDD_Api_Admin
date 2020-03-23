//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.Web.Mvc;
//using System.Web.Mvc.Filters;

//namespace eCAPDDApi.Infrastrucure1
//{
//    public class UserAuthenticationFilter : ActionFilterAttribute, IAuthenticationFilter
//    {
//        public void OnAuthentication(AuthenticationContext filterContext)
//        {
//            if (string.IsNullOrEmpty(Convert.ToString(filterContext.HttpContext.Session["UserID"])))
//            {
//                filterContext.Result = new HttpUnauthorizedResult();
//            }
//        }

     
//        public void OnAuthenticationChallenge(AuthenticationChallengeContext filterContext)
//        {
//            //We are checking Result is null or Result is HttpUnauthorizedResult 
//            // if yes then we are Redirect to Error View
//            if (filterContext.Result == null || filterContext.Result is HttpUnauthorizedResult)
//            {
//                filterContext.Result = new ViewResult
//                {
//                    ViewName = "Error"
//                };
//            }
//        }
//    }
//}