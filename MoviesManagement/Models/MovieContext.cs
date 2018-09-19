using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MoviesManagement.Models;

namespace WebApplication2.Models
{
    public class MovieContext : DbContext
    {
	    public DbSet<Movie> Movies { get; set; }
	    public DbSet<User> Users { get; set; }
	    public DbSet<Show> Shows { get; set; }
	    public DbSet<Theater> Theaters { get; set; }
	    public DbSet<ShowSeats> ShowSeats { get; set; }

	    public MovieContext(DbContextOptions<MovieContext> options) : base(options)
	    {
	    }

	    protected override void OnModelCreating(ModelBuilder modelBuilder)
	    {
		   
	    }
		//protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		//{
		//	var connection = @"Data Source=(localdb)\ProjectsV13;AttachDbFilename=C:\Users\User\movies.mdf;Database=Movies; Trusted_Connection=Yes;";
		//	//	var connection = @"Data Source=tcp:moviesmanagement.database.windows.net,1433;Initial Catalog=movies;User ID=guyng;Password=Qweqwe123";
		//		optionsBuilder.UseSqlServer(connection);
		//}
	}
}
