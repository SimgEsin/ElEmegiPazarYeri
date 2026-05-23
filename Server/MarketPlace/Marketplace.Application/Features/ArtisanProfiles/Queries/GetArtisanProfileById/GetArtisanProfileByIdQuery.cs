using MediatR;

namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;

public sealed record GetArtisanProfileByIdQuery(Guid Id) : IRequest<ArtisanProfileDetailsDto?>;
