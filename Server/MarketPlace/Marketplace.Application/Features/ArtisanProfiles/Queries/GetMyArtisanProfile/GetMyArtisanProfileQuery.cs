using MediatR;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;

namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetMyArtisanProfile;

public sealed record GetMyArtisanProfileQuery : IRequest<ArtisanProfileDetailsDto?>;
