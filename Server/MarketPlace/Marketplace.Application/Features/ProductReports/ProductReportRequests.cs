using MediatR;

namespace Marketplace.Application.Features.ProductReports;

public sealed record CreateProductReportCommand(CreateProductReportDto ProductReport) : IRequest<Guid>;
public sealed record UpdateProductReportCommand(Guid Id, UpdateProductReportDto ProductReport) : IRequest<bool>;
public sealed record DeleteProductReportCommand(Guid Id) : IRequest<bool>;
public sealed record GetAllProductReportsQuery : IRequest<IReadOnlyList<ProductReportDto>>;
public sealed record GetProductReportByIdQuery(Guid Id) : IRequest<ProductReportDto?>;
