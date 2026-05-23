using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Categories.Queries.GetAllCategories;

public sealed class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, IReadOnlyList<CategoryListDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllCategoriesQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CategoryListDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Categories
            .AsNoTracking()
            .Where(category => !category.IsDeleted)
            .OrderBy(category => category.Name)
            .Select(category => new CategoryListDto
            {
                Id = category.Id,
                Slug = category.Slug,
                Name = category.Name,
                Description = category.Description,
                Mood = category.Mood,
                ImageUrl = category.ImageUrl
            })
            .ToListAsync(cancellationToken);
    }
}
