using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
  public class RegisterDto
  {
    [Required]
    public string DisplayName { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string UserName { get; set; }
    
    [Required]   
    [RegularExpression("(?=^.{4,8}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$", ErrorMessage = "Password must be complex")] 
    public string Password { get; set; }      
  }
}