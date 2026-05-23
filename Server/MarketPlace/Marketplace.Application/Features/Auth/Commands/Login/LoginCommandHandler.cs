using MediatR;
using Marketplace.Application.Features.Auth;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponseDto>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly IJwtProvider _jwtProvider;

    public LoginCommandHandler(IMarketplaceDbContext dbContext, IJwtProvider jwtProvider)
    {
        _dbContext = dbContext;
        _jwtProvider = jwtProvider;
    }

    public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLower();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(user => user.Email.ToLower() == email, cancellationToken);

        if (user is null)
        {
            throw new InvalidOperationException("Kullanici bulunamadi.");
        }

        var passwordIsValid = PasswordHasher.VerifyPassword(request.Password, user.PasswordHash);

        if (!passwordIsValid)
        {
            throw new InvalidOperationException("Sifre hatali.");
        }

        var token = _jwtProvider.GenerateToken(user);

        return new LoginResponseDto(token);
    }
}
