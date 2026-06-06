using MediatR;

namespace Marketplace.Application.Features.Follows;

public sealed record FollowArtisanCommand(Guid ArtisanProfileId) : IRequest<bool>;
public sealed record UnfollowArtisanCommand(Guid ArtisanProfileId) : IRequest<bool>;
public sealed record GetMyFollowingQuery : IRequest<IReadOnlyList<FollowedArtisanDto>>;
public sealed record IsFollowingQuery(Guid ArtisanProfileId) : IRequest<bool>;
