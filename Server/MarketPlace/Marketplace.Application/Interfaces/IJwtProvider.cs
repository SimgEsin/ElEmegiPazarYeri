using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IJwtProvider
{
    string GenerateToken(AppUser user);
}
