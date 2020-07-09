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
            //using (eCAPDDEntities entities = new eCAPDDEntities())
            //{
            //    bool ret = entities.R_VEND_USER.Any(vendor => vendor.USER_ID.Equals(UserId, StringComparison.OrdinalIgnoreCase) && vendor.TIN.Equals(TIN, StringComparison.OrdinalIgnoreCase));
            //    return ret;
            //}
            ClassDAL cls = new ClassDAL();
            return true;
        }
    }

    public class ClassDAL
    {
        public string getDataLocalDB()
        {
            string retstring = "No Data";

            using (SqlConnection con = DBconnection.Open())
            {
                SqlCommand cmd = new SqlCommand("Select * from TestTable", con);
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        retstring = reader.GetInt32(0).ToString() + reader.GetString(1);
                        break;
                    }
                }
                reader.Close();
                con.Close();
            }
            return retstring;
        }


        public List<VM_Vendor> GetVendorDetailsByName(string vendorNumber)
        {
            List<VM_Vendor> lst_VM_Vendor = new List<VM_Vendor>();
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
                        VM_Vendor v = new VM_Vendor();
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

        //public Tuple<string, string> SubmitVendor(global::eCAPDDApi.Models.VM_vendorDD vmvendorDD)
        //{
        //    throw new NotImplementedException();
        //}

        //public Tuple<string, string> SubmitVendor(global::eCAPDDApi.Models.VM_vendorDD vmvendorDD)
        //{
        //    throw new NotImplementedException();
        //}

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

        public string PostContactus(VM_contactus vmcontactus) {

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



        public Tuple<string, string> SubmitVendor(VM_vendorDD vmvendorDD)
        {
            Tuple<string, string> ret = null;
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    foreach (string locid in vmvendorDD.LocationIDs)
                    {
                        SqlCommand sqlComm = new SqlCommand("SubmitVendorDetails", con);
                        sqlComm.Parameters.AddWithValue("@VEND_CUST_CD", vmvendorDD.Vendorname);
                        sqlComm.Parameters.AddWithValue("@AD_ID", locid);
                        sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);//vmvendorDD.Confirmation)
                        sqlComm.Parameters.AddWithValue("@REQUESTDATE", vmvendorDD.SubmitDateTime);

                        sqlComm.Parameters.AddWithValue("@STATUS", 5);  //  5 pending 
                        sqlComm.Parameters.AddWithValue("@DDNotifyEmail", vmvendorDD.DDNotifiEmail);
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

        public Tuple<string, string> SubmitAttachmentFile(VM_vendorDD vmvendorDD)
        {
            Tuple<string, string> ret = null;
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("SubmitVendorAttachment", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
                    sqlComm.Parameters.AddWithValue("@AttachmentFileName", vmvendorDD.VendorAttachmentFileName);
                    sqlComm.Parameters.AddWithValue("@LastUpdatedUser", "");
                    sqlComm.Parameters.AddWithValue("@LastUpdateDateTime", DateTime.Now);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
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

        public Tuple<string, string> InsertVendorReportFileName(VM_vendorDD vmvendorDD)
        {
            Tuple<string, string> ret = null;
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("SubmitVendorAttachment", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
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
                LogManager.log.Error("Error in SubmitAttachmentFile.  Message: " + ex.Message);
                return null;
            }
            return new Tuple<string, string>("SUCCESS", "true");
        }

        public string InsertRequestLog(VM_vendorDD vmvendorDD)
        {
            string ret = string.Empty;
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("InsertRequestLog", con);
                    sqlComm.Parameters.AddWithValue("@VEND_CUST_CD", vmvendorDD.Vendorname);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);
                    sqlComm.Parameters.AddWithValue("@Source_ip", vmvendorDD.Source_ip);
                    sqlComm.Parameters.AddWithValue("@Source_device", vmvendorDD.Source_device);
                    sqlComm.Parameters.AddWithValue("@User_agent", vmvendorDD.User_agent);
                    sqlComm.Parameters.AddWithValue("@Host_headers", vmvendorDD.Host_headers);
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


