using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoviesManagement.Models;
using Remotion.Linq.Clauses;
using WebApplication2.Models;

namespace MoviesManagement.Repositories
{
    public class ResevationsRepository : Repository
    {
	    public ResevationsRepository(MovieContext movieContext) : base(movieContext)
	    {

	    }

	    public async Task AddResevationAsync(ShowSeats showSeats)
	    {
		    var updateShowSeats = MovieContext.ShowSeats.Count(c => c.UserId == showSeats.UserId) > 0;
		    if (updateShowSeats)
		    {
			    var userShowSeats = await MovieContext.ShowSeats.SingleOrDefaultAsync(c => c.UserId == showSeats.UserId);
			    userShowSeats.SeatsId += "," + showSeats.SeatsId;
		    }
		    else
		    {
			    await MovieContext.ShowSeats.AddAsync(showSeats);
			}		  
		    await MovieContext.SaveChangesAsync();
	    }

	    public async Task<List<string>> GetShowSeatsIds(int showId)
	    {
		    var showsList = await MovieContext.ShowSeats.Where(c => c.ShowId == showId).ToListAsync();
		    List <string> result = showsList.Select(c => c.SeatsId).ToList();
		    return result;
	    }
    }
}
