using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.IO;
using System.Net;
using System.Xml;
using eCAPDDApi.Models;

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
                        //fname = Path.Combine(Server.MapPath("~/" + Uploadpath + "/"), fname);
                        string DDMSFilePath = System.Configuration.ConfigurationManager.AppSettings["DDMSFilePath"];
                        fname = DDMSFilePath + "\\" + fname;

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

                XmlNodeList iNodeList = xmlDoc.SelectNodes("//Institutions");

                if (iNodeList.Count > 0)
                {
                    XmlNode node = iNodeList[0];
                    bankName = node.InnerText;
                }

            }
            catch (Exception ex)
            {
                //if (ex.Message == "No banks found!")
                bankName = "No banks found";
            }

            return bankName;
        }

        //[HttpPost]
        //[BasicAuthenticationAttribute]
        public FileResult GetPdf(string attachmentFileName){
            string domName = HttpContext.Request.Url.Host;
           // if (User.Identity.IsAuthenticated)
           // {
                string filePath = System.Configuration.ConfigurationManager.AppSettings["DDMSFilePath"] + attachmentFileName;
                Response.AddHeader("Content-Disposition", "inline; filename=" + attachmentFileName);
                return File(filePath, "multipart/form-data");// "application/pdf");
           //if (System.IO.File.Exists(filePath)) {
           //    string FinalPDFFile = attachmentFileName;
           //}
           // }
           // else
           //     return null;
        }


        [HttpPost]
        public ActionResult downloadFile_Ajax(IdTextClass fileInfo) { // FileResult
            string filePath = System.Configuration.ConfigurationManager.AppSettings["DDMSFilePath"] + fileInfo.IdText;// attachmentFileName;
            Response.AddHeader("Content-Disposition", "inline; filename=" + fileInfo.IdText); //attachmentFileName);
            //return Json(File(filePath, "multipart/form-data"));// "application/pdf");
            return File(filePath, "multipart/form-data");// "application/pdf");

            //var file = db.EmailAttachmentReceived.FirstOrDefault(x => x.LisaId == studentId);
            //byte[] fileBytes = System.IO.File.ReadAllBytes(file.Filepath);
            //return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, file.Filename);

            //if (System.IO.File.Exists(filePath)) {
            //    string FinalPDFFile = attachmentFileName;
            //}
        }
    }
}