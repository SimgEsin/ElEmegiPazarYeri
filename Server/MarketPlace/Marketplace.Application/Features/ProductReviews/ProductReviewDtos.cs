namespace Marketplace.Application.Features.ProductReviews;

public sealed class ProductReviewDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string? UserFullName { get; init; }
    public string? UserAvatarUrl { get; init; }
    public Guid ProductId { get; init; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
    public bool IsVerifiedBuyer { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public sealed class CreateProductReviewDto
{
    public required Guid ProductId { get; init; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
}

public sealed class UpdateProductReviewDto
{
    public required Guid ProductId { get; init; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
}
