using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ProductStories;

public sealed class GetStoriesFeedQueryHandler : IRequestHandler<GetStoriesFeedQuery, IReadOnlyList<StoryFeedDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetStoriesFeedQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<StoryFeedDto>> Handle(GetStoriesFeedQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductStories
            .AsNoTracking()
            .Where(story => !story.IsDeleted
                && story.Product != null
                && !story.Product.IsDeleted
                && story.Product.Status == ProductStatus.Published)
            .OrderByDescending(story => story.CreatedAt)
            .Select(story => new StoryFeedDto
            {
                Id = story.Id,
                Title = story.Title,
                ContentHtml = story.ContentHtml,
                ImageUrl = story.ImageUrl,
                ProductId = story.ProductId,
                ProductName = story.Product!.Name,
                ProductSlug = story.Product.Slug,
                CategoryName = story.Product.Category != null ? story.Product.Category.Name : null,
                ArtisanDisplayName = _dbContext.ArtisanProfiles
                    .Where(profile => profile.UserId == story.Product.ArtisanId && !profile.IsDeleted)
                    .Select(profile => profile.DisplayName)
                    .FirstOrDefault(),
                SortOrder = story.SortOrder,
                CreatedAt = story.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
