using MediatR;

namespace Marketplace.Application.Features.Auth.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password) : IRequest<LoginResponseDto>;
