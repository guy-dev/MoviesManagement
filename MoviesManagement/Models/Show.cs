using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication2.Models
{
    public class Show
    {
	    public int Id { get; set; }
	    public int MovieId { get; set; }

		public Theater Theater { get; set; }
	    public int TheaterId { get; set; }
	    public DateTime MovieStartDate { get; set; }
    }
}
