using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ProductReports;

public sealed class CreateProductReportCommandHandler : IRequestHandler<CreateProductReportCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public CreateProductReportCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateProductReportCommand request, CancellationToken cancellationToken)
    {
        var dto = request.ProductReport;

        var productReport = new ProductReport
        {
            UserId = GetCurrentUserId(),
            ProductId = dto.ProductId,
            Reason = dto.Reason,
            Description = dto.Description,
            IsResolved = false
        };

        await _dbContext.ProductReports.AddAsync(productReport, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return productReport.Id;
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

public sealed class UpdateProductReportCommandHandler : IRequestHandler<UpdateProductReportCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UpdateProductReportCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateProductReportCommand request, CancellationToken cancellationToken)
    {
        var productReport = await _dbContext.ProductReports
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productReport is null)
        {
            return false;
        }

        var dto = request.ProductReport;

        productReport.UserId = GetCurrentUserId();
        productReport.ProductId = dto.ProductId;
        productReport.Reason = dto.Reason;
        productReport.Description = dto.Description;
        productReport.IsResolved = dto.IsResolved;
        productReport.UpdatedAt = DateTime.UtcNow;

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

public sealed class DeleteProductReportCommandHandler : IRequestHandler<DeleteProductReportCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public DeleteProductReportCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteProductReportCommand request, CancellationToken cancellationToken)
    {
        var productReport = await _dbContext.ProductReports
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productReport is null)
        {
            return false;
        }

        productReport.IsDeleted = true;
        productReport.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetAllProductReportsQueryHandler : IRequestHandler<GetAllProductReportsQuery, IReadOnlyList<ProductReportDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllProductReportsQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ProductReportDto>> Handle(GetAllProductReportsQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductReports
            .AsNoTracking()
            .Where(productReport => !productReport.IsDeleted)
            .OrderByDescending(productReport => productReport.CreatedAt)
            .Select(productReport => new ProductReportDto
            {
                Id = productReport.Id,
                UserId = productReport.UserId,
                ProductId = productReport.ProductId,
                Reason = productReport.Reason,
                Description = productReport.Description,
                IsResolved = productReport.IsResolved,
                CreatedAt = productReport.CreatedAt,
                UpdatedAt = productReport.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class GetProductReportByIdQueryHandler : IRequestHandler<GetProductReportByIdQuery, ProductReportDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetProductReportByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductReportDto?> Handle(GetProductReportByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductReports
            .AsNoTracking()
            .Where(productReport => productReport.Id == request.Id && !productReport.IsDeleted)
            .Select(productReport => new ProductReportDto
            {
                Id = productReport.Id,
                UserId = productReport.UserId,
                ProductId = productReport.ProductId,
                Reason = productReport.Reason,
                Description = productReport.Description,
                IsResolved = productReport.IsResolved,
                CreatedAt = productReport.CreatedAt,
                UpdatedAt = productReport.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
