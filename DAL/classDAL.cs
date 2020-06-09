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
        public static SqlConnection Open() {
            try
            {
                string ConnectionStrVDD = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionStrVDD"].ConnectionString;
                SqlConnection con = new SqlConnection(ConnectionStrVDD);
                con.Open();
                return con;
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Openning DB Connection.  Message: "+ ex.Message);
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
                        retstring =  reader.GetInt32(0).ToString() + reader.GetString(1);
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
                    //SqlCommand sqlComm = new SqlCommand("PayeeToVendor_DirectDepositList_PendingConfirm", con);
                    SqlCommand sqlComm = new SqlCommand("GetLocationsby_vend_cust_id", con);
                    sqlComm.Parameters.AddWithValue("@VendorNumber", vendorNumber);
                    //sqlComm.Parameters.AddWithValue("@PayeeID", payeeId);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);
                        
                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                    VM_Vendor v = new VM_Vendor();
                        v.VendorNumber = ds.Tables[0].Rows[i]["VendorNumber"].ToString(); //dr["VendorNumber"].ToString();
                        v.LocationID = ds.Tables[0].Rows[i]["LocationID"].ToString(); //dr["VendorNumber"].ToString();
                        v.VendorAddress = ds.Tables[0].Rows[i]["Address"].ToString();  //VendorAddress1
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
            catch (Exception ex) {
                LogManager.log.Error(ex.Message);
            }
            return ret;
        }

        public Tuple<string, string> SubmitVendor(VM_vendorDD vmvendorDD) {
            Tuple<string, string> ret = null;
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    foreach (string locid in vmvendorDD.locationIDs)
                    {
                        SqlCommand sqlComm = new SqlCommand("SubmitVendorDetails", con);
                        sqlComm.Parameters.AddWithValue("@VEND_CUST_CD", vmvendorDD.vendorname);
                        sqlComm.Parameters.AddWithValue("@AD_ID", locid);
                        sqlComm.Parameters.AddWithValue("@ConfirmationNum", vmvendorDD.Confirmation);//vmvendorDD.Confirmation)
                        sqlComm.Parameters.AddWithValue("@REQUESTDATE", vmvendorDD.SubmitDateTime);

                        sqlComm.Parameters.AddWithValue("@STATUS", 7);
                        sqlComm.Parameters.AddWithValue("@DDNotifyEmail", vmvendorDD.DDNotifiEmail);
                        sqlComm.Parameters.AddWithValue("@AccountType", vmvendorDD.AccountType);
                        sqlComm.Parameters.AddWithValue("@AccountNumber", vmvendorDD.BankAccountNumber);

                        sqlComm.Parameters.AddWithValue("@RoutingNumber", vmvendorDD.BankRoutingNo);
                        sqlComm.Parameters.AddWithValue("@FinInstName", vmvendorDD.FinancialIns);
                        sqlComm.Parameters.AddWithValue("@AuthorizedName", vmvendorDD.signername);
                        sqlComm.Parameters.AddWithValue("@AuthorizedTitle", vmvendorDD.signertitle);

                        sqlComm.Parameters.AddWithValue("@AuthorizedPhone", vmvendorDD.signerphone);
                        sqlComm.Parameters.AddWithValue("@AuthorizedPhoneExt", "");
                        sqlComm.Parameters.AddWithValue("@AuthorizedEmail", vmvendorDD.signeremail);
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
                    sqlComm.Parameters.AddWithValue("@LastUpdateDateTime", vmvendorDD.SubmitDateTime);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }

            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in SubmitAttachmentFile.  Message: " + ex.Message);
            }
            return new Tuple<string, string>("SUCCESS", "true");
        }

        
    }
}


