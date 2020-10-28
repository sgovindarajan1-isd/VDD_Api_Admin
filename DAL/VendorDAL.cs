using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using DAL.Models;
using System.Data;

namespace DAL
{
    public static class DBconnection
    {
        public static SqlConnection Open()
        {
            try
            {
                string ConnectionStrVDD = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionStrVDD"].ConnectionString;
                SqlConnection con = new SqlConnection(ConnectionStrVDD);
                con.Open();
                return con;
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Openning DB Connection.  Message: " + ex.Message);
                return null;
            }
        }
    }

    public class VendorSecurity
    {
        public static bool Login(string UserId, string TIN)
        {
            VendorDAL cls = new VendorDAL();
            return true;
        }
    }

    public class VendorDAL
    {
        public List<DAL_M_Vendor> GetVendorDetailsByName(string vendorNumber)
        {
            List<DAL_M_Vendor> lst_VM_Vendor = new List<DAL_M_Vendor>();
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetLocationsby_vend_cust_id", con);
                    sqlComm.Parameters.AddWithValue("@VendorNumber", vendorNumber);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_Vendor v = new DAL_M_Vendor();
                        v.VendorNumber = ds.Tables[0].Rows[i]["VendorNumber"].ToString(); 
                        v.LocationID = ds.Tables[0].Rows[i]["LocationID"].ToString(); 
                        v.VendorAddress = ds.Tables[0].Rows[i]["Address"].ToString(); 
                        v.RoutingNumber = ds.Tables[0].Rows[i]["BankRountingNumber"].ToString();
                        v.AcccountNo = ds.Tables[0].Rows[i]["BankAccountNumber"].ToString();
                        v.AccountType = ds.Tables[0].Rows[i]["DDAccountType"].ToString();
                        v.RemittanceEmail = ds.Tables[0].Rows[i]["DDNotifyEmail"].ToString();
                        v.Status = ds.Tables[0].Rows[i]["DDStatus"].ToString();
                        lst_VM_Vendor.Add(v);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetVendorDetailsByName.  Message: " + ex.Message);
            }
            return lst_VM_Vendor;
        }

