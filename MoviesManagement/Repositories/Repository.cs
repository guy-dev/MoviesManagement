using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Models;

namespace MoviesManagement.Repositories
{
    public class Repository
    {
	    protected MovieContext MovieContext { get; set; }
	    public Repository(MovieContext movieContext)
	    {
			MovieContext = movieContext;
	    }
    }
}
