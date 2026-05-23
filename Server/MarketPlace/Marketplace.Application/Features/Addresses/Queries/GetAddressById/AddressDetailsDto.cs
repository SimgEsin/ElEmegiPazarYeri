namespace Marketplace.Application.Features.Addresses.Queries.GetAddressById;

public sealed class AddressDetailsDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string Label { get; init; } = string.Empty;
    public string FullAddress { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string PostalCode { get; init; } = string.Empty;
    public bool IsDefault { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}
