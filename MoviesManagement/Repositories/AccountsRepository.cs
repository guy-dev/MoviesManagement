using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Models;

namespace MoviesManagement.Repositories
{
    public class AccountsRepository : Repository
    {
	    public AccountsRepository(MovieContext movieContext) :base(movieContext)
	    {
		    
	    }
	    public async Task<List<User>> GetUsersAsync()
	    {
		    return await MovieContext.Users.ToListAsync();
	    }

	    public async Task<User> GetUserAsync(string userName)
	    {
		    return await MovieContext.Users.SingleOrDefaultAsync(c => c.Username == userName);
	    }

	    public async Task<bool> ValidateUserAsync(string userName,string password)
	    {
		    return await MovieContext.Users.SingleOrDefaultAsync(c => c.Username == userName && c.Password == password) != null;
	    }

	    public async Task<bool> UserExistAsync(string userName)
	    {
		    return userName != null && await MovieContext.Users.CountAsync(c => c.Username == userName) > 0;
	    }

	    public async Task AddUserAsync(User user)
	    {
		    await MovieContext.Users.AddAsync(user);
		    await MovieContext.SaveChangesAsync();
	    }
	}
}
