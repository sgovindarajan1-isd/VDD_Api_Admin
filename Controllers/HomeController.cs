using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAL;
using eCAPDDApi.Models;
using System.Net.Http;

namespace eCAPDDApi.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Index111()
        {
            ViewBag.Title = "Home Page";

            IEnumerable<VM_login> vmLogindata = null;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://localhost:44373/api/");

                //HTTP GET
                var responseTask = client.GetAsync("values");
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<IList<VM_login>>();
                    readTask.Wait();

                    vmLogindata = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..

                    vmLogindata = Enumerable.Empty<VM_login>();

                    ModelState.AddModelError(string.Empty, "Server error. Please contact administrator.");
                }
            }


            return View(vmLogindata);

            //--------------------------------------------------------------------------------------------------------------------------------

            //IEnumerable<SriniviewModel> sriniVwModeldata = null;

            //using (var client = new HttpClient())
            //{
            //    //Passing service base url  
            //    client.BaseAddress = new Uri("https://localhost:44373/");


            //    client.DefaultRequestHeaders.Clear();
            //    //Define request data format  
            //    //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //    //Sending request to find web api REST service resource GetAllEmployees using HttpClient  
            //    HttpResponseMessage Res = client.GetAsync("api/values/GetAllSriniData");

            //    if (Res.IsSuccessStatusCode)
            //    {
            //        //Storing the response details recieved from web api   
            //        var response = Res.Content.ReadAsStringAsync().Result;

            //        //Deserializing the response recieved from web api and storing into the Employee list  
            //        sriniVwModeldata = JsonConvert.DeserializeObject<List<SriniviewModel>>(response);

            //    }
            //    //returning the employee list to view  
            //    return View(sriniVwModeldata);

        }



        }
}
