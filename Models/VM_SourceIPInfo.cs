using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace eCAPDDApi.Models
{
    public class VM_SourceIPInfo
    {
    

     //   [JsonProperty("continentCode")]
        public string ContinentCode { get; set; }

       // [JsonProperty("continentName")]
        public string ContinentName { get; set; }

      //  [JsonProperty("countryCode")]
        public string CountryCode { get; set; }

      //  [JsonProperty("countryName")]
        public string CountryName { get; set; }

     //   [JsonProperty("stateProvCode")]
        public string StateProvCode { get; set; }

     //   [JsonProperty("stateProv")]
        public string StateProv { get; set; }

     //   [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("source_IP")]
        public string Source_IP { get; set; }

        [JsonProperty("source_Location")] 
        public string Source_Location{ get; set; }

        [JsonProperty("source_Device")]
        public string Source_Device { get; set; }

        [JsonProperty("source_Host_Headers")]
        public string Source_Host_Headers { get; set; }

        [JsonProperty("sourceServerName")]
        public string SourceServerName { get; set; }

        [JsonProperty("source_User_Agent")]
        public string Source_User_Agent { get; set; }

    }

}