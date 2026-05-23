using MediatR;

namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetAllArtisanProfiles;

public sealed record GetAllArtisanProfilesQuery : IRequest<IReadOnlyList<ArtisanProfileListDto>>;
