using System.Linq.Expressions;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Features.Products.Queries.GetProductById;

internal static class ProductDetailsProjection
{
    public static readonly Expression<Func<Product, ProductDetailsDto>> Map = product => new ProductDetailsDto
    {
        Id = product.Id,
        ArtisanId = product.ArtisanId,
        ArtisanDisplayName = product.Artisan != null ? product.Artisan.FullName : null,
        ArtisanSlug = product.Artisan != null && product.Artisan.ArtisanProfile != null
            ? product.Artisan.ArtisanProfile.Slug
            : null,
        ArtisanCraft = product.Artisan != null && product.Artisan.ArtisanProfile != null
            ? product.Artisan.ArtisanProfile.Craft
            : null,
        ArtisanBio = product.Artisan != null && product.Artisan.ArtisanProfile != null
            ? product.Artisan.ArtisanProfile.Bio
            : null,
        ArtisanRatingAvg = product.Artisan != null && product.Artisan.ArtisanProfile != null
            ? product.Artisan.ArtisanProfile.RatingAvg
            : 0,
        ArtisanProductCount = product.Artisan != null && product.Artisan.ArtisanProfile != null
            ? product.Artisan.ArtisanProfile.ProductCount
            : 0,
        ArtisanAvatarUrl = product.Artisan != null ? product.Artisan.AvatarUrl : null,
        CategoryId = product.CategoryId,
        CategoryName = product.Category != null ? product.Category.Name : null,
        CategorySlug = product.Category != null ? product.Category.Slug : null,
        Slug = product.Slug,
        Name = product.Name,
        Summary = product.Summary,
        StoryTitle = product.StoryTitle,
        StoryContentHtml = product.StoryContentHtml,
        Quote = product.Quote,
        Material = product.Material,
        Technique = product.Technique,
        ProductionDurationText = product.ProductionDurationText,
        HandcraftDurationText = product.HandcraftDurationText,
        ProductionStepsText = product.ProductionStepsText,
        DeliveryInfoText = product.DeliveryInfoText,
        Price = product.Price,
        Stock = product.Stock,
        Status = product.Status,
        SalesMode = product.SalesMode,
        HeightText = product.HeightText,
        WidthText = product.WidthText,
        WeightText = product.WeightText,
        IsSoldOut = product.IsSoldOut,
        CreatedAt = product.CreatedAt,
        UpdatedAt = product.UpdatedAt,
        Images = product.ProductImages
            .Where(image => !image.IsDeleted)
            .OrderByDescending(image => image.Type == Domain.Enums.ProductImageType.Hero)
            .ThenBy(image => image.SortOrder)
            .Select(image => new ProductDetailsImageDto
            {
                Id = image.Id,
                Type = image.Type,
                Url = image.Url,
                AltText = image.AltText,
                SortOrder = image.SortOrder
            })
            .ToList(),
        Stories = product.ProductStories
            .Where(story => !story.IsDeleted)
            .OrderBy(story => story.SortOrder)
            .Select(story => new ProductDetailsStoryDto
            {
                Id = story.Id,
                Title = story.Title,
                ContentHtml = story.ContentHtml,
                ImageUrl = story.ImageUrl,
                SortOrder = story.SortOrder
            })
            .ToList(),
        ReviewAverage = product.ProductReviews.Where(review => !review.IsDeleted).Any()
            ? product.ProductReviews.Where(review => !review.IsDeleted).Average(review => review.Rating)
            : 0,
        ReviewCount = product.ProductReviews.Count(review => !review.IsDeleted)
    };
}
