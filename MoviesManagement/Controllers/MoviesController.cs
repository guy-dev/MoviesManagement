using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Session;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Net.Http.Headers;
using MoviesManagement.Repositories;
using WebApplication2.Models;

namespace MoviesManagement.Controllers
{
	class Item
	{
		public int value { get; set; }
		public string text { get; set; }
	}

    [Route("api/[controller]")]
    public class MoviesController : Controller
	{
		private MoviesRepository moviesRepository;
		private IHostingEnvironment _hostingEnvironment;
		private IMemoryCache _cache;

		public MoviesController(IHostingEnvironment environment, IMemoryCache memoryCache, MovieContext movieContext)
		{
			_hostingEnvironment = environment;
			_cache = memoryCache;
			moviesRepository = new MoviesRepository(movieContext);
		}
		[ResponseCache(VaryByHeader = "User-Agent", Duration = 10)]
		[HttpGet("[action]")]
		public async Task<List<Movie>> GetPopularMovies()
		{
			List<Movie> popularMovies = null;
			if (!_cache.TryGetValue("PopularMovies",out popularMovies))
			{
				DateTimeOffset lala = new DateTimeOffset(DateTime.Now.AddSeconds(60 * 5));
				popularMovies = moviesRepository.GetPopularMoviesAsync().Result;
				_cache.Set("PopularMovies", popularMovies, lala);
			}
			return popularMovies;
		}

		[HttpGet("[action]")]
		public async Task<List<Movie>> GetAllMovies()
		{
			var test = _hostingEnvironment.WebRootPath;
			var movies = await moviesRepository.GetMoviesAsync();
			return movies;
		}

		[HttpGet("[action]")]
		public Movie GetTest()
		{
			var movie = new Movie();
			movie.Description = "test!";
			movie.Director = "lala";
			movie.Duration = 20;
			return movie;
		}

		[HttpGet("[action]")]
		public async Task<Movie> GetMovie(int id)
		{
			var movie = await moviesRepository.GetMovieAsync(id);
			return movie;
		}

		[HttpGet("[action]")]
		public async Task<List<Show>> GetMovieShows(int id)
		{
			var movieShows = await moviesRepository.GetMovieShowsAsync(id);
			return movieShows;
		}

		[HttpPost]
		public void AddMovieImage()
		{
			var newFileName = string.Empty;

			if (HttpContext.Request.Form.Files != null)
			{
				var fileName = string.Empty;

				var movieId = string.Empty;

				var files = HttpContext.Request.Form.Files;

				foreach (var file in files)
				{
					if (file.Length > 0)
					{
						//Getting FileName
						movieId = ContentDispositionHeaderValue.Parse(file.ContentDisposition).Name.ToString();

						//Assigning Unique Filename (Guid)
						var myUniqueFileName = Convert.ToString(Guid.NewGuid());

						fileName = file.FileName;

						//Getting file Extension
						var FileExtension = Path.GetExtension(fileName);

						// concating  FileName + FileExtension
						newFileName = myUniqueFileName + FileExtension;

						// Combines two strings into a path.
						fileName = Path.Combine(_hostingEnvironment.WebRootPath, "images\\movies\\temp\\") + $@"\{movieId}{FileExtension}";

						// if you want to store path of folder in database

						using (FileStream fs = System.IO.File.Create(fileName))
						{
							file.CopyTo(fs);
							fs.Flush();
						}
					}
				}


			}
		}

		[HttpPut]
		public void UpdateMovieImage([FromBody]int movieId)
		{
			var fileNameSource = Path.Combine(_hostingEnvironment.WebRootPath, "images\\movies\\temp\\") + $@"\{movieId}.jpg";
			var fileNameDest = Path.Combine(_hostingEnvironment.WebRootPath, "images\\movies\\" + $@"\{movieId}.jpg");

			if (System.IO.File.Exists(fileNameDest))
			{
				System.IO.File.Delete(fileNameDest);
			}

			System.IO.File.Move(fileNameSource, fileNameDest);
		}

		[HttpPost("[action]")]
		public async Task<Movie> AddMovie([FromBody] Movie movie)
		{
			var result = await moviesRepository.AddMovieAsync(movie);
			return result;
		}

		[HttpPut("[action]")]
		public async Task UpdateMovie([FromBody] Movie movie)
		{
			await moviesRepository.UpdateMovieAsync(movie);
		}

		[HttpDelete("[action]/{id}")]
		public async Task DeleteMovie([FromRoute]int id)
		{
			await moviesRepository.DeleteMovieAsync(id);
		}
	}
}
