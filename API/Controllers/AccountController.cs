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
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{
  [ApiController]  
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        TokenService tokenService,
        IConfiguration config
    )
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _tokenService = tokenService;
      _config = config;
      _httpClient = new HttpClient()
      {
        BaseAddress = new System.Uri("https://graph.facebook.com")
      };
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto) 
    {
      //var user = await _userManager.FindByEmailAsync(loginDto.Email);
      var user = await _userManager.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Email == loginDto.Email);

      if(user == null) return Unauthorized();

      var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
      
      if(!result.Succeeded)
        return Unauthorized();
      
      await SetRefreshToken(user);
      return Ok(CreateUserObject(user));          
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
    {
      if(await _userManager.Users.AnyAsync( user => user.Email == registerDto.Email)) 
      {
        ModelState.AddModelError("email","Email taken");
        return ValidationProblem();
      }

      if(await _userManager.Users.AnyAsync( user => user.UserName == registerDto.Username))
      {
        ModelState.AddModelError("username","Username taken");
        return ValidationProblem();     
      }     
      
      var user = new AppUser() {
        Email = registerDto.Email,
        DisplayName = registerDto.DisplayName,
        UserName = registerDto.Username
      };

      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if(!result.Succeeded)
        return BadRequest("Problem registering user");

      await SetRefreshToken(user);
      return Ok(CreateUserObject(user));    
    }

    [AllowAnonymous]
    [HttpPost("fblogin")]
    public async Task<ActionResult<UserDto>> FacebookLogin([FromQuery] string accessToken) 
    {
      // verify the token with FB
      var fbVerifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"] ;
      var verifyToken = await _httpClient.GetAsync($"/debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

      //check response
      if(!verifyToken.IsSuccessStatusCode) return Unauthorized();

      //get user's profile details
      var fbUrl = $"/me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";
      var response = await _httpClient.GetAsync(fbUrl);

      //check response
      if(!response.IsSuccessStatusCode) return Unauthorized();      

      //create a DYNAMIC object to store info returned by FB
      //of course, we could have also deserialize into a concrete class
      var fbInfo = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

      var username = (string)fbInfo.id;
      var user = await _userManager.Users
        .Include( u => u.Photos)
        .FirstOrDefaultAsync( user => user.UserName == username);
      if(user != null)
      {
        return Ok(CreateUserObject(user)); 
      }      

      user = new AppUser() 
      {
        Email =  (string)fbInfo.email,
        DisplayName = (string)fbInfo.name,
        UserName =  (string)fbInfo.id,
        Photos = new List<Photo>() 
        {
          new Photo() 
          {
            Id = "fb_" + (string)fbInfo.id,
            Url = (string)fbInfo.picture.data.url,
            IsMain = true
          }  
        }
      };

      var result = await _userManager.CreateAsync(user);

      if(!result.Succeeded)
        return BadRequest("Problem creating user account");      

      await SetRefreshToken(user);
      return Ok(CreateUserObject(user)); 
    }  

    [Authorize]
    [HttpPost("refresh-token")]  
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
      var refreshToken = Request.Cookies["refreshToken"];
      if(refreshToken == null) return Unauthorized("no refresh token");

      var username = User.FindFirstValue(ClaimTypes.Name);
      var user = await _userManager.Users
        .Include( t => t.RefreshTokens)
        .Include( u => u.Photos)
        .FirstOrDefaultAsync(u => u.UserName == username);

      if(user == null) return Unauthorized("no user");

      //check if refresh token is valid
      var oldToken = user.RefreshTokens.FirstOrDefault( t => t.Token == refreshToken);
      if( oldToken == null || !oldToken.IsActive) return Unauthorized("old token invalid");

      var userDto = CreateUserObject(user);
     
      return Ok(userDto); 
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()    
    {
      //We have access here to User property which is ClaimsPrincipal for the user associated with the executing action
      //We have access to claims (Email, Id, UserName)
      var email = User.FindFirstValue(ClaimTypes.Email);
      var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Email == email);

      //may want to remove it from here in prod mode
      await SetRefreshToken(user);
      return Ok(CreateUserObject(user));      
    }

    private async Task SetRefreshToken(AppUser user)
    {
      var refreshToken = _tokenService.GenerateRefreshToken();
      
      user.RefreshTokens.Add(refreshToken);
      await _userManager.UpdateAsync(user);

      var cookieOptions = new CookieOptions()
      {
        HttpOnly = true,
        Expires = DateTime.UtcNow.AddDays(7),
        IsEssential = true,
        SameSite = SameSiteMode.None,
        Secure = true        
      };
      
      Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
    }

    private UserDto CreateUserObject(AppUser user)
    {
      return new UserDto(){
        DisplayName = user.DisplayName,
        Username = user.UserName,
        Token = _tokenService.CreateToken(user),
        Image = user.Photos?.FirstOrDefault( p => p.IsMain)?.Url
      };
    }
  }
}