using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoviesManagement.Repositories;
using WebApplication2.Models;

namespace MoviesManagement.Repositories
{
	public class TheatersRepository : Repository
	{
		public TheatersRepository(MovieContext movieContext) : base(movieContext)
		{
			
		}
		public async Task<List<Theater>> GetTheaters()
		{
			return await MovieContext.Theaters.ToListAsync();
		}

		public async Task<Theater> AddTheaterAsync(Theater Theater)
		{
			await MovieContext.Theaters.AddAsync(Theater);
			await MovieContext.SaveChangesAsync();
			return await MovieContext.Theaters.SingleOrDefaultAsync(c => c == Theater);
		}

		public async Task UpdateTheaterAsync(Theater Theater)
		{
			MovieContext.Theaters.Update(Theater);
			await MovieContext.SaveChangesAsync();
		}

		public async Task DeleteTheaterAsync(int theaterId)
		{
			var theater = await MovieContext.Theaters.SingleOrDefaultAsync(c => c.Id == theaterId);
			MovieContext.Theaters.Remove(theater);
			await MovieContext.SaveChangesAsync();
		}
	}
}
