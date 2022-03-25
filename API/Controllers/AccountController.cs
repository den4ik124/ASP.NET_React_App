using API.DOTs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            this._tokenService = tokenService;
            this._signInManager = signInManager;
            this._userManager = userManager;
        }
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await this._userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized();
            var result = await this._signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded) return CreateUserObject(user);
            return Unauthorized();
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
                return BadRequest("Email taken");
            if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.UserName))
                return BadRequest("UserName taken");
            var user = new AppUser
            {
                UserName = registerDto.UserName,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
            }; 
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (result.Succeeded)
                return CreateUserObject(user);

            return BadRequest("Problem registering user");
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser(){
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                UserName = user.UserName,
                DisplayName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}