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
        public Tuple<List<DAL_M_ApplicationList>, List<DAL_M_ApplicationList>, int> GetApplicationListAssigned(int roleId, string userId, string pendingAssignmentStatus, string myapprovalStatus, int filterAge, string filterApptype, string filterUser, string filterStatus)
        {
            List<DAL_M_ApplicationList> lst_PendingAssignment = new List<DAL_M_ApplicationList>();  //  Supervisor view only
            List<DAL_M_ApplicationList> lst_MyApproval = new List<DAL_M_ApplicationList>();  //  Processor and supervisor view

            int AppPendingOver60Days = 0;
            try
            {
                DataSet ds = new DataSet("PendingAssignmentList");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetApplicationListAssigned", con);
                    sqlComm.Parameters.AddWithValue("@RoleId", roleId);
                    sqlComm.Parameters.AddWithValue("@UserId", userId);
                    sqlComm.Parameters.AddWithValue("@PendingAssignmentStatus", pendingAssignmentStatus);
                    sqlComm.Parameters.AddWithValue("@MyapprovalStatus", myapprovalStatus);
                    sqlComm.Parameters.AddWithValue("@FilterAge", filterAge);
                    sqlComm.Parameters.AddWithValue("@FilterApptype", filterApptype);
                    sqlComm.Parameters.AddWithValue("@FilterUser", filterUser);
                    sqlComm.Parameters.AddWithValue("@FilterStatus", filterStatus);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);
                    if (roleId == 12)  // only for Superuser Role,  Pending Assignment list populated
                    {
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
                            v.RequestType = ds.Tables[0].Rows[i]["RequestType"].ToString();
                            lst_PendingAssignment.Add(v);
                        }
                    }
                    int tableNum = 0;  // for processor  only  one table  ( my pending approval table)
                    if (roleId == 12)
                    {  // only for Superuser Role,  Pending Assignment list populated
                        tableNum = 1;
                    }

                    for (int i = 0; i <= ds.Tables[tableNum].Rows.Count - 1; i++)
                    {
                        DAL_M_ApplicationList v = new DAL_M_ApplicationList();
                        v.UserId = userId;
                        v.VendorName = ds.Tables[tableNum].Rows[i]["PayeeName"].ToString();
                        v.ConfirmationNum = ds.Tables[tableNum].Rows[i]["ConfirmationNum"].ToString();
                        if (ds.Tables[tableNum].Rows[i]["ReceivedDate"] != null)
                        {
                            v.ReceivedDate = String.Format("{0:M/d/yyyy}", ds.Tables[tableNum].Rows[i]["ReceivedDate"]);
                        }
                        if (ds.Tables[tableNum].Rows[i]["AssignmentDate"] != null)
                        {
                            v.AssignedDate = String.Format("{0:M/d/yyyy}", ds.Tables[tableNum].Rows[i]["AssignmentDate"]);
                        }
                        v.ApplicationAge = ds.Tables[tableNum].Rows[i]["ApplicationAge"].ToString();
                        v.StatusCode = ds.Tables[tableNum].Rows[i]["StatusCode"].ToString();
                        v.StatusDesc = ds.Tables[tableNum].Rows[i]["StatusDesc"].ToString();
                        v.RequestType = ds.Tables[tableNum].Rows[i]["RequestType"].ToString();
                        lst_MyApproval.Add(v);
                    }

                    //if (ds.Tables[2].Rows.Count > 0)  //  no table now  error out;  to do
                    //{
                    //    AppPendingOver60Days = Int32.Parse(ds.Tables[2].Rows[0]["Application Count"].ToString());
                    //}

                    AppPendingOver60Days = 99;

                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetApplicationDetailsAssigned.  Message: " + ex.Message);
            }
            return new Tuple<List<DAL_M_ApplicationList>, List<DAL_M_ApplicationList>, int>(lst_PendingAssignment, lst_MyApproval, AppPendingOver60Days);
        }





        public Tuple<List<DAL_M_IdTextClass>, List<DAL_M_IdTextClass>, List<DAL_M_IdTextClass>> GetApplicationCustomFilterList()
        {
            List<DAL_M_IdTextClass> applicationTypeList = new List<DAL_M_IdTextClass>();
            List<DAL_M_IdTextClass> userList = new List<DAL_M_IdTextClass>();
            List<DAL_M_IdTextClass> statusList = new List<DAL_M_IdTextClass>();
            try
            {
                DataSet ds = new DataSet("ApplicateTypeList");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetApplicationCustomFilterList", con);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_IdTextClass v = new DAL_M_IdTextClass();
                        v.IdText = ds.Tables[0].Rows[i]["RequestTypeName"].ToString();
                        v.Text = ds.Tables[0].Rows[i]["Description"].ToString();
                        applicationTypeList.Add(v);
                    }

                    for (int i = 0; i <= ds.Tables[1].Rows.Count - 1; i++)
                    {
                        DAL_M_IdTextClass u = new DAL_M_IdTextClass();
                        u.IdText = ds.Tables[1].Rows[i]["UserId"].ToString();
                        u.Text = ds.Tables[1].Rows[i]["UserName"].ToString();
                        userList.Add(u);
                    }

                    for (int i = 0; i <= ds.Tables[2].Rows.Count - 1; i++)
                    {
                        DAL_M_IdTextClass s = new DAL_M_IdTextClass();
                        s.Id = Int32.Parse(ds.Tables[2].Rows[i]["StatusCode"].ToString());
                        s.Text = ds.Tables[2].Rows[i]["StatusDesc"].ToString();
                        statusList.Add(s);
                    }

                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetApplicationCustomFilterList.  Message: " + ex.Message);
            }
            return new Tuple<List<DAL_M_IdTextClass>, List<DAL_M_IdTextClass>, List<DAL_M_IdTextClass>>(applicationTypeList, userList, statusList);
        }




        public Tuple<List<DAL_M_ApplicationList>, int, int> GetAppliationAgeAssigned(int roleId, string userId, string status, string age1, string age2, string age3)
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
                    sqlComm.Parameters.AddWithValue("@RoleId", roleId);
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


        public DAL_M_VendorDD GetApplicationSummary(string confirmationNumber)
        {
            DAL_M_VendorDD reqM = new DAL_M_VendorDD();
            List<string> reqDetails = new List<string>();

            try
            {
                DataSet ds = new DataSet("ApplicationSummary");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetApplicationSummaryBy_ConfirmationNumber", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        reqM.VendorNumber = ds.Tables[0].Rows[i]["VendorNumber"].ToString();
                        reqM.Vendorname = ds.Tables[0].Rows[i]["VendorName"].ToString();
                        reqM.AliasDBAName = ds.Tables[0].Rows[i]["AliasDBAName"].ToString();
                        reqM.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                        reqM.MiddleName = ds.Tables[0].Rows[i]["MiddleName"].ToString();
                        reqM.LastName = ds.Tables[0].Rows[i]["LastName"].ToString();
                        reqM.CompanyName = ds.Tables[0].Rows[i]["CompanyName"].ToString();
                        reqM.SSN = ds.Tables[0].Rows[i]["SSN"].ToString();

                        reqM.RequestType = ds.Tables[0].Rows[i]["RequestType"].ToString();
                        reqM.RequestDate = ds.Tables[0].Rows[i]["RequestDate"].ToString();

                        reqM.ProcessorID = ds.Tables[0].Rows[i]["ProcessorID"].ToString();
                        reqM.AssignedBy = ds.Tables[0].Rows[i]["AssignedBy"].ToString();
                        reqM.AssignmentDate = ds.Tables[0].Rows[i]["AssignmentDate"].ToString(); //DateTime.Parse(ds.Tables[0].Rows[i]["AssignmentDate"].ToString());

                        //Console.WriteLine(aDate.ToString("MM/dd/yyyy hh:mm tt"));

                        reqM.AccountType = Int32.Parse(ds.Tables[0].Rows[i]["AccountType"].ToString());
                        reqM.AccountTypeDesc = ds.Tables[0].Rows[i]["AccountTypeDesc"].ToString();
                        reqM.BankRoutingNo = ds.Tables[0].Rows[i]["BankRountingNumber"].ToString();
                        reqM.BankAccountNumber = ds.Tables[0].Rows[i]["BankAccountNumber"].ToString();
                        reqM.FinancialIns = ds.Tables[0].Rows[i]["FininstName"].ToString();
                        reqM.DDNotifyEmail = ds.Tables[0].Rows[i]["DDNotifyEmail"].ToString();
                        reqM.Status = Int32.Parse(ds.Tables[0].Rows[i]["Status"].ToString());
                        reqM.StatusDesc = ds.Tables[0].Rows[i]["StatusDesc"].ToString();

                        reqM.Signername = ds.Tables[0].Rows[i]["AuthorizedName"].ToString();
                        reqM.Signertitle = ds.Tables[0].Rows[i]["AuthorizedTitle"].ToString();
                        reqM.Signerphone = ds.Tables[0].Rows[i]["AuthorizedPhone"].ToString();
                        reqM.Signeremail = ds.Tables[0].Rows[i]["AuthorizedEmail"].ToString();

                        reqM.CaseNo = ds.Tables[0].Rows[i]["CaseNo"].ToString();
                        reqM.PhoneNumber = ds.Tables[0].Rows[i]["PhoneNumber"].ToString();
                        reqM.DepartmentName = ds.Tables[0].Rows[i]["DepartmentName"].ToString();
                        reqM.DepartmentContactName = ds.Tables[0].Rows[i]["DepartmentContactName"].ToString();
                        reqM.DepartmentEmail = ds.Tables[0].Rows[i]["DepartmentEmail"].ToString();
                        reqM.DepartmentContactNo = ds.Tables[0].Rows[i]["DepartmentContactNo"].ToString();
                        reqM.ClosedDate = ds.Tables[0].Rows[i]["ClosedDate"].ToString();

                        reqM.Source_ip = ds.Tables[0].Rows[i]["Source_ip"].ToString();
                        reqM.Source_device = ds.Tables[0].Rows[i]["Source_device"].ToString();
                        reqM.User_agent = ds.Tables[0].Rows[i]["User_agent"].ToString();
                        reqM.Comment = ds.Tables[0].Rows[i]["Comment"].ToString();
                    }

                    for (int i = 0; i <= ds.Tables[1].Rows.Count - 1; i++)
                    {
                        reqDetails.Add(ds.Tables[1].Rows[i]["Address"].ToString());
                    }
                    reqM.LocationAddress = reqDetails;
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetApplicationSummary.  Message: " + ex.Message);
            }
            return reqM;
        }


        public string UpdateApplicationStatus(string confirmationNumber, int statusCode, string comment, string reasonType, string processorID, string assignedBy)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateApplicationStatus", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);
                    sqlComm.Parameters.AddWithValue("@StatusCode", statusCode);
                    sqlComm.Parameters.AddWithValue("@Comment", comment);
                    sqlComm.Parameters.AddWithValue("@ReasonType", reasonType);
                    sqlComm.Parameters.AddWithValue("@ProcessorID", processorID);  // Assinging to 
                    sqlComm.Parameters.AddWithValue("@AssignedBy", assignedBy);   //  Assigning From 
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in SubmitVendor.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }
        public string UpdateAssignApplication(string confirmationNumber, int statusCode, string processorID, string assignedBy)
        {
            DAL_M_VendorDD reqM = new DAL_M_VendorDD();
            List<string> reqDetails = new List<string>();
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateAssignApplication", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);
                    sqlComm.Parameters.AddWithValue("@StatusCode", statusCode);
                    sqlComm.Parameters.AddWithValue("@ProcessorID", processorID);
                    sqlComm.Parameters.AddWithValue("@AssignedBy", assignedBy);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Update Assign Application.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }

        public string UpdateVendorAuthorizationDetails(DAL.Models.DAL_M_VendorDD adminModel)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateVendorAuthorizationDetails", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", adminModel.Confirmation);
                    sqlComm.Parameters.AddWithValue("@AuthorizedName", adminModel.Signername);
                    sqlComm.Parameters.AddWithValue("@AuthorizedTitle", adminModel.Signertitle);
                    sqlComm.Parameters.AddWithValue("@AuthorizedPhone", adminModel.Signerphone);
                    sqlComm.Parameters.AddWithValue("@AuthorizedEmail", adminModel.Signeremail);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Updating Vendor Authorization Details.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }

        public string UpdateVendorDetails(DAL.Models.DAL_M_VendorDD adminModel)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateVendorDetails", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", adminModel.Confirmation);
                    sqlComm.Parameters.AddWithValue("@VEND_CUST_CD", adminModel.VendorNumber);
                    sqlComm.Parameters.AddWithValue("@FirstName", adminModel.FirstName);
                    sqlComm.Parameters.AddWithValue("@MiddleName", adminModel.MiddleName);
                    sqlComm.Parameters.AddWithValue("@LastName", adminModel.LastName);
                    sqlComm.Parameters.AddWithValue("@PhoneNumber", adminModel.PhoneNumber);
                    //sqlComm.Parameters.AddWithValue("@PayeeName", adminModel.Payeename);
                    sqlComm.Parameters.AddWithValue("@CompanyName", adminModel.CompanyName);
                    sqlComm.Parameters.AddWithValue("@AliasDBA", adminModel.AliasDBA);
                    sqlComm.Parameters.AddWithValue("@TaxpayerID", adminModel.TaxpayerID);
                    sqlComm.Parameters.AddWithValue("@DDnotifyEmail", adminModel.DDNotifyEmail);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Updating Vendor Bank Details.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }

        public string UpdateVendorBankDetails(DAL.Models.DAL_M_VendorDD adminModel)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateVendorBankDetails", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", adminModel.Confirmation);
                    sqlComm.Parameters.AddWithValue("@AccountType", adminModel.AccountType);
                    sqlComm.Parameters.AddWithValue("@AccountNumber", adminModel.BankAccountNumber);
                    sqlComm.Parameters.AddWithValue("@RoutingNumber", adminModel.BankRoutingNo);
                    sqlComm.Parameters.AddWithValue("@FinInstName", adminModel.FinancialIns);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Updating Vendor Bank Details.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }

        public string UpdateDepartmentDetails(DAL.Models.DAL_M_VendorDD adminModel)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateDepartmentDetails", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", adminModel.Confirmation);
                    sqlComm.Parameters.AddWithValue("@DepartmentName", adminModel.DepartmentName);
                    sqlComm.Parameters.AddWithValue("@DepartmentContactName", adminModel.DepartmentContactName);
                    sqlComm.Parameters.AddWithValue("@DepartmentEmail", adminModel.DepartmentEmail);
                    sqlComm.Parameters.AddWithValue("@DepartmentContactNo", adminModel.DepartmentContactNo);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Updating Department Details.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }



        public List<DAL_M_IdTextClass> GetProcessorsList()
        {
            List<DAL_M_IdTextClass> processorsList = new List<DAL_M_IdTextClass>();
            try
            {
                DataSet ds = new DataSet("Processsors");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetProcessorsList", con);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_IdTextClass processors = new DAL_M_IdTextClass();
                        processors.IdText = ds.Tables[0].Rows[i]["UserID"].ToString();
                        processors.Text = ds.Tables[0].Rows[i]["NumberOFAssignment"].ToString();
                        processorsList.Add(processors);
                    }

                    con.Close();

                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Update Assign Application.  Message: " + ex.Message);
                return null;
            }
            return processorsList;
        }


        public List<DAL_M_TransportDataGeneric> GetTimeLineByConfirmationNumber(string confirmationNumber)
        {
            DAL_M_TransportDataGeneric timeLine = new DAL_M_TransportDataGeneric();
            List<DAL_M_TransportDataGeneric> timeLines = new List<DAL_M_TransportDataGeneric>();

            try
            {
                DataSet ds = new DataSet("TimeLine");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetTimeLineByConfirmationNumber", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        //Tuple<DateTime, DateTime> DateandTime = getDate_Time_Seperately(DateTime.Parse(ds.Tables[0].Rows[i]["LastUpdateDateTime"].ToString()));
                        timeLine.TimeLineDate = DateTime.Parse("HH:mm"); // DateandTime.Item1;
                                                                         // TimeSpan t1 = DateTime.Parse(ds.Tables[0].Rows[i]["LastUpdateDateTime"].ToString()).TimeOfDay.ToString();
                        timeLine.TimeLineTime = DateTime.Parse(ds.Tables[0].Rows[i]["LastUpdateDateTime"].ToString()); //DateandTime.Item1;
                        timeLine.Status = ds.Tables[0].Rows[i]["StatusDesc"].ToString();
                        timeLines.Add(timeLine);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetApplicationSummary.  Message: " + ex.Message);
            }
            return timeLines;
        }

        public Tuple<DateTime, DateTime> getDate_Time_Seperately(DateTime dt)
        {
            //DateTime dt = DateTime.Parse("6/22/2009 07:00:00 AM");

            //dt.ToString("HH:mm");
            return null;

        }






        //        DAL_M_VendorDD

        //        VendorNumber
        //RequestType
        //RequestDate
        //FininstName
        //AuthorizedName
        //AuthorizedTitle
        //AuthorizedPhone
        //AuthorizedPhoneExt
        //AuthorizedEmail
        //Comment
        //OfficeNotes
        //AccountType
        //BankAccountNumber
        //BankRountingNumber
        //DDNotifyEmail
        //Status


    }
}