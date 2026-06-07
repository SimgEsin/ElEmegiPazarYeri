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

        var buyerNotification = new Notification
        {
            UserId = userId,
            Type = NotificationType.Order,
            Title = "Siparişiniz alındı",
            Description = $"{order.OrderNo} numaralı siparişiniz oluşturuldu.",
            TargetModule = "orders",
            TargetId = order.Id
        };
        await _dbContext.Notifications.AddAsync(buyerNotification, cancellationToken);

        if (firstArtisanId != userId)
        {
            var artisanNotification = new Notification
            {
                UserId = firstArtisanId,
                Type = NotificationType.Order,
                Title = "Yeni siparişiniz var",
                Description = $"{order.OrderNo} numaralı yeni bir sipariş aldınız.",
                TargetModule = "orders",
                TargetId = order.Id
            };
            await _dbContext.Notifications.AddAsync(artisanNotification, cancellationToken);
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

public sealed class RequestOrderCancellationCommandHandler : IRequestHandler<RequestOrderCancellationCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public RequestOrderCancellationCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RequestOrderCancellationCommand request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
        }

        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            throw new InvalidOperationException("Iptal nedeni bos olamaz.");
        }

        var order = await _dbContext.Orders
            .FirstOrDefaultAsync(
                entity => entity.Id == request.OrderId && entity.BuyerId == userId && !entity.IsDeleted,
                cancellationToken);

        if (order is null)
        {
            return false;
        }

        if (order.Status == OrderStatus.Delivered || order.Status == OrderStatus.Cancelled)
        {
            throw new InvalidOperationException("Bu siparis icin iptal talebi olusturulamaz.");
        }

        order.CancellationReason = request.Reason.Trim();
        order.CancellationRequestedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        if (order.ArtisanId != userId)
        {
            var artisanNotification = new Notification
            {
                UserId = order.ArtisanId,
                Type = NotificationType.Order,
                Title = "Iptal talebi alindi",
                Description = $"{order.OrderNo} numarali siparis icin iptal talebi olusturuldu.",
                TargetModule = "orders",
                TargetId = order.Id
            };
            await _dbContext.Notifications.AddAsync(artisanNotification, cancellationToken);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetArtisanOrdersQueryHandler : IRequestHandler<GetArtisanOrdersQuery, IReadOnlyList<ArtisanOrderDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetArtisanOrdersQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<ArtisanOrderDto>> Handle(GetArtisanOrdersQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
        }

        return await _dbContext.Orders
            .AsNoTracking()
            .Where(order => order.ArtisanId == userId && !order.IsDeleted)
            .OrderByDescending(order => order.OrderDate)
            .Select(order => new ArtisanOrderDto
            {
                Id = order.Id,
                OrderNo = order.OrderNo,
                CustomerName = order.Buyer != null ? order.Buyer.FullName : string.Empty,
                ProductName = order.OrderItems
                    .Where(item => !item.IsDeleted)
                    .Select(item => item.ProductNameSnapshot)
                    .FirstOrDefault() ?? string.Empty,
                Quantity = order.OrderItems
                    .Where(item => !item.IsDeleted)
                    .Sum(item => item.Quantity),
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                OrderDate = order.OrderDate,
                CancellationReason = order.CancellationReason,
                CancellationRequestedAt = order.CancellationRequestedAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UpdateOrderStatusCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
        }

        var order = await _dbContext.Orders
            .FirstOrDefaultAsync(
                entity => entity.Id == request.OrderId && entity.ArtisanId == userId && !entity.IsDeleted,
                cancellationToken);

        if (order is null)
        {
            return false;
        }

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;

        if (order.BuyerId != userId)
        {
            var buyerNotification = new Notification
            {
                UserId = order.BuyerId,
                Type = NotificationType.Order,
                Title = "Siparis durumu guncellendi",
                Description = $"{order.OrderNo} numarali siparisinizin durumu guncellendi.",
                TargetModule = "orders",
                TargetId = order.Id
            };
            await _dbContext.Notifications.AddAsync(buyerNotification, cancellationToken);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
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
                CancellationReason = order.CancellationReason,
                CancellationRequestedAt = order.CancellationRequestedAt,
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
