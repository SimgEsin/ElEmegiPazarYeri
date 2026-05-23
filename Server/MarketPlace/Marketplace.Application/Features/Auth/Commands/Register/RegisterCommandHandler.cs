using MediatR;
using Marketplace.Application.Features.Auth;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Auth.Commands.Register;

public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResponseDto>
{
    private readonly IMarketplaceDbContext _dbContext;

    public RegisterCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RegisterResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLower();

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email bos olamaz.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            throw new ArgumentException("Sifre bos olamaz.");
        }

        var emailAlreadyExists = await _dbContext.Users
            .AnyAsync(user => user.Email.ToLower() == email, cancellationToken);

        if (emailAlreadyExists)
        {
            throw new InvalidOperationException("Bu email adresi ile kayitli bir kullanici zaten var.");
        }

        var user = new AppUser
        {
            Email = email,
            FullName = request.FullName.Trim(),
            Phone = request.Phone?.Trim() ?? string.Empty,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            IsActive = true,
            IsDeleted = false
        };

        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new RegisterResponseDto(user.Id, "Kullanici kaydi basariyla olusturuldu.");
    }
}
