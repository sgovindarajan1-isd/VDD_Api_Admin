using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using DAL.Models;
using System.Data;

namespace DAL
{
    public class AdminDAL
    {
        public List<DAL_M_ApplicationList> GetApplicationDetailsAssigned(string userId, string status, string age1, string age2, string age3)
        {
            List<DAL_M_ApplicationList> lst_DAL_M_ApplicationList = new List<DAL_M_ApplicationList>();
            try
            {
                DataSet ds = new DataSet("ApplicateList");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetApplicationDetailsAssigned", con);
                    sqlComm.Parameters.AddWithValue("@UserId", userId);
                    sqlComm.Parameters.AddWithValue("@status", status);
                    sqlComm.Parameters.AddWithValue("@age1", age1);
                    sqlComm.Parameters.AddWithValue("@age2", age2);
                    sqlComm.Parameters.AddWithValue("@age3", age3);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_ApplicationList v = new DAL_M_ApplicationList();
                        v.UserId = ds.Tables[0].Rows[i]["UserId"].ToString();
                        v.VendorName = ds.Tables[0].Rows[i]["VendorName"].ToString();
                        v.ReceivedDate = ds.Tables[0].Rows[i]["ReceivedDate"].ToString();
                        v.AssignedDate = ds.Tables[0].Rows[i]["AssignedDate"].ToString();
                        v.ApplicationAge = ds.Tables[0].Rows[i]["ApplicationAge"].ToString();
                        v.ConfirmationNum = ds.Tables[0].Rows[i]["ConfirmationNum"].ToString();
                        v.StatusCode = ds.Tables[0].Rows[i]["StatusCode"].ToString();
                        v.StatusDesc = ds.Tables[0].Rows[i]["StatusDesc"].ToString();
                        lst_DAL_M_ApplicationList.Add(v);

                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetApplicationDetailsAssigned.  Message: " + ex.Message);
            }
            return lst_DAL_M_ApplicationList;
        }

    }
}