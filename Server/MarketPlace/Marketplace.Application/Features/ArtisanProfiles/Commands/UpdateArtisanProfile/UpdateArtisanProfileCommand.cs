using MediatR;

namespace Marketplace.Application.Features.ArtisanProfiles.Commands.UpdateArtisanProfile;

public sealed record UpdateArtisanProfileCommand(Guid Id, UpdateArtisanProfileDto ArtisanProfile) : IRequest<bool>;
