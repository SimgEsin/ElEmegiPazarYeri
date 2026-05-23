namespace Marketplace.Application.Features.Addresses.Commands.UpdateAddress;

public sealed class UpdateAddressDto
{
    public required string Label { get; init; }
    public required string FullAddress { get; init; }
    public required string City { get; init; }
    public required string PostalCode { get; init; }
    public bool IsDefault { get; init; }
}
