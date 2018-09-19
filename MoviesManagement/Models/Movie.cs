using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication2.Models
{
    public class Movie
    {
	    public int Id { get; set; }
	    public string Name { get; set; }
	    public string Director { get; set; }
	    public string Description { get; set; }

	    public int Duration { get; set; }

	    public string TrailerURL { get; set; }
	}
}