        public Tuple<string, bool> ValidateUserbyuid_pwd(string user_id, string tin)
        {
            Tuple<string, bool> ret = null;
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("Validate_Vendor", con);
                    sqlComm.Parameters.AddWithValue("@Username", user_id);
                    sqlComm.Parameters.AddWithValue("@Password", tin);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0]["VendorName"].ToString() != string.Empty)
                        {
                            ret = new Tuple<string, bool>(ds.Tables[0].Rows[0]["VendorName"].ToString(), true);
                        }
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error(ex.Message);
            }
            return ret;
        }

 
        public string  GetApplicationStatus(string  confirmationNumber)
        {
            string ret = "Status not Found!";
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    DataSet ds = new DataSet("status");
                    SqlCommand sqlComm = new SqlCommand("GetApplicationStatus", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", confirmationNumber);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0]["StatusDesc"].ToString() != string.Empty)
                        {
                            ret = ds.Tables[0].Rows[0]["StatusDesc"].ToString();
                        }
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error(ex.Message);
                ret = "Error in Status Check!";
            }

            return ret;
        }

        public string PostContactus(DAL_M_ContactUs vmcontactus) {
            string userid = string.Empty;
            if (vmcontactus.UserId != null)
                userid = vmcontactus.UserId;

            try
            {
                DataSet ds = new DataSet("ContactUs");
                using (SqlConnection con = DBconnection.Open())
                {
                        SqlCommand sqlComm = new SqlCommand("SubmitContactUsDetails", con);
                        sqlComm.Parameters.AddWithValue("@Company", vmcontactus.Company);
                        sqlComm.Parameters.AddWithValue("@FirstName", vmcontactus.FirstName);
                        sqlComm.Parameters.AddWithValue("@LastName", vmcontactus.LastName);
                        sqlComm.Parameters.AddWithValue("@Email", vmcontactus.Email);

                        sqlComm.Parameters.AddWithValue("@Phone", vmcontactus.Phone);   
                        sqlComm.Parameters.AddWithValue("@Category", vmcontactus.Subject);
                        sqlComm.Parameters.AddWithValue("@Comments", vmcontactus.Message);

                        sqlComm.Parameters.AddWithValue("@LastUpdatePersonID", userid);
                        sqlComm.Parameters.AddWithValue("@LastUpdateDateTime", DateTime.Now);

                        sqlComm.CommandType = CommandType.StoredProcedure;
                        sqlComm.ExecuteNonQuery();
                    
                    con.Close();
                }

            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in SubmitContactUsDetails.  Message: " + ex.Message);
                return null;
            }
            return "SUCCESS";
        }

        private DataTable CreateTable()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ConfirmationNum", typeof(string));
            dt.Columns.Add("VEND_CUST_CD", typeof(string));
            dt.Columns.Add("AD_ID", typeof(string));
            dt.Columns.Add("Active", typeof(Int32));
            dt.Columns.Add("Address1", typeof(string));
            dt.Columns.Add("Address2", typeof(string));
            dt.Columns.Add("City", typeof(string));
            dt.Columns.Add("State", typeof(string));
            dt.Columns.Add("ZipCode", typeof(string));

            return dt;
        }

        public Tuple<string, string> SubmitVendor(DAL_M_VendorDD vmvendorDD)
        {
            try
            {
                DataTable reqDetails = CreateTable();
                if (vmvendorDD.LocationAddressList == null)
                {
                    foreach (string locid in vmvendorDD.LocationIDs)
                    {
                        reqDetails.Rows.Add(vmvendorDD.Confirmation, vmvendorDD.Vendorname, locid, 1, "","","","","");
                    }
                }
                else
                {
                    foreach (DAL_M_LocationAddress loc in vmvendorDD.LocationAddressList)
                    {
                        reqDetails.Rows.Add(vmvendorDD.Confirmation, vmvendorDD.Vendorname, loc.LocationID, 1, loc.Address1, loc.Address2, loc.City, loc.State, loc.ZipCode);
                    }
                }
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    {
                        SqlCommand sqlComm = new SqlCommand("SubmitVendorDetails", con);
                        sqlComm.Parameters.AddWithValue("@VEND_CUST_CD", vmvendorDD.Vendorname);
                        sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);//vmvendorDD.Confirmation)
                        sqlComm.Parameters.AddWithValue("@RequestDate", vmvendorDD.SubmitDateTime);

                        sqlComm.Parameters.AddWithValue("@Status", 5);  //  5 pending 
                        sqlComm.Parameters.AddWithValue("@DDNotifyEmail", vmvendorDD.DDNotifyEmail);
                        sqlComm.Parameters.AddWithValue("@AccountType", vmvendorDD.AccountType);
                        sqlComm.Parameters.AddWithValue("@AccountNumber", vmvendorDD.BankAccountNumber);

                        sqlComm.Parameters.AddWithValue("@RoutingNumber", vmvendorDD.BankRoutingNo);
                        sqlComm.Parameters.AddWithValue("@FinInstName", vmvendorDD.FinancialIns);
                        sqlComm.Parameters.AddWithValue("@AuthorizedName", vmvendorDD.Signername);
                        sqlComm.Parameters.AddWithValue("@AuthorizedTitle", vmvendorDD.Signertitle);

                        sqlComm.Parameters.AddWithValue("@AuthorizedPhone", vmvendorDD.Signerphone);
                        sqlComm.Parameters.AddWithValue("@AuthorizedPhoneExt", "");
                        sqlComm.Parameters.AddWithValue("@AuthorizedEmail", vmvendorDD.Signeremail);
                        sqlComm.Parameters.AddWithValue("@LastUpdateDateTime", vmvendorDD.SubmitDateTime);
                        sqlComm.Parameters.AddWithValue("@RequestType", vmvendorDD.RequestType);
                        sqlComm.Parameters.AddWithValue("@TableTypeRequestDetail", reqDetails);

                        sqlComm.Parameters.AddWithValue("@SubmitFromWhere", vmvendorDD.SubmitFromWhere);
                        sqlComm.Parameters.AddWithValue("@PayeeName", vmvendorDD.Payeename);
                        sqlComm.Parameters.AddWithValue("@FirstName", vmvendorDD.FirstName);
                        sqlComm.Parameters.AddWithValue("@MiddleName", vmvendorDD.MiddleName);
                        sqlComm.Parameters.AddWithValue("@LastName", vmvendorDD.LastName);
                        sqlComm.Parameters.AddWithValue("@CompanyName", vmvendorDD.CompanyName);
                        sqlComm.Parameters.AddWithValue("@AliasDBA", vmvendorDD.AliasDBAName);
                        sqlComm.Parameters.AddWithValue("@TaxpayerID", vmvendorDD.TaxpayerID);
                        sqlComm.Parameters.AddWithValue("@CaseNo", vmvendorDD.CaseNo);
                        sqlComm.Parameters.AddWithValue("@PhoneNumber", vmvendorDD.PhoneNumber);
                        sqlComm.Parameters.AddWithValue("@DepartmentName", vmvendorDD.DepartmentName);
                        sqlComm.Parameters.AddWithValue("@DepartmentContactName", vmvendorDD.DepartmentContactName);
                        sqlComm.Parameters.AddWithValue("@DepartmentEmail", vmvendorDD.DepartmentEmail);
                        sqlComm.Parameters.AddWithValue("@DepartmentContactNo", vmvendorDD.DepartmentContactNo);

                        sqlComm.CommandType = CommandType.StoredProcedure;
                        sqlComm.ExecuteNonQuery();
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in SubmitVendor.  Message: " + ex.Message);
                return null;
            }
            return new Tuple<string, string>("SUCCESS", "true");
        }

        private int getDocumentTypeID(string filename) {
            int typeid = 0;
            if (filename.IndexOf("_VC") > 0)
                typeid = 1;
            else if (filename.IndexOf("_ST") > 0)
                typeid = 2;
            else if (filename.IndexOf("_VL") > 0)
                typeid = 3;
            else if (filename.IndexOf("_OA") > 0)
                typeid = 4;
            else if (filename.IndexOf("VCM_") > 0)
                typeid = 5;

            return typeid; ;
        }

        public Tuple<string, string> SubmitAttachmentFile(DAL_M_VendorDD vmvendorDD)
        {
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("SubmitVendorAttachment", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
                    sqlComm.Parameters.AddWithValue("@TypeID", getDocumentTypeID(vmvendorDD.VendorAttachmentFileName));
                    sqlComm.Parameters.AddWithValue("@AttachmentFileName", vmvendorDD.VendorAttachmentFileName);
                    sqlComm.Parameters.AddWithValue("@LastUpdatedUser", "");
                    sqlComm.Parameters.AddWithValue("@LastUpdateDateTime", DateTime.Now);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();


                    //VCM Document
                    int type_id = 5;  // VCM Request Submission Receipt
                    sqlComm.Parameters.Clear();
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
                    sqlComm.Parameters.AddWithValue("@TypeID", type_id);
                    sqlComm.Parameters.AddWithValue("@AttachmentFileName", vmvendorDD.VendorReportFileName);
                    sqlComm.Parameters.AddWithValue("@LastUpdatedUser", "");
                    sqlComm.Parameters.AddWithValue("@LastUpdateDateTime", DateTime.Now);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();


                    //if there is second attachment,  when submit from DDMS
                    if ( (vmvendorDD.AttachmentFileName_ddwetform != null) && (!string.IsNullOrEmpty(vmvendorDD.AttachmentFileName_ddwetform.Trim())) )
                    {
                        int dtypeid = 6; 
                        SqlCommand sqlComm_ddwetform = new SqlCommand("SubmitVendorAttachment", con);
                        sqlComm_ddwetform.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
                        sqlComm_ddwetform.Parameters.AddWithValue("@TypeID", dtypeid);
                        sqlComm_ddwetform.Parameters.AddWithValue("@AttachmentFileName", vmvendorDD.AttachmentFileName_ddwetform);
                        sqlComm_ddwetform.Parameters.AddWithValue("@LastUpdatedUser", "");
                        sqlComm_ddwetform.Parameters.AddWithValue("@LastUpdateDateTime", DateTime.Now);

                        sqlComm_ddwetform.CommandType = CommandType.StoredProcedure;
                        sqlComm_ddwetform.ExecuteNonQuery();
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in SubmitAttachmentFile.  Message: " + ex.Message);
                return null;
            }
            return new Tuple<string, string>("SUCCESS", "true");
        }

        public Tuple<string, string> InsertVendorReportFileName(DAL_M_VendorDD vmvendorDD)
        {
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    int type_id = 5;  // VCM Request Submission Receipt
                    SqlCommand sqlComm = new SqlCommand("SubmitVendorAttachment", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
                    sqlComm.Parameters.AddWithValue("@TypeID", type_id);
                    sqlComm.Parameters.AddWithValue("@AttachmentFileName", vmvendorDD.VendorReportFileName);
                    sqlComm.Parameters.AddWithValue("@LastUpdatedUser", "");
                    sqlComm.Parameters.AddWithValue("@LastUpdateDateTime", DateTime.Now);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();

                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in InsertVendorReportFileName.  Message: " + ex.Message);
                return new Tuple<string, string>("error --"+ex.Message, "false");
            }
            return new Tuple<string, string>("SUCCESS", "true");
        }

        public string InsertRequestLog(DAL_M_VendorDD vmvendorDD, DAL.Models.DAL_M_SourceIPInfo ipInfo)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("InsertRequestLog", con);
                    sqlComm.Parameters.AddWithValue("@VEND_CUST_CD", vmvendorDD.Vendorname);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
                    sqlComm.Parameters.AddWithValue("@Source_ip", ipInfo.Source_IP); 
                    sqlComm.Parameters.AddWithValue("@Source_device", ipInfo.Source_Device);
                    sqlComm.Parameters.AddWithValue("@User_agent", vmvendorDD.User_agent);  //  this is used for entered by
                    sqlComm.Parameters.AddWithValue("@Host_headers", ipInfo.Source_Host_Headers);
                    sqlComm.Parameters.AddWithValue("@Source_Location", ipInfo.Source_Location);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in InsertRequestLog.  Message: " + ex.Message);
                return string.Empty;
            }
            return "SUCCESS";
        }
    }
}


