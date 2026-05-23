using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Categories.Queries.GetCategoryById;

public sealed class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDetailsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetCategoryByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CategoryDetailsDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Categories
            .AsNoTracking()
            .Where(category => category.Id == request.Id && !category.IsDeleted)
            .Select(category => new CategoryDetailsDto
            {
                Id = category.Id,
                Slug = category.Slug,
                Name = category.Name,
                Description = category.Description,
                Mood = category.Mood,
                ImageUrl = category.ImageUrl,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
