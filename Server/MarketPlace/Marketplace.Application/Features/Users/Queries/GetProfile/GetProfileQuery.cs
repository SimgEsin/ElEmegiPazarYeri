using MediatR;

namespace Marketplace.Application.Features.Users.Queries.GetProfile;

public sealed record GetProfileQuery(Guid UserId) : IRequest<GetProfileDto?>;
