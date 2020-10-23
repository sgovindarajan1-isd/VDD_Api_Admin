using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_AttachmentData
    {
        public string ConfirmationNum { get; set; }
        public string AttachmentFileName { get; set; }
        public string DisplayName { get; set; }
        public string AttachmentFilePath { get; set; }
        public string UploadedDate { get; set; }

    }
}