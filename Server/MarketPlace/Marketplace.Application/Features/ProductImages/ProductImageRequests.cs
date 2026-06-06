using MediatR;

namespace Marketplace.Application.Features.ProductImages;

public sealed record CreateProductImageCommand(CreateProductImageDto ProductImage) : IRequest<Guid>;
public sealed record UpdateProductImageCommand(Guid Id, UpdateProductImageDto ProductImage) : IRequest<bool>;
public sealed record DeleteProductImageCommand(Guid Id) : IRequest<bool>;
public sealed record GetAllProductImagesQuery(Guid? ProductId = null) : IRequest<IReadOnlyList<ProductImageDto>>;
public sealed record GetProductImageByIdQuery(Guid Id) : IRequest<ProductImageDto?>;
