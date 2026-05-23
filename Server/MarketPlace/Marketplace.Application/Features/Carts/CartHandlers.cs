using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Carts;

public sealed class GetMyCartQueryHandler : IRequestHandler<GetMyCartQuery, CartDto>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyCartQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<CartDto> Handle(GetMyCartQuery request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var cart = await _dbContext.Carts
            .AsNoTracking()
            .FirstOrDefaultAsync(entity => entity.UserId == userId && !entity.IsDeleted, cancellationToken);

        if (cart is null)
        {
            return new CartDto
            {
                Id = Guid.Empty,
                UserId = userId,
                Items = new List<CartItemDto>(),
                TotalPrice = 0
            };
        }

        var items = await _dbContext.CartItems
            .AsNoTracking()
            .Where(cartItem => cartItem.CartId == cart.Id && !cartItem.IsDeleted && !cartItem.Product!.IsDeleted)
            .OrderBy(cartItem => cartItem.CreatedAt)
            .Select(cartItem => new CartItemDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product!.Name,
                ImageUrl = cartItem.Product.ProductImages
                    .Where(image => !image.IsDeleted)
                    .OrderBy(image => image.SortOrder)
                    .Select(image => image.Url)
                    .FirstOrDefault(),
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.UnitPriceSnapshot,
                TotalPrice = cartItem.Quantity * cartItem.UnitPriceSnapshot
            })
            .ToListAsync(cancellationToken);

        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = items,
            TotalPrice = items.Sum(item => item.TotalPrice)
        };
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public AddToCartCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        if (request.Item.Quantity <= 0)
        {
            throw new InvalidOperationException("Adet 0'dan buyuk olmalidir.");
        }

        var product = await _dbContext.Products
            .FirstOrDefaultAsync(entity => entity.Id == request.Item.ProductId && !entity.IsDeleted, cancellationToken);

        if (product is null)
        {
            throw new InvalidOperationException("Urun bulunamadi.");
        }

        if (product.Stock < request.Item.Quantity)
        {
            throw new InvalidOperationException("Yetersiz Stok.");
        }

        var userId = GetCurrentUserId();

        var cart = await _dbContext.Carts
            .FirstOrDefaultAsync(entity => entity.UserId == userId && !entity.IsDeleted, cancellationToken);

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = userId
            };

            await _dbContext.Carts.AddAsync(cart, cancellationToken);
        }

        var existingItem = await _dbContext.CartItems
            .FirstOrDefaultAsync(
                entity => entity.CartId == cart.Id
                    && entity.ProductId == product.Id
                    && !entity.IsDeleted,
                cancellationToken);

        if (existingItem is not null)
        {
            var newQuantity = existingItem.Quantity + request.Item.Quantity;

            if (product.Stock < newQuantity)
            {
                throw new InvalidOperationException("Yetersiz Stok.");
            }

            existingItem.Quantity = newQuantity;
            existingItem.UnitPriceSnapshot = product.Price;
            existingItem.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return existingItem.Id;
        }

        var cartItem = new CartItem
        {
            CartId = cart.Id,
            ProductId = product.Id,
            Quantity = request.Item.Quantity,
            UnitPriceSnapshot = product.Price
        };

        await _dbContext.CartItems.AddAsync(cartItem, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return cartItem.Id;
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class RemoveFromCartCommandHandler : IRequestHandler<RemoveFromCartCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public RemoveFromCartCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var cartItem = await _dbContext.CartItems
            .Include(entity => entity.Cart)
            .FirstOrDefaultAsync(
                entity => entity.Id == request.CartItemId
                    && !entity.IsDeleted
                    && entity.Cart != null
                    && entity.Cart.UserId == userId
                    && !entity.Cart.IsDeleted,
                cancellationToken);

        if (cartItem is null)
        {
            return false;
        }

        cartItem.IsDeleted = true;
        cartItem.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}
