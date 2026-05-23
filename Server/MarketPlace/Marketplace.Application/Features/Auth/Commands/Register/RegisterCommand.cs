using MediatR;

namespace Marketplace.Application.Features.Auth.Commands.Register;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string FullName,
    string? Phone) : IRequest<RegisterResponseDto>;
