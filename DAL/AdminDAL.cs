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
        public Tuple< List<DAL_M_ApplicationList>, List<DAL_M_ApplicationList>, int> GetApplicationDetailsAssigned(string userId, string pendingAssignmentStatus, string myapprovalStatus)
        {
            List<DAL_M_ApplicationList> lst_DAL_M_ApplicationList = new List<DAL_M_ApplicationList>();
            List<DAL_M_ApplicationList> List_PendingAssignment = new List<DAL_M_ApplicationList>();
            int AppPendingOver60Days = 0;
            try
            {
                DataSet ds = new DataSet("ApplicateList");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetApplicationDetailsAssigned", con);
                    sqlComm.Parameters.AddWithValue("@UserId", userId);
                    sqlComm.Parameters.AddWithValue("@PendingAssignmentStatus", pendingAssignmentStatus);
                    sqlComm.Parameters.AddWithValue("@MyapprovalStatus", myapprovalStatus);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_ApplicationList v = new DAL_M_ApplicationList();
                        v.UserId = userId;
                        v.VendorName = ds.Tables[0].Rows[i]["PayeeName"].ToString();
                        v.ConfirmationNum = ds.Tables[0].Rows[i]["ConfirmationNum"].ToString();
                        if (ds.Tables[0].Rows[i]["ReceivedDate"] != null)
                        {
                            v.ReceivedDate = String.Format("{0:M/d/yyyy}", ds.Tables[0].Rows[i]["ReceivedDate"]);
                        }
                        if (ds.Tables[0].Rows[i]["AssignmentDate"] != null)
                        {
                            v.AssignedDate = String.Format("{0:M/d/yyyy}", ds.Tables[0].Rows[i]["AssignmentDate"]);
                        }
                        v.ApplicationAge = ds.Tables[0].Rows[i]["ApplicationAge"].ToString();
                        v.StatusCode = ds.Tables[0].Rows[i]["StatusCode"].ToString();
                        v.StatusDesc = ds.Tables[0].Rows[i]["StatusDesc"].ToString();
                        lst_DAL_M_ApplicationList.Add(v);
                    }

                    for (int i = 0; i <= ds.Tables[1].Rows.Count - 1; i++)
                    {
                        DAL_M_ApplicationList v = new DAL_M_ApplicationList();
                        v.UserId = userId;
                        v.VendorName = ds.Tables[1].Rows[i]["PayeeName"].ToString();
                        v.ConfirmationNum = ds.Tables[1].Rows[i]["ConfirmationNum"].ToString();
                        if (ds.Tables[1].Rows[i]["ReceivedDate"] != null)
                        {
                            v.ReceivedDate = String.Format("{0:M/d/yyyy}", ds.Tables[1].Rows[i]["ReceivedDate"]);
                        }
                        if (ds.Tables[1].Rows[i]["AssignmentDate"] != null)
                        {
                            v.AssignedDate = String.Format("{0:M/d/yyyy}", ds.Tables[1].Rows[i]["AssignmentDate"]);
                        }
                        v.ApplicationAge = ds.Tables[1].Rows[i]["ApplicationAge"].ToString();
                        v.StatusCode = ds.Tables[1].Rows[i]["StatusCode"].ToString();
                        v.StatusDesc = ds.Tables[1].Rows[i]["StatusDesc"].ToString();
                        List_PendingAssignment.Add(v);
                    }
                   
                    if (ds.Tables[2].Rows.Count > 0)
                    {
                        AppPendingOver60Days = Int32.Parse(ds.Tables[2].Rows[0]["Application Count"].ToString());
                    }

                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetApplicationDetailsAssigned.  Message: " + ex.Message);
            }
            return new Tuple<List<DAL_M_ApplicationList>, List<DAL_M_ApplicationList>, int>(lst_DAL_M_ApplicationList, List_PendingAssignment, AppPendingOver60Days);
        }

        public Tuple<List<DAL_M_ApplicationList>, int, int> GetAppliationAgeAssigned(string userId, string status, string age1, string age2, string age3)
        {
            List<DAL_M_ApplicationList> lst_DAL_M_ApplicationList = new List<DAL_M_ApplicationList>();
            int totalApplicationCount = 0;
            int totalApplicationCountOver60 = 0;
            try
            {
                DataSet ds = new DataSet("ApplicateList");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetAppliationAgeAssigned", con);
                    sqlComm.Parameters.AddWithValue("@UserId", userId);
                    sqlComm.Parameters.AddWithValue("@StatusCode", status);
                    sqlComm.Parameters.AddWithValue("@ageOption1", age1);
                    sqlComm.Parameters.AddWithValue("@ageOption2", age2);
                    sqlComm.Parameters.AddWithValue("@ageOption3", age3);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_ApplicationList v = new DAL_M_ApplicationList();
                        v.Age = ds.Tables[0].Rows[i]["Days"].ToString();
                        v.AgeCount = ds.Tables[0].Rows[i]["Application Count"].ToString();
                        totalApplicationCount += int.Parse(v.AgeCount);
                        if (v.Age.Trim().ToLower() == "60+")
                        {
                            totalApplicationCountOver60 = int.Parse(v.AgeCount);
                        }
                        lst_DAL_M_ApplicationList.Add(v);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetApplicationDetailsAssigned.  Message: " + ex.Message);
            }
            return new Tuple<List<DAL_M_ApplicationList>, int, int>(lst_DAL_M_ApplicationList, totalApplicationCount, totalApplicationCountOver60);
        }


    }
}