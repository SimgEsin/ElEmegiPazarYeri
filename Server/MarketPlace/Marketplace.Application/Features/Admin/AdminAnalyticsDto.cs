namespace Marketplace.Application.Features.Admin;

public sealed class AdminAnalyticsDto
{
    public decimal TotalRevenue { get; init; }
    public int TotalOrders { get; init; }
    public int TotalProducts { get; init; }
    public int TotalArtisans { get; init; }
    public IReadOnlyList<CategoryShareDto> CategoryMix { get; init; } = new List<CategoryShareDto>();
}

public sealed class CategoryShareDto
{
    public string Name { get; init; } = string.Empty;
    public int ProductCount { get; init; }
    public int Percentage { get; init; }
}
