using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DAL.Models
{
    public class DAL_M_Notes
    {
        public int NotesId { get; set; }
        public string ConfirmationNumber { get; set; }
        public string NotesType { get; set; }
        public string Notes { get; set; }
    }
}