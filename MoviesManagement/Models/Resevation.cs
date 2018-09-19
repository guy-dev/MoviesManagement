using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication2.Models
{
    public class Resevation
    {
	    public int Id { get; set; }
	    public int ShowId { get; set; }
	    public Show Show { get; set; }
	    public int TicketCount { get; set; }
	    public List<Seat> Seats { get; set; }

	    public DateTime Date { get; set; }

	    public int? UserId { get; set; }
    }
}
