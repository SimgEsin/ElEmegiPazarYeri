using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.SalesSettings;

public sealed class GetMySalesSettingsQueryHandler : IRequestHandler<GetMySalesSettingsQuery, SalesSettingsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMySalesSettingsQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<SalesSettingsDto?> Handle(GetMySalesSettingsQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return null;
        }

        return await _dbContext.ArtisanSalesSettings
            .AsNoTracking()
            .Where(settings => settings.UserId == userId && !settings.IsDeleted)
            .Select(settings => new SalesSettingsDto
            {
                Id = settings.Id,
                CompanyTitle = settings.CompanyTitle,
                TaxNumber = settings.TaxNumber,
                TaxOffice = settings.TaxOffice,
                AccountHolder = settings.AccountHolder,
                Iban = settings.Iban,
                BankName = settings.BankName,
                ShippingCompany = settings.ShippingCompany
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}

public sealed class UpsertSalesSettingsCommandHandler : IRequestHandler<UpsertSalesSettingsCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UpsertSalesSettingsCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(UpsertSalesSettingsCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var dto = request.Settings;

        var settings = await _dbContext.ArtisanSalesSettings
            .FirstOrDefaultAsync(entity => entity.UserId == userId && !entity.IsDeleted, cancellationToken);

        if (settings is null)
        {
            settings = new ArtisanSalesSettings { UserId = userId };
            await _dbContext.ArtisanSalesSettings.AddAsync(settings, cancellationToken);
        }
        else
        {
            settings.UpdatedAt = DateTime.UtcNow;
        }

        settings.CompanyTitle = dto.CompanyTitle;
        settings.TaxNumber = dto.TaxNumber;
        settings.TaxOffice = dto.TaxOffice;
        settings.AccountHolder = dto.AccountHolder;
        settings.Iban = dto.Iban;
        settings.BankName = dto.BankName;
        settings.ShippingCompany = dto.ShippingCompany;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return settings.Id;
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
