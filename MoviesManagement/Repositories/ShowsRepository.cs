using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Models;

namespace MoviesManagement.Repositories
{
    public class ShowsRepository : Repository
    {
	    public ShowsRepository(MovieContext movieContext) :base(movieContext)
	    {
		    
	    }
	    public async Task<Show> GetShowById(int showId)
	    {
		    return await MovieContext.Shows.Include(c => c.Theater).SingleOrDefaultAsync(c => c.Id == showId);
	    }
	}
}
