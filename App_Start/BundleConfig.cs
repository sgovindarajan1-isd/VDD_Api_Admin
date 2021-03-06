﻿using System.Web;
using System.Web.Optimization;

namespace eCAPDDApi
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"
                      , "~/Scripts/App/DataTable/dataTables.bootstrap4.min.js"
                      , "~/Scripts/App/DataTable/jquery.dataTables.min.js"
                      , "~/Scripts/App/DataTable/dataTables.select.min.js")

                );

            bundles.Add(new ScriptBundle("~/bundles/vddAdmin").Include(
                     "~/Scripts/App/adminmain.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/DataTable/jquery.dataTables.min.css",
                      "~/Content/DataTable/select.dataTables.min.css",
                      "~/Content/site.css",
                      "~/Content/login.css",
                      "~/Content/mainmenu.css"
                      //"~/Content/css.css"
                      )

                );

        }
    }
}
