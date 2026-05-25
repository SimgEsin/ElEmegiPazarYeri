using MediatR;

namespace Marketplace.Application.Features.Users.Commands.UpdateProfile;

public sealed record UpdateProfileCommand(
    string FullName,
    string? PhoneNumber,
    DateTime? DateOfBirth,
    string? AvatarUrl) : IRequest<bool>;
