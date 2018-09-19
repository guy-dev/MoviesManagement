using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication2.Models;

namespace MoviesManagement.Models
{
    public class ShowSeats
    {
	    public int Id { get; set; }
	    public int ShowId { get; set; }
	    public int? UserId { get; set; }
	    public string SeatsId { get; set; }
	    public virtual Show Show { get; set; }
	    public virtual User User { get; set; }
    }
}
