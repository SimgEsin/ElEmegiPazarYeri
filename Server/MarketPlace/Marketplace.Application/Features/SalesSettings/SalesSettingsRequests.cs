using MediatR;

namespace Marketplace.Application.Features.SalesSettings;

public sealed record GetMySalesSettingsQuery : IRequest<SalesSettingsDto?>;
public sealed record UpsertSalesSettingsCommand(UpsertSalesSettingsDto Settings) : IRequest<Guid>;
