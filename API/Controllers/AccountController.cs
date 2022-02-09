using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;

namespace API.Controllers
{
  [ApiController]
  [AllowAnonymous]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ILogger<AccountController> _logger;
    private readonly TokenService _tokenService;

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ILogger<AccountController> logger,
        TokenService tokenService
    )
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _logger = logger;
      _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto) 
    {
      var user = await _userManager.FindByEmailAsync(loginDto.Email);

      if(user == null) return Unauthorized();

      var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
      
      if(result.Succeeded)
      {
        return Ok(CreateUserObject(user));    
      }
  
      return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
    {
      if(await _userManager.Users.AnyAsync( user => user.Email == registerDto.Email))
        return BadRequest("Email taken");

      if(await _userManager.Users.AnyAsync( user => user.UserName == registerDto.UserName))
        return BadRequest("UserName taken");        
      
      var user = new AppUser() {
        Email = registerDto.Email,
        DisplayName = registerDto.DisplayName,
        UserName = registerDto.UserName
      };

      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if(!result.Succeeded)
        return BadRequest("Problem registering user");

      return Ok(CreateUserObject(user));    
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()    
    {
      //We have access here to User property which is ClaimsPrincipal for the user associated with the executing action
      //We have acces to claims (Email, Id, UserName)
      var email = User.FindFirstValue(ClaimTypes.Email);
      var user = await _userManager.FindByEmailAsync(email);

      return Ok(CreateUserObject(user));      
    }

    private UserDto CreateUserObject(AppUser user)
    {
      return new UserDto(){
          DisplayName = user.DisplayName,
          UserName = user.UserName,
          Token = _tokenService.CreateToken(user),
          Image = null
      };
    }
  }
}