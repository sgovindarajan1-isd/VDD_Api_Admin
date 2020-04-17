using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using DAL.Models;

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

        
        public List<VM_Vendor> GetVendorDetailsByName(string vendorNumber){
            List<VM_Vendor> lst_VM_Vendor = new List<VM_Vendor>();
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    string qrystring = "select * from [dbo].[VENDOR] where VendorNumber = '" + vendorNumber + "'";
                    SqlCommand cmd = new SqlCommand(qrystring, con);

                    SqlDataReader dr = cmd.ExecuteReader();
                    if (dr.HasRows)
                    {
                        while (dr.Read())
                        {
                            VM_Vendor v = new VM_Vendor();
                            //v.VendorNumber = dr["VendorNumber"].ToString();
                            //v.VendorName = dr["VendorName"].ToString();
                            v.VendorAddress = dr["VendorAddress1"].ToString();
                            v.RoutingNumber = "112-RoutingNo";
                            v.AcccountNo = "666-AccountNo";
                            v.AccountType = "Saving";
                            v.RemittanceEmail = "RemittanceEmail@email.com";
                            v.Status = "Check";
                            lst_VM_Vendor.Add(v);
                        }
                    }

                    dr.Close();
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
            //bool retbool= false;
            Tuple<string, bool> ret = null; // new Tuple<string, int>();
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    string qrystring = "select LGL_NM from [dbo].[R_VEND_USER] where user_id = '" + user_id + "' and tin = '" + tin + "'";
                    SqlCommand cmd = new SqlCommand(qrystring, con);

                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            if (reader["LGL_NM"].ToString() != string.Empty)
                            {

                                ret = new Tuple<string, bool>(reader["LGL_NM"].ToString(), true);
                            }
                            break;
                        }
                    }
                    reader.Close();
                    con.Close();
                }
            }
            catch (Exception ex) {
                LogManager.log.Error(ex.Message);
            }
            return ret;
        }
    }
}


