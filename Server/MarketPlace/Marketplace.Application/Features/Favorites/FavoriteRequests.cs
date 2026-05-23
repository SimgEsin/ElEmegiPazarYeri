using MediatR;

namespace Marketplace.Application.Features.Favorites;

public sealed record CreateFavoriteCommand(CreateFavoriteDto Favorite) : IRequest<Guid>;
public sealed record UpdateFavoriteCommand(Guid Id, UpdateFavoriteDto Favorite) : IRequest<bool>;
public sealed record DeleteFavoriteCommand(Guid Id) : IRequest<bool>;
public sealed record GetAllFavoritesQuery : IRequest<IReadOnlyList<FavoriteDto>>;
public sealed record GetFavoriteByIdQuery(Guid Id) : IRequest<FavoriteDto?>;
