using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesManagement.Repositories;
using WebApplication2.Models;

namespace MoviesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ShowsController : Controller
	{
	    private ShowsRepository showsRepository;
		private ResevationsRepository resevationsRepository;

		public ShowsController(MovieContext movieContext)
		{
			showsRepository = new ShowsRepository(movieContext);
			resevationsRepository = new ResevationsRepository(movieContext);
		}

		[HttpGet("[action]")]
		public async Task<IActionResult> GetShow(int id)
	    {
		    var show =  await showsRepository.GetShowById(id);
		    if (show != null)
		    {
			    return Ok(show);
		    }

		    return BadRequest();
	    }
		[HttpGet("[action]")]
		public async Task<IActionResult> GetBookedSeats(int id)
		{
				var bookedSeats  = await resevationsRepository.GetShowSeatsIds(id);
			if (bookedSeats != null && bookedSeats.Count > 0)
			{
				List<int> result = new List<int>();
				foreach (var bookedSeat in bookedSeats)
				{
					var seatArr = bookedSeat.Split(',');
					foreach (var seat in seatArr)
					{
						result.Add(int.Parse(seat));
					}
				}
		//		var result = sb.ToString();
				return Ok(result);
			}
			return BadRequest();
		}
		


	}
}