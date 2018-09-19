using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesManagement.Repositories;
using WebApplication2.Models;

namespace TheatersManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TheatersController : ControllerBase
    {
	    private TheatersRepository theatersRepository;

	    public TheatersController(MovieContext movieContext)
	    {
			theatersRepository = new TheatersRepository(movieContext);
		}

	    [HttpGet("[action]")]
	    public async Task<List<Theater>> GetTheaters()
	    {
		    return await theatersRepository.GetTheaters();
	    }

	    [HttpPost("[action]")]
	    public async Task<Theater> AddTheater([FromBody] Theater theater)
	    {
		    var result = await theatersRepository.AddTheaterAsync(theater);
		    return result;
	    }

	    [HttpPut("[action]")]
	    public async Task UpdateTheater([FromBody] Theater theater)
	    {
		    await theatersRepository.UpdateTheaterAsync(theater);
	    }

	    [HttpDelete("[action]/{id}")]
	    public async Task DeleteTheater([FromRoute]int id)
	    {
		    await theatersRepository.DeleteTheaterAsync(id);
	    }
	}
}