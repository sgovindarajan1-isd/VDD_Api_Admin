using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Owin;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;


namespace eCAPDDApi
{
    public static class WebApiConfig
    {
        public static string UrlPrefix { get { return "api"; } }
        public static string UrlPrefixRelative { get { return "~/api"; } }

        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Srini-Commment : This Order important to habe multiple get and post method,   Web Api checks for matching route from top to bottom and hence your default route matches for all requests

            //config.SuppressDefaultHostAuthentication();

            //config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            GlobalConfiguration.Configuration.Filters.Add(new BasicAuthenticationAttribute());


           // config.EnableCors();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "ApiById",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );

            config.Routes.MapHttpRoute(
              name: "ApiByName",
              routeTemplate: "api/{controller}/{action}/{name}",
              defaults: new { namespaces = new string[] { } },
              constraints: new { name = @"^[a-z]+$" }
              );

            config.Routes.MapHttpRoute(
               name: "DefaultApiWithAction",
               routeTemplate: "api/{controller}/{action}/",
               defaults: null
               );

            config.Routes.MapHttpRoute(
                name: "conDefaultApi",
                routeTemplate: WebApiConfig.UrlPrefix + "/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );

            EnableCorsAttribute cors = new EnableCorsAttribute("*", "*", "*" );
            config.EnableCors(cors);

            //config.Routes.MapHttpRoute(
            //   name: "ApiByName",
            //   routeTemplate: "api/{controller}/{action}/{name}",
            //   defaults: new { namespaces = new string[] {"eCAPDDApi.Controllers" }}              
            //   //constraints: new { name = @"^[a-z]+$" }
            //   );



            //config.Routes.MapHttpRoute("DefaultApiGet",
            //                    "api/{controller}",
            //                    new { action = "Get" },
            //                    new { httpMethod = new HttpMethodConstraint(HttpMethod.Get) });


            //config.Routes.MapHttpRoute("DefaultApiWithAction",
            //                            "api/{controller}/{action}/");

            //config.Routes.MapHttpRoute("DefaultApiWithActionAndId",
            //                            "api/{controller}/{action}/{id}",
            //                            new { id = RouteParameter.Optional },
            //                            new { id = @"\d+(_\d+)?" });
        }
    }
}
