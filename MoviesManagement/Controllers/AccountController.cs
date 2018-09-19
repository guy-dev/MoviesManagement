using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesManagement.Repositories;
using MoviesManagement.Utils;
using WebApplication2.Models;

namespace MoviesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
	{
		private AccountsRepository accountsRepository;

		public AccountController(MovieContext movieContext)
		{
			accountsRepository = new AccountsRepository(movieContext);
		}

		[HttpPost("[action]")]
		public async Task<User> Login([FromBody]User userInfo)
		{
			if (await accountsRepository.ValidateUserAsync(userInfo.Username, HashGenerator.GenerateHash(userInfo.Password)))
			{
				var user = await accountsRepository.GetUserAsync(userInfo.Username);
				try
				{
					HttpContext.Session.Set("User", Converter.Instance().ObjectToByteArray(user));

				}
				catch (Exception e)
				{
					var x = e.Message;
				}

				return user;
			}
			return null;
		}

		[HttpPost("[action]")]
		public async Task<IActionResult> Register([FromBody]User userInfo)
		{
			if (userInfo == null || (userInfo != null && await accountsRepository.UserExistAsync(userInfo.Username)))
			{
				return BadRequest();
			}

			User result = null;
			userInfo.Password = HashGenerator.GenerateHash(userInfo.Password);
			await accountsRepository.AddUserAsync(userInfo);
			try
			{
				result = await accountsRepository.GetUserAsync(userInfo.Username);

			}
			catch (Exception e)
			{
				var x = e.Message;
			}

			if (result == null)
			{
				return BadRequest();
			}
			return Ok(result);
		}

		[HttpGet("[action]")]
		public async Task<IActionResult> SessionStatus()
		{
			var userInfo = HttpContext.Session.Get("User");
			if (userInfo == null)
			{
				return Ok(true);
			}
			else
			{
				return Ok(false);
			}
		}
	}
}