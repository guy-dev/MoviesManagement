using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesManagement.Models;
using MoviesManagement.Repositories;
using WebApplication2.Models;

namespace MoviesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResevationController : Controller
    {
		private ResevationsRepository resevationsRepository;

	    public ResevationController(MovieContext movieContext)
	    {
		    resevationsRepository = new ResevationsRepository(movieContext);
	    }
	    [HttpPost("[action]")]
		public async Task<IActionResult> CreateResevation([FromBody]ShowSeats showSeats)
	    {
		    var userInfo = HttpContext.Session.Get("User");
		    User user = null;
		    if (userInfo != null)
		    {
				 user = Utils.Converter.Instance().ByteArrayToObject(userInfo) as User;
			}

		    showSeats.UserId = userInfo != null ? user.Id : (int?) null;
		    try
		    {
			    await resevationsRepository.AddResevationAsync(showSeats);

			}
			catch (Exception e)
		    {
			    var x = e.Message;
		    }
		    return Ok();
	    }
    }
}