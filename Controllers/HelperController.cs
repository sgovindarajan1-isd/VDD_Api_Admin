using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.IO;
using System.Net;
using System.Xml;

namespace eCAPDDApi.Controllers
{
    public class HelperController : Controller
    {
        // GET: Helper
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadAttachmentFile()
        {
            string fname = string.Empty;
            string Uploadpath = string.Empty;
            // Checking no of files injected in Request object  
            if (Request.Files.Count > 0)
            {
                string modifiedFilename = Request.Form["modifiedFilename"];
                if (modifiedFilename == null)
                {
                    modifiedFilename = Request.Form["modifiedFilename_ddwetform"];
                }
                try
                {
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];

                        // Checking for Internet Explorer  
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = modifiedFilename;
                        }

                        Uploadpath = System.Configuration.ConfigurationManager.AppSettings["Uploadpath"];
                        fname = Path.Combine(Server.MapPath("~/" + Uploadpath + "/"), fname);
                        file.SaveAs(fname);
                    }
                    // Returns message that successfully uploaded  
                    return Json(modifiedFilename);
                }
                catch (Exception ex)
                {
                    return Json("Error");
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }

        public string ValidateRoughtingNumber(string aba)
        {
            string bankName = string.Empty;
            try
            {
                abaService.ABAServiceSoapClient abaWebService = new abaService.ABAServiceSoapClient("ABAServiceSoap");
                string token = abaWebService.Logon(3387, "lacounty".Trim(), "RXdqmYHg".Trim());
                bool validRouting = abaWebService.VerifyABA(token, aba);


                string xml = abaWebService.GetBanksPrimarySortXML(token, aba);
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xml);
                //XmlNodeList nodeList = xmlDoc.SelectNodes("//InstitutionName[@type='M']");
                XmlNodeList nodeList = xmlDoc.SelectNodes("//InstitutionName[@type='B']");

                if (nodeList.Count > 0)
                {
                    XmlNode node = nodeList[0];
                    if (node.InnerText.Length > 40)
                    {
                        bankName = node.InnerText.Substring(0, 40);
                    }
                    else
                    {
                        bankName = node.InnerText;
                    }
                }
            }
            catch (Exception ex)
            {
                //if (ex.Message == "No banks found!")
                bankName = "No banks found";
            }

            return bankName;
        }


    }
}