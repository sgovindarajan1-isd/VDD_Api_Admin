using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Data;
using eCAPDDApi.infrastrure;

namespace eCAPDDApi.Controllers
{
    public class ReportController : Controller
    {
        public ActionResult _partialReport()
        {
            return View();
        }

        private string PDFExport(LocalReport report, string rptPathandFileName, string rptFileName)
        {
            try
            {
                string[] streamids;
                string mimetype;
                string encod;
                string fextension;
                string deviceInfo =
                  "<DeviceInfo>" +
                  "  <OutputFormat>EMF</OutputFormat>" +
                  "  <PageWidth>8.5in</PageWidth>" +
                  "  <PageHeight>11in</PageHeight>" +
                  "  <MarginTop>0.25in</MarginTop>" +
                  "  <MarginLeft>0.25in</MarginLeft>" +
                  "  <MarginRight>0.25in</MarginRight>" +
                  "  <MarginBottom>0.25in</MarginBottom>" +
                  "</DeviceInfo>";
                Warning[] warnings;
 
                byte[] bytes = report.Render("PDF", deviceInfo, out mimetype, out encod, out fextension, out streamids, out warnings);
                string localPath = AppDomain.CurrentDomain.BaseDirectory;
                System.IO.File.WriteAllBytes(rptPathandFileName, bytes);

                return rptFileName;
            }
            catch (Exception ex)
            {
                return "error "+ ex.Message+ " -*- "+ rptPathandFileName + " -*- " + rptFileName;
            }
        }

        public DataTable createVendorDataTable(DAL.Models.DAL_M_VendorDD  vendordetails)
        {
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("VendorNumber");
            dt.Columns.Add("VendorName");
            dt.Columns.Add("ssn");
            dt.Columns.Add("DDNotifiEmail");
            dt.Columns.Add("AccountType");
            dt.Columns.Add("BankAccountNumber");
            dt.Columns.Add("BankRoutingNo");
            dt.Columns.Add("FinancialIns");
            dt.Columns.Add("Signeremail");
            dt.Columns.Add("Signername");
            dt.Columns.Add("Signerphone");
            dt.Columns.Add("Signertitle");
            dt.Columns.Add("VendorAttachmentFileName");
            dt.Columns.Add("SubmittedDate");
            dt.Columns.Add("TotalAttachment");
            dt.Columns.Add("ConfirmationNumber");
            DataRow dr = dt.NewRow();
            dr["VendorNumber"] = vendordetails.Vendorname;
            dr["VendorName"] = vendordetails.Payeename;

            dr["ssn"] = getMaskedSSN(vendordetails.Ssn);
            dr["DDNotifiEmail"] = vendordetails.DDNotifyEmail;
            if (vendordetails.AccountType == 1)
                dr["AccountType"] = "Checking";
            else if (vendordetails.AccountType == 2)
                dr["AccountType"] = "Saving";
            else
                dr["AccountType"] = "Error";
            dr["BankAccountNumber"] = vendordetails.BankAccountNumber;
            dr["BankRoutingNo"] = vendordetails.BankRoutingNo;
            dr["FinancialIns"] = vendordetails.FinancialIns;
            dr["Signeremail"] = vendordetails.Signeremail;
            dr["Signername"] = vendordetails.Signername;
            dr["Signerphone"] = vendordetails.Signerphone;
            dr["Signertitle"] = vendordetails.Signertitle;
            dr["VendorAttachmentFileName"] = vendordetails.VendorAttachmentFileName;
            
            dr["TotalAttachment"] = "Total: 1";
            dr["SubmittedDate"] = "SubmittedDate: " + vendordetails.SubmitDateTime.ToString();
            dr["ConfirmationNumber"] = vendordetails.Confirmation;
            dt.Rows.Add(dr);
            return dt;
        }

        public string getMaskedSSN(string ssn) {
            if (ssn.Trim().Length < 9) {
                return ssn;
            }
            else
            {
                return "***-**-" + ssn.Substring(ssn.Trim().Length - 4, 4);
            }
        }


        public DataTable createLocationDataTable(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            if (vendordetails.LocationAddressDescList.Count <= 0)
                return null;
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("LocationAddress");
            
            int cnt = 1;
            foreach (string locadd in vendordetails.LocationAddressDescList)
            {
                if (locadd != null && locadd != string.Empty)
                {
                    DataRow dr = dt.NewRow();
                    dr["LocationAddress"] = cnt.ToString() + ". " + locadd;
                    cnt++;
                    dt.Rows.Add(dr);
                }
            }

            return dt;
        }

        public ActionResult ShowReport(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            LogWriter logw = new LogWriter("ValuesController entry");

            string uploadPath = System.Configuration.ConfigurationManager.AppSettings["Uploadpath"];  //  here is the path where  vendorreport file will be saved
            //string uploadFileName = Path.Combine(Server.MapPath("~/" + uploadPath + "/ "), vendordetails.VendorReportFileName);
            string uploadFileName = System.Web.HttpContext.Current.Server.MapPath("~/" + uploadPath + "/" + vendordetails.VendorReportFileName);
            ReportViewer viewer = new ReportViewer();
            viewer.ProcessingMode = ProcessingMode.Local;
            viewer.SizeToReportContent = true;
            viewer.SizeToReportContent = true;
            viewer.AsyncRendering = true;
            viewer.LocalReport.ReportPath = "VendorAuthorizationForm.rdlc";
            DataTable vdt = createVendorDataTable(vendordetails);
            ReportDataSource rds = new ReportDataSource("VendorDataSet", vdt);
            // location ds
            DataTable ldt = createLocationDataTable(vendordetails);
            ReportDataSource lds = new ReportDataSource("VendorDataLocDataSet", ldt);

            viewer.LocalReport.DataSources.Clear();
            viewer.LocalReport.DataSources.Add(rds);
            viewer.LocalReport.DataSources.Add(lds);
            string retFileName = PDFExport(viewer.LocalReport, uploadFileName, vendordetails.VendorReportFileName);
            return Json(retFileName);
        }
    }
}
