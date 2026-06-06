using MediatR;

namespace Marketplace.Application.Features.ProductReviews;

public sealed record CreateProductReviewCommand(CreateProductReviewDto ProductReview) : IRequest<Guid>;
public sealed record UpdateProductReviewCommand(Guid Id, UpdateProductReviewDto ProductReview) : IRequest<bool>;
public sealed record DeleteProductReviewCommand(Guid Id) : IRequest<bool>;
public sealed record GetAllProductReviewsQuery(Guid? ProductId = null) : IRequest<IReadOnlyList<ProductReviewDto>>;
public sealed record GetProductReviewByIdQuery(Guid Id) : IRequest<ProductReviewDto?>;
