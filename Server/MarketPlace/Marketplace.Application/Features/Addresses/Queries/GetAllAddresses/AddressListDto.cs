namespace Marketplace.Application.Features.Addresses.Queries.GetAllAddresses;

public sealed class AddressListDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string Label { get; init; } = string.Empty;
    public string FullAddress { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string PostalCode { get; init; } = string.Empty;
    public bool IsDefault { get; init; }
}
