using MediatR;
using Domain;
using Persistence;
using System.Threading.Tasks;
using System.Threading;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Application.Errors;
using System.Net;
using Application.Interfaces;

namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {

            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _singInManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> singInManager,IJwtGenerator jwtGenerator)
            {
                _singInManager = singInManager;
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
            }

            

            public async Task<User> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if(user == null)                
                    throw new RestException(HttpStatusCode.Unauthorized);

                var result = await _singInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if(result.Succeeded)
                {
                    // TODO: generate token
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = null
                    };
                }

                throw new RestException(HttpStatusCode.Unauthorized);
                
            }
        }
    }
}