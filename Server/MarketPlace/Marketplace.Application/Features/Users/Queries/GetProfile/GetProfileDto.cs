namespace Marketplace.Application.Features.Users.Queries.GetProfile;

public sealed record GetProfileDto(
    string FullName,
    string Email,
    string? PhoneNumber,
    DateTime? DateOfBirth,
    string? AvatarUrl,
    DateTime RegisterDate);
