using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using safetyportal.Entities;
using safetyportal.Helpers;
using safetyportal.Models;
namespace safetyportal.Services
{
    public interface IUserService
    {
        IEnumerable<LoginCredentials> GetAllEmployees();
        LoginCredentials Authenticate(string username, string password);
        IEnumerable<LoginCredentials> GetAll();
        LoginCredentials GetById(int id);
    }

    public class UserService : IUserService
    {
        EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext db = new EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext();

        private List<LoginCredentials> _users;
        public IEnumerable<LoginCredentials> GetAllEmployees()
        {
            try
            {
                _users= db.LoginCredentials.ToList(); ;
                return db.LoginCredentials.ToList();
            }
            catch
            {
                throw;
            }
        }

        // users hardcoded for simplicity, store in a db with hashed passwords in production applications
        

        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public LoginCredentials Authenticate(string username, string password)
        {
            //GetAllEmployees();
            var user = _users.SingleOrDefault(x => x.Username == username && x.Password == password);

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            // remove password before returning
            user.Password = null;

            return user;
        }

        public IEnumerable<LoginCredentials> GetAll()
        {
            //GetAllEmployees();

            // return users without passwords
            return _users.Select(x => {
                x.Password = null;
                return x;
            });
        }

        public LoginCredentials GetById(int id)
        {
            //GetAllEmployees();

            var user = _users.FirstOrDefault(x => x.Id == id);

            // return user without password
            if (user != null)
                user.Password = null;

            return user;
        }
    }
}