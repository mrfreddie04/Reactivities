using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Domain;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
  public class TokenService
  {
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
      _config = config;
    }
    public string CreateToken(AppUser user) 
    {
      //Create Claims
      var claims = new List<Claim>()
      {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email)
      };

      //Create Security Key to sing the token
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));

      //Create Credentials
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

      //Describe token - add claims, expiration info
      var tokenDescriptor = new SecurityTokenDescriptor()
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(7),
        SigningCredentials = creds
      };

      var tokenHandler = new JwtSecurityTokenHandler();

      //create token object
      var token = tokenHandler.CreateToken(tokenDescriptor);

      //serialize token
      return tokenHandler.WriteToken(token);
    }
  }
}