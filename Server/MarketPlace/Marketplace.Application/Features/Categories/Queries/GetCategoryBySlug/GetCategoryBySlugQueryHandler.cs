using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Features.Categories.Queries.GetCategoryById;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Categories.Queries.GetCategoryBySlug;

public sealed class GetCategoryBySlugQueryHandler : IRequestHandler<GetCategoryBySlugQuery, CategoryDetailsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetCategoryBySlugQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CategoryDetailsDto?> Handle(GetCategoryBySlugQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Categories
            .AsNoTracking()
            .Where(category => category.Slug == request.Slug && !category.IsDeleted)
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
