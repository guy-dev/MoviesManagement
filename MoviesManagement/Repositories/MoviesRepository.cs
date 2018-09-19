using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Owin.Security.Provider;
using WebApplication2.Models;

namespace MoviesManagement.Repositories
{
    public class MoviesRepository : Repository
    {
	    public MoviesRepository(MovieContext movieContext) : base(movieContext)
	    {
		    
	    }

	    public async Task<List<Movie>> GetMoviesAsync()
	    {
		    return await MovieContext.Movies.ToListAsync();
	    }

	    public async Task<Movie> GetMovieAsync(int id)
	    {
		    return await MovieContext.Movies.SingleOrDefaultAsync(c => c.Id == id);
	    }

	    public async Task<List<Movie>> GetPopularMoviesAsync()
	    {
		    var showSeats = await MovieContext.ShowSeats.ToListAsync();
		    var movies = await MovieContext.Movies.ToListAsync();
		    var shows = await MovieContext.Shows.ToListAsync();
		    var showIds = (from ss in showSeats
			    group ss by ss.ShowId
			    into g
			    orderby g.Count() descending select g.Key).Take(3).ToList();
		    var movieIds = (from show in showIds
			    join sh in shows
				    on show equals sh.Id
			    select sh.MovieId).ToList();
		    var result = await MovieContext.Movies.Where(c => movieIds.Contains(c.Id)).ToListAsync();
		    return result;
	    }

	    public async Task<List<Show>> GetMovieShowsAsync(int movieId)
	    {
		    var dateNow = DateTime.Now;
		    var movieShows = MovieContext.Shows.Include(c => c.Theater).Where(c => c.MovieId == movieId && c.MovieStartDate > dateNow);
		    return await movieShows.ToListAsync();
	    }

	    public async Task<Movie> AddMovieAsync(Movie movie)
	    {
		    await MovieContext.Movies.AddAsync(movie);
		    await MovieContext.SaveChangesAsync();
		    return await MovieContext.Movies.SingleOrDefaultAsync(c => c == movie);
	    }

	    public async Task UpdateMovieAsync(Movie movie)
	    {
		    MovieContext.Movies.Update(movie);
		    await MovieContext.SaveChangesAsync();
	    }

	    public async Task DeleteMovieAsync(int movieId)
	    {
		    var movie = await MovieContext.Movies.SingleOrDefaultAsync(c => c.Id == movieId);
		    MovieContext.Movies.Remove(movie);
		    await MovieContext.SaveChangesAsync();
	    }

	}
}
