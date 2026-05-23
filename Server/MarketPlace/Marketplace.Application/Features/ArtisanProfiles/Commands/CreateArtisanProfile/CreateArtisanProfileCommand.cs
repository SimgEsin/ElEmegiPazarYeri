using MediatR;

namespace Marketplace.Application.Features.ArtisanProfiles.Commands.CreateArtisanProfile;

public sealed record CreateArtisanProfileCommand(CreateArtisanProfileDto ArtisanProfile) : IRequest<Guid>;
