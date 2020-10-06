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

        public List<DAL_M_AttachmentData> GetAttachmentsData(string confirmationNumber)
        {
            List<DAL_M_AttachmentData> lst_DAL_M_AttachmentData = new List<DAL_M_AttachmentData>();
            try
            {
                DataSet ds = new DataSet("AttachmentsData");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetAttachmentsData", con);
                    sqlComm.Parameters.AddWithValue("@Conf", confirmationNumber);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_AttachmentData v = new DAL_M_AttachmentData();
                        v.ConfirmationNum = ds.Tables[0].Rows[i]["confirmationNum"].ToString();
                        v.AttachmentFileName = ds.Tables[0].Rows[i]["AttachmentFileName"].ToString();
                        v.DisplayName = ds.Tables[0].Rows[i]["DisplayName"].ToString();
                        v.UploadedDate = String.Format("{0:M/d/yyyy}", ds.Tables[0].Rows[i]["LastUpdateDateTime"]);
                        lst_DAL_M_AttachmentData.Add(v);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetAttachmentsData.  Message: " + ex.Message);
            }
            return lst_DAL_M_AttachmentData;
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
            List<DAL_M_LocationAddress> LocationAddressList = new List<DAL_M_LocationAddress>();
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

                    //for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    //{
                    if (ds.Tables[0].Rows.Count <= 0)
                    {
                        return null;
                    }

                    int i = 0;
                    reqM.VendorNumber = ds.Tables[0].Rows[i]["VendorNumber"].ToString();
                    reqM.Vendorname = ds.Tables[0].Rows[i]["VendorName"].ToString();
                    reqM.AliasDBAName = ds.Tables[0].Rows[i]["AliasDBAName"].ToString();
                    reqM.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    reqM.MiddleName = ds.Tables[0].Rows[i]["MiddleName"].ToString();
                    reqM.LastName = ds.Tables[0].Rows[i]["LastName"].ToString();
                    reqM.CompanyName = ds.Tables[0].Rows[i]["CompanyName"].ToString();
                    reqM.Ssn = ds.Tables[0].Rows[i]["Ssn"].ToString();

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

                    reqM.Source_IP= ds.Tables[0].Rows[i]["Source_ip"].ToString();
                    reqM.Source_Device = ds.Tables[0].Rows[i]["Source_device"].ToString();
                    reqM.Source_Location = ds.Tables[0].Rows[i]["Source_Location"].ToString();
                    reqM.User_agent = ds.Tables[0].Rows[i]["User_agent"].ToString();

                    reqM.Comment = ds.Tables[0].Rows[i]["Comment"].ToString();
                    ///}

                    for (int j = 0; j <= ds.Tables[1].Rows.Count - 1; j++)
                    {
                        reqDetails.Add(ds.Tables[1].Rows[j]["Address"].ToString());
                    }
                    reqM.LocationAddress = reqDetails;



                    for (int k = 0; k <= ds.Tables[1].Rows.Count - 1; k++)
                    {
                        DAL_M_LocationAddress loc = new DAL_M_LocationAddress();

                        //loc.Address1 = ds.Tables[1].Rows[k]["Address1"].ToString();
                        //loc.Address2 = ds.Tables[1].Rows[k]["Address2"].ToString();
                        loc.Street = ds.Tables[1].Rows[k]["Street"].ToString();
                        loc.City = ds.Tables[1].Rows[k]["City"].ToString();
                        loc.State = ds.Tables[1].Rows[k]["State"].ToString();
                        loc.ZipCode = ds.Tables[1].Rows[k]["Zip"].ToString();
                        LocationAddressList.Add(loc);
                    }

                    reqM.LocationAddressList = (LocationAddressList);
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


        public string GetVendorNameByVendorCode(string user_id )
        {
            string ret = string.Empty;
            try
            {
                DataSet ds = new DataSet("Vendor");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetVendorNameByVendorCode", con);
                    sqlComm.Parameters.AddWithValue("@VendorCode", user_id);  
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0]["VendorName"].ToString() != string.Empty)
                        {
                            ret = ds.Tables[0].Rows[0]["VendorName"].ToString();
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
                    sqlComm.Parameters.AddWithValue("@AliasDBA", adminModel.AliasDBAName);
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
                        DAL_M_TransportDataGeneric timeLine = new DAL_M_TransportDataGeneric();

                        //Tuple<DateTime, DateTime> DateandTime = getDate_Time_Seperately(DateTime.Parse(ds.Tables[0].Rows[i]["LastUpdateDateTime"].ToString()));
                        ////timeLine.TimeLineDate = DateTime.Parse("HH:mm"); // DateandTime.Item1;
                        ////                                                 // TimeSpan t1 = DateTime.Parse(ds.Tables[0].Rows[i]["LastUpdateDateTime"].ToString()).TimeOfDay.ToString();
                        ////timeLine.TimeLineTime = DateTime.Parse(ds.Tables[0].Rows[i]["LastUpdateDateTime"].ToString()); //DateandTime.Item1;
                        timeLine.Status = ds.Tables[0].Rows[i]["StatusDesc"].ToString();
                        timeLine.TimeLineMessage = ds.Tables[0].Rows[i]["TimeLineMessage"].ToString();
                        timeLines.Add(timeLine);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetTimeLineByConfirmationNumber.  Message: " + ex.Message);
            }
            return timeLines;
        }
        public string InsertUpdateNotes(DAL_M_Notes vm_Notes)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("InsertUpdateNotes", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", vm_Notes.ConfirmationNumber);
                    sqlComm.Parameters.AddWithValue("@Note_Type", vm_Notes.NotesType);
                    sqlComm.Parameters.AddWithValue("@Note_Content", vm_Notes.Notes);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Insert / Update Notes.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }
        public List<DAL_M_Notes> GetNotesByConfirmationNumber(string confirmationNumber)
        {
            List<DAL_M_Notes> notesList = new List<DAL_M_Notes>();
            try
            {
                DataSet ds = new DataSet("Notes");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetNotesByConfirmationNumber", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_Notes v = new DAL_M_Notes();
                        v.NotesId = Int32.Parse(ds.Tables[0].Rows[i]["Note_Id"].ToString());
                        v.NotesType = ds.Tables[0].Rows[i]["Note_Type"].ToString();
                        v.Notes = ds.Tables[0].Rows[i]["Note_Content"].ToString();

                        notesList.Add(v);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetTimeLineByConfirmationNumber.  Message: " + ex.Message);
            }
            return notesList;
        }
        public Tuple<DateTime, DateTime> getDate_Time_Seperately(DateTime dt)
        {
            //DateTime dt = DateTime.Parse("6/22/2009 07:00:00 AM");

            //dt.ToString("HH:mm");
            return null;
        }
        public string UpdateRetireAttachment(DAL.Models.DAL_M_VendorDD attachmentModel)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateRetireAttachment", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", attachmentModel.Confirmation);
                    sqlComm.Parameters.AddWithValue("@AttachmentFileName", attachmentModel.VendorAttachmentFileName);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Retiring Attachment.  Message: " + ex.Message);
                return "Error";
            }
            return "SUCCESS";
        }

        public string InsertDocumentAttachment(DAL.Models.DAL_M_VendorDD attachmentModel)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("InsertDocumentAttachment", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", attachmentModel.Confirmation);
                    sqlComm.Parameters.AddWithValue("@AttachmentFileName", attachmentModel.VendorAttachmentFileName);
                    sqlComm.Parameters.AddWithValue("@LastUpdatedUser", attachmentModel.LastUpdatedUser);
                    sqlComm.Parameters.AddWithValue("@TypeID", attachmentModel.DocumentAttachmentTypeId);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Uploading Attachment.  Message: " + ex.Message);
                return "ERROR";
            }
            return "SUCCESS";
        }

        public string InsertUpdateDocumentCheckList(DAL.Models.DAL_M_Checklist checklistModel)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("InsertUpdateDocumentCheckList", con);
                    sqlComm.Parameters.AddWithValue("@CheckListID", checklistModel.CheckListID);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", checklistModel.ConfirmationNumber);
                    sqlComm.Parameters.AddWithValue("@Active", checklistModel.Active);
                    sqlComm.Parameters.AddWithValue("@LastUpdatedUser", checklistModel.LastUpdatedUser);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in updating CheckList.  Message: " + ex.Message);
                return "ERROR";
            }
            return "SUCCESS";
        }
        
        public List<DAL_M_Checklist> GetDocumentCheckList(string confirmationNumber)
        {
            List<DAL_M_Checklist> Checklist_list = new List<DAL_M_Checklist>();
            try
            {
                DataSet ds = new DataSet("CheckList");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetDocumentCheckList", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_Checklist v = new DAL_M_Checklist();
                        v.CheckListID = Int32.Parse(ds.Tables[0].Rows[i]["CheckListID"].ToString());
                        v.CheckListName = ds.Tables[0].Rows[i]["CheckListName"].ToString();
                        v.Active = int.Parse(ds.Tables[0].Rows[i]["Active"].ToString());
                        v.LastUpdateDateTime = String.Format("{0:M/d/yyyy}", ds.Tables[0].Rows[i]["LastUpdateDateTime"]);
                        v.LastUpdatedUser = ds.Tables[0].Rows[i]["LastUpdatedUser"].ToString();
                        
                        Checklist_list.Add(v);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetDocumentCheckList.  Message: " + ex.Message);
            }
            return Checklist_list;
        }

        
        public int InsertUpdateChecklistNotes(DAL_M_Notes vm_Notes)
        {
            int returnNoteId = 0;
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("InsertUpdateChecklistNotes", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", vm_Notes.ConfirmationNumber);
                    sqlComm.Parameters.AddWithValue("@ChecklistId", vm_Notes.ChecklistId);
                    sqlComm.Parameters.AddWithValue("@NotesId", vm_Notes.NotesId);  // for update
                    sqlComm.Parameters.AddWithValue("@Note_Type", vm_Notes.NotesType);
                    sqlComm.Parameters.AddWithValue("@Note_Content", vm_Notes.Notes);
                    SqlParameter OutputNoteId = new SqlParameter("@OutputNoteId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    sqlComm.Parameters.Add(OutputNoteId);


                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();

                    returnNoteId = int.Parse(OutputNoteId.Value.ToString());
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Insert / Update Checklist Notes.  Message: " + ex.Message);
                return 0;
            }
            return returnNoteId;
        }

        public List<DAL_M_Notes> GetChecklistNotesByChecklistIDandNotesID(string confirmationNumber, int CheckListID)
        {
            List<DAL_M_Notes> checkListNotes = new List<DAL_M_Notes>();

            try
            {
                DataSet ds = new DataSet("CheckListNotes");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetChecklistNotesByChecklistIDandNotesID", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);
                    sqlComm.Parameters.AddWithValue("@CheckListID", CheckListID);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_Notes clNotes = new DAL_M_Notes();
                        clNotes.Notes = ds.Tables[0].Rows[i]["Note_Content"].ToString();
                        clNotes.NotesId = int.Parse(ds.Tables[0].Rows[i]["Note_ID"].ToString());  
                        clNotes.NotesType = ds.Tables[0].Rows[i]["Note_Type"].ToString();
                        clNotes.ChecklistId = int.Parse(ds.Tables[0].Rows[i]["ChecklistId"].ToString());
                        clNotes.LastUpdatedDateTime = String.Format("{0:M/d/yyyy}", ds.Tables[0].Rows[i]["LastUpdateDateTime"]);
                        clNotes.LastUpdatedUser = ds.Tables[0].Rows[i]["LastUpdatedUser"].ToString();

                        checkListNotes.Add(clNotes);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetChecklistNotesByChecklistIDandNotesID.  Message: " + ex.Message);
            }
            return checkListNotes;
        }

        public List<DAL_M_VendorDD> GetLinkedApplicationByConfirmationNum(DAL.Models.DAL_M_VendorDD dal_M_VendorDD)
        {
            List<DAL_M_VendorDD> linkedApplicationList = new List<DAL_M_VendorDD>();
            try
            {
                DataSet ds = new DataSet("LinkedApplication");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetLinkedApplicationByConfirmationNum", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", dal_M_VendorDD.Confirmation);
                    
                    //sqlComm.Parameters.AddWithValue("@VendorCode", dal_M_VendorDD.VendorNumber);
                    //sqlComm.Parameters.AddWithValue("@PayeeName", dal_M_VendorDD.Payeename);
                    //sqlComm.Parameters.AddWithValue("@AccountNumber", dal_M_VendorDD.BankAccountNumber);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_VendorDD linkApp = new DAL_M_VendorDD();
                        linkApp.Application = ds.Tables[0].Rows[i]["Application"].ToString();
                        linkApp.Confirmation = ds.Tables[0].Rows[i]["ConfirmationNum"].ToString();
                        linkApp.Linked_ConfirmationNum = ds.Tables[0].Rows[i]["Linked_ConfirmationNum"].ToString();
                       
                        linkApp.RequestType = ds.Tables[0].Rows[i]["RequestType"].ToString();
                        linkApp.VendorNumber = ds.Tables[0].Rows[i]["VendorNumber"].ToString();
                        linkApp.Payeename = ds.Tables[0].Rows[i]["VendorName"].ToString();
                        linkApp.BankAccountNumber = ds.Tables[0].Rows[i]["BankAccountNumber"].ToString();
                        linkedApplicationList.Add(linkApp);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetLinkedApplicationByVendorCode.  Message: " + ex.Message);
            }
            return linkedApplicationList;
        }

        public List<DAL_M_VendorDD> GetAvailableApplicationLinkByConfirmationNum(DAL.Models.DAL_M_VendorDD dal_M_VendorDD)
        {
            List<DAL_M_VendorDD> linkedApplicationList = new List<DAL_M_VendorDD>();
            try
            {
                DataSet ds = new DataSet("UnLinkedApplication");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetAvailableApplicationLinkByConfirmationNum", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", dal_M_VendorDD.Confirmation);
                    sqlComm.Parameters.AddWithValue("@VendorCode", dal_M_VendorDD.VendorNumber);
                    //sqlComm.Parameters.AddWithValue("@PayeeName", dal_M_VendorDD.Payeename);
                    sqlComm.Parameters.AddWithValue("@AccountNumber", dal_M_VendorDD.BankAccountNumber);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_VendorDD linkApp = new DAL_M_VendorDD();
                        linkApp.Application = ds.Tables[0].Rows[i]["Application"].ToString();
                        linkApp.Confirmation = ds.Tables[0].Rows[i]["ConfirmationNum"].ToString();
                        linkApp.RequestType = ds.Tables[0].Rows[i]["RequestType"].ToString();
                        linkApp.VendorNumber = ds.Tables[0].Rows[i]["VendorNumber"].ToString();
                        linkApp.Payeename = ds.Tables[0].Rows[i]["VendorName"].ToString();
                        linkApp.BankAccountNumber = ds.Tables[0].Rows[i]["BankAccountNumber"].ToString();

                        linkedApplicationList.Add(linkApp);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetLinkedApplicationByVendorCode.  Message: " + ex.Message);
            }
            return linkedApplicationList;
        }

        public string UpdateLink_UnLink_ApplicationByConfirmationNum(DAL.Models.DAL_M_LinkApplication dal_M_LinkApplication)
        {
            try
            {
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("UpdateLink_UnLink_ApplicationByConfirmationNum", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNum", dal_M_LinkApplication.ConfirmationNum);
                    sqlComm.Parameters.AddWithValue("@Link_ConfirmationNum", dal_M_LinkApplication.Link_ConfirmationNum);
                    sqlComm.Parameters.AddWithValue("@Action", dal_M_LinkApplication.Action);
                    sqlComm.Parameters.AddWithValue("@LastUpdatedUser", dal_M_LinkApplication.LastUpdatedUser);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in Linking UnLinking Application.  Message: " + ex.Message);
                return "ERROR";
            }
            return "SUCCESS";
        }

        
        public List<DAL_M_AttachmentData> GetArchieveDocumentsByConfirmationNUmber(string confirmationNumber)
        {
            List<DAL_M_AttachmentData> lst_DAL_M_AttachmentData = new List<DAL_M_AttachmentData>();
            try
            {
                DataSet ds = new DataSet("ArchieveDocuments");
                using (SqlConnection con = DBconnection.Open())
                {
                    SqlCommand sqlComm = new SqlCommand("GetArchieveDocumentsByConfirmationNUmber", con);
                    sqlComm.Parameters.AddWithValue("@ConfirmationNumber", confirmationNumber);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;
                    da.Fill(ds);

                    for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                    {
                        DAL_M_AttachmentData v = new DAL_M_AttachmentData();
                        v.ConfirmationNum = ds.Tables[0].Rows[i]["confirmationNum"].ToString();
                        v.AttachmentFileName = ds.Tables[0].Rows[i]["AttachmentFileName"].ToString();
                        v.DisplayName = ds.Tables[0].Rows[i]["DisplayName"].ToString();
                        v.UploadedDate = String.Format("{0:M/d/yyyy}", ds.Tables[0].Rows[i]["LastUpdateDateTime"]);
                        lst_DAL_M_AttachmentData.Add(v);
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                LogManager.log.Error("Error in GetAttachmentsData.  Message: " + ex.Message);
            }
            return lst_DAL_M_AttachmentData;
        }
    }
}