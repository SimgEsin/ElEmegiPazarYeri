namespace Marketplace.Application.Features.Auth.Commands.Register;

public sealed record RegisterResponseDto(
    Guid UserId,
    string Message);
