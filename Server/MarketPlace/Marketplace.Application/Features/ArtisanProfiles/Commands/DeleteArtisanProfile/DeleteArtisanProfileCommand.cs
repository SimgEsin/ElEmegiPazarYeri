using MediatR;

namespace Marketplace.Application.Features.ArtisanProfiles.Commands.DeleteArtisanProfile;

public sealed record DeleteArtisanProfileCommand(Guid Id) : IRequest<bool>;
