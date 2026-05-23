using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Orders;

public sealed class CheckoutCartCommandHandler : IRequestHandler<CheckoutCartCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public CheckoutCartCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CheckoutCartCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var cart = await _dbContext.Carts
            .Include(entity => entity.CartItems)
            .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(entity => entity.UserId == userId && !entity.IsDeleted, cancellationToken);

        if (cart is null)
        {
            throw new InvalidOperationException("Sepetiniz bos.");
        }

        var cartItems = cart.CartItems
            .Where(item => !item.IsDeleted)
            .ToList();

        if (cartItems.Count == 0)
        {
            throw new InvalidOperationException("Sepetiniz bos.");
        }

        foreach (var cartItem in cartItems)
        {
            if (cartItem.Product is null || cartItem.Product.IsDeleted)
            {
                throw new InvalidOperationException("Sepetteki urun bulunamadi.");
            }

            if (cartItem.Product.Stock < cartItem.Quantity)
            {
                throw new InvalidOperationException("Yetersiz stok.");
            }
        }

        foreach (var cartItem in cartItems)
        {
            cartItem.Product!.Stock -= cartItem.Quantity;
            cartItem.Product.UpdatedAt = DateTime.UtcNow;
        }

        var totalPrice = cartItems.Sum(item => item.Quantity * item.UnitPriceSnapshot);
        var firstArtisanId = cartItems.First().Product!.ArtisanId;

        var order = new Order
        {
            OrderNo = CreateOrderNo(),
            BuyerId = userId,
            ArtisanId = firstArtisanId,
            OrderDate = DateTime.UtcNow,
            Source = "Cart",
            Status = OrderStatus.Pending,
            Subtotal = totalPrice,
            ShippingFee = 0,
            Total = totalPrice,
            TotalPrice = totalPrice,
            ContactPhone = string.Empty,
            OrderItems = cartItems.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                ProductNameSnapshot = item.Product!.Name,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPriceSnapshot,
                LineTotal = item.Quantity * item.UnitPriceSnapshot
            }).ToList()
        };

        await _dbContext.Orders.AddAsync(order, cancellationToken);

        foreach (var cartItem in cartItems)
        {
            cartItem.IsDeleted = true;
            cartItem.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return order.Id;
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }

    private static string CreateOrderNo()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";
    }
}

public sealed class GetMyOrdersQueryHandler : IRequestHandler<GetMyOrdersQuery, IReadOnlyList<OrderDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyOrdersQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<OrderDto>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        return await _dbContext.Orders
            .AsNoTracking()
            .Where(order => order.BuyerId == userId && !order.IsDeleted)
            .OrderByDescending(order => order.OrderDate)
            .Select(order => new OrderDto
            {
                Id = order.Id,
                OrderNo = order.OrderNo,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalPrice = order.TotalPrice,
                Items = order.OrderItems
                    .Where(item => !item.IsDeleted)
                    .Select(item => new OrderItemDto
                    {
                        Id = item.Id,
                        ProductId = item.ProductId,
                        ProductName = item.ProductNameSnapshot,
                        ImageUrl = item.Product!.ProductImages
                            .Where(image => !image.IsDeleted)
                            .OrderBy(image => image.SortOrder)
                            .Select(image => image.Url)
                            .FirstOrDefault(),
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        LineTotal = item.LineTotal
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
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
