using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication2.Models
{
	[Serializable]
    public class User
    {
	    public int Id { get; set; }
		[Required(ErrorMessage = "Username is required.")]
	    public string Username { get; set; }
	    [Required(ErrorMessage = "Password is required.")]
		public string Password { get; set; }
		public string FirstName { get; set; }
	    public string LastName { get; set; }
	    public bool Admin { get; set; }
    }
}
