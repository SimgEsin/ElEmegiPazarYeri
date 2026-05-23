namespace Marketplace.Application.Features.ProductReports;

public sealed class ProductReportDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public Guid ProductId { get; init; }
    public string Reason { get; init; } = string.Empty;
    public string? Description { get; init; }
    public bool IsResolved { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public sealed class CreateProductReportDto
{
    public required Guid ProductId { get; init; }
    public required string Reason { get; init; }
    public string? Description { get; init; }
}

public sealed class UpdateProductReportDto
{
    public required Guid ProductId { get; init; }
    public required string Reason { get; init; }
    public string? Description { get; init; }
    public bool IsResolved { get; init; }
}
