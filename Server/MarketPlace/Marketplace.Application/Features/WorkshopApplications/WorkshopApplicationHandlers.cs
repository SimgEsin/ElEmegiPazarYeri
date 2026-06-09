using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Models;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.WorkshopApplications;

public sealed class CreateWorkshopApplicationCommandHandler : IRequestHandler<CreateWorkshopApplicationCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmailMessagePublisher _emailPublisher;

    public CreateWorkshopApplicationCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        IEmailMessagePublisher emailPublisher)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _emailPublisher = emailPublisher;
    }

    public async Task<Guid> Handle(CreateWorkshopApplicationCommand request, CancellationToken cancellationToken)
    {
        var dto = request.WorkshopApplication;
        var userId = GetCurrentUserId();

        var workshopApplication = new WorkshopApplication
        {
            UserId = userId,
            ArtisanProfileId = dto.ArtisanProfileId,
            Message = dto.Message,
            Status = "Pending"
        };

        await _dbContext.WorkshopApplications.AddAsync(workshopApplication, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var applicant = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Id == userId, cancellationToken);

        if (applicant is not null && !string.IsNullOrWhiteSpace(applicant.Email))
        {
            await _emailPublisher.PublishAsync(
                EmailTemplates.WorkshopApplicationReceived(applicant.Email, applicant.FullName),
                cancellationToken);
        }

        return workshopApplication.Id;
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

public sealed class UpdateWorkshopApplicationCommandHandler : IRequestHandler<UpdateWorkshopApplicationCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UpdateWorkshopApplicationCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateWorkshopApplicationCommand request, CancellationToken cancellationToken)
    {
        var workshopApplication = await _dbContext.WorkshopApplications
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (workshopApplication is null)
        {
            return false;
        }

        var dto = request.WorkshopApplication;

        workshopApplication.UserId = GetCurrentUserId();
        workshopApplication.ArtisanProfileId = dto.ArtisanProfileId;
        workshopApplication.Message = dto.Message;
        workshopApplication.Status = dto.Status;
        workshopApplication.UpdatedAt = DateTime.UtcNow;

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

public sealed class DeleteWorkshopApplicationCommandHandler : IRequestHandler<DeleteWorkshopApplicationCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public DeleteWorkshopApplicationCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteWorkshopApplicationCommand request, CancellationToken cancellationToken)
    {
        var workshopApplication = await _dbContext.WorkshopApplications
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (workshopApplication is null)
        {
            return false;
        }

        workshopApplication.IsDeleted = true;
        workshopApplication.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetAllWorkshopApplicationsQueryHandler : IRequestHandler<GetAllWorkshopApplicationsQuery, IReadOnlyList<WorkshopApplicationDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllWorkshopApplicationsQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<WorkshopApplicationDto>> Handle(GetAllWorkshopApplicationsQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.WorkshopApplications
            .AsNoTracking()
            .Where(workshopApplication => !workshopApplication.IsDeleted)
            .OrderByDescending(workshopApplication => workshopApplication.CreatedAt)
            .Select(workshopApplication => new WorkshopApplicationDto
            {
                Id = workshopApplication.Id,
                UserId = workshopApplication.UserId,
                ArtisanProfileId = workshopApplication.ArtisanProfileId,
                Message = workshopApplication.Message,
                Status = workshopApplication.Status,
                CreatedAt = workshopApplication.CreatedAt,
                UpdatedAt = workshopApplication.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class GetWorkshopApplicationByIdQueryHandler : IRequestHandler<GetWorkshopApplicationByIdQuery, WorkshopApplicationDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetWorkshopApplicationByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<WorkshopApplicationDto?> Handle(GetWorkshopApplicationByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.WorkshopApplications
            .AsNoTracking()
            .Where(workshopApplication => workshopApplication.Id == request.Id && !workshopApplication.IsDeleted)
            .Select(workshopApplication => new WorkshopApplicationDto
            {
                Id = workshopApplication.Id,
                UserId = workshopApplication.UserId,
                ArtisanProfileId = workshopApplication.ArtisanProfileId,
                Message = workshopApplication.Message,
                Status = workshopApplication.Status,
                CreatedAt = workshopApplication.CreatedAt,
                UpdatedAt = workshopApplication.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
