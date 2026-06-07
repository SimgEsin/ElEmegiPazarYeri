using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Admin;

public sealed class GetAdminOrdersQueryHandler : IRequestHandler<GetAdminOrdersQuery, IReadOnlyList<AdminOrderDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAdminOrdersQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<AdminOrderDto>> Handle(GetAdminOrdersQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Orders
            .AsNoTracking()
            .Where(order => !order.IsDeleted)
            .OrderByDescending(order => order.OrderDate)
            .Select(order => new AdminOrderDto
            {
                Id = order.Id,
                OrderNo = order.OrderNo,
                CustomerName = order.Buyer != null ? order.Buyer.FullName : string.Empty,
                ArtisanName = order.Artisan != null ? order.Artisan.FullName : string.Empty,
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
