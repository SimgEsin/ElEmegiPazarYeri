using MediatR;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;

namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileBySlug;

public sealed record GetArtisanProfileBySlugQuery(string Slug) : IRequest<ArtisanProfileDetailsDto?>;
