using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class UserRole : BaseEntity
{
    public Guid UserId { get; set; }
    public Role Role { get; set; } = Role.Customer;

    public AppUser? User { get; set; }
}
